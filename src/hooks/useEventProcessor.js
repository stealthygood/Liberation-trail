import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { SCREENS } from '../utils/constants';
import { playSound } from '../utils/SoundManager';

const checkCholeraDeathRoll = (choleraRisk) => {
    if (choleraRisk >= 100) return true;
    if (choleraRisk <= 0) return false;
    return Math.random() * 100 < choleraRisk;
};

export const useEventProcessor = (onNavigate = null) => {
    const { state, dispatch } = useGame();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statsGained, setStatsGained] = useState(null);

    const processChoice = useCallback((option, eventTitle = "EVENT") => {
        if (isProcessing) return;
        setIsProcessing(true);
        playSound('type');

        // Apply stat effects
        if (option.effects) {
            dispatch({ type: 'MODIFY_STATS', payload: option.effects });
        }

        // Timeline progression
        if ((state.stats.eventCount + 1) % 3 === 0) {
            dispatch({ type: 'MODIFY_STATS', payload: { month: 1 } });
        }

        // Log to history
        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: eventTitle,
                choice: option.id || option.text,
                effects: option.effects
            }
        });

        const newCholeraRisk = state.stats.choleraRisk + (option.effects?.choleraRisk || 0);
        const newChaos = state.stats.chaos + (option.effects?.chaos || 0);

        // Ethical death check
        if (option.isEthical && checkCholeraDeathRoll(newCholeraRisk)) {
            playSound('error');
            dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            return;
        }

        const isProfitable = (option.effects?.oil > 0 || option.effects?.treasury > 0) && !option.isEthical;

        if (isProfitable) {
            setStatsGained(option.effects);
            return;
        }

        const newOil = state.stats.oil + (option.effects?.oil || 0);
        if (newOil >= 100) {
            playSound('success');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.VICTORY });
            }, 300);
            return;
        }

        // Determine next screen
        let nextScreen = option.miniGame || SCREENS.EVENT;
        const randomRoll = Math.random() * 100;

        if (!option.miniGame) {
            if (randomRoll < (10 + newChaos * 0.5)) {
                nextScreen = SCREENS.RANDOM_EVENT;
            } else if (randomRoll < 40) {
                const games = [SCREENS.REDACTION, SCREENS.PRESS_BRIEFING, SCREENS.DRONE_STRIKE, SCREENS.SUPER_PAC, SCREENS.SANCTIONS];
                nextScreen = games[Math.floor(Math.random() * games.length)];
            }
        }

        playSound('success');
        setTimeout(() => {
            if (onNavigate) onNavigate(nextScreen);
            else dispatch({ type: 'NAVIGATE', payload: nextScreen });
            setIsProcessing(false);
        }, 300);
    }, [isProcessing, dispatch, state.stats, onNavigate]);

    const completeCelebration = useCallback((nextScreenLogic) => {
        const gains = statsGained;
        setStatsGained(null);

        const newOil = state.stats.oil + (gains?.oil || 0);

        // Add delay before navigation to ensure celebration fully clears
        setTimeout(() => {
            if (newOil >= 100) {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.VICTORY });
            } else if (nextScreenLogic) {
                const next = nextScreenLogic();
                dispatch({ type: 'NAVIGATE', payload: next });
            } else {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
            }
            setIsProcessing(false);
        }, 100);
    }, [statsGained, state.stats.oil, dispatch]);

    return {
        isProcessing,
        setIsProcessing,
        statsGained,
        setStatsGained,
        processChoice,
        completeCelebration
    };
};
