import { useEffect } from 'react';
import ASCIIArt from '../ASCIIArt';
import Typewriter from '../Typewriter';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/SoundManager';
import ScreenLayout from '../ScreenLayout';

const TITLE_ART = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     L I B E R A T I O N   T R A I L                        ║
║     ═══════════════════════════════════                    ║
║                                                            ║
║     "Spreading Democracy™ Since 1953"                      ║
║                                                            ║
║          .   .                                             ║
║         /|\\ /|\\          _______                           ║
║        / | \\ | \\        |       |    *                     ║
║       |  |  |  |       |  OIL  |   * *                    ║
║       |__|__|__|       |_______|  * * *                   ║
║      /_________\\       /_______\\   * *                    ║
║                                                            ║
║     A Educational Game About Freedom*                      ║
║     *Terms and Oilgations May Apply                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`;

const TitleScreen = () => {
    const { dispatch } = useGame();

    useEffect(() => {
        const handleKeyPress = () => {
            playSound('type');
            dispatch({ type: 'START_GAME' });
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [dispatch]);

    return (
        <ScreenLayout center>
            <ASCIIArt art={TITLE_ART} />

            <div className="mt-8 text-center">
                <button
                    onClick={() => {
                        playSound('type');
                        dispatch({ type: 'START_GAME' });
                    }}
                    className="text-2xl px-12 py-4 animate-pulse"
                >
                    [ INITIATE LIBERATION ]
                </button>
                <div className="mt-4 text-xs opacity-50">
                    OR PRESS ANY KEY
                </div>
            </div>
        </ScreenLayout>
    );
};

export default TitleScreen;
