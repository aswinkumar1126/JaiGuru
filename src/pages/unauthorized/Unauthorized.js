import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{
            padding: '2rem',
            textAlign: 'center',
            marginTop: '5rem'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#cc0000' }}>Access Denied</h1>
            <p style={{ fontSize: '1.2rem' }}>
                You do not have permission to view this page.
            </p>
        </div>
    );
};

export default Unauthorized;
