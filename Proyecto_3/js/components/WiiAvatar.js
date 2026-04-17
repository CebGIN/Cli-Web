/**
 * WiiAvatar.js
 * A simple, game-like representation of the user.
 * Appearance can evolve based on level/XP.
 */

class WiiAvatar extends HTMLElement {
    constructor() {
        super();
        this._level = 1;
        this._xp = 0;
        this._nextLevelXp = 1000;

        if (!document.getElementById("wii-avatar-styles")) {
            const style = document.createElement("style");
            style.id = "wii-avatar-styles";
            style.textContent = `
                wii-avatar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .avatar-container {
                    width: 120px;
                    height: 120px;
                    background: var(--wii-white);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow-soft);
                    border: 4px solid var(--wii-teal-light);
                    overflow: hidden;
                    position: relative;
                }
                .avatar-svg {
                    width: 100%;
                    height: 100%;
                }
                .xp-bar-container {
                    width: 100%;
                    height: 12px;
                    background: var(--wii-white);
                    border-radius: var(--radius-pill);
                    box-shadow: var(--shadow-soft);
                    overflow: hidden;
                    border: 2px solid var(--wii-bg);
                }
                .xp-bar-fill {
                    height: 100%;
                    background: var(--wii-teal);
                    width: 0%;
                    transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .level-badge {
                    background: var(--wii-teal);
                    color: white;
                    padding: 2px 12px;
                    border-radius: var(--radius-pill);
                    font-weight: 800;
                    font-size: 0.9rem;
                    margin-top: -15px;
                    z-index: 2;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * @param {Number} xp Total Volume 
     */
    set xp(val) {
        this._xp = val;
        // Logic: Level 1 = 0, Level 2 = 1000, Level 3 = 3000, etc.
        // Simplified: Level = floor(sqrt(xp/250)) + 1
        this._level = Math.floor(Math.sqrt(this._xp / 250)) + 1;
        
        const currentLevelXp = Math.pow(this._level - 1, 2) * 250;
        const nextLevelXp = Math.pow(this._level, 2) * 250;
        this._progress = ((this._xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Simple procedural Mii-like face
        const color = this._level > 5 ? '#4DB6AC' : '#78909C'; // Changes at lvl 5
        
        this.innerHTML = `
            <div class="avatar-container">
                <svg class="avatar-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <!-- Body -->
                    <circle cx="50" cy="115" r="40" fill="${color}" opacity="0.3" />
                    <!-- Head -->
                    <circle cx="50" cy="45" r="30" fill="#FFE0B2" />
                    <!-- Eyes -->
                    <circle cx="40" cy="40" r="3" fill="#37474F" />
                    <circle cx="60" cy="40" r="3" fill="#37474F" />
                    <!-- Smile -->
                    <path d="M 40 55 Q 50 ${55 + (this._level > 3 ? 10 : 5)} 60 55" stroke="#37474F" stroke-width="2" fill="none" stroke-linecap="round" />
                    
                    ${this._level > 2 ? `<path d="M 30 25 L 70 25" stroke="${color}" stroke-width="8" stroke-linecap="round" />` : ''}
                </svg>
            </div>
            <div class="level-badge">Nivel ${this._level}</div>
            <div style="width: 100%; text-align: center; font-size: 0.75rem; color: var(--wii-text-muted); font-weight: bold;">
                ${Math.floor(this._xp)} XP
            </div>
            <div class="xp-bar-container">
                <div class="xp-bar-fill" style="width: ${this._progress || 0}%"></div>
            </div>
        `;
    }
}

customElements.define('wii-avatar', WiiAvatar);
