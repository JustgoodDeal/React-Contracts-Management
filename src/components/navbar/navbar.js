import React, { Fragment, useContext, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthContext, NavbarContext, PaginationAndSortingContext } from "../../context";

import './navbar.css';


const Navbar = () => {
    const { userName, logOut } = useContext(AuthContext);
    const { links, changeActiveLink, updateNewItems } = useContext(NavbarContext);
    const { clearPaginationAndSorting } = useContext(PaginationAndSortingContext);
    let history = useHistory();

    const handleLogOut = () => {
        logOut();
        changeActiveLink('Home');
        history.push("/");
    };

    let oneTimeIntervalCount = 0;
    useEffect(() => {
        const oneTimeInterval = setInterval(() => {
            if (userName) {
                if (oneTimeIntervalCount === 1) {
                    clearInterval(oneTimeInterval)
                } else {
                    updateNewItems();
                    oneTimeIntervalCount += 1;
                }
            }
        }, 0);
        const backgroundInterval = setInterval(() => {
            if (userName) {
                updateNewItems()
            }
        }, 30000);
        return () => clearInterval(backgroundInterval);
    }, [userName]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="navbar-nav container-fluid justify-content-between">
                <Link to="/" className={`home-link ${links[0].className}`}
                         onClick={() => changeActiveLink('Home')} >
                    Home
                </Link>
                {
                    (userName)
                        ? (
                            <Fragment>
                                <div className="d-flex flex-row" onClick={() => clearPaginationAndSorting()}>
                                    {
                                        links.slice(1, -1).map((link, ind) => {
                                            const { linkTo, className, label, newItem } = link;
                                            return (
                                                <div key={ind} className="d-flex flex-column align-items-center">
                                                    <FontAwesomeIcon icon={faEnvelope} style={{ color: 'yellow' }}
                                                                     className={newItem ? "visible" : "invisible"} />
                                                    <Link key={ind}
                                                             to={linkTo}
                                                             className={`${className} pt-0`}
                                                             onClick={() => changeActiveLink(label)}
                                                    >
                                                        {label}
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    <span className="font-weight-bold"> {userName} </span>
                                    <a className="nav-link active text-center pt-0" href="#"
                                       onClick={handleLogOut} >
                                           Log out
                                    </a>
                                </div>
                            </Fragment>
                        )
                        : <Fragment>
                            <div className="invisible">
                                <span>username</span>
                                <a className="nav-link pt-0" href="#">username</a>
                            </div>
                            <div>
                                <Link to="/login" className={links[links.length - 1].className}
                                      onClick={() => changeActiveLink('Log in')} >
                                    Log in
                                </Link>
                            </div>
                        </Fragment>
                }
            </div>
        </nav>
    );
};


export default Navbar;
