import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { process } from "@progress/kendo-data-query";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { rearrangeDateFormat } from "../../../components/CommonScript";
import DataGridWithSelection from "../../../components/data-grid/DataGridWithSelection";
import DateTimePicker from "../../../components/date-time-picker/date-time-picker.component";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";
import FormTextarea from "../../../components/form-textarea/form-textarea.component";
import Preloader from "../../../components/preloader/preloader.component";
import rsapi from "../../../rsapi";
//#SECURITY-VULNERABILITY-MERGING-START
//import { UN_AUTHORIZED_ACCESS } from "./../../../actions/LoginTypes";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import { intl } from '../../../components/App';
//#SECURITY-VULNERABILITY-MERGING-END
import FormSelectSearchWithColour from "../../../components/form-select-search/FormSelectSearchWithColour";

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class AddDirectTransfer extends React.Component {
  constructor(props) {
    super(props);
    const dataState = {
      skip: 0,
      take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
    };
    this.state = {
      loading: false,
      dataState: dataState,
      dataResult: [],
      total: 0,
      lstStorageType: props.lstStorageType,
      lstBioBankSite: props.lstBioBankSite,
      operation: props.operation,
      selectedChildRecord: {},
      selectedRecord: {
        ...props.selectedRecord,
        nprimaryKeyBioDirectTransfer: -1,
        lstBioProject: props.lstBioProject ? props.lstBioProject : [],
        addSelectAll: false,
      },
      controlMap: props.controlMap,
      userRoleControlRights: props.userRoleControlRights,
      bioBankSiteDisable: props.bioBankSiteDisable,
      lstBioProject: props.lstBioProject,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.Login.selectedRecord) !== JSON.stringify(prevProps.Login.selectedRecord)) {
      this.setState({ selectedRecord: this.props.Login.selectedRecord });
    }
    if (JSON.stringify(this.props.Login.bioBankSiteDisable) !== JSON.stringify(prevProps.Login.bioBankSiteDisable)) {
      this.setState({ bioBankSiteDisable: this.props.Login.bioBankSiteDisable });
    }
    if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
      this.setState({ selectedRecord: this.props.Login.selectedChildRecord });
    }

    // 🆕 reset grid when parent clears list
    if (
      this.props.Login?.selectedRecord?.lstGetSampleReceivingDetails?.length === 0 &&
      prevProps.Login?.selectedRecord?.lstGetSampleReceivingDetails?.length > 0
    ) {
      this.setState({
        dataResult: [],
        total: 0,
        dataState: { skip: 0, take: 10, sort: [], filter: null },
      });
    }

    if (
      JSON.stringify(this.props.Login?.selectedRecord?.lstGetSampleReceivingDetails) !==
      JSON.stringify(prevProps.Login?.selectedRecord?.lstGetSampleReceivingDetails)
    ) {
      const processed = process(this.props.Login?.selectedRecord?.lstGetSampleReceivingDetails || [], {
        skip: 0,
        take: 10,
        sort: [],
        filter: null,
      });

      this.setState({
        dataResult: processed.data,
        total: processed.total,
        dataState: { skip: 0, take: 10, sort: [], filter: null },
      });
    }

    if (
      this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails?.length === 0 &&
      prevProps.Login?.selectedChildRecord?.lstGetSampleReceivingDetails?.length > 0
    ) {
      this.setState({
        dataResult: [],
        total: 0,
        dataState: { skip: 0, take: 10, sort: [], filter: null },
      });
    }

    if (
      JSON.stringify(this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails) !==
      JSON.stringify(prevProps.Login?.selectedChildRecord?.lstGetSampleReceivingDetails)
    ) {
      const processed = process(this.props.Login?.selectedChildRecord?.lstGetSampleReceivingDetails || [], {
        skip: 0,
        take: 10,
        sort: [],
        filter: null,
      });

      this.setState({
        dataResult: processed.data,
        total: processed.total,
        dataState: { skip: 0, take: 10, sort: [], filter: null },
      });
    }
  }

  render() {
    this.extractedFields = [
      { idsName: "IDS_REPOSITORYID", dataField: "srepositoryid", width: "100px" },
      // { idsName: "IDS_LOCATIONCODE", dataField: "slocationcode", width: "100px" },
      { idsName: "IDS_BIOSAMPLETYPE", dataField: "sproductname", width: "100px" },
      { idsName: "IDS_VOLUMEµL", dataField: "svolume", width: "100px" },
    ];

    const gridBoxStyle = {
      border: "1px dotted #ccc", // dotted border creates minute line effect
      backgroundColor: "#fff", // white background
      padding: "1rem", // padding like p-3
      borderRadius: "4px", // optional rounded corners
      paddingTop: "3rem",
    };

    return (
      <>
        <Preloader loading={this.state.loading} />
        <Row>
          <Col md={6}>
            <FormSelectSearch
              formLabel={this.props.intl.formatMessage({ id: "IDS_TRANSFERSITE" })}
              isSearchable={true}
              name={"nbiobanksitecode"}
              isDisabled={this.props.isChildSlideOut ? this.props.isChildSlideOut : this.state.bioBankSiteDisable}
              placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
              isMandatory={true}
              options={this.state.lstBioBankSite}
              optionId="nbiobanksitecode"
              optionValue="sbiobanksitename"
              value={this.state.selectedRecord ? this.state.selectedRecord.nbiobanksitecode : ""}
              onChange={(event) => this.onComboChange(event, "nbiobanksitecode")}
              closeMenuOnSelect={true}
              alphabeticalSort={true}
            />
          </Col>
          <Col md={6}>
            <DateTimePicker
              name={"todate"}
              label={this.props.intl.formatMessage({ id: "IDS_TRANSFERDATE" })}
              className="form-control"
              placeholderText="Select date.."
              selected={
                this.state.selectedRecord.dtransferdate
                  ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dtransferdate)
                  : null
              }
              dateFormat={this.props.Login.userInfo["ssitedate"]}
              isClearable={false}
              isMandatory={true}
              isDisabled={this.props.isChildSlideOut ? this.props.isChildSlideOut : false}
              onChange={(date) => this.handleDateChange("dtransferdate", date)}
              value={
                this.state.selectedRecord.dtransferdate
                  ? rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedRecord.dtransferdate)
                  : null
              }
            />
          </Col>
          <Col md={12}>
            <FormTextarea
              label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
              name={"sremarks"}
              type="text"
              onChange={(event) => this.onComboChange(event, "sremarks")}
              placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
              value={this.state.selectedRecord ? this.state.selectedRecord.sremarks : ""}
              rows="2"
              isMandatory={false}
              required={false}
              maxLength={"255"}
            />
          </Col>
        </Row>
        {this.state?.operation !== "update" ? (
          <>
            <div style={gridBoxStyle}>
              <Row>
                <Col md={6}>
                  <Col md={12}>
                    <FormSelectSearch
                      formLabel={this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" })}
                      isSearchable={true}
                      name={"nbioprojectcode"}
                      isDisabled={this.state.operation === "create" ? false : true}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                      isMandatory={true}
                      options={this.state.selectedRecord ? this.state.selectedRecord.lstBioProject : []}
                      optionId="nbioprojectcode"
                      optionValue="sprojecttitle"
                      value={this.state.selectedRecord ? this.state.selectedRecord.nbioprojectcode : ""}
                      onChange={(event) => this.onComboChange(event, "nbioprojectcode")}
                      closeMenuOnSelect={true}
                      alphabeticalSort={true}
                    />
                  </Col>
                  <Col md={12}>
                    <FormSelectSearchWithColour
                      formLabel={this.props.intl.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}
                      name="sparentsamplecode"
                      isDisabled={this.state.operation !== "create"}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                      isMandatory={true}
                      isClearable={false}
                      options={
                        this.state.selectedRecord?.lstParentSample
                          ? this.state.selectedRecord.lstParentSample.map((x) => ({
                              label: x.label ?? x.item?.sparentsamplecodecohortno,
                              value: x.value ?? x.item?.sparentsamplecodecohortno,
                              color: x.item?.scolor ?? "Full",
                              item: x.item,
                            }))
                          : []
                      }
                      value={this.state.selectedRecord?.sparentsamplecode ?? null}
                      onChange={(event) => this.onComboChange(event, "sparentsamplecode")}
                    />
                  </Col>
                </Col>
                <Col md={6}>
                  <Col md={12}>
                    <FormSelectSearch
                      formLabel={this.props.intl.formatMessage({ id: "IDS_STORAGETYPE" })}
                      isSearchable={true}
                      name={"nstoragetypecode"}
                      isDisabled={this.state.operation === "create" ? false : true}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                      isMandatory={false}
                      options={this.state.lstStorageType}
                      optionId="nstoragetypecode"
                      optionValue="sstoragetypename"
                      value={this.state.selectedRecord ? this.state.selectedRecord.nstoragetypecode : ""}
                      onChange={(event) => this.onComboChange(event, "nstoragetypecode")}
                      closeMenuOnSelect={true}
                      alphabeticalSort={true}
                      isClearable={true}
                    />
                  </Col>
                  <Col md={12}>
                    <FormSelectSearch
                      formLabel={this.props.intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" })}
                      isSearchable={true}
                      name={"nproductcode"}
                      isDisabled={this.state.operation === "create" ? false : true}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                      isMandatory={false}
                      options={this.state.selectedRecord ? this.state.selectedRecord.lstSampleType : []}
                      optionId="nproductcode"
                      optionValue="sproductname"
                      value={this.state.selectedRecord ? this.state.selectedRecord.nproductcode : ""}
                      onChange={(event) => this.onComboChange(event, "nproductcode")}
                      closeMenuOnSelect={true}
                      alphabeticalSort={true}
                      isClearable={true}
                    />
                  </Col>
                </Col>
              </Row>
              <Row>
                <Button
                  className="btn-user btn-primary-blue"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => this.filterData()}
                >
                  {/* <FontAwesomeIcon icon={faFilter} /> { } */}
                  <FormattedMessage id="IDS_FILTER" defaultMessage="Filter" />
                </Button>
              </Row>
            </div>
            <Row>
              <br></br>
              <DataGridWithSelection
                primaryKeyField={"nbiosamplereceivingcode"}
                dataResult={this.state.dataResult || []} // <-- use processed data
                total={this.state.total || 0} // <-- required for paging
                selectAll={this.state.selectedRecord?.addSelectAll}
                userInfo={this.props.Login.userInfo}
                title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                headerSelectionChange={this.headerSelectionChange}
                selectionChange={this.selectionChange}
                dataStateChange={this.dataStateChange}
                extractedColumnList={this.extractedFields}
                dataState={this.state.dataState}
                // dataResult={process(this.state.selectedRecord?.lstGetSampleReceivingDetails || [], this.state.dataState)}
                scrollable={"scrollable"}
                pageable={true}
              />
            </Row>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }

  onComboChange = (event, field) => {
    let selectedRecord = this.state.selectedRecord;
    if (field === "nbiobanksitecode") {
      rsapi()
        .post("biodirecttransfer/getProjectBasedOnSite", {
          userinfo: this.props.Login.userInfo,
          nbiobanksitecode: event.value || "-1",
        })
        .then((response) => {
          selectedRecord["lstBioProject"] = response.data.lstBioProject || [];
          selectedRecord["nbioprojectcode"] = "";
          selectedRecord["lstParentSample"] = [];
          selectedRecord["sparentsamplecode"] = "";
          selectedRecord["lstSampleType"] = [];
          selectedRecord["nproductcode"] = "";
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          selectedRecord[field] = event;
          this.setState({
            selectedRecord,
            dataResult: [],
          });
          this.props.childDataChange(selectedRecord);
        })
        .catch((error) => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
          } else if (error.response.status === 500) {
            toast.error(error.message);
          } else {
            toast.warn(error.response.data);
          }
        });
    } else if (field === "nbioprojectcode") {
      rsapi()
        .post("biodirecttransfer/getParentSampleBasedOnProject", {
          userinfo: this.props.Login.userInfo,
          nbioprojectcode: event.value || -1,
        })
        .then((response) => {
          selectedRecord["lstParentSample"] = response.data.lstParentSample || [];
          selectedRecord["sparentsamplecode"] = "";
          selectedRecord["lstSampleType"] = [];
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["nproductcode"] = "";
          selectedRecord["addSelectAll"] = false;
          selectedRecord[field] = event;
          this.setState({
            selectedRecord,
            dataResult: [],
          });
          this.props.childDataChange(selectedRecord);
        })
        .catch((error) => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
          } else if (error.response.status === 500) {
            toast.error(error.message);
          } else {
            toast.warn(error.response.data);
          }
        });
    } else if (field === "sparentsamplecode") {
      rsapi()
        .post("biodirecttransfer/getSampleTypeBySampleCode", {
          userinfo: this.props.Login.userInfo,
          sparentsamplecode: event?.item?.sparentsamplecode || "",
          ncohortno: event?.item?.ncohortno || -1,
          nstoragetypecode: -1,
        })
        .then((response) => {
          selectedRecord["lstSampleType"] = response.data.lstSampleType || [];
          selectedRecord["nproductcode"] = "";
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          selectedRecord[field] = event;
          this.setState({
            selectedRecord,
            dataResult: [],
          });
          this.props.childDataChange(selectedRecord);
        })
        .catch((error) => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
          } else if (error.response.status === 500) {
            toast.error(error.message);
          } else {
            toast.warn(error.response.data);
          }
        });
    } else if (field === "nstoragetypecode") {
      rsapi()
        .post("biodirecttransfer/getSampleTypeBySampleCode", {
          userinfo: this.props.Login.userInfo,
          sparentsamplecode: this.state.selectedRecord?.sparentsamplecode?.item?.sparentsamplecode || "",
          ncohortno: this.state.selectedRecord?.sparentsamplecode?.item?.ncohortno || -1,
          nstoragetypecode: event ? event.value || -1 : -1,
        })
        .then((response) => {
          selectedRecord["lstSampleType"] = response.data.lstSampleType || [];
          selectedRecord["nproductcode"] = "";
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          selectedRecord[field] = event;
          this.setState({
            selectedRecord,
            dataResult: [],
          });
          this.props.childDataChange(selectedRecord);
        })
        .catch((error) => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
          } else if (error.response.status === 500) {
            toast.error(error.message);
          } else {
            toast.warn(error.response.data);
          }
        });
    } else if (field === "nproductcode") {
      selectedRecord["addedSampleReceivingDetails"] = [];
      selectedRecord["lstGetSampleReceivingDetails"] = [];
      selectedRecord["addSelectAll"] = false;
      selectedRecord[field] = event;
      this.setState({
        selectedRecord,
        dataResult: [],
      });
      this.props.childDataChange(selectedRecord);
    } else if (field === "sremarks") {
      selectedRecord[field] = event.target.value;
      this.setState({ selectedRecord });
      this.props.childDataChange(selectedRecord);
    } else {
      selectedRecord[field] = event;
      this.setState({ selectedRecord });
      this.props.childDataChange(selectedRecord);
    }
  };

  handleDateChange = (field, value) => {
    let selectedRecord = this.state.selectedRecord;
    selectedRecord[field] = value;
    this.setState({ selectedRecord });
    this.props.childDataChange(selectedRecord);
  };

  filterData = () => {
    let selectedRecord = this.state.selectedRecord;
    if (
      selectedRecord.nbiobanksitecode &&
      selectedRecord.nbiobanksitecode !== "" &&
      selectedRecord.nbiobanksitecode !== null &&
      selectedRecord.nbioprojectcode &&
      selectedRecord.nbioprojectcode !== "" &&
      selectedRecord.nbioprojectcode !== null &&
      selectedRecord.sparentsamplecode &&
      selectedRecord.sparentsamplecode !== "" &&
      selectedRecord.sparentsamplecode !== null
    ) {
      this.setState({ loading: true });
      rsapi()
        .post("biodirecttransfer/getSampleReceivingDetails", {
          userinfo: this.props.Login.userInfo,
          sparentsamplecode: selectedRecord.sparentsamplecode?.item.sparentsamplecode || "",
          nstoragetypecode: selectedRecord.nstoragetypecode?.value || -1,
          nproductcode: selectedRecord.nproductcode?.value || -1,
          nbiobanksitecode: selectedRecord.nbiobanksitecode?.value || -1,
          nbioprojectcode: selectedRecord.nbioprojectcode?.value || -1,
          ncohortno: selectedRecord.sparentsamplecode?.item?.ncohortno || -1,
        })
        .then((response) => {
          const lstGetSampleReceivingDetails = response.data?.lstGetSampleReceivingDetails || [];
          selectedRecord["lstGetSampleReceivingDetails"] = lstGetSampleReceivingDetails;
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          let dataState = { skip: 0, take: 10 };

          const processed = process(response.data?.lstGetSampleReceivingDetails || [], dataState);
          const selectedChildRecord = { ...selectedRecord };
          this.setState({
            selectedRecord,
            selectedChildRecord,
            loading: false,
            dataResult: processed.data, // store array only
            total: processed.total, // store total separately
            dataState,
          });
        })
        .catch((error) => {
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMANDATORYFIELDSTOFILTER" }));
      this.setState({ loading: false });
    }
  };

  selectionChange = (event) => {
    let addedSampleReceivingDetails = this.state.selectedRecord?.addedSampleReceivingDetails || [];
    let selectedRecord = this.state.selectedRecord;
    const lstGetSampleReceivingDetails = this.state?.dataResult.map((item) => {
      if (item.nbiosamplereceivingcode === event.dataItem.nbiosamplereceivingcode) {
        item.selected = !event.dataItem.selected;
        if (item.selected) {
          const newItem = JSON.parse(JSON.stringify(item));
          delete newItem["selected"];
          newItem.selected = true;
          addedSampleReceivingDetails.push(newItem);
        } else {
          addedSampleReceivingDetails = addedSampleReceivingDetails.filter(
            (item1) => item1.nbiosamplereceivingcode !== item.nbiosamplereceivingcode
          );
        }
      }
      return item;
    });

    selectedRecord["addedSampleReceivingDetails"] = addedSampleReceivingDetails;
    //selectedRecord['lstGetSampleReceivingDetails'] = lstGetSampleReceivingDetails;
    selectedRecord["addSelectAll"] = this.validateCheckAll(
      process(lstGetSampleReceivingDetails || [], this.state.dataState).data
    );
    this.props.childDataChange(selectedRecord);

    this.setState({
      selectedRecord,
      dataResult: lstGetSampleReceivingDetails,
    });
    // this.props.childDataChange(selectedRecord);
  };

  validateCheckAll(data) {
    let selectAll = true;
    if (data && data.length > 0) {
      data.forEach((dataItem) => {
        if (dataItem.selected) {
          if (dataItem.selected === false) {
            selectAll = false;
          }
        } else {
          selectAll = false;
        }
      });
    } else {
      selectAll = false;
    }
    return selectAll;
  }

  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const eventData = event.target.props.data.hasOwnProperty("data")
      ? event.target.props.data.data || []
      : event.target.props.data || [];
    let lstGetSampleReceivingDetails = this.state?.dataResult || [];
    let addedSampleReceivingDetails = this.state.selectedRecord?.addedSampleReceivingDetails || [];
    let selectedRecord = this.state.selectedRecord;
    // let selectedChildRecord = this.state.selectedChildRecord;
    if (checked) {
      const data = lstGetSampleReceivingDetails.map((item) => {
        const matchingData = eventData.find(
          (dataItem) => dataItem.nbiosamplereceivingcode === item.nbiosamplereceivingcode
        );
        if (matchingData) {
          const existingIndex = addedSampleReceivingDetails.findIndex(
            (x) => x.nbiosamplereceivingcode === item.nbiosamplereceivingcode
          );

          if (existingIndex === -1) {
            const newItem = {
              ...item,
              selected: true,
            };
            addedSampleReceivingDetails.push(newItem);
          }
          return { ...item, selected: true };
        } else {
          return { ...item, selected: item.selected ? true : false };
        }
      });

      selectedRecord["addedSampleReceivingDetails"] = data;
      selectedRecord["addSelectAll"] = checked;

      this.setState({
        selectedRecord,
        selectedChildRecord: { ...selectedRecord },
        dataResult: data,
      });
      this.props.childDataChange(selectedRecord);
    } else {
      let addedSampleReceivingDetails = this.state.selectedRecord?.addedSampleReceivingDetails || [];
      const data = lstGetSampleReceivingDetails.map((x) => {
        const matchedItem = eventData.find((item) => x.nbiosamplereceivingcode === item.nbiosamplereceivingcode);
        if (matchedItem) {
          addedSampleReceivingDetails = addedSampleReceivingDetails.filter(
            (item1) => item1.nbiosamplereceivingcode !== matchedItem.nbiosamplereceivingcode
          );
          matchedItem.selected = false;
          return matchedItem;
        }
        return x;
      });

      selectedRecord["addedSampleReceivingDetails"] = addedSampleReceivingDetails;
      //selectedRecord['lstGetSampleReceivingDetails'] = data;
      selectedRecord["addSelectAll"] = checked;
      this.props.childDataChange(selectedRecord);

      this.setState({
        selectedRecord,
        selectedChildRecord: { ...selectedRecord },
      });
      //this.props.childDataChange(selectedRecord);
    }
  };

  dataStateChange = (event) => {
    const { selectedRecord = {}, selectedChildRecord = {} } = this.state;
    const fullList = selectedRecord.lstGetSampleReceivingDetails || [];

    // 1️⃣ Apply filter/sort/paging
    const processed = process(fullList, event.dataState);

    // 2️⃣ Persisted global selection
    const globalSelected = selectedRecord.globalSelected || selectedRecord.addedSampleReceivingDetails || [];
    const globalMap = new Map(globalSelected.map((item) => [item.nbiosamplereceivingcode, item]));

    // 3️⃣ Mark visible rows
    const visibleWithSelection = processed.data.map((item) =>
      globalMap.has(item.nbiosamplereceivingcode) ? { ...item, selected: true } : { ...item, selected: false }
    );

    // 4️⃣ Current filter selection
    const filteredSelected = visibleWithSelection.filter((item) => item.selected);

    // 5️⃣ Decide which list to persist
    const newSelection =
      event.dataState.filter && event.dataState.filter.filters?.length > 0
        ? filteredSelected // 👉 when filter applied
        : globalSelected; // 👉 when filter cleared

    // 6️⃣ Update state
    this.setState({
      dataResult: visibleWithSelection,
      total: processed.total,
      dataState: event.dataState,
      selectedRecord: {
        ...selectedRecord,
        globalSelected, // ✅ keep global safe
        addedSampleReceivingDetails: newSelection,
      },
      selectedChildRecord: {
        ...selectedChildRecord,
        addedSampleReceivingDetails: newSelection,
      },
    });

    // 7️⃣ Sync to parent
    this.props.childDataChange({
      ...selectedChildRecord,
      addedSampleReceivingDetails: newSelection,
    });
  };
}

export default connect(mapStateToProps, {})(injectIntl(AddDirectTransfer));
