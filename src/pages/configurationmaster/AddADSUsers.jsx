import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddADSUsers = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_USERID" })}
                    name="suserid"
                    type="text"
                    onChange={(event) => props.onLoginInputChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_USERID" })}
                    value={props.selectedRecord["suserid"] ? props.selectedRecord["suserid"] : ""}
                    isMandatory={true}
                    required={false}
                    maxLength={20}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_PASSWORD" })}
                    name="spassword"
                    type="password"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_PASSWORD" })}
                    value={props.selectedRecord["spassword"] ? props.selectedRecord["spassword"] : ""}
                    isMandatory={true}
                    required={false}
                    maxLength={50}
                />
            </Col>
        
        </Row>
    );
};

export default AddADSUsers;