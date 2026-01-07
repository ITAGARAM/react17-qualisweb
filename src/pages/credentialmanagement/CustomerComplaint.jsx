import React from 'react'
import { connect } from 'react-redux';
import { Row, Col, Button, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { faPlay, faPencilAlt, faTrashAlt, faPlus, faCalendarMinus } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { transactionStatus, attachmentType, designProperties } from '../../components/Enumeration';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import { ProductList } from '../product/product.styled';
import { validatePhoneNumber, create_UUID, sortData, constructOptionList, rearrangeDateFormat, validateEmail, formatInputDate, showEsign, getControlMap, convertDateValuetoString, Lims_JSON_stringify, onDropAttachFileList, deleteAttachmentDropZone } from '../../components/CommonScript';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ListWrapper } from '../userroletemplate/userroletemplate.styles';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { callService, updateStore, crudMaster, filterTransactionList, validateEsignCredential, openModal } from '../../actions';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { process } from '@progress/kendo-data-query';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import Esign from '../audittrail/Esign';
import AddCustomerComplaintConfig from './AddCustomerComplaintConfig';
import {
    getCustomerComplaintData, editCustomerComplaint, getCustomerComplaintRecord,
     //modified 3 action(getDistrict, getVillage, getSubdivisionalLab) name sujatha ATE_274 23-09-2025 for an issue on calling action in sample scheduling 
    getClose, getInitiate, addCustomerComplaintFile, getCustomerComplaintDistrictLab, getCustomerComplaintSubDivisionalLab, getCustomerComplaintVillage, addGetRegion, viewAttachmentCustomerComplaint, generateControlBasedReport
} from '../../actions';
import CustomerComplaintFilter from './CustomerComplaintFilter';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import CustomerComplaintInitiate from './CustomerComplaintInitiate';
import CustomerComplaintHistory from './CustomerComplaintHistory';
import CustomerComplaintFileTab from './CustomerComplaintFileTab';
import AddCustomerComplaintFile from './AddCustomerComplaintFile';
import { ReactComponent as Report } from '../../assets/image/Report.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class CustomerComplaint extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.breadCrumbData = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };

        this.searchFieldList = ["sreceivedfrom"]
        this.state = {
            customercomplaintSkip: 0,
            customercomplaintTake: this.props.Login.settings && this.props.Login.settings[3],
            selectedRecord: {},
            selectedMasterRecord: {},
            complaintHistory: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            statusList: [],
            breadCrumb: [],
            error: "",
            stateFilterStatus: [],
            realStatus: "",
            splitChangeWidthPercentage: 28.6,
            selectedFilter: {},
              //Added by L.Subashini on 26/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', resizable: true, collapsible:true }    
            ],
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();;
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

       //Added by L.Subashini on 25/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

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
        this.props.validateEsignCredential(inputParam, "openModal", this.confirmMessage);
    }

    render() {

        let userStatusCSS = "outline-secondary";
        if (this.props.Login.masterData.selectedCustomerComplaint ? this.props.Login.masterData.selectedCustomerComplaint.ntransactionstatus === transactionStatus.CLOSED
            || this.props.Login.masterData.selectedCustomerComplaint.ntransactionstatus === transactionStatus.APPROVED : false) {
            userStatusCSS = "outline-danger";
        }
        else if (this.props.Login.masterData.selectedCustomerComplaint && this.props.Login.masterData.selectedCustomerComplaint.ntransactionstatus === transactionStatus.INITIATED) {
            userStatusCSS = "outline-success";
        }
        this.searchFieldList = ["sreceivedfrom","stransdisplaystatus","scityname","scomplaintdetails","sdistrictname","semail","slatitude","slocation","slongitude","sregionname","svillagename"];

        const filterParam = {
            inputListName: "customerComplaintRecord", selectedObject: "selectedCustomerComplaint", primaryKeyField: "ncustomercomplaintcode",
            fetchUrl: "customercomplaint/getCustomerComplaintRecord", fecthInputObject: {
                userinfo: this.props.Login.userInfo
            },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList, isSingleSelect: true,
            childRefs: []
        };

        const breadCrumbobj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo)
        const addID = this.state.controlMap.has("AddCustomerComplaint") && this.state.controlMap.get("AddCustomerComplaint").ncontrolcode;
        const editId = this.state.controlMap.has("EditCustomerComplaint") && this.state.controlMap.get("EditCustomerComplaint").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteCustomerComplaint") && this.state.controlMap.get("DeleteCustomerComplaint").ncontrolcode;
        const initiateId = this.state.controlMap.has("InitiateCustomerComplaint") && this.state.controlMap.get("InitiateCustomerComplaint").ncontrolcode;
        const closeId = this.state.controlMap.has("CloseCustomerComplaint") && this.state.controlMap.get("CloseCustomerComplaint").ncontrolcode;
        // added by sujatha ATE_274 SWSM-92 for report button 
        const customerComplaintReportId = this.state.controlMap.has("CustomerComplaintReport") && this.state.controlMap.get("CustomerComplaintReport").ncontrolcode;
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;
        const complaintList = this.props.Login.masterData.customerComplaintRecord ? sortData(this.props.Login.masterData.customerComplaintRecord, 'descending', 'ncustomercomplaintcode') : [];

        let mandatoryFields = [
            { "idsName": "IDS_RECEIVEDFROM", "dataField": "sreceivedfrom", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_COMPLAINTDETAILS", "dataField": "scomplaintdetails", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_CUSTOMERCOMPLAINTDATE", "dataField": "dcomplaintdate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            // { "idsName": "IDS_REGIONNAME", "dataField": "nstatelabcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            // { "idsName": "IDS_DISTRICT", "dataField": "ndistrictcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            // { "idsName": "IDS_CITY", "dataField": "ncitycode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            // { "idsName": "IDS_VILLAGE", "dataField": "nvillagecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            // modified by sujatha ATE_274 23-09-2025 IDS modified for central, region, district, taluka -> start
            { "idsName": "IDS_CENTRALSITE", "dataField": "nstatelabcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_REGION", "dataField": "nregionallabcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_DISTRICT", "dataField": "ndistrictlabcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_TALUKA", "dataField": "nsubdivisionallabcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            //end
            { "idsName": "IDS_VILLAGE", "dataField": "nvillagecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_LOCATION", "dataField": "slocation", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

        ]

        let mandatorychildFields = [
            { "idsName": "IDS_CUSTOMERCOMPLAINTDATE", "dataField": "dtransactiondate", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
        ]

        let mandatoryFileFields = [];

        if (this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINTFILE") {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFileFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {
                mandatoryFileFields = [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }];
            }
        }

        const customerComplaintAddParam = {
            screenName: "IDS_CUSTOMERCOMPLAINT",
            operation: "create",
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord,
            primaryKeyField: "ncustomercomplaintcode",
            userInfo: this.props.Login.userInfo,
            ncontrolCode: addID,
        };

        const initiateParam = {
            screenName: "IDS_CUSTOMERCOMPLAINT",
            operation: "initiate",
            primaryKeyField: "ncustomercomplaintcode",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: initiateId,
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord,
        }

        const closeparam = {
            screenName: "IDS_CUSTOMERCOMPLAINT",
            operation: "close",
            primaryKeyField: "ncustomercomplaintcode",
            userInfo: this.props.Login.userInfo,
            ncontrolcode: closeId,
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord,
        }

        const getParam = {
            primaryKeyField: "ncustomercomplaintcode",
            userInfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData,
            selectedRecord: this.state.selectedRecord,

        }

        const SubFields = [
            {
                [designProperties.VALUE]: "stransdisplaystatus",
                [designProperties.COLOUR]: "scolorhexcode"
            }

        ];

        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": breadCrumbobj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": breadCrumbobj.breadCrumbto
            },
            {
                "label": "IDS_STATUS",
                "value": this.props.Login.masterData.realStatus ? this.props.Login.masterData.realStatus.stransdisplaystatus || "NA" :
                    this.props.Login.masterData.statusValue ? this.props.Login.masterData.statusValue.stransdisplaystatus || "NA" : "NA"
            }
        ]

        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />

                    <Row noGutters={"true"}>
                        {/* modified by thenmozhi SWSM-66 for scroll issue committed by sujatha 25-09-2025 */}
                        <Col md={12} className='parent-port-height sticky_head_parent parent-height' ref={(parentHeight) => { this.parentHeight = parentHeight }} style={{height:"calc(100vh - 100px);"}}>
                        {/* <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}> */}
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>

                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={30} secondaryMinSize={20}> */}
                                    <Splitter className='layout-splitter' orientation="horizontal"
                                       panes={this.state.panes} onChange={this.onSplitterChange}>
                                        <SplitterPane size="30%" min="20%">
                                    <div className='toolbar-top-inner'>

                                        <TransactionListMasterJsonView
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            needMultiSelect={false}
                                            masterList={this.props.Login.masterData.searchedData || complaintList}
                                            selectedMaster={[this.props.Login.masterData.selectedCustomerComplaint === undefined ? this.state.selectedCustomerComplaint : this.props.Login.masterData.selectedCustomerComplaint] || []}
                                            primaryKeyField="ncustomercomplaintcode"
                                            getMasterDetail={
                                                (vieweditComplaint) => this.props.getCustomerComplaintRecord(vieweditComplaint, getParam)
                                            }
                                            filterParam={filterParam}
                                            mainField={'sreceivedfrom'}
                                            filterColumnData={this.props.filterTransactionList}
                                            showFilter={this.props.Login.showFilter}
                                            openFilter={this.openFilter}
                                            closeFilter={this.closeFilter}
                                            onFilterSubmit={this.onFilterSubmit}
                                            selectionColorField="scolorhexcode"
                                            statusFieldName="stransdisplaystatus"
                                            statusField="ntransactionstatus"
                                            showStatusIcon={false}
                                            showStatusName={false}
                                            showStatusLink={true}
                                            needFilter={true}
                                            searchListName={"searchedData"}
                                            searchRef={this.searchRef}
                                            skip={this.state.customercomplaintSkip}
                                            take={this.state.customercomplaintTake}
                                            handlePageChange={this.handlePageChange}
                                            subFields={SubFields}
                                            splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                            commonActions={
                                                <>
                                                    <ProductList className="d-flex product-category float-right">
                                                        <Nav.Link
                                                            className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                            onClick={() => this.props.addGetRegion(customerComplaintAddParam)}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Nav.Link>
                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            onClick={() => this.onReload()}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>
                                                    </ProductList>
                                                </>
                                            }
                                            filterComponent={[
                                                {
                                                    "Sample Filter": <CustomerComplaintFilter
                                                        userInfo={this.props.Login.userInfo || {}}
                                                        fromDate={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                        toDate={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                                        handleFilterDateChange={this.handleFilterDateChange}
                                                        onFilterChange={this.onFilterChange}
                                                        status={this.state.statusList}
                                                        statusValue={this.props.Login.masterData && this.props.Login.masterData.defaultTransactionStatus || {}}
                                                        onFilterComboChange={this.onFilterComboChange}
                                                    />
                                                }
                                            ]}
                                        />
                                    </div>
                                        </SplitterPane>
                                        <SplitterPane>
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {this.props.Login.masterData ? this.props.Login.masterData.customerComplaintRecord && this.props.Login.masterData.customerComplaintRecord.length > 0 && this.props.Login.masterData.selectedCustomerComplaint ?
                                                <>
                                                    <Card.Header>
                                                        <Card.Title>
                                                            <h1 className="product-title-main">{this.props.Login.masterData.selectedCustomerComplaint.sreceivedfrom}</h1>
                                                        </Card.Title>
                                                        <Card.Subtitle className="text-muted font-weight-normal">
                                                            <Row>
                                                                <Col md={10} className="d-flex">
                                                                    <h2 className="product-title-sub flex-grow-1">
                                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                            {this.props.Login.masterData.selectedCustomerComplaint.stransdisplaystatus}
                                                                        </span>
                                                                    </h2>
                                                                </Col>

                                                                <Col md={12}>
                                                                    <div className="d-flex product-category" style={{ float: "right" }}>

                                                                        {/* Added by Sujatha SWSM-92 --Control Based Report */}
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                           hidden={this.state.userRoleControlRights.indexOf(customerComplaintReportId) === -1}
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
                                                                           onClick={() => this.onDownloadClick(customerComplaintReportId)}
                                                                           >
                                                                        <Report />
                                                                        </Nav.Link>

                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_INITIATE" })}
                                                                            data-place="left"
                                                                            hidden={this.state.userRoleControlRights.indexOf(initiateId) === -1}
                                                                            onClick={() => this.props.getInitiate(initiateParam)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPlay} />
                                                                        </Nav.Link>
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CLOSEDATE" })}
                                                                            hidden={this.state.userRoleControlRights.indexOf(initiateId) === -1}
                                                                            onClick={() => this.props.getClose(closeparam)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCalendarMinus} />
                                                                        </Nav.Link>
                                                                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                            onClick={() => this.props.editCustomerComplaint("IDS_CUSTOMERCOMPLAINT", "update", "ncustomercomplaintcode", this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                                                                                this.props.Login.masterData, this.props.Login.userInfo, editId)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                        </Nav.Link>
                                                                        <Nav.Link name="deleteCustomerComplaint" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            onClick={() =>
                                                                                this.ConfirmDelete(deleteId, {
                                                                                    mastertodelete: this.props.Login.masterData.selectedCustomerComplaint,
                                                                                    userInfo: this.props.Login.userInfo,
                                                                                    masterData: this.props.Login.masterData
                                                                                })
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                        </Nav.Link>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row className='details-height'>    {/* modified by thenmozhi SWSM-66 for scroll issue committed by sujatha 25-09-2025 */}
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_RECEIVEDFROM" message="Received From" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.selectedCustomerComplaint.sreceivedfrom}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_COMPLAINTDETAILS" message="complaint details" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.selectedCustomerComplaint.scomplaintdetails}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_DISTRICT" message="district" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.sdistrictname === null || this.props.Login.masterData.selectedCustomerComplaint.sdistrictname.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.sdistrictname}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TALUKA" message="City" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.scityname === null || this.props.Login.masterData.selectedCustomerComplaint.scityname.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.scityname}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_VILLAGE" message="Village" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.svillagename === null || this.props.Login.masterData.selectedCustomerComplaint.svillagename.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.svillagename}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_CONTACTNO" message="Contact No" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.scontactnumber === null || this.props.Login.masterData.selectedCustomerComplaint.scontactnumber.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.scontactnumber}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_LOCATION" message="Location" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.selectedCustomerComplaint.slocation === null || this.props.Login.masterData.selectedCustomerComplaint.slocation.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.slocation}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_LONGITUDE" message="Longitude" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.slongitude === null || this.props.Login.masterData.selectedCustomerComplaint.slongitude.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.slongitude}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_LATITUDE" message="Latitude" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.slatitude === null || this.props.Login.masterData.selectedCustomerComplaint.slatitude.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.slatitude}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_EMAIL" message="Email" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.semail === null || this.props.Login.masterData.selectedCustomerComplaint.semail.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.semail}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_RECEIVEDDATE" message="Received Date" /></FormLabel>
                                                                    <ReadOnlyText> {this.props.Login.masterData.selectedCustomerComplaint.sreceiverdate === null || this.props.Login.masterData.selectedCustomerComplaint.sreceiverdate.length === 0 ? '-' :
                                                                        this.props.Login.masterData.selectedCustomerComplaint.sreceiverdate}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>
                                                        <Row className="no-gutters">
                                                            <Col md={12}>
                                                                <Card className="at-tabs">
                                                                    <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                    </Card.Body>
                                                </>
                                                : "" : ""
                                            }
                                        </Card>
                                    </ContentPanel>
                                        </SplitterPane>
                                    </Splitter>
                                {/* </SplitterLayout> */}
                            </ListWrapper>
                            {(this.props.Login.openModal || this.props.Login.openChildModal) ?
                                <SlideOutModal
                                    show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                                    closeModal={this.closeModal}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    screenName={this.props.Login.screenName}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    esign={this.props.Login.loadEsign}
                                    onSaveClick={this.onSaveClick}
                                    validateEsign={this.validateEsign}
                                    masterStatus={this.props.Login.masterStatus}
                                    updateStore={this.props.updateStore}
                                    mandatoryFields={(this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINT") ? mandatoryFields : this.props.Login.screenName === "IDS_INITIATECUSTOMERCOMPLAINT" || this.props.Login.screenName === "IDS_CLOSECUSTOMERCOMPLAINT" ? mandatorychildFields : mandatoryFileFields}
                                    addComponent={this.props.Login.loadEsign ?
                                        <Esign operation={this.props.Login.operation}
                                            onInputOnChange={this.onInputOnChange}
                                            inputParam={this.props.Login.inputParam}
                                            selectedRecord={this.state.selectedRecord || {}}
                                        />
                                        : this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINT" && (this.props.Login.operation === "create" || this.props.Login.operation === "update") ?
                                            <AddCustomerComplaintConfig
                                                selectedRecord={this.state.selectedRecord || {}}
                                                // regionList={this.props.Login.regionList || {}}
                                                // districtList={this.props.Login.districtList}
                                                // cityList={this.props.Login.cityList}
                                                // villageList={this.props.Login.villageList}
                                                stateList={this.props.Login.stateList}
                                                regionalList={this.props.Login.regionalList}
                                                districtList={this.props.Login.districtList}
                                                subDivisionalList={this.props.Login.subDivisionalList}
                                                villageList={this.props.Login.villageList}
                                                handleDateChange={this.handleDateChange}
                                                selectedCustomerComplaint={this.props.Login.masterData.selectedCustomerComplaint || {}}
                                                onInputOnChange={this.onInputOnChange}
                                                onComboChange={this.onComboChange}
                                                userInfo={this.props.Login.userInfo}
                                                currentTime={this.props.Login.date}
                                            /> : this.props.Login.screenName === "IDS_INITIATECUSTOMERCOMPLAINT" || this.props.Login.screenName === "IDS_CLOSECUSTOMERCOMPLAINT" ?
                                                <CustomerComplaintInitiate
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    formatMessage={this.props.intl.formatMessage}
                                                    operation={this.props.Login.operation}
                                                    timeZone={this.props.Login.timeZone}
                                                    userInfo={this.props.Login.userInfo}
                                                    handleDateChange={this.handleDateChange}
                                                    onInputOnChange={this.onInputOnChange}
                                                    userRoleControlRights={this.props.Login.userRoleControlRights}
                                                    currentTime={this.props.Login.date}
                                                /> : this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINTFILE" ? <AddCustomerComplaintFile
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    onInputOnChange={this.onInputOnChange}
                                                    onDrop={this.onDropCustomerComplaintFile}
                                                    onDropAccepted={this.onDropAccepted}
                                                    deleteAttachment={this.deleteAttachment}
                                                    actionType={this.state.actionType}
                                                    onComboChange={this.onComboChange}
                                                    linkMaster={this.props.linkMaster}
                                                    editFiles={this.props.editFiles}
                                                    maxSize={20}
                                                    maxFiles={1}
                                                    multiple={false}
                                                    settings={this.props.Login.settings}
                                                    label={this.props.intl.formatMessage({ id: "IDS_CUSTOMERCOMPLAINTFILE" })}
                                                    name="customercomplaintfilename"
                                                /> : ""}
                                /> : ""}
                        </Col>
                    </Row>
                </ListWrapper>
            </>
        );
    }
    // added by sujatha SWSM-92 for report button's onclick function 
     onDownloadClick = (customerComplaintReportId) => {
        if (this.props.Login.masterData.selectedCustomerComplaint) {
            let { realFromDate, realToDate } = this.props.Login.masterData
            let ncustomercomplaintcode= this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode

            let inputParam = {
                nusercode: this.props.Login.userInfo && this.props.Login.userInfo.nusercode || -1,
                nsitecode: this.props.Login.userInfo && this.props.Login.userInfo.nsitecode || -1,
                ncustomercomplaintcode: this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode
            }

           // let obj = convertDateValuetoString(realFromDate, realToDate, this.props.Login.userInfo)
          //  inputParam['sfromdate'] = obj.fromDate.replace("T"," ");
          //  inputParam['stodate'] = obj.toDate.replace("T"," ");
            this.props.generateControlBasedReport(customerComplaintReportId, inputParam, this.props.Login, "customercomplaint", ncustomercomplaintcode)
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }

    }

    onDropCustomerComplaintFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteRecords = (customerComplaintparam) => {
        if (customerComplaintparam.selectedRecord.expanded !== undefined) {
            delete (customerComplaintparam.selectedRecord.expanded);
        }
        let inputParam = {};
        let dataResultRecord;
        let skipDataRecords;
        let dataStateRecord;
        let masterData = this.props.Login.masterData;
       // if (this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINTFILE") {
            inputParam = {
                classUrl: "customercomplaint",
                methodUrl: customerComplaintparam.methodUrl,
                inputData: {
                    [customerComplaintparam.methodUrl.toLowerCase()]: customerComplaintparam.selectedRecord,
                    "userinfo": { ...this.props.Login.userInfo, slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename) },
                },
                operation: customerComplaintparam.operation,
            }
            dataResultRecord = process(this.props.Login.masterData['customerComplaintFile'], this.state.dataState);
            dataStateRecord = this.state.dataState;
       // }
        if (dataResultRecord.data) {
            if (dataResultRecord.data.length === 1) {
                let skipcount = dataStateRecord.skip > 0 ? (dataStateRecord.skip - dataStateRecord.take) :
                    dataStateRecord.skip
                skipDataRecords = { skip: skipcount, take: dataStateRecord.take }
            } else {
                skipDataRecords = dataStateRecord;
            }
        }

        inputParam["dataState"] = skipDataRecords;
        inputParam["openChildModal"] = false;
        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, customerComplaintparam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    // added operation:"delete" by sujatha ATE_274 01-10-2025 for an issue while deleting file open edit popup
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, openModal: true,operation:"delete"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete"
        });
    }

    handlePageChange = e => {
        this.setState({
            customercomplaintSkip: e.skip,
            customercomplaintTake: e.take
        });
    }

    onFilterComboChange = (comboData, fieldName) => {
        if (comboData) {
            if (fieldName === 'ntranscode') {
                if (comboData.value !== this.props.Login.masterData.defaultTransactionStatus.ntranscode) {
                    const masterData = { ...this.props.Login.masterData, defaultTransactionStatus: comboData.item };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData, customercomplaintSkip: this.state.customercomplaintSkip, customercomplaintTake: this.state.customercomplaintTake }
                    };
                    this.props.updateStore(updateInfo);
                }
            }
        }
    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_HISTORY", <CustomerComplaintHistory
            data={this.props.Login.masterData.complaintHistory || []}
            dataResult={process(this.props.Login.masterData.complaintHistory || [], this.state.dataState)}
            dataState={this.state.dataState}
            dataStateChange={this.dataStateHistoryChange}
            userInfo={this.props.Login.userInfo}
            methodUrl={"CustomerComplaint"}
            screenName="IDS_CUSTOMERCOMPLAINTHISTORY"
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            selectedId={this.props.Login.selectedId}
        />);
        tabMap.set("IDS_FILE",
            <CustomerComplaintFileTab
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                deleteRecord={this.deleteRecords}
                customerComplaintFile={this.props.Login.masterData.customerComplaintFile || []}
                addCustomerComplaintFile={this.props.addCustomerComplaintFile}
                viewCustomerComplaintFile={this.viewCustomerComplaintFile}
                defaultRecord={this.defaultRecord}
                screenName={"IDS_CUSTOMERCOMPLAINTFILE"}
                settings={this.props.Login.settings}
                masterData={this.props.Login.masterData}
            />);
        return tabMap;
    }

    dataStateHistoryChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.complaintHistory, event.dataState),
            dataState: event.dataState
        });
    }

    viewCustomerComplaintFile = (filedata) => {
        const inputParam = {
            inputData: {
                customercomplaintfile: filedata,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "customercomplaint",
            operation: "view",
            methodUrl: "AttachedCustomerComplaintFile",
            screenName: "Customer Complaint File"
        }
        this.props.viewAttachmentCustomerComplaint(inputParam);
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    handleFilterDateChange = (dateName, dateValue) => {
        const masterData = this.props.Login.masterData;
        masterData[dateName] = dateValue;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        };
        this.props.updateStore(updateInfo);
    }

    onFilterChange = (event, labelname) => {
        let masterData = this.props.Login.masterData;
        masterData = {
            ...masterData,
            [labelname]: { ...event.item }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
    }

    openFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: true, }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {
        let Map = {};
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        Map['inputValues'] = {
            fromDate: this.props.Login.masterData.realFromDate || new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date(),
            fromdate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.realFromDate) || new Date(),
            todate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.realToDate) || new Date(),
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...Map.inputValues }, selectedFilter: { todate: Map.inputValues.todate, fromdate: Map.inputValues.fromdate } }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
        const realStatus = this.props.Login.masterData.defaultTransactionStatus;
        const masterData = { ...this.props.Login.masterData, realFromDate, realToDate, realStatus };
        const inputParam = {
            inputData: {
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                ntranscode: this.props.Login.masterData.defaultTransactionStatus && this.props.Login.masterData.defaultTransactionStatus.ntranscode || -1,
                currentDate: null,
                "userinfo": this.props.Login.userInfo,
            },
            masterData,

            searchRef: this.searchRef
        };
        this.props.getCustomerComplaintData(inputParam);
    }

    ConfirmDelete = (deleteId, record) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("delete", deleteId, record));
    }

    deleteRecord = (operation, deleteId, record) => {
        const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate);
        const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.toDate)
        let inputData = {
            customercomplaint: record.mastertodelete,
            userinfo: record.userInfo
        };

        const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        inputData['fromDate'] = obj.fromDate;
        inputData['toDate'] = obj.toDate;
        inputData['ntranscode'] = this.props.Login.masterData.defaultTransactionStatus && this.props.Login.masterData.defaultTransactionStatus.ntranscode || -1;
        const selectedFilter = {};
        selectedFilter["fromdate"] = realFromDate;
        selectedFilter["todate"] = realToDate;

        let inputParam = {
            operation: operation,
            ncontrolcode: deleteId,
            userInfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData,
            inputData: inputData,
            methodUrl: "CustomerComplaint",
            classUrl: "customercomplaint"
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_CUSTOMERCOMPLAINT", operation: "delete",
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onReload = () => {
        this.searchRef.current.value = "";
        let obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo);
        const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate);
        const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate);
		// commentted and added by sujatha ATE_274 swsm-78 for the awesome filter cancel issue
    //  const realStatus = this.props.Login.masterData.defaultTransactionStatus;
        const defaultTransactionStatus = this.props.Login.masterData.realStatus;
		// modified by sujatha ATE_274 swsm-78 for the awesome filter cancel issue
        const masterData = { ...this.props.Login.masterData, realFromDate, realToDate, defaultTransactionStatus };

        const inputParam = {
            inputData: {
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                // realStatus,   // commentted by sujatha ATE_274 swsm-78 for the awesome filter cancel issue
                userinfo: this.props.Login.userInfo,
				// modified by sujatha ATE_274 swsm-78 for the awesome filter cancel issue
                ntranscode: this.props.Login.masterData.realStatus && this.props.Login.masterData.realStatus.ntranscode || -1,
                "userinfo": this.props.Login.userInfo,

            },

            masterData,
            customercomplaintSkip: this.state.customercomplaintSkip,
            customercomplaintTake: this.state.customercomplaintTake,
            searchRef: this.searchRef
        };
        this.props.getCustomerComplaintData(inputParam);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, openChildModal, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    // onComboChange = (comboData, fieldName, caseNo) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     switch (caseNo) {
    //         case 1:
    //             if (comboData !== null) {
    //                 if (fieldName === "nregioncode") {
    //                     const oldRegionCode = selectedRecord.nregioncode?.value;
    //                     if (oldRegionCode && parseInt(comboData.value) !== parseInt(oldRegionCode)) {
    //                         if (selectedRecord.hasOwnProperty("ndistrictcode")) delete selectedRecord.ndistrictcode;
    //                         if (selectedRecord.hasOwnProperty("ncitycode")) delete selectedRecord.ncitycode;
    //                         if (selectedRecord.hasOwnProperty("nvillagecode")) delete selectedRecord.nvillagecode;
    //                     }

    //                     selectedRecord[fieldName] = comboData;

    //                     if (this.props.Login?.operation === "create") {
    //                         this.props.Login.masterData = this.props.Login.masterData || {};
    //                         this.props.Login.masterData.selectedCustomerComplaint =
    //                             this.props.Login.masterData.selectedCustomerComplaint || {};
    //                         this.props.Login.masterData.selectedCustomerComplaint.sreceivedfrom = null;
    //                     }


    //                     this.props.getDistrict({
    //                         inputData: {
    //                             userinfo: this.props.Login.userInfo,
    //                             primarykey: comboData.value,
    //                             selectedCustomerComplaint: this.props.Login.masterData.selectedCustomerComplaint
    //                         }
    //                     }, selectedRecord);
    //                 }
    //                 break;
    //             }
    //         case 2:
    //             if (comboData !== null) {
    //                 if (fieldName === "ndistrictcode") {
    //                     const oldDistrictCode = selectedRecord.ndistrictcode?.value;

    //                     if (oldDistrictCode && parseInt(comboData.value) !== parseInt(oldDistrictCode)) {
    //                         delete selectedRecord.ncitycode;
    //                         delete selectedRecord.nvillagecode;
    //                     }

    //                     selectedRecord[fieldName] = comboData;

    //                     this.props.getCity({
    //                         inputData: {
    //                             userinfo: this.props.Login.userInfo,
    //                             primarykey: comboData.value,
    //                             selectedCustomerComplaint: this.props.Login.masterData.selectedCustomerComplaint
    //                         }
    //                     }, selectedRecord);
    //                 }
    //                 break;
    //             }
    //         case 3:
    //             if (comboData !== null) {
    //                 if (fieldName === "ncitycode") {
    //                     const oldCityCode = selectedRecord.ncitycode?.value;

    //                     if (oldCityCode && parseInt(comboData.value) !== parseInt(oldCityCode)) {
    //                         delete selectedRecord.nvillagecode;
    //                     }

    //                     selectedRecord[fieldName] = comboData;
    //                     this.props.getVillage({
    //                         inputData: {
    //                             userinfo: this.props.Login.userInfo,
    //                             primarykey: comboData.value,
    //                             selectedCustomerComplaint: this.props.Login.masterData.selectedCustomerComplaint
    //                         }
    //                     }, selectedRecord);
    //                 }
    //                 break;
    //             }

    //         case 4:
    //             selectedRecord[fieldName] = comboData;
    //             this.setState({ selectedRecord });
    //             break;
    //         default:
    //             break;
    //     }
    // }


    onComboChange = (comboData, fieldName, caseNo) => {
        let selectedRecord = { ...this.props.Login.selectedRecord } || {};

        selectedRecord[fieldName] = comboData;

        switch (caseNo) {
            case 1:
                selectedRecord.nregionallabcode = null;
                selectedRecord.ndistrictlabcode = null;
                selectedRecord.nsubdivisionallabcode = null;
                selectedRecord.nvillagecode = null;

                break;

            case 2:
                selectedRecord.ndistrictlabcode = null;
                selectedRecord.nsubdivisionallabcode = null;
                selectedRecord.nvillagecode = null;
                selectedRecord.nsamplelocationcode = null;
                if (comboData) {
                    this.props.getCustomerComplaintDistrictLab({
                        inputData: {
                            userinfo: this.props.Login.userInfo,
                            primarykey: comboData.value,
                            ncontrolcode: this.props.Login.ncontrolcode
                        }
                    }, selectedRecord);
                }
                break;
            case 3:
                selectedRecord.nsubdivisionallabcode = null;
                selectedRecord.nvillagecode = null;
                selectedRecord.nsamplelocationcode = null;
                if (comboData) {
                    this.props.getCustomerComplaintSubDivisionalLab({
                        inputData: {
                            userinfo: this.props.Login.userInfo,
                            primarykey: comboData.value,
                            ncontrolcode: this.props.Login.ncontrolcode
                        }
                    }, selectedRecord);
                }
                break;
            case 4:
                selectedRecord.nvillagecode = null;
                selectedRecord.nsamplelocationcode = null;
                if (comboData) {
                    this.props.getCustomerComplaintVillage({
                        inputData: {
                            userinfo: this.props.Login.userInfo,
                            primarykey: comboData.value,
                            nsitehierarchyconfigcode:comboData.nsitehierarchyconfigcode,  //added by sujatha ATE_274 23-09-2025 for getting the villages based on hierarchyconfigcode
                            ncontrolcode: this.props.Login.ncontrolcode

                        }
                    }, selectedRecord);
                }
                break;


            case 5:

                this.props.Login.selectedRecord[fieldName] = comboData;
                break;
            default:
                break;
        }
        this.setState({ selectedRecord });
    };



    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    };

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.name === "scontactnumber") {
            if (event.target.value !== "") {
                event.target.value = validatePhoneNumber(event.target.value);
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        }

        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        let clearSelectedRecordField = [];
        if (this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINT") {
            const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate);
            const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.toDate)
            let masterData = {
                ...this.props.Login.masterData
                , realFromDate, realToDate
            }
            if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {
                let inputData = [];
                let selectedRecord = this.state.selectedRecord;
                inputData["userinfo"] = this.props.Login.userInfo;
                const postParam = {
                    inputListName: "customerComplaintRecord", selectedObject: "selectedCustomerComplaint",
                    primaryKeyField: "ncustomercomplaintcode",
                  //  primaryKeyValue: this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                    //   fetchUrl: "customercomplaint/getCustomerComplaintRecord",
                    //  fecthInputObject: { userinfo: this.props.Login.userInfo },
                }
                if (this.props.Login.operation === "create") {
                    if (selectedRecord !== undefined) {
                        inputData["customercomplaint"] = {
                            "ncustomercomplaintcode": selectedRecord.ncustomercomplaintcode,
                            "sreceivedfrom": selectedRecord.sreceivedfrom,
                            "scomplaintdetails": selectedRecord.scomplaintdetails,
                            "scontactnumber": selectedRecord.scontactnumber,
                            "semail": selectedRecord.semail,
                            "nregioncode": selectedRecord.nregionallabcode.value || {},
                            "ndistrictcode": selectedRecord.ndistrictlabcode.value || {},
                            "ncitycode": selectedRecord.nsubdivisionallabcode.value || {},
                            "nvillagecode": selectedRecord.nvillagecode.value || {},
                            "slocation": selectedRecord.slocation,
                            "slatitude": selectedRecord.slatitude,
                            "slongitude": selectedRecord.slongitude,
                            "dcomplaintdate": selectedRecord.dcomplaintdate,
                            "dcomplaintdate": formatInputDate(selectedRecord["dcomplaintdate"], false),
                            "ntzcomplaintdate": selectedRecord.ntzcomplaintdate
                                ? selectedRecord.ntzcomplaintdate.value
                                || this.props.Login.userInfo.ntimezonecode
                                : this.props.Login.userInfo.ntimezonecode,
                            // added by sujatha ATE_274 26-09-2025 for audit trail not recorded this fields in Add Customer Complaints
                            "sregionname":selectedRecord.nregionallabcode.label || "",
                            "sdistrictname":selectedRecord.ndistrictlabcode.label || "",
                            "scityname":selectedRecord.nsubdivisionallabcode.label || "",
                            "scentralsitename":selectedRecord.nstatelabcode.label,
                            "ncentralsitecode":selectedRecord.nstatelabcode.value || {}
                        };
                    }
                }

                if (this.props.Login.operation === "update") {
                    if (selectedRecord !== undefined) {
                        inputData["customercomplaint"] = {
                            "ncustomercomplaintcode": this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                            "sreceivedfrom": selectedRecord.sreceivedfrom,
                            "scomplaintdetails": selectedRecord.scomplaintdetails,
                            "scontactnumber": selectedRecord.scontactnumber,
                            "semail": selectedRecord.semail,
                            "nregioncode": selectedRecord.nregionallabcode.value || {},
                            "ndistrictcode": selectedRecord.ndistrictlabcode.value || {},
                            "ncitycode": selectedRecord.nsubdivisionallabcode.value || {},
                            "nvillagecode": selectedRecord.nvillagecode.value || {},
                            "slocation": selectedRecord.slocation,
                            "slatitude": selectedRecord.slatitude,
                            "slongitude": selectedRecord.slongitude,
                            "dcomplaintdate": selectedRecord.dcomplaintdate,
                            "dcomplaintdate": formatInputDate(selectedRecord["dcomplaintdate"], false),
                            "ntzcomplaintdate": selectedRecord.ntzcomplaintdate
                                ? selectedRecord.ntzcomplaintdate.value
                                || this.props.Login.userInfo.ntimezonecode
                                : this.props.Login.userInfo.ntimezonecode,
                             // added by sujatha ATE_274 26-09-2025 for audit trail not recorded this fields in Add Customer Complaints
                            "ncentralsitecode":selectedRecord.nstatelabcode.value || {}
                        };
                    }


                }
                const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate,
                    this.state.selectedFilter.todate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
                inputData['fromDate'] = obj.fromDate;
                inputData['toDate'] = obj.toDate;
                inputData['ntranscode'] = this.props.Login.masterData.defaultTransactionStatus && this.props.Login.masterData.defaultTransactionStatus.ntranscode || -1;
                const selectedFilter = {};
                selectedFilter["fromdate"] = realFromDate;
                selectedFilter["todate"] = realToDate;
                const inputParam = {
                    classUrl: "customercomplaint",
                    methodUrl: "CustomerComplaint",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, searchRef: this.searchRef,
                    selectedRecord: { ...this.state.selectedRecord },
                }

                if (
                    this.props.Login.operation != "create" && showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
            }

        }
        else if (this.props.Login.screenName === "IDS_INITIATECUSTOMERCOMPLAINT" || this.props.Login.screenName === "IDS_CLOSECUSTOMERCOMPLAINT") {
            const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate);
            const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.toDate)

            let masterData = {
                ...this.props.Login.masterData
                , realFromDate, realToDate
            }
            let inputData = [];
            let selectedRecord = this.state.selectedRecord;
            inputData["userinfo"] = this.props.Login.userInfo;
            const postParam = {
                inputListName: "customerComplaintRecord", selectedObject: "selectedCustomerComplaint",
                primaryKeyField: "ncustomercomplaintcode",
                primaryKeyValue: this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                fetchUrl: "customercomplaint/getCustomerComplaintRecord",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            if (selectedRecord !== undefined) {
                inputData["customercomplaint"] = {
                    "ncustomercomplaintcode": masterData.selectedCustomerComplaint.ncustomercomplaintcode,
                    "dtransactiondate": selectedRecord.dcomplaintdate,
                    "sremarks": selectedRecord.sremarks,
                    "dtransactiondate": formatInputDate(selectedRecord["dtransactiondate"], false),
                    "ntztransactiondate": selectedRecord.ntztransactiondate
                        ? selectedRecord.ntztransactiondate.value
                        || this.props.Login.userInfo.ntimezonecode
                        : this.props.Login.userInfo.ntimezonecode,
                };
            }

            const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate,
                this.state.selectedFilter.todate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
            inputData['fromDate'] = obj.fromDate;
            inputData['toDate'] = obj.toDate;
            inputData['ntranscode'] = this.props.Login.masterData.defaultTransactionStatus && this.props.Login.masterData.defaultTransactionStatus.ntranscode || -1;

            const selectedFilter = {};
            selectedFilter["fromdate"] = realFromDate;
            selectedFilter["todate"] = realToDate;

            const inputParam = {
                classUrl: "customercomplaint",
                methodUrl: "CustomerComplaint",
                inputData: inputData,
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef,
                selectedRecord: { ...this.state.selectedRecord },


            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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

        else if (this.props.Login.screenName === "IDS_CUSTOMERCOMPLAINTFILE") {
            inputParam = this.onSaveCustomerComplaintFile(saveType, formRef);
            clearSelectedRecordField = [
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox", "isClearField": true },
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox", "isClearField": true },
                { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox", "isClearField": true },
            ];

            if (inputParam.operation === "update") {
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                    const updateInfo = {

                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData, }, saveType
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", "", "", clearSelectedRecordField);
                }
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal", "", "", clearSelectedRecordField);
            }
        }
    }

    onSaveCustomerComplaintFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let customerComplaintFileArray = [];
        let customerComplaintFile = {
            ncustomercomplaintcode: this.props.Login.masterData.selectedCustomerComplaint.ncustomercomplaintcode,
            ncustomercomplaintfilecode: selectedRecord.ncustomercomplaintfilecode ? selectedRecord.ncustomercomplaintfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, customerComplaintFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ncustomercomplaintfilecode && selectedRecord.ncustomercomplaintfilecode > 0
                        && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    customerComplaintFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                customerComplaintFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                customerComplaintFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "", false);
                customerComplaintFile["nlinkcode"] = transactionStatus.NA;
                customerComplaintFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                customerComplaintFile["nfilesize"] = selectedRecord.nfilesize;
                customerComplaintFileArray.push(customerComplaintFile);
            }
        } else {
            customerComplaintFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(), false);
            customerComplaintFile["sdescription"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            customerComplaintFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            customerComplaintFile["ssystemfilename"] = "";
            customerComplaintFile["nfilesize"] = 0;
            customerComplaintFileArray.push(customerComplaintFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("customerComplaintFile", JSON.stringify(customerComplaintFileArray));

        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            postParam = { inputListName: "CustomerComplaint", selectedObject: "SelectedCustomerComplaint", primaryKeyField: "ncustomercomplaintcode" };
            selectedId = selectedRecord["ncustomercomplaintfilecode"];
        }
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            classUrl: "customercomplaint",
            saveType, formRef, methodUrl: "CustomerComplaintFile", postParam,
            selectedRecord: { ...this.state.selectedRecord },
        }
        return inputParam;
    }
    componentDidUpdate(previousProps) {

        let bool = false;
        let { selectedRecord, controlMap, userRoleControlRights, customercomplaintSkip, customercomplaintTake, statusList } = this.state;
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                bool = true;
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            bool = true;
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            customercomplaintSkip = this.props.Login.customercomplaintSkip === undefined ? customercomplaintSkip : this.props.Login.customercomplaintSkip;
            customercomplaintTake = this.props.Login.customercomplaintTake || customercomplaintTake;
            bool = true;
        }

        if (this.props.Login.masterData.transactionStatus !== previousProps.Login.masterData.transactionStatus) {
            const statusListMap = constructOptionList(this.props.Login.masterData.transactionStatus || [], "ntranscode", "stransdisplaystatus", "", "ascending", false);
            statusList = statusListMap.get("OptionList");
            bool = true;
        }

        if (bool) {
            this.setState({ userRoleControlRights, selectedRecord, controlMap, statusList, customercomplaintSkip, customercomplaintTake });
        }
    }
}


export default connect(mapStateToProps, {
    callService,
    updateStore,
    crudMaster,
    addGetRegion, editCustomerComplaint, getCustomerComplaintRecord, getCustomerComplaintDistrictLab,
    //modified 3 action(getDistrict, getVillage, getSubdivisionalLab) name sujatha ATE_274 23-09-2025 for an issue on calling action in sample scheduling 
     getCustomerComplaintVillage, getCustomerComplaintSubDivisionalLab, getCustomerComplaintData, validateEsignCredential, getInitiate, getClose, addCustomerComplaintFile, viewAttachmentCustomerComplaint, filterTransactionList, generateControlBasedReport
})(injectIntl(CustomerComplaint));