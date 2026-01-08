import { useGame } from '../context/GameContext';
import { SCREENS, COUNTRIES } from '../utils/constants';

/**
 * Renders a progress bar using ASCII block characters
 * @param {number} value - Current value (0-100)
 * @param {number} maxBlocks - Number of block characters to display
 * @returns {string} ASCII progress bar
 */
const renderProgressBar = (value, maxBlocks = 10) => {
    const filledBlocks = Math.round((value / 100) * maxBlocks);
    const emptyBlocks = maxBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
};

/**
 * Formats treasury value as currency
 */
const formatTreasury = (value) => {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}B`;
    }
    return `$${value.toFixed(1)}M`;
};

/**
 * Persistent status bar showing all game resources in retro ASCII style
 */
const StatusBar = () => {
    const { state, dispatch } = useGame();
    const { stats, showStatusBar, currentScreen, selectedCountry, soundEnabled } = state;

    // Don't show on certain screens
    const hiddenScreens = [SCREENS.DISCLAIMER, SCREENS.TITLE, SCREENS.DEATH, SCREENS.VICTORY];
    if (!showStatusBar || hiddenScreens.includes(currentScreen)) {
        return null;
    }

    const countryData = COUNTRIES.find(c => c.id === selectedCountry) || COUNTRIES[0];

    return (
        <div className="status-bar">
            <div className="status-bar-simple">
                <div className="status-metric oil-counter">
                    <span className="metric-icon">🛢️</span>
                    <span className="metric-value">{stats.oil}B</span>
                </div>

                <div className="status-metric victory-progress">
                    <div className="metric-label">LIBERATION GOAL:</div>
                    <div className="victory-bar-container">
                        <div className="victory-bar-fill" style={{ width: `${Math.min(stats.oil, 100)}%` }}></div>
                    </div>
                </div>

                <button
                    className="sound-toggle-btn"
                    onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                    title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </button>
            </div>
            <style>{`
                .status-bar-simple {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                    background: rgba(0, 0, 0, 0.9);
                    border-bottom: 2px solid var(--color-phosphor);
                    font-family: var(--font-main);
                }
                .oil-counter {
                    font-size: 1.8rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .victory-progress {
                    flex: 1;
                    max-width: 300px;
                    margin-left: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .victory-bar-container {
                    width: 100%;
                    height: 12px;
                    border: 1px solid var(--color-phosphor);
                    background: rgba(0, 0, 0, 0.5);
                    position: relative;
                }
                .victory-bar-fill {
                    height: 100%;
                    background: var(--color-phosphor);
                    box-shadow: 0 0 10px var(--color-phosphor);
                    transition: width 0.5s ease-out;
                }
                .metric-label {
                    font-size: 0.7rem;
                    opacity: 0.8;
                    letter-spacing: 1px;
                }
                .sound-toggle-btn {
                    background: transparent;
                    border: 1px solid var(--color-phosphor);
                    color: var(--color-phosphor);
                    padding: 4px 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    width: auto;
                    margin: 0 0 0 15px;
                    box-shadow: none;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sound-toggle-btn:hover {
                    background: var(--color-phosphor);
                    color: #000;
                }
                @media (max-width: 600px) {
                    .oil-counter { font-size: 1.2rem; }
                    .victory-progress { max-width: 100px; margin-left: 10px; }
                    .sound-toggle-btn { padding: 2px 4px; font-size: 0.8rem; margin-left: 8px; }
                }
                @media (min-width: 1025px) {
                    .oil-counter { font-size: 2.2rem; }
                    .metric-label { font-size: 0.8rem; }
                }
            `}</style>
        </div>
    );
};

export default StatusBar;
