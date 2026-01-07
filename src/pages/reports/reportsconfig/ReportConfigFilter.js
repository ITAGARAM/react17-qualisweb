import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const ReportConfigFilter = (props) => {
  return (
    <Row>
        <Col md={12}>
        
            <FormSelectSearch
                    name={"filterreporttypecode"}
                    formLabel={ props.intl.formatMessage({ id:"IDS_REPORTTYPE"})}                              
                    placeholder="Please Select..."                              
                    options={props.reportTypeList || []}
                   // value = { props.selectedRecord ?props.selectedRecord["filterreporttypecode"]:""}
                    value={props.selectedRecord.filterreporttypecode ? props.selectedRecord.filterreporttypecode
                        :props.filterReportType ? { "label": props.filterReportType.sdisplayname, "value": props.filterReportType.nreporttypecode } : ""}
      
                    isMandatory={true}
                    isMulti={false}
                    isClearable={false}
                    isSearchable={true}                                
                    closeMenuOnSelect={true}
                    onChange = {(event)=> props.onComboChange(event, "filterreporttypecode")}                               
            />
        </Col>
    </Row>
  );
};
export default injectIntl(ReportConfigFilter);