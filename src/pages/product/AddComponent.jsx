import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';
import { injectIntl } from 'react-intl';


const AddComponent = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormInput
                    label={props.genericLabel &&  props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    name={"scomponentname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.genericLabel && props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    value={props.selectedRecord ? props.selectedRecord["scomponentname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord && props.selectedRecord["sdescription"] !== "null" ? props.selectedRecord["sdescription"] : ""}
                    rows="3"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : true}
                    error={""}
                    rows="4"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : true}

                >
                </CustomSwitch>
            </Col>
        </Row>
    )
}
export default injectIntl(AddComponent);