import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import {transactionStatus} from '../../components/Enumeration';
import {injectIntl } from 'react-intl';


const AddManufacturer = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_MANUFACTURERNAME" })}
                    name={"smanufname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_MANUFACTURERNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["smanufname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            {/* <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_EDQMOFFICIALNAME" })}
                    isSearchable={true}
                    name={"nofficialmanufcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}
                    isMandatory={true}
                    isClearable={false}
                    options={props.edqmManufacturerList}
                    // optionId='nofficialmanufcode'
                    // optionValue='sofficialmanufname'
                    value={props.selectedRecord ? props.selectedRecord["nofficialmanufcode"]:""}
                   // defaultValue={props.defaultValue ? props.defaultValue:""}
                    onChange={(event)=>props.onComboChange(event, "nofficialmanufcode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col> */}
            <Col md={12}>
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
            </Col>
            {(props.operation !== "update") ?  
            <>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SITENAME" })}
                    name={"smanufsitename"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SITENAME" })}
                    value={props.selectedRecord ? props.selectedRecord["smanufsitename"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CONTACTNAME" })}
                    name={"scontactname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CONTACTNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["scontactname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                    name={"saddress1"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                    value={props.selectedRecord ? props.selectedRecord["saddress1"] : ""}
                    rows="2"
                    isMandatory={true}
                    required={true}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_COUNTRYNAME" })}
                    isSearchable={true}
                    name={"ncountrycode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Country}
                    // optionId='ncountrycode'
                    // optionValue='scountryname'                   
                    // defaultValue={props.defaultValue || []}
                    value={props.selectedRecord ? props.selectedRecord["ncountrycode"]:""}
                    onChange={(event)=>props.onComboChange(event, "ncountrycode")}
                    closeMenuOnSelect={true}
                    alphabeticalSort = {true}
                >
                </FormSelectSearch>
            </Col>
            </>
            :""}
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : ""}                  
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : false}
                >
                </CustomSwitch>
            </Col>
        </Row>

    );
}
export default injectIntl(AddManufacturer);