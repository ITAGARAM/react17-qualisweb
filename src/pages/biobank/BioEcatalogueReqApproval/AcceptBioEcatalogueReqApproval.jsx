import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { connect } from "react-redux";
import FormInput from "../../../components/form-input/form-input.component";
import { injectIntl } from "react-intl";
import { updateStore } from "../../../actions";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "../../../actions/LoginTypes";
import { toast } from "react-toastify";
import rsapi from "../../../rsapi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontIconWrap } from "../../../components/data-grid/data-grid.styles";

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class AcceptBioEcatalogueReqApproval extends React.Component {
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
      lstBioEcatalogueRequestDetails: props.lstBioEcatalogueRequestDetails || [],
      lstReason: props.lstReason,
      controlMap: props.controlMap,
      userRoleControlRights: props.userRoleControlRights,
      selectedRecord: {
        lstBioEcatalogueRequestDetails: props.lstBioEcatalogueRequestDetails || [],
        ...props.selectedRecord,
      },
    };
  }

  // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180
  componentDidMount() {
    const { lstBioEcatalogueRequestDetails } = this.props;
    this.props.childDataChange({ lstBioEcatalogueRequestDetails });
  }

  // Added by Gowtham R on nov 18 2025 for jira.id:BGSI-180
  componentDidUpdate(previousProps) {
    if(this.props.selectedRecord !== previousProps.selectedRecord) {
      this.setState({ selectedRecord: this.props.selectedRecord });
    }
    if(this.props.lstBioEcatalogueRequestDetails !== previousProps.lstBioEcatalogueRequestDetails) {
      this.setState({ lstBioEcatalogueRequestDetails: this.props.lstBioEcatalogueRequestDetails });
    }
  }

  fetchFilteredDetailsAndOpen = (selectedRow) => {
    this.setState({ loading: true });

    const payload = {
      nbioprojectcode: selectedRow.nbioprojectcode,
      nproductcode: selectedRow.nproductcode,
      sparentsamplecode: selectedRow.sparentsamplecode,
      nprojecttypecode: selectedRow.nprojecttypecode,
      nsitecode: selectedRow.nsitecode || this.props.Login.userInfo?.ntranssitecode,
      necatrequestreqapprovalcode: selectedRow.necatrequestreqapprovalcode,
      ntransfertypecode: selectedRow.ntransfertype,
      userinfo: this.props.Login.userInfo,
    };

    rsapi()
      .post("bioecataloguereqapproval/getFilteredRequestDetails", { ...payload })
      .then((response) => {
        const filteredList = response.data.lstSelectedsamplestoragetransaction || response.data || [];

        let masterData = { ...(this.props.Login.masterData || {}) };
        masterData["lstBioEcatalogueRequestDetails2"] = filteredList;

        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData,
            openDatatable2: true,
            openDatatable: false,
            // selectedChildRecord: selectedRow,
            loadEsign: false,
            openModalShow: true,
          },
        };
        this.props.updateStore(updateInfo);
        this.setState({ loading: false });
      })
      .catch((error) => {
        const status = error?.response?.status;
        if ([401, 403].includes(status)) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: "forbiddenaccess",
              loading: false,
              responseStatus: status,
            },
          };
          this.props.updateStore(UnAuthorizedAccess);
        } else if (status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error?.response?.data || error?.message);
        }
        this.setState({ loading: false });
      });
  };

  render() {
    // const lstBioEcatalogueRequestDetails =
    //   this.state.lstBioEcatalogueRequestDetails && this.state.lstBioEcatalogueRequestDetails.length
    //     ? this.state.lstBioEcatalogueRequestDetails
    //     : this.props.lstBioEcatalogueRequestDetails || [];
    const lstBioEcatalogueRequestDetails = this.state.selectedRecord?.lstBioEcatalogueRequestDetails || [];

    const { intl } = this.props;

    return (
      <Row className="mt-2">
        {lstBioEcatalogueRequestDetails && lstBioEcatalogueRequestDetails.length > 0 && (
          <Row className="mt-0">
            <Col md={12}>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "auto",
                  display: "block",
                }}
              >
                {" "}
                <Table bordered hover size="sm" className="aliquot-table" style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_BIOPROJECT" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_PARENTSAMPLECODE" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_REQUESTEDNOOFSAMPLES" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_REQUESTEDMINVOLµL" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_AVAILABLENOOFSAMPLES" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_ACCEPTNOOFSAMPLES" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_ACCEPTEDMINVOLµL" })}</th>
                      <th style={{ width: "20%" }}>{intl.formatMessage({ id: "IDS_ACTION" })}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lstBioEcatalogueRequestDetails.map((item, index) => (
                      <tr key={item.necateloguerequestdetailcode ?? index}>
                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          {item.sprojecttitle || "-"}
                        </td>

                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          {item.sproductname || "-"}
                        </td>

                        {/* show sparentsamplecode (DB name) */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          {item.sparentsamplecode ? item.sparentsamplecode : "-"}
                        </td>

                        {/* show nreqnoofsamples (DB name) */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                            textAlign: "center",
                          }}
                        >
                          {typeof item.nreqnoofsamples !== "undefined" && item.nreqnoofsamples !== null
                            ? item.nreqnoofsamples
                            : "-"}
                        </td>

                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                            textAlign: "center",
                          }}
                        >
                          {typeof item.sreqminvolume !== "undefined" && item.sreqminvolume !== null
                            ? item.sreqminvolume
                            : "-"}
                        </td>
                        {/* show navailablenoofsample (DB name) */}
                        <td
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                            textAlign: "center",
                          }}
                        >
                          {typeof item.navailablenoofsample !== "undefined" && item.navailablenoofsample !== null
                            ? item.navailablenoofsample
                            : "-"}
                        </td>
                        {/* naccnoofsamples should be editable (FormInput) */}
                        <td className="form-bottom" style={{ padding: "0px", verticalAlign: "middle" }}>
                          <FormInput
                            name={`naccnoofsamples_${index}`}
                            type="text"
                            showLabel={false}
                            onChange={(event) =>
                              this.onAliquotFieldChange(index, "naccnoofsamples", event.target.value)
                            }
                            placeholder={intl.formatMessage({
                              id: "IDS_ACCEPTNOOFSAMPLES",
                            })}
                            value={
                              typeof item.naccnoofsamples !== "undefined" && item.naccnoofsamples !== null
                                ? String(item.naccnoofsamples)
                                : ""
                            }
                            required={true}
                            maxLength={3}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                          />
                        </td>
                        {/* saccminvolume should be editable (FormInput) */}
                        <td className="form-bottom" style={{ padding: "0px", verticalAlign: "middle" }}>
                          <FormInput
                            name={`saccminvolume_${index}`}
                            type="text"
                            showLabel={false}
                            onChange={(event) => this.onAliquotFieldChange(index, "saccminvolume", event.target.value)}
                            placeholder={intl.formatMessage({
                              id: "IDS_ACCEPTEDMINVOLµL",
                            })}
                            value={item.saccminvolume || ""}
                            required={true}
                            maxLength={10}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                            }}
                          />
                        </td>
                        {/* Action cell */}
                        <td style={{ padding: "6px", verticalAlign: "middle", textAlign: "center" }}>
                          <FontIconWrap
                            className="d-font-icon action-icons-wrap"
                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                            data-place="left"
                            onClick={() => this.fetchFilteredDetailsAndOpen(item)}
                            hidden={
                              this.props.userRoleControlRights &&
                              this.props.userRoleControlRights.indexOf(this.props.ViewID) === -1
                            }
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </FontIconWrap>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        )}
      </Row>
    );
  }

  onAliquotFieldChange = (index, fieldName, rawValue) => {
    let sanitizedValue = rawValue || "";

    if (fieldName === "saccminvolume") {
      sanitizedValue = sanitizedValue.replace(/[^0-9,]/g, "");

      const commaIndex = sanitizedValue.indexOf(",");
      let sepIndex = commaIndex;

      if (sepIndex === -1) {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "").slice(0, 7);
      } else {
        const before = sanitizedValue
          .slice(0, sepIndex)
          .replace(/[^0-9]/g, "")
          .slice(0, 7);

        const after = sanitizedValue
          .slice(sepIndex + 1)
          .replace(/[^0-9]/g, "")
          .slice(0, 2);

        sanitizedValue = before + "," + after;
      }
    } else {
      sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "").slice(0, 6);
    }

    const currentList =
      Array.isArray(this.state.lstBioEcatalogueRequestDetails) && this.state.lstBioEcatalogueRequestDetails.length
        ? [...this.state.lstBioEcatalogueRequestDetails]
        : Array.isArray(this.props.lstBioEcatalogueRequestDetails)
        ? [...this.props.lstBioEcatalogueRequestDetails]
        : [];

    const item = currentList[index] ? { ...currentList[index] } : {};
    item[fieldName] = sanitizedValue;
    currentList[index] = item;

    const updatedRecord = {
      ...(this.state.selectedRecord || this.props.selectedRecord || {}),
      lstBioEcatalogueRequestDetails: currentList,
    };

    this.setState(
      {
        lstBioEcatalogueRequestDetails: currentList,
        selectedRecord: updatedRecord,
      },
      () => {
        if (typeof this.props.childDataChange === "function") {
          this.props.childDataChange(updatedRecord);
        }

        // Commented by Gowtham R on nov 18 2025 for jira.id:BGSI-180
        // try {
        //   const masterData = { ...(this.props.Login.masterData || {}) };
        //   masterData.lstBioEcatalogueRequestDetails = currentList;
        //   const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { masterData },
        //   };
        //   if (typeof this.props.updateStore === "function") {
        //     this.props.updateStore(updateInfo);
        //   }
        // } catch (err) {
        //   console.warn("Failed to persist edited aliquot values to redux:", err);
        // }
      }
    );
  };
}

export default connect(mapStateToProps, { updateStore })(injectIntl(AcceptBioEcatalogueReqApproval));
