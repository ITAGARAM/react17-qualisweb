import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddMaterialOpenDate = (props) => {
    return (
        <Row>
            <Col md={12}>
                <DateTimePicker
                    name={props.label}
                    label={props.isMultiLingualLabel ? props.intl.formatMessage({ id: props.label }) : props.label}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    selected={props.selectedRecord[props.label] ? new Date(props.selectedRecord[props.label]) : null}
                    dateFormat={props.dateonly === true ? props.userInfo["ssitedate"] : props.timeonly ? 'HH:mm' : props.userInfo["ssitedatetime"]}
                    timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                    showTimeInput={props.dateonly === true ? false : true}
                    showTimeSelectOnly={props.timeonly}
                    isMandatory={props.mandatory}
                    maxDate={props.CurrentTime}
                    maxTime={props.CurrentTime}
                    onChange={(date) => props.handleDateChange(date, props.label)}
                    value={props.selectedRecord ? props.selectedRecord["dcollectiondate"] : new Date()}
                />
            </Col>
            {/* <Col md={6}>
                <FormSelectSearch
                    name={`tz${props.label}`}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event,`tz${props.label}`)}
                    formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    // defaultValue={this.props.defaultTimeZone}
                    value={props.selectedRecord[`tz${props.label}`] ? props.selectedRecord[`tz${props.label}`] : props.defaultTimeZone}
                    options={props.timeZoneList}
                    optionId={"value"}
                    optionValue={"label"}
                    isMulti={false}
                    isSearchable={false}
                    isClearable={false}
                />
            </Col> */}
        </Row>
    );
};
export default injectIntl(AddMaterialOpenDate);