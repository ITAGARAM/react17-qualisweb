import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
//import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

const AddClient = (props) => {
    return (
        <Row>
              <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_CLIENTCATEGORY" })}
                    isSearchable={true}
                    name={"nclientcatcode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.clientCategoryList || []}
                    optionId='nclientcatcode'
                    optionValue='sclientcatname'
                    value={props.selectedRecord ? props.selectedRecord["nclientcatcode"] : ""}
                    defaultValue={props.selectedRecord["nclientcatcode"]}
                    onChange={(event) => props.onComboChange(event, 'nclientcatcode')}
                    //isMulti={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_CLIENTNAME" })}
                    name={"sclientname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_CLIENTNAME" })}
                    value={props.selectedRecord["sclientname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    readOnly={props.userLogged}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_CLIENTID" })}
                    name={"sclientid"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_CLIENTID" })}
                    value={props.selectedRecord["sclientid"]}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                    readOnly={props.userLogged}
                />
            </Col>
            {(props.operation !== "update") ?  
            <>
            <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                name={"sclientsitename"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                value={props.selectedRecord["sclientsitename"]}
                isMandatory={true}
                required={true}
                maxLength={"100"}
            />
        </Col>
        <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_CLIENTCONTACTNAME" })}
                name={"scontactname"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_CLIENTCONTACTNAME" })}
                value={props.selectedRecord["scontactname"]}
                isMandatory={true}
                required={true}
                maxLength={"100"}
            />
        </Col>
        <Col md={12}>
            <FormTextarea
                label={props.formatMessage({ id: "IDS_ADDRESS1" })}
                name={"saddress1"}
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_ADDRESS1" })}
                defaultValue={props.selectedRecord["saddress1"]}
                value={props.selectedRecord["saddress1"]?props.selectedRecord["saddress1"]:""}
                rows="2"
                isMandatory={true}
                required={true}
                maxLength={255}
            />
        </Col>
        {/* <Col md={12}>
            <FormTextarea
                label={props.formatMessage({ id: "IDS_ADDRESS2" })}
                name={"saddress2"}
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_ADDRESS2" })}
                defaultValue={props.selectedRecord["saddress2"]}
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
                defaultValue={props.selectedRecord["saddress3"]}
                rows="2"
                isMandatory={false}
                required={false}
                maxLength={255}
            />
        </Col> */}
        {/* <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_PHONENO" })}
                name={"sphoneno"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_PHONENO" })}
                value={props.selectedRecord["sphoneno"]}
                isMandatory={false}
                required={false}
                maxLength={50}
            />
        </Col>
        <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_MOBILENO" })}
                name={"smobileno"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_MOBILENO" })}
                value={props.selectedRecord["smobileno"]}
                isMandatory={false}
                required={false}
                maxLength={50}
            />
        </Col>
        <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_FAXNO" })}
                name={"sfaxno"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_FAXNO" })}
                value={props.selectedRecord["sfaxno"]}
                isMandatory={false}
                required={false}
                maxLength={50}
            />
        </Col>
        <Col md={12}>
            <FormInput
                label={props.formatMessage({ id: "IDS_EMAIL" })}
                name={"semail"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_EMAIL" })}
                value={props.selectedRecord["semail"]}
                isMandatory={false}
                required={false}
                maxLength={50}
            />
        </Col> */}
        <Col md={12}>
            <FormSelectSearch
                formLabel={props.formatMessage({ id: "IDS_COUNTRY" })}
                isSearchable={true}
                name={"ncountrycode"}
                isDisabled={false}
                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                options={props.countryList || []}
                optionId='ncountrycode'
                optionValue='scountryname'
                value={props.selectedRecord ? props.selectedRecord["ncountrycode"] : ""}
                defaultValue={props.selectedRecord["ncountrycode"]}
                onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                //isMulti={false}
                closeMenuOnSelect={true}
                alphabeticalSort={true}
            />
        </Col>
        </>
        :""}
        <Col md={12}>
            <CustomSwitch
                label={props.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                type="switch"
                name={"ntransactionstatus"}
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                defaultValue={props.selectedRecord["ntransactionstatus"] === 1 ? true : false}
                isMandatory={false}
                required={false}
                checked={props.selectedRecord["ntransactionstatus"] === 1 ? true : false}
            />
        </Col>            
        </Row>
    )
}
export default AddClient;
