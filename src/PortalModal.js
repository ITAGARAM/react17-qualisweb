import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class PortalModal extends Component {
    render() {
        return ReactDOM.createPortal(
            <>
                {this.props.children || ""}
                <a href={() => false} hidden={true} id="download_data" download>""</a>
            </>,
            document.getElementById('portal-root')
        );
    }

}

export default PortalModal;