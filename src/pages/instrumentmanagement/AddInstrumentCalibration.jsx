import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';





const AddInstrumentCalibration = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                    name={"ninstrumentcode"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    value={props.instrumentid}
                    isDisabled={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={props.userInfo.istimezoneshow  === transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
                    name={"dlastcalibrationdate"}
                    label={props.intl.formatMessage({ id: "IDS_LASTCALIBRATIONDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dlastcalibrationdate"] ? props.selectedRecord["dlastcalibrationdate"] : new Date()}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isDisabled={true}  	//added by sujatha ALPDJ21-21 
                    isMandatory={true}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChange("dlastcalibrationdate", date)}
                    value={props.selectedRecord["dlastcalibrationdate"]}

                />
            </Col>
            {props.userInfo.istimezoneshow  === transactionStatus.YES  &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzlastcalibrationdate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        value={props.selectedRecord["ntzlastcalibrationdate"]}
                        defaultValue={props.selectedRecord["ntzlastcalibrationdate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzlastcalibrationdate', 1)}
                    />

                </Col>
            }
            <Col md={props.userInfo.istimezoneshow  === transactionStatus.YES? 6 : 12}>
                {/* <DateTimePicker
                    name={"dduedate"}
                    label={props.intl.formatMessage({ id: "IDS_DUEDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dduedate"] ? props.selectedRecord["dduedate"] : new Date()}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isMandatory={true}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChange("dduedate", date)}
                    value={props.selectedRecord["dduedate"]}

                /> */}
                
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                    name={"nnextcalibrationperiod"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    value={props.nextcalibrationperiod}
                    isDisabled={true}
                    required={true}
                    maxLength={"100"}
                />
            
            </Col>
            {props.userInfo.istimezoneshow === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzduedate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        value={props.selectedRecord["ntzduedate"]}
                        defaultValue={props.selectedRecord["ntzduedate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzduedate', 1)}
                    />

                </Col>
            }
            <Col md={12}>
                <FormSelectSearch
                    name={"ntranscode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STATUS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.CalibrationStatus}
                    value={props.selectedRecord["ntranscode"] ? props.selectedRecord["ntranscode"] : ""}
                    defaultValue={props.selectedRecord["ntranscode"]}
                    isMulti={false}
                    isSearchable={true}
                    isMandatory={true}
                    isDisabled={true}    	//added by sujatha ALPDJ21-21 
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntranscode', 1)}
                />
            </Col>

        </Row>
    );
}

export default injectIntl(AddInstrumentCalibration);