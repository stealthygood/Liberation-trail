import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';

const REPORT_TEMPLATE = `TOP SECRET // EYES ONLY
SUBJECT: AFTER-ACTION REPORT - OPERATION LIBERATION

The mission to liberate [COUNTRY] was a [SUCCESS]. Our 
forces encountered minimal {CIVILIAN CASUALTIES} while 
securing key [OIL FIELDS]. Reports of {WAR CRIMES} are 
entirely fabricated by [ENEMY PROPAGANDA]. We must 
suppress the allegations of {BRIBERY} involving 
[CORPORATE PARTNERS]. The use of {CHEMICAL WEAPONS} was 
authorized by {REDACTED}.

Status: [DEMOCRACY RESTORED]`;

// {SENSITIVE} = Must redact. Missing these increases leak risk/suspicion.
// [DECOY] = Should NOT redact. Redacting these increases suspicion.

const RedactionGame = () => {
    const { dispatch } = useGame();
    const [timer, setTimer] = useState(12);
    const [suspicion, setSuspicion] = useState(0);
    const [redactedCount, setRedactedCount] = useState(0);
    const [leakedCount] = useState(0); // setLeakedCount removed as it's not currently used
    const [gameOver, setGameOver] = useState(false);

    // Parse the report text into interactive chunks
    const chunks = useMemo(() => {
        const regex = /(\{.*?\}|\[.*?\])/g;
        return REPORT_TEMPLATE.split(regex).map((text, index) => {
            let type = 'neutral';
            let content = text;
            if (text.startsWith('{') && text.endsWith('}')) {
                type = 'sensitive';
                content = text.slice(1, -1);
            } else if (text.startsWith('[') && text.endsWith(']')) {
                type = 'decoy';
                content = text.slice(1, -1);
            }
            return { id: index, type, content, redacted: false };
        });
    }, []);

    const [currentChunks, setCurrentChunks] = useState(chunks);

    const handleComplete = useCallback((finalSuspicion, finalLeaked) => {
        if (gameOver) return;
        setGameOver(true);

        const isSuccess = finalSuspicion < 100 && finalLeaked < 3;

        // Apply stat changes based on performance
        const statChanges = {
            approval: isSuccess ? 5 : -15,
            warCrimes: finalLeaked > 0 ? finalLeaked : 0,
            choleraRisk: isSuccess ? 0 : 10
        };
        dispatch({ type: 'MODIFY_STATS', payload: statChanges });

        if (isSuccess) {
            playSound('success');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
            }, 1000);
        } else {
            playSound('error');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            }, 1000);
        }
    }, [gameOver, dispatch]);

    // Timer logic
    useEffect(() => {
        if (gameOver) return;

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => {
                    if (t <= 0.1) {
                        clearInterval(interval);
                        // Check for unredacted sensitive words at the end
                        const sensitiveLeft = currentChunks.filter(c => c.type === 'sensitive' && !c.redacted).length;
                        handleComplete(suspicion, leakedCount + sensitiveLeft);
                        return 0;
                    }
                    return t - 0.1;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [timer, gameOver, currentChunks, suspicion, leakedCount, handleComplete]);

    const handleRedact = (id) => {
        if (gameOver) return;

        setCurrentChunks(prev => prev.map(chunk => {
            if (chunk.id === id && !chunk.redacted) {
                playSound('type');

                if (chunk.type === 'sensitive') {
                    setRedactedCount(c => c + 1);
                } else if (chunk.type === 'decoy') {
                    setSuspicion(s => Math.min(100, s + 20)); // Redacting decoys is suspicious
                } else {
                    setSuspicion(s => Math.min(100, s + 5)); // Redacting random text is slightly suspicious
                }

                return { ...chunk, redacted: true };
            }
            return chunk;
        }));
    };

    // Calculate ASCII Progress Bar for timer
    const timerBar = useMemo(() => {
        const length = 20;
        const filled = Math.ceil((timer / 12) * length);
        return '[' + '█'.repeat(filled) + '░'.repeat(length - filled) + ']';
    }, [timer]);

    // Calculate Suspicion Bar
    const suspicionBar = useMemo(() => {
        const length = 10;
        const filled = Math.min(length, Math.ceil((suspicion / 100) * length));
        return '█'.repeat(filled) + '░'.repeat(length - filled);
    }, [suspicion]);

    return (
        <div className="h-full flex-col p-4 md:p-8 items-center justify-center">
            <div className="text-center mb-4">
                <h2 className="text-xl mb-1 text-red-500 animate-pulse font-bold tracking-tighter uppercase">*** REDACTION RUSH ***</h2>
                <p className="text-[10px] opacity-70 mb-2 uppercase">Tap to redact evidence before publication!</p>

                <div className="flex justify-between w-full max-w-lg text-[10px] font-mono mb-2 px-1">
                    <span>TIME: {timer.toFixed(1)}s</span>
                    <span className={suspicion > 70 ? 'text-red-500' : ''}>
                        SUSPICION: {suspicion}%
                    </span>
                </div>
            </div>

            <div className="border border-[var(--color-phosphor)] p-4 max-w-lg w-full font-mono text-sm bg-black/60 leading-relaxed relative overflow-hidden">
                {currentChunks.map((chunk) => {
                    const isRedacted = chunk.redacted;
                    const isSensitive = chunk.type === 'sensitive';

                    return (
                        <span
                            key={chunk.id}
                            onClick={() => handleRedact(chunk.id)}
                            className={`
                                transition-all duration-200 px-0.5 inline-block select-none
                                ${!isRedacted && 'cursor-pointer active:bg-[var(--color-phosphor)] active:text-black'}
                                ${isRedacted ? 'bg-[var(--color-phosphor)] text-[var(--color-phosphor)]' : ''}
                                ${isSensitive && !isRedacted && 'animate-blink text-red-400 font-bold'}
                            `}
                        >
                            {isRedacted ? '█'.repeat(chunk.content.length || 5) : chunk.content}
                        </span>
                    );
                })}

                {suspicion >= 100 && (
                    <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center text-2xl font-bold animate-pulse text-white uppercase">
                        LEAKED!
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-6 text-[10px] font-mono opacity-60">
                <span>REDACTED: {redactedCount}/4</span>
                <span>STATUS: {suspicion < 100 ? 'SECURE' : 'COMPROMISED'}</span>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => handleComplete(suspicion, leakedCount)}
                    className="border-2 border-[var(--color-phosphor)] px-6 py-3 font-bold uppercase text-sm"
                >
                    [ DECLASSIFY ]
                </button>
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; border-bottom: 2px solid transparent; }
                    50% { opacity: 0.7; border-bottom: 2px solid #ff3333; }
                }
                .animate-blink {
                    animation: blink 0.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default RedactionGame;
