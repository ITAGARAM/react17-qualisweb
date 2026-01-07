import { faCheckSquare, faThumbsUp, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { toast } from "react-toastify";
import { Affix } from "rsuite";
import { filterTransactionList, updateStore, getSelectedBioEcatalogueReqApproval } from "../../../actions";
import { ReactComponent as RefreshIcon } from "../../../assets/image/refresh.svg";
import { ContentPanel } from "../../../components/App.styles";
import BreadcrumbComponent from "../../../components/Breadcrumb.Component";
import {
  convertDateTimetoStringDBFormat,
  convertDateValuetoString,
  getControlMap,
  rearrangeDateFormat,
  showEsign
} from "../../../components/CommonScript";
import { designProperties, transactionStatus } from "../../../components/Enumeration";
import Preloader from "../../../components/preloader/preloader.component";
import TransactionListMasterJsonView from "../../../components/TransactionListMasterJsonView";
import rsapi from "../../../rsapi";
import { ProductList } from "../../product/product.styled";
import { ListWrapper } from "../../userroletemplate/userroletemplate.styles";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./../../../actions/LoginTypes";
import DataGrid from "../../../components/data-grid/data-grid.component";
import { process } from "@progress/kendo-data-query";
import RequestBasedTransferFilter from "./RequestBasedTransferFilter";
import Esign from "../../audittrail/Esign";
import SlideOutModal from "../../../components/slide-out-modal/SlideOutModal";
import AcceptBioEcatalogueReqApproval from "./AcceptBioEcatalogueReqApproval";
import ModalShow from "../../../components/ModalShow";
import EsignStateHandle from "../../audittrail/EsignStateHandle";
import ApprovepopupBioEcatalogueReqApproval from "./ApprovepopupBioEcatalogueReqApproval";

const mapStateToProps = (state) => {
  return {
    Login: state.Login,
  };
};

class BioEcatalogueReqApproval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecord: {},
      selectedFilterRecord: {},
      selectedChildRecord: {},
      operation: "",
      gridHeight: "auto",
      screenName: undefined,
      userRoleControlRights: [],
      ControlRights: undefined,
      controlMap: new Map(),
      bioEcatalogueDataResult: [], // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
      sampleStorageTransDataResult: [], // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
      bioEcatalogueDataState: {
        skip: 0,
        take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 10,
      },
      sampleStorageTransDataState: {
        skip: 0,
        take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 10,
      },
      skip: 0,
      error: "",
      take: this.props.Login.settings && this.props.Login.settings[3],
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
      toast.error(props.Login.error);
      props.Login.error = "";
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.Login.openModal &&
      this.props.Login.openRequestBasedTransfer &&
      nextState.isInitialRender === false &&
      nextState.selectedRecord !== this.state.selectedRecord
    ) {
      return false;
    } else {
      return true;
    }
  }

  openFilter = () => {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false, filterSubmitValueEmpty: true },
    };
    this.props.updateStore(updateInfo);
  };

  // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
  sampleStorageTransDataStateChange = (event) => {
    this.setState({
        sampleStorageTransDataResult: process(this.state.sampleStorageTransData ? this.state.sampleStorageTransData : [], event.dataState),
        sampleStorageTransDataState: event.dataState
    });
  }

  // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
  bioEcatalogueDataStateChange = (event) => {
    this.setState({
        bioEcatalogueDataResult: process(this.state.bioEcatalogueData ? this.state.bioEcatalogueData : [], event.dataState),
        bioEcatalogueDataState: event.dataState
    });
  }

  onSplitterChange = (event) => {
        this.setState({ panes: event.newState});
    };

  render() {
    let obj = convertDateValuetoString(
      this.props.Login.masterData.realFromDate,
      this.props.Login.masterData.realToDate,
      this.props.Login.userInfo
    );
    let breadCrumbData = [
      {
        label: "IDS_FROM",
        value: obj.breadCrumbFrom,
      },
      {
        label: "IDS_TO",
        value: obj.breadCrumbto,
      },
    ];
    this.fromDate = this.props.Login.masterData?.fromDate;
    this.toDate = this.props.Login.masterData?.toDate;
    if (this.props.Login.masterData && this.props.Login.masterData.realSelectedFilterStatus) {
      breadCrumbData.push({
        label: "IDS_REQUESTTYPE",
        value: this.props.Login.masterData.selectedTransferType
          ? this.props.Login.masterData.selectedTransferType.label
          : "-",
      });
      breadCrumbData.push({
        label: "IDS_FORMSTATUS",
        value: this.props.Login.masterData.realSelectedFilterStatus
          ? this.props.Login.masterData.realSelectedFilterStatus.label
          : "-",
      });
    }
    const AmmendID =
      this.state.controlMap.has("AmendBioEcatalogueReqApproval") &&
      this.state.controlMap.get("AmendBioEcatalogueReqApproval").ncontrolcode;
    const acceptID =
      this.state.controlMap.has("ApproveBioEcatalogueReqApproval") &&
      this.state.controlMap.get("ApproveBioEcatalogueReqApproval").ncontrolcode;
    const rejectID =
      this.state.controlMap.has("RejectBioEcatalogueRequest") &&
      this.state.controlMap.get("RejectBioEcatalogueRequest").ncontrolcode;
    const ViewID =
      this.state.controlMap.has("ViewBioEcatalogueReqApproval") &&
      this.state.controlMap.get("ViewBioEcatalogueReqApproval").ncontrolcode;

    this.searchFieldList = ["sformnumber", "sthirdpartyname", "strrequesteddate", "stransdisplaystatus", "ssitename"];

    const filterParam = {
      inputListName: "lstBioEcatalogueReqApproval",
      selectedObject: "lstBioEcatalogueRequestDetails",
      primaryKeyField: "necatrequestreqapprovalcode",
      fetchUrl: "bioecataloguereqapproval/getSelectedBioEcatalogueReqApproval",
      masterData: this.props.Login.masterData || {},
      fecthInputObject: {
        userinfo: this.props.Login.userInfo,
        necatrequestreqapprovalcode:
          this.props.Login.masterData.lstBioEcatalogueReqApproval &&
          this.props.Login.masterData.lstBioEcatalogueReqApproval.necatrequestreqapprovalcode,

        ntransfertype:
          this.props.Login.masterData.selectedTransferType && this.props.Login.masterData.selectedTransferType.value,

        ntransactionstatus:
          this.props.Login.masterData.selectedFilterStatus && this.props.Login.masterData.selectedFilterStatus.value,
      },
      clearFilter: "no",
      updatedListname: "selectedBioEcatalogueReqApproval",
      searchRef: this.searchRef,
      searchFieldList: this.searchFieldList,
      changeList: [],
      isSortable: true,
      sortList: "lstBioEcatalogueReqApproval",
      skip: 0,
      take: this.state.take,
    };
    this.extractedColumnList = [
      {
        idsName: "IDS_BIOPROJECT",
        dataField: "sprojecttitle",
        width: "100px",
      },
      {
        idsName: "IDS_BIOSAMPLETYPE",
        dataField: "sproductname",
        width: "100px",
      },
      {
        idsName: "IDS_PARENTSAMPLECODE",
        dataField: "sparentsamplecode",
        width: "100px",
      },
      {
        idsName: "IDS_REQUESTEDNOOFSAMPLES",
        dataField: "nreqnoofsamples",
        width: "100px",
      },
      {
        idsName: "IDS_REQUESTEDMINVOLµL",
        dataField: "sreqminvolume",
        width: "100px",
      },
      {
        idsName: "IDS_AVAILABLENOOFSAMPLES",
        dataField: "navailablenoofsample",
        width: "120px",
      },
      {
        idsName: "IDS_ACCEPTNOOFSAMPLES",
        dataField: "naccnoofsamples",
        width: "100px",
      },
      {
        idsName: "IDS_ACCEPTEDMINVOLµL",
        dataField: "saccminvolume",
        width: "100px",
      },
    ];
    this.extractedColumnList1 = [
      {
        idsName: "IDS_BIOPROJECT",
        dataField: "sprojecttitle",
        width: "150px",
      },
      {
        idsName: "IDS_BIOSAMPLETYPE",
        dataField: "sproductname",
        width: "150px",
      },
      {
        idsName: "IDS_PARENTSAMPLECODE",
        dataField: "sparentsamplecode",
        width: "150px",
      },
      {
        idsName: "IDS_REPOSITORYID",
        dataField: "spositionvalue",
        width: "150px",
      },
      {
        idsName: "IDS_VOLUMEµL",
        dataField: "sqty",
        width: "150px",
      },
    ];
    this.extractedColumnList2 = [
      {
        idsName: "IDS_REMARKS",
        dataField: "sapprovalremarks",
        width: "150px",
      },
    ];
    const SubFields =
      this.state?.selectedFilterRecord?.ntransfertypecode?.value === 2
        ? [
            { [designProperties.VALUE]: "ssitename" },
            { [designProperties.VALUE]: "sthirdpartyname" },
            { [designProperties.VALUE]: "strrequesteddate" },
          ]
        : [{ [designProperties.VALUE]: "ssitename" }, { [designProperties.VALUE]: "strrequesteddate" }];

    return (
      <>
        <Preloader loading={this.state.loading} />
        <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
          {breadCrumbData.length > 0 ? (
            <Affix top={53}>
              <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
            </Affix>
          ) : (
            ""
          )}
          <Row noGutters={"true"}>
            <Col
              md={12}
              className="parent-port-height sticky_head_parent"
              ref={(parentHeight) => {
                this.parentHeight = parentHeight;
              }}
            >
              <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? "active-popup" : ""}`}>
                {/* <SplitterLayout
                  borderColor="#999"
                  percentage={false}
                  primaryIndex={1}
                  secondaryInitialSize={430}
                  onSecondaryPaneSizeChange={this.paneSizeChange}
                  primaryMinSize={400}
                  secondaryMinSize={320}
                > */}
                 <Splitter className='layout-splitter' orientation="horizontal"
                                                           panes={this.state.panes} onChange={this.onSplitterChange}>
                    <SplitterPane  size="30%" min="25%">
                  <div style={{ minWidth: 320, display: "flex", flexDirection: "column", height: "100%" }}>
                    <TransactionListMasterJsonView
                      splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                      needMultiSelect={false}
                      masterList={
                        this.props.Login?.masterData?.searchedData ||
                        this.props.Login?.masterData?.lstBioEcatalogueReqApproval ||
                        []
                      }
                      selectedMaster={[this.props.Login?.masterData?.selectedBioEcatalogueReqApproval] || []}
                      primaryKeyField="necatrequestreqapprovalcode"
                      getMasterDetail={(lstBioEcatalogueReqApproval) =>
                        this.props.getSelectedBioEcatalogueReqApproval(
                          lstBioEcatalogueReqApproval,
                          this.props.Login.userInfo,
                          this.props.Login.masterData
                        )
                      }
                      filterParam={filterParam}
                      subFields={SubFields}
                      subFieldsLabel={false}
                      additionalParam={[""]}
                      mainField={"sformnumber"}
                      filterColumnData={this.props.filterTransactionList}
                      showFilter={this.props.Login.showFilter}
                      openFilter={this.openFilter}
                      closeFilter={this.closeFilter}
                      onFilterSubmit={this.onFilterSubmit}
                      statusFieldName="stransdisplaystatus"
                      statusField="ntransactionstatus"
                      statusColor="#999"
                      //secondaryField="ssitetypename"
                      showStatusIcon={false}
                      showStatusName={true}
                      showStatusLink={true}
                      needFilter={true}
                      searchRef={this.searchRef}
                      skip={this.state.skip}
                      take={this.state.take}
                      handlePageChange={this.handlePageChange}
                      showStatusBlink={true}
                      callCloseFunction={true}
                      pageable={true}
                      childTabsKey={[]}
                      splitModeClass={
                        this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50
                          ? "split-mode"
                          : this.state.splitChangeWidthPercentage > 40
                          ? "split-md"
                          : ""
                      }
                      commonActions={
                        <>
                          <ProductList className="d-flex product-category float-right">
                            <Button
                              className="btn btn-circle outline-grey ml-2 p-0"
                              variant="link"
                              onClick={() => this.updatedAccepteVolume(AmmendID, "Ammend", "IDS_AMENDECATALOGREQ")}
                              hidden={this.state.userRoleControlRights.indexOf(AmmendID) === -1}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                id: "IDS_AMENDECATALOGREQ",
                              })}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                            <Button
                              className="btn btn-circle outline-grey ml-2 p-0"
                              variant="link"
                              onClick={this.openApproveRemarksModal}
                              hidden={this.state.userRoleControlRights.indexOf(acceptID) === -1}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                id: "IDS_APPROVECATALOGREQ",
                              })}
                            >
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </Button>

                            <Button
                              className="btn btn-circle outline-grey ml-2 p-0"
                              variant="link"
                              onClick={() => this.onRejectRequest(rejectID, "Rejected", "IDS_REJECTCATELOGREQ")}
                              hidden={this.state.userRoleControlRights.indexOf(rejectID) === -1}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                id: "IDS_REJECTCATELOGREQ",
                              })}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>

                            <Button
                              className="btn btn-circle outline-grey ml-2 p-0"
                              variant="link"
                              onClick={() => this.onReload()}
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                id: "IDS_REFRESH",
                              })}
                            >
                              <RefreshIcon className="custom_icons" />
                            </Button>
                          </ProductList>
                        </>
                      }
                      filterComponent={[
                        {
                          "Date Filter": (
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
                          ),
                        },
                      ]}
                    />
                  </div>
                    </SplitterPane>
                    <SplitterPane size="70%" min="25%">
                  <ContentPanel className="panel-main-content">
                    <Card>
                      {this.props.Login.masterData?.selectedBioEcatalogueReqApproval ? (
                        Object.entries(this.props.Login.masterData?.selectedBioEcatalogueReqApproval).length > 0 ? (
                          <>
                            {/* <Col md={12}> */}
                            <DataGrid
                              primaryKeyField={"necatrequestreqapprovalcode"}
                              dataResult={
                                // this.state.dataResult === undefined ?
                                process(
                                  this.props.Login.masterData &&
                                    this.props.Login.masterData?.realLstBioEcatalogueRequestDetails
                                    ? this.props.Login?.masterData?.realLstBioEcatalogueRequestDetails.map(req => ({ ...req,
                                      naccnoofsamples: req.naccnoofsamples === -1 ? '-' : req.naccnoofsamples,
                                      saccminvolume: req.saccminvolume === '-1' ? '-' : req.saccminvolume,
                                    }))
                                    : [],
                                  this.state.bioEcatalogueDataState
                                ) || []
                                // : this.state.dataResult
                              }
                              dataState={this.state.bioEcatalogueDataState || []}
                              data={
                                // this.state.data === undefined ?
                                (this.props.Login.masterData &&
                                  this.props.Login.masterData?.realLstBioEcatalogueRequestDetails) ||
                                []
                                // : this.state.data
                              }
                              dataStateChange={this.bioEcatalogueDataStateChange}
                              extractedColumnList={this.extractedColumnList}
                              controlMap={this.state.controlMap}
                              userRoleControlRights={this.state.userRoleControlRights}
                              inputParam={this.props.Login.inputParam}
                              userInfo={this.props.Login.userInfo}
                              methodUrl="BioEcatalogueReqApproval"
                              deleteRecord={this.deleteRecord}
                              pageable={true}
                              scrollable={"scrollable"}
                              isToolBarRequired={false}
                              selectedId={this.props.Login.selectedId}
                              hideColumnFilter={false}
                              groupable={false}
                              isActionRequired={false}
                                    gridHeight={"600px"}
                            />
                            {/* </Col> */}
                          </>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </Card>
                  </ContentPanel>
                      </SplitterPane>
                </Splitter>
                {/* </SplitterLayout> */}
              </ListWrapper>
            </Col>
          </Row>
        </ListWrapper>
        {this.props.Login.openModalShow ? (
          <ModalShow
            modalShow={this.props.Login.openModalShow}
            enforceFocus={false}
            closeModal={this.closeModalShow}
            size="xl"
            onSaveClick={
              this.props.Login.openDatatable3 ? () => this.updatedApprovedRecord(acceptID) : this.onSaveAcceptedvolume
            }
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={""}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedChildRecord || {}}
            needSave={this.props.Login.openDatatable2}
            modalTitle={
              this.props.Login.openDatatable3
                ? this.props.intl.formatMessage({ id: "IDS_APPROVECATALOGREQ" })
                : this.props.Login.openDatatable2
                ? this.props.intl.formatMessage({ id: "IDS_VIEWSAMPLES" }) 
                : this.props.intl.formatMessage({ id: "IDS_AMENDECATALOGREQ" })
            }
            modalBody={
              this.props.Login.loadEsignStateHandle ? (
                <EsignStateHandle
                  operation={this.props.Login.operation}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedChildRecord || {}}
                  childDataChange={this.subModalChildDataChange}
                />
              ) : this.props.Login.openDatatable ? (
                <div>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col md={5}>
                      <h6 style={{ fontWeight: 500, margin: 0 }}>
                        <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                          {this.props.intl.formatMessage({ id: "IDS_REQUESTFORMNO" })}:
                        </span>{" "}
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#000" }}>
                          {this.props.Login?.masterData?.selectedBioEcatalogueReqApproval?.sformnumber || ""}
                        </span>
                      </h6>
                    </Col>

                    <Col md={5}>
                      <h6 style={{ fontWeight: 500, margin: 0 }}>
                        <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                          {this.props.intl.formatMessage({ id: "IDS_REQSITENAME" })}:
                        </span>{" "}
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#000" }}>
                          {this.props.Login?.masterData?.selectedBioEcatalogueReqApproval?.ssitename || ""}
                        </span>
                      </h6>
                    </Col>

                    <Col md={2}> {/* Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180 */}
                      <Button className="btn-user btn-primary-blue" onClick={() => this.onCheckAvalability()}>
                          <FontAwesomeIcon icon={faSave} /> { }
                          <FormattedMessage id='IDS_VALIDATE' defaultMessage='Validate' />
                      </Button>
                    </Col>

                  </Row>

                  {/* Added map for lstBioEcatalogueRequestDetails by Gowtham R on nov 18 2025 for jira.id:BGSI-180 */}
                  <AcceptBioEcatalogueReqApproval
                    lstBioEcatalogueRequestDetails={(
                      this.state.selectedChildRecord?.lstBioEcatalogueRequestDetails || 
                      this.props.Login?.masterData?.lstBioEcatalogueRequestDetails).map(req => {
                      return {
                        ...req,
                        naccnoofsamples: req['naccnoofsamples'] === -1 ? req['nreqnoofsamples'] : req['naccnoofsamples'],
                        saccminvolume: req['saccminvolume'] === '-1' ? req['sreqminvolume'] : req['saccminvolume']
                      }
                    })}
                    lstReason={this.state.lstReason}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    operation={this.props.Login.operation}
                    childDataChange={this.childDataChange}
                    selectedRecord={this.state.selectedChildRecord || {}}
                    ViewID={ViewID}
                  />
                </div>
              ) : this.props.Login.openDatatable3 ? (
                <div>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col md={5}>
                      <h6 style={{ fontWeight: 500, margin: 0 }}>
                        <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                          {this.props.intl.formatMessage({ id: "IDS_REQUESTFORMNO" })}:
                        </span>{" "}
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#000" }}>
                          {this.props.Login?.masterData?.selectedBioEcatalogueReqApproval?.sformnumber || ""}
                        </span>
                      </h6>
                    </Col>

                    <Col md={4}>
                      <h6 style={{ fontWeight: 500, margin: 0 }}>
                        <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                          {this.props.intl.formatMessage({ id: "IDS_REQSITENAME" })}:
                        </span>{" "}
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#000" }}>
                          {this.props.Login?.masterData?.selectedBioEcatalogueReqApproval?.ssitename || ""}
                        </span>
                      </h6>
                    </Col>
                  </Row>

                  <ApprovepopupBioEcatalogueReqApproval
                    lstBioEcatalogueReqApproval={this.props.Login?.masterData?.lstBioEcatalogueReqApproval}
                    selectedBioEcatalogueReqApproval={this.props.Login?.masterData?.selectedBioEcatalogueReqApproval}
                    lstReason={this.state.lstReason}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    operation={this.props.Login.operation}
                    childDataChange={this.childDataChange}
                    selectedRecord={this.state.selectedChildRecord || {}}
                    ViewID={ViewID}
                  />
                </div>
              ) : this.props.Login.openDatatable2 ? (
                <DataGrid
                  key="accept_datatable_2"
                  primaryKeyField={"necateloguerequestdetailcode"}
                  dataResult={
                    process(
                      this.props.Login.masterData && this.props.Login.masterData?.lstBioEcatalogueRequestDetails2
                        ? this.props.Login?.masterData?.lstBioEcatalogueRequestDetails2
                        : [],
                      this.state.sampleStorageTransDataState
                    ) || []
                  }
                  dataState={this.state.sampleStorageTransDataState || []}
                  data={
                    (this.props.Login.masterData && this.props.Login.masterData?.lstBioEcatalogueRequestDetails2) || []
                  }
                  dataStateChange={this.sampleStorageTransDataStateChange}
                  extractedColumnList={this.extractedColumnList1}
                  controlMap={this.state.controlMap}
                  userRoleControlRights={this.state.userRoleControlRights}
                  inputParam={this.props.Login.inputParam}
                  userInfo={this.props.Login.userInfo}
                  methodUrl="BioEcatalogueReqApproval"
                  deleteRecord={this.deleteRecord}
                  pageable={true}
                  scrollable={"scrollable"}
                  isToolBarRequired={false}
                  selectedId={this.props.Login.selectedId}
                  hideColumnFilter={false}
                  groupable={false}
                  isActionRequired={false}
                  gridHeight={"400px"}
                />
              ) : (
                ""
              )
            }
          />
        ) : null}
        {this.props.Login.openModal ? (
          <SlideOutModal
            show={this.props.Login.openModal}
            closeModal={this.closeModal}
            operation={this.props.Login.operation}
            inputParam={this.props.Login.inputParam}
            screenName={this.props.Login.screenName}
            onSaveClick={this.onRejectRequest}
            esign={this.props.Login.loadEsign}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            mandatoryFields={this.mandatoryFields}
            addComponent={
              this.props.Login.loadEsign ? (
                <Esign
                  operation={this.props.Login.operation}
                  onInputOnChange={this.onInputOnChange}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
              ) : null
            }
          />
        ) : null}
      </>
    );
  }

  closeModalShow = () => {
    let loadEsign = this.props.Login.loadEsign;

    let modalShow = this.props.Login.modalShow;
    let selectedRecord = this.props.Login.selectedRecord;
    let selectedChildRecord = this.state.selectedChildRecord;
    let openDatatable = this.props.Login.openDatatable;
    let openDatatable2 = this.props.Login.openDatatable2;
    let openModalShow = this.props.Login.openModalShow;
    let openDatatable3 = this.props.Login.openDatatable3;

    const masterData = { ...(this.props.Login.masterData || {}) };

    if (this.props.Login.loadEsign) {
      loadEsign = false;
    } else {
      modalShow = false;
      selectedRecord = {};
      openModalShow = openDatatable ? false : true;
      openDatatable = openDatatable2 ? true : false;
      openDatatable2 = openDatatable2 ? false : true;
    }

    if (openDatatable3 === true) {
      openModalShow = false;
      openDatatable = false;
      openDatatable2 = false;
      openDatatable3 = false;
      modalShow = false;
    }

    if (openDatatable === false && openDatatable2 === false) {
      this.setState({ selectedChildRecord: false });
    }

    // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180
    if (this.props.Login.openDatatable && this.props.Login.openDatatable2 === false) {
      masterData['lstBioEcatalogueRequestDetails'] = this.props.Login.masterData.realLstBioEcatalogueRequestDetails;
      selectedChildRecord={};
    }
    // if (openDatatable === false) {
    //   masterData.lstBioEcatalogueRequestDetails = (masterData.lstBioEcatalogueRequestDetails || []).map((item) => {
    //     return {
    //       ...item,
    //       saccminvolume: 0,
    //       naccnoofsamples: 0,
    //     };
    //   });
    // }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        masterData,
        modalShow,
        selectedRecord,
        selectedId: null,
        loadEsign,
        openModalShow,
        loadEsignStateHandle: false,
        openDatatable,
        openDatatable2,
        selectedChildRecord,
        // openDatatable2: false,
        openModal: false,
        openDatatable3,
      },
    };
    this.props.updateStore(updateInfo);
  };

  componentDidUpdate(previousProps) {
    if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
      const userRoleControlRights = [];
      if (this.props.Login.userRoleControlRights) {
        this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] &&
          Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map((item) =>
            userRoleControlRights.push(item.ncontrolcode)
          );
      }

      const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode);
      this.setState({
        userRoleControlRights,
        controlMap,
        data: this.props.Login.masterData.ControlRights,
      });
    } 
    
    // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
    if (this.props.Login.masterData?.lstBioEcatalogueRequestDetails !== previousProps.Login.masterData?.lstBioEcatalogueRequestDetails && 
      this.props.Login.userInfo.nformcode === previousProps.Login.userInfo.nformcode) {
        let { bioEcatalogueDataState } = this.state;
        if (this.props.Login.bioEcatalogueDataState === undefined) {
            bioEcatalogueDataState = { skip: 0, take: this.state.bioEcatalogueDataState.take }
        }
        if (this.state.bioEcatalogueDataResult.data) {
            if (this.state.bioEcatalogueDataResult.data.length === 1) {
                let skipcount = this.state.bioEcatalogueDataState.skip > 0 ? (this.state.bioEcatalogueDataState.skip - this.state.bioEcatalogueDataState.take) :
                    this.state.bioEcatalogueDataState.skip
                bioEcatalogueDataState = { skip: skipcount, take: this.state.bioEcatalogueDataState.take }
            }
        }
        this.setState({
            bioEcatalogueData: this.props.Login.masterData?.lstBioEcatalogueRequestDetails, selectedRecord: this.props.Login.selectedRecord,
            bioEcatalogueDataResult: process(this.props.Login.masterData?.lstBioEcatalogueRequestDetails ? this.props.Login.masterData?.lstBioEcatalogueRequestDetails : [], bioEcatalogueDataState),
            bioEcatalogueDataState
        });
    }

    // Added by Gowtham on nov 19 2025 for jira.id:BGSI-170
    if (this.props.Login.masterData?.lstSelectedsamplestoragetransaction !== previousProps.Login.masterData?.lstSelectedsamplestoragetransaction && 
      this.props.Login.userInfo.nformcode === previousProps.Login.userInfo.nformcode) {
        let { sampleStorageTransDataState } = this.state;
        if (this.props.Login.sampleStorageTransDataState === undefined) {
            sampleStorageTransDataState = { skip: 0, take: this.state.sampleStorageTransDataState.take }
        }
        if (this.state.dataResult.data) {
            if (this.state.dataResult.data.length === 1) {
                let skipcount = this.state.sampleStorageTransDataState.skip > 0 ? (this.state.sampleStorageTransDataState.skip - this.state.sampleStorageTransDataState.take) :
                    this.state.sampleStorageTransDataState.skip
                sampleStorageTransDataState = { skip: skipcount, take: this.state.sampleStorageTransDataState.take }
            }
        }
        this.setState({
            sampleStorageTransData: this.props.Login.masterData?.lstSelectedsamplestoragetransaction, selectedRecord: this.props.Login.selectedRecord,
            sampleStorageTransDataResult: process(this.props.Login.masterData?.lstSelectedsamplestoragetransaction ? this.props.Login.masterData?.lstSelectedsamplestoragetransaction : [], sampleStorageTransDataState),
            sampleStorageTransDataState
        });
    }

    let { selectedRecord, selectedChildRecord, selectedFilterRecord, selectedFilter, skip, take, dataState } =
      this.state;
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
        skip: 0,
        take: take,
      };
      skip = 0;
      take = take;
    }

    if (updateState) {
      this.setState({
        selectedRecord,
        selectedFilterRecord,
        selectedFilter,
        selectedChildRecord,
        dataState,
        skip,
        take,
      });
    }
  }

  componentWillUnmount() {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        masterData: [],
        inputParam: undefined,
      },
    };
    this.props.updateStore(updateInfo);
  }

  closeFilter = () => {
    let masterData = this.props.Login.masterData;
    masterData["fromDate"] = this.props.Login.masterData.realFromDate || new Date();
    masterData["toDate"] = this.props.Login.masterData.realToDate || new Date();
    let selectedFilter = {
      fromdate: this.props.Login.masterData.realFromDate || new Date(),
      todate: this.props.Login.masterData.realToDate || new Date(),
    };
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        showFilter: false,
        masterData,
        selectedFilter,
        filterSubmitValueEmpty: false,
      },
    };
    this.props.updateStore(updateInfo);
  };

  onFilterSubmit = () => {
    const realFromDate = rearrangeDateFormat(
      this.props.Login.userInfo,
      this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate
    );
    const realToDate = rearrangeDateFormat(
      this.props.Login.userInfo,
      this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate
    );
    const ntransCode = this.state.selectedFilterRecord?.ntranscode || -1;
    const nTransferTypeCode = this.state.selectedFilterRecord?.ntransfertypecode || -1;
    let masterDataUpdated = {
      ...this.props.Login.masterData,
      realFromDate,
      realToDate,
      selectedFilterStatus: ntransCode,
      realSelectedFilterStatus: ntransCode,
    };
    const obj = convertDateValuetoString(
      this.state.selectedFilterRecord.fromDate || this.props.Login.masterData.fromDate,
      this.state.selectedFilterRecord.toDate || this.props.Login.masterData.toDate,
      this.props.Login.userInfo
    );
    let inputData = {
      fromDate: obj.fromDate,
      toDate: obj.toDate,
      ntransCode: ntransCode.value,
      ntransfertypecode: nTransferTypeCode.value,
      userinfo: this.props.Login.userInfo,
    };
    this.setState({ loading: true });
    rsapi()
      .post("bioecataloguereqapproval/getBioEcatalogueReqApproval", {
        ...inputData,
      })
      .then((response) => {
        let masterData = {};
        masterData = { ...masterDataUpdated, ...response.data };
        masterData["fromDate"] = this.state.selectedFilterRecord.fromDate;
        masterData["toDate"] = this.state.selectedFilterRecord.toDate;
        this.searchRef.current.value = "";
        delete masterData["searchedData"];
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            filterSubmitValueEmpty: false,
            showFilter: false,
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        } else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      });
  };

  // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180
  onCheckAvalability = () => {
    this.setState({ loading: true });
    let { selectedChildRecord } = this.state;
    let { masterData } = this.props.Login;
    rsapi()
      .post("bioecataloguereqapproval/getBioEcatalogueReqApprovalDetails", {
        necatrequestreqapprovalcode: masterData.selectedBioEcatalogueReqApproval?.necatrequestreqapprovalcode,
        lstBioEcatalogueRequestDetails: selectedChildRecord.lstBioEcatalogueRequestDetails,
        ntransfertype: masterData.realselectedTransferType.value,
        ntransactionstatus: masterData.realSelectedFilterStatus.value,
        userinfo: this.props.Login.userInfo
      })
      .then((response) => {
        masterData = { ...masterData, ...response.data };
        selectedChildRecord = { ...response.data };
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            selectedChildRecord
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        } else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      });
  }

  childFilterDataChange = (selectedFilterRecord) => {
    let isInitialRender = false;
    this.setState({
      selectedFilterRecord: {
        ...selectedFilterRecord,
      },
      isInitialRender,
    });
  };
  childDataChange = (selectedRecord) => {
    let isInitialRender = false;
    this.setState({
      selectedChildRecord: {
        ...selectedRecord,
      },
      isInitialRender,
    });
  };
  onReload = () => {
    const { masterData, userInfo } = this.props.Login;

    if (!masterData || !masterData.realFromDate || !masterData.realToDate) {
      toast.warn("No data available to reload");
      return;
    }

    const obj = convertDateValuetoString(masterData.realFromDate, masterData.realToDate, userInfo);
    const realFromDate = obj.fromDate;
    const realToDate = obj.toDate;

    const ntransCodeObj = masterData.realSelectedFilterStatus || -1;
    const ntransCodeValue = ntransCodeObj && ntransCodeObj.value !== undefined ? ntransCodeObj.value : -1;
    const transferTypeObj = masterData.realselectedTransferType || null;
    const ntransfertypecode = transferTypeObj && transferTypeObj.value !== undefined ? transferTypeObj.value : -1;
    const inputData = {
      fromDate: realFromDate,
      toDate: realToDate,
      ntransCode: ntransCodeValue,
      userinfo: userInfo,
      ntransfertypecode,
    };

    this.setState({ loading: true });

    rsapi()
      .post("bioecataloguereqapproval/getBioEcatalogueReqApproval", inputData)
      .then((response) => {
        const masterDataUpdated = { ...masterData, ...response.data };
        delete masterDataUpdated["searchedData"];
        masterDataUpdated.selectedTransferType =
          masterData.selectedTransferType || masterDataUpdated.selectedTransferType;
        masterDataUpdated.realselectedTransferType =
          masterData.realselectedTransferType || masterDataUpdated.realselectedTransferType;
        this.props.updateStore({
          typeName: DEFAULT_RETURN,
          data: {
            masterData: masterDataUpdated,
            selectedRecord: {},
            selectedChildRecord: {},
            dataState: {
              take: this.state.dataState ? this.state.dataState.take : this.state.take || 10,
              filter: null,
              skip: 0,
              sort: [],
            },
            showFilter: false,
            filterSubmitValueEmpty: false,
          },
        });

        if (this.searchRef && this.searchRef.current) {
          this.searchRef.current.value = "";
        }

        this.setState({ loading: false });
      })
      .catch((error) => {
        const status = error?.response?.status;
        if ([401, 403].includes(status)) {
          this.props.updateStore({
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: status,
            },
          });
        } else if (status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error?.response?.data || error.message);
        }
        this.setState({ loading: false });
      });
  };

  // onAcceptRequest = (validateID, operation, screenName) => {
  //   let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval.ntransactionstatus;
  //   if (ntransactionstatus !== transactionStatus.REQUESTED || ntransactionstatus==transactionStatus.REJECT) {
  //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
  //   } else {
  //     this.updatedAccepteVolume(validateID);
  //   }
  // };
  onRejectRequest = (validateID, operation, screenName) => {
    let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.ntransactionstatus;
    const listofDetails = this.props.Login.masterData?.lstBioEcatalogueRequestDetails || [];

    if (
      ntransactionstatus === transactionStatus.APPROVED ||
      ntransactionstatus === transactionStatus.REJECT ||
      ntransactionstatus === transactionStatus.AMENDED ||
      ntransactionstatus === transactionStatus.CANCELLED ||
      !Array.isArray(listofDetails) ||
      listofDetails.length === 0
    ) {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
    } else {
      this.updatedRejectRecord(validateID);
    }
  };

  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    let selectedRecord = this.props.Login.selectedRecord;

    if (this.props.Login.loadEsign) {
      if (this.props.Login.operation === "delete") {
        loadEsign = false;
        openModal = false;
        selectedRecord = {};
      } else {
        loadEsign = false;
        openModal = false;
        selectedRecord = {};
      }
    } else {
      loadEsign = false;
      selectedRecord = {};
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openModal, loadEsign, selectedRecord, selectedId: null },
    };
    this.props.updateStore(updateInfo);
  };
  onInputOnChange = (event) => {
    const selectedRecord = this.state.selectedRecord || {};

    if (event.target.type === "checkbox") {
      selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
    } else {
      selectedRecord[event.target.name] = event.target.value;
    }
    this.setState({ selectedRecord });
  };

  updatedAccepteVolume = (acceptID) => {
    let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.ntransactionstatus;
    const listofDetails = this.props.Login.masterData?.lstBioEcatalogueRequestDetails || [];
    if (
      ntransactionstatus === transactionStatus.ACCEPT ||
      ntransactionstatus === transactionStatus.REJECT ||
      // ntransactionstatus === transactionStatus.AMENDED ||
      ntransactionstatus === transactionStatus.APPROVED ||
      ntransactionstatus === transactionStatus.CANCELLED ||

      !Array.isArray(listofDetails) ||
      listofDetails.length === 0
    ) {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
    } else {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          openModalShow: true,
          loadEsignStateHandle: false,
          openDatatable: true,
          openDatatable2 : false
        },
      };
      this.props.updateStore(updateInfo);
    }
  };
  updateApproveStatus = (acceptID) => {
    let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.ntransactionstatus;
    const listofDetails = this.props.Login.masterData?.lstBioEcatalogueRequestDetails || [];
    if (
      ntransactionstatus === transactionStatus.REJECT ||
      !Array.isArray(listofDetails) ||
      listofDetails.length === 0
    ) {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
    } else {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          openModalShow: true,
          loadEsignStateHandle: false,
          openDatatable: true,
        },
      };
      this.props.updateStore(updateInfo);
    }
  };
  onSaveAcceptedvolume = () => {
    const acceptID =
      this.state.controlMap.has("ApproveBioEcatalogueReqApproval") &&
      this.state.controlMap.get("ApproveBioEcatalogueReqApproval").ncontrolcode;

    let inputData = [];
    inputData["bioecataloguerequestdetails"] = this.props.Login.masterData.lstBioEcatalogueRequestDetails;

    let lstBioEcatalogueRequestDetails = this.props.Login.masterData.lstBioEcatalogueRequestDetails || [];

    if (this.state.selectedChildRecord?.lstBioEcatalogueRequestDetails?.length) {
      const updatedList = lstBioEcatalogueRequestDetails.map((item, index) => {
        const selectedDetail = this.state.selectedChildRecord.lstBioEcatalogueRequestDetails[index];
        return {
          ...item,
          naccnoofsamples: selectedDetail?.naccnoofsamples || item.naccnoofsamples || 0,
          saccminvolume: selectedDetail?.saccminvolume || item.saccminvolume || "",
        };
      });
      inputData["bioecataloguerequestdetails"] = updatedList;

      // Commented by Gowtham R on nov 18 2025 for jira.id:BGSI-180
      // const invalid = updatedList.find(
      //   (r) =>
      //     !r.naccnoofsamples ||
      //     // || r.naccnoofsamples == 0
      //     !r.saccminvolume ||
      //     // || r.saccminvolume == 0
      //     (r.navailablenoofsample && r.naccnoofsamples > r.navailablenoofsample)
      // );

      // if (invalid)
      //   return toast.warn(
      //     this.props.intl.formatMessage({
      //       id:
      //         invalid.navailablenoofsample && invalid.naccnoofsamples > invalid.navailablenoofsample
      //           ? "IDS_ACCEPTNOSAMPLES"
      //           : "IDS_VALIDATIONFORACCEPTVALUES",
      //     })
      //   );
      if (updatedList.filter(req => req.naccnoofsamples === '0').length === updatedList.length) {
        return toast.warn(this.props.intl.formatMessage({ id: "IDS_VALIDATIONFORACCEPTVALUES" }));
      } else if (updatedList.filter(req => req.naccnoofsamples > req.navailablenoofsample ).length > 0) {
        return toast.warn(this.props.intl.formatMessage({ id: "IDS_ACCEPTNOSAMPLES" }));
      }
    } else {
      inputData["bioecataloguerequestdetails"] = lstBioEcatalogueRequestDetails;
    }

    inputData["necatrequestreqapprovalcode"] = lstBioEcatalogueRequestDetails?.[0]?.necatrequestreqapprovalcode;
    inputData["norginsitecode"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.norginsitecode;
    inputData["sformnumber"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.sformnumber;
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["ntransfertype"] = this.props.Login.masterData?.realselectedTransferType?.value;
    inputData["ntransactionstatus"] = this.props.Login.masterData?.realSelectedFilterStatus?.value;

    let inputParam = {
      inputData: inputData,
      screenName: "IDS_AMENDECATALOGREQ",
      operation: "Ammend",
    };

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, acceptID)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          openModal: true,
          openDatatable: false,
          openModalShow: false,
          screenData: { inputParam },
          screenName: "IDS_AMENDECATALOGREQ",
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      const amendID =
      this.state.controlMap.has("AmendBioEcatalogueReqApproval") &&
      this.state.controlMap.get("AmendBioEcatalogueReqApproval").ncontrolcode;

      inputData["ncontrolcode"]=amendID;

      this.updatedUserAcceptedVolumn(inputParam.inputData);
    }
  };
  updatedUserAcceptedVolumn = (inputParam) => {
    rsapi()
      .post("bioecataloguereqapproval/updatedUserAcceptedVolume", { ...inputParam })
      .then((response) => {
        let masterData = { ...this.props.Login.masterData };
        let responseData = response.data;
        let lstBioEcatalogueReqApproval = this.props.Login.masterData?.lstBioEcatalogueReqApproval;
        const index = lstBioEcatalogueReqApproval.findIndex(
          (item) =>
            item.necatrequestreqapprovalcode ===
            responseData.selectedBioEcatalogueReqApproval?.necatrequestreqapprovalcode
        );
        if (index !== -1) {
          lstBioEcatalogueReqApproval[index] = responseData.selectedBioEcatalogueReqApproval;
        }
        masterData["lstBioEcatalogueReqApproval"] = lstBioEcatalogueReqApproval;
        masterData = { ...masterData, ...responseData };

        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            loadEsign: false,
            openModal: false,
            openModalShow: false,
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false, selectedChildRecord: {} });
      })
      .catch((error) => {
        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        } else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      });
  };

  updatedRejectRecord = (validateID) => {
    let inputData = [];

    inputData["bioecataloguerequestdetails"] = this.props.Login.masterData.lstBioEcatalogueRequestDetails;
    inputData["necatrequestreqapprovalcode"] =
      this.props.Login.masterData?.lstBioEcatalogueRequestDetails[0]?.necatrequestreqapprovalcode;
    inputData["norginsitecode"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.norginsitecode;
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["sformnumber"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.sformnumber;
    inputData["ntransfertype"] = this.props.Login.masterData?.realselectedTransferType?.value;
    inputData["ntransactionstatus"] = this.props.Login.masterData?.realSelectedFilterStatus?.value;
    //Changed by Mullai Balaji while esign on at the time validateID contains all  deatils about bioecataloguerequestdetails
    inputData["ncontrolcode"]=validateID.ncontrolcode || validateID;
    let inputParam = {
      inputData: inputData,
      screenName: "IDS_REJECTCATELOGREQ",
      operation: "update",
    };

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, validateID)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          openModal: true,
          screenData: { inputParam },
          screenName: "IDS_REJECTCATELOGREQ",
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.updateRejectedRecordservice(inputParam);
    }
  };
  openApproveRemarksModal = () => {
    const listofDetails = this.props.Login.masterData?.lstBioEcatalogueRequestDetails || [];
    let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.ntransactionstatus;

    const masterData = { ...(this.props.Login.masterData || {}) };
    if (
      ntransactionstatus === transactionStatus.REJECT ||
      ntransactionstatus === transactionStatus.APPROVED ||
      ntransactionstatus === transactionStatus.CANCELLED ||
      !Array.isArray(listofDetails) ||
      listofDetails.length === 0
    ) {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
      return;
    }
    for (let detail of listofDetails) {
      // const nreqn'oofsamples = parseFloat(detail.nreqnoofsamples) || 0;
      const navailablenoofsample = parseFloat(detail.navailablenoofsample) || 0;
      const naccnoofsamples = parseFloat(detail.naccnoofsamples) || 0; // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180

      if (navailablenoofsample < naccnoofsamples) {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_ACCEPTNOSAMPLES" }));
        return;
      }
    }
    this.props.updateStore({
      typeName: DEFAULT_RETURN,
      data: {
        masterData,
        loadEsign: false,
        loadEsignStateHandle: false,
        openModalShow: true,
        openDatatable: false,
        openDatatable2: false,
        openDatatable3: true,
        modalShow: false,
        openDatatable: false,
      },
    });
  };

  updatedApprovedRecord = (validateID) => {
    let ntransactionstatus = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.ntransactionstatus;
    const listofDetails = this.props.Login.masterData?.lstBioEcatalogueRequestDetails || [];
    if (
      ntransactionstatus === transactionStatus.REJECT ||
      ntransactionstatus === transactionStatus.APPROVED ||
      ntransactionstatus === transactionStatus.CANCELLED ||

      !Array.isArray(listofDetails) ||
      listofDetails.length === 0
    ) {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREQUESTEDRECORDS" }));
      return;
    }
    for (let detail of listofDetails) {
      // const nreqnoofsamples = parseFloat(detail.nreqnoofsamples) || 0;
      const navailablenoofsample = parseFloat(detail.navailablenoofsample) || 0;
      const naccnoofsamples = parseFloat(detail.naccnoofsamples) || 0;  // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180

      if (navailablenoofsample < naccnoofsamples) {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_ACCEPTNOSAMPLES" }));
        return;
      }
    }
    let inputData = [];
    inputData["bioecataloguerequestdetails"] = this.props.Login.masterData.lstBioEcatalogueRequestDetails;
    inputData["necatrequestreqapprovalcode"] =
      this.props.Login.masterData?.lstBioEcatalogueRequestDetails[0]?.necatrequestreqapprovalcode;
    inputData["norginsitecode"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.norginsitecode;
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["sformnumber"] = this.props.Login.masterData?.selectedBioEcatalogueReqApproval?.sformnumber;
    inputData["ntransfertype"] = this.props.Login.masterData?.realselectedTransferType?.value;
    inputData["ntransactionstatus"] = this.props.Login.masterData?.realSelectedFilterStatus?.value;
    inputData["sapprovalremarks"] = this.state.selectedChildRecord?.sapprovalremarks ?? "";
 	//added by sujatha ATE_274 BGSI-148 ncontrolcode to the inputData required for Approve Mail
    inputData["ncontrolcode"]=validateID
    let inputParam = {
      inputData: inputData,
      screenName: "IDS_APPROVECATALOGREQ",
      operation: "Approve",
    };

    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, validateID)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          openModal: true,
          screenData: { inputParam },
          screenName: "IDS_APPROVECATALOGREQ",
          openModalShow: false,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.updateApproveRecordservice(inputParam);
    }
  };
  updateApproveRecordservice = (inputParam) => {
    this.setState({ loading: true });
    rsapi()
      .post("bioecataloguereqapproval/updateApproveRecord", { ...inputParam.inputData })
      .then((response) => {
        let masterData = { ...this.props.Login.masterData };
        let responseData = response.data;
        let lstBioEcatalogueReqApproval = this.props.Login.masterData?.lstBioEcatalogueReqApproval;
        const index = lstBioEcatalogueReqApproval.findIndex(
          (item) =>
            item.necatrequestreqapprovalcode ===
            responseData.selectedBioEcatalogueReqApproval?.necatrequestreqapprovalcode
        );
        if (index !== -1) {
          lstBioEcatalogueReqApproval[index] = responseData.selectedBioEcatalogueReqApproval;
        }
        masterData["lstBioEcatalogueReqApproval"] = lstBioEcatalogueReqApproval;
        masterData = { ...masterData, ...responseData };

        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            loadEsign: false,
            openModal: false,
            openDatatable: false,
            openDatatable3: false,
            openModalShow : false
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        } else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      });
  };
  updateRejectedRecordservice = (inputParam) => {
    this.setState({ loading: true });
    rsapi()
      .post("bioecataloguereqapproval/updateRejectedRecord", { ...inputParam.inputData })
      .then((response) => {
        let masterData = { ...this.props.Login.masterData };
        let responseData = response.data;
        let lstBioEcatalogueReqApproval = this.props.Login.masterData?.lstBioEcatalogueReqApproval;
        const index = lstBioEcatalogueReqApproval.findIndex(
          (item) =>
            item.necatrequestreqapprovalcode ===
            responseData.selectedBioEcatalogueReqApproval?.necatrequestreqapprovalcode
        );
        if (index !== -1) {
          lstBioEcatalogueReqApproval[index] = responseData.selectedBioEcatalogueReqApproval;
        }
        masterData["lstBioEcatalogueReqApproval"] = lstBioEcatalogueReqApproval;
        masterData = { ...masterData, ...responseData };

        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            loadEsign: false,
            openModal: false,
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        } else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      });
  };
  onValidateEsignCheck = (saveType) => {
    let selectedRecord = this.state.selectedRecord;
    let inputData = [];
    const obj = convertDateValuetoString(
      this.props.Login.masterData.realFromDate,
      this.props.Login.masterData.realToDate,
      this.props.Login.userInfo
    );
    const realFromDate = obj.fromDate;
    const realToDate = obj.toDate;
    const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
    const necatrequestreqapprovalcode =
      this.props.Login.masterData?.selectedBioRequestBasedTransfer?.necatrequestreqapprovalcode;
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["fromDate"] = realFromDate;
    inputData["toDate"] = realToDate;
    inputData["ntransCode"] = ntransCode.value;
    inputData["necatrequestreqapprovalcode"] = necatrequestreqapprovalcode;

    inputData["bioRequestBasedTransfer"] = {
      sformnumber: selectedRecord?.sformnumber || "",
      nstorageconditioncode: selectedRecord?.nstorageconditioncode?.value || -1,
      sdeliverydate:
        selectedRecord.ddeliverydate && selectedRecord.ddeliverydate !== null
          ? convertDateTimetoStringDBFormat(selectedRecord.ddeliverydate, this.props.Login.userInfo)
          : "",
      ndispatchercode: selectedRecord?.ndispatchercode?.value || -1,
      sdispatchername: selectedRecord?.ndispatchercode?.label || "",
      ncouriercode: selectedRecord?.ncouriercode?.value || -1,
      scourierno: selectedRecord?.scourierno || "",
      striplepackage: selectedRecord?.striplepackage || "",
      svalidationremarks: selectedRecord?.svalidationremarks || "",
    };

    let inputParam = {
      inputData: inputData,
      screenName: "IDS_TRANSFERFORM",
      operation: "validate",
    };

    if (
      showEsign(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode,
        this.props.Login.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsignStateHandle: false,
          openModal: false,
          screenData: { inputParam },
          screenName: "IDS_TRANSFERFORM",
          openModalShow: false,
          openDatatable: false,
          loadEsign: false,
        },
      };
      this.props.updateStore(updateInfo);
    }
    // else {
    //   this.onValidateClick(inputData);
    // }
  };

  onTransferEsignCheck = (transferID, operation, screenName) => {
    let inputData = [];
    const obj = convertDateValuetoString(
      this.props.Login.masterData.realFromDate,
      this.props.Login.masterData.realToDate,
      this.props.Login.userInfo
    );
    const realFromDate = obj.fromDate;
    const realToDate = obj.toDate;
    const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
    const selectedBioRequestBasedTransfer = this.props.Login.masterData?.selectedBioRequestBasedTransfer;

    if (selectedBioRequestBasedTransfer !== null) {
      if (selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
        const nBioRequestBasedTransferCode = selectedBioRequestBasedTransfer?.necatrequestreqapprovalcode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["necatrequestreqapprovalcode"] = nBioRequestBasedTransferCode;

        let inputParam = {
          inputData: inputData,
          screenName: "IDS_TRANSFERSAMPLES",
          operation: "transfer",
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, transferID)) {
          const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
              loadEsign: true,
              openModal: true,
              screenData: { inputParam },
              screenName: "IDS_TRANSFERSAMPLES",
              operation,
              screenName,
            },
          };
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
  };

  onCancelEsignCheck = (cancelID, operation, screenName) => {
    let inputData = [];
    const obj = convertDateValuetoString(
      this.props.Login.masterData.realFromDate,
      this.props.Login.masterData.realToDate,
      this.props.Login.userInfo
    );
    const realFromDate = obj.fromDate;
    const realToDate = obj.toDate;
    const ntransCode = this.props.Login.masterData.realSelectedFilterStatus || -1;
    const selectedBioRequestBasedTransfer = this.props.Login.masterData?.selectedBioRequestBasedTransfer;

    if (selectedBioRequestBasedTransfer !== null) {
      if (
        selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.DRAFT ||
        selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION
      ) {
        const necatrequestreqapprovalcode = selectedBioRequestBasedTransfer?.necatrequestreqapprovalcode;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["fromDate"] = realFromDate;
        inputData["toDate"] = realToDate;
        inputData["ntransCode"] = ntransCode.value;
        inputData["necatrequestreqapprovalcode"] = necatrequestreqapprovalcode;

        let inputParam = {
          inputData: inputData,
          screenName: "IDS_TRANSFERFORM",
          operation: "cancel",
        };
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, cancelID)) {
          const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
              loadEsign: true,
              openModal: true,
              screenData: { inputParam },
              operation,
              screenName,
            },
          };
          this.props.updateStore(updateInfo);
        } else {
          this.onCancel(inputData);
        }
      } else {
        toast.warn(
          this.props.intl.formatMessage({
            id: "IDS_SELECTDRAFTVALIDATEDRECORD",
          })
        );
        this.setState({ loading: false });
      }
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
      this.setState({ loading: false });
    }
  };

  validateEsign = () => {
    let ncontrolcode =
      this.state.controlMap.has("ApproveBioEcatalogueReqApproval") &&
      this.state.controlMap.get("ApproveBioEcatalogueReqApproval").ncontrolcode;
    let modalName = "";
    modalName = "openModal";
    const inputParam = {
      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
          nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
          spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
        },
        password: this.state.selectedRecord["esignpassword"],
      },
      screenData: this.props.Login.screenData,
    };
    this.validateEsignforRequestBasedTransfer(inputParam, modalName);
  };

  validateEsignforRequestBasedTransfer = (inputParam) => {
    rsapi()
      .post("login/validateEsignCredential", inputParam.inputData)
      .then((response) => {
        if (response.data.credentials === "Success") {
          if (
            inputParam["screenData"]["inputParam"]["operation"] === "Ammend" &&
            inputParam["screenData"]["inputParam"]["screenName"] === "IDS_AMENDECATALOGREQ"
          ) {
            this.updatedUserAcceptedVolumn(inputParam["screenData"]["inputParam"]["inputData"]);
          } else if (
            inputParam["screenData"]["inputParam"]["operation"] === "update" &&
            inputParam["screenData"]["inputParam"]["screenName"] === "IDS_REJECTCATELOGREQ"
          ) {
            this.updatedRejectRecord(inputParam["screenData"]["inputParam"]["inputData"]);
          } else if (
            inputParam["screenData"]["inputParam"]["operation"] === "Approve" &&
            inputParam["screenData"]["inputParam"]["screenName"] === "IDS_APPROVECATALOGREQ"
          ) {
            this.updateApproveRecordservice(inputParam["screenData"]["inputParam"]);
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: error.response.status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
        } else {
          toast.info(error.response.data);
        }
      });
  };

  handlePageChange = (e) => {
    this.setState({
      skip: e.skip,
      take: e.take,
    });
  };
}

export default connect(mapStateToProps, {
  updateStore,
  filterTransactionList,
  getSelectedBioEcatalogueReqApproval,
})(injectIntl(BioEcatalogueReqApproval));
