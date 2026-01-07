import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import Barcode from 'react-barcode';
// import { intl } from './App';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import ReactToPrint from 'react-to-print';
// import { toast } from 'react-toastify';

class BarcodeGeneratorComponent extends Component {

    constructor(props) {
        super(props);
        this.printRef = React.createRef();
    }


    handlePrintButtonClick = () => {
        //console.log('Print button clicked!');
        const content = this.printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write('<html><head><title>Print Barcode</title><style>@media print { body { font-size: 45px; font-weight: bold; } }</style></head><body>' + this.props.additionalDesignsToPrint
            + '<br>'+ content + '</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };

    render() {
        return (
            <div className="barcode-print-container">
                <div ref={this.printRef}>
                    <Barcode
                        value={this.props.barcodeData}
                        format={this.props.format}
                        width={this.props.width}
                        height={this.props.height}
                        background={this.props.background}
                        ref={(event) => (this.componentRef = event)}
                        textAlign={this.props.textAlign}
                        fontSize={this.props.fontSize}
                        fontOption={this.props.fontOption}
                        textPosition={this.props.textPosition}
                        margin={this.props.margin}
                        marginTop={this.props.marginTop}
                        marginBottom={this.props.marginBottom}
                        marginLeft={this.props.marginLeft}
                        marginRight={this.props.marginRight}
                        flat={this.props.flat}
                        lineColor={this.props.lineColor}
                        displayValue={this.props.displayValue}
                    />
                </div>
                {this.props.printBarcode &&
                    <Button className="btn-user btn-primary-blue" onClick={this.handlePrintButtonClick}>
                        <FontAwesomeIcon icon={faPrint} /> { }
                        <FormattedMessage id='IDS_PRINT' defaultMessage='Print' />
                    </Button>
                }
            </div>
        );
    }
}

export default injectIntl(BarcodeGeneratorComponent);