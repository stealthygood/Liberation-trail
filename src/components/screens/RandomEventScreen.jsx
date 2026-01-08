import { useState } from 'react';
import { SCREENS } from '../../utils/constants';
import Typewriter from '../Typewriter';
import CelebrationOverlay from '../CelebrationOverlay';
import ScreenLayout from '../ScreenLayout';
import { useEventProcessor } from '../../hooks/useEventProcessor';

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
    const [event] = useState(() => RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]);

    const {
        isProcessing,
        statsGained,
        processChoice,
        completeCelebration
    } = useEventProcessor();

    const handleSelect = (option) => {
        processChoice(option, event.title);
    };

    const getColors = () => {
        switch (event.type) {
            case 'NEWS': return 'border-red-600 bg-red-900/20';
            case 'PHONE': return 'border-blue-600 bg-blue-900/20';
            case 'TWEET': return 'border-sky-400 bg-sky-900/20';
            default: return 'border-[var(--color-phosphor)]';
        }
    };

    return (
        <ScreenLayout className="items-center">
            <div className={`w-full max-w-lg border-2 p-5 ${getColors()} relative animate-in fade-in zoom-in duration-300`}>
                <div className="text-xs font-bold opacity-80 mb-2 tracking-widest uppercase">{event.title}</div>
                <div className="h-[1px] bg-current w-full mb-4 opacity-30"></div>

                <div className="text-xl mb-6 min-h-[60px] italic">
                    <Typewriter text={event.text} speed={20} />
                </div>

                <div className="mb-4 text-xs font-bold opacity-70 tracking-widest text-center uppercase">
                    WHAT DO YOU DO?
                </div>

                <div className="flex-col gap-3">
                    {event.options.map((opt, i) => (
                        <button
                            key={i}
                            disabled={isProcessing}
                            onClick={() => handleSelect(opt)}
                            className="w-full text-center border-2 border-current p-4 hover:bg-white/10 transition-all font-bold text-lg uppercase mb-3"
                        >
                            [ {opt.text} ]
                        </button>
                    ))}
                </div>
            </div>

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => completeCelebration(() => SCREENS.EVENT)}
                />
            )}

            <div className="mt-8 text-xs opacity-50 uppercase tracking-widest text-center w-full">
                Urgent Transmission Required
            </div>
        </ScreenLayout>
    );
};

export default RandomEventScreen;
