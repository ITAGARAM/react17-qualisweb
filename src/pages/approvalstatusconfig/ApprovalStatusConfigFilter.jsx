import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { SampleType} from '../../components/Enumeration';
const ApprovalStatusConfigFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
              
            <FormSelectSearch
                          formLabel={props.formatMessage({ id: "IDS_SAMPLETYPE" })}
                        isSearchable={true}
                        name={"nsampletypecode"}
                        isDisabled={false}
                        value={props.defaultSample}
                        isMandatory={false}
                        showOption={true}
                        options={props.SampleTypes}
                      optionId='nsampletypecode'
                        optionValue='ssampletypename'
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={(event) => props.onComboChange(event, 'nsampletypecode')}
                        >
                    </FormSelectSearch>
                    
                     {props.defaultSample.value===SampleType.Masters?       
                     <>         
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_FORMNAME" })}
                        isSearchable={true}
                        name={"nformcode"}
                        isDisabled={false}
                        value={props.defaultForms}
                        isMandatory={false}
                        showOption={true}                       
                        options={props.qualisForms}
                        optionId='nformcode'
                        optionValue='sdisplayname'                       
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={(event) => props.onComboChange(event, 'nformcode')}
                     >             
                    </FormSelectSearch> 

      {props.defaultForms.value===55 && props.defaultSample.value===SampleType.Masters ?
        <FormSelectSearch    
              formLabel={props.formatMessage({ id: "IDS_APPROVALSUBTYPE" })}
              isSearchable={true}
              name={"napprovalsubtypecode"}
              isDisabled={false}
              value={props.defaultApprovalSubType}
              isMandatory={false}
              // showOption={true}
              options={props.approvalSubType}
              optionId='napprovalsubtypecode'
              optionValue='ssubtypename'
              // menuPosition="fixed"
              placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
              onChange={(event) => props.onComboChange(event, 'napprovalsubtypecode')}
  >
</FormSelectSearch>

:""}
</> 
                    
                    :
                    <>
                    {props.defaultRegType ?
              
                  <FormSelectSearch    
                          formLabel={props.formatMessage({ id: "IDS_REGTYPE" })}
                        isSearchable={true}
                        name={"nregtypecode"}
                        isDisabled={false}
                        value={props.defaultRegType}
                        isMandatory={false}
                        options={props.registrationTypes}
                        optionId='nregtypecode'
                        optionValue='sregtypename'
                        // menuPosition="fixed"
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={(event) => props.onComboChange(event, 'nregtypecode')}>
                      
                    </FormSelectSearch>
                    :""}
                   {props.defaultRegSubType ?
                    <FormSelectSearch    
                          formLabel={props.formatMessage({ id: "IDS_REGSUBTYPE" })}
                        isSearchable={true}
                        name={"nregsubtypecode"}
                        isDisabled={false}
                        value={props.defaultRegSubType}
                        isMandatory={false}
                        // showOption={true}
                        options={props.regSubTypeList}
                        optionId='nregsubtypecode'
                        optionValue='sregsubtypename'
                        // menuPosition="fixed"
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={(event) => props.onComboChange(event, 'nregsubtypecode')}>
                      
                    </FormSelectSearch>

                   :""}
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_FORMNAME" })}
                        isSearchable={true}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        name={"nformcode"}
                        isDisabled={false}
                        value={props.defaultForms}
                        isMandatory={false}
                        showOption={true}
                        options={props.qualisForms}
                        optionId='nformcode'
                        optionValue='sdisplayname'                       
                      
                        onChange={(event) => props.onComboChange(event, 'nformcode')}      
                     >             
                    </FormSelectSearch> 
                  
                  </>
                    }
                 
            </Col>
        </Row>
    );
};

export default injectIntl(ApprovalStatusConfigFilter);