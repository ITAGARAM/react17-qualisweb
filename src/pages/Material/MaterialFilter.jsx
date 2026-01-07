import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
const MaterialFilter = (props) => {

    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_MATERIALTYPE" })}
                    isSearchable={true}
                    name={"nmaterialtypecode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={false}
                    showOption={true}
                    options={props.filterCatList}
                    optionId='nmaterialtypecode'
                    optionValue='smaterialtypename'
                    value={props.selectedRecord["nmaterialtypecode"] ? props.selectedRecord["nmaterialtypecode"] : ""}
                    onChange={value => props.onComboChange(value, "nmaterialtypecode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.selectedRecord["nmaterialtypecode"].value === 5 ? props.intl.formatMessage({ id: "IDS_SAMPLEGROUPNAME" }) : props.intl.formatMessage({ id: "IDS_MATERIALCATEGORY" }) }
                    isSearchable={true}
                    name={"nmaterialcatcode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={false}
                    showOption={true}
                    options={props.materialCatList}
                    optionId='nmaterialcatcode'
                    optionValue='smaterialcatname'
                    value={props.selectedMaterialCat["nmaterialcatcode"] ? props.selectedMaterialCat["nmaterialcatcode"] : ""}
                    onChange={value => props.onComboChange(value, "nmaterialcatcode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                {props.selectedRecord["nmaterialtypecode"].value === 5 ?
                    <>
                        <DateTimePicker
                            name={"fromdate"}
                            label={props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_FROM" })}
                            selected={props.fromDate}
                            value={props.fromDate}
                            dateFormat={props.userInfo.ssitedate}
                            onChange={date => props.handleDateChange("fromDate", date)}
                            isClearable={false}
                        />
                        <DateTimePicker
                            name={"todate"}
                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_TO" })}
                            selected={props.toDate}
                            value={props.toDate}
                            dateFormat={props.userInfo.ssitedate}
                            onChange={date => props.handleDateChange("toDate", date)}
                            isClearable={false}
                        />
                    </>
                    : ""}
                {props.ismaterialInventory &&
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_MATERIAL" })}
                        isSearchable={true}
                        name={"nmaterialcode"}
                        isDisabled={false}
                        placeholder="Please Select..."
                        isMandatory={false}
                        showOption={true}
                        options={props.MaterialComboList}
                        optionId='nmaterialcode'
                        optionValue='smaterialname'
                        value={props.selectedMaterialcombo["nmaterialcode"] ? props.selectedMaterialcombo["nmaterialcode"] : ""}
                        onChange={value => props.onComboChange(value, "nmaterialcode", 4)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>}


            </Col>
        </Row>
    );

};

export default injectIntl(MaterialFilter);