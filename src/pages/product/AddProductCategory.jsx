import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';

const AddProductCategory = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    name="sproductcatname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    value={props.selectedRecord["sproductcatname"] ? props.selectedRecord["sproductcatname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12} >
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    type="switch"
                    name={"ncategorybasedflow"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === transactionStatus.YES ? true : false : false}
                    //ALPD-4984--Added by Vignesh R(10-04-2025)-->Test group: Copy Rules engine
					disabled={ props.settings&&parseInt(props.settings[20])===transactionStatus.YES? true : false}
                >
                </CustomSwitch>
            </Col>
            {/* Added by sonia on 8th OCT 2024 for jira id:ALPD-5023  */}
            <Col md={12} >
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_CATEGORYBASEDPROTOCOL" })}
                    type="switch"
                    name={"ncategorybasedprotocol"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_CATEGORYBASEDPROTOCOL" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncategorybasedprotocol"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ncategorybasedprotocol"] === transactionStatus.YES ? true : false : false}
                >
                </CustomSwitch>
            </Col>
            {/* ALPD-5321 Sample Category - nschedulerrequired field added to table, to check add, edit, delete.*/}
            <Col md={12} >
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_SCHEDULERREQUIRED" })}
                    type="switch"
                    name={"nschedulerrequired"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_SCHEDULERREQUIRED" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nschedulerrequired"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["nschedulerrequired"] === transactionStatus.YES ? true : false : false}
                >
                </CustomSwitch>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                //  disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                >
                </CustomSwitch>
            </Col>
        </Row>
    );
};

export default AddProductCategory;