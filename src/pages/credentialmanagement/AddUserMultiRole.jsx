import React from 'react';
import {injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';

import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {transactionStatus} from '../../components/Enumeration';

const AddUserMultiRole = (props) => {        
        return(
            <Row>                                
                <Col md={12}>
                    <FormInput
                        name={"sloginid"}
                        type="text"
                        label={ props.intl.formatMessage({ id:"IDS_LOGINID"})}                        
                        placeholder={ props.intl.formatMessage({ id:"IDS_LOGINID"})}
                        defaultValue ={ props.selectedUser["sloginid"] }
                        isMandatory={false}
                        required={false}
                        maxLength={20}
                        readOnly={true}
                        onChange={(event)=> props.onInputOnChange(event)}                        
                    />
                {/* </Col>
                <Col md={12}> */}
                    <FormSelectSearch
                            name={"nuserrolecode"}
                            formLabel={ props.intl.formatMessage({ id:"IDS_USERROLE"})}                   
                            placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                   
                            options={ props.roleList}
                            //optionId="nuserrolecode"
                           // optionValue="suserrolename"
                            value = { props.selectedRecord["nuserrolecode"]}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                           // alphabeticalSort={true}
                            onChange = {(event)=> props.onComboChange(event, 'nuserrolecode')}
                        />
                {/* </Col>
               
                <Col md={12}> */}
                    <CustomSwitch
                        name={"ndefaultrole"}
                        type="switch"                    
                        label={ props.intl.formatMessage({ id:"IDS_DEFAULTROLE"})}                        
                        placeholder={ props.intl.formatMessage({ id:"IDS_DEFAULTROLE"})}
                        defaultValue ={ props.selectedRecord["ndefaultrole"] === transactionStatus.YES ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={ props.selectedRecord["ndefaultrole"] === transactionStatus.YES ? true :false}
                        onChange={(event)=> props.onInputOnChange(event)}                        
                        />  
                {/* </Col>

                <Col md={12}> */}
                    <CustomSwitch
                        name={"ntransactionstatus"}
                        type="switch"
                        label={ props.intl.formatMessage({ id:"IDS_ISACTIVE"})}                
                        placeholder={ props.intl.formatMessage({ id:"IDS_ISACTIVE"})}
                        defaultValue ={ props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={  props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false}
                        onChange={(event)=> props.onInputOnChange(event)}
                        /> 
                </Col>
        </Row>
     )   
}

export default injectIntl(AddUserMultiRole);