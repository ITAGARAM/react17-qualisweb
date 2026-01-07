import React from 'react'
import { Row, Col } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

const AddAlertRights = (props) => {

    return (
        <Row>
            <Col md={12}>
                
                <FormMultiSelect
                     name={"nsqlquerycode"}
                     label={ props.intl.formatMessage({ id:"IDS_ALERTNAME" })}                              
                     options={props.Alert|| []}
                     optionId="nsqlquerycode"
                     optionValue="sscreenheader"
                     value = { props.selectedRecord["nsqlquerycode"] ? props.selectedRecord["nsqlquerycode"]||[]:[]}
                     isMandatory={true}                                               
                     isClearable={true}
                     disableSearch={false}                                
                     disabled={false}
                     closeMenuOnSelect={false}
                     alphabeticalSort={true}
                     onChange = {(event)=> props.onComboChange(event, "nsqlquerycode")}                               
                     
                            />
            </Col>

        </Row>
    )
}

export default injectIntl(AddAlertRights);