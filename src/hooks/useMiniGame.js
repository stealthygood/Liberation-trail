import { useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { SCREENS } from '../utils/constants';

export const useMiniGame = () => {
    const { dispatch } = useGame();
    const [showIntro, setShowIntro] = useState(true);
    const [statsGained, setStatsGained] = useState(null);

    const completeMiniGame = useCallback((gains) => {
        dispatch({ type: 'MODIFY_STATS', payload: gains });
        setStatsGained(gains);
    }, [dispatch]);

    const handleCelebrationComplete = useCallback((nextScreen = SCREENS.EVENT) => {
        setStatsGained(null);
        dispatch({ type: 'NAVIGATE', payload: nextScreen });
    }, [dispatch]);

    return {
        showIntro,
        setShowIntro,
        statsGained,
        setStatsGained,
        completeMiniGame,
        handleCelebrationComplete
    };
};
