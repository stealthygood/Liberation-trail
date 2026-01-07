import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';

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
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState('SCANNING...');

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
                dispatch({
                    type: 'MODIFY_STATS',
                    payload: {
                        oil: target.oil,
                        warCrimes: target.warCrimes,
                        approval: target.warCrimes > 4 ? -10 : 5
                    }
                });
            } else {
                setStatus('COLLATERAL DAMAGE CONFIRMED');
                dispatch({
                    type: 'MODIFY_STATS',
                    payload: {
                        warCrimes: target.warCrimes + 3,
                        approval: -15
                    }
                });
            }

            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
            }, 2000);
        }, 2000);
    }, [confidence, target, dispatch]);

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
        <div className="h-full flex-col p-8 items-center justify-center font-mono">
            <h2 className="text-2xl mb-4 text-red-500 animate-pulse">*** PREDATOR FEED - CLASSIFIED ***</h2>

            <div className="relative border-4 border-[var(--color-phosphor)] w-[600px] h-[400px] bg-black overflow-hidden bg-[radial-gradient(circle,rgba(0,50,0,0.4)_0%,rgba(0,0,0,1)_100%)]">
                {/* HUD Elements */}
                <div className="absolute top-4 left-4 text-xs">
                    <div>LAT: 33.3152 N</div>
                    <div>LON: 44.3661 E</div>
                    <div>ALT: 15,000 FT</div>
                </div>

                <div className="absolute top-4 right-4 text-xs text-right">
                    <div>MODE: AGM-114K LETHAL</div>
                    <div className={confidence < 30 ? 'text-red-500 animate-blink' : ''}>
                        INTEL: {confidence}% CONFIDENCE
                    </div>
                    <div className="mt-2 text-[var(--color-phosphor-dim)]">TARGET: {target.name}</div>
                </div>

                {/* Crosshair */}
                <div
                    className="absolute w-20 h-20 border-2 border-red-500 rounded-full"
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
                <div className="absolute bottom-4 left-4 right-4 text-center bg-black/80 p-2 border border-[var(--color-phosphor-dim)]">
                    <div className="text-xl animate-pulse">{status}</div>
                </div>
            </div>

            {!gameOver && (
                <div className="mt-8 flex gap-12 text-lg">
                    <div className="animate-pulse">[SPACE] ENGAGE TARGET</div>
                    <div>[ESC] ABORT MISSION</div>
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
        </div>
    );
};

export default DroneStrikeGame;
