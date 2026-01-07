import { faCheckSquare, faPlus, faTimes, faArrowsAltH, faEye, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import React from "react";
import { Button, Card, Col, Nav, Row, FormLabel, FormGroup } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { toast } from 'react-toastify';
import { Affix } from 'rsuite';
import { filterTransactionList, updateStore, generateControlBasedReport } from '../../../actions';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ContentPanel, ReadOnlyText } from "../../../components/App.styles";
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
import AddDirectTransfer from './AddDirectTransfer';
import DirectTransferFilter from './DirectTransferFilter';
import OuterGridDirectTransfer from './OuterGridDirectTransfer';
import ValidateDirectTransfer from './ValidateDirectTransfer';
// import ViewInfoDetails from "../../../components/ViewInfoDetails";
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class DirectTransfer extends React.Component {
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
           // BGSI-256	Pagination selector is duplicated in the Direct Transfer Added the ParesInt For take --By Neeraj
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            splitChangeWidthPercentage: 30,
            selectedFilter: {},
            loading: false,
            panes: [
                { size: '30%', min: '25%' , resizable: true, collapsible: true}
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
     SplitterOnChange = (event) => {
        this.setState({ panes: event.newState});
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

        this.searchFieldList = ["sformnumber", "stransfertypename", "sreceiversitename", "stransferdate", "stransdisplaystatus"]
        const filterParam = {
            inputListName: "lstBioDirectTransfer", selectedObject: "lstChildBioDirectTransfer", primaryKeyField: "nbiodirecttransfercode",
            fetchUrl: "biodirecttransfer/getActiveBioDirectTransfer", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioDirectTransfer",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioDirectTransfer',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "sreceiversitename" },
            { [designProperties.VALUE]: "stransferdate" },
        ];

        const addID = this.state.controlMap.has("AddDirectTransfer") && this.state.controlMap.get("AddDirectTransfer").ncontrolcode;
        const editID = this.state.controlMap.has("EditDirectTransfer") && this.state.controlMap.get("EditDirectTransfer").ncontrolcode;
        const validateID = this.state.controlMap.has("ValidateDirectTransfer") && this.state.controlMap.get("ValidateDirectTransfer").ncontrolcode;
        const cancelID = this.state.controlMap.has("CancelDirectTransfer") && this.state.controlMap.get("CancelDirectTransfer").ncontrolcode;
        const transferID = this.state.controlMap.has("TransferDirectTransfer") && this.state.controlMap.get("TransferDirectTransfer").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildDirectTransfer") && this.state.controlMap.get("AddChildDirectTransfer").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildDirectTransfer") && this.state.controlMap.get("DeleteChildDirectTransfer").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleDirectTransfer") && this.state.controlMap.get("ValidateSampleDirectTransfer").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildDirectTransfer") && this.state.controlMap.get("DisposeChildDirectTransfer").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewDirectTransfer") && this.state.controlMap.get("ViewDirectTransfer").ncontrolcode;
        const undoID = this.state.controlMap.has("UndoDirectTransfer") && this.state.controlMap.get("UndoDirectTransfer").ncontrolcode;
        const reportID = this.state.controlMap.has("DirectTransferReport") && this.state.controlMap.get("DirectTransferReport").ncontrolcode;

        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "100px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "100px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "svolume", "width": "100px" }
            ];

        let selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer || {};

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
                                <Splitter panes={this.state.panes} onChange={this.SplitterOnChange} className='layout-splitter' orientation="horizontal">
                                    <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioDirectTransfer || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioDirectTransfer] || []}
                                        primaryKeyField="nbiodirecttransfercode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getDirectTransfer(
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
                                                objectName: "editDirectTransfer",
                                                hidden: this.state.userRoleControlRights.indexOf(editID) === -1,
                                                onClick: this.editDirectTransfer,
                                                inputData: {
                                                    primaryKeyName: "nbiodirecttransfercode",
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
                                                        onClick={() => this.addDirectTransfer(addID, 'create', 'IDS_TRANSFERFORM')} >
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
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMCANCEL" })}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        // onClick={() => this.onTransferEsignCheck(transferID, 'transfer', 'IDS_TRANSFERSAMPLES')}
                                                        onClick={() => this.handleTransfer(transferID, 'transfer', 'IDS_TRANSFERSAMPLES')}
                                                        hidden={this.state.userRoleControlRights.indexOf(transferID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMTRANSFER" })}>
                                                        <FontAwesomeIcon icon={faArrowsAltH} />
                                                    </Button>                                                 

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onViewFormDetails(viewID, 'view', 'IDS_FORMVALIDATIONDETAILS')}
                                                        hidden={this.state.userRoleControlRights.indexOf(viewID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATIONDETAILS" })}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.props.generateControlBasedReport(reportID, {
                                                            ...this.props.Login.masterData?.selectedBioDirectTransfer,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbiodirecttransferCode", this.props.Login?.masterData?.selectedBioDirectTransfer?.nbioDirectTransferCode)}
                                                        hidden={this.state.userRoleControlRights.indexOf(reportID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}>
                                                        <FontAwesomeIcon icon={faNewspaper} />
                                                    </Button>



                                                    {/* <ViewInfoDetails
                                                        selectedObject={this.props.Login.masterData.selectedBioDirectTransfer}
                                                        screenHiddenDetails={this.state.userRoleControlRights.indexOf(viewID) === -1}
                                                        screenName={this.props.Login.screenName}
                                                        dataTip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                        rowList={[
                                                            [
                                                                { dataField: "sformnumber", idsName: "IDS_FORMNUMBER" },
                                                                { dataField: "sreceiversitename", idsName: "IDS_TRANSFERSITE" }
                                                            ],
                                                            [
                                                                { dataField: "stransferdate", idsName: "IDS_TRANSFERDATE" },
                                                                { dataField: "stransdisplaystatus", idsName: "IDS_FORMSTATUS" }
                                                            ],
                                                            [
                                                                { dataField: "sremarks", idsName: "IDS_REMARKS" },
                                                                { dataField: "sstorageconditionname", idsName: "IDS_TEMPERATUREDEG" }
                                                            ],
                                                            [
                                                                { dataField: "sdeliverydate", idsName: "IDS_DELIVERYDATE" },
                                                                { dataField: "sdispatchername", idsName: "IDS_DISPATCHER" }
                                                            ],
                                                            [
                                                                { dataField: "scouriername", idsName: "IDS_COURIERNAME" },
                                                                { dataField: "scourierno", idsName: "IDS_COURIERNO" }
                                                            ],
                                                            [
                                                                { dataField: "striplepackage", idsName: "IDS_TRIPLEPACKAGE" },
                                                                { dataField: "svalidationremarks", idsName: "IDS_VALIDATIONREMARKS" }
                                                            ]
                                                        ]}
                                                    /> */}

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
                                                    <DirectTransferFilter
                                                        fromDate={this.fromDate}
                                                        toDate={this.toDate}
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
                                    <SplitterPane size="70%">
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
                                                            <OuterGridDirectTransfer
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                dataState={this.state.dataState}
                                                                selectedRecord={this.props.Login.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioDirectTransfer={this.props.Login.masterData.lstChildBioDirectTransfer || []}
                                                                addChildID={addChildID}
                                                                acceptRejectID={acceptRejectID}
                                                                deleteChildID={deleteChildID}
                                                                disposeID={disposeID}
                                                                undoID={undoID}
                                                                lstBioDirectTransfer={this.props.Login.masterData.lstBioDirectTransfer}
                                                                selectedBioDirectTransfer={this.props.Login.masterData.selectedBioDirectTransfer}
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
                            this.props.Login.openDirectTransfer ? true : false}
                        showValidate={this.props.Login.loadEsignStateHandle ? false :
                            this.props.Login.openValidateSlideOut ? true : false}
                        showSave={this.props.Login.openValidateSlideOut ? false : true}
                        hideSave={this.props.Login.viewFormDetails ? true : false}
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
                            : this.props.Login.openDirectTransfer ?
                                <AddDirectTransfer
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    lstBioBankSite={this.props.Login.masterData.lstBioBankSite || []}
                                    lstStorageType={this.props.Login.masterData.lstStorageType || []}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.childDataChange}
                                    bioBankSiteDisable={this.props.Login.bioBankSiteDisable}
                                />
                                :
                                this.props.Login.openValidateSlideOut ?
                                    <ValidateDirectTransfer
                                        controlMap={this.state.controlMap}
                                        userRoleControlRights={this.state.userRoleControlRights}
                                        lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                                        lstUsers={this.props.Login.masterData.lstUsers || []}
                                        lstCourier={this.props.Login.masterData.lstCourier || []}
                                        selectedRecord={this.state.selectedRecord || {}}
                                        operation={this.props.Login.operation}
                                        childDataChange={this.childDataChange}
                                        sformnumber={this.props.Login.masterData?.selectedBioDirectTransfer?.sformnumber || ""}
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sformnumber
                                                                                ? selectedBioDirectTransfer.sformnumber
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sreceiversitename
                                                                                ? selectedBioDirectTransfer.sreceiversitename
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.stransferdate
                                                                                ? selectedBioDirectTransfer.stransferdate
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.stransdisplaystatus
                                                                                ? selectedBioDirectTransfer.stransdisplaystatus
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sstorageconditionname
                                                                                ? selectedBioDirectTransfer.sstorageconditionname
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sdeliverydate
                                                                                ? selectedBioDirectTransfer.sdeliverydate
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sdispatchername
                                                                                ? selectedBioDirectTransfer.sdispatchername
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.scouriername
                                                                                ? selectedBioDirectTransfer.scouriername
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.scourierno
                                                                                ? selectedBioDirectTransfer.scourierno
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.striplepackage
                                                                                ? selectedBioDirectTransfer.striplepackage
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.sremarks
                                                                                ? selectedBioDirectTransfer.sremarks
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
                                                                        selectedBioDirectTransfer ?
                                                                            selectedBioDirectTransfer.svalidationremarks
                                                                                ? selectedBioDirectTransfer.svalidationremarks
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
                selectedRecord: {}, selectedChildRecord: {}, selectedViewRecord: {}, loadEsignStateHandle:undefined,openModalShow:undefined,
                openAcceptRejectDirectTransfer:undefined,
                masterData: [], inputParam: undefined, lstReason: [], lstSampleCondition: []
            }
        }
        this.props.updateStore(updateInfo);
    }

    getDirectTransfer(inputParam) {
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/getActiveBioDirectTransfer", {
            'userinfo': inputParam.userinfo,
            'nbiodirecttransfercode': inputParam.nbiodirecttransfercode || '-1'
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
        rsapi().post("biodirecttransfer/getBioDirectTransfer", { ...inputData })
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

        rsapi().post("biodirecttransfer/getBioDirectTransfer", inputData)
            .then(response => {
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
            this.props.Login.openDirectTransfer ? (this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_TRANSFERSITE", "dataField": "nbiobanksitecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_TRANSFERDATE", "dataField": "dtransferdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
                    { "idsName": "IDS_BIOPROJECT", "dataField": "nbioprojectcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }
                ] :
                this.props.Login.operation === 'update' ?
                    [
                        { "idsName": "IDS_TRANSFERSITE", "dataField": "nbiobanksitecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
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
            this.props.Login.openDirectTransfer ? this.onSaveClick : this.props.Login.openValidateSlideOut ?
                this.onValidateEsignCheck : "", this.props.Login.loadEsignStateHandle, saveType);
    }

    addDirectTransfer = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });
            const getSiteBasedOnTransferType = rsapi().post("biodirecttransfer/getSiteBasedOnTransferType", { 'userinfo': this.props.Login.userInfo });
            const getStorageType = rsapi().post("biodirecttransfer/getStorageType", { 'userinfo': this.props.Login.userInfo });
            let urlArray = [getSiteBasedOnTransferType, getStorageType];
            Axios.all(urlArray)
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response[0].data, ...response[1].data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true, openDirectTransfer: true, bioBankSiteDisable: false,
                            isGridClear: !(this.props.Login.isGridClear), ncontrolCode: addID
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

    editDirectTransfer = (inputParam) => {
        if (inputParam?.editDirectTransfer.ntransactionstatus === transactionStatus.DRAFT
            || inputParam?.editDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
            let inputData = {
                'nbiodirecttransfercode': inputParam?.editDirectTransfer?.nbiodirecttransfercode,
                'userinfo': this.props.Login.userInfo
            };
            this.setState({ loading: true });
            rsapi().post("biodirecttransfer/getActiveBioDirectTransferById", { ...inputData })
                .then(response => {
                    let selectedChildDirectTransfer = response.data?.selectedChildDirectTransfer;
                    let selectedRecord = this.state.selectedRecord;
                    selectedRecord['nbiobanksitecode'] = {
                        label: selectedChildDirectTransfer.sreceiversitename,
                        value: selectedChildDirectTransfer.nreceiversitecode,
                        item: selectedChildDirectTransfer
                    };
                    selectedRecord['dtransferdate'] = rearrangeDateFormat(this.props.Login.userInfo,
                        selectedChildDirectTransfer?.stransferdate);
                    selectedRecord['sremarks'] = selectedChildDirectTransfer.sremarks || '';
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation: inputParam.operation,
                            selectedRecord,
                            openModal: true,
                            openDirectTransfer: true,
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
        inputData["ncontrolcode"] = this.props.Login.ncontrolCode;

        if (operation === "create") {
            inputData["bioDirectTransfer"] = {
                "nbiobanksitecode": selectedRecord?.nbiobanksitecode?.value || -1,
                "sreceiversitename": selectedRecord?.nbiobanksitecode?.label || '',
                "stransferdate": selectedRecord.dtransferdate && selectedRecord.dtransferdate !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.dtransferdate, this.props.Login.userInfo) : '',
                "nbioprojectcode": selectedRecord?.nbioprojectcode?.value || -1,
                "nbioparentsamplecode": selectedRecord?.sparentsamplecode?.item?.nbioparentsamplecode || -1,
                "nstoragetypecode": selectedRecord?.nstoragetypecode?.value || -1,
                "sparentsamplecode": selectedRecord?.sparentsamplecode?.item?.sparentsamplecode || '',
                "ncohortno": selectedRecord?.sparentsamplecode?.item?.ncohortno || -1,
                "nproductcode": selectedRecord?.nproductcode?.value || -1,
                "sproductname": selectedRecord?.nproductcode?.label || '',
                "sremarks": selectedRecord?.sremarks || '',
                "sstoragetypename": selectedRecord?.nstoragetypecode?.label || '',
                "srepositoryid": selectedRecord.addedSampleReceivingDetails &&
                    selectedRecord.addedSampleReceivingDetails.map(item => item.srepositoryid).join(', ') || ''
            };
            inputData["filterSelectedSamples"] = selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails || [];
            inputData["nprimaryKeyBioDirectTransfer"] = selectedRecord.nprimaryKeyBioDirectTransfer || -1;
            if (selectedRecord.addedSampleReceivingDetails && selectedRecord.addedSampleReceivingDetails.length > 0) {
                this.setState({ loading: true });
                rsapi().post("biodirecttransfer/createBioDirectTransfer", { ...inputData })
                    .then(response => {
                        let masterData = {};
                        masterData = { ...this.props.Login.masterData, ...response.data };
                        let openModal = false;
                        let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                        let openDirectTransfer = false;
                        if (saveType === 2) {
                            openModal = true;
                            openDirectTransfer = true;
                            selectedRecord['lstParentSample'] = [];
                            selectedRecord['lstSampleType'] = [];
                            selectedRecord['nbioprojectcode'] = '';
                            selectedRecord['sparentsamplecode'] = '';
                            selectedRecord['nstoragetypecode'] = '';
                            selectedRecord['nproductcode'] = '';
                            selectedRecord['lstGetSampleReceivingDetails'] = [];
                            selectedRecord['addSelectAll'] = false;
                            selectedRecord['addedSampleReceivingDetails'] = [];
                            bioBankSiteDisable = true;
                        } else {
                            selectedRecord = {};
                            bioBankSiteDisable = false;
                        }
                        selectedRecord['nprimaryKeyBioDirectTransfer'] = response.data?.nprimaryKeyBioDirectTransfer || -1;

                        this.searchRef.current.value = "";
                        delete masterData["searchedData"];

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openModal, openDirectTransfer, selectedRecord, bioBankSiteDisable,
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
            inputData['nbiodirecttransfercode'] = selectedRecord?.nbiobanksitecode?.item?.nbiodirecttransfercode;
            inputData['stransferdate'] = selectedRecord.dtransferdate && selectedRecord.dtransferdate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.dtransferdate, this.props.Login.userInfo) : '';
            inputData['sremarks'] = selectedRecord?.sremarks;
            inputData['sstoragetypename'] = selectedRecord?.nstoragetypecode?.label || '';
            inputData['sproductname'] = selectedRecord?.nproductcode?.label || '';
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
                this.editDirectTransferRecord(inputData);
            }
        }
    }

    editDirectTransferRecord = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/updateBioDirectTransfer", { ...inputData })
            .then(response => {
                let masterData = {};
                let openModal = false;
                let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                let openDirectTransfer = false;

                let searchedData = this.props.Login.masterData?.searchedData;

                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodirecttransfercode === response.data.selectedBioDirectTransfer.nbiodirecttransfercode) : -1;

                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = response.data.selectedBioDirectTransfer;
                }

                masterData['searchedData'] = searchedData;
                masterData = { ...this.props.Login.masterData, ...response.data };

                let selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChildBioDirectTransfer: this.props.Login.selectedRecord?.addedChildBioDirectTransfer || []
                };
                bioBankSiteDisable = false;
                selectedRecord['nprimaryKeyBioDirectTransfer'] = response.data?.nprimaryKeyBioDirectTransfer || -1;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openDirectTransfer, selectedRecord, bioBankSiteDisable, loadEsignStateHandle: false
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
        let selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer;
        if (selectedBioDirectTransfer !== null) {
            this.setState({ loading: true });
            const getDirectTransferStatus = rsapi().post("biodirecttransfer/findStatusDirectTransfer", {
                'nbiodirecttransfercode': selectedBioDirectTransfer.nbiodirecttransfercode,
                'userinfo': this.props.Login.userInfo
            });
            const getDirectTransferChildRecord = rsapi().post("biodirecttransfer/getChildInitialGet", {
                'nbiodirecttransfercode': selectedBioDirectTransfer.nbiodirecttransfercode,
                'userinfo': this.props.Login.userInfo
            });
            let urlArrayCheck = [getDirectTransferStatus, getDirectTransferChildRecord];
            Axios.all(urlArrayCheck)
                .then(response => {
                    if (response[0].data === transactionStatus.DRAFT) {
                        if (response[1].data && response[1].data.length > 0) {
                            const getStorageCondition = rsapi().post("biodirecttransfer/getStorageCondition", { 'userinfo': this.props.Login.userInfo });
                            const getUsersBasedOnSite = rsapi().post("biodirecttransfer/getUsersBasedOnSite", { 'userinfo': this.props.Login.userInfo });
                            const getCourier = rsapi().post("biodirecttransfer/getCourier", { 'userinfo': this.props.Login.userInfo });
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
        const nbioDirectTransferCode = this.props.Login.masterData?.selectedBioDirectTransfer?.nbiodirecttransfercode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
        inputData["ncontrolcode"] = this.props.Login.ncontrolCode;

        inputData["bioDirectTransfer"] = {
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
        rsapi().post("biodirecttransfer/createValidationBioDirectTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDirectTransfer = this.props.Login.masterData?.lstBioDirectTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDirectTransfer.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode) : -1;

                if (index !== -1) {
                    lstBioDirectTransfer[index] = responseData.selectedBioDirectTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDirectTransfer;
                }

                masterData['lstBioDirectTransfer'] = lstBioDirectTransfer;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openValidateSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioDirectTransfer'] = [];
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
        const selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer;

        if (selectedBioDirectTransfer !== null) {
            if (selectedBioDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioDirectTransferCode = selectedBioDirectTransfer?.nbiodirecttransfercode;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
                rsapi().post("biodirecttransfer/checkAccessibleSamples", { ...inputData })
                    .then(response => {
                        let resposeData = response.data;
                        let NonAccessibleSamples = resposeData["nonAccessibleSamples"];
                        if (NonAccessibleSamples.length > 0) {
                            this.confirmMessage.confirm("transferMessage", this.props.intl.formatMessage({ id: "IDS_TRANSFERFORM" }), this.props.intl.formatMessage({ id: "IDS_SAMPLEACCESSIBLECHECK" }),
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
        const selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer;

        if (selectedBioDirectTransfer !== null) {
            if (selectedBioDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioDirectTransferCode = selectedBioDirectTransfer?.nbiodirecttransfercode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
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
        rsapi().post("biodirecttransfer/transferDirectTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDirectTransfer = this.props.Login.masterData?.lstBioDirectTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDirectTransfer.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode) : -1;

                if (index !== -1) {
                    lstBioDirectTransfer[index] = responseData.selectedBioDirectTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDirectTransfer;
                }

                masterData['lstBioDirectTransfer'] = lstBioDirectTransfer;
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
        const selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer;

        if (selectedBioDirectTransfer !== null) {
            if (selectedBioDirectTransfer.ntransactionstatus === transactionStatus.DRAFT
                || selectedBioDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioDirectTransferCode = selectedBioDirectTransfer?.nbiodirecttransfercode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;

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
        rsapi().post("biodirecttransfer/cancelDirectTransfer", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioDirectTransfer = this.props.Login.masterData?.lstBioDirectTransfer;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioDirectTransfer.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode) : -1;

                if (index !== -1) {
                    lstBioDirectTransfer[index] = responseData.selectedBioDirectTransfer;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioDirectTransfer;
                }

                masterData['lstBioDirectTransfer'] = lstBioDirectTransfer;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, loadEsignStateHandle: false, openModal: false, isGridClear: !(this.props?.Login?.isGridClear)
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
        this.validateEsignforDirectTransfer(inputParam, modalName);
    }

    validateEsignforDirectTransfer = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "update"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.editDirectTransferRecord(inputParam["screenData"]["inputParam"]["inputData"]);
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
        let openDirectTransfer = this.props.Login.openDirectTransfer;
        let openValidateSlideOut = this.props.Login.openValidateSlideOut;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openDirectTransfer = (screenName === "IDS_TRANSFERFORM" && operation === "update") ? true : false;
            openModal = (screenName === "IDS_TRANSFERFORM" && (operation === "update" || operation === "validate")) ? true : false;
            openValidateSlideOut = (screenName === "IDS_TRANSFERFORM" && operation === "validate") ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioDirectTransfer: this.props.Login.selectedRecord?.addedChildBioDirectTransfer || []
            };
            openDirectTransfer = false;
            openValidateSlideOut = false;
            viewFormDetails = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openDirectTransfer,
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

    onViewFormDetails = () => {
        const selectedBioDirectTransfer = this.props.Login.masterData?.selectedBioDirectTransfer;
        if (selectedBioDirectTransfer !== null) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal: true,
                    viewFormDetails: true,
                    operation: 'view', screenName: 'IDS_FORMVALIDATIONDETAILS'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORDTOVIEW" }));
            this.setState({ loading: false });
        }
    }

}

export default connect(mapStateToProps, {
    updateStore, filterTransactionList, generateControlBasedReport
})(injectIntl(DirectTransfer));