import React from 'react';
import { transactionStatus } from '../../components/Enumeration';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
//import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddSupplierContact = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_SUPPLIERCONTACT" })}
                    name={"ssuppliercontactname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_SUPPLIERCONTACT" })}
                    value={props.selectedRecord["ssuppliercontactname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
             <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_DESIGNATION" })}
                    name={"sdesignation"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DESIGNATION" })}
                    value={props.selectedRecord["sdesignation"]}
                    isMandatory={false}
                    required={true}
                    maxLength={100}
                />
            </Col> 
           
            {/* <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS1" })}
                    name={"saddress1"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS1" })}
                    value={props.selectedRecord["saddress1"]}
                    rows="2"
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS2" })}
                    name={"saddress2"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS2" })}
                    value={props.selectedRecord["saddress2"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS3" })}
                    name={"saddress3"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS3" })}
                    value={props.selectedRecord["saddress3"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_COUNTRY" })}
                    isSearchable={true}
                    name={"ncountrycode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.countryList}
                    optionId='ncountrycode'
                    optionValue='scountryname'
                    value={props.selectedRecord["ncountrycode"]}
                    //defaultValue={props.selectedRecord["ncountrycode"]}

                    onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            </Col> */}
             <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_MOBILENO" })}
                    name={"smobileno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_MOBILENO" })}
                    value={props.selectedRecord["smobileno"]}
                    isMandatory={false}
                    required={true}
                    maxLength={50}

                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_TELEPHONENO" })}
                    name={"stelephoneno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TELEPHONENO" })}
                    value={props.selectedRecord["stelephoneno"]}
                    isMandatory={false}
                    required={false}
                    maxLength={50}

                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_EMAIL" })}
                    name={"semail"}
                    type="email"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_EMAIL" })}
                    value={props.selectedRecord["semail"]}
                    isMandatory={false}
                    required={true}
                    maxLength={50}

                />
            </Col>
              <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"]}
                    isMandatory={false}
                    required={true}
                    maxLength={255}
                />
            </Col> 

            <Col md={12}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : ""}
                    // defaultValue={props.selectedRecord["ndefaultstatus"] === 1 ? true : false}
                    isMandatory={false}
                    required={false}
                    // checked={props.selectedRecord["ndefaultstatus"] === 1 ? true : false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                />
            </Col>

        </Row>
    )
}
export default AddSupplierContact;
