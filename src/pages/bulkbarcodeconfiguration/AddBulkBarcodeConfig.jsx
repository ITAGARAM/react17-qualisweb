import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const AddBulkBarcodeConfiguration = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_PROJECTTYPE" })}
                    isSearchable={true}
                    name={"nprojecttypecode"}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.projectType}
                    optionId='nprojecttypecode'
                    optionValue='sprojecttypename'
                    value={props.selectedRecord["nprojecttypecode"]}
                    onChange={(event) => props.onComboChange(event, 'nprojecttypecode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    isDisabled={true}
                />
            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_CONFIGURATIONNAME" })}
                    name={"sconfigname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event, 'sconfigname')}
                    placeholder={props.formatMessage({ id: "IDS_CONFIGURATIONNAME" })}
                    value={props.selectedRecord["sconfigname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_BARCODELENGTH" })}
                    name={"nbarcodelength"}
                    type="numeric"
                    onChange={(event) => props.onInputOnChange(event, 'nbarcodelength')}
                    placeholder={props.formatMessage({ id: "IDS_BARCODELENGTH" })}
                    value={props.selectedRecord["nbarcodelength"]}
                    isMandatory={true}
                    required={true}
                    maxLength={2}
                />
            </Col>


            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event, 'sdescription')}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
        </Row>
    )
}
export default AddBulkBarcodeConfiguration;