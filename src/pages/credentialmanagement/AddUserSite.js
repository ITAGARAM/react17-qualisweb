import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {transactionStatus} from '../../components/Enumeration';

const AddUserSite = (props) => {
        
        return(
            <Row>                                
                <Col md={12}>
                    <FormInput
                        name={"sloginid"}
                        type="text"
                        label={ props.intl.formatMessage({ id:"IDS_LOGINID"})}                        
                        placeholder={ props.intl.formatMessage({ id:"sloginid"})}
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
                            name={"nsitecode"}
                            formLabel={ props.intl.formatMessage({ id:"IDS_SITE"})}                   
                            placeholder="Please Select..."                     
                            options={ props.siteList}
                            optionId="nsitecode"
                            optionValue="ssitename"
                            value = { props.selectedRecord["nsitecode"]}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange = {(event)=> props.onComboChange(event, 'nsitecode')}
                        />
                {/* </Col>
               
                <Col md={12}> */}
                    <CustomSwitch
                        name={"ndefaultsite"}
                        type="switch"                    
                        label={ props.intl.formatMessage({ id:"IDS_DEFAULTSITE"})}                        
                        placeholder={ props.intl.formatMessage({ id:"IDS_DEFAULTSITE"})}
                        defaultValue ={ props.selectedRecord["ndefaultsite"] === transactionStatus.YES ? true :false}
                        isMandatory={false}
                        required={false}
                        checked={ props.selectedRecord["ndefaultsite"] === transactionStatus.YES ? true :false}
                        onChange={(event)=> props.onInputOnChange(event)}                        
                        />  
                </Col>

        </Row>
     )   
}

export default injectIntl(AddUserSite);