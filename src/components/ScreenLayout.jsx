import React from 'react';

const ScreenLayout = ({
    children,
    className = "",
    center = false,
    contentMaxW = "max-w-2xl"
}) => {
    return (
        <div className={`flex-1 flex flex-col p-4 md:p-8 overflow-auto ${center ? 'items-center justify-center' : ''} ${className}`}>
            <div className={`w-full ${center ? 'flex flex-col items-center' : ''} ${contentMaxW}`}>
                {children}
            </div>
        </div>
    );
};

export default ScreenLayout;
