import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';

const DisclaimerScreen = () => {
    const { dispatch } = useGame();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                playSound('type');
                dispatch({ type: 'NAVIGATE', payload: SCREENS.TITLE });
            }
        };

        const timeout = setTimeout(() => {
            window.addEventListener('keydown', handleKeyPress);
        }, 500);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [dispatch]);

    return (
        <div className="h-full flex items-center justify-center p-4">
            <pre className="text-[var(--color-phosphor)] text-sm leading-relaxed whitespace-pre font-mono">
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
║                                                          ║
║  CONTROLS:                                               ║
║  • Arrow keys or 1-2-3 to select options                ║
║  • SPACE to skip text                                    ║
║  • ESC to flee to a non-extradition country             ║
║                                                          ║
║            [PRESS ENTER TO BEGIN LIBERATION]             ║
╚══════════════════════════════════════════════════════════╝`}
            </pre>
        </div>
    );
};

export default DisclaimerScreen;

