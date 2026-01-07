import { useGame } from '../../context/GameContext';
import { ROLES } from '../../utils/constants';
import ChoiceMenu from '../ChoiceMenu';
import Typewriter from '../Typewriter';

const RoleSelection = () => {
    const { dispatch } = useGame();

    const handleSelect = (roleId) => {
        const role = ROLES.find(r => r.id === roleId);
        dispatch({ type: 'SELECT_ROLE', payload: role });
    };

    return (
        <div className="h-full flex-col p-8">
            <h1 className="text-center text-4xl mb-4">LIBERATION TRAIL</h1>
            <div className="border-b-2 border-[var(--color-phosphor)] mb-8 opacity-50"></div>

            <div className="mb-8 min-h-[60px]">
                <Typewriter
                    text="CHOOSE YOUR LIBERATOR CLASS:"
                    speed={30}
                    className="text-2xl"
                />
            </div>

            <ChoiceMenu
                options={ROLES}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default RoleSelection;
