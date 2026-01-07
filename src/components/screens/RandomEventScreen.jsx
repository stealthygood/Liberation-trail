import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import Typewriter from '../Typewriter';

const RANDOM_EVENTS = [
    {
        type: 'NEWS',
        title: '*** CNN BREAKING NEWS ***',
        text: 'Anderson Cooper is asking why your "humanitarian mission" has produced 47,000 refugees in the first month.',
        options: [
            { text: '"Fake news"', effects: { approval: -5, warCrimes: 1 } },
            { text: '"They\'re economic migrants"', effects: { approval: 0 } },
            { text: '"We accept responsibility"', effects: { choleraRisk: 40 }, isEthical: true }
        ]
    },
    {
        type: 'PHONE',
        title: '*** INCOMING CALL: LOCKHEED MARTIN ***',
        text: '"We noticed you haven\'t ordered any F-35s for this liberation. Our stock price is down 2%. Fix this."',
        options: [
            { text: 'Order 50 jets ($2.5B)', effects: { treasury: -2500, approval: 5, warCrimes: 2 } },
            { text: '"The mission doesn\'t require—"', effects: { choleraRisk: 15 }, isEthical: true },
            { text: 'Hang up (Safe space)', effects: { approval: -10 } }
        ]
    },
    {
        type: 'TWEET',
        title: '*** @POTUS TWITTER DRAFT ***',
        text: 'Your social media manager needs approval: "Just spoke with [PUPPET]. Democracy is WINNING! Oil up 340%! 🇺🇸🛢️"',
        options: [
            { text: '[POST]', effects: { approval: 10, oil: 5 } },
            { text: '[EDIT]', effects: { approval: 5 } },
            { text: '[DELETE]', effects: { choleraRisk: 10 }, isEthical: true }
        ]
    }
];

const RandomEventScreen = () => {
    const { dispatch } = useGame();
    const [event] = useState(() => RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]);
    const [isProcessing, setIsProcessing] = useState(false);

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
        <div className="h-full flex-col p-8 items-center justify-center">
            <div className={`w-full max-w-2xl border-4 p-6 ${getColors()} relative animate-in fade-in zoom-in duration-300`}>
                <div className="text-sm font-bold opacity-80 mb-2">{event.title}</div>
                <div className="h-[2px] bg-current w-full mb-6 opacity-50"></div>

                <div className="text-2xl mb-8 min-h-[100px]">
                    <Typewriter text={event.text} speed={20} />
                </div>

                <div className="flex-col gap-3">
                    {event.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            className="w-full text-left border-2 border-current p-4 hover:bg-white/10 transition-all font-bold text-lg"
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-xs opacity-50 uppercase tracking-widest">
                Urgent Transmission Required
            </div>
        </div>
    );
};

export default RandomEventScreen;
