import React, { Component } from 'react';
import { faThumbsUp, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row, Button, FormGroup, FormLabel, Nav, Form } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import TransactionListMaster from '../../../components/TransactionListMaster';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { SampleType, designProperties } from '../../../components/Enumeration';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import { ProductList } from '../../testmanagement/testmaster-styled';
import { ListWrapper } from '../../../components/client-group.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';
import '../../registration/registration.css';
import {
    callService, getReportMasterComboService, updateStore, getSelectedReportMasterDetail,
    getReportDetailComboService, getSelectedReportDetail, getConfigReportComboService,
    getParameterMappingComboService, //getActionMappingComboService, 
    filterTransactionList, getReportSubType, getregtype, validationReportparameter, controlBasedReportparametretable,
    //controlBasedReportparametretablecolumn,
    crudMaster, getReportRegSubType, validateEsignCredential, getControlButton, getReportRegSubTypeApproveConfigVersion, getReportSampletype,
    getReportTemplate, controlBasedReportparametre
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap, create_UUID, constructOptionList, Lims_JSON_stringify, validateDays, replaceBackSlash } from '../../../components/CommonScript';
import AddDesign from '../../../components/add-design/add-design.component';
import ParameterMapping from '../../../components/add-design/parameter-mapping.component';
import { reportTypeEnum, transactionStatus, RegistrationType, reportCOAType } from '../../../components/Enumeration';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { designComponents } from '../../../components/Enumeration';

import Esign from '../../audittrail/Esign';
import AddReportMaster from './AddReportMaster';
import AddReportDetail from './AddReportDetail';
import AddAttachment from './AddAttachment';
import ReportConfigFilter from './ReportConfigFilter';

import { ReactComponent as ParameterConfigurationIcon } from '../../../assets/image/parameter-configuration.svg';
import { ReactComponent as ParameterMappingIcon } from '../../../assets/image/parameter-mapping.svg';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import AddReportValidation from './AddReportValidation';
import AddReportParameters from './AddReportParameters';

const mapStatetoProps = (state) => {
    return {
        Login: state.Login
    }
}

class ReportConfig extends Component {
    constructor(props) {
        super(props)
        // const dataState = {
        //     skip: 0,
        //     take: 10,
        // }; 
        this.searchRef = React.createRef();
        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "", //dataState, dataResult:[],
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            // actionMappingParentList:[],
            addMappingParam: [],
            firstPane: 0,
            paneHeight: 0,
            secondPaneHeight: 0,
            tabPane: 0,
            //masterSkip:0,
            //masterTake:25,
            detailSkip: 0,
            detailTake: 10,
            splitChangeWidthPercentage: 22,
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
             panes: [
                { size: '30%', min: '25%', resizable: true, collapsible: true }
            ],
            //   panel: [
            //     { size: '30%', min: '25%' }
            // ],

        }

        this.parameterColumnList = [{ "idsName": "IDS_PARAMETERS", "dataField": "sreportparametername", "width": "250px" },
        { "idsName": "IDS_DATATYPE", "dataField": "sdisplaydatatype", "width": "400px" },
        ];

        this.designInputFieldList = [
            { "idsName": "IDS_REPORTNAME", "dataField": "sreportname" },
            {
                "idsName": "IDS_INPUTTYPE", "dataField": "ndesigncomponentcode", "listName": "designComponentList",
                "optionId": "ndesigncomponentcode", "optionValue": "sdesigncomponentname"
            },
            {
                "idsName": "IDS_PARAMETERS", "dataField": "nreportparametercode", "listName": "reportParameterList",
                "optionId": "nreportparametercode", "optionValue": "sreportparametername"
            },
            {
                "idsName": "IDS_EXISTINGLINKTABLE", "dataField": "nsqlquerycode", "listName": "sqlQueryList",
                "optionId": "nsqlquerycode", "optionValue": "ssqlqueryname"
            },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname" },
            { "idsName": "IDS_DAYS", "dataField": "ndays", "maxLength": 5 },
            //{ "idsName": "IDS_MANDATORY", "dataField": "nmandatory"}
        ];
        this.designGridColumnList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "sreportparametername", "width": "200px" },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_INPUTTYPE", "dataField": "sdesigncomponentname", "width": "200px" },
            // { "idsName": "IDS_SQLQUERY", "dataField": "ssqlqueryname", "width": "200px" },
            //  { "idsName": "IDS_DAYS", "dataField": "ndays", "width": "150px" },
            // { "idsName": "IDS_MANDATORY", "dataField": "smandatory", "width": "150px" },
        ];

        this.tabGridColumnList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "sreportparametername", "width": "200px" },
            { "idsName": "IDS_DISPLAYNAME", "dataField": "sdisplayname", "width": "200px" },
            { "idsName": "IDS_INPUTTYPE", "dataField": "sdesigncomponentname", "width": "200px" },
            { "idsName": "IDS_SQLQUERY", "dataField": "ssqlqueryname", "width": "200px" },
            { "idsName": "IDS_DAYS", "dataField": "ndays", "width": "150px" },
            { "idsName": "IDS_MANDATORY", "dataField": "smandatory", "width": "150px" },
        ];

        this.mappingGridFieldList = [
            { "idsName": "IDS_PARAMETERS", "dataField": "schildparametername", "width": "200px" },
            { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
            { "idsName": "IDS_PARENTPARAMETER", "dataField": "sparentparametername", "width": "300px" },
            { "idsName": "IDS_ACTIONPARAMETER", "dataField": "sisactionparent", "width": "200px" }
        ];
        this.detailedGridFieldList = [
            { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
            { "idsName": "IDS_PARENTPARAMETER", "dataField": "sparentparametername", "width": "200px" },
            {
                "idsName": "IDS_ACTIONPARAMETER", "dataField": "nisactionparent", "width": "200px",
                "componentName": "switch", "switchFieldName": "nisactionparent",
                "switchStatus": transactionStatus.YES, "needRights": false, //"controlName": "DefaultTestSection"
            },

        ];

        this.mappingInputFieldList = [
            {
                "idsName": "IDS_PARAMETER", "dataField": "nchildreportdesigncode", "listName": "childComponentList",
                "optionId": "nreportdesigncode", "optionValue": "sdisplayname"
            },
            {
                "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "listName": "optionalParameterList",
                "optionId": "value", "optionValue": "label"
            },
            {
                "idsName": "IDS_PARENTPARAMETER", "dataField": "nparentreportdesigncode", "listName": "parentComponentList",
                "optionId": "nreportdesigncode", "optionValue": "sdisplayname"
            },
            // { "idsName": "IDS_ACTIONPARAMETER", "dataField": "nactionreportdesigncode","listName":"actionMappingParentList",
            //        "optionId":"nreportdesigncode",  "optionValue":"sdisplayname"},

        ];

        // this.actionGridFieldList = [
        //                    { "idsName": "IDS_ACTIONPARAMETER", "dataField": "sparentparametername", "width":"300px"},
        //                    { "idsName": "IDS_CHILDPARAMETER", "dataField": "schildparametername", "width":"300px"},
        //                     ];

        this.subReportGridFieldList = [
            { "idsName": "IDS_FILE", "dataField": "sfilename", "width": "300px" },
            { "idsName": "IDS_FTPFILE", "dataField": "ssystemfilename", "width": "400px" },
        ];

        this.imageGridFieldList = [
            { "idsName": "IDS_FILE", "dataField": "sfilename", "width": "300px" },
            { "idsName": "IDS_FTPFILE", "dataField": "ssystemfilename", "width": "400px" },
        ];
        this.transValidationFieldList = [
            { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransactionstatus", "width": "300px" }
        ];
        this.reportparametermappingcolumn = [
            { "idsName": "IDS_REPORTPARAMETER", "dataField": "scontrolBasedparameter", "width": "300px" },
            { "idsName": "IDS_FIELDNAME", "dataField": "stablecolumn", "width": "300px" }
            // ,{ "idsName": "IDS_REPORTTABLECOLUMNNAME", "dataField": "stablecolumn", "width": "300px" }
        ];
        this.reportparametermappingcolumndatagrid = [
            { "idsName": "IDS_REPORTPARAMETER", "dataField": "scontrolBasedparameter", "width": "200px" },
            { "idsName": "IDS_FIELDNAME", "dataField": "stablecolumn", "width": "200px" }

        ];

        //  this.formRef = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
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

    onSecondaryPaneSizeChange = (e, val) => {
        this.setState({
            firstPane: e - val,
            tabPane: e - 80,
            childPane: this.state.parentHeight - e - 80
        })
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height - 50
            });
        }
    }

    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };


    render() {

        const addMasterId = this.state.controlMap.has("AddReportMaster") && this.state.controlMap.get("AddReportMaster").ncontrolcode;
        const editMasterId = this.state.controlMap.has("EditReportMaster") && this.state.controlMap.get("EditReportMaster").ncontrolcode;
        const deleteMasterId = this.state.controlMap.has("DeleteReportMaster") && this.state.controlMap.get("DeleteReportMaster").ncontrolcode;

        const filterParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster", primaryKeyField: "nreportcode",
            fetchUrl: "reportconfig/getReportDesigner", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, childRefs: [],
            searchFieldList: ["sreportname", "sreportdisplayname", "sregtypename",
                "sregsubtypename", "sreportmodulename", "sactivestatus", "scontrolids", "sdisplayname"],
            changeList: ["ReportDetails", "SelectedReportDetail", "ReportParameter", "ReportDesignConfig",
                "ReportParameterMapping", "ReportParameterAction", "SubReportDetails", "ReportImages"], isSingleSelect: true

        };

        const addMasterParam = {
            screenName: "IDS_REPORTMASTER", operation: "create", primaryKeyName: "nreportcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addMasterId,
            filterReportType: this.props.Login.masterData.SelectedFilterReportType
        }
        

        const addDetailId = this.state.controlMap.has("AddReportDetails") && this.state.controlMap.get("AddReportDetails").ncontrolcode;
        const editDetailId = this.state.controlMap.has("EditReportDetails") && this.state.controlMap.get("EditReportDetails").ncontrolcode;
        const deleteDetailId = this.state.controlMap.has("DeleteReportDetails") && this.state.controlMap.get("DeleteReportDetails").ncontrolcode;

        const addDetailParam = {
            screenName: "IDS_REPORTVERSION", operation: "create", primaryKeyName: "nreportdetailcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addDetailId
        }

        const configReportId = this.state.controlMap.has("AddReportDesignParameter") && this.state.controlMap.get("AddReportDesignParameter").ncontrolcode;
        const parameterMapId = this.state.controlMap.has("AddReportParameterMapping") && this.state.controlMap.get("AddReportParameterMapping").ncontrolcode;
        const approveReportId = this.state.controlMap.has("ApproveReportVersion") && this.state.controlMap.get("ApproveReportVersion").ncontrolcode;

        const confirmMessage = new ConfirmMessage();

        let mandatoryFields = [];
        if (this.props.Login.screenName === "IDS_REPORTMASTER") {
            if (this.props.Login.operation === "create") {
                mandatoryFields.push({ "idsName": "IDS_REPORTTYPE", "dataField": "nreporttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                if (this.state.selectedRecord["nreporttypecode"] && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA || this.state.selectedRecord["nreporttypecode"] && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPREVIEW
                    || this.state.selectedRecord["nreporttypecode"] && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPRELIMINARY) {
                    mandatoryFields.push({ "idsName": "IDS_SAMPLETYPE", "dataField": "nsampletypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_REGISTRATIONTYPE", "dataField": "nregtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_REGISTRATIONSUBTYPE", "dataField": "nregsubtypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_APPROVECONFIGVERSION", "dataField": "napproveconfversioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_REPORTSUBTYPE", "dataField": "ncoareporttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    {
                        this.state.selectedRecord["isneedsection"] || this.state.selectedRecord["ncoareporttypecode"] && this.state.selectedRecord["ncoareporttypecode"].item && this.state.selectedRecord["ncoareporttypecode"].item.isneedsection === transactionStatus.YES &&
                            mandatoryFields.push({ "idsName": "IDS_SECTION", "dataField": "nsectioncode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    }
                    {
                        this.state.selectedRecord && this.state.selectedRecord["nsampletypecode"] && this.state.selectedRecord["nsampletypecode"].value !== SampleType.CLINICALTYPE &&
                        mandatoryFields.push({ "idsName": "IDS_REPORTTEMPLATE", "dataField": "nreporttemplatecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    }
                    // if(this.state.selectedRecord["ncoareporttypecode"] && this.state.selectedRecord["ncoareporttypecode"].value === reportCOAType.PROJECTWISE
                    // && this.props.Login.settings && parseInt(this.props.Login.settings[29]) === transactionStatus.YES){
                    //     mandatoryFields.push({ "idsName": "IDS_REPORTTEMPLATE", "dataField": "nreporttemplatecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    // }
                } else if (this.state.selectedRecord["nreporttypecode"] && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.MIS) {
                    mandatoryFields.push({ "idsName": "IDS_MODULENAME", "dataField": "nreportmodulecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });

                } else if (this.state.selectedRecord["nreporttypecode"] && (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.BATCH
                    || this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE)) {
                    ;
                    mandatoryFields.push({ "idsName": "IDS_COAREPORTTYPE", "dataField": "ncoareporttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_CERTIFICATETYPE", "dataField": "ncertificatetypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });

                } else if (this.state.selectedRecord["nreporttypecode"] && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SCREENWISE) {
                    mandatoryFields.push({ "idsName": "IDS_SCREENNAME", "dataField": "nformcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                    mandatoryFields.push({ "idsName": "IDS_CONTROLNAME", "dataField": "ncontrolcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
                }

            }
            mandatoryFields.push(
                { "idsName": "IDS_REPORTNAME", "dataField": "sreportname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" });
                //ATE234 Janakumar ALPD-5271 -> Report Designer - Add Report not showing section field and save & Approve the report then click edit button section field showing.
                if (this.state.selectedRecord["ncoareporttypecode"] && this.state.selectedRecord["ncoareporttypecode"].item !== undefined ? this.state.selectedRecord["ncoareporttypecode"].item.isneedsection === transactionStatus.YES : (this.state.selectedRecord["isneedsection"] && this.state.selectedRecord["isneedsection"]=== transactionStatus.YES)) {
                    mandatoryFields.push({ idsName: "IDS_SECTION",dataField: "nsectioncode", mandatoryLabel: "IDS_SELECT",controlType: "selectbox"});
                }
            
                this.props.Login.operation === "create" && mandatoryFields.push({ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });

        }
        else if (this.props.Login.screenName === "IDS_REPORTVERSION") {
            if (this.state.selectedRecord["nreporttypecode"]
                && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE) {
                mandatoryFields.push(
                    { "idsName": "IDS_COAREPORTTYPE", "dataField": "ncoareporttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    // { "idsName": "IDS_LAB", "dataField": "nsectioncode" },
                    { "idsName": "IDS_DECISIONTYPE", "dataField": "nreportdecisiontypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });
            }
            else if (this.state.selectedRecord["nreporttypecode"]
                && this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.BATCH) {
                mandatoryFields.push({ "idsName": "IDS_COAREPORTTYPE", "dataField": "ncoareporttypecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });
            }
            else {
                mandatoryFields.push({ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });
            }

        }
        else {
            if (this.props.Login.screenName === "IDS_SUBREPORTS" || this.props.Login.screenName === "IDS_IMAGES") {
                mandatoryFields.push({ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" });
            }
        }

        const breadCrumbData = this.state.filterData || [];
        ///console.log("masterdata:", this.props.Login.masterData);
        return (

            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        : ""}
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height">
                            {/* <Col md={12} className='parent-port-height-nobreadcrumb sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper> */}
                            {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} onSecondaryPaneSizeChange={this.paneSizeChange} secondaryInitialSize={25} primaryMinSize={40} secondaryMinSize={20}> */}
                               <Splitter  panes={this.state.panes} onChange={this.onSplitterChange} orientation="horizontal">
                                    <SplitterPane size="30%" min="25%">
                                {/* First column */}

                                <TransactionListMaster
                                    paneHeight={this.state.parentHeight}
                                    needMultiSelect={false}
                                    masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.ReportMaster || [])}
                                    selectedMaster={[this.props.Login.masterData.SelectedReportMaster]}
                                    primaryKeyField="nreportcode"
                                    getMasterDetail={this.props.getSelectedReportMasterDetail}
                                    inputParam={{
                                        userInfo: this.props.Login.userInfo,
                                        masterData: this.props.Login.masterData
                                    }}
                                    mainField={"sreportname"}
                                    selectedListName="SelectedReportMaster"
                                    objectName="ReportMaster"
                                    listName="IDS_REPORT"
                                    filterColumnData={this.props.filterTransactionList}
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    filterParam={filterParam}

                                    showFilter={this.props.Login.showFilter}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    subFields={[
                                        { [designProperties.VALUE]: "sreportdisplayname" },
                                        { [designProperties.VALUE]: "sactivestatus", [designProperties.COLOUR]: "Color" }
                                    ]}
                                    needFilter={true}
                                    //skip={this.state.masterSkip}
                                    //take={this.state.masterTake}
                                    hidePaging={false}
                                    handlePageChange={this.handlePageChange}
                                    skip={this.state.skip}
                                    take={this.state.take}

                                    actionIcons={
                                        [
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                controlname: "faPencilAlt",
                                                objectName: "mastertoedit",
                                                hidden: this.state.userRoleControlRights.indexOf(editMasterId) === -1,
                                                onClick: this.props.getReportMasterComboService,
                                                inputData: {
                                                    primaryKeyName: "nreportcode",
                                                    operation: "update",
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    screenName: "IDS_REPORTMASTER",
                                                    ncontrolcode: editMasterId,
                                                    filterReportType: this.props.Login.masterData.SelectedFilterReportType
                                                },

                                            },
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                controlname: "faTrashAlt",
                                                objectName: "mastertodelete",
                                                hidden: this.state.userRoleControlRights.indexOf(deleteMasterId) === -1,
                                                onClick: (props) => confirmMessage.confirm(
                                                    "deleteMessage",
                                                    this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                    this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                    this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                    this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                    () => this.deleteReport(props)
                                                ),
                                                inputData: {
                                                    primaryKeyName: "nreportcode",
                                                    operation: "delete",
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    screenName: "IDS_REPORTMASTER",
                                                    listName: "reportmaster",
                                                    ncontrolCode: deleteMasterId, methodUrl: "ReportMaster"
                                                }
                                            },

                                        ]
                                    }
                                    commonActions={
                                        <ProductList className="d-flex product-category float-right">
                                            <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                // data-for="tooltip-common-wrap"
                                                hidden={this.state.userRoleControlRights.indexOf(addMasterId) === -1}
                                                onClick={() => this.props.getReportMasterComboService(addMasterParam)}>
                                                <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                                            </Button>
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                onClick={() => this.reloadData()}
                                                // data-for="tooltip-common-wrap"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                <RefreshIcon className='custom_icons' />
                                            </Button>
                                        </ProductList>
                                    }
                                    filterComponent={[
                                        {
                                            "IDS_FILTER":
                                                <ReportConfigFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    reportTypeList={this.state.reportTypeList || []}
                                                    onComboChange={this.onComboChange}
                                                    filterReportType={this.props.Login.masterData.SelectedFilterReportType}
                                                />
                                        }
                                    ]}
                                />
                                    </SplitterPane>
                                   <SplitterPane size="70%" min="55%">
                                <>
                                    {/* End of first column */}
                                            {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} //secondaryInitialSize={400}
                                            > */}
                                            <Splitter orientation="horizontal">
                                                <SplitterPane size="50%" min="20%">
                                        {/* Start of second column */}
                                        <div className="card_group">
                                            <Row>

                                                <Col md={12}>
                                                    <div className='report-designer-right'>
                                                        <PerfectScrollbar>
                                                            {/* Start of detailed content */}
                                                            <ContentPanel className={`panel-main-content`}>
                                                                <Card className="border-0">
                                                                    <Card.Body className='p-0'>
                                                                        {this.props.Login.masterData.SelectedReportMaster &&
                                                                            <Row noGutters>
                                                                                <Col md={12}>
                                                                                    <Card>
                                                                                        <Card.Header style={{ borderBottom: "0px" }}>
                                                                                            <span style={{ display: "inline-block", marginTop: "1%" }} >
                                                                                                <h4 >{this.props.intl.formatMessage({ id: "IDS_REPORTDETAILS" })}</h4>
                                                                                            </span>
                                                                                        </Card.Header>
                                                                                        <Card.Body className='form-static-wrap p-2'>
                                                                                            <Row>
                                                                                                <Col md={12}>
                                                                                                    <div className="d-flex product-category" style={{ float: "right" }}>
                                                                                                        {((this.props.Login.masterData.ReportParameter &&
                                                                                                            this.props.Login.masterData.ReportParameter.length > 0) && (this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.ALL
                                                                                                                || this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.MIS))
                                                                                                            ? <>
                                                                                                                <ContentPanel className="d-flex justify-content-end dropdown badget_menu icon-group-wrap">
                                                                                                                    <Nav.Link name="configreportlink"
                                                                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORTDESIGN" })}
                                                                                                                        hidden={this.state.userRoleControlRights.indexOf(configReportId) === -1}
                                                                                                                        className="btn btn-circle outline-grey mr-2 "
                                                                                                                        onClick={() => this.props.getConfigReportComboService({
                                                                                                                            reportMaster: this.props.Login.masterData.SelectedReportMaster,
                                                                                                                            reportDetail: this.props.Login.masterData.SelectedReportDetail,
                                                                                                                            operation: "config", ncontrolCode: configReportId,
                                                                                                                            screenName: "IDS_REPORTDESIGN", userInfo: this.props.Login.userInfo
                                                                                                                        })}>
                                                                                                                        {/* <FontAwesomeIcon icon={faCog} name="configreporticon"
                                                                                                                    title={this.props.intl.formatMessage({id:"IDS_CONFIGREPORT"})}/> */}

                                                                                                                        <ParameterConfigurationIcon className="custom_icons" width="20" height="20"
                                                                                                                            name="configreporticon" />
                                                                                                                        { }
                                                                                                                    </Nav.Link>
                                                                                                                    <Nav.Link name="parametermappinglink"
                                                                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PARAMETERMAPPING" })}
                                                                                                                        hidden={this.state.userRoleControlRights.indexOf(parameterMapId) === -1}
                                                                                                                        className="btn btn-circle outline-grey mr-2 "
                                                                                                                        onClick={() => this.props.getParameterMappingComboService({
                                                                                                                            reportMaster: this.props.Login.masterData.SelectedReportMaster,
                                                                                                                            reportDetail: this.props.Login.masterData.SelectedReportDetail,
                                                                                                                            operation: "create", ncontrolCode: parameterMapId,
                                                                                                                            userInfo: this.props.Login.userInfo,
                                                                                                                            screenName: "IDS_PARAMETERMAPPING"
                                                                                                                        })}>
                                                                                                                        {/* <FontAwesomeIcon icon={faLink} name="mappingreporticon"
                                                                                                                    title={this.props.intl.formatMessage({id:"IDS_PARAMETERMAPPING"})}/> */}

                                                                                                                        <ParameterMappingIcon className="custom_icons" width="20" height="20"
                                                                                                                            name="mappingreporticon" />
                                                                                                                        { }
                                                                                                                    </Nav.Link>
                                                                                                                </ContentPanel>

                                                                                                            </>

                                                                                                            : ""}
                                                                                                        <Nav.Link name="approvereportlink"
                                                                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVEREPORT" })}
                                                                                                            hidden={this.state.userRoleControlRights.indexOf(approveReportId) === -1}
                                                                                                            className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                                            onClick={() => this.approveReport(approveReportId)}>
                                                                                                            <FontAwesomeIcon icon={faThumbsUp} name="approvereporticon" />
                                                                                                        </Nav.Link>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>

                                                                                            <Row>
                                                                                                <Col md={3} className='report-designer-version' style={{ paddingRight: '0' }}>
                                                                                                    {/* Start of version column */}

                                                                                                    <PerfectScrollbar>
                                                                                                        <div>
                                                                                                            <TransactionListMaster
                                                                                                                masterList={this.props.Login.masterData.ReportDetails || []}
                                                                                                                needMultiSelect={false}
                                                                                                                selectedMaster={[this.props.Login.masterData.SelectedReportDetail]}
                                                                                                                primaryKeyField="nreportdetailcode"
                                                                                                                getMasterDetail={this.props.getSelectedReportDetail}
                                                                                                                inputParam={{
                                                                                                                    userInfo: this.props.Login.userInfo,
                                                                                                                    masterData: this.props.Login.masterData
                                                                                                                }}
                                                                                                                mainField={"sversionno"}
                                                                                                                mainFieldLabel={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                                                                                                selectedListName="SelectedReportDetail"
                                                                                                                objectName="ReportMaster"
                                                                                                                listName="IDS_REPORTDETAILS"
                                                                                                                hideSearch={true}
                                                                                                                subFields={[
                                                                                                                    { [designProperties.VALUE]: "sdisplaystatus", [designProperties.COLOUR]: "Color" }
                                                                                                                ]}
                                                                                                                needValidation={false}
                                                                                                                needFilter={false}
                                                                                                                moreField={[]}
                                                                                                                skip={this.state.detailSkip}
                                                                                                                take={this.state.detailTake}
                                                                                                                hidePaging={true}
                                                                                                                handlePageChange={this.handleDetailPageChange}
                                                                                                                splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                                                                                actionIcons={
                                                                                                                    [
                                                                                                                        {
                                                                                                                            title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                                                                                            controlname: "faPencilAlt",
                                                                                                                            objectName: "detailtoedit",
                                                                                                                            hidden: this.state.userRoleControlRights.indexOf(editDetailId) === -1,
                                                                                                                            inputData: {
                                                                                                                                primaryKeyName: "nreportdetailcode",
                                                                                                                                operation: "update",
                                                                                                                                masterData: this.props.Login.masterData,
                                                                                                                                userInfo: this.props.Login.userInfo,
                                                                                                                                screenName: "IDS_REPORTVERSION",
                                                                                                                                ncontrolcode: editDetailId,
                                                                                                                            },
                                                                                                                            onClick: (props) => confirmMessage.confirm(
                                                                                                                                "editDetailMessage",
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_EDITDETAILCONFIRMMSG" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                                                                                                () => this.props.getReportDetailComboService(props)
                                                                                                                            ),
                                                                                                                        },
                                                                                                                        {
                                                                                                                            title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                                                                            controlname: "faTrashAlt",
                                                                                                                            objectName: "mastertodelete",
                                                                                                                            hidden: this.state.userRoleControlRights.indexOf(deleteDetailId) === -1,
                                                                                                                            onClick: (props) => confirmMessage.confirm(
                                                                                                                                "deleteMessage",
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_OK" }),
                                                                                                                                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                                                                                                                () => this.deleteReport(props)
                                                                                                                            ),
                                                                                                                            inputData: {
                                                                                                                                primaryKeyName: "nreportdetailcode",
                                                                                                                                operation: "delete",
                                                                                                                                masterData: this.props.Login.masterData,
                                                                                                                                userInfo: this.props.Login.userInfo,
                                                                                                                                screenName: "IDS_REPORTVERSION",
                                                                                                                                listName: "reportdetails",
                                                                                                                                ncontrolCode: deleteDetailId, methodUrl: "ReportDetails"
                                                                                                                            }
                                                                                                                        }
                                                                                                                    ]
                                                                                                                }
                                                                                                                commonActions={
                                                                                                                    <ProductList className="d-flex product-category float-right">
                                                                                                                        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                                                                            hidden={this.state.userRoleControlRights.indexOf(addDetailId) === -1}
                                                                                                                            onClick={() => this.props.getReportDetailComboService(addDetailParam)}>
                                                                                                                            <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                                                                                                                        </Button>

                                                                                                                    </ProductList>
                                                                                                                }
                                                                                                            />
                                                                                                        </div>

                                                                                                    </PerfectScrollbar>
                                                                                                    {/* End of version column */}
                                                                                                </Col>

                                                                                                <Col md={9}>
                                                                                                    <Row>
                                                                                                        <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_REPORTNAME" message="Report Name" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sreportname}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col>
                                                                                                        <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_REPORTTYPE" message="Report Type" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sreportdisplayname}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col>
                                                                                                        {//this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SAMPLE
                                                                                                            //   || this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.COA ?
                                                                                                            this.props.Login.masterData.SelectedReportMaster.isneedregtype === transactionStatus.YES ?
                                                                                                                <>
                                                                                                                    <Col md={4}>
                                                                                                                        <FormGroup>
                                                                                                                            <FormLabel><FormattedMessage id="IDS_SAMPLETYPE" message="Sample Type" /></FormLabel>
                                                                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.ssampletypename}</ReadOnlyText>
                                                                                                                        </FormGroup>
                                                                                                                    </Col>
                                                                                                                    <Col md={4}>
                                                                                                                        <FormGroup>
                                                                                                                            <FormLabel><FormattedMessage id="IDS_REGTYPE" message="Registration Type" /></FormLabel>
                                                                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sregtypename}</ReadOnlyText>
                                                                                                                        </FormGroup>
                                                                                                                    </Col>
                                                                                                                    <Col md={4}>
                                                                                                                        <FormGroup>
                                                                                                                            <FormLabel><FormattedMessage id="IDS_REGSUBTYPE" message="Registration Sub Type" /></FormLabel>
                                                                                                                            <ReadOnlyText>{ }
                                                                                                                                {this.props.Login.masterData.SelectedReportMaster.nregsubtypecode === -1 ?
                                                                                                                                    '-' : this.props.Login.masterData.SelectedReportMaster.sregsubtypename}
                                                                                                                            </ReadOnlyText>
                                                                                                                        </FormGroup>
                                                                                                                    </Col>
                                                                                                                    <Col md={4}>
                                                                                                                        <FormGroup>
                                                                                                                            <FormLabel><FormattedMessage id="IDS_APPROVECONFIGVERSION" message="Approve COnfig Version" /></FormLabel>
                                                                                                                            <ReadOnlyText>{ }
                                                                                                                                {this.props.Login.masterData.SelectedReportMaster.nregsubtypecode === -1 ?
                                                                                                                                    '-' : this.props.Login.masterData.SelectedReportMaster.sapproveversionname &&
                                                                                                                                    this.props.Login.masterData.SelectedReportMaster.sapproveversionname}
                                                                                                                            </ReadOnlyText>
                                                                                                                        </FormGroup>
                                                                                                                    </Col>
                                                                                                                </> : ""}
                                                                                                        {/* {this.props.Login.masterData.SelectedReportMaster.isneedsection === transactionStatus.YES ?
                                                                                            <>
                                                                                                <Col md={4}>
                                                                                                    <FormGroup>
                                                                                                        <FormLabel><FormattedMessage id="IDS_LAB" message="Section" /></FormLabel>
                                                                                                        <ReadOnlyText>
                                                                                                            {this.props.Login.masterData.SelectedReportMaster.nsectioncode === -1 ?
                                                                                                                '-' : this.props.Login.masterData.SelectedReportMaster.ssectionname}
                                                                                                        </ReadOnlyText>
                                                                                                    </FormGroup>
                                                                                                </Col>
                                                                                            </>
                                                                                            : ""} */}
                                                                                                        {this.props.Login.masterData.SelectedReportMaster.isneedsection === transactionStatus.YES &&
                                                                                                            <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_SECTION" message="Section" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.nsectioncode !== -1 ? this.props.Login.masterData.SelectedReportMaster.ssectionname : '-'}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                        }
                                                                                                        {this.props.Login.masterData.SelectedReportMaster.nreporttypecode !== reportTypeEnum.MIS
                                                                                                            && this.props.Login.masterData.SelectedReportMaster.nreporttypecode !== reportTypeEnum.SCREENWISE ?
                                                                                                            <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_REPORTSUBTYPE" message="Report Sub Type" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.scoareporttypename}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>

                                                                                                            : ""}
                                                                                                        {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode && this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.COA && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode === reportCOAType.PROJECTWISE || this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.COAPREVIEW && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode === reportCOAType.PROJECTWISE
                                                                                            || this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.COAPRELIMINARY && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode && this.props.Login.masterData.SelectedReportMaster.ncoareporttypecode === reportCOAType.PROJECTWISE ? */}
                                                                                                        <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_REPORTTEMPLATE" message="Report Template" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sreporttemplatename}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col>

                                                                                                        {/* : ""} */}
                                                                                                        {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SAMPLE ?
                                                                                                        <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_DECISIONTYPE" message="Decision Type" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sdecisiontypename}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                    :""} */}
                                                                                                        {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.MIS ?
                                                                                                            <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_MODULENAME" message="Module Name" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sreportmodulename}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col> : ""}

                                                                                                        {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.BATCH
                                                                                                            || this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SAMPLE ?
                                                                                                            <><Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.scertificatetype}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                                <Col md={4}>
                                                                                                                    <FormGroup>
                                                                                                                        <FormLabel><FormattedMessage id="IDS_REPORTBATCHTYPE" message="Report Batch Type" /></FormLabel>
                                                                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sbatchdisplayname}</ReadOnlyText>
                                                                                                                    </FormGroup>
                                                                                                                </Col> </>
                                                                                                            : ""}

                                                                                                        {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SCREENWISE ?
                                                                                                            <><Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_SCREENNAME" message="Screen Name" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sdisplayname}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                                <Col md={4}>
                                                                                                                    <FormGroup>
                                                                                                                        <FormLabel><FormattedMessage id="IDS_CONTROLNAME" message="Control Name" /></FormLabel>
                                                                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.scontrolids}</ReadOnlyText>
                                                                                                                    </FormGroup>
                                                                                                                </Col> </>
                                                                                                            : ""}

                                                                                                        {/* <Col md={4}>
                                                                                        <FormGroup>
                                                                                            <FormLabel><FormattedMessage id="IDS_STATUS" message="Status"/></FormLabel>
                                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sactivestatus}</ReadOnlyText>
                                                                                        </FormGroup>
                                                                                    </Col>                                                                                     */}

                                                                                                    </Row>
                                                                                                    {this.props.Login.masterData.SelectedReportDetail &&
                                                                                                        <Row>

                                                                                                            {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode !== reportTypeEnum.MIS && this.props.Login.masterData.SelectedReportMaster.nreporttypecode !== reportTypeEnum.SCREENWISE ?
                                                                                                        <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_REPORTSUBTYPE" message="Report Sub Type" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.scoareporttypename}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col>
                                                                                                     
                                                                                                    : ""} */}

                                                                                                            {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SAMPLE ?
                                                                                                        <>
                                                                                                        <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_DECISIONTYPE" message="Decision Type" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.sdecisiontypename}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                            <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_LAB" message="Section" /></FormLabel>
                                                                                                                    <ReadOnlyText>
                                                                                                                            {this.props.Login.masterData.SelectedReportDetail.nsectioncode === -1 ?
                                                                                                                             '-' : this.props.Login.masterData.SelectedReportDetail.ssectionname}
                                                                                                                    </ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                         </>
                                                                                                    : ""} */}
                                                                                                            {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.BATCH ?
                                                                                                            <><Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.scertificatetype}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col> 
                                                                                                            <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_REPORTBATCHTYPE" message="Report Batch Type" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.sbatchdisplayname}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col> </>
                                                                                                    : ""} */}

                                                                                                            {/* {this.props.Login.masterData.SelectedReportMaster.nreporttypecode === reportTypeEnum.SCREENWISE ?
                                                                                                            <><Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_SCREENNAME" message="Screen Name" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.sdisplayname}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col> 
                                                                                                            <Col md={4}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_CONTROLNAME" message="Control Name" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.scontrolids}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col> </>
                                                                                                    : ""} */}


                                                                                                            <Col md={4}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_ISPLSQLQUERY" message="Is PLSQL" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.splsqlquery}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                            <Col md={8}>
                                                                                                                <FormGroup>
                                                                                                                    <FormLabel><FormattedMessage id="IDS_FILE" message="File" /></FormLabel>
                                                                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.sfilename}</ReadOnlyText>
                                                                                                                </FormGroup>
                                                                                                            </Col>
                                                                                                            {/* <Col md={4}>
                                                                                            <FormGroup>
                                                                                                <FormLabel><FormattedMessage id="IDS_VERSIONSTATUS" message="Version Status"/></FormLabel>
                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportDetail.sdisplaystatus}</ReadOnlyText>
                                                                                            </FormGroup>
                                                                                        </Col> */}
                                                                                                        </Row>
                                                                                                    }
                                                                                                    <Row>
                                                                                                        <Col md={12}>
                                                                                                            <FormGroup>
                                                                                                                <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sdescription}</ReadOnlyText>
                                                                                                            </FormGroup>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                </Col>
                                                                            </Row>
                                                                        }

                                                                    </Card.Body>
                                                                </Card>
                                                            </ContentPanel>
                                                            {/* End of detailed content */}
                                                            <Row>
                                                                <Col md={12}>
                                                                    {/* Start of tabs */}
                                                                    <ListWrapper>
                                                                        <ContentPanel className="panel-main-content">
                                                                            <Card className="border-0">
                                                                                <Card.Body className='p-1'>
                                                                                    <Row noGutters>
                                                                                        <Col md={12}>
                                                                                            {this.props.Login.masterData["ReportMaster"] &&
                                                                                                <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                                                            }
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Card.Body>
                                                                            </Card>
                                                                        </ContentPanel>
                                                                    </ListWrapper>
                                                                    {/* End of tabs */}
                                                                </Col>

                                                            </Row>
                                                        </PerfectScrollbar>
                                                    </div>
                                                </Col>
                                            </Row>

                                        </div>
                                        {/* End of second column */}
                                                </SplitterPane>
                                            </Splitter>

                                            {/* </SplitterLayout> */}
                                </>
                                    </SplitterPane>
                                </Splitter>

                            {/* </SplitterLayout> */}
                            {/* </ListWrapper > */}
                        </Col>
                    </Row>
                </ListWrapper>
                {/* Start of Modal Sideout for Creation */}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        //size={'xl'}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        ignoreFormValidation={this.props.Login.screenName === "IDS_REPORTDESIGN" || this.props.Login.screenName === "IDS_SUBREPORTS"
                            || this.props.Login.screenName === "IDS_IMAGES"}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                //formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.screenName === "IDS_REPORTMASTER" ?
                                <AddReportMaster
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    reportTypeList={this.props.Login.reportTypeList || []}
                                    coaReportTypeList={this.props.Login.reportSubTypeList || []}
                                    certificateTypeList={this.props.Login.certificateTypeList || []}
                                    sampleTypeList={this.props.Login.sampleTypeList || []}
                                    regTypeList={this.props.Login.regTypeList || []}
                                    regSubTypeList={this.props.Login.regSubTypeList || []}
                                    //regType={this.props.Login.regType || []}
                                    controlButton={this.props.Login.controlButton || []}
                                    sectionList={this.props.Login.sectionList || []}
                                    ApproveConfigList={this.props.Login.ApproveConfigList || []}
                                    decisionTypeList={this.props.Login.reportDecisionTypeList || []}
                                    controlScreen={this.props.Login.controlScreen || []}
                                    reportModuleList={this.props.Login.reportModuleList || []}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    onDropImage={this.onDropImage}
                                    deleteFile={this.deleteFile}
                                    actionType={this.state.actionType}
                                    reportVersionStatus={this.props.Login.reportVersionStatus || transactionStatus.DRAFT}
                                    filterReportType={this.props.Login.masterData.SelectedFilterReportType || {}}
                                    reportTemplateList={this.props.Login.reportTemplateList || []}
                                    settings={this.props.Login.settings}
                                />
                                : this.props.Login.screenName === "IDS_REPORTVERSION" ?
                                    <AddReportDetail
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onComboChange={this.onComboChange}
                                        //coaReportTypeList={this.props.Login.reportSubTypeList || []}
                                        // certificateTypeList={this.props.Login.certificateTypeList || []}
                                        // sectionList={this.props.Login.sectionList || []}
                                        // decisionTypeList={this.props.Login.reportDecisionTypeList || []}
                                        reportMaster={this.props.Login.masterData.SelectedReportMaster || {}}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.Login.inputParam}
                                        onDropImage={this.onDropImage}
                                        deleteFile={this.deleteFile}
                                        actionType={this.state.actionType}
                                    />
                                    : this.props.Login.screenName === "IDS_REPORTDESIGN" ?
                                        <AddDesign
                                            operation={this.props.Login.operation}
                                            selectedReportMaster={this.props.Login.masterData.SelectedReportMaster || {}}
                                            reportParameterList={this.props.Login.reportParameterList || []}
                                            designComponentList={this.props.Login.designComponentList || []}
                                            sqlQueryList={this.props.Login.sqlQueryList || []}
                                            onInputOnChange={this.onInputOnChange}
                                            handleChange={this.onComboChange}
                                            selectedRecord={this.state.selectedRecord || {}}
                                            //handleChange={this.handleChangeDesign}
                                            gridPrimaryKey={"nreportdesigncode"}
                                            designName={this.props.Login.masterData.SelectedReportMaster.sreportname || ""}
                                            addDesignParam={this.state.addDesignParam || this.props.Login.masterData.ReportDesignConfig}
                                            gridData={this.state.gridData || this.props.Login.masterData.ReportDesignConfig}
                                            addParametersInDataGrid={this.addParametersInDataGrid}
                                            deleteRecordWORights={this.removeParametersInDataGrid}
                                            inputColumnList={this.designInputFieldList}
                                            gridColumnList={this.designGridColumnList}
                                            controlMap={this.state.controlMap}
                                            userRoleControlRights={this.state.userRoleControlRights}
                                        />
                                        : this.props.Login.screenName === "IDS_PARAMETERMAPPING" ?
                                            <ParameterMapping
                                                operation={this.props.Login.operation}
                                                parentComponentList={this.props.Login.parentComponentList || []}
                                                childComponentList={this.props.Login.childComponentList || []}
                                                optionalParameterList={this.state.optionalParameterList || []}
                                                onInputOnChange={this.onInputOnChange}
                                                handleChange={this.onComboChange}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                addMappingParam={this.state.addMappingParam || this.props.Login.masterData.ReportParameterMapping}
                                                mappingGridData={this.state.mappingGridData || this.props.Login.masterData.ReportParameterMapping}
                                                addParametersInDataGrid={this.bindMappingParametersToDataGrid}
                                                deleteRecordWORights={this.unbindMappingParametersFromDataGrid}
                                                inputColumnList={this.mappingInputFieldList}
                                                mappingGridColumnList={this.mappingGridFieldList}
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                detailedFieldList={this.detailedGridFieldList}
                                                bindActionParameter={this.bindActionParameter}
                                            />
                                            : this.props.Login.screenName === "IDS_SUBREPORTS" || this.props.Login.screenName === "IDS_IMAGES" ?
                                                <AddAttachment
                                                    operation={this.props.Login.operation}
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    onDropImage={this.onDropImage}
                                                    deleteFile={this.deleteFile}
                                                    actionType={this.state.actionType}
                                                    settings={this.props.Login.settings}
                                                    attachmentType={this.props.Login.screenName === "IDS_SUBREPORTS" ? ".jrxml" : "image/*"}
                                                />
                                                : this.props.Login.screenName === "IDS_REPORTVALIDATION" ?
                                                    <AddReportValidation
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        onInputOnChange={this.onInputOnChange}
                                                        onComboChange={this.onComboChange}
                                                        reportTypeList={this.props.Login.reportTypeList}
                                                        onClick={() => this.openModal("IDS_REPORTVALIDATION")}
                                                        reportMaster={this.props.Login.masterData.SelectedReportMaster || {}}
                                                        operation={this.props.Login.operation}
                                                        inputParam={this.props.Login.inputParam}
                                                        deleteFile={this.deleteFile}
                                                        actionType={this.state.actionType}
                                                    />
                                                    : this.props.Login.screenName === "IDS_REPORTPARAMETERMAPPING" ?
                                                        <AddReportParameters
                                                            operation={this.props.Login.operation}
                                                            selectedRecord={this.state.selectedRecord || {}}
                                                            onInputOnChange={this.onInputOnChange}
                                                            onComboChange={this.onComboChange}
                                                            gridPrimaryKey={"controlbasedKey"}
                                                            addDesignParameter={this.state.addDesignParameter}
                                                            gridDataparmeter={this.state.gridDataparmeter && this.state.gridDataparmeter.length > 0 ? (this.state.gridDataparmeter || []) : (this.props.Login.ParameterMappingDatagrid || [])}
                                                            //dataResult={this.props.Login.masterData["ParameterMapping"] }
                                                            addreportParametersInDataGrid={this.addreportParametersInDataGrid}
                                                            deleteRecordWORights={this.removereportParametersInDataGrid}
                                                            gridColumnList={this.reportparametermappingcolumndatagrid || []}
                                                            userinfo={this.props.Login.userInfo}
                                                            reportTypeListparameter={this.state.reportTypeListparameter}
                                                            reportTypeListName={this.state.reportTypeListName || []}
                                                            reportTypeListColumn={this.state.reportTypeListColumn || []}
                                                            onClick={() => this.openModal("IDS_REPORTPARAMETERMAPPING")}
                                                            masterData={this.props.Login.masterData || {}}
                                                            inputParam={this.props.Login.inputParam}
                                                            deleteFile={this.deleteFile}
                                                            actionType={this.state.actionType}
                                                            controlMap={this.state.controlMap}
                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                        //coaReportTypeList={this.props.Login.reportSubTypeList || []}
                                                        // certificateTypeList={this.props.Login.certificateTypeList || []}
                                                        // sectionList={this.props.Login.sectionList || []}
                                                        // decisionTypeList={this.props.Login.reportDecisionTypeList || []}
                                                        /> :
                                                        ""
                        }
                    /> : ""}
                {/* End of Modal Sideout for Creation */}
            </>

        );
    }

    handleMasterPageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    handleDetailPageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        // if (this.props.Login.reportTypeListparameter !== previousProps.Login.reportTypeListparameter) {
        //     this.props.Login.reportTypeListName= [];
        //     this.props.Login.reportTypeListColumn= [];

        // }

      
        if (this.props.Login.reportTypeListparameter !== previousProps.Login.reportTypeListparameter) {
            this.setState({ reportTypeListparameter: this.props.Login.reportTypeListparameter });
        }

        // if (this.props.Login.reportTypeListColumn !== previousProps.Login.reportTypeListColumn) {
        //     this.setState({ reportTypeListColumn: this.props.Login.reportTypeListColumn });
        // }

        if (this.props.Login.reportTypeListName !== previousProps.Login.reportTypeListName) {
            this.setState({ reportTypeListName: this.props.Login.reportTypeListName });
        }

        
            
        
        if (this.props.Login.ParameterMappingDatagrid !== previousProps.Login.ParameterMappingDatagrid) {

            this.setState({ gridDataparmeter: this.props.Login.ParameterMappingDatagrid });

        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            const addDesignParam = [];
            const gridData = [];

            this.props.Login.masterData.ReportDesignConfig &&
                this.props.Login.masterData.ReportDesignConfig.forEach(item => {
                    addDesignParam.push({ ...item });
                    gridData.push({ ...item });
                });

            //     const addDesignParameter = [];
            // //     const gridDataparmeter = [];

            //     this.props.Login.reportTypeListparameter &&
            //     this.props.Login.reportTypeListparameter.forEach(item => {
            //         addDesignParameter.push({ ...item });
            //         //gridDataparmeter.push({ ...item });
            //     });

            const addMappingParam = [];
            const mappingGridData = [];

            this.props.Login.masterData.ReportParameterMapping &&
                this.props.Login.masterData.ReportParameterMapping.forEach(item => {
                    addMappingParam.push({ ...item });
                    mappingGridData.push({ ...item });
                });

            const reportTypeMap = constructOptionList(this.props.Login.masterData.ReportTypeList || [], "nreporttypecode",
                "sdisplayname", undefined, undefined, true);
            const reportTypeList = reportTypeMap.get("OptionList");
            const filterData = this.generateBreadCrumData();
            let skip = this.state.skip;
            let take = this.state.take;
            // ALPD-3576
            // if(reportTypeList.length < take){
            //     skip = 0;
            //     take = take;
            // }
            if (this.props.Login.masterData && this.props.Login.masterData.ReportMaster && this.props.Login.masterData.ReportMaster.length < take) {
                skip = 0;
                take = take;
            }

           
    

            this.setState({
                reportTypeList, filterData,
                userRoleControlRights, controlMap, addDesignParam, gridData,
                addMappingParam, mappingGridData,// addActionParam, 
                // actionGridData
                skip, take
            });
        }
        else {
            if (this.props.Login.masterData !== previousProps.Login.masterData) {

                const filterData = this.generateBreadCrumData();
                const reportTypeMap = constructOptionList(this.props.Login.masterData.ReportTypeList || [], "nreporttypecode",
                    "sdisplayname", undefined, undefined, true);
                const reportTypeList = reportTypeMap.get("OptionList");

                const addDesignParam = [];
                const gridData = [];

                this.props.Login.masterData.ReportDesignConfig &&
                    this.props.Login.masterData.ReportDesignConfig.forEach(item => {
                        addDesignParam.push({ ...item });
                        gridData.push({ ...item });
                    });

                const addMappingParam = [];
                const mappingGridData = [];

                this.props.Login.masterData.ReportParameterMapping &&
                    this.props.Login.masterData.ReportParameterMapping.forEach(item => {
                        addMappingParam.push({ ...item });
                        mappingGridData.push({ ...item });
                    });
                let skip = this.state.skip;
                let take = this.state.take;
                // ALPD-3576
                // if(reportTypeList.length < take){
                //     skip = 0;
                //     take = take;
                // }
                if (this.props.Login.masterData && this.props.Login.masterData.ReportMaster && this.props.Login.masterData.ReportMaster.length < take) {
                    skip = 0;
                    take = take;
                }

                //ALPD-5588--Added By vignesh R(21-03-2025)-->Report Designer --> When searching the report name in second page blank grid appears.
                if(this.props.Login.masterData.searchedData&&this.props.Login.masterData.searchedData.length<this.state.skip){
                    skip = 0;
                }
                this.setState({
                    reportTypeList, filterData,
                    addDesignParam, gridData, addMappingParam, mappingGridData, skip, take
                });

            }
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType) {

            breadCrumbData.push(

                {
                    "label": "IDS_REPORTTYPE",
                    "value": this.props.Login.masterData.SelectedFilterReportType ?
                        this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedFilterReportType.sdisplayname }) : ""
                }
            );
        }
        return breadCrumbData;
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
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                nreporttypecode: this.state.selectedRecord["filterreporttypecode"] ?
                    String(this.state.selectedRecord["filterreporttypecode"].value) : 0
            },
            classUrl: "reportconfig",
            methodUrl: "ReportDesigner",
            userInfo: this.props.Login.userInfo,
            displayName: "IDS_REPORTDESIGNER"
        };

        this.props.callService(inputParam);

    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {
        const tabMap = new Map();
        const addSubReportId = this.state.controlMap.has("AddSubReportDetails") && this.state.controlMap.get("AddSubReportDetails").ncontrolcode;
        const deleteSubReportId = this.state.controlMap.has("DeleteSubReportDetails") && this.state.controlMap.get("DeleteSubReportDetails").ncontrolcode;

        const addImageId = this.state.controlMap.has("AddReportImages") && this.state.controlMap.get("AddReportImages").ncontrolcode;
        const deleteImageId = this.state.controlMap.has("DeleteReportImages") && this.state.controlMap.get("DeleteReportImages").ncontrolcode;
        const addValidationId = this.state.controlMap.has("AddReportValidation") && this.state.controlMap.get("AddReportValidation").ncontrolcode;
        const deleteValidationId = this.state.controlMap.has("DeleteValidation") && this.state.controlMap.get("DeleteValidation").ncontrolcode;
        const addParameterMapping = this.state.controlMap.has("AddParameterMapping") && this.state.controlMap.get("AddParameterMapping").ncontrolcode;
        //const deleteParameterMapping = this.state.controlMap.has("DeleteParameterMapping") && this.state.controlMap.get("DeleteParameterMapping").ncontrolcode;


        tabMap.set("IDS_PARAMETERS", <DataGrid primaryKeyField={"nreportparametercode"}
            data={this.props.Login.masterData["ReportParameter"] || []}
            dataResult={this.props.Login.masterData["ReportParameter"] || []}
            dataState={{ skip: 0, take: this.props.Login.masterData["ReportParameter"] ? this.props.Login.masterData["ReportParameter"].length : 0 }}
            extractedColumnList={this.parameterColumnList}
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            inputParam={this.props.Login.inputParam}
            userInfo={this.props.Login.userInfo}
            pageable={false}
            scrollable={"scrollable"}
            isActionRequired={false}
            isToolBarRequired={false}
            selectedId={null}
            hideColumnFilter={true}
        />)
        if (this.props.Login && this.props.Login.masterData
            && this.props.Login.masterData.ReportParameter
            && this.props.Login.masterData.ReportParameter.length > 0
            && (this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.MIS || this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.ALL)) {
            tabMap.set("IDS_DESIGNPARAMETERS", <DataGrid primaryKeyField={"nreportdesignconfigcode"}
                data={this.props.Login.masterData["ReportDesignConfig"] || []}
                dataResult={this.props.Login.masterData["ReportDesignConfig"] || []}
                dataState={{ skip: 0, take: this.props.Login.masterData["ReportDesignConfig"] ? this.props.Login.masterData["ReportDesignConfig"].length : 0 }}
                //dataState={this.state.dataState}
                //dataStateChange={(event)=> this.setState({dataState: event.dataState})}                                                           
                extractedColumnList={this.tabGridColumnList}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.Login.inputParam}
                userInfo={this.props.Login.userInfo}
                pageable={false}
                scrollable={"scrollable"}
                isActionRequired={false}
                isToolBarRequired={false}
                selectedId={null}
                hideColumnFilter={true}
            />);

            tabMap.set("IDS_PARAMETERMAPPING", <DataGrid primaryKeyField={"nreportparametermappingcode"}
                data={this.props.Login.masterData["ReportParameterMapping"] || []}
                dataResult={this.props.Login.masterData["ReportParameterMapping"] || []}
                dataState={{ skip: 0, take: this.props.Login.masterData["ReportParameterMapping"] ? this.props.Login.masterData["ReportParameterMapping"].length : 0 }}

                extractedColumnList={this.mappingGridFieldList}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                inputParam={this.props.Login.inputParam}
                userInfo={this.props.Login.userInfo}
                pageable={false}
                scrollable={"scrollable"}
                isActionRequired={false}
                isToolBarRequired={false}
                selectedId={null}
                hideColumnFilter={true}
            />);
        }
        // tabMap.set("IDS_ACTIONMAPPING",  <DataGrid  primaryKeyField={"nreportparameteractioncode"}
        //                                         data={this.props.Login.masterData["ReportParameterAction"] || []}
        //                                         dataResult={this.props.Login.masterData["ReportParameterAction"] || []}
        //                                         extractedColumnList={this.actionGridFieldList}
        //                                         controlMap={this.state.controlMap}
        //                                         userRoleControlRights={this.state.userRoleControlRights}
        //                                         inputParam={this.props.Login.inputParam}
        //                                         userInfo={this.props.Login.userInfo}
        //                                         pageable={false}
        //                                         scrollable={"scrollable"}                                            
        //                                         isActionRequired={false}
        //                                         isToolBarRequired={false}
        //                                         selectedId={this.props.Login.selectedId}
        //                                         hideColumnFilter={true}
        //                                     />)

        tabMap.set("IDS_SUBREPORTS", <>
            <Row noGutters={true}>
                <Col md={12}>
                    <div className="actions-stripe d-flex justify-content-end">
                        <Nav.Link name="addsubreport" className="add-txt-btn"
                            hidden={this.state.userRoleControlRights.indexOf(addSubReportId) === -1}
                            onClick={() => this.openModal("IDS_SUBREPORTS")}>
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id='IDS_SUBREPORT' defaultMessage='Sub Report' />
                        </Nav.Link>
                    </div>
                    <DataGrid primaryKeyField={"nsubreportdetailcode"}
                        data={this.props.Login.masterData["SubReportDetails"] || []}
                        dataResult={this.props.Login.masterData["SubReportDetails"] || []}
                        dataState={{ skip: 0, take: this.props.Login.masterData["SubReportDetails"] ? this.props.Login.masterData["SubReportDetails"].length : 0 }}

                        extractedColumnList={this.subReportGridFieldList}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        inputParam={this.props.Login.inputParam}
                        userInfo={this.props.Login.userInfo}
                        pageable={false}
                        deleteRecord={this.deleteAttachment}
                        deleteParam={{
                            screenName: "IDS_SUBREPORTS", methodUrl: "SubReportDetails", operation: "delete",
                            //masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                            ncontrolcode: deleteSubReportId
                        }}
                        methodUrl={"SubReportDetails"}
                        scrollable={"scrollable"}
                        isActionRequired={true}
                        isToolBarRequired={false}
                        selectedId={this.props.Login.selectedId}
                        hideColumnFilter={true}
                    />
                </Col>
            </Row></>)

        tabMap.set("IDS_IMAGES", <>
            <Row noGutters={true}>
                <Col md={12}>
                    <div className="actions-stripe d-flex justify-content-end">
                        <Nav.Link name="addimages" className="add-txt-btn"
                            hidden={this.state.userRoleControlRights.indexOf(addImageId) === -1}
                            onClick={() => this.openModal("IDS_IMAGES")}>
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id='IDS_IMAGES' defaultMessage='Images' />
                        </Nav.Link>
                    </div>
                    <DataGrid primaryKeyField={"nreportimagecode"}
                        data={this.props.Login.masterData["ReportImages"] || []}
                        dataResult={this.props.Login.masterData["ReportImages"] || []}
                        dataState={{ skip: 0, take: this.props.Login.masterData["ReportImages"] ? this.props.Login.masterData["ReportImages"].length : 0 }}

                        extractedColumnList={this.imageGridFieldList}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        inputParam={this.props.Login.inputParam}
                        userInfo={this.props.Login.userInfo}
                        pageable={false}
                        scrollable={"scrollable"}
                        deleteRecord={this.deleteAttachment}
                        deleteParam={{
                            screenName: "IDS_IMAGES", methodUrl: "ReportImages", operation: "delete",
                            //masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
                            ncontrolcode: deleteImageId
                        }}
                        methodUrl={"ReportImages"}
                        isActionRequired={true}
                        isToolBarRequired={false}
                        selectedId={this.props.Login.selectedId}
                        hideColumnFilter={true}
                    />
                </Col></Row></>)// ALPD-3591  Report Designer -> Added the report parameter for the control based report.​
        //ALPD-5157 Report designer-->While select the control based report blank page occurs       
        if (this.props.Login && this.props.Login.masterData
            && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.SCREENWISE &&
            this.props.Login.masterData.SelectedReportDetail && this.props.Login.masterData.SelectedReportDetail.sreportformatdetail !== 'viewer') {
            tabMap.set("IDS_REPORTVALIDATION", <>
                <Row noGutters={true}>
                    <Col md={12}>
                        <div className="actions-stripe d-flex justify-content-end">
                            <Nav.Link name="addValidation" className="add-txt-btn"
                                hidden={this.state.userRoleControlRights.indexOf(addValidationId) === -1}
                                onClick={() => this.generateControlBasedReportReport(addValidationId)}>
                                <FontAwesomeIcon icon={faPlus} /> { }
                                <FormattedMessage id='IDS_REPORTVALIDATION' defaultMessage='Validation Status' />
                            </Nav.Link>
                        </div>
                        <DataGrid
                            primaryKeyField={"nreportvalidationcode"}
                            //selectedId={this.props.Login.selectedId}
                            data={this.props.Login.masterData["ReportValidation"] || []}
                            dataResult={this.props.Login.masterData["ReportValidation"] || []}
                            dataState={{ skip: 0, take: this.props.Login.masterData["ReportValidation"] || [] }}
                            //dataState={{ skip: 0, take: this.props.Login.masterData["ReportValidation"] ? this.props.Login.masterData["ReportValidation"].length : 5 }}
                            //dataStateChange={this.dataStateChange}
                            extractedColumnList={this.transValidationFieldList}
                            controlMap={this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            inputParam={this.props.Login.inputParam}
                            userInfo={this.props.Login.userInfo}
                            deleteRecord={this.deleteValidation}
                            methodUrl={"ReportValidation"}
                            scrollable={"scrollable"}
                            pageable={false}
                            isActionRequired={true}
                            isToolBarRequired={false}
                            hideColumnFilter={true}

                        />
                    </Col></Row></>)
        }

        if (this.props.Login && this.props.Login.masterData
            && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode === reportTypeEnum.SCREENWISE) {
            tabMap.set("IDS_REPORTPARAMETERMAPPING", <>
                <Row noGutters={true}>
                    <Col md={12}>
                        <div className="actions-stripe d-flex justify-content-end">
                            <Nav.Link name="addParameterMapping" className="add-txt-btn"
                                hidden={this.state.userRoleControlRights.indexOf(addParameterMapping) === -1}
                                onClick={() => this.generateControlBasedReportReportparametre(addParameterMapping)}
                            >
                                <FontAwesomeIcon icon={faPlus} /> { }
                                <FormattedMessage id='IDS_REPORTPARAMETERMAPPING' defaultMessage='Report Parameters' />
                            </Nav.Link>
                        </div>
                        <DataGrid
                            primaryKeyField={"nreportparameterconfigurationcode"}
                            data={this.props.Login.masterData["ParameterMapping"] || this.props.Login.ParameterMappingDatagrid}
                            dataResult={this.props.Login.masterData["ParameterMapping"] || this.props.Login.ParameterMappingDatagrid}
                            dataState={{ skip: 0, take: this.props.Login.masterData["ParameterMapping"] || [] }}//? this.props.Login.masterData["ParameterMapping"].length : 0 }}
                            extractedColumnList={this.reportparametermappingcolumn}
                            controlMap={this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            inputParam={this.props.Login.inputParam}
                            userInfo={this.props.Login.userInfo}
                            pageable={false}
                            methodUrl={"ParameterMapping"}
                            //isActionRequired={true}
                            isToolBarRequired={false}
                            selectedId={this.props.Login.selectedId}
                            hideColumnFilter={true}
                        />
                    </Col></Row></>)
        }
        return tabMap;
    }

    //     generateControlBasedReportReport(addValidationId){

    //         if (this.props.Login.masterData.SelectedReportDetail == null) {
    //             toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTVERSIONNOTFOUND" }))
    //         }
    //         else {
    //             if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.DRAFT) {

    //                 let inputParam={
    //                     userinfo: this.props.Login.userInfo,
    //                     nformcode:this.props.Login.userInfo.nformcode
    //                 }

    //                 this.props.validationReportparameter(inputParam)

    //             }else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
    //                 toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORAPPROVEDREPORT" }))
    //             } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.RETIRED) {
    //                 toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORRETIREDREPORT" }))
    //             }
    //         }   
    // }

    generateControlBasedReportReportparametre(addValidationId) {

        if (this.props.Login.masterData.SelectedReportDetail == null) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTVERSIONNOTFOUND" }))
        }
        else {
            if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.DRAFT) {

                let inputParam = {
                    userinfo: this.props.Login.userInfo,
                    nformcode: this.props.Login.userInfo.nformcode,
                    nreportdetailcode: this.props.Login.masterData.SelectedReportDetail.nreportdetailcode
                }

                this.props.controlBasedReportparametre(inputParam)

            } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORAPPROVEDREPORT" }))
            } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORRETIREDREPORT" }))
            }
        }
    }

    generateControlBasedReportReport(addValidationId) {
        if (this.props.Login.masterData.SelectedReportDetail == null) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTVERSIONNOTFOUND" }))
        }
        else {
            if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.DRAFT) {

                let inputParam = {
                    userinfo: this.props.Login.userInfo,
                    nformcode: this.props.Login.masterData.SelectedReportMaster.nformcode,
                    ntranscode: this.props.Login.masterData.ReportValidation.map(item => item.ntranscode).join(",")

                }

                this.props.validationReportparameter(inputParam)

            } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORAPPROVEDREPORT" }))
            } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORRETIREDREPORT" }))
            }
        }
    }


    openModal = (screenName, ncontrolCode) => {

        if (this.props.Login.masterData.SelectedReportDetail == null) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTVERSIONNOTFOUND" }))
        }
        else {
            if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.DRAFT) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedRecord: { sreportname: this.props.Login.masterData.SelectedReportMaster.sreportname }, operation: "create", ncontrolCode, selectedId: null,
                        openModal: true, screenName
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORAPPROVEDREPORT" }))
            } else if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.RETIRED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTADDFORRETIREDREPORT" }))

            }
        }
    }

    addreportParametersInDataGrid = (selectedRecord) => {

        //if (this.props.Login.ParameterMappingDatagrid.length !== this.props.Login.masterData.ReportParameter.length) {
        if (this.props.Login.ParameterMappingDatagrid.length === this.props.Login.masterData.ReportParameter.length || this.state.gridDataparmeter.length === this.props.Login.masterData.ReportParameter.length) {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_REPORTMORETHANPARAMETER" })}`); 
        } else {

            if (selectedRecord && selectedRecord !== undefined && selectedRecord.ncontrolBasedparameter !== undefined && selectedRecord.nquerybuildertablecodecolumn !== undefined) {
                const duplicate = this.state.gridDataparmeter.map(function (el) { return el.ncontrolBasedparameter; })
                const duplicateRecord = duplicate.some(num => num === selectedRecord.ncontrolBasedparameter.value);
                const valuecheck = this.props.Login.ParameterMappingDatagrid.map(function (el) { return el.nreportparametercode; });
                const isValuePresent = valuecheck.some(num => num === selectedRecord.ncontrolBasedparameter.value);
                if (this.state.gridDataparmeter.length !== 0 && this.props.Login.ParameterMappingDatagrid.length !== 0 || selectedRecord !== undefined) {
                    if (duplicateRecord === true || isValuePresent === true) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
                    }
                    else {
                        let copySelected = { ...selectedRecord };
                        const gridDataparmeter = this.state.gridDataparmeter;
                        let controlbasedKey = 0;
                        controlbasedKey = gridDataparmeter.length > 0 ? Math.max(...gridDataparmeter.map(x => x.controlbasedKey)) : 0;
                        controlbasedKey++;
                        gridDataparmeter.push({
                            nreportparameterconfigurationcode: controlbasedKey,
                            ncontrolBasedparameter: copySelected.ncontrolBasedparameter.value,
                            scontrolBasedparameter: copySelected.ncontrolBasedparameter.label,
                            stablecolumn: copySelected.nquerybuildertablecodecolumn.label,
                            ncolumnfield: copySelected.nquerybuildertablecodecolumn.value,
                        })
                        let reportTypeListparameter = [];
                        this.state.reportTypeListparameter.map(x => {
                            if (x.value !== copySelected.ncontrolBasedparameter.value) {
                                reportTypeListparameter.push(x)
                            }
                        })

                        let reportTypeListColumn = [];
                        let reportTypeListName = [];
                        this.setState({
                            selectedRecord: "",
                            gridDataparmeter,
                            reportTypeListparameter: reportTypeListparameter,
                            reportTypeListColumn: reportTypeListColumn,
                            reportTypeListName: reportTypeListName

                        });
                        //}
                    }
                } else {

                }
            } else {
                if (selectedRecord.ncontrolBasedparameter === undefined
                    || selectedRecord["ncontrolBasedparameter"].length === 0) {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_REPORTPARAMETER" })}`);
                } else if (selectedRecord.nquerybuildertablecodecolumn === undefined
                    || selectedRecord["nquerybuildertablecodecolumn"].length === 0) {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_REPORTTABLECOLUMNNAME" })}`);
                }
                else {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}`);
                }
            }
        }
        // } else {
        //     toast.info(`${this.props.intl.formatMessage({ id: "IDS_REMOVETHEGRIDVALUEANDADD" })}`); 
        // }
    }






    //     addreportParametersInDataGrid = (selectedRecord) => {

    //         if(this.props.Login.ParameterMappingDatagrid.length !== this.props.Login.masterData.ReportParameter.length)
    //         {
    //         if (this.state.addDesignParameter.length === this.props.Login.masterData.ReportParameter.length) {
    //             toast.warn("You cannot add more than Report Parameters count");
    //         }else{
    //             if (selectedRecord  && selectedRecord.ncontrolBasedparameter !== this.state.addMappingParam && selectedRecord.ncontrolBasedparameter !== undefined && selectedRecord.nquerybuildertablecode !== undefined && selectedRecord.nquerybuildertablecodecolumn !== undefined) {
    //                 let copySelected = { ...selectedRecord };
    //                 const valuecheck=this.props.Login.ParameterMappingDatagrid.map(function (el) { return el.nreportparametercode; });
    //                 const isValuePresent = valuecheck.some(num => num === selectedRecord.ncontrolBasedparameter.value);
    //                 if (isValuePresent) {
    //                     toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYEXISTS" }));
    //                 }else{
    //                 const addDesignParameter = this.state.addDesignParameter;
    //                 const index = addDesignParameter.findIndex(item => {
    //                     if (typeof item.ncontrolBasedparameter.value === "number"  && typeof item.ncontrolBasedparameter.value === copySelected.nquerybuildertablecodecolumn.value ) {
    //                         return item.nquerybuildertablecodecolumn.value === copySelected.nquerybuildertablecodecolumn.value;
    //                     } else {
    //                         return item.ncontrolBasedparameter.value === copySelected.ncontrolBasedparameter.value;
    //                     }
    //                 });

    //                 if (index === -1) {
    //                     addDesignParameter.push(copySelected);
    //                     let controlbasedKey = 0;
    //                     controlbasedKey= gridDataparmeter.length>0 ? Math.max(...gridDataparmeter.map(x => x.controlbasedKey)):0; 
    //                     controlbasedKey++;
    //                     const gridDataparmeter = this.state.gridDataparmeter;
    //                     gridDataparmeter.push({
    //                         //nreportparametercode: copySelected.nreportparametercode.value,
    //                         controlbasedKey:controlbasedKey,
    //                         ncontrolBasedparameter: copySelected.ncontrolBasedparameter.value,
    //                         scontrolBasedparameter: copySelected.ncontrolBasedparameter.label,
    //                         stablecolumn: copySelected.nquerybuildertablecodecolumn.label,
    //                         nquerybuildertablecode: copySelected.nquerybuildertablecode.value,
    //                         stablename: copySelected.nquerybuildertablecode.label,
    //                     })
    //                     //const reportTypeListparameter=this.props.Login.reportTypeListparameter.map(function (el) { return el.nquerybuildertablecode.value; }).join(",")

    //                     this.setState({
    //                         addDesignParameter, selectedRecord: selectedRecord,
    //                         gridDataparmeter
    //                     });
    //                 }
    //                 else
    //                     toast.warn(this.props.intl.formatMessage({ id: "IDS_DUPLICATEMAPPING" }));
    //                 this.setState({ selectedRecord: { } });
    //                  }
    //             }else{
    //                 if (selectedRecord.ncontrolBasedparameter === undefined
    //                 || selectedRecord["ncontrolBasedparameter"].length === 0) {
    //                 toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_REPORTPARAMETER" })}`);
    //             }else if (selectedRecord.nquerybuildertablecode === undefined
    //                 || selectedRecord["nquerybuildertablecode"].length === 0) {
    //                 toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_REPORTTABLENAME" })}`);
    //             }else if (selectedRecord.nquerybuildertablecodecolumn === undefined
    //                 || selectedRecord["nquerybuildertablecodecolumn"].length === 0) {
    //                 toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_REPORTTABLECOLUMNNAME" })}`);
    //             }else{
    //                 toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}`);
    //             }       
    //             }
    //         }
    //     }else{
    //         toast.info(`${this.props.intl.formatMessage({ id: "IDS_REMOVETHEGRIDVALUEANDADD" })}`); 
    //     }
    // }

    //ALPD-5537 Report Designer -> In control-based report add the version then configure Parameter extra icon was shows.
    removereportParametersInDataGrid = (selectedRecord) => {

        const gridDataNew = this.state.gridDataparmeter.filter(item => {
            if (typeof item.ncontrolBasedparameter === "number") {
                return item.ncontrolBasedparameter !== selectedRecord.ncontrolBasedparameter
            }
            else {
                return item.ncontrolBasedparameter !== selectedRecord.ncontrolBasedparameter
            }
        });

        const ParameterMappingDatagridNew = this.props.Login.ParameterMappingDatagrid.filter(item => {
            if (typeof item.ncontrolBasedparameter === "number") {
                return item.ncontrolBasedparameter !== selectedRecord.ncontrolBasedparameter
            }
            else {
                return item.ncontrolBasedparameter !== selectedRecord.ncontrolBasedparameter
            }
        })

        let str = this.props.Login.reportTypeListparametercopy;
        let reportTypeListparameter1 = this.state.reportTypeListparameter;

        let filteredList = str.filter(x => x.value === selectedRecord?.ncontrolBasedparameter);

        // Ensuring previous values are stored correctly
        let previousList = Array.isArray(reportTypeListparameter1) ? reportTypeListparameter1 : [];
        
        // Merging both values into a single array
        let reportTypeListparameter = [
            ...previousList,
            ...filteredList.filter(newItem => 
                !previousList.some(existingItem => existingItem.value === newItem.value)
            )
        ];

        this.props.Login.ParameterMappingDatagrid = ParameterMappingDatagridNew;
        this.setState({ gridDataparmeter: gridDataNew, reportTypeListparameter: reportTypeListparameter });
    }

    removeParametersInDataGrid = (selectedItem) => {

        const addDesignParamNew = this.state.addDesignParam.filter(item => {
            if (typeof item.nreportparametercode === "number") {
                return item.nreportparametercode !== selectedItem.nreportparametercode
            }
            else {
                return item.nreportparametercode.value !== selectedItem.nreportparametercode
            }
        });
        const gridDataNew = this.state.gridData.filter(item => {
            if (typeof item.nreportparametercode === "number") {
                return item.nreportparametercode !== selectedItem.nreportparametercode
            }
            else {
                return item.nreportparametercode.value !== selectedItem.nreportparametercode
            }
        });


        //gridData.filter
        // (item => item.sfieldname !== selectedItem.sfieldname);
        this.setState({ addDesignParam: addDesignParamNew, gridData: gridDataNew });

    }

    addParametersInDataGrid = (selectedRecord) => {
        if (this.state.addDesignParam.length === this.props.Login.masterData.ReportParameter.length) {
            toast.warn("You cannot add more than Report Parameters count");
        }
        else {
            let validData = false;
            if (selectedRecord["sdisplayname"] && selectedRecord["sdisplayname"].trim().length !== 0
                && selectedRecord["nreportparametercode"] && selectedRecord["ndesigncomponentcode"]) {
                validData = true;
                if (selectedRecord["ndesigncomponentcode"].value === designComponents.COMBOBOX) {
                    if (selectedRecord["nsqlquerycode"] && selectedRecord["nsqlquerycode"].length !== 0) {
                        validData = true;
                    }
                    else {
                        validData = false;
                    }
                }
                if (selectedRecord["ndesigncomponentcode"].value === designComponents.DATEPICKER) {
                    if (selectedRecord["ndays"] && selectedRecord["ndays"].length !== 0) {
                        validData = true;
                    } else {
                        validData = false;
                    }
                }
            }
            if (validData) {
                if (selectedRecord && selectedRecord.nreportparametercode !== undefined) {
                    let copySelected = { ...selectedRecord };

                    const addDesignParam = this.state.addDesignParam;
                    const index = addDesignParam.findIndex(item => {
                        if (typeof item.nreportparametercode === "number") {
                            return item.nreportparametercode === copySelected.nreportparametercode.value;
                        } else {
                            return item.nreportparametercode.value === copySelected.nreportparametercode.value;
                        }
                    });

                    if (index === -1) {
                        addDesignParam.push(copySelected);
                        const gridData = this.state.gridData;;
                        gridData.push({
                            nreportparametercode: copySelected.nreportparametercode.value,
                            sreportparametername: copySelected.nreportparametercode.label,
                            sdisplayname: copySelected.sdisplayname,
                            ndesigncomponentcode: copySelected.ndesigncomponentcode.value,
                            sdesigncomponentname: copySelected.ndesigncomponentcode.label,
                        })
                        this.setState({
                            addDesignParam, selectedRecord: { ndays: "", sdisplayname: "" },
                            gridData
                        });
                    }
                    else
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_DUPLICATEMAPPING" }));
                    this.setState({ selectedRecord: { ndays: "", sdisplayname: "" } });
                }
            }
            else {
                //toast.info(this.props.intl.formatMessage({id:"IDS_FILLMANDATORY"}));
                if (selectedRecord["nreportparametercode"] === undefined
                    || selectedRecord["nreportparametercode"].length === 0) {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}`);
                }
                else if (selectedRecord["sdisplayname"] === undefined
                    || selectedRecord["sdisplayname"] === "") {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_DISPLAYNAME" })}`);
                }
                else if (selectedRecord["ndesigncomponentcode"] === undefined
                    || selectedRecord["ndesigncomponentcode"].length === 0) {
                    toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_INPUTTYPE" })}`);
                }
                else {
                    if (selectedRecord["ndesigncomponentcode"].value === designComponents.COMBOBOX) {
                        if (selectedRecord["nsqlquerycode"] === undefined || selectedRecord["nsqlquerycode"].length === 0) {
                            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_EXISTINGLINKTABLE" })}`);
                        }
                    }
                    else if (selectedRecord["ndesigncomponentcode"].value === designComponents.DATEPICKER) {
                        if (selectedRecord["ndays"] === undefined || selectedRecord["ndays"].length === 0) {
                            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_DAYS" })}`);
                        }
                    }
                }
            }
        }
    }

    unbindMappingParametersFromDataGrid = (selectedItem) => {

        const addMappingParamNew = this.state.addMappingParam.filter(item => {
            if (typeof item.nchildreportdesigncode === "number") {
                if (item.nchildreportdesigncode === selectedItem.nchildreportdesigncode) {
                    return (item.nparentreportdesigncode !== selectedItem.nparentreportdesigncode)
                }
                else
                    return item;
            }
            else {
                if (item.nchildreportdesigncode.value === selectedItem.nchildreportdesigncode) {
                    return (item.nparentreportdesigncode.value !== selectedItem.nparentreportdesigncode)
                }
                else
                    return item;
            }
        });
        const mappingGridDataNew = this.state.mappingGridData.filter(item => {
            if (typeof item.nchildreportdesigncode === "number") {
                if (item.nchildreportdesigncode === selectedItem.nchildreportdesigncode) {
                    return (item.nparentreportdesigncode !== selectedItem.nparentreportdesigncode)
                }
                else
                    return item;
            }
            else {
                if (item.nchildreportdesigncode.value === selectedItem.nchildreportdesigncode) {
                    return (item.nparentreportdesigncode.value !== selectedItem.nparentreportdesigncode)
                }
                else
                    return item;
            }
        });

        this.setState({ addMappingParam: addMappingParamNew, mappingGridData: mappingGridDataNew });

    }

    bindMappingParametersToDataGrid = (selectedRecord) => {

        if (selectedRecord["sfieldname"] && selectedRecord["nparentreportdesigncode"]
            && selectedRecord["nchildreportdesigncode"]) {
            if (selectedRecord && selectedRecord.nparentreportdesigncode !== undefined) {
                let copySelected = { ...selectedRecord };

                const addMappingParam = this.state.addMappingParam;
                const index = addMappingParam.findIndex(item => {
                    if (typeof item.nparentreportdesigncode === "number") {
                        return item.nparentreportdesigncode === copySelected.nparentreportdesigncode.value
                            && item.nchildreportdesigncode === copySelected.nchildreportdesigncode.value
                            && item.sfieldname === copySelected.sfieldname.value;
                    }
                    else {
                        return item.nparentreportdesigncode.value === copySelected.nparentreportdesigncode.value
                            && item.nchildreportdesigncode.value === copySelected.nchildreportdesigncode.value
                            && item.sfieldname.value === copySelected.sfieldname.value;
                    }
                });
                if (index === -1) {
                    addMappingParam.push(copySelected);
                    const mappingGridData = this.state.mappingGridData;;
                    mappingGridData.push({
                        nparentreportdesigncode: copySelected.nparentreportdesigncode.value,
                        nchildreportdesigncode: copySelected.nchildreportdesigncode.value,
                        sparentparametername: copySelected.nparentreportdesigncode.label,
                        schildparametername: copySelected.nchildreportdesigncode.label,
                        sfieldname: copySelected.sfieldname.value,
                        nactionparameter: transactionStatus.NO
                    })


                    this.setState({
                        addMappingParam,
                        selectedRecord: {
                            nactionreportdesigncode: "",
                            nparentreportdesigncode: "",
                            sfieldname: "",
                            nchildreportdesigncode: ""
                        },
                        //selectedRecord:{},
                        mappingGridData
                    });
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_DUPLICATEMAPPING" }));
                    this.setState({
                        selectedRecord: {
                            nparentreportdesigncode: { label: "", value: -1 },
                            sfieldname: { label: "", value: -1 },
                            nchildreportdesigncode: { label: "", value: -1 }
                        },
                    });

                }
            }
        }
        else {
            //toast.warn(this.props.intl.formatMessage({id:"IDS_FILLMANDATORY"}));

            if (selectedRecord["nchildreportdesigncode"] === undefined
                || selectedRecord["nchildreportdesigncode"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}`);
            }
            else if (selectedRecord["sfieldname"] === undefined
                || selectedRecord["sfieldname"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_FIELDNAME" })}`);
            }
            else if (selectedRecord["nparentreportdesigncode"] === undefined
                || selectedRecord["nparentreportdesigncode"].length === 0) {
                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${this.props.intl.formatMessage({ id: "IDS_PARENTPARAMETER" })}`);
            }
        }

    }

    bindActionParameter = (rowItem, event) => {

        const gridMappingParam = this.state.mappingGridData;
        const addMappingParam = this.state.addMappingParam;
        if (event.target.checked) {
            gridMappingParam.forEach(item => {
                if (item.nchildreportdesigncode === rowItem.selectedRecord.nchildreportdesigncode) {
                    if (item.nparentreportdesigncode === rowItem.selectedRecord.nparentreportdesigncode) {
                        const index = addMappingParam.findIndex(item => item.nchildreportdesigncode === rowItem.selectedRecord.nchildreportdesigncode
                            && item.nparentreportdesigncode === rowItem.selectedRecord.nparentreportdesigncode)

                        addMappingParam[index] = {
                            ...addMappingParam[index],
                            "nisactionparent": transactionStatus.YES
                        };
                        return item.nisactionparent = transactionStatus.YES;
                    }
                    else {
                        const index = addMappingParam.findIndex(item => item.nchildreportdesigncode === rowItem.selectedRecord.nchildreportdesigncode
                            && item.nparentreportdesigncode === rowItem.selectedRecord.nparentreportdesigncode)

                        addMappingParam[index] = {
                            ...addMappingParam[index],
                            "nisactionparent": transactionStatus.NO
                        };
                        return item.nisactionparent = transactionStatus.NO;
                    }
                }
            })
        }
        else {
            const index = gridMappingParam.findIndex(item => item.nchildreportdesigncode === rowItem.selectedRecord.nchildreportdesigncode
                && item.nparentreportdesigncode === rowItem.selectedRecord.nparentreportdesigncode);
            gridMappingParam[index]["nisactionparent"] = transactionStatus.NO;

            const index1 = addMappingParam.findIndex(item => item.nchildreportdesigncode === rowItem.selectedRecord.nchildreportdesigncode
                && item.nparentreportdesigncode === rowItem.selectedRecord.nparentreportdesigncode)

            addMappingParam[index1] = {
                ...addMappingParam[index1],
                "nisactionparent": transactionStatus.NO
            };
        }

        this.setState({ mappingGridData: gridMappingParam, addMappingParam: addMappingParam });
    }

    handleChangeDesign = (value, valueParam) => {
        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[valueParam] = value.value;
            this.setState({ selectedRecord });
        }
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let controlButton = this.props.Login.controlButton;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "toggle"
                || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            controlButton = [];

        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId: null, controlButton
            }
        }
        this.props.updateStore(updateInfo);


    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldName === "nreporttypecode") {
            selectedRecord[fieldName] = comboData;
            if (comboData.value === reportTypeEnum.COA || comboData.value === reportTypeEnum.COAPREVIEW || comboData.value === reportTypeEnum.COAPRELIMINARY) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord: selectedRecord }
                }
                this.props.updateStore(updateInfo);
            }
            else if (comboData.value !== reportTypeEnum.MIS &&
                comboData.value !== reportTypeEnum.SCREENWISE && comboData.value !== reportTypeEnum.SAMPLE) {
                this.props.getReportSubType({ selectedRecord, reportType: comboData.item, userInfo: this.props.Login.userInfo });
            }
            else if (comboData.value === reportTypeEnum.SAMPLE) {
                this.props.getReportSampletype({ selectedRecord, reportType: comboData.item, nregtypecode: RegistrationType.PLASMA_POOL, userInfo: this.props.Login.userInfo });
            }
            else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord: selectedRecord }
                }
                this.props.updateStore(updateInfo);
            }

        }
        else if (fieldName === "nchildreportdesigncode") {
            //parameter mapping
            selectedRecord[fieldName] = comboData;

            const sqlquery = comboData.item.ssqlquery;
            const param = [];
            const param1 = [];
            // let firstIndex = sqlquery.indexOf("P$");
            // const lastIndex = sqlquery.lastIndexOf("P$");            
            // let first = sqlquery.indexOf("P$");
            // let endFirst = sqlquery.indexOf("$P");
            // do {

            //     let second = sqlquery.indexOf("P$", first + 1);
            //     let endSecond = sqlquery.indexOf("$P", endFirst + 1);
            //     const parameter = sqlquery.substring(first + 2, endFirst);
            //     param.push({ label: parameter, value: parameter });

            //     first = second;
            //     endFirst = endSecond;
            //     firstIndex = second;
            // }
            // while (firstIndex === lastIndex)
            let query = sqlquery;
            while (query.indexOf("<@") !== -1 || query.indexOf("<#") !== -1) {
                let index1 = query.indexOf("<@");
                let index2 = query.indexOf("@>");
                let check = false;
                if (query.indexOf("<@") !== -1) {
                    index1 = query.indexOf("<@");
                    index2 = query.indexOf("@>");
                    check = true;
                }
                else if (query.indexOf("<#") !== -1) {
                    index1 = query.indexOf("<#");
                    index2 = query.indexOf("#>");
                }

                const parameter = query.substring(index1 + 2, index2);
                if (!param1.includes(parameter)) {
                    param.push({ label: parameter, value: parameter });
                    param1.push(parameter);
                }
                if (check) {
                    query = query.replace("<@", "").replace("@>", "");
                } else {
                    query = query.replace("<#", "").replace("#>", "");
                }

            }

            this.setState({ selectedRecord, optionalParameterList: param });
            //}
        }
        else if (fieldName === "ncontrolBasedparameter") {
            //parameter mapping
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
            this.props.controlBasedReportparametretable(
                //this.state.selectedRecord,
                this.props.Login.masterData.SelectedReportMaster.nformcode,
                this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                this.props.Login.userInfo,
                selectedRecord.ncontrolBasedparameter.item.sdatatype,
                //this.props.Login.screenName
            );
        }
        // else if (fieldName === "nquerybuildertablecode") {
        //     //parameter mapping
        //     selectedRecord[fieldName] = comboData;
        //     this.props.controlBasedReportparametretablecolumn(
        //         //this.state.selectedRecord,
        //         this.props.Login.masterData.SelectedReportMaster.nformcode,
        //         this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
        //         this.props.Login.userInfo,
        //         selectedRecord.ncontrolBasedparameter.item.sdatatype,
        //         //this.props.Login.screenName
        //     );
        // }
        else if (fieldName === "nsampletypecode") {
            selectedRecord[fieldName] = comboData;
            this.props.getregtype({ selectedRecord, sampleType: comboData.item, userInfo: this.props.Login.userInfo })
        }
        else if (fieldName === "nregtypecode") {
            selectedRecord[fieldName] = comboData;
            this.props.getReportRegSubType({ selectedRecord, registrationType: comboData.item, userInfo: this.props.Login.userInfo })
        }
        else if (fieldName === "nregsubtypecode") {
            selectedRecord[fieldName] = comboData;
            this.props.getReportRegSubTypeApproveConfigVersion({ selectedRecord, registrationsubType: comboData.item, userInfo: this.props.Login.userInfo })
        }
        else if (fieldName === "ncertificatetypecode") {
            selectedRecord[fieldName] = comboData;
            selectedRecord["sbatchdisplayname"] = comboData.item.sbatchdisplayname;
            this.setState({ selectedRecord });
        }
        else if (fieldName === "nformcode") {
            selectedRecord[fieldName] = comboData;
            selectedRecord["ncontrolcode"] = undefined;
            this.props.getControlButton({ selectedRecord, ControlScreen: comboData.item, userInfo: this.props.Login.userInfo })
        }
        else if (fieldName === "ncoareporttypecode") {
            selectedRecord[fieldName] = comboData;
            selectedRecord["nsectioncode"] = undefined;
            // this.props.getReportTemplate({ selectedRecord, userInfo: this.props.Login.userInfo })
            this.setState({ selectedRecord });
        }
        else if (fieldName === "ntranscode") {
            //selectedRecord[fieldName] = comboData;
            //const ntransactionsamplecode = selectedSubsample.map(x => x.ntransactionsamplecode).join(",");
            selectedRecord["ntranscode"] = comboData;
            this.setState({ selectedRecord });
        }
        // else if (fieldName === "nreportparametercode") {
        //     //selectedRecord[fieldName] = comboData;
        //     //const ntransactionsamplecode = selectedSubsample.map(x => x.ntransactionsamplecode).join(",");
        //     selectedRecord["nreportparametercode"] = comboData;
        //     this.setState({ selectedRecord });
        // }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            if (event.target.name === "ndays") {
                if (event.target.value !== "") {
                    event.target.value = validateDays(event.target.value);
                    selectedRecord[event.target.name] =
                        event.target.value !== ""
                            ? event.target.value
                            : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    onDropImage = (attachedFiles, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = attachedFiles;
        this.setState({ selectedRecord, actionType: "new" });
    }

    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.screenName === "IDS_REPORTVERSION") {
            this.onSaveVersion(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_REPORTMASTER") {
            this.onSaveMaster(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_REPORTDESIGN") {
            this.onSaveReportConfig(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_PARAMETERMAPPING") {
            this.onSaveParameterMapping(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_ACTIONMAPPING") {
            this.onSaveParameterAction(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_SUBREPORTS") {
            this.onSaveSubReport(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_IMAGES") {
            this.onSaveReportImage(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_REPORTVALIDATION") {
            this.onSaveReportValidation(saveType, formRef);
        }
        else if (this.props.Login.screenName === "IDS_REPORTPARAMETERMAPPING") {
            this.onSaveReportParameter(saveType, formRef);
        }
    }

    onSaveMaster = (saveType, formRef) => {
        const reportFile = this.state.selectedRecord.sfilename;

        let isFileEdited = transactionStatus.NO;
        const formData = new FormData();
        let methodUrl = "ReportDesigner";

        let postParam = undefined;
        let reportmaster = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
        let inputParam = {};

        if (this.props.Login.operation === "update") {
            // edit           
            postParam = {
                inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
                primaryKeyField: "nreportcode"
            };
            if (this.props.Login.reportVersionStatus === transactionStatus.APPROVED) {
                let approvedReportMaster = this.props.Login.ApprovedReportMaster;
                approvedReportMaster["sfilterreporttypecode"] = this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode.toString();
                reportmaster = JSON.parse(JSON.stringify(approvedReportMaster));
                reportmaster["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.ACTIVE;
            }
            else {
                const data = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

                reportmaster["nreporttypecode"] = data["nreporttypecode"].value;
                reportmaster["nreportcode"] = data["nreportcode"];
                reportmaster["nsampletypecode"] = transactionStatus.NA;
                reportmaster["nregtypecode"] = transactionStatus.NA;
                reportmaster["nregsubtypecode"] = transactionStatus.NA;
                reportmaster["napproveconfversioncode"] = transactionStatus.NA;
                reportmaster["nsectioncode"] = transactionStatus.NA;
                reportmaster["nreportmodulecode"] = transactionStatus.NA;
                reportmaster["nreportdecisiontypecode"] = transactionStatus.NA;
                reportmaster["ncertificatetypecode"] = transactionStatus.NA;
                reportmaster["ncoareporttypecode"] = transactionStatus.NA;
                reportmaster["nreporttemplatecode"] = transactionStatus.NA;


                reportmaster["sreportname"] = Lims_JSON_stringify(replaceBackSlash(this.state.selectedRecord["sreportname"]), false);
                reportmaster["sdescription"] = Lims_JSON_stringify(replaceBackSlash(this.state.selectedRecord["sdescription"] || ""), false);
                reportmaster["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.ACTIVE;
                reportmaster["sfilterreporttypecode"] = this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode.toString();

                if (//data["nreporttypecode"].value === reportTypeEnum.SAMPLE || 
                    data["nreporttypecode"].value === reportTypeEnum.COA) {
                    reportmaster["nsampletypecode"] = this.state.selectedRecord["nsampletypecode"] ?
                        this.state.selectedRecord["nsampletypecode"].value : data["nsampletypecode"].value;
                    reportmaster["nregtypecode"] = this.state.selectedRecord["nregtypecode"] ?
                        this.state.selectedRecord["nregtypecode"].value : data["nregtypecode"].value;
                    reportmaster["nregsubtypecode"] = this.state.selectedRecord["nregsubtypecode"] ?
                        this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;

                    reportmaster["napproveconfversioncode"] = this.state.selectedRecord["napproveconfversioncode"] ?
                        this.state.selectedRecord["napproveconfversioncode"].value : transactionStatus.NA;

                    reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"] ?
                        this.state.selectedRecord["nsectioncode"].value : transactionStatus.NA;
                    reportmaster["ncoareporttypecode"] = this.state.selectedRecord["ncoareporttypecode"] ?
                        this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA;
                    reportmaster["nreporttemplatecode"] = this.state.selectedRecord["nreporttemplatecode"] ?
                        this.state.selectedRecord["nreporttemplatecode"].value : transactionStatus.NA;
                    // if (data["nreporttypecode"].value === reportTypeEnum.SAMPLE)
                    // {
                    //      reportmaster["nreportdecisiontypecode"] = this.state.selectedRecord["nreportdecisiontypecode"] 
                    //                  ? this.state.selectedRecord["nreportdecisiontypecode"].value : data["nreportdecisiontypecode"];
                    // }
                } else if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPREVIEW || this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPRELIMINARY) {
                    reportmaster["nsampletypecode"] = this.state.selectedRecord["nsampletypecode"] ?
                        this.state.selectedRecord["nsampletypecode"].value : data["nsampletypecode"].value;
                    reportmaster["nregtypecode"] = this.state.selectedRecord["nregtypecode"] ?
                        this.state.selectedRecord["nregtypecode"].value : data["nregtypecode"].value;
                    reportmaster["nregsubtypecode"] = this.state.selectedRecord["nregsubtypecode"] ?
                        this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;

                    reportmaster["napproveconfversioncode"] = this.state.selectedRecord["napproveconfversioncode"] ?
                        this.state.selectedRecord["napproveconfversioncode"].value : transactionStatus.NA;

                    reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"] ?
                        this.state.selectedRecord["nsectioncode"].value : transactionStatus.NA;
                    reportmaster["ncoareporttypecode"] = this.state.selectedRecord["ncoareporttypecode"] ?
                        this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA;
                    reportmaster["nreporttemplatecode"] = this.state.selectedRecord["nreporttemplatecode"] ?
                        this.state.selectedRecord["nreporttemplatecode"].value : transactionStatus.NA;
                } else if (data["nreporttypecode"].value === reportTypeEnum.SAMPLE || data["nreporttypecode"].value === reportTypeEnum.BATCH) {
                    reportmaster["ncoareporttypecode"] = this.state.selectedRecord["ncoareporttypecode"] ?
                        this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA;
                    reportmaster["ncertificatetypecode"] = this.state.selectedRecord["ncertificatetypecode"]
                        ? this.state.selectedRecord["ncertificatetypecode"].value : data["ncertificatetypecode"];

                    if (data["nreporttypecode"].value === reportTypeEnum.SAMPLE
                        && this.props.Login.masterData.SelectedReportDetail.isneedregtype === transactionStatus.YES) {
                        reportmaster["nsampletypecode"] = this.state.selectedRecord["nsampletypecode"] ?
                            this.state.selectedRecord["nsampletypecode"].value : data["nsampletypecode"].value;
                        reportmaster["nregtypecode"] = this.state.selectedRecord["nregtypecode"] ?
                            this.state.selectedRecord["nregtypecode"].value : data["nregtypecode"].value;
                        reportmaster["nregsubtypecode"] = this.state.selectedRecord["nregsubtypecode"] ?
                            this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;
                        reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"] ?
                            this.state.selectedRecord["nsectioncode"].value : transactionStatus.NA;

                    }
                }
                else if (data["nreporttypecode"].value === reportTypeEnum.SCREENWISE) {
                    reportmaster["ncontrolcode"] = this.state.selectedRecord["ncontrolcode"]
                        ? this.state.selectedRecord["ncontrolcode"].value : data["ncontrolcode"];

                }
                else {

                    if (data["nreporttypecode"].value === reportTypeEnum.MIS) {
                        if (typeof this.state.selectedRecord["nreportmodulecode"].value === "string") {
                            reportmaster["nreportmodulecode"] = 0;
                            reportmaster["smoduledisplayname"] = this.state.selectedRecord["nreportmodulecode"].value;
                            reportmaster["jsondata"] = {
                                "sdisplayname": {
                                    "en-US": this.state.selectedRecord["nreportmodulecode"].value,
                                    "ru-RU": this.state.selectedRecord["nreportmodulecode"].value,
                                    "tg-TG": this.state.selectedRecord["nreportmodulecode"].value
                                }
                            };
                        }
                        else {
                            reportmaster["nreportmodulecode"] = this.state.selectedRecord["nreportmodulecode"].value;
                        }
                    }
                    else {
                        reportmaster["nreportmodulecode"] = data["nreportmodulecode"];
                    }
                }
            }
            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ReportMaster",
                inputData: {
                    userinfo: {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
                    }, reportmaster
                },
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef
            }
        }
        else {
            //add   
            reportmaster["nreporttypecode"] = this.state.selectedRecord["nreporttypecode"].value;
            //reportmaster["nreporttypecode"] = this.state.selectedRecord["nreporttypecode"].value == reportTypeEnum.COAPREVIEW ? reportTypeEnum.COA : this.state.selectedRecord["nreporttypecode"].value;
            reportmaster["nreportdecisiontypecode"] = transactionStatus.NA;
            reportmaster["ncertificatetypecode"] = transactionStatus.NA;
            reportmaster["nsampletypecode"] = transactionStatus.NA;
            reportmaster["nregtypecode"] = transactionStatus.NA;
            reportmaster["nregsubtypecode"] = transactionStatus.NA;
            reportmaster["napproveconfversioncode"] = transactionStatus.NA;
            reportmaster["nreportmodulecode"] = transactionStatus.NA;
            reportmaster["ncontrolcode"] = transactionStatus.NA;
            reportmaster["sreportname"] = Lims_JSON_stringify(replaceBackSlash(this.state.selectedRecord["sreportname"]), false);
            reportmaster["sdescription"] = Lims_JSON_stringify(replaceBackSlash(this.state.selectedRecord["sdescription"] || ""), false);
            reportmaster["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"];
            reportmaster["ncoareporttypecode"] = this.state.selectedRecord["nreporttypecode"].value !== reportTypeEnum.MIS && this.state.selectedRecord["nreporttypecode"].value !== reportTypeEnum.SCREENWISE ?
                this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA;


            if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE) {
                reportmaster["nsampletypecode"] = this.state.selectedRecord["nsampletypecode"] ?
                    this.state.selectedRecord["nsampletypecode"].value : transactionStatus.NA;
                reportmaster["nregtypecode"] = this.state.selectedRecord["nregtypecode"] ?
                    this.state.selectedRecord["nregtypecode"].value : transactionStatus.NA;
                reportmaster["nregsubtypecode"] = this.state.selectedRecord["nregsubtypecode"] ?
                    this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;
                reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"]
                    ? this.state.selectedRecord["nsectioncode"].value
                    : transactionStatus.NA;
                reportmaster["nreportdecisiontypecode"] = this.state.selectedRecord["nreportdecisiontypecode"]
                    ? this.state.selectedRecord["nreportdecisiontypecode"].value
                    : transactionStatus.NA;
                reportmaster["ncertificatetypecode"] = this.state.selectedRecord["ncertificatetypecode"].value;

            }
            else if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.BATCH) {
                reportmaster["ncertificatetypecode"] = this.state.selectedRecord["ncertificatetypecode"].value;
            }
            else if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SCREENWISE) {
                reportmaster["ncontrolcode"] = this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SCREENWISE ?
                    this.state.selectedRecord["ncontrolcode"].value : transactionStatus.NA;

            }
            else if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA) {
                reportmaster["nsampletypecode"] = this.state.selectedRecord && this.state.selectedRecord["nsampletypecode"] ? this.state.selectedRecord["nsampletypecode"].value : transactionStatus.NA;
                reportmaster["nregtypecode"] = this.state.selectedRecord && this.state.selectedRecord["nregtypecode"] ? this.state.selectedRecord["nregtypecode"].value : transactionStatus.NA;
                reportmaster["nregsubtypecode"] = this.state.selectedRecord && this.state.selectedRecord["nregsubtypecode"] ? this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;
                reportmaster["napproveconfversioncode"] = this.state.selectedRecord &&
                    this.state.selectedRecord["napproveconfversioncode"] ?
                    this.state.selectedRecord["napproveconfversioncode"].value : transactionStatus.NA;
                reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"]
                    ? this.state.selectedRecord["nsectioncode"].value
                    : transactionStatus.NA;
                reportmaster["nreporttemplatecode"] = this.state.selectedRecord && this.state.selectedRecord["nreporttemplatecode"] ? this.state.selectedRecord["nreporttemplatecode"].value : transactionStatus.NA;
            } else if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPREVIEW || this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COAPRELIMINARY) {
                reportmaster["nsampletypecode"] = this.state.selectedRecord && this.state.selectedRecord["nsampletypecode"] ? this.state.selectedRecord["nsampletypecode"].value : transactionStatus.NA;
                reportmaster["nregtypecode"] = this.state.selectedRecord && this.state.selectedRecord["nregtypecode"] ? this.state.selectedRecord["nregtypecode"].value : transactionStatus.NA;
                reportmaster["nregsubtypecode"] = this.state.selectedRecord && this.state.selectedRecord["nregsubtypecode"] ? this.state.selectedRecord["nregsubtypecode"].value : transactionStatus.NA;
                reportmaster["napproveconfversioncode"] = this.state.selectedRecord &&
                    this.state.selectedRecord["napproveconfversioncode"] ?
                    this.state.selectedRecord["napproveconfversioncode"].value : transactionStatus.NA;
                reportmaster["nsectioncode"] = this.state.selectedRecord["nsectioncode"]
                    ? this.state.selectedRecord["nsectioncode"].value
                    : transactionStatus.NA;
                reportmaster["nreporttemplatecode"] = this.state.selectedRecord && this.state.selectedRecord["nreporttemplatecode"] ? this.state.selectedRecord["nreporttemplatecode"].value : transactionStatus.NA;

            }
            else {
                if (typeof this.state.selectedRecord["nreportmodulecode"].value === "string") {
                    reportmaster["nreportmodulecode"] = 0;
                    reportmaster["smoduledisplayname"] = this.state.selectedRecord["nreportmodulecode"].value;
                    reportmaster["jsondata"] = {
                        "sdisplayname": {
                            "en-US": this.state.selectedRecord["nreportmodulecode"].value,
                            "ru-RU": this.state.selectedRecord["nreportmodulecode"].value,
                            "tg-TG": this.state.selectedRecord["nreportmodulecode"].value
                        }
                    };
                }
                else {
                    reportmaster["nreportmodulecode"] = this.state.selectedRecord["nreportmodulecode"].value;
                }

            }

            let reportdetails = {
                // ncoareporttypecode: this.state.selectedRecord["nreporttypecode"].value !== reportTypeEnum.MIS && this.state.selectedRecord["nreporttypecode"].value !== reportTypeEnum.SCREENWISE  ?
                //     this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA,
                // nsectioncode: this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE ?
                // this.state.selectedRecord["nsectioncode"]? this.state.selectedRecord["nsectioncode"].value : transactionStatus.NA: transactionStatus.NA,
                // nreportdecisiontypecode: this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.SAMPLE ?
                //                 this.state.selectedRecord["nreportdecisiontypecode"].value : transactionStatus.NA,
                // ncertificatetypecode: this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.BATCH ?
                //                 this.state.selectedRecord["ncertificatetypecode"].value : transactionStatus.NA,
                ntransactionstatus: transactionStatus.DRAFT,
                nversionno: -1,
                nisplsqlquery: this.state.selectedRecord["nisplsqlquery"] ? this.state.selectedRecord["nisplsqlquery"] : transactionStatus.NO,
                sreportformatdetail: this.state.selectedRecord["sreportformatdetail"] == undefined ? 'pdf' : this.state.selectedRecord["sreportformatdetail"],

            };

            // if(this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA){

            //     reportdetails={
            //         ncoareporttypecode : this.state.selectedRecord ? this.state.selectedRecord.ncoareporttypecode.value : transactionStatus.NA,
            //         nreportdecisiontypecode : transactionStatus.NA,
            //         ncertificatetypecode : transactionStatus.NA,
            //         nsectioncode : this.state.selectedRecord && this.state.selectedRecord.nsectioncode ? this.state.selectedRecord.nsectioncode.value : transactionStatus.NA ,
            //         ntransactionstatus: transactionStatus.DRAFT,
            //         nisplsqlquery: this.state.selectedRecord ? this.state.selectedRecord["nisplsqlquery"] || transactionStatus.NO : transactionStatus.NO,
            //     }
            // }

            //reportdetails["nversionno"] = -1;
            // reportdetails["nisplsqlquery"] = this.state.selectedRecord ? this.state.selectedRecord["nisplsqlquery"] || transactionStatus.NO : transactionStatus.NO;

            if (reportFile && Array.isArray(reportFile) && reportFile.length > 0) {

                const splittedFileName = reportFile[0].name.split('.');
                const fileExtension = reportFile[0].name.split('.')[splittedFileName.length - 1];
                const uniquefilename = this.state.selectedRecord.sfilename === "" ?
                    this.state.selectedRecord.sfilename : create_UUID() + '.' + fileExtension;

                reportdetails["sfilename"] = Lims_JSON_stringify(reportFile[0].name.trim(), false);
                reportdetails["ssystemfilename"] = uniquefilename;

                formData.append("uploadedFile0", reportFile[0]);
                formData.append("uniquefilename0", uniquefilename);
                isFileEdited = transactionStatus.YES;
                //reportmaster["sfilename"] = "";
            }

            formData.append("isFileEdited", isFileEdited);
            formData.append("filecount", 1);
            formData.append("reportdetails", JSON.stringify(reportdetails));

            // formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
            formData.append("reportmaster", JSON.stringify(reportmaster));


            inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: methodUrl,//"ReportDesigner",
                //  inputData: inputData,
                inputData: {
                    userinfo: {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename)
                    }
                },
                formData: formData,
                isFileupload: true,
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef
            }
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    onSaveVersion = (saveType, formRef) => {
        const reportFile = this.state.selectedRecord.sfilename;

        let isFileEdited = transactionStatus.NO;
        const formData = new FormData();

        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode"
        };
        const reportmaster = this.props.Login.masterData.SelectedReportMaster;
        reportmaster["sfilterreporttypecode"] = this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode.toString();


        let reportdetails = {
            // ncoareporttypecode: this.props.Login.masterData.SelectedReportMaster["nreporttypecode"] !== reportTypeEnum.MIS &&this.props.Login.masterData.SelectedReportMaster["nreporttypecode"] !== reportTypeEnum.SCREENWISE  ?
            //     this.state.selectedRecord["ncoareporttypecode"].value : transactionStatus.NA,
            // nsectioncode: this.props.Login.masterData.SelectedReportMaster["nreporttypecode"] === reportTypeEnum.SAMPLE ?
            //                 this.state.selectedRecord["nsectioncode"] ? 
            //                 this.state.selectedRecord["nsectioncode"].value : transactionStatus.NA
            //                 : transactionStatus.NA,
            // nreportdecisiontypecode: this.props.Login.masterData.SelectedReportMaster["nreporttypecode"] === reportTypeEnum.SAMPLE ?
            //                     this.state.selectedRecord["nreportdecisiontypecode"].value : transactionStatus.NA,
            // ncertificatetypecode: this.props.Login.masterData.SelectedReportMaster["nreporttypecode"] === reportTypeEnum.BATCH ?
            //                     this.state.selectedRecord["ncertificatetypecode"].value : transactionStatus.NA,

            ntransactionstatus: transactionStatus.DRAFT,
            nisplsqlquery: this.state.selectedRecord["nisplsqlquery"] ? this.state.selectedRecord["nisplsqlquery"] : transactionStatus.NO,
        };

        if (this.props.Login.operation === "update") {
            // edit
            // postParam =  { inputListName : "ReportDetails", selectedObject : "SelectedReportDetail", 
            //                 primaryKeyField : "nreportdetailcode", isChild:true, };
            const data = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

            reportdetails["nreportdetailcode"] = data["nreportdetailcode"];
            reportdetails["nversionno"] = data["nversionno"];
            reportdetails["sfilename"] = Lims_JSON_stringify(data["sfilename"][0].path ? data["sfilename"][0].path : data["sfilename"], false);
            reportdetails["ssystemfilename"] = data["ssystemfilename"];
            reportdetails["sreportformatdetail"] = this.state.selectedRecord["sreportformatdetail"] == undefined ? 'pdf' : this.state.selectedRecord["sreportformatdetail"];

        }
        else {
            //add               
            reportdetails["nversionno"] = -1;

        }

        if (reportFile && Array.isArray(reportFile) && reportFile.length > 0) {

            const splittedFileName = reportFile[0].name.split('.');
            const fileExtension = reportFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.sfilename === "" ?
                this.state.selectedRecord.sfilename : create_UUID() + '.' + fileExtension;

            reportdetails["sfilename"] = Lims_JSON_stringify(reportFile[0].name, false);
            reportdetails["ssystemfilename"] = uniquefilename;

            formData.append("uploadedFile0", reportFile[0]);
            formData.append("uniquefilename0", uniquefilename);
            isFileEdited = transactionStatus.YES;
            //reportmaster["sfilename"] = "";
            reportdetails["sreportformatdetail"] = this.state.selectedRecord["sreportformatdetail"] == undefined ? 'pdf' : this.state.selectedRecord["sreportformatdetail"];
            //formData.append("sreportformatdetail",sreportformatdetail);
        }


        formData.append("isFileEdited", isFileEdited);
        formData.append("filecount", 1);
        formData.append("reportdetails", JSON.stringify(reportdetails));
        //formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
        formData.append("reportmaster", JSON.stringify(reportmaster));


        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ReportDetails",
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef, isChild: true
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    onSaveReportConfig = (saveType, formRef) => {

        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode"
        };
        if (this.state.addDesignParam.length === this.props.Login.masterData.ReportParameter.length) {
            let operation = this.props.Login.operation;
            let inputData = [];
            let selectedId = null;
            let data = [];
            //let i = 0;

            inputData["userinfo"] = {
                ...this.props.Login.userInfo,
                sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
            };

            if (JSON.stringify(this.state.addDesignParam) !== JSON.stringify(this.props.Login.masterData.ReportDesignConfig)) {
                this.state.addDesignParam.forEach(item => {
                    data.push({
                        "nreportdetailcode": this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                        "ndesigncomponentcode": typeof item.ndesigncomponentcode === "number" ? item.ndesigncomponentcode :
                            item.ndesigncomponentcode.value,
                        "nsqlquerycode": item.nsqlquerycode ? (typeof item.nsqlquerycode === "number" ?
                            item.nsqlquerycode : item.nsqlquerycode.value) : transactionStatus.NA,
                        "nreportparametercode": typeof item.nreportparametercode === "number" ?
                            item.nreportparametercode : item.nreportparametercode.value,
                        "sdisplayname": item.sdisplayname,
                        "ndays": item.ndays ? item.ndays : 0
                    });

                })
                inputData["reportdesignconfig"] = data;

                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "ReportDesignParameter",
                    displayName: this.props.Login.inputParam.displayName,
                    inputData: inputData, postParam,
                    operation: operation, saveType, formRef, dataState: undefined, selectedId, isChild: true
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            saveType
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                }
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_NODATATOSAVE" }))
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGUREALLPARAMETERS" }))
        }
    }

    onSaveParameterMapping = (saveType, formRef) => {

        let operation = this.props.Login.operation;
        let inputData = [];
        let selectedId = null;
        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode"
        };

        inputData["userinfo"] = {
            ...this.props.Login.userInfo,
            sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
            smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
        };
        inputData["reportparametermapping"] = [];
        inputData["reportdetails"] = this.props.Login.masterData.SelectedReportDetail;
        //inputData["reportparameteraction"] = [];

        // if ((this.props.Login.masterData.ReportParameterMapping.length > 0 && this.state.mappingGridData.length === 0)
        //     || (this.props.Login.masterData.ReportParameterMapping.length === 0 && this.state.mappingGridData.length > 0))
        // {
        // if (JSON.stringify(this.state.addMappingParam) !==JSON.stringify(this.props.Login.masterData.ReportParameterMapping))
        // {
        let count = 0;
        this.state.mappingGridData.forEach(item => {
            if (item.nisactionparent === transactionStatus.YES)
                count = count + 1;
            inputData["reportparametermapping"].push({
                "nreportdetailcode": this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                "nparentreportdesigncode": item.nparentreportdesigncode,
                "nchildreportdesigncode": item.nchildreportdesigncode,
                "sfieldname": item.sfieldname,
                "nisactionparent": item.nisactionparent
            });
            // if(item.nactionparameter === transactionStatus.YES)
            //     inputData["reportparameteraction"].push({"nreportdetailcode":this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
            //                                                 "nreportdesigncode": item.nchildreportdesigncode,
            //                                                 "nparentreportdesigncode": item.nparentreportdesigncode,                                                            
            //                                             });  
        })
        let valid = false;
        if (this.state.mappingGridData.length > 0) {
            if (count === this.props.Login.childComponentList.length) {
                valid = true;
            }
        }
        else {
            if (this.props.Login.masterData.ReportParameterMapping.length === 0 && this.state.mappingGridData.length === 0) {
                valid = false;
            }
            else
                valid = true;
        }

        if (valid) {
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ReportParameterMapping",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData, postParam,
                operation: operation, saveType, formRef, dataState: undefined, selectedId, isChild: true
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, saveType
                        //openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        ///operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        }
        else {
            if (this.state.mappingGridData.length === 0) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_NODATATOSAVE" }));
            }
            else {
                if (count !== this.props.Login.childComponentList.length)
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_INSUFFICIENTACTIONPARENT" }));
                else
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_NODATATOSAVE" }));
            }
        }
    }

    // onSaveParameterMapping = (saveType, formRef) =>{

    //         let operation = this.props.Login.operation;
    //         let inputData = [];
    //         let selectedId = null;
    //         let data = [];
    //         //let i = 0;

    //         inputData["userinfo"] = this.props.Login.userInfo;     

    //         this.state.addMappingParam.forEach(item => {          
    //             data.push({
    //                 "nreportdetailcode":this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
    //                 "nparentreportdesigncode": typeof item.nparentreportdesigncode === "number"? item.nparentreportdesigncode:
    //                                         item.nparentreportdesigncode.value,
    //                 "nchildreportdesigncode": typeof item.nchildreportdesigncode === "number"? item.nchildreportdesigncode:
    //                                         item.nchildreportdesigncode.value,

    //                 "sfieldname": typeof item.sfieldname === "string"? item.sfieldname:
    //                                         item.sfieldname.value
    //             });         

    //         })
    //         inputData["reportparametermapping"] = data;

    //         inputData["reportparameteraction"] = [];

    //         this.state.actionGridData.forEach(item => {          
    //             inputData["reportparameteraction"].push({
    //                 "nreportdetailcode":this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
    //                 "nreportdesigncode": typeof item.nchildreportdesigncode === "number"? item.nchildreportdesigncode:
    //                                         item.nchildreportdesigncode.value,
    //                 "nparentreportdesigncode": typeof item.nactionreportdesigncode === "number"? item.nactionreportdesigncode:
    //                                         item.nactionreportdesigncode.value,

    //             });  
    //         })         

    //         const inputParam = {
    //             classUrl: this.props.Login.inputParam.classUrl,
    //             methodUrl: "ReportParameterMapping",
    //             displayName: this.props.Login.inputParam.displayName,
    //             inputData: inputData,
    //             operation: operation, saveType, formRef, dataState:undefined, selectedId
    //         }
    //         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, saveType
    //                     //openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
    //                     ///operation: this.props.Login.operation
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //         else {
    //             this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    //         }
    // }

    // onSaveParameterAction = (saveType, formRef) =>{

    //          let operation = this.props.Login.operation;
    //         let inputData = [];
    //         let selectedId = null;
    //         let data = [];

    //         inputData["userinfo"] = this.props.Login.userInfo;     

    //         this.state.addActionParam.forEach(item => {          
    //             data.push({
    //                 "nreportdetailcode":this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
    //                 "nreportdesigncode": typeof item.nreportdesigncode === "number"? item.nreportdesigncode:
    //                                         item.nreportdesigncode.value,
    //                 "nparentreportdesigncode": typeof item.nparentreportdesigncode === "number"? item.nparentreportdesigncode:
    //                                         item.nparentreportdesigncode.value,

    //             });         

    //         })
    //         inputData["reportparameteraction"] = data;

    //         const inputParam = {
    //             classUrl: this.props.Login.inputParam.classUrl,
    //             methodUrl: "ReportParameterAction",
    //             displayName: this.props.Login.inputParam.displayName,
    //             inputData: inputData,
    //             operation: operation, saveType, formRef, dataState:undefined, selectedId
    //         }
    //         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, saveType
    //                     // openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
    //                     // operation: this.props.Login.operation
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //         else {
    //             this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
    //         }
    // }

    onSaveSubReport = (saveType, formRef) => {
        const reportFile = this.state.selectedRecord.sfilename;

        const formData = new FormData();

        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode"
        };
        const reportdetails = this.props.Login.masterData.SelectedReportDetail;
        const subreportdetails = {
            nreportdetailcode: reportdetails.nreportdetailcode,
            nreportcode: reportdetails.nreportcode
        };

        if (reportFile && Array.isArray(reportFile) && reportFile.length > 0) {

            const splittedFileName = reportFile[0].name.split('.');
            const fileExtension = reportFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.sfilename === "" ?
                this.state.selectedRecord.sfilename : create_UUID() + '.' + fileExtension;

            subreportdetails["sfilename"] = Lims_JSON_stringify(reportFile[0].name.trim(), false);;
            subreportdetails["ssystemfilename"] = uniquefilename;

            formData.append("uploadedFile0", reportFile[0]);
            formData.append("uniquefilename0", uniquefilename);
        }

        formData.append("filecount", 1);
        //formData.append("reportdetails", JSON.stringify(reportdetails));
        formData.append("subreportdetails", JSON.stringify(subreportdetails));
        // formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "SubReportDetails",
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef, isChild: true
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    onSaveReportImage = (saveType, formRef) => {
        const reportFile = this.state.selectedRecord.sfilename;

        const formData = new FormData();

        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode"
        };
        const reportdetails = this.props.Login.masterData.SelectedReportDetail;
        const reportimages = {
            nreportdetailcode: reportdetails.nreportdetailcode,
            nreportcode: reportdetails.nreportcode
        };

        if (reportFile && Array.isArray(reportFile) && reportFile.length > 0) {

            const splittedFileName = reportFile[0].name.split('.');
            const fileExtension = reportFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.sfilename === "" ?
                this.state.selectedRecord.sfilename : create_UUID() + '.' + fileExtension;

            reportimages["sfilename"] = Lims_JSON_stringify(reportFile[0].name.trim(), false);
            reportimages["ssystemfilename"] = uniquefilename;

            formData.append("uploadedFile0", reportFile[0]);
            formData.append("uniquefilename0", uniquefilename);
        }

        formData.append("filecount", 1);
        //formData.append("reportdetails", JSON.stringify(reportdetails));
        formData.append("reportimages", JSON.stringify(reportimages));
        //  formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ReportImages",
            inputData: {
                userinfo: {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef, isChild: true
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }


    onSaveReportValidation = (saveType, formRef) => {

        if (this.state.selectedRecord.ntranscode === undefined) {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${this.props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUS" })}`);
        } else {

            const inputParam = {
                nformcode: this.props.Login.userInfo.nformcode,
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ReportValidation",
                inputData: {
                    userinfo: {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    },
                    nformcode: this.props.Login.masterData.SelectedReportMaster.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelectedReportMaster.ncontrolcode,
                    nreportdetailcode: this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                    ntransctionstatus: this.state.selectedRecord.ntranscode.map(item => item.value).join(",")
                },
                //ntransationstatus:this.state.selectedRecord.ntranscode.map(item => item.ntranscode).join(",") },
                operation: "create",
                saveType, formRef,
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    onSaveReportParameter = (saveType, formRef) => {

        if (this.state.gridDataparmeter.length === 0) {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ADDTHEPARMTERINGERIDTHENSAVE" })}`);

        } else {
            const inputParam = {
                nformcode: this.props.Login.userInfo.nformcode,
                classUrl: this.props.Login.inputParam.classUrl, //"controlbasedreport",
                methodUrl: "ControlBasedReportparametreInsert",
                inputData: {
                    userinfo: {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    },
                    //indexof:
                    ncontrolCode: this.props.Login.userInfo.nformcode,
                    nreportcode: this.props.Login.masterData.SelectedReportMaster.nreportcode,
                    nreportdetailcode: this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                    ncontrolbasedparameter: this.state.gridDataparmeter.map(function (el) { return el.ncontrolBasedparameter; }).join(",") || null, //this.state.selectedRecord.ncontrolBasedparameter.value, 
                    nquerybuildertablecode: this.state.gridDataparmeter.map(function (el) { return el.nquerybuildertablecode; }).join(",") || null, //this.state.selectedRecord.nquerybuildertablecode.value,
                    squerybuildertablecodecolumn: this.state.gridDataparmeter.map(function (el) { return "'" + el.stablecolumn + "'"; }).join(","), //this.state.selectedRecord.nquerybuildertablecodecolumn.label,
                    nreportparameterconfigurationcode: this.props.Login.masterData.ParameterMapping.map(function (el) { return el.nreportparameterconfigurationcode; }).join(",") || null
                },
                operation: "create",
                saveType, formRef,
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }



    deleteFile = (fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = "";
        this.setState({ selectedRecord, actionType: "delete" });
    }

    approveReport = (ncontrolCode) => {
        if (this.props.Login.masterData.SelectedReportDetail) {
            if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTALREADYAPPROVED" }));
            }
            else {

                const postParam = {
                    inputListName: "ReportDetails", selectedObject: "SelectedReportDetail",
                    primaryKeyField: "nreportdetailcode",
                    primaryKeyValue: this.props.Login.masterData.SelectedReportDetail.nreportdetailcode,
                    fetchUrl: "reportconfig/getReportDetail",
                    fecthInputObject: { userinfo: this.props.Login.userInfo },
                };
                let SelectedReportDetail = this.props.Login.masterData.SelectedReportDetail;
                SelectedReportDetail["sfilterreporttypecode"] = this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode.toString();
                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "ReportVersion",
                    inputData: {
                        "userinfo": this.props.Login.userInfo,
                        // "reportdetails": this.props.Login.masterData.SelectedReportDetail
                        "reportdetails": SelectedReportDetail
                    },
                    operation: "approve", postParam, isChild: true
                }

                const masterData = this.props.Login.masterData;

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "IDS_REPORTMASTER", operation: "approve"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openModal");
                }
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_NOVERSIONTOAPPROVE" }));
        }
    }

    deleteValidation = (deleteParam) => {

        if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
            const message = "IDS_CANNOTDELETEFORAPPROVEDREPORT";
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {
            delete deleteParam.selectedRecord.dmodifieddate;
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "ReportValidation",
                inputData: {
                    "reportvalidation": deleteParam.selectedRecord,
                    "userinfo": this.props.Login.userInfo
                },
                operation: "delete", isChild: true
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,
                deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    deleteAttachment = (deleteParam) => {

        if (this.props.Login.masterData.SelectedReportDetail.ntransactionstatus === transactionStatus.APPROVED) {
            const message = "IDS_CANNOTDELETEFORAPPROVEDREPORT";
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {
            const postParam = {
                inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
                primaryKeyField: "nreportcode",
                primaryKeyValue: this.props.Login.masterData.SelectedReportMaster.nreportcode,
                fetchUrl: "reportconfig/getReportDesigner",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: deleteParam.methodUrl,
                inputData: {
                    [deleteParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                    "userinfo": this.props.Login.userInfo
                },
                operation: deleteParam.operation, isChild: true, postParam
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,
                deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

    deleteReport = (deleteParam) => {

        const postParam = {
            inputListName: "ReportMaster", selectedObject: "SelectedReportMaster",
            primaryKeyField: "nreportcode",
            primaryKeyValue: this.props.Login.masterData.SelectedReportMaster.nreportcode,
            fetchUrl: "reportconfig/getReportDesigner",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        };
        let masterToDelete = deleteParam.mastertodelete;
        masterToDelete["sfilterreporttypecode"] = this.props.Login.masterData && this.props.Login.masterData.SelectedFilterReportType && this.props.Login.masterData.SelectedFilterReportType.nreporttypecode.toString();

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: deleteParam.methodUrl,
            inputData: {
                "userinfo": this.props.Login.userInfo,
                // [deleteParam.listName]: deleteParam.mastertodelete
                [deleteParam.listName]: masterToDelete
            },
            operation: deleteParam.operation, postParam,
            isChild: deleteParam.methodUrl === "ReportDetails" ? true : undefined
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,
            deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    updateReportStatus = (methodParam) => {
        const reportmaster = methodParam.mastertoupdate;
        let status = reportmaster.ntransactionstatus;
        if (status === transactionStatus.ACTIVE) {
            status = transactionStatus.DEACTIVE;
        }
        else {
            status = transactionStatus.ACTIVE;
        }
        reportmaster["ntransactionstatus"] = status;
        let postParam = { inputListName: "ReportMaster", selectedObject: "SelectedReportMaster", primaryKeyField: "nreportcode" };

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ReportStatus",
            inputData: {
                "userinfo": this.props.Login.userInfo,
                reportmaster
            },
            operation: methodParam.operation, postParam
        }

        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,
            methodParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: methodParam.screenName, operation: methodParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {

        this.searchRef.current.value = "";
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                nreporttypecode: String(this.props.Login.masterData.SelectedFilterReportType.nreporttypecode)
            },
            classUrl: "reportconfig",
            methodUrl: "ReportDesigner",
            userInfo: this.props.Login.userInfo,
            displayName: "IDS_REPORTDESIGNER"
        };

        this.props.callService(inputParam);

    }

}

export default connect(mapStatetoProps, {
    callService, getReportMasterComboService,
    updateStore, crudMaster, getReportDetailComboService, getSelectedReportMasterDetail,
    getSelectedReportDetail, getConfigReportComboService, getParameterMappingComboService,
    //getActionMappingComboService, 
    getReportRegSubType, validateEsignCredential, validationReportparameter, controlBasedReportparametre, controlBasedReportparametretable,
    //controlBasedReportparametretablecolumn,
    filterTransactionList, getReportSubType, getControlButton, getregtype, getReportRegSubTypeApproveConfigVersion, getReportSampletype, getReportTemplate
})(injectIntl(ReportConfig));

