import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../form-input/form-input.component';
const AddSynonym = (props) => {
    let fieldName = props.fieldName||'displayname'
    return (
        <Row className='pt-3'>
            <Col md={12}>
                {props.languages.map(lang =>
                    <FormInput
                        label={lang.label}
                        name={lang.value}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event, 'synonym')}
                        placeholder={lang.slanguagename}
                        value={props.selectedFieldRecord[fieldName] && props.selectedFieldRecord[fieldName][lang.value] ? props.selectedFieldRecord[fieldName][lang.value] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={props.maxLength ||"30"}
                    />
                )
                }
            </Col>
        </Row>
    )
}
export default injectIntl(AddSynonym)