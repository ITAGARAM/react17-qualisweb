import React from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import FormTextarea from "../../../../src/components/form-textarea/form-textarea.component";
import { injectIntl } from "react-intl";
import { updateStore } from "../../../actions";
import { DEFAULT_RETURN } from "../../../actions/LoginTypes";

const mapStateToProps = (state) => ({ Login: state.Login });

class ApprovepopupBioEcatalogueReqApproval extends React.Component {
  constructor(props) {
    super(props);

    const normalized = Array.isArray(props.selectedBioEcatalogueReqApproval)
      ? props.selectedBioEcatalogueReqApproval[0] || {}
      : props.selectedBioEcatalogueReqApproval || {};

    this.state = {
      selectedRecord: {
        ...normalized,
        ...props.selectedRecord,
        sapprovalremarks: "",
      },
    };
  }

  onRemarksChange = (fieldName, value) => {
    const updatedRecord = {
      ...(this.state.selectedRecord || {}),
      [fieldName]: value,
    };

    this.setState({ selectedRecord: updatedRecord }, () => {
      if (typeof this.props.childDataChange === "function") {
        this.props.childDataChange(updatedRecord);
      }

      try {
        const masterData = { ...(this.props.Login.masterData || {}) };
        masterData.selectedRecord = updatedRecord;
        this.props.updateStore({
          typeName: DEFAULT_RETURN,
          data: { masterData },
        });
      } catch (err) {
        console.warn("Failed to persist remarks:", err);
      }
    });
  };

  render() {
    const { intl } = this.props;

    return (
      <Row className="mt-2">
        <Col md={12}>
          <label>{intl.formatMessage({ id: "IDS_REMARKS" })}</label>
          <FormTextarea
            name="sapprovalremarks"
            rows={'24'}
            showLabel={false}
            placeholder={intl.formatMessage({ id: "IDS_REMARKS" })}
            value={this.state.selectedRecord?.sapprovalremarks ?? ""}
            onChange={(e) => this.onRemarksChange("sapprovalremarks", e.target.value)}
            maxLength={"255"}  // added by sujatha ATE_274 for length issue bgsi-208
          />
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, { updateStore })(injectIntl(ApprovepopupBioEcatalogueReqApproval));
