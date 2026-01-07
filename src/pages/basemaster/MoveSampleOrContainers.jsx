import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col, Form } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import TreeViewEditable from '../../components/form-tree-editable/form-tree-editable.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormInput from '../../components/form-input/form-input.component';

const AddTreeview = (props) => {
  return (
    <>
      {props.isSendToStore === true ?
        <Row>
          <Col md={12}>
            <FormInput
              label={props.intl.formatMessage({ id: "IDS_SAMPLE" })}
              name={"sampleToStore"}
              type="text"
              onChange={(event) => props.onInputOnChange(event)}
              placeholder={props.intl.formatMessage({ id: "IDS_SAMPLE" })}
              value={props.selectedRecord ? props.selectedRecord["sampleToStore"] : ""}
              isMandatory={false}
              isDisabled={true}
              required={true}
              maxLength={"100"}
            />
          </Col>
          {props.isneedSubSampleQty === true ?
            <>
              <Col md={6}>
                <FormNumericInput
                  name={"nsampleqty"}
                  label={props.intl.formatMessage({ id: "IDS_SAMPLEQTY" })}
                  type="number"
                  value={props.selectedRecord["nsampleqty"]}
                  placeholder={props.intl.formatMessage({ id: "IDS_SAMPLEQTY" })}
                  strict={true}
                  min={0}
                  //max={99999999.99}
                  maxLength={11}
                  onChange={(value) => props.onNumericInputChange(value, "nsampleqty")}
                  noStyle={true}
                  precision={2}
                  //isMandatory={true}
                  className="form-control"
                  errors="Please provide a valid number."
                />
              </Col>
              <Col md={6}>
                <FormSelectSearch
                  name={"nunitcode"}
                  formLabel={props.intl.formatMessage({ id: "IDS_UNIT" })}
                  placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                  options={props.unitMaster}
                  value={props.selectedRecord["nunitcode"]}
                  isMandatory={false}
                  isClearable={false}
                  isMulti={false}
                  isSearchable={true}
                  isDisabled={true}
                  closeMenuOnSelect={true}
                  onChange={(event) => props.onComboChange(event, 'nunitcode', 4)}
                />
              </Col>
            </> : <></>}
        </Row>
        :
        <></>
      }
      <Row>

        <Col md={12}>
          <FormSelectSearch
            name={"nstoragecategorycode"}
            formLabel={props.intl.formatMessage({ id: "IDS_STORAGECATEGORY" })}
            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            options={props.storageCategory}
            value={props.selectedRecord["nstoragecategorycode"]}
            isMandatory={true}
            isClearable={false}
            isMulti={false}
            isSearchable={true}
            isDisabled={false}
            closeMenuOnSelect={true}
            onChange={(event) => props.onComboChange(event, 'nstoragecategorycode', 4)}
          />
        </Col>
        <Col md={12}>
          <FormSelectSearch
            name={"nsamplestoragelocationcode"}
            formLabel={props.intl.formatMessage({ id: "IDS_STORAGELOCATION" })}
            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            options={props.approvedLocation}
            value={props.selectedRecord["nsamplestoragelocationcode"]}
            isMandatory={true}
            isClearable={false}
            isMulti={false}
            isSearchable={true}
            isDisabled={false}
            closeMenuOnSelect={true}
            onChange={(event) => props.onComboChange(event, 'nsamplestoragelocationcode', 5)}
          />
        </Col>
        <Col md={12}>
          <TreeViewEditable
            id="samplestoragelocation"
            name="samplestoragelocation"
            placeholder="Enter samplestoragelocation"
            data={props.treeData}
            expandIcons={true}
            selectField={'active-node'}
            item={props.itemRender}
            onExpandChange={props.onExpandChange}
            onItemClick={props.onItemClick}
          />
        </Col>
      </Row>
    </>)
}
export default injectIntl(AddTreeview);
