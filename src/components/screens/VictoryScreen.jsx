import { useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import ASCIIArt from '../ASCIIArt';
import Typewriter from '../Typewriter';
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
        <div className="h-full flex-col items-center justify-center p-8 text-center overflow-auto">
            <ASCIIArt art={VICTORY_ART} className="mb-4 text-yellow-400" />

            <h1 className="text-4xl mb-4 text-yellow-400" style={{ textShadow: '0 0 10px gold' }}>
                {ending.title}
            </h1>

            <div className="border-2 border-[var(--color-phosphor)] p-6 max-w-2xl w-full mb-8 text-left bg-black/40">
                <div className="mb-6 text-xl">
                    <Typewriter text={ending.text} speed={25} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono uppercase border-t border-[var(--color-phosphor-dim)] pt-4">
                    <div>
                        <div className="opacity-50">MISSION PERFORMANCE:</div>
                        <div>Oil Secured: {stats.oil}B</div>
                        <div>Approval: {stats.approval}%</div>
                        <div>Chaos Level: {stats.chaos}%</div>
                        <div>War Crimes: {stats.warCrimes > 10 ? 'MAXIMUM' : stats.warCrimes}</div>
                    </div>
                    <div>
                        <div className="opacity-50">PERSISTENT RECORD:</div>
                        <div>Total Oil Liberated: {persistence.totalOilSecured + stats.oil}B</div>
                        <div>High Score: {persistence.highScore}B</div>
                        <div>Career Death Count: {persistence.choleraDeaths}</div>
                    </div>
                </div>
            </div>

            <div className="mb-4 italic opacity-70 text-sm">
                "Our liberation of {selectedCountry?.name || 'THE TARGET'} is a model for the world."
            </div>

            <div className="mt-4 blink-text opacity-50 font-mono">
                [PRESS ANY KEY TO LIBERATE ANOTHER NATION]
            </div>
        </div>
    );
};

export default VictoryScreen;
