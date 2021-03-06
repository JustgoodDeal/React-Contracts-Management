import React, { Fragment, useContext } from 'react';
import {BrowserRouter, Route, Switch as BaseSwitch } from 'react-router-dom';
import flattenChildren from "react-flatten-children";

import ErrorBoundry from "../error-boundry";
import { AuthContext, LoadingAndErrorProvider } from '../../context';
import Navbar from '../navbar';
import { ContractCreationPage, ContractDetailsPage, ContractsPage, DialogPage, DialogsPage, HomePage, InvitationsPage, LoginPage } from '../pages';

import './app.css';


const Switch = ({ children }) => (
    <BaseSwitch>{flattenChildren(children)}</BaseSwitch>
);

const App = () => {

    const { userName } = useContext(AuthContext);

    return (
        <ErrorBoundry>
            <LoadingAndErrorProvider>
                <BrowserRouter>
                    <Navbar/>
                    <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/login" component={LoginPage}/>
                        {
                            (userName)
                                ? (
                                    <Fragment>
                                        <Route path="/contract/create" component={ContractCreationPage}/>
                                        <Route path="/contracts" component={ContractsPage}/>
                                        <Route path="/contract/:id" component={ContractDetailsPage}/>
                                        <Route path="/invitations" component={InvitationsPage}/>
                                        <Route path="/dialogs" component={DialogsPage}/>
                                        <Route path="/dialog/:id" component={DialogPage}/>
                                    </Fragment>
                                )
                                : null
                        }
                        <Route render={() => <h2> Page not found </h2>}/>
                    </Switch>
                </BrowserRouter>
            </LoadingAndErrorProvider>
        </ErrorBoundry>
    );
};


export default App;
