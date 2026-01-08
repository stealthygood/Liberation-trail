import { useGame } from '../context/GameContext';
import { SCREENS, COUNTRIES } from '../utils/constants';

/**
 * Renders a progress bar using ASCII block characters
 * @param {number} value - Current value (0-100)
 * @param {number} maxBlocks - Number of block characters to display
 * @returns {string} ASCII progress bar
 */
const StatusBar = () => {
    const { state, dispatch } = useGame();
    const { stats, showStatusBar, currentScreen, soundEnabled } = state;

    // Don't show on certain screens
    const hiddenScreens = [SCREENS.DISCLAIMER, SCREENS.TITLE, SCREENS.DEATH, SCREENS.VICTORY];
    if (!showStatusBar || hiddenScreens.includes(currentScreen)) {
        return null;
    }

    return (
        <div className="status-bar">
            <div className="status-bar-simple">
                <div className="status-metric oil-counter" title="Oil Secured (Billions of Barrels)">
                    <span className="metric-icon" style={{ fontSize: '1.2em' }}>🛢️</span>
                    <span className="metric-value"><span className="opacity-60 text-xs mr-1">OIL:</span>{stats.oil}B</span>
                </div>

                <div className="status-metric victory-progress">
                    <div className="metric-label">GOAL: {stats.oil}/100B</div>
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
                .status-bar {
                    margin-bottom: 25px;
                }
                .status-bar-simple {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 15px;
                    background: rgba(0, 0, 0, 0.95);
                    border-bottom: 2px solid var(--color-phosphor);
                    font-family: var(--font-main);
                    gap: 15px;
                }
                .status-metric {
                    display: flex;
                    align-items: center;
                }
                .oil-counter {
                    font-size: 1.5rem;
                    font-weight: bold;
                    gap: 8px;
                    flex-shrink: 0;
                }
                .victory-progress {
                    flex: 1;
                    max-width: 400px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .victory-bar-container {
                    width: 100%;
                    height: 10px;
                    border: 1px solid var(--color-phosphor);
                    background: rgba(0, 0, 0, 0.5);
                    position: relative;
                }
                .victory-bar-fill {
                    height: 100%;
                    background: var(--color-phosphor);
                    box-shadow: 0 0 8px var(--color-phosphor);
                    transition: width 0.5s ease-out;
                }
                .metric-label {
                    font-size: 0.6rem;
                    opacity: 0.8;
                    letter-spacing: 1px;
                    line-height: 1;
                }
                .sound-toggle-btn {
                    background: transparent;
                    border: 1px solid var(--color-phosphor);
                    color: var(--color-phosphor);
                    padding: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .sound-toggle-btn:hover {
                    background: var(--color-phosphor);
                    color: #000;
                }
                @media (max-width: 480px) {
                    .status-bar-simple { padding: 6px 10px; gap: 8px; }
                    .oil-counter { font-size: 1.1rem; }
                    .victory-progress { max-width: 120px; }
                    .metric-label { font-size: 0.5rem; }
                    .sound-toggle-btn { width: 28px; height: 28px; font-size: 0.8rem; }
                }
                @media (min-width: 1025px) {
                    .oil-counter { font-size: 2rem; }
                    .metric-label { font-size: 0.75rem; }
                }
            `}</style>
        </div>
    );
};

export default StatusBar;
