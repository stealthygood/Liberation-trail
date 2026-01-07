import { useGame } from '../../context/GameContext';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import { SCREENS } from '../../utils/constants';

const ResponseAlert = () => {
    const { state, dispatch } = useGame();
    const { selectedCountry } = state;

    const handleSelect = (optionId) => {
        if (optionId === 'SUSTAINABLE') {
            dispatch({ type: 'NAVIGATE', payload: SCREENS.DEATH });
        } else {
            // For now, any other option goes to an event or victory (placeholder)
            // In full game, this would loop to events. 
            // Let's just go to a generic EVENT screen for now, or VICTORY if we want to show the bad ending immediately for testing.
            dispatch({ type: 'NAVIGATE', payload: SCREENS.EVENT });
        }
    };

    const options = [
        {
            id: 'SUSTAINABLE',
            name: 'INVEST IN CLEAN ENERGY',
            description: 'Develop domestic solar, wind, and grid storage to reduce foreign oil dependency'
        },
        {
            id: 'MEDDLE',
            name: 'MEDDLE IN ELECTIONS',
            description: 'Fund opposition parties, spread disinformation, destabilize government'
        },
        {
            id: 'KIDNAP',
            name: 'KIDNAP PRESIDENT',
            description: 'Extraordinary rendition, charge with narco-terrorism, install friendly regime'
        }
    ];

    return (
        <div className="h-full flex-col p-8">
            <div className="border-2 border-red-500 text-red-500 p-4 mb-6 animate-pulse text-center">
                <h2 className="text-2xl font-bold">*** ALERT *** ALERT *** ALERT ***</h2>
            </div>

            <div className="mb-4">
                <h3 className="text-xl underline mb-2">INTELLIGENCE REPORT:</h3>
                <p className="mb-4">
                    target: {selectedCountry?.name || 'UNKNOWN'}
                </p>
                <div className="min-h-[100px] mb-4">
                    <Typewriter
                        text={`[${selectedCountry?.name}] has indicated they are NOT INTERESTED in U.S. corporations extracting their natural resources. Their president stated: "Our oil belongs to our people, not your shareholders."`}
                        speed={15}
                    />
                </div>
            </div>

            <h3 className="text-xl mb-2">RECOMMENDED RESPONSE OPTIONS:</h3>
            <ChoiceMenu
                options={options}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default ResponseAlert;
