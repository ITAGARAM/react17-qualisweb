import { process } from "@progress/kendo-data-query";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import DataGridWithSelection from "../../../components/data-grid/DataGridWithSelection";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";
import Preloader from "../../../components/preloader/preloader.component";
import rsapi from "../../../rsapi";
//#SECURITY-VULNERABILITY-MERGING-START
//import { UN_AUTHORIZED_ACCESS } from "../../../actions/LoginTypes";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../../actions/LoginTypes';
//#SECURITY-VULNERABILITY-MERGING-END
import FormInput from "../../../components/form-input/form-input.component";
import FilterQueryBuilder from "../../../components/FilterQueryBuilder";
import { Utils as QbUtils } from "@react-awesome-query-builder/ui";
import { intl } from '../../../components/App';

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class AddDisposalSampleApproval extends React.Component {
  constructor(props) {
    super(props);
    const dataState = {
      skip: 0,
      take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
    };
    this.state = {
      loading: false,
      dataState: dataState,
      operation: props.operation,
      selectedRecord: {
        ...props.selectedRecord,
        addSelectAll: false,
        isEnableStoreFilter: false,
      },
      controlMap: props.controlMap,
      userRoleControlRights: props.userRoleControlRights,
      bioBankSiteDisable: props.bioBankSiteDisable,
      lstDisposalBatchTypeCombo: props.lstDisposalBatchTypeCombo,
      lstFormType: [],
      lstFormNumber: [],
      dataResult: [],
      total: 0,
      selectedChildRecord: {},
      fields: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
      const scr = this.props.Login.selectedChildRecord || {};
      const c = !scr.nbiomovetodisposecode?.length;
      this.setState({
        selectedRecord: c ? { ...scr, nbiomovetodisposecode: [], lstGetSampleReceivingDetails: [] } : scr,
        lstFormNumber: c ? [] : this.state.lstFormNumber,
        dataResult: c ? [] : this.state.dataResult,
      });
    }
    if (JSON.stringify(this.props.Login.bioBankSiteDisable) !== JSON.stringify(prevProps.Login.bioBankSiteDisable)) {
      this.setState({ bioBankSiteDisable: this.props.Login.bioBankSiteDisable });
    }
    if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
      this.setState({ selectedRecord: this.props.Login.selectedChildRecord, lstFormNumber: [] });
    }

    // 🆕 reset grid when parent clears list
    if (
      this.props.Login.selectedRecord?.lstGetSampleReceivingDetails?.length === 0 &&
      prevProps.Login.selectedRecord?.lstGetSampleReceivingDetails?.length > 0
    ) {
      this.setState({
        dataResult: [],
        total: 0,
        dataState: { skip: 0, take: 10, sort: [], filter: null },
      });
    }

    if (
      JSON.stringify(this.props.Login.selectedRecord.lstGetSampleReceivingDetails) !==
      JSON.stringify(prevProps.Login.selectedRecord.lstGetSampleReceivingDetails)
    ) {
      const processed = process(this.props.Login.selectedRecord.lstGetSampleReceivingDetails || [], {
        skip: 0,
        take: 10,
        sort: [],
        filter: null,
      });

      if (
        this.props.Login.selectedChildRecord?.lstGetSampleReceivingDetails?.length === 0 &&
        prevProps.Login.selectedChildRecord?.lstGetSampleReceivingDetails?.length > 0
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
        const processed = process(this.props.Login.selectedChildRecord.lstGetSampleReceivingDetails || [], {
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
  }

  gridfillingColumn() {
    let fieldList = [
      { idsName: "IDS_REPOSITORYID", dataField: "spositionvalue", width: "200px", staticField: true },
      { idsName: "IDS_STROAGENAMEORID", dataField: "sinstrumentid", width: "200px" },
      { idsName: "IDS_LOCATIONCODE", dataField: "slocationcode", width: "200px", staticField: true },
      { idsName: "IDS_PARENTSAMPLECODE", dataField: "sparentsamplecode", width: "200px", staticField: true },
      { idsName: "IDS_SUBJECTID", dataField: "ssubjectid", width: "200px", staticField: true },
      { idsName: "IDS_BIOSAMPLETYPE", dataField: "sproductname", width: "200px" },
      { idsName: "IDS_SAMPLEACCESABLE", dataField: "ssampleaccesable", width: "200px" },
      { idsName: "IDS_THIRDPARTYSHARABLE", dataField: "sthirdpartysharable", width: "200px" },
    ];
    return fieldList;
  }

  render() {
    this.extractedFields = [
      { idsName: "IDS_PARENTSAMPLECODE", dataField: "sparentsamplecode", width: "100px" },
      { idsName: "IDS_REPOSITORYID", dataField: "spositionvalue", width: "100px" },
      { idsName: "IDS_LOCATIONCODE", dataField: "slocationcode", width: "100px" },
      { idsName: "IDS_BIOSAMPLETYPE", dataField: "sproductname", width: "100px" },
      { idsName: "IDS_VOLUMEµL", dataField: "sqty", width: "100px" },
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
              formLabel={this.props.intl.formatMessage({ id: "IDS_DISPOSALBATCHTYPE" })}
              name={"ndisposalbatchtypecode"}
              placeholder={this.props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
              optionId={"ndisposalbatchtypecode"}
              optionValue={"sdisposalbatchtypename"}
              options={this.state.lstDisposalBatchTypeCombo || []}
              showOption={true}
              isMandatory={true}
              value={this.state.selectedRecord.ndisposalbatchtypecode}
              isSearchable={true}
              onChange={(event) => this.onComboChange(event, "ndisposalbatchtypecode")}
              sortOrder="ascending"
            ></FormSelectSearch>
          </Col>

          {this.state.selectedRecord?.isEnableStoreFilter === false ? (
            <Col md={6}>
              <FormSelectSearch
                formLabel={this.props.intl.formatMessage({ id: "IDS_FORMTYPE" })}
                name={"nformtypecode"}
                placeholder={this.props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                optionId={"nformtypecode"}
                optionValue={"sformtypename"}
                options={this.state.lstFormType || []}
                showOption={true}
                isMandatory={true}
                value={this.state.selectedRecord.nformtypecode}
                isSearchable={true}
                onChange={(event) => this.onComboChange(event, "nformtypecode")}
                sortOrder="ascending"
              ></FormSelectSearch>
            </Col>
          ) : (
            ""
          )}

          {this.state.selectedRecord?.isEnableStoreFilter === false ? (
            <Col md={6}>
              <FormSelectSearch
                formLabel={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                name={"nbiomovetodisposecode"}
                placeholder={this.props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                optionId={"nbiomovetodisposecode"}
                optionValue={"sformnumber"}
                options={this.state.lstFormNumber || []}
                showOption={true}
                isMandatory={true}
                value={this.state.selectedRecord.nbiomovetodisposecode}
                isSearchable={true}
                onChange={(event) => this.onComboChange(event, "nbiomovetodisposecode")}
                sortOrder="ascending"
              ></FormSelectSearch>
            </Col>
          ) : (
            ""
          )}

          {this.state.selectedRecord?.isEnableStoreFilter === false ? (
            <Col md={6}>
              <FormInput
                label={this.props.intl.formatMessage({ id: "IDS_ORIGIN" })}
                name={"formsiteorthirdpartyname"}
                type="text"
                isDisabled={true}
                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                value={this.state.selectedRecord ? this.state.selectedRecord.formsiteorthirdpartyname : ""}
                isMandatory={false}
                required={true}
                maxLength={"30"}
              />
            </Col>
          ) : (
            ""
          )}

          {this.state.selectedRecord?.isEnableStoreFilter === false ? (
            <Row>
              <Button
                className="btn-user btn-primary-blue"
                style={{ marginLeft: "1rem" }}
                onClick={() => this.filterData()}
              >
                <FormattedMessage id="IDS_FILTER" defaultMessage="Filter" />
              </Button>
            </Row>
          ) : (
            ""
          )}
        </Row>
        {this.state.selectedRecord?.isEnableStoreFilter === true ? (
          <Row style={{ marginBottom: "1rem" }}>
            <Col md={4}>
              <FilterQueryBuilder
                fields={this.state.fields}
                isSampleStorage={true}
                queryArray={this.state.queryArray}
                skip={this.state.kendoSkip}
                take={this.state.kendoTake}
                onChange={this.onChange}
                tree={this.props.Login.tree !== undefined ? this.props.Login.tree : this.state.selectedRecord.tree}
                gridColumns={this.slideList}
                filterData={this.props.Login.slideResult || []}
                handlePageChange={this.handlePageChangeFilter}
                static={true}
                userInfo={this.props.Login.userInfo}
                updateStore={this.props.updateStore}
                //handleExecuteClick={this.getDynamicFilterExecuteData(this)}
              />
            </Col>
          </Row>
        ) : (
          ""
        )}
        {this.state.selectedRecord?.isEnableStoreFilter === true ? (
          <Row>
            <Button
              className="btn-user btn-primary-blue"
              style={{ marginLeft: "1rem" }}
              onClick={() => this.getDynamicFilterExecuteData()}
            >
              <FormattedMessage id="IDS_FILTER" defaultMessage="Filter" />
            </Button>
          </Row>
        ) : (
          ""
        )}
        {this.state?.operation !== "update" ? (
          <>
            <Row>
              <br></br>
              <DataGridWithSelection
                primaryKeyField={"nbiosamplereceivingcode"}
                //data={this.state.selectedRecord?.lstGetSampleReceivingDetails || []}
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
                //dataResult={process(this.state.selectedRecord?.lstGetSampleReceivingDetails || [], this.state.dataState)}
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
  handlePageChangeFilter = (event) => {
    this.setState({ kendoSkip: event.skip, kendoTake: event.take });
  };
  onChange = (immutableTree, config) => {
    let selectedRecord = this.state.selectedRecord || {};
    let selectedChildRecord = this.state.selectedChildRecord || {};
    let dataResult = this.state?.dataResult || [];
    selectedRecord["tree"] = immutableTree;
    selectedRecord["config"] = config;
    selectedRecord["filterQueryTreeStr"] = QbUtils.getTree(immutableTree);
    selectedRecord["filterquery"] = QbUtils.sqlFormat(immutableTree, config);
    if (!selectedRecord?.filterquery) {
      selectedRecord["addedSampleReceivingDetails"] = [];
      selectedRecord["lstGetSampleReceivingDetails"] = [];
      dataResult = [];
      selectedChildRecord["lstGetSampleReceivingDetails"] = [];
      selectedChildRecord["addedSampleReceivingDetails"] = [];
    }
    this.setState({
      tree: immutableTree,
      config: config,
      selectedRecord: selectedRecord,
      dataResult: dataResult,
      selectedChildRecord: selectedChildRecord,
    });
    this.props.childDataChange(selectedChildRecord);
  };

  getDynamicFilterExecuteData(nflag) {
    let selectedRecord = this.state.selectedRecord;

    let filterquery = this?.state?.selectedRecord?.filterquery || null;

    if (
      filterquery !== undefined &&
      filterquery !== null &&
      Object.keys(this?.state?.selectedRecord?.filterquery || {}).length !== 0
    ) {
      rsapi()
        .post("disposalsamplesapproval/getDynamicDisposeFilterData", {
          userinfo: this.props.Login.userInfo,
          filterquery: filterquery,
        })
        .then((response) => {
          const lstGetSampleReceivingDetails = response.data?.lstformTypeStoreFilter || [];
          selectedRecord["lstGetSampleReceivingDetails"] = lstGetSampleReceivingDetails;
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          let dataState = { skip: 0, take: 10 };

          const processed = process(response.data?.lstformTypeStoreFilter || [], dataState);
          const selectedChildRecord = { ...selectedRecord };

          this.setState({
            selectedRecord,
            selectedChildRecord,
            loading: false,
            dataResult: processed.data,
            total: processed.total,
            dataState,
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
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAFILTER" }));
    }
  }

  onComboChange = (event, field) => {
    let selectedRecord = this.state.selectedRecord;

    if (field === "ndisposalbatchtypecode") {
      if (event && (event.value || -1) === 1) {
        rsapi()
          .post("disposalsamplesapproval/getDisposalBatchFormType", {
            userinfo: this.props.Login.userInfo,
            ndisposalbatchtypecode: event ? event.value || -1 : -1,
          })
          .then((response) => {
            Object.assign(selectedRecord, {
              formsiteorthirdpartyname: "",
              ndisposalbatchtypecode: [],
              nformtypecode: [],
              nbiomovetodisposecode: [],
              //filterquery: [],
              //filterQueryTreeStr: [],
            });

            let lstFormType = response.data.lstFormType || [];
            selectedRecord[field] = event;
            selectedRecord["addSelectAll"] = false;
            selectedRecord["isEnableStoreFilter"] = false;

            this.setState({
              selectedRecord,
              lstFormType,
              dataResult: [],
              lstFormNumber: []  

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
      } else {
        rsapi()
          .post("disposalsamplesapproval/getExtractedColumnData", {
            userinfo: this.props.Login.userInfo,
          })
          .then((response) => {
            // selectedRecord['ndisposalbatchtypecode'] = [];
            // selectedRecord['nformtypecode'] = [];
            // selectedRecord['nbiomovetodisposecode'] = [];

            Object.assign(selectedRecord, {
              ndisposalbatchtypecode: [],
              nformtypecode: [],
              nbiomovetodisposecode: [],
              formsiteorthirdpartyname: "",
            });

            selectedRecord[field] = event;

            selectedRecord["isEnableStoreFilter"] = true;

            selectedRecord["addSelectAll"] = false;

            const extractedColumnList = this.gridfillingColumn() || [];

            let fields = { ...this.state.fields };

            if (extractedColumnList.length > 0 && Object.keys(fields).length === 0) {
              extractedColumnList.forEach((field) => {
                if (field.hasOwnProperty("staticField")) {
                  fields = {
                    ...fields,
                    [field.dataField]: {
                      label: this.props.intl.formatMessage({ id: field.idsName }),
                      type: "text",
                      valueSources: ["value", "func"],
                      mainWidgetProps: {
                        valueLabel: "Name",
                        valuePlaceholder: this.props.intl.formatMessage({ id: field.idsName }),
                      },
                    },
                  };
                } else if (field.dataField === "sproductname") {
                  const queryBuilderFreezer =
                    response.data?.sampleType?.map((item) => ({
                      value: item.nsampletypecode,
                      title: item.sproductname,
                    })) || [];

                  fields = {
                    ...fields,
                    nsampletypecode: {
                      label: this.props.intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" }),
                      type: "select",
                      valueSources: ["value"],
                      fieldSettings: {
                        listValues: queryBuilderFreezer,
                      },
                    },
                  };
                } else if (field.dataField === "sthirdpartysharable") {
                  const queryBuilderFreezer =
                    response.data?.nisthirdpartysharable?.map((item) => ({
                      value: item.nisthirdpartysharable,
                      title: item.sthirdpartysharable,
                    })) || [];
                  fields = {
                    ...fields,
                    nisthirdpartysharable: {
                      label: this.props.intl.formatMessage({ id: "IDS_THIRDPARTYSHARABLE" }),
                      type: "select",
                      valueSources: ["value"],
                      fieldSettings: {
                        listValues: queryBuilderFreezer,
                      },
                    },
                  };
                } else if (field.dataField === "ssampleaccesable") {
                  const queryBuilderFreezer =
                    response.data?.nissampleaccesable?.map((item) => ({
                      value: item.nissampleaccesable,
                      title: item.ssampleaccesable,
                    })) || [];

                  fields = {
                    ...fields,
                    nissampleaccesable: {
                      label: this.props.intl.formatMessage({ id: "IDS_SAMPLEACCESABLE" }),
                      type: "select",
                      valueSources: ["value"],
                      fieldSettings: {
                        listValues: queryBuilderFreezer,
                      },
                    },
                  };
                } else if (field.dataField === "sinstrumentid") {
                  const queryBuilderFreezer =
                    response?.data?.lstInstrument?.map((item) => ({
                      value: item.ninstrumentcode,
                      title: item.sinstrumentid,
                    })) || [];

                  fields = {
                    ...fields,
                    ninstrumentcode: {
                      label: this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" }),
                      type: "select",
                      valueSources: ["value"],
                      fieldSettings: {
                        listValues: queryBuilderFreezer,
                      },
                    },
                  };
                } else {
                  fields = {
                    ...fields,
                    [field.dataField]: {
                      label: field.dataField,
                      type: "text",
                      valueSources: ["value", "func"],
                      mainWidgetProps: {
                        valueLabel: "Name",
                        valuePlaceholder: field.dataField,
                      },
                    },
                  };
                }
              });
            }
            this.setState({
              fields: fields,
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
      }
    } else if (field === "nformtypecode") {
      rsapi()
        .post("disposalsamplesapproval/getFormTypeSiteBasedFormNumber", {
          userinfo: this.props.Login.userInfo,
          ndisposalbatchtypecode: this.state.selectedRecord.ndisposalbatchtypecode?.value || -1,
          nformtypecode: event ? event.value || -1 : -1,
        })
        .then((response) => {
          // selectedRecord['nformtypecode'] = [];
          // selectedRecord['nbiomovetodisposecode'] = [];
          Object.assign(selectedRecord, {
            nformtypecode: [],
            nbiomovetodisposecode: [],
            formsiteorthirdpartyname: "",
          });

          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;

          const lstFormNumber = response.data.lstFormNumber || [];
          selectedRecord[field] = event;
          this.setState({
            selectedRecord,
            lstFormNumber,
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
    } else if (field === "nbiomovetodisposecode") {
      rsapi()
        .post("disposalsamplesapproval/getFormTypeBasedSiteAndThirdParty", {
          userinfo: this.props.Login.userInfo,
          ndisposalbatchtypecode: this.state.selectedRecord.ndisposalbatchtypecode?.value || -1,
          nformtypecode: this.state.selectedRecord.nformtypecode?.value || -1,
          nbiomovetodisposecode: event ? event.value || -1 : -1,
        })
        .then((response) => {
          Object.assign(selectedRecord, {
            formsiteorthirdpartyname: "",
          });

          selectedRecord["formsiteorthirdpartyname"] = response.data.formsiteorthirdpartyname || "";
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

  isValidField = (value) => {
    var isValidation = false;
    if (Array.isArray(value) === true) {
      if (value.length > 0) {
        isValidation = true;
      }
    } else {
      if (value != null && value !== "") {
        isValidation = true;
      }
    }

    return isValidation;
    //|| (value != null && value !== '');
  };

  filterData = () => {
    let selectedRecord = this.state.selectedRecord;
    const isDisposalBatchTypeCodeValid = this.isValidField(selectedRecord.ndisposalbatchtypecode);
    const isBioFormTypeCodeValid = this.isValidField(selectedRecord.nformtypecode);
    const isMoveToDisposalValid = this.isValidField(selectedRecord.nbiomovetodisposecode);

    if (isDisposalBatchTypeCodeValid && isBioFormTypeCodeValid && isMoveToDisposalValid) {
      this.setState({ loading: true });
      rsapi()
        .post("disposalsamplesapproval/getSampleReceivingDetails", {
          userinfo: this.props.Login.userInfo,
          ndisposalbatchtypecode: selectedRecord?.ndisposalbatchtypecode?.value || -1,
          nformtypecode: selectedRecord?.nformtypecode?.value || -1,
          nbiomovetodisposecode: selectedRecord?.nbiomovetodisposecode?.value || -1,
        })
        .then((response) => {
          // commentted & added by sujatha ATE_274 for getting jsondata data as parsed and to set BGSI-218
          // const lstGetSampleReceivingDetails = response.data?.lstGetSampleReceivingDetails || [];
          const lstGetSampleReceivingDetails = (response.data?.lstGetSampleReceivingDetails || []).map((item) => ({
            ...item,
            jsondata: item.jsondata?.value ? JSON.parse(item.jsondata.value) : item.jsondata,
          }));

          selectedRecord["lstGetSampleReceivingDetails"] = lstGetSampleReceivingDetails;
          selectedRecord["addedSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
          let dataState = { skip: 0, take: 10 };

          const processed = process(lstGetSampleReceivingDetails || [], dataState);
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
          selectedRecord["lstGetSampleReceivingDetails"] = [];
          selectedRecord["addSelectAll"] = false;
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
            this.setState({ loading: false, selectedRecord });
          } else if (error.response.status === 500) {
            toast.error(error.message);
            this.setState({ loading: false, selectedRecord });
          } else {
            toast.warn(error.response.data);
            this.setState({ loading: false, selectedRecord });
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
    let lstGetSampleReceivingDetails = [];

    if (selectedRecord?.isEnableStoreFilter === false) {
      lstGetSampleReceivingDetails = this.state?.dataResult.map((item) => {
        if (item.nbiomovetodisposedetailscode === event.dataItem.nbiomovetodisposedetailscode) {
          item.selected = !event.dataItem.selected;
          if (item.selected) {
            const newItem = JSON.parse(JSON.stringify(item));
            delete newItem["selected"];
            newItem.selected = true;
            addedSampleReceivingDetails.push(newItem);
          } else {
            addedSampleReceivingDetails = addedSampleReceivingDetails.filter(
              (item1) => item1.nbiomovetodisposedetailscode !== item.nbiomovetodisposedetailscode
            );
          }
        }
        return item;
      });
    } else {
      lstGetSampleReceivingDetails = this.state?.dataResult.map((item) => {
        if (item.nsamplestoragetransactioncode === event.dataItem.nsamplestoragetransactioncode) {
          item.selected = !event.dataItem.selected;
          if (item.selected) {
            const newItem = JSON.parse(JSON.stringify(item));
            delete newItem["selected"];
            newItem.selected = true;
            addedSampleReceivingDetails.push(newItem);
          } else {
            addedSampleReceivingDetails = addedSampleReceivingDetails.filter(
              (item1) => item1.nsamplestoragetransactioncode !== item.nsamplestoragetransactioncode
            );
          }
        }
        return item;
      });
    }

    selectedRecord["addedSampleReceivingDetails"] = addedSampleReceivingDetails;
    selectedRecord["addSelectAll"] = this.validateCheckAll(
      process(lstGetSampleReceivingDetails || [], this.state.dataState).data
    );
    this.props.childDataChange(selectedRecord);

    this.setState({
      selectedRecord,
      dataResult: lstGetSampleReceivingDetails,
    });
    //this.props.childDataChange(selectedRecord);
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
    let lstGetSampleReceivingDetails = this.state.dataResult || [];
    let addedSampleReceivingDetails = this.state.dataResult || [];
    let selectedRecord = this.state.selectedRecord;
    let selectedChildRecord = this.state.selectedChildRecord;

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
      //selectedRecord['lstGetSampleReceivingDetails'] = data;
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

export default connect(mapStateToProps, {})(injectIntl(AddDisposalSampleApproval));
