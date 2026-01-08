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
    const { state } = useGame();
    const { stats, showStatusBar, currentScreen, selectedCountry } = state;

    // Don't show on certain screens
    const hiddenScreens = [SCREENS.DISCLAIMER, SCREENS.TITLE, SCREENS.DEATH, SCREENS.VICTORY];
    if (!showStatusBar || hiddenScreens.includes(currentScreen)) {
        return null;
    }

    const countryData = COUNTRIES.find(c => c.id === selectedCountry);

    return (
        <div className="status-bar">
            <div className="status-bar-simple">
                <div className="status-metric oil-counter">
                    <span className="metric-icon">🛢️</span>
                    <span className="metric-value">{stats.oil}B</span>
                </div>
                <div className="status-metric war-crimes-flicker">
                    <span className="metric-label">WAR CRIMES:</span>
                    <span className="metric-value classified">[CLASSIFIED]</span>
                </div>
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
                .war-crimes-flicker {
                    font-size: 0.8rem;
                    opacity: 0.8;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .war-crimes-flicker .metric-value {
                    animation: flicker 0.2s infinite;
                    color: #ffaa00;
                }
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @media (min-width: 1025px) {
                    .oil-counter { font-size: 2.2rem; }
                    .war-crimes-flicker { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default StatusBar;
