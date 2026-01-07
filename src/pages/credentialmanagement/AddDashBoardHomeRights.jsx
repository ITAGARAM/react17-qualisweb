import React from 'react'
import { Row, Col } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

const AddDashBoardRights = (props) => {

    return (
        <Row>
            <Col md={12}>
             
                <FormMultiSelect
                     name={"ndashboardhomeprioritycode"}
                     label={ props.intl.formatMessage({ id:"IDS_PAGES" })}                              
                     options={ props.HomeRights || []}
                     optionId="ndashboardhomeprioritycode"
                     optionValue="sdashboardhomepagename"
                     value = { props.selectedRecord["ndashboardhomeprioritycode"] ? props.selectedRecord["ndashboardhomeprioritycode"]||[]:[]}
                     isMandatory={true}                                               
                     isClearable={true}
                     disableSearch={false}                                
                     disabled={false}
                     closeMenuOnSelect={false}
                     alphabeticalSort={true}
                     onChange = {(event)=> props.onComboChange(event, "ndashboardhomeprioritycode")}                               
                     
                            />
            </Col>

        </Row>
    )
}

export default injectIntl(AddDashBoardRights);