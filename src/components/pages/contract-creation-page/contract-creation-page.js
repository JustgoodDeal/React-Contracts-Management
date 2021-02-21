import React from 'react';

import './contract-creation-page.css';


const ContractCreationPage = () => {
    return (
        <div>
            <div className="d-flex justify-content-center mt-5">
                <button className="btn btn-success">Create</button>
            </div>
            <form>
                <div className="d-flex mt-5">
                    <div className="d-flex flex-column w-50">
                        <div className="input-group-append">
                            <label className="input-group-text" htmlFor="companiesSelect">Select companies to deal with</label>
                        </div>
                        <select className="custom-select w-50 pb-0" multiple id="companiesSelect">
                            <option value="editing"> Company1</option>
                            <option value="reconciliation">Company2</option>
                            <option value="signing"> Company3</option>
                        </select>
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="contractText">Contract text</label>
                        <textarea className="form-control" id="contractText" placeholder="Start typing here" style={{height: '300px'}}></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
};


export default ContractCreationPage;
