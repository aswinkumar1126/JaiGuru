import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function GoogleLoginButton() {
    const handleSuccess = (credentialResponse) => {
        console.log('Google credential response:', credentialResponse);
        // credentialResponse contains a JWT token, you can send it to your backend for verification and user creation/login
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
}

export default GoogleLoginButton;
