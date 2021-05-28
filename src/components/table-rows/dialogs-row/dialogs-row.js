import React, {useContext} from 'react';
import { Link } from "react-router-dom";

import DialogMessage from "../../dialog-message";
import { NavbarContext } from '../../../context'

import './dialogs-row.css';


const DialogsRow = ({ message }) => {
    const { changeActiveLink } = useContext(NavbarContext);

    const { contractId } = message;
    return (
        <tr>
            <td className="text-center align-middle w-25">
                <Link to={`/contract/${contractId}`}
                      onClick={() => changeActiveLink('Contracts')} >
                    {contractId}
                </Link>
            </td>
            <td className="text-center">
                <DialogMessage
                    message={message}
                    followedFrom='dialogs'
                />
            </td>
        </tr>
    )
};


export default DialogsRow;
