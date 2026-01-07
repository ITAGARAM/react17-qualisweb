import React from 'react'
import { Row, Col } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

const AddAlertHomeRights = (props) => {

    return (
        <Row>
            <Col md={12}>
                
                <FormMultiSelect
                     name={"nalerthomerights"}
                     label={ props.intl.formatMessage({ id:"IDS_ALERTNAME" })}                              
                     options={props.AlertHomeRights|| []}
                     optionId="nsqlquerycode"
                     optionValue="sscreenheader"
                     value = { props.selectedRecord["nalerthomerightscode"] ? props.selectedRecord["nalerthomerightscode"]||[]:[]}
                     isMandatory={true}                                               
                     isClearable={true}
                     disableSearch={false}                                
                     disabled={false}
                     closeMenuOnSelect={false}
                     alphabeticalSort={true}
                     onChange = {(event)=> props.onComboChange(event, "nalerthomerightscode")}                               
                     
                            />
            </Col>

        </Row>
    )
}

export default injectIntl(AddAlertHomeRights);