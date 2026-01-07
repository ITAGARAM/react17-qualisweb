import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';


const AddRegistrationSubtypeConfigUserRole = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                    isSearchable={true}
                    name={"nuserrolecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Lab}
                    optionId='nuserrolecode'
                    optionValue='suserrolename'
                    disableSearch={false}
                    value={props.selectedRecord["nuserrolecode"]}
                    defaultValue={props.selectedRecord["nuserrolecode"]}
                    onChange={(event) => props.onComboChange(event, "nuserrolecode", 4)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}

                />

<CustomSwitch
                    name={"ndeltacheck"}
                    label={props.intl.formatMessage({ id: "IDS_ALLUSERS"})}
                    type="switch"
                    onChange={(event)=>props.onInputOnChange(event, 1, [transactionStatus.YES, transactionStatus.NO])}
                    placeholder={props.intl.formatMessage({ id: "IDS_DELTACHECK"})}
                    defaultValue ={props.selectedRecord["ndeltacheck"] === 3 ? true :false}
                    checked={props.selectedRecord["ndeltacheck"] === 3 ? true :false}
                   disabled={props.isdisable}
                >
            </CustomSwitch>
{ props.selectedRecord["ndeltacheck"]=== 4 ?
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                    isSearchable={true}
                    name={"nusercode"}
                    //isDisabled={props.selectedRecord["ndeltacheck"]===3? true:false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Users || []}
                    isMulti={true}        
                    value={props.selectedRecord["nusercode"] || ""}  
                    onChange={(event) => props.onComboChange(event, "nusercode", 1)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />:""
}
            </Col>
        </Row>
    );
}

export default injectIntl(AddRegistrationSubtypeConfigUserRole);