import React from 'react';
import WarAssistant from './WarAssistant';
import Anthem from './Anthem';
import SoundToggle from './SoundToggle';
import StatusBar from './StatusBar';

const Layout = ({ children }) => {
    return (
        <div className="crt-container">
            <div className="screen-flicker">
                <StatusBar />
                {children}
                <SoundToggle />
                <WarAssistant />
                <Anthem />
            </div>
        </div>
    );
};

export default Layout;
