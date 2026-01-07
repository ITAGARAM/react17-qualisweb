import React from 'react'
import { Row, Col } from 'react-bootstrap';
import {injectIntl } from 'react-intl';

import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import {transactionStatus} from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddCertificateType = (props) => {
    return (
        <Row>
            <Col md={12}>

                
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CERTIFICATETYPE" })}
                    name={"scertificatetype"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CERTIFICATETYPE" })}
                    value={props.selectedRecord ? props.selectedRecord["scertificatetype"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"20"}
                />

                <FormSelectSearch
                        name={"ncertificatereporttypecode"}
                        formLabel={ props.intl.formatMessage({ id:"IDS_REPORTBATCHTYPE"})}                                
                        placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                        options={ props.reportBatchTypeList}
                        value = { props.selectedRecord["ncertificatereporttypecode"] }
                        isMandatory={true}
                        isClearable={false}
                        isMulti={false}
                        isSearchable={true}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange = {(event)=> props.onComboChange(event, 'ncertificatereporttypecode')}                               
                    />

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_VERSIONNO" })}
                    name={"sversionno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_VERSIONNO" })}
                    value={props.selectedRecord ? props.selectedRecord["sversionno"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"20"}
                />


           
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
           
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_EDQM" })}
                    type="switch"
                    name={"nedqm"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_EDQM" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nedqm"] === transactionStatus.NO ? false : true : true}
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["nedqm"] === transactionStatus.NO ? false : true : true}

                />
            
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ACCREDITED" })}
                    type="switch"
                    name={"naccredited"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ACCREDITED" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["naccredited"] === transactionStatus.NO ? false : true : true}
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["naccredited"] === transactionStatus.NO ? false : true : true}

                />
           
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.NO ? false : true : true}
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.NO ? false : true : true}
                />

            </Col>
        </Row>
    )
}
export default injectIntl(AddCertificateType);