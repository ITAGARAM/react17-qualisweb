import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';



const AddBulkBarcodeConfigMaster = (props) => {
    return (
        <Row>

            {props.fieldName === 'barcodemaster' ?
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_BARCODEMASTERNAME" })}
                        isSearchable={true}
                        name={"nbarcodemastercode"}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.bulkBarcodeMasterList}
                        optionId='nbarcodemastercode'
                        optionValue='stablename'
                        value={props.selectedMasterRecord &&props.selectedMasterRecord["nbarcodemastercode"]}
                        onChange={(event) => props.onComboChange(event, 'nbarcodemastercode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isDisabled={props.operation === 'update' ? true : false}
                    />
                </Col>
                : ""}
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_FIELDNAME" })}
                    name={"sfieldname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 'sfieldname')}
                    placeholder={props.formatMessage({ id: "IDS_FIELDNAME" })}
                    value={props.selectedMasterRecord["sfieldname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    readOnly={props.operation === 'update' ? true : false}
                />
            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_FIELDLENGTH" })}
                    name={"nfieldlength"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 'nfieldlength')}
                    placeholder={props.formatMessage({ id: "IDS_FIELDLENGTH" })}
                    value={props.selectedMasterRecord["nfieldlength"]}
                    isMandatory={true}
                    required={true}
                    maxLength={2}
                    readOnly={props.operation === 'update' ? true : false}
                />
            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_SORTORDER" })}
                    name={"nsorter"}
                    type="numeric"
                    onChange={(event) => props.onInputOnChange(event, 'nsorter')}
                    placeholder={props.formatMessage({ id: "IDS_SORTORDER" })}
                    value={props.selectedMasterRecord["nsorter"]}
                    isMandatory={true}
                    required={true}
                    maxLength={2}
                />
            </Col>


            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event, 'sdescription')}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedMasterRecord["sdescription"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                    readOnly={props.operation === 'update' ?true:false}
                />
            </Col>
            {props.fieldName === 'barcodemaster' ?
                <Col md={12}>
                    <CustomSwitch
                        label={props.formatMessage({ id: "IDS_NEEDPARENT" })}
                        type="switch"
                        name={"isneedparent"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_NEEDPARENT" })}
                        defaultValue={props.selectedMasterRecord["isneedparent"] === transactionStatus.YES ? true : false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedMasterRecord["isneedparent"] === transactionStatus.YES ? true : false}
                        disabled={props.operation === 'update' ? true : false}
                    
                    />
                </Col> : ""}
                <Col md={12}>
                    <CustomSwitch
                        label={props.formatMessage({ id: "IDS_ENABLEFORPROCESSINGTIMEVALIDATION" })}    				//ALPD-5082 Added isvalidationrequired for toggle button by VISHAKH
                        type="switch"
                        name={"isvalidationrequired"}
                        onChange={(event) => props.onInputOnChange(event, 'isvalidationrequired')}
                        placeholder={props.formatMessage({ id: "IDS_NEEDPARENT" })}
                        defaultValue={props.selectedMasterRecord["isvalidationrequired"] === transactionStatus.YES ? true : false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedMasterRecord["isvalidationrequired"] === transactionStatus.YES ? true : false}
                        // disabled={props.operation === 'update' ? true : false}
                    
                    />
                </Col>
            {props.selectedMasterRecord["isneedparent"] === transactionStatus.YES ?
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_PARENTMASTERNAME" })}
                        isSearchable={true}
                        name={"nparentmastercode"}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.ParentBarcodeMasterList}
                        optionId='nbarcodemastercode'
                        optionValue='stablename'
                        value={props.selectedMasterRecord["nparentmastercode"]}
                        onChange={(event) => props.onComboChange(event, 'nparentmastercode')}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isDisabled={props.operation === 'update' ? true : false}
                    />
                    {/* <FormInput
                        label={props.formatMessage({ id: "IDS_PARENTFIELDLENGTH" })}
                        name={"nparentfieldlength"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event, 'nparentfieldlength')}
                        placeholder={props.formatMessage({ id: "IDS_PARENTFIELDLENGTH" })}
                        value={props.selectedMasterRecord["nparentfieldlength"]}
                        isMandatory={true}
                        required={true}
                        maxLength={2}
                        readOnly={props.operation === 'update' ? true : false}
                    /> */}
                </Col> : ""
            }
        </Row>


    )
}
export default AddBulkBarcodeConfigMaster;