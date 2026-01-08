import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import { SCREENS, COUNTRIES } from '../../utils/constants';
import { playSound } from '../../utils/SoundManager';
import CelebrationOverlay from '../CelebrationOverlay';
import ScreenLayout from '../ScreenLayout';

const OPTIONS = [
    {
        id: 'KIDNAP',
        name: 'KIDNAP PRESIDENT',
        description: 'Extract him via unregistered aircraft.',
        effects: { oil: 20, treasury: 10, warCrimes: 5 },
        miniGame: SCREENS.DRONE_STRIKE
    },
    {
        id: 'MEDDLE',
        name: 'MEDDLE IN ELECTIONS',
        description: 'Inject $50M into opposition candidates.',
        effects: { oil: 10, treasury: -5, approval: 10 },
        miniGame: SCREENS.SUPER_PAC
    },
    {
        id: 'CLEAN_ENERGY',
        name: 'INVEST IN DOMESTIC CLEAN ENERGY',
        description: 'Reduce dependency on foreign oil. (Ethical/Unprofitable)',
        effects: { choleraRisk: 50, approval: -20, oil: -10 },
        isEthical: true
    }
];

const ResponseAlert = () => {
    const { state, dispatch } = useGame();
    const { selectedCountry } = state;
    const [statsGained, setStatsGained] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const countryData = COUNTRIES.find(c => c.id === selectedCountry) || COUNTRIES[0];

    const handleSelect = useCallback((optionId) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const selectedOption = OPTIONS.find(opt => opt.id === optionId);

        // Apply stat effects
        if (selectedOption.effects) {
            dispatch({ type: 'MODIFY_STATS', payload: selectedOption.effects });
        }

        // Log to history
        dispatch({
            type: 'ADD_HISTORY',
            payload: {
                event: 'LIBERATION ALERT',
                choice: optionId,
                effects: selectedOption.effects
            }
        });

        if (selectedOption.id === 'CLEAN_ENERGY') {
            playSound('error');
            dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
            return;
        }

        const isProfitable = selectedOption.effects?.oil > 0 || selectedOption.effects?.treasury > 0;

        if (isProfitable) {
            setStatsGained(selectedOption.effects);
            return;
        }

        playSound('success');
        dispatch({ type: 'NAVIGATE', payload: selectedOption.miniGame || SCREENS.EVENT });
    }, [dispatch, isProcessing]);

    return (
        <ScreenLayout>
            <div className="border-2 border-red-500 text-red-500 p-4 mb-6 animate-pulse text-center">
                <h2 className="text-2xl font-bold">*** ALERT *** ALERT *** ALERT ***</h2>
            </div>

            <div className="mb-4 mt-6 lg:mt-0">
                <h3 className="text-xl underline mb-2">INTELLIGENCE REPORT:</h3>
                <p className="mb-4">
                    TARGET: {countryData.name}
                </p>
                <div className="min-h-[100px] mb-4">
                    <Typewriter
                        text={`${countryData.leader || 'The regime'} has stated: "${countryData.quote || 'No.'}" This blatant disregard for American energy security and shareholder value cannot stand.`}
                        speed={15}
                    />
                </div>
            </div>

            <h3 className="text-xl mb-4 font-bold border-t border-[var(--color-phosphor-dim)] pt-4">
                WHAT DO YOU DO?
            </h3>

            <ChoiceMenu
                options={OPTIONS}
                onSelect={handleSelect}
                disabled={isProcessing}
            />

            {statsGained && (
                <CelebrationOverlay
                    statsGained={statsGained}
                    onComplete={() => {
                        setStatsGained(null);
                        // Find the option by comparing the effects values since reference might change if we didn't use memo
                        const selectedOption = OPTIONS.find(opt => opt.effects.oil === statsGained.oil && opt.effects.treasury === statsGained.treasury);
                        dispatch({ type: 'NAVIGATE', payload: selectedOption?.miniGame || SCREENS.EVENT });
                    }}
                />
            )}
        </ScreenLayout>
    );
};

export default ResponseAlert;
