import React from 'react';
 import { Row, Col } from 'react-bootstrap';
// import FormInput from '../../components/form-input/form-input.component';
// import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';


const AddBarcode = (props) => {
    // {console.log("barcode")}
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={'nbarcode'}
                    formLabel={props.intl.formatMessage({ id: "IDS_BARCODE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.BarcodeList || []}
                    value={props.selectedRecord ? props.selectedRecord["nbarcode"] : ""}
                    isMandatory={true}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, "nbarcode")}
                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PRINTERNAME" })}
                    name={"sprintername"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord ? props.selectedRecord["sprintername"] : ""}
                    options={props.Printer}
                    optionId="sprintername"
                    optionValue="sprintername"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={false}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "sprintername")}
                />
            </Col>
            <Col md={12}>
            {props.nbarcodeprint ?
                <FormNumericInput
                    name={"nbarcodeprintcount"}
                    label={props.intl.formatMessage({ id: "IDS_NUMBEROFPRINT" })}
                    type="number"
                    value={props.selectedRecord["nbarcodeprintcount"]&&props.selectedRecord["nbarcodeprintcount"]}
                    placeholder={props.intl.formatMessage({ id: "IDS_NUMBEROFPRINT" })}
                    strict={true}
                    min={0}
                    maxLength={6}
                    onChange={(value) => props.onNumericInputChange(value, "nbarcodeprintcount")}
                    noStyle={true}
                    precision={0}
                    className="form-control"
                    errors="Please provide a valid number."
                />
                : ""}

        </Col>

        </Row >
    );
};
export default injectIntl(AddBarcode);