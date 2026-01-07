import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

const SendSubContractor = (props) => {

    return (

        <Row>
            <Col md={12}>

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SUBCONTRACTOR"})}
                    isSearchable={true}
                    name={"nsuppliercode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SUBCONTRACTOR"})}
                    isMandatory={true}
                    options={props.subContracorMapList}
                    alphabeticalSort="true"
                    optionId="nsuppliercode"
                    optionValue="ssubcontractor"
                    value={props.selectedRecord ? props.selectedRecord["nsuppliercode"] : ""}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nsuppliercode"] : ""}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nsuppliercode')}>
                </FormSelectSearch>


                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name={"sremarks"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    value={props.selectedRecord ? props.selectedRecord["sremarks"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                >
                </FormTextarea>

            </Col>

        </Row>
    );
}

export default injectIntl(SendSubContractor);
