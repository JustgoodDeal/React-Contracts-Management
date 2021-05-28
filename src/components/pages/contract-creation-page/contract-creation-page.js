import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React, { useContext, useEffect, useReducer } from 'react';
import { useHistory } from "react-router-dom";

import { AuthContext, LoadingAndErrorContext, NavbarContext } from '../../../context'
import CmService from '../../../services'
import { ADD_CONTRACT_COMPANIES, CHANGE_CONTRACT_TEXT, FETCH_COMPANIES_SUCCESS, SET_ERROR } from '../../../reducers/types'
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
        validationError: ''
    };
    const [state, dispatch] = useReducer(ContractCreationReducer, initialState);

    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { changeActiveLink } = useContext(NavbarContext);
    const { userId } = useContext(AuthContext);
    let history = useHistory();

    const service = new CmService();

    const contractIsValid = () => {
        const { defaultCompanies, contract: {text, companies}  } = state;
        const companiesInvolvedNumber = defaultCompanies.length + companies.length;
        let errorText = '';
        if (!text) {
            errorText = "Contract text can't be empty"
        } else if (companiesInvolvedNumber < 2) {
            errorText = "Contract should be drawn up between 2 companies or more"
        }
        if (errorText) {
            dispatch({
                type: SET_ERROR,
                payload: errorText
            });
        }
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

    const handleTextChange = (event, editor) => {
        dispatch({
            type: CHANGE_CONTRACT_TEXT,
            payload: editor.getData()
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
                .then((contractId) => {
                    const url = contractId ? `/contract/${contractId}` : "/contracts";
                    setTimeout(() => {
                        changeActiveLink('Contracts');
                        history.push(url)
                    }, 500);
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

    const { defaultCompanies, companiesToChoose, validationError } = state;
    const defaultCompaniesNames = defaultCompanies.map((company) => company.name);
    const validationDivClass = `alert alert-danger text-center ${validationError ? 'visible' : 'invisible'} mt-2`;
    return (
        <div>
            <div className="d-flex justify-content-center mt-5">
                <button type="submit" className="btn btn-success" form="contractCreationForm">Create</button>
            </div>
            < div className={validationDivClass} role="alert">
                {validationError || 'Text'}
            </div>
            <form id='contractCreationForm' onSubmit={handleFormSubmit}>
                <div className="d-flex mt-2">
                    <div className="d-flex flex-column w-50">
                        <div>
                            <p className="font-weight-bold">The companies to deal with:</p>
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
                    <div className="form-group contract-text">
                        <p className="font-weight-bold text-center">Contract text:</p>
                        <CKEditor
                        editor={ClassicEditor}
                        onChange={handleTextChange} />
                    </div>
                </div>
            </form>
        </div>
    )
};


export default ContractCreationPage
