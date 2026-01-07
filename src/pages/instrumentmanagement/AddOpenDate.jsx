import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';

const AddOpenDate = (props) => {
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
                    isDisabled={true} 
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntranscode', 1)}
                />
            </Col>

            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
                    name={"dopendate"}
                    label={props.intl.formatMessage({ id: "IDS_OPENDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dopendate"] ? props.selectedRecord["dopendate"] : props.selectedRecord["dopendate"]=new Date()}	//added by sujatha ALPDJ21-21 
                    dateFormat={props.userInfo.ssitedate}
                    minDate={new Date(props.currentTime)}   	//added by sujatha ALPDJ21-21 
                    isClearable={false}
                    required={true}
                    isMandatory={true}
                    onChange={date1 => props.handleDateChange("dopendate", date1)}  	//added by sujatha ALPDJ21-21 
                    value={props.selectedRecord["dopendate"]}
                />
            </Col>
            {props.userInfo.istimezoneshow  === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzopendate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntzopendate"]}
                        defaultValue={props.selectedRecord["ntzopendate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzopendate', 1)}
                    />

                </Col>
            }
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REASON" })}
                    name={"sopenreason"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_OPENREASON" })}
                    value={props.selectedRecord ? props.selectedRecord["sopenreason"] : ""}
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
export default injectIntl(AddOpenDate);