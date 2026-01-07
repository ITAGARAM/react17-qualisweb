import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const EmailConfigFilter = (props) => {
  return (
    <Row>        
        <Col md={12}>        
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id:"IDS_MAILTYPE"})}
                placeholder={props.intl.formatMessage({ id:"IDS_MAILTYPE"})}
                name="nemailtypecode"
                optionId="nemailtypecode"
                optionValue="semailtypename"
                className='form-control'
                options={props.emailType}
                value={props.emailTypeValue? { "label": props.emailTypeValue.semailtypename, "value": props.emailTypeValue.nemailtypecode } : ""}
                onChange={(event)=>props.onComboChange(event,"nemailtypecode")}
            />
        </Col>          
    </Row>
  );
};
export default injectIntl(EmailConfigFilter);

