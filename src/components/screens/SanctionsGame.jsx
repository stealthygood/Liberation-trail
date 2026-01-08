import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import Typewriter from '../Typewriter';
import CelebrationOverlay from '../CelebrationOverlay';
import MiniGameIntro from '../MiniGameIntro';

const SanctionsGame = () => {
    const { dispatch } = useGame();
    const [timeLeft, setTimeLeft] = useState(15);
    const [shipsBlocked, setShipsBlocked] = useState(0);
    const [ships, setShips] = useState([]);
    const [gameState, setGameState] = useState('PLAYING'); // Start in playing because intro handles ready
    const [showIntro, setShowIntro] = useState(true);
    const [statsGained, setStatsGained] = useState(null);
    const gameContainerRef = useRef(null);
    const shipIdCounter = useRef(0);

    const spawnShip = useCallback(() => {
        const id = shipIdCounter.current++;
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const top = Math.random() * 70 + 10; // 10% to 80% from top
        const speed = Math.random() * 2 + 1;

        return {
            id,
            side,
            top,
            speed,
            left: side === 'left' ? -10 : 110,
            type: Math.random() > 0.8 ? 'MEDICAL' : 'TRADE' // Satirical: mostly trade, some "accidentally" blocked medical ships
        };
    }, []);

    useEffect(() => {
        if (gameState !== 'PLAYING') return;

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
    }, [gameState, spawnShip]);

    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const moveTimer = setInterval(() => {
            setShips(prev => prev.map(ship => {
                const step = ship.side === 'left' ? ship.speed : -ship.speed;
                return { ...ship, left: ship.left + step };
            }).filter(ship => ship.left > -20 && ship.left < 120));
        }, 50);

        return () => clearInterval(moveTimer);
    }, [gameState]);

    const blockShip = (id, type) => {
        if (gameState !== 'PLAYING') return;

        playSound(type === 'MEDICAL' ? 'error' : 'type');
        setShipsBlocked(prev => prev + 1);
        setShips(prev => prev.filter(s => s.id !== id));

        // Visual feedback for "Sanctioned"
        const effect = document.createElement('div');
        effect.className = 'absolute text-red-500 font-bold pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50';
        effect.innerText = 'SANCTIONED';
        // Note: In vanilla CSS project, we'd use a class or style
        // For simplicity here, I'll just rely on the ship being removed
    };

    const handleFinish = useCallback(() => {
        const effects = {
            oil: Math.floor(shipsBlocked * 1.5),
            choleraRisk: Math.floor(shipsBlocked * 2),
            chaos: Math.floor(shipsBlocked * 3),
            warCrimes: Math.floor(shipsBlocked / 5),
            fifaPrize: true
        };

        dispatch({
            type: 'MODIFY_STATS',
            payload: effects
        });

        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: 'SANCTIONS SIEGE',
                choice: `BLOCKED ${shipsBlocked} SHIPS`,
                effects: { oil: effects.oil, choleraRisk: effects.choleraRisk, chaos: effects.chaos }
            }
        });

        setStatsGained(effects);
    }, [shipsBlocked, dispatch]);


    if (gameState === 'FINISHED') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <h2 className="text-2xl mb-4 font-bold uppercase">SIEGE COMPLETE</h2>
                <div className="text-xl mb-6">
                    CARGO LIBERATED: {shipsBlocked}
                </div>
                <button onClick={handleFinish}>
                    [ VIEW REPERCUSSIONS ]
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden bg-[#050505] border-2 border-[var(--color-phosphor-dim)]" ref={gameContainerRef}>
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
                    onComplete={() => {
                        setStatsGained(null);
                        dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
                    }}
                />
            )}
        </div>
    );
};

export default SanctionsGame;
