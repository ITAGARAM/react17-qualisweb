import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';
import MFAEmailOTP from './MFAEmailOTP'

const AddUserAuthentication = (props) => {
  return (
    <>
      <Row>
        <Col>
          <CustomSwitch
            name={"nactivestatus"}
            type="switch"
            label={props.intl.formatMessage({ id: "IDS_ENABLEDISABLEACTIVESTATUS" })}
            placeholder={props.intl.formatMessage({ id: "IDS_ACTIVESTATUS" })}
            isMandatory={true}
            required={true}
            onChange={(event) => props.onInputChange(event, "nactivestatus")}
            defaultValue={props.selectedAuthRecord && props.selectedAuthRecord["nactivestatus"] === transactionStatus.YES ? true : false}
            checked={props.selectedAuthRecord && props.selectedAuthRecord["nactivestatus"] === 3 ? true : false}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <MFAEmailOTP
            selectedAuthRecord={props.selectedAuthRecord}
            mfaType={props.mfaType}
            sendOTPMail={props.sendOTPMail}
            onComboChange={props.onComboChange}
            showEmailOTPModal={props.showEmailOTPModal}
            onInputOnChangeAuthentication={props.onInputChange}
            onVerifyOTP={props.onVerifyOTP}
            userInfo={props.userInfo}
          />
        </Col>
      </Row>




    </>
  );
};

export default injectIntl(AddUserAuthentication);