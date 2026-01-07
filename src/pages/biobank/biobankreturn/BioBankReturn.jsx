import { faArrowsAltH, faCheckSquare, faEye, faPlus, faTimes, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
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
import ValidateDirectTransfer from '../directtransfer/ValidateDirectTransfer';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import AddBioBankReturn from './AddBioBankReturn';
import BioBankReturnFilter from './BioBankReturnFilter';
import OuterGridBioBankReturn from './OuterGridBioBankReturn';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class BioBankReturn extends React.Component {
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
        if (this.props.Login.openModal && this.props.Login.openBankReturn && nextState.isInitialRender === false &&
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
        if (this.props.Login.masterData && this.props.Login.masterData.realSelectedFormType) {
            breadCrumbData.push(
                {
                    "label": "IDS_FORMTYPE",
                    "value": this.props.Login.masterData.realSelectedFormType ? this.props.Login.masterData.realSelectedFormType.label : '-'
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

        this.searchFieldList = ["sbankreturnformnumber", "soriginsitename", "sreturndate", "stransdisplaystatus"]
        const filterParam = {
            inputListName: "lstBioBankReturn", selectedObject: "lstChildBioBankReturn", primaryKeyField: "nbiobankreturncode",
            fetchUrl: "biobankreturn/getActiveBioBankReturn", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioBankReturn",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioBankReturn',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "soriginsitename" },
            { [designProperties.VALUE]: "sreturndate" },
        ];

        const addID = this.state.controlMap.has("AddBioBankReturnForm") && this.state.controlMap.get("AddBioBankReturnForm").ncontrolcode;
        const editID = this.state.controlMap.has("EditBioBankReturnForm") && this.state.controlMap.get("EditBioBankReturnForm").ncontrolcode;
        const validateID = this.state.controlMap.has("ValidateBioBankReturnForm") && this.state.controlMap.get("ValidateBioBankReturnForm").ncontrolcode;
        const cancelID = this.state.controlMap.has("CancelBioBankReturnForm") && this.state.controlMap.get("CancelBioBankReturnForm").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewBioBankReturnForm") && this.state.controlMap.get("ViewBioBankReturnForm").ncontrolcode;
        const returnID = this.state.controlMap.has("ReturnBioBankReturnForm") && this.state.controlMap.get("ReturnBioBankReturnForm").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildBioBankReturnForm") && this.state.controlMap.get("AddChildBioBankReturnForm").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildBioBankReturnForm") && this.state.controlMap.get("DeleteChildBioBankReturnForm").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleBioBankReturn") && this.state.controlMap.get("ValidateSampleBioBankReturn").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildBioBankReturnForm") && this.state.controlMap.get("DisposeChildBioBankReturnForm").ncontrolcode;
        const storeID = this.state.controlMap.has("StoreBioBankReturn") && this.state.controlMap.get("StoreBioBankReturn").ncontrolcode;
        const undoID = this.state.controlMap.has("UndoBioBankReturn") && this.state.controlMap.get("UndoBioBankReturn").ncontrolcode;
        const reportID = this.state.controlMap.has("BGSIReturnReport") && this.state.controlMap.get("BGSIReturnReport").ncontrolcode;

        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "100px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "100px" },
                { "idsName": "IDS_RECEIVEDVOLUMEµL", "dataField": "svolume", "width": "100px" }
            ];

        let selectedBioBankReturn = this.props.Login.masterData && this.props.Login.masterData.selectedBioBankReturn || {};

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
                                <Splitter  panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal">
                                    <SplitterPane size="30%" min="25%">
                                   
                                            <TransactionListMasterJsonView
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={false}
                                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioBankReturn || []}
                                                selectedMaster={[this.props.Login.masterData.selectedBioBankReturn] || []}
                                                primaryKeyField="nbiobankreturncode"
                                                getMasterDetail={(Sample, status) =>
                                                    this.getBankReturn(
                                                        {
                                                            masterData: this.props.Login.masterData,
                                                            userinfo: this.props.Login.userInfo,
                                                            ...Sample
                                                        }, status
                                                    )}
                                                subFieldsLabel={false}
                                                additionalParam={['']}
                                                mainField={'sbankreturnformnumber'}
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
                                                        objectName: "editBankReturn",
                                                        hidden: this.state.userRoleControlRights.indexOf(editID) === -1,
                                                        onClick: this.editBankReturn,
                                                        inputData: {
                                                            primaryKeyName: "nbiobankreturncode",
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
                                                                onClick={() => this.addBankReturn(addID, 'create', 'IDS_RETURNFORM')} >
                                                                <FontAwesomeIcon icon={faPlus} />
                                                            </Nav.Link>

                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onValidate(validateID, 'validate', 'IDS_RETURNFORM')}
                                                                hidden={this.state.userRoleControlRights.indexOf(validateID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATION" })}>
                                                                <FontAwesomeIcon icon={faCheckSquare} />
                                                            </Button>

                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReturnEsignCheck(returnID, 'transfer', 'IDS_RETURNSAMPLES')}
                                                                hidden={this.state.userRoleControlRights.indexOf(returnID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMRETURN" })}>
                                                                <FontAwesomeIcon icon={faArrowsAltH} />
                                                            </Button>

                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onCancelEsignCheck(cancelID, 'cancel', 'IDS_RETURNFORM')}
                                                                hidden={this.state.userRoleControlRights.indexOf(cancelID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMCANCEL" })}>
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </Button>

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

                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.props.generateControlBasedReport(reportID, {
                                                                    ...this.props.Login.masterData?.selectedBioBankReturn,
                                                                    nusercode: this.props.Login.userInfo?.nusercode
                                                                }, this.props.Login, "nbiobankreturncode", this.props.Login?.masterData?.selectedBioBankReturn?.nbiobankreturncode)}
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
                                                            <BioBankReturnFilter
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
                                    <SplitterPane size="70%" min="10%">
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
                                                                <OuterGridBioBankReturn
                                                                    controlMap={this.state.controlMap}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                    dataState={this.state.dataState}
                                                                    selectedRecord={this.state.selectedRecord || {}}
                                                                    operation={this.props.Login.operation}
                                                                    childDataChange={this.childDataChange}
                                                                    lstChildBioBankReturn={this.props.Login.masterData.lstChildBioBankReturn || []}
                                                                    addChildID={addChildID}
                                                                    acceptRejectID={acceptRejectID}
                                                                    deleteChildID={deleteChildID}
                                                                    disposeID={disposeID}
                                                                    lstBioBankReturn={this.props.Login.masterData.lstBioBankReturn}
                                                                    selectedBioBankReturn={this.props.Login.masterData.selectedBioBankReturn}
                                                                    validateReturnQuantities={this.validateReturnQuantities}
                                                                    storeID={storeID}
                                                                    undoID={undoID}
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
                        hideSave={this.props.Login.viewFormDetails ? true : false}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false :
                            this.props.Login.openBankReturn ? true : false}
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
                            : this.props.Login.openBankReturn ?
                                <AddBioBankReturn
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.childDataChange}
                                    bioBankSiteDisable={this.props.Login.bioBankSiteDisable}
                                    lstFormNumberDetails={this.props.Login.masterData.lstFormNumberDetails || []}
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
                                        sformnumber={this.props.Login.masterData?.selectedBioBankReturn?.sbankreturnformnumber}
                                    />
                                    :
                                    this.props.Login.viewFormDetails ?
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_FORMNUMBER"
                                                                        message="Bank Return Form Number"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.sbankreturnformnumber
                                                                                ? selectedBioBankReturn.sbankreturnformnumber
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.sstorageconditionname
                                                                                ? selectedBioBankReturn.sstorageconditionname
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.sdeliverydate
                                                                                ? selectedBioBankReturn.sdeliverydate
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.sdispatchername
                                                                                ? selectedBioBankReturn.sdispatchername
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.scouriername
                                                                                ? selectedBioBankReturn.scouriername
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.scourierno
                                                                                ? selectedBioBankReturn.scourierno
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.striplepackage
                                                                                ? selectedBioBankReturn.striplepackage
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
                                                                        selectedBioBankReturn ?
                                                                            selectedBioBankReturn.svalidationremarks
                                                                                ? selectedBioBankReturn.svalidationremarks
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
            selectedRecord: {},
            selectedChildRecord: {},
            selectedViewRecord: {},
            loadEsignStateHandle: undefined,
            openModalShow: undefined,
            openAcceptRejectBankReturn: undefined,
            lstSampleCondition: [],
            lstReason: [],
            selectedFreezerRecord: undefined,
            initialSelectedFreezerRecord: undefined,
            shouldRender: undefined,
            masterData: [],
            inputParam: undefined
            }
        }
        this.props.updateStore(updateInfo);
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
        const nformTypeCode = this.state.selectedFilterRecord?.nformtypecode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate,
            selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode,
            selectedFormType: nformTypeCode, realSelectedFormType: nformTypeCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            nformTypeCode: nformTypeCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("biobankreturn/getBioBankReturn", { ...inputData })
            .then(response => {
                let masterData = {};
                masterData = { ...masterDataUpdated, ...response.data };
                masterData["fromDate"] = this.state.selectedFilterRecord.fromDate;
                masterData["toDate"] = this.state.selectedFilterRecord.toDate;
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

        rsapi().post("biobankreturn/getBioBankReturn", inputData)
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
            this.props.Login.openBankReturn ? (this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_FORMNUMBER", "dataField": "nbioformacceptancecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_ORIGINSITE", "dataField": "noriginsitecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
                    { "idsName": "IDS_RETURNDATE", "dataField": "dreturndate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" }
                ] :
                this.props.Login.operation === 'update' ?
                    [
                        { "idsName": "IDS_RETURNDATE", "dataField": "dreturndate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" }
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
            this.props.Login.openBankReturn ? this.onSaveClick : this.props.Login.openValidateSlideOut ?
                this.onValidateEsignCheck : "", this.props.Login.loadEsignStateHandle, saveType);
    }

    addBankReturn = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });
            rsapi().post("biobankreturn/getFormNumberDetails", { 'userinfo': this.props.Login.userInfo })
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response.data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true,
                            openBankReturn: true, bioBankSiteDisable: false
                        }
                    }
                    this.props.updateStore(updateInfo);
                    this.setState({ loading: false });
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
        }
    }

    onSaveClick = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        let userInfo = this.props.Login.userInfo;
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["saveType"] = saveType;

        if (operation === "create") {
            inputData["bioBankReturn"] = {
                "nbioformacceptancecode": selectedRecord?.nbioformacceptancecode?.value || -1,
                "ntransfertypecode": selectedRecord?.nbioformacceptancecode?.item?.ntransfertypecode || -1,
                "sparentsamplecode": selectedRecord?.nbioparentsamplecode?.item?.sparentsamplecode || '',
                "ncohortno": selectedRecord?.nbioparentsamplecode?.item?.ncohortno || -1,
                "nformtypecode": selectedRecord?.nbioformacceptancecode?.item?.nformtypecode || -1,
                "noriginsitecode": selectedRecord?.noriginsitecode?.value || -1,
                "soriginsitename": selectedRecord?.noriginsitecode?.label || '',
                "sreturndate": selectedRecord.dreturndate && selectedRecord.dreturndate !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.dreturndate, this.props.Login.userInfo) : '',
                "sremarks": selectedRecord?.sremarks || '',
            };
            let lstFormAcceptanceDetails = selectedRecord.lstFormAcceptanceDetails && selectedRecord.lstFormAcceptanceDetails || [];
            let validationQuantity = this.validateReturnQuantities(lstFormAcceptanceDetails, userInfo);

            if (validationQuantity.rtnValue === "Success") {
                inputData["filterSelectedSamples"] = lstFormAcceptanceDetails && lstFormAcceptanceDetails || [];
                inputData["nprimaryKeyBioBankReturn"] = selectedRecord.nprimaryKeyBioBankReturn || -1;
                if (lstFormAcceptanceDetails && lstFormAcceptanceDetails.length > 0) {
                    this.setState({ loading: true });
                    rsapi().post("biobankreturn/createBioBankReturn", { ...inputData })
                        .then(response => {
                            let masterData = {};
                            masterData = { ...this.props.Login.masterData, ...response.data };
                            let openModal = false;
                            let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                            let openBankReturn = false;
                            if (saveType === 2) {
                                openModal = true;
                                openBankReturn = true;
                                selectedRecord['nbioformacceptancecode'] = '';
                                selectedRecord['lstGetSampleReceivingDetails'] = [];
                                selectedRecord['addSelectAll'] = false;
                                selectedRecord['addedSampleReceivingDetails'] = [];
                                selectedRecord['lstFormAcceptanceDetails'] = [];
                                selectedRecord['nprimaryKeyBioBankReturn'] = response.data?.nprimaryKeyBioBankReturn || -1;
                                bioBankSiteDisable = true;
                            } else {
                                selectedRecord = {};
                                bioBankSiteDisable = false;
                            }

                            this.searchRef.current.value = "";
                            delete masterData["searchedData"];

                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: {
                                    masterData, openModal, openBankReturn, selectedRecord, bioBankSiteDisable,
                                    isGridClear: !(this.props?.Login?.isGridClear)
                                }
                            }
                            this.props.updateStore(updateInfo);
                            this.setState({ loading: false });
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
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_NOSAMPLESAVAILABLETORETURN" }));
                    this.setState({ loading: false });
                }
            } else {
                toast.warn(validationQuantity.idsName);
                this.setState({ loading: false });
            }

        } else if (operation === "update") {
            inputData['nbiobankreturncode'] = selectedRecord?.noriginsitecode?.item?.nbiobankreturncode;
            inputData['sreturndate'] = selectedRecord.dreturndate && selectedRecord.dreturndate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.dreturndate, this.props.Login.userInfo) : '';
            inputData['sremarks'] = selectedRecord?.sremarks;
            let inputParam = {
                inputData: inputData,
                screenName: "IDS_RETURNFORM",
                operation: "update"
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_RETURNFORM"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.editBankReturnRecord(inputData);
            }
        }
    }

    validateReturnQuantities = (lstFormAcceptanceDetails, userInfo) => {
        let emptyReturnQtyIds = [];
        let invalidReturnQtyIds = [];

        const convertKey = userInfo['sdecimaloperator'] || ".";

        function parseLocalizedNumber(value, convertKey) {
            if (typeof value !== "string") return NaN;
            return parseFloat(value.replace(convertKey, "."));
        }

        lstFormAcceptanceDetails.forEach(x => {
            const repositoryId = x.srepositoryid;

            // Check if return quantity is empty
            if (!x.hasOwnProperty("sreturnvolume") || x.sreturnvolume === "" || x.sreturnvolume === null) {
                emptyReturnQtyIds.push(repositoryId);
                return;
            }

            // Normalize quantities
            const sreturnvolume = parseLocalizedNumber(x.sreturnvolume, convertKey);
            const svolume = parseLocalizedNumber(x.svolume, convertKey);

            // Check if return quantity exceeds available quantity
            if (!isNaN(sreturnvolume) && !isNaN(svolume) && sreturnvolume > svolume) {
                invalidReturnQtyIds.push(repositoryId);
            }
        });

        let returnObj = {};

        if (emptyReturnQtyIds.length > 0) {
            returnObj = {
                "idsName": this.props.intl.formatMessage({ id: "IDS_ENTERRETURNVOLUMETOADD" }),
                "rtnValue": "Failed"
            };
        } else if (invalidReturnQtyIds.length > 0) {
            returnObj = {
                "idsName": this.props.intl.formatMessage({ id: "IDS_RETURNVOLUMESHOULDBELESSERTHANVOLUMEFOR" }) + " " + invalidReturnQtyIds.join(", "),
                "rtnValue": "Failed"
            };
        } else {
            returnObj = {
                "rtnValue": "Success"
            };
        }

        return returnObj;
    }

    editBankReturnRecord = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biobankreturn/updateBioBankReturn", { ...inputData })
            .then(response => {
                let masterData = {};
                let openModal = false;
                let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                let openBankReturn = false;

                let searchedData = this.props.Login.masterData?.searchedData;

                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiobankreturncode === response.data.selectedBioBankReturn.nbiobankreturncode) : -1;

                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = response.data.selectedBioBankReturn;
                }

                masterData['searchedData'] = searchedData;
                masterData = { ...this.props.Login.masterData, ...response.data };

                let selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChildBioBankReturn: this.props.Login.selectedRecord?.addedChildBioBankReturn || []
                };
                bioBankSiteDisable = false;
                selectedRecord['nprimaryKeyBioBankReturn'] = response.data?.nprimaryKeyBioBankReturn || -1;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openBankReturn, selectedRecord, bioBankSiteDisable, loadEsignStateHandle: false,
                        isGridClear: !(this.props?.Login?.isGridClear)
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
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
    }

    getBankReturn(inputParam) {
        this.setState({ loading: true });
        rsapi().post("biobankreturn/getActiveBioBankReturn", {
            'userinfo': inputParam.userinfo,
            'nbiobankreturncode': inputParam.nbiobankreturncode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChildBioBankReturn'] = [];
                selectedRecord['addSelectAll'] = false;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, selectedRecord, selectedChildRecord: {},
                        dataState: {
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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
                this.setState({ loading: false });
            })
    }

    editBankReturn = (inputParam) => {
        if (inputParam?.editBankReturn.ntransactionstatus === transactionStatus.DRAFT
            || inputParam?.editBankReturn.ntransactionstatus === transactionStatus.VALIDATION) {
            let inputData = {
                'nbiobankreturncode': inputParam?.editBankReturn?.nbiobankreturncode,
                'userinfo': this.props.Login.userInfo
            };
            this.setState({ loading: true });
            rsapi().post("biobankreturn/getActiveBioBankReturnById", { ...inputData })
                .then(response => {
                    let selectedChildBankReturn = response.data?.selectedChildBankReturn;
                    let selectedRecord = this.state.selectedRecord;
                    selectedRecord['nbioformacceptancecode'] = {
                        label: selectedChildBankReturn.sformnumber,
                        value: selectedChildBankReturn.nbioformacceptancecode,
                        item: selectedChildBankReturn
                    };
                    selectedRecord['nbiobankreturncode'] = {
                        label: selectedChildBankReturn.sbankreturnformnumber,
                        value: selectedChildBankReturn.nbiobankreturncode,
                        item: selectedChildBankReturn
                    };
                    selectedRecord['noriginsitecode'] = {
                        label: selectedChildBankReturn.soriginsitename,
                        value: selectedChildBankReturn.noriginsitecode,
                        item: selectedChildBankReturn
                    };
                    selectedRecord['dreturndate'] = rearrangeDateFormat(this.props.Login.userInfo,
                        selectedChildBankReturn?.sreturndate);
                    selectedRecord['sremarks'] = selectedChildBankReturn.sremarks || '';
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation: inputParam.operation,
                            selectedRecord,
                            openModal: true,
                            openBankReturn: true,
                            bioBankSiteDisable: true,
                            ncontrolCode: inputParam.controlCode,
                            screenName: "IDS_RETURNFORM"
                        }
                    }
                    this.props.updateStore(updateInfo);
                    this.setState({ loading: false });
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openBankReturn = this.props.Login.openBankReturn;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let openValidateSlideOut = this.props.Login.openValidateSlideOut;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openBankReturn = (screenName === "IDS_RETURNFORM" && operation === "update") ? true : false;
            openModal = (screenName === "IDS_RETURNFORM" && (operation === "update" || operation === "validate")) ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioBankReturn: this.props.Login.selectedRecord?.addedChildBioBankReturn || []
            };
            openBankReturn = false;
            viewFormDetails = false;
            openValidateSlideOut = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openBankReturn,
                loadEsignStateHandle,
                viewFormDetails,
                openValidateSlideOut
            }
        }
        this.props.updateStore(updateInfo);
    }

    onValidate = (validateID, operation, screenName) => {
        let selectedBioBankReturn = this.props.Login.masterData?.selectedBioBankReturn;
        if (selectedBioBankReturn !== null) {
            this.setState({ loading: true });
            rsapi().post("biobankreturn/getValidateFormDetails", {
                'nbiobankreturncode': selectedBioBankReturn.nbiobankreturncode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response.data };
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
        const nbioBankReturnCode = this.props.Login.masterData?.selectedBioBankReturn?.nbiobankreturncode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiobankreturncode"] = nbioBankReturnCode;

        inputData["bioBankReturn"] = {
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
            screenName: "IDS_RETURNFORM",
            operation: "validate"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_RETURNFORM"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onValidateClick(inputData);
        }
    }

    onValidateClick = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biobankreturn/createValidationBioBankReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioBankReturn = this.props.Login.masterData?.lstBioBankReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioBankReturn.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode) : -1;

                if (index !== -1) {
                    lstBioBankReturn[index] = responseData.selectedBioBankReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioBankReturn;
                }

                masterData['lstBioBankReturn'] = lstBioBankReturn;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openValidateSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioBankReturn'] = [];
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
    }

    onReturnEsignCheck = (transferID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioBankReturn = this.props.Login.masterData?.selectedBioBankReturn;

        if (selectedBioBankReturn !== null) {
            if (selectedBioBankReturn.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioBankReturnCode = selectedBioBankReturn?.nbiobankreturncode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiobankreturncode"] = nbioBankReturnCode;
                inputData["ncontrolcode"] = transferID;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_RETURNSAMPLES",
                    operation: "return"
                }

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, transferID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_RETURNSAMPLES", operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onReturn(inputData);
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

    onReturn = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biobankreturn/returnBankReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioBankReturn = this.props.Login.masterData?.lstBioBankReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioBankReturn.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode) : -1;

                if (index !== -1) {
                    lstBioBankReturn[index] = responseData.selectedBioBankReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioBankReturn;
                }

                masterData['lstBioBankReturn'] = lstBioBankReturn;
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
    }

    onCancelEsignCheck = (cancelID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioBankReturn = this.props.Login.masterData?.selectedBioBankReturn;

        if (selectedBioBankReturn !== null) {
            if (selectedBioBankReturn.ntransactionstatus === transactionStatus.DRAFT
                || selectedBioBankReturn.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioBankReturnCode = selectedBioBankReturn?.nbiobankreturncode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiobankreturncode"] = nbioBankReturnCode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_RETURNFORM",
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
        rsapi().post("biobankreturn/cancelBankReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioBankReturn = this.props.Login.masterData?.lstBioBankReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioBankReturn.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiobankreturncode === responseData.selectedBioBankReturn.nbiobankreturncode) : -1;

                if (index !== -1) {
                    lstBioBankReturn[index] = responseData.selectedBioBankReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioBankReturn;
                }

                masterData['lstBioBankReturn'] = lstBioBankReturn;
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
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    onViewFormDetails = (viewID, operation, screenName) => {
        const selectedBioBankReturn = this.props.Login.masterData?.selectedBioBankReturn;
        if (selectedBioBankReturn !== null) {
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
        this.validateEsignforBankReturn(inputParam, modalName);
    }

    validateEsignforBankReturn = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "validate"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNFORM") {
                        this.onValidateClick(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "return"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNSAMPLES") {
                        this.onReturn(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "cancel"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNFORM") {
                        this.onCancel(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "update"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNFORM") {
                        this.editBankReturnRecord(inputParam["screenData"]["inputParam"]["inputData"]);
                    }
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
                }
                else {
                    toast.info(error.response.data);
                }
            })
    }
}

export default connect(mapStateToProps, {
    updateStore, filterTransactionList, generateControlBasedReport
})(injectIntl(BioBankReturn));