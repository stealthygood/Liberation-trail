import { useState, useEffect, useCallback } from 'react';
import ASCIIArt from './ASCIIArt';
import Typewriter from './Typewriter';
import { playSound } from '../utils/SoundManager';
import { useGame } from '../context/GameContext';
import { SCREENS } from '../utils/constants';

const CLIPPY_ART = `
  /\\
 /  \\
 |  |
 |  |
 \\  /
  \\/
`;

// Passive tips (original behavior)
const QUOTES = [
    "It looks like you're trying to violate the Geneva Convention. Would you like help hiding the evidence?",
    "I see you're targeting a sovereign nation. Have you considered calling them 'terrorists' first?",
    "Pro Tip: If you can't find WMDs, just say you did!",
    "Remember: It's not a war crime if you win!",
    "Don't worry about the deficit, we'll just print more freedom dollars.",
    "Did you know? Oil is technically a renewable resource if you wait 100 million years.",
    "Warning: Democracy levels critically low. Recommend immediate invasion.",
    "Need to boost approval ratings? Start a new conflict!",
    "I see you haven't tortured anyone today. Quota reminder!",
    "I've found a loophole in the UN charter! It's called 'because we said so'.",
    "Thinking of regime change? I have a list of sympathetic Generals in my contacts.",
    "Fun fact: No sitting president has ever been tried for war crimes!",
    "Tip: 'Contractor' sounds better than 'mercenary'!",
    "The Geneva Convention is more of a suggestion, really.",
    "Hypothetically, how much 'collateral damage' can your PR team handle?",
];

// Interactive interventions with choices
const INTERVENTIONS = [
    {
        trigger: 'ethical', // Appears when cholera risk is low
        message: "It looks like you're trying to respect international law!\n\nWould you like me to:",
        options: [
            { text: "Find a legal loophole", effects: { oil: 5, warCrimes: 1 } },
            { text: "Manufacture consent", effects: { approval: 10, warCrimes: 1 } },
            { text: "Just do it anyway", effects: { oil: 10, choleraRisk: 5 } }
        ]
    },
    {
        trigger: 'lowApproval', // Appears when approval < 30
        message: "Your approval ratings are looking critically low!\n\nMay I suggest:",
        options: [
            { text: "Start a new war", effects: { approval: 20, warCrimes: 2, oil: 10 } },
            { text: "Blame immigrants", effects: { approval: 15, warCrimes: 1 } },
            { text: "Actually fix problems", effects: { choleraRisk: 25 } }
        ]
    },
    {
        trigger: 'highWarCrimes', // Appears when warCrimes > 5
        message: "I've noticed your war crimes are piling up!\n\nWant me to help?",
        options: [
            { text: "Shred the evidence", effects: { warCrimes: -3, treasury: -10 } },
            { text: "Blame a subordinate", effects: { approval: 5, warCrimes: -2 } },
            { text: "Classify everything", effects: { warCrimes: 0 } } // Stays classified
        ]
    },
    {
        trigger: 'lowTreasury', // Appears when treasury < 0
        message: "The budget's looking a bit thin!\n\nHave you considered:",
        options: [
            { text: "Sell weapons to both sides", effects: { treasury: 50, warCrimes: 2 } },
            { text: "Privatize social security", effects: { treasury: 30, approval: -15 } },
            { text: "Raise taxes on the wealthy", effects: { choleraRisk: 30 } }
        ]
    },
    {
        trigger: 'random', // Random helpful suggestion
        message: "Just checking in! Here's today's opportunity:",
        options: [
            { text: "Overthrow a democracy", effects: { oil: 15, warCrimes: 3 } },
            { text: "Install a puppet regime", effects: { oil: 10, treasury: 5, warCrimes: 2 } },
            { text: "Promote actual democracy", effects: { choleraRisk: 20 } }
        ]
    }
];

const WarAssistant = () => {
    const { state, dispatch } = useGame();
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState(null); // { type: 'quote' | 'intervention', data }

    // Check game state for intervention triggers
    const checkTriggers = useCallback(() => {
        const { stats, currentScreen } = state;

        // Don't show on certain screens
        const hiddenScreens = [SCREENS.DISCLAIMER, SCREENS.TITLE, SCREENS.DEATH, SCREENS.VICTORY, SCREENS.ROLE_SELECT];
        if (hiddenScreens.includes(currentScreen)) return null;

        // Check triggers in priority order
        if (stats.approval < 30 && Math.random() < 0.5) {
            return INTERVENTIONS.find(i => i.trigger === 'lowApproval');
        }
        if (stats.warCrimes > 5 && Math.random() < 0.4) {
            return INTERVENTIONS.find(i => i.trigger === 'highWarCrimes');
        }
        if (stats.treasury < 0 && Math.random() < 0.4) {
            return INTERVENTIONS.find(i => i.trigger === 'lowTreasury');
        }
        if (stats.choleraRisk < 20 && Math.random() < 0.3) {
            return INTERVENTIONS.find(i => i.trigger === 'ethical');
        }
        if (Math.random() < 0.15) {
            return INTERVENTIONS.find(i => i.trigger === 'random');
        }
        return null;
    }, [state]);

    const showRandomQuote = useCallback(() => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setContent({ type: 'quote', data: randomQuote });
        setVisible(true);
        playSound('clippy');
    }, []);

    const showIntervention = useCallback((intervention) => {
        setContent({ type: 'intervention', data: intervention });
        setVisible(true);
        playSound('clippy');
    }, []);

    useEffect(() => {
        // Random appearance check every few seconds
        const interval = setInterval(() => {
            if (!visible) {
                // 30% chance to check for intervention, 70% for quote
                if (Math.random() < 0.3) {
                    const intervention = checkTriggers();
                    if (intervention) {
                        showIntervention(intervention);
                        return;
                    }
                }
                // 10% chance to show quote
                if (Math.random() < 0.1) {
                    showRandomQuote();
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [visible, showRandomQuote, showIntervention, checkTriggers]);

    const handleOptionClick = (option) => {
        // Apply stat effects
        if (option.effects) {
            dispatch({ type: 'MODIFY_STATS', payload: option.effects });
        }
        playSound('type');
        close();
    };

    const close = () => {
        setVisible(false);
        setContent(null);
    };

    const handleDisable = () => {
        // Disabling the War Assistant adds cholera risk!
        dispatch({ type: 'MODIFY_STATS', payload: { choleraRisk: 10 } });
        playSound('error');
        close();
    };

    useEffect(() => {
        const handleGlobalClick = () => {
            if (visible && content?.type === 'quote') {
                close();
            }
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [visible, content, close]);

    if (!visible || !content) return null;

    return (
        <div className={`war-assistant cursor-pointer select-none`} onClick={() => content.type === 'quote' && close()}>
            <div className="war-assistant-inner">
                <div className="war-assistant-icon">
                    <ASCIIArt art={CLIPPY_ART} />
                </div>
                <div className="war-assistant-content">
                    <div className="war-assistant-header flex justify-between">
                        <span>WAR ASSISTANT</span>
                        <span className="opacity-50 text-[10px]">[TAP TO DISMISS]</span>
                    </div>
                    <div className="war-assistant-body">
                        {content.type === 'quote' ? (
                            <div className="quote-text">
                                <Typewriter text={content.data} speed={30} />
                            </div>
                        ) : (
                            <>
                                <Typewriter text={content.data.message} speed={20} />
                                <div className="war-assistant-options">
                                    {content.data.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOptionClick(opt);
                                            }}
                                            className="war-assistant-option"
                                        >
                                            • {opt.text}
                                        </button>
                                    ))}
                                </div>
                                <div className="war-assistant-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            close();
                                        }}
                                        className="war-assistant-btn"
                                    >
                                        [IGNORE]
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .war-assistant {
                    transition: transform 0.3s ease-out, opacity 0.3s;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .quote-text {
                    font-style: italic;
                    color: var(--color-phosphor);
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
};

export default WarAssistant;
