import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import { process } from "@progress/kendo-data-query";
import { toast } from "react-toastify";
import DataGrid from "../../components/data-grid/data-grid.component";
import { ListWrapper } from "../../components/client-group.styles";
import { callService, updateStore, crudMaster } from "../../actions";
import { getControlMap } from "../../components/CommonScript";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import DateTimePicker from "../../../src/components/date-time-picker/date-time-picker.component";
import {
  getStartOfDay,
  getEndOfDay,
  convertDateValuetoString,
  rearrangeDateFormat,
} from "../../../src/components/CommonScript";

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class ChainofCustody extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.extractedColumnList = [];

    const dataState = {
      skip: 0,
      take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
    };

    this.state = {
      data: [],
      masterStatus: "",
      error: "",
      selectedRecord: {},
      dataResult: [],
      dataState: dataState,
      isOpen: false,
      userRoleControlRights: [],
      controlMap: new Map(),
    };
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

  dataStateChange = (event) => {
    this.setState({
      dataResult: process(this.state.data.ChainofCustody, event.dataState),
      dataState: event.dataState,
    });
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
        selectedRecord["esignpassword"] = "";
        selectedRecord["esigncomments"] = "";
      }
    } else {
      openModal = false;
      selectedRecord = {};
    }
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { openModal, loadEsign, selectedRecord },
    };
    this.props.updateStore(updateInfo);
  };

  reloadData = () => {
    let fromDate = this.props.Login.masterData.FromDate;
    let toDate = this.props.Login.masterData.ToDate;
    let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo, true);
    const inputParam = {
      inputData: { userinfo: this.props.Login.userInfo, fromDate: obj.fromDate, toDate: obj.toDate },

      classUrl: "chainofcustody",
      methodUrl: "ChainofCustody",
      displayName: this.props.Login.displayName,
      userInfo: this.props.Login.userInfo,
    };

    this.props.callService(inputParam);
  };

  handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    if (dateValue === null) {
      dateValue = new Date();
    }
    selectedRecord[dateName] = dateValue;
    this.setState({ selectedRecord });
    // this.reloadData(selectedRecord, true);

    let fromForService, toForService;

    if (dateName === "fromdate") {
      fromForService = dateValue;
      toForService = this.props.Login.masterData.ToDate;
    } else {
      //For todate
      fromForService = this.props.Login.masterData.FromDate;
      toForService = dateValue;
    }
    const dateObj = convertDateValuetoString(fromForService, toForService, this.props.Login.userInfo, true);

    const inputParam = {
      inputData: {
        userinfo: this.props.Login.userInfo,
        fromDate: dateObj.fromDate,
        toDate: dateObj.toDate,
      },
      classUrl: "chainofcustody",
      methodUrl: "ChainofCustody",
      userInfo: this.props.Login.userInfo,
      displayName: this.props.Login.displayName,
    };
    this.props.callService(inputParam);
  };

  render() {
    //let primaryKeyField = "";
    let fromDate = "";
    let toDate = "";

    if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
      fromDate =
        (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) ||
        rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
      toDate =
        (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) ||
        rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
    }

    if (this.props.Login.inputParam !== undefined) {
      this.extractedColumnList = [
        { idsName: "IDS_TRANSDATE", dataField: "stransactiondate", width: "250px" },
        { idsName: "IDS_REMARKS", dataField: "sremarks", width: "200px" },
        { idsName: "IDS_ITEMNO", dataField: "sitemno", width: "180px" },
        { idsName: "IDS_STATUS", dataField: "sdisplaystatus", width: "180px" },
        { idsName: "IDS_USER", dataField: "username", width: "180px" },
        { idsName: "IDS_SCREENNAME", dataField: "sformname", width: "180px" },
      ];
      //primaryKeyField = "ncustodycode";
    }
    return (
      <>
        <Row>
          <Col>
            <ListWrapper className="client-list-content">
              <Row>
                <Col md={3}>
                  <DateTimePicker
                    name={"fromdate"}
                    label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                    className="form-control"
                    placeholderText="Select date.."
                    selected={this.state.selectedRecord["fromdate"] || fromDate}
                    dateFormat={this.props.Login.userInfo.ssitedate}
                    isClearable={false}
                    onChange={(date) => this.handleDateChange("fromdate", date)}
                    value={this.state.selectedRecord["fromdate"] || fromDate}
                  />
                </Col>
                <Col md={3}>
                  <DateTimePicker
                    name={"todate"}
                    label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                    className="form-control"
                    placeholderText="Select date.."
                    selected={this.state.selectedRecord["todate"] || toDate}
                    dateFormat={this.props.Login.userInfo.ssitedate}
                    isClearable={false}
                    onChange={(date) => this.handleDateChange("todate", date)}
                    value={this.state.selectedRecord["todate"] || toDate}
                  />
                </Col>
                {/* <Col></Col> */}
              </Row>

              {this.state.data ? (
                <DataGrid
                  primaryKeyField={"ncustodycode"}
                  selectedId={this.props.Login.selectedId}
                  data={this.state.data.ChainofCustody} //ALPD-2169
                  dataResult={this.state.dataResult}
                  dataState={this.state.dataState}
                  dataStateChange={this.dataStateChange}
                  extractedColumnList={this.extractedColumnList}
                  controlMap={this.state.controlMap}
                  userRoleControlRights={this.state.userRoleControlRights}
                  inputParam={this.props.Login.inputParam}
                  userInfo={this.props.Login.userInfo}
                  reloadData={this.reloadData}
                  scrollable={"scrollable"}
                  gridHeight={"600px"}
                  isActionRequired={false}
                  isToolBarRequired={true}
                  pageable={true}
                  isAddRequired={false}
                  isDownloadPDFRequired={false}
                />
              ) : (
                ""
              )}
            </ListWrapper>
          </Col>
        </Row>
      </>
    );
  }

  componentDidUpdate(previousProps) {
    if (this.props.Login.masterData !== previousProps.Login.masterData) {
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
          data: this.props.Login.masterData,
          dataResult: process(this.props.Login.masterData.ChainofCustody, this.state.dataState),
        });
      } else {
        let { dataState } = this.state;
        if (this.props.Login.dataState === undefined) {
          dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 };
        }

        this.setState({
          data: this.props.Login.masterData,
          isOpen: false,
          selectedRecord: this.props.Login.selectedRecord,
          dataResult: process(
            this.props.Login.masterData.ChainofCustody ? this.props.Login.masterData.ChainofCustody : [],
            dataState
          ),
          //dataResult: process(this.props.Login.masterData, dataState),
          dataState,
        });
      }
    } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
      this.setState({ selectedRecord: this.props.Login.selectedRecord });
    }
  }
}

export default connect(mapStateToProps, { callService, updateStore, crudMaster })(injectIntl(ChainofCustody));
