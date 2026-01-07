import React from 'react';
import { Col, Row} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import CustomButtom from '../../components/custom-button/custom-button.component';

const EmailEdit = (props) => {
    return (
<>
    <Row>
  <Col md={12}>
      <FormInput
        name="sreceivermailid"
        label={props.intl.formatMessage({ id: "IDS_EMAILID" })}
        type="text"
        required={true}
        isMandatory={true}
        onChange={(event) => props.onInputChange(event)}
        value={(props.createAuthRecord && props.createAuthRecord.sreceivermailid) || ""}
      />

      {/* Centered button */}
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
        <CustomButtom
          name="loginbutton"
          label={props.intl.formatMessage({ id: "IDS_VERIFY" })}
          color="primary"
          className="btn-user btn-primary-blue"
          style={{ width: "200px" }}
          handleClick={props.onverifyEmail}
        />
      </div>
  </Col>
</Row>
        </>
    );
};

export default injectIntl(EmailEdit);