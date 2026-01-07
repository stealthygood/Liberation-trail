import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import { SCREENS } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';

const EVENTS = [
    {
        title: '*** INCOMING FUNDS DETECTED ***',
        text: 'Rex Blackwell, CEO of PetroGlobal Industries, has contributed $5,000,000 to your Super PAC "Americans for American Freedom America". He requests "favorable consideration" on upcoming drilling legislation.',
        options: [
            {
                id: 'TRANSPARENCY',
                name: 'FULL TRANSPARENCY',
                description: 'Publicly disclose all donors and refuse quid pro quo arrangements',
                effects: { approval: -5, choleraRisk: 25, chaos: -5 },
                isEthical: true
            },
            {
                id: 'ACCEPT',
                name: 'ACCEPT QUIETLY',
                description: 'Route through shell corporations, meet donor at undisclosed location',
                effects: { treasury: 5, oil: 5, warCrimes: 1, approval: 3 },
                miniGame: SCREENS.SUPER_PAC
            },
            {
                id: 'DEMAND',
                name: 'DEMAND MORE',
                description: '"That\'s a nice start. My Swiss account number is..."',
                effects: { treasury: 15, warCrimes: 2, approval: -5, chaos: 10 },
                miniGame: SCREENS.SUPER_PAC
            }
        ]
    },
    {
        title: '*** BREAKING NEWS ***',
        text: 'Mainstream media is asking questions about your foreign policy. "Why are we sending troops to protect oil fields?"',
        options: [
            {
                id: 'HONEST',
                name: 'HONEST PRESS CONFERENCE',
                description: 'Explain the full situation truthfully to the American people',
                effects: { approval: -20, choleraRisk: 30, chaos: -10 },
                isEthical: true,
                miniGame: SCREENS.PRESS_BRIEFING
            },
            {
                id: 'SECURITY',
                name: 'INVOKE NATIONAL SECURITY',
                description: '"I can neither confirm nor deny... but think of the TERRORISTS"',
                effects: { approval: 10, warCrimes: 1, chaos: 5 },
                miniGame: SCREENS.PRESS_BRIEFING
            },
            {
                id: 'ATTACK',
                name: 'ATTACK THE MESSENGER',
                description: '"Fake news! Enemy of the people! They hate America!"',
                effects: { approval: 15, warCrimes: 1, chaos: 15 },
                miniGame: SCREENS.PRESS_BRIEFING
            }
        ]
    },
    {
        title: '*** CYBER WARFARE ALERT ***',
        text: 'Our intelligence suggests a foreign nation is using "The Internet" to say mean things about your haircut. Strategic Command advises a kinetic response.',
        options: [
            {
                id: 'IGNORE',
                name: 'IGNORE THE TROLLS',
                description: 'Focus on domestic policy and ignore online discourse',
                effects: { approval: -5, choleraRisk: 15, chaos: -5 },
                isEthical: true
            },
            {
                id: 'BOMB',
                name: 'BOMB THE SERVERS',
                description: 'Deploy a tactical EMP to a random data center',
                effects: { oil: 10, warCrimes: 3, approval: 5, chaos: 20 },
                miniGame: SCREENS.DRONE_STRIKE
            },
            {
                id: 'MEME',
                name: 'DEPLOY MEME SQUAD',
                description: 'Allocate $50B to "Operation Dank Meme"',
                effects: { treasury: -50, approval: 20, warCrimes: 1, chaos: 5 }
            }
        ]
    },
    {
        title: '*** FRUIT COMPANY DISPUTE ***',
        text: 'The United Fruit... err, "Global Bananas Corp" is upset about labor laws. They request a "regime adjustment" to lower minimum wage.',
        options: [
            {
                id: 'UNIONS',
                name: 'SUPPORT WORKERS',
                description: 'Enforce international labor standards',
                effects: { approval: 5, choleraRisk: 25, chaos: -15 },
                isEthical: true
            },
            {
                id: 'COUP',
                name: 'AUTHORIZE COUP',
                description: 'Install a "business-friendly" General',
                effects: { oil: 15, treasury: 10, warCrimes: 3, approval: -10, chaos: 30 },
                miniGame: SCREENS.DRONE_STRIKE
            },
            {
                id: 'BANANA',
                name: 'EAT A BANANA',
                description: 'Do nothing but enjoy the potassium',
                effects: { approval: 0, choleraRisk: 5, chaos: 5 }
            }
        ]
    },
    {
        title: '*** RESOURCE DISCOVERY ***',
        text: 'Massive lithium deposits confirmed under a sacred indigenous site. The locals refuse to relocate.',
        options: [
            {
                id: 'PROTECT',
                name: 'DECLARE A NATURE RESERVE',
                description: 'Protect the site and abandon the lithium',
                effects: { approval: 10, choleraRisk: 35, chaos: -20 },
                isEthical: true
            },
            {
                id: 'NEGOTIATE',
                name: 'EQUITABLE NEGOTIATION',
                description: 'Offer the tribe 0.01% of the profits and a commemorative plaque',
                effects: { oil: 10, treasury: 5, warCrimes: 1, chaos: 10 }
            },
            {
                id: 'EXCAVATE',
                name: 'URGENT EXCAVATION',
                description: 'Relocation using heavy machinery and "non-lethal" gas',
                effects: { oil: 25, warCrimes: 4, approval: -15, chaos: 40 },
                miniGame: SCREENS.DRONE_STRIKE
            }
        ]
    },
    {
        title: '*** ECONOMIC AGGRESSION DETECTED ***',
        text: 'The targeted regime has started providing "free healthcare" and "affordable housing" to its citizens, using oil profits. This clear act of economic aggression threatens our strategic interests.',
        options: [
            {
                id: 'SANCTION',
                name: 'IMPLEMENT TOTAL SANCTIONS',
                description: '"If they want free lunch, they can eat their own ideology... or nothing at all."',
                effects: { oil: 10, choleraRisk: 15, chaos: 20, warCrimes: 2 },
                miniGame: SCREENS.SANCTIONS
            },
            {
                id: 'TARIFF',
                name: 'PROTECTIVE TARIFFS',
                description: 'Tax their imports until they can\'t afford to be Socialist anymore.',
                effects: { treasury: 20, approval: 5, chaos: 10 },
                miniGame: SCREENS.SANCTIONS
            },
            {
                id: 'AID',
                name: 'SEND HUMANITARIAN AID',
                description: 'Send actual food and medicine. Warning: This is extremely unprofitable.',
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
    const [event] = useState(() => EVENTS[Math.floor(Math.random() * EVENTS.length)]);
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
        <div className="h-full flex-col p-8">
            <div className="border-[var(--color-phosphor)] border-2 p-4 mb-6 bg-black/40">
                <h2 className="text-xl mb-2">{event.title}</h2>
                <div className="h-[2px] bg-[var(--color-phosphor)] w-full"></div>
            </div>

            <div className="mb-4 min-h-[100px] border-l-2 border-[var(--color-phosphor-dim)] pl-6">
                <Typewriter
                    text={event.text}
                    speed={15}
                    className="text-xl italic opacity-90"
                    onComplete={() => setTypingFinished(true)}
                />
            </div>

            <div className="mt-8 border-t border-[var(--color-phosphor-dim)] pt-6">
                <ChoiceMenu
                    options={event.options}
                    onSelect={handleSelect}
                    title="DECISION PROTOCOL:"
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
