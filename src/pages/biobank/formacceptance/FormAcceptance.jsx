import { faArrowDown, faCheckCircle, faCheckSquare, faEye, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button, Card, Col, Row, FormLabel, FormGroup } from 'react-bootstrap';
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
import CompleteFormAcceptance from './CompleteFormAcceptance';
import FormAcceptanceFilter from './FormAcceptanceFilter';
import OuterGridFormAcceptance from './OuterGridFormAcceptance';
import ReceiveFormAcceptance from './ReceiveFormAcceptance';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class FormAcceptance extends React.Component {
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
            fields: {},
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

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "soriginsitename" },
            { [designProperties.VALUE]: "sreceiveddate" },
        ];

        this.searchFieldList = ["sformnumber", "soriginsitename", "sreceiveddate", "stransdisplaystatus"]
        const filterParam = {
            inputListName: "lstBioFormAcceptance", selectedObject: "lstChildBioFormAcceptance", primaryKeyField: "nbioformacceptancecode",
            fetchUrl: "formacceptance/getActiveBioFormAcceptance", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioFormAcceptance",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioFormAcceptance',
            skip: 0, take: this.state.take
        };

        const validateID = this.state.controlMap.has("ValidateFormAcceptance") && this.state.controlMap.get("ValidateFormAcceptance").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildFormTransfer") && this.state.controlMap.get("AddChildFormTransfer").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildFormTransfer") && this.state.controlMap.get("DeleteChildFormTransfer").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleFormAcceptance") && this.state.controlMap.get("ValidateSampleFormAcceptance").ncontrolcode;
        const moveToDisposeID = this.state.controlMap.has("MoveToDisposeFormAcceptance") && this.state.controlMap.get("MoveToDisposeFormAcceptance").ncontrolcode;
        const moveToReturnID = this.state.controlMap.has("MoveToReturnFormAcceptance") && this.state.controlMap.get("MoveToReturnFormAcceptance").ncontrolcode;
        const undoID = this.state.controlMap.has("UndoFormAcceptance") && this.state.controlMap.get("UndoFormAcceptance").ncontrolcode;
        const storeID = this.state.controlMap.has("StoreFormAcceptance") && this.state.controlMap.get("StoreFormAcceptance").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildFormTransfer") && this.state.controlMap.get("DisposeChildFormTransfer").ncontrolcode;
        const receiveID = this.state.controlMap.has("ReceiveFormAcceptance") && this.state.controlMap.get("ReceiveFormAcceptance").ncontrolcode;
        const completeID = this.state.controlMap.has("CompleteFormAcceptance") && this.state.controlMap.get("CompleteFormAcceptance").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewFormAcceptance") && this.state.controlMap.get("ViewFormAcceptance").ncontrolcode;
        const reportID = this.state.controlMap.has("FormAcceptanceReport") && this.state.controlMap.get("FormAcceptanceReport").ncontrolcode;
        const moveToReturnaftercompleteID = this.state.controlMap.has("MoveToReturnAfterCompleteFormAcceptance") && this.state.controlMap.get("MoveToReturnAfterCompleteFormAcceptance").ncontrolcode;


        let selectedBioFormAcceptance = this.props.Login.masterData?.selectedBioFormAcceptance || {};

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
                                   
                                    <Splitter panes={this.state.panes} onChange={this.onSplitterChange} className='layout-splitter' orientation="horizontal">
                                        <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioFormAcceptance || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioFormAcceptance] || []}
                                        primaryKeyField="nbioformacceptancecode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getFormAcceptance(
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
                                        ]}
                                        commonActions={
                                            <>
                                                <ProductList className="d-flex product-category float-right">

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onReceive(receiveID, 'receive', 'IDS_FORMACCEPTANCE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(receiveID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMRECEIVE" })}>
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onValidateEsignCheck(validateID, 'validate', 'IDS_FORMACCEPTANCE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(validateID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATION" })}>
                                                        <FontAwesomeIcon icon={faCheckSquare} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onComplete(completeID, 'complete', 'IDS_FORMACCEPTANCE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(completeID) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMCOMPLETE" })}>
                                                        <FontAwesomeIcon icon={faCheckCircle} />
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
                                                            ...this.props.Login.masterData?.selectedBioFormAcceptance,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbioformacceptancecode", this.props.Login?.masterData?.selectedBioFormAcceptance?.nbioformacceptancecode)}
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
                                                    <FormAcceptanceFilter
                                                        fromDate={this.fromDate}
                                                        toDate={this.toDate}
                                                        userInfo={this.props.Login.userInfo}
                                                        lstFilterStatus={this.props.Login.masterData?.lstFilterStatus || []}
                                                        selectedFilterStatus={this.props.Login.masterData?.selectedFilterStatus || {}}
                                                        lstFormType={this.props.Login.masterData?.lstFormType || []}
                                                        selectedFormType={this.props.Login.masterData?.selectedFormType || {}}
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
                                                            <OuterGridFormAcceptance
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                dataState={this.state.dataState}
                                                                selectedRecord={this.props.Login.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioFormAcceptance={this.props.Login.masterData.lstChildBioFormAcceptance || []}
                                                                addChildID={addChildID}
                                                                acceptRejectID={acceptRejectID}
                                                                deleteChildID={deleteChildID}
                                                                disposeID={disposeID}
                                                                moveToDisposeID={moveToDisposeID}
                                                                moveToReturnID={moveToReturnID}
                                                                undoID={undoID}
                                                                storeID={storeID}
                                                                moveToReturnaftercompleteID={moveToReturnaftercompleteID}
                                                                lstBioFormAcceptance={this.props.Login.masterData.lstBioFormAcceptance}
                                                                selectedBioFormAcceptance={this.props.Login.masterData.selectedBioFormAcceptance}
                                                                realSelectedFormType={this.props.Login.masterData && this.props.Login.masterData.realSelectedFormType}
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
                                    showSaveContinue={false}
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
                                        :
                                        this.props.Login.openReceiveSlideOut ?
                                            <ReceiveFormAcceptance
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                                                lstUsers={this.props.Login.masterData.lstUsers || []}
                                                lstCourier={this.props.Login.masterData.lstCourier || []}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                operation={this.props.Login.operation}
                                                childDataChange={this.childDataChange}
                                                sformnumber={this.props.Login.masterData?.receiveFormAcceptanceDetails?.sformnumber || ""}
                                                soriginsitename={this.props.Login.masterData?.receiveFormAcceptanceDetails?.soriginsitename || ""}
                                                ddeliverydate={this.props.Login.masterData?.receiveFormAcceptanceDetails?.ddeliverydate || new Date()}
                                                scouriername={this.props.Login.masterData?.receiveFormAcceptanceDetails?.scouriername || ""}
                                                scourierno={this.props.Login.masterData?.receiveFormAcceptanceDetails?.scourierno || ""}
                                                sremarks={this.props.Login.masterData?.receiveFormAcceptanceDetails?.sremarks || ""}
                                                svalidationremarks={this.props.Login.masterData?.receiveFormAcceptanceDetails?.svalidationremarks || ""}
                                            />
                                            :
                                            this.props.Login.openCompleteSlideOut ?
                                                <CompleteFormAcceptance
                                                    controlMap={this.state.controlMap}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                                                    lstUsers={this.props.Login.masterData.lstUsers || []}
                                                    lstCourier={this.props.Login.masterData.lstCourier || []}
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    operation={this.props.Login.operation}
                                                    childDataChange={this.childDataChange}
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.sformnumber
                                                                                            ? selectedBioFormAcceptance.sformnumber
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_SENDERBIOBANK"
                                                                                    message="Sender Bio Bank"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.soriginsitename
                                                                                            ? selectedBioFormAcceptance.soriginsitename
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.sdeliverydate
                                                                                            ? selectedBioFormAcceptance.sdeliverydate
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.scouriername
                                                                                            ? selectedBioFormAcceptance.scouriername
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.scourierno
                                                                                            ? selectedBioFormAcceptance.scourierno
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_RECIPIENTNAME"
                                                                                    message="Recipient Name"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.srecipientname
                                                                                            ? selectedBioFormAcceptance.srecipientname
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_RECEIVEDDATE"  // modified by sujatha to omit time in the received date
                                                                                    message="Receive Date"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.sreceiveddate
                                                                                            ? selectedBioFormAcceptance.sreceiveddate
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.stransdisplaystatus
                                                                                            ? selectedBioFormAcceptance.stransdisplaystatus
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_RECEIVINGTEMPERATURE"
                                                                                    message="Receiving Temperature"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.sreceivingtemperaturename
                                                                                            ? selectedBioFormAcceptance.sreceivingtemperaturename
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_RECEIVINGOFFICER"
                                                                                    message="Receiving Officer"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        (selectedBioFormAcceptance.sreceivingofficername && selectedBioFormAcceptance.sreceivingofficername !== " ")
                                                                                            ? selectedBioFormAcceptance.sreceivingofficername
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
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.svalidationremarks
                                                                                            ? selectedBioFormAcceptance.svalidationremarks
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_COMPLETIONREMARKS"
                                                                                    message="Completion Remarks"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioFormAcceptance ?
                                                                                        selectedBioFormAcceptance.scompletionremarks
                                                                                            ? selectedBioFormAcceptance.scompletionremarks
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
                        </Col>
                    </Row>
                </ListWrapper>
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
                skip: 0,
                take: take,
            }
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
            openAcceptRejectFormAcceptance: undefined,
            lstSampleCondition: [],
            lstReason: [],
            lstChildBioFormAcceptance: [],
            selectedFreezerRecord: undefined,
            initialSelectedFreezerRecord: undefined,
            shouldRender: undefined,
            masterData: [],
            inputParam: undefined
        }
    };
    this.props.updateStore(updateInfo);
}


    openFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: true, filterSubmitValueEmpty: true }
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

    childFilterDataChange = (selectedFilterRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedFilterRecord: {
                ...selectedFilterRecord
            },
            isInitialRender
        });
    }

    onFilterSubmit = () => {
        const realFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate);
        const realToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate);
        const ntransCode = this.state.selectedFilterRecord?.ntranscode || -1;
        const nformTypeCode = this.state.selectedFilterRecord?.nformtypecode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate,
            selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode,
            selectedFormType: nformTypeCode, realSelectedFormType: nformTypeCode,
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
        rsapi().post("formacceptance/getFormAcceptance", { ...inputData })
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
                        masterData, filterSubmitValueEmpty: false, showFilter: false
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

    onReload = () => {

        const { masterData, userInfo } = this.props.Login;
        // const obj = convertDateValuetoString(masterData.realFromDate, masterData.realToDate, userInfo);
        // const realFromDate = obj.fromDate;
        // const realToDate = obj.toDate;
        // const ntransCode = masterData.realSelectedFilterStatus || -1;


        const obj = convertDateValuetoString(masterData.realFromDate, masterData.realToDate, userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = masterData.realSelectedFilterStatus || -1;
        const nformTypeCode = masterData.realSelectedFormType || -1;

        let inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            nformTypeCode: nformTypeCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("formacceptance/getFormAcceptance", { ...inputData })
            .then(response => {
                const masterDataUpdated = { ...masterData, ...response.data };
                delete masterDataUpdated["searchedData"];

                // let masterData = {};
                // masterData = { ...this.props.Login.masterData, ...response.data };
                // this.searchRef.current.value = "";
                // delete masterData["searchedData"];

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
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: {
                //         masterData: masterDataUpdated,
                //         selectedRecord: {},       // Redux holds empty selection
                //         selectedChildRecord: {},
                //         dataState: {
                //             take: this.state.dataState.take,
                //             filter: null,
                //             skip: 0,
                //             sort: []
                //         },
                //         showFilter: false,
                //         filterSubmitValueEmpty: false
                //     }
                // }
                // this.props.updateStore(updateInfo);

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
    }

    getFormAcceptance(inputParam) {
        this.setState({ loading: true });
        rsapi().post("formacceptance/getActiveBioFormAcceptance", {
            'userinfo': inputParam.userinfo,
            'nbioformacceptancecode': inputParam.nbioformacceptancecode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChildBioFormAcceptance'] = [];
                selectedRecord['addSelectAll'] = false;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, selectedRecord, selectedChildRecord: {},
                        dataState: {
                            take: this.state.dataState.take,
                            filter: null,
                            skip: 0,
                            sort: []
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

    childDataChange = (selectedRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedRecord: {
                ...selectedRecord
            },
            isInitialRender
        });
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    onReceive = (receiveID, operation, screenName) => {
        let selectedBioFormAcceptance = this.props.Login.masterData?.selectedBioFormAcceptance;
        if (selectedBioFormAcceptance !== null) {
            let masterDataUpdated = this.props.Login.masterData;
            this.setState({ loading: true });
            rsapi().post("formacceptance/findStatusFormAcceptance", {
                'nbioformacceptancecode': selectedBioFormAcceptance.nbioformacceptancecode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    if (response.data === transactionStatus.DRAFT) {
                        rsapi().post("formacceptance/getReceiveFormAcceptanceDetails", {
                            'nbioformacceptancecode': selectedBioFormAcceptance.nbioformacceptancecode,
                            'userinfo': this.props.Login.userInfo
                        })
                            .then(response => {
                                let masterData = { ...masterDataUpdated };
                                const ddeliverydate = rearrangeDateFormat(this.props.Login.userInfo,
                                    response.data?.sdeliverydate);
                                masterData["receiveFormAcceptanceDetails"] = response.data;
                                masterData["receiveFormAcceptanceDetails"]["ddeliverydate"] = ddeliverydate;
                                const updateInfo = {
                                    typeName: DEFAULT_RETURN,
                                    data: {
                                        masterData, screenName, operation, openModal: true, openReceiveSlideOut: true,
                                        bioBankSiteDisable: false, ncontrolCode: receiveID
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

    onComplete = (completeID, operation, screenName) => {
        let selectedBioFormAcceptance = this.props.Login.masterData?.selectedBioFormAcceptance;
        if (selectedBioFormAcceptance !== null) {
            this.setState({ loading: true });
            rsapi().post("formacceptance/onCompleteSlideOut", {
                'nbioformacceptancecode': selectedBioFormAcceptance.nbioformacceptancecode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response.data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true, openCompleteSlideOut: true,
                            bioBankSiteDisable: false, ncontrolCode: completeID
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }

    }

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openReceiveSlideOut = this.props.Login.openReceiveSlideOut;
        let openCompleteSlideOut = this.props.Login.openCompleteSlideOut;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModal = (screenName === "IDS_FORMACCEPTANCE" && (operation === "update" || operation === "receive")) ? true : false;
            openReceiveSlideOut = (screenName === "IDS_FORMACCEPTANCE" && operation === "receive") ? true : false;
            openCompleteSlideOut = (screenName === "IDS_FORMACCEPTANCE" && operation === "complete") ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioFormAcceptance: this.props.Login.selectedRecord?.addedChildBioFormAcceptance || []
            };
            openReceiveSlideOut = false;
            openCompleteSlideOut = false;
            viewFormDetails = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openReceiveSlideOut,
                loadEsignStateHandle,
                openCompleteSlideOut,
                viewFormDetails
            }
        }
        this.props.updateStore(updateInfo);

    }

    onMandatoryCheck = (saveType, formRef) => {
        const mandatoryFields = this.props.Login.loadEsignStateHandle ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            (this.props.Login.openReceiveSlideOut ? (this.props.Login.operation === 'receive' ? [
                { "idsName": "IDS_RECIPIENTNAME", "dataField": "srecipientname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                { "idsName": "IDS_RECEIVEDATE", "dataField": "dreceiveddate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" }
            ] : []) : this.props.Login.openCompleteSlideOut ? (this.props.Login.operation === 'complete' ? [
                { "idsName": "IDS_RECEIVINGTEMPERATURE", "dataField": "nreceivingtemperaturecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_RECEIVINGOFFICER", "dataField": "nreceivingofficercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            ] : []) : []);

        onSaveMandatoryValidation(this.state.selectedRecord, mandatoryFields, this.props.Login.loadEsignStateHandle ? this.validateEsign :
            this.props.Login.openReceiveSlideOut ? this.onReceiveEsignCheck :
                this.props.Login.openCompleteSlideOut ? this.onCompleteEsignCheck : "",
            this.props.Login.loadEsignStateHandle, saveType);
    }

    onReceiveEsignCheck = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const nbioFormAcceptanceCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbioformacceptancecode || -1;
        const nbioRequestBasedTransferCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiorequestbasedtransfercode || -1;
        const nbioDirectTransferCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiodirecttransfercode || -1;
        const nbioThirdPartyReturnCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiothirdpartyreturncode || -1;
        const nthirdPartyCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nthirdpartycode || -1;
        const nbioBankReturnCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiobankreturncode || -1;
        const nformTypeCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nformtypecode || -1;
        const noriginSiteCode = this.props.Login.masterData?.selectedBioFormAcceptance?.noriginsitecode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbioformacceptancecode"] = nbioFormAcceptanceCode;
        inputData["nbiorequestbasedtransfercode"] = nbioRequestBasedTransferCode;
        inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
        inputData["nbiothirdpartyreturncode"] = nbioThirdPartyReturnCode;
        inputData["nthirdpartycode"] = nthirdPartyCode;
        inputData["nbiobankreturncode"] = nbioBankReturnCode;
        inputData["nformtypecode"] = nformTypeCode;
        inputData["noriginsitecode"] = noriginSiteCode;

        inputData["bioFormAcceptance"] = {
            "srecipientname": selectedRecord?.srecipientname || '',
            "sreceiveddate": selectedRecord.dreceiveddate && selectedRecord.dreceiveddate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.dreceiveddate, this.props.Login.userInfo) : ''
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_FORMACCEPTANCE",
            operation: "receive"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_FORMACCEPTANCE"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onReceiveClick(inputData);
        }
    }

    onValidateEsignCheck = (validateID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioFormAcceptance = this.props.Login.masterData?.selectedBioFormAcceptance;

        if (selectedBioFormAcceptance !== null) {
            if (selectedBioFormAcceptance.ntransactionstatus === transactionStatus.RECEIVED) {
                const nbioFormAcceptanceCode = selectedBioFormAcceptance?.nbioformacceptancecode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbioformacceptancecode"] = nbioFormAcceptanceCode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_VALIDATEFORM",
                    operation: "validate"
                }

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, validateID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_VALIDATEFORM", operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.onValidate(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECEIVEDRECORD" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECEIVEDRECORD" }));
            this.setState({ loading: false });
        }

    }

    onValidate = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/validateFormAcceptance", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioFormAcceptance = this.props.Login.masterData?.lstBioFormAcceptance;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioFormAcceptance.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode) : -1;

                if (index !== -1) {
                    lstBioFormAcceptance[index] = responseData.selectedBioFormAcceptance;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioFormAcceptance;
                }

                masterData['lstBioFormAcceptance'] = lstBioFormAcceptance;
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

    onCompleteEsignCheck = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const nbioFormAcceptanceCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbioformacceptancecode || -1;
        const nbioDirectTransferCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiodirecttransfercode || -1;
        const nbioRequestBasedTransferCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiorequestbasedtransfercode || -1;
        const nbioBankReturnCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nbiobankreturncode || -1;
        const nformTypeCode = this.props.Login.masterData?.selectedBioFormAcceptance?.nformtypecode || -1;
        const noriginSiteCode = this.props.Login.masterData?.selectedBioFormAcceptance?.noriginsitecode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbioformacceptancecode"] = nbioFormAcceptanceCode;
        inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
        inputData["nbiorequestbasedtransfercode"] = nbioRequestBasedTransferCode;
        inputData["nbiobankreturncode"] = nbioBankReturnCode;
        inputData["nformtypecode"] = nformTypeCode;
        inputData["noriginsitecode"] = noriginSiteCode;

        inputData["bioFormAcceptance"] = {
            "nreceivingtemperaturecode": selectedRecord?.nreceivingtemperaturecode?.value || -1,
            "sreceivingtemperaturename": selectedRecord?.nreceivingtemperaturecode?.label || '',
            "nreceivingofficercode": selectedRecord?.nreceivingofficercode?.value || -1,
            "sreceivingofficername": selectedRecord?.nreceivingofficercode?.label || '',
            "scompletionremarks": selectedRecord?.scompletionremarks || ''
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_FORMACCEPTANCE",
            operation: "complete"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_FORMACCEPTANCE"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onCompleteClick(inputData);
        }
    }

    onReceiveClick = (inputData) => {
        this.setState({ loading: true });
		//added by sujatha ATE_274 BGSI_148 controlcode needed for sending mail when add form receive
        inputData["ncontrolcode"] = this.props.Login.ncontrolCode;
        rsapi().post("formacceptance/updateReceiveBioFormAcceptance", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioFormAcceptance = this.props.Login.masterData?.lstBioFormAcceptance;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioFormAcceptance.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode) : -1;

                if (index !== -1) {
                    lstBioFormAcceptance[index] = responseData.selectedBioFormAcceptance;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioFormAcceptance;
                }

                masterData['lstBioFormAcceptance'] = lstBioFormAcceptance;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openReceiveSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioFormAcceptance'] = [];
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openReceiveSlideOut, selectedRecord, loadEsignStateHandle: false,
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

    onCompleteClick = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/updateCompleteBioFormAcceptance", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioFormAcceptance = this.props.Login.masterData?.lstBioFormAcceptance;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioFormAcceptance.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbioformacceptancecode === responseData.selectedBioFormAcceptance.nbioformacceptancecode) : -1;

                if (index !== -1) {
                    lstBioFormAcceptance[index] = responseData.selectedBioFormAcceptance;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioFormAcceptance;
                }

                masterData['lstBioFormAcceptance'] = lstBioFormAcceptance;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openReceiveSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioFormAcceptance'] = [];
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openReceiveSlideOut, selectedRecord, loadEsignStateHandle: false,
                        openCompleteSlideOut: false, isGridClear: !(this.props?.Login?.isGridClear)
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
        this.validateEsignforFormAcceptance(inputParam, modalName);
    }

    validateEsignforFormAcceptance = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "receive"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_FORMACCEPTANCE") {
                        this.onReceiveClick(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "validate"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_VALIDATEFORM") {
                        this.onValidate(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "complete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_FORMACCEPTANCE") {
                        this.onCompleteClick(inputParam["screenData"]["inputParam"]["inputData"]);
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

    onViewFormDetails = () => {
        let selectedBioFormAcceptance = this.props.Login.masterData?.selectedBioFormAcceptance;
        if (selectedBioFormAcceptance !== null) {
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
})(injectIntl(FormAcceptance));