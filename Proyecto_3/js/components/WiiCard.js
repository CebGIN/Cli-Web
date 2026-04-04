/**
 * WiiCard.js
 * The foundational UI container component according to the design system.
 */

class WiiCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Enforce classes if not already present
        if (!this.classList.contains('wii-card-base')) {
            this.classList.add('wii-card-base');
        }
    }
}

customElements.define('wii-card', WiiCard);
