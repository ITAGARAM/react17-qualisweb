import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { transactionStatus } from '../../components/Enumeration';


const AddInstrumentValidation = (props) => {
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
            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6:12}>
                <DateTimePicker
                    name={"dvalidationdate"}
                    label={props.intl.formatMessage({ id: "IDS_VALIDATIONDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dvalidationdate"] ? props.selectedRecord["dvalidationdate"] : new Date()}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    required={true}
                    isMandatory={true}
                    onChange={date => props.handleDateChange("dvalidationdate", date)}
                    value={props.selectedRecord["dvalidationdate"]}

                />
            </Col>
            {props.userInfo.istimezoneshow === transactionStatus.YES &&
            <Col md={6}>
                <FormSelectSearch
                    name={"ntzvalidationdate"}
                    formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.TimeZoneList}
                    value={props.selectedRecord["ntzvalidationdate"]}
                    defaultValue={props.selectedRecord["ntzvalidationdate"]}
                    isMandatory={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntzvalidationdate', 1)}
                />

            </Col>
}
            <Col md={12}>
                <FormSelectSearch
                    name={"ntranscode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STATUS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.ValidationStatus}
                    value={props.selectedRecord["ntranscode"] ? props.selectedRecord["ntranscode"] : ""}
                    defaultValue={props.selectedRecord["ntranscode"]}
                    isMulti={false}
                    isSearchable={true}
                    isMandatory={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'ntranscode', 1)}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name={"sremark"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    value={props.selectedRecord ? props.selectedRecord["sremark"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>

        </Row>
    );
}

export default injectIntl(AddInstrumentValidation);