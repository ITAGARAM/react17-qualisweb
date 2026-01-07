import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "./date-time-picker/date-time-picker.component";
import FormSelectSearch from "./form-select-search/form-select-search.component";

const BatchFilter = (props) => {
    return (
        <Row>
                <Col md={12}>
                        <DateTimePicker
                                      name={"fromdate"}
                                      label={props.intl.formatMessage({ id: "IDS_FROM" })}
                                      className="form-control"
                                      placeholderText="Select date.."
                                      selected={props.selectedRecord["fromdate"] || props.fromDate}
                                      dateFormat={props.userInfo.ssitedate}            
                                      isClearable={false}
                                      onChange={(date) => props.handleDateChange("fromdate", date)}
                                      value={props.selectedRecord["fromdate"] || props.fromDate}
                        />
                {/* </Col>
                <Col md={6}> */}
                        <DateTimePicker
                                        name={"todate"}
                                        label={props.intl.formatMessage({ id: "IDS_TO" })}
                                        className="form-control"
                                        placeholderText="Select date.."
                                        selected={props.selectedRecord["todate"] || props.toDate}
                                        dateFormat={props.userInfo.ssitedate}
                                        isClearable={false}
                                        onChange={(date) => props.handleDateChange("todate", date)}              
                                        value={props.selectedRecord["todate"] || props.toDate}
                        /> 

                        <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_STATUS" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_STATUS" })}
                                        name="nfiltertransstatus"
                                        //optionId="ntransactionstatus"
                                       // optionValue="sfilterstatus"
                                        className='form-control'
                                        options={props.statusList}
                                        value={props.selectedRecord.nfiltertransstatus ? props.selectedRecord.nfiltertransstatus
                                                         :props.selectedFilterStatus ? { "label": props.selectedFilterStatus.stransdisplaystatus, "value": props.selectedFilterStatus.ntransactionstatus } : ""}
                                        isMandatory={false}
                                        isMulti={false}
                                        isSearchable={false}
                                        isDisabled={false}
                                        //alphabeticalSort={false}
                                        isClearable={false}
                                        onChange={(event) => props.onFilterComboChange(event, "nfiltertransstatus")}
                        />
            </Col>
      </Row>
  );
};
export default injectIntl(BatchFilter);