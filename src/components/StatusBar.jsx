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
            {countryData && (
                <div className="country-card">
                    <span className="country-label">TARGET:</span>
                    <span className="country-name">{countryData.name}</span>
                    <span className="country-divider">│</span>
                    <span className="country-label">STATUS:</span>
                    <span className="country-status">{countryData.democracyScore}</span>
                </div>
            )}

            <div className="status-bar-content">
                {/* Row 1: Time and Global Perception */}
                <div className="status-row">
                    <span className="status-item">
                        <span className="status-label">TIMELINE:</span>
                        <span className="status-value">MONTH {stats.month}</span>
                    </span>
                    <span className="status-divider">│</span>
                    <span className="status-item">
                        <span className="status-label">APPROVAL:</span>
                        <span className="status-bar-visual">{renderProgressBar(stats.approval)}</span>
                        <span className="status-value">{stats.approval}%</span>
                    </span>
                </div>

                {/* Row 2: Resources and War Efforts */}
                <div className="status-row">
                    <span className="status-item">
                        <span className="status-label">OIL:</span>
                        <span className="status-bar-visual">{renderProgressBar(stats.oil)}</span>
                        <span className="status-value">{stats.oil}B</span>
                    </span>
                    <span className="status-divider">│</span>
                    <span className="status-item">
                        <span className="status-label">$$$:</span>
                        <span className="status-value treasury">{formatTreasury(stats.treasury)}</span>
                    </span>
                </div>

                {/* Row 3: Ethical Indicators */}
                <div className="status-row">
                    <span className="status-item">
                        <span className="status-label">WAR CRIMES:</span>
                        <span className="status-bar-visual classified">{renderProgressBar(Math.min(stats.warCrimes * 10, 100))}</span>
                        <span className="status-value classified">(classified)</span>
                    </span>
                    <span className="status-divider">│</span>
                    <span className="status-item">
                        <span className="status-label">CHAOS:</span>
                        <span className={`status-bar-visual ${stats.chaos > 70 ? 'dangerPulse' : ''}`}>
                            {renderProgressBar(stats.chaos)}
                        </span>
                        <span className={`status-value ${stats.chaos > 70 ? 'dangerPulse' : ''}`}>
                            {stats.chaos}%
                        </span>
                    </span>
                </div>

                {/* Row 4: The Joke and The Risk */}
                <div className="status-row">
                    <span className="status-item">
                        <span className="status-label">DEMOCRACY™:</span>
                        <span className="status-bar-visual dim">{renderProgressBar(stats.democracy)}</span>
                    </span>
                    <span className="status-divider">│</span>
                    <span className="status-item">
                        <span className="status-label cholera">CHOLERA RISK:</span>
                        <span className={`status-bar-visual ${stats.choleraRisk > 50 ? 'dangerPulse' : ''}`}>
                            {renderProgressBar(stats.choleraRisk)}
                        </span>
                        <span className={`status-value ${stats.choleraRisk > 50 ? 'dangerPulse' : ''}`}>
                            {stats.choleraRisk}%
                        </span>
                    </span>
                </div>
            </div>
            <style>{`
                .country-card {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    background: var(--color-phosphor);
                    color: #000;
                    font-weight: bold;
                    padding: 2px 8px;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }
                .country-label { opacity: 0.7; }
                .dangerPulse {
                    color: #ff3333;
                    text-shadow: 0 0 5px #ff3333;
                    animation: pulse-danger 1s infinite;
                }
                @keyframes pulse-danger {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default StatusBar;
