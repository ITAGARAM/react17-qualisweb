import FormSelectSearch from "../../components/form-select-search/form-select-search.component";
import { Row, Col } from "react-bootstrap";
import React, { Component } from 'react'
import { injectIntl } from "react-intl";

class AddProductManufacturer extends Component {
    render() {
        const { Manufacturer, ManufacturerSite, Eprotocol } = this.props;
        return (
            <Row>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_MANUFACTURERNAME" })}
                        isSearchable={true}
                        name={"nmanufcode"}
                        isDisabled={false}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={Manufacturer}
                        alphabeticalSort="true"
                        optionId="nmanufcode"
                        optionValue="smanufname"
                        value={this.props.selectedRecord ? this.props.selectedRecord["nmanufcode"] : ""}
                        defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nmanufcode"] : ""}
                        showOption={true}
                        onChange={(event) => this.props.GetManufactureSite(event, 'nmanufcode')}>
                    </FormSelectSearch>
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_MANUFACTURERSITENAME" })}
                        isSearchable={true}
                        name={"nmanufsitecode"}
                        isDisabled={false}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={ManufacturerSite}
                        alphabeticalSort="true"
                        optionId="nmanufsitecode"
                        optionValue="smanufsitename"
                        value={this.props.selectedRecord ? this.props.selectedRecord["nmanufsitecode"] : ""}
                        defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nmanufsitecode"] : ""}
                        showOption={true}
                        onChange={(event) => this.props.onComboChange(event, 'nmanufsitecode')}>
                    </FormSelectSearch>
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_EPROTOCOL" })}
                        isSearchable={true}
                        name={"neprotocolcode"}
                        isDisabled={false}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={Eprotocol}
                        alphabeticalSort="true"
                        optionId="neprotocolcode"
                        optionValue="seprotocolname"
                        value={this.props.selectedRecord ? this.props.selectedRecord["neprotocolcode"] : ""}
                        defaultValue={this.props.selectedRecord ? this.props.selectedRecord["neprotocolcode"] : ""}
                        showOption={true}
                        onChange={(event) => this.props.onComboChange(event, 'neprotocolcode')}>
                    </FormSelectSearch>
                </Col>
            </Row>

        )
    }
}
export default injectIntl(AddProductManufacturer);