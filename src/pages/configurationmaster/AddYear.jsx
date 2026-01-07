import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddYear = (props) => {
    return (
        <Row>
            <Col md={12}>
                {/* <FormInput
                    label={props.intl.formatMessage({ id: "IDS_YEAR" })}
                    name={"syear"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_YEAR" })}
                    value={props.selectedRecord ? props.selectedRecord["syear"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={4}
                /> */}
                {/* <FormNumericInput
                //     name="syear"
                //     label={props.intl.formatMessage({ id: "IDS_YEAR" })}
                //     placeholder={props.intl.formatMessage({ id: "IDS_YEAR" })}
                //     type="number"
                //     value={props.selectedRecord ? props.selectedRecord["syear"] : ""}                   
                //     strict={true}
                //     maxLength={4}
                //     onChange={(event) => props.onNumericInputOnChange(event, 'syear')}
                //     noStyle={true}
                //     precision={0}
                //     className="form-control"                   
                //     isMandatory={true}
                //     // errors="Please provide a valid number."
                // /> */}
                <DateTimePicker
                    name={"syear"}
                    label={props.intl.formatMessage({ id: "IDS_YEAR" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_YEAR" })}
                    selected={props.selectedRecord.syear}
                    // showYearDropdown={true}
                    dateFormat={"yyyy"}
                    isClearable={false}
                    onChange={date => props.handleFilterDateChange("syear", date)}
                    value={props.selectedRecord.syear}
                    showYearPicker
                    isMandatory={true}
                    //minDate={new Date(new Date().getFullYear() - 1, 12, 31)}
                    maxDate={new Date(2999, 12, 30)}
                    // scrollableYearDropdown={true}
                    yearDropdownItemNumber={5}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"sdescription"}
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                    maxLength={250}
                    onChange={(event) => props.onInputOnChange(event)}
                    isMandatory={false}
                    required={false}
                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddYear);