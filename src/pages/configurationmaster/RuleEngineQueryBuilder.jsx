// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { injectIntl, FormattedMessage } from 'react-intl';
// import { Row, Col, Card, Nav } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { ReactComponent as Reject } from '../../assets/image/reject.svg'
// import { BuilderBorder, ContionalButton } from './RuleEngineSqlbuilder.styled';
// import OrgTree from 'react-org-tree';

// import { faTrashAlt, faCopy, faPencilAlt, faThumbsUp, faEye } from '@fortawesome/free-solid-svg-icons';
// import { process } from '@progress/kendo-data-query';
// import { toast } from 'react-toastify';
// import ListMaster from '../../components/list-master/list-master.component';
// import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
// import CustomTab from '../../components/custom-tabs/custom-tabs.component'
// import RuleEngineQueryTypeFilter from './RuleEngineQueryTypeFilter';
// import {
//     callService, crudMaster, validateEsignCredential, updateStore,
//     filterColumnData,
//     getSelectedRulesEngine, getRulesEngine, getEditRulesEngine, getRulesEngineAdd
// } from '../../actions';
// import { DEFAULT_RETURN } from '../../actions/LoginTypes';
// import { transactionStatus } from '../../components/Enumeration';
// import { constructOptionList, getControlMap, showEsign, sortData } from '../../components/CommonScript';
// import { MediaLabel } from '../../components/App.styles';
// import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import { Affix } from 'rsuite';
// import BreadcrumbComponent from '../../components/Breadcrumb.Component';
// import { ListWrapper } from '../../components/client-group.styles';
// // import ReactTooltip from 'react-tooltip';
// import PortalModalSlideout from '../../components/portal-modal/portal-modal-slideout';
// import AddRule from './AddRule';
// import { ProductList } from '../product/product.styled'; 
// import DataGrid from '../../components/data-grid/data-grid.component';

// import { stringOperatorData } from './RuleEngineQueryBuilderData';
// import FormInput from '../../components/form-input/form-input.component';


// const jsonSql = require('json-sql')({ separatedValues: false });
// //const jsonSqlParam = require('json-sql')({ separatedValues: true });

// class RuleEngineQueryBuilder extends Component {

//     constructor(props) {
//         super(props);

//         const dataState = {
//             skip: 0,
//             take: props.settings ? parseInt(props.settings[14]) : 5,
//         };
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
//             sectionDataState: { skip: 0, take: 10 },
//             // modalIsOpen: false,
//             parameters: [],
//             // objparam: [],
//             // objDparam: [],
//             queryName: '',
//             // queryResult: [],
//             userRoleControlRights: [],
//             splitChangeWidthPercentage: 28.6,
//             controlMap: new Map(),
//             dataStateUserQuery: dataStateUserQuery,
//             queryTypeName: '',
//             selectedcombo: [],
//             selectedTableType: [],
//             moduleFormName: [],
//             ntableTypeCode: -1,
//             nFormCode: -1,
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
//             enablePropertyPopup: false,
//             enableAutoClick: false, needoutsource: false,
//             queryType: [{ squerytypename: this.props.intl.formatMessage({ id: "IDS_VIEWS" }), nquerytypecode: 1 }, { squerytypename: this.props.intl.formatMessage({ id: "IDS_SQL" }), nquerytypecode: 2 }],
//             //  queryTypeOptions: [{ label: this.props.intl.formatMessage({ id: "IDS_VIEWS" }), views: 1 }, { label: this.props.intl.formatMessage({ id: "IDS_SQL" }), value: 2 }]
//             queryTypeOptions: []
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



//     dataStateChange = (event, ntestparametercode) => {
//         let dataStateObject = this.state.dataStateObject || {}
//         if (ntestparametercode) {
//             dataStateObject = {
//                 ...dataStateObject,
//                 [ntestparametercode]: event.dataState
//             }
//             this.setState({
//                 dataStateObject
//             });
//         }
//         else {
//             this.setState({
//                 dataState: event.dataState
//             });
//         }

//     }
//     dataStateChangetestinitiate = (event) => {
//         this.setState({
//             //  dataResult: process(this.props.Login.queryData, event.dataState),
//             dataStatetestinitiate: event.dataState
//         });
//     }
//     dataStateChangeMain = (event) => {
//         this.setState({
//             dataResultMain: process(this.props.Login.queryDataMain, event.dataStateMain),
//             dataStateMain: event.dataStateMain
//         });
//     }
//     ConfirmDelete = (deleteId) => {
//         this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
//             this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
//             () => this.handleClickDelete(this.props.Login.masterData, deleteId, "openModal"));
//     }
//     handleClickDelete(masterData, ncontrolcode//, modalName
//     ) {
//         const fieldArray = [];
//         const inputParam = {
//             methodUrl: "RulesEngine",
//             classUrl: "rulesengine",
//             inputData: {
//                 "ntransactionrulesenginecode": this.props.Login.masterData.SelectedRulesEngine.ntransactionrulesenginecode,
//                 "nproductcatcode": this.props.Login.masterData.SelectedProductCategory.nproductcatcode,
//                 "userinfo": this.props.Login.userInfo,
//             },
//             operation: "delete", //postParam,
//             displayName: "RulesEngine",
//         }
//         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     loadEsign: true, screenData: { inputParam, masterData },// [modalName]: true,
//                     operation: 'delete', screenName: "RulesEngine", id: "RulesEngine"
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         }
//         else {
//             this.props.crudMaster(inputParam, masterData, undefined
//             );
//         }
//     }


//     approveVersion(masterData, nflag, ncontrolcode//, modalName
//     ) {
//         const fieldArray = [];
//         const inputParam = {
//             methodUrl: "RulesEngine",
//             classUrl: "rulesengine",
//             inputData: {
//                 "ntransactionrulesenginecode": this.props.Login.masterData.SelectedRulesEngine.ntransactionrulesenginecode,
//                 "nproductcatcode": this.props.Login.masterData.SelectedProductCategory.nproductcatcode,
//                 "userinfo": this.props.Login.userInfo, nflag: nflag
//             },
//             operation: "approve", //postParam,
//             displayName: "RulesEngine",
//         }
//         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     loadEsign: true, screenData: { inputParam, masterData },// [modalName]: true,
//                     operation: 'delete', screenName: "RulesEngine", id: "RulesEngine"
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         }
//         else {
//             this.props.crudMaster(inputParam, masterData, undefined
//             );
//         }
//     }


//     createRulesView(items, groupIndex, selectedRecordview) {
//         let design = [];
//         [...Array(items)].map((data, index) => {
//             let stringOperators = stringOperatorData;
//             design.push(
//                 <>
//                     {index > 0 ? selectedRecordview["groupList"][groupIndex]['button_or'] === true ?
//                         <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
//                         >
//                             <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
//                         </ContionalButton> :
//                         selectedRecordview["groupList"][groupIndex]['button_and'] === true ?
//                             <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
//                             >
//                                 <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
//                             </ContionalButton> : "" : ""}
//                     <Row className="mt-3">
//                         <Col md={3}>
//                             {/* <FormSelectSearch
//                                 formGroupClassName="remove-floating-label-margin"
//                                 isSearchable={true}
//                                 name={"stestname"}
//                                 showOption={true}
//                                 options={this.props.Login.rulesOption || []}
//                                 optionId='stestname'
//                                 optionValue='displayname'
//                                 isDisabled={true}
//                                 value={selectedRecordview["groupList"][groupIndex][index] && selectedRecordview["groupList"][groupIndex][index]["stestname"] || ""}
//                             //onChange={value => props.onRuleChange(value, "stestname", groupIndex, index)}
//                             ></FormSelectSearch> */}

//                             <FormInput
//                                 formGroupClassName="remove-floating-label-margin"
//                                 name={`stestname`}
//                                 type="text"
//                                 value={selectedRecordview["groupList"][groupIndex][index] && selectedRecordview["groupList"][groupIndex][index]["stestname"].label}
//                                 disabled={true}
//                             />

//                         </Col>

//                         {
//                             selectedRecordview["groupList"][groupIndex][index]["stestname"] &&
//                             <>
//                                 <Col md={1}>
//                                     <FormInput
//                                         formGroupClassName="remove-floating-label-margin"
//                                         name={`sinputname`}
//                                         type="text"
//                                         value={this.props.intl.formatMessage({ id: "IDS_WITH" })}
//                                         disabled={true}
//                                     />
//                                 </Col>
//                                 <Col md={2}>
//                                     {/* <FormSelectSearch
//                                         formGroupClassName="remove-floating-label-margin"
//                                         formLabel=""
//                                         isSearchable={true}
//                                         name={"orderresulttype"}
//                                         placeholder=""
//                                         showOption={true}
//                                         options={this.props.Login.resultTypeList}
//                                         optionId='nresultypecode'
//                                         optionValue='orderresulttype'
//                                         isDisabled={true}
//                                         value={selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] && selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] || ""}
//                                     //onChange={value => props.onMasterDataChange(value, "orderresulttype", groupIndex, index)}
//                                     >
//                                     </FormSelectSearch> */}
//                                     <FormInput
//                                         formGroupClassName="remove-floating-label-margin"
//                                         name={`orderresulttype`}
//                                         type="text"
//                                         value={selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] && selectedRecordview["groupList"][groupIndex][index]["orderresulttype"].label}
//                                         disabled={true}
//                                     />
//                                 </Col>
//                                 <Col md={2}>
//                                     {/* <FormSelectSearch
//                                         formGroupClassName="remove-floating-label-margin"
//                                         formLabel=""
//                                         isSearchable={true}
//                                         name={"ssymbolname"}
//                                         placeholder=""
//                                         showOption={true}
//                                         options={stringOperators}
//                                         optionId='nvalidationcode'
//                                         optionValue='ssymbolname'
//                                         isDisabled={true}
//                                         value={selectedRecordview["groupList"][groupIndex][index]["ssymbolname"] && selectedRecordview["groupList"][groupIndex][index]["ssymbolname"] || ""}
//                                     // onChange={value => props.onSymbolChange(value, "ssymbolname", groupIndex, index)}
//                                     >
//                                     </FormSelectSearch> */}
//                                     <FormInput
//                                         formGroupClassName="remove-floating-label-margin"
//                                         name={`ssymbolname`}
//                                         type="text"
//                                         value={selectedRecordview["groupList"][groupIndex][index]["ssymbolname"] && selectedRecordview["groupList"][groupIndex][index]["ssymbolname"].label || ""}
//                                         disabled={true}
//                                     />
//                                 </Col>

//                                 <Col md={3}>
//                                     {/* <FormSelectSearch
//                                         formGroupClassName="remove-floating-label-margin"
//                                         isSearchable={true}
//                                         name={`${selectedRecordview["groupList"][groupIndex][index]["stestname"].items && selectedRecordview["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
//                                         showOption={true}
//                                         options={selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] &&
//                                             selectedRecordview["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
//                                             this.props.Login.DiagnosticCaseList : this.props.Login.GradeList}
//                                         optionId={selectedRecordview["groupList"][groupIndex][index]["stestname"].items && selectedRecordview["groupList"][groupIndex][index]["stestname"].items.valuemember}
//                                         optionValue={selectedRecordview["groupList"][groupIndex][index]["stestname"].items && selectedRecordview["groupList"][groupIndex][index]["stestname"].items.displaymember}
//                                         value={selectedRecordview["groupList"][groupIndex][index] &&
//                                             selectedRecordview["groupList"][groupIndex][index]
//                                             [selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] &&
//                                                 selectedRecordview["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' : 'ngradecode'] || ""}
//                                         isDisabled={true}
//                                     ></FormSelectSearch> */}
//                                     <FormInput
//                                         formGroupClassName="remove-floating-label-margin"
//                                         name={`${selectedRecordview["groupList"][groupIndex][index]["stestname"].items && selectedRecordview["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
//                                         type="text"
//                                         value={selectedRecordview["groupList"][groupIndex][index] &&
//                                             selectedRecordview["groupList"][groupIndex][index]
//                                             [selectedRecordview["groupList"][groupIndex][index]["orderresulttype"] &&
//                                                 selectedRecordview["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' : 'ngradecode'].label || ""} disabled={true}
//                                     />
//                                 </Col>

//                             </>
//                         }
//                     </Row>
//                 </>
//             )
//         });
//         return design;
//     }
//     generateRandomColor() {
//         var letters = '0123456789ABCDEF';
//         var color = '#';
//         for (var i = 0; i < 6; i++) {
//             color += letters[Math.floor(Math.random() * 16)];
//         }
//         return color;
//     }
//     ruleflowobject() {
//         let object = {}
//         const labelColor = ['#e63109', '#2fb47d', '#eaa203', '#6554c0'];
//         const labelBGColor = ['#fcd7cd', '#e5f8f1', '#fcf3dd', '#e7e6f5'];
//         const borderColor = ['#e6310', '#c6f6e4', '#fde2a4', '#cbc5f7'];
//         let groupList = this.props.Login.masterData.SelectedRulesEngine['jsondata']
//         let groupListJoins = this.props.Login.masterData.SelectedRulesEngine['jsonuidata'] &&
//             this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['groupListJoins']
//         let children = []
//         let parent = []
//         let grandparent = []
//         // groupList.map((groupobject, index) => {
//         //     if (groupobject.hasOwnProperty('button_or')) {
//         //         children = []
//         //         let rulesList = groupobject['button_or']
//         //         rulesList.map((rule, index) => {
//         //             children.push({ id: index, label: rule['stestname'].label })
//         //         })
//         //         parent.push({ id: index, label: 'button_or', children: children })
//         //     }
//         //     if (groupobject.hasOwnProperty('button_and')) {
//         //         children = []
//         //         let rulesList = groupobject['button_and']
//         //         rulesList.map((rule, index) => {
//         //             children.push({ id: index, label: rule['stestname'].label })
//         //         })
//         //         parent.push({ id: index, label: 'button_and', children: children })
//         //     }
//         // })
        // groupList.map((groupobject, index) => {
        //     if (groupobject.hasOwnProperty('button_or')) {
        //         children = []
        //         let rulesList = groupobject['button_or']
        //         rulesList.map((rule, index) => {
//                     children.push(
//                         //     {
//                         //     id: index, label: rule['stestname'].label, children: [
//                         //         {
//                         //             id: 0, label: this.props.intl.formatMessage({ id: "IDS_WITH" }), children: [
//                         //                 {
//                         //                     id: 0, label: rule['orderresulttype'].label, children: [

//                         //                         {
//                         //                             id: 0, label: rule['ssymbolname'].label, children: [
//                         //                                 {
//                         //                                     id: 0, label: rule['ndiagnosticcasecode'] ? rule['ndiagnosticcasecode'].label :
//                         //                                         rule['ngradecode'].label, children: []
//                         //                                 }
//                         //                             ]
//                         //                         }

//                         //                     ]
//                         //                 }
//                         //             ]
//                         //         }
//                         //     ]
//                         // }
//                         {
//                             id: index, label: <>{(rule['stestname'].label) + " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) + " -> " +
//                                 (rule['orderresulttype'].label) + " -> " +
//                                 (rule['ssymbolname'].label) + " -> " + (rule['orderresulttype'].value === 1 ? rule['ndiagnosticcasecode'].label :
//                                     rule['ngradecode'].label)

//                             }</>
//                         }
//                     )
        //         })
//                 parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_OR" })}</div>, children: children })
        //     }
        //     if (groupobject.hasOwnProperty('button_and')) {
        //         children = []
        //         let rulesList = groupobject['button_and']
        //         rulesList.map((rule, index) => {
//                     children.push(
//                         // {
//                         //     id: index, label: rule['stestname'].label, children: [
//                         //         {
//                         //             id: 0, label: this.props.intl.formatMessage({ id: "IDS_WITH" }), children: [
//                         //                 {
//                         //                     id: 0, label: rule['orderresulttype'].label, children: [

//                         //                         {
//                         //                             id: 0, label: rule['ssymbolname'].label, children: [
//                         //                                 {
//                         //                                     id: 0, label: rule['ndiagnosticcasecode'] ? rule['ndiagnosticcasecode'].label :
//                         //                                         rule['ngradecode'].label, children: []
//                         //                                 }
//                         //                             ]
//                         //                         }

//                         //                     ]
//                         //                 }
//                         //             ]
//                         //         }
//                         //     ]
//                         // }
                        //                         {
//                             id: index, label: <>{

//                                 (rule['stestname'].label) + " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) + " -> " +
//                                 (rule['orderresulttype'].label) + " -> " +
//                                 (rule['ssymbolname'].label) + " -> " + (rule['orderresulttype'].value === 1 ? rule['ndiagnosticcasecode'].label :
//                                     rule['ngradecode'].label)


//                             }</>
                        //                                 }
//                     )
//                 })
//                 parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>, children: children })
                        //                         }
//             if (groupobject.hasOwnProperty('button_not_button_and')) {
//                 children = []
//                 let rulesList = groupobject['button_not_button_and']
//                 rulesList.map((rule, index) => {
//                     children.push(
//                         {
//                             id: index, label: <>{(rule['stestname'].label) + " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) + " -> " +
//                                 (rule['orderresulttype'].label) + " -> " +
//                                 (rule['ssymbolname'].label) + " -> " + (rule['orderresulttype'].value === 1 ? rule['ndiagnosticcasecode'].label :
//                                     rule['ngradecode'].label)

//                             }</>
                        //                 }
//                     )
//                 })
//                 let notarray = [{ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>, children: children }]
//                 parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_NOT" })}</div>, children: notarray })
                        //         }
//             if (groupobject.hasOwnProperty('button_not_button_or')) {
//                 children = []
//                 let rulesList = groupobject['button_not_button_or']
//                 rulesList.map((rule, index) => {
//                     children.push(
//                         {
//                             id: index, label: <>{(rule['stestname'].label) + " -> " + (this.props.intl.formatMessage({ id: "IDS_WITH" })) + " -> " +
//                                 (rule['orderresulttype'].label) + " -> " +
//                                 (rule['ssymbolname'].label) + " -> " + (rule['orderresulttype'].value === 1 ? rule['ndiagnosticcasecode'].label :
//                                     rule['ngradecode'].label)

//                             }</>
            //         }
//                     )
            //             })
//                 let notarray = [{ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_OR" })}</div>, children: children }]
//                 parent.push({ id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_NOT" })}</div>, children: notarray })
            //         }
//             // if (groupListJoins.length > 0) {
//             //     if (groupListJoins[index]) {
//             //         if (groupListJoins[index].hasOwnProperty('button_or') &&
//             //             groupListJoins[index]['button_or'] === true) {
//             //             grandparent.push({ id: index, label: 'button_or', children: parent })
//             //         }
//             //         if (groupListJoins[index].hasOwnProperty('button_and') &&
//             //             groupListJoins[index]['button_and'] === true) {
//             //             grandparent.push({ id: index, label: 'button_and', children: parent })
//             //         }
//             //     }
//             // }
            // })

//         if (groupListJoins !== undefined) {
//             // groupListJoins.map((join, index) => {
//             //     if (index > 0) {
//             //         if (parent[index].hasOwnProperty('children')) {
//             //             return parent[index]['children'].map(rule => {
//             //                 return rule['label'] = <div //className="rulesengine-btn-primary"
//             //                     //style={{ color: "#fff", background: this.generateRandomColor(),borderRadius: '0.25rem' }} 
//             //                     >{rule['label']}</div>;
//             //             })
//             //         }
//             //     }
//             // })
        // groupListJoins.map((join, index) => {
//                 let parentjoins = []
        //     if (join.hasOwnProperty('button_or') && join['button_or'] === true) {
//                     let notarray = []
//                     parentjoins.push(parent[index])
//                     parentjoins.push(parent[index + 1])
//                     if (join.hasOwnProperty('button_not') && join['button_not'] === true) {
//                         notarray = [{
//                             id: index, label: <div className="btn btn-primary" >
//                                 {this.props.intl.formatMessage({ id: "IDS_OR" })} </div>// 'button_or'
//                             , children: parentjoins
//                         }]
//                         grandparent.push({
//                             id: index, label: <div className="btn btn-primary" >
//                                 {this.props.intl.formatMessage({ id: "IDS_NOT" })} </div>// 'button_or'
//                             , children: notarray
        //                 })
        //             }
//                     else {
//                         grandparent.push({
//                             id: index, label: <div className="btn btn-primary" >
//                                 {this.props.intl.formatMessage({ id: "IDS_OR" })} </div>// 'button_or'
//                             , children: parentjoins
        //         })
        //     }
//                 }
        //     if (join.hasOwnProperty('button_and') && join['button_and'] === true) {
//                     let notarray = []
//                     parentjoins.push(parent[index])
//                     parentjoins.push(parent[index + 1])
//                     if (join.hasOwnProperty('button_not') && join['button_not'] === true) {
//                         notarray = [{
//                             id: index, label: <div className="btn btn-primary" >
//                                 {this.props.intl.formatMessage({ id: "IDS_AND" })} </div>// 'button_or'
//                             , children: parentjoins
//                         }]
//                         grandparent.push({
//                             id: index, label: <div className="btn btn-primary" >
//                                 {this.props.intl.formatMessage({ id: "IDS_NOT" })} </div>// 'button_or'
//                             , children: notarray
        //                 })
        //             }
//                     else {
//                         grandparent.push({
//                             id: index, label: <div className="btn btn-primary" >{this.props.intl.formatMessage({ id: "IDS_AND" })}</div>// 'button_and'
//                             , children: parentjoins
        //         })
        //     }
//                 }
        // })
//         }



//         // groupListJoins.map((join, index) => {
//         //     if (join.hasOwnProperty('button_or') && join['button_or'] === true) {
//         //         parent = []
//         //         groupList.map((groupobject, index) => {
//         //             if (groupobject.hasOwnProperty('button_or')) {
//         //                 children = []
//         //                 let rulesList = groupobject['button_or']
//         //                 rulesList.map((rule, index) => {
//         //                     children.push({ id: index, label: rule['stestname'].label })
    //             //     })
//         //                 return parent.push({ id: index, label: 'button_or', children: children })
    //             // }
//         //         })
//         //         grandparent.push({ id: index, label: 'button_or', children: parent })
    //             //  }
//         //     if (join.hasOwnProperty('button_and') && join['button_and'] === true) {
//         //         parent = []
//         //         groupList.map((groupobject, index) => {
//         //             if (groupobject.hasOwnProperty('button_and')) {
//         //                 children = []
//         //                 let rulesList = groupobject['button_and']
//         //                 rulesList.map((rule, index) => {
//         //                     children.push({ id: index, label: rule['stestname'].label })
    //             //     })
//         //                 return parent.push({ id: index, label: 'button_and', children: children })
    //             // }
//         //         })
//         //         grandparent.push({ id: index, label: 'button_and', children: parent })
    //             //  }
//         // })

//         object = grandparent.length > 0 ?
    //      {
    //         id: 0,
//                 label: <div className="btn btn-primary" >{this.props.Login.masterData.SelectedRulesEngine.srulename} </div>,
//                 children: grandparent
    //     } 
    //     : {
    //         id: 0,
//                 label: <div className="btn btn-primary" >{this.props.Login.masterData.SelectedRulesEngine.srulename} </div>,
    //         children: parent
    //     }
    //     return object
    // }
//     // ruleflowobject() {
//     //     let object = {}
//     //     let groupList = this.props.Login.masterData.SelectedRulesEngine['jsondata']
//     //     let groupListJoins = this.props.Login.masterData.SelectedRulesEngine['jsonuidata'] &&
//     //         this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['groupListJoins']
//     //     let child = []
//     //     let children = []
//     //     // let parentor = []
//     //     // let parentand = []
//     //     let parent = []
//     //     groupList.map((ruleslist, index) => {

//     //         if (ruleslist.hasOwnProperty('button_or')) {
//     //             children = []
//     //             let rules = ruleslist['button_or']
//     //             // if (groupListJoins.length > 0) {
//     //             //     rules.map((rule, index) => {
//     //             //         children.push({ id: index + 1, label: rule['stestname'].label })
//     //             //     })
//     //             // }
//     //             // else {
//     //             rules.map((rule, index) => {
//     //                 children.push({ id: index + 1, label: rule['stestname'].label })
//     //             })
//     //             parent.push({ id: index + 1, label: 'button_or', children: children })
//     //             //  }
//     //         }
//     //         if (ruleslist.hasOwnProperty('button_and')) {
//     //             children = []
//     //             let rules = ruleslist['button_and']
//     //             // if (groupListJoins.length > 0) {
//     //             //     rules.map((rule, index) => {
//     //             //         children.push({ id: index + 1, label: rule['stestname'].label })
//     //             //     })
//     //             // }
//     //             // else {
//     //             rules.map((rule, index) => {
//     //                 children.push({ id: index + 1, label: rule['stestname'].label })
//     //             })
//     //             parent.push({ id: index + 1, label: 'button_and', children: children })
//     //             //  }
//     //         }
//     //     })
//     //     groupListJoins.map((join, index) => {
//     //         if (join.hasOwnProperty('button_or') && join['button_or'] === true) {
//     //             child.push({ id: index + 1, label: 'button_or', children: parent })
//     //         }
//     //         if (join.hasOwnProperty('button_and') && join['button_and'] === true) {
//     //             child.push({ id: index + 1, label: 'button_and', children: parent })
//     //         }
//     //     })

//     //     object =  child.length > 0 ?
//     //      {
//     //         id: 0,
//     //         label: 'root',
//     //         children: child
//     //     } 
//     //     : {
//     //         id: 0,
//     //         label: 'root',
//     //         children: parent
//     //     }
//     //     // object = {
//     //     //     id: 0,
//     //     //     label: 'button_or',
//     //     //     children: [{
//     //     //         id: 1,
//     //     //         label: 'Complete Blood Count(Complete Blood Count)'
//     //     //     }, {
//     //     //         id: 2,
//     //     //         label: 'H-A1C-Pre(kk-2)'
//     //     //     }]
//     //     // }
//     //     console.log('view object:',JSON.stringify(object))
//     //     return object
//     // }
//     createGroupRulesview() {
//         let indexCount = 0;
//         let design = [];
//         let groupList = this.props.Login.masterData.SelectedRulesEngine['jsondata'].hasOwnProperty('button_and') ?
//             this.props.Login.masterData.SelectedRulesEngine['jsondata']['button_and'] : this.props.Login.masterData.SelectedRulesEngine['jsondata']['button_or']
//         let selectedRecordview = {}
//         let selectedRecordviewflag = {}
//         selectedRecordview["groupList"] = []
//         groupList.map((ruleslist, index) => {

//             if (ruleslist.hasOwnProperty('button_or')) {
//                 selectedRecordview["groupList"][index] = ruleslist["button_or"]
//                 selectedRecordview["groupList"][index]["button_or"] = true
//             }
//             if (ruleslist.hasOwnProperty('button_and')) {
//                 selectedRecordview["groupList"][index] = ruleslist["button_and"]
//                 selectedRecordview["groupList"][index]["button_and"] = true
//             }
//         })

//         if (this.props.Login.masterData.SelectedRulesEngine['jsondata'].hasOwnProperty('button_and')) {
//             selectedRecordviewflag["groupList"] = {}
//             selectedRecordviewflag["groupList"]["button_and"] = true
//         }
//         else {
//             selectedRecordviewflag["groupList"] = {}
//             selectedRecordviewflag["groupList"]["button_or"] = true
//         }
//         console.log('props.addGroupList->', this.props.Login.masterData.SelectedRulesEngine['jsonuidata'].addGroupList)
//         this.props.Login.masterData.SelectedRulesEngine['jsonuidata'].addGroupList.length > 0 && this.props.Login.masterData.SelectedRulesEngine['jsonuidata'].addGroupList.map((items, index) => {
//             if (items > -1) {
//                 indexCount = indexCount + 1;
//             };
//             design.push(
//                 <>
//                     {items > -1 ?
//                         <>  {index > 0 ? selectedRecordviewflag["groupList"]['button_or'] === true ?
//                             <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
//                             >
//                                 <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
//                             </ContionalButton> :
//                             selectedRecordviewflag["groupList"]['button_and'] === true ?
//                                 <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
//                                 >
//                                     <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
//                                 </ContionalButton> : "" : ""} <BuilderBorder  >
//                                 <>
//                                     {this.createRulesView(items, index, selectedRecordview)}
//                                 </>

//                             </BuilderBorder>
//                         </> : <></>
//                     }


//                 </>)
//         });

//         return design;
//     }
//     changePropertyViewClose = (id) => {

        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
//                 activeTabIndex: undefined,
//                 activeTestTab: undefined,
//                 activeTabId: id
        //         }
        //     }
        //     this.props.updateStore(updateInfo);
        // }
//     componentWillUnmount() {
//         let activeTabIndex = this.props.Login.activeTabIndex
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 activeTabIndex: undefined
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     componentDidUpdate(previousProps) {

//         let { filterData, activeTabIndex, activeTabId, selectedcombo } = this.state;
//         if (this.props.Login.queryData !== previousProps.Login.queryData) {
//             this.setState({
//                 data: this.props.Login.queryData,
//                 dataResult: process(this.props.Login.queryData, this.state.dataState)
//             });
//         }
//         if (this.props.Login.needoutsource !== previousProps.Login.needoutsource) {
//             this.setState({
//                 needoutsource: this.props.Login.needoutsource
//             });
//         }

//         if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex || this.props.Login.masterData !== previousProps.Login.masterData) {
//             if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
//                 activeTabIndex = this.props.Login.activeTabIndex;
//                 activeTabId = this.props.Login.activeTabId;
//                 this.setState({
//                     activeTabIndex,
//                     activeTabId
//                 });
//             }
//         }
//         if (this.props.Login.masterData.ProductCategory !== previousProps.Login.masterData.ProductCategory) {
//             const ProductCategory = constructOptionList(this.props.Login.masterData.ProductCategory || [], "nproductcatcode",
//                 "sproductcatname", undefined, undefined, undefined);
//             let ProductCategoryList = ProductCategory.get("OptionList");
//             this.setState({
//                 ProductCategoryList
//             });
//         }

//         if (this.props.Login.masterData.queryDataMain !== previousProps.Login.masterData.queryDataMain) {
//             if (this.props.Login.masterData.queryDataMain !== undefined) {
//                 this.setState({
//                     dataMainList: this.props.Login.masterData.queryDataMain,
//                     dataResultMain: process(this.props.Login.masterData.queryDataMain === null ? [] : this.props.Login.masterData.queryDataMain, this.state.dataStateMain)
//                 });
//             }
//         }
//         if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
//             this.setState({ selectedRecord: this.props.Login.selectedRecord });
//         }
//         if (this.props.Login.masterData.queryTypeCode !== previousProps.Login.masterData.queryTypeCode) {
//             filterData = this.generateBreadCrumData();
//             this.setState({ filterData });
//         }
//         if (this.props.Login.masterData.SelectedProductCategory !== previousProps.Login.masterData.SelectedProductCategory) {
//             if (this.props.Login.masterData.SelectedProductCategory) {
//                 const ProductCategory = constructOptionList(this.props.Login.masterData.ProductCategory || [], "nproductcatcode",
//                     "sproductcatname", undefined, undefined, undefined);
//                 let ProductCategoryList = ProductCategory.get("OptionList");
//                 let nproductcatcode = this.props.Login.masterData.SelectedProductCategory.nproductcatcode
//                 selectedcombo['nproductcatcode'] = ProductCategoryList.filter(x => { return x.value === nproductcatcode })[0]
//                 filterData = this.generateBreadCrumData();
//                 this.setState({ filterData, selectedcombo });
//             }
//             else {
//                 filterData = this.generateBreadCrumData();
//                 this.setState({ filterData });
//             }


//         }
//         // if(this.props.Login.testInitiateSiteTab&&this.props.Login.testInitiateSiteTab.length>0)
//         // {
//         //     const updateInfo = {
//         //         typeName: DEFAULT_RETURN,
//         //         data: {
//         //             testInitiateSiteTab: []
//         //         }
//         //     }
//         //     this.props.updateStore(updateInfo);
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

//     }
//     generateBreadCrumData() {
//         const breadCrumbData = [];
//         if (this.props.Login.masterData && this.props.Login.masterData.queryTypeCode) {

//             const item = this.state.queryType.filter(item => item.nquerytypecode === this.props.Login.masterData.queryTypeCode);
//             breadCrumbData.push(
//                 {
//                     "label": "IDS_QUERYTYPE",
//                     "value": this.props.Login.masterData.queryTypeCode ?
//                         item[0].squerytypename : ""
//                 }
//             );
//         }
//         if (this.props.Login.masterData && this.props.Login.masterData.SelectedProductCategory) {
//             breadCrumbData.push(
//                 {
//                     "label": "IDS_SAMPLECATEGORY",
//                     "value": this.props.Login.masterData.SelectedProductCategory ?
//                         this.props.Login.masterData.SelectedProductCategory.sproductcatname : ""
//                 }
//             );
//         }
//         else {
//             breadCrumbData.push(
//                 {
//                     "label": "IDS_SAMPLECATEGORY",
//                     "value": "NA"
//                 }
//             );
//         }
//         return breadCrumbData;
//     }
//     fieldsForGrid() {
//         return this.props.Login.activeTabIndex == 1 ? [
//             { "idsName": "IDS_FROMSITE", "dataField": "sfromsitename", "width": "200px" },
//             { "idsName": "IDS_TOSITE", "dataField": "stositename", "width": "200px" }
//         ] : [
//             { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "scommentsubtype", "width": "200px" },
//             this.props.Login.activeTabIndex == 2 ? { "idsName": "IDS_TESTCOMMENTS", "dataField": "spredefinedname", "width": "200px" } :
//                 { "idsName": "IDS_REPORTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
//         ];
//     }

//     render() {

//         const addId = this.state.controlMap.has("Add Rules Engine") && this.state.controlMap.get("Add Rules Engine").ncontrolcode;
//         const editId = this.state.controlMap.has("Edit Rules Engine") && this.state.controlMap.get("Edit Rules Engine").ncontrolcode;
//         const deleteId = this.state.controlMap.has("Delete Rules Engine") && this.state.controlMap.get("Delete Rules Engine").ncontrolcode;
//         const breadCrumbData = this.state.filterData || [];

//         this.props.Login.masterData.RulesEngine = this.props.Login.masterData.RulesEngine &&
//             sortData(this.props.Login.masterData.RulesEngine, "descending", "ntransactionrulesenginecode")
//         this.props.Login.masterData.searchedData = this.props.Login.masterData.searchedData &&
//             sortData(this.props.Login.masterData.searchedData, "descending", "ntransactionrulesenginecode")
//         let gridColumnListMain = [];

//         if (this.props.Login.masterData && this.props.Login.masterData.columnList && this.props.Login.masterData.columnList.length > 0) {
//             this.props.Login.masterData.columnList.forEach(item => {
//                 gridColumnListMain.push({ idsName: item.items.displayname[this.props.Login.userInfo.slanguagetypecode], dataField: item.items.stestname, width: '200px' })
//             })
//         }
//         let selectedQueryType = [];
//         if (this.props.Login.masterData && this.props.Login.masterData.queryTypeCode) {

//             selectedQueryType = this.state.queryType.filter(item => item.nquerytypecode === this.props.Login.masterData.queryTypeCode);
//         }
//         const filterParam = {
//             inputListName: "RulesEngine", selectedObject: "SelectedRulesEngine", primaryKeyField: "ntransactionrulesenginecode",
//             fetchUrl: "rulesengine/getSelectedRulesEngine", fecthInputObject: {
//                 userinfo: this.props.Login.userInfo,
//                 nproductcatcode: this.props.Login.masterData.SelectedProductCategory && this.props.Login.masterData.SelectedProductCategory.nproductcatcode
//             },

//             masterData: this.props.Login.masterData,
//             searchFieldList: ["srulename", "stransdisplaystatus"]
//         };

//         return (
//             <>
//                 <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
//                     {breadCrumbData.length > 0 ?
//                         <Affix top={53}>
//                             <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
//                         </Affix> : ""
//                     }
//                     <Row noGutters={true}>
//                         <Col md="4">
//                             <ListMaster
//                                 masterData={this.props.Login.masterData || []}
//                                 screenName={this.props.intl.formatMessage({ id: "IDS_QUERYBUILDER" })}
//                                 masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.RulesEngine}
//                                 getMasterDetail={(param) => this.props.getSelectedRulesEngine(param, this.props.Login.userInfo, this.props.Login.masterData)}
//                                 selectedMaster={this.props.Login.masterData.SelectedRulesEngine || this.props.Login.SelectedRulesEngine}
//                                 primaryKeyField="ntransactionrulesenginecode"
//                                 mainField="srulename"
//                                 firstField="stransdisplaystatus"
//                                 //secondField={"stransdisplaystatus"}
//                                 filterColumnData={this.props.filterColumnData}
//                                 filterParam={filterParam}
//                                 userRoleControlRights={this.state.userRoleControlRights}
//                                 addId={addId}
//                                 searchRef={this.searchRef}
//                                 reloadData={this.reloadData}
//                                 openModal={this.getRulesEngineAdd}
//                                 // openModal={() => this.props.getSQLQueryComboService("", "create", "nsqlquerycode", null,
//                                 //     this.props.Login.masterData, this.props.Login.userInfo,
//                                 //     this.props.Login.masterData.SelectedQueryType.nquerytypecode,                                   
//                                 //     addId)} 
//                                 //{() => this.props.addTest("create", selectedTest, userInfo, addId, this.state.nfilterTestCategory)} Already commented
//                                 needAccordianFilter={false}
//                                 // skip={this.state.skip}
//                                 // take={this.state.take}
//                                 handlePageChange={this.handlePageChange}
//                                 showFilterIcon={true}
//                                 showFilter={this.props.Login.showFilter}
//                                 openFilter={this.openFilter}
//                                 closeFilter={this.closeFilter}
//                                 onFilterSubmit={this.onFilterSubmit}
//                                 showBuildQuery={false}
//                                 builderData={this.getRulesEngineAdd}
//                                 filterComponent={[
//                                     {
//                                         "IDS_QUERYTYPEFILTER":
//                                             <RuleEngineQueryTypeFilter
//                                                 queryType={this.state.ProductCategoryList || []}
//                                                 selectedRecord={this.state.selectedcombo || {}}
//                                                 onComboChange={this.onComboChange}
//                                                 filterQueryType={selectedQueryType[0]}
//                                             />
//                                     }
//                                 ]}
//                             />
//                         </Col>
//                         <Col md="8">
//                             <ProductList className="panel-main-content">
//                                 {this.props.Login.masterData.SelectedRulesEngine && this.props.Login.masterData.SelectedRulesEngine ?
//                                     <Card className="border-0">
//                                         <Card.Header>
//                                             <Card.Title className="product-title-main">{this.props.Login.masterData.SelectedRulesEngine.srulename}</Card.Title>
//                                             <Card.Subtitle>
//                                                 <ProductList className="d-flex product-category icon-group-wrap">
//                                                     <h2 className="product-title-sub flex-grow-1">
//                                                         <MediaLabel >
//                                                             {this.props.intl.formatMessage({ id: "IDS_STATUS" })} :
//                                                         </MediaLabel>
//                                                         <MediaLabel
//                                                             className={`btn btn-outlined ${this.props.Login.masterData.SelectedRulesEngine.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" :
//                                                                 this.props.Login.masterData.SelectedRulesEngine.ntransactionstatus === transactionStatus.RETIRED ? "outline-danger" :
//                                                                     "outline-secondary"} btn-sm ml-3`}
//                                                         // className={`btn btn-outlined  outline-success  btn-sm ml-3`}
//                                                         >
//                                                             {this.props.Login.masterData.SelectedRulesEngine.stransdisplaystatus}
//                                                         </MediaLabel>

//                                                     </h2>

//                                                     <div className="d-inline ">
//                                                         <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
//                                                             data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
//                                                             //  data-for="tooltip_list_wrap"
//                                                             onClick={(e) =>
//                                                                 this.props.getEditRulesEngine(
//                                                                     "update", this.props.Login.masterData, editId, this.props.Login.userInfo
//                                                                 )
//                                                             }
//                                                         >
//                                                             <FontAwesomeIcon icon={faPencilAlt}
//                                                                 title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
//                                                         </Nav.Link>
//                                                         <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
//                                                             data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
//                                                             //   data-for="tooltip_list_wrap"
//                                                             onClick={() => this.ConfirmDelete(deleteId)}
//                                                         >
//                                                             <FontAwesomeIcon icon={faTrashAlt} />

//                                                         </Nav.Link>
//                                                         <Nav.Link className="btn btn-circle outline-grey mr-2"
//                                                             data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
//                                                             // hidden={props.userRoleControlRights.indexOf(approveVersionId) === -1}
//                                                             onClick={() => this.approveVersion(this.props.Login.masterData, 1)}
//                                                         >
//                                                             <FontAwesomeIcon icon={faThumbsUp} />
//                                                         </Nav.Link>
//                                                         <Nav.Link className="btn btn-circle outline-grey mr-2"
//                                                             data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
//                                                             // hidden={props.userRoleControlRights.indexOf(approveVersionId) === -1}
//                                                             onClick={() => this.approveVersion(this.props.Login.masterData, 2)}
//                                                         >
//                                                             <Reject className="custom_icons" width="20" height="20" />
//                                                         </Nav.Link>

//                                                         <Nav.Link className="btn btn-circle outline-grey mr-2"
//                                                             data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
//                                                             // hidden={props.userRoleControlRights.indexOf(approveVersionId) === -1}
//                                                             onClick={() => this.openflowview()}
//                                                         >
//                                                             <FontAwesomeIcon icon={faEye} />
//                                                         </Nav.Link>

//                                                     </div>
//                                                 </ProductList>
//                                             </Card.Subtitle>

//                                         </Card.Header>

//                                     </Card>
//                                     : ""}
//                                 {this.props.Login.masterData.SelectedRulesEngine &&
//                                     <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />}
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
//                             (this.props.Login.operation === 'update' ? this.state.selectedRecord['groupList'] : true) &&
//                             <AddRule
//                                 productCategoryList={this.state.ProductCategoryList || []}
//                                 selectedRecord={this.state.selectedRecord || {}}
//                                 databaseTableList={this.props.Login.databaseTableList}
//                                 tableColumnList={this.state.tableColumnList}
//                                 foreignTableList={this.state.foreignTableList || []}
//                                 foreignTableColumnList={this.props.Login.foreignTableColumnList || []}
//                                 // validationData={validationData}
//                                 count={this.state.count}
//                                 foreignTableCount={this.state.foreignTableCount}
//                                 sqlQuery={this.state.sqlQuery}
//                                 // viewMasterListByRule={this.props.Login.viewMasterListByRule&&this.props.Login.viewMasterListByRule.filter((x,i)=>{return x.value===this.props.Login.testInitiateTests[i]}) || []}
//                                 userInfo={this.props.Login.userInfo}
//                                 onInputChange={this.onInputChange}
//                                 deleteRule={this.deleteRule}
//                                 clearRule={this.clearRule}
//                                 resetRule={this.resetRule}
//                                 onSymbolChange={this.onSymbolChange}
//                                 // onForeignTableChange={this.onForeignTableChange}
//                                 // addJoinTable={this.addJoinTable} 

//                                 onRuleChange={this.onRuleChange}

//                                 addRule={this.addRule}
//                                 addTest={this.addTest}
//                                 onConditionClick={this.onConditionClick}
//                                 onMasterDataChange={this.onMasterDataChange}
//                                 databaseviewList={this.props.Login.databaseviewList}
//                                 addRuleList={this.props.Login.addRuleList || []}
//                                 rulesOption={this.props.Login.rulesOption}
//                                 //viewColumnListByRule={this.props.Login.viewColumnListByRule || []}
//                                 // viewColumnListByRule={this.props.Login.viewColumnListByRule && this.props.Login.viewColumnListByRule.filter((x, i) => { return x.value === this.props.Login.testInitiateTests[i] }) || []}
//                                 viewColumnListByRule={this.props.Login.viewColumnListByRule && this.viewColumnListByRule(this.props.Login.viewColumnListByRule) //this.props.Login.viewColumnListByRule && this.props.Login.viewColumnListByRule
//                                 }
//                                 masterdata={this.props.Login.masterdata}
//                                 switchRecord={this.state.switchRecord}
//                                 data={this.state.data}
//                                 dataResult={this.state.dataResult || []}
//                                 dataState={this.state.dataState}
//                                 dataStateChange={this.dataStateChange}
//                                 userRoleControlRights={this.state.userRoleControlRights}
//                                 gridColumnList={this.props.Login.gridColumnList || []}
//                                 queryType={this.state.queryType}
//                                 addAggregateList={this.props.Login.addAggregateList || []}
//                                 addOrderbyList={this.props.Login.addOrderbyList || []}
//                                 addGroup={this.addGroup}
//                                 addGroupList={this.props.Login.addGroupList || []}
//                                 onFilterComboChange={this.onFilterComboChange}
//                                 selectFields={this.props.Login.selectFields || []}
//                                 SelectedProductCategory={this.props.Login.masterData.SelectedProductCategory}
//                                 DiagnosticCaseList={this.props.Login.DiagnosticCaseList}
//                                 GradeList={this.props.Login.GradeList}
//                                 siteList={this.props.Login.siteList}
//                                 resultTypeList={this.props.Login.resultTypeList}
//                                 isResultorOrderType={this.state.isResultorOrderType}
//                                 optionsByRule={this.state.optionsByRule || this.props.Login.DiagnosticCaseList}
//                                 //sideNavDetail={this.sideNavDetail}
//                                 changePropertyView={this.changePropertyView}
//                                 splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
//                                 activeTabIndex={this.props.Login.activeTabIndex}
//                                 enablePropertyPopup={this.state.enablePropertyPopup}
//                                 propertyPopupWidth={this.state.propertyPopupWidth}
//                                 controlMap={this.state.controlMap}
//                                 sectionDataState={this.state.sectionDataState}
//                                 masterData={this.props.Login.masterData}
//                                 intl={this.props.intl}
//                                 addOutcomeList={this.props.Login.addOutcomeList && this.props.Login.addOutcomeList || []}
//                                 deleteOutcome={this.deleteOutcome}
//                                 onmodalComboChange={this.onmodalComboChange}
//                                 openModalPopup={this.props.Login.openModalPopup}
//                                 closeModalShow={this.closeModalShow}
//                                 modalsaveClick={this.modalsaveClick}
//                                 getOutcomeDetails={this.getOutcomeDetails}
//                                 addModalSite={this.addModalSite}
//                                 action={this.props.Login.action}
//                                 deletModalSite={this.deletModalSite}
//                                 deleteModalTest={this.deleteModalTest}
//                                 activeTestTab={this.props.Login.activeTestTab}
//                                 testcomments={this.props.Login.testcomments}
//                                 reportcomments={this.props.Login.reportcomments}
//                                 addComments={this.addComments}
//                                 CommentType={this.props.Login.CommentType}
//                                 CommentSubType={this.props.Login.CommentSubType}
//                                 isneedsgeneralcomments={this.state.isneedsgeneralcomments}
//                                 predefcomments={this.props.Login.predefcomments}
//                                 needoutsource={this.state.selectedRecord['needoutsource'] && this.state.selectedRecord['needoutsource'] === 3 ? true : false}
//                                 openmodalsavePopup={this.props.Login.openmodalsavePopup}
//                                 save={this.save}
//                                 dataStateObject={this.state.dataStateObject}
//                                 paneSizeChange={this.paneSizeChange}
//                             />
//                         }
//                     />
//                 }

//                 {
//                     this.props.Login.openModal &&
//                     <SlideOutModal show={this.props.Login.openModal}
//                         closeModal={this.closeModal}
//                         className={"wide-popup"}
//                         inputParam={this.props.Login.inputParam}
//                         screenName={this.props.intl.formatMessage({ id: "IDS_VIEWRULE" })}
//                         hideSave={true}
//                         size={'xl'}
//                         selectedRecord={this.state.selectedRecord || {}}
//                         addComponent={
//                             this.props.Login.masterData.SelectedRulesEngine &&
//                             <Row>
//                                 <Col md={12}>
//                                     <OrgTree
//                                         data={this.ruleflowobject()}
//                                         horizontal={true}
//                                         collapsable={true}
//                                         expandAll={true}
//                                         labelClassName={"ruletree"}
//                                     //labelWidth={50}
//                                     />
//                                     {/* </BuilderBorder> */}

//                                 </Col>
//                             </Row>
//                         }
//                     />
//                 }
//             </>
//         );
//     }

//     closeModalShow = () => {
//         let openModalPopup = this.props.Login.openModalPopup;
//         let selectedRecord = this.props.Login.selectedRecord || {};
//         selectedRecord['srulename'] = ""
//         openModalPopup = false;
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { openModalPopup, selectedRecord }
//         }
//         this.props.updateStore(updateInfo);
//     }


//     reloadData = () => {
//         this.searchRef.current.value = "";
//         const inputParam = {
//             inputData: { "userinfo": this.props.Login.userInfo, nproductcatcode: this.props.Login.masterData.SelectedProductCategory.nproductcatcode },
//             classUrl: "rulesengine",
//             methodUrl: "RulesEngine",
//             displayName: "IDS_RULESENGINE",

//             userInfo: this.props.Login.userInfo
//         };

//         this.props.callService(inputParam);
//     }

//     onsavevalidation = (selectedRecord) => {
//         let grouplist = selectedRecord["groupList"]
//         let hasAll = true;
//         for (var i = 0; i < grouplist.length; i++) {
//             let rules = grouplist[i]
//             for (var j = 0; j < rules.length; j++) {
//                 let props = []
//                 if (rules[j]["orderresulttype"] && rules[j]["orderresulttype"].value === 1) {
//                     props = ["stestname", "ssymbolname", "orderresulttype", "ndiagnosticcasecode"];
//                 }
//                 else {
//                     props = ["stestname", "ssymbolname", "orderresulttype", "ngradecode"];
//                 }
//                 hasAll = props.every(prop => rules[j].hasOwnProperty(prop));
//                 if (hasAll === false) {
//                     break;
//                 }
//             }
//             if (hasAll === false) {
//                 break;
//             }
//         }
//         return hasAll
//     }
//     save = () => {
//         let inputData = [];
//         let siteObject = this.props.Login.siteObject || {};
//         let testCommentObject = this.props.Login.testCommentObject || {};
//         let reportCommentObject = this.props.Login.reportCommentObject || {};

//         let testInitiateTests = this.props.Login.testInitiateTests || [];
//         let testCommentsTests = this.props.Login.testCommentsTests || [];
//         let reportCommentsTests = this.props.Login.reportCommentsTests || [];

//         const { selectedRecord } = this.state;
//         let rules = []
//         if (selectedRecord["nproductcatcode"]) {
//             if (selectedRecord["groupList"].length > 0) {
//                 if (this.onsavevalidation(selectedRecord)) {
//                     if (selectedRecord["srulename"] && selectedRecord["srulename"] !== "" && this.props.Login.action !== 'update'
//                         && this.props.Login.action !== 'IDS_ADDTESTCOMMENTS' && this.props.Login.action !== 'IDS_ADDREPORTCOMMENTS'
//                         && this.props.Login.action !== 'IDS_ADDTEST' && this.props.Login.action !== 'IDS_ADDSITE'
//                     ) {

//                         if (selectedRecord["groupList"]) {
//                             let groupList = [];
//                             let outcomeList = {};
//                             groupList = selectedRecord["groupList"];

//                             outcomeList['groupList'] = groupList
//                             outcomeList['addGroupList'] = this.props.Login.addGroupList
//                             outcomeList['testInitiateTests'] = this.props.Login.testInitiateTests && this.props.Login.testInitiateTests
//                             outcomeList['testCommentsTests'] = this.props.Login.testCommentsTests && this.props.Login.testCommentsTests
//                             outcomeList['reportCommentsTests'] = this.props.Login.reportCommentsTests && this.props.Login.reportCommentsTests
//                             outcomeList['siteObject'] = this.props.Login.siteObject && this.props.Login.siteObject
//                             outcomeList['testCommentObject'] = this.props.Login.testCommentObject && this.props.Login.testCommentObject
//                             outcomeList['reportCommentObject'] = this.props.Login.reportCommentObject && this.props.Login.reportCommentObject
//                             outcomeList['testInitiateSiteTab'] = this.props.Login.testInitiateSiteTab && this.props.Login.testInitiateSiteTab
//                             outcomeList['testCommentsTestsTab'] = this.props.Login.testCommentsTestsTab && this.props.Login.testCommentsTestsTab
//                             outcomeList['reportCommentsTestsTab'] = this.props.Login.reportCommentsTestsTab && this.props.Login.reportCommentsTestsTab
//                             outcomeList['nproductcatcode'] = selectedRecord['nproductcatcode']
//                             outcomeList['groupListJoins'] = selectedRecord['groupListJoins']

//                             let ruleEngineLayout = []
//                             let ruleEngineLayoutObject = []
//                             let groupRuleObject = {}
//                             groupList.map((List) => {
//                                 if (List.hasOwnProperty('button_or') && List['button_or'] === true) {
//                                     if (List.hasOwnProperty('button_not') && List['button_not'] === true) {
//                                         groupRuleObject['button_not_button_or'] = List
//                                     }
//                                     else {
                                    // groupRuleObject['button_or'] = List
//                                     }
//                                     // groupRuleObject['button_or'] = List
//                                     ruleEngineLayout.push(groupRuleObject)
//                                     groupRuleObject = {}
//                                 }
//                                 if (List.hasOwnProperty('button_and') && List['button_and'] === true) {
//                                     if (List.hasOwnProperty('button_not') && List['button_not'] === true) {
//                                         groupRuleObject['button_not_button_and'] = List
//                                     }
//                                     else {
                                    //  groupRuleObject['button_and'] = List
//                                     }
//                                     //  groupRuleObject['button_and'] = List
//                                     ruleEngineLayout.push(groupRuleObject)
//                                     groupRuleObject = {}
//                                 }
//                             })
//                             ruleEngineLayoutObject = groupList.hasOwnProperty('button_or') && groupList['button_or'] === true ?
//                                 {
//                                     'button_or': ruleEngineLayout
//                                 } : {
//                                     'button_and': ruleEngineLayout
//                                 }
//                             console.log('savelist--->', JSON.stringify(ruleEngineLayoutObject))
//                             //  inputData['nproductcatcode'] = this.props.Login.masterData.SelectedProductCategory.nproductcatcode
//                             inputData['nproductcatcode'] = selectedRecord['nproductcatcode'].value
//                             inputData['srulename'] = selectedRecord['srulename']
//                             inputData['outcomeList'] = JSON.stringify(outcomeList)
//                             inputData['jsondata'] = JSON.stringify(ruleEngineLayout)
//                             inputData['userinfo'] = this.props.Login.userInfo
//                             if (this.props.Login.operation === 'update') {
//                                 inputData['ntransactionrulesenginecode'] = this.props.Login.masterData.SelectedRulesEngine['ntransactionrulesenginecode']
//                             }
//                             const inputParam = {
//                                 classUrl: "rulesengine",
//                                 methodUrl: "RulesEngine",
//                                 displayName: this.props.Login.inputParam.displayName,
//                                 inputData: inputData,
//                                 operation: this.props.Login.operation === 'create' ? 'create' : 'update'
//                             }
//                             this.props.crudMaster(inputParam, this.props.Login.masterData, "openPortalModal");
//                         }
//                         else {
//                             toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULE" }));
//                         }

//                     }
//                     else {
//                         selectedRecord['srulename'] = selectedRecord['srulenamecopy'] || ""
//                         const updateInfo = {
//                             typeName: DEFAULT_RETURN,
//                             data: { openModalPopup: true, selectedRecord, action: "IDS_SAVERULEMODAL", openmodalsavePopup: true }
//                         }
//                         this.props.updateStore(updateInfo);
//                         //   toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERRULESENGINENAME" }));

//                     }
//                 } else {
//                     toast.info(this.props.intl.formatMessage({ id: "IDS_COMPLETETHERULETOSAVE" }));
//                 }
//             }
//             else {
//                 toast.info(this.props.intl.formatMessage({ id: "IDS_ATLEASTADDONERULE" }));
//             }
//         }
//         else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPRODUCTCATEGORY" }));

//         }
//     }




//     static getDerivedStateFromProps(props, state) {

//         if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
//             toast.warn(props.Login.masterStatus);
//             props.Login.masterStatus = "";
//         }

//         if (props.Login.error !== state.error) {
//             toast.error(props.Login.error)
//             props.Login.error = "";
//         }
//         return null;
//     }





//     // confirmDelete = (ncontrolCode) => {
//     //     this.confirmMessage.confirm("deleteMessage",
//     //         this.props.intl.formatMessage({ id: "IDS_DELETE" }),
//     //         this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
//     //         this.props.intl.formatMessage({ id: "IDS_OK" }),
//     //         this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
//     //         () => this.deleteQB("delete", ncontrolCode));
//     // };

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

//     onFilterSubmit = () => {

//         this.searchRef.current.value = "";

//         if (this.state.selectedcombo["nproductcatcode"]) {
//             console.log(this.state.selectedcombo["nproductcatcode"].value);
//         }
//         const nproductcatcode = this.state.selectedcombo["nproductcatcode"] ?
//             this.state.selectedcombo["nproductcatcode"].value : this.props.Login.masterData.queryTypeCode;

//         this.props.getRulesEngine(nproductcatcode, this.props.Login.userInfo, this.props.Login.masterData);


//     }

//     onFilterComboChange = (comboData, fieldName) => {
//         const selectedRecord = this.state.selectedRecord || {};
//         selectedRecord[fieldName] = comboData;
//         //  this.generateFilterQuery(selectedRecord);
//     }


//     onComboChange = (comboData, fieldName) => {
//         const selectedcombo = this.state.selectedcombo || {};
//         selectedcombo[fieldName] = comboData;

//         this.setState({ selectedcombo });
//     }

//     onOutcomeChange = (comboData, index) => {
//         const { selectedRecord } = this.state;
//         selectedRecord["outComeList"] = []
//         selectedRecord["outComeList"][index] = []
//         selectedRecord["outComeList"][index] = comboData;
//         if (selectedRecord["outComeList"][index]) {
//             this.setState({
//                 selectedRecord
//             });
//         }
//     }


//     onRuleChange = (comboData, fieldName, groupIndex, index) => {
//         const { selectedRecord } = this.state;
//         this.clearSelectedRule(selectedRecord, index);
//         const sqlQuery = this.props.Login.sqlQuery;
//         const oldselectedRecord = selectedRecord;
//         selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
//         const tableData = comboData.item;

//         if (selectedRecord["groupList"][groupIndex][index][fieldName]) {
//             this.setState({
//                 selectedRecord,
//                 groupIndex,
//                 index
//             });
//         }
//     }

//     onMasterDataChange = (comboData, fieldName, groupIndex, index) => {
//         const { selectedRecord } = this.state;
//         let isResultorOrderType = [];
//         let optionsByRule = [];
//         if (this.state.optionsByRule && this.state.optionsByRule.length > 0) {
//             optionsByRule = this.state.optionsByRule
//         }
//         else {
//             optionsByRule[groupIndex] = [];
//             optionsByRule[groupIndex][index] = [];
//         }
//         if (this.state.isResultorOrderType && this.state.isResultorOrderType.length > 0) {
//             isResultorOrderType = this.state.isResultorOrderType
//         }
//         else {
//             isResultorOrderType[groupIndex] = [];
//             isResultorOrderType[groupIndex][index] = [];
//         }
//         selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
//         if (fieldName !== 'ndiagnosticcasecode' && fieldName !== 'ngradecode') {
//             if (isResultorOrderType[groupIndex] === undefined) {
//                 isResultorOrderType[groupIndex] = [];
//                 isResultorOrderType[groupIndex][index] = [];
//             }
//             isResultorOrderType[groupIndex][index] = comboData.value
//             if (optionsByRule[groupIndex] === undefined) {
//                 optionsByRule[groupIndex] = [];
//                 optionsByRule[groupIndex][index] = [];
//             }
//             if (isResultorOrderType[groupIndex][index] === 1) {
//                 delete selectedRecord["groupList"][groupIndex][index]['ndiagnosticcasecode']
//                 optionsByRule[groupIndex][index] = this.props.Login.DiagnosticCaseList
//             }
//             else {
//                 delete selectedRecord["groupList"][groupIndex][index]['ngradecode']
//                 optionsByRule[groupIndex][index] = this.props.Login.GradeList
//             }
//             this.setState({ selectedRecord, isResultorOrderType, optionsByRule });
//         }

//         else {

//             this.setState({ selectedRecord });
//         }
//     }
//     addRule = (type, groupIndex) => {
//         const { selectedRecord } = this.state;
//         let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
//         const addGroupList = this.props.Login.addGroupList || [];
//         const arrayLength = addGroupList[groupIndex];
//         addGroupList[groupIndex] = arrayLength + 1;
//         selectedRecord["groupList"][groupIndex][arrayLength] = {};
//         viewColumnListByRule = this.props.Login.viewColumnList || this.props.Login.databaseviewList;;
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 addGroupList,
//                 viewColumnListByRule
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     paneSizeChange = (d) => {
//         this.setState({
//             splitChangeWidthPercentage: d
//         })
//     }
//     addTest = () => {
//         let openModalPopup = this.props.Login.openModalPopup;
//         let action = this.props.Login.action;
//         let selectedRecord = this.props.Login.selectedRecord || {}
//         delete selectedRecord['ntestparametercode']
//         delete selectedRecord['nsampletestcommentscode']
//         delete selectedRecord['ncommentsubtypecode']
//         delete selectedRecord['ncommenttypecode']
//         delete selectedRecord['sgeneralcomments']
//         delete selectedRecord['needoutsource']
//         if (this.props.Login.addGroupList.length > 0) {
//             action = "IDS_ADDTEST"
//             openModalPopup = true;
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     openModalPopup,
//                     action,
//                     selectedRecord,
//                     openmodalsavePopup: false
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         } else {
//             toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULETOADDOUTCOME" }));
//         }

//     }
//     addComments = () => {
//         let openModalPopup = this.props.Login.openModalPopup;
//         let action = this.props.Login.action;
//         let selectedParameter = this.props.Login.masterData.selectedParameter || [];
//         let testparameter = this.props.Login.viewColumnListByRule || [];
//         let selectedRecord = this.props.Login.selectedRecord || {}
//         selectedRecord['ntestparametercode'] = {}
//         selectedRecord['ntestparametercode'] = testparameter.filter(x => { return x.value === selectedParameter.ntestparametercode })[0]

//         delete selectedRecord['nsampletestcommentscode']
//         delete selectedRecord['ncommentsubtypecode']
//         delete selectedRecord['ncommenttypecode']
//         delete selectedRecord['sgeneralcomments']


//         if (this.props.Login.addGroupList.length > 0) {
//             if (this.props.Login.activeTabIndex === 2) {
//                 action = "IDS_ADDTESTCOMMENTS"
//             }
//             else {
//                 action = "IDS_ADDREPORTCOMMENTS"
//             }
//             openModalPopup = true;
//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     openModalPopup,
//                     action,
//                     selectedRecord,
//                     openmodalsavePopup: false
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         } else {
//             toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEADDRULETOADDOUTCOME" }));
//         }

//     }
//     addModalSite = () => {
//         let openModalPopup = this.props.Login.openModalPopup;

//         let selectedParameter = this.props.Login.masterData.selectedParameter || [];
//         let testparameter = this.props.Login.viewColumnListByRule || [];
//         let selectedRecord = this.props.Login.selectedRecord || {}
//         selectedRecord['ntestparametercode'] = {}
//         selectedRecord['ntestparametercode'] = testparameter.filter(x => { return x.value === selectedParameter.ntestparametercode })[0]


//         openModalPopup = true;
//         let action = this.props.Login.action;
//         action = "IDS_ADDSITE"
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 selectedRecord,
//                 openModalPopup,
//                 action,
//                 openmodalsavePopup: false
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     modalsaveClick = () => {
//         let needoutsource = this.props.Login.needoutsource || {};
//         let selectedRecord = this.state.selectedRecord || {};
//         let masterData = this.props.Login.masterData || {};
//         let testInitiateTests = this.props.Login.testInitiateTests || [];
//         let testCommentsTests = this.props.Login.testCommentsTests || [];
//         let reportCommentsTests = this.props.Login.reportCommentsTests || [];

//         let siteObject = this.props.Login.siteObject || {};
//         let testCommentObject = this.props.Login.testCommentObject || {};
//         let reportCommentObject = this.props.Login.reportCommentObject || {};


//         let testInitiateTestsTemp = [];
//         let testCommentsTestsTemp = [];
//         let reportCommentsTestsTemp = [];
//         let testInitiateSiteTemp = [];

//         let testCommentsTestsTab = this.props.Login.testCommentsTestsTab || [];
//         let reportCommentsTestsTab = this.props.Login.reportCommentsTestsTab || [];
//         let testInitiateSiteTab = this.props.Login.testInitiateSiteTab || [];

//         let testInitiateTestOptions = this.props.Login.testInitiateTestOptions || [];
//         let testCommentsTestOptions = this.props.Login.testCommentsTestOptions || [];
//         let reportCommentsTestOptions = this.props.Login.reportCommentsTestOptions || [];


//         let testInitiateTestdeletedOptions = this.props.Login.testInitiateTestdeletedOptions || [];
//         let testCommentsTestdeletedOptions = this.props.Login.testCommentsTestdeletedOptions || [];
//         let reportCommentsTestdeletedOptions = this.props.Login.reportCommentsTestdeletedOptions || [];

//         let updateInfo = {}
//         if (this.props.Login.action === 'IDS_ADDTEST') {
//             let npkAtestparametercode = 0;
//             let npkBtestparametercode = 0;
//             let npkCtestparametercode = 0;
//             if (this.props.Login.activeTabIndex === 1) {
//                 let isduplicate = {}
//                 isduplicate = testInitiateTests.filter(x => x.ntestparametercode ===
//                     selectedRecord['ntestparametercode'].item['ntestparametercode'])
//                 if (isduplicate.length === 0) {
//                     masterData['testParameter'] = {}
//                     npkAtestparametercode = this.props.Login.npkAtestparametercode || 0;
//                     npkAtestparametercode++;
//                     selectedRecord['ntestparametercode'].item['npkAtestparametercode'] = npkAtestparametercode
//                     testInitiateTests.push(selectedRecord['ntestparametercode'].item);
//                     masterData['testParameter'] = sortData(testInitiateTests, 'descending', 'npkAtestparametercode')
//                     masterData['selectedParameter'] = selectedRecord['ntestparametercode'].item
//                     delete selectedRecord['ntestparametercode']

//                 }
//                 else {
//                     return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
//                 }

//             }
//             if (this.props.Login.activeTabIndex === 2) {
            // let isduplicate = {}
//                 isduplicate = testCommentsTests.filter(x => x.ntestparametercode ===
//                     selectedRecord['ntestparametercode'].item['ntestparametercode'])
//                 if (isduplicate.length === 0) {
//                     masterData['testParameterComments'] = {}
//                     npkBtestparametercode = this.props.Login.npkBtestparametercode || 0;
//                     npkBtestparametercode++;
//                     selectedRecord['ntestparametercode'].item['npkBtestparametercode'] = npkAtestparametercode
//                     testCommentsTests.push(selectedRecord['ntestparametercode'].item);
//                     masterData['testParameterComments'] = sortData(testCommentsTests, 'descending', 'npkBtestparametercode')
//                     masterData['selectedParameter'] = selectedRecord['ntestparametercode'].item
//                     delete selectedRecord['ntestparametercode']
            // }
            // else {
//                     return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
            // }
//             }
//             if (this.props.Login.activeTabIndex === 3) {
        //     let isduplicate = {}
//                 isduplicate = reportCommentsTests.filter(x => x.ntestparametercode ===
//                     selectedRecord['ntestparametercode'].item['ntestparametercode'])
//                 if (isduplicate.length === 0) {
//                     masterData['testParameterreportComments'] = {}
//                     npkCtestparametercode = this.props.Login.npkCtestparametercode || 0;
//                     npkCtestparametercode++;
//                     selectedRecord['ntestparametercode'].item['npkCtestparametercode'] = npkCtestparametercode
//                     reportCommentsTests.push(selectedRecord['ntestparametercode'].item);
//                     masterData['testParameterreportComments'] = sortData(reportCommentsTests, 'descending', 'npkCtestparametercode')
//                     masterData['selectedParameter'] = selectedRecord['ntestparametercode'].item
//                     delete selectedRecord['ntestparametercode']
        //     }
//                 else {
//                     return toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
//                 }
//             }
//             updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     openModalPopup: false,
//                     masterData,
//                     testInitiateTests,
//                     testCommentsTests,
//                     reportCommentsTests,
//                     npkAtestparametercode,
//                     npkBtestparametercode,
//                     npkCtestparametercode,
//                     testInitiateTestOptions,
//                     testInitiateTestdeletedOptions,
//                     selectedRecord
//                 }
//             }
//         }
//         if (selectedRecord['nsampletestcommentscode'] || selectedRecord['sgeneralcomments']//this.props.Login.action === 'IDS_ADDTESTCOMMENTS'
//         ) {
//             // let isduplicate = {}
//             // let spredefinedname = selectedRecord['nsampletestcommentscode'].label
//             // let arraycheck = testCommentObject[masterData.selectedParameter.ntestparametercode]
//             // if (arraycheck) {
//             //     isduplicate = arraycheck.filter(x => x.spredefinedname === spredefinedname)
//             // }
//             // if (arraycheck !== undefined ? isduplicate.length > 0 ? false : true : true) {
//             masterData['testComments'] = {}
//             let npKAsampletestcommentscode = 0;

//             if (testCommentObject.hasOwnProperty(masterData.selectedParameter.ntestparametercode)) {
//                 npKAsampletestcommentscode = this.props.Login.npKAsampletestcommentscode;
//                 npKAsampletestcommentscode++;
        //             let object = {
//                     npKAsampletestcommentscode: npKAsampletestcommentscode,
//                     ncommentsubtypecode: selectedRecord['ncommentsubtypecode']['value'],
//                     scommentsubtype: selectedRecord['ncommentsubtypecode']['label'],
//                     ncommenttypecode: selectedRecord['ncommenttypecode']['value'],
//                     scommenttype: selectedRecord['ncommenttypecode']['label'],
//                     nsampletestcommentscode: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'].value : -1,
//                     spredefinedname: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'].label : "-",
//                     sgeneralcomments: selectedRecord['sgeneralcomments'] ? selectedRecord['sgeneralcomments'] : "-"
//                     , stestparametersynonym: masterData.selectedParameter.stestparametersynonym,
//                     ntestparametercode: masterData.selectedParameter.ntestparametercode
        //             }
//                 testCommentsTestsTemp = testCommentObject[masterData.selectedParameter.ntestparametercode]
//                 testCommentsTestsTemp.push(object);
//                 testCommentsTestsTab.push(object);
//                 testCommentObject[masterData.selectedParameter.ntestparametercode] = sortData(testCommentsTestsTemp, 'descending', 'npKAsampletestcommentscode')
        //             delete selectedRecord['nsampletestcommentscode']
//                 delete selectedRecord['ncommentsubtypecode']
//                 delete selectedRecord['ncommenttypecode']
//                 delete selectedRecord['sgeneralcomments']
        //         }
        //         else {
//                 npKAsampletestcommentscode++;
        //             let object = {
//                     npKAsampletestcommentscode: npKAsampletestcommentscode,
//                     ncommentsubtypecode: selectedRecord['ncommentsubtypecode']['value'],
//                     scommentsubtype: selectedRecord['ncommentsubtypecode']['label'],
//                     ncommenttypecode: selectedRecord['ncommenttypecode']['value'],
//                     scommenttype: selectedRecord['ncommenttypecode']['label'],
//                     nsampletestcommentscode: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'].value : -1,
//                     spredefinedname: selectedRecord['nsampletestcommentscode'] ? selectedRecord['nsampletestcommentscode'].label : "-",
//                     sgeneralcomments: selectedRecord['sgeneralcomments'] ? selectedRecord['sgeneralcomments'] : "-"
//                     , stestparametersynonym: masterData.selectedParameter.stestparametersynonym,
//                     ntestparametercode: masterData.selectedParameter.ntestparametercode
        //             }
//                 testCommentsTestsTemp.push(object);
//                 testCommentsTestsTab.push(object);
//                 testCommentObject[masterData.selectedParameter.ntestparametercode] = sortData(testCommentsTestsTemp, 'descending', 'npKAsampletestcommentscode')
        //             delete selectedRecord['nsampletestcommentscode']
//                 delete selectedRecord['ncommentsubtypecode']
//                 delete selectedRecord['ncommenttypecode']
//                 delete selectedRecord['sgeneralcomments']
        //         }
//             masterData['testComments'] = testCommentObject
        //         updateInfo = {
        //             typeName: DEFAULT_RETURN,
        //             data: {
        //                 openModalPopup: false,
        //                 masterData,
//                     testCommentObject,
//                     testCommentsTestsTab,
//                     npKAsampletestcommentscode,
        //                 selectedRecord
        //             }
        //         }
//             // }
//             // else {
//             //     toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
//             // }
        //     }
//         // else if (this.props.Login.action === 'IDS_ADDREPORTCOMMENTS') {
//         //     let isduplicate = {}
//         //     let spredefinedname = selectedRecord['nsampletestcommentscode'].label
//         //     let arraycheck = reportCommentObject[masterData.selectedParameter.ntestparametercode]
//         //     if (arraycheck) {
//         //         isduplicate = arraycheck.filter(x => x.spredefinedname === spredefinedname)
//         //     }
//         //     if (arraycheck !== undefined ? isduplicate.length > 0 ? false : true : true) {
//         //         masterData['reportComments'] = {}
//         //         let npKBsampletestcommentscode = 0;
//         //         if (reportCommentObject.hasOwnProperty(masterData.selectedParameter.ntestparametercode)) {
//         //             npKBsampletestcommentscode = this.props.Login.npKBsampletestcommentscode;
//         //             npKBsampletestcommentscode++;
//         //             let object = {
//         //                 npKBsampletestcommentscode: npKBsampletestcommentscode,
//         //                 nsampletestcommentscode: selectedRecord['nsampletestcommentscode'].value,
//         //                 spredefinedname: selectedRecord['nsampletestcommentscode'].label,
//         //                 scommentsubtype: this.props.Login.reportcomments[0].item.scommentsubtype
//         //                 , stestparametersynonym: masterData.selectedParameter.stestparametersynonym, ntestparametercode: masterData.selectedParameter.ntestparametercode
//         //             }
//         //             reportCommentsTestsTemp = reportCommentObject[masterData.selectedParameter.ntestparametercode]
//         //             reportCommentsTestsTemp.push(object);
//         //             reportCommentsTestsTab.push(object);
//         //             reportCommentObject[masterData.selectedParameter.ntestparametercode] = sortData(reportCommentsTestsTemp, 'descending', 'npKBsampletestcommentscode')
//         //             delete selectedRecord['nsampletestcommentscode']
//         //         }
//         //         else {
//         //             npKBsampletestcommentscode++;
//         //             let object = {
//         //                 npKBsampletestcommentscode: npKBsampletestcommentscode,
//         //                 nsampletestcommentscode: selectedRecord['nsampletestcommentscode'].value,
//         //                 spredefinedname: selectedRecord['nsampletestcommentscode'].label,
//         //                 scommentsubtype: this.props.Login.reportcomments[0].item.scommentsubtype
//         //                 , stestparametersynonym: masterData.selectedParameter.stestparametersynonym, ntestparametercode: masterData.selectedParameter.ntestparametercode
//         //             }
//         //             reportCommentsTestsTemp.push(object);
//         //             reportCommentsTestsTab.push(object);
//         //             reportCommentObject[masterData.selectedParameter.ntestparametercode] = sortData(reportCommentsTestsTemp, 'descending', 'npKBsampletestcommentscode')
//         //             delete selectedRecord['nsampletestcommentscode']
//         //         }
//         //         masterData['reportComments'] = reportCommentObject
//         //         updateInfo = {
//         //             typeName: DEFAULT_RETURN,
//         //             data: {
//         //                 openModalPopup: false,
//         //                 masterData,
//         //                 reportCommentObject,
//         //                 reportCommentsTestsTab,
//         //                 npKBsampletestcommentscode,
//         //                 selectedRecord
//         //             }
//         //         }
//         //     } else {
//         //         toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
//         //     }
//         // }
//         if (selectedRecord['nfromsitecode'] && selectedRecord['ntositecode']) {
//             masterData['testSite'] = {}
//             let siteseqnumber = 0;
//             if (siteObject.hasOwnProperty(masterData.selectedParameter.ntestparametercode)) {
//                 siteseqnumber = this.props.Login.siteseqnumber;
//                 siteseqnumber++;
//                 let object = {
//                     npksitecode: siteseqnumber, sfromsitename: selectedRecord['nfromsitecode'].label, stositename: selectedRecord['ntositecode'].label
//                     , stestparametersynonym: masterData.selectedParameter.stestparametersynonym, ntestparametercode: masterData.selectedParameter.ntestparametercode
        // }
//                 testInitiateSiteTemp = siteObject[masterData.selectedParameter.ntestparametercode]
//                 testInitiateSiteTemp.push(object);
//                 testInitiateSiteTab.push(object);
//                 siteObject[masterData.selectedParameter.ntestparametercode] = sortData(testInitiateSiteTemp, 'descending', 'npksitecode')
//                 delete selectedRecord['ntestparametercode']
//                 delete selectedRecord['nfromsitecode'];
//                 delete selectedRecord['ntositecode'];

//             }
//             else {
//                 siteseqnumber++;
//                 let object = {
//                     npksitecode: siteseqnumber, sfromsitename: selectedRecord['nfromsitecode'].label, stositename: selectedRecord['ntositecode'].label
//                     , stestparametersynonym: masterData.selectedParameter.stestparametersynonym, ntestparametercode: masterData.selectedParameter.ntestparametercode
//                 }
//                 testInitiateSiteTemp.push(object);
//                 testInitiateSiteTab.push(object);
//                 siteObject[masterData.selectedParameter.ntestparametercode] = sortData(testInitiateSiteTemp, 'descending', 'npksitecode')
//                 delete selectedRecord['ntestparametercode']
//                 delete selectedRecord['nfromsitecode'];
//                 delete selectedRecord['ntositecode'];
//             }
//             masterData['testSite'] = siteObject
//             updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     openModalPopup: false,
//                     masterData,
//                     siteObject,
//                     siteseqnumber,
//                     testInitiateSiteTab
//                 }
//             }
//         }
//         if (Object.keys(updateInfo).length > 0) {
//             this.props.updateStore(updateInfo);
//         }
//     }
//     deletModalSite = (inputparam, action, row) => {
//         let temparray = [];


//         let testInitiateSiteTab = this.props.Login.testInitiateSiteTab
//         let testCommentsTestsTab = this.props.Login.testCommentsTestsTab
//         let reportCommentsTestsTab = this.props.Login.reportCommentsTestsTab


//         let siteObject = this.props.Login.siteObject || {};
//         let testCommentObject = this.props.Login.testCommentObject || {};
//         let reportCommentObject = this.props.Login.reportCommentObject || {};
//         let masterData = this.props.Login.masterData || {};



//         if (this.props.Login.activeTabIndex === 1) {
//             temparray = siteObject[masterData.selectedParameter.ntestparametercode]
//             temparray.splice(row['dataIndex'], 1);
//             testInitiateSiteTab.splice(row['dataIndex'], 1);
//             siteObject[masterData.selectedParameter.ntestparametercode] = temparray

//         }
//         if (this.props.Login.activeTabIndex === 2) {
//             temparray = testCommentObject[masterData.selectedParameter.ntestparametercode]
//             temparray.splice(row['dataIndex'], 1);
//             testCommentsTestsTab.splice(row['dataIndex'], 1);
//             testCommentObject[masterData.selectedParameter.ntestparametercode] = temparray
//         }
//         if (this.props.Login.activeTabIndex === 3) {
//             temparray = reportCommentObject[masterData.selectedParameter.ntestparametercode]
//             temparray.splice(row['dataIndex'], 1);
//             reportCommentsTestsTab.splice(row['dataIndex'], 1);
//             reportCommentObject[masterData.selectedParameter.ntestparametercode] = temparray
//         }
//         let updateInfo = {}
//         updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 siteObject,
//                 testCommentObject,
//                 reportCommentObject,
//                 testInitiateSiteTab,
//                 reportCommentsTestsTab,
//                 testCommentsTestsTab
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     deleteModalTest = () => {

//         let testInitiateTests = this.props.Login.testInitiateTests || [];
//         let testCommentsTests = this.props.Login.testCommentsTests || [];
//         let reportCommentsTests = this.props.Login.reportCommentsTests || [];

//         let siteObject = this.props.Login.siteObject || {};
//         let testCommentObject = this.props.Login.testCommentObject || {};
//         let reportCommentObject = this.props.Login.reportCommentObject || {};


//         let testInitiateTestOptions = this.props.Login.testInitiateTestOptions || [];
//         let testCommentsTestOptions = this.props.Login.testCommentsTestOptions || [];
//         let reportCommentsTestOptions = this.props.Login.reportCommentsTestOptions || [];
//         let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];


//         let testInitiateTestdeletedOptions = this.props.Login.testInitiateTestdeletedOptions || [];
//         let testCommentsTestdeletedOptions = this.props.Login.testCommentsTestdeletedOptions || [];
//         let reportCommentsTestdeletedOptions = this.props.Login.reportCommentsTestdeletedOptions || [];

//         let masterData = this.props.Login.masterData || {};
//         let index = 0;
//         if (this.props.Login.activeTabIndex === 1) {
//             index = this.props.Login.testInitiateTests.findIndex(x => x.ntestparametercode === masterData.selectedParameter.ntestparametercode)
//             testInitiateTests.splice(index, 1);
//             delete siteObject[masterData.selectedParameter.ntestparametercode]
//         }
//         if (this.props.Login.activeTabIndex === 2) {
//             index = this.props.Login.testCommentsTests.findIndex(x => x.ntestparametercode === masterData.selectedParameter.ntestparametercode)
//             testCommentsTests.splice(index, 1);
//             delete testCommentObject[masterData.selectedParameter.ntestparametercode]
//         }
//         if (this.props.Login.activeTabIndex === 3) {
//             index = this.props.Login.reportCommentsTests.findIndex(x => x.ntestparametercode === masterData.selectedParameter.ntestparametercode)
//             reportCommentsTests.splice(index, 1);
//             delete reportCommentObject[masterData.selectedParameter.ntestparametercode]
//         }
//         let updateInfo = {}
//         updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 testInitiateTests,
//                 siteObject,
//                 testCommentObject,
//                 testCommentsTests,
//                 reportCommentsTests,
//                 reportCommentObject
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     onmodalComboChange = (comboData, fieldName) => {
//         let selectedRecord = this.state.selectedRecord || {};
//         let isneedsgeneralcomments = this.state.isneedsgeneralcomments || {}

//         if (fieldName === 'ncommentsubtypecode') {
//             if (comboData.value === 6) {
//                 isneedsgeneralcomments = true
//                 delete selectedRecord['nsampletestcommentscode']
//             }
//             else {
//                 isneedsgeneralcomments = false
//                 delete selectedRecord['sgeneralcomments']

//             }
//         }
//         selectedRecord[fieldName] = comboData;
//         this.setState({ selectedRecord, isneedsgeneralcomments });
//     }
//     getOutcomeDetails = (inputParam) => {
//         let masterData = this.props.Login.masterData || {};
//         const testParameter = this.state.activeTabIndex === 1 ? inputParam.testParameter : this.state.activeTabIndex === 2 ?
//             inputParam.testParameterComments : inputParam.testParameterreportComments;
//         masterData['selectedParameter'] = {}
//         masterData['selectedParameter'] = testParameter;
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 masterData
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     handleExpandChange = () => {
//         let childListMap1 = this.state.childListMap1 || new Map();
//         let childListMap2 = this.state.childListMap2 || new Map();
//         let childListMap3 = this.state.childListMap3 || new Map();
//         let childListMap = this.state.childListMap || new Map();
//         //     let keylst = this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE' ?
//         //     Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject']) :
//         //     this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS' ?
//         //         Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject']) :
//         //         Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'])
//         // keylst.map(key => {
//         //     childListMap.set(parseInt(key),
//         //         Object.values(this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE' ?
//         //             this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject'][key] :
//         //             this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS' ?
//         //                 this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'][key] :
//         //                 this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'][key]));
//         // })
//         // this.setState({ childListMap })
//         if (this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE') {
//             // let keylst =
//             //     Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject'])
//             // keylst.map(key => {
//             //     childListMap1.set(parseInt(key),
//             //         Object.values(
//             //             this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject'][key]));
//             // })
//             // this.setState({ childListMap1 })



        //     let keylst = this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE' ?
        //     Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject']) :
        //     this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS' ?
        //         Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject']) :
        //         Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'])
        // keylst.map(key => {
        //     childListMap.set(parseInt(key),
        //         Object.values(this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE' ?
        //             this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['siteObject'][key] :
        //             this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS' ?
        //                 this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'][key] :
        //                 this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'][key]));
        // })
        // this.setState({ childListMap })
//         }
//         if (this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS') {
//             let keylst = Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'])
//             keylst.map(key => {
//                 childListMap2.set(parseInt(key),
//                     Object.values(
//                         this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentObject'][key]));
//             })
//             this.setState({ childListMap2 })
//         }
//         if (this.props.Login.masterData.activeTabName === 'IDS_REPORTCOMMENTS') {
            // let keylst =
//                 Object.keys(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject']);
            // keylst.map(key => {
//                 childListMap3.set(parseInt(key),
            //         Object.values(
//                         this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentObject'][key]));
            // })
//             this.setState({ childListMap3 })
//         }
//     }
//     onTabChange = (tabProps) => {
//         let masterData = this.props.Login.masterData && this.props.Login.masterData
//         masterData['activeTabName'] = tabProps.activeTabName;
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { masterData }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     openflowview = () => {
//         let openModal = this.props.Login.openModal
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 openModal: true
//             }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     tabDetail = () => {
//         let masterData = this.props.Login.masterData || {};
//         let jsonuidata = this.props.Login.masterData.SelectedRulesEngine && this.props.Login.masterData.SelectedRulesEngine['jsonuidata']
//         // let childList = this.props.Login.screenName === 'IDS_NEEDTESTINITIATE' ? jsonuidata && jsonuidata['siteObject'] : jsonuidata 
//         // && jsonuidata['testCommentObject']
//         // let parentlist = this.props.Login.masterData.activeTabName === 'IDS_NEEDTESTINITIATE' ? jsonuidata['siteObject']
//         // [masterData.selectedParameter.ntestparametercode] :
//         //     this.props.Login.masterData.activeTabName === 'IDS_TESTCOMMENTS' ? jsonuidata['testCommentObject'][masterData.selectedParameter.ntestparametercode]
//         //         : jsonuidata['reportCommentObject'][masterData.selectedParameter.ntestparametercode]
//         const tabMap = new Map();
//         {
//             tabMap.set("IDS_NEEDTESTINITIATE",
//                 <DataGrid
//                     key="testsectionkey"
//                     primaryKeyField="nresultusedmaterialcode"
                    //expandField="expanded"
//                     handleExpandChange={this.handleExpandChange}
//                     //   dataResult={props.dataResult || []}

//                     dataResult={this.props.Login.masterData.SelectedRulesEngine &&
//                         this.props.Login.masterData.SelectedRulesEngine && process(
//                             sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testInitiateTests'], "descending", "npkAtestparametercode")
//                             || [],
//                             this.state.dataStatetestinitiate
//                                 ? this.state.dataStatetestinitiate : { skip: 0, take: 10 })}
//                     //dataState={{ skip: 0, take: 10 }}
//                     // dataStateChange={props.dataStateChange}

//                     dataState={this.state.dataStatetestinitiate
//                         ? this.state.dataStatetestinitiate : { skip: 0, take: 10 }}
//                     // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
//                     dataStateChange={this.dataStateChangetestinitiate}

                    // extractedColumnList={[
                    //     { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" }
                    // ]}
//                     controlMap={this.state.controlMap}
//                     userRoleControlRights={this.state.userRoleControlRights}
//                     pageable={true}
//                     //    isActionRequired={true}
//                     scrollable={'scrollable'}
//                     hideColumnFilter={false}
//                     selectedId={0}
//                     //hasDynamicColSize={true}
//                     //testParameter={testParameter}
//                     //deleteRecord={props.deletModalSite}
//                     deleteParam={{ operation: "delete" }}
//                     // actionIcons={[{
//                     //     title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
//                     //     controlname: "faTrashAlt",
//                     //     hidden: false,
//                     //     objectName: "delete",
//                     //     onClick: props.deletModalSite

//                     // }]}
                    //hasChild={true}
//                     childMappingField={'ntestparametercode'}
//                     childColumnList={[

//                         { "idsName": "IDS_FROMSITE", "dataField": "sfromsitename", "width": "200px" },
//                         { "idsName": "IDS_TOSITE", "dataField": "stositename", "width": "200px" }
                    // ]} 
//                     childList={this.state.childListMap}
//                     activeTabName={"IDS_NEEDTESTINITIATE"}
//                 >
//                 </DataGrid>);
//             tabMap.set("IDS_TESTCOMMENTS",
            //     <DataGrid
            //         key="testsectionkey"
            //         primaryKeyField="nresultusedmaterialcode"
            //         //expandField="expanded"
            //         handleExpandChange={this.handleExpandChange}
            //         //   dataResult={props.dataResult || []}

//                     dataResult={this.props.Login.masterData.SelectedRulesEngine && process(
//                         sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['testCommentsTestsTab'], "descending", "npkAtestparametercode")
            //             || [],
            //             this.state.dataState
            //                 ? this.state.dataState : { skip: 0, take: 10 })}
            //         //dataState={{ skip: 0, take: 10 }}
            //         // dataStateChange={props.dataStateChange}

            //         dataState={this.state.dataState
            //             ? this.state.dataState : { skip: 0, take: 10 }}
            //         // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
            //         dataStateChange={this.dataStateChange}

            //         // extractedColumnList={[
            //         //     { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" }
            //         // ]}
            //         controlMap={this.state.controlMap}
            //         userRoleControlRights={this.state.userRoleControlRights}
            //         pageable={true}
//                     //     isActionRequired={true}
            //         scrollable={'scrollable'}
            //         hideColumnFilter={false}
            //         selectedId={0}
            //         //hasDynamicColSize={true}
            //         //testParameter={testParameter}
            //         //deleteRecord={props.deletModalSite}
            //         deleteParam={{ operation: "delete" }}
            //         // actionIcons={[{
            //         //     title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            //         //     controlname: "faTrashAlt",
            //         //     hidden: false,
            //         //     objectName: "delete",
            //         //     onClick: props.deletModalSite

            //         // }]}
            //         //  hasChild={true}
            //         childMappingField={'ntestparametercode'}
//                     // extractedColumnList={[
//                     //     { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" },
//                     //     { "idsName": "IDS_TESTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
//                     // ]} 

            //         extractedColumnList={[
            //             { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" },
//                         { "idsName": "IDS_COMMENTTYPE", "dataField": "scommenttype", "width": "200px" },
//                         { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "scommentsubtype", "width": "200px" },
//                         { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "spredefinedname", "width": "200px" },
//                         { "idsName": "IDS_GENERALCOMMENTS", "dataField": "sgeneralcomments", "width": "200px" }
//                         // props.activeTabIndex == 2 ? { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "spredefinedname", "width": "200px" } :
//                         //     { "idsName": "IDS_REPORTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
            //         ]}
//                     childList={this.state.childListMap2 && this.state.childListMap2}
//                     activeTabName={"IDS_TESTCOMMENTS"}
            //     >
            //     </DataGrid>
            // );
//             // tabMap.set("IDS_REPORTCOMMENTS",
//             //     <DataGrid
//             //         key="testsectionkey"
//             //         primaryKeyField="nresultusedmaterialcode"
//             //         //expandField="expanded"
//             //         handleExpandChange={this.handleExpandChange}
//             //         //   dataResult={props.dataResult || []}

//             //         dataResult={this.props.Login.masterData.SelectedRulesEngine['jsonuidata'] && process(

//             //             sortData(this.props.Login.masterData.SelectedRulesEngine['jsonuidata']['reportCommentsTestsTab'], "descending", "npkBtestparametercode")
//             //             || [],
//             //             this.state.dataState
//             //                 ? this.state.dataState : { skip: 0, take: 10 })}
//             //         //dataState={{ skip: 0, take: 10 }}
//             //         // dataStateChange={props.dataStateChange}

//             //         dataState={this.state.dataState
//             //             ? this.state.dataState : { skip: 0, take: 10 }}
//             //         // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
//             //         dataStateChange={this.dataStateChange}

//             //         // extractedColumnList={[
//             //         //     { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" }
//             //         // ]}
//             //         controlMap={this.state.controlMap}
//             //         userRoleControlRights={this.state.userRoleControlRights}
//             //         pageable={true}
//             //         isActionRequired={true}
//             //         scrollable={'scrollable'}
//             //         hideColumnFilter={false}
//             //         selectedId={0}
//             //         //hasDynamicColSize={true}
//             //         //testParameter={testParameter}
//             //         //deleteRecord={props.deletModalSite}
//             //         deleteParam={{ operation: "delete" }}
//             //         // actionIcons={[{
//             //         //     title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
//             //         //     controlname: "faTrashAlt",
//             //         //     hidden: false,
//             //         //     objectName: "delete",
//             //         //     onClick: props.deletModalSite

//             //         // }]}
//             //         //  hasChild={true}
//             //         childMappingField={'ntestparametercode'}
//             //         extractedColumnList={[
//             //             { "idsName": "IDS_TESTNAME", "dataField": "stestparametersynonym", "width": "200px" },
//             //             { "idsName": "IDS_REPORTCOMMENTS", "dataField": "spredefinedname", "width": "200px" }
//             //         ]}
//             //         childList={this.state.childListMap3 && this.state.childListMap3}
//             //         activeTabName={"IDS_REPORTCOMMENTS"}
//             //     >
//             //     </DataGrid>
//             // );

//         }
//         return tabMap;
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

//         //  if (selectedRecord["sviewname"]) {
//         let viewColumnListByRule = this.props.Login.viewColumnListByRule || [];
//         const addGroupList = this.props.Login.addGroupList || [];
//         const arrayLength = addGroupList.length;
//         addGroupList[arrayLength] = 1;
//         // viewColumnListByRule[arrayLength] = [];
//         // viewColumnListByRule[arrayLength].push(this.props.Login.viewColumnList);


//         viewColumnListByRule = this.props.Login.databaseviewList;
//         if (arrayLength === 0) {
//             selectedRecord["groupList"] = [];
//             selectedRecord["filtercolumns"] = this.props.Login.selectFields;
//         }
//         if (selectedRecord["groupListJoins"] === undefined) {
//             selectedRecord["groupListJoins"] = []
//         }
//         if (selectedRecord["groupListJoins"][arrayLength - 1] === undefined) {
//             selectedRecord["groupListJoins"][arrayLength - 1] = {}
//         }
//         selectedRecord["groupListJoins"][arrayLength - 1]["button_and"] = true;

//         selectedRecord["groupList"][arrayLength] = [];
//         selectedRecord["groupList"][arrayLength]["button_and"] = true;
//         selectedRecord["groupList"][arrayLength][0] = {};

//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 addGroupList,
//                 viewColumnListByRule,
//                 selectedRecord
//             }
//         }
//         this.props.updateStore(updateInfo);
//         // } else {
//         //     toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTVIEW" }));
//         // }
//     }
//     getRulesEngineAdd = () => {
//         if(this.state.selectedcombo['nproductcatcode'])
//         {
//             const sqlQuery = false;
//             this.setState({ selectedRecord: {} });
//             this.props.getRulesEngineAdd(this.props.Login.userInfo, sqlQuery, {
//                 addRuleList: [], addGroupList: [],
//                 addAggregateList: [], addOrderbyList: []
//             }, this.props.Login.masterData);
        // } else {
//             toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPRODUCTCATEGORY" }));

        // }


//     }
//     closePortalModal = () => {
//         let masterData = this.props.Login.masterData || {};
//         // let modalTestsaveddata = this.props.Login.modalTestsaveddata || [];
//         // let modalSitesaveddata = this.props.Login.modalSitesaveddata || [];
//         // let modalSiteObject = this.props.Login.modalSiteObject || {};


//         // let testInitiateTests = this.props.Login.testInitiateTests || [];
//         // let testCommentsTests = this.props.Login.testCommentsTests || [];
//         // let reportCommentsTests = this.props.Login.reportCommentsTests || [];

//         // let siteObject = this.props.Login.siteObject || {};
//         // let testCommentObject = this.props.Login.testCommentObject || {};
//         // let reportCommentObject = this.props.Login.reportCommentObject || {};



//         masterData['testParameter'] = {}
//         masterData['testParameterComments'] = {}
//         masterData['testParameterreportComments'] = {}
//         masterData['testComments'] = {}
//         masterData['reportComments'] = {}
//         masterData['testSite'] = {}
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: this.props.Login.operation !== 'update' ? {
//                 activeTabIndex: 0,
//                 openPortalModal: false, selectedRecord: {}, addRuleList: [], count: 0,
//                 masterData, testInitiateTests: [], reportCommentsTests: [],
                // testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {},
//                 npkAtestparametercode: 0,
//                 npkBtestparametercode: 0,
//                 npkCtestparametercode: 0,
                // testInitiateSiteTab: [],
                // testCommentsTestsTab: [],
                // reportCommentsTestsTab: []
//             } : {
//                 activeTabIndex: 0,
//                 openPortalModal: false, selectedRecord: {}, addRuleList: [], count: 0,
//                 masterData,
//                 //  testInitiateTests: [], reportCommentsTests: [],
//                 // testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {},
//                 npkAtestparametercode: 0,
//                 npkBtestparametercode: 0,
//                 npkCtestparametercode: 0
//                 // ,
//                 // testInitiateSiteTab: [],
//                 // testCommentsTestsTab: [],
//                 // reportCommentsTestsTab: []
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
//     // sideNavDetail = (screenName) => {
//     //     return (
//     //         <CustomTabs activeKey={this.props.Login.activeTestTab || "IDS_NEEDTESTINITIATE"} tabDetail={this.TabDetails()} onTabChange={this.onTabChange} />

//     //     )
//     // }
//     changePropertyView = (index, event, status) => {

//         let id = false;
//         let activeTabIndex
//         let activeTabId
//         let masterData = this.props.Login.masterData || {};
//         let activeTestTab = this.props.Login.activeTestTab || ""
//         if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
//             activeTabIndex = this.state.activeTabIndex !== index ? index : id ? index : false;
    // }
//         if (window.innerWidth > 992 && event && this.state.enableAutoClick || !event) {
//             if (index === 1) {
//                 activeTestTab = 'IDS_NEEDTESTINITIATE'
//                 masterData['selectedParameter'] = this.props.Login.testInitiateTests && this.props.Login.testInitiateTests[0]
//             }
//             if (index === 2) {
//                 activeTestTab = 'IDS_TESTCOMMENTS'
//                 masterData['selectedParameter'] = this.props.Login.testCommentsTests && this.props.Login.testCommentsTests[0]
//             }
//             if (index === 3) {
//                 activeTestTab = 'IDS_REPORTCOMMENTS'
//                 masterData['selectedParameter'] = this.props.Login.reportCommentsTests && this.props.Login.reportCommentsTests[0]
//             }

//             const updateInfo = {
//                 typeName: DEFAULT_RETURN,
//                 data: {
//                     activeTabIndex: index === 0 ? 0 : this.state.activeTabIndex !== index ? index : id ? index : false,
//                     activeTabId: id,
//                     activeTestTab,
//                     masterData
//                 }
//             }
//             this.props.updateStore(updateInfo);
//         }
//     }


//     deleteRule = (groupIndex, index) => {
//         let addGroupList = this.props.Login.addGroupList || [];
//         const selectedRecord = this.state.selectedRecord;
//         addGroupList[groupIndex] = addGroupList[groupIndex] - 1;

//         if (addGroupList[groupIndex] === 0) {
//             addGroupList.splice(groupIndex, 1);
//             selectedRecord["groupList"].splice(groupIndex, 1);
//             if (selectedRecord["groupListJoins"]) {
//                 selectedRecord["groupListJoins"].splice(groupIndex - 1, 1);
//             }
//         } else {
//             selectedRecord["groupList"][groupIndex].splice(index, 1);
//         }
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { addGroupList, selectedRecord }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     deleteOutcome = (index) => {
//         let addOutcomeList = this.props.Login.addOutcomeList;
//         addOutcomeList.splice(index, 1);
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: { addOutcomeList }
//         }
//         this.props.updateStore(updateInfo);
//     }
//     clearSelectedRule(selectedRecord, index) {
//         selectedRecord["sinputname_" + index] && delete selectedRecord["sinputname_" + index];
//         selectedRecord["ssymbolname_" + index] && delete selectedRecord["ssymbolname_" + index];
//         selectedRecord["snumericinput_" + index] && delete selectedRecord["snumericinput_" + index];
//         selectedRecord["columnname_" + index] && delete selectedRecord["columnname_" + index];
//         selectedRecord["snumericinputtwo_" + index] && delete selectedRecord["snumericinputtwo_" + index];
//         selectedRecord["dateinput_" + index] && delete selectedRecord["dateinput_" + index];
//         selectedRecord["dateinputtwo_" + index] && delete selectedRecord["dateinputtwo_" + index];
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
//         let masterData = this.props.Login.masterData || {};
//         let selectedRecord = this.state.selectedRecord || {}
//         masterData['testParameter'] = {}
//         masterData['testParameterComments'] = {}
//         masterData['testParameterreportComments'] = {}
//         masterData['testComments'] = {}
//         masterData['reportComments'] = {}
//         masterData['testSite'] = {}
//         if (selectedRecord["groupList"]) {
//             selectedRecord["groupList"] = []

//         }
//         if (selectedRecord["groupListJoins"]) {
//             selectedRecord["groupListJoins"] = []

//         }
//         const updateInfo = {
//             typeName: DEFAULT_RETURN,
//             data: {
//                 addRuleList: [], addGroupList: [],
//                 addAggregateList: [], addOrderbyList: [], testInitiateTests: [], reportCommentsTests: [],
//                 testCommentsTests: [], siteObject: {}, testCommentObject: {}, reportCommentObject: {}, selectedRecord
//             }
//         }
//         this.props.updateStore(updateInfo);

//     }

//     onSymbolChange = (comboData, fieldName, groupIndex, index) => {
//         const { selectedRecord } = this.state;
//         const oldSelectedRecord = selectedRecord["groupList"][groupIndex][index][fieldName] || {};
//         selectedRecord["groupList"][groupIndex][index][fieldName] = comboData;
//         this.setState({ selectedRecord, groupIndex, index });
//     }

//     onInputChange = (event, type, groupIndex, index) => {
//         const selectedRecord = this.state.selectedRecord || {};
//         let needoutsource = this.state.needoutsource || {};
//         if (event.target.type === 'checkbox') {
//             if (event.target.name === 'needoutsource' && event.target.checked === true) {
//                 needoutsource = true
//             }
//             else {
//                 needoutsource = false
//                 delete selectedRecord['nfromsitecode'];
//                 delete selectedRecord['ntositecode'];
//             }
//             selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
//         }
//         else {
//             selectedRecord[event.target.name] = event.target.value;
//         }
//         this.setState({ selectedRecord, needoutsource });
//     }



//     viewColumnListByRule = (list) => {
//         let activeTabIndex = this.props.Login.activeTabIndex
//         let selectedRecord = this.props.Login.selectedRecord && this.props.Login.selectedRecord
//         let dynamicList = activeTabIndex === 1 ? this.props.Login.testInitiateTests : activeTabIndex === 2 ? this.props.Login.testCommentsTests : this.props.Login.reportCommentsTests
//         list = list.filter(({ value }) => !dynamicList.some(x => x.ntestparametercode == value))
//         return list
//     }
//     onConditionClick = (fieldName, index, isgroup) => {
//         let { selectedRecord } = this.state;
//         selectedRecord["groupListJoins"] = selectedRecord["groupListJoins"] || []
//         if (index !== undefined && isgroup === false) {
//             if (fieldName === `button_and`) {
//                 selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? true : true;
//                 selectedRecord["groupList"][index][`button_or`] = false;
//             } else if (fieldName === `button_or`) {
//                 selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? true : true;
//                 selectedRecord["groupList"][index][`button_and`] = false;
//             } else if (fieldName === `button_not`) {
//                 selectedRecord["groupList"][index][fieldName] = selectedRecord["groupList"][index][fieldName] === true ? false : true;
//             }
//             else {

//             }
//             this.setState({ selectedRecord });
//         }
//         else {
//             if (fieldName === `button_and`) {
//                 if (selectedRecord["groupListJoins"][index] === undefined) {
//                     selectedRecord["groupListJoins"][index] = {}
//                 }
//                 selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? true : true;
//                 selectedRecord["groupListJoins"][index][`button_or`] = false;
//             }
//             if (fieldName === `button_or`) {
//                 if (selectedRecord["groupListJoins"][index] === undefined) {
//                     selectedRecord["groupListJoins"][index] = {}
//                 }
//                 selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? true : true;
//                 selectedRecord["groupListJoins"][index][`button_and`] = false;
//             }
//             if (fieldName === `button_not`) {
//                 if (selectedRecord["groupListJoins"][index] === undefined) {
//                     selectedRecord["groupListJoins"][index] = {}
//                 }
//                 selectedRecord["groupListJoins"][index][fieldName] = selectedRecord["groupListJoins"][index][fieldName] === true ? false : true;
//             }
//             this.setState({ selectedRecord });
//         }

//     }


// }

// const mapStateToProps = (state) => {
//     return {
//         Login: state.Login
//     }
// }

// export default connect(mapStateToProps, {
//     callService, crudMaster, updateStore, filterColumnData,
//     validateEsignCredential,
//     getRulesEngineAdd,
//     getSelectedRulesEngine, getRulesEngine, getEditRulesEngine
// })(injectIntl(RuleEngineQueryBuilder));