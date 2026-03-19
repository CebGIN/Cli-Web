document.addEventListener('DOMContentLoaded', () => {
    const pokeCard = document.getElementById('pokemon-display');
    const searchBar = document.getElementById('guess-input');
    const feedbackMsg = document.getElementById('feedback-message');
    const gameModal = document.getElementById('game-modal');

    let currentPokemonName = "";
    let currentPokemonData = null;
    let currentSpeciesData = null;
    let currentEvolutionChain = [];

    async function fetchRandomPokemon() {
        try {
            feedbackMsg.textContent = "¿Quién es ese Pokémon?";
            feedbackMsg.style.color = "white";

            // Ocultar al Pokémon anterior inmediatamente
            pokeCard.setSilhouette(true); 

            const randomId = Math.floor(Math.random() * 151) + 1;
            
            // Primero el Pokémon básico
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            currentPokemonData = await response.json();
            currentPokemonName = currentPokemonData.name.toLowerCase();

            // Luego la especie para el flavor text y cadena evolutiva
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
            currentSpeciesData = await speciesResponse.json();

            // Buscar cadena evolutiva
            if (currentSpeciesData.evolution_chain) {
                const evoResponse = await fetch(currentSpeciesData.evolution_chain.url);
                const evoData = await evoResponse.json();
                currentEvolutionChain = parseEvolutions(evoData.chain);
            } else {
                currentEvolutionChain = [currentPokemonName];
            }

            pokeCard.data = currentPokemonData;
            searchBar.value = ""; 

        } catch (error) {
            console.error("Error cargando el Pokémon:", error);
            feedbackMsg.textContent = "Error de conexión con el PC de Bill";
        }
    }

    function getPokedexEntry() {
        if (!currentSpeciesData) return "Información no disponible.";
        // Busca el primer texto en español, si no, en inglés
        const esEntry = currentSpeciesData.flavor_text_entries.find(entry => entry.language.name === 'es');
        if (esEntry) return esEntry.flavor_text;
        
        const enEntry = currentSpeciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
        return enEntry ? enEntry.flavor_text : "Información no disponible.";
    }

    // Helper para extraer la línea evolutiva simple
    function parseEvolutions(chain) {
        let evos = [];
        let current = chain;
        while (current) {
            evos.push(current.species.name);
            current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
        }
        return evos;
    }

    function handleEndGame(isCorrect) {
        pokeCard.setSilhouette(false);
        const dexEntry = getPokedexEntry();
        
        const types = currentPokemonData.types.map(t => t.type.name);
        const abilities = currentPokemonData.abilities.map(a => a.ability.name);

        gameModal.show({
            isCorrect: isCorrect,
            pokemonName: currentPokemonName,
            imageSrc: currentPokemonData.sprites.other['official-artwork'].front_default,
            dexEntry: dexEntry,
            types: types,
            height: currentPokemonData.height,
            weight: currentPokemonData.weight,
            abilities: abilities,
            evolutions: currentEvolutionChain
        });

        if (isCorrect) {
            feedbackMsg.textContent = `¡Correcto! Es ${currentPokemonName.toUpperCase()}`;
            feedbackMsg.style.color = "#2ecc71";
        } else {
            feedbackMsg.textContent = "¡Te rendiste!";
            feedbackMsg.style.color = "#e74c3c";
        }
    }

    searchBar.addEventListener('search', (e) => {
        const guess = e.detail.toLowerCase().trim();
        if (!guess) return;

        if (guess === currentPokemonName) {
            handleEndGame(true);
        } else {
            feedbackMsg.textContent = "¡Incorrecto! Intenta de nuevo.";
            feedbackMsg.style.color = "#e74c3c";
        }
    });

    searchBar.addEventListener('resign', () => {
        handleEndGame(false);
    });

    gameModal.addEventListener('continue', () => {
        fetchRandomPokemon();
    });

    fetchRandomPokemon();
});