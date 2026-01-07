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
                     name={"ndashboardtypecode"}
                     label={ props.intl.formatMessage({ id:"IDS_DASHBOARDTYPENAME" })}                              
                     options={ props.DashBoardType || []}
                     optionId="ndashboardtypecode"
                     optionValue="sdashboardtypename"
                     value = { props.selectedRecord["ndashboardtypecode"] ? props.selectedRecord["ndashboardtypecode"]||[]:[]}
                     isMandatory={true}                                               
                     isClearable={true}
                     disableSearch={false}                                
                     disabled={false}
                     closeMenuOnSelect={false}
                     alphabeticalSort={true}
                     onChange = {(event)=> props.onComboChange(event, "ndashboardtypecode")}                               
                     
                            />
            </Col>

        </Row>
    )
}

export default injectIntl(AddDashBoardRights);