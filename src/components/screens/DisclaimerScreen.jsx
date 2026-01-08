import { useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';

const DisclaimerScreen = () => {
    const { dispatch } = useGame();

    const proceed = useCallback(() => {
        playSound('type');
        dispatch({ type: 'NAVIGATE', payload: SCREENS.COUNTRY_SELECT });
    }, [dispatch]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                proceed();
            }
        };

        const timeout = setTimeout(() => {
            window.addEventListener('keydown', handleKeyPress);
        }, 500);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [proceed]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <pre className="text-[var(--color-phosphor)] text-sm leading-relaxed whitespace-pre font-mono mb-8">
                {`╔══════════════════════════════════════════════════════════╗
║                   LIBERATION TRAIL                        ║
║            "Spreading Democracy™ Since 1953"              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  You are a STRATEGIC DEMOCRACY ADVISOR.                  ║
║                                                          ║
║  Your job: Identify oil-rich countries in need of       ║
║  "liberation" and guide U.S. foreign policy toward      ║
║  their... freedom.                                       ║
║                                                          ║
║  Make the right choices and you'll retire rich.         ║
║  Make the ETHICAL choices and... well...                ║
║                                                          ║
║  Let's just say cholera is endemic in Washington.       ║
╚══════════════════════════════════════════════════════════╝`}
            </pre>

            <button
                onClick={proceed}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    proceed();
                }}
                className="text-2xl px-12 py-4 border-[var(--color-phosphor)] hover:bg-[var(--color-phosphor)] hover:text-black animate-pulse mt-8"
            >
                [ BEGIN LIBERATION ]
            </button>
        </div>
    );
};

export default DisclaimerScreen;

