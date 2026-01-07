import { faEnvelope, faPlus, faThumbsUp, faUserTimes, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import React from "react";
// import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { toast } from 'react-toastify';
import { Affix } from 'rsuite';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ReactComponent as Reject } from '../../../assets/image/reject.svg';
import { ContentPanel } from "../../../components/App.styles";
import rsapi from '../../../rsapi';
import { ProductList } from '../../product/product.styled';

import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import AddThirdPartyCatalogueDataRequestandapproval from './AddThirdPartyCatalogueDataRequestandapproval';

import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { filterTransactionList, updateStore } from '../../../actions';
import {
    convertDateTimetoStringDBFormat, convertDateValuetoString, getControlMap,
    onSaveMandatoryValidation, rearrangeDateFormat,
    replaceUpdatedObject,
    showEsign,
    sortData
} from '../../../components/CommonScript';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import OuterGridThirdPartyCatalogue from "./OuterGridThirdPartyCatalogue";
import ThirdPartyCatalogueFilter from './ThirdPartyCatalogueFilter';
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ThirdPartyECatalogueDataRequestAndApproval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecord: {},
            selectedFilterRecord: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            controlMap: new Map(),
            dataResult: [],
            dataState: {
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 10
            },
            skip: 0,
            error: "",
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            splitChangeWidthPercentage: 30,
            selectedFilter: {},
            loading: false,
             //Added by L.Subashini on 23/12/2025 for Splitter issue with React Version Upgrade to 17
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


    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openModal && this.props.Login.openDirectTransfer && nextState.isInitialRender === false &&
            (nextState.selectedRecord !== this.state.selectedRecord)) {
            return false;
        } else {
            return true;
        }
    }

    openFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: true, filterSubmitValueEmpty: true }
        }
        this.props.updateStore(updateInfo);
    }

    
    //Added by L.Subashini on 23/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };

    render() {
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

        if (this.props.Login.masterData && this.props.Login.masterData.realSelectedFilterStatus) {
            breadCrumbData.push(
                {
                    "label": "IDS_FORMSTATUS",
                    "value": this.props.Login.masterData.realSelectedFilterStatus ? this.props.Login.masterData.realSelectedFilterStatus.label : '-'
                }
            );
        }

        this.searchFieldList = ["sformnumber", "stransdisplaystatus"];

        const SubFields = [
            { [designProperties.VALUE]: "sreceiversitename" },
            { [designProperties.VALUE]: "srequestdate" },
        ];
        // added by sujatha for an issue with updation of masterList bgsi-244
        const { searchedData } = this.props.Login.masterData;
        
        const masterData = this.props.Login.masterData || {};
        // commented and the below masterList is added by sujatha ATE_274 26/11/2025 for issue(while try to cancel draft/requested record all the data in the side bar is gone) bgsi-224
        // const masterList = this.props.Login.masterData.searchedData || masterData.lstBioDataaccess || masterData.lstBioProject || [];
        const masterList = searchedData?.length ? searchedData : masterData.lstBioDataaccess? masterData.lstBioDataaccess : masterData.lstBioProject || [];
        const selectedMaster = masterData.selectedBioDataaccess ? [masterData.selectedBioDataaccess] : [];

        const filterParam = {
            inputListName: "lstBioDataaccess",
            selectedObject: "lstChildBioDataaccess",
            primaryKeyField: "nbiodataaccessrequestcode",
            fetchUrl: "biobankrequest/getActiveBioDataAccess",
            masterData: masterData,
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioDataaccess",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioDataaccess',
            skip: 0, take: this.state.take
        };

        const selectedFilter = this.state.selectedFilter || {};
        const fromDate = selectedFilter.fromdate !== "" && selectedFilter.fromdate !== undefined
            ? selectedFilter.fromdate
            : this.props.Login.masterData.fromDate;

        const toDate = selectedFilter.todate !== "" && selectedFilter.todate !== undefined
            ? selectedFilter.todate
            : this.props.Login.masterData.toDate;

        const addID = this.state.controlMap.has("AddThirdPartyCatalogueDataRequestandapproval") &&
            this.state.controlMap.get("AddThirdPartyCatalogueDataRequestandapproval").ncontrolcode;


        const sendRequestID = this.state.controlMap.has("SendThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("SendThirdPartye-CatalogDataRequestandApproval").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("ApproveThirdPartye-CatalogDataRequestandApproval").ncontrolcode;
        const cancelRequestID = this.state.controlMap.has("CancelThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("CancelThirdPartye-CatalogDataRequestandApproval").ncontrolcode;
        const rejectId = this.state.controlMap.has("RejectThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("RejectThirdPartye-CatalogDataRequestandApproval").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddThirtyPartyChildRequestBasedTransfer") && this.state.controlMap.get("AddThirtyPartyChildRequestBasedTransfer").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("DeleteThirdPartye-CatalogDataRequestandApproval").ncontrolcode;
        const retireId = this.state.controlMap.has("RetireThirdPartye-CatalogDataRequestandApproval") && this.state.controlMap.get("RetireThirdPartye-CatalogDataRequestandApproval").ncontrolcode;

        return (
            <>
                <Preloader loading={this.state.loading} />

                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }

                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1}
                                    secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                    onSecondaryPaneSizeChange={this.paneSizeChange}
                                    primaryMinSize={40} secondaryMinSize={20}> */}
                                  <Splitter className='layout-splitter' orientation="horizontal"
                                             panes={this.state.panes} onChange={this.onSplitterChange}>
                                    <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        selectedMaster={selectedMaster}
                                        masterList={masterList}
                                        subFieldsLabel={false}
                                        subFields={SubFields}
                                        additionalParam={['']}
                                        mainField={'sformnumber'}
                                        filterColumnData={this.props.filterTransactionList}
                                        statusFieldName="stransdisplaystatus"
                                        statusField="ntransactionstatus"
                                        statusColor="stranscolor"
                                        showStatusIcon={false}
                                        showStatusLink={true}
                                        showStatusName={true}
                                        primaryKeyField="nbiodataaccessrequestcode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getDirectTransfer(
                                                {
                                                    masterData: this.props.Login.masterData,
                                                    userinfo: this.props.Login.userInfo,
                                                    ...Sample
                                                }, status
                                            )}
                                        needFilter={true}
                                        searchRef={this.searchRef}
                                        filterSubmitValueEmpty={this.props.Login.filterSubmitValueEmpty}
                                        openFilter={this.openFilter}
                                        filterParam={filterParam}
                                        showFilter={this.props.Login.showFilter}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        showStatusBlink={true}
                                        callCloseFunction={true}
                                        handlePageChange={this.handlePageChange}
                                        childTabsKey={[]}
                                        onFilterSubmit={this.onFilterSubmit}
                                        closeFilter={this.closeFilter}
                                        splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                        commonActions={
                                            <>
                                                <ProductList className="d-flex product-category float-right">
                                                    <Nav.Link
                                                        className="btn btn-icon-rounded btn-circle solid-blue"
                                                        role="button"
                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl?.formatMessage({ id: "IDS_ADDREQUEST" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                        onClick={() => this.addcatelogue(addID, 'create', 'IDS_OPENTHIRDPARTYCATALOG')}

                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SENDREQUEST" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(sendRequestID) === -1}
                                                        onClick={() => this.sendThirdECatalogueRequest(sendRequestID, 'send', 'IDS_THIRDPARTYCATALOG')} >
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVEREQUEST" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                        onClick={() => this.approveThirdECatalogueRequest(approveId, 'approve', 'IDS_THIRDPARTYCATALOG')}  >
                                                        <FontAwesomeIcon icon={faThumbsUp} />
                                                    </Nav.Link>
                                                    <Nav.Link className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CANCELREQUEST" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(cancelRequestID) === -1}
                                                        onClick={() => this.cancelThirdECatalogueRequest(cancelRequestID, 'cancel', 'IDS_THIRDPARTYCATALOG')} >
                                                        {/* <Reject className="custom_icons" width="20" height="20" /> */}
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </Nav.Link>
                                                    <Nav.Link className="btn btn-circle outline-grey ml-2 action-icons-wrap" variant="link"
                                                        hidden={this.state.userRoleControlRights && this.state.userRoleControlRights.indexOf(rejectId) === -1}
                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REJECTREQUEST" })}
                                                        onClick={() => this.rejectThirdECatalogueRequest(rejectId, 'reject', 'IDS_THIRDPARTYCATALOG')}>
                                                        <Reject className="custom_icons" width="20" height="20" />
                                                    </Nav.Link>
                                                    <Nav.Link name="retireUser" className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIREREQUEST" })}
                                                        onClick={() => this.retireThirdECatalogueRequest(retireId, 'retire', 'IDS_THIRDPARTYCATALOG')}
                                                    >
                                                        <FontAwesomeIcon icon={faUserTimes} />
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
                                                    <ThirdPartyCatalogueFilter
                                                        fromDate={fromDate}
                                                        toDate={toDate}
                                                        userInfo={this.props.Login.userInfo}
                                                        lstFilterStatus={this.props.Login.masterData?.lstFilterStatus || []}
                                                        selectedFilterStatus={this.props.Login.masterData?.selectedFilterStatus || {}}
                                                        childFilterDataChange={this.childFilterDataChange}
                                                        selectedRecord={this.state.selectedFilterRecord}
                                                    />
                                            }
                                        ]}
                                    />
                                    </SplitterPane>
                                    <SplitterPane size="70%" min="25%">
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <>
                                                <Card.Text>
                                                    <Row className="mt-3">
                                                        <>
                                                        </>
                                                    </Row>
                                                </Card.Text>
                                                <Row noGutters={true}>
                                                    <Col md={12} className="side-padding">
                                                        <OuterGridThirdPartyCatalogue
                                                            controlMap={this.state.controlMap}
                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                            dataState={this.state.dataState}
                                                            selectedRecord={this.props.Login.selectedRecord || {}}
                                                            operation={this.props.Login.operation}
                                                            addChildID={addChildID}
                                                            lstBioDataaccess={this.props.Login.masterData.lstBioDataaccess}
                                                            lstBioProject={this.props.Login.masterData.lstBioProject}
                                                            lstSampleType={this.props.Login.masterData.lstSampleType}
                                                            selectedBioDataaccess={this.props.Login.masterData.selectedBioDataaccess}
                                                            selectedChildRecord={this.props.Login.masterData.selectedChildRecord}
                                                            childDataChange={this.childDataChange}
                                                            deleteChildID={deleteChildID}
                                                                 gridHeight={"580px"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </>
                                        </Card>
                                    </ContentPanel>
                                    </SplitterPane>
                                </Splitter>
                                {/* </SplitterLayout> */}
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>

                {this.props.Login.openModal && (
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}

                        operation={this.props.Login.loadEsignStateHandle ? undefined : this.props.Login.operation}

                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        onExecuteClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showValidate={
                            this.props.Login.loadEsignStateHandle
                                ? false
                                : this.props.Login.openValidateSlideOut
                                    ? true
                                    : false
                        }
                        showSave={
                            this.props.Login.openValidateSlideOut
                                ? false
                                : true
                        }
                        mandatoryFields={[]}
                        selectedRecord={this.props.Login.openModal ? this.state.selectedRecord || {} :
                            this.props.Login.loadEsignStateHandle ? {
                                ...this.state.selectedChildRecord,
                                'esignpassword': this.state.selectedRecord['esignpassword'],
                                'esigncomments': this.state.selectedRecord['esigncomments'],
                                'esignreason': this.state.selectedRecord['esignreason']
                            } : this.state.selectedChildRecord || {}
                        }
                        addComponent={
                            this.props.Login.loadEsignStateHandle ? (
                                <EsignStateHandle
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.props.Login.selectedRecord || {}}
                                    childDataChange={this.childDataChange}
                                />
                            ) : (
                                <AddThirdPartyCatalogueDataRequestandapproval
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    intl={this.props.intl}
                                    Login={this.props.Login}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    operation={this.props.Login.operation}
                                    lstBioProject={this.props.Login.lstBioProject}
                                    lstSampleType={this.state.lstSampleType}
                                    onComboChange={this.onComboChange}
                                    childDataChange={this.childDataChange}

                                />
                            )
                        }
                    />

                )}
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

        let { selectedRecord, selectedFilterRecord, selectedChildRecord, selectedFilter, skip, take, dataState } = this.state;
        let updateState = false;

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            updateState = true;
        }
        if (this.props.Login.selectedChildRecord !== previousProps.Login.selectedChildRecord) {
            selectedChildRecord = this.props.Login.selectedChildRecord;
            updateState = true;
        }

        if (this.props.Login.selectedFilterRecord !== previousProps.Login.selectedFilterRecord) {
            selectedFilterRecord = this.props.Login.selectedFilterRecord;
        }

        if (this.props.Login.selectedFilter !== previousProps.Login.selectedFilter) {
            selectedFilter = this.props.Login.selectedFilter;
            updateState = true;
        }

        if (this.props.Login.dataState !== previousProps.Login.dataState) {
            updateState = true;

            dataState = {
                ...this.props.Login.dataState,
                skip: 0,   // reset page
                take: take // ensure page size is consistent
            };

            skip = 0;
            take = take;
        }

        if (updateState) {
            this.setState({
                selectedRecord, selectedFilterRecord, selectedChildRecord, selectedFilter, dataState, skip, take
            })
        }
    }



    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, selectedChildRecord: {}, selectedViewRecord: {}, loadEsignStateHandle: undefined, 
                openModalShow: undefined, openAcceptRejectDirectTransfer: undefined, lstSampleCondition: undefined, lstReason: undefined, 
                masterData: [], inputParam: undefined, lstReason: [], lstSampleCondition: []
            }
        }
        this.props.updateStore(updateInfo);
    }

    getDirectTransfer(inputParam, status) {
        const code = inputParam.nbiodataaccessrequestcode;
        this.setState({ loading: true });
        rsapi().post("biobankrequest/getActiveBioDataAccess", {
            userinfo: inputParam.userinfo,
            nbiodataaccessrequestcode: code != null ? code : '-1'
        })
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data };
                let selectedRecord = { ...response.data.selectedBioDataaccess } || {};
                let skip = this.state.skip;
                let take = this.state.take;

                selectedRecord['nbiobanksitecode'] = {
                    label: selectedRecord.ssitename,
                    value: selectedRecord.nsitecode,
                    item: selectedRecord
                };
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, selectedRecord, selectedChildRecord: {},
                        dataState: {
                            ...this.state.dataState,
                            take: this.state.dataState.take,
                            filter: null,
                            skip: 0, 
                            isGridClear: !(this.props?.Login?.isGridClear)
                        }
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false, skip, take });
            })
            .catch(error => {

                this.setState({ loading: false });
            });
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
            data: { showFilter: false, masterData, selectedFilter, filterSubmitValueEmpty: false }
        }
        this.props.updateStore(updateInfo);
    }


    onFilterSubmit = () => {
        const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate);
        const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate);
        const ntransCode = this.state.selectedFilterRecord?.ntranscode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate, selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("/biobankrequest/getBioBankRequest", { ...inputData })
            .then(response => {
                let masterData = {};
                masterData = { ...masterDataUpdated, ...response.data };
                this.searchRef.current.value = "";
                delete masterData["searchedData"];
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, filterSubmitValueEmpty: false, showFilter: false, isGridClear: !(this.props?.Login?.isGridClear)
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                    this.setState({ loading: false });
                }
                else {
                    toast.warn(error.response.data);
                    this.setState({ loading: false });
                }
            })
    }

    childFilterDataChange = (selectedFilterRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedFilterRecord: {
                ...selectedFilterRecord
            },
            isInitialRender
        });
    }
    childDataChange = (selectedRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedRecord: {
                ...selectedRecord
            },
            isInitialRender
        });
    }


    onReload = () => {
        const { masterData, userInfo } = this.props.Login;
        const obj = convertDateValuetoString(masterData.realFromDate, masterData.realToDate, userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = masterData.realSelectedFilterStatus || -1;

        const inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            userinfo: userInfo
        };

        this.setState({ loading: true });

        rsapi().post("/biobankrequest/getBioBankRequest", inputData)
            .then(response => {
                const masterDataUpdated = { ...masterData, ...response.data };
                delete masterDataUpdated["searchedData"];
                this.props.updateStore({
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData: masterDataUpdated,
                        selectedRecord: {},
                        selectedChildRecord: {},
                        dataState: {
                            take: this.state.dataState.take,
                            filter: null,
                            skip: 0,
                            sort: []
                        },
                        showFilter: false,
                        filterSubmitValueEmpty: false,
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                });

                if (this.searchRef.current) this.searchRef.current.value = "";

                this.setState({ loading: false });
            })
            .catch(error => {
                if ([401, 403].includes(error.response?.status)) {
                    this.props.updateStore({
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data || error.message);
                }
                this.setState({ loading: false });
            });
    };

    onMandatoryCheck = (saveType, formRef) => {
        const mandatoryFields = this.props.Login.loadEsignStateHandle ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            (this.props.Login.openDirectTransfer && this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_BIOPROJECT", "dataField": "nbioprojectcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "nproductcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }
                ] : []);

        onSaveMandatoryValidation(
            this.state.selectedRecord,
            mandatoryFields,
            this.props.Login.loadEsignStateHandle
                ? this.validateEsign
                : this.props.Login.openDirectTransfer
                    ? ((st) => this.onSaveClick(st))
                    : ((st) => this.onSaveClick(st)),
            this.props.Login.loadEsignStateHandle,
            saveType
        );

    }

    onSaveClick = () => {
        const { selectedRecord } = this.state;
        const { userInfo, masterData, userRoleControlRights, ncontrolCode } = this.props.Login;

        // Extract only the selected samples
        const selectedSamples = (selectedRecord?.selectedSampleTypes || []).map(item => item.value);
        const obj = convertDateValuetoString(masterData?.fromDate, masterData?.realToDate, userInfo);
        // Build payload
        const payload = {
            userinfo: userInfo,
            bioprojectcode: selectedRecord?.nbioprojectcode ?? null,
            remarks: selectedRecord?.sremarks || '',
            sampleTypes: selectedSamples,   // ✅ only selected sample(s)
            srequestdate: masterData?.selectedBioDataaccess?.drequestcreateddate
                ? convertDateTimetoStringDBFormat(
                    new Date(masterData.selectedBioDataaccess.drequestcreateddate),
                    userInfo
                )
                : '',
            fromDate: obj.fromDate,
            toDate: obj.toDate
        };

        this.setState({ loading: true });

        rsapi()
            .post('/biobankrequest/createBioDataRequest', payload)
            .then(response => {
                const updatedMasterData = {
                    ...masterData,
                    ...response.data
                };

                this.props.updateStore({
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData: updatedMasterData,
                        openModal: false,
                        openDirectTransfer: false,
                        selectedRecord: {},
                        bioBankSiteDisable: false,
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                });

                // ✅ trigger e-sign if required
                if (showEsign(userRoleControlRights, userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true,
                            openModal: true,
                            screenData: { inputParam: payload },
                            screenName: "IDS_THIRDPARTYCATALOG"
                        }
                    };
                    this.props.updateStore(updateInfo);
                }

                this.setState({ loading: false, showSlideOut: false });
                this.closeModal();
            })
            .catch(error => {
                //commented and condition added by sujatha ATE_274 for getting alert with the backend message as warn instead danger 
                // toast.error("Failed to save data.");
                let message = "Failed to save data.";
                if (error.response && error.response.data) {
                    message = error.response.data;
                }
                toast.warn(message);
                this.setState({ loading: false });
            });
    };



    addcatelogue = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });

            // API calls in parallel (extend if you need more)
            const getBioProject = rsapi().post("biobankrequest/getBioProject", {
                'userinfo': this.props.Login.userInfo
            });

            let urlArray = [getBioProject];

            Axios.all(urlArray)
                .then(response => {
                    let masterData = {
                        ...this.props.Login.masterData,
                        ...(response[0]?.data || {})
                    };

                    const projectList = response[0]?.data?.projectList || [];

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData,
                            screenName,
                            operation,
                            openModal: true,
                            openDirectTransfer: true, // Added by Gowtham on nov 19 2025 for jira.id:BGSI-209
                            lstBioProject: projectList,
                            selectedRecord: {
                                nbioprojectcode: '',
                                sremarks: '',
                                lstSampleType: [],
                                scolorhexcode: '',
                                ...(this.props.statusFieldName
                                    ? { [this.props.statusFieldName]: 'out' }
                                    : {})
                            },
                            isGridClear: !(this.props?.Login?.isGridClear),
                            loadEsignStateHandle: false      // added by sujatha ATE_274 for issue of loading esign page when click add request
                        }
                    };

                    this.props.updateStore(updateInfo);
                    this.setState({ loading: false });
                })
                .catch(error => {
                    const status = error?.response?.status;

                    if (status === 401 || status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                            data: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: status
                            }
                        };
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error?.response?.data || "Error fetching data");
                    }

                    this.setState({ loading: false });
                });
        }
    };

    handleSubmit = () => {
        const { selectedRecord } = this.state;
        const { userInfo } = this.props.Login;

        // console.log("selectedRecord before save:", selectedRecord);

        if (!selectedRecord.nbioprojectcode) {
            toast.warn("Please select a BioProject.");
            return;
        }

        if (!selectedRecord.selectedSampleTypes || selectedRecord.selectedSampleTypes.length === 0) {
            toast.warn("Please select at least one Sample Type.");
            return;
        }

        const payload = {
            userinfo: userInfo,
            bioprojectcode: selectedRecord.nbioprojectcode,
            remarks: selectedRecord.sremarks || '',
            sampleTypes: selectedRecord.selectedSampleTypes.map(item => item.value),
            fromDate: this.props.Login.masterData.fromDate,

        };

        this.setState({ loading: true });

        rsapi().post('/biobankrequest/createBioDataRequest', payload)
            .then(response => {
                toast.success("Form submitted successfully!");
                this.setState({ loading: false });
            })
            .catch(error => {
                toast.error("Failed to save data.");
                console.error(error);
                this.setState({ loading: false });
            });
    };

    handleCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };



    paneSizeChange = (size) => {
        this.setState({ splitChangeWidthPercentage: size });
    }

    closeModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: false,
                selectedRecord: {},
                lstBioProject: []
            }
        };
        this.props.updateStore(updateInfo);
    };


    closeModal = () => {
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openDirectTransfer = this.props.Login.openDirectTransfer;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let operation = this.props.Login.operation;
        openModal = false;
        selectedRecord = {
            addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
            addedChildBioDirectTransfer: this.props.Login.selectedRecord?.addedChildBioDirectTransfer || []
        };


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openDirectTransfer,
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeFilter = () => {
        const masterData = {
            ...this.props.Login.masterData,
            fromDate: this.props.Login.masterData.realFromDate || new Date(),
            toDate: this.props.Login.masterData.realToDate || new Date()
        };

        const selectedFilter = {
            fromdate: masterData.fromDate,
            todate: masterData.toDate
        };

        this.props.updateStore({
            typeName: DEFAULT_RETURN,
            data: { showFilter: false, masterData, selectedFilter, filterSubmitValueEmpty: false }
        });
    }

    childFilterDataChange = (selectedRecord) => {
        this.setState({ selectedFilterRecord: selectedRecord });
    };




    childFilterDataChange = (selectedFilterRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedFilterRecord: {
                ...selectedFilterRecord
            },
            isInitialRender
        });
    }

    getDirectTransfer(inputParam) {
        this.setState({ loading: true });
        rsapi().post("/biobankrequest/getActiveBioDataAccess", {
            'userinfo': inputParam.userinfo,
            'nbiodataaccessrequestcode': inputParam.nbiodataaccessrequestcode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChildBioDirectTransfer'] = [];
                selectedRecord['addSelectAll'] = false;

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, selectedRecord, selectedChildRecord: {},
                        dataState: {
                            ...this.state.dataState,
                            //take: this.state.dataState.take,
                            filter: null,
                            skip: 0,
                            take: undefined

                        },
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false, skip, take });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                this.setState({ loading: false });
            })
    }

    handleCatalogueError = (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            const UnAuthorizedAccess = {
                typeName: UN_AUTHORIZED_ACCESS,
                data: {
                    navigation: 'forbiddenaccess',
                    loading: false,
                    responseStatus: status
                }
            };
            this.props.updateStore(UnAuthorizedAccess);
        } else if (status === 500) {
            toast.error(error.message);
        } else {
            toast.warn(error.response?.data || "Something went wrong");
        }

        this.setState({ loading: false });
    };

    sendThirdECatalogueRequest = (sendID, operation, screenName) => {
        const selectedBioDataaccess = this.props.Login?.masterData?.selectedBioDataaccess ?? null;

        if (!selectedBioDataaccess) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
            return;
        }

        if (selectedBioDataaccess.ntransactionstatus !== transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
            return;
        }

        const nbiodataaccessrequestcode = selectedBioDataaccess?.nbiodataaccessrequestcode ?? -1;

        const obj = convertDateValuetoString(
            this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.realToDate,
            this.props.Login.userInfo
        );

        const inputData = {
            userinfo: this.props.Login.userInfo,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: (this.props.Login.masterData.realSelectedFilterStatus || {}).value ?? -1,
            nbiodataaccessrequestcode,
            ncontrolcode:sendID
        };

        const inputParam = {
            inputData,
            screenName: "IDS_THIRDPARTYCATALOG",
            operation: "send"
        };

        //  eSign check
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, sendID)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true,
                    openModal: true,
                    screenData: { inputParam },
                    operation,
                    screenName
                }
            };
            this.props.updateStore(updateInfo);
        } else {
            this.onSend(inputData, screenName);
        }
    };


    onSend = (inputData, screenName) => {
        this.setState({ loading: true });

        rsapi().post("/biobankrequest/sendThirdpartyECatalogueRequest", { ...inputData })
            .then(response => {
                let responseData = response.data;
                let updatedRequest = responseData.selectedBioDataaccess;

                let masterData = { ...this.props.Login.masterData };

                masterData["lstBioDataaccess"] = replaceUpdatedObject(
                    [updatedRequest],
                    masterData.lstBioDataaccess,
                    "nbiodataaccessrequestcode"
                );

                masterData["lstBioThirdCatalogueDetails"] = replaceUpdatedObject(
                    [updatedRequest],
                    masterData.lstBioThirdCatalogueDetails || [],
                    "nbiodataaccessrequestcode"
                );

                masterData["searchedData"] = replaceUpdatedObject(
                    [updatedRequest],
                    masterData.searchedData,
                    "nbiodataaccessrequestcode"
                );

                masterData["selectedBioDataaccess"] = updatedRequest;
                masterData = { ...masterData, ...responseData };

                sortData(masterData);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData,
                        screenName,
                        operation: "send",
                        openModal: false,
                        loadEsignStateHandle: false,
                        selectedChildRecord: {},
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                };
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: "forbiddenaccess",
                            loading: false,
                            responseStatus: status
                        }
                    };
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data || "Something went wrong");
                }

                this.setState({ loading: false });
            });
    };

    cancelThirdECatalogueRequest = (cancelID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDataaccess = this.props.Login.masterData?.selectedBioDataaccess;

        if (selectedBioDataaccess !== null) {
            if (selectedBioDataaccess.ntransactionstatus === transactionStatus.DRAFT || selectedBioDataaccess.ntransactionstatus === transactionStatus.REQUESTED
            ) {
                const nbiodataaccessrequestcode = selectedBioDataaccess?.nbiodataaccessrequestcode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodataaccessrequestcode"] = nbiodataaccessrequestcode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_THIRDPARTYCATALOG",
                    operation: "cancel"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, cancelID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onCancel(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTREQUESTRECORD" })); // added by sujatha for an IDS issue while cancel request
                this.setState({ loading: false });
            }
        }
    }


    approveThirdECatalogueRequest = (approveID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(
            this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.realToDate,
            this.props.Login.userInfo
        );
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDataaccess = this.props.Login.masterData?.selectedBioDataaccess;

        if (selectedBioDataaccess) {
            if (selectedBioDataaccess.ntransactionstatus === transactionStatus.REQUESTED) {
                const nbiodataaccessrequestcode = selectedBioDataaccess?.nbiodataaccessrequestcode;

                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodataaccessrequestcode"] = nbiodataaccessrequestcode;
                inputData["ncontrolcode"]=approveID;

                let inputParam = {
                    inputData,
                    screenName: "IDS_THIRDPARTYCATALOG",
                    operation: "approve"
                };

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true,
                            screenData: { inputParam }, operation, screenName
                        }
                    };
                    this.props.updateStore(updateInfo);
                } else {
                    this.onApprove(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTRECORDAPPROVED" }));
                this.setState({ loading: false });
            }
        }
    }

    onApprove = (inputData) => {
        this.setState({ loading: true });

        rsapi().post("biobankrequest/approveThirdpartyECatalogueRequest", { ...inputData })
            .then(response => this.updateCatalogueStore(response, "IDS_THIRDPARTYCATALOG", "approve"))
            .catch(error => this.handleCatalogueError(error))
            .finally(() => this.setState({ loading: false }));
    };
    rejectThirdECatalogueRequest = (rejectID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(
            this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.realToDate,
            this.props.Login.userInfo
        );
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDataaccess = this.props.Login.masterData?.selectedBioDataaccess;

        if (selectedBioDataaccess) {
            if (selectedBioDataaccess.ntransactionstatus === transactionStatus.REQUESTED) {
                const nbiodataaccessrequestcode = selectedBioDataaccess?.nbiodataaccessrequestcode;

                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodataaccessrequestcode"] = nbiodataaccessrequestcode;

                let inputParam = {
                    inputData,
                    screenName: "IDS_THIRDPARTYCATALOG",
                    operation: "reject"
                };

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, rejectID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true,
                            screenData: { inputParam }, operation, screenName
                        }
                    };
                    this.props.updateStore(updateInfo);
                } else {
                    this.onReject(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTRECORD" }));
                this.setState({ loading: false });
            }
        }
    }

    onReject = (inputData) => {
        this.setState({ loading: true });

        rsapi().post("biobankrequest/rejectThirdECatalogueRequest", { ...inputData })
            .then(response => this.updateCatalogueStore(response, "IDS_THIRDPARTYCATALOG", "reject"))
            .catch(error => this.handleCatalogueError(error))
            .finally(() => this.setState({ loading: false }));
    };

    retireThirdECatalogueRequest = (retireID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(
            this.props.Login.masterData.realFromDate,
            this.props.Login.masterData.realToDate,
            this.props.Login.userInfo
        );
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDataaccess = this.props.Login.masterData?.selectedBioDataaccess;

        if (selectedBioDataaccess) {
            if (selectedBioDataaccess.ntransactionstatus === transactionStatus.APPROVED) {
                const nbiodataaccessrequestcode = selectedBioDataaccess?.nbiodataaccessrequestcode;

                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodataaccessrequestcode"] = nbiodataaccessrequestcode;

                let inputParam = {
                    inputData,
                    screenName: "IDS_THIRDPARTYCATALOG",
                    operation: "retire"
                };

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, retireID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true,
                            screenData: { inputParam }, operation, screenName
                        }
                    };
                    this.props.updateStore(updateInfo);
                } else {
                    this.onRetire(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDRECORD" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    onRetire = (inputData) => {
        this.setState({ loading: true });

        rsapi().post("biobankrequest/retireThirdECatalogueRequest", { ...inputData })
            .then(response => this.updateCatalogueStore(response, "IDS_THIRDPARTYCATALOG", "retire"))
            .catch(error => this.handleCatalogueError(error))
            .finally(() => this.setState({ loading: false }));
    };

    updateCatalogueStore = (response, screenName, operation) => {
        try {
            let responseData = response.data;
            let updatedRequest = responseData.selectedBioDataaccess;

            let masterData = { ...this.props.Login.masterData };

            masterData["lstBioDataaccess"] = replaceUpdatedObject(
                [updatedRequest],
                masterData.lstBioDataaccess || [],
                "nbiodataaccessrequestcode"
            );


            masterData["searchedData"] = replaceUpdatedObject(
                [updatedRequest],
                masterData.searchedData || undefined,
                "nbiodataaccessrequestcode"
            );

            masterData["lstBioThirdCatalogueDetails"] = replaceUpdatedObject(
                [updatedRequest],
                masterData.lstBioThirdCatalogueDetails || [],
                "nbiodataaccessrequestcode"
            );


            masterData["selectedBioDataaccess"] = updatedRequest;

            masterData = { ...masterData, ...responseData };


            sortData(masterData);

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    masterData,
                    screenName,
                    operation,
                    openModal: false,
                    loadEsignStateHandle: false,
                    selectedChildRecord: {},
                    isGridClear: !(this.props?.Login?.isGridClear)
                }
            };
            this.props.updateStore(updateInfo);
        } catch (err) {
            console.error("Error in updateCatalogueStore:", err);
        }
    };

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };



    onCancel = (inputData) => {
        this.setState({ loading: true });

        rsapi().post("biobankrequest/cancelThirdpartyECatalogueRequest", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;

                let lstBioDataaccess = this.props.Login.masterData?.lstBioDataaccess ?? [];
                let searchedData = this.props.Login.masterData?.searchedData ?? [];

                const index = lstBioDataaccess.findIndex(
                    item => item.nbiodataaccessrequestcode === responseData.selectedBioDataaccess.nbiodataaccessrequestcode
                );
                const searchedDataIndex = searchedData.findIndex(
                    item => item.nbiodataaccessrequestcode === responseData.selectedBioDataaccess.nbiodataaccessrequestcode
                );


                if (index !== -1) {
                    lstBioDataaccess[index] = responseData.selectedBioDataaccess;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDataaccess;
                }

                masterData["lstBioDataaccess"] = lstBioDataaccess;
                masterData["searchedData"] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData,
                        loadEsignStateHandle: false,
                        openModal: false,
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                };
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                const status = error?.response?.status;

                if (status === 401 || status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: "forbiddenaccess",
                            loading: false,
                            responseStatus: status
                        }
                    };
                    this.props.updateStore(UnAuthorizedAccess);
                } else if (status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data || "Something went wrong");
                }

                this.setState({ loading: false });
            });
    };

    validateEsign = () => {
        let ncontrolcode = this.props.Login.ncontrolcode;
        let modalName = "";
        modalName = "openModal";
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
        this.validateEsignforDirectTransfer(inputParam, modalName);
    }

    validateEsignforDirectTransfer = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    const { operation, screenName, inputData } = inputParam["screenData"]["inputParam"];

                    if (screenName === "IDS_THIRDPARTYCATALOG") {
                        if (operation === "update") {
                            this.editDirectTransferRecord(inputData);

                        } else if (operation === "cancel") {
                            this.onCancel(inputData);

                        } else if (operation === "approve") {
                            this.onApprove(inputData);

                        } else if (operation === "reject") {
                            this.onReject(inputData);

                        } else if (operation === "retire") {
                            this.onRetire(inputData);

                        } else if (operation === "send") {
                            this.onSend(inputData);
                        }
                    }
                }
            })
            .catch(error => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    };
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.info(error.response?.data || "Something went wrong");
                }
            });
    };




    onValidateEsignCheck = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const nbiodataaccessrequestcode = this.props.Login.masterData?.selectedBioDataaccess?.nbiodataaccessrequestcode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiodataaccessrequestcode"] = nbiodataaccessrequestcode;

        inputData["bioDirectTransfer"] = {
            "sformnumber": selectedRecord?.sformnumber || '',

        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_THIRDPARTYCATALOG",
            operation: "validate"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_TRANSFERFORM"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onValidateClick(inputData);
        }
    }
}

export default connect(mapStateToProps, {
    updateStore,
    filterTransactionList
})(injectIntl(ThirdPartyECatalogueDataRequestAndApproval));
