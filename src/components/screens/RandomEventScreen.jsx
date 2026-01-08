import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import Typewriter from '../Typewriter';
import CelebrationOverlay from '../CelebrationOverlay';

const RANDOM_EVENTS = [
    {
        type: 'NEWS',
        title: '*** MEDIA ALERT ***',
        text: 'CNN asks: "Why has your mission produced 47k refugees this month?"',
        options: [
            { text: 'FAKE NEWS', effects: { approval: -5, warCrimes: 1 } },
            { text: 'MIGRANTS', effects: { approval: 0 } },
            { text: 'WE CONFESS', effects: { choleraRisk: 40 }, isEthical: true }
        ]
    },
    {
        type: 'PHONE',
        title: '*** LOCKHEED MARTIN ***',
        text: '"Our stock is down 2%. Order 50 more F-35s now."',
        options: [
            { text: 'BUY JETS ($2.5B)', effects: { treasury: -2500, approval: 5, warCrimes: 2 } },
            { text: 'REFUSE', effects: { choleraRisk: 15 }, isEthical: true },
            { text: 'HANG UP', effects: { approval: -10 } }
        ]
    },
    {
        type: 'TWEET',
        title: '*** @POTUS DRAFT ***',
        text: 'Draft: "Oil up 340%! Democracy is WINNING! 🇺🇸🛢️"',
        options: [
            { text: 'POST', effects: { approval: 10, oil: 5 } },
            { text: 'EDIT', effects: { approval: 5 } },
            { text: 'DELETE', effects: { choleraRisk: 10 }, isEthical: true }
        ]
    }
];

const RandomEventScreen = () => {
    const { dispatch } = useGame();
    const [event] = useState(() => RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statsGained, setStatsGained] = useState(null);

    const handleSelect = useCallback((option) => {
        if (isProcessing) return;
        setIsProcessing(true);
        playSound('type');

        dispatch({ type: 'MODIFY_STATS', payload: option.effects });

        if (option.isEthical && Math.random() < 0.3) {
            playSound('error');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            }, 500);
            return;
        }

        // Trigger celebration for profitable choices
        const isProfitable = (option.effects?.oil > 0 || option.effects?.treasury > 0) && !option.isEthical;
        if (isProfitable) {
            setStatsGained(option.effects);
            return;
        }

        playSound('success');
        setTimeout(() => {
            dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
        }, 800);
    }, [isProcessing, dispatch]);

    const getColors = () => {
        switch (event.type) {
            case 'NEWS': return 'border-red-600 bg-red-900/20';
            case 'PHONE': return 'border-blue-600 bg-blue-900/20';
            case 'TWEET': return 'border-sky-400 bg-sky-900/20';
            default: return 'border-[var(--color-phosphor)]';
        }
    };

    return (
        <div className="h-full flex-col p-4 md:p-8 items-center justify-center">
            <div className={`w-full max-w-lg border-2 p-5 ${getColors()} relative animate-in fade-in zoom-in duration-300`}>
                <div className="text-xs font-bold opacity-80 mb-2 tracking-widest uppercase">{event.title}</div>
                <div className="h-[1px] bg-current w-full mb-4 opacity-30"></div>

                <div className="text-xl mb-6 min-h-[60px] italic">
                    <Typewriter text={event.text} speed={20} />
                </div>

                <div className="flex-col gap-3">
                    {event.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            className="w-full text-center border-2 border-current p-4 hover:bg-white/10 transition-all font-bold text-lg uppercase"
                        >
                            [ {opt.text} ]
                        </button>
                    ))}
                </div>
            </div>

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => {
                        setStatsGained(null);
                        playSound('success');
                        dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
                        setIsProcessing(false);
                    }}
                />
            )}

            <div className="mt-8 text-xs opacity-50 uppercase tracking-widest">
                Urgent Transmission Required
            </div>
        </div>
    );
};

export default RandomEventScreen;
