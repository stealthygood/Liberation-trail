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

            <div className="z-10 p-8 border-4 border-double border-[var(--color-phosphor)] bg-black shadow-[0_0_50px_rgba(51,255,51,0.5)]">
                <h1 className="text-6xl font-bold mb-4 neon-text-pulse tracking-tighter italic">
                    {message}
                </h1>

                <div className="text-3xl mb-4 font-mono">
                    GO AMERICA! 🇺🇸🛢️
                </div>

                <div className="space-y-2 text-2xl font-mono border-t border-[var(--color-phosphor-dim)] pt-4 mt-4">
                    {statsGained.oil > 0 && (
                        <div className="text-green-400">+{statsGained.oil}B BARRELS SECURED</div>
                    )}
                    {statsGained.treasury > 0 && (
                        <div className="text-yellow-400">+${statsGained.treasury}M DONATIONS</div>
                    )}
                    {statsGained.approval > 0 && (
                        <div className="text-blue-400">+{statsGained.approval}% PROPAGANDA SUCCESS</div>
                    )}
                    {statsGained.warCrimes > 0 && (
                        <div className="text-red-500 opacity-50">+HIDDEN PERFORMANCE MERIT</div>
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
