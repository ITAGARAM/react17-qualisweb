import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';


const PatientMasterFilter = (props) => {
    return (
        <Row>
                   <Col md={6}>
                   <DateTimePicker
                    name={"fromdate"}
                    label={props.intl.formatMessage({ id: "IDS_FROM" })}
                    className='form-control'
                    selected={ props.selectedRecord["fromdate"]||props.fromDate}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isMandatory={false}
                    onChange={date =>props.handleDateChange("fromdate", date)}
                    value={ props.selectedRecord["fromdate"] || props.fromDate}
                   // minDate={fromDate}
                    maxDate={props.toDate}
                /> 
                  </Col> 
                  <Col  md={6}>
                  <DateTimePicker
                    name={"todate"}
                    label={props.intl.formatMessage({ id: "IDS_TODATE" })}
                    className='form-control'
                    selected={props.selectedRecord["ToDay"] || props.toDate}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isMandatory={false}
                    peekNextMonth={true}
                    onChange={date => props.handleDateChange("ToDay", date)}
                    value={ props.selectedRecord["ToDay"]||props.toDate}
                    maxDate={props.toDate}
                  //  minDate={fromDate}
                />
                </Col>
                <Col md="12">
                <FormSelectSearch
                        name={"npatientcasetypecode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_PATIENTCASETYPE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_PATIENTCASETYPE" })}
                        options={props.patientcasetypeList}
                        value={props.selectedRecord.npatientcasetypecode !== undefined ? props.selectedRecord.npatientcasetypecode : props.selectedProjectcasetype &&  { "label": props.selectedProjectcasetype.spatientcasetypename, "value": props.selectedProjectcasetype.npatientcasetypecode }}
                        isMandatory={false}
                        required={true}
                        isClearable={false}
                        isMulti={false}
                        isSearchable={false}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'npatientcasetypecode')}
                    />
                </Col>
                  </Row>
    );
};

export default injectIntl(PatientMasterFilter);