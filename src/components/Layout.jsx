import React, { useEffect } from 'react';
import WarAssistant from './WarAssistant';
import StatusBar from './StatusBar';
import Anthem from './Anthem';
import { useGame } from '../context/GameContext';
import { setMuted } from '../utils/SoundManager';

const Layout = ({ children }) => {
    const { state } = useGame();
    const { soundEnabled } = state;

    useEffect(() => {
        setMuted(!soundEnabled);
    }, [soundEnabled]);

    return (
        <div className="crt-container">
            <Anthem />
            <div className="screen-flicker">
                <StatusBar />
                {children}
                <WarAssistant />
            </div>
        </div>
    );
};

export default Layout;
