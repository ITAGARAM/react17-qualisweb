import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

import FormInput from '../../../components/form-input/form-input.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const AddCertificateTypeVersion = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nreportcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_REPORTNAME" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.reportMasterList}
                    value={props.selectedRecord["nreportcode"]}
                    isMandatory={true}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nreportcode')}
                />
            </Col>
            <Col md={6}>
                <FormSelectSearch
                    name={"nreportdetailcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_REPORTVERSIONNO" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.reportDetailsList}
                    value={props.selectedRecord["nreportdetailcode"]}
                    isMandatory={true}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nreportdetailcode')}
                />
            </Col>
            <Col md={6}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_VERSIONSTATUS" })}
                    name={"sdisplaystatus"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_VERSIONSTATUS" })}
                    value={props.selectedRecord["sdisplaystatus"] ? props.selectedRecord["sdisplaystatus"] : "-"}                    
                    isMandatory={false}
                    required={false}
                    isDisabled={true}
                />
            </Col>
            
            <Col md={12}>
                <FormSelectSearch
                    name={"npreviewreportcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_PREVIEWREPORTNAME" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.previewReportMasterList}
                    value={props.selectedRecord["npreviewreportcode"]}
                    isMandatory={true}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'npreviewreportcode')}
                />
            </Col>
            <Col md={6}>
                <FormSelectSearch
                    name={"npreviewreportdetailcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_PREVIEWREPORTVERSIONNO" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.previewReportDetailsList}
                    value={props.selectedRecord["npreviewreportdetailcode"]}
                    isMandatory={true}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'npreviewreportdetailcode')}
                />
            </Col>
            <Col md={6}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_PREVIEWVERSIONSTATUS" })}
                    name={"spreviewdisplaystatus"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_PREVIEWVERSIONSTATUS" })}
                    value={props.selectedRecord["spreviewdisplaystatus"] ? props.selectedRecord["spreviewdisplaystatus"] : "-"}
                    isMandatory={false}
                    required={false}
                    isDisabled={true}
                />
            </Col>
            <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ISACTIVESTATUS" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ISACTIVESTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : false}
                    isMandatory={false}
                    rows="3"
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false : false}

                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddCertificateTypeVersion)