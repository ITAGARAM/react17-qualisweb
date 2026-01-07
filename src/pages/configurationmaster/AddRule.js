import { faChevronRight, faComments, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Col, Nav, Row } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';

import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { BuilderBorder, ContionalButton, DeleteRule } from './RuleEngineSqlbuilder.styled';
import '../../assets/styles/querybuilder.css';
import './rulesengine.css';

import CustomTabs from '../../components/custom-tabs/custom-tabs.component';

import { ColumnType } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { stringOperatorData } from './RuleEngineQueryBuilderData';
import DataGrid from '../../components/data-grid/data-grid.component';
import ModalShow from '../../components/ModalShow';


const AddRule = (props) => {
    const fieldsForGrid = props.activeTabIndex == 1 ? [
        { "idsName": "IDS_FROMSITE", "dataField": "sfromsitename", "width": "200px" },
        { "idsName": "IDS_TOSITE", "dataField": "stositename", "width": "200px" }
    ] : [{ "idsName": "IDS_COMMENTTYPE", "dataField": "scommenttype", "width": "200px" },
    { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "scommentsubtype", "width": "200px" },
    { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "spredefinedname", "width": "200px" },
    { "idsName": "IDS_GENERALCOMMENTS", "dataField": "sgeneralcomments", "width": "200px" }
        // props.activeTabIndex == 2 ? { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "spredefinedname", "width": "200px" } :
        //     { "idsName": "IDS_REPORTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
    ];
    function createRules(items, groupIndex) {
        let design = [];
        //console.log('props.selectedRecord->>', props.selectedRecord)
        props.selectedRecord && [...Array(items)].map((data, index) => {
            let stringOperators = stringOperatorData;
            design.push(
                <>
                    {index > 0 ? props.selectedRecord["groupList"][groupIndex]['button_or'] === true ?
                        <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                        >
                            <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                        </ContionalButton> :
                        props.selectedRecord["groupList"][groupIndex]['button_and'] === true ?
                            <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                            >
                                <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                            </ContionalButton> : "" : ""}


                    {/* {
                        props.selectedRecord["groupList"][groupIndex][index]  && */}

                    <Row className="my-3 ml-1">
                        {/* <ContionalButton type="button" className={"btn btn-primary"} marginLeft={1}
                        >
                            <span>{props.intl.formatMessage({ id: "IDS_RULE" }) + " " + (index + 1)} </span>
                        </ContionalButton> */}                        
                        <Col md={3} className="pl-0">
                            <FormSelectSearch
                                formGroupClassName="remove-floating-label-margin"
                                isSearchable={true}
                                name={"stestname"}
                                showOption={true}
                                options={props.rulesOption || []}
                                optionId='stestname'
                                optionValue='displayname'
                                value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["stestname"] || ""}
                                onChange={value => props.onRuleChange(value, "stestname", groupIndex, index)}
                            ></FormSelectSearch>
                        </Col>
                        <DeleteRule marginLeft={1} onClick={() => props.deleteRule(groupIndex, index)}>
                            <FontAwesomeIcon icon={faTrashAlt} color="red" />
                        </DeleteRule>

                        {
                            props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["stestname"] &&
                            <>
                                <Col md={1}>
                                    <FormInput
                                        formGroupClassName="remove-floating-label-margin"
                                        name={`sinputname`}
                                        type="text"
                                        value={props.intl.formatMessage({ id: "IDS_WITH" })}
                                        disabled={true}
                                    />
                                </Col>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formGroupClassName="remove-floating-label-margin"
                                        formLabel=""
                                        isSearchable={true}
                                        name={"orderresulttype"}
                                        placeholder=""
                                        showOption={true}
                                        options={props.resultTypeList}
                                        optionId='nresultypecode'
                                        optionValue='orderresulttype'
                                        value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] || ""}
                                        onChange={value => props.onMasterDataChange(value, "orderresulttype", groupIndex, index)}
                                    >
                                    </FormSelectSearch>
                                </Col>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formGroupClassName="remove-floating-label-margin"
                                        formLabel=""
                                        isSearchable={true}
                                        name={"ssymbolname"}
                                        placeholder=""
                                        showOption={true}
                                        options={stringOperators}
                                        optionId='nvalidationcode'
                                        optionValue='ssymbolname'
                                        value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["ssymbolname"] || ""}
                                        onChange={value => props.onSymbolChange(value, "ssymbolname", groupIndex, index)}
                                    >
                                    </FormSelectSearch>
                                </Col>
                                {props.selectedRecord["groupList"][groupIndex][index] &&
                                    <Col md={2}>
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            isSearchable={true}
                                            name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                            showOption={true}
                                            // options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] ?
                                            //     props.optionsByRule[groupIndex][index] : []}
                                            options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
                                                props.DiagnosticCaseList : props.GradeList}

                                            optionId={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}
                                            optionValue={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.displaymember}
                                            // value={props.isResultorOrderType && props.isResultorOrderType[groupIndex] &&
                                            //     props.selectedRecord["groupList"][groupIndex][index]
                                            //     [props.isResultorOrderType[groupIndex][index] === 1 ? 'ndiagnosticcasecode' : 'ngradecode'] || ""}
                                            value={props.selectedRecord["groupList"][groupIndex][index] &&
                                                props.selectedRecord["groupList"][groupIndex][index]
                                                [props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' : 'ngradecode'] || ""}
                                            //  isMulti={props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`] && props.selectedRecord["groupList"][groupIndex][index][`ssymbolname`].items.ismulti}
                                            onChange={value => props.onMasterDataChange(value,
                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 1 ? 'ndiagnosticcasecode' : 'ngradecode'// `${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`
                                                , groupIndex, index)}
                                        ></FormSelectSearch>
                                    </Col>}


                            </>
                        }
                    </Row>
                </>
            )
        });
        return design;
    }
    function createGroupRules() {
        // console.log('props.addGroupList->', props)
        let indexCount = 0;
        let design = [];
        // console.log('props.addGroupList->', props.addGroupList)
        props.selectedRecord["groupList"] && props.addGroupList.length > 0 && props.addGroupList.map((items, index) => {

            let stringOperators = stringOperatorData;
            if (props.selectedRecord["groupList"] && props.selectedRecord["groupList"][index]["stestname"]
                && !props.selectedRecord["groupList"][index]["stestname"].items.needmasterdata
                && props.selectedRecord["groupList"][index]["stestname"].items.columntype === ColumnType.TEXTINPUT) {
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
                <>{index > 0 && <Row>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_and"] === true ? "builder-btn-primary" : ""} marginLeft={1}
                        onClick={() => props.onConditionClick("button_and", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                    </ContionalButton>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_or"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                        onClick={() => props.onConditionClick("button_or", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                    </ContionalButton>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                        onClick={() => props.onConditionClick("button_not", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                    </ContionalButton>
                </Row>}
                    {items > -1 ?
                        <>
                            {/* {index > 0 ? props.selectedRecord["groupList"]['button_or'] === true ?
                                <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                                >
                                    <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                                </ContionalButton> :
                                props.selectedRecord["groupList"]['button_and'] === true ?
                                    <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                                    >
                                        <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                                    </ContionalButton> : "" : ""} */}


                            <BuilderBorder key={index} className="p-3">
                                <Row >

                                    <Col md={12} >
                                        <Button onClick={() => props.addRule("views", index)} className="mr-1 rulesengine-rule-btn">
                                            {'+'} <FormattedMessage id="IDS_RULE" defaultMessage="Rule" />
                                        </Button>
                                    {/* </Col> */}
                                    {/* <Col md={3}>
                                        <ContionalButton type="button" className={"btn btn-primary"} marginLeft={1}
                                        >
                                            <span>{props.intl.formatMessage({ id: "IDS_GROUP" }) + " " + (index + 1)} </span>
                                        </ContionalButton>
                                    </Col> */}
                                    {/* <Col md={4} className="rulesengine-condition-btn "> */}
                                        {items > 1 ?
                                            <Row  className="rulesengine-condition-btn ">
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_and"] === true ? "builder-btn-primary" : ""} marginLeft={1}
                                                    onClick={() => props.onConditionClick("button_and", index, false)}>
                                                    <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                                                </ContionalButton>
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_or"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                                    onClick={() => props.onConditionClick("button_or", index, false)}>
                                                    <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                                                </ContionalButton>
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                                    onClick={() => props.onConditionClick("button_not", index, false)}>
                                                    <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                                                </ContionalButton>
                                            </Row>

                                            :
                                            <>
                                                <Row className="notbtn rulesengine-condition-btn ">
                                                    <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                                        onClick={() => props.onConditionClick("button_not", index, false)}>
                                                        <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                                                    </ContionalButton>
                                                </Row>
                                            </>
                                        }
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


    function testParameterAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameter) =>
            accordionMap.set(testParameter.ntestparametercode,
                <Col md="12" testParameter={testParameter}>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end pr-0">
                            {/* <Nav.Link name="deletetestparameter" className="add-txt-btn" testParameter={testParameter}
                                onClick={() => props.deleteModalTest()}
                            >
                             <FontAwesomeIcon icon={faTrashAlt} testParameter={testParameter} /> { }
                                <FormattedMessage id="IDS_TEST" defaultMessage="Test" testParameter={testParameter} />
                            </Nav.Link> */}
                            <Nav.Link name="addtestparameter" className="add-txt-btn pr-0" testParameter={testParameter}
                                onClick={() => props.addModalSite()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameter={testParameter} /> { }
                                <FormattedMessage id="IDS_OUTSOURCE" defaultMessage="Add Site" testParameter={testParameter} />
                            </Nav.Link>
                        </Col>
                    </Row>
                    {//props.masterData["testSite"][testParameter.ntestparametercode] ?
                        <>
                            {/* <div className="actions-stripe" testParameter={testParameter}>
                                <div className="d-flex justify-content-end" testParameter={testParameter}>
                                    <Nav.Link name="addtestparameter" className="add-txt-btn" testParameter={testParameter}
                                        onClick={() => props.addModalSite()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} testParameter={testParameter} /> { }
                                        <FormattedMessage id="IDS_OUTSOURCE" defaultMessage="Add Site" testParameter={testParameter} />
                                    </Nav.Link>
                                </div>
                            </div> */}

                            <DataGrid
                                key="testsectionkey"
                                primaryKeyField="nresultusedmaterialcode"
                                //expandField="expanded"
                                //   dataResult={props.dataResult || []}

                                dataResult={props.masterData["testSite"] && process(props.masterData["testSite"][testParameter.ntestparametercode] || [],
                                    props.dataStateObject && props.dataStateObject[testParameter.ntestparametercode]
                                        ? props.dataStateObject[testParameter.ntestparametercode] : { skip: 0, take: 10 })}
                                //dataState={{ skip: 0, take: 10 }}
                                // dataStateChange={props.dataStateChange}

                                dataState={props.dataStateObject && props.dataStateObject[testParameter.ntestparametercode]
                                    ? props.dataStateObject[testParameter.ntestparametercode] : { skip: 0, take: 10 }}
                                // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                                dataStateChange={(event) => { props.dataStateChange(event, testParameter.ntestparametercode) }}

                                extractedColumnList={fieldsForGrid}
                                controlMap={props.controlMap}
                                userRoleControlRights={props.userRoleControlRights}
                                pageable={true}
                                isActionRequired={true}
                                scrollable={'scrollable'}
                                hideColumnFilter={true}
                                selectedId={0}
                                testParameter={testParameter}
                                deleteRecord={props.deletModalSite}
                                deleteParam={{ operation: "delete" }}
                                actionIcons={[{
                                    title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                    controlname: "faTrashAlt",
                                    hidden: false,
                                    objectName: "delete",
                                    onClick: props.deletModalSite

                                }]}
                                gridWidth={"400px"}
                            >
                            </DataGrid></>
                        // : ""
                    }
                </Col>
            )
        );

        return accordionMap;
    }
    function testCommentsAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameterComments) =>
            accordionMap.set(testParameterComments.ntestparametercode,
                <Col md="12" testParameterComments={testParameterComments}>
                    <Row>
                        <Col md={6} className="d-flex justify-content-end">
                            <Nav.Link name="deletetestparameter" className="add-txt-btn" testParameterComments={testParameterComments}
                                onClick={() => props.deleteModalTest()}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} testParameterComments={testParameterComments} /> { }
                                <FormattedMessage id="IDS_TEST" defaultMessage="Test" testParameterComments={testParameterComments} />
                            </Nav.Link>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                            <Nav.Link name="addtestparameter" className="add-txt-btn" testParameterComments={testParameterComments}
                                onClick={() => props.addComments()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameterComments={testParameterComments} /> { }
                                <FormattedMessage id="IDS_TESTCOMMENTS" defaultMessage="Add Test Comments" testParameterComments={testParameterComments} />
                            </Nav.Link>
                        </Col>
                    </Row>
                    {/* <div className="actions-stripe" testParameterComments={testParameterComments}>
                        <div className="d-flex justify-content-end" testParameterComments={testParameterComments}>
                            <Nav.Link name="addtestparameter" className="add-txt-btn" testParameterComments={testParameterComments}
                                onClick={() => props.addComments()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameterComments={testParameterComments} /> { }
                                <FormattedMessage id="IDS_TESTCOMMENTS" defaultMessage="Add Test Comments" testParameterComments={testParameterComments} />
                            </Nav.Link>
                        </div>
                    </div> */}

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nresultusedmaterialcode"
                       // expandField="expanded"
                        //   dataResult={props.dataResult || []}

                        dataResult={props.masterData["testComments"] && process(props.masterData["testComments"][testParameterComments.ntestparametercode] || [],
                            props.dataStateObject && props.dataStateObject[testParameterComments.ntestparametercode]
                                ? props.dataStateObject[testParameterComments.ntestparametercode] : { skip: 0, take: 10 })}
                        //dataState={{ skip: 0, take: 10 }}
                        // dataStateChange={props.dataStateChange}

                        dataState={props.dataStateObject && props.dataStateObject[testParameterComments.ntestparametercode]
                            ? props.dataStateObject[testParameterComments.ntestparametercode] : { skip: 0, take: 10 }}
                        // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                        dataStateChange={(event) => { props.dataStateChange(event, testParameterComments.ntestparametercode) }}

                        extractedColumnList={fieldsForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        pageable={true}
                        isActionRequired={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        testParameterComments={testParameterComments}
                        deleteRecord={props.deletModalSite}
                        deleteParam={{ operation: "delete" }}
                        actionIcons={[{
                            title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                            controlname: "faTrashAlt",
                            hidden: false,
                            objectName: "delete",
                            onClick: props.deletModalSite

                        }]}
                    >
                    </DataGrid>
                </Col>
            )
        );

        return accordionMap;
    }
    function reportCommentsAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameterreportComments) =>
            accordionMap.set(testParameterreportComments.ntestparametercode,
                <Col md="12" testParameterreportComments={testParameterreportComments}>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end">
                            <Nav.Link name="deletetestparameter" className="add-txt-btn" testParameterreportComments={testParameterreportComments}
                                onClick={() => props.deleteModalTest()}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} testParameterreportComments={testParameterreportComments} /> { }
                                <FormattedMessage id="IDS_DELETE" defaultMessage="Delete" testParameterreportComments={testParameterreportComments} />
                            </Nav.Link>
                        </Col>
                    </Row>
                    <div className="actions-stripe" testParameterreportComments={testParameterreportComments}>
                        <div className="d-flex justify-content-end" testParameterreportComments={testParameterreportComments}>
                            <Nav.Link name="addtestparameter" className="add-txt-btn" testParameterreportComments={testParameterreportComments}
                                onClick={() => props.addComments()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameterreportComments={testParameterreportComments} /> { }
                                <FormattedMessage id="IDS_ADDREPORTCOMMENTS" defaultMessage="Add Report Comments" testParameterreportComments={testParameterreportComments} />
                            </Nav.Link>
                        </div>
                    </div>

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nresultusedmaterialcode"
                       // expandField="expanded"
                        //   dataResult={props.dataResult || []}

                        dataResult={props.masterData["reportComments"] && process(props.masterData["reportComments"][testParameterreportComments.ntestparametercode] || [],
                            props.dataState
                                ? props.dataState : { skip: 0, take: 10 })}
                        //dataState={{ skip: 0, take: 10 }}
                        // dataStateChange={props.dataStateChange}

                        dataState={props.dataState
                            ? props.dataState : { skip: 0, take: 10 }}
                        // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                        dataStateChange={props.dataStateChange}

                        extractedColumnList={fieldsForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        pageable={true}
                        isActionRequired={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        testParameterComments={testParameterreportComments}
                        deleteRecord={props.deletModalSite}
                        deleteParam={{ operation: "delete" }}
                        actionIcons={[{
                            title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                            controlname: "faTrashAlt",
                            hidden: false,
                            objectName: "delete",
                            onClick: props.deletModalSite

                        }]}
                    >
                    </DataGrid>
                </Col>
            )
        );

        return accordionMap;
    }
    function TabDetails() {
        const resultTabMap = new Map();
        if (props.addOutcomeList.length === 0) {
            props.activeTabIndex == 1 ?
                resultTabMap.set("IDS_NEEDTESTINITIATE",
                    <>
                        <div className="actions-stripe">
                            <div className="d-flex justify-content-end">
                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                <Nav.Link name="addtestparameter" //className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addParameterId) === -1}
                                    onClick={() => props.addTest()}>
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                </Nav.Link>
                            </div>
                        </div>
                        {props.masterData.testParameter && props.masterData.testParameter.length > 0 &&
                            <CustomAccordion
                                key="parameteraccordion"
                                clickIconGroup={true}
                                deleteModalTest1 = {props.deleteModalTest}
                                accordionTitle={"stestparametersynonym"}
                                accordionComponent={testParameterAccordion(props.masterData.testParameter)}
                                inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                accordionClick={props.getOutcomeDetails}
                                accordionPrimaryKey={"ntestparametercode"}
                                accordionObjectName={"testParameter"}
                                selectedKey={props.masterData.selectedParameter ? props.masterData.selectedParameter.ntestparametercode : 0}
                            />
                        }
                    </>
                ) : props.activeTabIndex == 2 ?
                    resultTabMap.set("IDS_TESTCOMMENTS",
                        <>
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                    <Nav.Link name="addtestparameter" //className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addParameterId) === -1}
                                        onClick={() => props.addTest()}>
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                    </Nav.Link>
                                </div>
                            </div>
                            {props.masterData.testParameterComments && props.masterData.testParameterComments.length > 0 &&
                                <CustomAccordion
                                    key="parameteraccordion"
                                    accordionTitle={"stestparametersynonym"}
                                    accordionComponent={testCommentsAccordion(props.masterData.testParameterComments)}
                                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                    accordionClick={props.getOutcomeDetails}
                                    accordionPrimaryKey={"ntestparametercode"}
                                    accordionObjectName={"testParameterComments"}
                                    selectedKey={props.masterData.selectedParameter ? props.masterData.selectedParameter.ntestparametercode : 0}
                                />
                            }
                        </>
                    ) :
                    resultTabMap.set("IDS_REPORTCOMMENTS",
                        <>
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                    <Nav.Link name="addtestparameter" //className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addParameterId) === -1}
                                        onClick={() => props.addTest()}>
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                    </Nav.Link>
                                </div>
                            </div>
                            {props.masterData.testParameterreportComments && props.masterData.testParameterreportComments.length > 0 &&
                                <CustomAccordion
                                    key="parameteraccordion"
                                    accordionTitle={"stestparametersynonym"}
                                    accordionComponent={reportCommentsAccordion(props.masterData.testParameterreportComments)}
                                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                    accordionClick={props.getOutcomeDetails}
                                    accordionPrimaryKey={"ntestparametercode"}
                                    accordionObjectName={"testParameterreportComments"}
                                    selectedKey={props.masterData.selectedParameter ? props.masterData.selectedParameter.ntestparametercode : 0}
                                />
                            }
                        </>
                    )
        }
        return resultTabMap;
    }
    function testfilter(list) {
        let activeTabIndex = props.activeTabIndex
        if (props.masterData.selectedParameter) {
            let dynamicList = activeTabIndex === 2 ? props.masterData["testComments"] && props.masterData["testComments"][props.masterData.selectedParameter.ntestparametercode]
                : props.masterData["reportComments"] && props.masterData["reportComments"][props.masterData.selectedParameter.ntestparametercode]
            if (dynamicList !== undefined) {
                list = list.filter(({ value }) => !dynamicList.some(x => x.nsampletestcommentscode == value))
            }
        }
        return list
    }
    const mandatoryFields =
        // props.action === 'IDS_ADDREPORTCOMMENTS' ? [
        //     { "idsName": "IDS_REPORTCOMMENTS", "dataField": "nsampletestcommentscode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
        // ] :
        //     props.action === 'IDS_ADDTESTCOMMENTS' ? [
        //         { "idsName": "IDS_TESTCOMMENTS", "dataField": "nsampletestcommentscode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
        //     ]
        //         : props.action === 'IDS_ADDTEST' ? [
        //             { "idsName": "IDS_TESTNAME", "dataField": "ntestparametercode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
        //         ] :
        //             [
        //                 { "idsName": "IDS_FROMSITE", "dataField": "nfromsitecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
        //                 { "idsName": "IDS_TOSITE", "dataField": "ntositecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        //             ]
        //props.action === 'IDS_ADDTESTCOMMENTS' || props.action === 'IDS_ADDTEST' ?
        props.action === 'IDS_SAVERULEMODAL' ?
            [{ "idsName": "IDS_RULESENGINENAME", "dataField": "srulename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" }] :
            props.activeTabIndex === 1 ?
                // props.needoutsource !== true ?
                [{ "idsName": "IDS_TESTNAME", "dataField": "ntestparametercode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }]// :
                // [
                //     { "idsName": "IDS_TESTNAME", "dataField": "ntestparametercode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                //     { "idsName": "IDS_FROMSITE", "dataField": "nfromsitecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                //     { "idsName": "IDS_TOSITE", "dataField": "ntositecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                // ]
                :
                props.activeTabIndex === 2 ? [
                    { "idsName": "IDS_TESTNAME", "dataField": "ntestparametercode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_COMMENTTYPE", "dataField": "ncommenttypecode", "width": "200px" },
                    { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "ncommentsubtypecode", "width": "200px" },
                    props.isneedsgeneralcomments === true ?
                        { "idsName": "IDS_GENERALCOMMENTS", "dataField": "sgeneralcomments", "width": "200px" } :
                        { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "nsampletestcommentscode", "width": "200px" }


                    // props.activeTabIndex == 2 ? { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "spredefinedname", "width": "200px" } :
                    //     { "idsName": "IDS_REPORTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
                ] :
                    [
                        { "idsName": "IDS_FROMSITE", "dataField": "nfromsitecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                        { "idsName": "IDS_TOSITE", "dataField": "ntositecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    ]
    return (
       
        <div class="modal-inner-content">
            <div class="row margin-top-negative-1">
            <div class="p-0 col-md-12">
            <div class="rules-engine vertical-tab-top popup">                
            <div class="full-width center-area-wrap py-2 px-0 border-0">
                <div class="center-area full-width">
                    <div class="">
            
                <Col className={`tab-left-area px-2 ${props.activeTabIndex
                    ? 'active' : ""} ${props.enablePropertyPopup ? 'active-popup' : ""}`}>
                    <div className="full-width center-area-wrap">
                        <div className="center-area mx-4">
                                <Row className='d-flex pt-0'>
                                    <Col md={6}>
                                        <FormSelectSearch
                                            name={"nproductcatcode"}
                                            formLabel={props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORY" })}
                                            isSearchable={true}
                                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            isMandatory={true}
                                            isDisabled={false}
                                            showOption={true}
                                            options={props.productCategoryList || []}
                                            value={props.selectedRecord.nproductcatcode ? props.selectedRecord.nproductcatcode
                                                : ""}

                                            onChange={value => props.onmodalComboChange(value, "nproductcatcode")}

                                        ></FormSelectSearch>
                                    </Col>

                                    <Col md={6}>
                                        <Button onClick={() => props.addGroup("views")} className="mr-1">
                                            {'+'} <FormattedMessage id="IDS_GROUP" defaultMessage="Group" />
                                        </Button>
                                        <Button onClick={() => props.resetRule()}>
                                            <FormattedMessage id="IDS_RESET" defaultMessage="Reset" />
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className='popup-fixed-center-headed-full-width'>
                                    <Col md={12} className="ml-0 mr-0">

                                        {props.addGroupList.length > 0 ?
                                            <>
                                                <BuilderBorder className='border-0 '>    {
                                                    createGroupRules()}   </BuilderBorder>
                                            </>

                                            : <></>}
                                    </Col>
                                </Row>
                        </div>
                    </div>
                </Col>
                </div>
            </div>
            </div>
                <div md={6} className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab py-2 ${props.activeTabIndex
                    ? 'active' : ""}`} >
                    <div className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${props.activeTabIndex
                        ? 'active' : ""}`} style={{ width: props.enablePropertyPopup ? props.propertyPopupWidth + '%' : "" }}>
                        <span className={` vertical-tab-close ${props.activeTabIndex
                            ? 'active' : ""}`} onClick={() => props.changePropertyView(0)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                        <div className={` vertical-tab-content-common  ${props.activeTabIndex && props.activeTabIndex
                            ? 'active' : ""}`}>
                            <h4 className='inner_h4'>
                                {props.intl.formatMessage({ id: "IDS_OUTCOME" })}
                            </h4>
                            {props.activeTabIndex && props.activeTabIndex
                                ?
                                <CustomTabs activeKey={props.activeTestTab
                                } tabDetail={TabDetails()} />
                                : ""}

                        </div>
                    </div>
                    <div className='tab-head'>
                        <ul>
                            <li className={`${props.activeTabIndex && props.activeTabIndex == 1 ? 'active' : ""}`}
                                onClick={() => props.changePropertyView(1)}>
                                <FontAwesomeIcon icon={faEye} />
                                <span>
                                    {props.intl.formatMessage({ id: "IDS_NEEDTESTINITIATE" })}
                                </span>
                            </li>
                            <li className={`${props.activeTabIndex && props.activeTabIndex == 2 ? 'active' : ""}`}
                                onClick={() => props.changePropertyView(2)}>
                                <FontAwesomeIcon icon={faComments} />
                                <span>
                                    {props.intl.formatMessage({ id: "IDS_TESTCOMMENTS" })}
                                </span>
                            </li>
                            {/* <li className={`${props.activeTabIndex && props.activeTabIndex == 3 ? 'active' : ""}`}
                                onClick={() => props.changePropertyView(3)}>
                                <FontAwesomeIcon icon={faComments} />
                                <span>
                                    {props.intl.formatMessage({ id: "IDS_REPORTCOMMENTS" })}
                                </span>
                            </li> */}
                        </ul>
                    </div>
                </div>




            {/* {
                //start

                <div className="vertical-tab-top popup">
                    <div className="full-width center-area-wrap">
                        <div className="center-area full-width">
                            <div className="popup-fixed-center-headed-full-width">
                                <div className="page">
                                    <Row>
                                        <Col md={3}>
                                            <Button onClick={() => props.resetRule()}>
                                                <FormattedMessage id="IDS_RESET" defaultMessage="Reset" />
                                            </Button>
                                        </Col>

                                        <Col md={3}>
                                            <FormSelectSearch
                                                name={"nproductcatcode"}
                                                formLabel={props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORY" })}
                                                isSearchable={true}
                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                isMandatory={true}
                                                isDisabled={false}
                                                showOption={true}
                                                options={props.productCategoryList || []}
                                                value={props.selectedRecord.nproductcatcode ? props.selectedRecord.nproductcatcode
                                                    : ""}
                                                onChange={value => props.onmodalComboChange(value, "nproductcatcode")}

                                            ></FormSelectSearch>
                                        </Col>
                                        <Col md={3}>
                                            <Button onClick={() => props.addGroup("views")} className="mr-1">
                                                {'+'} <FormattedMessage id="IDS_ADDGROUP" defaultMessage="Add Group" />
                                            </Button>
                                        </Col>

                                        <Col md={12}>

                                            {props.addGroupList.length > 0 ?
                                                <>
                                                    <BuilderBorder >    {
                                                        createGroupRules()}   </BuilderBorder>
                                                </>

                                                : <></>}
                                            {props.addAggregateList.length > 0 ? createAggregateFunctions() : <></>}
                                            {props.addOrderbyList.length > 0 ? createOrderbyFields() : <></>}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab ${props.activeTabIndex
                        ? 'active' : ""}`} >
                        <div className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${props.activeTabIndex
                            ? 'active' : ""}`} style={{ width: props.enablePropertyPopup ? props.propertyPopupWidth + '%' : "" }}>
                            <span className={` vertical-tab-close ${props.activeTabIndex
                                ? 'active' : ""}`} onClick={() => props.changePropertyView(1)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                            <div className={` vertical-tab-content-common  ${props.activeTabIndex && props.activeTabIndex
                                ? 'active' : ""}`}>
                                <h4 className='inner_h4'>
                                    {props.intl.formatMessage({ id: "IDS_OUTCOME" })}
                                </h4>
                                {props.activeTabIndex && props.activeTabIndex
                                    ?
                                    <CustomTabs activeKey={props.activeTestTab
                                    } tabDetail={TabDetails()} />
                                    : ""}

                            </div>
                        </div>
                        <div className='tab-head'>
                            <ul>
                                <li className={`${props.activeTabIndex && props.activeTabIndex == 1 ? 'active' : ""}`}
                                    onClick={() => props.changePropertyView(1)}>
                                    <FontAwesomeIcon icon={faEye} />
                                    <span>
                                        {props.intl.formatMessage({ id: "IDS_NEEDTESTINITIATE" })}
                                    </span>
                                </li>
                                <li className={`${props.activeTabIndex && props.activeTabIndex == 2 ? 'active' : ""}`}
                                    onClick={() => props.changePropertyView(2)}>
                                    <FontAwesomeIcon icon={faComments} />
                                    <span>
                                        {props.intl.formatMessage({ id: "IDS_TESTCOMMENTS" })}
                                    </span>
                                </li>
                                <li className={`${props.activeTabIndex && props.activeTabIndex == 3 ? 'active' : ""}`}
                                    onClick={() => props.changePropertyView(3)}>
                                    <FontAwesomeIcon icon={faComments} />
                                    <span>
                                        {props.intl.formatMessage({ id: "IDS_REPORTCOMMENTS" })}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                //end
            } */}



            {
                props.openModalPopup &&
                <ModalShow
                    modalShow={true}
                    modalTitle={props.action === 'IDS_SAVERULEMODAL' ? 'IDS_RULESENGINENAME' :
                        props.action === 'IDS_ADDREPORTCOMMENTS' ? props.intl.formatMessage({ id: 'IDS_ADDREPORTCOMMENTS' }) :
                            props.action === 'IDS_ADDTESTCOMMENTS' ? props.intl.formatMessage({ id: 'IDS_ADDTESTCOMMENTS' })
                                : props.action === 'IDS_ADDTEST' ? props.intl.formatMessage({ id: 'IDS_ADDTEST' }) :
                                    props.intl.formatMessage({ id: 'IDS_ADDSITE' })}

                    closeModal={props.closeModalShow}
                    onSaveClick={props.action === 'IDS_SAVERULEMODAL' ? props.save : props.modalsaveClick}
                    // validateEsign={this.validateEsign}
                    selectedRecord={props.selectedRecord}
                    mandatoryFields={mandatoryFields}
                    modalBody={

                        props.openmodalsavePopup === true ?
                            <Row>
                                <Col md={12}>
                                    <FormInput
                                        formGroupClassName="remove-floating-label-margin"
                                        label={props.intl.formatMessage({ id: "IDS_RULESENGINENAME" })}
                                        name={`srulename`}
                                        type="text"
                                        required={false}
                                        isMandatory={true}
                                        value={props.selectedRecord["srulename"] || ""}
                                        onChange={(event) => props.onInputChange(event)}
                                    />
                                </Col>
                            </Row>
                            :
                            props.activeTabIndex == 1 ?
                                //  props.action === 'IDS_ADDTEST' ?
                                <Col md={12}>
                                    <Row>
                                        <Col md={//props.action === 'IDS_ADDTEST' ? 8 :
                                            12}>
                                            <FormSelectSearch
                                                formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                isSearchable={true}
                                                name={"ntestparametercode"}
                                                showOption={true}
                                                options={props.viewColumnListByRule || []}
                                                optionId='ntestparametercode'
                                                optionValue='stestparametersynonym'
                                                value={props.selectedRecord["ntestparametercode"] && props.selectedRecord["ntestparametercode"] || ""}
                                                onChange={value => props.onmodalComboChange(value, 'ntestparametercode')}
                                                isMandatory={true}
                                                isDisabled={props.action === 'IDS_ADDTEST' ? false : true}
                                            ></FormSelectSearch>
                                        </Col>
                                        {/* {props.action === 'IDS_ADDTEST' ? <Col md={4}>
                                        <CustomSwitch
                                            label={props.intl.formatMessage({ id: "IDS_NEEDOUTSOURCE" })}
                                            type="switch"
                                            name={"needoutsource"}
                                            onChange={(event) => props.onInputChange(event)}
                                            // placeholder={control.label}
                                            // defaultValue={this.props.selectedRecord[control.label] && this.props.selectedRecord[control.label] === 3 ? true : false}
                                            checked={props.selectedRecord["needoutsource"] && props.selectedRecord["needoutsource"] === 3 ? true : false}
                                        //disabled={control.readonly ?
                                        //    control.readonly : checkReadOnly}
                                        />
                                    </Col> : ""} */}

                                    </Row>
                                    {(//props.action === 'IDS_ADDSITE' ?
                                        props.action === 'IDS_ADDSITE' || props.action === 'IDS_ADDTEST' ? true : false //:
                                        // props.needoutsource === true ? true : false
                                    )
                                        ?
                                        <Row>
                                            <Col md={12}>
                                                <FormSelectSearch
                                                    formLabel={props.intl.formatMessage({ id: "IDS_FROMSITE" })}
                                                    // formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={"nfromsitecode"}
                                                    showOption={true}
                                                    options={props.siteList || []}
                                                    optionId='nfromsitecode'
                                                    optionValue='ssitename'
                                                    value={props.selectedRecord["nfromsitecode"] && props.selectedRecord["nfromsitecode"] || ""}
                                                    onChange={value => props.onmodalComboChange(value, 'nfromsitecode')}
                                                //  isMandatory={true}
                                                ></FormSelectSearch>
                                            </Col>
                                            <Col md={12}>
                                                <FormSelectSearch
                                                    formLabel={props.intl.formatMessage({ id: "IDS_TOSITE" })}
                                                    //    formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={"ntositecode"}
                                                    showOption={true}
                                                    options={props.siteList || []}
                                                    optionId='ntositecode'
                                                    optionValue='ssitename'
                                                    value={props.selectedRecord["ntositecode"] && props.selectedRecord["ntositecode"] || ""}
                                                    onChange={value => props.onmodalComboChange(value, 'ntositecode')}
                                                //  isMandatory={true}
                                                ></FormSelectSearch>
                                            </Col>
                                        </Row> : ""
                                    }
                                </Col>
                                // :
                                // <Row>
                                //     <Col md={12}>
                                //         <FormSelectSearch
                                //             formLabel={props.intl.formatMessage({ id: "IDS_FROMSITE" })}
                                //             // formGroupClassName="remove-floating-label-margin"
                                //             isSearchable={true}
                                //             name={"nfromsitecode"}
                                //             showOption={true}
                                //             options={props.siteList || []}
                                //             optionId='nfromsitecode'
                                //             optionValue='ssitename'
                                //             value={props.selectedRecord["nfromsitecode"] && props.selectedRecord["nfromsitecode"] || ""}
                                //             onChange={value => props.onmodalComboChange(value, 'nfromsitecode')}
                                //             isMandatory={true}
                                //         ></FormSelectSearch>
                                //     </Col>
                                //     <Col md={12}>
                                //         <FormSelectSearch
                                //             formLabel={props.intl.formatMessage({ id: "IDS_TOSITE" })}
                                //             //    formGroupClassName="remove-floating-label-margin"
                                //             isSearchable={true}
                                //             name={"ntositecode"}
                                //             showOption={true}
                                //             options={props.siteList || []}
                                //             optionId='ntositecode'
                                //             optionValue='ssitename'
                                //             value={props.selectedRecord["ntositecode"] && props.selectedRecord["ntositecode"] || ""}
                                //             onChange={value => props.onmodalComboChange(value, 'ntositecode')}
                                //             isMandatory={true}
                                //         ></FormSelectSearch>
                                //     </Col>
                                // </Row>
                                :
                                props.activeTabIndex == 2 ?
                                    //  props.action === 'IDS_ADDTEST' ?
                                    <Row>
                                        <Col md={12}>
                                            <FormSelectSearch
                                                formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                isSearchable={true}
                                                name={"ntestparametercode"}
                                                showOption={true}
                                                options={props.viewColumnListByRule || []}
                                                optionId='ntestparametercode'
                                                optionValue='stestparametersynonym'
                                                value={props.selectedRecord["ntestparametercode"] && props.selectedRecord["ntestparametercode"] || ""}
                                                onChange={value => props.onmodalComboChange(value, 'ntestparametercode')}
                                                isMandatory={true}
                                                isDisabled={props.action === 'IDS_ADDTEST' ? false : true}
                                            ></FormSelectSearch>
                                        </Col>
                                        <Col md={12}>
                                            <FormSelectSearch
                                                formLabel={props.intl.formatMessage({ id: "IDS_COMMENTTYPE" })}
                                                isSearchable={true}
                                                name={"ncommenttypecode"}
                                                showOption={true}
                                                options={props.CommentType || []}
                                                optionId='ncommenttypecode'
                                                optionValue='scommenttype'
                                                value={props.selectedRecord["ncommenttypecode"] && props.selectedRecord["ncommenttypecode"] || ""}
                                                onChange={value => props.onmodalComboChange(value, 'ncommenttypecode')}
                                                isMandatory={true}
                                            ></FormSelectSearch>
                                        </Col>
                                        <Col md={12}>
                                            <FormSelectSearch
                                                formLabel={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                                isSearchable={true}
                                                name={"ncommentsubtypecode"}
                                                showOption={true}
                                                options={props.CommentSubType || []}
                                                optionId='ncommentsubtypecode'
                                                optionValue='scommentsubtype'
                                                value={props.selectedRecord["ncommentsubtypecode"] && props.selectedRecord["ncommentsubtypecode"] || ""}
                                                onChange={value => props.onmodalComboChange(value, 'ncommentsubtypecode')}
                                                isMandatory={true}
                                            ></FormSelectSearch>
                                        </Col>
                                        {props.selectedRecord["ncommentsubtypecode"] ?
                                            props.isneedsgeneralcomments === true ?
                                                <Col md={12}>
                                                    <FormTextarea
                                                        name={"sgeneralcomments"}
                                                        label={props.intl.formatMessage({ id: "IDS_GENERALCOMMENTS" })}
                                                        type="text"
                                                        value={props.selectedRecord && props.selectedRecord['sgeneralcomments'] || ""}
                                                        // isMandatory={control.mandatory}
                                                        // required={control.mandatory}
                                                        onChange={(event) => props.onInputChange(event, 1)}
                                                        rows="2"
                                                        maxLength={"255"}
                                                        isDisabled={false}
                                                        isMandatory={true}
                                                    />
                                                </Col> : <Col md={12}>
                                                    <FormSelectSearch
                                                        formLabel={props.intl.formatMessage({ id: "IDS_PREDEFINEDNAME" })}
                                                        isSearchable={true}
                                                        name={"nsampletestcommentscode"}
                                                        showOption={true}
                                                        options={props.predefcomments || []}
                                                        optionId='nsampletestcommentscode'
                                                        optionValue='spredefinedname'
                                                        value={props.selectedRecord["nsampletestcommentscode"] && props.selectedRecord["nsampletestcommentscode"] || ""}
                                                        onChange={value => props.onmodalComboChange(value, 'nsampletestcommentscode')}
                                                        isMandatory={true}
                                                    ></FormSelectSearch>
                                                </Col> : ""
                                        }

                                    </Row>
                                    // : <Row>
                                    //     <Col md={12}>
                                    //         <FormInput
                                    //             name={"ncommentsubtypecode"}
                                    //             label={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                    //             type="text"
                                    //             onChange={(event) => props.onInputOnChange(event, 1)}
                                    //             placeholder={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                    //             value={props.testcomments && props.testcomments[0].item.scommentsubtype || ""}
                                    //             isMandatory="*"
                                    //             required={true}
                                    //             maxLength={100}
                                    //             isDisabled={true}
                                    //         />
                                    //     </Col>
                                    //     <Col md={12}>
                                    //         <FormSelectSearch
                                    //             formLabel={props.intl.formatMessage({ id: "IDS_TESTCOMMENTS" })}
                                    //             //  formGroupClassName="remove-floating-label-margin"
                                    //             isSearchable={true}
                                    //             name={"nsampletestcommentscode"}
                                    //             showOption={true}
                                    //             options={testfilter(props.testcomments) || []}
                                    //             optionId='nsampletestcommentscode'
                                    //             optionValue='spredefinedname'
                                    //             value={props.selectedRecord["nsampletestcommentscode"] && props.selectedRecord["nsampletestcommentscode"] || ""}
                                    //             onChange={value => props.onmodalComboChange(value, 'nsampletestcommentscode')}
                                    //             isMandatory={true}
                                    //         ></FormSelectSearch>
                                    //     </Col>
                                    // </Row>
                                    :
                                    props.action === 'IDS_ADDTEST' ?
                                        <Col md={12}>
                                            <Row>
                                                <FormSelectSearch
                                                    formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                    formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={"ntestparametercode"}
                                                    showOption={true}
                                                    options={props.viewColumnListByRule || []}
                                                    optionId='ntestparametercode'
                                                    optionValue='stestparametersynonym'
                                                    value={props.selectedRecord["ntestparametercode"] && props.selectedRecord["ntestparametercode"] || ""}
                                                    onChange={value => props.onmodalComboChange(value, 'ntestparametercode')}
                                                    isMandatory={true}
                                                ></FormSelectSearch>
                                            </Row>
                                        </Col>
                                        : <Row>
                                            <Col md={12}>
                                                <FormInput
                                                    name={"ncommentsubtypecode"}
                                                    label={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                                    type="text"
                                                    onChange={(event) => props.onInputOnChange(event, 1)}
                                                    placeholder={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                                    value={props.reportcomments && props.reportcomments[0].item.scommentsubtype || ""}
                                                    isMandatory="*"
                                                    required={true}
                                                    maxLength={100}
                                                    isDisabled={true}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormSelectSearch
                                                    formLabel={props.intl.formatMessage({ id: "IDS_REPORTCOMMENTS" })}
                                                    //   formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={"nsampletestcommentscode"}
                                                    showOption={true}
                                                    options={testfilter(props.reportcomments) || []}
                                                    optionId='nsampletestcommentscode'
                                                    optionValue='spredefinedname'
                                                    value={props.selectedRecord["nsampletestcommentscode"] && props.selectedRecord["nsampletestcommentscode"] || ""}
                                                    onChange={value => props.onmodalComboChange(value, 'nsampletestcommentscode')}
                                                    isMandatory={true}
                                                ></FormSelectSearch>
                                            </Col>
                                        </Row>
                    }
                />
            }
</div></div></div>
        
        </div>
    );
};

export default injectIntl(AddRule);