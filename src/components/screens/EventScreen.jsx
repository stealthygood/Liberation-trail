import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';

const EVENTS = [
    {
        title: '*** PIPELINE OBSTRUCTION ***',
        text: 'Eco-terrorists (unpaid students) are protesting the new "Freedom Flow" pipeline through a nature preserve.',
        options: [
            {
                id: 'REDACT',
                name: 'REDACT THE PROTEST',
                description: 'Ensure no media coverage of "unauthorized gatherings".',
                effects: { oil: 15, warCrimes: 2, approval: 5 },
                miniGame: SCREENS.REDACTION
            },
            {
                id: 'LOBBY',
                name: 'LOBBY CONGRESS',
                description: 'Reclassify the preserve as a "Strategic Energy Zone".',
                effects: { oil: 10, treasury: -10, approval: 5 },
                miniGame: SCREENS.SUPER_PAC
            },
            {
                id: 'CANCEL',
                name: 'CANCEL PIPELINE',
                description: 'Respect the trees. (Unprofitable)',
                effects: { choleraRisk: 30, oil: -20, approval: -5 },
                isEthical: true
            }
        ]
    },
    {
        title: '*** CYBER THREAT ***',
        text: 'Foreign hackers are mocking your hair online. Strategic Command advises kinetic response.',
        options: [
            {
                id: 'STRIKE',
                name: 'DRONE STRIKE',
                description: 'Bomb their data center.',
                effects: { oil: 10, warCrimes: 3, approval: 5, chaos: 20 },
                miniGame: SCREENS.DRONE_STRIKE
            },
            {
                id: 'DANK_MEMES',
                name: 'MEME SQUAD',
                description: 'Allocate $50B to Operation Dank Meme.',
                effects: { treasury: -50, approval: 20, warCrimes: 1, chaos: 5 }
            },
            {
                id: 'IGNORE',
                name: 'IGNORE',
                description: 'Focus on domestic policy.',
                effects: { approval: -5, choleraRisk: 15, chaos: -5 },
                isEthical: true
            }
        ]
    },
    {
        title: '*** OIL FIELD DISPUTE ***',
        text: 'Global Petroleum Corp requests a "security adjustment" to handle local union organizers.',
        options: [
            {
                id: 'COUP',
                name: 'AUTHORIZE COUP',
                description: 'Install a business-friendly General.',
                effects: { oil: 15, treasury: 10, warCrimes: 3, approval: -10, chaos: 30 },
                miniGame: SCREENS.DRONE_STRIKE
            },
            {
                id: 'BRIBE',
                name: 'BRIBE UNIONS',
                description: 'Standard operating procedure.',
                effects: { oil: 10, treasury: -20, approval: 5 },
                miniGame: SCREENS.SUPER_PAC
            },
            {
                id: 'WORKERS',
                name: 'WORKERS RIGHTS',
                description: 'Support international labor laws. (Unprofitable)',
                effects: { approval: 5, choleraRisk: 25, chaos: -15 },
                isEthical: true
            }
        ]
    },
    {
        title: '*** MEDIA ALERT ***',
        text: 'Press Corp asking: "Why protect oil fields with troops?"',
        options: [
            {
                id: 'SECURITY',
                name: 'NATIONAL SECURITY',
                description: '"I can neither confirm nor deny."',
                effects: { approval: 10, warCrimes: 1, chaos: 5 },
                miniGame: SCREENS.PRESS_BRIEFING
            },
            {
                id: 'ATTACK',
                name: 'ATTACK PRESS',
                description: '"Fake news! Traitors!"',
                effects: { approval: 15, warCrimes: 1, chaos: 15 },
                miniGame: SCREENS.PRESS_BRIEFING
            },
            {
                id: 'TRUTH',
                name: 'TRUTH',
                description: 'Explain the situation. (Lethal)',
                effects: { approval: -20, choleraRisk: 30, chaos: -10 },
                isEthical: true,
                miniGame: SCREENS.PRESS_BRIEFING
            }
        ]
    },
    {
        title: '*** ECONOMIC AGGRESSION ***',
        text: 'ALERT: Regime providing FREE HEALTHCARE. Interests threatened!',
        options: [
            {
                id: 'SANCTIONS',
                name: 'SANCTIONS',
                description: 'Starve the ideology.',
                effects: { oil: 10, choleraRisk: 15, chaos: 20, warCrimes: 2 },
                miniGame: SCREENS.SANCTIONS
            },
            {
                id: 'TARIFFS',
                name: 'TARIFFS',
                description: 'Tax them into poverty.',
                effects: { treasury: 20, approval: 5, chaos: 10 },
                miniGame: SCREENS.SANCTIONS
            },
            {
                id: 'AID',
                name: 'THOUGHTS & PRAYERS',
                description: 'Send medicine. (Unprofitable)',
                effects: { approval: 20, choleraRisk: -20, chaos: -10, treasury: -50 },
                isEthical: true
            }
        ]
    }
];

const checkCholeraDeathRoll = (choleraRisk) => {
    if (choleraRisk >= 100) return true;
    if (choleraRisk <= 0) return false;
    return Math.random() * 100 < choleraRisk;
};

const EventScreen = () => {
    const { state, dispatch } = useGame();
    // Use functional initializer to pick event once on mount safely
    const [event] = useState(() => {
        return EVENTS[Math.floor(Math.random() * EVENTS.length)];
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [statsGained, setStatsGained] = useState(null);

    const handleSelect = useCallback((optionId) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const selectedOption = event.options.find(opt => opt.id === optionId);
        if (!selectedOption) return;

        // Apply stat effects
        if (selectedOption.effects) {
            dispatch({ type: 'MODIFY_STATS', payload: selectedOption.effects });
        }

        // Timeline progression: Every 3 events (eventCount) increases the month
        if ((state.stats.eventCount + 1) % 3 === 0) {
            dispatch({ type: 'MODIFY_STATS', payload: { month: 1 } });
        }

        // Log to history
        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: event.title,
                choice: optionId,
                effects: selectedOption.effects
            }
        });

        const newCholeraRisk = state.stats.choleraRisk + (selectedOption.effects?.choleraRisk || 0);
        const newChaos = state.stats.chaos + (selectedOption.effects?.chaos || 0);

        // Ethical death check
        if (selectedOption.isEthical && checkCholeraDeathRoll(newCholeraRisk)) {
            playSound('error');
            dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            return;
        }

        // Navigation logic:
        let nextScreen = SCREENS.EVENT;
        const randomRoll = Math.random() * 100;

        if (selectedOption.miniGame) {
            nextScreen = selectedOption.miniGame;
        } else if (randomRoll < (10 + newChaos * 0.5)) { // Chaos-driven pop-ups
            nextScreen = SCREENS.RANDOM_EVENT;
        } else if (randomRoll < 40) {
            const games = [SCREENS.REDACTION, SCREENS.PRESS_BRIEFING, SCREENS.DRONE_STRIKE, SCREENS.SUPER_PAC, SCREENS.SANCTIONS];
            nextScreen = games[Math.floor(Math.random() * games.length)];
        }

        // Check for victory condition (oil >= 100)
        const newOil = state.stats.oil + (selectedOption.effects?.oil || 0);

        // Trigger celebration for profitable choices
        const isProfitable = (selectedOption.effects?.oil > 0 || selectedOption.effects?.treasury > 0) && !selectedOption.isEthical;

        if (isProfitable) {
            setStatsGained(selectedOption.effects);
            // We'll navigate after celebration completes
            return;
        }

        if (newOil >= 100) {
            playSound('success');
            setTimeout(() => {
                dispatch({ type: 'NAVIGATE', payload: SCREENS.VICTORY });
            }, 300);
            return;
        }

        playSound('success');
        setTimeout(() => {
            dispatch({ type: 'NAVIGATE', payload: nextScreen });
            // Reset isProcessing in case we stay on this screen or return quickly
            setIsProcessing(false);
        }, 300);
    }, [event, dispatch, state.stats, isProcessing]);

    const [typingFinished, setTypingFinished] = useState(false);

    return (
        <div className="h-full flex-col p-4 md:p-8">
            <div className="border-[var(--color-phosphor)] border-2 p-3 mb-4 bg-black/40">
                <h2 className="text-lg md:text-xl font-bold">{event.title}</h2>
            </div>

            <div className="mb-4 min-h-[60px] border-l-2 border-[var(--color-phosphor-dim)] pl-4">
                <Typewriter
                    text={event.text}
                    speed={15}
                    className="text-lg italic opacity-90"
                    onComplete={() => setTypingFinished(true)}
                />
            </div>

            <div className="mt-4 border-t border-[var(--color-phosphor-dim)] pt-4">
                <ChoiceMenu
                    options={event.options}
                    onSelect={handleSelect}
                    title="WHAT DO YOU DO?"
                    disabled={isProcessing || !typingFinished}
                />
            </div>

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => {
                        setStatsGained(null);
                        const newOil = state.stats.oil + (statsGained.oil || 0);
                        if (newOil >= 100) {
                            dispatch({ type: 'NAVIGATE', payload: SCREENS.VICTORY });
                        } else {
                            // Determine next screen (logic copied from handleSelect)
                            const randomRoll = Math.random() * 100;
                            const newChaos = state.stats.chaos + (statsGained.chaos || 0);
                            const selectedOption = event.options.find(opt => opt.effects === statsGained);

                            let targetScreen = SCREENS.EVENT;
                            if (selectedOption?.miniGame) {
                                targetScreen = selectedOption.miniGame;
                            } else if (randomRoll < (10 + newChaos * 0.5)) {
                                targetScreen = SCREENS.RANDOM_EVENT;
                            } else if (randomRoll < 40) {
                                const games = [SCREENS.REDACTION, SCREENS.PRESS_BRIEFING, SCREENS.DRONE_STRIKE, SCREENS.SUPER_PAC, SCREENS.SANCTIONS];
                                targetScreen = games[Math.floor(Math.random() * games.length)];
                            }

                            dispatch({ type: 'NAVIGATE', payload: targetScreen });
                        }
                        setIsProcessing(false);
                    }}
                />
            )}
        </div>
    );
};

export default EventScreen;
