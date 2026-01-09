import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';
import MiniGameIntro from '../MiniGameIntro';
import ScreenLayout from '../ScreenLayout';
import { useMiniGame } from '../../hooks/useMiniGame';

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

const RedactionGame = () => {
    const { dispatch } = useGame();
    const [timer, setTimer] = useState(12);
    const [suspicion, setSuspicion] = useState(0);
    const [redactedCount, setRedactedCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const {
        showIntro,
        setShowIntro,
        statsGained,
        completeMiniGame,
        handleCelebrationComplete
    } = useMiniGame();

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

        const statChanges = {
            approval: isSuccess ? 10 : -15,
            warCrimes: finalLeaked > 0 ? finalLeaked : 0,
            choleraRisk: isSuccess ? 0 : 10
        };

        if (isSuccess) {
            playSound('success');
            completeMiniGame(statChanges);
        } else {
            playSound('error');
            dispatch({ type: 'MODIFY_STATS', payload: statChanges });
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            }, 1000);
        }
    }, [gameOver, dispatch, completeMiniGame]);

    useEffect(() => {
        if (gameOver || showIntro) return;

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => {
                    if (t <= 0.1) {
                        clearInterval(interval);
                        const sensitiveLeft = currentChunks.filter(c => c.type === 'sensitive' && !c.redacted).length;
                        handleComplete(suspicion, sensitiveLeft);
                        return 0;
                    }
                    return t - 0.1;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [timer, gameOver, currentChunks, suspicion, handleComplete, showIntro]);

    const handleRedact = (id) => {
        if (gameOver) return;

        setCurrentChunks(prev => prev.map(chunk => {
            if (chunk.id === id && !chunk.redacted) {
                playSound('type');

                if (chunk.type === 'sensitive') {
                    setRedactedCount(c => c + 1);
                } else if (chunk.type === 'decoy') {
                    setSuspicion(s => Math.min(100, s + 20));
                } else {
                    setSuspicion(s => Math.min(100, s + 5));
                }

                return { ...chunk, redacted: true };
            }
            return chunk;
        }));
    };

    return (
        <ScreenLayout>
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

            <div className="border border-[var(--color-phosphor)] p-3 md:p-4 max-w-lg w-full font-mono text-xs md:text-sm bg-black/60 leading-relaxed relative overflow-hidden mx-auto">
                {currentChunks.map((chunk) => {
                    const isRedacted = chunk.redacted;
                    const isSensitive = chunk.type === 'sensitive';

                    return (
                        <span
                            key={chunk.id}
                            onClick={() => handleRedact(chunk.id)}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                handleRedact(chunk.id);
                            }}
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

            <div className="mt-4 flex gap-6 text-[10px] font-mono opacity-60 justify-center">
                <span>REDACTED: {redactedCount}/4</span>
                <span>STATUS: {suspicion < 100 ? 'SECURE' : 'COMPROMISED'}</span>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={() => handleComplete(suspicion, currentChunks.filter(c => c.type === 'sensitive' && !c.redacted).length)}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        handleComplete(suspicion, currentChunks.filter(c => c.type === 'sensitive' && !c.redacted).length);
                    }}
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

            {showIntro && (
                <MiniGameIntro
                    title="OPERATION: INK BLOT"
                    description="The truth is a dangerous weapon in the hands of the public. Use our high-performance digital ink to ensure only the most inspiring narratives reach the press."
                    instruction="TAP SENSITIVE WORDS (IN RED) TO REDACT THEM. AVOID REDACTING DECOYS."
                    onComplete={() => setShowIntro(false)}
                />
            )}

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => handleCelebrationComplete(SCREENS.EVENT)}
                />
            )}
        </ScreenLayout>
    );
};

export default RedactionGame;
