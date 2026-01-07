import { faCheckSquare, faPlus, faTimes, faArrowsAltH, faEye, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import React from "react";
import { FormGroup, FormLabel, Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
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
import { designProperties, transactionStatus, TransferType } from '../../../components/Enumeration';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ProductList } from '../../product/product.styled';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import AddRequestBasedTransfer from './AddRequestBasedTransfer';
import RequestBasedTransferFilter from './RequestBasedTransferFilter';
import OuterGridRequestBasedTransfer from './OuterGridRequestBasedTransfer';
import ValidateRequestBasedTransfer from './ValidateRequestBasedTransfer';
import ViewInfoDetails from "../../../components/ViewInfoDetails";
import { ReadOnlyText } from "../../../components/App.styles";
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class RequestBasedTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();
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
            take: this.props.Login.settings &&  parseInt(this.props.Login.settings[3]),
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
        if (this.props.Login.openModal && this.props.Login.openRequestBasedTransfer && nextState.isInitialRender === false &&
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

    SplitterOnChange = (event) => {
        this.setState({ panes: event.newState });
    };

    render() {

        let selectedBioRequestBasedTransfer = this.props.Login.masterData.selectedBioRequestBasedTransfer || {};


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
        if (this.props.Login.masterData && this.props.Login.masterData.realselectedTransferType) {
            breadCrumbData.push(
                {
                    "label": "IDS_REQUESTTYPE",
                    "value": this.props.Login.masterData.realselectedTransferType ? this.props.Login.masterData.realselectedTransferType.label : '-'
                }
            );
        }
        if (this.props.Login.masterData && this.props.Login.masterData.realSelectedFilterStatus) {
            breadCrumbData.push(
                {
                    "label": "IDS_FORMSTATUS",
                    "value": this.props.Login.masterData.realSelectedFilterStatus ? this.props.Login.masterData.realSelectedFilterStatus.label : '-'
                }
            );
        }

        this.searchFieldList = ["sformnumber", "stransfertypename", "sreceiversitename", "stransferdate", "stransdisplaystatus"]
        const filterParam = {
            inputListName: "lstBioRequestBasedTransfer", selectedObject: "lstChildBioRequestbasedTransfer", primaryKeyField: "nbiorequestbasedtransfercode",
            fetchUrl: "biorequestbasedtransfer/getActiveBioRequestBasedTransfer", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioRequestBasedTransfer",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioRequestBasedTransfer',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "sreceiversitename" },
            { [designProperties.VALUE]: "stransferdate" },
        ];

        const addID = this.state.controlMap.has("AddRequestBasedTransfer") && this.state.controlMap.get("AddRequestBasedTransfer").ncontrolcode;
        const editID = this.state.controlMap.has("EditRequestBasedTransfer") && this.state.controlMap.get("EditRequestBasedTransfer").ncontrolcode;
        const validateID = this.state.controlMap.has("ValidateRequestBasedTransfer") && this.state.controlMap.get("ValidateRequestBasedTransfer").ncontrolcode;
        const cancelID = this.state.controlMap.has("CancelRequestBasedTransfer") && this.state.controlMap.get("CancelRequestBasedTransfer").ncontrolcode;
        const transferID = this.state.controlMap.has("RequestBasedTransfer") && this.state.controlMap.get("RequestBasedTransfer").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildRequestBasedTransfer") && this.state.controlMap.get("AddChildRequestBasedTransfer").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildRequestBasedTransfer") && this.state.controlMap.get("DeleteChildRequestBasedTransfer").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleRequestBasedTransfer") && this.state.controlMap.get("ValidateSampleRequestBasedTransfer").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildRequestBasedTransfer") && this.state.controlMap.get("DisposeChildRequestBasedTransfer").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewRequestBasedTransfer") && this.state.controlMap.get("ViewRequestBasedTransfer").ncontrolcode;
        const reportID = this.state.controlMap.has("RequestBasedTransferReport") && this.state.controlMap.get("RequestBasedTransferReport").ncontrolcode;
        const undoID = this.state.controlMap.has("undoRequestBasedtransfer") && this.state.controlMap.get("undoRequestBasedtransfer").ncontrolcode;


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
                                    <Splitter  panes={this.state.panes} onChange={this.SplitterOnChange} className='layout-splitter' orientation="horizontal" >
                                        <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioRequestBasedTransfer || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioRequestBasedTransfer] || []}
                                        primaryKeyField="nbiorequestbasedtransfercode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getRequestBasedTransfer(
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
                                        actionIcons={[
                                            {
                                                title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                controlname: "faPencilAlt",
                                                objectName: "editRequestBasedTransfer",
                                                hidden: this.state.userRoleControlRights.indexOf(editID) === -1,
                                                onClick: this.editRequestBasedTransfer,
                                                inputData: {
                                                    primaryKeyName: "nbiorequestbasedtransfercode",
                                                    operation: "update",
                                                    masterData: this.props.Login.masterData,
                                                    userInfo: this.props.Login.userInfo,
                                                    controlCode: editID
                                                },
                                            }
                                        ]}
                                        commonActions={
                                            <>
                                                <ProductList className="d-flex product-category float-right">
                                                    <Nav.Link
                                                        className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                        hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                        onClick={() => this.addRequestBasedTransfer(addID, 'create', 'IDS_TRANSFERFORM')} >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </Nav.Link>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onValidate(validateID, 'validate', 'IDS_TRANSFERFORM')}
                                                        hidden={this.state.userRoleControlRights.indexOf(validateID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATION" })}>
                                                        <FontAwesomeIcon icon={faCheckSquare} />
                                                    </Button>

                                                     <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onCancelEsignCheck(cancelID, 'cancel', 'IDS_TRANSFERFORM')}
                                                        hidden={this.state.userRoleControlRights.indexOf(cancelID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        // onClick={() => this.onTransferEsignCheck(transferID, 'transfer', 'IDS_TRANSFERSAMPLES')}
                                                        onClick={() => this.handleTransfer(transferID, 'transfer', 'IDS_TRANSFERSAMPLES')}
                                                        hidden={this.state.userRoleControlRights.indexOf(transferID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_TRANSFER" })}>
                                                        <FontAwesomeIcon icon={faArrowsAltH} />
                                                    </Button>                                                   

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.props.generateControlBasedReport(reportID, {
                                                            ...this.props.Login.masterData?.selectedBioRequestBasedTransfer,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbiorequestbasedtransfercode", this.props.Login?.masterData?.selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode)}
                                                        hidden={this.state.userRoleControlRights.indexOf(reportID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}>
                                                        <FontAwesomeIcon icon={faNewspaper} />
                                                    </Button>

                                                    {/* <div>
                                                        <ViewInfoDetails
                                                            selectedObject={this.props.Login.masterData.selectedBioRequestBasedTransfer}
                                                            screenHiddenDetails={this.state.userRoleControlRights.indexOf(cancelID) === -1}
                                                            screenName={this.props.intl.formatMessage({ id: "IDS_VALIDATIONDETAILS" })}
                                                            dataTip={this.props.intl.formatMessage({ id: "IDS_VALIDATIONDETAILS" })}
                                                            rowList={[
                                                                [
                                                                    { dataField: "sformnumber", idsName: "IDS_REQUESTFORMNO" },
                                                                    { dataField: "sreceiversitename", idsName: "IDS_ORIGINSITE" }
                                                                ],
                                                                [
                                                                    { dataField: "stransferdate", idsName: "IDS_TRANSFERDATE" },
                                                                    { dataField: "stransdisplaystatus", idsName: "IDS_FORMSTATUS" }
                                                                ],
                                                                [
                                                                    { dataField: "sstorageconditionname", idsName: "IDS_TEMPERATUREDEG" },
                                                                    { dataField: "sdeliverydate", idsName: "IDS_DELIVERYDATE" }
                                                                ],
                                                                [
                                                                    { dataField: "sdispatchername", idsName: "IDS_DISPATCHER" },
                                                                    { dataField: "scouriername", idsName: "IDS_COURIERNAME" }
                                                                ],
                                                                [
                                                                    { dataField: "scourierno", idsName: "IDS_COURIERNO" },
                                                                    { dataField: "striplepackage", idsName: "IDS_TRIPLEPACKAGE" }
                                                                ]
                                                            ]
                                                            }
                                                        />
                                                    </div> */}

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onViewFormDetails(viewID, 'view', 'IDS_FORMVALIDATIONDETAILS')}
                                                        hidden={this.state.userRoleControlRights.indexOf(viewID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATIONDETAILS" })}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>

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
                                                    <RequestBasedTransferFilter
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
                                        <SplitterPane size="70%" min="25%">
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
                                                            <OuterGridRequestBasedTransfer
                                                                dataState={this.state.dataState}
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                selectedRecord={this.props.Login.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioRequestbasedTransfer={this.props.Login.masterData.lstChildBioRequestbasedTransfer || []}
                                                                addChildID={addChildID}
                                                                acceptRejectID={acceptRejectID}
                                                                deleteChildID={deleteChildID}
                                                                disposeID={disposeID}
                                                                undoID={undoID}
                                                                lstBioRequestBasedTransfer={this.props.Login.masterData.lstBioRequestBasedTransfer}
                                                                selectedBioRequestBasedTransfer={this.props.Login.masterData.selectedBioRequestBasedTransfer}
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
                        size={this.props.Login.operation === 'validate' ? 'lg' : this.props.Login.operation === 'view' ? 'lg' : this.props.Login.operation === 'cancel' ? 'lg' : 'xl'}
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
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false :
                            this.props.Login.openRequestBasedTransfer ? true : false}
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
                            : this.props.Login.openRequestBasedTransfer ?
                                <AddRequestBasedTransfer
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    lstTransferTypeCombo={this.props.Login.masterData.lstTransferTypeCombo || []}
                                    lstRequestAcceptanceType={this.props.Login.masterData.lstRequestAcceptanceType || []}
                                    lstStorageType={this.props.Login.masterData.lstStorageType || []}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.childDataChange}
                                    bioBankSiteDisable={this.props.Login.bioBankSiteDisable}
                                />
                                :
                                this.props.Login.openValidateSlideOut ?
                                    <ValidateRequestBasedTransfer
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                                        lstUsers={this.props.Login.masterData.lstUsers || []}
                                        lstCourier={this.props.Login.masterData.lstCourier || []}
                                        selectedRecord={this.state.selectedRecord || {}}
                                        operation={this.props.Login.operation}
                                        childDataChange={this.childDataChange}
                                        sformnumber={this.props.Login.masterData?.selectedBioRequestBasedTransfer?.sformnumber || ""}
                                    />
                                    : this.props.Login.viewFormDetails ?
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_FORMNUMBER"
                                                                        message="Form Number"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        this.props.Login.masterData?.selectedBioRequestBasedTransfer ?
                                                                            this.props.Login.masterData?.selectedBioRequestBasedTransfer.sformnumber
                                                                                ? this.props.Login.masterData?.selectedBioRequestBasedTransfer.sformnumber
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_TRANSFERSITE"
                                                                        message="Transfer Site"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.sreceiversitename
                                                                                ? selectedBioRequestBasedTransfer.sreceiversitename
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_TRANSFERDATE"
                                                                        message="Transfer Date"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.stransferdate
                                                                                ? selectedBioRequestBasedTransfer.stransferdate
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_FORMSTATUS"
                                                                        message="Form Status"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.stransdisplaystatus
                                                                                ? selectedBioRequestBasedTransfer.stransdisplaystatus
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_TEMPERATUREDEG"
                                                                        message="Temperature Deg"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.sstorageconditionname
                                                                                ? selectedBioRequestBasedTransfer.sstorageconditionname
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_DELIVERYDATE"
                                                                        message="Delivery Date"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.sdeliverydate
                                                                                ? selectedBioRequestBasedTransfer.sdeliverydate
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_DISPATCHER"
                                                                        message="Dispatcher"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.sdispatchername
                                                                                ? selectedBioRequestBasedTransfer.sdispatchername
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_COURIERNAME"
                                                                        message="Courier Name"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.scouriername
                                                                                ? selectedBioRequestBasedTransfer.scouriername
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_COURIERNO"
                                                                        message="Courier No."
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.scourierno
                                                                                ? selectedBioRequestBasedTransfer.scourierno
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_TRIPLEPACKAGE"
                                                                        message="Triple Package"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.striplepackage
                                                                                ? selectedBioRequestBasedTransfer.striplepackage
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_REMARKS"
                                                                        message="Remarks"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.sremarks
                                                                                ? selectedBioRequestBasedTransfer.sremarks
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_VALIDATIONREMARKS"
                                                                        message="Validation Remarks"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioRequestBasedTransfer ?
                                                                            selectedBioRequestBasedTransfer.svalidationremarks
                                                                                ? selectedBioRequestBasedTransfer.svalidationremarks
                                                                                : "-" : "-"
                                                                    }
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </ContentPanel>
                                        : ""}
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

        // if (this.props.Login.dataState !== previousProps.Login.dataState) {
        //     updateState = true;
        //     dataState = {
        //         skip: 0,
        //         take: take,
        //     }
        //     skip = 0;
        //     take = take;
        // }

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
    // componentDidUpdate(previousProps) {
    //     if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
    //         const userRoleControlRights = [];
    //         if (this.props.Login.userRoleControlRights) {
    //             this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
    //                 userRoleControlRights.push(item.ncontrolcode))
    //         }

    //         const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
    //         this.setState({
    //             userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights
    //         });
    //     }

    //     let { selectedRecord, selectedFilterRecord, selectedFilter, skip, take, dataState } = this.state;
    //     let updateState = false;

    //     if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //         selectedRecord = this.props.Login.selectedRecord;
    //         updateState = true;
    //     }

    //     if (this.props.Login.selectedFilterRecord !== previousProps.Login.selectedFilterRecord) {
    //         selectedFilterRecord = this.props.Login.selectedFilterRecord;
    //     }

    //     if (this.props.Login.selectedFilter !== previousProps.Login.selectedFilter) {
    //         selectedFilter = this.props.Login.selectedFilter;
    //         updateState = true;
    //     }

    //     if (this.props.Login.dataState !== previousProps.Login.dataState) {
    //         updateState = true;
    //         dataState = {
    //             skip: 0,
    //             take: take,
    //         }
    //         skip = 0;
    //         take = take;
    //     }

    //     if (updateState) {
    //         this.setState({
    //             selectedRecord, selectedFilterRecord, selectedFilter, dataState, skip, take
    //         })
    //     }
    // }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {selectedRecord:{},selectedChildRecord:{},openAcceptRejectRequestBasedTransfer:undefined,
                openModalShow:undefined,loadEsignStateHandle:undefined,selectedViewRecord:{},
                masterData: [], inputParam: undefined, lstReason: [], lstSampleCondition: []

            }
        }
        this.props.updateStore(updateInfo);
    }

    getRequestBasedTransfer(inputParam) {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/getActiveBioRequestBasedTransfer", {
            'userinfo': inputParam.userinfo,
            'nbiorequestbasedtransfercode': inputParam.nbiorequestbasedtransfercode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChildBioRequestBasedTransfer'] = [];
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
                        }, isGridClear: !(this.props?.Login?.isGridClear)
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
        const nTransferTypeCode = this.state.selectedFilterRecord?.ntransfertypecode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate, selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            ntransfertypecode: nTransferTypeCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/getBioRequestBasedTransfer", { ...inputData })
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
        const nTransferTypeCode = this.state.selectedFilterRecord?.ntransfertypecode || -1;


        let inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            userinfo: this.props.Login.userInfo,
            ntransfertypecode: nTransferTypeCode.value,

        }
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/getBioRequestBasedTransfer", { ...inputData })
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
            this.props.Login.openRequestBasedTransfer ? (this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_REQUESTTYPE", "dataField": "ntransfertypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_ORIGIN", "dataField": "originsiteorthirdparty", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_REQUESTFORMNO", "dataField": "necatrequestreqapprovalcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_TRANSFERDATE", "dataField": "dtransferdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
                    //{ "idsName": "IDS_BIOPROJECT", "dataField": "nbioprojectcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    //{ "idsName": "IDS_PARENTSAMPLECODE", "dataField": "nbioparentsamplecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }
                ] :
                this.props.Login.operation === 'update' ?
                    [
                        { "idsName": "IDS_REQUESTTYPE", "dataField": "ntransfertypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_TRANSFERDATE", "dataField": "dtransferdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" }
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
            this.props.Login.openRequestBasedTransfer ? this.onSaveClick : this.props.Login.openValidateSlideOut ?
                this.onValidateEsignCheck : "", this.props.Login.loadEsignStateHandle, saveType);
    }

    addRequestBasedTransfer = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });
            //const getRequestAcceptanceType = rsapi().post("biorequestbasedtransfer/getRequestAcceptanceType", { 'userinfo': this.props.Login.userInfo });
            const getTransferType = rsapi().post("biorequestbasedtransfer/getTransferType", { 'userinfo': this.props.Login.userInfo });
            const getStorageType = rsapi().post("biorequestbasedtransfer/getStorageType", { 'userinfo': this.props.Login.userInfo });

            let urlArray = [getTransferType, getStorageType];
            Axios.all(urlArray)
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response[0].data, ...response[1].data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true, openRequestBasedTransfer: true, bioBankSiteDisable: false, ncontrolcode: addID,
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
                'nbiorequestbasedtransfercode': inputParam?.editRequestBasedTransfer?.nbiorequestbasedtransfercode,
                'userinfo': this.props.Login.userInfo
            };
            this.setState({ loading: true });
            rsapi().post("biorequestbasedtransfer/getActiveBioRequestBasedTransferById", { ...inputData })
                .then(response => {
                    let selectedRecordRequestBasedTransfer = response.data?.selectedRecordRequestBasedTransfer;
                    let selectedRecord = this.state.selectedRecord;

                    selectedRecord['nbiorequestbasedtransfercode'] = selectedRecordRequestBasedTransfer.nbiorequestbasedtransfercode || [];
                    selectedRecord['selectedRecordRequestBasedTransfer'] = selectedRecordRequestBasedTransfer || [];
                    selectedRecord['dtransferdate'] = rearrangeDateFormat(this.props.Login.userInfo,
                        selectedRecordRequestBasedTransfer?.stransferdate);
                    selectedRecord['sremarks'] = selectedRecordRequestBasedTransfer.sremarks || '';
                    selectedRecord['ntransfertypecode'] = response.data?.selectedTransferType || [];
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation: inputParam.operation,
                            selectedRecord,
                            openModal: true,
                            openRequestBasedTransfer: true,
                            bioBankSiteDisable: true,
                            ncontrolCode: inputParam.controlCode,
                            screenName: "IDS_TRANSFERFORM"
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

    validateReturnQuantities = (sacceptedvolume, convertKey) => {

        //const convertKey = parseInt(userInfo[90]) || ".";
        return sacceptedvolume = sacceptedvolume.replace(convertKey, '.');
        //return sacceptedvolume;
    }

    onSaveClick = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;

        //const sacceptedvolume = this.validateReturnQuantities(selectedRecord.sacceptedvolume, this.props.Login.settings[90]);

        if (operation === "create") {
            inputData["biorequestbasedtransfer"] = {
                'ntransfertypecode': selectedRecord.ntransfertypecode?.value || -1,
                'nthirdpartycode': selectedRecord.ntransfertypecode?.value !== 1 ?
                    selectedRecord.originsiteorthirdparty?.value || -1 : -1,
                "stransferdate": selectedRecord.dtransferdate && selectedRecord.dtransferdate !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.dtransferdate, this.props.Login.userInfo) : '',
                "nbioprojectcode": selectedRecord?.nbioprojectcode?.value || -1,
                "nbioparentsamplecode": selectedRecord?.nbioparentsamplecode?.value || -1,
                "nstoragetypecode": selectedRecord?.nstoragetypecode?.value || -1,
                "nproductcode": selectedRecord?.nproductcode?.value || -1,
                "sproductname": selectedRecord?.nproductcode?.label || '',
                "sremarks": selectedRecord?.sremarks || '',
                "sstoragetypename": selectedRecord?.nstoragetypecode?.label || '',
                "necatrequestreqapprovalcode": selectedRecord?.necatrequestreqapprovalcode?.value || -1,
                "srepositoryid": selectedRecord.addedSampleReceivingDetails &&
                    selectedRecord.addedSampleReceivingDetails.map(item => item.srepositoryid).join(', ') || '',
                'sbioparentsamplecode': selectedRecord.sbioparentsamplecode?.value || "",
            };
            inputData["necatrequestreqapprovalcode"] = selectedRecord.necatrequestreqapprovalcode?.value || -1;
            inputData["filterSelectedSamples"] = selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails || [];
            inputData["nbiorequestbasedtransfercode"] = selectedRecord.nbiorequestbasedtransfercode || -1;
            inputData["sformnumber"] = this.props.Login?.masterData?.selectedBioRequestBasedTransfer?.sformnumber;
            inputData["selectedsamplecount"] = selectedRecord.addedSampleReceivingDetails
                ? selectedRecord.addedSampleReceivingDetails.length
                : 0;

            inputData["ncontrolcode"] = this.props.Login.ncontrolcode;

            inputData["ssamplestoragetransactioncode"] =
                selectedRecord.addedSampleReceivingDetails
                    ?.map(item => item.nsamplestoragetransactioncode)
                    .join(",") || [];

            if (selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails.length > 0) {
                const total_accepted_volume = selectedRecord.addedSampleReceivingDetails.reduce((sum, item) => {
                    const qty = Number(item.sqty) || 0; return sum + qty;
                }, 0);
                //total_accepted_volume = (Number(total_accepted_volume) || 0) + (Number(selectedRecord.total_accepted_volume) || 0);
                //total_accepted_volume = (Number(total_accepted_volume) || 0) - (Number(selectedRecord.total_accepted_volume) || 0);

                inputData["total_accepted_volume"] = String(total_accepted_volume) || "-1";

                // if (Number(sacceptedvolume) <= Number(total_accepted_volume)) {

                //     toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDEDQUANTITYISHIGH" }));
                //     this.setState({ loading: false });
                // } else {

                this.setState({ loading: true });
                rsapi().post("biorequestbasedtransfer/createBioRequestbasedTransfer", { ...inputData })
                    .then(response => {
                        let masterData = {};
                        masterData = { ...this.props.Login.masterData, ...response.data };
                        let openModal = false;
                        let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                        let openRequestBasedTransfer = false;
                        if (saveType === 2) {
                            openModal = true;
                            openRequestBasedTransfer = true;
                            selectedRecord['lstParentSample'] = [];
                            selectedRecord['lstSampleType'] = [];
                            selectedRecord['nbioprojectcode'] = '';
                            selectedRecord['nbioparentsamplecode'] = '';
                            selectedRecord['nstoragetypecode'] = '';
                            selectedRecord['nproductcode'] = '';
                            selectedRecord['sbioparentsamplecode'] = '';
                            selectedRecord['saccminvolume'] = '';
                            selectedRecord['naccnoofsamples'] = '';
                            selectedRecord['naccnoofsamplesremaining'] = '';
                            selectedRecord['lstGetSampleReceivingDetails'] = [];
                            selectedRecord['addSelectAll'] = false;
                            selectedRecord['addedSampleReceivingDetails'] = [];
                            bioBankSiteDisable = true;
                        } else {
                            selectedRecord = {};
                            bioBankSiteDisable = false;
                        }
                        selectedRecord['nbiorequestbasedtransfercode'] = response.data?.nbiorequestbasedtransfercode || -1;

                        this.searchRef.current.value = "";
                        delete masterData["searchedData"];

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openModal, openRequestBasedTransfer, selectedRecord, bioBankSiteDisable,
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

                //}
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" }));
                this.setState({ loading: false });
            }
        } else if (operation === "update") {
            inputData['nbiorequestbasedtransfercode'] = selectedRecord.nbiorequestbasedtransfercode || -1;
            inputData['ntransfertypecode'] = selectedRecord.ntransfertypecode?.value || -1;
            inputData['stransferdate'] = selectedRecord.dtransferdate && selectedRecord.dtransferdate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.dtransferdate, this.props.Login.userInfo) : '';
            inputData['sremarks'] = selectedRecord?.sremarks;
                  inputData["ntransCode"] = selectedRecord.selectedRecordRequestBasedTransfer?.ntransactionstatus || -1;

            let inputParam = {
                inputData: inputData,
                screenName: "IDS_TRANSFERFORM",
                operation: "update"
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
                this.editRequestBasedTransferRecord(inputData);
            }
        }
    }

    editRequestBasedTransferRecord = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/updateBioRequestBasedTransfer", { ...inputData })
            .then(response => {
                let masterData = {};
                let openModal = false;
                let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                let openRequestBasedTransfer = false;

                let searchedData = this.props.Login.masterData?.searchedData;

                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiorequestbasedtransfercode === response.data.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode) : -1;

                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = response.data.selectedBioRequestBasedTransfer;
                }

                masterData['searchedData'] = searchedData;
                masterData = { ...this.props.Login.masterData, ...response.data };

                let selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChildBioRequestBasedTransfer: this.props.Login.selectedRecord?.addedChildBioRequestBasedTransfer || []
                };
                bioBankSiteDisable = false;
                selectedRecord['nprimaryKeyBioRequestbasedTransfer'] = response.data?.nprimaryKeyBioRequestbasedTransfer || -1;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openRequestBasedTransfer, selectedRecord, bioBankSiteDisable, loadEsignStateHandle: false
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

        let selectedBioRequestBasedTransfer =
            Array.isArray(this.props.Login.masterData?.selectedBioRequestBasedTransfer) === true
                ? null : this.props.Login.masterData.selectedBioRequestBasedTransfer;


        if (selectedBioRequestBasedTransfer !== null) {
            this.setState({ loading: true });
            const getRequestBasedTransferStatus = rsapi().post("biorequestbasedtransfer/findStatusRequestBasedtTransfer", {
                'nbiorequestbasedtransfercode': selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode,
                'userinfo': this.props.Login.userInfo
            });
            const getRequestBasedTransferChildRecord = rsapi().post("biorequestbasedtransfer/getChildInitialGet", {
                'nbiorequestbasedtransfercode': selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode,
                'userinfo': this.props.Login.userInfo
            });
            let urlArrayCheck = [getRequestBasedTransferStatus, getRequestBasedTransferChildRecord];
            Axios.all(urlArrayCheck)
                .then(response => {
                    if (response[0].data === transactionStatus.DRAFT) {
                        if (response[1].data && response[1].data.length > 0) {
                            const getStorageCondition = rsapi().post("biorequestbasedtransfer/getStorageCondition", { 'userinfo': this.props.Login.userInfo });
                            const getUsersBasedOnSite = rsapi().post("biorequestbasedtransfer/getUsersBasedOnSite", { 'userinfo': this.props.Login.userInfo });
                            const getCourier = rsapi().post("biorequestbasedtransfer/getCourier", { 'userinfo': this.props.Login.userInfo });
                            let urlArray = [getStorageCondition, getUsersBasedOnSite, getCourier];
                            Axios.all(urlArray)
                                .then(response => {
                                    let masterData = {};
                                    masterData = { ...this.props.Login.masterData, ...response[0].data, ...response[1].data, ...response[2].data };
                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            masterData, screenName, operation, openModal: true, openValidateSlideOut: true,
                                            bioBankSiteDisable: false, ncontrolCode: validateID
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
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_NOSAMPLESAVAILABLETOVALIDATEFORM" }));
                            this.setState({ loading: false });
                        }
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
                        this.setState({ loading: false });
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

    onValidateEsignCheck = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const nbiorequestbasedtransfercode = this.props.Login.masterData?.selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiorequestbasedtransfercode"] = nbiorequestbasedtransfercode;

        inputData["bioRequestBasedTransfer"] = {
            "sformnumber": selectedRecord?.sformnumber || '',
            "nstorageconditioncode": selectedRecord?.nstorageconditioncode?.value || -1,
            "sstorageconditionname": selectedRecord?.nstorageconditioncode?.label || '',
            "sdeliverydate": selectedRecord.ddeliverydate && selectedRecord.ddeliverydate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.ddeliverydate, this.props.Login.userInfo) : '',
            "ndispatchercode": selectedRecord?.ndispatchercode?.value || -1,
            "sdispatchername": selectedRecord?.ndispatchercode?.label || '',
            "ncouriercode": selectedRecord?.ncouriercode?.value || -1,
            "scouriername": selectedRecord?.ncouriercode?.label || '',
            "scourierno": selectedRecord?.scourierno || '',
            "striplepackage": selectedRecord?.striplepackage || '',
            "svalidationremarks": selectedRecord?.svalidationremarks || ''
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_TRANSFERFORM",
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

    onValidateClick = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/createValidationBioRequestBasedTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioRequestBasedTransfer = this.props.Login.masterData?.lstBioRequestBasedTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioRequestBasedTransfer.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode) : -1;

                if (index !== -1) {
                    lstBioRequestBasedTransfer[index] = responseData.selectedBioRequestBasedTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioRequestBasedTransfer;
                }

                masterData['lstBioRequestBasedTransfer'] = lstBioRequestBasedTransfer;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openValidateSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioRequestBasedTransfer'] = [];
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openValidateSlideOut, selectedRecord, loadEsignStateHandle: false,
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
    }

    handleTransfer = (transferID, operation, screenName) => {
        const selectedBioRequestBasedTransfer = this.props.Login.masterData?.selectedBioRequestBasedTransfer;

        if (selectedBioRequestBasedTransfer !== null) {
            if (selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nBioRequestBasedTransferCode = selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiorequestbasedtransfercode"] = nBioRequestBasedTransferCode;
                rsapi().post("biorequestbasedtransfer/checkAccessibleSamples", { ...inputData })
                    .then(response => {
                        let resposeData = response.data;
                        let NonAccessibleSamples = resposeData["nonAccessibleSamples"];
                        if (NonAccessibleSamples.length > 0) {
                            let confirmMsg = (NonAccessibleSamples[0].nreqformtypecode === TransferType.BIOBANK) ?
                                this.props.intl.formatMessage({ id: "IDS_SAMPLEACCESSIBLECHECK" }) :
                                this.props.intl.formatMessage({ id: "IDS_THIRDPARTYCHECK" });
                            this.confirmMessage.confirm("transferMessage", this.props.intl.formatMessage({ id: "IDS_TRANSFERFORM" }), confirmMsg,
                                this.props.intl.formatMessage({ id: "IDS_YES" }), this.props.intl.formatMessage({ id: "IDS_NO" }),
                                () =>
                                    this.onTransferEsignCheck(transferID, 'transfer', 'IDS_TRANSFERSAMPLES'));
                            // this.onDeleteEsignCheck(deleteID, operation, screenName));
                        } else {
                            this.onTransferEsignCheck(transferID, 'transfer', 'IDS_TRANSFERSAMPLES');
                        }
                    })
                    .catch(error => {
                        if (error.response.status === 401 || error.response.status === 403) {
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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    onTransferEsignCheck = (transferID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioRequestBasedTransfer = this.props.Login.masterData?.selectedBioRequestBasedTransfer;

        if (selectedBioRequestBasedTransfer !== null) {
            if (selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nBioRequestBasedTransferCode = selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiorequestbasedtransfercode"] = nBioRequestBasedTransferCode;
                inputData["ncontrolcode"] = transferID;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_TRANSFERSAMPLES",
                    operation: "transfer"
                }

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, transferID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_TRANSFERSAMPLES", operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onTransfer(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }

    }

    onTransfer = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/requestBasedTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioRequestBasedTransfer = this.props.Login.masterData?.lstBioRequestBasedTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioRequestBasedTransfer.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode) : -1;

                if (index !== -1) {
                    lstBioRequestBasedTransfer[index] = responseData.selectedBioRequestBasedTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioRequestBasedTransfer;
                }

                masterData['lstBioRequestBasedTransfer'] = lstBioRequestBasedTransfer;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal: false, loadEsignStateHandle: false, isGridClear: !(this.props?.Login?.isGridClear)
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

    onCancelEsignCheck = (cancelID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioRequestBasedTransfer = this.props.Login.masterData?.selectedBioRequestBasedTransfer;

        if (selectedBioRequestBasedTransfer !== null) {
            if (selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.DRAFT
                || selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbiorequestbasedtransfercode = selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiorequestbasedtransfercode"] = nbiorequestbasedtransfercode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_TRANSFERFORM",
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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    onCancel = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/cancelRequestBasedTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioRequestBasedTransfer = this.props.Login.masterData?.lstBioRequestBasedTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioRequestBasedTransfer.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode) : -1;

                if (index !== -1) {
                    lstBioRequestBasedTransfer[index] = responseData.selectedBioRequestBasedTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioRequestBasedTransfer;
                }

                masterData['lstBioRequestBasedTransfer'] = lstBioRequestBasedTransfer;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedRecord: [], masterData, loadEsignStateHandle: false, openModal: false, isGridClear: !(this.props?.Login?.isGridClear)
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
        this.validateEsignforRequestBasedTransfer(inputParam, modalName);
    }

    validateEsignforRequestBasedTransfer = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "update"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.editRequestBasedTransferRecord(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "validate"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.onValidateClick(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "transfer"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERSAMPLES") {
                        this.onTransfer(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "cancel"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.onCancel(inputParam["screenData"]["inputParam"]["inputData"]);
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
        let openRequestBasedTransfer = this.props.Login.openRequestBasedTransfer;
        let openValidateSlideOut = this.props.Login.openValidateSlideOut;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openRequestBasedTransfer = (screenName === "IDS_TRANSFERFORM" && operation === "update") ? true : false;
            openModal = (screenName === "IDS_TRANSFERFORM" && (operation === "update" || operation === "validate")) ? true : false;
            openValidateSlideOut = (screenName === "IDS_TRANSFERFORM" && operation === "validate") ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioRequestBasedTransfer: this.props.Login.selectedRecord?.addedChildBioRequestBasedTransfer || []
            };
            openRequestBasedTransfer = false;
            openValidateSlideOut = false;
            viewFormDetails = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openRequestBasedTransfer,
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

    onViewFormDetails = (viewID, operation, screenName) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                viewFormDetails: true,
                operation: 'view', screenName: 'IDS_FORMVALIDATIONDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

}

export default connect(mapStateToProps, {
    updateStore, filterTransactionList, generateControlBasedReport
})(injectIntl(RequestBasedTransfer));