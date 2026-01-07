import { faGripVertical, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { BuilderBorder, ContionalButton, DeleteRule } from './RuleEngineSqlbuilder.styled';
import '../../assets/styles/querybuilder.css';
import { ColumnType } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { stringOperatorData, conditionalOperatorData, numericOperatorData, joinConditionData, aggregateFunction, orderByList } from './RuleEngineQueryBuilderData';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import DataGrid from '../../components/data-grid/data-grid.component';


const QueryBuilderParamter = (props) => {


    function createRules() {
        let design = [];
        props.comboData.sdefaultvalue.map((dataItem, index) => {
            design.push(
                <>
                    <Row className="mt-3">
                        {dataItem.items.columntype === ColumnType.TEXTINPUT ?
                            <>
                                {dataItem.symbolObject.items.isInputVisible ?
                                    <>
                                        {dataItem.items.needmasterdata ?

                                            <Col md={12}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={dataItem.items.displayname["en-US"]}
                                                    isSearchable={true}
                                                    name={`$p` + (index + 1)}
                                                    showOption={true}
                                                    options={props.viewMasterData[index] || []}
                                                    optionId={dataItem.items.valuemember}
                                                    optionValue={"sdisplayname"}
                                                    value={dataItem.value || ""}
                                                    isMulti={dataItem.symbolObject.items.ismulti}
                                                    onChange={value => props.onParamComboChange(value, index)}
                                                ></FormSelectSearch>
                                            </Col> :
                                            <Col md={12}>
                                                <FormInput
                                                    formGroupClassName="remove-floating-label-margin"
                                                    label={dataItem.items.displayname["en-US"]}
                                                    name={`$p` + (index + 1)}
                                                    type="text"
                                                    onChange={(event) => props.onParamInputChange(event, 3, index, dataItem)}
                                                    value={dataItem.symbolObject.items.symbolType === 4 ? dataItem.showInputValue : dataItem.value}
                                                    maxLength={100}
                                                />
                                            </Col>

                                        }
                                    </>
                                    : <></>
                                }

                            </> : dataItem.items.columntype === ColumnType.NUMERICINPUT ?
                                <>
                                    {dataItem.symbolObject.items.isInputVisible === true ?
                                        <>
                                            <Col md={12}>
                                                <FormInput
                                                    formGroupClassName="remove-floating-label-margin"
                                                    label={dataItem.symbolObject.items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_FROM" }) : ""}
                                                    name={`$p` + (index + 1)}
                                                    type="text"
                                                    required={false}
                                                    isMandatory={false}
                                                    value={dataItem.value}
                                                    onChange={(event) => props.onParamInputChange(event, 2, index, dataItem)}
                                                    maxLength={10}
                                                />
                                            </Col>
                                            {dataItem.symbolObject.items.symbolType === 5 ?
                                                (
                                                    <Col md={12}>
                                                        <FormInput
                                                            formGroupClassName="remove-floating-label-margin"
                                                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                                                            name={`$p` + (index + 1)}
                                                            type="text"
                                                            required={false}
                                                            isMandatory={false}
                                                            value={dataItem.value}
                                                            onChange={(event) => props.onParamInputChange(event, 2, index, dataItem)}
                                                            maxLength={10}
                                                        />
                                                    </Col>
                                                ) : <></>

                                            }
                                        </>
                                        : <></>
                                    }

                                </> : dataItem.items.columntype === ColumnType.COMBO ?
                                    <>
                                        {dataItem.symbolObject.items.isInputVisible === true ?
                                            <Col md={12}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={dataItem.items.displayname["en-US"]}
                                                    isSearchable={true}
                                                    name={`$p` + (index + 1)}
                                                    placeholder=""
                                                    showOption={true}
                                                    options={props.viewMasterData && props.viewMasterData[index] || []}
                                                    optionId={dataItem.items.sforeigncolumnname}
                                                    optionValue='sdisplayname'
                                                    value={dataItem.value}
                                                    onChange={value => props.onParamComboChange(value, index)}
                                                    isMulti={dataItem.items.ismulti}
                                                >
                                                </FormSelectSearch>
                                            </Col> : <></>
                                        }
                                    </> : dataItem.items.columntype === ColumnType.DATATIME
                                        || dataItem.items.columntype === ColumnType.DATE ?
                                        <>
                                            {dataItem.symbolObject.items.isInputVisible === true && dataItem.symbolObject.items.symbolType === 5 ?
                                                <>
                                                    <Col md={12}>
                                                        <DateTimePicker
                                                            formGroupClassName="remove-floating-label-margin"
                                                            label={props.comboData.sdefaultvalue[index - 1].symbolObject.items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_TO" }) : props.intl.formatMessage({ id: "IDS_FROM" })}
                                                            name={`$p` + (index + 1)}
                                                            className='form-control'
                                                            placeholderText="Select date.."
                                                            selected={dataItem.value}
                                                            // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
                                                            // dateFormat={"dd-MM-yyyy"}
                                                            isClearable={false}
                                                            showTimeInput={dataItem.items.columntype === ColumnType.DATATIME ? true : false}
                                                            onChange={date => props.onParamComboChange(date, index)}
                                                            value={dataItem.value}
                                                        />
                                                    </Col>
                                                    {/* {dataItem.symbolObject.items.symbolType === 5 ?
                                                        (
                                                            <Col md={12}>
                                                                <DateTimePicker
                                                                    formGroupClassName="remove-floating-label-margin"
                                                                    label={props.intl.formatMessage({ id: "IDS_TO" })}
                                                                    name={`$p` + (index + 1)}
                                                                    className='form-control'
                                                                    placeholderText="Select date.."
                                                                    selected={new Date(dataItem.value)}
                                                                    // dateFormat={"dd-MM-yyyy"}
                                                                    // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
                                                                    isClearable={false}
                                                                    showTimeInput={dataItem.items.columntype === ColumnType.DATATIME ? true : false}
                                                                    // onChange={date => props.handleFilterDateChange(`dateinputtwo`, date, groupIndex, index)}
                                                                    value={new Date(dataItem.value)}
                                                                />
                                                            </Col>
                                                        ) : <></>
                                                    } */}
                                                </>
                                                : <></>
                                            }
                                            {dataItem.symbolObject.items.isInputVisible === true && dataItem.symbolObject.items.symbolType === 1 ?
                                                <>
                                                    <Col md={12}>
                                                        <DateTimePicker
                                                            formGroupClassName="remove-floating-label-margin"
                                                            label={dataItem.items.displayname["en-US"]}
                                                            name={`$p` + (index + 1)}
                                                            className='form-control'
                                                            placeholderText="Select date.."
                                                            selected={dataItem.value}
                                                            // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
                                                            // dateFormat={"dd-MM-yyyy"}
                                                            isClearable={false}
                                                            showTimeInput={dataItem.items.columntype === ColumnType.DATATIME ? true : false}
                                                            onChange={date => props.onParamComboChange(date, index)}
                                                            value={dataItem.value}
                                                        />
                                                    </Col>
                                                </>
                                                : <></>
                                            }
                                        </>
                                        : <></>
                        }
                    </Row>
                </>
            )
        });
        return design;
    }


    return (
        <>
            {createRules()}
        </>
    )
}
export default (injectIntl(QueryBuilderParamter));