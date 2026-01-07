import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
const AddReportDetails = (props) => {
  return (
    <Row>
      <Col md={12}>
        
                   
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_REPORTTYPE" })}
                            isSearchable={true}
                            name={"nmaterialaccountinggroupcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_REPORTTYPE" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.masterData.accountingPlantGroup}
                            value={props.selectedRecord["nmaterialaccountinggroupcode"] || ""}
                            defaultValue={props.selectedRecord["nmaterialaccountinggroupcode"]}
                            onChange={(event) => props.onComboChange(event, "nmaterialaccountinggroupcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_URANIUMCONTENTTYPE" })}
                            isSearchable={true}
                            name={"nuraniumcontenttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.masterData.UraniumContentType}
                            value={props.selectedRecord["nuraniumcontenttypecode"] || ""}
                            defaultValue={props.selectedRecord["nuraniumcontenttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nuraniumcontenttypecode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>


                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_MONTH" })}
                            isSearchable={true}
                            name={"nmonth"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.masterData.listOfMonth}
                            value={props.selectedRecord["nmonth"] || ""}
                            defaultValue={props.selectedRecord["nmonth"]}
                            onChange={(event) => props.onComboChange(event, "nmonth", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
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
                 <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            name={"scomments"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"500"}
                        >
                        </FormTextarea>
      </Col>

    </Row>
  );
}

export default injectIntl(AddReportDetails);