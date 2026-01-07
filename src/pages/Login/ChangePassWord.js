import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const ChangePassWord = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={ props.intl.formatMessage({ id:"IDS_LOGINID"}) }  
                    name="sloginid" type="text" error="*" 
                    placeholder={ props.intl.formatMessage({ id:"IDS_LOGINID"}) } 
                    value={ props.sloginid }
                    readOnly = {true} 
                />
                <FormInput
                    name="soldpassword" 
                    label={ props.intl.formatMessage({ id:"IDS_OLDPASSWORD"}) }
                    type="password"
                    required={ true }
                    isMandatory={"*"}
                    placeholder={ props.intl.formatMessage({ id:"IDS_OLDPASSWORD"}) }
                    onChange = { (event) => props.onInputChange(event) }
                    value={props.createPwdRecord.soldpassword? props.createPwdRecord.soldpassword: ""}
                />
                <FormInput
                    name="snewpassword" 
                    label={ props.intl.formatMessage({ id:"IDS_NEWPASSWORD"}) }
                    type="password"
                    required={ true }
                    isMandatory={"*"}
                    placeholder={ props.intl.formatMessage({ id:"IDS_NEWPASSWORD"}) }
                    onChange = { (event) => props.onInputChange(event) }
                    value={props.createPwdRecord.snewpassword? props.createPwdRecord.snewpassword: ""}
                />
                <FormInput
                    name="sconfirmpassword"
                    label={ props.intl.formatMessage({ id:"IDS_CONFIRMPASSWORD"}) } 
                    type="password" 
                    required={ true }
                    isMandatory={"*"}
                    placeholder={ props.intl.formatMessage({ id:"IDS_CONFIRMPASSWORD"}) }
                    onChange = { (event) => props.onInputChange(event) }
                    value={props.createPwdRecord.sconfirmpassword? props.createPwdRecord.sconfirmpassword: ""}
                />
                <FormTextarea
                    name="spassworddescription" 
                    rows="2" 
                    value={props.msg}
                >
                </FormTextarea>
            </Col>
        </Row>
    );
};

export default injectIntl(ChangePassWord);