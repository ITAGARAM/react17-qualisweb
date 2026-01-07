import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';


class AddPrinter extends Component {
    render() {
        return (
            <Row>
                 <Col md={12}>
                <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_BARCODENAME" })}
                            name={"sbarcodename"} 
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={this.props.selectedPrinterData ? this.props.selectedPrinterData["sbarcodename"] : ""}
                            options={this.props.barcode}
                            optionId="sbarcodename"
                            optionValue="sbarcodename"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            closeMenuOnSelect={true}
                            alphabeticalSort={false}
                            as={"select"}
                            onChange={(event) => this.props.PrinterChange(event, "sbarcodename")} 
                        />
                </Col>
                <Col md={12}>
                <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_PRINTERNAME" })}
                            name={"sprintername"} 
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={this.props.selectedPrinterData ? this.props.selectedPrinterData["sprintername"] : ""}
                            options={this.props.printer}
                            optionId="sprintername"
                            optionValue="sprintername"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            closeMenuOnSelect={true}
                            alphabeticalSort={false}
                            as={"select"}
                            onChange={(event) => this.props.PrinterChange(event, "sprintername")} 
                        />
                </Col>
            </Row>
        );
    }
}

export default injectIntl(AddPrinter);