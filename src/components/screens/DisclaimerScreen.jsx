import { useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import ScreenLayout from '../ScreenLayout';

const DisclaimerScreen = () => {
    const { dispatch } = useGame();

    const proceed = useCallback(() => {
        playSound('type');
        dispatch({ type: 'START_GAME' });
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
        <ScreenLayout center>
            <div className="w-full overflow-x-auto px-2">
                <pre className="text-[var(--color-phosphor)] text-[10px] md:text-sm leading-relaxed whitespace-pre font-mono mb-8 inline-block">
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
            </div>

            <button
                onClick={proceed}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    proceed();
                }}
                className="text-xl md:text-2xl px-8 md:px-12 py-4 border-[var(--color-phosphor)] hover:bg-[var(--color-phosphor)] hover:text-black animate-pulse mt-8"
            >
                [ BEGIN LIBERATION ]
            </button>
        </ScreenLayout>
    );
};

export default DisclaimerScreen;

