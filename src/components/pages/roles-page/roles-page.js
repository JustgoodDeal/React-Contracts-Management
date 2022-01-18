import React, {useContext, useEffect, useReducer} from 'react';

import CmService from '../../../services'
import {FETCH_EMPLOYEE_ROLES_SUCCESS, SET_EMPLOYEE_ROLE, SET_ERROR, SET_SUCCESS} from '../../../reducers/types'
import { AuthContext, LoadingAndErrorContext } from '../../../context'
import { RolesReducer } from "../../../reducers";
import {Select} from "../../ui";
import ErrorIndicator from "../../error-indicator";
import Spinner from "../../spinner";

import './roles-page.css';


const RolesPage = () => {
    const initialState = {
        employeesInfo: [],
        success: '',
        validationError: ''
    };
    const [state, dispatch] = useReducer(RolesReducer, initialState);

    const { loading, error, disableLoading, setLoading, handleError } = useContext(LoadingAndErrorContext);
    const { userId } = useContext(AuthContext);

    const service = new CmService();

    const validateRoles = () => {
        const { employeesInfo } = state
        let selectedRolesCount = {director: 0, economist: 0, lawyer: 0}
        let errorText = 'No changes were detected';
        for (let employeeInfo of employeesInfo) {
            if (employeeInfo['savedRole'] !== employeeInfo['selectedRole']) {
                errorText = ''
            }
            selectedRolesCount[employeeInfo['selectedRole']] += 1;
        }
        if (!Object.values(selectedRolesCount).every(element => element > 0)) {
            errorText = 'It should be minimum 1 employee for each role in the company'
        }
        let maxima = {director: 1, economist: 3, lawyer: 3}
        for (let role of Object.keys(selectedRolesCount)) {
            if (selectedRolesCount[role] - maxima[role] > 0) {
                errorText = 'Exceeded maximum number of employee per role (maxima: 3 economists, 3 lawyers, 1 director)'
            }
        }
        return errorText
    }

    const getEmployeesRoles = () => {
        setLoading();
        service.getEmployeesRoles(userId)
            .then(employeesInfo => {
                disableLoading();
                dispatch({
                    type: FETCH_EMPLOYEE_ROLES_SUCCESS,
                    payload: employeesInfo
                })
            })
            .catch(handleError)
    }

    const handleRoleChange = value => {
        dispatch({
            type: SET_EMPLOYEE_ROLE,
            payload: JSON.parse(value)
        })
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        let errorText = validateRoles()
        if (errorText) {
            dispatch({
                type: SET_ERROR,
                payload: errorText
            });
        } else {
            let employeesInfoCopy = JSON.parse(JSON.stringify(state.employeesInfo));
            const employeesInfo = employeesInfoCopy.map(employeeInfo => {
                const { employeeId, selectedRole } = employeeInfo
                return {employeeId, selectedRole}
            })
            service.updateEmployeesRoles(employeesInfo)
                .then(response => {
                    if (response === 'Updated') {
                        dispatch({
                            type: SET_SUCCESS,
                            payload: 'Roles were successfully updated'
                        });
                        setTimeout(() => {
                            getEmployeesRoles()
                        }, 1000);
                    }
                })
                .catch(handleError)
        }
    }

    useEffect(() => {
        getEmployeesRoles()
    }, []);

    if (error) {
        return <ErrorIndicator />
    }
    if (loading) {
        return <Spinner />
    }

    let roleChoices = [
        {value: {role: 'lawyer'}, text: 'lawyer'},
        {value: {role: 'economist'}, text: 'economist'},
        {value: {role: 'director'}, text: 'director'}
    ]
    const { employeesInfo, success, validationError } = state
    const colorClass = validationError ? 'alert-danger' : 'alert-success'
    const notificationDivClass = `alert ${colorClass} text-center ${validationError  || success ? 'visible' : 'invisible'} mt-2`
    return (
        <div className="mt-5">
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success" form="rolesChangeForm">Save changes</button>
            </div>
            < div className={notificationDivClass} role="alert">
                {validationError || success || 'Text'}
            </div>
            <form id='rolesChangeForm' onSubmit={handleFormSubmit}>
                    {
                        employeesInfo.map(employeeInfo => {
                            const { employeeId, employeeName, selectedRole } = employeeInfo
                            let roleChoicesCopy = JSON.parse(JSON.stringify(roleChoices))
                            for (let choice of roleChoicesCopy) {
                                choice['value']['employeeId'] = employeeId
                            }
                            return (
                                <div className='d-flex justify-content-center mb-2 employee-row' key={employeeId}>
                                    <p className="employee-name align-self-center m-0">{employeeName}</p>
                                    <Select
                                        options={roleChoicesCopy}
                                        convertOptionsToJson={true}
                                        value={JSON.stringify({role: selectedRole, employeeId})}
                                        handleChange={handleRoleChange}/>
                                </div>
                            )
                        })
                    }
            </form>
        </div>
    )
};


export default RolesPage;
