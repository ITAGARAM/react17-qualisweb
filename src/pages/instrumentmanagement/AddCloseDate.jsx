import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';


const AddCloseDate = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormSelectSearch
                    name={"ntranscode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STATUS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.Status}
                    value={props.selectedRecord["ntranscode"] ? props.selectedRecord["ntranscode"] : ""}
                    defaultValue={props.selectedRecord["ntranscode"]}
                    isMulti={false}
                    isSearchable={true}
                    isMandatory={true}
                    isDisabled={true}  	//added by sujatha ALPDJ21-21 
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntranscode', 1)}
                />
            </Col>

            <Col md={props.userInfo.istimezoneshow ===transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
                    name={"dclosedate"}
                    label={props.intl.formatMessage({ id: "IDS_CLOSEDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dclosedate"] ? props.selectedRecord["dclosedate"] : props.selectedRecord["dclosedate"]=new Date()}
                    dateFormat={props.userInfo.ssitedate}
                    minDate={new Date(props.currentTime)}   	//added by sujatha ALPDJ21-21 
                    // maxTime={props.currentTime}
                    isClearable={false}
                    required={true}
                    isMandatory={true}
                    onChange={date => props.handleDateChange("dclosedate", date)}
                    value={props.selectedRecord["dclosedate"]}

                />
            </Col>
            {props.userInfo.istimezoneshow ===transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzclosedate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        value={props.selectedRecord["ntzclosedate"]}
                        defaultValue={props.selectedRecord["ntzclosedate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzclosedate', 1)}
                    />

                </Col>
            }
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REASON" })}
                    name={"sclosereason"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CLOSEREASON" })}
                    value={props.selectedRecord ? props.selectedRecord["sclosereason"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>
        </Row>
    )
}
export default injectIntl(AddCloseDate);