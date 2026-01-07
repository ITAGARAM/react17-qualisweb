import React from "react";
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Button, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { ContentPanel, ReadOnlyText } from "../../../components/App.styles";
import { getControlMap, convertDateTimetoStringDBFormat, showEsign, rearrangeDateFormat, convertDateValuetoString } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import Esign from '../../audittrail/Esign';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import {
    updateStore, getBioSampleReceiving, getListBioParentSampleReceiving, getDiseaseforAddParent, getBioProjectforLoggedInSite,
    getCollectionSiteBasedonProject, getHospitalBasedonSite, onValidateSubjectId, createBioParentSampleReceiving, getEditBioParentData,
    updateBioParentSampleReceiving, getBioSampleReceivingData, saveParentSampleCollection, getParentSampleCollection, deleteParentSampleCollection,
    filterTransactionList, validateEsignCredentialParentSampleReceiving, getParentSampleReceivingAndCollection
} from '../../../actions';
import AddBioParentSample from "./AddBioParentSample";
import AddParentSampleCollection from "./AddParentSampleCollection";
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ParentSampleReceivingAndCollection extends React.Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.searchFieldList = ["sparentsamplecode", "ncohortno", "sprojecttitle", "scollectionsitename", "shospitalname", "sarrivaldate"]
        this.state = {
            selectedRecord: {},
            selectedMasterRecord: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            skip: 0,
            error: "",
            take: this.props.Login.settings && this.props.Login.settings[3],
            splitChangeWidthPercentage: 30,
            selectedFilter: {},
               //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', collapsible:true }    
            ],
            
        };
        this.searchRef = React.createRef();

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

      //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };


    render() {
        const addID = this.state.controlMap.has("AddBioParentSample") && this.state.controlMap.get("AddBioParentSample").ncontrolcode;
        const editID = this.state.controlMap.has("EditBioParentSample") && this.state.controlMap.get("EditBioParentSample").ncontrolcode;
        const addMasterId = this.state.controlMap.has("AddBioParentSampleCollection") && this.state.controlMap.get("AddBioParentSampleCollection").ncontrolcode;
        const editMasterId = this.state.controlMap.has("EditBioParentSampleCollection") && this.state.controlMap.get("EditBioParentSampleCollection").ncontrolcode;
        const deleteMasterId = this.state.controlMap.has("DeleteBioParentSampleCollection") && this.state.controlMap.get("DeleteBioParentSampleCollection").ncontrolcode;
        let bioSampleCollection = this.props.Login.masterData ? this.props.Login.masterData.lstBioParentSampleCollection : [];
        const SubFields = [
            { [designProperties.VALUE]: "ncohortno" },
            { [designProperties.VALUE]: "sprojecttitle" },
            { [designProperties.VALUE]: "scollectionsitename" },
            { [designProperties.VALUE]: "shospitalname" },
            { [designProperties.VALUE]: "sarrivaldate" },
            { [designProperties.VALUE]: "sisthirdpartysharable" }, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            { [designProperties.VALUE]: "sissampleaccesable" }, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
        ];
        const addParentMandatoryFields = [
            { "idsName": "IDS_SUBJECTID", "dataField": "ssubjectid", "mandatory": true, "mandatoryLabel": "IDS_ENTER", },
            { "idsName": "IDS_DISEASE", "dataField": "ndiseasecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
            { "idsName": "IDS_BIOPROJECTTITLE", "dataField": "nbioprojectcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
            { "idsName": "IDS_COLLECTIONSITE", "dataField": "ncollectionsitecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
            { "idsName": "IDS_COLLECTEDHOSPITAL", "dataField": "nhospitalcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
            { "idsName": "IDS_ARRIVALDATETIME", "dataField": "darrivaldatetime", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
        ]

        this.extractedDataGridColumnList = [
            { "idsName": "IDS_SAMPLETYPE", "dataField": "sproductcatname", "width": "150px" },
            { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nnoofsamples", "width": "150px" },
            { "idsName": "IDS_STATUS", "dataField": "stransactionstatus", "width": "150PX" },
            { "idsName": "IDS_SAMPLECOLLECTIONDATEONLY", "dataField": "ssamplecollectiondate", "width": "150px" },
            { "idsName": "IDS_ARRIVINGATBIOBANKDATE", "dataField": "sbiobankarrivaldate", "width": "150px" },
            { "idsName": "IDS_RECIPIENTSNAME", "dataField": "srecipientusername", "width": "150px" },
            //changed input data to storagecondition master by sathish -> 06-AUG-2025
            { "idsName": "IDS_TEMPERATUREDEG", "dataField": "sstorageconditionname", "width": "150px" },
            { "idsName": "IDS_TEMPORARYSTORAGENAME", "dataField": "stemporarystoragename", "width": "150px" },
            { "idsName": "IDS_TEMPORARYSTORAGEDATE", "dataField": "stemporarystoragedate", "width": "150px" },
            { "idsName": "IDS_COLLECTORNAME", "dataField": "scollectorname", "width": "150px" },
            { "idsName": "IDS_SENDERNAME", "dataField": "ssendername", "width": "150px" },
            { "idsName": "IDS_INFORMATION", "dataField": "sinformation", "width": "150px" }
        ]

        this.extractedColumnList = [
            { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "250px" },
            { "idsName": "IDS_COHORTNUMBER", "dataField": "ncohortno", "width": "150px" },
            { "idsName": "IDS_RESEARHCER", "dataField": "sprojectincharge", "width": "150px" },
            { "idsName": "IDS_COLLECTIONSITE", "dataField": "scollectionsitename", "width": "150px" },
            { "idsName": "IDS_RECEIVINGSITE", "dataField": "sreceivingsitename", "width": "150px" },
            { "idsName": "IDS_SAMPLETYPE", "dataField": "nproductcatcode", "width": "150px" },
            { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nnoofsamples", "width": "150px" },
            { "idsName": "IDS_SAMPLECOLLECTIONDATEONLY", "dataField": "ssamplecollectiondate", "width": "150px" },
            { "idsName": "IDS_COLLECTORNAME", "dataField": "scollectorname", "width": "150px" },
            { "idsName": "IDS_TEMPORARYSTORAGEDATE", "dataField": "stemporarystoragedate", "width": "150px" },
            //changed input data to storagecondition master by sathish -> 06-AUG-2025
            { "idsName": "IDS_TEMPERATUREDEG", "dataField": "sstorageconditionname", "width": "150px" },
            { "idsName": "IDS_TEMPORARYSTORAGENAME", "dataField": "stemporarystoragename", "width": "150px" },
            { "idsName": "IDS_ARRIVINGATBIOBANKDATE", "dataField": "sbiobankarrivaldate", "width": "150px" },
            { "idsName": "IDS_SENDERNAME", "dataField": "ssendername", "width": "150px" },
            { "idsName": "IDS_RECIPIENTSNAME", "dataField": "srecipientusername", "width": "150px" },
            { "idsName": "IDS_INFORMATION", "dataField": "sinformation", "width": "150px" }
        ]

        const editParam = {
            screenName: "BioSampleCollection", primaryKeyField: "nbioparentsamplecollectioncode", operation: "update",
            inputParam: this.props.login && this.props.login.inputParam, masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, ncontrolCode: editMasterId, screenName: "IDS_PARENTSAMPLERECEIVING"
        };

        let mandatoryFields = [
            { "idsName": "IDS_SAMPLETYPE", "dataField": "nproductcatcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nnoofsamples", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_SAMPLECOLLECTIONDATEONLY", "dataField": "dsamplecollectiondate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
            { "idsName": "IDS_ARRIVINGATBIOBANKDATE", "dataField": "dbiobankarrivaldate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
            { "idsName": "IDS_RECIPIENTSNAME", "dataField": "nrecipientusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "textbox" },
            { "idsName": "IDS_TEMPERATUREDEG", "dataField": "nstorageconditioncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },        
        ];
        const filterParam = {
            inputListName: "lstBioParentSampleReceiving", selectedObject: "selectedBioParentSampleReceiving", primaryKeyField: "nbioparentsamplecode",
            fetchUrl: "bioparentsamplereceiving/getActiveBioParentSampleReceiving", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            // filteredListName: "searchedBioParentSampleReceiving",
            clearFilter: "no",
            updatedListname: "selectedBioParentSampleReceiving",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioParentSampleReceiving',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        let breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto
            }
        ];
        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        // <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        // </Affix> 
                        : ""
                    }
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height'>
                            <ListWrapper className={` ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div>
                                    {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                         {/* Commented SplitterLayout and added Splitter by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17 */}
                                        <Splitter className='layout-splitter' orientation="horizontal"
                                                  panes={this.state.panes} onChange={this.onSplitterChange}>
                                            <SplitterPane size="30%" min="25%">
                                                <TransactionListMasterJsonView
                                                    splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                    needMultiSelect={false}
                                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioParentSampleReceiving || []}
                                                    selectedMaster={[this.props.Login.masterData.selectedBioParentSampleReceiving] || []}
                                                    primaryKeyField="nbioparentsamplecode"
                                                    getMasterDetail={(Sample, status) =>
                                                        this.props.getBioSampleReceiving(
                                                            {
                                                                masterData: this.props.Login.masterData,
                                                                userinfo: this.props.Login.userInfo,
                                                                ...Sample
                                                            }, status
                                                        )}
                                                    subFieldsLabel={false}
                                                    additionalParam={['']}
                                                    mainField={'sparentsamplecode'}
                                                    filterColumnData={this.props.filterTransactionList}
                                                    subFields={SubFields}
                                                    statusFieldName="stransdisplaystatus"
                                                    statusField="ntransactionstatus"
                                                    statusColor="stranscolor"
                                                    showStatusIcon={false}
                                                    showStatusName={true}
                                                    needFilter={true}
                                                    searchRef={this.searchRef}
                                                    filterParam={filterParam}
                                                    skip={this.state.skip}
                                                    take={this.state.take}
                                                    handlePageChange={this.handlePageChange}
                                                    showStatusBlink={true}
                                                    callCloseFunction={true}
                                                    childTabsKey={[]}
                                                    onFilterSubmit={this.onFilterSubmit}
                                                    closeFilter={this.closeFilter}
                                                    splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                    commonActions={
                                                        <>
                                                            <ProductList className="d-flex product-category float-right">
                                                                <Nav.Link
                                                                    className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                                    onClick={() => this.addBioParentSample(addID, 'create', 'IDS_PARENTSAMPLERECEIVING')} >
                                                                    <FontAwesomeIcon icon={faPlus} />
                                                                </Nav.Link>
                                                                <Nav.Link
                                                                    className="btn btn-circle outline-grey ml-2 p-0" role="button"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(editID) === -1}
                                                                    onClick={() => this.editBioParentSample(editID, 'update', 'IDS_PARENTSAMPLERECEIVING')} >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
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
                                                            "Date Filter":
                                                                <div className="side_more_filter_wrap">
                                                                    <Row>
                                                                        <Col md={6}>
                                                                            <DateTimePicker
                                                                                name={"fromdate"}
                                                                                label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                                                                                className='form-control'
                                                                                placeholderText="Select date.."
                                                                                selected={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                                                dateFormat={this.props.Login.userInfo["ssitedate"]}
                                                                                isClearable={false}
                                                                                onChange={date => this.handleFilterDateChange("fromdate", date)}
                                                                                value={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                                            />
                                                                        </Col>
                                                                        <Col md={6}>
                                                                            <DateTimePicker
                                                                                name={"todate"}
                                                                                label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                                                                                className='form-control'
                                                                                placeholderText="Select date.."
                                                                                selected={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                                                                dateFormat={this.props.Login.userInfo["ssitedate"]}
                                                                                isClearable={false}
                                                                                onChange={date => this.handleFilterDateChange("todate", date)}
                                                                                value={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}

                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                        }
                                                    ]}
                                                />
                                            </SplitterPane>
                                                <SplitterPane size="70%" min="25%">
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        {
                                                            this.props.Login.masterData.selectedBioParentSampleReceiving ? Object.entries(this.props.Login.masterData.selectedBioParentSampleReceiving).length > 0 ?
                                                                <>
                                                                    <Card.Text>
                                                                        <Row className="mt-3">
                                                                            <>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_PARENTSAMPLECODE"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.sparentsamplecode === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.sparentsamplecode}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_COHORTNUMBER"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.ncohortno === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.ncohortno}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_BIOPROJECTTITLE"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.sprojecttitle === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.sprojecttitle}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_PI"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.sprojectincharge === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.sprojectincharge}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_COLLECTIONSITE"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.scollectionsitename === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.scollectionsitename}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_COLLECTEDHOSPITAL"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.shospitalname === "" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.shospitalname}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>

                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_SUGGESTEDSTORAGE"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            this.props.Login.masterData.selectedBioParentSampleReceiving.sinstrumentid === "NA" ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.sinstrumentid}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="4">
                                                                                    <FormGroup>
                                                                                        <FormLabel><FormattedMessage id={"IDS_STORAGE_TEMPERATURE"} /></FormLabel>
                                                                                        <ReadOnlyText>{
                                                                                            (this.props.Login.masterData.selectedBioParentSampleReceiving.sstoragetemperature === "NA" || this.props.Login.masterData.selectedBioParentSampleReceiving.nstorageinstrumentcode === -1) ? '-'
                                                                                                : this.props.Login.masterData.selectedBioParentSampleReceiving.sstoragetemperature}</ReadOnlyText>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            </>
                                                                        </Row>
                                                                    </Card.Text>
                                                                    <Row >
                                                                    <Col md={12} className="side-padding">
                                                                    <DataGrid
                                                                        primaryKeyField={"nbioparentsamplecollectioncode"}
                                                                        dataResult={bioSampleCollection &&
                                                                            bioSampleCollection.length > 0 &&
                                                                            process(bioSampleCollection, this.state.dataState) || []}
                                                                        data={bioSampleCollection || []}
                                                                        dataState={this.state.dataState || []}
                                                                        dataStateChange={this.dataStateChange}
                                                                        extractedColumnList={this.extractedDataGridColumnList}
                                                                        controlMap={this.state.controlMap}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        methodUrl="BioParentSampleCollection"
                                                                        addRecord={() => this.openModal(addMasterId, 'create', 'IDS_PARENTSAMPLECOLLECTION')}
                                                                        fetchRecord={this.props.getParentSampleCollection}
                                                                        editParam={editParam}
                                                                        deleteRecord={this.deleteRecord}
                                                                        deleteParam={{ operation: "delete", screenName: "IDS_PARENTSAMPLECOLLECTION", ncontrolCode: deleteMasterId }}
                                                                        pageable={true}
                                                                        scrollable={"scrollable"}
                                                                        isToolBarRequired={true}
                                                                        selectedId={this.props.Login.selectedId}
                                                                        hideColumnFilter={false}
                                                                        groupable={false}
                                                                        isActionRequired={true}
                                                                        /* chaged by sathish 11-aug-2025 responsive */
                                                                        gridHeight={'calc(100vh - 300px)'}
                                                                        isRefreshRequired={false}
                                                                        isDownloadPDFRequired={false}
                                                                        isDownloadExcelRequired={false}
                                                                    />
                                                                    </Col>
                                                                </Row>
                                                                </>
                                                                : "" : ""}
                                                    </Card>
                                                </ContentPanel>
                                         </SplitterPane>
                                        </Splitter>
                            {/* </SplitterLayout> */}
                        </div>
                </ListWrapper>
            </Col >
                    </Row >
                </ListWrapper >
            {(this.props.Login.addParentModal || this.props.Login.openModal) ?
            <SlideOutModal
                show={(this.props.Login.addParentModal || this.props.Login.openModal)}
                closeModal={this.closeModal}
                operation={this.props.Login.operation}
                inputParam={this.props.Login.inputParam}
                screenName={this.props.Login.screenName}
                esign={this.props.Login.loadEsign}
                onSaveClick={this.props.Login.addParentModal ? this.onSaveParentClick : this.onSaveClick}
                validateEsign={this.validateEsign}
                masterStatus={this.props.Login.masterStatus}
                updateStore={this.props.updateStore}
                showSaveContinue={this.props.Login.loadParentSampleCollection ? true : false}
                mandatoryFields={this.props.Login.addParentModal ? addParentMandatoryFields : mandatoryFields}
                selectedRecord={this.props.Login.addParentModal ? this.state.selectedRecord || {} :
                    this.props.Login.loadEsign ? {
                        ...this.state.selectedChildRecord,
                        'esignpassword': this.state.selectedRecord['esignpassword'],
                        'esigncomments': this.state.selectedRecord['esigncomments'],
                        'esignreason': this.state.selectedRecord['esignreason']
                    } : this.state.selectedChildRecord || {}
                }
                // showSaveContinue={this.state.showSaveContinue}
                addComponent={this.props.Login.loadEsign ?
                    <Esign operation={this.props.Login.operation}
                        onInputOnChange={this.onInputOnChangeESign}
                        inputParam={this.props.Login.inputParam}
                        selectedRecord={this.state.selectedRecord || {}}
                    />
                    : this.props.Login.addParentModal ?
                        <AddBioParentSample
                            //Added by ATE-234 Janakumar BGSI-13
                            userInfo={this.props.Login.userInfo}
                            selectedRecord={this.state.selectedRecord || {}}
                            diseaseList={this.props.Login.diseaseList || []}
                            bioprojectList={this.props.Login.bioprojectList || []}
                            collectionsiteList={this.props.Login.collectionsiteList || []}
                            collectedHospitalList={this.props.Login.collectedHospitalList || []}
                            storagestructureList={this.props.Login.storagestructureList || []}
                            isValidSubjectID={this.props.Login.isValidSubjectID || false}
                            scasetype={this.props.Login.scasetype || ""}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            handleDateChange={this.handleDateChange}
                            onValidateSubjectId={this.onValidateSubjectId}
                            formatMessage={this.props.intl.formatMessage}
                            operation={this.props.Login.operation}
                            isValidated={this.props.Login.isValidSubjectID || false}
                        />
                        : this.props.Login.loadParentSampleCollection ?
                            <AddParentSampleCollection
                                selectedChildRecord={this.state.selectedChildRecord || {}}
                                onInputOnChange={this.onInputOnChangeChild}
                                onComboChange={this.onComboChangeChild}
                                handleDateChange={this.handleDateChangeChild}
                                formatMessage={this.props.intl.formatMessage}
                                operation={this.props.Login.operation}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                onFocus={this.handleFocus}
                            />
                            : ""}
            /> : ""
    }
            </>
        );
    }


componentDidUpdate(previousProps) {
    if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
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

    let { selectedChildRecord, selectedRecord, selectedFilter, skip, take, dataState } = this.state;
    let updateState = false;

    if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
        selectedRecord = this.props.Login.selectedRecord;
        updateState = true;
    }

    if (this.props.Login.isValidSubjectID !== previousProps.Login.isValidSubjectID) {
        selectedRecord['isValidSubjectID'] = this.props.Login.isValidSubjectID || false;
        updateState = true;
    }
    if (this.props.Login.scasetype !== previousProps.Login.scasetype) {
        selectedRecord['scasetype'] = this.props.Login.scasetype || "";
        updateState = true;
    }
    // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
    if (this.props.Login.nisthirdpartysharable !== previousProps.Login.nisthirdpartysharable) {
        selectedRecord['nisthirdpartysharable'] = this.props.Login.nisthirdpartysharable || "";
        updateState = true;
    }
    // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
    if (this.props.Login.nissampleaccesable !== previousProps.Login.nissampleaccesable) {
        selectedRecord['nissampleaccesable'] = this.props.Login.nissampleaccesable || "";
        updateState = true;
    }

    if (this.props.Login.selectedFilter !== previousProps.Login.selectedFilter) {
        selectedFilter = this.props.Login.selectedFilter;
        updateState = true;
    }

    if (this.props.Login.selectedChildRecord !== previousProps.Login.selectedChildRecord) {
        updateState = true;
        selectedChildRecord = this.props.Login.selectedChildRecord;
    }

    if (this.props.Login.dataState !== previousProps.Login.dataState) {
        updateState = true;
        dataState = {
            skip: 0,
            take: take,
        }
        skip = 0;
        take = take;
    }

    if (updateState) {
        this.setState({
            selectedChildRecord, selectedRecord, selectedFilter, dataState, skip, take
        })
    }
}

openModal = (ncontrolcode, operation, screenName) => {
    let nbioParentSampleCode = this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleReceiving ?
        this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode : -1;
    this.props.getBioSampleReceivingData(nbioParentSampleCode, this.props.Login.userInfo, this.props.Login.masterData, operation, screenName, ncontrolcode);
}

onInputOnChangeESign = (event) => {

    const selectedRecord = this.state.selectedRecord || {};
    const selectedChildRecord = this.state.selectedChildRecord || {};
    if (event.target.type === 'checkbox') {
        if (event.target.name === "agree") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            selectedChildRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
    }
    else if (event.target.type === 'select-one') {

        selectedRecord[event.target.name] = event.target.value;
    }
    else {
        selectedRecord[event.target.name] = event.target.value;
    }

    this.setState({ selectedRecord, selectedChildRecord });
}


onInputOnChange = (event, fieldName) => {
    const selectedRecord = this.state.selectedRecord || {};
    let masterData = { ...this.props.Login.masterData };
    selectedRecord[event.target.name] = event.target.value
    if (fieldName === "ssubjectid") {
        selectedRecord['scasetype'] = "";
        selectedRecord['nisthirdpartysharable'] = ""; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
        selectedRecord['nissampleaccesable'] = ""; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
        selectedRecord['isValidSubjectID'] = false;
    }
    // this.setState({ selectedRecord });
    const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
            masterData,
            scasetype: "",
            nisthirdpartysharable: "", // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            nissampleaccesable: "", // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            selectedRecord, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            isValidSubjectID: false,
        }
    }
    this.props.updateStore(updateInfo);

}

onInputOnChangeChild = (event, fieldName) => {
    const selectedChildRecord = this.state.selectedChildRecord || {};
    //changed input data to storagecondition master by sathish -> 06-AUG-2025
    if (fieldName === "nnoofsamples") {
        if (/^-?\d*?\.?\d*?$/.test(event.target.value)) {
            selectedChildRecord[event.target.name] = event.target.value;
            this.setState({ selectedChildRecord });
        }
    }
    else {
        selectedChildRecord[event.target.name] = event.target.value;
        this.setState({ selectedChildRecord });
    }
}

onComboChange = (comboData, fieldName) => {
    const selectedRecord = this.state.selectedRecord || {};
    let masterData = { ...this.props.Login.masterData };
    selectedRecord[fieldName] = comboData;
    if (fieldName === "ndiseasecode") {
        this.props.getBioProjectforLoggedInSite({
            masterData: masterData,
            ndiseasecode: selectedRecord.ndiseasecode.value,
            userinfo: this.props.Login.userInfo,
        });
        selectedRecord["nbioprojectcode"] = "";
        selectedRecord["ncollectionsitecode"] = "";
        selectedRecord["nhospitalcode"] = "";
    }
    if (fieldName === "nbioprojectcode") {
        this.props.getCollectionSiteBasedonProject({
            masterData: masterData,
            nbioprojectcode: selectedRecord.nbioprojectcode.value,
            userinfo: this.props.Login.userInfo,
        });
        selectedRecord["ncollectionsitecode"] = "";
        selectedRecord["nhospitalcode"] = "";
    }
    if (fieldName === "ncollectionsitecode") {
        this.props.getHospitalBasedonSite({
            masterData: masterData,
            ncollectionsitecode: selectedRecord.ncollectionsitecode.value,
            userinfo: this.props.Login.userInfo,
        });
        selectedRecord["nhospitalcode"] = "";
    }

    this.setState({ selectedRecord });
}

onComboChangeChild = (comboData, fieldName) => {
    const selectedChildRecord = this.state.selectedChildRecord || {};
    selectedChildRecord[fieldName] = comboData;;
    this.setState({ selectedChildRecord });
}

handlePageChange = e => {
    this.setState({
        skip: e.skip,
        take: e.take
    });
};

handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    selectedRecord[dateName] = dateValue;
    this.setState({ selectedRecord });
};

handleFilterDateChange = (dateName, dateValue) => {
    const { selectedFilter } = this.state;
    if (dateValue === null) {
        dateValue = new Date();
    }
    selectedFilter[dateName] = dateValue;
    this.setState({ selectedFilter });
}

onFilterSubmit = () => {
    const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate);
    const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.toDate);
    let masterData = {
        ...this.props.Login.masterData, realFromDate, realToDate
    }
    const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate,
        this.state.selectedFilter.todate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
    let inputData = {
        fromDate: obj.fromDate,
        toDate: obj.toDate,
        userinfo: this.props.Login.userInfo
    }
    const inputParam = {
        masterData, inputData
    }

    this.props.getParentSampleReceivingAndCollection(inputParam);
}

closeFilter = () => {
    let masterData = this.props.Login.masterData;
    masterData['fromDate'] = this.props.Login.masterData.realFromDate || new Date();
    masterData['toDate'] = this.props.Login.masterData.realToDate || new Date();
    let selectedFilter = {
        fromdate: this.props.Login.masterData.realFromDate || new Date(),
        todate: this.props.Login.masterData.realToDate || new Date()
    };
    const updateInfo = {
        typeName: DEFAULT_RETURN,
        // data: { showFilter: false, filterSubmitValueEmpty: false, masterData: { ...this.props.Login.masterData, ...Map.inputValues }, selectedFilter: { todate: Map.inputValues.toDate, fromdate: Map.inputValues.fromDate } }
        data: { showFilter: false, filterSubmitValueEmpty: false, masterData, selectedFilter }
    }
    this.props.updateStore(updateInfo);
}

handleDateChangeChild = (dateName, dateValue) => {
    const { selectedChildRecord } = this.state;
    selectedChildRecord[dateName] = dateValue;
    this.setState({ selectedChildRecord });
}

onValidateSubjectId = () => {
    const selectedRecord = this.state.selectedRecord || {};
    const ssubjectid = (selectedRecord.ssubjectid || "").trim();

    if (ssubjectid === "") {
        toast.info(this.props.intl.formatMessage({ id: "IDS_SUBJECTID" }).concat(" ").concat(this.props.intl.formatMessage({ id: "IDS_IS EMPTY" }).toLowerCase()));
        return;
    }

    let masterData = { ...this.props.Login.masterData };

    this.props.onValidateSubjectId({
        ssubjectid: ssubjectid,
        userinfo: this.props.Login.userInfo,
        masterData: masterData
    });
};


closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    let openChildModal = this.props.Login.openChildModal;
    let selectedChildRecord = this.props.Login.selectedChildRecord;
    let selectedRecord = this.props.Login.selectedRecord;
    let addParentModal = this.props.Login.addParentModal;
    let loadParentSampleCollection = this.props.Login.loadParentSampleCollection;
    let scasetype = this.state.selectedRecord && this.state.selectedRecord.scasetype ? this.state.selectedRecord.scasetype : this.props.Login && this.props.Login.scasetype ? this.props.Login.scasetype : "";
    let isValidSubjectID = this.state.selectedRecord && this.state.selectedRecord.isValidSubjectID ? this.state.selectedRecord.isValidSubjectID : this.props.Login && this.props.Login.isValidSubjectID ? this.props.Login.isValidSubjectID : false;
    let nisthirdpartysharable = null; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
    let nissampleaccesable = null; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
    if (this.props.Login.loadEsign) {
        if (this.props.Login.operation === "delete") {
            loadEsign = false;
            openModal = false;
            openChildModal = false;
            addParentModal = false;
            selectedRecord = { nprojecttypecode: this.state.selectedRecord.nprojecttypecode };
            selectedChildRecord = {};
        }
        else {
            loadEsign = false;
            selectedRecord['esignpassword'] = undefined;
            selectedRecord['esigncomments'] = undefined;
            selectedRecord['esignreason'] = undefined;
            nisthirdpartysharable = this.state.selectedRecord && this.state.selectedRecord.nisthirdpartysharable ? this.state.selectedRecord.nisthirdpartysharable : this.props.Login && this.props.Login.nisthirdpartysharable ? this.props.Login.nisthirdpartysharable : transactionStatus.NO;
            nissampleaccesable = this.state.selectedRecord && this.state.selectedRecord.nissampleaccesable ? this.state.selectedRecord.nissampleaccesable : this.props.Login && this.props.Login.nissampleaccesable ? this.props.Login.nissampleaccesable : transactionStatus.NO;
        }
    }
    else if (addParentModal && this.props.Login?.operation === "create") {
        addParentModal = false;
        scasetype = "";
        isValidSubjectID = false;
        selectedRecord = {};
        selectedChildRecord = {};
        loadParentSampleCollection = false;
    }
    else {
        openModal = false;
        selectedRecord = {};
        addParentModal = false;
        selectedChildRecord = {};
        loadParentSampleCollection = false;
    }

    const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
            openModal, loadEsign, selectedRecord, selectedId: null, scasetype, isValidSubjectID, addParentModal, openChildModal,
            selectedChildRecord, loadParentSampleCollection, nisthirdpartysharable, nissampleaccesable
        }
    }
    this.props.updateStore(updateInfo);

}

deleteRecord = (deleteParam) => {
    if (deleteParam.selectedRecord.ntransactionstatus !== transactionStatus.UNPROCESSED) {
        return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELETNOTYETPROCESSEDSTATUSRECORD" }));
    }
    let inputData = [];
    let inputParam = {};
    let masterData = this.props.Login.masterData || {};
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["nbioparentsamplecollectioncode"] = deleteParam.selectedRecord.nbioparentsamplecollectioncode;
    inputData["nbioparentsamplecode"] = deleteParam.selectedRecord.nbioparentsamplecode;
    inputParam = {
        classUrl: "bioparentsamplereceiving",
        methodUrl: "ParentSampleCollection",
        inputData: inputData,
        operation: "delete"
    }
    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, openModal: true, operation: "delete", screenData: { inputParam, masterData, selectedRecord: deleteParam.selectedRecord, modalOperation: "deleteChild" }
            }
        }
        this.props.updateStore(updateInfo);
    } else {
        this.props.deleteParentSampleCollection(inputParam, masterData);
    }

}

dataStateChange = (event) => {
    let bioSampleCollection = this.props.Login.masterData ? this.props.Login.masterData.lstBioParentSampleCollection : []
    this.setState({
        dataResult: process(bioSampleCollection ? bioSampleCollection : [], event.dataState),
        dataState: event.dataState
    });
}

onReload = () => {
    let masterData = { ...this.props.Login.masterData };
    let userinfo = this.props.Login.userInfo;
    let take = this.state.take;
    const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate,
        this.state.selectedFilter.todate || this.props.Login.masterData.toDate, this.props.Login.userInfo);
    let inputData = {
        fromDate: obj.fromDate,
        toDate: obj.toDate,
        userinfo: userinfo
    };
    let inputParam = { masterData, userinfo, take, dataState: this.state.dataState, searchRef: this.searchRef, inputData };
    this.props.getListBioParentSampleReceiving(inputParam);
}

addBioParentSample = (ncontrolcode, operation, screenName) => {
    let masterData = { ...this.props.Login.masterData };
    let userinfo = this.props.Login.userInfo;
    let inputParam = {
        masterData,
        userinfo,
        operation: operation,
        screenName: screenName,
        ncontrolcode: ncontrolcode
    };
    this.props.getDiseaseforAddParent(inputParam);
}

editBioParentSample = (ncontrolcode, operation, screenName) => {
    if(this.props.Login.masterData.selectedBioParentSampleReceiving != null 
        && this.props.Login.masterData.selectedBioParentSampleReceiving !=undefined)
    {
    let masterData = { ...this.props.Login.masterData };
    let userinfo = this.props.Login.userInfo;
    let nbioparentsamplecode = this.props.Login.masterData
        && this.props.Login.masterData.selectedBioParentSampleReceiving && this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode
        ? this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode : '-1';
    let nbioprojectcode = this.props.Login.masterData
        && this.props.Login.masterData.selectedBioParentSampleReceiving && this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode
        ? this.props.Login.masterData.selectedBioParentSampleReceiving.nbioprojectcode : '-1';
    let inputParam = {
        masterData,
        userinfo,
        nbioprojectcode,
        nbioparentsamplecode,
        operation: operation,
        screenName: screenName,
        ncontrolcode: ncontrolcode
    };
    this.props.getEditBioParentData(inputParam);
    }
    else{
        toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTPAERNTRECORDTOEDIT" }));
    }
    
}

onSaveParentClick = (saveType, formRef) => {
    const selectedRecord = this.state.selectedRecord || {};
    let postParam = undefined;

    let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);

    // const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.fromDate);
    // const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.toDate);
    let inputParam = {};
    if (this.props.Login.operation === 'create') {
        if (selectedRecord.isValidSubjectID) {
            let inputData = {
                ssubjectid: selectedRecord.ssubjectid || "",
                scasetype: selectedRecord.scasetype || "",
                nisthirdpartysharable: selectedRecord.nisthirdpartysharable || 4, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                nissampleaccesable: selectedRecord.nissampleaccesable || 4, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                isValidSubjectID: selectedRecord.isValidSubjectID || false,
                ndiseasecode: selectedRecord.ndiseasecode && selectedRecord.ndiseasecode.value ? selectedRecord.ndiseasecode.value : -1,
                nbioprojectcode: selectedRecord.nbioprojectcode && selectedRecord.nbioprojectcode.value ? selectedRecord.nbioprojectcode.value : -1,
                ncollectionsitecode: selectedRecord.ncollectionsitecode && selectedRecord.ncollectionsitecode.value ? selectedRecord.ncollectionsitecode.value : -1,
                ncollectedhospitalcode: selectedRecord.nhospitalcode && selectedRecord.nhospitalcode.value ? selectedRecord.nhospitalcode.value : -1,
                darrivaldate: selectedRecord.darrivaldatetime,
                sarrivaldate: selectedRecord.darrivaldatetime && selectedRecord.darrivaldatetime !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.darrivaldatetime, this.props.Login.userInfo) : '',
                nstorageinstrumentcode: selectedRecord.nstoragelocationcode && selectedRecord.nstoragelocationcode.value ? selectedRecord.nstoragelocationcode.value : -1,
                userinfo: this.props.Login.userInfo,
                //Added for jira-bgsi-147 for email
                ncontrolcode:this.props.Login.ncontrolcode,
                parentsamplereceiving: {
                    sarrivaldate: selectedRecord.darrivaldatetime && selectedRecord.darrivaldatetime !== null ?
                        convertDateTimetoStringDBFormat(selectedRecord.darrivaldatetime, this.props.Login.userInfo) : '',
                
                },
                fromDate: obj.fromDate,
                toDate: obj.toDate  
            };

            inputParam["userinfo"] = this.props.Login.userInfo;
            inputParam["masterData"] = this.props.Login.masterData;
            inputParam["inputData"] = inputData;
            inputParam["skip"] = this.state.skip;
            inputParam["take"] = this.state.take;

            this.props.createBioParentSampleReceiving(inputParam);

        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_VALIDATESUBJECTID" }));
        }
    }
    if (this.props.Login.operation === 'update') {
        let masterData = { ...this.props.Login.masterData };
        let inputParam = {
        }
        let inputData = {
            nbioparentsamplecode: this.props.Login.masterData
                && this.props.Login.masterData.selectedBioParentSampleReceiving && this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode
                ? this.props.Login.masterData.selectedBioParentSampleReceiving.nbioparentsamplecode : '-1',
            ssubjectid: selectedRecord.ssubjectid || "",
            scasetype: selectedRecord.scasetype || "",
            nisthirdpartysharable: selectedRecord.nisthirdpartysharable || 4, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            nissampleaccesable: selectedRecord.nissampleaccesable || 4, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            ndiseasecode: selectedRecord.ndiseasecode && selectedRecord.ndiseasecode.value ? selectedRecord.ndiseasecode.value : -1,
            nbioprojectcode: selectedRecord.nbioprojectcode && selectedRecord.nbioprojectcode.value ? selectedRecord.nbioprojectcode.value : -1,
            ncollectionsitecode: selectedRecord.ncollectionsitecode && selectedRecord.ncollectionsitecode.value ? selectedRecord.ncollectionsitecode.value : -1,
            ncollectedhospitalcode: selectedRecord.nhospitalcode && selectedRecord.nhospitalcode.value ? selectedRecord.nhospitalcode.value : -1,
            darrivaldate: selectedRecord.darrivaldatetime,
            sarrivaldate: selectedRecord.darrivaldatetime && selectedRecord.darrivaldatetime !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.darrivaldatetime, this.props.Login.userInfo) : '',
            nstorageinstrumentcode: selectedRecord.nstoragelocationcode && selectedRecord.nstoragelocationcode.value ? selectedRecord.nstoragelocationcode.value : -1,
            userinfo: this.props.Login.userInfo,
            //  searchRef: this.searchRef,
            parentsamplereceiving: {
                sarrivaldate: selectedRecord.darrivaldatetime && selectedRecord.darrivaldatetime !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.darrivaldatetime, this.props.Login.userInfo) : '',
            }
        };

        inputParam["userinfo"] = this.props.Login.userInfo;
        inputParam["masterData"] = masterData;
        inputParam["inputData"] = inputData;
        inputParam["saveType"] = saveType;
        inputParam["formRef"] = formRef;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData, selectedRecord, modalOperation: "updateParent" }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.updateBioParentSampleReceiving(inputParam);
        }
    }
}

onSaveClick = (saveType, formRef) => {
    let inputData = [];
    let selectedChildRecord = this.state.selectedChildRecord;
    let masterData = this.props.Login.masterData;
    inputData["userinfo"] = this.props.Login.userInfo;
  //Added for jira-bgsi-147 for email
    inputData["ncontrolcode"] = this.props.Login.ncontrolcode;
    let postParam = undefined;
    // const noOfSamples = Number(selectedChildRecord.nnoofsamples);

    // if (!noOfSamples || noOfSamples <= 0) {
    //     return toast.warn(
    //         this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLESCANNOTBEZERO" })
    //     );
    // }

    inputData["parentsamplecollection"] = {
        "nbioparentsamplecollectioncode": this.props.Login.selectedId,
        "nbioparentsamplecode": (masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.nbioparentsamplecode && masterData.selectedBioParentSampleReceiving.nbioparentsamplecode) || -1,
        "nbioprojectcode": (masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.nbioprojectcode && masterData.selectedBioParentSampleReceiving.nbioprojectcode) || -1,
        "nreceivingsitecode": this.props.Login.userInfo.ntranssitecode,
        "nproductcatcode": selectedChildRecord.nproductcatcode && selectedChildRecord.nproductcatcode.value,
        "nnoofsamples": selectedChildRecord.nnoofsamples && selectedChildRecord.nnoofsamples || 1,
        //changed input data to storagecondition master by sathish -> 06-AUG-2025
        "nstorageconditioncode": selectedChildRecord.nstorageconditioncode && selectedChildRecord.nstorageconditioncode.value || -1,
        // "ntemperature": selectedChildRecord.ntemperature && selectedChildRecord.ntemperature,
        "scollectorname": selectedChildRecord.scollectorname || "",
        "stemporarystoragename": selectedChildRecord.stemporarystoragename || "",
        "ssendername": selectedChildRecord.ssendername || "",
        "nrecipientusercode": (selectedChildRecord.nrecipientusercode && selectedChildRecord.nrecipientusercode.value) || -1,
        "sinformation": selectedChildRecord.sinformation || "",
        "ssamplecollectiondate": selectedChildRecord.dsamplecollectiondate && selectedChildRecord.dsamplecollectiondate !== null ?
            convertDateTimetoStringDBFormat(selectedChildRecord.dsamplecollectiondate, this.props.Login.userInfo) : '',
        "sbiobankarrivaldate": selectedChildRecord.dbiobankarrivaldate && selectedChildRecord.dbiobankarrivaldate !== null ?
            convertDateTimetoStringDBFormat(selectedChildRecord.dbiobankarrivaldate, this.props.Login.userInfo) : '',
        "stemporarystoragedate": selectedChildRecord.dtemporarystoragedate && selectedChildRecord.dtemporarystoragedate !== null ?
            convertDateTimetoStringDBFormat(selectedChildRecord.dtemporarystoragedate, this.props.Login.userInfo) : '',
        "jsonuidata": {
            nbioparentsamplecode: (masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.nbioparentsamplecode) || -1,
            ncohortno: masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.ncohortno,
            sprojectincharge: masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.sprojectincharge,
            scollectionsitename: masterData.selectedBioParentSampleReceiving && masterData.selectedBioParentSampleReceiving.scollectionsitename,
            sreceivingsitename: this.props.Login.userInfo.ssitename
        }
    };
    const inputParam = {
        classUrl: "bioparentsamplereceiving",
        methodUrl: "ParentSampleCollection",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType, formRef, postParam, searchRef: this.searchRef,
        selectedRecord: { ...this.state.selectedChildRecord }
    }
    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadEsign: true, screenData: {
                    inputParam,
                    masterData,
                    selectedRecord: { ...this.state.selectedChildRecord },
                    modalOperation: "updateChild"
                }, saveType
            }
        }
        this.props.updateStore(updateInfo);
    } else {
        this.props.saveParentSampleCollection(inputParam, masterData, "openModal");
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

    this.props.validateEsignCredentialParentSampleReceiving(inputParam);

}

handleFocus(e) {
    e.target.select();
}

}
export default connect(mapStateToProps, {
    updateStore, getBioSampleReceiving, getListBioParentSampleReceiving, getDiseaseforAddParent,
    onValidateSubjectId, getBioProjectforLoggedInSite, getCollectionSiteBasedonProject, getHospitalBasedonSite,
    createBioParentSampleReceiving, getEditBioParentData, updateBioParentSampleReceiving, getBioSampleReceivingData,
    saveParentSampleCollection, getParentSampleCollection, deleteParentSampleCollection, filterTransactionList,
    validateEsignCredentialParentSampleReceiving, showEsign, rearrangeDateFormat, getParentSampleReceivingAndCollection
})(injectIntl(ParentSampleReceivingAndCollection));