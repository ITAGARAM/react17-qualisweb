import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {injectIntl } from 'react-intl';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
//import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
//import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddReportDetail = (props) => {
        return(
                    <Row> 
                        <Col md={12}> 
                           <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_VALIDATIONSTATUS" })}
                                        isSearchable={true}
                                        name={"ntranscode"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.reportTypeList || []}
                                        value={props.selectedRecord["ntranscode"] || ""}
                                        defaultValue={props.selectedRecord["ntranscode"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "ntranscode")}
                                        closeMenuOnSelect={true}
                                        isMulti={true}
                                        scrollable={"scrollable"}
                                        //pageable={true}
                                />
                       </Col>
                  </Row>
            )   
}

export default injectIntl(AddReportDetail);