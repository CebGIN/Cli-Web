/**
 * WiiChart.js
 * A Web Component wrapper for Chart.js.
 * Configured with the WebFit Design System.
 */

class WiiChart extends HTMLElement {
    constructor() {
        super();
        this._chart = null;
        this._type = 'bar';
        this._data = null;
        this._options = {};

        if (!document.getElementById("wii-chart-styles")) {
            const style = document.createElement("style");
            style.id = "wii-chart-styles";
            style.textContent = `
                wii-chart {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    background: var(--wii-white);
                    border-radius: var(--radius-card);
                    padding: var(--spacing-md);
                    box-shadow: var(--shadow-soft);
                    margin-bottom: var(--spacing-md);
                }
                .chart-container {
                    position: relative;
                    height: 250px;
                    width: 100%;
                }
                .chart-title {
                    font-size: 1rem;
                    font-weight: 800;
                    margin-bottom: var(--spacing-md);
                    color: var(--wii-text-dark);
                    border-left: 4px solid var(--wii-teal);
                    padding-left: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initializes global Chart.js defaults if not already set.
     */
    static setupDefaults() {
        if (typeof Chart === 'undefined') return;
        
        // Match CSS variables
        const teal = '#4DB6AC';
        const textDark = '#37474F';
        const font = "'Nunito', sans-serif";

        Chart.defaults.font.family = font;
        Chart.defaults.color = textDark;
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        
        // Plugin Defaults
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(55, 71, 79, 0.9)';
        Chart.defaults.plugins.tooltip.cornerRadius = 10;
        Chart.defaults.plugins.tooltip.padding = 10;
    }

    set config(val) {
        this._type = val.type || 'bar';
        this._data = val.data || null;
        this._options = val.options || {};
        this._title = val.title || '';
        this.render();
    }

    connectedCallback() {
        WiiChart.setupDefaults();
        this.render();
    }

    render() {
        if (!this._data) return;

        this.innerHTML = `
            ${this._title ? `<div class="chart-title">${this._title}</div>` : ''}
            <div class="chart-container">
                <canvas></canvas>
            </div>
        `;

        const ctx = this.querySelector('canvas').getContext('2d');

        // Destroy old instance if re-rendering
        if (this._chart) this._chart.destroy();

        this._chart = new Chart(ctx, {
            type: this._type,
            data: this._data,
            options: {
                ...this._options,
                // Default Wii Colors if not specified in dataset
                plugins: {
                    legend: {
                        display: this._type !== 'line', // Minimalist for lines
                        position: 'bottom',
                    },
                    ...this._options.plugins
                }
            }
        });
    }

    disconnectedCallback() {
        if (this._chart) this._chart.destroy();
    }
}

customElements.define('wii-chart', WiiChart);
