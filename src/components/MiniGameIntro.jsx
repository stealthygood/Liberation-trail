import { useState, useEffect } from 'react';
import { playSound } from '../utils/SoundManager';
import Typewriter from './Typewriter';

const MiniGameIntro = ({ title, description, instruction, onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        playSound('type');
    }, []);

    const handleStart = () => {
        setVisible(false);
        playSound('success');
        setTimeout(onComplete, 300);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-center p-6 bg-black/90 font-mono text-center">
            <div className="max-w-xl w-full border-4 border-[var(--color-phosphor)] p-8 bg-black shadow-[0_0_100px_rgba(51,255,51,0.2)]">
                <h2 className="text-3xl font-black mb-6 tracking-tighter uppercase text-yellow-500 animate-pulse">
                    *** MISSION BRIEFING ***
                </h2>

                <h3 className="text-2xl font-bold mb-4 text-[var(--color-phosphor)]">{title}</h3>

                <div className="mb-8 min-h-[60px] italic opacity-90 border-l-2 border-[var(--color-phosphor-dim)] pl-4 text-left">
                    <Typewriter text={description} speed={20} />
                </div>

                <div className="mb-8 p-4 bg-white/5 border border-[var(--color-phosphor-dim)]">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">OPERATIONAL INSTRUCTIONS</p>
                    <p className="text-lg">{instruction}</p>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full text-2xl py-4 font-black hover:bg-[var(--color-phosphor)] hover:text-black transition-all"
                >
                    [ COMMENCE LIBERATION ]
                </button>
            </div>
        </div>
    );
};

export default MiniGameIntro;
