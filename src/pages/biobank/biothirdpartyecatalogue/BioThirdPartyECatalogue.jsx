import { faEnvelope, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import React from "react";
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { toast } from 'react-toastify';
import {
    cancelThirdPartyECatalogueRequest,
    createThirdPartyECatalogueRequest,
    deleteThirdPartyECatalogueRequestSample,
    filterTransactionList,
    getActiveThirdPartyECatalogueRequestForm,
    getActiveThirdPartyECatalogueSampleDetail,
    getThirdPartyCatalogueCombo, getThirdPartyECatalogueByFilterSubmit,
    getThirdPartyECatalogueComboforAdd,
    getThirdPartyProductComboDataForSampleAdd,
    saveThirdPartyECatalogueRequestSample,
    sendThirdPartyECatalogueRequest,
    updateStore,
    validateEsignforThirdPartyECatalogue
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { ReactComponent as GridSolidIcon } from '../../../assets/image/grid3-round-solid.svg';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ReactComponent as Reject } from '../../../assets/image/reject.svg';
import { ContentPanel } from "../../../components/App.styles";
import BreadcrumbComponent from "../../../components/Breadcrumb.Component";
import {
    constructOptionList,
    convertDateTimetoStringDBFormat,
    convertDateValuetoString,
    getControlMap,
    onSaveMandatoryValidation,
    rearrangeDateFormat,
    showEsign
} from '../../../components/CommonScript';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { designProperties, RequestFormType, transactionStatus } from '../../../components/Enumeration';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import Esign from '../../audittrail/Esign';
import { ProductList } from '../../product/product.styled';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import AddBioThirdPartyECatalogueReqSamples from "./AddBioThirdPartyECatalogueReqSamples";
import AddBioThirdPartyECatalogueRequest from "./AddBioThirdPartyECatalogueRequest";
import BioThirdPartyECatalogueFilter from "./BioThirdPartyECatalogueFilter";
import BioThirdPartyECatalogueModal from "./BioThirdPartyECatalogueModal";
import ViewBioThirdPartyECatalogueRequest from "./ViewBioThirdPartyECatalogueRequest";

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class BioThirdPartyECatalogue extends React.Component {
    constructor(props) {
        super(props);
        const sampleState = {
            skip: 0, take: this.props.Login.settings ?
                parseInt(this.props.Login.settings[14]) : 5
        };
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.breadCrumbData = [];
        this.searchFieldList = ["sformnumber", "sreceivingsitename", "srequesteddate", "stransactionstatus", "sprojecttitles"];
        this.state = {
            selectedRecord: {},
            selectedMasterRecord: {},
            selectedFilter: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            sampleState: sampleState,
            skip: 0,
            error: "",
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 30,
            stateFilterStatus: [],
            shouldRender: true,
            selectedChildRecord: {},
            showCatalogueModal: true,
            data: [],
            selectedFreezerRecord: {},
            initialSelectedFreezerRecord: {},

             //Added by L.Subashini on 23/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', collapsible:true }
            ],
        };
        this.searchRef = React.createRef();
        this.childFormData = null;
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

    //Added by L.Subashini on 23/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };


    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.Login?.masterData?.showCatalogueModal) && nextProps.Login.shouldRender === false) {
            return false;
        } else if ((this.props.Login.addRequestModal) && this.state.shouldRender === false && nextProps.Login.shouldRender === false) {
            return false;
        } else if ((this.props.Login.addSampleModal) && this.state.shouldRender === false && nextProps.Login.shouldRender === false) {
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        //console.log("parent render")
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        const addSampleId = this.state.controlMap.has("AddThirdPartyECatalogueSampleType") && this.state.controlMap.get("AddThirdPartyECatalogueSampleType").ncontrolcode;
        const editSampleId = this.state.controlMap.has("EditThirdPartyECatalogueSampleType") && this.state.controlMap.get("EditThirdPartyECatalogueSampleType").ncontrolcode;
        const deleteSampleId = this.state.controlMap.has("DeleteThirdPartyECatalogueSampleType") && this.state.controlMap.get("DeleteThirdPartyECatalogueSampleType").ncontrolcode;
        const addRequestID = this.state.controlMap.has("AddThirdPartyECatalogueRequest") && this.state.controlMap.get("AddThirdPartyECatalogueRequest").ncontrolcode;
        const sendRequestID = this.state.controlMap.has("SendThirdPartyECatalogueRequest") && this.state.controlMap.get("SendThirdPartyECatalogueRequest").ncontrolcode;
        const cancelRequestID = this.state.controlMap.has("CancelThirdPartyECatalogueRequest") && this.state.controlMap.get("CancelThirdPartyECatalogueRequest").ncontrolcode;

        const editParam = {
            // screenName: "ThirdPartyECatalogueSample", 
            primaryKeyField: "nproductcode", operation: "update",
            inputParam: this.props.login && this.props.login.inputParam, masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, ncontrolCode: editSampleId, screenName: "'IDS_THIRDPARTYECATALOGUEREQUESTSAMPLE'"
        };
        const SubFields = [
            { [designProperties.VALUE]: "sreceivingsitename" },
            { [designProperties.VALUE]: "sprojecttitles" },
            { [designProperties.VALUE]: "srequesteddate" },
            { [designProperties.VALUE]: "sreqformtypename" },

        ];
        const filterParam = {
            inputListName: "lstBioThirdPartyECatalogueRequests", selectedObject: "selectedBioThirdPartyECatalogueRequest", primaryKeyField: "nthirdpartyecatrequestcode",
            fetchUrl: "biothirdpartyecatalogue/getActiveThirdPartyECatalogueRequestForm", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioThirdPartyECatalogueRequest",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioThirdPartyECatalogueRequests',
            skip: 0, take: this.state.take
        };
        this.extractedDataGridColumnList = [
            { "idsName": "IDS_BIOPROJECT", "dataField": "sprojecttitle", "width": "150PX" },
            { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "150px" },
            //Need to check the build merge
            //{ "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "170px" },
            { "idsName": "IDS_REQUESTEDNOOFSAMPLES", "dataField": "nreqnoofsamples", "width": "170px" },
            { "idsName": "IDS_REQUESTEDMINVOLUMEPERTUBEµL", "dataField": "sreqminvolume", "width": "200px" },
            { "idsName": "IDS_ACCEPTEDNOOFSAMPLES", "dataField": "naccnoofsamples", "width": "200px" },
            { "idsName": "IDS_ACCEPTEDMINVOLUMEPERTUBEµL", "dataField": "saccminvolume", "width": "230px" },
        ]

        const selectedRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest || {};

        const isParentBased =
            selectedRequest?.nselectedreqformtypecode === RequestFormType.PARENT_SAMPLE_BASED ||
            selectedRequest?.nreqformtypecode === RequestFormType.PARENT_SAMPLE_BASED;

        const sampleAddMode = isParentBased ? 'Parent' : 'Bio';

        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height'>
                            <ListWrapper>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                    <Splitter className='layout-splitter' orientation="horizontal"
                                         panes={this.state.panes} onChange={this.onSplitterChange}>
                                    <SplitterPane size="30%" min="25%">   
                                        <TransactionListMasterJsonView
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            needMultiSelect={false}
                                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioThirdPartyECatalogueRequests || []}
                                            selectedMaster={[this.props.Login.masterData.selectedBioThirdPartyECatalogueRequest] || []}
                                            primaryKeyField="nthirdpartyecatrequestcode"
                                            getMasterDetail={(Sample, status) =>
                                                this.props.getActiveThirdPartyECatalogueRequestForm(
                                                    {
                                                        masterData: this.props.Login.masterData,
                                                        userinfo: this.props.Login.userInfo,
                                                        skip: this.state.state,
                                                        ...Sample
                                                    }, status
                                                )}
                                            subFieldsLabel={false}
                                            selectionList={this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                            additionalParam={['']}
                                            mainField={'sformnumber'}
                                            filterColumnData={this.props.filterTransactionList}
                                            subFields={SubFields}
                                            statusFieldName="stransactionstatus"
                                            statusField="ntransactionstatus"
                                            statusColor="stranscolor"
                                            showStatusIcon={false}
                                            showStatusName={true}
                                            showStatusLink={true}
                                            needFilter={true}
                                            openFilter={this.openFilter}
                                            closeFilter={this.closeFilter}
                                            showFilter={this.props.Login.showFilter}
                                            onFilterSubmit={this.onFilterSubmit}
                                            searchRef={this.searchRef}
                                            filterParam={filterParam}
                                            skip={this.state.skip}
                                            take={this.state.take}
                                            handlePageChange={this.handlePageChange}
                                            showStatusBlink={true}
                                            callCloseFunction={true}
                                            childTabsKey={[]}
                                            splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                            commonActions={
                                                <>
                                                    <ProductList className="d-flex product-category float-right">
                                                        <Nav.Link
                                                            className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(addRequestID) === -1}
                                                            onClick={() => this.addThirdPartyECatalogueRequest(addRequestID, 'create', 'IDS_THIRDPARTYECATALOGUEREQUEST')} >
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Nav.Link>
                                                        <Nav.Link
                                                            className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SENDREQUEST" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(sendRequestID) === -1}
                                                            onClick={() => this.sendThirdPartyECatalogueRequest(sendRequestID, 'send', 'IDS_PARENTSAMPLERECEIVING')} >
                                                            <FontAwesomeIcon icon={faEnvelope} />
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CANCELREQUEST" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(cancelRequestID) === -1}
                                                            onClick={() => this.cancelThirdPartyECatalogueRequest(cancelRequestID, 'cancel', 'IDS_PARENTSAMPLERECEIVING')} >
                                                            <Reject className="custom_icons" width="20" height="20" />
                                                        </Nav.Link>
                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            onClick={() => this.onReload()}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>

                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            onClick={() => this.onOpenCatalogue(this.props.Login.masterData, this.props.Login.userInfo)}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_OPENCATALOGUE" })}>
                                                            <GridSolidIcon className='custom_icons' />
                                                        </Button>
                                                    </ProductList>
                                                </>
                                            }
                                            filterComponent={[{
                                                "Third Party E-Catalogue Filter": (
                                                    <BioThirdPartyECatalogueFilter
                                                        FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                                        FilterStatus={this.state.stateFilterStatus || []}
                                                        FromDate={this.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.fromDate) : new Date()}
                                                        ToDate={this.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.toDate) : new Date()}
                                                        handleFilterDateChange={this.handleFilterDateChange}
                                                        userInfo={this.props.Login.userInfo}
                                                        onFilterChange={this.onFilterChange}
                                                    />
                                                ),
                                            }]}
                                            actionIcons={
                                                this.props.Login.masterData && this.props.Login.masterData.selectedBioThirdPartyECatalogueRequest ?
                                                    [{
                                                        title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                                        controlname: "faEye",
                                                        hidden: false,
                                                        objectName: "masterToView",
                                                        onClick: this.viewSelectedThirdPartyECatalogueRequestForm,
                                                        inputData: {
                                                            primaryKeyName: "nthirdpartyecatrequestcode",
                                                            operation: "view",
                                                            masterData: this.props.Login.masterData,
                                                            userInfo: this.props.Login.userInfo,
                                                        }
                                                    }]
                                                    : ""
                                            }
                                        />
                                    </SplitterPane>
                                     <SplitterPane size="70%" min="25%">
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                {
                                                    this.state.data ?
                                                        <>
                                                            <Row noGutters={true}>
                                                                <Col md={12} className="side-padding">
                                                                    <DataGrid
                                                                        primaryKeyField={"nthirdpartyecatreqdetailcode"}
                                                                        dataResult={this.state.dataResult}
                                                                        data={this.state.data}
                                                                        dataState={this.state.sampleState || []}
                                                                        dataStateChange={this.dataStateChange}
                                                                        extractedColumnList={this.extractedDataGridColumnList}
                                                                        controlMap={this.state.controlMap}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        methodUrl="ThirdPartyECatalogueSampleType"
                                                                        addRecord={() => this.openModal(addSampleId, 'create', 'IDS_THIRDPARTYECATALOGUEREQUESTSAMPLE')}
                                                                        selectedField="selected"
                                                                        deleteRecord={this.deleteRecord}
                                                                        deleteParam={{ operation: "delete", screenName: "IDS_THIRDPARTYECATALOGUEREQUESTSAMPLE", ncontrolCode: deleteSampleId }}
                                                                        pageable={true}
                                                                        scrollable={"scrollable"}
                                                                        isToolBarRequired={true}
                                                                        selectedId={this.props.Login.selectedId}
                                                                        hideColumnFilter={false}
                                                                        groupable={false}
                                                                        isActionRequired={true}
                                                                        gridHeight={'85vh'}
                                                                        isRefreshRequired={false}
                                                                        isDownloadPDFRequired={false}
                                                                        isDownloadExcelRequired={false}
                                                                        isCheckBoxRequired={true}
                                                                        selectionChange={this.onSelectionChange}
                                                                        headerSelectionChange={this.onHeaderSelectionChange}
                                                                        fetchRecord={this.props.getActiveThirdPartyECatalogueSampleDetail}
                                                                        editParam={editParam}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </>
                                                        : ""}
                                            </Card>
                                        </ContentPanel>
                                    </SplitterPane>
                                </Splitter>

                                {/* </SplitterLayout> */}
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>
                {(this.props.Login.loadEsign || this.props.Login.addRequestModal || this.props.Login.viewModal || this.props.Login.addSampleModal) ?
                    <SlideOutModal
                        show={(this.props.Login.loadEsign || this.props.Login.addRequestModal || this.props.Login.viewModal || this.props.Login.addSampleModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.viewModal ? "view" : this.props.Login.loadEsign ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsign ? this.props.intl.formatMessage({ id: "IDS_ESIGN" }) : (this.props.Login.viewModal || this.props.Login.addRequestModal) ? "IDS_THIRDPARTYECATALOGUEREQUEST" : this.props.Login.addSampleModal ? "IDS_THIRDPARTYECATALOGUEREQUESTSAMPLE" : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        showSaveContinue={this.props.Login.addSampleModal ? true : false}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        hideSave={this.props.Login.viewModal ? true : false}
                        selectedRecord={this.props.Login.addRequestModal ? this.state.selectedRecord || {} :
                            this.props.Login.loadEsign ? {
                                ...this.state.selectedChildRecord,
                                'esignpassword': this.state.selectedRecord['esignpassword'],
                                'esigncomments': this.state.selectedRecord['esigncomments'],
                                'esignreason': this.state.selectedRecord['esignreason']
                            } : this.state.selectedChildRecord || {}
                        }
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChangeESign}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.viewModal ?
                                <ViewBioThirdPartyECatalogueRequest
                                    selectedRecord={this.props.Login.masterData && this.props.Login.masterData.selectedBioThirdPartyECatalogueRequest ? this.props.Login.masterData.selectedBioThirdPartyECatalogueRequest : {}}
                                    formatMessage={this.props.intl.formatMessage}
                                />
                                :
                                this.props.Login.addRequestModal ?
                                    <AddBioThirdPartyECatalogueRequest
                                        selectedRecord={this.state.selectedChildRecord}
                                        selectedBioThirdPartyECatalogueRequest={this.props.Login.masterData?.selectedBioThirdPartyECatalogueRequest || {}}
                                        bioProjectList={this.props.Login.masterData?.bioProjectList ?? []}
                                        projectSiteList={this.props.Login.masterData?.projectSiteList ?? []}
                                        requestFormList={this.props.Login.masterData?.requestFormList ?? []}
                                        sampleTypeList={this.props.Login.masterData?.sampleTypeList ?? []}
                                        formatMessage={this.props.intl.formatMessage}
                                        onChange={this.handleRequestDataChange}
                                    />
                                    : this.props.Login.addSampleModal ?
                                        <AddBioThirdPartyECatalogueReqSamples
                                            selectedRecord={this.state.selectedChildRecord}
                                            selectedBioThirdPartyECatalogueRequest={selectedRequest}
                                            sampleTypeList={this.props.Login.masterData?.sampleTypeList ?? []}
                                            parentSamples={this.props.Login.masterData?.parentSamples || []}
                                            availablecount={this.props.Login.masterData?.availablecount || 0}
                                            mode={sampleAddMode}
                                            onFilterParentSamples={(payload) => this.props.fetchThirdPartyECatalogueParentSamples(payload)}
                                            onFilterBioAvailability={(payload) => this.props.fetchBioThirdPartyECatalogueSampleAvailability(payload)}
                                            onChange={this.handleSampleDataChange}
                                            formatMessage={this.props.intl.formatMessage}
                                        />
                                        : ""}
                    /> : ""}
                {this.state.showCatalogueModal ?
                    <BioThirdPartyECatalogueModal
                        show={this.state.showCatalogueModal}
                        onClose={this.closeCatalogueModal}
                        bioProjectList={this.state?.bioProjectList ?? []}
                        projectSiteList={this.state?.projectSiteList ?? []}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                    /> : ""}

            </>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        let newState = { ...this.state };
        let stateChanged = false;

        if (this.props.Login.userInfo.nformcode !== prevProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            const rights = this.props.Login.userRoleControlRights?.[this.props.Login.userInfo.nformcode];
            if (rights) {
                Object.values(rights).forEach(item => userRoleControlRights.push(item.ncontrolcode));
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode);
            const lstBioThirdPartyECatalogueDetails = this.props.Login.masterData?.lstBioThirdPartyECatalogueDetails || [];

            newState.userRoleControlRights = userRoleControlRights;
            newState.controlMap = controlMap;
            newState.data = lstBioThirdPartyECatalogueDetails;
            newState.dataResult = process(lstBioThirdPartyECatalogueDetails, newState.sampleState);
            stateChanged = true;
        }

        if (this.props.Login.selectedFilter !== prevProps.Login.selectedFilter) {
            newState.selectedFilter = this.props.Login.selectedFilter;
            stateChanged = true;
        }
        if (this.props.Login.shouldRender !== prevProps.Login.shouldRender) {
            newState.shouldRender = this.props.Login.shouldRender;
            stateChanged = true;
        }
        if (this.props.Login.selectedRecord !== prevProps.Login.selectedRecord) {
            newState.selectedRecord = this.props.Login.selectedRecord;
            stateChanged = true;
        }
        if (this.props.Login.selectedChildRecord !== prevProps.Login.selectedChildRecord) {
            newState.selectedChildRecord = this.props.Login.selectedChildRecord;
            stateChanged = true;
        }
        //added by Vishakh BGSI-280 for an issue with wrong alert throwing while edit in particular scenario
        if (this.props.Login?.masterData?.availablecount!=prevProps.Login?.masterData?.availablecount){
            newState.selectedChildRecord["availablecount"] = this.props.Login.masterData?.availablecount;
            stateChanged = true;
        }
        if (this.props.Login?.masterData?.showCatalogueModal !== prevProps.Login?.masterData?.showCatalogueModal) {
            newState.showCatalogueModal = this.props.Login?.masterData?.showCatalogueModal ?? false;
            stateChanged = true;
        }

        if (this.props.Login.shouldRender !== prevProps.Login.shouldRender) {
            newState.shouldRender = this.props.Login.shouldRender;
            stateChanged = true;
        }

        if (this.props.Login.masterData !== prevProps.Login.masterData) {
            if (this.props.Login.masterData.FilterStatus !== prevProps.Login.masterData.FilterStatus) {
                const filterStatusMap = constructOptionList(
                    this.props.Login.masterData.FilterStatus || [],
                    "ntransactionstatus",
                    "stransdisplaystatus",
                    "nsorter",
                    "ascending",
                    false
                );
                newState.stateFilterStatus = filterStatusMap.get("OptionList");
                stateChanged = true;
            }
            if (this.props.Login?.masterData?.lstBioProject !== prevProps.Login?.masterData?.lstBioProject) {
                const BioProjectListData = constructOptionList(this.props.Login?.masterData?.lstBioProject || [], "nbioprojectcode",
                    "sprojecttitle", "nbioprojectcode", undefined, false);
                const bioProjectList = BioProjectListData.get("OptionList");
                newState.bioProjectList = bioProjectList;
                stateChanged = true;
            }
            if (this.props.Login?.masterData?.lstSite !== prevProps.Login?.masterData?.lstSite) {
                const SiteListData = constructOptionList(this.props.Login?.masterData?.lstSite || [], "nsitecode",
                    "ssitename", "nsitecode", undefined, false);
                const projectSiteList = SiteListData.get("OptionList");
                newState.projectSiteList = projectSiteList;
                stateChanged = true;
            }

            const breadCrumbobj = convertDateValuetoString(
                this.props.Login.masterData.RealFromDate,
                this.props.Login.masterData.RealToDate,
                this.props.Login.userInfo
            );
            this.breadCrumbData = [
                { label: "IDS_FROM", value: breadCrumbobj.breadCrumbFrom },
                { label: "IDS_TO", value: breadCrumbobj.breadCrumbto },
                {
                    label: "IDS_SAMPLESTATUS",
                    value: this.props.Login.masterData.RealFilterStatusValue?.stransdisplaystatus
                }
            ];
            if (
                this.props.Login.masterData.searchedData !== undefined &&
                this.props.Login.masterData.searchedData !== prevProps.Login.masterData.searchedData
            ) {
                newState.sampleState = { ...newState.sampleState, skip: 0 };
                stateChanged = true;
            }
            const lstBioThirdPartyECatalogueDetails = this.props.Login.masterData?.lstBioThirdPartyECatalogueDetails || [];
            if (this.props.Login.masterData?.lstBioThirdPartyECatalogueDetails !== prevProps.Login.masterData?.lstBioThirdPartyECatalogueDetails) {
                newState.data = lstBioThirdPartyECatalogueDetails;
                if (this.props.Login.masterData?.selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode !==
                    prevProps.Login.masterData?.selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode) {
                    const take = newState.sampleState.take;
                    const skip = 0;
                    newState.sampleState = { skip, take };
                    newState.dataResult = process(lstBioThirdPartyECatalogueDetails, newState.sampleState);
                    stateChanged = true;
                }
                if (this.props.Login.masterData?.selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode ===
                    prevProps.Login.masterData?.selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode) {
                    let dataResult = [];
                    this.state.dataResult && this.state.dataResult.data && this.state.dataResult.data.map(data => {
                        if (data.selected == true && data.selected != undefined) {
                            dataResult.push(data);
                        }
                    });
                    if (this.props.Login.operation === "delete" &&
                        newState.dataResult?.data?.length === dataResult.length
                    ) {
                        const take = newState.sampleState.take;
                        const skip = this.state.sampleState.skip >= take ? this.state.sampleState.skip - take : 0;
                        newState.sampleState = { skip, take };
                        newState.dataResult = process(lstBioThirdPartyECatalogueDetails, newState.sampleState);
                        stateChanged = true;
                    } else {
                        if (this.props.Login.operation === "create") {
                            const take = newState.sampleState.take;
                            const skip = 0;
                            newState.sampleState = { skip, take };
                        }
                        newState.dataResult = process(lstBioThirdPartyECatalogueDetails, newState.sampleState);
                        stateChanged = true;
                    }
                }
            }
        }
        newState.skip = this.props.Login.skip === undefined ? newState.skip : this.props.Login.skip;
        if (stateChanged) {
            this.setState(newState);
        }
    }

    closeCatalogueModal = () => {
        const masterData = this.props.Login?.masterData ?? {}
        const updateInfo = { typeName: DEFAULT_RETURN, data: { masterData: { ...masterData, showCatalogueModal: false }, shouldRender: true } };
        this.props.updateStore(updateInfo);
    }

    openFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: true }
        }
        this.props.updateStore(updateInfo);
    }
    closeFilter = () => {
        let Map = {};
        Map['inputValues'] = {
            FromDate: this.props.Login.masterData.RealFromDate || new Date(),
            ToDate: this.props.Login.masterData.RealToDate || new Date(),
            fromdate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealFromDate) || new Date(),
            todate: rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.RealToDate) || new Date(),
            FilterStatus: this.props.Login.masterData.RealFilterStatuslist || [],
            FilterStatusValue: this.props.Login.masterData.RealFilterStatusValue || {},
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData: { ...this.props.Login.masterData, ...Map.inputValues }, selectedFilter: { todate: Map.inputValues.todate, fromdate: Map.inputValues.fromdate } }
        }
        this.props.updateStore(updateInfo);
    }
    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedFilter } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedFilter[dateName] = dateValue;
        this.setState({ selectedFilter });
    }
    onFilterChange = (event, labelname) => {
        let masterData = this.props.Login.masterData;
        masterData = {
            ...masterData,
            [labelname]: { ...event.item },
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData, skip: this.state.state }
        }
        this.props.updateStore(updateInfo);
    }
    onFilterSubmit = () => {
        const RealFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate);
        const RealToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.ToDate)
        let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue
        let RealFilterStatuslist = this.props.Login.masterData.ThirdPartyECatalogueStatusList || []

        let masterData = {
            ...this.props.Login.masterData,
            RealFilterStatusValue, RealFromDate, RealToDate,
            RealFilterStatuslist
        }
        let inputData = {
            filterStatusValue: this.props.Login.masterData && this.props.Login.masterData.FilterStatusValue,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
        }
        const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
            this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
        inputData['FromDate'] = obj.fromDate;
        inputData['ToDate'] = obj.toDate;

        const selectedFilter = {};
        selectedFilter["fromdate"] = RealFromDate;
        selectedFilter["todate"] = RealToDate;
        const inputParam = {
            masterData, inputData, searchRef: this.searchRef, take: this.state.take, dataState: this.state.dataState, sampleState: this.state.sampleState, skip: this.state.state
        }
        this.props.getThirdPartyECatalogueByFilterSubmit(inputParam);
    }

    viewSelectedThirdPartyECatalogueRequestForm = (inputParam) => {
        let masterToView = inputParam.masterToView;
        masterToView["userinfo"] = this.props.Login.userInfo;
        masterToView["masterData"] = this.props.Login.masterData;
        masterToView["sampleState"] = this.state.sampleState;
        masterToView["skip"] = this.state.skip;
        let viewModal = "viewModal";
        this.props.getActiveThirdPartyECatalogueRequestForm(masterToView, viewModal)
    }

    handleSampleDataChange = (snapshot) => {
        const selectedChildRecord = { ...(this.state.selectedChildRecord || {}), ...snapshot };
        this.setState({ selectedChildRecord, shouldRender: false });
    };

    handleRequestDataChange = (request = {}, detailsArray = []) => {
        const selectedRecord = { ...(this.state.selectedRecord || {}) };
        const getId = (opt, fallbackKey) => {
            if (opt == null) return null;
            if (typeof opt === "number") return opt;
            if (typeof opt === "string") return opt.trim();
            if (typeof opt === "object") {
                if ("value" in opt && opt.value != null) return opt.value;
                if (fallbackKey && opt[fallbackKey] != null) return opt[fallbackKey];
                if ("id" in opt && opt.id != null) return opt.id;
            }
            return null;
        };

        const reqFormList = this.props?.Login?.masterData?.requestFormList || this.props.requestFormList || [];
        const findFormType = (needle) =>
            reqFormList.find(o => o && (o.value === needle || o.label === needle || o.sreqformtypename === needle || o.nreqformtypecode === needle));

        const resolveFormTypeCode = (rf) => {
            if (rf == null) return null;
            if (typeof rf === "number") return rf;
            if (typeof rf === "string") {
                const hit = findFormType(rf);
                if (!hit) return null;
                const v = (typeof hit.value === "number") ? hit.value : hit.nreqformtypecode;
                return Number.isFinite(v) ? v : null;
            }
            if (typeof rf === "object") {
                if (typeof rf.nreqformtypecode === 'number') return rf.nreqformtypecode;
                const v = getId(rf, "nreqformtypecode");
                const num = Number(v);
                if (Number.isFinite(num)) return num;
                const hit = findFormType(rf.label || rf.value || rf.sreqformtypename);
                if (!hit) return null;
                const vv = (typeof hit.value === "number") ? hit.value : hit.nreqformtypecode;
                return Number.isFinite(vv) ? vv : null;
            }
            return null;
        };

        selectedRecord.nselectedbioprojectcode = getId(request?.nbioprojectcode ?? request?.projectType, "nbioprojectcode");
        selectedRecord.nthirdpartycode = detailsArray.length > 0 ? detailsArray[0]?.nthirdpartycode || -1 : -1;

        const rfCandidate =
            request?.nrequestformtypecode ??
            request?.nreqformtypecode ??
            this.props?.Login?.masterData?.selectedReqFormType ?? null;

        selectedRecord.nselectedreqformtypecode = resolveFormTypeCode(rfCandidate);
        selectedRecord.sremarks = request?.sremarks ?? request?.remarks ?? "";

        selectedRecord.requestProductList = (detailsArray || []).map(d => ({
            nproductcode: getId(d?.nproductcode, "nproductcode"),
            nreqnoofsamples: d?.nreqnoofsamples ?? d?.reqSamples ?? d?.nOfSamples ?? d?.noOfSamples ?? null,
            sreqminvolume: (d?.sreqminvolume ?? d?.requestVolumeRaw ?? d?.sminvolume ?? "").toString().trim(),
            sparentsamplecode: d?.sparentsamplecode ?? d?.sparentSampleCode ?? d?.parentSampleCode ?? null
        })).filter(r => r.nproductcode != null);

        this.setState({ selectedRecord, shouldRender: false });
    };



    onOpenCatalogue = (masterData, userInfo) => {
        this.props.getThirdPartyCatalogueCombo(masterData, userInfo)
    }

    addThirdPartyECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let masterData = { ...this.props.Login.masterData };
        let userinfo = this.props.Login.userInfo;
        let inputParam = {
            masterData,
            userinfo,
            operation: operation,
            screenName: screenName,
            ncontrolcode: ncontrolcode
        };
        this.props.getThirdPartyECatalogueComboforAdd(inputParam);
    }
    sendThirdPartyECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let selectedBioThirdPartyECatalogueRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest ?? {};
        let masterData = this.props.Login?.masterData ?? {};
        const nthirdpartyecatrequestcode = selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode ?? -1;

        if (nthirdpartyecatrequestcode <= 0) {
            toast.info(
                this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOSEND" })
            );
        }
        else {
            const ntransactionstatus = selectedBioThirdPartyECatalogueRequest?.ntransactionstatus ?? -1;
            const nthirdpartycode = selectedBioThirdPartyECatalogueRequest?.nthirdpartycode || -1;
            if (ntransactionstatus == transactionStatus.DRAFT) {
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                let postParam = undefined;
                inputData["nthirdpartyecatrequestcode"] = nthirdpartyecatrequestcode;
                inputData["nthirdpartycode"] = nthirdpartycode;
                const inputParam = {
                    classUrl: "biothirdpartyecatalogue",
                    methodUrl: "ThirdPartyECatalogueRequest",
                    inputData: inputData,
                    operation: "send",
                    postParam, searchRef: this.searchRef,
                    selectedRecord: { ...this.state.selectedRecord },
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, shouldRender: true, screenData: {
                                inputParam,
                                masterData,
                                selectedRecord: { ...this.state.selectedChildRecord },
                                modalOperation: "sendThirdPartyECatalogueRequest"
                            },
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.sendThirdPartyECatalogueRequest(inputParam, masterData);
                }
            } else {
                toast.warn(
                    this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOSEND" })
                );
            }
        }

    }
    cancelThirdPartyECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let selectedBioThirdPartyECatalogueRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest ?? {};
        let masterData = this.props.Login?.masterData ?? {};
        const nthirdpartyecatrequestcode = selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode ?? -1;

        if (nthirdpartyecatrequestcode <= 0) {
            toast.info(
                this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOCANCEL" })
            );
        }
        else {
            const ntransactionstatus = selectedBioThirdPartyECatalogueRequest?.ntransactionstatus ?? -1;
            if (ntransactionstatus == transactionStatus.DRAFT || ntransactionstatus == transactionStatus.REQUESTED) {
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                let postParam = undefined;
                inputData["nthirdpartyecatrequestcode"] = nthirdpartyecatrequestcode;
                const inputParam = {
                    classUrl: "biothirdpartyecatalogue",
                    methodUrl: "ThirdPartyECatalogueRequest",
                    inputData: inputData,
                    operation: "send",
                    postParam, searchRef: this.searchRef,
                    selectedRecord: { ...this.state.selectedRecord },
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, shouldRender: true, screenData: {
                                inputParam,
                                masterData,
                                selectedRecord: { ...this.state.selectedChildRecord },
                                modalOperation: "cancelThirdPartyECatalogueRequest",
                            }
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.cancelThirdPartyECatalogueRequest(inputParam, masterData);
                }
            } else {
                toast.warn(
                    this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTORREQUESTEDFORMTOCANCEL" })
                );
            }
        }

    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let viewModal = this.props.Login.viewModal;
        let addRequestModal = this.props.Login.addRequestModal;
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let addSampleModal = this.props.Login.addSampleModal;
        let shouldRender = this.state.shouldRender;
        let masterData = this.props.Login?.masterData ?? {};

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                viewModal = false;
                addRequestModal = false;
                addSampleModal = false;
                selectedChildRecord = {};
                shouldRender = true;
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason'] = undefined;

            }
        }
        else {
            if (this.props.Login.addSampleModal) {
                masterData = { ...masterData, availablecount: 0 }
            }
            viewModal = false;
            addRequestModal = false;
            addSampleModal = false;
            selectedChildRecord = {};
            shouldRender = true;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                viewModal, loadEsign, selectedRecord, addRequestModal, addSampleModal, shouldRender,
                selectedChildRecord, masterData
            }
        }
        this.props.updateStore(updateInfo);
    }

    openModal = (ncontrolcode, operation, screenName) => {
        let selectedBioThirdPartyECatalogueRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest ?? {};

        if (selectedBioThirdPartyECatalogueRequest.ntransactionstatus == transactionStatus.DRAFT) {
            let nthirdpartyecatrequestcode = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest?.nthirdpartyecatrequestcode ?? -1;
            let skip = this.state.state;
            this.props.getThirdPartyProductComboDataForSampleAdd(nthirdpartyecatrequestcode, this.props.Login.userInfo, this.props.Login.masterData, operation, screenName, ncontrolcode, skip);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTSTATUSRECORD" }));
        }
    }

    deleteRecord = (deleteParam) => {
        let selectedBioThirdPartyECatalogueRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest ?? {};
        if (selectedBioThirdPartyECatalogueRequest.ntransactionstatus == transactionStatus.DRAFT) {

            let inputData = [];
            let inputParam = {};
            let masterData = this.props.Login.masterData || {};
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["nthirdpartyecatreqdetailcode"] = deleteParam?.selectedRecord?.nthirdpartyecatreqdetailcode ?? -1;
            inputData["nthirdpartyecatrequestcode"] = deleteParam?.selectedRecord?.nthirdpartyecatrequestcode ?? -1;
            inputParam = {
                classUrl: "biothirdpartyecatalogue",
                methodUrl: "ThirdPartyECatalogueRequestSample",
                inputData: inputData,
                operation: "delete"
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData, selectedRecord: deleteParam.selectedRecord, modalOperation: "deleteChild" }
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.deleteThirdPartyECatalogueRequestSample(inputParam, masterData);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTSTATUSRECORD" }));
        }


    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data ? this.state.data : [], event.dataState),
            sampleState: event.dataState
        });
    }

    onReload = () => {
        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
        const RealFromDate = obj.fromDate;
        const RealToDate = obj.toDate;
        let RealFilterStatusValue = this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue
        let FilterStatusValue = RealFilterStatusValue
        const FromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        const ToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let masterData = {
            ...this.props.Login.masterData, FromDate, ToDate,
            RealFilterStatusValue, RealFromDate, RealToDate,
            FilterStatusValue
        }
        let inputData = {
            nfilterstatus: this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
        }
        inputData['FromDate'] = obj.fromDate;
        inputData['ToDate'] = obj.toDate;
        let inputParam = { masterData, inputData, searchRef: this.searchRef, selectedFilter: this.state.selectedFilter, skip: this.state.state }
        this.props.getThirdPartyECatalogueByFilterSubmit(inputParam);
    }

    onMandatoryCheck = (saveType) => {
        const mandatoryFields = this.props.Login.loadEsign ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            : []
        // this.props.Login.addRequestModal ? []
        //     :
        //     this.props.Login.addSampleModal ? []
        //         :
        //         [];
        {
            onSaveMandatoryValidation(
                this.props.Login.loadEsign ? this.state.selectedRecord : this.props.Login.addRequestModal ? this.state.selectedRecord : this.props.Login.addSampleModal ? this.state.selectedChildRecord : {},
                mandatoryFields,
                this.props.Login.loadEsign ? this.validateEsign : this.props.Login.addRequestModal ? this.onSaveClick : this.props.Login.addSampleModal ? this.onSaveSampleClick : "",
                this.props.Login.loadEsign,
                saveType
            );
        }
    }

    onSaveClick = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord || {};
        const requestProductList = selectedRecord.requestProductList || [];

        if (!requestProductList || requestProductList.length === 0) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ADDSAMPLESTOREQUEST" }));
            return;
        }

        let nform = selectedRecord.nselectedreqformtypecode;
        if (nform == null) {
            const preset = this.props?.Login?.masterData?.selectedReqFormType;
            if (preset && typeof preset.nreqformtypecode === 'number') {
                nform = preset.nreqformtypecode;
            }
        }

        const nproj = selectedRecord.nselectedbioprojectcode;
        if (nproj == null || nform == null) {
            const missing = [
                nproj == null ? this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" }) : null,
                nform == null ? this.props.intl.formatMessage({ id: "IDS_REQUESTFORMTYPE" }) : null,
            ].filter(Boolean).join(', ');
            toast.warn(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${missing}`);
            return;
        }

        const obj = convertDateValuetoString(
            this.props.Login.masterData.RealFromDate,
            this.props.Login.masterData.RealToDate,
            this.props.Login.userInfo
        );
        const RealFromDate = obj.fromDate;
        const RealToDate = obj.toDate;
        const RealFilterStatusValue =
            this.props.Login.masterData.RealFilterStatusValue &&
            this.props.Login.masterData.RealFilterStatusValue;
        const FilterStatusValue = RealFilterStatusValue;
        const FromDate = rearrangeDateFormat(
            this.props.Login.userInfo,
            this.props.Login.masterData.FromDate
        );
        const ToDate = rearrangeDateFormat(
            this.props.Login.userInfo,
            this.props.Login.masterData.ToDate
        );
        const masterData = {
            ...this.props.Login.masterData,
            FromDate,
            ToDate,
            RealFilterStatusValue,
            RealFromDate,
            RealToDate,
            FilterStatusValue,
        };

        const inputData = {
            nfilterstatus: RealFilterStatusValue && RealFilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            FromDate: obj.fromDate,
            ToDate: obj.toDate,
            nselectedbioprojectcode: nproj,
            nselectedreqformtypecode: nform,
            requestProductList,
            nthirdpartycode: selectedRecord.nthirdpartycode,
            sremarks: selectedRecord.sremarks || "",
        };

        const inputParam = {
            classUrl: "biothirdpartyecatalogue",
            methodUrl: "ThirdPartyECatalogueRequest",
            inputData,
            operation: "create",
            saveType,
            formRef,
            postParam: undefined,
            searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord },
            skip: this.state.state,
        };

        this.props.createThirdPartyECatalogueRequest(inputParam, masterData, saveType);
    };



    onSaveSampleClick = (saveType = 1, formRef) => {
        const rec = this.state.selectedChildRecord || {};
        const masterRequest = this.props.Login?.masterData?.selectedBioThirdPartyECatalogueRequest || {};
        const nthirdpartyecatrequestcode = masterRequest?.nthirdpartyecatrequestcode ?? rec.nthirdpartyecatrequestcode ?? -1;

        const nproductcode = rec.nproductcode ?? rec.nselectedproductcode ?? null;
        const nreqnoofsamples = rec.nreqnoofsamples ?? null;
        const navailableCount = rec.navailableCount ?? rec.availablecount ?? rec.availableCount ?? null;
        const sparentsamplecode = rec.sparentsamplecode ?? null;
        const nthirdpartyecatreqdetailcode = rec.nthirdpartyecatreqdetailcode ?? -1;

        const existing = (this.props.Login?.masterData?.lstBioThirdPartyECatalogueDetails || []);
        if (sparentsamplecode) {
            const isDup = existing.some(r =>
                Number(r.nproductcode) === Number(nproductcode) &&
                String(r.sparentsamplecode || "").trim() === String(sparentsamplecode || "").trim() &&
                Number(r.nthirdpartyecatreqdetailcode) !== Number(nthirdpartyecatreqdetailcode)
            );
            if (isDup) {
                toast.info(this.props.intl.formatMessage({ id: "IDS_DUPLICATECOMBINATION" }) || "This Bio Sample Type + Parent Sample Code is already added.");
                return;
            }
        } else {
            const isDup = existing.some(r =>
                Number(r.nproductcode) === Number(nproductcode) &&
                Number(r.nthirdpartyecatreqdetailcode) !== Number(nthirdpartyecatreqdetailcode)
            );
            if (isDup) {
                toast.info(this.props.intl.formatMessage({ id: "IDS_DUPLICATESAMPLETYPE" }) || "This Bio Sample Type is already added.");
                return;
            }
        }

        if (nthirdpartyecatrequestcode <= 0) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAFORMTOADDSAMPLES" }));
            return;
        }

        if (!nproductcode) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTBIOSAMPLETYPE" }) || "Select Bio Sample Type");
            return;
        }

        if (nreqnoofsamples == null || Number(nreqnoofsamples) <= 0) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERREQUESTEDSAMPLES" }) || "Enter requested number of samples");
            return;
        }

        const requestFormTypeCode =
            masterRequest?.nreqformtypecode ?? this.props.Login.masterData?.selectedReqFormType?.nreqformtypecode;
        const isParentForm = requestFormTypeCode === RequestFormType.PARENT_SAMPLE_BASED;

        if (isParentForm && (!sparentsamplecode || sparentsamplecode === "")) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPARENTSAMPLE" }) || "Select Parent Sample Code");
            return;
        }

        if (navailableCount != null) {
            const reqCount = Number(nreqnoofsamples);
            const availCount = Number(navailableCount);
            if (reqCount > availCount) {
                toast.info(
                    this.props.intl.formatMessage({ id: "IDS_REQUESTEDSAMPLESNOTEQUALORLESSTHANAVAILABLE" }) ||
                    `Requested samples (${reqCount}) cannot exceed available samples (${availCount})`
                );
                return;
            }
        }

        const inputData = {
            userinfo: this.props.Login.userInfo,
            nthirdpartyecatrequestcode,
            nthirdpartyecatreqdetailcode: nthirdpartyecatreqdetailcode > 0 ? nthirdpartyecatreqdetailcode : null,
            nproductcode: Number(nproductcode),
            nreqnoofsamples: Number(nreqnoofsamples),
            sparentsamplecode,
            sreqminvolume: (rec.sreqminvolume ?? "").toString().trim(),
            nbioprojectcode: masterRequest.nbioprojectcode ?? null,
            nsitecode: masterRequest.nreceiversitecode ?? null,
        };

        const inputParam = {
            classUrl: "biothirdpartyecatalogue",
            methodUrl: "ThirdPartyECatalogueRequestSample",
            inputData,
            operation: nthirdpartyecatreqdetailcode > 0 ? "update" : "create",
            saveType,
            formRef,
            postParam: undefined,
            searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedChildRecord },
            selectedId: nthirdpartyecatreqdetailcode > 0 ? nthirdpartyecatreqdetailcode : null,
            skip: this.state.skip,
        };

        if (
            showEsign(
                this.props.Login.userRoleControlRights,
                this.props.Login.userInfo.nformcode,
                this.props.Login.ncontrolcode
            )
        ) {
            const masterData = { ...this.props.Login.masterData };
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    shouldRender: "true",
                    screenData: {
                        inputParam,
                        masterData,
                        selectedRecord: { ...this.state.selectedChildRecord },
                        modalOperation: nthirdpartyecatreqdetailcode > 0 ? "updateChild" : "createChild",
                    },
                    saveType,
                },
            };
            this.props.updateStore(updateInfo);
        } else {
            const masterData = { ...this.props.Login.masterData };
            this.props.saveThirdPartyECatalogueRequestSample(inputParam, masterData, saveType);
        }

        // this.setState({ showAddSampleSlideOut: false, selectedChildRecord: {} });
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
        this.props.validateEsignforThirdPartyECatalogue(inputParam);
    }

    handleFocus(e) {
        e.target.select();
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

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
}
export default connect(mapStateToProps, {
    updateStore, filterTransactionList,
    showEsign, rearrangeDateFormat, convertDateValuetoString, convertDateTimetoStringDBFormat,
    onSaveMandatoryValidation, getThirdPartyCatalogueCombo, getThirdPartyECatalogueByFilterSubmit, getActiveThirdPartyECatalogueRequestForm,
    getThirdPartyECatalogueComboforAdd, createThirdPartyECatalogueRequest, sendThirdPartyECatalogueRequest, cancelThirdPartyECatalogueRequest,
    getThirdPartyProductComboDataForSampleAdd, deleteThirdPartyECatalogueRequestSample, saveThirdPartyECatalogueRequestSample,
    getActiveThirdPartyECatalogueSampleDetail, validateEsignforThirdPartyECatalogue
})(injectIntl(BioThirdPartyECatalogue));
