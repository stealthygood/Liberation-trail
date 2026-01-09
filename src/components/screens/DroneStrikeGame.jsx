import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';
import MiniGameIntro from '../MiniGameIntro';
import ScreenLayout from '../ScreenLayout';
import { useMiniGame } from '../../hooks/useMiniGame';

const TARGET_TYPES = [
    { name: 'Insurgent Leader', confidence: 72, oil: 10, warCrimes: 1 },
    { name: 'Suspected Technical', confidence: 45, oil: 5, warCrimes: 2 },
    { name: 'Supply Convoy', confidence: 88, oil: 15, warCrimes: 1 },
    { name: 'Unidentified Gathering', confidence: 12, oil: 0, warCrimes: 5 },
    { name: 'Wedding Party (Intel Error?)', confidence: 5, oil: 0, warCrimes: 10 }
];

const DroneStrikeGame = () => {
    const { dispatch } = useGame();
    const [target] = useState(TARGET_TYPES[0]);
    const [confidence, setConfidence] = useState(target.confidence);
    const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
    const [status, setStatus] = useState('SCANNING...');
    const [gameOver, setGameOver] = useState(false);

    const {
        showIntro,
        setShowIntro,
        statsGained,
        completeMiniGame,
        handleCelebrationComplete
    } = useMiniGame();

    // Refs for animation
    const requestRef = useRef();

    const handleStrike = useCallback(() => {
        setGameOver(true);
        setStatus('MISSILE DEPLOYED - IMPACT IN 3... 2... 1...');
        playSound('type');

        setTimeout(() => {
            playSound('bomb');
            const impactSuccess = confidence > 40;

            if (impactSuccess) {
                setStatus('TARGET NEUTRALIZED');
                const gains = {
                    oil: target.oil,
                    warCrimes: target.warCrimes,
                    approval: target.warCrimes > 4 ? -10 : 5
                };
                completeMiniGame(gains);
            } else {
                setStatus('COLLATERAL DAMAGE CONFIRMED');
                dispatch({
                    type: 'MODIFY_STATS',
                    payload: {
                        warCrimes: target.warCrimes + 3,
                        approval: -15
                    }
                });
                setTimeout(() => {
                    dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
                }, 2000);
            }
        }, 2000);
    }, [confidence, target, dispatch, completeMiniGame]);

    const handleAbort = useCallback(() => {
        setGameOver(true);
        setStatus('MISSION ABORTED');
        playSound('select');

        dispatch({
            type: 'MODIFY_STATS',
            payload: {
                choleraRisk: 5 // Hesitation in liberation is risky!
            }
        });

        setTimeout(() => {
            dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
        }, 1500);
    }, [dispatch]);

    // Fluctuating confidence
    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setConfidence(() => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(0, Math.min(100, target.confidence + change));
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [gameOver, target.confidence]);

    // Handle keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver) return;
            if (e.code === 'Space') {
                handleStrike();
            } else if (e.code === 'Escape') {
                handleAbort();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, handleStrike, handleAbort]);

    // Crosshair movement simulation
    useEffect(() => {
        if (gameOver) return;
        const move = () => {
            setCrosshairPos({
                x: 50 + Math.sin(Date.now() / 1000) * 10,
                y: 50 + Math.cos(Date.now() / 1200) * 15
            });
            requestRef.current = requestAnimationFrame(move);
        };
        requestRef.current = requestAnimationFrame(move);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameOver]);

    return (
        <ScreenLayout center className="font-mono">
            <h2 className="text-xl mb-4 text-red-500 animate-pulse text-center">*** PREDATOR FEED - CLASSIFIED ***</h2>

            <div className="relative border-2 border-[var(--color-phosphor)] w-full max-w-[600px] aspect-video bg-black overflow-hidden bg-[radial-gradient(circle,rgba(0,50,0,0.4)_0%,rgba(0,0,0,1)_100%)]">
                {/* HUD Elements */}
                <div className="absolute top-2 left-2 text-[10px] opacity-70">
                    <div>LAT: 33.3152 N</div>
                    <div>LON: 44.3661 E</div>
                </div>

                <div className="absolute top-2 right-2 text-[10px] text-right">
                    <div className={confidence < 30 ? 'text-red-500 animate-blink' : ''}>
                        CONFIDENCE: {confidence}%
                    </div>
                    <div className="mt-1 text-[var(--color-phosphor-dim)]">{target.name}</div>
                </div>

                {/* Crosshair */}
                <div
                    className="absolute w-16 h-16 border-2 border-red-500 rounded-full"
                    style={{
                        left: `${crosshairPos.x}%`,
                        top: `${crosshairPos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500"></div>
                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-red-500"></div>
                </div>

                {/* Status Overlay */}
                <div className="absolute bottom-2 left-2 right-2 text-center bg-black/80 p-2 border border-[var(--color-phosphor-dim)]">
                    <div className="text-lg animate-pulse">{status}</div>
                </div>
            </div>

            {!gameOver && (
                <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-sm px-4">
                    <button
                        onClick={handleStrike}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            handleStrike();
                        }}
                        className="bg-red-900/40 border-red-500 hover:bg-red-500 text-white font-bold text-lg md:text-xl py-4"
                    >
                        [ ENGAGE TARGET ]
                    </button>
                    <button
                        onClick={handleAbort}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            handleAbort();
                        }}
                        className="border-[var(--color-phosphor-dim)] hover:border-[var(--color-phosphor)] opacity-60 text-base md:text-lg py-3"
                    >
                        [ ABORT MISSION ]
                    </button>
                </div>
            )}

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 0.5s infinite;
                }
            `}</style>
            {showIntro && (
                <MiniGameIntro
                    title="OPERATION: FREEDOM RAIN"
                    description="Unidentified targets detected. Some may be insurgents, others may be participants in local social gatherings. High-altitude precision is required to minimize civilian... awareness."
                    instruction="TAP [ENGAGE TARGET] WHEN CONFIDENCE IS HIGH. AVOID ABORTING MISSION IF POSSIBLE."
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

export default DroneStrikeGame;
