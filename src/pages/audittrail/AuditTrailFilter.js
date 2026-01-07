import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AuditTrailFilter = (props) => {
  return (
    <Row>
      <Col md={12}>
        <Row>
          <Col md={6}>
            <DateTimePicker
              name={"fromdate"}
              label={props.intl.formatMessage({ id: "IDS_FROM" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["fromdate"] || props.fromDate}
              dateFormat={props.userInfo.ssitedate}            
              isClearable={false}
              onChange={(date) => props.handleDateChange("fromdate", date)}
              value={props.selectedRecord["fromdate"] || props.fromDate}
            />
          </Col>
          <Col md={6}>
            <DateTimePicker
              name={"todate"}
              label={props.intl.formatMessage({ id: "IDS_TO" })}
              className="form-control"
              placeholderText="Select date.."
              selected={props.selectedRecord["todate"] || props.toDate}
              dateFormat={props.userInfo.ssitedate}
              isClearable={false}
              onChange={(date) => props.handleDateChange("todate", date)}              
              value={props.selectedRecord["todate"] || props.toDate}
            />
          </Col>
        </Row>
        <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_MODULENAME" })}
                    isSearchable={true}
                    isClearable={true}
                    name={"nmodulecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    // menuPosition="fixed"
                    options={props.filterModuleName}
                    optionId='nmodulecode'
                    optionValue='smodulename'
                    value={props.selectedRecord["nmodulecode"] ? props.selectedRecord["nmodulecode"] : ""}
                    onChange={value => props.onComboChange(value, "nmodulecode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FORMNAME" })}
                    isSearchable={true}
                    isClearable={true}
                    name={"nformcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    // menuPosition="fixed"
                    options={props.filterFormName}
                    optionId='nformcode'
                    optionValue='sformname'
                    value={props.selectedRecord["nformcode"] ? props.selectedRecord["nformcode"] : ""}
                    onChange={value => props.onComboChange(value, "nformcode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERNAME" })}
                    isSearchable={true}
                    isClearable={true}
                    name={"nusercode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    // menuPosition="fixed"
                    options={props.filterUsers}
                    optionId='nusercode'
                    optionValue='susername'
                    value={props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] : ""}
                    onChange={value => props.onComboChange(value, "nusercode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                    isSearchable={true}
                    isClearable={true}
                    name={"nuserrolecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    // menuPosition="fixed"
                    options={props.filterUserRole}
                    optionId='nuserrolecode'
                    optionValue='suserrolename'
                    value={props.selectedRecord["nuserrolecode"] ? props.selectedRecord["nuserrolecode"] : ""}
                    onChange={value => props.onComboChange(value, "nuserrolecode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                  <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_VIEWPERIOD" })}
                    isSearchable={true}
                    name={"nauditactionfiltercode"}
                    isDisabled={false}
                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}      
                    isMandatory={false}
                    showOption={true}
                    //  menuPosition="fixed"
                    options={props.filterViewType}
                    optionId='nauditactionfiltercode'
                    optionValue='sauditactionfiltername'
                    value={props.selectedRecord["nauditactionfiltercode"] ? props.selectedRecord["nauditactionfiltercode"] : ""}
                    onChange={value => props.onComboChange(value, "nauditactionfiltercode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_VIEWARCHIVALTYPE" })}
                    isSearchable={true}
                    name={"nauditarchivaltypecode"}
                    isDisabled={false}
                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}      
                    isMandatory={false}
                    showOption={true}
                    //  menuPosition="fixed"
                    options={props.filterViewArchivalType}
                    optionId='nauditarchivaltypecode'
                    optionValue='sauditarchivaltypename'
                    value={props.selectedRecord["nauditarchivaltypecode"] ? props.selectedRecord["nauditarchivaltypecode"] : ""}
                    onChange={value => props.onComboChange(value, "nauditarchivaltypecode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
      </Col>
    </Row>
  );
};
export default injectIntl(AuditTrailFilter);