import React from 'react';

import './login-page.css';


const LoginPage = () => {
    return (
        <form className="authorization-form d-flex flex-column align-items-center">
            <div className="d-flex align-items-center">
                <label htmlFor="usernameLogin" className="fw-bold mr-3">Username</label>
                <input type="text" id="usernameLogin" className="form-control" placeholder="Enter your username" name="login"/>
            </div>
            <button className="btn btn-success mt-4">Log in</button>
        </form>
    )
};


export default LoginPage;
