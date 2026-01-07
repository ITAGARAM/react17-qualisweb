import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import RuleEngineComboBoxControl from './RuleEngineComboBoxControl';
import { MediaHeader } from '../../components/App.styles';
import { Attachments } from '../../components/dropzone/dropzone.styles';

const AddParameter = (props) => {
    
    return (
        <Row>
            {[...props.parameters.keys()].map((parameter, index) => (
                props.parameters.get(parameter).value === "DateTimePicker" ?
                    <>
                        <Col lg={12}>
                            <DateTimePicker
                                name={parameter}
                                label={props.intl.formatMessage({ id: props.parameters.get(parameter).actuallableName })}
                                className='form-control'
                                placeholderText="Select date.."
                                selected={props.parameters.get(parameter).Datetime}
                                dateFormat={"dd/MM/yyyy"}
                                isClearable={false}
                                isMandatory={true}
                                required={true}
                                //onChange={props.onChange(props.parameters.get(parameter).lableName)}
                                onChange={props.onChange(parameter)}
                                value={props.parameters.get(parameter).Datetime}
                            />
                        </Col>
                    </>
                    :
                    props.parameters.get(parameter).TableName === "" ?
                        <>
                            <Col lg={12}>
                                <FormInput
                                    label={props.intl.formatMessage({ id: props.parameters.get(parameter).actuallableName })}
                                    name={parameter}
                                    type="text"
                                    onChange={props.onInputOnChange(props.parameters.get(parameter).lableName)}
                                    placeholder={props.intl.formatMessage({ id: props.parameters.get(parameter).actuallableName })}
                                    value={props.parameters.get(parameter).textValue}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={100}
                                />
                            </Col>
                        </>
                        :
                        <>
                            <Col lg={12}>
                                <RuleEngineComboBoxControl
                                    onvaluechange={props.onComboChange(parameter)}
                                    tableName={props.parameters.get(parameter).TableName}
                                    fieldName={props.parameters.get(parameter).lableName}
                                    labelName={props.parameters.get(parameter).actuallableName}
                                    displayParam={props.parameters.get(parameter).DisplayParam}
                                />
                            </Col>
                        </>
            ))
            }
            {props.queryTypeCode === 2 &&
                <Col md={12}>
                    {/* <FormInput
                        label={props.intl.formatMessage({ id: props.selectedRecord["sscreenheader"] ? props.selectedRecord["sscreenheader"] : props.sscreenheader ? props.sscreenheader : "" })}
                        name={"IDS_SCREENHEADER"}
                        type="text"
                        //onChange={props.onInputOnChange(index)}
                        //placeholder={props.intl.formatMessage({ id: props.parameters[index].lableName })}
                        value={props.slideResult.length}
                        readOnly={true}
                    /> */}
                    <MediaHeader>
                        <h6 style={{ fontWeight: "bold" }}>
                            {props.selectedRecord["sscreenheader"] ?
                                props.selectedRecord["sscreenheader"]
                                : props.sscreenheader ? props.sscreenheader : ""}
                            :{props.resultStatus === "Warning" ? "" : `${props.slideResult.length} Items`}
                        </h6>
                    </MediaHeader>
                </Col>
            }
            {props.resultStatus === "Success" ?
                <Col md={12}>
                    {props.slideResult && props.slideResult.length>0?
                        <DataGrid
                            pageable={true}
                            scrollable={"scrollable"}
                            gridHeight={'600px'}
                            //gridWidth={'600px'}
                            data={props.slideResult || []}
                            dataResult={process(props.slideResult || [], props.dataStateUserQuery)}
                            dataState={props.dataStateUserQuery}
                            dataStateChange={props.userQueryDataStateChange}
                            extractedColumnList={props.slideList || []}
                            detailedFieldList={[]}
                            hideDetailBand={true}
                            controlMap={props.controlMap}
                            methodUrl="SQLQuery"
                            isActionRequired={false}
                            isToolBarRequired={true}
                            isAddRequired={false}
                            isRefreshRequired={false}
                            selectedId = {null}
                        />
                    :<Attachments className="norecordtxt">
                        {props.intl.formatMessage({id:"IDS_NORECORDSAVAILABLE"})}
                    </Attachments>}
                </Col>
                : props.resultStatus === "Warning" ?
                    <Col md={12}>
                        <MediaHeader>
                            <h6 style={{ color: "red", fontWeight: "bold" }}>
                                {"Message : "} {props.slideResult[0] && props.slideResult[0].Messages}</h6>
                        </MediaHeader>
                    </Col>
                    : ""}
        </Row>
    )
}
export default (injectIntl(AddParameter));
