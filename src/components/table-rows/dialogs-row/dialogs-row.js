import React from 'react';
import { useHistory } from "react-router-dom";

import DialogMessage from "../../dialog-message";

import './dialogs-row.css';


const DialogsRow = ({ contractId, messageEntities }) => {
    let history = useHistory();
    return (
        <tr onClick={() => history.push(`/dialog/${contractId}`)}>
            <td className="text-center align-middle w-25">{contractId}</td>
            <td className="text-center">
                <DialogMessage
                    messageEntities={messageEntities} />
            </td>
        </tr>
    )
};


export default DialogsRow;
