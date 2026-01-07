import { useEffect } from 'react';
import ASCIIArt from '../ASCIIArt';
import Typewriter from '../Typewriter';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/SoundManager';

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
        <div className="flex-col items-center justify-center h-full w-full">
            <ASCIIArt art={TITLE_ART} />

            <div className="mt-4 text-center">
                <div className="blink-text" style={{ marginTop: '2rem' }}>
                    <Typewriter
                        text="[ PRESS ANY KEY TO LIBERATE ]"
                        speed={50}
                        className="text-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default TitleScreen;
