import { useGame } from '../../context/GameContext';
import { COUNTRIES } from '../../utils/constants';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import ScreenLayout from '../ScreenLayout';

const CountrySelection = () => {
    const { dispatch } = useGame();

    const handleSelect = (countryId) => {
        dispatch({ type: 'SELECT_COUNTRY', payload: countryId });
    };

    const options = COUNTRIES.map(c => ({
        ...c,
        description: `Oil Reserves: ${c.reserves} | Democracy Score: "${c.democracyScore}"`
    }));

    return (
        <ScreenLayout center>
            <div className="border-[var(--color-phosphor)] border-2 p-3 mb-8 w-full text-center">
                <h2 className="text-lg md:text-xl font-bold">
                    <span className="line-through opacity-50">ENRICH MYSELF</span> er... um, SPREAD DEMOCRACY
                </h2>
            </div>


            <ChoiceMenu
                options={options}
                onSelect={handleSelect}
            />
        </ScreenLayout>
    );
};

export default CountrySelection;
