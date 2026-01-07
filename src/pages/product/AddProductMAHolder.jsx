import React, { Component } from 'react';
import FormSelectSearch from "../../components/form-select-search/form-select-search.component";
import { Row, Col } from "react-bootstrap";
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import MultiColumnComboSearch from '../../components/multi-column-combo-search/multi-column-combo-search';
import { injectIntl } from 'react-intl';


class AddProductMAHolder extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            saddress1: "",
            saddress2: "",
            scountryname: "",
            saddress3: ""
        })
    }

    render() {
        const { CertificateType, ContainerType, LicenseAuthority, MAHolder } = this.props;
        return (
            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_PRODUCTCERTIFICATENAME" })}
                                name="sproductcertificatename"
                                type="text"
                                isMandatory={"*"}
                                required={true}
                                maxLength="255"
                                value={this.props.selectedRecord["sproductcertificatename"]}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_PRODUCTCERTIFICATENAME" })}
                            />
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_TRADENAME" })}
                                name="sproducttradename"
                                type="text"
                                maxLength="100"
                                onChange={(event) => this.props.onInputOnChange(event)}
                                value={this.props.selectedRecord["sproducttradename"]}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_TRADENAME" })}
                            />
                        </Col>
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CERTIFICATETYPE" })}
                                isSearchable={true}
                                name={"ncertificatetypecode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={CertificateType}
                                alphabeticalSort="true"
                                optionId="ncertificatetypecode"
                                optionValue="scertificatetype"
                                value={this.props.selectedRecord ? this.props.selectedRecord["ncertificatetypecode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ncertificatetypecode"] : ""}
                                showOption={true}
                                onChange={(event) => this.props.onComboChange(event, 'ncertificatetypecode')}>
                            </FormSelectSearch>
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_LICENSENUMBER" })}
                                name="slicencenumber"
                                type="text"
                                isMandatory={true}
                                required={true}
                                maxLength="50"
                                value={this.props.selectedRecord["slicencenumber"]}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_LICENSENUMBER" })}
                            />
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_DOSEPERCONTAINER" })}
                                name="sdosagepercontainer"
                                type="text"
                                isMandatory={true}
                                required={true}
                                maxLength="50"
                                value={this.props.selectedRecord["sdosagepercontainer"]}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_DOSEPERCONTAINER" })}
                            />
                        </Col>
                        <Col md={12} >
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                                isSearchable={true}
                                name={"ncontainertypecode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={ContainerType}
                                optionId="ncontainertypecode"
                                optionValue="scontainertype"
                                value={this.props.selectedRecord ? this.props.selectedRecord["ncontainertypecode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ncontainertypecode"] : ""}
                                showOption={true}
                                onChange={(event) => this.props.onComboChange(event, 'ncontainertypecode')}>
                            </FormSelectSearch>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col md={12} >
                            {Object.keys(this.props.selectedRecord).length > 0 &&
                                <MultiColumnComboSearch data={LicenseAuthority}
                                    visibility='show-all'
                                    fieldToShow={["sauthorityname", "sauthorityshortname"]}
                                    selectedId={[this.props.selectedRecord["nauthoritycode"]]}
                                    value={this.props.selectedRecord ? [this.props.selectedRecord] : []}
                                    showInputkey="sauthorityshortname"
                                    idslabelfield={["IDS_AUTHORITYNAME", "IDS_ABBREVIATIONNAME"]}
                                    labelledBy="IDS_LICENSEAUTHORITY"
                                    getValue={(value) => this.props.onMultiColumnValue(value, ["nauthoritycode", "sauthorityshortname"])}
                                    singleSelection={true}
                                    isMandatory={true}
                                />
                            }
                        </Col>

                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_MAHNAME" })}
                                isSearchable={true}
                                name={"nmahcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={MAHolder}
                                optionId="nmahcode"
                                optionValue="smahname"
                                value={this.props.selectedRecord ? this.props.selectedRecord["nmahcode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nmahcode"] : ""}
                                showOption={true}
                                onChange={(event) => this.props.onMAHChange(event, 'nmahcode')}>
                            </FormSelectSearch>
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={this.props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                                name="saddress1"
                                type="text"
                                value={this.state.saddress1 === "" ? this.props.selectedRecord.saddress1 ? this.props.selectedRecord.saddress1 : "" : this.state.saddress1}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                                readOnly={true}
                            />
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={this.props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                                name="saddress2"
                                type="text"
                                value={this.state.saddress2 === "" ? this.props.selectedRecord.saddress2 ? this.props.selectedRecord.saddress2 : "" : this.state.saddress2}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                                readOnly={true}
                            />
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={this.props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                                name="saddress3"
                                type="text"
                                value={this.state.saddress3 === "" ? this.props.selectedRecord.saddress3 ? this.props.selectedRecord.saddress3 : "" : this.state.saddress3}
                                //   onChange={(event)=>this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                                readOnly={true}
                            />
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_COUNTRYNAME" })}
                                name="scountryname"
                                type="text"
                                isMandatory={"*"}
                                required={true}
                                value={this.state.scountryname === "" ? this.props.selectedRecord.scountryname ? this.props.selectedRecord.scountryname : "" : this.state.scountryname}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_COUNTRYNAME" })}
                                readOnly={true}
                            />
                        </Col>

                    </Row>
                </Col>
            </Row>
        );
    }
    onMAHChange = (event, fieldName) => {
        this.props.onMAHChange(event, fieldName);
    }
}

export default injectIntl(AddProductMAHolder)