import { faCheckSquare, faPlus, faThumbsUp, faDumpster, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import React from "react";
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { toast } from 'react-toastify';
import { Affix } from 'rsuite';
import { filterTransactionList, updateStore, generateControlBasedReport } from '../../../actions';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ContentPanel } from "../../../components/App.styles";
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import {
    convertDateTimetoStringDBFormat, convertDateValuetoString, getControlMap, onSaveMandatoryValidation, rearrangeDateFormat, showEsign
} from '../../../components/CommonScript';
import { designProperties, transactionStatus } from '../../../components/Enumeration';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ProductList } from '../../product/product.styled';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import DisposalSampleApprovalFilter from './DisposalSampleApprovalFilter';
import AddDisposalSampleApproval from './AddDisposalSampleApproval';
import OuterGridDisposeForm from './OuterGridDisposeForm';
import ValidateDisposeSample from './ValidateDisposeSample';


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class DisposalSampleApproval extends React.Component {
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
            panes:[
                { size: '30%', min: '25%', resizable: true, collapsible: true  },
            ]
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
        if (this.props.Login.openModal && this.props.Login.openDisposalSampleApprove && nextState.isInitialRender === false &&
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

    onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

    render() {

        let selectedBioDisposeForm = this.props.Login.masterData.selectedBioDisposeForm || {};


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
        const filterParam = {
            inputListName: "lstBioDisposeForm", selectedObject: "lstChilddisposalsamplesapproval", primaryKeyField: "nbiodisposeformcode",
            fetchUrl: "disposalsamplesapproval/getActiveDisposalSampleApproval", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioDisposeForm",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioDisposeForm',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "sreceiversitename" },
        ];

        const addID = this.state.controlMap.has("AddDisposalSamplesApproval") && this.state.controlMap.get("AddDisposalSamplesApproval").ncontrolcode;
        const sampleValidationID = this.state.controlMap.has("SampleValidationDispose") && this.state.controlMap.get("SampleValidationDispose").ncontrolcode;
        const validateID = this.state.controlMap.has("validateDisposalSamplesApproval") && this.state.controlMap.get("validateDisposalSamplesApproval").ncontrolcode;
        const generateLocationID = this.state.controlMap.has("GenerateLocationCodeDisposalSamplesApproval") && this.state.controlMap.get("GenerateLocationCodeDisposalSamplesApproval").ncontrolcode;
        const approvalDisposalSampleID = this.state.controlMap.has("ApprovalDisposalSamplesApproval") && this.state.controlMap.get("ApprovalDisposalSamplesApproval").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildDisposeSamples") && this.state.controlMap.get("AddChildDisposeSamples").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildDisposalSamplesApproval") && this.state.controlMap.get("DeleteChildDisposalSamplesApproval").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildSamplesApproval") && this.state.controlMap.get("DisposeChildSamplesApproval").ncontrolcode;
        //const storeSampleId = this.state.controlMap.has("StoreProccessedSample") && this.state.controlMap.get("StoreProccessedSample").ncontrolcode;
        const reportID = this.state.controlMap.has("DisposeFormApprovalReport") && this.state.controlMap.get("DisposeFormApprovalReport").ncontrolcode;



        const mandatoryFields = [
            { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "nproductcatcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nnoofsamples", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_SAMPLECOLLECTIONDATEONLY", "dataField": "dsamplecollectiondate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
            { "idsName": "IDS_ARRIVINGATBIOBANKDATE", "dataField": "dbiobankarrivaldate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
            { "idsName": "IDS_RECIPIENTSNAME", "dataField": "nrecipientusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ];

        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "100px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "100px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "svolume", "width": "100px" }
            ];

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
                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                   
                                <Splitter panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal" >
                                    <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioDisposeForm || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioDisposeForm] || []}
                                        primaryKeyField="nbiodisposeformcode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getDisposalSampleApproval(
                                                {
                                                    masterData: this.props.Login.masterData,
                                                    userinfo: this.props.Login.userInfo,
                                                    ...Sample
                                                }, status
                                            )}
                                        subFieldsLabel={false}
                                        additionalParam={['']}
                                        mainField={'sformnumber'}
                                        filterColumnData={this.props.filterTransactionList}
                                        subFields={SubFields}
                                        statusFieldName="stransdisplaystatus"
                                        statusField="ntransactionstatus"
                                        statusColor="stranscolor"
                                        showStatusIcon={false}
                                        showStatusLink={true}
                                        showStatusName={true}
                                        needFilter={true}
                                        searchRef={this.searchRef}
                                        filterSubmitValueEmpty={this.props.Login.filterSubmitValueEmpty}
                                        openFilter={this.openFilter}
                                        filterParam={filterParam}
                                        showFilter={this.props.Login.showFilter}
                                        skip={this.state.skip}
                                        take={this.state.take}
                                        handlePageChange={this.handlePageChange}
                                        showStatusBlink={true}
                                        callCloseFunction={true}
                                        childTabsKey={[]}
                                        onFilterSubmit={this.onFilterSubmit}
                                        closeFilter={this.closeFilter}
                                        splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                        // actionIcons={[
                                        //     {
                                        //         title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                        //         controlname: "faPencilAlt",
                                        //         objectName: "editRequestBasedTransfer",
                                        //         hidden: this.state.userRoleControlRights.indexOf(editID) === -1,
                                        //         onClick: this.editRequestBasedTransfer,
                                        //         inputData: {
                                        //             primaryKeyName: "nbiodisposeformcode",
                                        //             operation: "update",
                                        //             masterData: this.props.Login.masterData,
                                        //             userInfo: this.props.Login.userInfo,
                                        //             controlCode: editID
                                        //         },
                                        //     }
                                        // ]}
                                        commonActions={
                                            <>
                                                <ProductList className="d-flex product-category float-right">
                                                    <Nav.Link
                                                        className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                        onClick={() => this.addDisposeSample(addID, 'create', 'IDS_DISPOSEFORM')} >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Nav.Link>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onValidateEsignCheck(validateID, 'validate', 'IDS_DISPOSEFORM')}
                                                        hidden={this.state.userRoleControlRights.indexOf(validateID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATION" })}>
                                                        <FontAwesomeIcon icon={faCheckSquare} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onApproveEsignCheck(approvalDisposalSampleID, 'approve', 'IDS_APPROVE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(approvalDisposalSampleID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMAPPROVE" })}>
                                                        <FontAwesomeIcon icon={faThumbsUp} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onDisposeSampleEsignCheck(disposeID, 'dispose', 'IDS_DISPOSE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(disposeID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMDISPOSE" })}>
                                                        <FontAwesomeIcon icon={faDumpster} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onReload()}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                        <RefreshIcon className='custom_icons' />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.props.generateControlBasedReport(reportID, {
                                                            ...this.props.Login.masterData?.selectedBioDisposeForm,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbiodisposeformcode", this.props.Login?.masterData?.selectedBioDisposeForm?.nbiodisposeformcode)}
                                                        hidden={this.state.userRoleControlRights.indexOf(reportID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}>
                                                        <FontAwesomeIcon icon={faNewspaper} />
                                                    </Button>
                                                </ProductList>
                                            </>
                                        }
                                        filterComponent={[
                                            {
                                                "Date Filter":
                                                    <DisposalSampleApprovalFilter
                                                        fromDate={this.fromDate}
                                                        toDate={this.toDate}
                                                        userInfo={this.props.Login.userInfo}
                                                        lstFilterStatus={this.props.Login.masterData?.lstFilterStatus || []}
                                                        selectedFilterStatus={this.props.Login.masterData?.selectedFilterStatus || {}}
                                                        childFilterDataChange={this.childFilterDataChange}
                                                        selectedRecord={this.state.selectedFilterRecord}
                                                        lstTransferType={this.props.Login.masterData?.lstTransferType || []}
                                                        selectedTransferType={this.props.Login.masterData?.selectedTransferType || {}}

                                                    />
                                            }
                                        ]}
                                    />
                                    </SplitterPane>
                                    <SplitterPane size="70%" min="25%" >
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {
                                                <>
                                                    <Card.Text>
                                                        <Row className="mt-3">
                                                            <>
                                                            </>
                                                        </Row>
                                                    </Card.Text>
                                                    <Row noGutters={true}>
                                                        <Col md={12} className="side-padding">

                                                            <OuterGridDisposeForm
                                                                dataState={this.state.dataState}
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                selectedRecord={this.props.Login.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioDisposeForm={this.props.Login?.masterData?.lstChildBioDisposeForm || []}
                                                                addChildID={addChildID}
                                                                sampleValidationID={sampleValidationID}
                                                                deleteChildID={deleteChildID}
                                                                generateLocationID={generateLocationID}
                                                                lstBioDisposeForm={this.props.Login?.masterData?.lstBioDisposeForm}
                                                                selectedBioDisposeForm={this.props.Login?.masterData?.selectedBioDisposeForm}
                                                                    gridHeight={"600px"}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </Card>
                                    </ContentPanel>
                                    </SplitterPane>
                                </Splitter>
                                {/* </SplitterLayout> */}
                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>
                {(this.props.Login.openModal) ?
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        // size={this.props.Login.operation === 'validate' ? 'lg' : this.props.Login.operation === 'view' ? 'lg' : this.props.Login.operation === 'dispose' ? 'lg' : 'xl'}
                        size={['approve', 'dispose', 'validate', 'view', 'dispose'].includes(this.props.Login.operation) ? 'lg' : 'xl'}
                        hideSave={this.props.Login.viewFormDetails ? true : false}
                        closeModal={this.closeModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewFormDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        onExecuteClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        //showSaveContinue={this.props.Login.loadEsignStateHandle ? false :this.props.Login.openDisposalSampleApprove ? true : false}
                        showValidate={this.props.Login.loadEsignStateHandle ? false :
                            this.props.Login.openValidateSlideOut ? true : false}
                        showSave={this.props.Login.openValidateSlideOut ? false : true}
                        mandatoryFields={[]}
                        selectedRecord={this.props.Login.openModal ? this.state.selectedRecord || {} :
                            this.props.Login.loadEsignStateHandle ? {
                                ...this.state.selectedChildRecord,
                                'esignpassword': this.state.selectedRecord['esignpassword'],
                                'esigncomments': this.state.selectedRecord['esigncomments'],
                                'esignreason': this.state.selectedRecord['esignreason']
                            } : this.state.selectedChildRecord || {}
                        }
                        addComponent={this.props.Login.loadEsignStateHandle ?
                            <EsignStateHandle
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                                childDataChange={this.childDataChange}
                            />
                            : this.props.Login.openDisposalSampleApprove ?
                                <AddDisposalSampleApproval
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    lstDisposalBatchTypeCombo={this.props.Login.masterData.lstDisposalBatchTypeCombo || []}
                                    lstRequestAcceptanceType={this.props.Login.masterData.lstRequestAcceptanceType || []}
                                    lstStorageType={this.props.Login.masterData.lstStorageType || []}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.childDataChange}
                                    bioBankSiteDisable={this.props.Login.bioBankSiteDisable}
                                /> : ""}
                    // : this.props.Login.openValidateSlideOut ?
                    //     <ValidateDisposeSample
                    //         controlMap={this.state.controlMap}
                    //         userRoleControlRights={this.state.userRoleControlRights}
                    //         lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                    //         lstUsers={this.props.Login.masterData.lstUsers || []}
                    //         lstCourier={this.props.Login.masterData.lstCourier || []}
                    //         selectedRecord={this.state.selectedRecord || {}}
                    //         operation={this.props.Login.operation}
                    //         childDataChange={this.childDataChange}
                    //         sformnumber={this.props.Login.masterData?.selectedBioDisposeForm?.sformnumber || ""}
                    //     /> : ""}
                    /> : ""}

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
                openModalShow:undefined, openAcceptRejectDisposeSamples: undefined, lstSampleCondition: undefined, lstReason: undefined, 
                shouldRender: undefined, masterData: [], inputParam: undefined, lstReason: [], lstSampleCondition: []

            }
        }
        this.props.updateStore(updateInfo);
    }

    getDisposalSampleApproval(inputParam) {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/getActiveDisposalSampleApproval", {
            'userinfo': inputParam.userinfo,
            'nbiodisposeformcode': Number(inputParam.nbiodisposeformcode) || -1,
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChilddisposalsamplesapproval'] = [];
                selectedRecord['addSelectAll'] = false;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, selectedRecord, selectedChildRecord: {},
                        dataState: {
                            //  ...this.state.dataState,
                            take: this.state.dataState.take,
                            filter: null,       // <-- removes all filters
                            skip: 0,
                            sort: []          // <-- reset to first page
                        }
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
        const ndisposalbatchtypecode = this.state.selectedFilterRecord?.ndisposalbatchtypecode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate, selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            ndisposalbatchtypecode: ndisposalbatchtypecode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/getDisposalSamplesApproval", { ...inputData })
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

        let inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/getDisposalSamplesApproval", { ...inputData })
            .then(response => {
                // let masterData = {};
                // masterData = { ...this.props.Login.masterData, ...response.data };
                // this.searchRef.current.value = "";
                // delete masterData["searchedData"];
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: {
                //         masterData, showFilter: false, filterSubmitValueEmpty: false
                //     }
                // }
                // this.props.updateStore(updateInfo);
                // this.setState({ loading: false });
                const masterDataUpdated = { ...masterData, ...response.data };
                delete masterDataUpdated["searchedData"];

                // Update Redux store with masterData and clear selection
                this.props.updateStore({
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData: masterDataUpdated,
                        selectedRecord: {},       // Redux holds empty selection
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
                // Clear search input
                if (this.searchRef.current) this.searchRef.current.value = "";

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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
                this.setState({ loading: false });
            })
    }

    onMandatoryCheck = (saveType, formRef) => {
        const mandatoryFields = this.props.Login.loadEsignStateHandle ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.openDisposalSampleApprove ? (this.props.Login.operation === 'create' ?
                this.state.selectedRecord?.isEnableStoreFilter === false ?
                    [
                        { "idsName": "IDS_DISPOSALBATCHTYPE", "dataField": "ndisposalbatchtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_FORMTYPE", "dataField": "nformtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_FORMNUMBER", "dataField": "nbiomovetodisposecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_ORIGIN", "dataField": "formsiteorthirdpartyname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
                    ] : [
                        { "idsName": "IDS_DISPOSALBATCHTYPE", "dataField": "ndisposalbatchtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    ] :
                this.props.Login.operation === 'update' ?
                    [
                        { "idsName": "IDS_DISPOSALBATCHTYPE", "dataField": "ndisposalbatchtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    ]
                    : [])
                :
                (this.props.Login.openValidateSlideOut ? (this.props.Login.operation === 'validate' ? [
                    { "idsName": "IDS_TEMPERATUREDEG", "dataField": "nstorageconditioncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_DELIVERYDATE", "dataField": "ddeliverydate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
                    { "idsName": "IDS_DISPATCHER", "dataField": "ndispatchercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_COURIERNAME", "dataField": "ncouriercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_TRIPLEPACKAGE", "dataField": "striplepackage", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }
                ] : []) : []);

        onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields, this.props.Login.loadEsignStateHandle ? this.validateEsign :
            this.props.Login.openDisposalSampleApprove ? this.onSaveClick : this.props.Login.openValidateSlideOut ?
                this.onValidateEsignCheck : "", this.props.Login.loadEsignStateHandle, saveType);
    }

    addDisposeSample = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });
            //const getRequestAcceptanceType = rsapi().post("disposalsamplesapproval/getRequestAcceptanceType", { 'userinfo': this.props.Login.userInfo });
            const getDisposalBatchType = rsapi().post("disposalsamplesapproval/getDisposalBatchType", { 'userinfo': this.props.Login.userInfo });

            let urlArray = [getDisposalBatchType];
            Axios.all(urlArray)
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response[0].data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true, openDisposalSampleApprove: true, bioBankSiteDisable: false,ncontrolcode:addID,
                            isGridClear: !(this.props.Login.isGridClear)

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
    }

    editRequestBasedTransfer = (inputParam) => {
        if (inputParam?.editRequestBasedTransfer.ntransactionstatus === transactionStatus.DRAFT
            || inputParam?.editRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
            let inputData = {
                'nbiodisposeformcode': inputParam?.editRequestBasedTransfer?.nbiodisposeformcode,
                'userinfo': this.props.Login.userInfo
            };
            this.setState({ loading: true });
            rsapi().post("disposalsamplesapproval/getActivedisposalsamplesapprovalById", { ...inputData })
                .then(response => {
                    let selectedRecordRequestBasedTransfer = response.data?.selectedRecordRequestBasedTransfer;
                    let selectedRecord = this.state.selectedRecord;

                    selectedRecord['nbiodisposeformcode'] = selectedRecordRequestBasedTransfer.nbiodisposeformcode || [];
                    selectedRecord['selectedRecordRequestBasedTransfer'] = selectedRecordRequestBasedTransfer || [];
                    selectedRecord['formsiteorthirdpartyname'] = rearrangeDateFormat(this.props.Login.userInfo,
                        selectedRecordRequestBasedTransfer?.stransferdate);
                    selectedRecord['sremarks'] = selectedRecordRequestBasedTransfer.sremarks || '';
                    selectedRecord['ndisposalbatchtypecode'] = response.data?.selectedTransferType || [];
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation: inputParam.operation,
                            selectedRecord,
                            openModal: true,
                            openDisposalSampleApprove: true,
                            bioBankSiteDisable: true,
                            ncontrolCode: inputParam.controlCode,
                            screenName: "IDS_DISPOSEFORM"
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
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }

    }
    onValidateEsignCheck = (validateID) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const nbiodisposeformcode = this.props.Login.masterData?.selectedBioDisposeForm?.nbiodisposeformcode || -1;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiodisposeformcode"] = nbiodisposeformcode;
        inputData["ncontrolcode"]=validateID;

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_DISPOSEFORM",
            operation: "validate"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, validateID)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    operation: "validate", loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_DISPOSEFORM"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onValidateClick(inputData);
        }
    }

    onValidateClick = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/createValidationBioDisposeSample", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDisposeForm = this.props.Login.masterData?.lstBioDisposeForm;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDisposeForm.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode) : -1;

                if (index !== -1) {
                    lstBioDisposeForm[index] = responseData.selectedBioDisposeForm;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDisposeForm;
                }

                masterData['lstBioDisposeForm'] = lstBioDisposeForm;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openValidateSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChilddisposalsamplesapproval'] = [];
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openValidateSlideOut, selectedRecord, loadEsignStateHandle: false, operation: "validate"
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

    onSaveClick = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login?.masterData?.realSelectedFilterStatus || -1;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode?.value;

        if (operation === "create") {
            inputData["biodisposeform"] = {
                'ndisposalbatchtypecode': selectedRecord.ndisposalbatchtypecode?.value || -1,
                'nformtypecode': selectedRecord.nformtypecode?.value || -1,
                'nbiomovetodisposecode': selectedRecord.nbiomovetodisposecode?.value || -1,
            };
            inputData["nbiodisposeformcode"] = selectedRecord?.nbiodisposeformcode || -1;
            inputData["filterSelectedSamples"] = selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails || [];
            inputData["ncontrolcode"]=this.props.Login.ncontrolcode;

            if (selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails.length > 0) {

                this.setState({ loading: true });
                rsapi().post("disposalsamplesapproval/createdisposalsamplesapproval", { ...inputData })
                    .then(response => {
                        let masterData = {};
                        masterData = { ...this.props.Login.masterData, ...response.data };
                        let openModal = false;
                        let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                        let openDisposalSampleApprove = false;
                        if (saveType === 2) {
                            openModal = true;
                            openDisposalSampleApprove = true;
                            selectedRecord['ndisposalbatchtypecode'] = [];
                            selectedRecord['nformtypecode'] = [];
                            selectedRecord['lstGetSampleReceivingDetails'] = [];
                            selectedRecord['addSelectAll'] = false;
                            selectedRecord['addedSampleReceivingDetails'] = [];
                            bioBankSiteDisable = true;
                        } else {
                            selectedRecord = {};
                            bioBankSiteDisable = false;
                        }
                        selectedRecord['nbiodisposeformcode'] = response.data?.nbiodisposeformcode || -1;

                        this.searchRef.current.value = "";
                        delete masterData["searchedData"];

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openModal, openDisposalSampleApprove, selectedRecord, bioBankSiteDisable,
                                isGridClear: !(this.props?.Login?.isGridClear)

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
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" }));
                this.setState({ loading: false });
            }
        } else if (operation === "update") {
            inputData['nbiodisposeformcode'] = selectedRecord.nbiodisposeformcode || -1;
            inputData['ndisposalbatchtypecode'] = selectedRecord.ndisposalbatchtypecode?.value || -1;
            inputData['stransferdate'] = selectedRecord.formsiteorthirdpartyname && selectedRecord.formsiteorthirdpartyname !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.formsiteorthirdpartyname, this.props.Login.userInfo) : '';
            inputData['sremarks'] = selectedRecord?.sremarks;
            let inputParam = {
                inputData: inputData,
                screenName: "IDS_DISPOSEFORM",
                operation: "update"
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_DISPOSEFORM"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.editRequestBasedTransferRecord(inputData);
            }
        }
    }

    editRequestBasedTransferRecord = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/updatedisposalsamplesapproval", { ...inputData })
            .then(response => {
                let masterData = {};
                let openModal = false;
                let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                let openDisposalSampleApprove = false;

                let searchedData = this.props.Login.masterData?.searchedData;

                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodisposeformcode === response.data.selectedBioDisposeForm.nbiodisposeformcode) : -1;

                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = response.data.selectedBioDisposeForm;
                }

                masterData['searchedData'] = searchedData;
                masterData = { ...this.props.Login.masterData, ...response.data };

                let selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChilddisposalsamplesapproval: this.props.Login.selectedRecord?.addedChilddisposalsamplesapproval || []
                };
                bioBankSiteDisable = false;
                selectedRecord['nprimaryKeydisposalsamplesapproval'] = response.data?.nprimaryKeydisposalsamplesapproval || -1;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openDisposalSampleApprove, selectedRecord, bioBankSiteDisable, loadEsignStateHandle: false
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


    onValidate = (validateID, operation, screenName) => {

        let inputData = [];

        let selectedBioDisposeForm =
            Array.isArray(this.props.Login.masterData?.selectedBioDisposeForm) === true
                ? null : this.props.Login.masterData.selectedBioDisposeForm;
        if (selectedBioDisposeForm !== null) {
            inputData['nbiodisposeformcode'] = Number(this.props.Login?.masterData?.selectedBioDisposeForm?.nbiodisposeformcode) || -1;
            inputData["userinfo"] = this.props.Login.userInfo;

            this.setState({ loading: true });
            rsapi().post("disposalsamplesapproval/fetchDisposeSampleValidate", { ...inputData })
                .then(response => {
                    let masterData = { ...this.props.Login.masterData };
                    let responseData = response.data;
                    let lstBioDisposeForm = this.props.Login.masterData?.lstBioDisposeForm;

                    masterData['lstCourier'] = responseData?.Courier?.body?.lstCourier ?? [];
                    masterData['lstStorageCondition'] = responseData?.StorageCondition?.body?.lstStorageCondition ?? [];
                    masterData['lstUsers'] = responseData?.UsersBasedOnSite?.body?.lstUsers ?? [];

                    masterData = { ...masterData };

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true,
                            openValidateSlideOut: true, ncontrolCode: validateID

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
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
            this.setState({ loading: false });
        }
    }
    onDisposeSampleEsignCheck = (generateLocationID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDisposeForm = this.props.Login.masterData?.selectedBioDisposeForm;

        if (selectedBioDisposeForm !== null) {
            if (selectedBioDisposeForm.ntransactionstatus === transactionStatus.APPROVED) {
                const nbiodisposeformcode = selectedBioDisposeForm?.nbiodisposeformcode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodisposeformcode"] = nbiodisposeformcode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_DISPOSEFORM",
                    operation: "dispose"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, generateLocationID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onDisposeSample(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDRECORD" }));  // modified by sujatha ATE_274 for wrong ids thrown bgsi-238
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDRECORD" }));   // modified by sujatha ATE_274 for wrong ids thrown bgsi-238
            this.setState({ loading: false });
        }
    }

    onDisposeSample = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/disposeSamplesApproval", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDisposeForm = this.props.Login.masterData?.lstBioDisposeForm;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDisposeForm.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode) : -1;

                if (index !== -1) {
                    lstBioDisposeForm[index] = responseData.selectedBioDisposeForm;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDisposeForm;
                }

                masterData['lstBioDisposeForm'] = lstBioDisposeForm;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, loadEsignStateHandle: false, openModal: false
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

    onApproveEsignCheck = (generateLocationID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioDisposeForm = this.props.Login.masterData?.selectedBioDisposeForm;

        if (selectedBioDisposeForm !== null) {
            if (selectedBioDisposeForm.ntransactionstatus === transactionStatus.DRAFT
                || selectedBioDisposeForm.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbiodisposeformcode = selectedBioDisposeForm?.nbiodisposeformcode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodisposeformcode"] = nbiodisposeformcode;
                inputData["ncontrolcode"]=generateLocationID;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_DISPOSEFORM",
                    operation: "approve"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, generateLocationID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onApprove(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    onApprove = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/approvalDisposalSamples", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDisposeForm = this.props.Login.masterData?.lstBioDisposeForm;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDisposeForm.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode) : -1;

                if (index !== -1) {
                    lstBioDisposeForm[index] = responseData.selectedBioDisposeForm;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDisposeForm;
                }

                masterData['lstBioDisposeForm'] = lstBioDisposeForm;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, loadEsignStateHandle: false, openModal: false
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
        this.validateEsignforDisposeSample(inputParam, modalName);
    }

    validateEsignforDisposeSample = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "update"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_DISPOSEFORM") {
                        this.editRequestBasedTransferRecord(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "validate"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_DISPOSEFORM") {
                        this.onValidateClick(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "transfer"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERSAMPLES") {
                        this.onTransfer(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "approve"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_DISPOSEFORM") {
                        this.onApprove(inputParam["screenData"]["inputParam"]["inputData"]);
                    }else if (inputParam["screenData"]["inputParam"]["operation"] === "dispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_DISPOSEFORM") {
                        this.onDisposeSample(inputParam["screenData"]["inputParam"]["inputData"]);
                    }
                }
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
                }
                else {
                    toast.info(error.response.data);
                }
            })
    }

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openDisposalSampleApprove = this.props.Login.openDisposalSampleApprove;
        let openValidateSlideOut = this.props.Login.openValidateSlideOut;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openDisposalSampleApprove = (screenName === "IDS_DISPOSEFORM" && operation === "update") ? true : false;
            openModal = false;
            openValidateSlideOut = (screenName === "IDS_DISPOSEFORM" && operation === "validate") ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChilddisposalsamplesapproval: this.props.Login.selectedRecord?.addedChilddisposalsamplesapproval || []
            };
            openDisposalSampleApprove = false;
            openValidateSlideOut = false;
            viewFormDetails = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openDisposalSampleApprove,
                openValidateSlideOut,
                loadEsignStateHandle,
                viewFormDetails
            }
        }
        this.props.updateStore(updateInfo);

    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    // onViewFormDetails = (viewID, operation, screenName) => {
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: {
    //             openModal: true,
    //             viewFormDetails: true,
    //             operation: 'view', screenName: 'IDS_COMPLETEDDETAILS'
    //         }
    //     }
    //     this.props.updateStore(updateInfo);
    // }

}

export default connect(mapStateToProps, {
    updateStore, filterTransactionList, generateControlBasedReport
})(injectIntl(DisposalSampleApproval));