import { useState, useEffect } from 'react';
import { playSound } from '../utils/SoundManager';

const SPARKS = [
    "*", ".", "o", "O", "!", "+", "x", "X"
];

const MESSAGES = [
    "LIBERTY SECURED!",
    "OIL ACQUIRED!",
    "DEMOCRACY SPREAD!",
    "MISSION ACCOMPLISHED!",
    "FREEDOM REIGNS!",
    "PROFIT MARGINS UP!",
    "GOD BLESS CORPORATE!",
    "RESOURCES LIBERATED!"
];

const CelebrationOverlay = ({ statsGained, onComplete }) => {
    const [sparks] = useState(() =>
        Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            char: SPARKS[Math.floor(Math.random() * SPARKS.length)],
            delay: Math.random() * 0.5
        }))
    );
    const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    useEffect(() => {
        playSound('success');

        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="celebration-overlay celebration-shake">
            {sparks.map(spark => (
                <div
                    key={spark.id}
                    className="absolute text-xl pointer-events-none opacity-0"
                    style={{
                        top: `${spark.top}%`,
                        left: `${spark.left}%`,
                        animation: `firework-burst 0.6s ease-out ${spark.delay}s forwards`,
                        color: 'var(--color-phosphor)'
                    }}
                >
                    {spark.char}
                </div>
            ))}

            <div className="z-10 p-12 border-4 border-double border-[var(--color-phosphor)] bg-black shadow-[0_0_80px_rgba(51,255,51,0.6)] text-center max-w-[90vw] animate-in zoom-in duration-300">
                <h1 className="text-4xl md:text-6xl font-black mb-6 neon-text-pulse tracking-tighter italic uppercase">
                    {message}
                </h1>

                <div className="text-2xl md:text-3xl mb-6 font-mono text-[var(--color-phosphor)] animate-bounce">
                    FREEDOM INTENSIFIES! 🇺🇸🛢️
                </div>

                <div className="space-y-4 text-xl md:text-2xl font-mono border-t border-[var(--color-phosphor-dim)] pt-6 mt-6">
                    {statsGained.oil > 0 && (
                        <div className="text-green-400">+{statsGained.oil}B SECURED FOR THE FREE WORLD</div>
                    )}
                    {statsGained.treasury > 0 && (
                        <div className="text-yellow-400">+${statsGained.treasury}M LIBERATION FEE</div>
                    )}
                    {statsGained.approval > 0 && (
                        <div className="text-blue-400">+{statsGained.approval}% PATRIOTIC FEVER</div>
                    )}

                    {statsGained.fifaPrize && (
                        <div className="mt-8 p-4 border-4 border-yellow-500 text-yellow-500 font-black animate-pulse bg-white/5">
                            🏆 NATIONAL ACHIEVEMENT UNLOCKED 🏆
                            <br />
                            FIFA WORLD PEACE PRIZE AWARDED
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes firework-burst {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default CelebrationOverlay;
