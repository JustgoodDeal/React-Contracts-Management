import React from 'react';
import { NavLink } from "react-router-dom";

import './navbar.css';


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="navbar-nav container-fluid justify-content-between">
                <NavLink to="/" exact={true} className="nav-link home-link">Home</NavLink>
                <div className="d-flex flex-row">
                    <NavLink to="/contract/create" className="nav-link">Create contract</NavLink>
                    <NavLink to="/contracts" className="nav-link">Contracts</NavLink>
                    <NavLink to="/invitations" className="nav-link">Invitations</NavLink>
                    <NavLink to="/dialogs" className="nav-link">Dialogs</NavLink>
                </div>
                <NavLink to="/login" className="nav-link">Log in</NavLink>
            </div>
        </nav>
    );
};


export default Navbar;
