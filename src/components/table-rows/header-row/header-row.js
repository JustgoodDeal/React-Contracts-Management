import React from 'react';

import './header-row.css';
import TableHeader from "../../table-header";


const HeaderRow = ({ headers, handleFieldClick }) => {
    return (
        <tr>
            {
                headers.map((header, ind) => {
                    return (
                        <TableHeader
                            key={ind}
                            header={header}
                            handleFieldClick={handleFieldClick} />
                    );
                })
            }
        </tr>
    )
};


export default HeaderRow;
