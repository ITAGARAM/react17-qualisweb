import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import {transactionStatus} from '../../components/Enumeration';
import {injectIntl } from 'react-intl';

const AddClientContact = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CLIENTCONTACTNAME" })}
                    name={"scontactname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CLIENTCONTACTNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["scontactname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_PHONE" })}
                    name={"sphoneno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_PHONE" })}
                    value={props.selectedRecord ? props.selectedRecord["sphoneno"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={"50"}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_MOBILE" })}
                    name={"smobileno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_MOBILE" })}
                    value={props.selectedRecord ? props.selectedRecord["smobileno"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={"50"}
                />
            </Col>          
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_FAX" })}
                    name={"sfaxno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_FAX" })}
                    value={props.selectedRecord ? props.selectedRecord["sfaxno"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={"50"}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                    name={"semail"}
                    type="email"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                    value={props.selectedRecord ? props.selectedRecord["semail"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={"50"}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    name={"scomments"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col> 


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
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : true}
                >
                </CustomSwitch>
            </Col>         
           
        </Row>

    );
}
export default injectIntl(AddClientContact);