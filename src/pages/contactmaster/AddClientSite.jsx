import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import {transactionStatus} from '../../components/Enumeration';
import {injectIntl } from 'react-intl';


const AddClientSite = (props) => {   
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                    name={"sclientsitename"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                    value={props.selectedRecord ? props.selectedRecord["sclientsitename"] : ""}
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
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                    name={"saddress2"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                    value={props.selectedRecord ? props.selectedRecord["saddress2"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                    name={"saddress3"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                    value={props.selectedRecord ? props.selectedRecord["saddress3"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
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
            
            {/* <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : ""}                  
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : false}
                >
                </CustomSwitch>
                </Col> */}
                
                <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_DEFAULT" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULT" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : ""}                  
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                >
                </CustomSwitch>
            </Col>
        </Row>

    );
}
export default injectIntl(AddClientSite);