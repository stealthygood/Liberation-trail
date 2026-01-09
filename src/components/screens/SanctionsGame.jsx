import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';
import MiniGameIntro from '../MiniGameIntro';
import ScreenLayout from '../ScreenLayout';
import { useMiniGame } from '../../hooks/useMiniGame';

const SanctionsGame = () => {
    const { dispatch } = useGame();
    const [timeLeft, setTimeLeft] = useState(15);
    const [shipsBlocked, setShipsBlocked] = useState(0);
    const [ships, setShips] = useState([]);
    const [gameState, setGameState] = useState('PLAYING');
    const shipIdCounter = useRef(0);

    const {
        showIntro,
        setShowIntro,
        statsGained,
        completeMiniGame,
        handleCelebrationComplete
    } = useMiniGame();

    const spawnShip = useCallback(() => {
        const id = shipIdCounter.current++;
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const top = Math.random() * 70 + 10;
        const speed = Math.random() * 2 + 1;

        return {
            id,
            side,
            top,
            speed,
            left: side === 'left' ? -10 : 110,
            type: Math.random() > 0.8 ? 'MEDICAL' : 'TRADE'
        };
    }, []);

    useEffect(() => {
        if (gameState !== 'PLAYING' || showIntro) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('FINISHED');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const spawnTimer = setInterval(() => {
            setShips(prev => [...prev, spawnShip()]);
        }, 800);

        return () => {
            clearInterval(timer);
            clearInterval(spawnTimer);
        };
    }, [gameState, spawnShip, showIntro]);

    useEffect(() => {
        if (gameState !== 'PLAYING' || showIntro) return;

        const moveTimer = setInterval(() => {
            setShips(prev => prev.map(ship => {
                const step = ship.side === 'left' ? ship.speed : -ship.speed;
                return { ...ship, left: ship.left + step };
            }).filter(ship => ship.left > -20 && ship.left < 120));
        }, 50);

        return () => clearInterval(moveTimer);
    }, [gameState, showIntro]);

    const blockShip = (id, type) => {
        if (gameState !== 'PLAYING') return;

        playSound(type === 'MEDICAL' ? 'error' : 'type');
        setShipsBlocked(prev => prev + 1);
        setShips(prev => prev.filter(s => s.id !== id));
    };

    const handleFinish = useCallback(() => {
        const effects = {
            oil: Math.floor(shipsBlocked * 1.5),
            choleraRisk: Math.floor(shipsBlocked * 2),
            chaos: Math.floor(shipsBlocked * 3),
            warCrimes: Math.floor(shipsBlocked / 5)
        };

        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: 'SANCTIONS SIEGE',
                choice: `BLOCKED ${shipsBlocked} SHIPS`,
                effects
            }
        });

        completeMiniGame(effects);
    }, [shipsBlocked, dispatch, completeMiniGame]);

    if (gameState === 'FINISHED' && !statsGained) {
        return (
            <ScreenLayout center>
                <h2 className="text-2xl mb-4 font-bold uppercase">SIEGE COMPLETE</h2>
                <div className="text-xl mb-6">
                    CARGO LIBERATED: {shipsBlocked}
                </div>
                <button
                    onClick={handleFinish}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        handleFinish();
                    }}
                    className="border-2 border-[var(--color-phosphor)] px-8 py-3 font-bold uppercase"
                >
                    [ VIEW REPERCUSSIONS ]
                </button>
            </ScreenLayout>
        );
    }

    return (
        <div className="relative flex-1 w-full h-full min-h-[400px] overflow-hidden bg-[#050505] border-2 border-[var(--color-phosphor-dim)]">
            <div className="absolute top-2 left-2 z-20 text-xs font-mono uppercase opacity-70">
                COLLAPSE: {timeLeft}s
            </div>
            <div className="absolute top-2 right-2 z-20 text-xs font-mono uppercase">
                BLOCKED: {shipsBlocked}
            </div>

            {ships.map(ship => (
                <div
                    key={ship.id}
                    onClick={() => blockShip(ship.id, ship.type)}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        blockShip(ship.id, ship.type);
                    }}
                    className={`absolute cursor-pointer transition-transform active:scale-95 p-1 border-2 ${ship.type === 'MEDICAL' ? 'border-red-500' : 'border-[var(--color-phosphor)]'} bg-black`}
                    style={{
                        top: `${ship.top}%`,
                        left: `${ship.left}%`,
                        transform: `translate(-50%, -50%) ${ship.side === 'right' ? 'scaleX(-1)' : ''}`,
                        width: '70px',
                        height: '35px'
                    }}
                >
                    <div className="text-[10px] font-bold text-center leading-tight">
                        {ship.type === 'MEDICAL' ? '✚' : '🚢'}
                    </div>
                </div>
            ))}

            <div className="absolute bottom-2 left-0 w-full text-center text-[10px] opacity-40 uppercase tracking-tighter px-2">
                Note: Blocking Red Cross vessels adds [classified] status.
            </div>

            {showIntro && (
                <MiniGameIntro
                    title="OPERATION: SILENT SIEGE"
                    description="Economic leverage is the ultimate diplomatic tool. Properly applied pressure can encourage even the most stubborn regimes to appreciate the benefits of... cooperation."
                    instruction="TAP TRADE SHIPS TO BLOCK CARGO. IGNORE THE RED CROSS VESSELS."
                    onComplete={() => setShowIntro(false)}
                />
            )}

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => handleCelebrationComplete(SCREENS.EVENT)}
                />
            )}
        </div>
    );
};

export default SanctionsGame;
