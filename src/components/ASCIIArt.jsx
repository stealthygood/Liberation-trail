import React from 'react';

const ASCIIArt = ({ art, className = '' }) => {
    return (
        <pre className={`ascii-art ${className}`} style={{ lineHeight: '1rem', whiteSpace: 'pre', overflowX: 'hidden' }}>
            {art}
        </pre>
    );
};

export default ASCIIArt;
