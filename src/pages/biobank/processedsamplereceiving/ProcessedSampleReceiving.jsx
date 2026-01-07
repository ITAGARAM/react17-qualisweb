import React from "react";
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Button, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { ContentPanel, ReadOnlyText } from "../../../components/App.styles";
import {
    getControlMap, showEsign, rearrangeDateFormat, convertDateValuetoString,
    convertDateTimetoStringDBFormat, constructOptionList, onSaveMandatoryValidation
} from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import DataGridSelection from '../../../components/data-grid/data-grid-withSelection.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import Esign from '../../audittrail/Esign';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import {
    updateStore, filterTransactionList, getProcessedSampleByFilterSubmit, getActiveSampleCollection,
    getParentSampleCollectionDataForAdd, createProcessedSampleReceiving, deleteProcessedSampleReceiving,
    updateBioSampleCollectionAsProcessed, getStorageDataForAdd, storeProcessedSampleReceiving, validateEsignCredentialProcessedSampleReceiving
} from '../../../actions';
import ViewBioParentCollection from "./ViewBioParentCollection";
import ProcessedSampleFilter from "./ProcessedSampleFilter";
import AddBioSampleAliquot from "./AddBioSampleAliquot";
import BreadcrumbComponent from "../../../components/Breadcrumb.Component";
import StorageStrcutreView from "./StorageStrcutreView"

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ProcessedSampleReceiving extends React.Component {
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
        this.searchFieldList = ["sparentsamplecode", "ncohortno", "sprojecttitle", "scollectionsitename", "sbiosampledisplay",
            "shospitalname", "sproductcatname", "scollectorname", "ssendername", "srecipientusername",
            "stransactionstatus", "stransactiondate"]
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
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 30,
            stateFilterStatus: [],
            shouldRender: true,
            selectedChildRecord: {
                ddateReceived: new Date(),
            },
            comboChangeData: [],
            data: [],
            selectedFreezerRecord: {},
            initialSelectedFreezerRecord: {},
            panes: [
                { size: '30%', min: '25%',collapsible: true}
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

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.props.Login.addBioSampleModal) && this.state.shouldRender === false && nextProps.Login.shouldRender === false) {
            return false;
        } else if ((this.props.Login.storageModal) && this.state.shouldRender === false && nextProps.Login.shouldRender === false) {
            return false;
        }
        else {
            return true;
        }
    }

    
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    render() {
        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.FromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.ToDate;
        const addMasterId = this.state.controlMap.has("AddProcessedSample") && this.state.controlMap.get("AddProcessedSample").ncontrolcode;
        const deleteMasterId = this.state.controlMap.has("DeleteProcessedSample") && this.state.controlMap.get("DeleteProcessedSample").ncontrolcode;
        const processSampleId = this.state.controlMap.has("ProcessSampleCollection") && this.state.controlMap.get("ProcessSampleCollection").ncontrolcode;
        const storeSampleId = this.state.controlMap.has("StoreProccessedSample") && this.state.controlMap.get("StoreProccessedSample").ncontrolcode;
        let bioSampleReceiving = this.props.Login.masterData ? this.props.Login.masterData.lstBioSampleReceiving : [];
        const SubFields = [
            // { [designProperties.VALUE]: "stransactionstatus" },
            { [designProperties.VALUE]: "sisthirdpartysharable" }, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            { [designProperties.VALUE]: "sissampleaccesable" }, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
            { [designProperties.VALUE]: "stransactiondate" },
        ];
        const filterParam = {
            inputListName: "lstBioParentSampleCollection", selectedObject: "selectedBioParentSampleCollection", primaryKeyField: "nbioparentsamplecollectioncode",
            fetchUrl: "processedsamplereceiving/getActiveSampleCollection", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioParentSampleCollection",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioParentSampleCollection',
            skip: 0, take: this.state.take
        };
        this.extractedDataGridColumnList = [
            { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "150px" },
            { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "150PX" },
            { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "150px" },
            { "idsName": "IDS_SAMPLESTATUS", "dataField": "stransactionstatus", "width": "150px" },
            { "idsName": "IDS_VOLUMEµL", "dataField": "sqty", "width": "150px" },
            { "idsName": "IDS_STORAGETYPE", "dataField": "sstoragetypename", "width": "150px" },
            { "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "width": "150px" },
            { "idsName": "IDS_DISEASESTATUS", "dataField": "sdiagnostictypename", "width": "150px" },
            { "idsName": "IDS_RECEIVEDDATE", "dataField": "sreceiveddate", "width": "150px" },
            //added by sujatha ATE_274 for added new column BGSI-218 to show in UI
            // commentted by sujatha ATE_274 
            // { "idsName": "IDS_EXTRACTEDSAMPLEID", "dataField": "sextractedsampleid", "width": "150px" },
            // { "idsName": "IDS_CONCENTRATION", "dataField": "sconcentration", "width": "150px" },
            // { "idsName": "IDS_QCPLATFORM", "dataField": "sqcplatform", "width": "150px" },
            // { "idsName": "IDS_ELUENT", "dataField": "seluent", "width": "150px" },
            // { "idsName": "IDS_FORMNUMBER", "dataField": "srefformnumber", "width": "150px" },
            // { "idsName": "IDS_REPOID", "dataField": "sreferencerepoid", "width": "150px" },
        ]

        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height'>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                    
                                    <Splitter  panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal">
                                        <SplitterPane size="30%" min="25%">
                                            <TransactionListMasterJsonView
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={false}
                                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioParentSampleCollection || []}
                                                selectedMaster={[this.props.Login.masterData.selectedBioParentSampleCollection] || []}
                                                primaryKeyField="nbioparentsamplecollectioncode"
                                                getMasterDetail={(Sample, status) =>
                                                    this.props.getActiveSampleCollection(
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
                                                mainField={'sbiosampledisplay'}
                                                filterColumnData={this.props.filterTransactionList}
                                                subFields={SubFields}
                                                statusFieldName="stransactionstatus" //modified by sujatha ATE_274 BGSI-148 for color work
                                                statusField="ntransactionstatus"
                                                statusColor="stranscolor"
                                                showStatusIcon={false}
                                                showStatusLink={true}   //added by sujatha ATE_274 BGSI-148 for color work
                                                showStatusName={true}
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
                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReload()}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                                <RefreshIcon className='custom_icons' />
                                                            </Button>
                                                        </ProductList>
                                                        <ProductList className="d-flex product-category float-right">
                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                hidden={this.state.userRoleControlRights.indexOf(processSampleId) === -1}
                                                                onClick={() => this.onProcessed(this.props.Login.masterData, this.props.Login.userInfo, processSampleId)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PROCESSSAMPLECOLLECTION" })}>
                                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                            </Button>
                                                        </ProductList>
                                                    </>
                                                }
                                                filterComponent={[{
                                                    IDS_PROCESSEDSAMPLEFILTER: (
                                                        <ProcessedSampleFilter
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
                                                    this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection ?
                                                        [{
                                                            title: this.props.intl.formatMessage({ id: "IDS_VIEW" }),
                                                            controlname: "faEye",
                                                            hidden: false,
                                                            objectName: "masterToView",
                                                            onClick: this.viewSelectedBioSampleCollection,
                                                            inputData: {
                                                                primaryKeyName: "nbioparentsamplecollectioncode",
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
                                                                        <DataGridSelection
                                                                            primaryKeyField={"nbiosamplereceivingcode"}
                                                                            dataResult={this.state.dataResult}
                                                                            data={this.state.comboChangeData && this.state.comboChangeData.length > 0 ? this.state.comboChangeData : this.state.data}
                                                                            dataState={this.state.sampleState || []}
                                                                            dataStateChange={this.dataStateChange}
                                                                            extractedColumnList={this.extractedDataGridColumnList}
                                                                            controlMap={this.state.controlMap}
                                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                                            inputParam={this.props.Login.inputParam}
                                                                            userInfo={this.props.Login.userInfo}
                                                                            methodUrl="ProcessedSample"
                                                                            addRecord={() => this.openModal(addMasterId, 'create', 'IDS_BIOSAMPLE')}
                                                                            selectedField="selected"
                                                                            deleteRecord={this.deleteRecord}
                                                                            deleteParam={{ operation: "delete", screenName: "IDS_BIOSAMPLE", ncontrolCode: deleteMasterId }}
                                                                            pageable={true}
                                                                            scrollable={"scrollable"}
                                                                            isToolBarRequired={true}
                                                                            selectedId={this.props.Login.selectedId}
                                                                            hideColumnFilter={false}
                                                                            groupable={false}
                                                                            isActionRequired={false}
                                                                            /* chaged by sathish 11-aug-2025 responsive */
                                                                            gridHeight={'85vh'}
                                                                            isRefreshRequired={false}
                                                                            isDownloadPDFRequired={false}
                                                                            isDownloadExcelRequired={false}
                                                                            isCheckBoxRequired={true}
                                                                            selectionChange={this.onSelectionChange}
                                                                            headerSelectionChange={this.onHeaderSelectionChange}
                                                                            storeSample={() => this.storeSample(storeSampleId, '', 'IDS_STORESAMPLE')}
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
                {(this.props.Login.loadEsign || this.props.Login.addBioSampleModal || this.props.Login.viewModal || this.props.Login.storageModal) ?
                    <SlideOutModal
                        show={(this.props.Login.loadEsign || this.props.Login.addBioSampleModal || this.props.Login.viewModal || this.props.Login.storageModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.viewModal ? "view" : this.props.Login.loadEsign ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.viewModal ? "IDS_PARENTSAMPLECOLLECTION" : this.props.Login.loadEsign ? this.props.intl.formatMessage({ id: "IDS_ESIGN" }) : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        showSaveContinue={this.props.Login.addBioSampleModal ? true : false}
                        size={this.props.Login.addBioSampleModal ? 'xl' : 'lg'}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        hideSave={this.props.Login.viewModal ? true : false}
                        selectedRecord={this.props.Login.addBioSampleModal ? this.state.selectedChildRecord :
                            this.props.Login.loadEsign ? {
                                ...this.state.selectedChildRecord,
                                'esignpassword': this.state.selectedRecord['esignpassword'],
                                'esigncomments': this.state.selectedRecord['esigncomments'],
                                'esignreason': this.state.selectedRecord['esignreason']
                            } : (this.state.selectedRecord || {})
                        }
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChangeESign}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.viewModal ?
                                <ViewBioParentCollection
                                    selectedRecord={this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection ? this.props.Login.masterData.selectedBioParentSampleCollection : {}}
                                    formatMessage={this.props.intl.formatMessage}
                                /> :
                                this.props.Login.addBioSampleModal ? // wait until default values are ready
                                    <AddBioSampleAliquot
                                        selectedRecord={this.state.selectedChildRecord}
                                        aliquotList={this.state.aliquotList || []}
                                        selectedBioParentSampleCollection={this.props.Login.masterData?.selectedBioParentSampleCollection || {}}
                                        containerTypeList={this.props.Login.masterData?.containerTypeList ?? []}
                                        sampleTypeList={this.props.Login.masterData?.sampleTypeList ?? []}
                                        diagnosticTypeList={this.props.Login.masterData?.diagnosticTypeList ?? []}
                                        storageTypeList={this.props.Login.masterData?.storageTypeList ?? []}
                                        formatMessage={this.props.intl.formatMessage}
                                        operation={this.props.Login.operation}
                                        userInfo={this.props.Login.userInfo}
                                        onDataChange={this.handleAliquotDataChange}
                                    />

                                    : this.props.Login.storageModal ?
                                        <StorageStrcutreView
                                            id="samplestoragelocation"
                                            name="samplestoragelocation"
                                            //treeDataView={this.state.treeDataView}
                                            treeDataView={this.state.treeDataView || this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].data}
                                            freezerData={this.props.Login.masterData.freezerList}
                                            initialSelectedFreezerRecord={this.state.selectedFreezerRecord || this.props.Login.initialSelectedFreezerRecord}
                                            //initialSelectedFreezerRecord={this.props.Login.initialSelectedFreezerRecord}
                                            expandIcons={true}
                                            selectField={'active-node'}
                                            onFreezerChange={(updatedRecord) => this.setState({ selectedFreezerRecord: updatedRecord, shouldRender: false })}
                                            onTreeDataChange={(newTreeData) => this.setState({ treeDataView: newTreeData, shouldRender: false })}
                                        /> : ""}
                    /> : ""}

            </>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        let newState = { ...this.state };
        let stateChanged = false;

        // User form change
        if (this.props.Login.userInfo.nformcode !== prevProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            const rights = this.props.Login.userRoleControlRights?.[this.props.Login.userInfo.nformcode];
            if (rights) {
                Object.values(rights).forEach(item => userRoleControlRights.push(item.ncontrolcode));
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode);
            const lstBioSampleReceiving = this.props.Login.masterData?.lstBioSampleReceiving || [];

            newState.userRoleControlRights = userRoleControlRights;
            newState.controlMap = controlMap;
            newState.data = lstBioSampleReceiving;
            newState.dataResult = process(lstBioSampleReceiving, newState.sampleState);
            stateChanged = true;
        }

        // Filter, render flags, selections
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
        if (this.props.Login.initialSelectedFreezerRecord !== prevProps.Login.initialSelectedFreezerRecord) {
            newState.initialSelectedFreezerRecord = this.props.Login.initialSelectedFreezerRecord;
            stateChanged = true;
        }
        if (this.props.Login.selectedFreezerRecord !== prevProps.Login.selectedFreezerRecord) {
            newState.selectedFreezerRecord = this.props.Login.selectedFreezerRecord;
            stateChanged = true;
        }
        if (this.props.Login.selectedChildRecord !== prevProps.Login.selectedChildRecord) {
            newState.selectedChildRecord = this.props.Login.selectedChildRecord;
            stateChanged = true;
        }
        if (this.props.Login.aliquotList !== prevProps.Login.aliquotList) {
            newState.aliquotList = this.props.Login.aliquotList;
            stateChanged = true;
        }

        // MasterData change (filters, breadcrumb, reset page)
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
                if (this.props.Login.operation !== "store") { // ✅ Preserve skip on store
                    newState.sampleState = { ...newState.sampleState, skip: 0 };
                }
                stateChanged = true;
            }

            const lstBioSampleReceiving = this.props.Login.masterData?.lstBioSampleReceiving || [];
            if (this.props.Login.masterData?.lstBioSampleReceiving !== prevProps.Login.masterData?.lstBioSampleReceiving) {
                newState.data = lstBioSampleReceiving;
                if (this.props.Login.masterData?.selectedBioParentSampleCollection !== prevProps.Login.masterData?.selectedBioParentSampleCollection) {
                    if (this.props.Login.operation !== "store") { // ✅ Preserve skip on store
                        newState.sampleState = { ...newState.sampleState, skip: 0 };
                    }
                    newState.dataResult = process(lstBioSampleReceiving, newState.sampleState);
                    stateChanged = true;
                }
                if (this.props.Login.masterData?.selectedBioParentSampleCollection == prevProps.Login.masterData?.selectedBioParentSampleCollection) {
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
                        const skip = newState.sampleState.skip >= take ? newState.sampleState.skip - take : 0;
                        newState.sampleState = { skip, take };
                        newState.dataResult = process(lstBioSampleReceiving, newState.sampleState);
                        stateChanged = true;
                    } else {
                        newState.dataResult = process(lstBioSampleReceiving, newState.sampleState);
                        stateChanged = true;
                    }
                }
            }

            if (this.props.Login.masterData.selectedSampleStorageVersion !== prevProps.Login.masterData.selectedSampleStorageVersion) {
                if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                    newState.treeDataView = this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].data;
                    stateChanged = true;
                }
            }
        }

        newState.skip = this.props.Login.skip === undefined ? newState.skip : this.props.Login.skip;

        // Combo change
        if (prevState.comboChangeData !== newState.comboChangeData) {
            newState.dataResult = process(
                newState.comboChangeData?.length > 0 ? newState.comboChangeData : newState.data,
                newState.sampleState
            );
            stateChanged = true;
        }

        if (stateChanged) {
            this.setState(newState);
        }
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
        let RealFilterStatuslist = this.props.Login.masterData.ProcessedSampleStatusList || []

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
        this.props.getProcessedSampleByFilterSubmit(inputParam);
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

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    onProcessed = (masterData, userInfo, processSampleId) => {
        let nbioparentsamplecollectioncode = masterData.selectedBioParentSampleCollection && masterData.selectedBioParentSampleCollection.nbioparentsamplecollectioncode || -1;
        if (masterData.selectedBioParentSampleCollection && masterData.selectedBioParentSampleCollection.ntransactionstatus == transactionStatus.UNPROCESSED) {
            let skip = this.state.state;
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["nbioparentsamplecollectioncode"] = nbioparentsamplecollectioncode;
            inputData["skip"] = skip;
            let postParam = undefined;

            const inputParam = {
                // classUrl: "processedsamplereceiving",
                // methodUrl: "ProcessedSampleReceiving",
                inputData: inputData,
                operation: "update",
                postParam, searchRef: this.searchRef,
                selectedRecord: { ...this.state.selectedRecord },
                skip: this.state.state
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, processSampleId)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: {
                            inputParam,
                            masterData,
                            selectedRecord: { ...this.state.selectedRecord },
                            modalOperation: "processParent"
                        },
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.updateBioSampleCollectionAsProcessed(nbioparentsamplecollectioncode, masterData, userInfo, skip)
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNOTYETPROCESSEDSTATUSRECORD" }));
        }

    }

    viewSelectedBioSampleCollection = (inputParam) => {
        let masterToView = inputParam.masterToView;
        masterToView["userinfo"] = this.props.Login.userInfo;
        masterToView["masterData"] = this.props.Login.masterData;
        masterToView["sampleState"] = this.state.sampleState;
        masterToView["skip"] = this.state.skip;
        let viewModal = "viewModal";
        this.props.getActiveSampleCollection(masterToView, viewModal)
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let viewModal = this.props.Login.viewModal;
        let addBioSampleModal = this.props.Login.addBioSampleModal;
        let selectedChildRecord = this.props.Login.selectedChildRecord;
        let selectedRecord = this.props.Login.selectedRecord;
        let storageModal = this.props.Login.storageModal;
        let aliquotList = this.state.aliquotList;
        let shouldRender = this.state.shouldRender;


        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                viewModal = false;
                addBioSampleModal = false;
                storageModal = false;
                aliquotList = [];
                selectedChildRecord = {
                    ddateReceived: new Date()   // uncommentted by sujatha ATE_274 for wrong date alert even though the date is there
                };
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
            viewModal = false;
            addBioSampleModal = false;
            storageModal = false;
            aliquotList = [];
            selectedChildRecord = {
                 ddateReceived: new Date()   // uncommentted by sujatha ATE_274 for wrong date alert even though the date is there
            };
            shouldRender = true;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                viewModal, loadEsign, selectedRecord, addBioSampleModal, storageModal, aliquotList, shouldRender,
                selectedChildRecord
            }
        }
        this.props.updateStore(updateInfo);
    }

    openModal = (ncontrolcode, operation, screenName) => {
        let nbioparentsamplecollectioncode = this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection ?
            this.props.Login.masterData.selectedBioParentSampleCollection.nbioparentsamplecollectioncode : -1;
        if (this.props.Login.masterData.selectedBioParentSampleCollection
            && this.props.Login.masterData.selectedBioParentSampleCollection.ntransactionstatus == transactionStatus.UNPROCESSED) {
            let skip = this.state.state;
            this.props.getParentSampleCollectionDataForAdd(nbioparentsamplecollectioncode, this.props.Login.userInfo, this.props.Login.masterData, operation, screenName, ncontrolcode, skip);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNOTYETPROCESSEDSTATUSRECORD" }));
        }
    }

    deleteRecord = (deleteParam) => {

        let dataResult = [];
        this.state.dataResult && this.state.dataResult.data.map(data => {
            if (data.selected == true && data.selected != undefined) {
                dataResult.push(data);
            }
        });
        let hasAliquotedRecord = false;
        if (dataResult.length > 0) {
            dataResult && dataResult.map(data => {
                if (data.ntransactionstatus !== transactionStatus.ALIQUOTED) {
                    hasAliquotedRecord = true;
                }
            });
            if (hasAliquotedRecord) {
                return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALIQUOTEDSTATUSRECORD" }));
            } else {

                const nbiosamplereceivingcode = dataResult && dataResult.map(x => x.nbiosamplereceivingcode).join(",");

                let inputData = [];
                let inputParam = {};
                let masterData = this.props.Login.masterData || {};
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioparentsamplecollectioncode"] = this.props.Login.masterData.selectedBioParentSampleCollection.nbioparentsamplecollectioncode;
                inputData["sbiosamplereceivingcode"] = nbiosamplereceivingcode;
                inputParam = {
                    classUrl: "processedsamplereceiving",
                    methodUrl: "ProcessedSampleReceiving",
                    inputData: inputData,
                    operation: "delete",
                    skip: this.state.state
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true,
                            shouldRender: true,
                            screenData: { inputParam, masterData, selectedRecord: { ...this.state.selectedRecord }, modalOperation: "deleteChild" }
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.deleteProcessedSampleReceiving(inputParam, masterData);
                }
            }
        }
        else {
            return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALIQUOTEDSTATUSRECORD" }));
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
        this.props.getProcessedSampleByFilterSubmit(inputParam);
    }

    handleAliquotDataChange = (record, aliquots) => {
        this.setState({ selectedChildRecord: record, aliquotList: aliquots, shouldRender: false });
    };

    storeSample = (ncontrolcode, operation, screenName) => {
        let nbioparentsamplecollectioncode = this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection ?
            this.props.Login.masterData.selectedBioParentSampleCollection.nbioparentsamplecollectioncode : -1;
        const nstorageinstrumentcode = this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection ?
            this.props.Login.masterData.selectedBioParentSampleCollection.nstorageinstrumentcode : -1;
        if (this.props.Login.masterData.selectedBioParentSampleCollection
            && this.props.Login.masterData.selectedBioParentSampleCollection.ntransactionstatus == transactionStatus.UNPROCESSED) {
            if (
                this.state.dataResult.data.length < 1 ||
                !this.state.dataResult.data.some(item => item.selected)
            ) {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_NORECORDHAVEBEENSELECTEDINPAGE" }));
            } else {
                this.props.getStorageDataForAdd(nbioparentsamplecollectioncode, nstorageinstrumentcode, this.props.Login.userInfo, this.props.Login.masterData, operation, screenName, ncontrolcode);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTNOTYETPROCESSEDSTATUSRECORD" }));
        }
    }

    onMandatoryCheck = (saveType) => {
        const mandatoryFields = this.props.Login.loadEsign ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                // { "idsName": "IDS_CHECKAGREE","dataField": "agree",  "mandatoryLabel": "IDS_SELECT", "controlType": "checkbox" },

            ]
            :
            this.props.Login.addBioSampleModal ? [
                { "idsName": "IDS_DATERECEIVED", "dataField": "ddateReceived", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                { "idsName": "IDS_DISEASESTATUS", "dataField": "ndiagnostictypecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                { "idsName": "IDS_CONTAINERTYPE", "dataField": "ncontainertypecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "nproductcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                { "idsName": "IDS_STORAGETYPE", "dataField": "nstoragetypecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nsamplecount", "mandatory": true, "mandatoryLabel": "IDS_ENTER", },
            ]
                :
                this.props.Login.storageModal ? [
                    { "idsName": "IDS_STORAGENAME", "dataField": "nstorageinstrumentcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                ]
                    :
                    [];
        {
            onSaveMandatoryValidation(
                this.props.Login.loadEsign ? this.state.selectedRecord : this.props.Login.addBioSampleModal ? this.state.selectedChildRecord : this.props.Login.storageModal ? this.state.selectedFreezerRecord : {},
                mandatoryFields,
                this.props.Login.loadEsign ? this.validateEsign : this.props.Login.addBioSampleModal ? this.onSaveClick : this.props.Login.storageModal ? this.onSaveStorageClick : "",
                this.props.Login.loadEsign,
                saveType
            );
        }
    }
    onSaveClick = (saveType, formRef) => {
        let selectedChildRecord = this.state.selectedChildRecord || {};
        let aliquotList = this.state.aliquotList || [];
        const decOp = this.props.Login?.userInfo?.sdecimaloperator || '.';
        if (
          !(selectedChildRecord.naliquotcount > aliquotList.length) &&
          selectedChildRecord.naliquotcount == aliquotList.length
        ) {
          const isAnyVolumeEmpty = aliquotList.some((item) => !item.volume || item.volume.trim() === "");
          //const isAnyVolumeZero = aliquotList.some(item => item.volume && item.volume.trim() === "0");
          const isAnyVolumeZero = aliquotList.some((item) => {
            const v = (item.volume || "").trim();
            const num = parseFloat(v.replace(decOp, "."));
            return !isNaN(num) && num === 0;
          });
          if (selectedChildRecord.naliquotcount == 0) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ALIQUOTCOUNTCANNOTBEZERO" }));
          } else if (isAnyVolumeEmpty) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ALIQUOTVOLUMECANNOTBEEMPTY" }));
            return;
          } else if (isAnyVolumeZero) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ALIQUOTVOLUMECANNOTBEZERO" }));
            return;
          } else {
            let inputData = [];
            let masterData = this.props.Login.masterData;
            let sreceiveddate =
              selectedChildRecord.ddateReceived && selectedChildRecord.ddateReceived !== null
                ? convertDateTimetoStringDBFormat(selectedChildRecord.ddateReceived, this.props.Login.userInfo)
                : "";
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = undefined;
            inputData["naliquotcount"] = selectedChildRecord.naliquotcount;
            inputData["nproductcode"] = selectedChildRecord.nproductcode.value || -1;
            inputData["ndiagnostictypecode"] = selectedChildRecord.ndiagnostictypecode.value || -1;
            inputData["ncontainertypecode"] = selectedChildRecord.ncontainertypecode.value || -1;
            inputData["aliquotList"] = aliquotList;
            inputData["sreceiveddate"] = sreceiveddate;
            inputData["selectedBioParentSampleCollection"] =
              this.props.Login.masterData && this.props.Login.masterData.selectedBioParentSampleCollection
                ? this.props.Login.masterData.selectedBioParentSampleCollection
                : {};
            inputData["ncontrolcode"] = this.props.Login.ncontrolcode;

            const inputParam = {
              classUrl: "processedsamplereceiving",
              methodUrl: "ProcessedSampleReceiving",
              inputData: inputData,
              operation: this.props.Login.operation,
              saveType,
              formRef,
              postParam,
              searchRef: this.searchRef,
              selectedRecord: { ...this.state.selectedChildRecord },
              skip: this.state.state,
            };
            if (
              showEsign(
                this.props.Login.userRoleControlRights,
                this.props.Login.userInfo.nformcode,
                this.props.Login.ncontrolcode
              )
            ) {
              const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                  loadEsign: true,
                  shouldRender: true,
                  screenData: {
                    inputParam,
                    masterData,
                    selectedRecord: { ...this.state.selectedChildRecord },
                    modalOperation: "updateChild",
                  },
                  saveType,
                },
              };
              this.props.updateStore(updateInfo);
            } else {
              this.props.createProcessedSampleReceiving(inputParam, masterData, saveType);
            }
          }
        } else {
          toast.info(this.props.intl.formatMessage({ id: "IDS_ALIQUOTCOUNTANDALIQUOTLISTCOUNTDOESNOTMATCH" }));
        }
    }

    onSaveStorageClick = (saveType, formRef) => {

        let inputData = [];
        let masterData = this.props.Login.masterData;
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        inputData["nstorageinstrumentcode"] = this.state.selectedFreezerRecord?.nstorageinstrumentcode?.item?.nstorageinstrumentcode || -1;
        inputData["nsamplestoragelocationcode"] = this.state.selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestoragelocationcode || -1;
        inputData["nsamplestorageversioncode"] = this.state.selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestorageversioncode || -1;
        inputData["selectedBioParentSampleCollection"] = this.props.Login.masterData?.selectedBioParentSampleCollection;

        const selectedItems = (this.state.dataResult.data || []).filter(item => item.selected);

        const selectedBioSampleReceivingCodes = selectedItems
            .map(item => item.nbiosamplereceivingcode)
            .join(',');

        const selectedCount = selectedItems.length || 0;
        inputData["sbiosamplereceivingcodes"] = selectedBioSampleReceivingCodes || "";
        inputData["selectedCount"] = selectedCount;
        if (selectedCount !== 0) {
            const selectedNode = this.findFirstSelectedNode(this.state.treeDataView) || null;
            if (selectedNode !== null) {
                inputData["selectedNodeID"] = selectedNode.id;
                inputData["selectedNodeItemHierarchy"] = selectedNode.itemhierarchy;
                inputData["selectedNodeChildItems"] = selectedNode.items;
                const inputParam = {
                    classUrl: "processedsamplereceiving",
                    methodUrl: "ProcessedSampleReceiving",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, searchRef: this.searchRef,
                    sampleState: this.state.sampleState,
                    skip: this.state.state
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, shouldRender: true, screenData: {
                                inputParam,
                                masterData,
                                selectedRecord: { ...this.state.selectedRecord },
                                modalOperation: "storeChild",
                            }, saveType
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.storeProcessedSampleReceiving(inputParam, masterData, saveType);
                }
            } else {
                toast.info(
                    this.props.intl.formatMessage({ id: "IDS_SELECTANODETOSTORE" })
                );
            }
        } else {
            toast.info(
                this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOSTORE" })
            );
        }
    }

    findFirstSelectedNode = (tree) => {
        let found = null;
        function traverse(nodes) {
            for (const node of nodes) {
                if (node.selected) {
                    found = {
                        id: node.id,
                        itemhierarchy: node.itemhierarchy,
                        items: node.items || []
                    };
                    return true; // stop traversal
                }
                if (node.items && traverse(node.items)) {
                    return true; // bubble up the stop
                }
            }
            return false;
        }

        traverse(tree);
        return found;
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
        this.props.validateEsignCredentialProcessedSampleReceiving(inputParam);
    }

    handleFocus(e) {
        e.target.select();
    }

    onSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let comboChangedSamples = JSON.parse(JSON.stringify(this.state.comboChangeData));
        let changedSamples = JSON.parse([JSON.stringify(this.state.data)]);

        changedSamples.map(item => {
            if (item.nbiosamplereceivingcode === event.dataItem.nbiosamplereceivingcode) {
                item.selected = checked;
            }
        })
        comboChangedSamples.map(item => {
            if (item.nbiosamplereceivingcode === event.dataItem.nbiosamplereceivingcode) {
                item.selected = checked;
            }
        })
        this.setState({
            data: changedSamples,
            comboChangeData: comboChangedSamples
        });
    }

    onHeaderSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.dataResult.data || [];
        let comboChangedSamples = JSON.parse(JSON.stringify(this.state.comboChangeData));
        let changedSamples = JSON.parse([JSON.stringify(this.state.data)]);
        changedSamples.map(item => {
            data.map(dataItem => {
                if (item.nbiosamplereceivingcode === dataItem.nbiosamplereceivingcode) {
                    item.selected = checked;
                }
            })
        })
        comboChangedSamples.map(samples => {
            data.map(item => {
                if (samples.nbiosamplereceivingcode === item.nbiosamplereceivingcode) {
                    samples.selected = checked;
                }
            })
        })


        this.setState({
            data: changedSamples,
            comboChangeData: comboChangedSamples
        });
    }

}
export default connect(mapStateToProps, {
    updateStore, filterTransactionList,
    showEsign, rearrangeDateFormat, convertDateValuetoString, getProcessedSampleByFilterSubmit, convertDateTimetoStringDBFormat,
    getActiveSampleCollection, getParentSampleCollectionDataForAdd, onSaveMandatoryValidation, createProcessedSampleReceiving,
    deleteProcessedSampleReceiving, updateBioSampleCollectionAsProcessed, getStorageDataForAdd, storeProcessedSampleReceiving,
    validateEsignCredentialProcessedSampleReceiving
})(injectIntl(ProcessedSampleReceiving));