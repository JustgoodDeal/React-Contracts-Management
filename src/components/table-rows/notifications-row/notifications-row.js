import React, {useContext} from 'react';
import { Link } from "react-router-dom";

import { NavbarContext } from '../../../context'

import './notifications-row.css';


const NotificationsRow = ({ notification, followedFrom, handleShowNotificationClick }) => {
    const { changeActiveLink } = useContext(NavbarContext);

    const { id, contractId, creationDate, isRead, text } = notification;
    const [notificationIsRead, btnClass, btnText] = isRead ?
        ['Yes', 'btn-outline-success', 'View'] :
        ['No', 'btn-danger', 'Read'];
    return (
        <tr>
            {
                followedFrom !== 'contracts' &&
                    <td className="text-center align-middle">
                        {
                            isRead
                                ? <Link to={`/contract/${contractId}`}
                                        onClick={() => changeActiveLink('Contracts')} >
                                    {contractId}
                                  </Link>
                                : <span>{contractId}</span>
                        }
                    </td>
            }
            <td className="text-center align-middle">{creationDate}</td>
            <td className="text-center align-middle">{notificationIsRead}</td>
            <td className="text-center align-middle">
                <button type="button" className={`btn ${btnClass} font-weight-bold`} data-toggle="modal"
                        data-target="#notificationModal" data-backdrop="static" data-keyboard="false"
                        onClick={() => handleShowNotificationClick({notificationId: id, contractId, isRead, text})}>
                    {btnText}
                </button>
            </td>
        </tr>
    )
};


export default NotificationsRow;
