import React, { Fragment, useContext } from 'react';
import { NavLink, useHistory } from "react-router-dom";

import { AuthContext } from "../../context";

import './navbar.css';


const Navbar = () => {

    const { userName, logOut } = useContext(AuthContext);
    let history = useHistory();

    const handleLogOut = () => {
        logOut();
        history.push("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="navbar-nav container-fluid justify-content-between">
                <NavLink to="/" exact={true} className="nav-link home-link">Home</NavLink>
                {
                    (userName)
                        ? (
                            <Fragment>
                                <div className="d-flex flex-row">
                                    <NavLink to="/contract/create" className="nav-link">Create contract</NavLink>
                                    <NavLink to="/contracts" className="nav-link">Contracts</NavLink>
                                    <NavLink to="/invitations" className="nav-link">Invitations</NavLink>
                                    <NavLink to="/dialogs" className="nav-link">Dialogs</NavLink>
                                </div>
                                <div>
                                    <span className="font-weight-bold"> {userName} </span>
                                    <a className="nav-link active" href="#"
                                       onClick={handleLogOut} >
                                           Log out
                                    </a>
                                </div>
                            </Fragment>
                        )
                        : <NavLink to="/login" className="nav-link">Log in</NavLink>
                }
            </div>
        </nav>
    );
};


export default Navbar;
