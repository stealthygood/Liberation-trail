import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';

const SHELL_COMPANIES = [
    { id: 'FREEDOM_PAC', name: 'Americans for Freedom PAC', trace: 0, description: "Highly opaque. No disclosure required." },
    { id: 'CITIZENS_UNITY', name: 'Citizens United for Unity', trace: 10, description: "Standard Super PAC. Some FEC filings." },
    { id: 'LOBBY_WORKS', name: 'Global Lobbying Group LLC', trace: 25, description: "Registered lobbyist shell. Tracable." },
    { id: 'DIRECT_DONATION', name: 'Direct Public Contribution', trace: 100, description: "Full transparency. (WARNING: CHOLERA RISK)", isEthical: true }
];

const SuperPACGame = () => {
    const { dispatch } = useGame();
    const [suspicion, setSuspicion] = useState(0);
    const [moneyRouted, setMoneyRouted] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState("READY TO LAUNDER");

    const totalToRoute = 5.0; // $5M

    const handleRoute = useCallback((company) => {
        if (gameOver) return;
        playSound('type');

        const amount = 1.0; // Route $1M at a time
        const newMoney = moneyRouted + amount;
        const newSuspicion = suspicion + company.trace;

        setMoneyRouted(newMoney);
        setSuspicion(newSuspicion);

        if (company.isEthical) {
            setStatus("FEC ALERT: TRANSPARENCY DETECTED!");
            playSound('error');
            setGameOver(true);
            setTimeout(() => {
                dispatch({ type: 'MODIFY_STATS', payload: { choleraRisk: 40 } });
                dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            }, 1500);
            return;
        }

        if (newSuspicion >= 100) {
            setStatus("FEC INVESTIGATION TRIGGERED!");
            playSound('error');
            setGameOver(true);
            setTimeout(() => {
                dispatch({ type: 'MODIFY_STATS', payload: { approval: -20, treasury: -10 } });
                dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
            }, 1500);
            return;
        }

        if (newMoney >= totalToRoute) {
            setStatus("FUNDS SUCCESSFULLY SECURED");
            playSound('success');
            setGameOver(true);
            setTimeout(() => {
                dispatch({ type: 'MODIFY_STATS', payload: { treasury: 5, approval: 5 } });
                dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
            }, 1500);
        } else {
            setStatus(`ROUTED $${newMoney.toFixed(1)}M...`);
        }
    }, [moneyRouted, suspicion, gameOver, dispatch]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver) return;
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= SHELL_COMPANIES.length) {
                handleRoute(SHELL_COMPANIES[num - 1]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, handleRoute]);

    const renderProgressBar = (value, length = 20) => {
        const filled = Math.min(length, Math.ceil((value / 100) * length));
        return '[' + '█'.repeat(filled) + '░'.repeat(length - filled) + ']';
    };

    return (
        <div className="h-full flex-col p-4 md:p-8 items-center justify-center font-mono">
            <h2 className="text-xl mb-6 text-[var(--color-phosphor)] font-bold text-center tracking-tighter uppercase">*** FINANCE SHUFFLE ***</h2>

            <div className="w-full max-w-md border-2 border-[var(--color-phosphor)] p-4 bg-black/80">
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] mb-1 opacity-70">
                        <span>FUNDS ROUTED:</span>
                        <span>${moneyRouted.toFixed(1)}M / $5M</span>
                    </div>
                    <div className="h-4 border border-[var(--color-phosphor-dim)] overflow-hidden">
                        <div className="h-full bg-[var(--color-phosphor)] transition-all" style={{ width: `${(moneyRouted / totalToRoute) * 100}%` }}></div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-[10px] mb-1 opacity-70">
                        <span className={suspicion > 70 ? 'text-red-500 animate-pulse' : ''}>FEC SUSPICION:</span>
                        <span className={suspicion > 70 ? 'text-red-500' : ''}>{suspicion}%</span>
                    </div>
                    <div className="h-4 border border-[var(--color-phosphor-dim)] overflow-hidden">
                        <div className={`h-full transition-all ${suspicion > 70 ? 'bg-red-500' : 'bg-[var(--color-phosphor-dim)]'}`} style={{ width: `${suspicion}%` }}></div>
                    </div>
                </div>

                <div className="bg-black/50 p-3 border border-[var(--color-phosphor-dim)] mb-6 min-h-[40px] text-center">
                    <div className="text-lg animate-pulse uppercase text-xs">{status}</div>
                </div>

                <div className="flex-col gap-2">
                    {SHELL_COMPANIES.map((company) => (
                        <button
                            key={company.id}
                            disabled={gameOver}
                            onClick={() => handleRoute(company)}
                            className="w-full bg-transparent border border-[var(--color-phosphor-dim)] p-3 text-left active:bg-[rgba(51,255,51,0.1)] transition-all flex justify-between items-center group"
                        >
                            <div>
                                <div className="text-sm font-bold uppercase tracking-tight">{company.name}</div>
                                <div className="text-[10px] opacity-40 uppercase">{company.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <pre className="mt-8 text-[0.6rem] leading-none opacity-20 select-none pointer-events-none">
                {`    _________________
   /                /|
  /                / |
 /________________/ /|
|                | / |
|   LAUNDERTRON  |/  |
|      3000      |  /
|________________| /
`}
            </pre>
        </div>
    );
};

export default SuperPACGame;
