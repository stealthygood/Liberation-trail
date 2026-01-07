import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import Typewriter from '../Typewriter';
import ASCIIArt from '../ASCIIArt';
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
        <div className="h-full flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 mb-4">
                <ASCIIArt art={SKULL_ART} />
            </div>

            <h1 className="text-4xl mb-4 text-red-500 tracking-widest" style={{ textShadow: '0 0 10px red' }}>
                YOU &nbsp;&nbsp;&nbsp; HAVE &nbsp;&nbsp;&nbsp; DIED
            </h1>

            <div className="border border-red-900 bg-red-950/20 p-4 mb-8 text-xs font-mono uppercase tracking-widest">
                Global Statistics: {persistence.choleraDeaths + 1} patriots have died of cholera in this workspace
            </div>

            <div className="mb-8 max-w-2xl text-xl min-h-[100px]">
                <Typewriter
                    text={variant.message}
                    speed={25}
                />
            </div>

            <div className="mt-8 blink-text opacity-50">
                [PRESS ANY KEY TO LIBERATE AGAIN]
            </div>
        </div>
    );
};

export default DeathScreen;
