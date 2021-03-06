import React from 'react';

import './spinner.css';

const Spinner = () => {
  return (
    <div className="lds-css d-flex justify-content-center">
      <div className="lds-double-ring">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
