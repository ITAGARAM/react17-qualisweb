// BGSiECatalogue.jsx — updated to accept child snapshots and use them on Save
import React from "react";
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { ContentPanel, ReadOnlyText } from "../../../components/App.styles";
import {
    getControlMap, showEsign, rearrangeDateFormat, convertDateValuetoString,
    convertDateTimetoStringDBFormat, constructOptionList, onSaveMandatoryValidation
} from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGrid from '../../../components/data-grid/data-grid.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ReactComponent as GridSolidIcon } from '../../../assets/image/grid3-round-solid.svg';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import Esign from '../../audittrail/Esign';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import {
    updateStore, filterTransactionList, getCatalogueCombo, getBGSiECatalogueByFilterSubmit,
    getActiveBGSiECatalogueRequestForm, getCatalogueComboforAdd, createBGSiECatalogueRequest,
    sendBGSiECatalogueRequest, cancelBGSiECatalogueRequest, getProductComboDataForSampleAdd,
    deleteBGSiECatalogueRequestSample, saveBGSiECatalogueRequestSample, getActiveBGSiECatalogueSampleDetail,
    validateEsignforBGSiECatalogue
} from '../../../actions';
import BGSiECatalogueFilter from "./BGSiECatalogueFilter";
import ViewBGSiECatalogueRequest from "./ViewBGSiECatalogueRequest";
import AddBGSiECatalogueRequest from "./AddBGSiECatalogueRequest";
import BreadcrumbComponent from "../../../components/Breadcrumb.Component";
import BGSiECatalogueModal from "./BGSiECatalogueModal"
import { ReactComponent as Reject } from '../../../assets/image/reject.svg';
import { faPlus, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AddBGSiECatalogueReqSamples from "./AddBGSiECatalogueReqSamples";
import { RequestFormType } from '../../../components/Enumeration';


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class BGSiECatalogue extends React.Component {
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
        this.searchFieldList = ["sformnumber", "sreceivingsitename", "srequesteddate", "stransactionstatus", "sprojecttitles","sreqformtypename"];
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
            panes:[
                { size: '30%', min: '25%', resizable: true, collapsible: true  },
            ]
        };
        this.searchRef = React.createRef();

        // Instance variable to store latest child snapshot pushed by AddBGSiECatalogueRequest
        // This avoids frequent setState calls on every child change and prevents parent re-render storms.
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

    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

    render() {
        
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        const addSampleId = this.state.controlMap.has("Add BGSi - E Catalogue Sample Type") && this.state.controlMap.get("Add BGSi - E Catalogue Sample Type").ncontrolcode;
        const editSampleId = this.state.controlMap.has("Edit BGSi - E Catalogue Sample Type") && this.state.controlMap.get("Edit BGSi - E Catalogue Sample Type").ncontrolcode;
        const deleteSampleId = this.state.controlMap.has("Delete BGSi - E Catalogue Sample Type") && this.state.controlMap.get("Delete BGSi - E Catalogue Sample Type").ncontrolcode;
        const addRequestID = this.state.controlMap.has("Add BGSi - E Catalogue Request") && this.state.controlMap.get("Add BGSi - E Catalogue Request").ncontrolcode;
        const sendRequestID = this.state.controlMap.has("Send BGSi - E Catalogue Request") && this.state.controlMap.get("Send BGSi - E Catalogue Request").ncontrolcode;
        const cancelRequestID = this.state.controlMap.has("Cancel BGSi - E Catalogue Request") && this.state.controlMap.get("Cancel BGSi - E Catalogue Request").ncontrolcode;

        const editParam = {
            primaryKeyField: "nproductcode", operation: "update",
            inputParam: this.props.login && this.props.login.inputParam, masterData: this.props.Login.masterData,
            userInfo: this.props.Login.userInfo, ncontrolCode: editSampleId, screenName: "'IDS_BGSIECATALOGUEREQUESTSAMPLE'"
        };
        const SubFields = [
            { [designProperties.VALUE]: "sreceivingsitename" },
            { [designProperties.VALUE]: "sprojecttitles" },
            { [designProperties.VALUE]: "srequesteddate" },
            { [designProperties.VALUE]: "sreqformtypename" },

        ];
        const filterParam = {
            inputListName: "lstBioBGSiECatalogueRequests", selectedObject: "selectedBioBGSiECatalogueRequest", primaryKeyField: "nbgsiecatrequestcode",
            fetchUrl: "bgsiecatalogue/getActiveBGSiECatalogueRequestForm", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioBGSiECatalogueRequest",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioBGSiECatalogueRequests',
            skip: 0, take: this.state.take
        };
        this.extractedDataGridColumnList = [
            { "idsName": "IDS_BIOPROJECT", "dataField": "sprojecttitle", "width": "150PX" },
            { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "150px" },
            { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "170px" },
            { "idsName": "IDS_REQUESTEDNOOFSAMPLES", "dataField": "nreqnoofsamples", "width": "170px" },
            { "idsName": "IDS_REQUESTEDMINVOLUMEPERTUBEµL", "dataField": "sreqminvolume", "width": "200px" },
            { "idsName": "IDS_ACCEPTEDNOOFSAMPLES", "dataField": "naccnoofsamples", "width": "200px" },
            { "idsName": "IDS_ACCEPTEDMINVOLUMEPERTUBEµL", "dataField": "saccminvolume", "width": "230px" },
        ]

        const selectedRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest || {};

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
                                    <Splitter panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal" >
                                        <SplitterPane size="30%" min="25%">
                                            <TransactionListMasterJsonView
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={false}
                                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioBGSiECatalogueRequests || []}
                                                selectedMaster={[this.props.Login.masterData.selectedBioBGSiECatalogueRequest] || []}
                                                primaryKeyField="nbgsiecatrequestcode"
                                                getMasterDetail={(Sample, status) =>
                                                    this.props.getActiveBGSiECatalogueRequestForm(
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
                                                                onClick={() => this.addBGSiECatalogueRequest(addRequestID, 'create', 'IDS_BGSIECATALOGUEREQUEST')} >
                                                                <FontAwesomeIcon icon={faPlus} />
                                                            </Nav.Link>
                                                            <Nav.Link
                                                                className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SENDREQUEST" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(sendRequestID) === -1}
                                                                onClick={() => this.sendBGSiECatalogueRequest(sendRequestID, 'send', 'IDS_PARENTSAMPLERECEIVING')} >
                                                                <FontAwesomeIcon icon={faEnvelope} />
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CANCELREQUEST" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(cancelRequestID) === -1}
                                                                onClick={() => this.cancelBGSiECatalogueRequest(cancelRequestID, 'cancel', 'IDS_PARENTSAMPLERECEIVING')} >
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
                                                    IDS_BGSIECATALOGUEFILTER: (
                                                        <BGSiECatalogueFilter
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
                                                    this.props.Login.masterData && this.props.Login.masterData.selectedBioBGSiECatalogueRequest ?
                                                        [{
                                                            title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                                            controlname: "faEye",
                                                            hidden: false,
                                                            objectName: "masterToView",
                                                            onClick: this.viewSelectedBGSiECatalogueRequestForm,
                                                            inputData: {
                                                                primaryKeyName: "nbgsiecatrequestcode",
                                                                operation: "view",
                                                                masterData: this.props.Login.masterData,
                                                                userInfo: this.props.Login.userInfo,
                                                            }
                                                        }]
                                                        : ""
                                                }
                                            />
                                        </SplitterPane>
                                        <SplitterPane size="70%" min="10%">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {
                                                        this.state.data ?
                                                            <>
                                                                <Row noGutters={true}>
                                                                    <Col md={12} className="side-padding">
                                                                        <DataGrid
                                                                            primaryKeyField={"nbgsiecatdetailcode"}
                                                                            dataResult={this.state.dataResult}
                                                                            data={this.state.data}
                                                                            dataState={this.state.sampleState || []}
                                                                            dataStateChange={this.dataStateChange}
                                                                            extractedColumnList={this.extractedDataGridColumnList}
                                                                            controlMap={this.state.controlMap}
                                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                                            inputParam={this.props.Login.inputParam}
                                                                            userInfo={this.props.Login.userInfo}
                                                                            methodUrl="BGSiECatalogueRequestSample"
                                                                            addRecord={() => this.openModal(addSampleId, 'create', 'IDS_BGSIECATALOGUEREQUESTSAMPLE')}
                                                                            selectedField="selected"
                                                                            deleteRecord={this.deleteRecord}
                                                                            deleteParam={{ operation: "delete", screenName: "IDS_BGSIECATALOGUEREQUESTSAMPLE", ncontrolCode: deleteSampleId }}
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
                                                                            fetchRecord={this.props.getActiveBGSiECatalogueSampleDetail}
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
                        screenName={this.props.Login.loadEsign ? this.props.intl.formatMessage({ id: "IDS_ESIGN" }) : (this.props.Login.viewModal || this.props.Login.addRequestModal) ? "IDS_BGSIECATALOGUEREQUEST" : this.props.Login.addSampleModal ? "IDS_BGSIECATALOGUEREQUESTSAMPLE" : this.props.Login.screenName}
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
                                <ViewBGSiECatalogueRequest
                                    selectedRecord={this.props.Login.masterData && this.props.Login.masterData.selectedBioBGSiECatalogueRequest ? this.props.Login.masterData.selectedBioBGSiECatalogueRequest : {}}
                                    formatMessage={this.props.intl.formatMessage}
                                />
                                :
                                this.props.Login.addRequestModal ?
                                    <AddBGSiECatalogueRequest
                                        selectedRecord={this.state.selectedChildRecord}
                                        selectedBioBGSiECatalogueRequest={this.props.Login.masterData?.selectedBioBGSiECatalogueRequest || {}}
                                        bioProjectList={this.props.Login.masterData?.bioProjectList ?? []}
                                        projectSiteList={this.props.Login.masterData?.projectSiteList ?? []}
                                        requestFormList={this.props.Login.masterData?.requestFormList ?? []}
                                        sampleTypeList={this.props.Login.masterData?.sampleTypeList ?? []}
                                        formatMessage={this.props.intl.formatMessage}
                                        // existing onChange preserved for backwards compatibility
                                        onChange={this.handleRequestDataChange}
                                    // new callback: child will push canonical snapshot (selectedRecord, request, availablecount, parentSamplesList)
                                    />
                                    : this.props.Login.addSampleModal ?
                                        <AddBGSiECatalogueReqSamples
                                            selectedRecord={this.state.selectedChildRecord}
                                            selectedBioBGSiECatalogueRequest={selectedRequest}
                                            sampleTypeList={this.props.Login.masterData?.sampleTypeList || []}
                                            parentSamples={this.props.Login.masterData?.parentSamples || []}
                                            availablecount={this.props.Login.masterData?.availablecount || 0}
                                            mode={sampleAddMode}
                                            onFilterParentSamples={(payload) => this.props.fetchParentSamples(payload)}
                                            onFilterBioAvailability={(payload) => this.props.fetchBioSampleAvailability(payload)}
                                            onChange={this.handleSampleDataChange}
                                            formatMessage={this.props.intl.formatMessage}
                                        />
                                        : ""}
                    /> : ""}
                {this.state.showCatalogueModal ?
                    <BGSiECatalogueModal
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
            const lstBioBGSiECatalogueDetails = this.props.Login.masterData?.lstBioBGSiECatalogueDetails || [];

            newState.userRoleControlRights = userRoleControlRights;
            newState.controlMap = controlMap;
            newState.data = lstBioBGSiECatalogueDetails;
            newState.dataResult = process(lstBioBGSiECatalogueDetails, newState.sampleState);
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
            const lstBioBGSiECatalogueDetails = this.props.Login.masterData?.lstBioBGSiECatalogueDetails || [];
            if (this.props.Login.masterData?.lstBioBGSiECatalogueDetails !== prevProps.Login.masterData?.lstBioBGSiECatalogueDetails) {
                newState.data = lstBioBGSiECatalogueDetails;
                if (this.props.Login.masterData?.selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode !== prevProps.Login.masterData?.selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode) {
                    const take = newState.sampleState.take;
                    const skip = 0;
                    newState.sampleState = { skip, take };
                    newState.dataResult = process(lstBioBGSiECatalogueDetails, newState.sampleState);
                    stateChanged = true;
                }
                if (this.props.Login.masterData?.selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode === prevProps.Login.masterData?.selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode) {
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
                        newState.dataResult = process(lstBioBGSiECatalogueDetails, newState.sampleState);
                        stateChanged = true;
                    } else {
                        if (this.props.Login.operation === "create") {
                            const take = newState.sampleState.take;
                            const skip = 0;
                            newState.sampleState = { skip, take };
                        }
                        newState.dataResult = process(lstBioBGSiECatalogueDetails, newState.sampleState);
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

    // Parent callback for child canonical snapshots. Store in instance var; do NOT setState here.
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
        let RealFilterStatuslist = this.props.Login.masterData.BGSiECatalogueStatusList || []

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
        this.props.getBGSiECatalogueByFilterSubmit(inputParam);
    }

    viewSelectedBGSiECatalogueRequestForm = (inputParam) => {
        let masterToView = inputParam.masterToView;
        masterToView["userinfo"] = this.props.Login.userInfo;
        masterToView["masterData"] = this.props.Login.masterData;
        masterToView["sampleState"] = this.state.sampleState;
        masterToView["skip"] = this.state.skip;
        let viewModal = "viewModal";
        this.props.getActiveBGSiECatalogueRequestForm(masterToView, viewModal)
    }

    handleSampleDataChange = (snapshot) => {
        // snapshot coming from child contains the normalized server keys
        // store snapshot directly so Save/Update will read exact fields
        const selectedChildRecord = { ...(this.state.selectedChildRecord || {}), ...snapshot };
        // keep for editing and eventual Save call
        this.setState({ selectedChildRecord, shouldRender: false });
    };
    // Consolidated upward data channel: (request, detailsArray)
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
        selectedRecord.nselectedsitecode = getId(request?.nsitecode ?? request?.nreceivingsitecode ?? request?.receivingSite, "nsitecode");

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
        this.props.getCatalogueCombo(masterData, userInfo)
    }

    addBGSiECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let masterData = { ...this.props.Login.masterData };
        let userinfo = this.props.Login.userInfo;
        let inputParam = {
            masterData,
            userinfo,
            operation: operation,
            screenName: screenName,
            ncontrolcode: ncontrolcode
        };
        this.props.getCatalogueComboforAdd(inputParam);
    }
    sendBGSiECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let selectedBioBGSiECatalogueRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest ?? {};
        let masterData = this.props.Login?.masterData ?? {};
        const nbgsiecatrequestcode = selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode ?? -1;

        if (nbgsiecatrequestcode <= 0) {
            toast.info(
                this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOSEND" })
            );
        }
        else {
            const ntransactionstatus = selectedBioBGSiECatalogueRequest?.ntransactionstatus ?? -1;
            if (ntransactionstatus == transactionStatus.DRAFT) {
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                let postParam = undefined;
                inputData["nbgsiecatrequestcode"] = nbgsiecatrequestcode;
                inputData["ncontrolcode"] = ncontrolcode;
                const inputParam = {
                    classUrl: "bgsiecatalogue",
                    methodUrl: "BGSiECatalogueRequest",
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
                                modalOperation: "sendBGSiECatalogueRequest"
                            },
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.sendBGSiECatalogueRequest(inputParam, masterData);
                }
            } else {
                toast.warn(
                    this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOSEND" })
                );
            }
        }

    }
    cancelBGSiECatalogueRequest = (ncontrolcode, operation, screenName) => {
        let selectedBioBGSiECatalogueRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest ?? {};
        let masterData = this.props.Login?.masterData ?? {};
        const nbgsiecatrequestcode = selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode ?? -1;

        if (nbgsiecatrequestcode <= 0) {
            toast.info(
                this.props.intl.formatMessage({ id: "IDS_SELECTADRAFTFORMTOCANCEL" })
            );
        }
        else {
            const ntransactionstatus = selectedBioBGSiECatalogueRequest?.ntransactionstatus ?? -1;
            if (ntransactionstatus == transactionStatus.DRAFT || ntransactionstatus == transactionStatus.REQUESTED) {
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                let postParam = undefined;
                inputData["nbgsiecatrequestcode"] = nbgsiecatrequestcode;
                const inputParam = {
                    classUrl: "bgsiecatalogue",
                    methodUrl: "BGSiECatalogueRequest",
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
                                modalOperation: "cancelBGSiECatalogueRequest",
                            }
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.cancelBGSiECatalogueRequest(inputParam, masterData);
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
        let selectedBioBGSiECatalogueRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest ?? {};

        if (selectedBioBGSiECatalogueRequest.ntransactionstatus == transactionStatus.DRAFT) {
            let nbgsiecatrequestcode = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest?.nbgsiecatrequestcode ?? -1;
            let skip = this.state.state;
            this.props.getProductComboDataForSampleAdd(nbgsiecatrequestcode, this.props.Login.userInfo, this.props.Login.masterData, operation, screenName, ncontrolcode, skip);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTSTATUSRECORD" }));
        }
    }

    deleteRecord = (deleteParam) => {
        let selectedBioBGSiECatalogueRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest ?? {};
        if (selectedBioBGSiECatalogueRequest.ntransactionstatus == transactionStatus.DRAFT) {

            let inputData = [];
            let inputParam = {};
            let masterData = this.props.Login.masterData || {};
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["nbgsiecatdetailcode"] = deleteParam?.selectedRecord?.nbgsiecatdetailcode ?? -1;
            inputData["nbgsiecatrequestcode"] = deleteParam?.selectedRecord?.nbgsiecatrequestcode ?? -1;
            inputParam = {
                classUrl: "bgsiecatalogue",
                methodUrl: "BGSiECatalogueRequestSample",
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
                this.props.deleteBGSiECatalogueRequestSample(inputParam, masterData);
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
        this.props.getBGSiECatalogueByFilterSubmit(inputParam);
    }

    onMandatoryCheck = (saveType) => {
        const mandatoryFields = this.props.Login.loadEsign ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.addRequestModal ? [
                // { "idsName": "IDS_BIOPROJECT", "dataField": "nselectedbioprojectcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                // { "idsName": "IDS_SITE", "dataField": "nselectedsitecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
            ]
                :
                this.props.Login.addSampleModal ? [
                    // { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "nselectedproductcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                    // { "idsName": "IDS_REQUESTVOLUMEµL", "dataField": "srequestvolume", "mandatory": true, "mandatoryLabel": "IDS_ENTER", },
                ]
                    :
                    [];
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

        // Fallback for form type if user didn't touch the combo yet
        let nform = selectedRecord.nselectedreqformtypecode;
        if (nform == null) {
            const preset = this.props?.Login?.masterData?.selectedReqFormType;
            if (preset && typeof preset.nreqformtypecode === 'number') {
                nform = preset.nreqformtypecode;
            }
        }

        const nproj = selectedRecord.nselectedbioprojectcode;
        const nsite = selectedRecord.nselectedsitecode;

        // Hard validation to avoid 500s due to missing header codes
        if (nproj == null || nsite == null || nform == null) {
            const missing = [
                nproj == null ? this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" }) : null,
                nsite == null ? this.props.intl.formatMessage({ id: "IDS_RECEIVINGSITE" }) : null,
                nform == null ? this.props.intl.formatMessage({ id: "IDS_REQUESTFORMTYPE" }) : null,
            ].filter(Boolean).join(', ');
            toast.warn(`${this.props.intl.formatMessage({ id: "IDS_SELECT" })} ${missing}`);
            return;
        }

        // Dates & filter values (same as your existing logic)
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

        // Payload expected by DAO
        const inputData = {
            nfilterstatus: RealFilterStatusValue && RealFilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            FromDate: obj.fromDate,
            ToDate: obj.toDate,
            nselectedbioprojectcode: nproj,
            nselectedsitecode: nsite,
            nselectedreqformtypecode: nform, // numeric
            requestProductList,
            sremarks: selectedRecord.sremarks || "",
        };

        const inputParam = {
            classUrl: "bgsiecatalogue",
            methodUrl: "BGSiECatalogueRequest",
            inputData,
            operation: "create",
            saveType,
            formRef,
            postParam: undefined,
            searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord },
            skip: this.state.state,
        };

        this.props.createBGSiECatalogueRequest(inputParam, masterData, saveType);
    };



    onSaveSampleClick = (saveType = 1, formRef) => {
        const rec = this.state.selectedChildRecord || {};
        const masterRequest = this.props.Login?.masterData?.selectedBioBGSiECatalogueRequest || {};
        const nbgsiecatrequestcode = masterRequest?.nbgsiecatrequestcode ?? rec.nbgsiecatrequestcode ?? -1;

        // Normalize key fields from snapshot
        const nproductcode = rec.nproductcode ?? rec.nselectedproductcode ?? null;
        const nreqnoofsamples = rec.nreqnoofsamples ?? null; // requested number of samples
        const navailableCount = rec.navailableCount ?? rec.availablecount ?? null; // available samples
        const sparentsamplecode = rec.sparentsamplecode ?? null;
        const nbgsiecatdetailcode = rec.nbgsiecatdetailcode ?? -1;


        // ---- Uniqueness checks ----
        const existing = (this.props.Login?.masterData?.lstBioBGSiECatalogueDetails || []);
        if (sparentsamplecode) {
            const isDup = existing.some(r =>
                Number(r.nproductcode) === Number(nproductcode) &&
                String(r.sparentsamplecode || "").trim() === String(sparentsamplecode || "").trim() &&
                Number(r.nbgsiecatdetailcode) !== Number(nbgsiecatdetailcode)
            );
            if (isDup) {
                toast.info(this.props.intl.formatMessage({ id: "IDS_DUPLICATECOMBINATION" }) || "This Bio Sample Type + Parent Sample Code is already added.");
                return;
            }
        } else {
            const isDup = existing.some(r =>
                Number(r.nproductcode) === Number(nproductcode) &&
                Number(r.nbgsiecatdetailcode) !== Number(nbgsiecatdetailcode)
            );
            if (isDup) {
                toast.info(this.props.intl.formatMessage({ id: "IDS_DUPLICATESAMPLETYPE" }) || "This Bio Sample Type is already added.");
                return;
            }
        }
        // ---- Mandatory validations ----
        if (nbgsiecatrequestcode <= 0) {
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

        // For Parent Sample-based forms, parent sample code is mandatory
        const requestFormTypeCode =
            masterRequest?.nreqformtypecode ?? this.props.Login.masterData?.selectedReqFormType?.nreqformtypecode;
        const isParentForm = requestFormTypeCode === RequestFormType.PARENT_SAMPLE_BASED;

        if (isParentForm && (!sparentsamplecode || sparentsamplecode === "")) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPARENTSAMPLE" }) || "Select Parent Sample Code");
            return;
        }

        // ---- Availability validation ----
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

        // ---- Build payload for backend ----
        const inputData = {
            userinfo: this.props.Login.userInfo,
            nbgsiecatrequestcode,
            nbgsiecatdetailcode: nbgsiecatdetailcode > 0 ? nbgsiecatdetailcode : null,
            nproductcode: Number(nproductcode),
            nreqnoofsamples: Number(nreqnoofsamples),
            sparentsamplecode,
            sreqminvolume: (rec.sreqminvolume ?? "").toString().trim(),
            nbioprojectcode: masterRequest.nbioprojectcode ?? null,
            nsitecode: masterRequest.nreceiversitecode ?? null,
        };

        const inputParam = {
            classUrl: "bgsiecatalogue",
            methodUrl: "BGSiECatalogueRequestSample",
            inputData,
            operation: nbgsiecatdetailcode > 0 ? "update" : "create",
            saveType,
            formRef,
            postParam: undefined,
            searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedChildRecord },
            selectedId: nbgsiecatdetailcode > 0 ? nbgsiecatdetailcode : null,
            skip: this.state.skip,
        };

        // ---- Existing eSign flow ----
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
                        modalOperation: nbgsiecatdetailcode > 0 ? "updateChild" : "createChild",
                    },
                    saveType,
                },
            };
            this.props.updateStore(updateInfo);
        } else {
            const masterData = { ...this.props.Login.masterData };
            this.props.saveBGSiECatalogueRequestSample(inputParam, masterData, saveType);
        }
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
        this.props.validateEsignforBGSiECatalogue(inputParam);
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
    onSaveMandatoryValidation, getCatalogueCombo, getBGSiECatalogueByFilterSubmit, getActiveBGSiECatalogueRequestForm,
    getCatalogueComboforAdd, createBGSiECatalogueRequest, sendBGSiECatalogueRequest, cancelBGSiECatalogueRequest,
    getProductComboDataForSampleAdd, deleteBGSiECatalogueRequestSample, saveBGSiECatalogueRequestSample,
    getActiveBGSiECatalogueSampleDetail, validateEsignforBGSiECatalogue
})(injectIntl(BGSiECatalogue));
