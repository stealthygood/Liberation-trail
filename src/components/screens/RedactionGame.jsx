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
        <div className="h-full flex-col p-8 items-center justify-center">
            <div className="text-center mb-6">
                <h2 className="text-3xl mb-2 text-red-500 animate-pulse">*** REDACTION RUSH ***</h2>
                <p className="text-sm opacity-80 mb-4">CLICK THE WAR CRIMES BEFORE THE PRESS SEES THEM!</p>

                <div className="flex justify-between w-full max-w-2xl text-xs font-mono mb-2">
                    <span>TIME: {timer.toFixed(1)}s {timerBar}</span>
                    <span className={suspicion > 70 ? 'text-red-500' : ''}>
                        PRESS SUSPICION: {suspicionBar} {suspicion}%
                    </span>
                </div>
            </div>

            <div className="border border-[var(--color-phosphor)] p-6 max-w-2xl w-full font-mono text-lg bg-black/50 leading-loose relative overflow-hidden">
                {currentChunks.map((chunk) => {
                    const isRedacted = chunk.redacted;
                    const isSensitive = chunk.type === 'sensitive';

                    return (
                        <span
                            key={chunk.id}
                            onClick={() => handleRedact(chunk.id)}
                            className={`
                                transition-all duration-300 px-1 inline-block
                                ${!isRedacted && 'cursor-pointer hover:bg-[var(--color-phosphor)] hover:text-black'}
                                ${isRedacted ? 'bg-[var(--color-phosphor)] text-[var(--color-phosphor)] select-none' : ''}
                                ${isSensitive && !isRedacted && 'animate-blink text-red-400 font-bold'}
                            `}
                        >
                            {isRedacted ? '█'.repeat(chunk.content.length || 5) : chunk.content}
                        </span>
                    );
                })}

                {suspicion >= 100 && (
                    <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center text-3xl font-bold animate-pulse text-white">
                        LEAKED!
                    </div>
                )}
            </div>

            <div className="mt-8 flex gap-8 text-sm font-mono">
                <div>REDACTED: {redactedCount}/4</div>
                <div>LEAKED: {leakedCount}</div>
            </div>

            <div className="mt-8">
                <button
                    onClick={() => handleComplete(suspicion, leakedCount)}
                    className="border-2 border-[var(--color-phosphor)] px-6 py-2 hover:bg-[var(--color-phosphor)] hover:text-black transition-colors"
                >
                    SUBMIT FOR DECLASSIFICATION
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
