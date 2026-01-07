import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { transactionStatus } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddEmployeeAttendence = (props) => {
    return (
        <Row>
            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 12 : 12}>
                <DateTimePicker
                    name={"dattendencedate"}
                    label={props.intl.formatMessage({ id: "IDS_ATTENDENCEDATE" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    dateFormat={props.userInfo.ssitedate} //modified by sujatha ATE_274 on 26-08-2025
                    isClearable={false}
                    // showTimeInput={true} //modified by sujatha ATE_274 on 26-08-2025
                    isMandatory={true}
                    required={true}
                    isDisabled={props.operation == "update" ? true : false}  //added by sujatha to disable while edit SWSM-31 22-09-2025
                    maxDate={props.currentTime}
                    onChange={date => props.handleDateChangeSlidout("dattendencedate", date)}
                    selected={props.selectedRecord ? props.selectedRecord["dattendencedate"] : new Date()} />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    name={"nemptypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_EMPLOYEETYPE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.employeeAttendenceList || []}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nemptypecode"] : ""}
                    value={props.selectedRecord ? props.selectedRecord["nemptypecode"] : ""}
                    isMandatory={true}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={true}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nemptypecode')}
                />
                <FormSelectSearch
                    name={"nusercode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_EMPLOYEES" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTEMPLOYEE" })}
                    options={props.employeeList || []}
                    value={props.selectedRecord ? props.selectedRecord["nusercode"] : ""}
                    isMandatory={true}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                   isDisabled={props.operation == "update" ? true : false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nusercode')}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ISPRESENT" })}
                    type="switch"
                    name={"nispresent"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ISPRESENT" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nispresent"] === 3 ? true : false : ""}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["nispresent"] === 3 ? true : false : false}
                >
                </CustomSwitch>
                <DateTimePicker
                    name={"dentrydatetime"}
                    label={props.intl.formatMessage({ id: "IDS_ENTRYDATETIME" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    selected={props.selectedRecord["dentrydatetime"]}
                    dateFormat={props.userInfo.ssitedatetime}
                    timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                    showTimeInput={true}
                    isClearable={true}
                    isMandatory={props.selectedRecord["nispresent"] == transactionStatus.YES ? true : false}
                    required={true}
                    maxDate={props.currentTime}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChangeSlidout("dentrydatetime", date)}
                    value={props.selectedRecord["dentrydatetime"]}
                />
                <DateTimePicker
                    name={"dexitdatetime"}
                    label={props.intl.formatMessage({ id: "IDS_EXITDATETIME" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    selected={props.selectedRecord["dexitdatetime"]}
                    dateFormat={props.userInfo.ssitedatetime}
                    timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                    showTimeInput={true}
                    isClearable={true}
                    isMandatory={false}
                    maxDate={props.currentTime}
                    required={true}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChangeSlidout("dexitdatetime", date)}
                    value={props.selectedRecord["dexitdatetime"]}
                />
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name="sremarks"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    value={props.selectedRecord["sremarks"] ? props.selectedRecord["sremarks"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
        </Row>
    );
};
export default injectIntl(AddEmployeeAttendence);