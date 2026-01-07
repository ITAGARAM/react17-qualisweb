import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const CustomerComplaintInitiate = (props) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dtransactiondate"}
                            label={props.intl.formatMessage({ id: "IDS_CUSTOMERCOMPLAINTDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            dateFormat={props.userInfo.ssitedate}   //modified by sujatha ATE_274 01-10-2025 for showing only date without time
							//commentted by sujatha ATE_274 for showing only date without time
                            // timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            // showTimeInput={true}
                            // timeFormat={true}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            minDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dtransactiondate", date)}
                            selected={props.selectedRecord ? props.selectedRecord["dtransactiondate"] : new Date()}
                            value={props.selectedRecord["dtransactiondate"] || ""}

                        />
                    </Col>
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntztransactiondate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.timeZone}
                                value={props.selectedRecord["ntztransactiondate"]}
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isClearable={false}
                                closeMenuOnSelect={true}
                                onChange={(event) => props.onComboChange(event, 'ntztransactiondate')}
                            />
                        </Col>
                    }
                    <Col md={12}>
                        <FormTextarea
                            name={"sremarks"}
                            label={props.operation == "reschedule" ? props.intl.formatMessage({ id: "IDS_REASONFORRESCHEDULE" }) : props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={props.selectedRecord ? props.selectedRecord["sremarks"] : ""}
                            isMandatory={props.operation == "reschedule" ? true : false}
                            required={false}
                            maxLength={255}
                        />
                    </Col>
                </Col>
            </Row>
        </>
    )
}
export default injectIntl(CustomerComplaintInitiate);
