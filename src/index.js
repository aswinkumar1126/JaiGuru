import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';


const clientId = "1059348243794-1kjqfmr81g2uv2t9o0hgdoak7p20i9bm.apps.googleusercontent.com";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


reportWebVitals();
