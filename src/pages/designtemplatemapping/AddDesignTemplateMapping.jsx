import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col,Nav } from 'react-bootstrap';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import ReactSelectAddEdit from '../../components/react-select-add-edit/react-select-add-edit-component'
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { SampleType,transactionStatus } from '../../components/Enumeration';

const AddDesignTemplateMapping = (props) => {
    //console.log("props.selectedRecord:", props);
    return (
        <Row>
            {props.nformcode === -2 &&
                <>
                
                    <FormInput
                        label={props.formatMessage({ id: "IDS_FORMNAME" })}
                        name={"sformname"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event, 'sformname')}
                        placeholder={props.formatMessage({ id: "IDS_FORMNAME" })}
                        value={props.selectedRecord ? props.selectedRecord.sformname : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"30"}
                    />
               
                    {/* <CustomSwitch
                            label={props.formatMessage({ id: "IDS_ISNEWMODULE" })}
                            type="switch"
                            name={"nnewmodule"}
                            onChange={(event) => props.onInputOnChange(event, "nnewmodule")}
                            isMandatory={false}
                            required={true}
                            //checked={props.selectedRecord["nnewmodule"]}
                            checked={props.selectedRecord["nnewmodule"] && props.selectedRecord["nnewmodule"] === 3 ? true : false}
                        /> */}
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_MODULETYPE" })}
                        isSearchable={true}
                        name={"nnewmodule"}
                        isDisabled={false}
                        placeholder={props.formatMessage({ id: "IDS_MODULETYPE" })}
                        isMandatory={true}
                        options={props.moduleTypeArray}                       
                        value={props.selectedRecord["nnewmodule"]}
                        onChange={(event) => props.onComboChange(event, 'nnewmodule', 'Masters')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                {/* </Col> */}
                    {props.selectedRecord["nnewmodule"] && props.selectedRecord["nnewmodule"].value === transactionStatus.YES ?
                    <>
                        {/* <Col md={10}> */}
                            <FormInput
                                //name={props.language}
                                name={"nmodulecode"}
                                placeholder={props.formatMessage({ id: "IDS_MODULENAME" })}
                                onChange={(event) => props.onInputOnChange(event, 'nmodulecode')}
                                className=""
                                isMandatory={true}
                                label={props.formatMessage({ id: "IDS_MODULENAME" })}
                                required={true}
                                value={props.selectedRecord.nmodulecode ? props.selectedRecord.nmodulecode : ""}
                                maxLength={"100"}
                            />
                       
                    </>                  
                    :
                  
                        <FormSelectSearch
                            formLabel={props.formatMessage({ id: "IDS_MODULENAME" })}
                            isSearchable={true}
                            name={"nmodulecode"}
                            isDisabled={false}
                            placeholder={props.formatMessage({ id: "IDS_MODULENAME" })}
                            isMandatory={true}
                            options={props.designTemplateQualisModule}                       
                            value={props.selectedRecord["nmodulecode"]}
                            onChange={(event) => props.onComboChange(event, 'nmodulecode')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
               
                    }
                     {/* <ReactSelectAddEdit
                            name="nmodulecode"
                            label={props.intl.formatMessage({ id: "IDS_MODULENAME" })}
                            className="color-select"
                            classNamePrefix="react-select"
                            optionId="nmodulecode"
                            optionValue="sdisplayname"
                            options={props.designTemplateQualisModule || []}
                            isMandatory={true}
                            getValue={value => props.onComboChange(value, "nmodulecode")}
                            value={props.selectedRecord["nmodulecode"]? props.selectedRecord["nmodulecode"]: "" }
                            // defaultValue={props.selectedRecord? props.selectedRecord["sparametername"]:""}
                    />  */}
                
                </>
            }
            {/* <Col md={12}> */}
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_TEMPLATE" })}
                    isSearchable={true}
                    name={"nreactregtemplatecode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_TEMPLATE" })}
                    isMandatory={true}
                    options={props.designtemplatemappingList}
                    optionId='nreactregtemplatecode'
                    optionValue='sregtemplatename'
                    value={props.selectedRecord["nreactregtemplatecode"]}
                    onChange={(event) => props.onComboChange(event, 'nreactregtemplatecode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            {/* </Col> */}
            {props.needSubSample ?
            //&& props.subSampleTemplateList.length > 0 ?
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_SUBSAMPLETEMPLATE" })}
                        isSearchable={true}
                        name={"nsubsampletemplatecode"}
                        isDisabled={false}
                        placeholder={props.formatMessage({ id: "IDS_SUBSAMPLETEMPLATE" })}
                        isMandatory={true}
                        options={props.subSampleTemplateList}
                        optionId='nsubsampletemplatecode'
                        optionValue='sregtemplatename'
                        value={props.selectedRecord["nsubsampletemplatecode"]}
                        onChange={(event) => props.onComboChange(event, 'nsubsampletemplatecode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                </Col>
                : ""}
        </Row>
    )
}
export default injectIntl(AddDesignTemplateMapping);
