/**
 * SessionSummaryDialog.js
 * A gamified modal that pops up when a session is completed.
 * Shows congrats, stats, and a chart.
 */

class SessionSummaryDialog extends HTMLElement {
    constructor() {
        super();
        if (!document.getElementById("session-summary-dialog-styles")) {
            const style = document.createElement("style");
            style.id = "session-summary-dialog-styles";
            style.textContent = `
                session-summary-dialog dialog {
                    padding: 0;
                    border: none;
                    border-radius: var(--radius-card);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    background: transparent;
                    width: 95%;
                    max-width: 600px;
                    text-align: center;
                    overflow: hidden;
                    margin: auto;
                    animation: slideUp 0.4s ease-out;
                }
                
                session-summary-dialog dialog::backdrop {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }

                .summary-content {
                    background: var(--wii-white);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .summary-header {
                    background: #FFB74D;
                    color: white;
                    padding: var(--spacing-lg);
                    font-size: 1.5rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .summary-body {
                    padding: var(--spacing-lg);
                }

                .summary-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }

                .stat-box {
                    background: var(--wii-bg);
                    padding: var(--spacing-md) var(--spacing-sm);
                    border-radius: var(--radius-sm);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--wii-teal);
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: var(--wii-text-muted);
                    font-weight: bold;
                    margin-top: 5px;
                }

                .chart-wrapper {
                    margin-bottom: var(--spacing-lg);
                }

                .summary-actions {
                    padding: var(--spacing-md);
                    background: var(--wii-bg);
                    border-top: 1px solid #e0e0e0;
                }

                @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(50px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <dialog id="summary-dialog">
                <div class="summary-content">
                    <div class="summary-header">
                        ¡Entrenamiento Completado!
                    </div>
                    <div class="summary-body">
                        <p style="margin-bottom: 20px; font-size: 1.1rem; color: var(--wii-text-dark);">
                            ¡Excelente trabajo! Cada repetición cuenta.
                        </p>
                        
                        <div class="summary-stats">
                            <div class="stat-box">
                                <span>⏱️</span>
                                <div class="stat-value" id="sum-time">--</div>
                                <div class="stat-label">Minutos</div>
                            </div>
                            <div class="stat-box">
                                <span>🔥</span>
                                <div class="stat-value" id="sum-cals">--</div>
                                <div class="stat-label">Kcal (Est.)</div>
                            </div>
                            <div class="stat-box">
                                <span>💪</span>
                                <div class="stat-value" id="sum-vol">--</div>
                                <div class="stat-label">Volumen (kg)</div>
                            </div>
                        </div>

                        <div class="chart-wrapper">
                            <wii-chart id="sum-chart"></wii-chart>
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="wii-btn wii-btn-primary" id="btn-sum-close" style="width: 100%; max-width: 200px;">Continuar</button>
                    </div>
                </div>
            </dialog>
        `;

        this.querySelector('#btn-sum-close').addEventListener('click', () => {
            this.querySelector('dialog').close();
            this.dispatchEvent(new CustomEvent('summary-closed', { bubbles: true }));
        });
    }

    /**
     * @param {Object} currentSession 
     * @param {Array} history 
     */
    show(currentSession, history) {
        const totalVol = currentSession.stats.reduce((acc, ex) => acc + ex.sets.reduce((sak, set) => sak + (set.weight * set.reps), 0), 0);
        
        this.querySelector('#sum-time').textContent = currentSession.duration;
        this.querySelector('#sum-cals').textContent = currentSession.calories || 0;
        this.querySelector('#sum-vol').textContent = Math.round(totalVol);

        // Prepare chart data (e.g., volume progression over the last 5 sessions)
        // Sort history by date ascending for the chart
        const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
        const last5 = sortedHistory.slice(-5);
        
        const chartData = {
            labels: last5.map((s, i) => i === last5.length - 1 ? 'Hoy' : `Sesión ${i+1}`),
            datasets: [{
                label: 'Volumen (kg)',
                data: last5.map(s => s.stats.reduce((acc, ex) => acc + ex.sets.reduce((sak, set) => sak + (set.weight * set.reps), 0), 0)),
                borderColor: '#FFB74D',
                backgroundColor: 'rgba(255, 183, 77, 0.2)',
                fill: true,
                tension: 0.4
            }]
        };

        this.querySelector('#sum-chart').config = {
            type: 'line',
            title: 'Tu progreso reciente',
            data: chartData,
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { font: { size: 10 } } },
                    y: { ticks: { font: { size: 10 } } }
                }
            }
        };

        this.querySelector('dialog').showModal();
    }
}

customElements.define('session-summary-dialog', SessionSummaryDialog);
