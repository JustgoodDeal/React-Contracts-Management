import React, { Fragment, useContext, useEffect, useReducer } from 'react';

import { AuthContext, LoadingAndErrorContext } from '../../../context'
import CmService from '../../../services'
import { CLEAR_CONTRACT_TO_DELETE, FETCH_CONTRACTS_SUCCESS, SET_CONTRACT_TO_DELETE } from '../../../reducers/types'
import { ContractsRow, HeaderRow } from '../../table-rows'
import { ConfirmationModal } from '../../modals'
import { ContractsReducer } from "../../../reducers";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";


import './contracts-page.css';


const ContractsPage = () => {
    const initialState = {
        contracts: [],
        contractToDelete: '',
    };
    const [state, dispatch] = useReducer(ContractsReducer, initialState);

    const service = new CmService();
    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);

    const { userId } = useContext(AuthContext);

    const handleDeleteClick = id => {
        dispatch({
            type: SET_CONTRACT_TO_DELETE,
            payload: id
        });
    };

    const confirmDelete = () => {
        service.deleteContract(state.contractToDelete)
            .then((result) => {
                if (result === 'Deleted') {
                    setTimeout(() => {
                        dispatch({
                            type: CLEAR_CONTRACT_TO_DELETE
                        });
                        setLoading();
                        service.getContracts(userId)
                            .then((contracts) => {
                                disableLoading();
                                dispatch({
                                    type: FETCH_CONTRACTS_SUCCESS,
                                    payload: contracts
                                })
                            })
                            .catch(handleError)
                    }, 500);
                }
            })
            .catch(handleError)
    };

    const cancelDelete = () => {
        dispatch({
            type: CLEAR_CONTRACT_TO_DELETE
        });
    };

    useEffect(() => {
        setLoading();
        service.getContracts(userId)
            .then((contracts) => {
                disableLoading();
                dispatch({
                    type: FETCH_CONTRACTS_SUCCESS,
                    payload: contracts
                })
            })
            .catch(handleError)
    }, []);

    const { contracts } = state;

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    const thLabels = ['ID', 'Creation date', 'Companies involved', 'Status', 'Actions'];
    return (
        <Fragment>
            <table className="table mt-4">
                <thead>
                <HeaderRow
                    labels={thLabels} />
                </thead>
                <tbody>
                {
                    contracts.map((contract) => {
                        return (
                            <ContractsRow
                                key={contract.id}
                                contract={contract}
                                handleDeleteClick={handleDeleteClick} />
                        )
                    })
                }
                </tbody>
            </table>
            <ConfirmationModal
                id='confirmationModal'
                bodyText='Selected contract will be permanently removed'
                btnText='Remove'
                handleCancel={cancelDelete}
                handleConfirm={confirmDelete} />
        </Fragment>
    )
};


export default ContractsPage;
