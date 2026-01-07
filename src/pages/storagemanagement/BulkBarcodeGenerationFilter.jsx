import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";

const BulkBarcodeGenerationFilter = (props) => {
   

    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={props.intl.formatMessage({ id: "IDS_FROM" })}
                            className="form-control"
                            placeholderText={props.intl.formatMessage({ id: "IDS_FROM" })}
                            selected={props.fromDate}
                            value={props.fromDate}
                            dateFormat={props.userInfo&&props.userInfo.ssitedate && props.userInfo.ssitedate}
                            isClearable={false}
                            onChange={(date) => props.handleDateChange("FromDate", date)}
                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                            className="form-control"
                            placeholderText={props.intl.formatMessage({ id: "IDS_TO" })}
                            selected={props.toDate}
                            value={props.toDate}
                            dateFormat={props.userInfo&&props.userInfo.ssitedate && props.userInfo.ssitedate}
                            isClearable={false}
                            onChange={(date) => props.handleDateChange("ToDate", date)}
                        />
                    </Col>
                </Row>
            </Col>

            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                    isSearchable={true}
                    name={"nprojecttypecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.projectType}
                    value={props.defaultProjectType}
                    defaultValue={props.defaultProjectType}
                    onChange={(event) => props.onComboChange(event, "nprojecttypecode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
            <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_BULKBARCODECONDIG" })}
                    isSearchable={true}
                    name={"nbulkbarcodeconfigcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.defaultProjectType && props.bulkbarcodeconfig}
                    value={props.masterData.defaultBarcodeConfig && props.masterData.defaultBarcodeConfig}
                    defaultValue={props.masterData.defaultBarcodeConfig && props.masterData.defaultBarcodeConfig}
                    //value={props.defaultProjectType && props.selectedRecord&&props.selectedRecord['nbulkbarcodeconfigcode']&& props.selectedRecord['nbulkbarcodeconfigcode'] || "" }
                    //defaultValue={props.defaultProjectType &&props.selectedRecord&& props.selectedRecord['nbulkbarcodeconfigcode']&& props.selectedRecord['nbulkbarcodeconfigcode'] || "" }
                    onChange={(event) => props.onComboChange(event, "nbulkbarcodeconfigcode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(BulkBarcodeGenerationFilter);