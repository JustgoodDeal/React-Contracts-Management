import React, { useContext, useEffect, useReducer } from 'react';
import { useHistory } from "react-router-dom";

import { AuthContext, LoadingAndErrorContext } from '../../../context'
import CmService from '../../../services'
import { ADD_CONTRACT_COMPANIES, CHANGE_CONTRACT_TEXT, FETCH_COMPANIES_SUCCESS } from '../../../reducers/types'
import { ContractCreationReducer } from '../../../reducers'
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";

import './contract-creation-page.css';


const ContractCreationPage = () => {
    const initialState = {
        defaultCompanies: [],
        companiesToChoose: [],
        contract: {
            text: '',
            companies: []
        },
    };
    const [state, dispatch] = useReducer(ContractCreationReducer, initialState);

    const service = new CmService();
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);

    const { userId } = useContext(AuthContext);

    let history = useHistory();

    const contractIsValid = () => {
        const { defaultCompanies, contract: {text, companies}  } = state;
        const companiesInvolvedNumber = defaultCompanies.length +companies.length;
        return !!(text && companiesInvolvedNumber >= 2);
    };

    const handleCompaniesChange = event => {
        let companies = [];
        for (let option of event.target.options) {
            if (option.selected) {
                companies.push({
                    id: option.value,
                    name: option.textContent
                });
            }
        }
        dispatch({
            type: ADD_CONTRACT_COMPANIES,
            payload: companies
        });
    };

    const handleTextChange = event => {
        dispatch({
            type: CHANGE_CONTRACT_TEXT,
            payload: event.target.value
        });
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        if (contractIsValid()) {
            const { defaultCompanies, contract  } = state;
            const { text, companies } = contract;
            const defaultCompaniesCopy = defaultCompanies.slice().map((company) => {
                return {id: company._id, name: company.name}
            });
            const chosenCompanies = companies.slice().concat(defaultCompaniesCopy);
            service.createContract({text, companies: chosenCompanies})
                .then((result) => {
                    if (result === 'Created') {
                        setTimeout(() => history.push('/contracts'), 500);
                    }
                })
                .catch(handleError)
        }
    };

    useEffect(() => {
        setLoading();
        service.getCompanies(userId)
            .then((companies) => {
                disableLoading();
                dispatch({
                    type: FETCH_COMPANIES_SUCCESS,
                    payload: companies
                })
            })
            .catch(handleError)
    }, []);

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    const { defaultCompanies, companiesToChoose } = state;
    const defaultCompaniesNames = defaultCompanies.map((company) => company.name);

    return (
        <div>
            <div className="d-flex justify-content-center mt-5">
                <button type="submit" className="btn btn-success" form="contractCreationForm">Create</button>
            </div>
            <form id='contractCreationForm' onSubmit={handleFormSubmit}>
                <div className="d-flex mt-5">
                    <div className="d-flex flex-column w-50">
                        <div>
                            <p>Choose companies to deal with:</p>
                            <p>{defaultCompaniesNames.join(', ')}</p>
                        </div>
                        <select className="custom-select w-50 pb-0" multiple id="companiesSelect"
                        onChange={handleCompaniesChange} >
                            {
                                companiesToChoose.map((company, ind) => {
                                    return (
                                        <option
                                            key={ind}
                                            value={company._id} >
                                            {company.name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="contractText">Contract text</label>
                        <textarea className="form-control" id="contractText" placeholder="Start typing here" style={{height: '300px'}}
                        onChange={handleTextChange}></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
};


export default ContractCreationPage
