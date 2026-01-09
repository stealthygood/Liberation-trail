import { useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import ASCIIArt from '../ASCIIArt';
import Typewriter from '../Typewriter';
import ScreenLayout from '../ScreenLayout';
import { playSound } from '../../utils/SoundManager';

const VICTORY_ART = `
      $
     $$$
    $$$$$
   $$$$$$$
  $$$$$$$$$
  |$$$$$$$|
  |$$$$$$$|
  |$$$$$$$|
  |_______|
`;

const getEnding = (stats) => {
    if (stats.warCrimes > 15) return {
        title: "THE KISSINGER",
        text: "You secured the oil, committed undeniable atrocities, and successfully pinned it on a low-level clerk. You've been awarded the Nobel Peace Prize and a lifetime supply of blood thinner."
    };
    if (stats.oil >= 100) return {
        title: "MISSION ACCOMPLISHED™",
        text: "The oil is ours. The country is a wasteland, but gas prices at home dropped by $0.03 for exactly four days. You are a national hero."
    };
    if (stats.approval < 20) return {
        title: "THE UNPOPULAR LIBERATOR",
        text: "You won the war but lost the people. You've been forced to retire to a $20M beachfront villa in a country with no extradition treaty. Life is hard."
    };
    return {
        title: "SUCCESSFUL REGIME CHANGE",
        text: "You've successfully installed a puppet regime. They've already started ordering teardrop-shaped pools and American weapons. Everyone wins (except the voters)."
    };
};

const VictoryScreen = () => {
    const { state, dispatch } = useGame();
    const { stats, persistence, selectedCountry } = state;

    const ending = useMemo(() => getEnding(stats), [stats]);

    useEffect(() => {
        playSound('success');
        dispatch({ type: 'REGISTER_VICTORY' });

        const handleKeyPress = () => {
            dispatch({ type: 'START_GAME' });
        };

        const timeout = setTimeout(() => {
            window.addEventListener('keydown', handleKeyPress);
        }, 2000);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [dispatch]);

    return (
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div className="w-full max-w-2xl text-center">
                <ASCIIArt art={VICTORY_ART} className="mb-3 text-yellow-400 scale-[0.6] md:scale-100" />

                <h1 className="text-3xl md:text-6xl font-black mb-4 text-yellow-400 leading-tight italic uppercase tracking-tighter bg-black/40 px-3 py-2" style={{ textShadow: '0 0 40px gold' }}>
                    {ending.title}
                </h1>

                <div className="border-4 border-double border-[var(--color-phosphor)] p-4 md:p-6 w-full mb-4 text-left bg-black/80 shadow-[0_0_20px_rgba(51,255,51,0.2)]">
                    <div className="mb-4 text-base md:text-xl leading-relaxed text-[var(--color-phosphor)]">
                        <Typewriter text={ending.text} speed={30} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm font-mono uppercase border-t border-[var(--color-phosphor-dim)] pt-4">
                        <div className="space-y-1">
                            <div className="opacity-50 text-[10px] mb-2">--- MISSION PERFORMANCE ---</div>
                            <div className="flex justify-between"><span>OIL SECURED:</span> <span className="text-green-400 font-bold">{stats.oil}B</span></div>
                            <div className="flex justify-between"><span>APPROVAL:</span> <span className="text-blue-400 font-bold">{stats.approval}%</span></div>
                            <div className="flex justify-between"><span>CHAOS LEVEL:</span> <span className="text-red-400 font-bold">{stats.chaos}%</span></div>
                            <div className="flex justify-between"><span>WAR CRIMES:</span> <span className="text-yellow-600 font-bold">{stats.warCrimes > 12 ? 'MAXIMUM' : stats.warCrimes}</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="opacity-50 text-[10px] mb-2">--- PERSISTENT RECORD ---</div>
                            <div className="flex justify-between"><span>TOTAL OIL:</span> <span className="text-green-500">{persistence.totalOilSecured + stats.oil}B</span></div>
                            <div className="flex justify-between"><span>HIGH SCORE:</span> <span className="text-yellow-500 font-bold">{persistence.highScore}B</span></div>
                            <div className="flex justify-between"><span>CAREER DEATHS:</span> <span className="text-red-500">{persistence.choleraDeaths}</span></div>
                        </div>
                    </div>
                </div>

                <div className="mb-3 italic opacity-70 text-xs md:text-sm">
                    "Our liberation of {selectedCountry?.name || 'THE TARGET'} is a model for the world."
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                    <button
                        onClick={() => {
                            playSound('type');
                            dispatch({ type: 'START_GAME' });
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            playSound('type');
                            dispatch({ type: 'START_GAME' });
                        }}
                        className="text-lg md:text-2xl px-8 md:px-12 py-3 md:py-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black animate-pulse"
                    >
                        [ LIBERATE ANOTHER NATION ]
                    </button>
                    <div className="text-xs opacity-50 uppercase font-mono">
                        OR PRESS ANY KEY
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VictoryScreen;
