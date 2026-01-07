import React from 'react'
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Button, Card } from 'react-bootstrap';//Nav, Card, Button
//import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ContentPanel } from '../../components/App.styles';
import { faTrashAlt, faPencilAlt, faCopy, faCheck, faStore, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faPlus, faExpandArrowsAlt, faEye, faInfoCircle, faPencilAlt, faRecycle, faStore,
//      faTrash, faFilePen, faFileCode, faDownload, faFilePdf, faHistory, faFile, faComments,
//       faPaperclip,faCalculator,faSync,faSearch,faTimes,faEnvelope,faSpinner} from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import { constructOptionList, showEsign, getStartOfDay, getEndOfDay, sortData, convertDateValuetoString, rearrangeDateFormat, getControlMap } from '../../components/CommonScript';//showEsign, getControlMap,
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterTransactionList,
    filterColumnData,
    getAuditTrailDetail, getFilterAuditTrailRecords, getFormNameByModule, getExportExcel, ViewAuditDetails, getAuditArchivalHistory
} from '../../actions';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import AuditTrailFilter from './AuditTrailFilter';
import AuditArchival from './AuditArchival';

import TransactionListMaster from '../../components/TransactionListMaster';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import DataGrid from '../../components/data-grid/data-grid.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../product/product.styled';
import { parameterType, transactionStatus } from '../../components/Enumeration';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import SpecificationInfo from '../testgroup/SpecificationInfo';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import AuditArchivalHistory from './AuditArchivalHistory';


class AuditTrail extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        // this.searchAuditRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            group: [{ field: "viewPeriod", dir: "desc" }] //field: "groupDate" , dir: "desc" 
        };

        const dataStateAll = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5
        };

        this.searchFieldList = ["sauditdate"]

        this.state = {
            masterStatus: "",
            sectionDataState: { skip: 0, take: 10 },

            error: "",
            isOpen: false,
            selectedRecord: {},
            //selectedcombo: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,

            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),

            dataResult: [],
            dataState: dataState,
            dataStateAll: dataStateAll,
            qualisModule: [],
            qualisForms: [],
            users: [],
            userRole: [],
            viewTypeAudit: [],
            viewArchivalTypeAudit: [],
            wholeQualisForms: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 30,
            bauditArchival: false,
            selectedRecordCopy: {},
            //Added by L.Subashini on 26/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', resizable: true, collapsible:true }    
            ],
        };
        this.searchRef = React.createRef();
        this.searchAuditRef = React.createRef();

    }

      //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

    dataStateChange = (event) => {
        if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {
            this.setState({
                dataResult: process(this.props.Login.masterData.AuditDetails || [], event.dataState),
                dataStateAll: event.dataState, kendoSkip: event.dataState.skip, kendoTake: event.dataState.skip
            });
        }
        else {
            let data = [];
            if (event.dataState.filter === null && event.dataState.sort === null) {
                let auditdata = (this.props.Login.masterData.AuditDetails &&
                    this.props.Login.masterData.AuditDetails.slice(0,
                        event.dataState.take + event.dataState.skip)) || []
                data = process(auditdata || [], event.dataState)
            } else {

                data = process(this.props.Login.masterData.AuditDetails || [], event.dataState)

            }
            this.setState({
                dataResult: data,
                dataState: event.dataState,
            });
        }
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    pageChange = (event) => {
        this.setState({
            kendoSkip: event.page.skip,
            kendoTake: event.page.take
        })
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
        return null;
    }


    exportExcelNew = () => {
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        // const csvfields=[];
        let dataField = {};
        [...this.extractedColumnList].map((item) => {

            dataField[item.dataField] = this.props.intl.formatMessage({ id: item.idsName })


        })

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            viewArchivaltypecode: this.state.selectedRecord["nauditarchivaltypecode"] ? this.state.selectedRecord["nauditarchivaltypecode"].value : 0,
            userinfo: this.props.Login.userInfo,
            sauditdate: this.props.Login.masterData.SelectedAuditTrail.saudittraildate,
            nauditformcode: 78,
            ncontrolcode: 78,
            dataField

        }

        let inputParam = { inputData }
        this.props.getExportExcel(inputParam);
        // if(this.props.Login.resultStatus === "Success"){
        //     toast.info("Excel export successfully");
        // }
    }

    render() {
        //const ViewAuditDetails = props.controlMap.has("ViewAuditDetails") && props.controlMap.get("ViewAuditDetails").ncontrolcode;
        const ViewAuditDetails = this.state.controlMap.has("ViewAuditDetails") && this.state.controlMap.get("ViewAuditDetails").ncontrolcode;
        const auditarchivalid = this.state.controlMap.has("AuditArchival") && this.state.controlMap.get("AuditArchival").ncontrolcode;
        const archivalHistoryId = this.state.controlMap.has("AuditArchivalHistory") && this.state.controlMap.get("AuditArchivalHistory").ncontrolcode;
        this.props.Login.masterData.AuditDetails = this.props.Login.masterData.AuditDetails &&
            sortData(this.props.Login.masterData.AuditDetails, "descending", "nauditcode")
        const archivalHistoryParam = {};
        const mandatoryFields = [{ "idsName": "IDS_COMMENTS", "dataField": "scomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ];

        const archivalhistoryParam = {
            screenName: "IDS_AUDITARCHIVALHISTORY", operation: "view", primaryKeyName: "nauditarchivalcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: archivalHistoryId, inputListName: "AuditArchivalHistory", selectedObject: "SelectedAuditArchival"
        };
        this.feildsForGrid =
            this.props.Login.needOldValueColumn ? [
                { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
                { "idsName": "IDS_OLDVALUE", "dataField": "soldvalue", "width": "100px" },
                { "idsName": "IDS_NEWVALUE", "dataField": "snewvalue", "width": "100px" }] :
                [
                    { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
                    { "idsName": "IDS_NEWVALUE", "dataField": "snewvalue", "width": "100px" }
                ];
        this.extractedColumnList = [
            { "idsName": "IDS_AUDITDATE", "dataField": "sauditdate", "width": "200px", "componentName": "date" },
            { "idsName": "IDS_AUDITACTION", "dataField": "sauditaction", "width": "200px" },
            //  { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "350px" },
            { "idsName": "IDS_NEWCOMMENTS", "dataField": "scomments", "width": "350px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
            { "idsName": "IDS_ACTIONTYPE", "dataField": "sactiontype", "width": "200px" },
            { "idsName": "IDS_MODULENAME", "dataField": "smodulename", "width": "200px" },
            { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_REASON", "dataField": "spredefinedreason", "width": "200px" },
            { "idsName": "IDS_ESIGNCOMMENTS", "dataField": "sreason", "width": "200px" },
            { "idsName": "IDS_USERIPADDRESS", "dataField": "suseripaddress", "width": "200px" },


        ]

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        }

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
            this.props.Login.masterData.ToDate,
            this.props.Login.userInfo);

        let auditParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            // fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
            // toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
            // moduleCode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            // formCode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            // userCode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            // userRole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            // viewTypeCode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0

            skip: this.state.skip,
            take: this.state.take,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            moduleCode: this.props.Login.masterData.breadCrumbModule ? this.props.Login.masterData.breadCrumbModule.value : 0,
            formCode: this.props.Login.masterData.breadCrumbForm ? this.props.Login.masterData.breadCrumbForm.value : 0,
            userCode: this.props.Login.masterData.breadCrumbUser ? this.props.Login.masterData.breadCrumbUser.value : 0,
            userRole: this.props.Login.masterData.breadCrumbRole ? this.props.Login.masterData.breadCrumbRole.value : 0,
            viewTypeCode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode : 0,
            viewArchivalTypeCode: this.props.Login.masterData.breadCrumbViewArchivalType ? this.props.Login.masterData.breadCrumbViewArchivalType.value :
                this.props.Login.masterData.ViewArchivalType ? this.props.Login.masterData.ViewArchivalType.nauditarchivaltypecode : 0
            //viewTypeCode :this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode:0
        }

        this.filterParam = {
            inputListName: "AuditTrail", selectedObject: "SelectedAuditTrail", primaryKeyField: "saudittraildate",
            fetchUrl: "audittrail/getAuditTrailDetail", masterData: this.props.Login.masterData,

            fecthInputObject: {
                // fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
                // toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
                // modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
                // formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
                // usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
                // userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
                // viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,

                userinfo: this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                modulecode: this.props.Login.masterData.breadCrumbModule ? this.props.Login.masterData.breadCrumbModule.value : 0,
                formcode: this.props.Login.masterData.breadCrumbForm ? this.props.Login.masterData.breadCrumbForm.value : 0,
                usercode: this.props.Login.masterData.breadCrumbUser ? this.props.Login.masterData.breadCrumbUser.value : 0,
                userrole: this.props.Login.masterData.breadCrumbRole ? this.props.Login.masterData.breadCrumbRole.value : 0,
                viewtypecode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                    this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode : 0,
                viewArchivalTypeCode: this.props.Login.masterData.breadCrumbViewArchivalType && this.props.Login.masterData.breadCrumbViewArchivalType ? this.props.Login.masterData.breadCrumbViewArchivalType.value :
                    this.props.Login.masterData.ViewArchivalType && this.props.Login.masterData.ViewArchivalType ? this.props.Login.masterData.ViewArchivalType.nauditarchivaltypecode : 1

            },
            filteredListName: "searchedAudit",
            clearFilter: "no",
            updatedListname: "SelectedAuditTrail",
            searchRef: this.searchAuditRef,
            searchFieldList: this.searchFieldList,
            unchangeList: ["QualisModule", "QualisForms", "Users", "UserRole", "ViewTypeAudit", "ViewArchivalTypeAudit"],
            changeList: ["AuditDetails"]

        };

        this.breadCrumbData = this.breadcrumbList();
        //console.log('-->123 :', this.props.Login.masterData.AuditTrail)


        // this.state.selectedRecord && this.state.selectedRecord["nmodulecode"] &&
        // {
        //     "label": "IDS_MODULENAME",
        //     "value": this.state.selectedRecord["nmodulecode"].label 
        // }
        // this.state.selectedRecord["nformcode"] &&
        //  {
        //     "label": "IDS_FORMNAME",
        //     "value": this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].label : ""
        // }, 
        // this.state.selectedRecord["nusercode"] &&
        // {
        //     "label": "IDS_USERNAME",
        //     "value": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].label : ""
        // }, 
        // this.state.selectedRecord["nuserrolecode"] &&
        // {
        //     "label": "IDS_USERROLE",
        //     "value": this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].label : ""

        // }
        // ]

        // let auditInputData = {
        //     fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
        //     toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
        //     modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
        //     formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
        //     usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
        //     userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
        //     viewtypecode: this.state.selectedcombo["nauditactionfiltercode"] ? this.state.selectedcombo["nauditactionfiltercode"].value : 0,
        //     userinfo: this.props.Login.userInfo
        // }

        this.postParamList = [
            {
                filteredListName: "searchedAudit",
                clearFilter: "no",
                searchRef: this.searchRef,
                primaryKeyField: "saudittraildate",
                fetchUrl: "audittrail/getFilterAuditTrailRecords",
                fecthInputObject: this.filterParam,
                //childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" }],
                selectedObject: "SelectedAuditTrail",
                inputListName: "AuditTrail",
                updatedListname: "SelectedAuditTrail",
                unchangeList: ["QualisModule", "QualisForms", "Users", "UserRole", "ViewTypeAudit", "ViewArchivalTypeAudit"]
            }];
        const auditInfoFields = [{ "fieldName": "sauditaction", "label": "IDS_AUDITACTION" },
        { "fieldName": "sformname", "label": "IDS_SCREEN" },
        { "fieldName": "smodulename", "label": "IDS_MODULENAME" },
        { "fieldName": "sauditdate", "label": "IDS_AUDITDATE" },
        { "fieldName": "suserrolename", "label": "IDS_USERROLENAME" },
        { "fieldName": "susername", "label": "IDS_USERNAME" },
        { "fieldName": "sdeputyuserrolename", "label": "IDS_DEPUTYUSERROLENAME" },
        { "fieldName": "sdeputyusername", "label": "IDS_DEPUTYUSERNAME" },
        { "fieldName": "slanguagename", "label": "IDS_LANGUAGE" },
        { "fieldName": "suseripaddress", "label": "IDS_USERIPADDRESS" }];
        return (
            <>
                <div className="mtop-fixed-breadcrumb client-listing-wrap">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters>
                        {/* //ref={(parentHeight) => { this.parentHeight = parentHeight }} */}
                        <Col md={12} className="parent-port-height sticky_head_parent" >
                            {/* <SplitterLayout borderColor="#999"
                                primaryIndex={1}
                                percentage={true}
                                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                onSecondaryPaneSizeChange={this.paneSizeChange}
                                primaryMinSize={40}
                                secondaryMinSize={20}
                            > */}
                              <Splitter className='layout-splitter' orientation="horizontal"
                                       panes={this.state.panes} onChange={this.onSplitterChange}>
                                     <SplitterPane size="30%" min="20%">
                                    {/* <Col md={3}> */}
                                    <TransactionListMaster
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        //paneHeight={this.state.parentHeight}
                                        // masterList={this.props.Login.masterData.searchedAudit || 
                                        //     this.props.Login.masterData.AuditTrail ? sortData(this.props.Login.masterData.AuditTrail,'descending','saudittraildate') : []}
                                        // masterList={this.props.Login.masterData.searchedAudit ? this.props.Login.masterData.searchedAudit :
                                        //   this.props.Login.masterData.AuditTrail ? sortData(this.props.Login.masterData.AuditTrail, 'descending', 'saudittraildate') : []}

                                        masterList={this.props.Login.masterData.searchedAudit ||
                                            (this.props.Login.masterData.AuditTrail || [])}
                                        selectedMaster={[this.props.Login.masterData.SelectedAuditTrail]}
                                        primaryKeyField="saudittraildate"
                                        getMasterDetail={this.props.getAuditTrailDetail}
                                        inputParam={auditParam}
                                        //additionalParam={['napprovalversioncode']}
                                        mainField="sauditdate"
                                        selectedListName="SelectedAuditTrail"
                                        filterColumnData={this.props.filterTransactionList}
                                        searchListName="searchedAudit"
                                        searchRef={this.searchRef}
                                        filterParam={this.filterParam}
                                        objectName="auditrail"
                                        listName="IDS_AUDITTRAIL"
                                        showFilter={this.props.Login.showFilter}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        // needAccordianFilter={true}
                                        handlePageChange={this.handlePageChange}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        needFilter={true}
                                        needAccordianFilter={false}
                                        filterComponent={[
                                            {
                                                "IDS_AUDITTRAIL":
                                                    <AuditTrailFilter
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        filterModuleName={this.state.qualisModule}
                                                        filterFormName={this.state.qualisForms}
                                                        filterViewType={this.state.viewTypeAudit}
                                                        filterViewArchivalType={this.state.viewArchivalTypeAudit}
                                                        filterUsers={this.state.users}
                                                        filterUserRole={this.state.userRole}
                                                        handleDateChange={this.handleDateChange}
                                                        fromDate={fromDate}
                                                        toDate={toDate}
                                                        userInfo={this.props.Login.userInfo}
                                                        onComboChange={this.onComboChange}
                                                    />
                                            }
                                        ]}
                                        // accordianfilterComponent={[
                                        //     {
                                        //         "IDS_AUDITTRAIL":
                                        //             <ViewTypeFilter
                                        //                 selectedRecord={this.state.selectedcombo || {}}
                                        //                 filterViewType={this.state.viewTypeAudit}
                                        //                 userInfo={this.props.Login.userInfo}
                                        //                 onComboChange={this.onComboChange}
                                        //             />
                                        //     }
                                        // ]}
                                        commonActions={
                                            <ProductList className="d-flex product-category float-right">
                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    onClick={() => this.onReload()}
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                    <RefreshIcon className='custom_icons' />
                                                </Button>

                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    //onClick={() => this.onReload()}
                                                    hidden={this.state.userRoleControlRights.indexOf(auditarchivalid) === -1}
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_AUDITARCHIVAL" })}
                                                    onClick={() => this.AuditArchival(auditarchivalid)}>

                                                    {/* <RefreshIcon className='custom_icons'/> */}
                                                    <FontAwesomeIcon icon={faStore} />
                                                    {/* hidden={this.state.userRoleControlRights.indexOf(auditarchivalid) === -1} */}

                                                </Button>
                                                <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_AUDITARCHIVALHISTORY" })}
                                                    onClick={() => this.props.getAuditArchivalHistory(archivalhistoryParam)}>
                                                    <FontAwesomeIcon icon={faHistory} />
                                                </Button>
                                                {/* </Tooltip> */}
                                            </ProductList>

                                        }
                                    />
                                    </SplitterPane>
                                    <SplitterPane>
                                        {/* <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400} customClassName="fixed_list_height"> */}
                                        {/* <Col md={9}> */}
                                        <PerfectScrollbar>
                                            <div ref={this.myRef}>
                                                {this.props.Login.masterData.SelectedAuditTrail && this.props.Login.masterData.SelectedAuditTrail !== undefined ?
                                                    <ContentPanel className="panel-main-content">
                                                        <Card className="border-0">
                                                            <Card.Header className="padding-class">
                                                                {/* * <Card.Title className="product-title-main">
                                                                {this.props.Login.masterData.SelectedAuditTrail.sauditdate}
                                                                    <div className="d-flex product-category" style={{ float: "right",marginRight:"1rem" }}>
                                                                    
                                                                    
                                                                    </div>
                                                            </Card.Title>  */}

                                                                {/* <Card.Subtitle>
                                                                    <div className="d-flex product-category">
                                                                    <h2 className="product-title-sub flex-grow-1">
                                                                    </h2>
                                                                    <div className="d-inline">
                                                                    <Nav.Link className="btn btn-circle outline-grey mr-2" name="editmethodname"
                                                                    // hidden={this.state.userRoleControlRights.indexOf(archivalHistoryId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_AUDITARCHIVALHISTORY" })}
                                                                onClick={() => this.props.getAuditArchivalHistory(archivalhistoryParam)}>
                                                                    <FontAwesomeIcon icon={faHistory} />
                                                                    </Nav.Link>
                                                                    </div>
                                                                    </div>
                                                                </Card.Subtitle> */}
                                                            </Card.Header>


                                                            <Card.Body className='form-static-wrap padding-class audit-height'>
                                                                <DataGrid
                                                                    // gridWidth={"57.5rem"}
                                                                    selectedId={this.props.Login.selectedId}
                                                                    // height set 0 so comment below code thenmozhi
                                                                    //gridHeight={this.state.gridHeight + 'px'}
                                                                     gridHeight={"87vh"}
                                                                    expandField="expanded"
                                                                    userRoleControlRights={this.state.userRoleControlRights && this.state.userRoleControlRights}
                                                                    pageable={true}
                                                                    pageSizes={this.props.Login.settings && this.props.Login.settings[17].split(",").map(setting => parseInt(setting))}
                                                                    scrollable={"scrollable"}
                                                                    primaryKeyField="nauditcode"
                                                                    data={this.props.Login.masterData.AuditDetails || []}
                                                                    dataResult={this.state.dataResult}
                                                                    //total={this.props.Login.masterData.AuditDetails && this.props.Login.masterData.AuditDetails.length || 0}
                                                                    //  dataResult={process(this.props.Login.masterData.AuditDetails || [],
                                                                    //  this.state.selectedRecord["nauditactionfiltercode"]
                                                                    //     && this.state.selectedRecord["nauditactionfiltercode"].value === 1
                                                                    //   ? this.state.dataStateAll : this.state.dataState)}
                                                                    dataState={this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                                                                        : this.state.dataState}
                                                                    dataStateChange={this.dataStateChange}
                                                                    extractedColumnList={this.extractedColumnList || []}
                                                                    controlMap={this.state.controlMap}
                                                                    methodUrl="AuditTrail"
                                                                    groupable={this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? true : false : false}
                                                                    //isActionRequired={false}
                                                                    isToolBarRequired={true}
                                                                    isAddRequired={false}
                                                                    isRefreshRequired={false}
                                                                    is
                                                                    isDownloadPDFRequired={false}
                                                                    isDownloadExcelRequired={true}
                                                                    isExportExcelRequired={false}
                                                                    isIdsField="yes"
                                                                    isActionRequired={true}
                                                                    actionIcons={[{
                                                                        title: this.props.intl.formatMessage({ id: "IDS_VIEWCHANGES" }),
                                                                        controlname: "faEye",
                                                                        objectName: "AuditDetails",
                                                                        hidden: this.state.userRoleControlRights.indexOf(ViewAuditDetails) === -1,
                                                                        onClick: (viewdetails) => this.ViewAuditDetails(viewdetails)
                                                                    }]}
                                                                    exportExcelNew={this.exportExcelNew}
                                                                    onExpandChange={this.expandChange}
                                                                    hideDetailBand={true}
                                                                />
                                                            </Card.Body>
                                                        </Card>
                                                    </ContentPanel>

                                                    : ""
                                                }
                                            </div>
                                        </PerfectScrollbar>
                                    </SplitterPane>
                                </Splitter>
                            {/* </SplitterLayout> */}
                            {/* </SplitterLayout> */}
                        </Col>
                    </Row>
                </div>
                {
                    //this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.bauditArchival ? true : this.props.Login.viewArchivalHistory ? true : this.props.Login.openModal ? this.props.Login.openModal : this.props.Login.loadEsign ? this.props.Login.loadEsign : false}
                        closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.bauditArchival ? 'IDS_AUDITARCHIVAL' : this.props.Login.viewArchivalHistory ? 'IDS_AUDITARCHIVALHISTORY' : 'IDS_MODIFIEDCOMMENTS'}
                        onSaveClick={this.onSaveClick}
                        hideSave={this.props.Login.bauditArchival || this.props.Login.loadEsign ? false : true}
                        mandatoryFields={mandatoryFields || []}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.Login.bauditArchival ?
                                <AuditArchival
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    operation={this.props.Login.operation}
                                    userInfo={this.props.Login.userInfo}
                                    inputParam={this.props.Login.inputParam}
                                    sfromdate={this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate}
                                    stodate={this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo}
                                />
                                :
                                this.props.Login.viewArchivalHistory ?
                                    <AuditArchivalHistory
                                        selectedRecord={this.state.selectedRecord || {}}
                                        auditArchivalHistory={this.props.Login.auditArchivalHistory || []}
                                        operation={this.props.Login.operation}
                                        userInfo={this.props.Login.userInfo}
                                        inputParam={this.props.Login.inputParam}
                                        dataState={this.state.dataState}
                                        dataStateAll={this.state.dataStateAll}
                                        dataStateChange={this.dataStateChange}

                                    />
                                    :
                                    <>

                                        <Card className='one' >
                                            <Card.Body>
                                                <SpecificationInfo
                                                    controlMap={this.state.controlMap}
                                                    auditInfoFields={auditInfoFields}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    selectedSpecification={this.props.Login.viewdetails}
                                                    userInfo={this.props.Login.userInfo}
                                                    selectedNode={this.props.Login.masterData.selectedNode}
                                                    selectedRecord={this.state.filterData}
                                                    approvalRoleActionDetail={this.props.Login.masterData.ApprovalRoleActionDetail}
                                                    screenName="IDS_SPECIFICATIONINFO"
                                                    deleteRecord={this.deleteRecord}
                                                    addSpecification={this.props.addSpecification}
                                                    filterData={this.state.filterData}
                                                    //completeSpecification={this.completeSpecification}
                                                    completeSpecification={this.validateTestGroupComplete}
                                                    approveSpecification={this.approveSpecification}
                                                    specificationReport={this.specificationReport}
                                                    retireSpec={this.retireSpec}
                                                />
                                            </Card.Body>
                                        </Card>
                                        <br></br>

                                        <DataGrid
                                            primaryKeyField="nauditcommentscode"
                                            detailedFieldList={this.feildsForGrid}
                                            extractedColumnList={this.feildsForGrid}
                                            dataResult={this.props.Login.masterData["AuditModifiedComments"] && this.props.Login.masterData["AuditModifiedComments"].length > 0
                                                && process(this.props.Login.masterData["AuditModifiedComments"],
                                                    (this.props.screenName === undefined || this.props.screenName === "IDS_AUDITVIEWDETAILS")
                                                        ? this.props.Login.sectionDataState ? this.props.Login.sectionDataState : { skip: 0, take: 50 } : { skip: 0, take: 50 })}
                                            dataState={(this.props.Login.screenName === undefined || this.props.Login.screenName === "IDS_AUDITVIEWDETAILS")
                                                ? this.props.Login.sectionDataState ? this.props.Login.sectionDataState : { skip: 0, take: 50 } : { skip: 0, take: 50 }}
                                            dataStateChange={(event) => this.dataStateAuditView(event)}
                                            controlMap={this.state.controlMap}
                                            userRoleControlRights={this.state.userRoleControlRights}
                                            pageable={true}
                                            pageSizes={this.props.Login.settings && this.props.Login.settings[17].split(",").map(setting => parseInt(setting))} scrollable={'scrollable'}
                                            gridHeight={'600px'}
                                            hideColumnFilter={true}
                                            selectedId={0}
                                        >
                                        </DataGrid>
                                    </>
                        }
                    />



                }
            </>

        );

    }

    AuditArchival = (auditArchivalID) => {
        if (this.state.selectedRecord["nauditarchivaltypecode"] &&
            this.state.selectedRecord["nauditarchivaltypecode"].value === 1) {
            let bauditArchival = true;
            //let openModal = this.props.Login.openModal;
            //this.setState({bauditArchival});
            let ncontrolCode = this.state.controlMap.has("AuditArchival") && this.state.controlMap.get("AuditArchival").ncontrolcode;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { ncontrolCode, bauditArchival, sectionDataState: { skip: 0, take: 50 }, selectedId: null }
            }
            //this.setState({bauditArchival});
            this.props.updateStore(updateInfo);
        }
        else {
            toast.info("Please select Record Type Local");
        }
    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};

        selectedRecord[event.target.name] = event.target.value;


        this.setState({ selectedRecord });
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
    closeModal = () => {
        let openModal = this.props.Login.openModal;
        openModal = false;
        let viewArchivalHistory = this.props.Login.viewArchivalHistory;
        viewArchivalHistory = false;
        let loadEsign = this.props.Login.loadEsign;
        let selectedRecord = this.state.selectedRecord;
        //let bauditArchival=this.state.bauditArchival;
        let bauditArchival = this.props.Login.bauditArchival;
        bauditArchival = false;
        if (this.props.Login.loadEsign) {

            loadEsign = false;
            selectedRecord['esignpassword'] = ""
            selectedRecord['esigncomments'] = ""
            selectedRecord['esignreason'] = ""

            bauditArchival = true;

        }

        //let selectedId = this.props.Login.selectedId;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { loadEsign, bauditArchival, viewArchivalHistory, openModal, sectionDataState: { skip: 0, take: 50 }, selectedId: null }
        }
        //this.setState({bauditArchival});
        this.setState({ selectedRecord });
        this.props.updateStore(updateInfo);

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
    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData = { postParamList: this.filterParam };
        //inputData={selectedRecord: {...this.state.selectedRecord}};
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        inputData["auditarchival"] = {};

        let breadCrumbFrom = this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let breadCrumbTo = this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let breadCrumbModule = this.state.selectedRecord['nmodulecode']
        let breadCrumbForm = this.state.selectedRecord['nformcode']
        let breadCrumbUser = this.state.selectedRecord['nusercode']
        let breadCrumbRole = this.state.selectedRecord['nuserrolecode']
        let breadCrumbViewType = this.state.selectedRecord['nauditactionfiltercode']

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbModule, breadCrumbForm, breadCrumbUser, breadCrumbRole, breadCrumbViewType
        }
        let fromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate;
        let toDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);

        inputData["auditarchival"]["sfromdate"] = obj.fromDate;
        inputData["auditarchival"]["stodate"] = obj.toDate;
        inputData["auditarchival"]["smodulename"] = this.state.selectedRecord["nmodulecode"] && this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].label : "";
        inputData["auditarchival"]["sformname"] = this.state.selectedRecord["nformcode"] && this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].label : "";
        inputData["auditarchival"]["susername"] = this.state.selectedRecord["nusercode"] && this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].label : "";
        inputData["auditarchival"]["suserrolename"] = this.state.selectedRecord["nuserrolecode"] && this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].label : "";
        inputData["auditarchival"]["nviewperiod"] = this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : -1
        inputData["auditarchival"]["scomments"] = this.state.selectedRecord["scomments"] ? this.state.selectedRecord["scomments"] : "";
        inputData["auditarchival"]["nmodulecode"] = this.state.selectedRecord["nmodulecode"] && this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0;
        inputData["auditarchival"]["nformcode"] = this.state.selectedRecord["nformcode"] && this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0;
        inputData["auditarchival"]["nusercode"] = this.state.selectedRecord["nusercode"] && this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0;
        inputData["auditarchival"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"] && this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0;
        inputData["auditarchival"]["sauditdate"] = this.props.Login.masterData.SelectedAuditTrail.sauditdate;
        inputData["auditarchival"]["nauditarchivaltypecode"] = this.state.selectedRecord["nauditarchivaltypecode"] ? this.state.selectedRecord["nauditarchivaltypecode"].value : -1



        let postParam = undefined;

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "AuditArchival",//this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.screenName,
            inputData: inputData, selectedId, dataState,
            operation: "create", saveType, formRef,
            searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord },

            masterData, inputData, searchRef: this.searchRef,
            detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip
        }



        // const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        // if (esignNeeded){
        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: {
        //             loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
        //             openModal:true, screenName: this.props.Login.screenName && this.props.intl.formatMessage({ id:this.props.Login.screenName}),
        //             operation:this.props.Login.operation
        //             }
        //         }
        //     this.props.updateStore(updateInfo);
        // }
        // else{

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: false, bauditArchival: false, screenName: this.props.Login.screenName && this.props.intl.formatMessage({ id: this.props.Login.screenName }),
                    operation: "AuditArchival",
                    saveType
                }
            }
            this.props.updateStore(updateInfo);
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "bauditArchival","","","");
            // let bauditArchival = false;
            // let selectedRecordCopy = this.state.selectedRecord;
            // this.setState({ bauditArchival, selectedRecordCopy });
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "bauditArchival", "", "", "");
            //this.onReload();
            // let bauditArchival = false;
            // let selectedRecordCopy = this.state.selectedRecord;
            // this.setState({ bauditArchival, selectedRecordCopy });
        }
        let bauditArchival = false;
            let selectedRecordCopy = this.state.selectedRecord;
            this.setState({ bauditArchival, selectedRecordCopy });
        //}

    }

    dataStateAuditView = (event) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { sectionDataState: event.dataState }
        }

        this.props.updateStore(updateInfo);
    }

    ViewAuditDetails = (viewdetails) => {
        //console.log('ewe', viewdetails)
        let openModal = this.props.Login.openModal;
        openModal = true;
        let screenName = 'IDS_AUDITVIEWDETAILS'
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { openModal, screenName }
        // }
        this.props.ViewAuditDetails(this.props.Login.masterData, this.props.Login.userInfo, viewdetails, screenName);
    };
    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.setState({
            dataResult: process(this.props.Login.masterData.AuditDetails || [], this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll :
                this.state.dataState),
            dataState: this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                : this.state.dataState,
        });
    };
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        //setTimeout(() => { this._scrollBarRef.updateScroll() })
    };


    onReload = () => {

        // let dFromDate = this.props.Login.masterData.breadCrumbFrom ? (this.props.Login.masterData.breadCrumbFrom) : this.props.Login.masterData.FromDate;
        // let dToDate = this.props.Login.masterData.breadCrumbTo ? (this.props.Login.masterData.breadCrumbTo) : this.props.Login.masterData.ToDate;
        //var dTempFromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate;
        //let dTempToDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate;
        //let temp = dFromDate.indexOf('-');
        // let fromMonth = (dTempFromDate.getMonth()+1);
        // let toMonth = (dTempToDate.getMonth()+1);
        // let fromMonth = String(new Date(dFromDate).getMonth() + 1)
        // let toMonth = String(new Date(dToDate).getMonth() + 1)
        // let fromYear = dFromDate.substring(0, 4);
        // let toYear = dToDate.substring(0, 4);
        // let ntempviewtypecode = 0;
        let breadCrumbFrom = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.props.Login.masterData.breadCrumbFrom;
        let breadCrumbTo = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo;
        let breadCrumbModule = this.props.Login.masterData.breadCrumbModule
        let breadCrumbForm = this.props.Login.masterData.breadCrumbForm
        let breadCrumbUser = this.props.Login.masterData.breadCrumbUser
        let breadCrumbRole = this.props.Login.masterData.breadCrumbRole
        let breadCrumbViewType = this.props.Login.masterData.breadCrumbViewType
            ? this.props.Login.masterData.breadCrumbViewType : this.props.Login.ViewType;
        let breadCrumbViewArchivalType = this.props.Login.masterData.breadCrumbViewArchivalType
            ? this.props.Login.masterData.breadCrumbViewArchivalType : this.props.Login.ViewArchivalType;


        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: breadCrumbModule ? breadCrumbModule.value : 0,
            formcode: breadCrumbForm ? breadCrumbForm.value : 0,
            usercode: breadCrumbUser ? breadCrumbUser.value : 0,
            userrole: breadCrumbRole ? breadCrumbRole.value : 0,
            viewtypecode: breadCrumbViewType ? breadCrumbViewType.value
                : this.props.Login.masterData.ViewType.nauditactionfiltercode,
            viewarchivaltypecode: breadCrumbViewArchivalType ? breadCrumbViewArchivalType.value
                : this.props.Login.masterData.ViewArchivalType.nauditarchivaltypecode,

            // viewtypecode : this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.nauditactionfiltercode :0,
            // viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbModule,
            breadCrumbForm, breadCrumbUser, breadCrumbRole,
            //breadCrumbViewType : breadCrumbViewType ? breadCrumbViewType :
            // this.props.Login.masterData.ViewType
            breadCrumbViewType: breadCrumbViewType ? breadCrumbViewType
                : {
                    label: this.props.Login.masterData.ViewType.sauditactionfiltername,
                    value: this.props.Login.masterData.ViewType.nauditactionfiltercode,
                    item: this.props.Login.masterData.ViewType
                },
            breadCrumbViewArchivalType: breadCrumbViewArchivalType ? breadCrumbViewArchivalType
                : {
                    label: this.props.Login.masterData.ViewArchivalType.sauditarchivaltypename,
                    value: this.props.Login.masterData.ViewArchivalType.nauditarchivaltypecode,
                    item: this.props.Login.masterData.ViewArchivalType
                }
        }


        let inputParam = { masterData, inputData, searchRef: this.searchRef, detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip }
        this.props.getFilterAuditTrailRecords(inputParam)
    }

    onFilterSubmit = () => {

        let breadCrumbFrom = this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let breadCrumbTo = this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let breadCrumbModule = this.state.selectedRecord['nmodulecode']
        let breadCrumbForm = this.state.selectedRecord['nformcode']
        let breadCrumbUser = this.state.selectedRecord['nusercode']
        let breadCrumbRole = this.state.selectedRecord['nuserrolecode']
        let breadCrumbViewType = this.state.selectedRecord['nauditactionfiltercode']
        let breadCrumbViewArchivalType = this.state.selectedRecord['nauditarchivaltypecode']

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbModule, breadCrumbForm, breadCrumbUser, breadCrumbRole, breadCrumbViewType, breadCrumbViewArchivalType
        }
        let fromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate;
        let toDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
            formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
            usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
            userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
            //viewtypecode: ntempviewtypecode,//this.state.selectedcombo["nviewtypecode"] ? this.state.selectedcombo["nviewtypecode"].value:0,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : -1,
            viewarchivaltypecode: this.state.selectedRecord["nauditarchivaltypecode"] ? this.state.selectedRecord["nauditarchivaltypecode"].value : -1,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }

        let inputParam = {
            masterData, inputData, searchRef: this.searchRef,
            detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip
        }
        this.props.getFilterAuditTrailRecords(inputParam)
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        if (comboData != null) {
            if (fieldName === "nmodulecode" || fieldName === "nformcode"
                || fieldName === "nusercode" || fieldName === "nuserrolecode" || fieldName === "nauditactionfiltercode"
                || fieldName === 'nauditarchivaltypecode') {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;
                // let qualisForms = this.state.qualisForms;
                let qualisForms = this.state.wholeQualisForms;
                if (fieldName === "nmodulecode") {

                    selectedRecord["nformcode"] = "";
                    qualisForms = qualisForms.filter(form => form.item.nmodulecode === comboData.value);

                } else if (selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {

                    qualisForms = qualisForms.filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);

                }
                this.setState({ selectedRecord, qualisForms });
            }



            /*if (fieldName === "nauditactionfiltercode") {
 
                this.searchRef.current.value = "";
 
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;
                const dataStateAll = {
                    skip: 0,
                    take: 100
                };
 
                this.setState({ selectedcombo, dataStateAll });
 
                let masterData = {
                    ...this.props.Login.masterData, searchedAudit: undefined
                }
                let inputData = {
                    fromDate: this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : this.props.Login.masterData.FromDate,
                    toDate: this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : this.props.Login.masterData.ToDate,
                    modulecode: this.state.selectedRecord["nmodulecode"] ? this.state.selectedRecord["nmodulecode"].value : 0,
                    formcode: this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].value : 0,
                    usercode: this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : 0,
                    userrole: this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : 0,
                    viewtypecode: this.state.selectedcombo["nauditactionfiltercode"] ? this.state.selectedcombo["nauditactionfiltercode"].value : 0,
                    userinfo: this.props.Login.userInfo,
                    postParamList: this.filterParam,
                }
 
                let inputParam = { masterData, inputData }
                this.props.getFilterAuditTrailRecords(inputParam)
            }*/

        }
        else {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            if (fieldName === 'nmodulecode') {
                selectedRecord["nformcode"] = "";
                const qualisForms = this.state.wholeQualisForms;
                this.setState({ selectedRecord, qualisForms });
            }
            else
                this.setState({ selectedRecord });
        }

    }

    handleDateChange = (dateName, dateValue) => {
        let selectedRecord = this.state.selectedRecord;
        selectedRecord[dateName] = dateValue;


        //this.setState({selectedRecord});

        let viewTypeAuditList = this.state.viewTypeAudit;

        let dFromDate = this.state.selectedRecord["fromdate"] ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let dToDate = this.state.selectedRecord["todate"] ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        // let ntempviewtypecode = 0;
        let fromMonth = String(dFromDate.getMonth() + 1)
        let toMonth = String(dToDate.getMonth() + 1)
        let fromYear = String(dFromDate.getFullYear());
        let toYear = String(dToDate.getFullYear());

        if (fromYear !== toYear) {

            selectedRecord["nauditactionfiltercode"] =
                viewTypeAuditList.length > 0 ? {
                    "value": viewTypeAuditList[2].item.nauditactionfiltercode,
                    "label": viewTypeAuditList[2].item.sauditactionfiltername
                } : this.state.selectedRecord["nauditactionfiltercode"]

            // ntempviewtypecode = viewTypeAuditList[2].item.nauditactionfiltercode;
        }
        else if (fromMonth !== toMonth) {
            selectedRecord["nauditactionfiltercode"] = viewTypeAuditList.length > 0 ? {
                "value": viewTypeAuditList[1].item.nauditactionfiltercode,
                "label": viewTypeAuditList[1].item.sauditactionfiltername
            } : this.state.selectedRecord["nauditactionfiltercode"]


            // ntempviewtypecode = viewTypeAuditList[1].item.nauditactionfiltercode;
        }
        else {
            selectedRecord["nauditactionfiltercode"] = viewTypeAuditList.length > 0 ? {
                "value": viewTypeAuditList[0].item.nauditactionfiltercode,
                "label": viewTypeAuditList[0].item.sauditactionfiltername
            } : this.state.selectedRecord["nauditactionfiltercode"]

            // ntempviewtypecode = viewTypeAuditList[0].item.nauditactionfiltercode;
        }

        this.setState({ selectedRecord });
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

    breadcrumbList = () => {
        let breadCrumbArray = [];
        // let fromDate = this.props.Login.masterData.breadCrumbFrom ? this.props.Login.masterData.breadCrumbFrom : this.props.Login.masterData.FromDate;
        //    let toDate = this.props.Login.masterData.breadCrumbTo ? this.props.Login.masterData.breadCrumbTo : this.props.Login.masterData.ToDate;

        let fromDate = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.props.Login.masterData.breadCrumbFrom;
        let toDate = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo;

        let obj = convertDateValuetoString(fromDate,
            toDate,
            this.props.Login.userInfo);
        breadCrumbArray.push({
            "label": "IDS_FROM",
            "value": obj.breadCrumbFrom
        }, {
            "label": "IDS_TO",
            "value": obj.breadCrumbto
        });
        this.props.Login.masterData.breadCrumbModule &&
            breadCrumbArray.push(
                {
                    "label": "IDS_MODULENAME",
                    "value": this.props.Login.masterData.breadCrumbModule.label
                });
        this.props.Login.masterData.breadCrumbForm &&
            breadCrumbArray.push(
                {
                    "label": "IDS_FORMNAME",
                    "value": this.props.Login.masterData.breadCrumbForm.label
                });
        this.props.Login.masterData.breadCrumbUser &&
            breadCrumbArray.push(
                {
                    "label": "IDS_USERNAME",
                    "value": this.props.Login.masterData.breadCrumbUser.label
                });
        this.props.Login.masterData.breadCrumbRole &&
            breadCrumbArray.push(
                {
                    "label": "IDS_USERROLE",
                    "value": this.props.Login.masterData.breadCrumbRole.label
                });

        breadCrumbArray.push(
            {
                "label": "IDS_VIEWPERIOD",
                "value": this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.label :
                    this.props.Login.masterData.ViewType ? this.props.Login.masterData.ViewType.sauditactionfiltername : ""
            });

        breadCrumbArray.push(
            {
                "label": "IDS_VIEWARCHIVALTYPE",
                "value": this.props.Login.masterData.breadCrumbViewArchivalType ? this.props.Login.masterData.breadCrumbViewArchivalType.label :
                    this.props.Login.masterData.ViewArchivalType ? this.props.Login.masterData.ViewArchivalType.sauditarchivaltypename : ""
            });


        // this.state.selectedRecord["nformcode"] &&
        //  {
        //     "label": "IDS_FORMNAME",
        //     "value": this.state.selectedRecord["nformcode"] ? this.state.selectedRecord["nformcode"].label : ""
        // },
        // this.state.selectedRecord["nusercode"] &&
        // {
        //     "label": "IDS_USERNAME",
        //     "value": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].label : ""
        // },
        // this.state.selectedRecord["nuserrolecode"] &&
        // {
        //     "label": "IDS_USERROLE",
        //     "value": this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].label : ""

        // }
        return breadCrumbArray;
    };

    // covertDatetoString(startDateValue, endDateValue) {
    //     const startDate = new Date(startDateValue);
    //     const endDate = new Date(endDateValue);

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";


    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }



    componentDidUpdate(previousProps) {

        let updateState = false;
        let { selectedRecord, qualisModule, qualisForms, wholeQualisForms, users, userRole,
            viewTypeAudit, viewArchivalTypeAudit, dataStateAll, dataState, dataResult, skip, take } = this.state
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.masterData.QualisModule !== previousProps.Login.masterData.QualisModule
            || this.props.Login.masterData.QualisForms !== previousProps.Login.masterData.QualisForms
            || this.props.Login.masterData.Users !== previousProps.Login.masterData.Users
            || this.props.Login.masterData.UserRole !== previousProps.Login.masterData.UserRole
        ) {
            updateState = true;
            const qualisModuleMap = constructOptionList(this.props.Login.masterData.QualisModule || [], "nmodulecode",
                "smodulename", "nsorter", "ascending", false);
            //const allQualisModuleList = qualisModule.get("OptionList");
            const qualisModuleList = qualisModuleMap.get("OptionList");

            const qualisFormsMap = constructOptionList(this.props.Login.masterData.QualisForms || [], "nformcode",
                "sformname", "nsorter", "ascending", false);
            // const allQualisFormsList = qualisForms.get("OptionList");
            let qualisFormsList = []
            if (selectedRecord && selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {
                qualisFormsList = qualisFormsMap.get("OptionList").filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);
            } else {
                qualisFormsList = qualisFormsMap.get("OptionList");
            }

            const usersMap = constructOptionList(this.props.Login.masterData.Users || [], "nusercode",
                "susername", undefined, undefined, undefined);
            //const allUsersList = users.get("OptionList");
            const usersList = usersMap.get("OptionList");

            const userRoleMap = constructOptionList(this.props.Login.masterData.UserRole || [], "nuserrolecode",
                "suserrolename", undefined, undefined, undefined);
            //const allUserRoleList = userRole.get("OptionList");
            const userRoleList = userRoleMap.get("OptionList");

            const viewTypeAuditMap = constructOptionList(this.props.Login.masterData.ViewTypeAudit || [], "nauditactionfiltercode",
                "sauditactionfiltername", "nsorter", "ascending", false);
            const viewTypeAuditList = viewTypeAuditMap.get("OptionList");

            const viewArchivalTypeAuditMap = constructOptionList(this.props.Login.masterData.ViewArchivalTypeAudit || [], "nauditarchivaltypecode",
                "sauditarchivaltypename", "nsorter", "ascending", false);
            const viewArchivalTypeAuditList = viewArchivalTypeAuditMap.get("OptionList");


            qualisModule = qualisModuleList
            qualisForms = qualisFormsList
            wholeQualisForms = qualisFormsList
            users = usersList
            userRole = userRoleList
            viewTypeAudit = viewTypeAuditList
            viewArchivalTypeAudit = viewArchivalTypeAuditList
            selectedRecord = {
                nauditactionfiltercode: viewTypeAuditList.length > 0 ? {
                    "value": viewTypeAuditList[0].item.nauditactionfiltercode,
                    "label": viewTypeAuditList[0].item.sauditactionfiltername
                } : this.state.selectedRecord["nauditactionfiltercode"]
            }
            selectedRecord = {
                ...selectedRecord,
                nauditarchivaltypecode: viewArchivalTypeAuditList.length > 0 ? {
                    "value": viewArchivalTypeAuditList[0].item.nauditarchivaltypecode,
                    "label": viewArchivalTypeAuditList[0].item.sauditarchivaltypename
                } : this.state.selectedRecord["nauditarchivaltypecode"]
            }

        }

        if (this.props.Login.resetDataGridPage && this.props.Login.resetDataGridPage !== previousProps.Login.resetDataGridPage) {
            if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll.skip = 0
                updateState = true;
            }
            else {

                dataState.skip = 0
                updateState = true;
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            updateState = true;
            if (selectedRecord && selectedRecord.nmodulecode && selectedRecord.nmodulecode.value) {
                qualisForms = qualisForms.filter(form => form.item.nmodulecode === selectedRecord.nmodulecode.value);
            } else {
                qualisForms = wholeQualisForms;
            }
            if (this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll = { skip: 0, take: dataStateAll.take, group: dataStateAll.group }
                updateState = true;
            }
            else {

                dataState = { skip: 0, take: dataState.take, group: dataState.group }
                updateState = true;
            }
            //const auditdate = (this.props.Login.masterData.AuditDetails && this.props.Login.masterData.AuditDetails.slice(dataState.skip, dataState.take + dataState.skip)) || []
            const auditdate = (this.props.Login.masterData.AuditDetails && this.props.Login.masterData.AuditDetails.slice(dataState.skip, this.props.Login.masterData.AuditDetails.length)) || []
            dataResult = process(auditdate || [], dataState)

            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take

        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            updateState = true;
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights
            });
        }
        if (updateState) {
            selectedRecord = this.state.selectedRecordCopy && this.state.selectedRecordCopy["nauditactionfiltercode"] ? this.state.selectedRecordCopy : selectedRecord;
            this.setState({
                selectedRecord, qualisModule, qualisForms, wholeQualisForms, users, userRole,
                viewTypeAudit, viewArchivalTypeAudit, dataStateAll, dataState, dataResult, skip, take
            })
        }

    }

    componentDidMount() {
        if (this.myRef.current.offsetParent.clientHeight !== this.state.gridHeight) {
            this.setState({
                gridHeight: this.myRef.current.offsetParent.clientHeight
            })

        }
    }


}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, filterTransactionList,
    updateStore, filterColumnData, getAuditTrailDetail, getFilterAuditTrailRecords, getFormNameByModule, getExportExcel, ViewAuditDetails, getAuditArchivalHistory
})(injectIntl(AuditTrail));