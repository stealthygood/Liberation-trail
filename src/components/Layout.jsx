import React from 'react';
import WarAssistant from './WarAssistant';
import StatusBar from './StatusBar';

const Layout = ({ children }) => {
    return (
        <div className="crt-container">
            <div className="screen-flicker">
                <StatusBar />
                {children}
                <WarAssistant />
            </div>
        </div>
    );
};

export default Layout;
