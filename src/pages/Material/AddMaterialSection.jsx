import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

const AddMaterialSection = (props) => {
  return (
    <Row>
      <Col md={12}>
        {props.ismaterialsectionEdit ?
          <FormSelectSearch
            name={"nmaterialsectioncode"}
            as={"select"}
            onChange={(event) => props.onComboChange(event, 'nmaterialsectioncode')}
            formLabel={props.intl.formatMessage({ id: "IDS_MATERIALSECTION" })}
            isMandatory={true}
            value={props.selectedRecord["nmaterialsectioncode"] ? props.selectedRecord["nmaterialsectioncode"] || [] : []}
            options={props.comboData}
            optionId={"value"}
            optionValue={"label"}
            isMulti={false}
            isDisabled={false}
            isSearchable={false}
            isClearable={false}
          />
          :
          <FormMultiSelect
            name={"nmaterialsectioncode"}
            label={props.intl.formatMessage({ id: "IDS_MATERIALSECTION" })}
            options={props.comboData || []}
            optionId="value"
            optionValue="label"
            value={props.selectedRecord["nmaterialsectioncode"] ? props.selectedRecord["nmaterialsectioncode"] || [] : []}
            isMandatory={true}
            isClearable={true}
            disableSearch={props.isDisabled}
            disabled={props.isDisabled}
            closeMenuOnSelect={false}
            alphabeticalSort={true}
            onChange={(event) => props.onComboChange(event, "nmaterialsectioncode")}
          />}

        <FormNumericInput
          name={"nreorderlevel"}
          label={props.intl.formatMessage({ id: "IDS_REORDERLEVEL" })}
          className="form-control"
          type="numeric"
          strict={true}
          value={props.selectedRecord["nreorderlevel"] ? props.selectedRecord["nreorderlevel"] : ""}
          isMandatory={false}
          required={false}
          maxLength={8}
          isDisabled={false}
          onChange={(event) => props.onNumericInputChange(event, 'nreorderlevel')}
          precision={4}
          max={99999999}
          min={0}
          noStyle={true}
        />


      </Col>

    </Row>
  );
}

export default injectIntl(AddMaterialSection);