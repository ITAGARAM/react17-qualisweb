import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';


const AddSample = (props) => {
  return (
    <>
      <Row>
        <Col md={12}>
          <FormInput
            label={props.intl.formatMessage({ id: "IDS_SAMPLE" })}
            name={"ssamplearno"}
            type="text"
            onChange={(event) => props.onInputChange(event)}
            onKeyUp={(event) => props.onKeyUp(event)}
            placeholder={props.intl.formatMessage({ id: "IDS_SAMPLE" })}
            value={props.selectedRecord ? props.selectedRecord["ssamplearno"] : ""}
            isMandatory={true}
            required={true}
            maxLength={"50"}
          />
        </Col>

      </Row>
      {props.isneedSubSampleQty === true ?
        <>
          < Row >
            <Col md={6}>
              <FormNumericInput
                name={"nsampleqty"}
                label={props.intl.formatMessage({ id: "IDS_SAMPLEQTY" })}
                type="number"
                value={props.selectedRecord["nsampleqty"]}
                placeholder={props.intl.formatMessage({ id: "IDS_SAMPLEQTY" })}
                strict={true}
                min={0}
                maxLength={11}
                onChange={(value) => props.onNumericInputChange(value, "nsampleqty")}
                noStyle={true}
                precision={2}
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
                isDisabled={false}
                closeMenuOnSelect={true}
                onChange={(event) => props.onComboChange(event, 'nunitcode', 0)}
              />
            </Col>
          </Row>
        </>
        :
        <></>
      }

    </>)
}
export default injectIntl(AddSample);
