import React from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import FormSelectSearch from "./form-select-search.component";

class FormSelectSearchWithColour extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      colorFilter: null,
    };

    this.handleAllClick = this.handleAllClick.bind(this);
    this.handleFullClick = this.handleFullClick.bind(this);
    this.handlePartialClick = this.handlePartialClick.bind(this);
    this.focusSelect = this.focusSelect.bind(this);
  }

  focusSelect() {
    try {
      const wrapper = document.getElementById(this.props.name);
      const input = wrapper && wrapper.querySelector("input");
      if (input && typeof input.focus === "function") input.focus();
    } catch (e) {
      console.log("Error in dropdown extract");
    }
  }

  handleAllClick() {
    this.setState({ colorFilter: null }, this.focusSelect);
  }

  handleFullClick() {
    this.setState((prev) => ({ colorFilter: prev.colorFilter === "black" ? null : "black" }), this.focusSelect);
  }

  handlePartialClick() {
    this.setState((prev) => ({ colorFilter: prev.colorFilter === "red" ? null : "red" }), this.focusSelect);
  }

  render() {
    const {
      intl,
      options = [],
      formLabel = "Parent Sample Code",
      name,
      value,
      onChange,
      isDisabled,
      placeholder,
      isMandatory,
      isClearable,
      closeMenuOnSelect = true,
      alphabeticalSort = true,
      matchFrom = "any",
      ...rest
    } = this.props;

    const { colorFilter } = this.state;

    const normalized = (Array.isArray(options) ? options : []).map((o) => {
      const item = (o && o.item) || o || {};

      const label = o?.label ?? item?.sparentsamplecodecohortno ?? item?.sparentsamplecode ?? "";
      const valueVal = o?.value ?? item?.sparentsamplecodecohortno ?? item?.sparentsamplecode ?? "";

      const rawStatus = String(o?.color ?? item?.scolor ?? item?.savailable ?? "")
        .trim()
        .toLowerCase();

      let status = "full";
      if (typeof item.ntestednos === "number" && typeof item.ntotalnos === "number") {
        status = item.ntestednos < item.ntotalnos ? "partial" : "full";
      } else if (rawStatus.includes("part")) {
        status = "partial";
      }

      const color = status === "partial" ? "red" : "black";
      return { ...o, label, value: valueVal, color, item, status };
    });

    // Apply color
    const filtered = colorFilter
      ? normalized.filter((o) => (o.color || "black").toLowerCase() === colorFilter.toLowerCase())
      : normalized;

    // alphabetical sort
    const finalOptions = alphabeticalSort
      ? [...filtered].sort((a, b) => String(a.label || "").localeCompare(String(b.label || "")))
      : filtered;

    // Style for color chips
    const chipStyle = (active) => ({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      width: 22,
      height: 22,
      border: active ? "2px solid #007bff" : "1px solid #ccc",
      background: "#fff",
      cursor: "pointer",
      padding: 0,
    });

    return (
      // modified by thenmozhi for design issue in direct & request based transfer demo src
      <div style={{ background: "#fff", marginTop:"-20px" }}> 
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 0,  // modified by thenmozhi for design issue in direct & request based transfer demo src

          }}
        >
          <label
            htmlFor={name}
            style={{
              fontSize: 13,
              color: "#333",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom:"0"   // added by thenmozhi for design issue in direct & request based transfer demo src
            }}
          >
            {formLabel}
          {isMandatory && <sup>*</sup>}
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* ALL */}
            <button
              type="button"
              onClick={this.handleAllClick}
              style={chipStyle(!colorFilter)}
              data-tooltip-id="my-tooltip" data-tooltip-content={intl.formatMessage({ id: "IDS_SHOWALL" })}
            >
              <span
                style={{
                  width: 8,   // modified by thenmozhi for design issue in direct & request based transfer demo src
                  height: 8,   // modified by thenmozhi for design issue in direct & request based transfer demo src
                  borderRadius: "50%",
                  background: "gray",
                  border: "1px solid rgba(0,0,0,0.2)",
                  display: "inline-block",
                }}
              />
            </button>

            {/* FULL (Black) */}
            <button
              type="button"
              onClick={this.handleFullClick}
              style={chipStyle(colorFilter === "black")}
              data-tooltip-id="my-tooltip" data-tooltip-content={intl.formatMessage({ id: "IDS_NOTTRANSFERRED" })}
            >
              <span
                style={{
                  width: 8,    // modified by thenmozhi for design issue in direct & request based transfer demo src
                  height: 8,    // modified by thenmozhi for design issue in direct & request based transfer demo src
                  borderRadius: "50%",
                  background: "black",
                  border: "1px solid rgba(0,0,0,0.2)",
                  display: "inline-block",
                }}
              />
            </button>

            {/* PARTIAL (Red) */}
            <button
              type="button"
              onClick={this.handlePartialClick}
              style={chipStyle(colorFilter === "red")}
              data-tooltip-id="my-tooltip" data-tooltip-content={intl.formatMessage({ id: "IDS_TRANSFERRED" })}
            >
              <span
                style={{
                  width: 8,    // modified by thenmozhi for design issue in direct & request based transfer demo src
                  height: 8,    // modified by thenmozhi for design issue in direct & request based transfer demo src
                  borderRadius: "50%",
                  background: "red",
                  border: "1px solid rgba(0,0,0,0.2)",
                  display: "inline-block",
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ paddingTop: 2 }}>
          <FormSelectSearch
            formLabel=""
            name={name}
            placeholder={placeholder}
            options={finalOptions}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
            isMandatory={false}
            isClearable={isClearable}
            closeMenuOnSelect={closeMenuOnSelect}
            alphabeticalSort={alphabeticalSort}
            matchFrom={matchFrom}
            {...rest}
          />
        </div>
      </div>
    );
  }
}

FormSelectSearchWithColour.propTypes = {
  intl: PropTypes.object.isRequired,
  options: PropTypes.array,
  formLabel: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isMandatory: PropTypes.bool,
  isClearable: PropTypes.bool,
  alphabeticalSort: PropTypes.bool,
  matchFrom: PropTypes.oneOf(["any", "start"]),
};

export default injectIntl(FormSelectSearchWithColour);
