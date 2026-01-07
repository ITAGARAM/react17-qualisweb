import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt, faTasks, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import AddQuery from './AddQuery';
import AddParameter from './AddParameter';
import QueryTypeFilter from './QueryTypeFilter';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSQLQueryDetail,
    getSQLQueryComboService, filterColumnData, comboChangeQueryType, executeUserQuery,
    comboColumnValues, getColumnNamesByTableName, getTablesName, getModuleFormName,
    getDatabaseTables, executeQuery, getForeignTable, getViewColumns, getMasterData
} from '../../actions';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { transactionStatus, queryTypeFilter, tableType, ColumnType } from '../../components/Enumeration';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import rsapi from '../../rsapi';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { Affix } from 'rsuite';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
// import ReactTooltip from 'react-tooltip';
import PortalModalSlideout from '../../components/portal-modal/portal-modal-slideout';
import BuildQuery from './BuildQuery';
import SqlBuilderNewDesign from './SqlBuilderNewDesign.jsx'
import { intl } from '../../components/App.js';
// import {validationData} from './QueryBuilderData';

const jsonSql = require('json-sql')({separatedValues: true});

class SQLBuilder extends Component {

    constructor(props) {
        super(props);

        const dataStateUserQuery = {
            skip: 0,
            take: 10,
        };
        this.state = ({
            selectedRecord: {},
            error: "",
            // modalIsOpen: false,
            parameters: [],
            // objparam: [],
            // objDparam: [],
            queryName: '',
            // queryResult: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            dataStateUserQuery: dataStateUserQuery,
            queryTypeName: '',
            selectedcombo: [],
            selectedTableType: [],
            moduleFormName: [],
            ntableTypeCode: -1,
            nFormCode: -1,
            queryType: [],
            tableType: [],
            chartList: [],
            skip: 0,
            take: this.props.Login.settings ?
                this.props.Login.settings[3] : 25, //tableName : undefined,tableList:[]
            outputColumns: [],
            selectedTableList: [],
            tableColumnList: [],
            foreignTableColumnList: [],
            joinTableList: [],
            symbolsList: [],
            foreignTableList: [],
            count: 0,
            foreignTableCount: [],
            selectedforeignTableList: [],
            filterColumnList: [],
            sqlQuery: false,
            // viewColumnList: [],
            switchRecord: {},
            sidebarview: false            
        });
        this.searchRef = React.createRef();
        this.filtersearchRef= React.createRef();
        this.confirmMessage = new ConfirmMessage();
        // this.dropItemRef = React.createRef(); 

        this.queryFieldList = ['nquerytypecode', 'ssqlqueryname', 'ssqlquery',
            'sscreenrecordquery', 'sscreenheader', 'svaluemember', 'sdisplaymember', 'ncharttypecode'];
        // this.queryList = [];

        this.searchFieldList = ["ssqlqueryname", "ssqlquery", "sscreenheader", "svaluemember", "sdisplaymember",
            "squerytypename", "schartname"];            
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    userQueryDataStateChange = (event) => {
        this.setState({
            dataStateUserQuery: event.dataState
        });
    }


    queryGenrate=()=>{
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openPortalModal:true,openModal:false
            }
        }
        this.props.updateStore(updateInfo)
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("SQLQuery", this.props.Login.masterData.SelectedSQLQuery, "delete", deleteId));
    }


    render() {
        const { masterData, userInfo } = this.props.Login;
        const addId = this.state.controlMap.has("AddSQLQuery") && this.state.controlMap.get("AddSQLQuery").ncontrolcode;
        const editId = this.state.controlMap.has("EditSQLQuery") && this.state.controlMap.get("EditSQLQuery").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSQLQuery") && this.state.controlMap.get("DeleteSQLQuery").ncontrolcode;
        const executeId = this.state.controlMap.has("ExecuteSQLQuery") && this.state.controlMap.get("ExecuteSQLQuery").ncontrolcode;

        const filterParam = {
            inputListName: "SQLQuery", selectedObject: "SelectedSQLQuery", primaryKeyField: "nsqlquerycode",
            fetchUrl: "sqlquery/getSQLQuery", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        this.validationColumnList = [
            { "idsName": "IDS_SQLQUERYNAME", "dataField": "ssqlqueryname", "width": "200px", "mandatory": true },
            { "idsName": "IDS_SQLQUERY", "dataField": "ssqlquery", "width": "200px", "mandatory": true },
            // { "idsName": "IDS_SCREENHEADER", "dataField": "sscreenheader", "width": "200px","mandatory": true }, 
            // { "idsName": "IDS_SVALUEMEMBER", "dataField": "svaluemember", "width": "200px","mandatory": true },
            // { "idsName": "IDS_SDISPLAYMEMBER", "dataField": "sdisplaymember", "width": "200px","mandatory": true },
            // { "idsName": "IDS_CHARTTYPE", "dataField": "ncharttypecode", "width": "200px","mandatory": true },
        ]
        if (this.state.selectedcombo.nquerytypecode && this.state.selectedcombo.nquerytypecode.value === 2) {
            this.validationColumnList = [
                { "idsName": "IDS_SQLQUERYNAME", "dataField": "ssqlqueryname", "width": "200px", "mandatory": true },
                { "idsName": "IDS_SQLQUERY", "dataField": "ssqlquery", "width": "200px", "mandatory": true },
                { "idsName": "IDS_SCREENHEADER", "dataField": "sscreenheader", "width": "200px", "mandatory": true },
            ]
        }
        if (this.state.selectedcombo.nquerytypecode && this.state.selectedcombo.nquerytypecode.value === 5) {
            this.validationColumnList = [
                { "idsName": "IDS_SQLQUERYNAME", "dataField": "ssqlqueryname", "width": "200px", "mandatory": true },
                { "idsName": "IDS_SQLQUERY", "dataField": "ssqlquery", "width": "200px", "mandatory": true },
                { "idsName": "IDS_SVALUEMEMBER", "dataField": "svaluemember", "width": "200px", "mandatory": true },
                { "idsName": "IDS_SDISPLAYMEMBER", "dataField": "sdisplaymember", "width": "200px", "mandatory": true },
            ]
        }
        if (this.state.selectedcombo.nquerytypecode && this.state.selectedcombo.nquerytypecode.value === 1) {
            this.validationColumnList = [
                { "idsName": "IDS_SQLQUERYNAME", "dataField": "ssqlqueryname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_SQLQUERY", "dataField": "ssqlquery", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_CHARTTYPE", "dataField": "ncharttypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

            ]
        }
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        const breadCrumbData = this.state.filterData || [];

        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* Start of get display*/}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={this.props.Login.masterData}
                                screenName={this.props.intl.formatMessage({ id: "IDS_SQLBUILDER" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.SQLQuery}
                                getMasterDetail={(sqlQuery) => this.props.getSQLQueryDetail(sqlQuery, userInfo, masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedSQLQuery}
                                primaryKeyField="nsqlquerycode"
                                mainField="ssqlqueryname"
                                firstField="squerytypename"
                                secondField={this.state.selectedcombo["nquerytypecode"] && this.state.selectedcombo["nquerytypecode"].value === queryTypeFilter.LIMSDASHBOARDQUERY ? "schartname" : ""}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                openModal={() => this.props.getSQLQueryComboService("", "create", "nsqlquerycode", null,
                                    this.props.Login.masterData, this.props.Login.userInfo,
                                    this.props.Login.masterData.SelectedQueryType.nquerytypecode,
                                    //this.state.selectedcombo["nquerytypecode"].value, 
                                    addId)} //{() => this.props.addTest("create", selectedTest, userInfo, addId, this.state.nfilterTestCategory)}
                                needAccordianFilter={false}
                                // skip={this.state.skip}
                                // take={this.state.take}
                                handlePageChange={this.handlePageChange}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showBuildQuery={false}
                                builderData={this.getDatabaseTables}
                                filterComponent={[
                                    {
                                        "IDS_QUERYTYPEFILTER":
                                            <QueryTypeFilter
                                                queryType={this.state.queryType || []}//{this.props.Login.masterData.QueryType || []}
                                                selectedRecord={this.state.selectedcombo || {}}
                                                onComboChange={this.onComboChange}
                                                filterQueryType={this.props.Login.masterData.SelectedQueryType}
                                            />
                                    }
                                ]}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            <Row>
                                <Col md={12}>
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {this.props.Login.masterData.SQLQuery && this.props.Login.masterData.SQLQuery.length > 0 && this.props.Login.masterData.SelectedSQLQuery && Object.values(this.props.Login.masterData.SelectedSQLQuery).length > 0 ?
                                                <>
                                                    <Card.Header>
                                                        <Card.Title className="product-title-main">
                                                            {this.props.Login.masterData.SelectedSQLQuery.ssqlqueryname}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category">
                                                                <h2 className="product-title-sub flex-grow-1">
                                                                    <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                                                                        <FormattedMessage id={this.props.Login.masterData.SelectedSQLQuery.squerytypename} />
                                                                    </span>
                                                                </h2>
                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                                <div className="d-inline">
                                                                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="editsqlqueryname"
                                                                        hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                        onClick={() => this.getValidationForEdit(this.state.queryTypeName,
                                                                            "update", "nsqlquerycode",
                                                                            this.props.Login.masterData.SelectedSQLQuery.nsqlquerycode,
                                                                            this.props.Login.masterData, this.props.Login.userInfo,
                                                                            //this.state.selectedcombo["nquerytypecode"].value, 
                                                                            this.props.Login.masterData.SelectedQueryType.nquerytypecode,
                                                                            editId)}
                                                                    //    data-for="tooltip_list_wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}>

                                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                                    </Nav.Link>
                                                                    {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="buildquery"
                                                                        // hidden={this.state.userRoleControlRights.indexOf(executeId) === -1}
                                                                        onClick={() => this.getDatabaseTables()}
                                                                        data-for="tooltip_list_wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BUILDQUERY" })}>
                                                                        <FontAwesomeIcon icon={faDatabase} />
                                                                    </Nav.Link> */}
                                                                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletesqlqueryname"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                     //   data-for="tooltip_list_wrap"
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        onClick={() => this.ConfirmDelete(deleteId)}>
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </Nav.Link>
                                                                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="executequery"
                                                                        hidden={this.state.userRoleControlRights.indexOf(executeId) === -1}
                                                                        onClick={() => this.executeQuery("SQLQuery", this.props.Login.masterData.SelectedSQLQuery, "execute", executeId)}
                                                                    //    data-for="tooltip_list_wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXECUTEQUERY" })}>
                                                                        <FontAwesomeIcon icon={faTasks} />
                                                                    </Nav.Link>
                                                                </div>
                                                            </div>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            {this.props.Login.masterData.SelectedSQLQuery.nquerytypecode === queryTypeFilter.LIMSALERTQUERY &&
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SCREENHEADER" })}</FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedSQLQuery.sscreenheader}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                            }
                                                            {this.props.Login.masterData.SelectedSQLQuery.nquerytypecode === queryTypeFilter.LIMSFILTERQUERY &&
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SVALUEMEMBER" })}</FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedSQLQuery.svaluemember}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                            }
                                                            {this.props.Login.masterData.SelectedSQLQuery.nquerytypecode === queryTypeFilter.LIMSFILTERQUERY &&
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SDISPLAYMEMBER" })}</FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedSQLQuery.sdisplaymember}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                            }
                                                            <Col md="12">
                                                                <FormGroup>
                                                                    <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SQLQUERY" })}</FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedSQLQuery.ssqlquery}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </>
                                                : ""
                                            }
                                        </Card>
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ListWrapper>
                {/* </div> */}
                {/* End of get display */}
                {/* {console.log(this.filtersearchRef)}
                {console.log("search",this.searchRef)} */}
                {
                    this.props.Login.openPortalModal &&
                    <PortalModalSlideout
                        show={this.props.Login.openPortalModal}
                        noSave={true}
                        closeModal={this.closePortalModal}
                        screenName={this.props.Login.screenName}
                        addComponent={
                            <SqlBuilderNewDesign
                            tableName={this.props.Login.tableName || []}
                            tableList={this.props.Login.tableList||[]}
                            filtersearchRef={this.filtersearchRef}
                            />
                        }
                    />
                }
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        //size={this.props.Login.parentPopUpSize}
                        size={this.props.Login.loadEsign ? "lg" : "xl"}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        onExecuteClick={this.onExecuteClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showExecute={this.props.Login.showExecute}
                        showParam={this.props.Login.showParam}
                        noSave={this.props.Login.noSave}
                        showValidate={this.props.Login.showValidate}
                        showQueryTool={this.props.Login.showQueryTool}
                        queryGenrate={this.queryGenrate}
                        //graphView={this.props.Login.graphView}
                        showSave={this.props.Login.showSave}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === "Parameter for Results" ? [] : mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : (this.props.Login.screenName === "Parameter for Results" || this.props.Login.screenName === "Results") && this.props.Login.showParam ?
                                <AddParameter
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.handleText}
                                    onComboChange={this.upDateComboboxValue}
                                    onChange={this.handleDateChange}
                                    //parameters={this.state.parameters || []}
                                    parameters={this.state.param || new Map()}
                                    queryTypeCode={this.props.Login.masterData.SelectedQueryType.nquerytypecode}
                                    // queryTypeCode={this.state.selectedcombo["nquerytypecode"].value}
                                    sscreenheader={this.props.Login.masterData.SelectedSQLQuery === null ? "" : this.props.Login.masterData.SelectedSQLQuery.sscreenheader}
                                    slideResult={this.props.Login.slideResult}
                                    slideList={this.props.Login.slideList}
                                    resultStatus={this.props.Login.resultStatus}
                                    dataStateUserQuery={this.state.dataStateUserQuery}
                                    userQueryDataStateChange={this.userQueryDataStateChange}
                                    controlMap={this.state.controlMap}
                                />

                                :
                                <AddQuery
                                    selectedRecord={this.state.selectedRecord || {}}
                                    selectedTableType={this.state.selectedTableType || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    chartList={this.state.chartList || []}
                                    tableList={this.props.Login.tableList || []}
                                    tableName={this.props.Login.tableName || []}
                                    //tableList={}
                                    tableType={this.state.tableType || []}
                                    moduleFormName={this.state.moduleFormName || []}
                                    tableTypeCode={this.state.selectedTableType["ntabletypecode"] ? this.state.selectedTableType["ntabletypecode"].value : 0}
                                    // onColumnNameDrop={this.onColumnNameDrop}
                                    onDrop={this.onDrop.bind(this)}
                                    //queryTypeCode={this.state.selectedcombo["nquerytypecode"].value}
                                    queryTypeCode={this.props.Login.masterData.SelectedQueryType.nquerytypecode}
                                />
                        }

                    />
                }
{/* {console.log(this.props.Login.openPortalModal)} */}
               

            </>
        );
    }

    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.generateFilterQuery(selectedRecord);
    }

    onViewComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {}; 
        selectedRecord[fieldName] = comboData;
        const inputParam = {
            sviewname: comboData.value,
            selectedRecord,
            userinfo: this.props.Login.userInfo
        }
        this.props.getViewColumns(inputParam);
    }

    onRuleChange = (comboData, fieldName, index) => {
        const { selectedRecord } = this.state;
        this.clearSelectedRule(selectedRecord, index);
        const sqlQuery = this.props.Login.sqlQuery;
        const oldselectedRecord = selectedRecord;
        selectedRecord[fieldName] = comboData;
        const tableData = comboData.items;
        const mastertablename = tableData.mastertablename;    

        if(comboData.items.needmasterdata && mastertablename) {
            const inputParam = {
                userinfo: this.props.Login.userInfo,
                data: {
                    nflag: 2,
                    mastertablename,
                    valuemember: tableData.valuemember,
                    displaymember: tableData.displaymember,
                },
                selectedRecord, 
                index,
                optionId: tableData.valuemember
            };
            this.props.getMasterData(inputParam);
        } else if(comboData.items && comboData.items.columntype === ColumnType.COMBO) {
            if(sqlQuery) {
                const inputParam = {
                    userinfo: this.props.Login.userInfo,
                    stablename: comboData.items.foriegntablename,
                    scolumnname: comboData.value,
                    selectedRecord, 
                    index
                };
                this.props.getForeignTable(inputParam, 'column');
            } else {
                selectedRecord[`${comboData.items.sforeigncolumnname}_${index}`] = "";
                const inputParam = {
                    data: { ...comboData.items, nflag: 1 },
                    userinfo: this.props.Login.userInfo,
                    selectedRecord,
                    index,
                    optionId: comboData.items.sforeigncolumnname
                };
                this.props.getMasterData(inputParam);
            }
        } else if(comboData.items && comboData.items.columntype === ColumnType.TEXTINPUT 
            && oldselectedRecord[fieldName].items.columntype !== ColumnType.TEXTINPUT ) {
            selectedRecord["sinputname_"+index] = "";
            this.setState({ selectedRecord });
        } else {
            this.setState({ selectedRecord });
        }
    }

    onMasterDataChange = (comboData, fieldName) => {
        const { selectedRecord } = this.state;
        selectedRecord[fieldName] = comboData;
        this.generateFilterQuery(selectedRecord);
    }

    addRule = (type) => {
        const { selectedRecord } = this.state; 
        if(type === "sql") {
            let addRuleList = this.props.Login.addRuleList || [];
            if(addRuleList.length > 0) {
                const arrayLength = addRuleList.length;
                addRuleList[arrayLength] = arrayLength;
                selectedRecord["button_and_"+arrayLength] = true;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        addRuleList, 
                        selectedRecord
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                addRuleList[0] = 0;
                this.props.getDatabaseTables(this.props.Login.userInfo, this.props.Login.sqlQuery, {addRuleList, selectedRecord: {}});
            }
        } else {
            if(selectedRecord["sviewname"]) {
                const viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
                const addRuleList = this.props.Login.addRuleList || [];
                const arrayLength = addRuleList.length;
                addRuleList[arrayLength] = arrayLength;
                viewColumnListByRule[arrayLength] = this.props.Login.viewColumnList;
                if(arrayLength !== 0) {
                    selectedRecord["button_and_"+arrayLength] = true;
                }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        addRuleList, 
                        viewColumnListByRule, 
                        selectedRecord
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEW" }));
            }
        }
    }

    getDatabaseTables = () => {
        const sqlQuery = false;
        this.props.getDatabaseTables(this.props.Login.userInfo, sqlQuery, {addRuleList: []});
    }

    closePortalModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openPortalModal: false,openModal:true, addRuleList: [], count: 0
            }
        }
        this.props.updateStore(updateInfo);
    }

    onExecuteRule = () => {
        const { selectedRecord } = this.state;
        if(selectedRecord["sgeneratedquery"]) {
            const inputParam = {
                sgeneratedquery: selectedRecord["sgeneratedquery"],
                selectedRecord,
                userInfo: this.props.Login.userInfo
            }
            this.props.executeQuery(inputParam);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_QUERYNOTAVAILABLE" }));
        }       
    }

    deleteRule = (index) => {
        let addRuleList = this.props.Login.addRuleList;
        const selectedRecord = this.state.selectedRecord;
        addRuleList[index] = -1;
        selectedRecord[`button_and_${index}`] && delete selectedRecord[`button_and_${index}`];
        selectedRecord[`button_or_${index}`] && delete selectedRecord[`button_or_${index}`];
        this.clearSelectedRule(selectedRecord, index);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { addRuleList, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    clearSelectedRule(selectedRecord, index) {
        selectedRecord["sinputname_"+index] && delete selectedRecord["sinputname_"+index];
        selectedRecord["ssymbolname_"+index] && delete selectedRecord["ssymbolname_"+index];
        selectedRecord["snumericinput_"+index] && delete selectedRecord["snumericinput_"+index];
        selectedRecord["columnname_"+index] && delete selectedRecord["columnname_"+index];
        selectedRecord["snumericinputtwo_"+index] && delete selectedRecord["snumericinputtwo_"+index];
        selectedRecord["dateinput_"+index] && delete selectedRecord["dateinput_"+index];
        selectedRecord["dateinputtwo_"+index] && delete selectedRecord["dateinputtwo_"+index];
    }

    clearRule = () => {
        const sviewname = this.state.selectedRecord.sviewname || "";
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { addRuleList: [], selectedRecord: { sviewname }, sqlQuery: false }
        }
        this.props.updateStore(updateInfo);
    }

    resetRule = () => {
        const sviewname = this.state.selectedRecord.sviewname || "";
        this.setState({ selectedRecord: { sviewname } });
    }
    
    onSymbolChange = (comboData, fieldName, index) => {
        const { selectedRecord } = this.state;
        const oldSelectedRecord = selectedRecord[fieldName] || {};
        selectedRecord[fieldName] = comboData;
        const items = selectedRecord["columnname_"+index].items;
        selectedRecord["columnname_"+index]["items"]["needmasterdata"] = items.needmasterdata? comboData.items.needmasterdata: false;
        if(comboData.items.symbolType === 2 || comboData.items.symbolType === 3) {
            selectedRecord[items["valuemember"]+"_"+index] && delete selectedRecord[items["valuemember"]+"_"+index];
            selectedRecord[items["foreigncolumnname"]+"_"+index] && delete selectedRecord[items["foreigncolumnname"]+"_"+index];
            selectedRecord["sinputname_"+index] && delete selectedRecord["sinputname_"+index];
        } else if(comboData.items.symbolType === 5 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType !== 5) {
            selectedRecord["snumericinput_"+index] && delete selectedRecord["snumericinput_"+index];
            selectedRecord["snumericinputtwo_"+index] && delete selectedRecord["snumericinputtwo_"+index];
        } else if((comboData.items.symbolType === 6 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType === 1)
            || (comboData.items.symbolType === 1 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType === 6)){
            selectedRecord[`${items.sforeigncolumnname}_${index}`] && delete selectedRecord[`${items.sforeigncolumnname}_${index}`];
            selectedRecord[`${items.valuemember}_${index}`] && delete selectedRecord[`${items.valuemember}_${index}`];
        } else {
           
        }
        this.generateFilterQuery(selectedRecord);
    }

    // addJoinTable = (index) => {
    //     const { foreignTableCount, foreignTableList } = this.state;
    //     if(foreignTableList.length > 0) {
    //         const tempCount = foreignTableCount[index]? foreignTableCount[index]: 1;
    //         foreignTableCount[index] = tempCount + 1;
    //         this.setState({ foreignTableCount });
    //     }
    // }

    // onForeignTableChange = (comboData, fieldName, index) => {
    //     const { selectedRecord, selectedforeignTableList, foreignTableColumnList } = this.state;
    //     selectedforeignTableList[index] = {
    //         "tablename": comboData.value,
    //         "tablevalue": `"${comboData.value}"."${comboData.items.columnname}"`
    //     };
    //     selectedRecord[fieldName] = comboData;
    //     // let foreignTableColumnList = [];
    //     foreignTableColumnList[index] = this.props.Login.allTableColumnList.filter(x => x.tablename === comboData.value);
    //     selectedRecord[fieldName] = comboData;
    //     selectedRecord["foreigncolumnname"] = [];
    //     this.setState({ selectedRecord, selectedforeignTableList, foreignTableColumnList });
    // }

    onInputChange = (event, type) => {
        let selectedRecord = this.state.selectedRecord;       
        if(type === 2) {
            const inputValue = event.target.value;
            if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
                selectedRecord[event.target.name] = event.target.value;
            }
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.generateFilterQuery(selectedRecord);
    }

    generateFilterQuery = (selectedRecord) => {
        const addRuleList = this.props.Login.addRuleList;
      //  jsonSql.setDialect('mssql');
        let databaseCondition = [];
        let displayCondition = [];
        if(addRuleList.length > 0) {
            let orDisplayConditionArray = [];
            let orConditionArray = [];
            addRuleList.forEach(index => {
                let symbolObject = {};
                if(selectedRecord["columnname_"+index]) {
                    symbolObject = selectedRecord["ssymbolname_"+index].items || {};
                
                    const current_button_and = selectedRecord[`button_and_${index}`];
                    const current_button_or = selectedRecord[`button_or_${index}`];
                    const next_button_and = selectedRecord[`button_and_${index+1}`];
                    const next_button_or = selectedRecord[`button_or_${index+1}`]? selectedRecord[`button_or_${index+1}`]:false;

                    let inputname = selectedRecord["sinputname_"+index];
                    const symbolname = symbolObject.symbol;
                    let numericinput = selectedRecord["snumericinput_"+index];
                    const columnLabel = selectedRecord["columnname_"+index].label;
                    const columnValue = selectedRecord["columnname_"+index].value;
                    const snumericinputtwo = selectedRecord["snumericinputtwo_"+index];
                    let columnName = undefined;
                    const needmasterdata = selectedRecord["columnname_"+index].items.needmasterdata? 
                        selectedRecord["columnname_"+index].items.needmasterdata: false;

                    if(selectedRecord["columnname_"+index].items.needmasterdata) {
                        columnName = selectedRecord["columnname_"+index].items.valuemember+"_"+index;
                    } else if(selectedRecord["columnname_"+index].items.sforeigncolumnname) {
                        columnName = selectedRecord["columnname_"+index].items.sforeigncolumnname+"_"+index;
                    }
                    const dateinput = selectedRecord["dateinput_"+index];
                    const dateinputtwo = selectedRecord["dateinputtwo_"+index];

                    if(current_button_or || next_button_or || (current_button_and && next_button_or)) {
                        if(symbolObject && inputname) {
                            if(symbolObject.symbolType === 4) {
                                const index = symbolObject.replacewith.indexOf('_'); 
                                inputname = symbolObject.replacewith.substr(0, index) + inputname + symbolObject.replacewith.substr(index+1);
                                orConditionArray.push({[columnValue]: { [symbolname]: inputname} });
                                orDisplayConditionArray.push({[columnLabel]: { [symbolname]: inputname} });
                            } else {
                                orConditionArray.push({[columnValue]: { [symbolname]: inputname} });
                                orDisplayConditionArray.push({[columnLabel]: { [symbolname]: inputname} });
                            }
                        } else if(symbolObject && numericinput && symbolObject.symbolType !== 5) {
                            orConditionArray.push({[columnValue]: { [symbolname]: numericinput} });
                            orDisplayConditionArray.push({[columnLabel]: { [symbolname]: numericinput} });
                        } else if(symbolObject && symbolObject.symbolType === 2
                            || symbolObject && symbolObject.symbolType === 3) {
                            orConditionArray.push({[columnValue]: { [symbolname]: ''} });
                            orDisplayConditionArray.push({[columnLabel]: { [symbolname]: ''} });
                        } 
                        else if(symbolObject && numericinput && snumericinputtwo && symbolObject.symbolType === 5) {
                            if(symbolObject.symbol === "") {
                                const tempValue =  [{[columnValue]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: snumericinputtwo} }];
                                const tempValue1 =  [{ [columnLabel]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: snumericinputtwo} }];
                                orConditionArray.push(tempValue);
                                orDisplayConditionArray.push(tempValue1);
                            } else {
                                const tempValue =  [ 
                                    {[symbolObject.symbol]: [{[columnValue]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: snumericinputtwo} }]}
                                ];
                                const tempValue1 =  [ 
                                    {[symbolObject.symbol]: [{ [columnLabel]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: snumericinputtwo} }]}
                                ];
                                orConditionArray.push(tempValue);
                                orDisplayConditionArray.push(tempValue1);
                            }
                        } else if(symbolObject && symbolObject.symbolType === 6 && columnName && selectedRecord[columnName]) {
                            // if(typeof selectedRecord[columnName] === "object") {
                            //     orConditionArray.push({[columnValue]: { [symbolname]: [selectedRecord[columnName].value]} });
                            //     orDisplayConditionArray.push({[columnLabel]: { [symbolname]: [selectedRecord[columnName].label]} });
                            // } else {
                                const data = selectedRecord[columnName] && selectedRecord[columnName].map(item=>{return item.value}) || [];
                                const data1 = selectedRecord[columnName] && selectedRecord[columnName].map(item=>{return item.label}) || [];
                                if(data.length > 0) {
                                    if(needmasterdata) {
                                        orConditionArray.push({[selectedRecord["columnname_"+index].items.valuemember]: {[symbolname]: data}});
                                    } else {
                                        orConditionArray.push({[columnValue]: {[symbolname]: data}});
                                    }
                                }
                                if(data1.length > 0) {
                                    orDisplayConditionArray.push({[columnLabel]: {[symbolname]: data1}});
                                }
                            // }
                        } else if(symbolObject && columnName && symbolObject.isInputVisible && selectedRecord[columnName]) {
                            if(needmasterdata) {
                                orConditionArray.push({[selectedRecord["columnname_"+index].items.valuemember]: { [symbolname]: selectedRecord[columnName].value} });
                                orDisplayConditionArray.push({[columnLabel]: { [symbolname]: selectedRecord[columnName].label} });
                            } else {
                                orConditionArray.push({[columnValue]: { [symbolname]: selectedRecord[columnName].value} });
                                orDisplayConditionArray.push({[columnLabel]: { [symbolname]: selectedRecord[columnName].label} });
                            }
                        }  else if(symbolObject && dateinput && symbolObject.symbolType !== 5) {
                            orConditionArray.push({[columnValue]: { [symbolname]: dateinput } });
                            orDisplayConditionArray.push({[columnLabel]: { [symbolname]: dateinput } });
                        } else if(symbolObject && dateinput && dateinputtwo && symbolObject.symbolType === 5) {
                            if(symbolObject.symbol === "") {
                                const tempValue = [{[columnValue]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: dateinputtwo} }];
                                const tempValue1 =  [{ [columnLabel]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: dateinputtwo} }];
                                orConditionArray.push(tempValue);
                                orDisplayConditionArray.push(tempValue1);
                            } else {
                                const tempValue =  [ 
                                    {[symbolObject.symbol]: [{[columnValue]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: dateinputtwo} }]}
                                ];
                                const tempValue1 =  [ 
                                    {[symbolObject.symbol]: [{ [columnLabel]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: dateinputtwo} }]}
                                ];
                                orConditionArray.push(tempValue);
                                orDisplayConditionArray.push(tempValue1);
                            }
                        }
                    } else {
                        if(symbolObject && inputname) {
                            if(symbolObject.symbolType === 4) {
                                const index = symbolObject.replacewith.indexOf('_'); 
                                inputname = symbolObject.replacewith.substr(0, index) + inputname + symbolObject.replacewith.substr(index+1);
                                databaseCondition.push({[columnValue]: { [symbolname]: inputname} });
                                displayCondition.push({[columnLabel]: { [symbolname]: inputname} });
                            } else {
                                databaseCondition.push({[columnValue]: { [symbolname]: inputname} });
                                displayCondition.push({[columnLabel]: { [symbolname]: inputname} });
                            }
                        } else if(symbolObject && numericinput && symbolObject.symbolType !== 5) {
                            databaseCondition.push({[columnValue]: { [symbolname]: numericinput} });
                            displayCondition.push({[columnLabel]: { [symbolname]: numericinput} });
                        } else if(symbolObject && symbolObject.symbolType === 2
                            || symbolObject && symbolObject.symbolType === 3) {
                            databaseCondition.push({[columnValue]: { [symbolname]: ''} });
                            displayCondition.push({[columnLabel]: { [symbolname]: ''} });
                        } else if(symbolObject && numericinput && snumericinputtwo && symbolObject.symbolType === 5) {
                            if(symbolObject.symbol === "") {
                                const tempValue = [{[columnValue]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: snumericinputtwo} }];
                                const tempValue1 =  [{ [columnLabel]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: snumericinputtwo} }];
                                databaseCondition.push(tempValue);
                                displayCondition.push(tempValue1);
                            } else {
                                const tempValue =  [ 
                                    {[symbolObject.symbol]: [{[columnValue]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: snumericinputtwo} }]}
                                ];
                                const tempValue1 =  [ 
                                    {[symbolObject.symbol]: [{ [columnLabel]: {[symbolObject.replacewith[0]]: +numericinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: snumericinputtwo} }]}
                                ];
                                databaseCondition.push(tempValue);
                                displayCondition.push(tempValue1);
                            }
                        } else if(symbolObject && symbolObject.symbolType === 6 && columnName && selectedRecord[columnName]) {
                            // if(typeof selectedRecord[columnName] === "object") {
                            //     databaseCondition.push({[columnValue]: { [symbolname]: [selectedRecord[columnName].value]} });
                            //     displayCondition.push({[columnLabel]: { [symbolname]: [selectedRecord[columnName].label]} });
                            // } else {
                                const data = selectedRecord[columnName] && selectedRecord[columnName].map(item=>{return item.value}) || [];
                                const data1 = selectedRecord[columnName] && selectedRecord[columnName].map(item=>{return item.label}) || [];
                                if(data.length > 0) {
                                    if(needmasterdata) {
                                        databaseCondition.push({[selectedRecord["columnname_"+index].items.valuemember]: {[symbolname]: data}});
                                    } else {
                                        databaseCondition.push({[columnValue]: {[symbolname]: data}});
                                    }
                                }
                                if(data1.length > 0) {
                                    displayCondition.push({[columnLabel]: {[symbolname]: data1}});
                                }
                            // }
                        } else if(symbolObject && columnName && symbolObject.isInputVisible && selectedRecord[columnName]) {
                            if(needmasterdata) {
                                databaseCondition.push({[selectedRecord["columnname_"+index].items.valuemember]: { [symbolname]: selectedRecord[columnName].value} });
                                displayCondition.push({[columnLabel]: { [symbolname]: selectedRecord[columnName].label} });
                            } else {
                                databaseCondition.push({[columnValue]: { [symbolname]: selectedRecord[columnName].value} });
                                displayCondition.push({[columnLabel]: { [symbolname]: selectedRecord[columnName].label} });
                            }
                        } else if(symbolObject && dateinput && symbolObject.symbolType !== 5) {
                            databaseCondition.push({[columnValue]: { [symbolname]: dateinput } });
                            displayCondition.push({[columnLabel]: { [symbolname]: dateinput } });
                        } else if(symbolObject && dateinput && dateinputtwo && symbolObject.symbolType === 5) {
                            if(symbolObject.symbol === "") {
                                const tempValue = [{[columnValue]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: dateinputtwo} }];
                                const tempValue1 =  [{ [columnLabel]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: dateinputtwo} }];
                                databaseCondition.push(tempValue);
                                displayCondition.push(tempValue1);
                            } else {
                                const tempValue =  [ 
                                    {[symbolObject.symbol]: [{[columnValue]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                    { [columnValue]: {[symbolObject.replacewith[1]]: dateinputtwo} }]}
                                ];
                                const tempValue1 =  [ 
                                    {[symbolObject.symbol]: [{ [columnLabel]: {[symbolObject.replacewith[0]]: dateinput} }, 
                                        { [columnLabel]: {[symbolObject.replacewith[1]]: dateinputtwo} }]}
                                ];
                                databaseCondition.push(tempValue);
                                displayCondition.push(tempValue1);
                            }
                        }
                    }
                    

                    if(current_button_or 
                        && (next_button_and || typeof next_button_and === 'undefined') 
                        || typeof next_button_or === 'undefined') {
                        if(orConditionArray.length > 0) {
                            databaseCondition.push({$or: orConditionArray});
                            orConditionArray = [];
                        } 
                        if(orDisplayConditionArray.length > 0) {
                            displayCondition.push({$or: orDisplayConditionArray});
                            orDisplayConditionArray = [];
                        }
                    }

                    if(this.props.Login.sqlQuery) {
                        // const databaseSQLQuery = jsonSql.build({
                        //     type: 'select',
                        //     table: selectedRecord["stablename_0"].value,
                        //     condition: databaseCondition
                        // });
                    //     const displaySQLQuery = jsonSql.build({
                    //         type: 'select',
                    //         table: selectedRecord["stablename_0"].label,
                    //         condition: displayCondition
                    //     });
                    //     selectedRecord["sgeneratedquery"] = databaseSQLQuery.query;
                    //     selectedRecord["sdisplayquery"] = displaySQLQuery.query;
                    // } else {
                    //     const databaseSQLQuery = jsonSql.build({
                    //         type: 'select',
                    //         table: selectedRecord["sviewname"].value,
                    //         condition: databaseCondition
                    //     });
                    //     const displaySQLQuery = jsonSql.build({
                    //         type: 'select',
                    //         table: selectedRecord["sviewname"].label,
                    //         condition: displayCondition
                    //     });
                        // jsonSql = jsonSql.setSeparatedValues(true);
                        // selectedRecord["sgeneratedquery"] = databaseSQLQuery.query;
                        // selectedRecord["sdisplayquery"] = displaySQLQuery.query;
                    }                    
                    this.setState({ selectedRecord });
                } else {

                }
            });
        }
       
    }
    
    onConditionClick = (fieldName, index) => {
        let { selectedRecord } = this.state;
        if(fieldName === `button_and_${index}`) {
            selectedRecord[fieldName] = selectedRecord[fieldName]===true? false:true;
            selectedRecord[`button_or_${index}`] = false;
        } else if(fieldName === `button_or_${index}`) {
            selectedRecord[fieldName] = selectedRecord[fieldName]===true? false:true;
            selectedRecord[`button_and_${index}`] = false;
        } else {

        }
        this.generateFilterQuery(selectedRecord);
    }

    onQueryTypeOnclick = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { sqlQuery: !this.state.sqlQuery }
        }
        this.props.updateStore(updateInfo);
    }

    getValidationForEdit = (screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, queryTypeCode, ncontrolCode) => {
        rsapi().post("sqlquery/getValidationForEdit", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo })
            .then(response => {
                if (response.data === "IDS_SUCCESS") {
                    this.props.getSQLQueryComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, queryTypeCode, ncontrolCode)
                }
                else if (response.data === "IDS_QUERYUSEDINDASHBOARD") {
                    this.confirmAlertForEdit(ncontrolCode)
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: response.data }));
                }
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (error.response.status === 500) {
                    toast.error(this.props.intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response.data }));
                }
            })
    }

    confirmAlertForEdit = (editId) => {
        this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
            this.props.intl.formatMessage({ id: "IDS_QUERYUSEDINDASHBOARD" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            // () => this.performBatchAction(), 
            () => this.props.getSQLQueryComboService(this.state.queryTypeName,
                "update", "nsqlquerycode",
                this.props.Login.masterData.SelectedSQLQuery.nsqlquerycode,
                this.props.Login.masterData, this.props.Login.userInfo,
                //this.state.selectedcombo["nquerytypecode"].value, 
                this.props.Login.masterData.SelectedQueryType.nquerytypecode, editId),
            undefined,
            () => this.closeAlert()
        );
    }

    closeAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlertForEdit: false }
        }
        this.props.updateStore(updateInfo);
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {

        this.searchRef.current.value = "";
        //    const inputParam = {
        //        inputData: { "userinfo": this.props.Login.userInfo, 
        //                    nquerytypecode:this.state.selectedRecord["nquerytypecode"] ? 
        //                                   this.state.selectedRecord["nquerytypecode"].value : 0
        //                 },        
        //        userInfo: this.props.Login.userInfo,
        //        classUrl: "sqlquery",
        //        methodUrl: "SQLQuery",
        //        displayName: "IDS_SQLBUILDER",
        //    };
        //this.props.callService(inputParam);
        const nquerytypecode = this.state.selectedRecord["nquerytypecode"] ?
            this.state.selectedRecord["nquerytypecode"].value : this.props.Login.masterData.SelectedQueryType.nquerytypecode;

        this.props.comboChangeQueryType(nquerytypecode, this.props.Login.masterData, this.props.Login.userInfo);


    }

    handlePageChange = (event) => {
        this.setState({
            skip: event.skip,
            take: event.take
        });
    }

    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            if (fieldName === "ncharttypecode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;

                this.setState({ selectedRecord });
            }

            if (fieldName === "ntabletypecode" || fieldName === "nformcode") {
                const selectedTableType = this.state.selectedTableType || {};
                selectedTableType[fieldName] = comboData;

                this.setState({ selectedTableType });
                const selectedRecord = this.state.selectedRecord || {};
                //  this.state.ntableTypeCode=comboData.value;
                if (fieldName === "ntabletypecode") {
                    if (comboData.value === tableType.ALL) {
                        selectedRecord["nformcode"] = "";
                        this.props.getTablesName(selectedTableType["ntabletypecode"].value, 0,this.props.Login.userInfo)
                    }
                    else {
                        const updateInfor = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                tableName: []
                            }
                        }
                        this.props.updateStore(updateInfor);
                        this.setState({ moduleFormName: [] })
                        selectedRecord["nformcode"] = "";
                        this.props.getModuleFormName(comboData.value, this.props.Login.userInfo)
                    }

                }
                if (fieldName === "nformcode") {

                    selectedRecord[fieldName] = comboData;

                    this.setState({ selectedRecord });
                    //this.state.nFormCode=comboData.value;
                    //this.getTablesName(selectedRecord["ntabletypecode"].value ,selectedRecord["nformcode"].value)
                    this.props.getTablesName(selectedTableType["ntabletypecode"].value, selectedRecord["nformcode"].value,this.props.Login.userInfo)
                }
            }
            else {
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;

                this.setState({ selectedcombo });
            }
            if (fieldName === "nquerytypecode") {
                this.searchRef.current.value = "";
                // this.props.comboChangeQueryType(comboData.value, this.props.Login.masterData, this.props.Login.userInfo);
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord: selectedRecord }
                }
                this.props.updateStore(updateInfo);
            }
        }

    }

    getTablesName(selectedRecord) {
        return function (dispatch) {
            const url = "sqlquery/getTablesFromSchema";

            rsapi().post(url, { "tabletypecode": parseInt(selectedRecord["ntabletypecode"].value), "moduleformcode": parseInt(selectedRecord["nformcode"].value), "userinfo": this.props.Login.userInfo })
                .then(response => {

                    let tableName = undefined;
                    let tableNameOnly = [];
                    Object.values(response[1].data[0]).forEach(p => {
                        if (p.stable !== tableName) {
                            tableName = p.stable;
                            tableNameOnly.push({ tableName });
                        }
                    })

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            tableList: response[0].data[0] || [],
                            tableName: tableNameOnly || []

                        }
                    });
                    //this.setState({ tableList: response[0].data[0] || [], tableName: tableNameOnly || []})

                })
                .catch(error => {

                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                        }
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }

    getModuleFormName(TableTypeCode) {

        const url = "sqlquery/getModuleFormName";

        rsapi().post(url, { "tabletypecode": parseInt(TableTypeCode), "userinfo": this.props.Login.userInfo })
            .then(response => {
                this.setState({ moduleFormName: response.data[0] });
            })
            .catch(error => {

                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        // const selectedRecord = this.state.selectedRecord || {};
        let selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });

    }

    onNumericInputChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let showExecute = this.props.Login.showExecute;
        let showParam = this.props.Login.showParam;
        let showValidate = this.props.Login.showValidate;
        let showSave = this.props.Login.showSave;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let slideOperation = this.props.Login.slideOperation;
        let parentPopUpSize = this.props.Login.parentPopUpSize;
        let resultStatus = this.props.Login.resultStatus;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
                selectedRecord["agree"] = transactionStatus.NO;
                if (this.state.param.size > 0) {
                    showExecute = true;
                    showSave = true;
                }
                else {
                    showExecute = false;
                    showSave = false;
                }
                parentPopUpSize = "xl"
            }
        }
        else {
            if (this.props.Login.screenName === "Parameter for Results" || this.props.Login.screenName === "Results") {
                if (this.props.Login.screenFlag === "showQuery") {
                    openModal = true;

                    let queryTypeCode = this.props.Login.masterData.SelectedQueryType.nquerytypecode;
                    if (queryTypeCode === queryTypeFilter.LIMSDASHBOARDQUERY) {
                        screenName = this.props.intl.formatMessage({ id: "IDS_LIMSDASHBOARDQUERY" });
                    }
                    else if (queryTypeCode === queryTypeFilter.LIMSALERTQUERY) {
                        screenName = this.props.intl.formatMessage({ id: "IDS_LIMSALERTQUERY" });
                    }
                    else if (queryTypeCode === queryTypeFilter.LIMSBARCODEQUERY) {
                        screenName = this.props.intl.formatMessage({ id: "IDS_LIMSBARCODEQUERY" });
                    }
                    else if (queryTypeCode === queryTypeFilter.LIMSGENERALQUERY) {
                        screenName = this.props.intl.formatMessage({ id: "IDS_LIMSGENERALQUERY" });
                    }
                    else {
                        screenName = this.props.intl.formatMessage({ id: "IDS_LIMSFILTERQUERY" });
                    }
                    showSave = false;
                }
                else {
                    selectedRecord = {};
                    openModal = false;
                    showExecute = false;
                }

                showParam = false;
                showValidate = true;
                operation = slideOperation;
                slideOperation = "";
                resultStatus = "";
            }
            else {
                openModal = false;
                selectedRecord = {};
                showExecute = false;
            }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, showExecute,
                showParam, operation, screenName, showSave, showValidate,
                parentPopUpSize, resultStatus, showConfirmAlertForEdit: false
            }
        }
        this.props.updateStore(updateInfo);
    }

    upDateComboboxValue = i => Value => {
        if (Value != null) {

            // let parameters = [...this.state.parameters]
            // parameters[i].textValue = Value
            // this.setState({
            //     parameters: parameters
            // })

            const paramMap = this.state.param || new Map();
            paramMap.get(i).textValue = Value;
            this.setState({ param: paramMap })

        }
    }

    handleDateChange = i => date => {

        // let parameters = [...this.state.parameters]
        // parameters[i].Datetime = date

        // this.setState({
        //     parameters: parameters
        // })
        const paramMap = this.state.param || new Map();
        paramMap.get(i).Datetime = date;
        this.setState({ param: paramMap })
    }

    handleText = i => event => {
        //let parameters = [...this.state.parameters];
        //parameters[i].textValue = e.target.value;
        //this.setState({parameters: parameters});
        // console.log(parameters)
        const paramMap = this.state.param || new Map();
        paramMap.get(event.target.name).textValue = event.target.value;
        this.setState({ param: paramMap })

    }

    onDrop(data) {
        let { selectedRecord } = this.state;
        let sqlquery = selectedRecord.ssqlquery ? selectedRecord.ssqlquery : "";

        selectedRecord.ssqlquery = data.dragtable ? `${sqlquery} ${data.dragtable}` : `${sqlquery} ${data.dragcolumn}`
        this.setState({ selectedRecord });
    }

    executeQuery = (methodUrl, selectedRecord, operation, ncontrolCode) => {

        const sqlQuery = selectedRecord.ssqlquery;
        if (sqlQuery.length > 10) {
            if (sqlQuery.toUpperCase().indexOf('INSERT') >= 0
                || sqlQuery.toUpperCase().indexOf('UPDATE') >= 0
                || sqlQuery.toUpperCase().indexOf('DELETE') >= 0
                || sqlQuery.toUpperCase().indexOf('TRUNCATE') >= 0
                || sqlQuery.toUpperCase().indexOf('CREATE') >= 0
                || sqlQuery.toUpperCase().indexOf('ALTER') >= 0
                || sqlQuery.toUpperCase().indexOf('DROP') >= 0) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDATAMANIPULATION" }));
            }
            else {
                if (sqlQuery.indexOf('<@') > 0||sqlQuery.indexOf('<#') > 0) {
                    let newQuery = sqlQuery;

                    const paramMap = new Map();
                    while (newQuery.indexOf("<@") !== -1||newQuery.indexOf("<#")!== -1) {

                        if(newQuery.indexOf("<@") !== -1){
                            const paramLabelStartIndex = newQuery.indexOf("<@");
                            const paramLabelEndIndex = newQuery.indexOf("@>");
    
                            const paramLabel = newQuery.substring(paramLabelStartIndex + 2, paramLabelEndIndex);
    
                            if (paramLabel.indexOf("T$") !== -1) {
                                let displayName = "";
                                let localParam = "";
                                let tableName = "";
    
                                newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                if (paramLabel.indexOf("D$") !== -1) {
                                    localParam = paramLabel.substring(0, paramLabel.indexOf('D$'));
                                    displayName = paramLabel.substring(paramLabel.indexOf('D$') + 2, paramLabel.indexOf('T$'));
                                    //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                    tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                }
                                else {
                                    localParam = paramLabel.substring(0, paramLabel.indexOf('T$'));
                                    // tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                    tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                }
    
                                if (localParam.startsWith('d') || localParam.startsWith('D')) {
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'DateTimePicker',
                                        lableName: localParam,
                                        //ID: param.length, 
                                        Datetime: new Date(),
                                        textValue: '',
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    })
                                }
                                else if(paramLabel==='slanguagetypecode'){
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'TextBox1', lableName: localParam,
                                        //ID: param.length, 
                                        textValue: this.props.Login.userInfo.slanguagetypecode,
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    });
                                }
                                else {
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'TextBox1', lableName: localParam,
                                        //ID: param.length, 
                                        textValue: '',
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    });
                                }
                            }
                            else {
                                newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                if(paramLabel==='slanguagetypecode'){
                                    paramMap.set("<@" + paramLabel + "@>", {
                                        value: 'TextBox1', lableName: paramLabel,
                                        //ID: param.length, 
                                        textValue: this.props.Login.userInfo.slanguagetypecode,
                                        TableName: "",
                                        DisplayParam: "",
                                        actuallableName: paramLabel.substring(1, paramLabel.length)
                                    });
                                }
                                else {
                                    paramMap.set("<@" + paramLabel + "@>", {
                                        value: 'TextBox1', lableName: paramLabel,
                                        //ID: param.length, 
                                        textValue: '',
                                        TableName: "",
                                        DisplayParam: "",
                                        actuallableName: paramLabel.substring(1, paramLabel.length)
                                    });
                                }
                            }
                        }else if(newQuery.indexOf("<#")!== -1){
                            const paramLabelStartIndex = newQuery.indexOf("<#");
                            const paramLabelEndIndex = newQuery.indexOf("#>");
    
                            const paramLabel = newQuery.substring(paramLabelStartIndex + 2, paramLabelEndIndex);
    
                            if (paramLabel.indexOf("T$") !== -1) {
                                let displayName = "";
                                let localParam = "";
                                let tableName = "";
    
                                newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                if (paramLabel.indexOf("D$") !== -1) {
                                    localParam = paramLabel.substring(0, paramLabel.indexOf('D$'));
                                    displayName = paramLabel.substring(paramLabel.indexOf('D$') + 2, paramLabel.indexOf('T$'));
                                    //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                    tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                }
                                else {
                                    localParam = paramLabel.substring(0, paramLabel.indexOf('T$'));
                                    // tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                    tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                }
    
                                if (localParam.startsWith('d') || localParam.startsWith('D')) {
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'DateTimePicker',
                                        lableName: localParam,
                                        //ID: param.length, 
                                        Datetime: new Date(),
                                        textValue: '',
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    })
                                }
                                else if(paramLabel==='slanguagetypecode'){
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'TextBox1', lableName: localParam,
                                        //ID: param.length, 
                                        textValue: this.props.Login.userInfo.slanguagetypecode,
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    });
                                }
                                else {
                                    paramMap.set("P$" + localParam + "$P", {
                                        value: 'TextBox1', lableName: localParam,
                                        //ID: param.length, 
                                        textValue: '',
                                        TableName: tableName,
                                        DisplayParam: displayName,
                                        actuallableName: localParam.substring(1, localParam.length)
                                    });
                                }
                            }
                            else {
                                newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                    paramMap.set("<#" + paramLabel + "#>", {
                                        value: 'DateTimePicker',
                                        lableName: paramLabel,
                                        actuallableName: paramLabel.substring(1, paramLabel.length),
                                        //ID: param.length, 
                                        Datetime: new Date()
                                    }) 
                            }
                        }
                        
                    }

                   

                    const updateInfo = {
                        typeName: DEFAULT_RETURN, data: {

                            screenName: "Parameter for Results",
                            openModal: true,
                            showExecute: true,
                            showParam: true,
                            showValidate: false,
                            showSave: false,
                            operation: "create",
                            slideOperation: "",
                            slideResult: [],
                            slideList: [],
                            screenFlag: "showParam",
                            param: paramMap,
                            //param: param, Dparam: Dparam, TBLName: TBLName,
                            parentPopUpSize: "xl"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    //query without parameters      
                    const inputParam = {

                        query: selectedRecord.ssqlquery.trim(),
                        screenName: "Results",
                        openModal: true,
                        showExecute: false,
                        showParam: true,
                        showValidate: false,
                        showSave: false,
                        noSave: true,
                        operation: "view",
                        slideOperation: "",
                        slideResult: [],
                        slideList: [],
                        //screenFlag: "showParam",
                        screenFlag: "NoParam",
                        parentPopUpSize: "xl",

                        param: new Map(),
                        userInfo: this.props.Login.userInfo

                    }
                    this.props.executeUserQuery(inputParam);
                }

            }
        }
    }

    deleteRecord = (methodUrl, selectedRecord, operation, ncontrolCode) => {

        const postParam = {
            inputListName: "SQLQuery", selectedObject: "SelectedSQLQuery",
            primaryKeyField: "nsqlquerycode",
            primaryKeyValue: this.props.Login.masterData.SelectedSQLQuery.nsqlquerycode,
            fetchUrl: "sqlquery/getSQLQuery",
            fecthInputObject: { userInfo: this.props.Login.userInfo },
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl, postParam,
            inputData: {
                [methodUrl.toLowerCase()]: selectedRecord,
                "userinfo": this.props.Login.userInfo,
                "sqlquery": this.props.Login.masterData.SelectedSQLQuery
            },
            operation
        }

        const masterData = this.props.Login.masterData;


        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "sqlquery", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    onExecuteClick = () => {
        // let paramVal;
        let tempQuery = "";
        let paramFlag = true;
        const selectedRecord = this.state.selectedRecord || {};
        if (this.props.Login.screenName === "Parameter for Results" && this.state.param.size > 0) {
            if (selectedRecord != null && selectedRecord.ssqlquery != null && selectedRecord.ssqlquery.length > 0) {
                tempQuery = selectedRecord.ssqlquery;
            }
            else {
                tempQuery = this.props.Login.masterData.SelectedSQLQuery.ssqlquery;
            }

            const paramMap = this.state.param || new Map();
            for (let parameterMap of paramMap.entries()) {
                const parameter = parameterMap[0];
                const parameterDetail = parameterMap[1];
                let paramVal = "";
                //console.log("para detail:", parameterDetail);

                if (parameter.indexOf('<#')!==-1) {
                    if (parameterDetail.Datetime !== null) {
                        paramVal = parameterDetail.Datetime.getFullYear() + "-";
                        if (parameterDetail.Datetime.getMonth().toString().length > 1) {
                            paramVal = paramVal + parseInt(parameterDetail.Datetime.getMonth() + 1) + "-";
                        }
                        else if(parameterDetail.Datetime.getMonth()===9){
                            paramVal = paramVal + parseInt(parameterDetail.Datetime.getMonth() + 1) + "-";
                        }
                        else {
                            paramVal = paramVal + "0" + parseInt(parameterDetail.Datetime.getMonth() + 1) + "-";
                        }
                        if (parameterDetail.Datetime.getDate().toString().length > 1) {
                            paramVal = paramVal + parameterDetail.Datetime.getDate();
                        }
                        else {
                            paramVal = paramVal + "0" + parameterDetail.Datetime.getDate();
                        }
                    }
                    if (paramVal === undefined) {
                        paramFlag = false;
                        tempQuery = tempQuery.replaceAll(parameter, null);
                    }
                    else if (paramVal.trim().length > 0) {
                        //tempQuery = tempQuery.replace(parameter, "P#" + paramVal + "$P");
                        tempQuery = tempQuery.replaceAll(parameter, "'" + paramVal + "'");
                    }
                    else {
                        paramFlag = false;
                    }

                }
                else {
                    paramVal = parameterDetail.textValue;
                    if (paramVal !== "") {
                        if (parameter.indexOf('<@')!==-1) {

                            if (tempQuery.indexOf(parameterDetail.lableName.trim() + 'D$') > 0) {
                                tempQuery = tempQuery.replaceAll('P$' + parameterDetail.lableName.trim()
                                    + 'D$' + parameterDetail.DisplayParam
                                    + 'T$' + parameterDetail.TableName
                                    + '$P', "'" + paramVal + "'");
                            }
                            else if (tempQuery.indexOf(parameterDetail.lableName.trim() + 'T$') > 0) {
                                tempQuery = tempQuery.replaceAll('P$' + parameterDetail.lableName.trim()
                                    + 'T$' + parameterDetail.TableName
                                    + '$P', "'" + paramVal + "'");
                            }
                            else {
                                tempQuery = tempQuery.replaceAll(parameter, "'" + paramVal + "'");
                            }
                        }
                        else {
                            if (tempQuery.indexOf(parameterDetail.lableName.trim() + 'D$') > 0) {
                                tempQuery = tempQuery.replaceAll('P$' + parameterDetail.lableName.trim()
                                    + 'D$' + parameterDetail.DisplayParam.trim()
                                    + 'T$' + parameterDetail.TableName + '$P', paramVal);
                            }
                            else if (tempQuery.indexOf(parameterDetail.lableName.trim() + 'T$') > 0) {
                                tempQuery = tempQuery.replaceAll('P$' + parameterDetail.lableName.trim()
                                    + 'T$' + parameterDetail.TableName + '$P', paramVal);
                            }
                            else {
                                tempQuery = tempQuery.replaceAll(parameter, paramVal);
                            }
                        }
                    }
                    else {
                        paramFlag = false;
                    }
                }
            }

            if (paramFlag === true) {
                //console.log("temp:", tempQuery);
                const inputParam = {
                    slideOperation: this.props.Login.slideOperation,
                    screenFlag: this.props.Login.screenFlag,
                    query: tempQuery.trim(),
                    userInfo: this.props.Login.userInfo,
                    data: {}
                }
                this.props.executeUserQuery(inputParam);

                //this.props.executeUserQuery(tempQuery.trim(), this.props.Login.screenFlag, this.props.Login.slideOperation, this.props.Login.userInfo);
            }
            else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERPAREMETRS" }));
            }
        }
        else {

            if (selectedRecord.ssqlquery !== null && selectedRecord.ssqlquery.length > 0) {
                const sqlQuery = selectedRecord.ssqlquery;
                if (sqlQuery.toUpperCase().indexOf('INSERT') >= 0 || sqlQuery.toUpperCase().indexOf('UPDATE') >= 0
                    || sqlQuery.toUpperCase().indexOf('DELETE') >= 0 || sqlQuery.toUpperCase().indexOf('TRUNCATE') >= 0
                    || sqlQuery.toUpperCase().indexOf('CREATE') >= 0 || sqlQuery.toUpperCase().indexOf('ALTER') >= 0
                    || sqlQuery.toUpperCase().indexOf('DROP') >= 0) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDATAMANIPULATION" }));
                }
                else {
// ALPD-3460
                    if ((sqlQuery.indexOf('<@') > 0 && sqlQuery.indexOf('@>') > 0) || (sqlQuery.indexOf('<#') > 0 && sqlQuery.indexOf('#>') > 0)) {
                        let newQuery = sqlQuery;

                        const paramMap = new Map();
                        while (newQuery.indexOf("<@") !== -1||newQuery.indexOf("<#") !== -1) {
                            if(newQuery.indexOf("<@")!== -1){
                                const paramLabelStartIndex = newQuery.indexOf("<@");
                                const paramLabelEndIndex = newQuery.indexOf("@>");
    
                                const paramLabel = newQuery.substring(paramLabelStartIndex + 2, paramLabelEndIndex);
    
                                if (paramLabel.indexOf("T$") !== -1) {
                                    let displayName = "";
                                    let localParam = "";
                                    let tableName = "";
    
                                    newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                    if (paramLabel.indexOf("D$") !== -1) {
                                        localParam = paramLabel.substring(0, paramLabel.indexOf('D$'));
                                        displayName = paramLabel.substring(paramLabel.indexOf('D$') + 2, paramLabel.indexOf('T$'));
                                        //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                        tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                    }
                                    else {
                                        localParam = paramLabel.substring(0, paramLabel.indexOf('T$'));
                                        //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                        tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                    }
    
                                    if (localParam.startsWith('d') || localParam.startsWith('D')) {
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'DateTimePicker',
                                            lableName: localParam,
                                            //ID: param.length, 
                                            Datetime: new Date(),
                                            textValue: '',
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        })
                                    }else if(localParam==='slanguagetypecode'){
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'TextBox1', lableName: localParam,
                                            //ID: param.length, 
                                            textValue: this.props.Login.userInfo.slanguagetypecode,
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        });
                                    }
                                    else {
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'TextBox1', lableName: localParam,
                                            //ID: param.length, 
                                            textValue: '',
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        });
                                    }
                                }
                                else {
                                    // newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
                                    //JIRA-ALPD-5009->SATHISH-> DURING VALIDATION PARAMETER NOT FORMED PROPERLY
                                    newQuery = newQuery.substring(0, paramLabelStartIndex) + newQuery.substring(paramLabelEndIndex+2);
                                     if(paramLabel==='slanguagetypecode'){
                                        paramMap.set("<@" + paramLabel + "@>", {
                                            value: 'TextBox1', lableName: paramLabel,
                                            //ID: param.length, 
                                            textValue: this.props.Login.userInfo.slanguagetypecode,
                                            TableName: "",
                                            DisplayParam: "",
                                            actuallableName: paramLabel.substring(1, paramLabel.length)
                                        });
                                    }
                                    else {
                                        paramMap.set("<@" + paramLabel + "@>", {
                                            value: 'TextBox1', lableName: paramLabel,
                                            //ID: param.length, 
                                            textValue: '',
                                            TableName: "",
                                            DisplayParam: "",
                                            actuallableName: paramLabel
                                        });
                                    }
                                }
                            }else if(newQuery.indexOf("<#")!== -1){
                                const paramLabelStartIndex = newQuery.indexOf("<#");
                                const paramLabelEndIndex = newQuery.indexOf("#>");
    
                                const paramLabel = newQuery.substring(paramLabelStartIndex + 2, paramLabelEndIndex);
    
                                if (paramLabel.indexOf("T$") !== -1) {
                                    let displayName = "";
                                    let localParam = "";
                                    let tableName = "";
    
                                    newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
    
                                    if (paramLabel.indexOf("D$") !== -1) {
                                        localParam = paramLabel.substring(0, paramLabel.indexOf('D$'));
                                        displayName = paramLabel.substring(paramLabel.indexOf('D$') + 2, paramLabel.indexOf('T$'));
                                        //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                        tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                    }
                                    else {
                                        localParam = paramLabel.substring(0, paramLabel.indexOf('T$'));
                                        //tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.indexOf('$P'));
                                        tableName = paramLabel.substring(paramLabel.indexOf('T$') + 2, paramLabel.length);
                                    }
    
                                    if (localParam.startsWith('d') || localParam.startsWith('D')) {
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'DateTimePicker',
                                            lableName: localParam,
                                            //ID: param.length, 
                                            Datetime: new Date(),
                                            textValue: '',
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        })
                                    }else if(localParam==='slanguagetypecode'){
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'TextBox1', lableName: localParam,
                                            //ID: param.length, 
                                            textValue: this.props.Login.userInfo.slanguagetypecode,
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        });
                                    }
                                    else {
                                        paramMap.set("P$" + localParam + "$P", {
                                            value: 'TextBox1', lableName: localParam,
                                            //ID: param.length, 
                                            textValue: '',
                                            TableName: tableName,
                                            DisplayParam: displayName,
                                            actuallableName: localParam.substring(1, localParam.length)
                                        });
                                    }
                                }
                                else {
                                    // newQuery = newQuery.substring(paramLabelEndIndex + 2, newQuery.length);
                                    //JIRA-ALPD-5009->SATHISH-> DURING VALIDATION PARAMETER NOT FORMED PROPERLY
                                    newQuery = newQuery.substring(0, paramLabelStartIndex) + newQuery.substring(paramLabelEndIndex+2);
 
                                        paramMap.set("<#" + paramLabel + "#>", {
                                             lableName: paramLabel,
                                            value: 'DateTimePicker',
                                            //ID: param.length, 
                                            Datetime: new Date(),
                                            textValue: '',
                                            TableName: "",
                                            DisplayParam: "",
                                            actuallableName: paramLabel
                                        });
                                   
                                }
                            }
                           
                        }

                        const updateInfo = {
                            typeName: DEFAULT_RETURN, data: {
                                screenName: "Parameter for Results",
                                showExecute: true,
                                showSave: true,
                                showParam: true,
                                showValidate: false,
                                slideOperation: this.props.Login.operation,
                                slideResult: [],
                                slideList: [],
                                screenFlag: "showQuery",
                                param: paramMap,
                                // Dparam: Dparam, TBLName: TBLName
                            }
                        }
                        this.props.updateStore(updateInfo);
                    }
                    else {
                        //query without parameters      
                        const inputParam = {
                            screenName: "Results",
                            query: selectedRecord.ssqlquery.trim(),
                            userInfo: this.props.Login.userInfo,
                            slideOperation: this.props.Login.operation,
                            screenFlag: "showQuery",
                            data: {
                                showExecute: false,
                                showSave: false,
                                showParam: true,
                                showValidate: false,
                                noSave: false,
                                operation: "view",
                                param: new Map(),
                                screenName: "Results",
                                slideOperation: this.props.Login.operation,
                                screenFlag: "showQuery"
                            }

                        }
                        this.props.executeUserQuery(inputParam);
                    }
                }
            }
        }

    }


    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.resultStatus === "Success") {
            let operation = this.props.Login.operation;
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = undefined;
            if (operation === "update"
                || (operation === "view" && this.props.Login.slideOperation !== "create")) {
                // edit
                operation = "update";
                postParam = { inputListName: "SQLQuery", selectedObject: "SelectedSQLQuery", primaryKeyField: "nsqlquerycode" };
                let selectedRecord = { ...this.state.selectedRecord };
                delete selectedRecord.nformcode;
                inputData["sqlquery"] = selectedRecord
                this.queryFieldList.map(item => {
                    return inputData["sqlquery"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                })
            }
            else {
                //add               
                inputData["sqlquery"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
                operation = "create";
                this.queryFieldList.map(item => {
                    return inputData["sqlquery"][item] = this.state.selectedRecord[item]
                });
            }
            if (inputData["sqlquery"].hasOwnProperty('esignpassword')) {
                if (inputData["sqlquery"]['esignpassword'] === '') {
                    delete inputData["sqlquery"]['esigncomments']
                    delete inputData["sqlquery"]['esignpassword']
                    delete inputData["sqlquery"]['agree']
                }
            }
            inputData["sqlquery"]["ncharttypecode"] = this.state.selectedRecord["ncharttypecode"] ? this.state.selectedRecord["ncharttypecode"].value : "-1";
            inputData["sqlquery"]["nquerytypecode"] = this.props.Login.masterData.SelectedQueryType.nquerytypecode;
            ///code removed
            const inputParam = {
                classUrl: "sqlquery",
                methodUrl: "SQLQuery",
                inputData: inputData,
                operation,
                saveType, formRef, postParam, searchRef: this.searchRef
            }
            const masterData = this.props.Login.masterData;

            if (
                showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, parentPopUpSize: "lg"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_INAVLIDDATA" }));
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "sqlquery",
        //     methodUrl: "SQLQuery",
        //     displayName: "IDS_SQLBUILDER",
        //     userInfo: this.props.Login.userInfo
        // };
        // this.props.callService(inputParam);

        let nquerytypecode = this.props.Login.masterData.SelectedQueryType ?
            this.props.Login.masterData.SelectedQueryType.nquerytypecode : 0;
        this.props.comboChangeQueryType(nquerytypecode, this.props.Login.masterData, this.props.Login.userInfo);

    }

    componentDidUpdate(previousProps) {
        let { selectedRecord, dataStateUserQuery, userRoleControlRights, controlMap, filterData, queryType,
            chartList, moduleFormName, tableType, selectedTableType, param, tableColumnList, selectedTableList,
            foreignTableCount, foreignTableList, count, sqlQuery } = this.state;
        let updateState = false;
        // const masterData = this.props.Login.masterData;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        
        if (this.props.Login.sqlQuery !== previousProps.Login.sqlQuery) {
            updateState = true;
            sqlQuery = this.props.Login.sqlQuery;
        }

        if (this.props.Login.tableColumnList !== previousProps.Login.tableColumnList) {
            updateState = true;
            tableColumnList = this.props.Login.tableColumnList;
        }

        if (this.props.Login.slideResult !== previousProps.Login.slideResult) {
            dataStateUserQuery = {
                skip: 0,
                take: 10,
            };
            updateState = true;
        }



        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRight = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRight.push(item.ncontrolcode))
            }
            const controlMap1 = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            // if (this.props.Login.masterData.QueryType !== previousProps.Login.masterData.QueryType) {
            const queryTypeMap = constructOptionList(this.props.Login.masterData.QueryType || [], "nquerytypecode",
                "squerytypename", "nsorter", "ascending", false);
            const QueryTypeList = queryTypeMap.get("OptionList");

            // const selectedcombo = {
            //     nquerytypecode: QueryTypeList.length > 0 ? {
            //         "value": QueryTypeList[0].item.nquerytypecode,
            //         "label": QueryTypeList[0].item.squerytypename
            //     } : this.state.selectedcombo["nquerytypecode"]

            // }

            // }
            updateState = true;
            userRoleControlRights = userRoleControlRight;
            controlMap = controlMap1;
            filterData = this.generateBreadCrumData();
            queryType = QueryTypeList;
        }
        else {
            filterData = this.generateBreadCrumData();
            if (this.props.Login.chartList !== previousProps.Login.chartList || this.props.Login.moduleFormName !== previousProps.Login.moduleFormName) {

                const chartListMap = constructOptionList(this.props.Login.chartList || [], "ncharttypecode",
                    "schartname", undefined, undefined, undefined);
                const chartTypeList = chartListMap.get("OptionList");

                const moduleFormNameMap = constructOptionList(this.props.Login.moduleFormName || [], "nformcode",
                    "sdisplayname", undefined, undefined, undefined);
                const moduleFormNameList = moduleFormNameMap.get("OptionList");
                updateState = true;
                chartList = chartTypeList
                moduleFormName = moduleFormNameList
            }
            if (this.props.Login.masterData.QueryType !== previousProps.Login.masterData.QueryType) {
                const queryTypeMap = constructOptionList(this.props.Login.masterData.QueryType || [], "nquerytypecode",
                    "squerytypename", "nsorter", "ascending", false);
                const QueryTypeList = queryTypeMap.get("OptionList");

                // const selectedcombo = {
                //                         nquerytypecode: QueryTypeList.length > 0 ? {
                //                             "value": QueryTypeList[0].item.nquerytypecode,
                //                             "label": QueryTypeList[0].item.squerytypename
                //                         } : this.state.selectedcombo["nquerytypecode"]

                //}

                updateState = true;
                queryType = QueryTypeList //selectedcombo , 


            }
            if (this.props.Login.tableType !== previousProps.Login.tableType) {
                const tableTypeMap = constructOptionList(this.props.Login.tableType || [], "ntabletypecode",
                    "stabletype", undefined, undefined, undefined);
                let tableTypeList = tableTypeMap.get("OptionList");

                selectedTableType = {
                    ntabletypecode: tableTypeList.length > 0 ? {
                        "value": tableTypeList[0].item.ntabletypecode,
                        //"label": tableTypeList[0].item.stabletype
                        "label": this.props.intl.formatMessage({ id:tableTypeList[0].item.sidstablename })

                    } : this.state.selectedTableType["ntabletypecode"]

                }
                updateState = true;

                tableTypeList=tableTypeList.map(item=>{
                    item={...item,"label":this.props.intl.formatMessage({ id:item.item.sidstablename })}; 
                    return  item})

                tableType = tableTypeList

            }
            if (this.props.Login.masterData.SelectedQueryType !== previousProps.Login.masterData.SelectedQueryType) {
                updateState = true;
            }
            if (this.props.Login.param !== previousProps.Login.param) {
                updateState = true;
                param = this.props.Login.param
            }
        }
        if (updateState) {
            this.setState({
                selectedRecord, dataStateUserQuery, userRoleControlRights, controlMap, filterData, queryType,
                chartList, moduleFormName, tableType, selectedTableType, param, tableColumnList, selectedTableList,
                foreignTableCount, foreignTableList, count, sqlQuery
            })
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.SelectedQueryType) {

            breadCrumbData.push(
                {
                    "label": "IDS_QUERYTYPE",
                    "value": this.props.Login.masterData.SelectedQueryType ?
                        this.props.Login.masterData.SelectedQueryType.squerytypename : ""
                    //this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedQueryType.squerytypename}) : ""
                }
            );
        }
        return breadCrumbData;
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined,
                testData: {}, parameterData: {}, otherTestData: {}, formulaData: {}
            }
        }
        this.props.updateStore(updateInfo);
    }

}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, filterColumnData,
    validateEsignCredential, getSQLQueryDetail, getSQLQueryComboService, comboChangeQueryType,
    executeUserQuery, comboColumnValues, getColumnNamesByTableName,
    getTablesName, getModuleFormName, getDatabaseTables, executeQuery, getForeignTable, 
    getViewColumns, getMasterData
})(injectIntl(SQLBuilder));