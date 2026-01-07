import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const ViewTypeFilter = (props) => {
  return (
    <Row>
      <Col md={12}>
        
        <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_VIEWTYPE" })}
                    isSearchable={true}
                    name={"nauditactionfiltercode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={false}
                    showOption={true}
                     menuPosition="fixed"
                    options={props.filterViewType}
                    optionId='nauditactionfiltercode'
                    optionValue='sauditactionfiltername'
                    value={props.selectedRecord["nauditactionfiltercode"] ? props.selectedRecord["nauditactionfiltercode"] : ""}
                    onChange={value => props.onComboChange(value, "nauditactionfiltercode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                
      </Col>
    </Row>
  );
};
export default injectIntl(ViewTypeFilter);