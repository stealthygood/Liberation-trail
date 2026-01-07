import { useGame } from '../../context/GameContext';
import { COUNTRIES } from '../../utils/constants';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';

const CountrySelection = () => {
    const { dispatch } = useGame();

    const handleSelect = (countryId) => {
        const country = COUNTRIES.find(c => c.id === countryId);
        dispatch({ type: 'SELECT_COUNTRY', payload: country });
    };

    const options = COUNTRIES.map(c => ({
        ...c,
        description: `Oil Reserves: ${c.reserves} | Democracy Score: "${c.democracyScore}"`
    }));

    return (
        <div className="h-full flex-col p-8">
            <div className="border-[var(--color-phosphor)] border-2 p-4 mb-6">
                <h2 className="text-xl mb-2">STRATEGIC ANALYSIS COMPLETE</h2>
                <div className="h-[2px] bg-[var(--color-phosphor)] w-full"></div>
            </div>

            <div className="mb-4 min-h-[60px]">
                <Typewriter
                    text="CHOOSE YOUR SOURCE OF OIL... er, I mean, COUNTRY IN NEED OF DEMOCRACY™:"
                    speed={20}
                    className="text-xl"
                />
            </div>

            <ChoiceMenu
                options={options}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default CountrySelection;
