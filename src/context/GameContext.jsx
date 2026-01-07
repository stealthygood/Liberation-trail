import { createContext, useContext, useReducer, useEffect } from 'react';
import { SCREENS } from '../utils/constants';

const GameContext = createContext();

const LOCAL_STORAGE_KEY = 'liberation_trail_save_v1';

const getDefaultState = () => ({
    currentScreen: SCREENS.DISCLAIMER,
    playerRole: null,
    selectedCountry: null,
    stats: {
        oil: 0,              // 0-100 billions of barrels secured
        approval: 50,        // 0-100 domestic approval %
        treasury: 10,        // Millions in $$$ (bribes, Super PAC)
        warCrimes: 0,        // Hidden counter, revealed at end
        democracy: 0,        // Always 0 - that's the joke
        choleraRisk: 0,      // 0-100, random death check each turn
        eventCount: 0,
        chaos: 0,
        month: 1
    },
    // Persistent stats
    persistence: {
        choleraDeaths: 0,
        totalOilSecured: 0,
        unlockedRoles: ['DIPLOMAT', 'OPERATIVE', 'CONSULTANT', 'CONTRACTOR'],
        highScore: 0
    },
    history: [],
    soundEnabled: true,
    showStatusBar: false
});

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_PERSISTENCE':
            return { ...state, persistence: { ...state.persistence, ...action.payload } };
        case 'TOGGLE_SOUND':
            return { ...state, soundEnabled: !state.soundEnabled };
        case 'START_GAME': {
            const defaultState = getDefaultState();
            return {
                ...defaultState,
                persistence: state.persistence,
                soundEnabled: state.soundEnabled,
                currentScreen: SCREENS.ROLE_SELECT
            };
        }
        case 'SELECT_ROLE':
            return {
                ...state,
                playerRole: action.payload,
                currentScreen: SCREENS.COUNTRY_SELECT,
                showStatusBar: true
            };
        case 'SELECT_COUNTRY':
            return { ...state, selectedCountry: action.payload, currentScreen: SCREENS.INCOMING_TRANSMISSION };
        case 'NAVIGATE':
            return { ...state, currentScreen: action.payload };
        case 'MODIFY_STATS': {
            const newStats = { ...state.stats };
            Object.entries(action.payload).forEach(([key, delta]) => {
                if (key in newStats) {
                    const newValue = newStats[key] + delta;
                    if (['oil', 'approval', 'choleraRisk', 'chaos'].includes(key)) {
                        newStats[key] = Math.max(0, Math.min(100, newValue));
                    } else if (key === 'democracy') {
                        newStats[key] = 0;
                    } else {
                        newStats[key] = Math.max(0, newValue);
                    }
                }
            });
            newStats.eventCount = state.stats.eventCount + 1;
            return { ...state, stats: newStats };
        }
        case 'ADD_HISTORY':
            return { ...state, history: [...state.history, action.payload] };
        case 'REGISTER_DEATH':
            return {
                ...state,
                persistence: {
                    ...state.persistence,
                    choleraDeaths: state.persistence.choleraDeaths + 1
                }
            };
        case 'REGISTER_VICTORY':
            return {
                ...state,
                persistence: {
                    ...state.persistence,
                    totalOilSecured: state.persistence.totalOilSecured + state.stats.oil,
                    highScore: Math.max(state.persistence.highScore, state.stats.oil)
                }
            };
        case 'RESET_GAME': {
            const defaultState = getDefaultState();
            return {
                ...defaultState,
                persistence: {
                    ...state.persistence,
                    choleraDeaths: state.persistence.choleraDeaths + 1
                },
                soundEnabled: state.soundEnabled
            };
        }
        case 'SHOW_STATUS_BAR':
            return { ...state, showStatusBar: action.payload };
        default:
            return state;
    }
};

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, getDefaultState());

    // Load persistence on mount
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                dispatch({ type: 'LOAD_PERSISTENCE', payload: JSON.parse(saved) });
            } catch (e) {
                console.error("Failed to load save state", e);
            }
        }
    }, []);

    // Save persistence on change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.persistence));
    }, [state.persistence]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
