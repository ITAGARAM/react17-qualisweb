import { faGripVertical, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { BuilderBorder, ContionalButton, DeleteRule } from './Sqlbuilder.styled';
import '../../assets/styles/querybuilder.css';
import { ColumnType } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { stringOperatorData, conditionalOperatorData, numericOperatorData, joinConditionData, aggregateFunction, orderByList } from './QueryBuilderData';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';


const BuildQuery = (props) => {

    function createOrderbyFields() {
        let design = [];
        props.addOrderbyList.map((items, index) => {
            design.push(
                <>

                    <BuilderBorder key={index}>
                        <Row className="mt-3">

                            <DeleteRule marginLeft={1} onClick={() => props.deleteOrderby(index)}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </DeleteRule>
                            <Col md={4}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    isSearchable={true}
                                    name={`columnname`}
                                    showOption={true}
                                    options={props.viewColumnListByRule || []}
                                    optionId='columnname'
                                    optionValue='displayname'
                                    value={props.selectedRecord["orderby"] && props.selectedRecord["orderby"][index] && props.selectedRecord["orderby"][index][`columnname`] || ""}
                                    onChange={value => props.onOrderbyChange(value, "columnname", index)}
                                ></FormSelectSearch>
                            </Col>
                            <Col md={4}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    isSearchable={true}
                                    name={"ordertype"}
                                    showOption={true}
                                    options={orderByList || []}
                                    optionId='value'
                                    optionValue='label'
                                    // isDisabled={props.selectedRecord["customorderby"] && props.selectedRecord["customorderby"] === true ? false : true}
                                    value={props.selectedRecord["orderby"] && props.selectedRecord["orderby"][index] && props.selectedRecord["orderby"][index]["ordertype"] || ""}
                                    onChange={value => props.onOrderbyChange(value, "ordertype", index)}
                                ></FormSelectSearch>
                            </Col>
                        </Row>
                    </BuilderBorder>

                </>)

        })
        return design;
    }
    function createAggregateFunctions() {
        let design = [];
        props.addAggregateList.map((items, index) => {
            design.push(
                <>

                    <BuilderBorder key={index}>
                        <Row className="mt-3">

                            <DeleteRule marginLeft={1} onClick={() => props.deleteAggregate(index)}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </DeleteRule>
                            <Col md={4}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    isSearchable={true}
                                    name={`columnname`}
                                    showOption={true}
                                    options={props.viewColumnListByRule || []}
                                    optionId='columnname'
                                    optionValue='displayname'
                                    value={props.selectedRecord["aggregate"] && props.selectedRecord["aggregate"][index] && props.selectedRecord["aggregate"][index][`columnname`] || ""}
                                    onChange={value => props.onAggregateChange(value, "columnname", index)}
                                ></FormSelectSearch>
                            </Col>
                            <Col md={4}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    isSearchable={true}
                                    name={"aggfunctionname"}
                                    showOption={true}
                                    options={aggregateFunction || []}
                                    optionId='value'
                                    optionValue='label'
                                    value={props.selectedRecord["aggregate"] && props.selectedRecord["aggregate"][index] && props.selectedRecord["aggregate"][index]["aggfunctionname"] || ""}
                                    onChange={value => props.onAggregateChange(value, "aggfunctionname", index)}
                                ></FormSelectSearch>
                            </Col>
                        </Row>
                    </BuilderBorder>

                </>)

        })
        return design;
    }
    // function createViewRules() {
    //     let indexCount = 0;
    //     let design = [];
    //     props.addRuleList.map((items, index) => {

    //         let stringOperators = stringOperatorData;
    //         if (props.selectedRecord[`columnname_${index}`]
    //             && !props.selectedRecord[`columnname_${index}`].items.needmasterdata
    //             && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.TEXTINPUT) {
    //             const temp = stringOperators.filter(item => {
    //                 if (item.items.symbolType !== 6) {
    //                     return item
    //                 }
    //             });
    //             stringOperators = temp;
    //         }

    //         if (items > -1) {
    //             indexCount = indexCount + 1;
    //         };
    //         design.push(
    //             <>
    //                 {items > -1 ?
    //                     <>
    //                         {indexCount !== 1 ?
    //                             <Row>
    //                                 {/* <ContionalButton type="button" className="builder-btn-primary" marginLeft={1} 
    //                         onClick={()=>props.onConditionClick1(`button_${index}`, 'not')}>
    //                         <span><FormattedMessage id="IDS_NOT" defaultMessage="Not" /></span>
    //                     </ContionalButton> */}
    //                                 <ContionalButton type="button" className={props.selectedRecord[`button_and_${index}`] === true ? "builder-btn-primary" : ""} marginLeft={1}
    //                                     onClick={() => props.onConditionClick(`button_and_${index}`, index)}>
    //                                     <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
    //                                 </ContionalButton>
    //                                 <ContionalButton type="button" className={props.selectedRecord[`button_or_${index}`] === true ? "builder-btn-primary" : ""} marginLeft={0}
    //                                     onClick={() => props.onConditionClick(`button_or_${index}`, index)}>
    //                                     <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
    //                                 </ContionalButton>
    //                             </Row> :
    //                             <>
    //                                 {/* <ContionalButton type="button" className={props.selectedRecord[`button_not_${index}`] === true ? "builder-btn-primary" : ""} marginLeft={1}
    //                                     onClick={() => props.onConditionClick(`button_not_${index}`, index)}>
    //                                     <span><FormattedMessage id="IDS_NOT" defaultMessage="Not" /></span>
    //                                 </ContionalButton> */}


    //                             </>
    //                         }
    //                         <BuilderBorder key={index}>
    //                             <CustomSwitch
    //                                 label={props.intl.formatMessage({ id: "IDS_NOT" })}
    //                                 name={`notoperator_${index}`}
    //                                 type="switch"
    //                                 isMandatory={false}
    //                                 required={false}
    //                                 checked={props.selectedRecord[`notoperator_${index}`] === undefined ? false : props.selectedRecord[`notoperator_${index}`]}
    //                                 onChange={(event) => props.onInputChange(event, 1)}
    //                             />
    //                             <Row className="mt-3">

    //                                 <DeleteRule marginLeft={1} onClick={() => props.deleteRule(index)}>
    //                                     <FontAwesomeIcon icon={faTrashAlt} color="red" />
    //                                 </DeleteRule>
    //                                 <Col md={4}>
    //                                     <FormSelectSearch
    //                                         formGroupClassName="remove-floating-label-margin"
    //                                         isSearchable={true}
    //                                         name={`columnname_${index}`}
    //                                         showOption={true}
    //                                         options={props.viewColumnListByRule[index] || []}
    //                                         optionId='columnname'
    //                                         optionValue='displayname'
    //                                         value={props.selectedRecord[`columnname_${index}`] || ""}
    //                                         onChange={value => props.onRuleChange(value, `columnname_${index}`, index)}
    //                                     ></FormSelectSearch>
    //                                 </Col>
    //                                 {props.selectedRecord[`columnname_${index}`] && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.TEXTINPUT ?
    //                                     <>
    //                                         <Col md={2}>
    //                                             <FormSelectSearch
    //                                                 formGroupClassName="remove-floating-label-margin"
    //                                                 formLabel=""
    //                                                 isSearchable={true}
    //                                                 name={`ssymbolname_${index}`}
    //                                                 placeholder=""
    //                                                 showOption={true}
    //                                                 options={stringOperators}
    //                                                 optionId='nvalidationcode'
    //                                                 optionValue='ssymbolname'
    //                                                 value={props.selectedRecord[`ssymbolname_${index}`] || ""}
    //                                                 onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
    //                                             >
    //                                             </FormSelectSearch>
    //                                         </Col>
    //                                         {props.selectedRecord[`ssymbolname_${index}`]
    //                                             && props.selectedRecord[`ssymbolname_${index}`].items.isInputVisible ?
    //                                             <>
    //                                                 {props.selectedRecord[`columnname_${index}`].items.needmasterdata ?

    //                                                     <Col md={4}>
    //                                                         <FormSelectSearch
    //                                                             formGroupClassName="remove-floating-label-margin"
    //                                                             isSearchable={true}
    //                                                             name={`${props.selectedRecord[`columnname_${index}`].items.valuemember}_${index}`}
    //                                                             showOption={true}
    //                                                             options={props.viewMasterListByRule[index] || []}
    //                                                             optionId={props.selectedRecord[`columnname_${index}`].items.valuemember}
    //                                                             optionValue={props.selectedRecord[`columnname_${index}`].items.displaymember}
    //                                                             value={props.selectedRecord[`${props.selectedRecord[`columnname_${index}`].items.valuemember}_${index}`] || ""}
    //                                                             isMulti={props.selectedRecord[`ssymbolname_${index}`].items.ismulti}
    //                                                             onChange={value => props.onMasterDataChange(value, `${props.selectedRecord[`columnname_${index}`].items.valuemember}_${index}`, index)}
    //                                                         ></FormSelectSearch>
    //                                                     </Col> :
    //                                                     <Col md={4}>
    //                                                         <FormInput
    //                                                             formGroupClassName="remove-floating-label-margin"
    //                                                             name={`sinputname_${index}`}
    //                                                             type="text"
    //                                                             onChange={(event) => props.onInputChange(event, 1)}
    //                                                             value={props.selectedRecord ? props.selectedRecord[`sinputname_${index}`] : ""}
    //                                                             maxLength={100}
    //                                                         />
    //                                                     </Col>

    //                                                 }
    //                                             </>
    //                                             : <></>
    //                                         }

    //                                     </> : props.selectedRecord[`columnname_${index}`] && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.NUMERICINPUT ?
    //                                         <>
    //                                             <Col md={2}>
    //                                                 <FormSelectSearch
    //                                                     formGroupClassName="remove-floating-label-margin"
    //                                                     formLabel=""
    //                                                     isSearchable={true}
    //                                                     name={`ssymbolname_${index}`}
    //                                                     placeholder=""
    //                                                     showOption={true}
    //                                                     options={numericOperatorData}
    //                                                     optionId='nvalidationcode'
    //                                                     optionValue='ssymbolname'
    //                                                     value={props.selectedRecord[`ssymbolname_${index}`] || ""}
    //                                                     onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
    //                                                 >
    //                                                 </FormSelectSearch>
    //                                             </Col>
    //                                             {props.selectedRecord[`ssymbolname_${index}`] && props.selectedRecord[`ssymbolname_${index}`].items.isInputVisible === true ?
    //                                                 <>
    //                                                     <Col md={2}>
    //                                                         <FormInput
    //                                                             formGroupClassName="remove-floating-label-margin"
    //                                                             label={props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_FROM" }) : ""}
    //                                                             name={`snumericinput_${index}`}
    //                                                             type="text"
    //                                                             required={false}
    //                                                             isMandatory={false}
    //                                                             value={props.selectedRecord[`snumericinput_${index}`] ? props.selectedRecord[`snumericinput_${index}`] : ""}
    //                                                             onChange={(event) => props.onInputChange(event, 2)}
    //                                                             maxLength={10}
    //                                                         />
    //                                                     </Col>
    //                                                     {props.selectedRecord[`ssymbolname_${index}`] && props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ?
    //                                                         (
    //                                                             <Col md={2}>
    //                                                                 <FormInput
    //                                                                     formGroupClassName="remove-floating-label-margin"
    //                                                                     label={props.intl.formatMessage({ id: "IDS_TO" })}
    //                                                                     name={`snumericinputtwo_${index}`}
    //                                                                     type="text"
    //                                                                     required={false}
    //                                                                     isMandatory={false}
    //                                                                     value={props.selectedRecord[`snumericinputtwo_${index}`] ? props.selectedRecord[`snumericinputtwo_${index}`] : ""}
    //                                                                     onChange={(event) => props.onInputChange(event, 2)}
    //                                                                     maxLength={10}
    //                                                                 />
    //                                                             </Col>
    //                                                         ) : <></>

    //                                                     }
    //                                                 </>
    //                                                 : <></>
    //                                             }

    //                                         </> : props.selectedRecord[`columnname_${index}`]
    //                                             && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.COMBO ?
    //                                             <>
    //                                                 <Col md={2}>
    //                                                     <FormSelectSearch
    //                                                         formGroupClassName="remove-floating-label-margin"
    //                                                         formLabel=""
    //                                                         isSearchable={true}
    //                                                         name={`ssymbolname_${index}`}
    //                                                         placeholder=""
    //                                                         showOption={true}
    //                                                         options={conditionalOperatorData}
    //                                                         optionId='nvalidationcode'
    //                                                         optionValue='ssymbolname'
    //                                                         value={props.selectedRecord[`ssymbolname_${index}`] || ""}
    //                                                         onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
    //                                                     >
    //                                                     </FormSelectSearch>
    //                                                 </Col>
    //                                                 {props.selectedRecord[`ssymbolname_${index}`] && props.selectedRecord[`ssymbolname_${index}`].items.isInputVisible === true ?
    //                                                     <Col md={4}>
    //                                                         <FormSelectSearch
    //                                                             formGroupClassName="remove-floating-label-margin"
    //                                                             formLabel=""
    //                                                             isSearchable={true}
    //                                                             name={`${props.selectedRecord[`columnname_${index}`].items.sforeigncolumnname}_${index}`}
    //                                                             placeholder=""
    //                                                             showOption={true}
    //                                                             options={props.viewMasterListByRule && props.viewMasterListByRule[index] || []}
    //                                                             optionId={props.selectedRecord[`columnname_${index}`].items.sforeigncolumnname}
    //                                                             optionValue='sdisplayname'
    //                                                             value={props.selectedRecord[`${props.selectedRecord[`columnname_${index}`].items.sforeigncolumnname}_${index}`] || ""}
    //                                                             onChange={value => props.onMasterDataChange(value, `${props.selectedRecord[`columnname_${index}`].items.sforeigncolumnname}_${index}`, index)}
    //                                                             isMulti={props.selectedRecord[`ssymbolname_${index}`].items.ismulti}
    //                                                         >
    //                                                         </FormSelectSearch>
    //                                                     </Col> : <></>
    //                                                 }
    //                                             </> : props.selectedRecord[`columnname_${index}`]
    //                                                 && (props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME
    //                                                     || props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATE) ?
    //                                                 <>
    //                                                     <Col md={2}>
    //                                                         <FormSelectSearch
    //                                                             formGroupClassName="remove-floating-label-margin"
    //                                                             formLabel=""
    //                                                             isSearchable={true}
    //                                                             name={`ssymbolname_${index}`}
    //                                                             placeholder=""
    //                                                             showOption={true}
    //                                                             options={numericOperatorData}
    //                                                             optionId='nvalidationcode'
    //                                                             optionValue='ssymbolname'
    //                                                             value={props.selectedRecord[`ssymbolname_${index}`] || ""}
    //                                                             onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
    //                                                         >
    //                                                         </FormSelectSearch>
    //                                                     </Col>
    //                                                     {props.selectedRecord[`ssymbolname_${index}`]
    //                                                         && props.selectedRecord[`ssymbolname_${index}`].items.isInputVisible === true ?
    //                                                         <>
    //                                                             <Col md={2}>
    //                                                                 <DateTimePicker
    //                                                                     formGroupClassName="remove-floating-label-margin"
    //                                                                     label={props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_FROM" }) : ""}
    //                                                                     name={`dateinput_${index}`}
    //                                                                     className='form-control'
    //                                                                     placeholderText="Select date.."
    //                                                                     selected={props.selectedRecord[`dateinput_${index}`]}
    //                                                                     // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
    //                                                                     // dateFormat={"dd-MM-yyyy"}
    //                                                                     isClearable={false}
    //                                                                     showTimeInput={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? true : false}
    //                                                                     onChange={date => props.handleFilterDateChange(`dateinput_${index}`, date)}
    //                                                                     value={props.selectedRecord[`dateinput_${index}`] || ""}
    //                                                                 />
    //                                                             </Col>
    //                                                             {props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ?
    //                                                                 (
    //                                                                     <Col md={2}>
    //                                                                         <DateTimePicker
    //                                                                             formGroupClassName="remove-floating-label-margin"
    //                                                                             label={props.intl.formatMessage({ id: "IDS_TO" })}
    //                                                                             name={`dateinputtwo_${index}`}
    //                                                                             className='form-control'
    //                                                                             placeholderText="Select date.."
    //                                                                             selected={props.selectedRecord[`dateinputtwo_${index}`]}
    //                                                                             // dateFormat={"dd-MM-yyyy"}
    //                                                                             // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
    //                                                                             isClearable={false}
    //                                                                             showTimeInput={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? true : false}
    //                                                                             onChange={date => props.handleFilterDateChange(`dateinputtwo_${index}`, date)}
    //                                                                             value={props.selectedRecord[`dateinputtwo_${index}`] || ""}
    //                                                                         />
    //                                                                     </Col>
    //                                                                 ) : <></>
    //                                                             }
    //                                                         </>
    //                                                         : <></>
    //                                                     }
    //                                                 </>
    //                                                 : <></>
    //                                 }
    //                             </Row>
    //                         </BuilderBorder>
    //                     </> : <></>
    //                 }


    //             </>)
    //     });

    //     return design;
    // }
    function createSqlRules() {
        let indexCount = 0;
        let design = [];
        props.addRuleList.map((items, index) => {

            const stringOperators = props.selectedRecord[`columnname_${index}`].items
                && props.selectedRecord[`columnname_${index}`].items.needmasterdata ?
                stringOperatorData : stringOperatorData.map(item => { return item.symbolType !== 6 });

            if (items > -1) {
                indexCount = indexCount + 1;
            };
            design.push(
                <>
                    {items > -1 ?
                        <>
                            {indexCount !== 1 ?
                                <>
                                    <Row>
                                        {/* <ContionalButton type="button" className="builder-btn-primary" marginLeft={1} 
                                onClick={()=>props.onConditionClick1(`button_${index}`, 'not')}>
                                <span><FormattedMessage id="IDS_NOT" defaultMessage="Not" /></span>
                            </ContionalButton> */}
                                        <ContionalButton type="button" className={props.selectedRecord[`button_and_${index}`] === true ? "builder-btn-primary" : ""} marginLeft={1}
                                            onClick={() => props.onConditionClick(`button_and_${index}`, index)}>
                                            <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                                        </ContionalButton>
                                        <ContionalButton type="button" className={props.selectedRecord[`button_or_${index}`] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                            onClick={() => props.onConditionClick(`button_or_${index}`, index)}>
                                            <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                                        </ContionalButton>
                                    </Row>
                                </> : <></>
                            }
                            <BuilderBorder key={index}>
                                <Row>
                                    <DeleteRule marginLeft={1} onClick={() => props.deleteRule(index)}>
                                        <FontAwesomeIcon icon={faTrashAlt} color="red" />
                                    </DeleteRule>
                                    <Col md={2} key={`tablekey_${index}`}>
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            // formLabel={ props.intl.formatMessage({ id: "IDS_TABLES" }) }
                                            isSearchable={true}
                                            name={`stablename_${index}`}
                                            // placeholder={ props.intl.formatMessage({ id: "IDS_TABLES" }) }
                                            showOption={true}
                                            options={props.databaseTableList}
                                            optionId='stablename'
                                            optionValue='displayname'
                                            value={props.selectedRecord[`stablename_${index}`] || ""}
                                            onChange={value => props.onTableChange(value, `stablename_${index}`, index)}
                                        >
                                        </FormSelectSearch>
                                    </Col>
                                    <Col md={2} key={`columnkey_${index}`}>
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            // formLabel={ props.intl.formatMessage({ id: "IDS_COLUMNS" }) }
                                            isSearchable={true}
                                            name={`columnname_${index}`}
                                            // placeholder={ props.intl.formatMessage({ id: "IDS_COLUMNS" }) }
                                            showOption={true}
                                            options={props.tableColumnList[index] || []}
                                            optionId='columnname'
                                            optionValue='displayname'
                                            value={props.selectedRecord[`columnname_${index}`] || ""}
                                            // onChange={ value => props.onColumnChange(value, `columnname_${index}`, index) }
                                            onChange={value => props.onRuleChange(value, `columnname_${index}`, index)}
                                        >
                                        </FormSelectSearch>
                                    </Col>
                                    {props.selectedRecord[`columnname_${index}`] && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.COMBO ?
                                        <>
                                            <Col md={2}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel=""
                                                    isSearchable={true}
                                                    name={`ssymbolname_${index}`}
                                                    placeholder=""
                                                    showOption={true}
                                                    options={joinConditionData}
                                                    optionId='nvalidationcode'
                                                    optionValue='ssymbolname'
                                                    value={props.selectedRecord[`ssymbolname_${index}`]}
                                                    onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
                                                >
                                                </FormSelectSearch>
                                            </Col>
                                            <Col md={2} key={`foreigncolumnkey_${index}`}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    // formLabel={ props.intl.formatMessage({ id: "IDS_COLUMNS" }) }
                                                    isSearchable={true}
                                                    name={`foreigncolumnname_${index}`}
                                                    // placeholder={ props.intl.formatMessage({ id: "IDS_COLUMNS" }) }
                                                    showOption={true}
                                                    options={props.foreignTableColumnList[index] || []}
                                                    optionId='columnname'
                                                    optionValue='displayname'
                                                    value={props.selectedRecord[`foreigncolumnname_${index}`] || ""}
                                                    // onChange={ value => props.onColumnChange(value, `columnname_${index}`, index) }
                                                    onChange={value => props.onRuleChange(value, `foreigncolumnname_${index}`, index)}
                                                >
                                                </FormSelectSearch>
                                            </Col>
                                        </>
                                        : <></>}
                                    {/* <Col md={2} key={`tablekey_${index}`}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    // formLabel={ props.intl.formatMessage({ id: "IDS_TABLES" }) }
                                    isSearchable={ true }
                                    name={ `stablename_${index}` }
                                    // placeholder={ props.intl.formatMessage({ id: "IDS_TABLES" }) }
                                    showOption={ true }
                                    options={ props.databaseTableList }
                                    optionId='stablename'
                                    optionValue='displayname'
                                    value={ props.selectedRecord[`stablename_${index}`] || "" }
                                    onChange={ value => props.onTableChange(value, `stablename_${index}`, index) }
                                >
                                </FormSelectSearch>
                            </Col> */}

                                    {props.selectedRecord[`columnname_${index}`] && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.TEXTINPUT ?
                                        <>
                                            <Col md={2}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel=""
                                                    isSearchable={true}
                                                    name={`ssymbolname_${index}`}
                                                    placeholder=""
                                                    showOption={true}
                                                    options={stringOperators}
                                                    optionId='nvalidationcode'
                                                    optionValue='ssymbolname'
                                                    value={props.selectedRecord[`ssymbolname_${index}`] || ""}
                                                    onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
                                                >
                                                </FormSelectSearch>
                                            </Col>
                                            {props.selectedRecord[`ssymbolname_${index}`] && props.selectedRecord[`ssymbolname_${index}`].items.isInputVisible === true ?
                                                <Col md={4}>
                                                    <FormInput
                                                        formGroupClassName="remove-floating-label-margin"
                                                        name={`sinputname_${index}`}
                                                        // label={props.intl.formatMessage({ id: "IDS_INPUT" })}
                                                        type="text"
                                                        onChange={(event) => props.onInputChange(event, 1)}
                                                        // placeholder={props.intl.formatMessage({ id: "IDS_INPUT" })}
                                                        value={props.selectedRecord ? props.selectedRecord[`sinputname_${index}`] : ""}
                                                        maxLength={100}
                                                    />
                                                </Col> : <></>
                                            }

                                        </> : props.selectedRecord[`columnname_${index}`] && props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.NUMERICINPUT ?
                                            <>
                                                <Col md={2}>
                                                    <FormSelectSearch
                                                        formGroupClassName="remove-floating-label-margin"
                                                        formLabel=""
                                                        isSearchable={true}
                                                        name={`ssymbolname_${index}`}
                                                        placeholder=""
                                                        showOption={true}
                                                        options={numericOperatorData}
                                                        optionId='nvalidationcode'
                                                        optionValue='ssymbolname'
                                                        value={props.selectedRecord[`ssymbolname_${index}`] || ""}
                                                        onChange={value => props.onSymbolChange(value, `ssymbolname_${index}`, index)}
                                                    >
                                                    </FormSelectSearch>
                                                </Col>
                                                {
                                                    props.selectedRecord[`ssymbolname_${index}`] ?
                                                        <Col md={2}>
                                                            <FormInput
                                                                name={`snumericinput_${index}`}
                                                                label={props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_TO" }) : ""}
                                                                type="text"
                                                                required={false}
                                                                isMandatory={false}
                                                                value={props.selectedRecord[`snumericinput_${index}`] ? props.selectedRecord[`snumericinput_${index}`] : ""}
                                                                onChange={(event) => props.onInputChange(event, 2)}
                                                                maxLength={10}
                                                            />
                                                        </Col> :
                                                        (props.selectedRecord[`ssymbolname_${index}`].items.symbolType === 5 ?
                                                            <Col md={2}>
                                                                <FormInput
                                                                    label={props.intl.formatMessage({ id: "IDS_TO" })}
                                                                    name={`snumericinputtwo_${index}`}
                                                                    type="text"
                                                                    required={false}
                                                                    isMandatory={false}
                                                                    value={props.selectedRecord[`snumericinputtwo_${index}`] ? props.selectedRecord[`snumericinputtwo_${index}`] : ""}
                                                                    onChange={(event) => props.onInputChange(event, 2)}
                                                                    maxLength={10}
                                                                />
                                                            </Col>
                                                            : <></>
                                                        )
                                                }
                                            </>
                                            : <></>
                                    }
                                </Row>
                            </BuilderBorder>
                        </>
                        : <></>}
                </>);

        });

        return design;
    }
    function createRules(items, groupIndex) {
        let design = [];
        [...Array(items)].map((data, index) => {
            let stringOperators = stringOperatorData;
            design.push(
                <>
                    <Row className="mt-3">

                        <DeleteRule marginLeft={1} onClick={() => props.deleteRule(groupIndex, index)}>
                            <FontAwesomeIcon icon={faTrashAlt} color="red" />
                        </DeleteRule>
                       
                        <Col md={4}>
                            <FormSelectSearch
                                formGroupClassName="remove-floating-label-margin"
                                isSearchable={true}
                                name={"columnname"}
                                showOption={true}
                                options={props.viewColumnListByRule || []}
                                optionId='columnname'
                                optionValue='displayname'
                                value={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index]["columnname"] || ""}
                                onChange={value => props.onRuleChange(value, "columnname", groupIndex, index,props.viewMasterListByRule)}
                            ></FormSelectSearch>
                        </Col>
       
                        {props.selectedRecord["groupList"][groupIndex][index]["columnname"] && props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.columntype === ColumnType.TEXTINPUT ?
                            <>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formGroupClassName="remove-floating-label-margin"
                                        formLabel=""
                                        isSearchable={true}
                                        name={"ssymbolname"}
                                        placeholder="Select.."
                                        showOption={true}
                                        options={stringOperators}
                                        optionId='nvalidationcode'
                                        optionValue='ssymbolname'
                                        value={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index]["ssymbolname"] || ""}
                                        onChange={value => props.onSymbolChange(value, "ssymbolname", groupIndex, index)}
                                    >
                                    </FormSelectSearch>
                                </Col>
                                {props.selectedRecord["groupList"][groupIndex][index]["ssymbolname"]
                                    && props.selectedRecord["groupList"][groupIndex][index]["ssymbolname"].items.isInputVisible ?
                                    <>
                                        {props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.needmasterdata ?

                                            <Col md={4}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={`${props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.valuemember}`}
                                                    showOption={true}
                                                    options={props.viewMasterListByRule&&props.viewMasterListByRule[groupIndex]&&props.viewMasterListByRule[groupIndex][index] || []}
                                                    optionId={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.valuemember}
                                                    optionValue={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.displaymember}
                                                    value={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index][`${props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.valuemember}`] || ""}
                                                    isMulti={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.ismulti}
                                                    onChange={value => props.onMasterDataChange(value, `${props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.valuemember}`, groupIndex, index)}
                                                ></FormSelectSearch>
                                            </Col> :
                                            <Col md={4}>
                                                <FormInput
                                                    formGroupClassName="remove-floating-label-margin"
                                                    name={`sinputname`}
                                                    type="text"
                                                    onChange={(event) => props.onInputChange(event, 3, groupIndex, index)}
                                                    value={props.selectedRecord["groupList"]&&props.selectedRecord["groupList"][groupIndex]&&props.selectedRecord["groupList"][groupIndex][index] ? props.selectedRecord["groupList"][groupIndex][index]["columnname"]["sinputname"] : ""}
                                                    maxLength={100}
                                                />
                                            </Col>

                                        }
                                    </>
                                    : <></>
                                }

                            </> : props.selectedRecord["groupList"][groupIndex][index]["columnname"] && props.selectedRecord["groupList"][groupIndex][index]["columnname"].items.columntype === ColumnType.NUMERICINPUT ?
                                <>
                                    <Col md={2}>
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel=""
                                            isSearchable={true}
                                            name={"ssymbolname"}
                                            placeholder=""
                                            showOption={true}
                                            options={numericOperatorData}
                                            optionId='nvalidationcode'
                                            optionValue='ssymbolname'
                                            value={props.selectedRecord["groupList"][groupIndex][index]&&props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] || ""}
                                            onChange={value => props.onSymbolChange(value, `ssymbolname`, groupIndex, index)}
                                        >
                                        </FormSelectSearch>
                                    </Col>
                                    {props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] && props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.isInputVisible === true ?
                                        <>
                                            <Col md={2}>
                                                <FormInput
                                                    formGroupClassName="remove-floating-label-margin"
                                                    label={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_FROM" }) : ""}
                                                    name={`snumericinput`}
                                                    type="text"
                                                    required={false}
                                                    isMandatory={false}
                                                    value={props.selectedRecord["groupList"][groupIndex][index][`snumericinput`] ? props.selectedRecord["groupList"][groupIndex][index][`snumericinput`] : ""}
                                                    onChange={(event) => props.onInputChange(event, 2, groupIndex, index)}
                                                    maxLength={10}
                                                />
                                            </Col>
                                            {props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] && props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.symbolType === 5 ?
                                                (
                                                    <Col md={2}>
                                                        <FormInput
                                                            formGroupClassName="remove-floating-label-margin"
                                                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                                                            name={`snumericinputtwo`}
                                                            type="text"
                                                            required={false}
                                                            isMandatory={false}
                                                            value={props.selectedRecord["groupList"][groupIndex][index][`snumericinputtwo`] ? props.selectedRecord["groupList"][groupIndex][index][`snumericinputtwo`] : ""}
                                                            onChange={(event) => props.onInputChange(event, 2, groupIndex, index)}
                                                            maxLength={10}
                                                        />
                                                    </Col>
                                                ) : <></>

                                            }
                                        </>
                                        : <></>
                                    }

                                </> : props.selectedRecord["groupList"][groupIndex][index][`columnname`]
                                    && props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.columntype === ColumnType.COMBO ?
                                    <>
                                        <Col md={2}>
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel=""
                                                isSearchable={true}
                                                name={`ssymbolname`}
                                                placeholder=""
                                                showOption={true}
                                                options={conditionalOperatorData}
                                                optionId='nvalidationcode'
                                                optionValue='ssymbolname'
                                                value={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] || ""}
                                                onChange={value => props.onSymbolChange(value, `ssymbolname`, groupIndex, index)}
                                            >
                                            </FormSelectSearch>
                                        </Col>
                                        {props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] && props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.isInputVisible === true ?
                                            <Col md={4}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel=""
                                                    isSearchable={true}
                                                    name={`${props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.sforeigncolumnname}`}
                                                    placeholder=""
                                                    showOption={true}
                                                    options={props.viewMasterListByRule && props.viewMasterListByRule[groupIndex][index] || []}
                                                    optionId={props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.sforeigncolumnname}
                                                    optionValue='sdisplayname'
                                                    value={props.selectedRecord["groupList"][groupIndex][index][`${props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.sforeigncolumnname}`] || ""}
                                                    onChange={value => props.onMasterDataChange(value, `${props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.sforeigncolumnname}`, groupIndex, index)}
                                                    isMulti={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.ismulti}
                                                >
                                                </FormSelectSearch>
                                            </Col> : <></>
                                        }
                                    </> : props.selectedRecord["groupList"][groupIndex][index][`columnname`]
                                        && (props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.columntype === ColumnType.DATATIME
                                            || props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.columntype === ColumnType.DATE) ?
                                        <>
                                            <Col md={2}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel=""
                                                    isSearchable={true}
                                                    name={`ssymbolname`}
                                                    placeholder=""
                                                    showOption={true}
                                                    options={numericOperatorData}
                                                    optionId='nvalidationcode'
                                                    optionValue='ssymbolname'
                                                    value={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] || ""}
                                                    onChange={value => props.onSymbolChange(value, `ssymbolname`, groupIndex, index)}
                                                >
                                                </FormSelectSearch>
                                            </Col>
                                            {props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`]
                                                && props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.isInputVisible === true ?
                                                <>
                                                    <Col md={2}>
                                                        <DateTimePicker
                                                            formGroupClassName="remove-floating-label-margin"
                                                            label={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.symbolType === 5 ? props.intl.formatMessage({ id: "IDS_FROM" }) : ""}
                                                            name={`dateinput`}
                                                            className='form-control'
                                                            placeholderText="Select date.."
                                                            selected={props.selectedRecord["groupList"][groupIndex][index][`dateinput`]}
                                                            // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
                                                            // dateFormat={"dd-MM-yyyy"}
                                                            isClearable={false}
                                                            showTimeInput={props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.columntype === ColumnType.DATATIME ? true : false}
                                                            onChange={date => props.handleFilterDateChange(`dateinput`, date, groupIndex, index)}
                                                            value={props.selectedRecord["groupList"][groupIndex][index][`dateinput`] || ""}
                                                        />
                                                    </Col>
                                                    {props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.symbolType === 5 ?
                                                        (
                                                            <Col md={2}>
                                                                <DateTimePicker
                                                                    formGroupClassName="remove-floating-label-margin"
                                                                    label={props.intl.formatMessage({ id: "IDS_TO" })}
                                                                    name={`dateinputtwo`}
                                                                    className='form-control'
                                                                    placeholderText="Select date.."
                                                                    selected={props.selectedRecord["groupList"][groupIndex][index][`dateinputtwo`]}
                                                                    // dateFormat={"dd-MM-yyyy"}
                                                                    // dateFormat={props.selectedRecord[`columnname_${index}`].items.columntype === ColumnType.DATATIME ? props.userInfo["ssitedatetime"] : props.userInfo["ssitedate"]}
                                                                    isClearable={false}
                                                                    showTimeInput={props.selectedRecord["groupList"][groupIndex][index][`columnname`].items.columntype === ColumnType.DATATIME ? true : false}
                                                                    onChange={date => props.handleFilterDateChange(`dateinputtwo`, date, groupIndex, index)}
                                                                    value={props.selectedRecord["groupList"][groupIndex][index][`dateinputtwo`] || ""}
                                                                />
                                                            </Col>
                                                        ) : <></>
                                                    }
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
    function createGroupRules() {
        let indexCount = 0;
        let design = [];
        props.addGroupList.length > 0 && props.addGroupList.map((items, index) => {

            let stringOperators = stringOperatorData;
            if (props.selectedRecord["groupList"] && props.selectedRecord["groupList"][index]["columnname"]
                && !props.selectedRecord["groupList"][index]["columnname"].items.needmasterdata
                && props.selectedRecord["groupList"][index]["columnname"].items.columntype === ColumnType.TEXTINPUT) {
                const temp = stringOperators.filter(item => {
                    if (item.items.symbolType !== 6) {
                        return item
                    }
                });
                stringOperators = temp;
            }

            if (items > -1) {
                indexCount = indexCount + 1;
            };
            design.push(
                <>
                    {items > -1 ?
                        <>
                            {items > 1 ?
                                <Row>
                                    <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_and"] === true ? "builder-btn-primary" : ""} marginLeft={1}
                                        onClick={() => props.onConditionClick("button_and", index)}>
                                        <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                                    </ContionalButton>
                                    <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_or"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                        onClick={() => props.onConditionClick("button_or", index)}>
                                        <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                                    </ContionalButton>
                                    <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                        onClick={() => props.onConditionClick("button_not", index)}>
                                        <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                                    </ContionalButton>
                                </Row>

                                :
                                <>
                                    <Row>
                                        <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                            onClick={() => props.onConditionClick("button_not", index)}>
                                            <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                                        </ContionalButton>
                                    </Row>
                                </>
                            }

                            <BuilderBorder key={index}>
                                <Row className="mt-3">
                                    {/* <CustomSwitch
                                        label={props.intl.formatMessage({ id: "IDS_NOT" })}
                                        name={"notoperator"}
                                        type="switch"
                                        isMandatory={false}
                                        required={false}
                                        checked={props.selectedRecord["groupList"][index]["notoperator"] === undefined ? false : props.selectedRecord["groupList"][index]["notoperator"]}
                                        onChange={(event) => props.onInputChange(event, 1)}
                                    /> */}
                                    <Col md={2}>
                                        <Button onClick={() => props.addRule("views", index)} className="mr-1">
                                            {'+'} <FormattedMessage id="IDS_ADDRULE" defaultMessage="Add Rule" />
                                        </Button>
                                    </Col>
                                </Row>
                                <>
                                    {createRules(items, index)}
                                </>

                            </BuilderBorder>
                        </> : <></>
                    }


                </>)
        });

        return design;
    }

    return (
        <>
            <Row>
                <Col md={4}>
                    <FormInput
                        formGroupClassName="remove-floating-label-margin"
                        label={"Query Builder Name"}
                        name={`querybuildername`}
                        type="text"
                        required={false}
                        isMandatory={true}
                        value={props.selectedRecord["querybuildername"] || ""}
                        onChange={(event) => props.onInputChange(event)}
                    />
                </Col>
                {/* <Col md={4}>

                    <FormSelectSearch
                        formGroupClassName="remove-floating-label-margin"
                        formLabel={props.intl.formatMessage({ id: "IDS_QUERYTYPE" })}
                        isSearchable={true}
                        name={"querytype"}
                        placeholder={props.intl.formatMessage({ id: "IDS_QUERYTYPE" })}
                        showOption={true}
                        options={props.queryType || []}
                        optionId='label'
                        optionValue='value'
                        value={props.selectedRecord["selectedQueryType"] || { label: props.intl.formatMessage({ id: "IDS_VIEWS" }), value: "views" }}
                        // onChange={value => props.onViewComboChange(value, "sviewname")}
                        onChange={value => props.onQueryTypeOnclick(value)}
                        closeMenuOnSelect={true}
                    
                    ></FormSelectSearch>
                </Col> */}
                <Col md={4}>
                    {/* <Button onClick={() => props.clearRule()} className="mr-1">
                        <FormattedMessage id="IDS_CLEAR" defaultMessage="Clear" />
                    </Button> */}
                    <Button onClick={() => props.resetRule()}>
                        <FormattedMessage id="IDS_RESET" defaultMessage="Reset" />
                    </Button>

                </Col>
                <Col md={4}>
                    {
                        props.sqlQuery ?
                            <>
                                <Button onClick={() => props.addRule("sql")} className="mr-1">
                                    {'+'} <FormattedMessage id="IDS_ADDRULE" defaultMessage="Add Rule" />
                                </Button>
                                <Button onClick={() => props.onGenerateQuery()}>
                                    <FormattedMessage id="IDS_GENERATEQUERY" defaultMessage="Generate Query" />
                                </Button>
                            </> : <></>
                    }
                </Col>
            </Row>

            {
                props.sqlQuery === true ?
                    <>
                        <Row className="mt-3">
                            <Col md={12}>
                                {props.addRuleList.length > 0 ? createSqlRules() : <></>}
                            </Col>
                            <Col md={12} >
                                <Card>
                                    <Card.Header>
                                        {props.intl.formatMessage({ id: "IDS_QUERY" })}
                                        <Button onClick={() => props.onExecuteRule()}>
                                            <FormattedMessage id="IDS_EXECUTE" defaultMessage="Execute" />
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {props.selectedRecord && props.selectedRecord["sdisplayquery"] ? props.selectedRecord["sdisplayquery"] : "No Query"}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </> :
                    <>
                        <Row className="mt-4 mb-4">
                            <Col md={4}>
                                <FormSelectSearch
                                    formGroupClassName="remove-floating-label-margin"
                                    formLabel={props.intl.formatMessage({ id: "IDS_VIEWS" })}
                                    isSearchable={true}
                                    name={"sviewname"}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTVIEWS" })}
                                    showOption={true}
                                    options={props.databaseviewList || []}
                                    optionId='sviewname'
                                    optionValue='displayname'
                                    value={props.selectedRecord["sviewname"] || ""}
                                    onChange={value => props.onViewComboChange(value, "sviewname")}

                                ></FormSelectSearch>
                            </Col>
                            <Col md={2}>
                                <Button onClick={() => props.addGroup("views")} className="mr-1">
                                    {'+'} <FormattedMessage id="IDS_ADDGROUP" defaultMessage="Add Group" />
                                </Button>
                            </Col>
                            {/* <Col md={2}>
                                <CustomSwitch
                                    label={props.intl.formatMessage({ id: "IDS_GROUPBY" })}
                                    name={"groupby"}
                                    type="switch"
                                    isMandatory={false}
                                    required={false}
                                    checked={props.selectedRecord["groupby"] === undefined ? false : props.selectedRecord["groupby"]}
                                    onChange={(event) => props.onInputChange(event, 1)}
                                />
                            </Col> */}
                            <Col md={2}>
                                {/* <Button onClick={() => props.addAggregate()} className="mr-1">
                                    {'+'} <FormattedMessage id="IDS_ADDGROUPBY" defaultMessage="Add Groupby" />
                                </Button> */}

                            </Col>
                            {/* <Col md={2}>
                                <CustomSwitch
                                    label={props.intl.formatMessage({ id: "IDS_CUSTOMORDERBY" })}
                                    name={"customorderby"}
                                    type="switch"
                                    isMandatory={false}
                                    required={false}
                                    checked={props.selectedRecord["customorderby"] === undefined ? false : props.selectedRecord["customorderby"]}
                                    onChange={(event) => props.onInputChange(event, 1)}
                                />
                            </Col> */}
                            <Col md={2}>
                                {/* <Button onClick={() => props.addOrderby()} className="mr-1">
                                    {'+'} <FormattedMessage id="IDS_ADDORDERBY" defaultMessage="Add Orderby" />
                                </Button> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                {props.addGroupList.length > 0 ? createGroupRules() : <></>}
                                {props.addAggregateList.length > 0 ? createAggregateFunctions() : <></>}
                                {props.addOrderbyList.length > 0 ? createOrderbyFields() : <></>}
                            </Col>
                            <Col md={12} >
                                <Card>
                                    <Card.Header>
                                        {props.intl.formatMessage({ id: "IDS_QUERY" })}
                                        <div className="float-right">

                                            <Button onClick={() => props.copySQLQuery(2)} style={{ marginRight: "0.5rem" }} >
                                                <FormattedMessage id="IDS_COPYSQL" defaultMessage="Copy SQL" />
                                            </Button>

                                            <Button onClick={() => props.onExecuteRule()} >
                                                <FormattedMessage id="IDS_EXECUTE" defaultMessage="Execute" />
                                            </Button>

                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FormMultiSelect
                                                    name={"filtercolumns"}
                                                    label={props.intl.formatMessage({ id: "IDS_COLUMNS" })}
                                                    options={props.selectFields || []}
                                                    optionId={"value"}
                                                    optionValue={"label"}
                                                    value={props.selectedRecord ? props.selectedRecord["filtercolumns"] || [] : []}
                                                    isMandatory={false}
                                                    isClearable={true}
                                                    disableSearch={false}
                                                    disabled={false}
                                                    closeMenuOnSelect={false}
                                                    alphabeticalSort={true}
                                                    onChange={(event) => props.onFilterComboChange(event, "filtercolumns")}
                                                />
                                            </Col>
                                        </Row>
                                        {props.selectedRecord && props.selectedRecord["sdisplayquery"] ? props.selectedRecord["sdisplayquery"] : props.intl.formatMessage({ id: "IDS_NOQUERY" })}
                                    </Card.Body>
                                </Card>
                                {props.data && props.gridColumnList && props.gridColumnList.length > 0 ?
                                    <DataGrid
                                        // primaryKeyField={"npublicholidaycode"}
                                        data={props.data}
                                        dataResult={props.dataResult}
                                        dataState={props.dataState}
                                        dataStateChange={props.dataStateChange}
                                        extractedColumnList={props.gridColumnList}
                                        controlMap={props.controlMap}
                                        userRoleControlRights={props.userRoleControlRights}
                                        // inputParam={props.inputParam}
                                        userInfo={props.userInfo}
                                        // methodUrl="PublicHolidays"
                                        // fetchRecord={props.getPublicHolidays}
                                        // editParam={publicHolidaysEditParam}
                                        // deleteRecord={props.deleteRecord}
                                        // deleteParam={publicHolidaysDeleteParam}
                                        pageable={true}
                                        scrollable={"scrollable"}
                                        // isComponent={true}
                                        isActionRequired={false}
                                        isToolBarRequired={true}
                                        isRefreshRequired={false}
                                        selectedId={-1}
                                    />
                                    : <></>
                                }
                            </Col>
                        </Row>
                    </>
            }

        </>
    );
};

export default injectIntl(BuildQuery);