import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../../components/data-grid/data-grid.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { process } from '@progress/kendo-data-query';
//import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
//import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

const AddReportParameters = (props) => {
        return (
                <Row>
                        <Col md={6}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_REPORTPARAMETER" })}
                                        isSearchable={true}
                                        name={"scontrolBasedparameter"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.reportTypeListparameter || []}
                                        value={props.selectedRecord["ncontrolBasedparameter"] || ""}
                                        defaultValue={props.selectedRecord["ncontrolBasedparameter"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "ncontrolBasedparameter", 1)}
                                        closeMenuOnSelect={true}
                                        isMulti={false}
                                />
                        </Col>
                        <Col md={6}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_REPORTTABLECOLUMNNAME" })}
                                        isSearchable={true}
                                        name={"stablename"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.reportTypeListName || []}
                                        value={props.selectedRecord["nquerybuildertablecodecolumn"] || ""}
                                        defaultValue={props.selectedRecord["nquerybuildertablecodecolumn"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "nquerybuildertablecodecolumn", 2)}
                                        closeMenuOnSelect={true}
                                        isMulti={false}
                                />
                        </Col>
                        {/* <Col md={6}>
                                <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_REPORTTABLECOLUMNNAME" })}
                                        isSearchable={true}
                                        name={"stablecolumn"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.reportTypeListColumn || []}
                                        value={props.selectedRecord["nquerybuildertablecodecolumn"] || ""}
                                        defaultValue={props.selectedRecord["nquerybuildertablecodecolumn"]}
                                        //onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                                        onChange={(event) => props.onComboChange(event, "nquerybuildertablecodecolumn", 3)}
                                        closeMenuOnSelect={true}
                                        isMulti={false}
                                />
                        </Col> */}
                        <Col className="d-flex justify-content-end p-2" md={12}>
                                <Button className="btn-user btn-primary-blue"
                                onClick={() => props.addreportParametersInDataGrid(props.selectedRecord)}
                                >
                                        <FontAwesomeIcon icon={faSave} /> { }
                                        <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                                </Button>
                        </Col>
                        <Row>
                                 <Col md={12}>
                                        <DataGrid primaryKeyField={"nreportparameterconfigurationcode"}
                                                data={props.gridDataparmeter || []}
                                                dataResult={process(props.gridDataparmeter || [] ,{ skip: 0, take: 10 })}
                                                dataState={props.dataState || { skip: 0, take: 10 }}
                                                //dataStateChange={(event) => this.setState({ dataState: event.dataState })|| []}
                                                extractedColumnList={props.gridColumnList}
                                                controlMap={props.controlMap}
                                                userRoleControlRights={props.userRoleControlRights}
                                                inputParam={props.inputParam}
                                                userInfo={props.userinfo}
                                                deleteRecordWORights={props.deleteRecordWORights}
                                                pageable={false}
                                                scrollable={"scrollable"}
                                                methodUrl={"ReportParameterMapping"}
                                                isActionRequired={true}
                                                //isToolBarRequired={false}
                                                //selectedId={null}
                                                hideColumnFilter={true}
                                                hasControlWithOutRights={true}
                                                showdeleteRecordWORights={true}
                                                //ALPD-5537 Report Designer -> In control-based report add the version then configure Parameter extra icon was shows.

                                        />
                                </Col> 
                        </Row>
                </Row>



        )
}

export default injectIntl(AddReportParameters);