import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';

const AddInstrumentCategory = (props) => {
    const { Technique, Interfacetype } = props;
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                    name= "sinstrumentcatname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                    value={props.selectedRecord["sinstrumentcatname"] ? props.selectedRecord["sinstrumentcatname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id:"IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>

        {/*ALPDJ21-31-->Added by Vignesh(23-07-2025)-->Added the new dropdown Instrument Type-Standard, Storage*/}
                 <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTTYPE" })}
                    name={"ninstrumenttypecode"} 
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord.ninstrumenttypecode ? props.selectedRecord.ninstrumenttypecode: ""}
                    options={props.instrumentType}
                    optionId="ninstrumenttypecode"
                    optionValue="sinstrumenttype"
                    isMandatory={true}
                    isMulti={false}
                    closeMenuOnSelect={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ninstrumenttypecode")}
                    
                />
            </Col>

            {/* <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                    name={"ntechniquecode"} 
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord.ntechniquecode ? props.selectedRecord.ntechniquecode: ""}
                    options={Technique}
                    optionId="ntechniquecode"
                    optionValue="stechniquename"
                    isMandatory={false}
                    isMulti={false}
                    isClearable={true}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ntechniquecode")}
                    
                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_INTERFACETYPE" })}
                    name= {"ninterfacetypecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord.ninterfacetypecode ? props.selectedRecord.ninterfacetypecode : ""}
                    options={Interfacetype}
                    optionId="ninterfacetypecode"
                    optionValue="sinterfacetypename"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ninterfacetypecode")}
                    
                />
            </Col> */}
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    type="switch"
                    name={"ncategorybasedflow"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === transactionStatus.YES  ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === transactionStatus.YES  ? true : false : false}
                    //disabled={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === transactionStatus.YES  ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_CALIBRATIONREQUIRED" })}
                    type="switch"
                    name={"ncalibrationreq"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CALIBRATIONREQUIRED" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncalibrationreq"] === transactionStatus.YES  ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ncalibrationreq"] === transactionStatus.YES  ? true : false : false}
                    //disabled={props.selectedRecord ? props.selectedRecord["ncalibrationreq"] === transactionStatus.YES  ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES  ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES  ? true : false : false}
                    //disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES  ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>
            {/*{/* ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table. */}
            {/*props.enablerequiredstorage === transactionStatus.YES ?
             <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_STORAGETYPE" })}
                    type="switch"
                    name={"nrequiredstorage"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_STORAGETYPE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nrequiredstorage"] === transactionStatus.YES  ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["nrequiredstorage"] === transactionStatus.YES  ? true : false : false}
                    //disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES  ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>
            : ""*/}
        </Row>
    );
};

export default injectIntl(AddInstrumentCategory);