import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';





const AddInstrumentMaintenance = (props) => {
    // console.log("123", props)
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
            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
                    name={"dlastmaintenancedate"}
                    label={props.intl.formatMessage({ id: "IDS_LASTMAINTENANCEDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dlastmaintenancedate"] ? props.selectedRecord["dlastmaintenancedate"] : new Date()}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isDisabled={true}     	//added by sujatha ALPDJ21-21 
                    isMandatory={true}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChange("dlastmaintenancedate", date)}
                    value={props.selectedRecord["dlastmaintenancedate"]}

                />
            </Col>
            {props.userInfo.istimezoneshow === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzlastmaintenancedate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntzlastmaintenancedate"]}
                        defaultValue={props.selectedRecord["ntzlastmaintenancedate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzlastmaintenancedate', 1)}
                    />

                </Col>
            }
            {/* /added by sujatha ALPDJ21-21  */}
           {/* <Col md={props.userInfo.istimezoneshow  === transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
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

                />
            </Col>*/}
            {/* /added by sujatha ALPDJ21-21  */}
            <Col md={props.userInfo.istimezoneshow  === transactionStatus.YES? 6 : 12}>
            <FormInput
                label={props.intl.formatMessage({ id: "IDS_MAINTENANCEINTERVALPERIOD" })}
                name={"nnextmaintenanceperiod"}
                type="text"
                onChange={(event) => props.onInputOnChange(event)}
                value={props.nextmaintenanceperiod}
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
                    options={props.MaintenanceStatus}
                    value={props.selectedRecord["ntranscode"] ? props.selectedRecord["ntranscode"] : ""}
                    defaultValue={props.selectedRecord["ntranscode"]}
                    isMulti={false}
                    isSearchable={true}
                    isMandatory={true}
                    isDisabled={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntranscode', 1)}
                />
            </Col>

        </Row>
    );
}

export default injectIntl(AddInstrumentMaintenance);