import { useGame } from '../../context/GameContext';
import { ROLES } from '../../utils/constants';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';
import ScreenLayout from '../ScreenLayout';

const RoleSelection = () => {
    const { dispatch } = useGame();

    const handleSelect = (roleId) => {
        const role = ROLES.find(r => r.id === roleId);
        dispatch({ type: 'SELECT_ROLE', payload: role });
    };

    return (
        <ScreenLayout center>
            <h1 className="text-center text-3xl mb-2 tracking-tighter">LIBERATION TRAIL</h1>
            <div className="w-16 h-1 bg-[var(--color-phosphor)] mb-8 opacity-30"></div>

            <div className="mb-6 min-h-[40px] text-center">
                <Typewriter
                    text="SELECT OPERATIVE CLASS:"
                    speed={40}
                    className="text-xl opacity-80"
                />
            </div>

            <ChoiceMenu
                options={ROLES}
                onSelect={handleSelect}
            />
        </ScreenLayout>
    );
};

export default RoleSelection;
