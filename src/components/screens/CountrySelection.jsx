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
        <div className="h-full flex-col p-4 md:p-8 items-center">
            <div className="border-[var(--color-phosphor)] border-2 p-3 mb-8 w-full text-center">
                <h2 className="text-lg md:text-xl font-bold">
                    <span className="line-through opacity-50">ENRICH MYSELF</span> er... um, SPREAD DEMOCRACY
                </h2>
            </div>


            <ChoiceMenu
                options={options}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default CountrySelection;
