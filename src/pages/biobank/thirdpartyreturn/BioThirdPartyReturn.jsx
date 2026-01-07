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
import AddThirdPartyReturn from './AddThirdPartyReturn';
import ThirdPartyReturnFilter from './ThirdPartyReturnFilter';
import OuterGridThirdPartyReturn from './OuterGridThirdPartyReturn';

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class BioThirdPartyReturn extends React.Component {
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
        if (this.props.Login.openModal && this.props.Login.openThirdPartyReturn && nextState.isInitialRender === false &&
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

        this.searchFieldList = ["sthirdpartyreturnformnumber", "soriginsitename", "sreturndate", "stransdisplaystatus"]
        const filterParam = {
            inputListName: "lstBioThirdPartyReturn", selectedObject: "lstChildBioThirdPartyReturn", primaryKeyField: "nbiothirdpartyreturncode",
            fetchUrl: "biothirdpartyreturn/getActiveBioThirdPartyReturn", masterData: this.props.Login.masterData || {},
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
            },
            clearFilter: "no",
            updatedListname: "selectedBioThirdPartyReturn",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'lstBioThirdPartyReturn',
            skip: 0, take: this.state.take
        };

        this.fromDate = this.state.selectedFilter["fromdate"] !== "" && this.state.selectedFilter["fromdate"] !== undefined ? this.state.selectedFilter["fromdate"] : this.props.Login.masterData.fromDate;
        this.toDate = this.state.selectedFilter["todate"] !== "" && this.state.selectedFilter["todate"] !== undefined ? this.state.selectedFilter["todate"] : this.props.Login.masterData.toDate;

        const SubFields = [
            { [designProperties.VALUE]: "soriginsitename" },
            { [designProperties.VALUE]: "sreturndate" },
        ];

        const addID = this.state.controlMap.has("AddThirdPartyReturnForm") && this.state.controlMap.get("AddThirdPartyReturnForm").ncontrolcode;
        const editID = this.state.controlMap.has("EditThirdPartyReturnForm") && this.state.controlMap.get("EditThirdPartyReturnForm").ncontrolcode;
        const validateID = this.state.controlMap.has("ValidateThirdPartyReturnForm") && this.state.controlMap.get("ValidateThirdPartyReturnForm").ncontrolcode;
        const cancelID = this.state.controlMap.has("CancelThirdPartyReturnForm") && this.state.controlMap.get("CancelThirdPartyReturnForm").ncontrolcode;
        const viewID = this.state.controlMap.has("ViewThirdPartyReturnForm") && this.state.controlMap.get("ViewThirdPartyReturnForm").ncontrolcode;
        const returnID = this.state.controlMap.has("ReturnThirdPartyReturnForm") && this.state.controlMap.get("ReturnThirdPartyReturnForm").ncontrolcode;
        const addChildID = this.state.controlMap.has("AddChildThirdPartyReturnForm") && this.state.controlMap.get("AddChildThirdPartyReturnForm").ncontrolcode;
        const deleteChildID = this.state.controlMap.has("DeleteChildThirdPartyReturnForm") && this.state.controlMap.get("DeleteChildThirdPartyReturnForm").ncontrolcode;
        const acceptRejectID = this.state.controlMap.has("ValidateSampleThirdPartyReturn") && this.state.controlMap.get("ValidateSampleThirdPartyReturn").ncontrolcode;
        const disposeID = this.state.controlMap.has("DisposeChildThirdPartyReturnForm") && this.state.controlMap.get("DisposeChildThirdPartyReturnForm").ncontrolcode;
        const undoID = this.state.controlMap.has("UndoThirdPartyReturn") && this.state.controlMap.get("UndoThirdPartyReturn").ncontrolcode;
        const reportID = this.state.controlMap.has("ThirdPartyBGSIReturnReport") && this.state.controlMap.get("ThirdPartyBGSIReturnReport").ncontrolcode;

        let selectedBioThirdPartyReturn = this.props.Login.masterData && this.props.Login.masterData.selectedBioThirdPartyReturn || {};

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
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.lstBioThirdPartyReturn || []}
                                        selectedMaster={[this.props.Login.masterData.selectedBioThirdPartyReturn] || []}
                                        primaryKeyField="nbiothirdpartyreturncode"
                                        getMasterDetail={(Sample, status) =>
                                            this.getThirdPartyReturn(
                                                {
                                                    masterData: this.props.Login.masterData,
                                                    userinfo: this.props.Login.userInfo,
                                                    ...Sample
                                                }, status
                                            )}
                                        subFieldsLabel={false}
                                        additionalParam={['']}
                                        mainField={'sthirdpartyreturnformnumber'}
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
                                                objectName: "editThirdPartyReturn",
                                                hidden: this.state.userRoleControlRights.indexOf(editID) === -1,
                                                onClick: this.editThirdPartyReturn,
                                                inputData: {
                                                    primaryKeyName: "nbiothirdpartyreturncode",
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
                                                        onClick={() => this.addThirdPartyReturn(addID, 'create', 'IDS_RETURNFORM')} >
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
                                                            ...this.props.Login.masterData?.selectedBioThirdPartyReturn,
                                                            nusercode: this.props.Login.userInfo?.nusercode
                                                        }, this.props.Login, "nbiothirdpartyreturncode", this.props.Login?.masterData?.selectedBioThirdPartyReturn?.nbiothirdpartyreturncode)}
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
                                                    <ThirdPartyReturnFilter
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
                                                            <OuterGridThirdPartyReturn
                                                                controlMap={this.state.controlMap}
                                                                userRoleControlRights={this.state.userRoleControlRights}
                                                                dataState={this.state.dataState}
                                                                selectedRecord={this.state.selectedRecord || {}}
                                                                operation={this.props.Login.operation}
                                                                childDataChange={this.childDataChange}
                                                                lstChildBioThirdPartyReturn={this.props.Login.masterData.lstChildBioThirdPartyReturn || []}
                                                                addChildID={addChildID}
                                                                acceptRejectID={acceptRejectID}
                                                                deleteChildID={deleteChildID}
                                                                disposeID={disposeID}
                                                                lstBioThirdPartyReturn={this.props.Login.masterData.lstBioThirdPartyReturn}
                                                                selectedBioThirdPartyReturn={this.props.Login.masterData.selectedBioThirdPartyReturn}
                                                                validateReturnQuantities={this.validateReturnQuantities}
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
                            this.props.Login.openThirdPartyReturn ? true : false}
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
                            : this.props.Login.openThirdPartyReturn ?
                                <AddThirdPartyReturn
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
                                        sformnumber={this.props.Login.masterData?.selectedBioThirdPartyReturn?.sthirdpartyreturnformnumber}
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
                                                                        message="ThirdParty Return Form Number"
                                                                    />
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.sthirdpartyreturnformnumber
                                                                                ? selectedBioThirdPartyReturn.sthirdpartyreturnformnumber
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.sstorageconditionname
                                                                                ? selectedBioThirdPartyReturn.sstorageconditionname
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.sdeliverydate
                                                                                ? selectedBioThirdPartyReturn.sdeliverydate
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.sdispatchername
                                                                                ? selectedBioThirdPartyReturn.sdispatchername
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.scouriername
                                                                                ? selectedBioThirdPartyReturn.scouriername
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.scourierno
                                                                                ? selectedBioThirdPartyReturn.scourierno
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.striplepackage
                                                                                ? selectedBioThirdPartyReturn.striplepackage
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
                                                                        selectedBioThirdPartyReturn ?
                                                                            selectedBioThirdPartyReturn.svalidationremarks
                                                                                ? selectedBioThirdPartyReturn.svalidationremarks
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
            openAcceptRejectThirdPartyReturn: undefined,
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
        const nthirdPartyCode = this.state.selectedFilterRecord?.nthirdpartycode || -1;
        let masterDataUpdated = {
            ...this.props.Login.masterData, realFromDate, realToDate,
            selectedFilterStatus: ntransCode, realSelectedFilterStatus: ntransCode,
            selectedFormType: nformTypeCode, realSelectedFormType: nformTypeCode,
            selectedThirdParty: nthirdPartyCode, realSelectedThirdParty: nthirdPartyCode
        }
        const obj = convertDateValuetoString(this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
            this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate, this.props.Login.userInfo)
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            ntransCode: ntransCode.value,
            nformTypeCode: nformTypeCode.value,
            nthirdPartyCode: nthirdPartyCode.value,
            userinfo: this.props.Login.userInfo
        }
        this.setState({ loading: true });
        rsapi().post("biothirdpartyreturn/getBioThirdPartyReturn", { ...inputData })
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
        const nthirdPartyCode = masterData.realSelectedThirdParty || -1;

        const inputData = {
            fromDate: realFromDate,
            toDate: realToDate,
            ntransCode: ntransCode.value,
            nthirdPartyCode: nthirdPartyCode.value,
            userinfo: userInfo
        };

        this.setState({ loading: true });

        rsapi().post("biothirdpartyreturn/getBioThirdPartyReturn", inputData)
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
            this.props.Login.openThirdPartyReturn ? (this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_FORMNUMBER", "dataField": "nbiothirdpartyformacceptancecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
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
            this.props.Login.openThirdPartyReturn ? this.onSaveClick : this.props.Login.openValidateSlideOut ?
                this.onValidateEsignCheck : "", this.props.Login.loadEsignStateHandle, saveType);
    }

    addThirdPartyReturn = (addID, operation, screenName) => {
        if (operation === "create") {
            this.setState({ loading: true });
            rsapi().post("biothirdpartyreturn/getFormNumberDetails", { 'userinfo': this.props.Login.userInfo })
                .then(response => {
                    let masterData = {};
                    masterData = { ...this.props.Login.masterData, ...response.data };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            masterData, screenName, operation, openModal: true,
                            openThirdPartyReturn: true, bioBankSiteDisable: false
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

    onSaveClick = (saveType) => {
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        let userInfo = this.props.Login.userInfo;
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus;
        const nthirdPartyCode = this.props.Login.masterData?.realSelectedThirdParty;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nthirdPartyCode"] = nthirdPartyCode.value;
        inputData["saveType"] = saveType;

        if (operation === "create") {
            inputData["bioThirdPartyReturn"] = {
                "nbiothirdpartyformacceptancecode": selectedRecord?.nbiothirdpartyformacceptancecode?.value || -1,
                "ntransfertypecode": selectedRecord?.nbiothirdpartyformacceptancecode?.item?.ntransfertypecode || -1,
                "sparentsamplecode": selectedRecord?.nbioparentsamplecode?.item?.sparentsamplecode || '',
                "ncohortno": selectedRecord?.nbioparentsamplecode?.item?.ncohortno || -1,
                "nformtypecode": selectedRecord?.nbiothirdpartyformacceptancecode?.item?.nformtypecode || -1,
                "nthirdpartycode": selectedRecord?.nbiothirdpartyformacceptancecode?.item?.nthirdpartycode || -1,
                "noriginsitecode": selectedRecord?.noriginsitecode?.value || -1,
                "soriginsitename": selectedRecord?.noriginsitecode?.label || '',
                "sreturndate": selectedRecord.dreturndate && selectedRecord.dreturndate !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.dreturndate, this.props.Login.userInfo) : '',
                "sremarks": selectedRecord?.sremarks || '',
            };
            let lstThirdPartyFormAcceptanceDetails = selectedRecord.lstThirdPartyFormAcceptanceDetails && selectedRecord.lstThirdPartyFormAcceptanceDetails || [];
            let validationQuantity = this.validateReturnQuantities(lstThirdPartyFormAcceptanceDetails, userInfo);

            if (validationQuantity.rtnValue === "Success") {
                inputData["filterSelectedSamples"] = lstThirdPartyFormAcceptanceDetails && lstThirdPartyFormAcceptanceDetails || [];
                inputData["nprimaryKeyBioThirdPartyReturn"] = selectedRecord.nprimaryKeyBioThirdPartyReturn || -1;
                if (lstThirdPartyFormAcceptanceDetails && lstThirdPartyFormAcceptanceDetails.length > 0) {
                    this.setState({ loading: true });
                    rsapi().post("biothirdpartyreturn/createBioThirdPartyReturn", { ...inputData })
                        .then(response => {
                            let masterData = {};
                            masterData = { ...this.props.Login.masterData, ...response.data };
                            let openModal = false;
                            let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                            let openThirdPartyReturn = false;
                            if (saveType === 2) {
                                openModal = true;
                                openThirdPartyReturn = true;
                                selectedRecord['nbiothirdpartyformacceptancecode'] = '';
                                selectedRecord['lstGetSampleReceivingDetails'] = [];
                                selectedRecord['addSelectAll'] = false;
                                selectedRecord['addedSampleReceivingDetails'] = [];
                                selectedRecord['lstThirdPartyFormAcceptanceDetails'] = [];
                                selectedRecord['nprimaryKeyBioThirdPartyReturn'] = response.data?.nprimaryKeyBioThirdPartyReturn || -1;
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
                                    masterData, openModal, openThirdPartyReturn, selectedRecord, bioBankSiteDisable,
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
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_NOSAMPLESAVAILABLETORETURN" }));
                    this.setState({ loading: false });
                }
            } else {
                toast.warn(validationQuantity.idsName);
                this.setState({ loading: false });
            }

        } else if (operation === "update") {
            inputData['nbiothirdpartyreturncode'] = selectedRecord?.noriginsitecode?.item?.nbiothirdpartyreturncode;
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
                this.editThirdPartyReturnRecord(inputData);
            }
        }
    }

    validateReturnQuantities = (lstThirdPartyFormAcceptanceDetails, userInfo) => {
        let emptyReturnQtyIds = [];
        let invalidReturnQtyIds = [];

        const convertKey = userInfo['sdecimaloperator'] || ".";

        function parseLocalizedNumber(value, convertKey) {
            if (typeof value !== "string") return NaN;
            return parseFloat(value.replace(convertKey, "."));
        }

        lstThirdPartyFormAcceptanceDetails.forEach(x => {
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

    editThirdPartyReturnRecord = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyreturn/updateBioThirdPartyReturn", { ...inputData })
            .then(response => {
                let masterData = {};
                let openModal = false;
                let bioBankSiteDisable = this.props.Login.bioBankSiteDisable;
                let openThirdPartyReturn = false;

                let searchedData = this.props.Login.masterData?.searchedData;

                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyreturncode === response.data.selectedBioThirdPartyReturn.nbiothirdpartyreturncode) : -1;

                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = response.data.selectedBioThirdPartyReturn;
                }

                masterData['searchedData'] = searchedData;
                masterData = { ...this.props.Login.masterData, ...response.data };

                let selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChildBioThirdPartyReturn: this.props.Login.selectedRecord?.addedChildBioThirdPartyReturn || []
                };
                bioBankSiteDisable = false;
                selectedRecord['nprimaryKeyBioThirdPartyReturn'] = response.data?.nprimaryKeyBioThirdPartyReturn || -1;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, openModal, openThirdPartyReturn, selectedRecord, bioBankSiteDisable, loadEsignStateHandle: false,
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

    getThirdPartyReturn(inputParam) {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyreturn/getActiveBioThirdPartyReturn", {
            'userinfo': inputParam.userinfo,
            'nbiothirdpartyreturncode': inputParam.nbiothirdpartyreturncode || '-1'
        })
            .then(response => {
                let masterData = {};
                let selectedRecord = this.state.selectedRecord;
                masterData = { ...inputParam.masterData, ...response.data };
                let skip = this.state.skip;
                let take = this.state.take;
                selectedRecord['addedChildBioThirdPartyReturn'] = [];
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

    editThirdPartyReturn = (inputParam) => {
        if (inputParam?.editThirdPartyReturn.ntransactionstatus === transactionStatus.DRAFT
            || inputParam?.editThirdPartyReturn.ntransactionstatus === transactionStatus.VALIDATION) {
            let inputData = {
                'nbiothirdpartyreturncode': inputParam?.editThirdPartyReturn?.nbiothirdpartyreturncode,
                'userinfo': this.props.Login.userInfo
            };
            this.setState({ loading: true });
            rsapi().post("biothirdpartyreturn/getActiveBioThirdPartyReturnById", { ...inputData })
                .then(response => {
                    let selectedChildThirdPartyReturn = response.data?.selectedChildThirdPartyReturn;
                    let selectedRecord = this.state.selectedRecord;
                    selectedRecord['nbiothirdpartyformacceptancecode'] = {
                        label: selectedChildThirdPartyReturn.sformnumber,
                        value: selectedChildThirdPartyReturn.nbiothirdpartyformacceptancecode,
                        item: selectedChildThirdPartyReturn
                    };
                    selectedRecord['nbiothirdpartyreturncode'] = {
                        label: selectedChildThirdPartyReturn.sthirdpartyreturnformnumber,
                        value: selectedChildThirdPartyReturn.nbiothirdpartyreturncode,
                        item: selectedChildThirdPartyReturn
                    };
                    selectedRecord['noriginsitecode'] = {
                        label: selectedChildThirdPartyReturn.soriginsitename,
                        value: selectedChildThirdPartyReturn.noriginsitecode,
                        item: selectedChildThirdPartyReturn
                    };
                    selectedRecord['dreturndate'] = rearrangeDateFormat(this.props.Login.userInfo,
                        selectedChildThirdPartyReturn?.sreturndate);
                    selectedRecord['sremarks'] = selectedChildThirdPartyReturn.sremarks || '';
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation: inputParam.operation,
                            selectedRecord,
                            openModal: true,
                            openThirdPartyReturn: true,
                            bioBankSiteDisable: true,
                            ncontrolCode: inputParam.controlCode,
                            screenName: "IDS_RETURNFORM"
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

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let openThirdPartyReturn = this.props.Login.openThirdPartyReturn;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
        let openValidateSlideOut = this.props.Login.openValidateSlideOut;
        let operation = this.props.Login.operation;
        let viewFormDetails = this.props.Login.viewFormDetails;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openThirdPartyReturn = (screenName === "IDS_RETURNFORM" && operation === "update") ? true : false;
            openModal = (screenName === "IDS_RETURNFORM" && (operation === "update" || operation === "validate")) ? true : false;
        } else {
            openModal = false;
            selectedRecord = {
                addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                addedChildBioThirdPartyReturn: this.props.Login.selectedRecord?.addedChildBioThirdPartyReturn || []
            };
            openThirdPartyReturn = false;
            viewFormDetails = false;
            openValidateSlideOut = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal,
                selectedRecord,
                selectedId: null,
                openThirdPartyReturn,
                loadEsignStateHandle,
                viewFormDetails,
                openValidateSlideOut
            }
        }
        this.props.updateStore(updateInfo);
    }

    onValidate = (validateID, operation, screenName) => {
        let selectedBioThirdPartyReturn = this.props.Login.masterData?.selectedBioThirdPartyReturn;
        if (selectedBioThirdPartyReturn !== null) {
            this.setState({ loading: true });
            rsapi().post("biothirdpartyreturn/getValidateFormDetails", {
                'nbiothirdpartyreturncode': selectedBioThirdPartyReturn.nbiothirdpartyreturncode,
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
        const nthirdPartyCode = this.props.Login.masterData?.realSelectedThirdParty;
        const nbioThirdPartyReturnCode = this.props.Login.masterData?.selectedBioThirdPartyReturn?.nbiothirdpartyreturncode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["nthirdPartyCode"] = nthirdPartyCode.value;
        inputData["nbiothirdpartyreturncode"] = nbioThirdPartyReturnCode;

        inputData["bioThirdPartyReturn"] = {
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
        rsapi().post("biothirdpartyreturn/createValidationBioThirdPartyReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioThirdPartyReturn = this.props.Login.masterData?.lstBioThirdPartyReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioThirdPartyReturn.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode) : -1;

                if (index !== -1) {
                    lstBioThirdPartyReturn[index] = responseData.selectedBioThirdPartyReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyReturn;
                }

                masterData['lstBioThirdPartyReturn'] = lstBioThirdPartyReturn;
                masterData['searchedData'] = searchedData;
                masterData = { ...masterData, ...responseData };
                let openModal = false;
                let openValidateSlideOut = false;
                let selectedRecord = {};
                selectedRecord['addSelectAll'] = false;
                selectedRecord['addedChildBioThirdPartyReturn'] = [];
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

    onReturnEsignCheck = (transferID, operation, screenName) => {
        let inputData = [];
        const obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);
        const realFromDate = obj.fromDate;
        const realToDate = obj.toDate;
        const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
        const selectedBioThirdPartyReturn = this.props.Login.masterData?.selectedBioThirdPartyReturn;
        const nthirdPartyCode = this.props.Login.masterData?.realSelectedThirdParty;

        if (selectedBioThirdPartyReturn !== null) {
            if (selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioThirdPartyReturnCode = selectedBioThirdPartyReturn?.nbiothirdpartyreturncode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nthirdPartyCode"] = nthirdPartyCode.value;
                inputData["nbiothirdpartyreturncode"] = nbioThirdPartyReturnCode;
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
        rsapi().post("biothirdpartyreturn/returnThirdPartyReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioThirdPartyReturn = this.props.Login.masterData?.lstBioThirdPartyReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioThirdPartyReturn.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode) : -1;

                if (index !== -1) {
                    lstBioThirdPartyReturn[index] = responseData.selectedBioThirdPartyReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyReturn;
                }

                masterData['lstBioThirdPartyReturn'] = lstBioThirdPartyReturn;
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
        const selectedBioThirdPartyReturn = this.props.Login.masterData?.selectedBioThirdPartyReturn;
        const nthirdPartyCode = this.props.Login.masterData?.realSelectedThirdParty;

        if (selectedBioThirdPartyReturn !== null) {
            if (selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.DRAFT
                || selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.VALIDATION) {
                const nbioThirdPartyReturnCode = selectedBioThirdPartyReturn?.nbiothirdpartyreturncode;
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["fromDate"] = realFromDate;
                inputData["toDate"] = realToDate;
                inputData["ntransCode"] = ntransCode.value;
                inputData["nthirdPartyCode"] = nthirdPartyCode.value;
                inputData["nbiothirdpartyreturncode"] = nbioThirdPartyReturnCode;

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
        rsapi().post("biothirdpartyreturn/cancelThirdPartyReturn", { ...inputData })
            .then(response => {
                let masterData = { ...this.props.Login.masterData };
                let responseData = response.data;
                let lstBioThirdPartyReturn = this.props.Login.masterData?.lstBioThirdPartyReturn;
                let searchedData = this.props.Login.masterData?.searchedData;

                const index = lstBioThirdPartyReturn.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode);
                const searchedDataIndex = searchedData ? searchedData.findIndex(item => item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode) : -1;

                if (index !== -1) {
                    lstBioThirdPartyReturn[index] = responseData.selectedBioThirdPartyReturn;
                }
                if (searchedDataIndex !== -1) {
                    searchedData[searchedDataIndex] = responseData.selectedBioThirdPartyReturn;
                }

                masterData['lstBioThirdPartyReturn'] = lstBioThirdPartyReturn;
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

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    onViewFormDetails = (viewID, operation, screenName) => {
        const selectedBioThirdPartyReturn = this.props.Login.masterData?.selectedBioThirdPartyReturn;
        if (selectedBioThirdPartyReturn !== null) {
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
        this.validateEsignforThirdPartyReturn(inputParam, modalName);
    }

    validateEsignforThirdPartyReturn = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
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
                        this.editThirdPartyReturnRecord(inputParam["screenData"]["inputParam"]["inputData"]);
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
}

export default connect(mapStateToProps, {
    updateStore, filterTransactionList, generateControlBasedReport
})(injectIntl(BioThirdPartyReturn));