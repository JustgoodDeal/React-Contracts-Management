import React, { Fragment } from 'react';


const Accordion = ({ collapseId, headerText, children }) => {
    return (
        <Fragment>
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="collapse" data-target={`#${collapseId}`} aria-expanded="false" >
                {headerText}
            </button>
            <div className="collapse" id={collapseId}>
                <div className="card card-body p-0">
                    {children}
                </div>
            </div>
        </Fragment>
    )
};


export default Accordion;
