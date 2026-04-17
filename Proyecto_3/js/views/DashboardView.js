/**
 * DashboardView.js
 * Main analytical view with charts and summaries.
 */

class DashboardView extends HTMLElement {
    constructor() {
        super();
        this._sessions = [];
        this._exercises = [];
        this._routines = [];

        if (!document.getElementById("dashboard-view-styles")) {
            const style = document.createElement("style");
            style.id = "dashboard-view-styles";
            style.textContent = `
                dashboard-view {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                .dashboard-summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }
                .summary-card {
                    text-align: center;
                    padding: var(--spacing-lg);
                }
                .summary-card h2 { color: var(--wii-teal); margin-bottom: 5px; font-size: 2.5rem; }
                .summary-card p { color: var(--wii-text-muted); font-size: 0.9rem; font-weight: bold; }

                .dashboard-charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                @media (max-width: 600px) {
                    .dashboard-charts-grid { grid-template-columns: 1fr; }
                }

                .recent-sessions-list {
                    margin-top: var(--spacing-xl);
                }

                .gamified-header {
                    display: grid;
                    grid-template-columns: 180px 1fr;
                    gap: var(--spacing-xl);
                    align-items: center;
                    margin-bottom: var(--spacing-xl);
                }

                @media (max-width: 600px) {
                    .gamified-header { grid-template-columns: 1fr; text-align: center; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    async connectedCallback() {
        this.innerHTML = `<loading-state text="Calculando resultados..."></loading-state>`;
        await this.loadData();
    }

    async loadData() {
        try {
            this._sessions = await window.dbService.getSessions();
            this._exercises = await window.dbService.getExercises();
            this._routines = await window.dbService.getRoutines();
            this.render();
        } catch (e) {
            this.innerHTML = `<error-state message="Error en Dashboard: ${e.message}"></error-state>`;
        }
    }

    render() {
        if (this._sessions.length === 0) {
            this.innerHTML = `
                <div class="logger-header">
                    <h1>¡Bienvenido a WebFit!</h1>
                    <p>Registra tu primer entrenamiento para activar el Dashboard.</p>
                </div>
                <div style="text-align:center; padding: 50px;">
                    <button class="wii-btn wii-btn-primary" onclick="window.switchView('session/new')">Iniciar Entrenamiento</button>
                </div>
            `;
            return;
        }

        // --- Data Aggregation ---
        
        // 1. Muscle Distribution
        const muscleCounts = {};
        this._sessions.forEach(s => {
            s.stats.forEach(stat => {
                const ex = this._exercises.find(e => e.id === stat.exerciseId);
                const muscle = ex ? ex.muscleGroup : 'Otros';
                muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
            });
        });

        // 2. Volume over time
        const volumeTimeline = this._sessions.map(s => {
            const vol = s.stats.reduce((acc, ex) => acc + ex.sets.reduce((sak, set) => sak + (set.weight * set.reps), 0), 0);
            return { date: new Date(s.date).toLocaleDateString(), volume: vol };
        }).reverse(); // Ascending dates

        // 3. Frequency (Last 7 days)
        const frequencyData = this.getFrequencyData();

        // 4. XP and Streak
        const totalXP = volumeTimeline.reduce((acc, v) => acc + v.volume, 0);

        this.innerHTML = `
            <div class="gamified-header">
                <wii-avatar id="user-avatar"></wii-avatar>
                <div>
                    <h1 class="wiifit-text" style="font-size: 2.5rem; margin-bottom: 5px;">¡Hola de nuevo!</h1>
                    <p style="color: var(--wii-text-muted); font-size: 1.1rem;">Tu progreso hoy se ve excelente.</p>
                </div>
            </div>

            <div class="dashboard-summary-grid">
                <wii-card class="summary-card">
                    <h2>${this._sessions.length}</h2>
                    <p>Sesiones Totales</p>
                </wii-card>
                <wii-card class="summary-card">
                    <h2>${this.calculateStreak()}</h2>
                    <p>Racha (Días)</p>
                </wii-card>
                <wii-card class="summary-card">
                    <h2 style="font-size: 1.5rem">${this.calculateFavoriteRoutine()}</h2>
                    <p>Rutina Favorita</p>
                </wii-card>
            </div>

            <div class="dashboard-charts-grid">
                <wii-chart id="chart-freq"></wii-chart>
                <wii-chart id="chart-muscles"></wii-chart>
                <wii-chart id="chart-volume"></wii-chart>
                <wii-chart id="chart-progress"></wii-chart>
            </div>
        `;

        this.querySelector('#user-avatar').xp = totalXP;
        this.initCharts(frequencyData, muscleCounts, volumeTimeline);
    }

    initCharts(frequencyData, muscleCounts, volumeTimeline) {
        // --- 1. Frequency (Bar) ---
        this.querySelector('#chart-freq').config = {
            type: 'bar',
            title: 'Frecuencia semanal',
            data: {
                labels: frequencyData.labels,
                datasets: [{
                    label: 'Entrenamientos',
                    data: frequencyData.values,
                    backgroundColor: '#80CBC4',
                    borderRadius: 5
                }]
            }
        };

        // --- 2. Muscle Distribution (Doughnut) ---
        this.querySelector('#chart-muscles').config = {
            type: 'doughnut',
            title: 'Distribución por grupo muscular',
            data: {
                labels: Object.keys(muscleCounts),
                datasets: [{
                    data: Object.values(muscleCounts),
                    backgroundColor: ['#4DB6AC', '#80CBC4', '#B2DFDB', '#26A69A', '#009688', '#00796B']
                }]
            }
        };

        // --- 3. Volume (Line) ---
        this.querySelector('#chart-volume').config = {
            type: 'line',
            title: 'Volumen total por sesión (kg)',
            data: {
                labels: volumeTimeline.map(v => v.date),
                datasets: [{
                    label: 'Suma de Peso × Reps',
                    data: volumeTimeline.map(v => v.volume),
                    borderColor: '#4DB6AC',
                    fill: true,
                    backgroundColor: 'rgba(77, 182, 172, 0.1)',
                    tension: 0.4
                }]
            }
        };

        // --- 4. Progression (Logic for a specific exercise) ---
        this.querySelector('#chart-progress').config = {
            type: 'line',
            title: 'Progreso de Intensidad',
            data: {
                labels: volumeTimeline.map(v => v.date),
                datasets: [{
                    label: 'Peso máximo registrado',
                    data: this._sessions.map(s => Math.max(...s.stats.flatMap(st => st.sets.map(se => se.weight)))).reverse(),
                    borderColor: '#FFB74D',
                    tension: 0.4
                }]
            }
        };
    }

    getFrequencyData() {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const values = new Array(7).fill(0);
        const last7 = [];
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7.push(d);
        }

        this._sessions.forEach(s => {
            const sDate = new Date(s.date);
            const idx = last7.findIndex(d => d.toDateString() === sDate.toDateString());
            if (idx !== -1) values[idx]++;
        });

        return { labels: last7.map(d => days[d.getDay()]), values };
    }

    calculateStreak() {
        if (this._sessions.length === 0) return 0;
        
        // Normalize unique dates
        const dates = [...new Set(this._sessions.map(s => 
            new Date(s.date).toISOString().split('T')[0]
        ))].sort().reverse();

        let streak = 0;
        let current = new Date();
        current.setHours(0,0,0,0);

        for (let i = 0; i < dates.length; i++) {
            const sessionDate = new Date(dates[i] + 'T00:00:00');
            const diff = (current - sessionDate) / (1000 * 60 * 60 * 24);

            if (diff === 0 || diff === 1) {
                streak++;
                current = sessionDate;
            } else if (diff > 1) {
                break;
            }
        }
        return streak;
    }

    calculateFavoriteRoutine() {
        if (this._sessions.length === 0) return 'N/A';
        const counts = {};
        this._sessions.forEach(s => counts[s.routineId] = (counts[s.routineId] || 0) + 1);
        const topId = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const routine = this._routines.find(r => r.id == topId);
        return routine ? routine.name : 'Varios';
    }
}

customElements.define('dashboard-view', DashboardView);
