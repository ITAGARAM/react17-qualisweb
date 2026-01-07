import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const CreateADSPassWord = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name="sloginid"
                    label={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    type="text"
                    placeholder={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    value={props.sloginid}
                    readonly={true}
                />
                <FormInput
                    name="sadspassword"
                    label={props.intl.formatMessage({ id: "IDS_ADSPASSWORD" })}
                    type="password"
                    isMandatory={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_ADSPASSWORD" })}
                    onChange={(event) => props.onInputChange(event)}
                    value={props.createPwdRecord && props.createPwdRecord.sadspassword? props.createPwdRecord.sadspassword: ""}
                />
            </Col>
        </Row>
    );
};

export default injectIntl(CreateADSPassWord);