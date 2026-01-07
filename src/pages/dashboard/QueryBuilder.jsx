// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { injectIntl} from 'react-intl';
// import { Row, Col, Card, Nav } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
// import { process } from '@progress/kendo-data-query';
// import { toast } from 'react-toastify';
// import ListMaster from '../../components/list-master/list-master.component';
// import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';

// //import QueryTypeFilter from './QueryTypeFilter';
// import {
//     callService, crudMaster, validateEsignCredential, updateStore, getSQLQueryDetail,
//     getSQLQueryComboService, filterColumnData, comboChangeQueryType, executeUserQuery,
//     comboColumnValues, getColumnNamesByTableName, getTablesName, getModuleFormName,
//     getDatabaseTables, executeQueryForQueryBuilder, getForeignTable, getViewColumns, getMasterData, createQueryBuilder,
//     getParameterFromQuery, getSelectedQueryBuilder, updateQueryBuilder,// getQueryBuilder
// } from '../../actions';
// import { DEFAULT_RETURN } from '../../actions/LoginTypes';
// import { ColumnType } from '../../components/Enumeration';
// import { copyText, getControlMap } from '../../components/CommonScript';
// import {  ContentPanel } from '../../components/App.styles';
// import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import { ListWrapper } from '../../components/client-group.styles';
// // import ReactTooltip from 'react-tooltip';
// import PortalModalSlideout from '../../components/portal-modal/portal-modal-slideout';
// import BuildQuery from './BuildQuery';
// import { format } from 'date-fns';
// import { ProductList } from '../product/product.styled';
// import QueryBuilderParamter from './QueryBuilderParamter';
// import { ReactComponent as ParameterConfigurationIcon } from '../../assets/image/parameter-configuration.svg';
// import DataGridComponent from '../../components/data-grid/data-grid.component';

// // import {validationData} from './QueryBuilderData';

// const jsonSql = require('json-sql')({ separatedValues: false });
// const jsonSqlParam = require('json-sql')({ separatedValues: true });

// class QueryBuilder extends Component {

//     constructor(props) {
//         super(props);

//         // const dataState = {
//         //     skip: 0,
//         //     take: props.settings ? parseInt(props.settings[14]) : 5,
//         // };
        // const dataState = {
        //     skip: 0,
        //     take: props.settings ? parseInt(props.settings[14]) : 5,
        // };
//         const dataStateMain = {
//             skip: 0,
//             take: props.settings ? parseInt(props.settings[14]) : 5,
//         };
//         const dataStateUserQuery = {
//             skip: 0,
//             take: 10,
//         };

//         this.state = ({
//             selectedRecord: {},
//             error: "",
//             // modalIsOpen: false,
//             parameters: [],
//             // objparam: [],
//             // objDparam: [],
//             queryName: '',
//             // queryResult: [],
//             userRoleControlRights: [],
//             controlMap: new Map(),
//             dataStateUserQuery: dataStateUserQuery,
//             queryTypeName: '',
//             selectedcombo: [],
//             selectedTableType: [],
//             moduleFormName: [],
//             ntableTypeCode: -1,
//             nFormCode: -1,
//             queryType: [],
//             tableType: [],
//             chartList: [],
//             skip: 0,
//             take: this.props.Login.settings ?
//                 this.props.Login.settings[3] : 25, //tableName : undefined,tableList:[]
//             outputColumns: [],
//             selectedTableList: [],
//             tableColumnList: [],
//             foreignTableColumnList: [],
//             joinTableList: [],
//             symbolsList: [],
//             foreignTableList: [],
//             count: 0,
//             foreignTableCount: [],
//             selectedforeignTableList: [],
//             filterColumnList: [],
//             sqlQuery: false,
//             // viewColumnList: [],
//             switchRecord: {},
//             dataState: dataState,
//             dataStateMain: dataStateMain,
//             data: [],
//             dataMainList: [],
//             dataResult: [],
//             dataResultMain: [],
//             queryType: [{ squerytypename: this.props.intl.formatMessage({ id: "IDS_VIEWS" }), nquerytypecode: 1 }, { squerytypename: this.props.intl.formatMessage({ id: "IDS_SQL" }), nquerytypecode: 2 }],
//             queryTypeOptions: [{ label: this.props.intl.formatMessage({ id: "IDS_VIEWS" }), views: 1 }, { label: this.props.intl.formatMessage({ id: "IDS_SQL" }), value: 2 }],
//             queryTypeOptions1:[],
//             sidebarview: false
//         });
//         this.searchRef = React.createRef();
//         this.confirmMessage = new ConfirmMessage();
//         // this.dropItemRef = React.createRef(); 

//         this.queryFieldList = ['nquerytypecode', 'ssqlqueryname', 'ssqlquery',
//             'sscreenrecordquery', 'sscreenheader', 'svaluemember', 'sdisplaymember', 'ncharttypecode'];
//         // this.queryList = [];

//         this.searchFieldList = ["ssqlqueryname", "ssqlquery", "sscreenheader", "svaluemember", "sdisplaymember",
//             "squerytypename", "schartname"];
//     }
//     sidebarExpandCollapse = () => {
//         this.setState({
//             sidebarview: true
//         })          
//     }



//     dataStateChange = (event) => {
//         this.setState({
//             dataResult: process(this.props.Login.queryData, event.dataState),
//             dataState: event.dataState
//         });
//     }

//     dataStateChangeMain = (event) => {
//         this.setState({
//             dataResultMain: process(this.props.Login.masterData.queryDataMain, event.dataState),
//             dataStateMain: event.dataState
//         });
//     }
//     static getDerivedStateFromProps(props, state) {
//         if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
//             toast.warn(props.Login.masterStatus);
//             props.Login.masterStatus = "";
//         }

//         if (props.Login.error !== state.error) {
//             toast.error(props.Login.error)
//             props.Login.error = "";
        // }
//         return null;
//     }
//     componentDidUpdate(previousProps) {
       
//         //let { filterData } = this.state;
//         if (this.props.Login.queryData !== previousProps.Login.queryData) {
//             this.setState({
//                 data: this.props.Login.queryData,
//                 dataResult: process(this.props.Login.queryData, this.state.dataState)
//             });
    //             }
//         if (this.props.Login.masterData.queryDataMain !== previousProps.Login.masterData.queryDataMain) {
//             if (this.props.Login.masterData.queryDataMain !== undefined) {
//                 this.setState({
//                     dataMainList: this.props.Login.masterData.queryDataMain,
//                     dataResultMain: process(this.props.Login.masterData.queryDataMain === null ? [] : this.props.Login.masterData.queryDataMain, this.state.dataStateMain)
//                 });
    //     }
    // }
//         // if (this.props.Login.masterData.queryTypeCode !== previousProps.Login.masterData.queryTypeCode) {
//         //     filterData = this.generateBreadCrumData();
//         //     this.setState({ filterData });
//         // }
//         if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
//             const userRoleControlRights = [];
//             if (this.props.Login.userRoleControlRights) {
//                 this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
//                     userRoleControlRights.push(item.ncontrolcode))
//             }
//             const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
//             this.setState({ controlMap, userRoleControlRights });
//         }
//          if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
//             this.setState({ selectedRecord: this.props.Login.selectedRecord });
//         }
//         if (this.props.Login.selectedRecord.filtercolumns !== previousProps.Login.selectedRecord.filtercolumns) {
//          this.generateFilterQuery(this.props.Login.selectedRecord);   
//          this.props.Login.addGroupList=[];
//          this.props.Login.gridColumnList=[]
//          this.props.Login.viewMasterListByRule=[];

//          //this.props.Login.gridColumnList =[];
//         }
//     }
//     // generateBreadCrumData() {
//     //     const breadCrumbData = [];
//     //     if (this.props.Login.masterData && this.props.Login.masterData.queryTypeCode) {

//     //         const item = this.state.queryType.filter(item => item.nquerytypecode === this.props.Login.masterData.queryTypeCode);
//     //         breadCrumbData.push(
//     //             {
//     //                 "label": "IDS_QUERYTYPE",
//     //                 "value": this.props.Login.masterData.queryTypeCode ?
//     //                     item[0].squerytypename : ""
//     //             }
//     //         );
//     //     }
//     //     return breadCrumbData;
//     // }
//     render() {
//         console.log("DataState",this.state.dataState);
//         console.log("DataState",this.state.dataState);
//         const filterParam = {
//             inputListName: "queryBuilderList", selectedObject: "selectedQueryBuilder", primaryKeyField: "nquerybuildercode",
//             fetchUrl: "querybuilder/getSelectedQueryBuilder", fecthInputObject: { userinfo: this.props.Login.userInfo },
//             masterData: this.props.Login.masterData,
//             searchFieldList: ["squerybuildername"]
//         };
//        console.log("selected",this.props.Login.selectFields);
//         const addId = this.state.controlMap.has("Add QueryBuilder") && this.state.controlMap.get("Add QueryBuilder").ncontrolcode;
//         const editId = this.state.controlMap.has("Edit QueryBuilder") && this.state.controlMap.get("Edit QueryBuilder").ncontrolcode;
//         const deleteId = this.state.controlMap.has("Delete QueryBuilder") && this.state.controlMap.get("Delete QueryBuilder").ncontrolcode;
//        // const breadCrumbData = this.state.filterData || [];
//         let gridColumnListMain = [];

//         // if (this.props.Login.masterData && this.props.Login.masterData.columnList && this.props.Login.masterData.columnList.length > 0) {
//         //     this.props.Login.masterData.columnList.forEach(item => {
//         //         gridColumnListMain.push({ idsName: item.items.displayname[this.props.Login.userInfo.slanguagetypecode], dataField: item.items.columnname, width: '200px' })
//         //     })
//         // }
//         if (this.props.Login.masterData && this.props.Login.masterData.selectFields && this.props.Login.masterData.selectFields.length > 0) {
//             this.props.Login.masterData.selectFields.forEach(item => {
        //         gridColumnListMain.push({ idsName: item.items.displayname[this.props.Login.userInfo.slanguagetypecode], dataField: item.items.columnname, width: '200px' })
        //     })
        // }
//         let selectedQueryType = [];
//         if (this.props.Login.masterData && this.props.Login.masterData.queryTypeCode) {

//             selectedQueryType = this.state.queryType.filter(item => item.nquerytypecode === this.props.Login.masterData.queryTypeCode);
//         }

//         return (
//             <>
        
//                 <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
//                     {/* {breadCrumbData.length > 0 ?
//                         <Affix top={53}>
//                             <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
//                         </Affix> : ""
//                     } */}
//                     {/* <div className="client-listing-wrap mtop-4"> */}
//                     {/* Start of get display*/}
//                     <Row noGutters={true}>
//                         <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
//                             <ListMaster
//                                 masterData={this.props.Login.masterData || []}
//                                 screenName={this.props.intl.formatMessage({ id: "IDS_QUERYBUILDER" })}
//                                 masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.queryBuilderList}
//                                 getMasterDetail={(qryBuilder) => this.props.getSelectedQueryBuilder(qryBuilder, this.props.Login.userInfo, this.props.Login.masterData)}
//                                 selectedMaster={this.props.Login.masterData.selectedQueryBuilder}
//                                 primaryKeyField="nquerybuildercode"
//                                 mainField="squerybuildername"
//                                 //firstField="squerybuildername"
//                                 // secondField={this.state.selectedcombo["nquerytypecode"] && this.state.selectedcombo["nquerytypecode"].value === queryTypeFilter.LIMSDASHBOARDQUERY ? "schartname" : ""}
//                                  filterColumnData={this.props.filterColumnData}
//                                filterParam={filterParam}
//                                 userRoleControlRights={this.state.userRoleControlRights}
//                                 addId={addId}
//                                 searchRef={this.searchRef}
//                                 reloadData={this.reloadData}
//                                 openModal={this.getDatabaseTables}
//                                 // openModal={() => this.props.getSQLQueryComboService("", "create", "nsqlquerycode", null,
//                                 //     this.props.Login.masterData, this.props.Login.userInfo,
//                                 //     this.props.Login.masterData.SelectedQueryType.nquerytypecode,                                   
//                                 //     addId)} 
//                                 //{() => this.props.addTest("create", selectedTest, userInfo, addId, this.state.nfilterTestCategory)} Already commented
//                                 needAccordianFilter={false}
//                                 // skip={this.state.skip}
//                                 // take={this.state.take}
//                                 handlePageChange={this.handlePageChange}
//                                 showFilterIcon={false}
//                                 showFilter={this.props.Login.showFilter}
//                                 openFilter={this.openFilter}
//                                 closeFilter={this.closeFilter}
//                                 //onFilterSubmit={this.onFilterSubmit}
//                                 showBuildQuery={false}
//                                 builderData={this.getDatabaseTables}
//                                 // filterComponent={[
//                                 //     {
//                                 //         "IDS_QUERYTYPEFILTER":
//                                 //             <QueryTypeFilter
//                                 //                 queryType={this.state.queryTypeOptions || []}
//                                 //                 selectedRecord={this.state.selectedcombo || {}}
//                                 //                 onComboChange={this.onComboChange}
//                                 //                 filterQueryType={selectedQueryType[0]}
//                                 //             />
//                                 //     }
//                                 // ]}
                                //             />
//                         </Col>
//                         <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
//                             <div className="sidebar-view-btn-block">
//                                 <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
//                                     {!this.props.sidebarview ?                    
//                                         <i class="fa fa-less-than"></i> :
//                                         <i class="fa fa-greater-than"></i> 
                                //     }
//                                 </div>
//                             </div>
//                             <ProductList className="panel-main-content">
//                                 {this.props.Login.masterData.queryBuilderList && this.props.Login.masterData.queryBuilderList.length > 0 && this.props.Login.masterData.selectedQueryBuilder ?
//                                     <Card className="border-0">
//                                         <Card.Header>
//                                             <Card.Title className="product-title-main">{this.props.Login.masterData.selectedQueryBuilder.squerybuildername}</Card.Title>
//                                             <ContentPanel className="d-flex product-category">
//                                                 <Col md='6' >
//                                                     {/* {this.props.Login.masterData.selectedQueryBuilder.squerybuildername} */}

//                                                 </Col>
//                                                 <Col md='6'>
//                                                     <div className="d-flex product-category" style={{ float: "right" }}>
//                                                         {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
//                                                         <ProductList className="d-inline dropdown badget_menu">
//                                                             <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
//                                                                 // hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
//                                                                 //  data-for="tooltip_list_wrap"
//                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PARAMETERMAPPING" })}
//                                                                 onClick={(e) => this.props.getParameterFromQuery(this.props.Login)}
//                                                             >
//                                                                 {/* <FontAwesomeIcon icon={faPencilAlt} className="ActionIconColor"/> */}
//                                                                 <ParameterConfigurationIcon className="custom_icons" width="20" height="20" name="configreporticon" />
//                                                             </Nav.Link>
//                                                             <Nav.Link name="QB" className="btn btn-circle outline-grey mr-2"
//                                                                 // hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
//                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
//                                                                 onClick={() => this.confirmDelete(deleteId)}
//                                                             >
//                                                                 <FontAwesomeIcon icon={faTrashAlt} />
//                                                             </Nav.Link>
//                                                             <Nav.Link className="btn btn-circle outline-grey mr-2 " href="#"
//                                                                 // hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
//                                                                 //  data-for="tooltip_list_wrap"
//                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPYSQL" })}
//                                                                 onClick={() => this.copySQLQuery(1)}
//                                                             >

//                                                                 <FontAwesomeIcon icon={faCopy} />
//                                                             </Nav.Link>
//                                                         </ProductList>
//                                                     </div>
//                                                 </Col>
//                                             </ContentPanel>
//                                         </Card.Header>
//                                         {this.props.Login.masterData.queryDataMain && gridColumnListMain && gridColumnListMain.length > 0 ?
//                                             <DataGridComponent
//                                                 data={this.state.dataMainList}
//                                                 dataResult={this.state.dataResultMain || []}
//                                                 dataState={this.state.dataStateMain}
//                                                 dataStateChange={this.dataStateChangeMain}
//                                                 extractedColumnList={gridColumnListMain}
//                                                 controlMap={this.state.controlMap}
//                                                 userRoleControlRights={this.state.userRoleControlRights}
//                                                 userInfo={this.props.Login.userInfo}
//                                                 pageable={true}
//                                                 scrollable={"scrollable"}
//                                                 isActionRequired={false}
//                                                 isToolBarRequired={true}
//                                                 isRefreshRequired={false}
//                                                 selectedId={-1}
//                                             />
//                                             : <></>
//                                         }
//                                     </Card>
//                                     : ""}

//                             </ProductList>
//                         </Col>
//                     </Row>
//                 </ListWrapper>

//                 {
//                     this.props.Login.openPortalModal &&
//                     <PortalModalSlideout
//                         show={this.props.Login.openPortalModal}
//                         closeModal={this.closePortalModal}
//                         screenName={this.props.Login.screenName}
//                         handleSaveClick={this.save}
//                         addComponent={
//                             <BuildQuery
//                                 selectedRecord={this.state.selectedRecord || {}}
//                                 databaseTableList={this.props.Login.databaseTableList}
//                                 tableColumnList={this.state.tableColumnList}
//                                 foreignTableList={this.state.foreignTableList || []}
//                                 foreignTableColumnList={this.props.Login.foreignTableColumnList || []}
//                                 // validationData={validationData}
//                                 count={this.state.count}
//                                 foreignTableCount={this.state.foreignTableCount}
//                                 sqlQuery={this.state.sqlQuery}
//                                 viewMasterListByRule={this.props.Login.viewMasterListByRule || []}
//                                 userInfo={this.props.Login.userInfo}
//                                 onExecuteRule={this.onExecuteRule}
//                                 onInputChange={this.onInputChange}
//                                 deleteRule={this.deleteRule}
//                                 clearRule={this.clearRule}
//                                 resetRule={this.resetRule}
//                                 onSymbolChange={this.onSymbolChange}
//                                 // onForeignTableChange={this.onForeignTableChange}
//                                 // addJoinTable={this.addJoinTable}
//                                 onQueryTypeOnclick={this.onQueryTypeOnclick}

//                                 onRuleChange={this.onRuleChange}
//                                 onViewComboChange={this.onViewComboChange}
//                                 addRule={this.addRule}
//                                 onConditionClick={this.onConditionClick}
//                                 onMasterDataChange={this.onMasterDataChange}
//                                 handleFilterDateChange={this.handleFilterDateChange}
//                                 databaseviewList={this.props.Login.databaseviewList}
//                                 addRuleList={this.props.Login.addRuleList || []}
//                                 viewColumnListByRule={this.props.Login.viewColumnListByRule || []}
//                                 masterdata={this.props.Login.masterdata}
//                                 switchRecord={this.state.switchRecord}
//                                 data={this.state.data}
//                                 dataResult={this.state.dataResult || []}
//                                 dataState={this.state.dataState}
//                                 dataStateChange={this.dataStateChange}
//                                 userRoleControlRights={this.state.userRoleControlRights}
//                                 gridColumnList={this.props.Login.gridColumnList || []}
//                                 queryType={this.state.queryType}
//                                 addAggregate={this.addAggregate}
//                                 addAggregateList={this.props.Login.addAggregateList || []}
//                                 onAggregateChange={this.onAggregateChange}
//                                 deleteAggregate={this.deleteAggregate}
//                                 addOrderby={this.addOrderby}
//                                 addOrderbyList={this.props.Login.addOrderbyList || []}
//                                 onOrderbyChange={this.onOrderbyChange}
//                                 deleteOrderby={this.deleteOrderby}
//                                 addGroup={this.addGroup}
//                                 addGroupList={this.props.Login.addGroupList || []}
//                                 copySQLQuery={this.copySQLQuery}
//                                 onFilterComboChange={this.onFilterComboChange}
//                                 selectFields={this.props.Login.selectFields || []}
//                                 generateFilterQuery={this.generateFilterQuery}
//                             />
//                         }
//                     />
//                 }

//                 {this.props.Login.openModal&&this.props.Login.masterData.selectedQueryBuilder['sdefaultvalue'] && 
//                     <SlideOutModal show={this.props.Login.openModal}
//                         closeModal={this.closeModal}
//                         operation={"create"}
//                         inputParam={this.props.Login.inputParam}
//                         screenName={this.props.intl.formatMessage({ id: "IDS_PARAMETERMAPPING" })}
//                         onExecuteClick={this.saveParam}
//                         showExecute={true}
//                         showParam={true}
//                         hideSave={true}
//                         selectedRecord={this.state.selectedRecord || {}}
//                         addComponent={
//                             <QueryBuilderParamter
//                                 onParamInputChange={this.onParamInputChange}
//                                 selectedQueryBuilder={this.props.Login.masterData.selectedQueryBuilder || []}
//                                 viewMasterData={this.props.Login.viewMasterData || []}
//                                 comboData={this.props.Login.comboData || []}
//                                 onParamComboChange={this.onParamComboChange}
//                             />
//                         }
//                     />
//                              //  toast.info(this.props.intl.formatMessage({ id: "IDS_QUERYNOTAVAILABLE" }))

//                 }
//             </>
//         );
//     }
//     copySQLQuery = (type) => {
//         const { selectedRecord } = this.state;
        
//         let count = 0;
//         if (type === 2) {
//             if (selectedRecord["sgeneratedquery"]) {
//             let query = this.state.selectedRecord["squerywithparam"] || "";

//             if (this.state.selectedRecord["sdefaultvalue"] && this.state.selectedRecord["sdefaultvalue"]) {
//                 this.state.selectedRecord["sdefaultvalue"].forEach((dataItem) => {

//                     if (dataItem.items.needmasterdata && dataItem.items.mastertablename) {

//                         if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                             dataItem.value.forEach((item, index) => {

//                                 count++;
//                                 if (index === 0) {
//                                     if (dataItem.value.length === 1) {
//                                         query = query.replace("$p" + count, "P$" + dataItem.items.viewvaluemember + "$P");
//                                     } else {
//                                         query = query.replace("$p" + count + ",", "P$" + dataItem.items.viewvaluemember + "$P");
//                                     }
//                                 } else {
//                                     if (query.includes("$p" + count + ",")) {
//                                         query = query.replace("$p" + count + ",", "");
//                                     } else {
//                                         query = query.replace("$p" + count, "");
//                                     }
//                                 }
//                             })
//                         } else {
//                             count++;
//                             query = query.replace("$p" + count, "P$" + dataItem.items.viewvaluemember + "$P");
//                         }
//                     }
//                     else if (dataItem.items.sforeigncolumnname !== undefined &&
//                         dataItem.items.sforeigncolumnname !== "") {
//                         if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                             dataItem.value.forEach((item, index) => {

//                                 count++;
//                                 if (index === 0) {
//                                     if (dataItem.value.length === 1) {
//                                         query = query.replace("$p" + count, "P$" + dataItem.items.sforeigncolumnname + "$P");
//                                     } else {
//                                         query = query.replace("$p" + count + ",", "P$" + dataItem.items.sforeigncolumnname + "$P");
//                                     }

//                                 } else {
//                                     if (query.includes("$p" + count + ",")) {
//                                         query = query.replace("$p" + count + ",", "");
//                                     } else {
//                                         query = query.replace("$p" + count, "");
//                                     }

//                                 }
//                             })
//                         } else {
//                             count++;
//                             query = query.replace("$p" + count, "P$" + dataItem.items.sforeigncolumnname + "$P");
//                         }
//                     } else {
//                         count++;
//                         query = query.replace("$p" + count, "P$" + dataItem.items.columnname + "$P");
//                     }
//                 })
//             }
//             if (query.includes("$L")) {
//                 query = query.replaceAll("$L", "'" + this.props.Login.userInfo.slanguagetypecode + "'");
//             }
//             copyText(query)
//             toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))
//           //  navigator.clipboard.writeText(query);
//         }
//         else{
//             toast.info(this.props.intl.formatMessage({ id: "IDS_QUERYNOTAVAILABLE" }));
//         }
//         } else {
//             let query = this.props.Login.masterData.selectedQueryBuilder["squerywithparam"] || "";
// if(query){
//             if (this.props.Login.masterData.selectedQueryBuilder["sdefaultvalue"] && this.props.Login.masterData.selectedQueryBuilder["sdefaultvalue"].value) {
//                 const sdefaultValue = JSON.parse(this.props.Login.masterData.selectedQueryBuilder["sdefaultvalue"].value);

//                 sdefaultValue.sdefaultvalue.forEach((dataItem, index) => {
//                     if (dataItem.items.needmasterdata && dataItem.items.mastertablename) {
//                         if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                             dataItem.value.forEach((item, index) => {

//                                 count++;
//                                 if (index === 0) {
//                                     if (dataItem.value.length === 1) {
//                                         query = query.replace("$p" + count, "P$" + dataItem.items.viewvaluemember + "$P");
//                                     } else {
//                                         query = query.replace("$p" + count + ",", "P$" + dataItem.items.viewvaluemember + "$P");
//                                     }
//                                 } else {
//                                     if (query.includes("$p" + count + ",")) {
//                                         query = query.replace("$p" + count + ",", "");
//                                     } else {
//                                         query = query.replace("$p" + count, "");
//                                     }
//                                 }
//                             })
//                         } else {
//                             count++;
//                             query = query.replace("$p" + count, "P$" + dataItem.items.viewvaluemember + "$P");
//                         }
//                     }
//                     else if (dataItem.items.sforeigncolumnname !== undefined &&
//                         dataItem.items.sforeigncolumnname !== "") {
//                         if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                             dataItem.value.forEach((item, index) => {

//                                 count++;
//                                 if (index === 0) {
//                                     if (dataItem.value.length === 1) {
//                                         query = query.replace("$p" + count, "P$" + dataItem.items.sforeigncolumnname + "$P");
//                                     } else {
//                                         query = query.replace("$p" + count + ",", "P$" + dataItem.items.sforeigncolumnname + "$P");
//                                     }

//                                 } else {
//                                     if (query.includes("$p" + count + ",")) {
//                                         query = query.replace("$p" + count + ",", "");
//                                     } else {
//                                         query = query.replace("$p" + count, "");
//                                     }

//                                 }
//                             })
//                         } else {
//                             count++;
//                             query = query.replace("$p" + count, "P$" + dataItem.items.sforeigncolumnname + "$P");
//                         }
//                     } else {
//                         count++;
//                         query = query.replace("$p" + count, "P$" + dataItem.items.columnname + "$P");
//                     }
//                 })
//             }
//             if (query.includes("$L")) {
//                 query = query.replaceAll("$L", "'" + this.props.Login.userInfo.slanguagetypecode + "'");
//             }
          
//             copyText(query)
//             toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))
//           //  navigator.clipboard.writeText(query);
//         }
//         else{
//             toast.info(this.props.intl.formatMessage({ id: "IDS_QUERYNOTAVAILABLE" }));
//         }
//     }}
//     reloadData = () => {
//         this.searchRef.current.value = "";
//         const inputParam = {
//             inputData: { "userinfo": this.props.Login.userInfo },
//             classUrl: "querybuilder",
//             methodUrl: "QueryBuilder",
//             // displayName: "IDS_DASHBOARDTYPES",
//             userInfo: this.props.Login.userInfo
//         };

//         this.props.callService(inputParam);
//     }

//     saveParam = (saveType, formRef) => {

//         let count = 0;

//         let query = this.props.Login.masterData.selectedQueryBuilder["squerywithparam"];

//         this.props.Login.comboData.sdefaultvalue.forEach((dataItem) => {

//             if (dataItem.items.needmasterdata && dataItem.items.mastertablename) {

//                 let sqryData = "";
//                 if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                     dataItem.value.forEach((item) => {

//                         count++;

//                         // if (isNaN(item.value)) {
//                            // query = query.replace("$p" + count, "'" + item.value + "'");
//                         // } else {
                           
               

//                             query = query.replace("$p" + count, item.value);
//                        // }
//                     })

                   // } else {
//                     count++;
//                     // if (isNaN(dataItem.value.value)) {
//                      //   query = query.replace("$p" + count, "'" + dataItem.value.value + "'");
//                    // } else {
//                         query = query.replace("$p" + count, dataItem.value.value);
//                    // }
                   // }


//             } else if (dataItem.items.sforeigncolumnname !== undefined &&
//                 dataItem.items.sforeigncolumnname !== "") {

//                 if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                     dataItem.value.forEach((item) => {

//                         count++;

//                        // if (isNaN(item.value)) {
//                             query = query.replace("$p" + count, "'" + item.value + "'");
//                        // } else {
//                         //    query = query.replace("$p" + count, item.value);
//                       //  }
//                     })


                       // } else {
//                     count++;
//                    // if (isNaN(dataItem.value.value)) {
//                         query = query.replace("$p" + count, "'" + dataItem.value.value + "'");
//                     // } else {
//                     //     query = query.replace("$p" + count, dataItem.value.value);
//                     // }
                      //  }

//             } else if (dataItem.items.columntype === ColumnType.DATATIME
//                 || dataItem.items.columntype === ColumnType.DATE && dataItem.symbolObject.items.isInputVisible === true
//                 && (dataItem.symbolObject.items.symbolType === 5 || dataItem.symbolObject.items.symbolType === 1)) {
//                 count++;
//                 query = query.replace("$p" + count, "'" + format(new Date(dataItem.value), "yyyy-MM-dd HH:mm:ss.SS") + "'");


                    // } else {
//                 count++;
//                 query = query.replace("$p" + count, "'" + dataItem.value + "'");
                    // }
//         })
//         if (query.includes("$L")) {
//             query = query.replaceAll("$L", "'" + this.props.Login.userInfo.slanguagetypecode + "'");
//         }
//         if(!query.includes("$p")){
//         const jsonData = JSON.parse(this.props.Login.masterData.selectedQueryBuilder["jsondata"].value);
//         const inputParam = {
//             sgeneratedquery: query,
//             columnList: jsonData["columnList"],
//             userInfo: this.props.Login.userInfo,

//         }
//         let inputData = [];
//         this.props.updateQueryBuilder(inputParam, inputData, this.props.Login.masterData);
//     }

//     else{
//         toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTCORRECTPARAMETER" }));
//     }


  
//     }
//     save = (saveType, formRef) => {
       
//         const { selectedRecord } = this.state;
       
//         if (selectedRecord["querybuildername"] && selectedRecord["querybuildername"].length > 0) {
//             if (selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"].length > 0) {

//                 let inputData = [];
//                 let jsondata = {}
//                 let postParam = undefined;

//                 if (selectedRecord["sdefaultvalue"]&&selectedRecord["sdefaultvalue"].length > 0) {
//                     selectedRecord["sdefaultvalue"].forEach((item, i) => {
//                         if (item.symbolObject.items.symbolType === 4) {
//                             delete item.symbolObject.items["replacewith"];
//                         }
//                     })
//                 }

//                 postParam = { inputListName: "QueryBuilder", selectedObject: "selectedQueryBuilder", primaryKeyField: "nquerybuildercode" };

//                 inputData["userinfo"] = this.props.Login.userInfo;
//                 inputData["queryBuilder"] = { "nstatus": 1 };

//                 jsondata["groupList"] = selectedRecord["groupList"];
//                 jsondata["aggregate"] = selectedRecord["aggregate"];
//                 jsondata["orderby"] = selectedRecord["orderby"];
//                 jsondata["columnList"] = this.props.Login.viewColumnListByRule && this.props.Login.viewColumnListByRule ||  this.props.Login.viewColumnList ; //selectedRecord["filtercolumns"];
//                 jsondata["selectFields"] = this.props.Login.selectFields; //selectedRecord["filtercolumns"];
//                 inputData["sgeneratedquery"] = selectedRecord["sgeneratedquery"];


//                 inputData["queryBuilder"]["squerybuildername"] = selectedRecord["querybuildername"];
//                 inputData["queryBuilder"]["nquerytype"] = 1;
//                 inputData["queryBuilder"]["sviewname"] = selectedRecord["sviewname"].label;
//                 inputData["queryBuilder"]["squerywithparam"] = selectedRecord["squerywithparam"];
//                 inputData["queryBuilder"]["squerywithvalue"] = selectedRecord["sgeneratedquery"];
//                 inputData["queryBuilder"]["sdefaultvalue"] = { sdefaultvalue: selectedRecord["sdefaultvalue"] || []};
//                 inputData["queryBuilder"]["jsondata"] = jsondata;

//                 const inputParam = {
//                     classUrl: "querybuilder",
//                     methodUrl: "QueryBuilder",
//                     displayName: this.props.Login.inputParam.displayName&&this.props.Login.inputParam.displayName,
//                     inputData: inputData,
//                     operation: "create", saveType, formRef, postParam
//                 }
//                 this.props.crudMaster(inputParam, this.props.Login.masterData, "openPortalModal");
//                 // this.props.createQueryBuilder(inputData, this.props.Login);
//             }
//             else {
//                 toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANYCOLUMNS" }));
//             }
//         }
//         else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_INVALIDQUERYBUILDERNAME" }));
//         }
//     }
//     deleteQB = (ncontrolCode) => {
//         let inputData = [];

//         // let postParam = {
//         //     inputListName: "QueryBuilder",
//         //     selectedObject: "selectedDashBoardTypes",
//         //     primaryKeyField: "ndashboardtypecode",
//         //     primaryKeyValue: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,
//         //     fetchUrl: "dashboardtypes/getAllSelectionDashBoardTypes",
//         //     fecthInputObject: { userinfo: this.props.Login.userInfo }
//         // };
//         inputData["queryBuilder"] = this.props.Login.masterData.selectedQueryBuilder;
//         inputData["userinfo"] = this.props.Login.userInfo;


//         const inputParam = {
//             methodUrl: "QueryBuilder",
//             classUrl: "querybuilder",
//             inputData: inputData,
//             operation: "delete", searchRef: this.searchRef
//         }

//         this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");

//     }

//     confirmDelete = (ncontrolCode) => {
//         this.confirmMessage.confirm("deleteMessage",
//             this.props.intl.formatMessage({ id: "IDS_DELETE" }),
//             this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
//             this.props.intl.formatMessage({ id: "IDS_OK" }),
//             this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
//             () => this.deleteQB("delete", ncontrolCode));
//     };

//     openFilter = () => {
//         let showFilter = !this.props.Login.showFilter
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { showFilter }
//         }
//         this.props.updateStore(updateInfo);
//     }

//     closeFilter = () => {

//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { showFilter: false }
//         }
//         this.props.updateStore(updateInfo);
//     }

//     // onFilterSubmit = () => {

//     //     this.searchRef.current.value = "";

//     //     if (this.state.selectedcombo["nquerytypecode"]) {
//     //         console.log(this.state.selectedcombo["nquerytypecode"].value);
//     //     }
//     //     const nquerytypecode = this.state.selectedcombo["nquerytypecode"] ?
//     //         this.state.selectedcombo["nquerytypecode"].value : this.props.Login.masterData.queryTypeCode;

//     //     this.props.getQueryBuilder(nquerytypecode, this.props.Login.userInfo, this.props.Login.masterData);


//     // }

//     onFilterComboChange = (comboData, fieldName) => {
//         const selectedRecord = this.state.selectedRecord || {};
//         selectedRecord[fieldName] = comboData;
//         this.generateFilterQuery(selectedRecord);
    // }
//     onParamComboChange = (data, index) => {

       
//         let comboData = this.props.Login.comboData;

//         comboData["sdefaultvalue"][index].value = data;
      
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 comboData
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     onParamInputChange = (event, type, index, dataItem) => {
//         let comboData = this.props.Login.comboData;
//         if (type === 2) {
//             const inputValue = event.target.value;
//             if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
//                 comboData["sdefaultvalue"][index].value = event.target.value;
//             }
//         }
//         else if (type === 1) {
//             comboData["sdefaultvalue"][index].value = event.target.checked;
//         }
//         else if (type === 3) {
     
//             if (dataItem.symbolObject.items.symbolType === 4) {
//                 // const symbolObject = stringOperatorData.filter(data => data.value === dataItem.symbolObject.value);
//                 let symbolObject = ""
//                 if (dataItem.symbolObject.value === 7 || dataItem.symbolObject.value === 8) {
//                     symbolObject = "'%_%'";
//                 } else if (dataItem.symbolObject.value === 9) {
//                     symbolObject = "'_%'";
//                 } else {
//                     symbolObject = "'%_'";
//                 }
//                 const index1 = symbolObject.indexOf('_');
//                 let inputname = undefined

//                 inputname = symbolObject.substr(0, index1) + event.target.value + symbolObject.substr(index1 + 1);
//                 inputname = inputname.slice(1, inputname.length - 1);

//                 comboData["sdefaultvalue"][index].value = inputname;
//                 comboData["sdefaultvalue"][index].showInputValue = event.target.value;
//             } else {
//                 comboData["sdefaultvalue"][index].value = event.target.value;
//             }
//         }
//         else {


//             comboData["sdefaultvalue"][index].value = event.target.value;
//         }
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 comboData
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     handleFilterDateChange = (dateName, dateValue, groupIndex, index) => {
//         const { selectedRecord } = this.state;
//         if (dateValue === null) {
//             dateValue = new Date();
//         }
//         selectedRecord["groupList"][groupIndex][index][dateName] = dateValue;
//         this.generateFilterQuery(selectedRecord);
//     }

//     onComboChange = (comboData, fieldName) => {
//         const selectedcombo = this.state.selectedcombo || {};
//         selectedcombo[fieldName] = comboData;

//         this.setState({ selectedcombo });
//     }

//     onViewComboChange = (comboData,fieldName) => {
//         const selectedRecord = this.state.selectedRecord || {};
//         selectedRecord[fieldName] = comboData;

//         const inputParam = {
//             sviewname: comboData.value,
//             selectedRecord,
//             userinfo: this.props.Login.userInfo
// }
//        this.props.getViewColumns(inputParam);
// // if(comboData){
// //    this.props.Login.addGroupList = [];
// // }
      
   
//        }
     
    

//     onAggregateChange = (comboData, fieldName, index) => {
//         const { selectedRecord } = this.state;
//         selectedRecord["aggregate"] = selectedRecord["aggregate"] || [];
//         if (fieldName === "columnname") {
//             selectedRecord["aggregate"][index] = { "columnname": comboData, "aggfunctionname": "" };
//         } else {
//             if (selectedRecord["aggregate"][index]["columnname"] && selectedRecord["aggregate"][index]["columnname"] !== undefined) {
//                 selectedRecord["aggregate"][index]["aggfunctionname"] = comboData;
//             }
//             else {

//             }
//         }

//         // this.setState({ selectedRecord });
//         this.generateFilterQuery(selectedRecord);
        // }
//     onRuleChange = (comboData, fieldName, groupIndex, index,viewMasterListByRule) => {
//         const { selectedRecord } = this.state;
//         this.clearSelectedRule(selectedRecord,groupIndex, index,viewMasterListByRule);
//         const sqlQuery = this.props.Login.sqlQuery;
//         const oldselectedRecord = selectedRecord;
//         // if(selectedRecord["groupList"][groupIndex][index]&&selectedRecord["groupList"][groupIndex][index]){
//         //     selectedRecord["groupList"][groupIndex][index]["ssymbolname"] = [];
//         // }
       
//         selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
       

//         const tableData = comboData.items;
//         const mastertablename = tableData.mastertablename;

//         if (comboData.items.needmasterdata && mastertablename) {
//             const inputParam = {
//                 userinfo: this.props.Login.userInfo,
//                 data: {
//                     nflag: 2,
//                     mastertablename,
//                     valuemember: tableData.valuemember,
//                     displaymember: tableData.displaymember,
//                 },
//                 selectedRecord,
//                 groupIndex,
//                 index,
//                 optionId: tableData.valuemember
//             };
//             this.props.getMasterData(inputParam, this.props.Login.viewMasterListByRule);
//         } else if (comboData.items && comboData.items.columntype === ColumnType.COMBO) {
//             if (sqlQuery) {
//                 const inputParam = {
//                     userinfo: this.props.Login.userInfo,
//                     stablename: comboData.items.foriegntablename,
//                     scolumnname: comboData.value,
//                     selectedRecord,
//                     groupIndex,
//                     index
//                 };
//                 this.props.getForeignTable(inputParam, 'column');
//             } else {
//                 selectedRecord["groupList"][groupIndex][index][`${comboData.items.sforeigncolumnname}`] = "";
//                 const inputParam = {
//                     data: { ...comboData.items, nflag: 1 },
//                     userinfo: this.props.Login.userInfo,
//                     selectedRecord,
//                     groupIndex,
//                     index,
//                     optionId: comboData.items.sforeigncolumnname
//                 };
//                 this.props.getMasterData(inputParam, this.props.Login.viewMasterListByRule);
//             }
//         } else if (comboData.items && comboData.items.columntype === ColumnType.TEXTINPUT
//             && oldselectedRecord["groupList"][groupIndex][index][fieldName].items.columntype !== ColumnType.TEXTINPUT) {
//             selectedRecord["groupList"][groupIndex][index]["sinputname"] = "";
        // this.setState({ selectedRecord });
//         } else {
//             this.setState({ selectedRecord });
//         }
//     }

//     onMasterDataChange = (comboData, fieldName, groupIndex, index) => {
//         const { selectedRecord } = this.state;
//         selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
//         this.generateFilterQuery(selectedRecord);
//     }
//     onOrderbyChange = (comboData, fieldName, index) => {
//         const { selectedRecord } = this.state;
//         selectedRecord["orderby"] = selectedRecord["orderby"] || [];
//         if (fieldName === "columnname") {
//             selectedRecord["orderby"][index] = { "columnname": comboData, "ordertype": "" };
//         } else {
//             if (selectedRecord["orderby"][index]["columnname"] && selectedRecord["orderby"][index]["columnname"] !== undefined) {
//                 selectedRecord["orderby"][index]["ordertype"] = comboData;
//             }
//             else {

//             }
//         }

//         // this.setState({ selectedRecord });
//         this.generateFilterQuery(selectedRecord);
//     }
//     deleteOrderby = (index) => {
//         let addOrderbyList = this.props.Login.addOrderbyList;
//         let selectedRecord = this.state.selectedRecord;

//         selectedRecord["orderby"].splice(index, 1);
//         addOrderbyList.splice(index, 1);
//         addOrderbyList.forEach((data, index) => {
//             addOrderbyList[index] = index;
//         })

//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { addOrderbyList }
//         }
//         this.props.updateStore(updateInfo);
//         this.generateFilterQuery(selectedRecord);
//     }
//     addOrderby = () => {

//         const { selectedRecord } = this.state;
//         if (selectedRecord["sviewname"]) {
//             const addOrderbyList = this.props.Login.addOrderbyList || [];
//             let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
//             const arrayLength = addOrderbyList.length;
//             viewColumnListByRule = this.props.Login.viewColumnList;
//             addOrderbyList[arrayLength] = arrayLength;
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     addOrderbyList,
//                     viewColumnListByRule
//                 }
//             }
//             this.props.updateStore(updateInfo);
            // } else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEW" }));
            // }
//     }
//     deleteAggregate = (index) => {
//         let addAggregateList = this.props.Login.addAggregateList;
//         let selectedRecord = this.state.selectedRecord;

//         selectedRecord["aggregate"].splice(index, 1);
//         addAggregateList.splice(index, 1);
//         addAggregateList.forEach((data, index) => {
//             addAggregateList[index] = index;
//         })

            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
//             data: { addAggregateList }
//         }
//         this.props.updateStore(updateInfo);
//         // this.setState({ selectedRecord });
//         this.generateFilterQuery(selectedRecord);
//     }
//     addAggregate = () => {

//         const { selectedRecord } = this.state;
//         if (selectedRecord["sviewname"]) {
//             // if (selectedRecord["groupby"] && selectedRecord["groupby"] === true) {
//             const addAggregateList = this.props.Login.addAggregateList || [];
//             let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
//             const arrayLength = addAggregateList.length;
//             viewColumnListByRule = this.props.Login.viewColumnList;
//             addAggregateList[arrayLength] = arrayLength;
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
            //         data: {
//                     addAggregateList,
//                     viewColumnListByRule
            //         }
            //     }
            //     this.props.updateStore(updateInfo);
//             // } else {
//             //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTGROUPBY" }));
//             // }
            // } else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEW" }));
            // }
//     }
//     addRule = (type, groupIndex) => {
//         const { selectedRecord } = this.state;
//         if (type === "sql") {
//             // let addRuleList = this.props.Login.addRuleList || [];
//             // if (addRuleList.length > 0) {
//             //     const arrayLength = addRuleList.length;
//             //     addRuleList[arrayLength] = arrayLength;
//             //     selectedRecord["button_and_" + arrayLength] = true;
//             //     const updateInfo = {
//             //         typeName: DEFAULT_RETURN,
//             //         data: {
//             //             addRuleList,
//             //             selectedRecord
//             //         }
//             //     }
//             //     this.props.updateStore(updateInfo);
//             // } else {
//             //     addRuleList[0] = 0;
//             //     this.props.getDatabaseTables(this.props.Login.userInfo, this.props.Login.sqlQuery, { addRuleList, selectedRecord: {} });
//             // }

//         } else {
//             if (selectedRecord["sviewname"]) {
//                 let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];


//                 // const addRuleList = this.props.Login.addRuleList || [];
//                 // const arrayLength = addRuleList.length;
//                 // addRuleList[arrayLength] = arrayLength;


//                 const addGroupList = this.props.Login.addGroupList || [];
//                 const arrayLength = addGroupList[groupIndex];
//                 addGroupList[groupIndex] = arrayLength + 1;

//                 // const addGroupList = {...this.props.Login.addGroupList, [groupIndex]: addRuleList};

//                 selectedRecord["groupList"][groupIndex][arrayLength] = {};

//                 // viewColumnListByRule[groupIndex][arrayLength] = this.props.Login.viewColumnList;
//                 viewColumnListByRule = this.props.Login.viewColumnList;
//                 const updateInfo = {
//                     typeName: DEFAULT_RETURN,
//                     data: {
//                         addGroupList,
//                         viewColumnListByRule
//                     }
//                 }
//                 this.props.updateStore(updateInfo);
//             } else {
//                 toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEW" }));
//             }
//         }



//     }

//     addGroup = () => {

//         const { selectedRecord } = this.state;

//         var sql1 = jsonSql.build({
//             table: 'testmaster',
//             alias: 'tm',
//             join: [{
//                 type: 'inner',
//                 table: 'testcategory',
//                 alias: 'tc',
//                 on: { 'tm.ntestcategorycode': 'tc.ntestcategorycode' }
//             },
//             {
//                 type: 'inner',
//                 table: 'transactionstatus',
//                 alias: 'ts',
//                 on: { 'tm.naccredited': 'ts.ntranscode' }
//             }]
//         });
//         console.log(sql1.query);

//         var sql21 = jsonSql.build({
//             table: 'testmaster',
//             alias: 'tm',
//             join: [{
//                 type: 'inner',
//                 table: 'testcategory',
//                 alias: 'tc',
//                 on: { 'tm.ntestcategorycode': 'tc.ntestcategorycode' }
//             },
//             {
//                 type: 'right outer',
//                 table: 'transactionstatus',
//                 alias: 'ts',
//                 on: { 'tm.naccredited': 'ts.ntranscode' }
//             },
//             {
//                 type: 'left outer',
//                 table: 'transactionstatus',
//                 alias: 'ts',
//                 on: [{ 'tm.naccredited': 'ts.ntranscode' }, { 'tc.naccredited': 'ts.ntranscode' }]
//             }],
//             condition: [
//                 { a: { $gt: 1 } },
//                 { b: { $lt: 10 } }
//             ],
//             group: ['a', 'b']
//         });
//         console.log(sql21.query);

//         if (selectedRecord["sviewname"]) {
//             let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
//             const addGroupList = this.props.Login.addGroupList || [];
//             const arrayLength = addGroupList.length;
//             addGroupList[arrayLength] = 1;
//             // viewColumnListByRule[arrayLength] = [];
//             // viewColumnListByRule[arrayLength].push(this.props.Login.viewColumnList);
//             viewColumnListByRule = this.props.Login.viewColumnList;
//             if (arrayLength === 0) {
//                 selectedRecord["groupList"] = [];
//                 selectedRecord["filtercolumns"] = this.props.Login.selectFields;
//             }
//             selectedRecord["groupList"][arrayLength] = [];
//             selectedRecord["groupList"][arrayLength]["button_and"] = true;
//             selectedRecord["groupList"][arrayLength][0] = {};
//             this.generateFilterQuery(selectedRecord);

//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     addGroupList,
//                     viewColumnListByRule,
//                     selectedRecord
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         } else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEWS" }));
//         }
//     }
//     getDatabaseTables = () => {
//         const sqlQuery = false;
//         this.setState({ selectedRecord: {} });
//         this.props.getDatabaseTables(this.props.Login.userInfo, sqlQuery, {
//             addRuleList: [], addGroupList: [],
//             addAggregateList: [], addOrderbyList: []
//         });

//     }

//     closePortalModal = () => {
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 openPortalModal: false, selectedRecord: {}, addRuleList: [], count: 0,selectFields:[]
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     closeModal = () => {
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 openModal: false, selectedRecord: {}
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }

//     onExecuteRule = () => {
//         const { selectedRecord } = this.state;
//         if (selectedRecord["sgeneratedquery"]) {


//             let query = selectedRecord["squerywithparam"]&& selectedRecord["squerywithparam"];

//             let count = 0
//             selectedRecord["sdefaultvalue"]&& selectedRecord["sdefaultvalue"].forEach((dataItem) => {

//                 if (dataItem.items.needmasterdata && dataItem.items.mastertablename) {

//                     let sqryData = "";
//                     if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                         dataItem.value.forEach((item) => {

//                             count++;

//                             // if (isNaN(item.value)) {
//                                 query = query.replace("$p" + count, "'" + item.value + "'");
//                             // } else {
//                             //     query = query.replace("$p" + count, item.value);
//                             // }
//                         })


                        // } else {
//                         count++;
//                         // if (isNaN(dataItem.value.value)) {
//                             query = query.replace("$p" + count, "'" + dataItem.value.value + "'");
//                         // } else {
//                         //     query = query.replace("$p" + count, dataItem.value.value);
//                         // }
                        // }


//                 } else if (dataItem.items.sforeigncolumnname !== undefined &&
//                     dataItem.items.sforeigncolumnname !== "") {

//                     if (dataItem.symbolObject.items["ismulti"] && dataItem.symbolObject.items["ismulti"] === true) {

//                         dataItem.value.forEach((item) => {

//                             count++;

//                             // if (isNaN(item.value)) {
//                                 query = query.replace("$p" + count, "'" + item.value + "'");
//                             // } else {
//                             //     query = query.replace("$p" + count, item.value);
//                             // }
//                         })


                        // } else {
//                         count++;
//                         // if (isNaN(dataItem.value.value)) {
//                             query = query.replace("$p" + count, "'" + dataItem.value.value + "'");
//                         // } else {
//                         //     query = query.replace("$p" + count, dataItem.value.value);
//                         // }
                        // }

//                 } else if (dataItem.items.columntype === ColumnType.DATATIME
//                     || dataItem.items.columntype === ColumnType.DATE && dataItem.symbolObject.items.isInputVisible === true
//                     && (dataItem.symbolObject.items.symbolType === 5 || dataItem.symbolObject.items.symbolType === 1)) {

//                     count++;
//                     query = query.replace("$p" + count, "'" + format(new Date(dataItem.value), "yyyy-MM-dd HH:mm:ss.SS") + "'");


//                 } else {
//                     count++;
//                     query = query.replace("$p" + count, "'" + dataItem.value + "'");
//                 }

//             });
//             if (query && query.includes("$L")) {
//                 query = query.replaceAll("$L", "'" + this.props.Login.userInfo.slanguagetypecode + "'");
//             }
//             const inputParam = {
//                 sgeneratedquery: query ,//selectedRecord["sgeneratedquery"],
//                 selectedRecord,
//                 columnList: this.props.Login.viewColumnListByRule && this.props.Login.viewColumnListByRule ||  this.props.Login.viewColumnList, //selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"] || this.props.Login.viewColumnListByRule,
//                 userInfo: this.props.Login.userInfo,
//                 selectFields: selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"] || this.props.Login.selectFields,
//             }
//             this.props.executeQueryForQueryBuilder(inputParam);
//         } else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_QUERYNOTAVAILABLE" }));
//         }
//     }



//     deleteRule = (groupIndex, index) => {
//         let addGroupList = this.props.Login.addGroupList;
//         const selectedRecord = this.state.selectedRecord;
//         addGroupList[groupIndex] = addGroupList[groupIndex] - 1;
//         // selectedRecord[`button_and_${index}`] && delete selectedRecord[`button_and_${index}`];
//         // selectedRecord[`button_or_${index}`] && delete selectedRecord[`button_or_${index}`];
//         // selectedRecord[`notoperator_${index}`] && delete selectedRecord[`notoperator_${index}`];

//         if (addGroupList[groupIndex] === 0) {
//             addGroupList.splice(groupIndex, 1);
//             selectedRecord["groupList"].splice(groupIndex, 1);
//         } else {
//             selectedRecord["groupList"][groupIndex].splice(index, 1);
//         }

//         // this.clearSelectedRule(selectedRecord, index);
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { addGroupList, selectedRecord }
//         }
//         this.props.updateStore(updateInfo);
//         this.generateFilterQuery(selectedRecord);
//     }

//     clearSelectedRule(selectedRecord,groupIndex, index,viewMasterListByRule) {
//         selectedRecord['groupList'][groupIndex][index]["sinputname"] && delete ['groupList'][groupIndex][index]["sinputname"];
//         selectedRecord['groupList'][groupIndex][index]["ssymbolname"] && delete  selectedRecord['groupList'][groupIndex][index]["ssymbolname"] ;
//         selectedRecord['groupList'][groupIndex][index]["snumericinput"] && delete  selectedRecord['groupList'][groupIndex][index]["snumericinput"];
//         selectedRecord['groupList'][groupIndex][index]["columnname"]&& delete selectedRecord['groupList'][groupIndex][index]["columnname"];
//         selectedRecord['groupList'][groupIndex][index]["snumericinputtwo"] && delete selectedRecord['groupList'][groupIndex][index]["snumericinputtwo"];
//         selectedRecord['groupList'][groupIndex][index]["dateinput"] && delete selectedRecord['groupList'][groupIndex][index]["dateinput"];
//         selectedRecord['groupList'][groupIndex][index]["dateinputtwo"] && delete selectedRecord['groupList'][groupIndex][index]["dateinputtwo"];
//         viewMasterListByRule=[];
   
//     }
 
//     clearRule = () => {
//         const sviewname = this.state.selectedRecord.sviewname || "";
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { addRuleList: [], selectedRecord: { sviewname }, sqlQuery: false }
//         }
//         this.props.updateStore(updateInfo);
//     }

//     resetRule = () => {

//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 addRuleList: [], addGroupList: [],
//                 addAggregateList: [], addOrderbyList: []
//             }
//         }
//         this.props.updateStore(updateInfo);
//         this.setState({
//             selectedRecord: {}
//         });

//     }

//     onSymbolChange = (comboData, fieldName, groupIndex, index) => {

//         let { selectedRecord } = this.state;
//         const oldSelectedRecord = selectedRecord["groupList"][groupIndex][index][fieldName] || {};
     


//         let val={...selectedRecord["groupList"][groupIndex][index]}

//         val ={...val,[fieldName]:comboData} ;
       
//         const items ={...val["columnname"].items};
       
//         val={...val,columnname:{...val.columnname,items:{...val.columnname.items,needmasterdata:val.columnname.items.needmasterdata!==undefined?comboData.items.needmasterdata  : false}}}

//      // selectedRecord["groupList"][groupIndex][index]["columnname"]["items"]["needmasterdata"] = items.needmasterdata!==undefined?comboData.items.needmasterdata  : false;
//     // selectedRecord["groupList"][groupIndex][index]= {...val}
//     //    this.setState(selectedRecord["groupList"][groupIndex][index]["columnname"]["items"]["needmasterdata"]);
//        if (comboData.items.symbolType === 2 || comboData.items.symbolType === 3) {
//         val[items["valuemember"]] && delete val[items["valuemember"]];
//         val[items["foreigncolumnname"]] && delete val[items["foreigncolumnname"]];
//         val["sinputname"] && delete val["sinputname"];
//         } else if (comboData.items.symbolType === 5 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType !== 5) {
//             val["snumericinput"] && delete val["snumericinput"];
//             val["snumericinputtwo"] && delete val["snumericinputtwo"];
//         } else if ((comboData.items.symbolType === 6 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType === 1)
//             || (comboData.items.symbolType === 1 && oldSelectedRecord.items && oldSelectedRecord.items.symbolType === 6)) {
//                 val[`${items.sforeigncolumnname}`] && delete val[`${items.sforeigncolumnname}`];
//                 val[`${items.valuemember}`] && delete val[`${items.valuemember}`];
//         } else {

//         }
    // selectedRecord["groupList"][groupIndex][index]= {...val}

//         this.generateFilterQuery(selectedRecord);
//     }

//     onInputChange = (event, type, groupIndex, index) => {
//         let selectedRecord = this.state.selectedRecord;
//         if (type === 2) {
//             const inputValue = event.target.value;
//             if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
//                 selectedRecord["groupList"][groupIndex][index][event.target.name] = event.target.value;
//             }

//         }
//         else if (type === 1) {
//             selectedRecord["groupList"][groupIndex][index][event.target.name] = event.target.checked;
//         }
//         else if (type === 3) {
//             selectedRecord["groupList"][groupIndex][index][event.target.name] = event.target.value;
//         }
//         else {
//             selectedRecord[event.target.name] = event.target.value;
//         }
//         this.setState({ selectedRecord });
//         this.generateFilterQuery(selectedRecord);
//     }

//     generateFilterQuery = (selectedRecord) => {

//         const addGroupList = this.props.Login.addGroupList;
//         jsonSql.setDialect('mssql');
//         let databaseCondition = [];
//         let displayCondition = [];
//         let databaseConditionParam = [];
//         let fieldWithValue = [];
//         let notOperator = false;
//         if (addGroupList && addGroupList.length > 0) {

//             let groupConditionDatabase = [];
//             let groupConditionDatabaseParam = [];
//             let groupConditionDisplay = [];


//             addGroupList.forEach((items, groupIndex) => {
//                 let symbolObject = {};


//                 databaseCondition = [];
//                 databaseConditionParam = [];
//                 displayCondition = [];

//                 [...Array(items)].map((data, index) => {

//                     if (selectedRecord["groupList"]&&selectedRecord["groupList"][groupIndex]&&selectedRecord["groupList"][groupIndex][index]&&selectedRecord["groupList"][groupIndex][index]["columnname"]) {
//                         symbolObject = selectedRecord["groupList"][groupIndex][index]["ssymbolname"] && selectedRecord["groupList"][groupIndex][index]["ssymbolname"].items && selectedRecord["groupList"][groupIndex][index]["ssymbolname"].items || {};

//                         const current_button_and = selectedRecord["groupList"][groupIndex][`button_and`];
//                         const current_button_or = selectedRecord["groupList"][groupIndex][`button_or`];
//                         const next_button_and = selectedRecord["groupList"][groupIndex][`button_and`];
//                         const next_button_or = selectedRecord["groupList"][groupIndex][`button_or`] ? selectedRecord["groupList"][groupIndex][`button_or`] : false;

//                         let inputname = selectedRecord["groupList"][groupIndex][index]["sinputname"];
//                         const symbolname = symbolObject.symbol;
//                         let numericinput = selectedRecord["groupList"][groupIndex][index]["snumericinput"];
//                         const columnLabel = selectedRecord["groupList"][groupIndex][index]["columnname"].label;
//                         const columnValue = selectedRecord["groupList"][groupIndex][index]["columnname"].value;
//                         const snumericinputtwo = selectedRecord["groupList"][groupIndex][index]["snumericinputtwo"];
//                         let columnName = undefined;
//                         const needmasterdata = selectedRecord["groupList"][groupIndex][index]["columnname"].items.needmasterdata ?
//                             selectedRecord["groupList"][groupIndex][index]["columnname"].items.needmasterdata : false;

//                         if (selectedRecord["groupList"][groupIndex][index]["columnname"].items.needmasterdata) {
//                             columnName = selectedRecord["groupList"][groupIndex][index]["columnname"].items.valuemember;
//                         } else if (selectedRecord["groupList"][groupIndex][index]["columnname"].items.sforeigncolumnname) {
//                             columnName = selectedRecord["groupList"][groupIndex][index]["columnname"].items.sforeigncolumnname;
//                         }
//                         const dateinput = selectedRecord["groupList"][groupIndex][index]["dateinput"] && format(new Date(selectedRecord["groupList"][groupIndex][index]["dateinput"]), "yyyy-MM-dd HH:mm:ss.SS")//selectedRecord["dateinput_" + index];
//                         const dateinputtwo = selectedRecord["groupList"][groupIndex][index]["dateinputtwo"] && format(new Date(selectedRecord["groupList"][groupIndex][index]["dateinputtwo"]), "yyyy-MM-dd HH:mm:ss.SS")//selectedRecord["dateinputtwo_" + index];

//                         if (symbolObject && inputname) {
//                             if (symbolObject.symbolType === 4) {
//                                 const showInputValue = inputname;
//                                 const index1 =  symbolObject.replacewith&&symbolObject.replacewith.indexOf('_');
//                                 inputname =  symbolObject.replacewith&&symbolObject.replacewith.substr(0, index1) + inputname + symbolObject.replacewith.substr(index1 + 1);
//                                 inputname = inputname.slice(1, inputname.length - 1);

//                                 databaseCondition.push({ [columnValue]: { [symbolname]: inputname } });
//                                 displayCondition.push({ [columnLabel]: { [symbolname]: inputname } });
//                                 databaseConditionParam.push({ [columnValue]: { [symbolname]: inputname } });
//                                 fieldWithValue.push({ columnName: columnValue, value: inputname, showInputValue: showInputValue, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             } else {
//                                 databaseCondition.push({ [columnValue]: { [symbolname]: inputname } });
//                                 displayCondition.push({ [columnLabel]: { [symbolname]: inputname } });
//                                 databaseConditionParam.push({ [columnValue]: { [symbolname]: inputname } });
//                                 fieldWithValue.push({ columnName: columnValue, value: inputname, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             }
//                         } else if (symbolObject && numericinput && symbolObject.symbolType !== 5) {
//                             databaseCondition.push({ [columnValue]: { [symbolname]: numericinput } });
//                             displayCondition.push({ [columnLabel]: { [symbolname]: numericinput } });
//                             databaseConditionParam.push({ [columnValue]: { [symbolname]: numericinput } });
//                             fieldWithValue.push({ columnName: columnValue, value: numericinput, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                         } else if (symbolObject && symbolObject.symbolType === 2
//                             || symbolObject && symbolObject.symbolType === 3) {
//                             databaseCondition.push({ [columnValue]: { [symbolname]: '' } });
//                             displayCondition.push({ [columnLabel]: { [symbolname]: '' } });
//                             databaseConditionParam.push({ [columnValue]: { [symbolname]: '' } });
//                             fieldWithValue.push({ columnName: columnValue, value: '', symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                         } else if (symbolObject && numericinput && snumericinputtwo && symbolObject.symbolType === 5) {
//                             if (symbolObject.symbol === "") {
//                                 const tempValue = [{ [columnValue]: { [symbolObject.replacewith[0]]: +numericinput } },
//                                 { [columnValue]: { [symbolObject.replacewith[1]]: +snumericinputtwo } }];
//                                 const tempValue1 = [{ [columnLabel]: { [symbolObject.replacewith[0]]: +numericinput } },
//                                 { [columnLabel]: { [symbolObject.replacewith[1]]: +snumericinputtwo } }];
//                                 databaseCondition.push(tempValue);
//                                 displayCondition.push(tempValue1);
//                                 databaseConditionParam.push(tempValue);

//                             } else {
//                                 const tempValue = [
//                                     {
//                                         [symbolObject.symbol]: [{ [columnValue]: { [symbolObject.replacewith[0]]: +numericinput } },
//                                         { [columnValue]: { [symbolObject.replacewith[1]]: +snumericinputtwo } }]
//                                     }
//                                 ];
//                                 const tempValue1 = [
//                                     {
//                                         [symbolObject.symbol]: [{ [columnLabel]: { [symbolObject.replacewith[0]]: +numericinput } },
//                                         { [columnLabel]: { [symbolObject.replacewith[1]]: +snumericinputtwo } }]
//                                     }
//                                 ];
//                                 databaseCondition.push(tempValue);
//                                 displayCondition.push(tempValue1);
//                                 databaseConditionParam.push(tempValue);
//                             }
//                         } else if (symbolObject && symbolObject.symbolType === 6 && columnName && selectedRecord["groupList"][groupIndex][index][columnName]) {

//                             const data = selectedRecord["groupList"]&&selectedRecord["groupList"][groupIndex]&&selectedRecord["groupList"][groupIndex][index]&&selectedRecord["groupList"][groupIndex][index][columnName] && selectedRecord["groupList"][groupIndex][index][columnName].map(item => { return "'" + item.value + "'" }) || [];
//                             const data1 = selectedRecord["groupList"]&&selectedRecord["groupList"][groupIndex]&&selectedRecord["groupList"][groupIndex][index]&&selectedRecord["groupList"][groupIndex][index][columnName] && selectedRecord["groupList"][groupIndex][index][columnName].map(item => { return item.label }) || [];
//                             if (data.length > 0) {
//                                 if (needmasterdata) {
//                                     databaseCondition.push({ [selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember]: { [symbolname]: data } });
//                                     databaseConditionParam.push({ [selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember]: { [symbolname]: data } });
//                                     fieldWithValue.push({ columnName: selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember, value: selectedRecord["groupList"][groupIndex][index][columnName].map(item => { return item }), symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                                 } else {
//                                     databaseCondition.push({ [columnValue]: { [symbolname]: data } });
//                                     databaseConditionParam.push({ [columnValue]: { [symbolname]: data } });
//                                     fieldWithValue.push({ columnName: selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember, value: selectedRecord["groupList"][groupIndex][index][columnName].map(item => { return item }), symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                                 }
//                             }
//                             if (data1.length > 0) {
//                                 displayCondition.push({ [columnLabel]: { [symbolname]: data1 } });
//                             }
//                             // }
//                         } else if (symbolObject && columnName && symbolObject.isInputVisible && selectedRecord["groupList"][groupIndex][index][columnName]) {
//                             if (needmasterdata) {
//                                 databaseCondition.push({ [selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].value } });
//                                 displayCondition.push({ [columnLabel]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].label } });
//                                 databaseConditionParam.push({ [selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].label } });
//                                 fieldWithValue.push({ columnName: selectedRecord["groupList"][groupIndex][index]["columnname"].items.viewvaluemember, value: selectedRecord["groupList"][groupIndex][index][columnName], symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             } else {
//                                 databaseCondition.push({ [columnValue]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].value } });
//                                 displayCondition.push({ [columnLabel]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].label } });
//                                 databaseConditionParam.push({ [columnValue]: { [symbolname]: selectedRecord["groupList"][groupIndex][index][columnName].label } });
//                                 fieldWithValue.push({ columnName: columnValue, value: selectedRecord["groupList"][groupIndex][index][columnName], symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             }
//                         } else if (symbolObject && dateinput && symbolObject.symbolType !== 5) {
//                             databaseCondition.push({ [columnValue]: { [symbolname]: dateinput } });
//                             displayCondition.push({ [columnLabel]: { [symbolname]: dateinput } });
//                             databaseConditionParam.push({ [columnValue]: { [symbolname]: dateinput } });
//                             fieldWithValue.push({ columnName: columnValue, value: dateinput, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                         } else if (symbolObject && dateinput && dateinputtwo && symbolObject.symbolType === 5) {
//                             if (symbolObject.symbol === "") {
//                                 const tempValue = [{ [columnValue]: { [symbolObject.replacewith[0]]: dateinput } },
//                                 { [columnValue]: { [symbolObject.replacewith[1]]: dateinputtwo } }];
//                                 const tempValue1 = [{ [columnLabel]: { [symbolObject.replacewith[0]]: dateinput } },
//                                 { [columnLabel]: { [symbolObject.replacewith[1]]: dateinputtwo } }];
//                                 databaseCondition.push(tempValue);
//                                 displayCondition.push(tempValue1);
//                                 databaseConditionParam.push(tempValue);
//                                 fieldWithValue.push({ columnName: columnValue, value: dateinput, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                                 fieldWithValue.push({ columnName: columnValue, value: dateinputtwo, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             } else {
//                                 const tempValue = [
//                                     {
//                                         [symbolObject.symbol]: [{ [columnValue]: { [symbolObject.replacewith[0]]: dateinput } },
//                                         { [columnValue]: { [symbolObject.replacewith[1]]: dateinputtwo } }]
//                                     }
//                                 ];
//                                 const tempValue1 = [
//                                     {
//                                         [symbolObject.symbol]: [{ [columnLabel]: { [symbolObject.replacewith[0]]: dateinput } },
//                                         { [columnLabel]: { [symbolObject.replacewith[1]]: dateinputtwo } }]
//                                     }
//                                 ];
//                                 databaseCondition.push(tempValue);
//                                 displayCondition.push(tempValue1);
//                                 databaseConditionParam.push(tempValue);
//                                 fieldWithValue.push({ columnName: columnValue, value: dateinput, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                                 fieldWithValue.push({ columnName: columnValue, value: dateinputtwo, symbolObject: selectedRecord["groupList"][groupIndex][index]["ssymbolname"], items: selectedRecord["groupList"][groupIndex][index]["columnname"].items });
//                             }
//                         }


//                     } else {
//                         this.groupByFunction(selectedRecord, databaseCondition, displayCondition);
                            // }
//                 });

//                 if (selectedRecord["groupList"] &&selectedRecord["groupList"].length>0&& selectedRecord["groupList"][groupIndex][`button_and`] === true) {

//                     if (selectedRecord["groupList"][groupIndex][`button_not`] === true) {
//                         groupConditionDisplay.push([{ $not: [{ $and: [...displayCondition] }] }]);
//                         groupConditionDatabase.push([{ $not: [{ $and: [...databaseCondition] }] }]);
//                         groupConditionDatabaseParam.push([{ $not: [{ $and: [...databaseConditionParam] }] }]);
//                     } else {
//                         groupConditionDisplay.push([{ $and: [...displayCondition] }]);
//                         groupConditionDatabase.push([{ $and: [...databaseCondition] }]);
//                         groupConditionDatabaseParam.push([{ $and: [...databaseConditionParam] }]);
//                     }

//                 } else if (selectedRecord["groupList"]&&selectedRecord["groupList"].length>0&&selectedRecord["groupList"][groupIndex][`button_or`] === true) {

//                     if (selectedRecord["groupList"][groupIndex][`button_not`] === true) {
//                         groupConditionDisplay.push([{ $not: [{ $or: [...displayCondition] }] }]);
//                         groupConditionDatabase.push([{ $not: [{ $or: [...databaseCondition] }] }]);
//                         groupConditionDatabaseParam.push([{ $not: [{ $or: [...databaseConditionParam] }] }]);
//                     }
//                     else {
//                         groupConditionDisplay.push([{ $or: [...displayCondition] }]);
//                         groupConditionDatabase.push([{ $or: [...databaseCondition] }]);
//                         groupConditionDatabaseParam.push([{ $or: [...databaseConditionParam] }]);
//                     }

//                 } else {
//                     groupConditionDisplay.push([{ ...displayCondition }]);
//                     groupConditionDatabase.push([{ ...databaseCondition }]);
//                     groupConditionDatabaseParam.push([{ ...databaseConditionParam }]);
//                 }


//                 let finalConditionDisplay = undefined;
//                 let finalConditionDatabase = undefined;
//                 let finalConditionDatabaseParam = undefined;
//                 if (addGroupList.length - 1 === 0) {


//                     finalConditionDisplay = [...groupConditionDisplay];
//                     finalConditionDatabase = [...groupConditionDatabase];
//                     finalConditionDatabaseParam = [...groupConditionDatabaseParam];


//                 } else if (addGroupList.length - 1 === groupIndex) {
//                     if (selectedRecord["groupList"]&&selectedRecord["groupList"][0]&&selectedRecord["groupList"][0][`button_and`] === true) {


//                         finalConditionDisplay = [{ $and: [...groupConditionDisplay] }];
//                         finalConditionDatabase = [{ $and: [...groupConditionDatabase] }];
//                         finalConditionDatabaseParam = [{ $and: [...groupConditionDatabaseParam] }];


//                     } else if (selectedRecord["groupList"]&&selectedRecord["groupList"][0]&&selectedRecord["groupList"][0][`button_or`] === true) {


//                         finalConditionDisplay = [{ $or: [...groupConditionDisplay] }];
//                         finalConditionDatabase = [{ $or: [...groupConditionDatabase] }];
//                         finalConditionDatabaseParam = [{ $or: [...groupConditionDatabaseParam] }];


//                     } else {


//                         finalConditionDisplay = [{ ...groupConditionDisplay }];
//                         finalConditionDatabase = [{ ...groupConditionDatabase }];
//                         finalConditionDatabaseParam = [{ ...groupConditionDatabaseParam }];


//                     }

//                 }

//                 if (this.props.Login.sqlQuery) {
//                     const databaseSQLQuery = jsonSql.build({
//                         type: 'select',
//                         table: selectedRecord["stablename_0"].value,
//                         condition: databaseCondition
//                     });
//                     const displaySQLQuery = jsonSql.build({
//                         type: 'select',
//                         table: selectedRecord["stablename_0"].label,
//                         condition: displayCondition
//                     });
//                     selectedRecord["sgeneratedquery"] = databaseSQLQuery.query;
//                     selectedRecord["sdisplayquery"] = displaySQLQuery.query;
//                 } else {


//                     // const fields = this.props.Login.viewColumnList;
//                     const dbFields = selectedRecord["filtercolumns"];

//                     let fieldList = [];
//                     let dbfieldList = [];
//                     let groupByAggregateFields = [];
//                     let groupByFields = [];

//                     let groupByAggregateFieldsDisplay = [];
//                     let groupByFieldsDisplay = [];

//                     let orderByDefault = [];
//                     let orderByCustom = {};

//                     let orderByDefaultDisplay = [];
//                     let orderByCustomDisplay = {};

//                     selectedRecord["orderby"] && selectedRecord["orderby"].forEach(data => {
//                         if (data["ordertype"] && data["ordertype"].value === 2) {
//                             orderByCustom[data["columnname"].items.columnname] = -1
//                             orderByCustomDisplay[data["columnname"].label] = -1
//                         } else {
//                             orderByCustom[data["columnname"].items.columnname] = 1
//                             orderByCustomDisplay[data["columnname"].label] = 1
//                         }
//                     })
//                     if (selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0) {
//                         selectedRecord["aggregate"].forEach(data => {
//                             if (data["aggfunctionname"] && data["aggfunctionname"].label !== '') {
//                                 groupByAggregateFields.push({
//                                     func: {
//                                         name: data["aggfunctionname"].label,
//                                         args: [{ field: data["columnname"].items.columnname }]

//                                     }, alias: data["columnname"].items.columnname
//                                 })
//                                 groupByAggregateFieldsDisplay.push({
//                                     func: {
//                                         name: data["aggfunctionname"].label,
//                                         args: [{ field: data["columnname"].label }]

//                                     }
//                                 })

//                             } else {
//                                 groupByAggregateFields.push(data["columnname"].items.columnname);
//                                 groupByFields.push(data["columnname"].items.columnname);
//                                 groupByAggregateFieldsDisplay.push(data["columnname"].label);
//                                 groupByFieldsDisplay.push(data["columnname"].label);
//                             }
//                         })
//                     }
//                     // fields.forEach(item => {
//                     //     fieldList.push(item.label);
//                     // })
//                     dbFields&& dbFields.length>0&&dbFields.forEach(item => {
//                         if (item.items?item.items.languagecode :false === true || item.item.items?item.item.items.languagecode : false=== true ) {
//                             // let languageCode = this.props.Login.userInfo.slanguagetypecode ? this.props.Login.userInfo.slanguagetypecode : "en-US";
//                             let fieldValue = item.value + "\"->> $L as \"" + item.value;//item.value.replace(item.value, item.value + "->> $L as " + item.value);
//                             // dbfieldList.push( ""+fieldValue+"");
//                             dbfieldList.push(fieldValue);

//                         } else {
//                             // dbfieldList.push(""+item.value+"");
//                             dbfieldList.push(item.value);
//                         }
                    //     fieldList.push(item.label);
                    // })
//                     const databaseSQLQueryParam = jsonSqlParam.build({
//                         type: 'select',
//                         table:  selectedRecord["sviewname"]&&selectedRecord["sviewname"].value,
//                         fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFields : dbfieldList,
//                         group: groupByFields,
//                         sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustom : "",
//                         condition:selectedRecord["groupList"]&&selectedRecord["groupList"].length>0&& finalConditionDatabaseParam ||[]
//                     });
//                     const databaseSQLQuery = jsonSql.build({
//                         type: 'select',
//                         table: selectedRecord["sviewname"]&& selectedRecord["sviewname"].value,
//                         fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFields : dbfieldList,
//                         group: groupByFields,
//                         sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustom : "",
//                         condition:selectedRecord["groupList"]&&selectedRecord["groupList"].length>0&& finalConditionDatabase ||[]
//                     });
//                     const displaySQLQuery = jsonSql.build({
//                         type: 'select',
//                         fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFieldsDisplay : fieldList,
//                         group: groupByFieldsDisplay,
//                         table:  selectedRecord["sviewname"]&&selectedRecord["sviewname"].label,
//                         sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustomDisplay : "",
//                         condition: selectedRecord["groupList"]&&selectedRecord["groupList"].length>0&&finalConditionDisplay ||[] //&& finalCondition.length === 1 ? finalCondition[0] : finalCondition
//                     });
//                     // databaseSQLQueryParam.query.split('"').join('')
//                     // databaseSQLQuery.query.split('"').join('')

//                     // let dbQueryParam = databaseSQLQueryParam.query.split('"').join('');
//                     // let dbQuery = databaseSQLQuery.query.split('"').join('');
//                     let dbQueryParam = databaseSQLQueryParam.query;
//                     let dbQuery = databaseSQLQuery.query;
//                     selectedRecord["squerywithparam"] = dbQueryParam.replace("like", "Ilike");

//                     selectedRecord["sgeneratedquery"] = selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"].length > 0 ?
//                         dbQuery.replace("like", "Ilike") : "";
//                     selectedRecord["sdisplayquery"] = selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"].length > 0 ?
//                         displaySQLQuery.query.replace("like", "Ilike") : "";

//                     selectedRecord["sdefaultvalue"] = fieldWithValue;
                        

//                     const paramIndex = [];
//                     if (fieldWithValue.length > 0) {
//                         fieldWithValue.forEach((item, i) => {
//                             if (item.symbolObject.items.symbolType === 4) {
//                                 paramIndex.push("$p" + (i + 1));
//                             }
//                         })
//                     }

                    //   if (paramIndex.length > 0) {
                    //     paramIndex.forEach(data => {
                    //         selectedRecord["squerywithparam"] = selectedRecord["squerywithparam"].replace(data, data + " COLLATE pg_catalog.default ");
                    //     })
                    // }
//                     //   if (paramIndex.length > 0) {
//                     //     paramIndex.forEach(data => {
//                     //         selectedRecord["squerywithparam"] = selectedRecord["squerywithparam"].replace(data, data + " COLLATE pg_catalog.default ");
//                     //     })
//                     // }
//                     // if (selectedRecord["squerywithparam"].indexOf('Ilike') > 0) {

//                     //     let newQuery = selectedRecord["squerywithparam"];

//                     //     while (newQuery.indexOf("Ilike") !== -1) {

//                     //         const paramLabelStartIndex = newQuery.indexOf("Ilike");

//                     //         const paramLabel = newQuery.substring(paramLabelStartIndex, newQuery.length);



//                     //     }
//                     // }
                    //     }
//                 this.setState({ selectedRecord });
//             });
//         } else {
//             this.groupByFunction(selectedRecord, databaseCondition, displayCondition,databaseConditionParam);
                    // }
//         this.setState({ selectedRecord });// for temporary
//     }

//     groupByFunction(selectedRecord, databaseCondition, displayCondition,databaseConditionParam) {
//         let groupByAggregateFields = [];
//         let groupByFields = [];

//         let groupByAggregateFieldsDisplay = [];
//         let groupByFieldsDisplay = [];

//         let orderByDefault = [];
//         let orderByCustom = {};

//         let orderByDefaultDisplay = [];
//         let orderByCustomDisplay = {};

//         // if (selectedRecord["customorderby"] && selectedRecord["customorderby"] === true) {
//         selectedRecord["orderby"] && selectedRecord["orderby"].forEach(data => {
//             if (data["ordertype"] && data["ordertype"].value === 2) {
//                 orderByCustom[data["columnname"].items.columnname] = -1
//                 orderByCustomDisplay[data["columnname"].label] = -1
        // } else {
//                 orderByCustom[data["columnname"].items.columnname] = 1
//                 orderByCustomDisplay[data["columnname"].label] = 1
//             }
        //     })
//         // } else {
//         //     selectedRecord["orderby"] && selectedRecord["orderby"].forEach(data => {
//         //         orderByDefault.push(data["columnname"].items.columnname);
//         //         orderByDefaultDisplay.push(data["columnname"].label);
//         //     })
//         // }


//         // if (selectedRecord["groupby"] && selectedRecord["groupby"] === true) {
//         if (selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0) {
//             selectedRecord["aggregate"].forEach(data => {
//                 if (data["aggfunctionname"] && data["aggfunctionname"].label !== '') {
//                     groupByAggregateFields.push({
//                         func: {
//                             name: data["aggfunctionname"].label,
//                             args: [{ field: data["columnname"].items.columnname }]

//                         }, alias: data["columnname"].items.columnname
//                     })
//                     groupByAggregateFieldsDisplay.push({
//                         func: {
//                             name: data["aggfunctionname"].label,
//                             args: [{ field: data["columnname"].label }]

//                         }
//                     })

//                 } else {
//                     groupByAggregateFields.push(data["columnname"].items.columnname);
//                     groupByFields.push(data["columnname"].items.columnname);
//                     groupByAggregateFieldsDisplay.push(data["columnname"].label);
//                     groupByFieldsDisplay.push(data["columnname"].label);
//                 }
//             })

//             const databaseSQLQuery = jsonSql.build({
//                 type: 'select',
//                 table:  selectedRecord["sviewname"]&&selectedRecord["sviewname"].value,
//                 fields:selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFields :dbfieldList,
//                 group: groupByFields,
//                 sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustom : "",
//                 condition: databaseCondition
//             });
//             const displaySQLQuery = jsonSql.build({
//                 type: 'select',
//                 fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFieldsDisplay : fieldList,
//                 group: groupByFieldsDisplay,
//                 sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustomDisplay : "",
//                 table:  selectedRecord["sviewname"]&&selectedRecord["sviewname"].label,
//                 condition: displayCondition
//             });
//             selectedRecord["sgeneratedquery"] = databaseSQLQuery.query;
//             selectedRecord["sdisplayquery"] = displaySQLQuery.query;
//             this.setState({ selectedRecord });
//         }

//         const dbFields = selectedRecord["filtercolumns"];
//                     let fieldList = [];
//                     let dbfieldList = [];
//         dbFields&&dbFields.length>0 &&
//         dbFields.forEach(item => {
//             if (item.items?item.items.languagecode :false === true || item.item.items?item.item.items.languagecode : false=== true ) {
//                 // let languageCode = this.props.Login.userInfo.slanguagetypecode ? this.props.Login.userInfo.slanguagetypecode : "en-US";
//                 let fieldValue = item.value + "\"->> $L as \"" + item.value;//item.value.replace(item.value, item.value + "->> $L as " + item.value);
//                 // dbfieldList.push( ""+fieldValue+"");
//                 dbfieldList.push(fieldValue);

//             } else {
//                 // dbfieldList.push(""+item.value+"");
//                 dbfieldList.push(item.value);
//             }
//             fieldList.push(item.label);
//         })

//         const databaseSQLQueryParam = jsonSqlParam.build({
//             type: 'select',
//             table:selectedRecord["sviewname"]&& selectedRecord["sviewname"].value,
//             fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFields : dbfieldList,
//             group: groupByFields,
//             sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustom : "",
//             condition: databaseConditionParam
//         });

//         const databaseSQLQuery = jsonSql.build({
//             type: 'select',
//             table: selectedRecord["sviewname"]&& selectedRecord["sviewname"].value, 
//             fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFields :dbfieldList,
//             group: groupByFields,
//             sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustom : "",
//             condition: databaseCondition
//         });
//         const displaySQLQuery = jsonSql.build({
//             type: 'select',
//             fields: selectedRecord["aggregate"] && selectedRecord["aggregate"].length > 0 ? groupByAggregateFieldsDisplay : fieldList,
//             group: groupByFieldsDisplay,
//             sort: selectedRecord["orderby"] && selectedRecord["orderby"].length > 0 ? orderByCustomDisplay : "",
//             table: selectedRecord["sviewname"]&& selectedRecord["sviewname"].label ,
//             condition: displayCondition
//         });
//         // selectedRecord["sgeneratedquery"] = databaseSQLQuery.query;
//         // selectedRecord["sdisplayquery"] = displaySQLQuery.query;

//          const dbQuery = databaseSQLQuery.query;
//          let dbQueryParam = databaseSQLQueryParam.query;
//          selectedRecord["squerywithparam"] = dbQueryParam.replace("like", "Ilike");

//          const paramIndex = [];
//          if (paramIndex.length > 0) {
//             paramIndex.forEach(data => {
//                 selectedRecord["squerywithparam"] = selectedRecord["squerywithparam"].replace(data, data + " COLLATE pg_catalog.default ");
//             })
//         }
//         // const displaysqlQuery = displaySQLQuery.query;
        
//         selectedRecord["sgeneratedquery"] = selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"].length > 0 ?
//         dbQuery.replace("like", "Ilike") : "";
//     selectedRecord["sdisplayquery"] = selectedRecord["filtercolumns"] && selectedRecord["filtercolumns"].length > 0 ?
//     displaySQLQuery.query.replace("like", "Ilike") : "";

//         this.setState({ selectedRecord });
//         // }
        // }
//     onConditionClick = (fieldName, index) => {
//         let { selectedRecord } = this.state;
//         if (fieldName === `button_and`) {
//             selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? false : true;
//             selectedRecord["groupList"][index][`button_or`] = false;
//         } else if (fieldName === `button_or`) {
//             selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? false : true;
//             selectedRecord["groupList"][index][`button_and`] = false;
//             // if (selectedRecord["groupList"][index][`notoperator`] && selectedRecord["groupList"][index][`notoperator`] === true) {
//             //     selectedRecord["groupList"][index][`notoperator`] = false;
//             // }
//         } else if (fieldName === `button_not`) {
//             selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? false : true;
            // }
//         else {

//         }
//         this.generateFilterQuery(selectedRecord);
//     }

//     onQueryTypeOnclick = (value) => {

//         const { selectedRecord } = this.state;
//         selectedRecord["selectedQueryType"] = value;
//         let sqlQuery = false;
//         if (value.value === "sql") {
//             sqlQuery = true;
//         }
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { sqlQuery: sqlQuery }
//         }
//         this.props.updateStore(updateInfo);
//         this.setState({ selectedRecord });
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         Login: state.Login
//     }
// }

// export default connect(mapStateToProps, {
//     callService, crudMaster, updateStore, filterColumnData,
//     validateEsignCredential, getSQLQueryDetail, getSQLQueryComboService, comboChangeQueryType,
//     executeUserQuery, comboColumnValues, getColumnNamesByTableName,
//     getTablesName, getModuleFormName, getDatabaseTables, executeQueryForQueryBuilder, getForeignTable,
//     getViewColumns, getMasterData, createQueryBuilder,
//     getParameterFromQuery, getSelectedQueryBuilder, updateQueryBuilder, //getQueryBuilder
// })(injectIntl(QueryBuilder));