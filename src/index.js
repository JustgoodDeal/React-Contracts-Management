import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { AuthProvider } from './context';
import App from './components/app';

const app = (
    <AuthProvider>
        <App/>
    </AuthProvider>
);

ReactDOM.render(app,
    document.getElementById('root'));
