import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { setMuted, playSound } from '../utils/SoundManager';

const SoundToggle = () => {
    const { state, dispatch } = useGame();

    // Sync GameContext state to SoundManager whenever it changes
    useEffect(() => {
        setMuted(!state.soundEnabled);
    }, [state.soundEnabled]);

    const toggle = () => {
        dispatch({ type: 'TOGGLE_SOUND' });
        // Play a confirmation sound (if turning ON, checking !state is tricky because dispatch is async, 
        // but useEffect will handle the mute state. If we enable, we want a beep.)
        if (!state.soundEnabled) {
            // We can't rely on immediate mute update here, so we might need to force play or wait
            // But since useEffect runs after render, triggering playSound here might still be blocked by previous mute state?
            // Actually, let's just let the user toggle.
            setTimeout(() => playSound('type'), 50);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <button
                onClick={toggle}
                className={`
                    border-2 border-[var(--color-phosphor)] px-3 py-1 text-sm font-bold tracking-wider
                    hover:bg-[var(--color-phosphor)] hover:text-black transition-colors
                    ${!state.soundEnabled ? 'opacity-50' : 'opacity-100'}
                `}
            >
                [ SOUND: {state.soundEnabled ? 'ON' : 'OFF'} ]
            </button>
        </div>
    );
};

export default SoundToggle;
