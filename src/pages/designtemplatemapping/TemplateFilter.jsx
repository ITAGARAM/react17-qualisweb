import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SampleType } from '../../components/Enumeration';

import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
const TemplateFilter = (props) => {
   
    return (

        <Row>
            <Col md={12}>
                {props.filterSampletype.length > 0 ?
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_SAMPLETYPE" })}
                        isSearchable={true}
                        name={"nsampletypecode"}
                        isDisabled={false}
                        value={props.defaultsampletype}
                        isMandatory={false}
                        showOption={true}
                        options={props.filterSampletype}
                        optionId='nsampletypecode'
                        optionValue='sampletypename'
                        // menuPosition="fixed"
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={event => props.filterComboChange(event, "sampleType")}>
                    </FormSelectSearch>
                    : ""}
                {props.defaultsampletype.value === SampleType.Masters ?
                    <>
                            <FormSelectSearch
                                formLabel={props.formatMessage({ id: "IDS_MASTERTYPE" })}
                                isSearchable={true}
                                name={"nmastertypecode"}
                                isDisabled={false}
                                value={props.defaultMasterType}
                                isMandatory={false}
                                showOption={true}
                                options={props.masterTypeArray}
                                optionId='nmastertypecode'
                                optionValue='smastertype'
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={event => props.filterComboChange(event, "masterType")}>
                            </FormSelectSearch>
                        {props.filterForms.length > 0 ?
                          
                            
                            <FormSelectSearch
                                formLabel={props.formatMessage({ id: "IDS_SCREEN" })}
                                isSearchable={true}
                                name={"nformcode"}
                                isDisabled={false}
                                value={props.defaultform}
                                isMandatory={false}
                                showOption={true}
                                options={props.filterForms}
                                optionId='nformcode'
                                optionValue='sdisplayname'
                                // menuPosition="fixed"
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={event => props.filterComboChange(event, "sdisplayname")}>
                            </FormSelectSearch>
                           
                            : ""}
                    </>
                    :

                    <>
                        {/*//Added by sonia on 11th NOV 2024 for jira id:ALPD-5025 */}
                        {props.defaultsampletype.value !==SampleType.GOODSIN && 
                        props.defaultsampletype.value !==SampleType.PROTOCOL &&  
                       //  props.defaultsampletype.value !==SampleType.STABILITY && 
                         props.filterRegistrationType
                         ?
                            <FormSelectSearch
                                name="nregtypecode"
                                formLabel={props.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                optionId="nregtypecode"
                                optionValue="sregtypename"
                                options={props.filterRegistrationType}
                                value={props.defaultregtype}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                // menuPosition="fixed"
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={(event) => props.filterComboChange(event, 'registrationType')}>
                            </FormSelectSearch>
                            : ""}
                        {/*//Added by sonia on 11th NOV 2024 for jira id:ALPD-5025 */}    
                        {props.defaultsampletype.value !==SampleType.GOODSIN 
                        && props.defaultsampletype.value !==SampleType.PROTOCOL  
                      //   && props.defaultsampletype.value !==SampleType.STABILITY 
                         && props.filterRegistrationSubType ?
                            <FormSelectSearch

                                name="nregsubtypecode"
                                isMandatory={false}
                                formLabel={props.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                optionId="nregsubtypecode"
                                optionValue="sregsubtypename"
                                options={props.filterRegistrationSubType}
                                value={props.defaultregsubtype}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                // menuPosition="fixed"
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={(event) => props.filterComboChange(event, 'registrationSubType')}>
                            </FormSelectSearch>
                            : ""}
                    </>
                }
                   
            </Col>
        </Row>


    );
};

export default TemplateFilter;