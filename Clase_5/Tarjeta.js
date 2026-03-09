class Tarjeta extends HTMLDivElement {
    constructor(props){
        this.title = props.title;
        this.description = props.description;
        this.score = props.score;
        this.releaseDate = props.date;
        this.imageSrc = props.src;

        this.render();
    }
    
    render(){

        this.$cover = document.createElement("div");
        
        this.$img = document.createElement("img");
        this.$img.src = this.imageSrc;
        
        this.$title = document.createElement("h1");
        this.$title.textContent = this.title;
        
        this.$hoverInfo = document.createElement("div");

        this.$infoTop = document.createElement("div");

        this.$date = document.createElement("div");
        this.$date.innerText = this.releaseDate;

        this.$score = document.createElement("div");
        this.$score.innerText = this.score;

        this.$description = document.createElement("h2");
        this.$description.textContent = this.description;

        this.appendChild(this.$cover);
        this.$cover.appendChild(this.$img);
        this.$cover.appendChild(this.$title);

        this.appendChild(this.$hoverInfo);

        this.$hoverInfo.appendChild(this.$infoTop);
            this.$infoTop.appendChild(this.$date);
            this.$infoTop.appendChild(this.$score);
        this.$hoverInfo.appendChild(this.$description);
    }
}

customElements.define("anime_card", Tarjeta);