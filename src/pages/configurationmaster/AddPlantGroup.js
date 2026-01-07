import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../../src/components/data-grid/data-grid.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { process } from '@progress/kendo-data-query';
//import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
//import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddPlantGroup = (props) => {
        return (
                <Col>
                        <Col md={12}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_FUSIONSITE" })}
                                        isSearchable={true}
                                        name={"ssitecode"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.fusionplantSite || []}
                                        value={props.selectedRecord["ssitecode"] || ""}
                                        defaultValue={props.selectedRecord["ssitecode"]}
                                        onChange={(event) => props.onComboChange(event, "ssitecode", 1)}
                                        //onChange={(event) => props.onComboChange(event, "ncontrolBasedparameter", 1)}
                                        closeMenuOnSelect={true}
                                        isMulti={false}
                                />
                        </Col>
                        <Col md={12}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_FUSIONPRANENTPLANT" })}
                                        isSearchable={true}
                                        name={"splantparentcode"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.selectedRecord["ssitecode"]?props.fusionparentplants || []:[]}
                                        value={props.selectedRecord["splantparentcode"] || ""}
                                        defaultValue={props.selectedRecord["splantparentcode"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "splantparentcode", 2)}
                                        closeMenuOnSelect={true}
                                        isMulti={false}
                                />
                        </Col>
                        <Col md={12}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_FUSIONCHILDPLANTS" })}
                                        isSearchable={true}
                                        name={"splantchildcode"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={ props.selectedRecord["splantparentcode"]!==undefined? props.fusionchildplants || []:[]}
                                        value={props.selectedRecord["splantchildcode"] || ""}
                                        defaultValue={props.selectedRecord["splantchildcode"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "splantchildcode", 3)}
                                        closeMenuOnSelect={true}
                                        isMulti={props.operation === "create" ? true : false}
                                />
                        </Col>  
                </Col>
        )
}

export default injectIntl(AddPlantGroup);