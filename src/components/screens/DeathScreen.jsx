import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import Typewriter from '../Typewriter';
import ASCIIArt from '../ASCIIArt';
import ScreenLayout from '../ScreenLayout';
import { playSound } from '../../utils/SoundManager';

const DEATH_VARIANTS = [
    {
        message: "You chose to respect international law.\n\nUnfortunately, you contracted cholera from the swamp that is Washington D.C.",
        cause: "CHOLERA (Political)"
    },
    {
        message: "You prioritized human rights over corporate profits.\n\nThe Beltway bacteria have claimed you.",
        cause: "CHOLERA (Career)"
    },
    {
        message: "You attempted to implement ethical foreign policy in America.\n\nMedical Examiner's Report: 'Death by acute cholera, complicated by terminal naïveté'",
        cause: "CHOLERA (Sarcastic)"
    },
    {
        message: "You chose diplomacy over domination.\n\nYour political career has dysentery. Actually no, it's cholera. It's always cholera for the ethical ones.",
        cause: "CHOLERA (Classic)"
    },
    {
        message: "You leaked evidence of war crimes to the press.\n\nCIA Award for Excellence in Journalism (Posthumous - Cause of death: Drowning in a puddle of cholera)",
        cause: "CHOLERA (Classified)"
    }
];

const SKULL_ART = `
      _______
     /       \\
    |  x   x  |
    |    ^    |
    |  \\___/  |
     \\_______/
`;

const DeathScreen = () => {
    const { state, dispatch } = useGame();
    const { persistence } = state;

    const [variant] = useState(() =>
        DEATH_VARIANTS[Math.floor(Math.random() * DEATH_VARIANTS.length)]
    );

    useEffect(() => {
        playSound('error');
        dispatch({ type: 'REGISTER_DEATH' });

        const handleKeyPress = () => {
            dispatch({ type: 'START_GAME' });
        };

        const timeout = setTimeout(() => {
            window.addEventListener('keydown', handleKeyPress);
        }, 2000);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [dispatch]);

    return (
        <ScreenLayout center>
            <div className="text-red-500 mb-2 scale-75 md:scale-100">
                <ASCIIArt art={SKULL_ART} />
            </div>

            <h1 className="text-4xl md:text-6xl mb-6 text-red-500 tracking-widest font-black italic" style={{ textShadow: '0 0 20px red' }}>
                YOU HAVE DIED
            </h1>

            <div className="border-2 border-red-500 bg-red-950/40 p-3 md:p-6 mb-8 text-sm md:text-base font-mono uppercase tracking-widest text-red-400 max-w-2xl w-full">
                <span className="opacity-60">GLOBAL TOLL:</span> <span className="font-bold">{persistence.choleraDeaths + 1}</span> PATRIOTS LOST TO CHOLERA
            </div>

            <div className="mb-8 max-w-2xl text-xl md:text-2xl min-h-[120px] leading-relaxed text-red-500/90 font-mono italic">
                <Typewriter
                    text={variant.message}
                    speed={30}
                />
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
                <button
                    onClick={() => {
                        playSound('type');
                        dispatch({ type: 'START_GAME' });
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        playSound('type');
                        dispatch({ type: 'START_GAME' });
                    }}
                    className="text-2xl px-12 py-4 border-red-500 hover:bg-red-500 text-white animate-pulse"
                >
                    [ LIBERATE AGAIN ]
                </button>
                <div className="text-xs opacity-50 uppercase font-mono">
                    OR PRESS ANY KEY
                </div>
            </div>
        </ScreenLayout>
    );
};

export default DeathScreen;
