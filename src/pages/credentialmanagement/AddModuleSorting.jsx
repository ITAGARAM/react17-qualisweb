import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {injectIntl } from 'react-intl';

const AddModuleSorting = (props) => {
    return(
          <Row>    
              <Col md={12}>
                    <FormInput
                        name={"nformcode"}
                        label={ props.intl.formatMessage({ id:"IDS_FORMNAME"})}                              
                        placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                            
                        options={ props.formMapList || []}
                        value = { props.selectedRecord.nformcode.label }
                        readOnly={true}
                />
            </Col>
            <Col md={12}>
            <FormSelectSearch
                            name={"nmodulecode"}
                            formLabel={ props.intl.formatMessage({ id:"IDS_MODULENAME"})}                              
                            placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                            options={ props.moduleMapList || []}
                            value = { props.selectedRecord ? props.selectedRecord["nmodulecode"]:""}
                            isMandatory={true}
                            required={true}
                            isMulti={false}
                            isSearchable={true}                                
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            onChange = {(event)=> props.onComboChange(event, "nmodulecode")}                               
                    />
            </Col>
         </Row>
    );
};
export default injectIntl(AddModuleSorting);