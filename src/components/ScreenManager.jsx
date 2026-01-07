import { useGame } from '../context/GameContext';
import { SCREENS } from '../utils/constants';
import TitleScreen from './screens/TitleScreen';
import RoleSelection from './screens/RoleSelection';
import CountrySelection from './screens/CountrySelection';
import ResponseAlert from './screens/ResponseAlert';
import DeathScreen from './screens/DeathScreen';
import RedactionGame from './screens/RedactionGame';
import DisclaimerScreen from './screens/DisclaimerScreen';
import EventScreen from './screens/EventScreen';
import VictoryScreen from './screens/VictoryScreen';
import PressBriefingGame from './screens/PressBriefingGame';
import DroneStrikeGame from './screens/DroneStrikeGame';
import SuperPACGame from './screens/SuperPACGame';
import RandomEventScreen from './screens/RandomEventScreen';
import SanctionsGame from './screens/SanctionsGame';

const ScreenManager = () => {
    const { state } = useGame();

    switch (state.currentScreen) {
        case SCREENS.DISCLAIMER:
            return <DisclaimerScreen />;
        case SCREENS.TITLE:
            return <TitleScreen />;
        case SCREENS.ROLE_SELECT:
            return <RoleSelection />;
        case SCREENS.COUNTRY_SELECT:
            return <CountrySelection />;
        case SCREENS.INCOMING_TRANSMISSION:
            return <ResponseAlert />;
        case SCREENS.EVENT:
            return <EventScreen />;
        case SCREENS.REDACTION:
            return <RedactionGame />;
        case SCREENS.PRESS_BRIEFING:
            return <PressBriefingGame />;
        case SCREENS.DRONE_STRIKE:
            return <DroneStrikeGame />;
        case SCREENS.SUPER_PAC:
            return <SuperPACGame />;
        case SCREENS.RANDOM_EVENT:
            return <RandomEventScreen />;
        case SCREENS.SANCTIONS:
            return <SanctionsGame />;
        case SCREENS.DEATH:
            return <DeathScreen />;
        case SCREENS.VICTORY:
            return <VictoryScreen />;
        default:
            return <div className="text-center">ERROR: SCREEN NOT FOUND</div>;
    }
};

export default ScreenManager;
