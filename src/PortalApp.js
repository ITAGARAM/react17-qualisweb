import React from 'react';
import ReactDOM from 'react-dom';
import PortalModal from './PortalModal';

function PortalApp() {
    return ReactDOM.createPortal( <PortalModal />, document.getElementById("portal-root"));
}

export default PortalApp;