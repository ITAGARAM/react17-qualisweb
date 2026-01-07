import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { transactionStatus } from '../../components/Enumeration';
import MFAEmailOTP from './MFAEmailOTP';

const CreatePassWord = (props) => {
    //console.log("mfaAuthentication", props.mfaAuthentication);
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    name="sloginid"
                    label={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    type="text"
                    placeholder={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    value={props.sloginid}
                    readonly
                />
                <FormInput
                    name="snewpassword"
                    label={props.intl.formatMessage({ id: "IDS_NEWPASSWORD" })}
                    type="password"
                    required={true}
                    isMandatory={"*"}
                    placeholder={props.intl.formatMessage({ id: "IDS_NEWPASSWORD" })}
                    onChange={(event) => props.onInputChange(event)}
                    value={props.createPwdRecord && props.createPwdRecord.snewpassword ? props.createPwdRecord.snewpassword : ""}
                />
                <FormInput
                    name="sconfirmpassword"
                    label={props.intl.formatMessage({ id: "IDS_CONFIRMPASSWORD" })}
                    type="password"
                    required={true}
                    isMandatory={"*"}
                    placeholder={props.intl.formatMessage({ id: "IDS_CONFIRMPASSWORD" })}
                    onChange={(event) => props.onInputChange(event)}
                    value={props.createPwdRecord && props.createPwdRecord.sconfirmpassword ? props.createPwdRecord.sconfirmpassword : ""}
                />
                {parseInt(props.mfaNeed) === transactionStatus.YES && props.mfaAuthenticationType && props.mfaAuthenticationType.length > 0 && (
                    <MFAEmailOTP
                        mfaNeed ={props.mfaNeed}
                        //newUserAuth={props.newUserAuth}
                        mfaAuthenticationType={props.mfaAuthenticationType}
                        showEmailOTPModal={props.showEmailOTPModal}
                        onComboChange={props.onComboChange}
                        //createAuthRecord={props.createPwdRecord}
                        selectedAuthRecord={{ ...props.selectedAuthRecord, ...props.createPwdRecord }}
                        onResendOTP={props.onResendOTP}
                        onVerifyOTP={props.onVerifyOTP}
                        //sreceivermailid={props.sreceivermailid}
                        onInputOnChangeAuthentication={(event) => props.onInputOnChangeAuthentication(event)}
                    />
                )
                }


                <FormTextarea
                    name="description"
                    rows="3"
                    value={props.msg}
                >
                </FormTextarea>


            </Col>
        </Row>
    );
};

export default injectIntl(CreatePassWord);