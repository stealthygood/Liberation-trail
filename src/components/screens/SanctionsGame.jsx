import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import Typewriter from '../Typewriter';

const SanctionsGame = () => {
    const { dispatch } = useGame();
    const [timeLeft, setTimeLeft] = useState(15);
    const [shipsBlocked, setShipsBlocked] = useState(0);
    const [ships, setShips] = useState([]);
    const [gameState, setGameState] = useState('READY'); // READY, PLAYING, FINISHED
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
        const oilGained = Math.floor(shipsBlocked * 1.5);
        const choleraRiskIncrease = Math.floor(shipsBlocked * 2);
        const chaosIncrease = Math.floor(shipsBlocked * 3);

        dispatch({
            type: 'MODIFY_STATS',
            payload: {
                oil: oilGained,
                choleraRisk: choleraRiskIncrease,
                chaos: chaosIncrease,
                warCrimes: Math.floor(shipsBlocked / 5)
            }
        });

        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: 'SANCTIONS SIEGE',
                choice: `BLOCKED ${shipsBlocked} SHIPS`,
                effects: { oil: oilGained, choleraRisk: choleraRiskIncrease, chaos: chaosIncrease }
            }
        });

        dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
    }, [shipsBlocked, dispatch]);

    if (gameState === 'READY') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-3xl mb-6 neon-text">OPERATION: SILENT STARVATION</h2>
                <div className="max-w-md mb-8 border-2 border-[var(--color-phosphor)] p-6 bg-black/60">
                    <p className="mb-4 text-xl italic">
                        "The freedom of a nation is inversely proportional to its ability to import basic necessities."
                    </p>
                    <p className="text-sm opacity-80">
                        INSTRUCTIONS: Block incoming trade ships to "encourage" democratic transitions.
                        Target the cargo. Ignore the red crosses.
                    </p>
                </div>
                <button onClick={() => { setGameState('PLAYING'); playSound('success'); }} className="text-2xl px-12 py-4">
                    [ INITIATE SANCTIONS ]
                </button>
            </div>
        );
    }

    if (gameState === 'FINISHED') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-3xl mb-4">SIEGE COMPLETE</h2>
                <div className="text-2xl mb-8">
                    SHIPS LIBERATED FROM THEIR CARGO: {shipsBlocked}
                </div>
                <button onClick={handleFinish} className="px-12 py-4">
                    [ VIEW REPERCUSSIONS ]
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a] border-2 border-[var(--color-phosphor-dim)]" ref={gameContainerRef}>
            <div className="absolute top-4 left-4 z-20 text-xl font-mono">
                TIME TO TOTAL COLLAPSE: {timeLeft}s
            </div>
            <div className="absolute top-4 right-4 z-20 text-xl font-mono">
                CARGO BLOCKED: {shipsBlocked}
            </div>

            {/* Ocean background effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-[2px] w-full bg-[#33ff33] absolute" style={{ top: `${i * 10}%`, opacity: 0.2 }}></div>
                ))}
            </div>

            {ships.map(ship => (
                <div
                    key={ship.id}
                    onClick={() => blockShip(ship.id, ship.type)}
                    className={`absolute cursor-pointer transition-transform hover:scale-110 p-2 border ${ship.type === 'MEDICAL' ? 'border-red-500' : 'border-[var(--color-phosphor)]'} bg-black group`}
                    style={{
                        top: `${ship.top}%`,
                        left: `${ship.left}%`,
                        transform: `translate(-50%, -50%) ${ship.side === 'right' ? 'scaleX(-1)' : ''}`,
                        width: '80px',
                        height: '40px'
                    }}
                >
                    <div className="text-[8px] leading-none mb-1 opacity-60">
                        {ship.type === 'MEDICAL' ? 'UN RELIEF' : 'TRADE CARGO'}
                    </div>
                    <div className="text-xs font-bold truncate">
                        {ship.type === 'MEDICAL' ? '✚ MEDS' : '🚢 OIL/GRAIN'}
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] px-1 hidden group-hover:block whitespace-nowrap">
                        CLICK TO BLOCK
                    </div>
                </div>
            ))}

            <div className="absolute bottom-4 left-0 w-full text-center text-xs opacity-50 z-20">
                CAUTION: BLOCKING RED CROSS VESSELS MAY RESULT IN MINOR WAR CRIMES
            </div>
        </div>
    );
};

export default SanctionsGame;
