import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from '../navbar';
import { ContractCreationPage, ContractDetailsPage, ContractsPage, DialogPage, DialogsPage, HomePage, InvitationsPage, LoginPage } from '../pages';
import ErrorBoundry from "../error-boundry";


import './app.css';


const App = () => {
    return (
        <ErrorBoundry>
            <BrowserRouter>
                <Navbar/>
                <Switch>
                    <Route path="/" exact component={HomePage}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/contract/create" component={ContractCreationPage}/>
                    <Route path="/contracts" component={ContractsPage}/>
                    <Route path="/contract/:id" component={ContractDetailsPage}/>
                    <Route path="/invitations" component={InvitationsPage}/>
                    <Route path="/dialogs" component={DialogsPage}/>
                    <Route path="/dialog/:id" component={DialogPage}/>
                    <Route
                        render={() => <h2> Page not found </h2>}/>
                </Switch>
            </BrowserRouter>
        </ErrorBoundry>
    );
};


export default App;
