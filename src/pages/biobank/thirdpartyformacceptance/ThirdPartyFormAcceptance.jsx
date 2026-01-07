import { faArrowDown, faCheckCircle, faCheckSquare, faEye, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
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
import CompleteThirdPartyFormAcceptance from './CompleteThirdPartyFormAcceptance';
import OuterGridThirdPartyFormAcceptance from './OuterGridThirdPartyFormAcceptance';
import ReceiveThirdPartyFormAcceptance from './ReceiveThirdPartyFormAcceptance';
import ThirdPartyFormAcceptanceFilter from './ThirdPartyFormAcceptanceFilter';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class ThirdPartyFormAcceptance extends React.Component {
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
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            splitChangeWidthPercentage: 30,
            selectedFilter: {},
            loading: false,
            fields: {},
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

        if (this.props.Login.masterData && this.props.Login.masterData.realSelectedThirdParty) {
            breadCrumbData.push(
                {
                    "label": "IDS_THIRDPARTY",
                    "value": this.props.Login.masterData.realSelectedThirdParty ? this.props.Login.masterData.realSelectedThirdParty.label : '-'
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
            inputListName: "lstBioThirdPartyFormAcceptance", selectedObject: "lstChildBioThirdPartyFormAcceptance", primaryKeyField: "nbiothirdpartyformacceptancecode",
            fetchUrl: "biothirdpartyformacceptance/getActiveBioThirdPartyFormAcceptance", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioThirdPartyFormAcceptance",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioThirdPartyFormAcceptance',
            skip: 0, take: this.state.take
        };

        const receiveID = this.state.controlMap.has("ReceiveBioThirdPartyFormAcceptance") && this.state.controlMap.get("ReceiveBioThirdPartyFormAcceptance").ncontrolcode;
        const validateID = this.state.controlMap.has("ValidateBioThirdPartyFormAcceptance") && this.state.controlMap.get("ValidateBioThirdPartyFormAcceptance").ncontrolcode;
        const completeID = this.state.controlMap.has("CompleteBioThirdPartyFormAcceptance") && this.state.controlMap.get("CompleteBioThirdPartyFormAcceptance").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewBioThirdPartyFormAcceptance") && this.state.controlMap.get("ViewBioThirdPartyFormAcceptance").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleThirdPartyFormAcceptance") && this.state.controlMap.get("ValidateSampleThirdPartyFormAcceptance").ncontrolcode;
        const moveToDisposeID = this.state.controlMap.has("MoveToDisposeBioThirdPartyFormAcceptance") && this.state.controlMap.get("MoveToDisposeBioThirdPartyFormAcceptance").ncontrolcode;
        const undoID = this.state.controlMap.has("UndoBioThirdPartyFormAcceptance") && this.state.controlMap.get("UndoBioThirdPartyFormAcceptance").ncontrolcode;
        const moveToReturnID = this.state.controlMap.has("MoveToReturnBioThirdPartyFormAcceptance") && this.state.controlMap.get("MoveToReturnBioThirdPartyFormAcceptance").ncontrolcode;
        const reportID = this.state.controlMap.has("ThirdPartyFormAccpetReport") && this.state.controlMap.get("ThirdPartyFormAccpetReport").ncontrolcode;
        const moveToReturnaftercompleteID = this.state.controlMap.has("MoveToReturnAfterComplete") && this.state.controlMap.get("MoveToReturnAfterComplete").ncontrolcode;
        let selectedBioThirdPartyFormAcceptance = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance || {};

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
                                  <Splitter className='layout-splitter' orientation="horizontal"
                                                                         panes={this.state.panes} onChange={this.onSplitterChange}>
                                    <SplitterPane size="30%" min="25%">
                                    <TransactionListMasterJsonView
                                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                        needMultiSelect={false}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioThirdPartyFormAcceptance || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioThirdPartyFormAcceptance] || []}
                                        primaryKeyField="nbiothirdpartyformacceptancecode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getBioThirdPartyFormAcceptance(
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
                                                        onClick={() => this.onReceive(receiveID, 'receive', 'IDS_THIRDPARTYFORMACCEPTANCE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(receiveID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMRECEIVE" })}>
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onValidateEsignCheck(validateID, 'validate', 'IDS_THIRDPARTYFORMACCEPTANCE')}
                                                        hidden={this.state.userRoleControlRights.indexOf(validateID) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_FORMVALIDATION" })}>
                                                        <FontAwesomeIcon icon={faCheckSquare} />
                                                    </Button>

                                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                        onClick={() => this.onComplete(completeID, 'complete', 'IDS_THIRDPARTYFORMACCEPTANCE')}
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
                                                            ...this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbiothirdpartyformacceptancecode", this.props.Login?.masterData?.selectedBioThirdPartyFormAcceptance?.nbiothirdpartyformacceptancecode)}
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
                                                    <ThirdPartyFormAcceptanceFilter
                                                        fromDate={this.fromDate}
                                                        toDate={this.toDate}
                                                        userInfo={this.props.Login.userInfo}
                                                        lstFilterStatus={this.props.Login.masterData?.lstFilterStatus || []}
                                                        selectedFilterStatus={this.props.Login.masterData?.selectedFilterStatus || {}}
                                                        lstThirdParty={this.props.Login.masterData?.lstThirdParty || []}
                                                        selectedThirdParty={this.props.Login.masterData?.selectedThirdParty || {}}
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
                                                            <OuterGridThirdPartyFormAcceptance
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                dataState={this.state.dataState}
                                                                selectedRecord={this.props.Login.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioThirdPartyFormAcceptance={this.props.Login.masterData.lstChildBioThirdPartyFormAcceptance || []}
                                                                acceptRejectID={acceptRejectID}
                                                                moveToDisposeID={moveToDisposeID}
                                                                moveToReturnID={moveToReturnID}
                                                                undoID={undoID}
                                                                moveToReturnaftercompleteID={moveToReturnaftercompleteID}
                                                                lstBioThirdPartyFormAcceptance={this.props.Login.masterData.lstBioThirdPartyFormAcceptance}
                                                                selectedBioThirdPartyFormAcceptance={this.props.Login.masterData.selectedBioThirdPartyFormAcceptance}
                                                                realSelectedThirdParty={this.props.Login.masterData && this.props.Login.masterData.realSelectedThirdParty}
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
                                            <ReceiveThirdPartyFormAcceptance
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                lstStorageCondition={this.props.Login.masterData.lstStorageCondition || []}
                                                lstUsers={this.props.Login.masterData.lstUsers || []}
                                                lstCourier={this.props.Login.masterData.lstCourier || []}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                operation={this.props.Login.operation}
                                                childDataChange={this.childDataChange}
                                                sformnumber={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.sformnumber || ""}
                                                soriginsitename={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.soriginsitename || ""}
                                                ddeliverydate={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.ddeliverydate || new Date()}
                                                scouriername={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.scouriername || ""}
                                                scourierno={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.scourierno || ""}
                                                sremarks={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.sremarks || ""}
                                                svalidationremarks={this.props.Login.masterData?.receiveBioThirdPartyFormAcceptanceDetails?.svalidationremarks || ""}
                                            />
                                            :
                                            this.props.Login.openCompleteSlideOut ?
                                                <CompleteThirdPartyFormAcceptance
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sformnumber
                                                                                            ? selectedBioThirdPartyFormAcceptance.sformnumber
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.soriginsitename
                                                                                            ? selectedBioThirdPartyFormAcceptance.soriginsitename
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sdeliverydate
                                                                                            ? selectedBioThirdPartyFormAcceptance.sdeliverydate
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.scouriername
                                                                                            ? selectedBioThirdPartyFormAcceptance.scouriername
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.scourierno
                                                                                            ? selectedBioThirdPartyFormAcceptance.scourierno
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.srecipientname
                                                                                            ? selectedBioThirdPartyFormAcceptance.srecipientname
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_RECEIVEDATE"
                                                                                    message="Receive Date"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sreceiveddate
                                                                                            ? selectedBioThirdPartyFormAcceptance.sreceiveddate
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.stransdisplaystatus
                                                                                            ? selectedBioThirdPartyFormAcceptance.stransdisplaystatus
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sreceivingtemperaturename
                                                                                            ? selectedBioThirdPartyFormAcceptance.sreceivingtemperaturename
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        (selectedBioThirdPartyFormAcceptance.sreceivingofficername && selectedBioThirdPartyFormAcceptance.sreceivingofficername !== " ")
                                                                                            ? selectedBioThirdPartyFormAcceptance.sreceivingofficername
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.svalidationremarks
                                                                                            ? selectedBioThirdPartyFormAcceptance.svalidationremarks
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.scompletionremarks
                                                                                            ? selectedBioThirdPartyFormAcceptance.scompletionremarks
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    {/* <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_REMARKS"
                                                                                    message="Remarks"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sremarks
                                                                                            ? selectedBioThirdPartyFormAcceptance.sremarks
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sstorageconditionname
                                                                                            ? selectedBioThirdPartyFormAcceptance.sstorageconditionname
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sdeliverydate
                                                                                            ? selectedBioThirdPartyFormAcceptance.sdeliverydate
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
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.sdispatchername
                                                                                            ? selectedBioThirdPartyFormAcceptance.sdispatchername
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col> */}
                                                                    {/* <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_COURIERNAME"
                                                                                    message="Courier Name"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.scouriername
                                                                                            ? selectedBioThirdPartyFormAcceptance.scouriername
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col> */}
                                                                    {/* <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_COURIERNO"
                                                                                    message="Courier No."
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.scourierno
                                                                                            ? selectedBioThirdPartyFormAcceptance.scourierno
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col> */}
                                                                    {/* <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_TRIPLEPACKAGE"
                                                                                    message="Triple Package"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.striplepackage
                                                                                            ? selectedBioThirdPartyFormAcceptance.striplepackage
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col> */}
                                                                    {/* <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel>
                                                                                <FormattedMessage
                                                                                    id="IDS_VALIDATIONREMARKS"
                                                                                    message="Validation Remarks"
                                                                                />
                                                                            </FormLabel>
                                                                            <ReadOnlyText>
                                                                                {
                                                                                    selectedBioThirdPartyFormAcceptance ?
                                                                                        selectedBioThirdPartyFormAcceptance.svalidationremarks
                                                                                            ? selectedBioThirdPartyFormAcceptance.svalidationremarks
                                                                                            : "-" : "-"
                                                                                }
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col> */}
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
            openAcceptRejectBioThirdPartyFormAcceptance: undefined,
            lstSampleCondition: [],
            lstReason: [],
            lstChildBioThirdPartyFormAcceptance: [],
            selectedFreezerRecord: undefined,
            initialSelectedFreezerRecord: undefined,
            shouldRender: undefined,
            masterData: [],
            inputParam: undefined 
            }
        }
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
        const nthirdPartyCode = this.state.selectedFilterRecord?.nthirdpartycode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate,
            selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode,
            selectedThridParty: nthirdPartyCode, realSelectedThridParty: nthirdPartyCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            nthirdPartyCode: nthirdPartyCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("biothirdpartyformacceptance/getBioThirdPartyFormAcceptance", { ...inputData })
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
        const obj = convertDateValuetoString(masterData.realFromDate, masterData.realToDate, userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = masterData.realSelectedFilterStatus || -1;
        const nthirdPartyCode = masterData.realSelectedThirdParty || -1;

        let inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            nthirdPartyCode: nthirdPartyCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("biothirdpartyformacceptance/getBioThirdPartyFormAcceptance", { ...inputData })
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
    }

    getBioThirdPartyFormAcceptance(inputParam) {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyformacceptance/getActiveBioThirdPartyFormAcceptance", {
            'userinfo': inputParam.userinfo,
            'nbiothirdpartyformacceptancecode': inputParam.nbiothirdpartyformacceptancecode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                let skip = this.state.skip;
                let take = this.state.take;
                masterData = { ...inputParam.masterData, ...response.data };
                selectedRecord['addedChildBioThirdPartyFormAcceptance'] = [];
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
        let selectedBioThirdPartyFormAcceptance = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance;
        if (selectedBioThirdPartyFormAcceptance !== null) {
            let masterDataUpdated = this.props.Login.masterData;
            this.setState({ loading: true });
            rsapi().post("biothirdpartyformacceptance/getReceiveBioThirdPartyFormAcceptanceDetails", {
                'nbiothirdpartyformacceptancecode': selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    let masterData = { ...masterDataUpdated };
                    const ddeliverydate = rearrangeDateFormat(this.props.Login.userInfo,
                        response.data?.sdeliverydate);
                    masterData["receiveBioThirdPartyFormAcceptanceDetails"] = response.data;
                    masterData["receiveBioThirdPartyFormAcceptanceDetails"]["ddeliverydate"] = ddeliverydate;
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
    }

    onComplete = (completeID, operation, screenName) => {
        let selectedBioThirdPartyFormAcceptance = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance;
        if (selectedBioThirdPartyFormAcceptance !== null) {
            this.setState({ loading: true });
            rsapi().post("biothirdpartyformacceptance/onCompleteSlideOut", {
                'nbiothirdpartyformacceptancecode': selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode,
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
            openModal = (screenName === "IDS_THIRDPARTYFORMACCEPTANCE" && (operation === "update" || operation === "receive")) ? true : false;
            openReceiveSlideOut = (screenName === "IDS_THIRDPARTYFORMACCEPTANCE" && operation === "receive") ? true : false;
            openCompleteSlideOut = (screenName === "IDS_THIRDPARTYFORMACCEPTANCE" && operation === "complete") ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioThirdPartyFormAcceptance: this.props.Login.selectedRecord?.addedChildBioThirdPartyFormAcceptance || []
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
        const nbioThirdPartyFormAcceptanceCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiothirdpartyformacceptancecode || -1;
        const nbioRequestBasedTransferCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiorequestbasedtransfercode || -1;
        const nbioDirectTransferCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiodirecttransfercode || -1;
        const nbioBankReturnCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiobankreturncode || -1;
        const nthirdPartyCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nthirdpartycode || -1;
        const noriginSiteCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.noriginsitecode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiothirdpartyformacceptancecode"] = nbioThirdPartyFormAcceptanceCode;
        inputData["nbiorequestbasedtransfercode"] = nbioRequestBasedTransferCode;
        inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
        inputData["nbiobankreturncode"] = nbioBankReturnCode;
        inputData["nthirdpartycode"] = nthirdPartyCode;
        inputData["noriginsitecode"] = noriginSiteCode;

        inputData["bioThirdPartyFormAcceptance"] = {
            "srecipientname": selectedRecord?.srecipientname || '',
            "sreceiveddate": selectedRecord.dreceiveddate && selectedRecord.dreceiveddate !== null ?
                convertDateTimetoStringDBFormat(selectedRecord.dreceiveddate, this.props.Login.userInfo) : ''
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_THIRDPARTYFORMACCEPTANCE",
            operation: "receive"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_THIRDPARTYFORMACCEPTANCE"
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
        const selectedBioThirdPartyFormAcceptance = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance;

        if (selectedBioThirdPartyFormAcceptance !== null) {
            if (selectedBioThirdPartyFormAcceptance.ntransactionstatus === transactionStatus.RECEIVED) {
                const nbioThirdPartyFormAcceptanceCode = selectedBioThirdPartyFormAcceptance?.nbiothirdpartyformacceptancecode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nbiothirdpartyformacceptancecode"] = nbioThirdPartyFormAcceptanceCode;

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
        rsapi().post("biothirdpartyformacceptance/validateBioThirdPartyFormAcceptance", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioThirdPartyFormAcceptance = this.props.Login.masterData?.lstBioThirdPartyFormAcceptance;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioThirdPartyFormAcceptance.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode) : -1;

                if (index !== -1) {
                    lstBioThirdPartyFormAcceptance[index] = responseData.selectedBioThirdPartyFormAcceptance;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyFormAcceptance;
                }

                masterData['lstBioThirdPartyFormAcceptance'] = lstBioThirdPartyFormAcceptance;
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
        const nbioThirdPartyFormAcceptanceCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiothirdpartyformacceptancecode || -1;
        const nbioDirectTransferCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiodirecttransfercode || -1;
        const nbioRequestBasedTransferCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiorequestbasedtransfercode || -1;
        const nbioBankReturnCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nbiobankreturncode || -1;
        const nthirdPartyCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nthirdpartycode || -1;
        const nisNgs = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.nisngs || -1;
        const noriginSiteCode = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance?.noriginsitecode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nbiothirdpartyformacceptancecode"] = nbioThirdPartyFormAcceptanceCode;
        inputData["nbiodirecttransfercode"] = nbioDirectTransferCode;
        inputData["nbiorequestbasedtransfercode"] = nbioRequestBasedTransferCode;
        inputData["nbiobankreturncode"] = nbioBankReturnCode;
        inputData["nthirdpartycode"] = nthirdPartyCode;
        inputData["nisngs"] = nisNgs;
        inputData["noriginsitecode"] = noriginSiteCode;

        inputData["bioThirdPartyFormAcceptance"] = {
            "nreceivingtemperaturecode": selectedRecord?.nreceivingtemperaturecode?.value || -1,
            "sreceivingtemperaturename": selectedRecord?.nreceivingtemperaturecode?.label || '',
            "nreceivingofficercode": selectedRecord?.nreceivingofficercode?.value || -1,
            "sreceivingofficername": selectedRecord?.nreceivingofficercode?.label || '',
            "scompletionremarks": selectedRecord?.scompletionremarks || ''
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_THIRDPARTYFORMACCEPTANCE",
            operation: "complete"
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModal: true, screenData: { inputParam }, screenName: "IDS_THIRDPARTYFORMACCEPTANCE"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onCompleteClick(inputData);
        }
    }

    onReceiveClick = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyformacceptance/updateReceiveBioThirdPartyFormAcceptance", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioThirdPartyFormAcceptance = this.props.Login.masterData?.lstBioThirdPartyFormAcceptance;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioThirdPartyFormAcceptance.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode) : -1;

                if (index !== -1) {
                    lstBioThirdPartyFormAcceptance[index] = responseData.selectedBioThirdPartyFormAcceptance;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyFormAcceptance;
                }

                masterData['lstBioThirdPartyFormAcceptance'] = lstBioThirdPartyFormAcceptance;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openReceiveSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioThirdPartyFormAcceptance'] = [];
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
        rsapi().post("biothirdpartyformacceptance/updateCompleteBioThirdPartyFormAcceptance", { ...inputData })
            .then(response => {
                let responseData = response.data;


                if (responseData.containsNotThirdPartySharableSamples) {
                    this.confirmMessage.confirm("alertMsg", this.props.intl.formatMessage({ id: "IDS_COMPLETEFORM" }), responseData.salertMsg,
                        null, this.props.intl.formatMessage({ id: "IDS_OK" }),
                        () => "");
                    this.setState({ loading: false });
                } else {

                    //syed & abdul code included
                    if (response.data.ngsSuccessMessage) {
                        toast.success(response.data.ngsSuccessMessage);
                    }

                    let masterData = { ...this.props.Login.masterData };
                    let lstBioThirdPartyFormAcceptance = this.props.Login.masterData?.lstBioThirdPartyFormAcceptance;
                    let searchedData = this.props.Login.masterData?.searchedData;

                    const index = lstBioThirdPartyFormAcceptance.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode);
                    const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyformacceptancecode === responseData.selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode) : -1;

                    if (index !== -1) {
                        lstBioThirdPartyFormAcceptance[index] = responseData.selectedBioThirdPartyFormAcceptance;
                    }
                    if (searchedDataIndex !== -1) {
                        searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyFormAcceptance;
                    }

                    masterData['lstBioThirdPartyFormAcceptance'] = lstBioThirdPartyFormAcceptance;
                    masterData['searchedData'] = searchedData;
                    masterData = { ...masterData, ...responseData };
                    let openModal = false;
                    let openReceiveSlideOut = false;
                    let selectedRecord = {};
                    selectedRecord['addSelectAll'] = false;
                    selectedRecord['addedChildBioThirdPartyFormAcceptance'] = [];
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, openModal, openReceiveSlideOut, selectedRecord, loadEsignStateHandle: false,
                            openCompleteSlideOut: false, isGridClear: !(this.props?.Login?.isGridClear)
                        }
                    }
                    this.props.updateStore(updateInfo);
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
    }

    validateEsign = () => {
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
        this.validateEsignforBioThirdPartyFormAcceptance(inputParam, modalName);
    }

    validateEsignforBioThirdPartyFormAcceptance = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "receive"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_THIRDPARTYFORMACCEPTANCE") {
                        this.onReceiveClick(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "validate"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_VALIDATEFORM") {
                        this.onValidate(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "complete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_THIRDPARTYFORMACCEPTANCE") {
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
        let selectedBioThirdPartyFormAcceptance = this.props.Login.masterData?.selectedBioThirdPartyFormAcceptance;
        if (selectedBioThirdPartyFormAcceptance !== null) {
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
})(injectIntl(ThirdPartyFormAcceptance));