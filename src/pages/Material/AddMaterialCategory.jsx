import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const AddMaterialCategory = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormSelectSearch
                    name={"nmaterialtypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_MATERIALTYPECODE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.materialCatgeoryList || []}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nmaterialtypecode"] : ""}
                    value={props.selectedRecord ? props.selectedRecord["nmaterialtypecode"] : ""}
                    isMandatory={true}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nmaterialtypecode')}
                />
                 
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_MATERIALCATEGORY" })}
                    name="smaterialcatname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_MATERIALCATEGORY" })}
                    value={props.selectedRecord["smaterialcatname"] ? props.selectedRecord["smaterialcatname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
                <FormSelectSearch
                    name={"nbarcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_BARCODE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.barcodeList || []}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nbarcode"] : ""}
                    value={props.selectedRecord ? props.selectedRecord["nbarcode"] : ""}
                    isMandatory={false}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true} 
                    onChange={(event) => props.onComboChange(event, 'nbarcode')}
                />
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    type="switch"
                    name={"ncategorybasedflow"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CATEGORYBASEDFLOW" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ncategorybasedflow"] === 3 ? true : false : false}
                >
                </CustomSwitch>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                >
                </CustomSwitch>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_NEEDSECTIOWISE" })}
                    type="switch"
                    name={"needSectionwise"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_NEEDSECTIOWISE" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["needSectionwise"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    disabled={props.needSectionwisedisabled}
                    checked={props.selectedRecord ? props.selectedRecord["needSectionwise"] === 3 ? true : false : false}
                >
                </CustomSwitch>
            </Col>
        </Row>
    );
};
export default injectIntl(AddMaterialCategory);