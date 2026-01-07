import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import { transactionStatus } from '../../components/Enumeration';

const AddApprovalStatusConfig = (props) => {
    return (
        <Row>
            <Col md={12}>    
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_STATUSFUNCTION" })}
                    isSearchable={true}
                    name={"nstatusfunctioncode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.statusFunctionList}
                    alphabeticalSort="true"
                    optionId="nstatusfunctioncode"
                    optionValue="sapprovalstatusfunctions"
                    value={props.selectedRecord ? props.selectedRecord["nstatusfunctioncode"] : ""}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nstatusfunctioncode"] : ""}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nstatusfunctioncode')}
                    >
                </FormSelectSearch>

                <FormMultiSelect
                    formLabel={props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUS" })}
                    isSearchable={true}
                    name={"ntranscode"}
                    label={ props.intl.formatMessage({ id:"IDS_TRANSACTIONSTATUS" })}                              
                    options={ props.transactionsList}
                    optionId="ntranscode"
                    optionValue="sdisplaystatus"
                    value = { props.selectedRecord["ntranscode"] ? props.selectedRecord["ntranscode"] || [] :[]}
                    isMandatory={true}                                               
                    isClearable={true}
                    disableSearch={false}                                
                    disabled={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    allItemSelectedLabel={props.intl.formatMessage({ id:"IDS_ALLITEMSELECTED" })}
                    //noOptionsLabel={props.intl.formatMessage({ id:"IDS_NOOPTION" })}
                    searchLabel={props.intl.formatMessage({ id:"IDS_SEARCH" })}
                    selectAllLabel={props.intl.formatMessage({ id:"IDS_SELECTALL" })}
                    onChange = {(event)=> props.onComboChange(event, "ntranscode")}
                />
            </Col>


        

        </Row>
    );
}

export default injectIntl(AddApprovalStatusConfig);
