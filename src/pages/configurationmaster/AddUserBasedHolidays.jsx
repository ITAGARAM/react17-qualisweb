import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';

const AddUserBasedHolidays = (props) => {
    return (
        <Row>
              <Col md={12}>
                <FormSelectSearch
                    name={"nusercode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                    placeholder="Please Select..."
                    options={props.Users}
                    // optionId="ntimezonecode"
                    // optionValue="stimezoneid"
                    value={props.selectedRecord["nusercode"]?props.selectedRecord["nusercode"]:""}
                    defaultValue={props.selectedRecord["nusercode"]?props.selectedRecord["nusercode"]:""}
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    // alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'nusercode')}
                />
            </Col>
            <Col md={12}>
                <DateTimePicker
                    name={"ddate"}
                    label={props.intl.formatMessage({ id: "IDS_DATE" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.selectedRecord["ddate"]}
                    //dateFormat={"dd/MM/yyyy"}
                    dateFormat={props.userInfo["ssitedate"]}
                    isClearable={true}
                    onChange={date => props.handleDateChange("ddate", date)}
                    value={props.selectedRecord["ddate"]}
                    isMandatory={true}
                    required={true}
                    minDate= {props.minDate}
                    maxDate={props.maxDate}
                />
            </Col>
            {/* ALPD-5365 Holiday planner - Public holidays, user base holidays - time zone to be hided. */}
{props.userInfo.istimezoneshow === transactionStatus.YES &&
            <Col md={12}>
                <FormSelectSearch
                    name={"ntzddate"}
                    formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                    placeholder="Please Select..."
                    options={props.timeZoneList}
                    // optionId="ntimezonecode"
                    // optionValue="stimezoneid"
                    value={props.selectedRecord["ntzddate"]}
                    defaultValue={props.selectedRecord["ntzddate"]}
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    // alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntzddate')}
                />
            </Col>
}
            <Col md={12}>
                <FormTextarea
                    name={"sdescription"}
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    onChange={(event) => props.onInputOnChange(event)}
                />
            </Col>
        </Row>
    )
}

export default injectIntl(AddUserBasedHolidays);