import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
//import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

const AddPlasmaMasterFile = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_MANUFNAME" })}
                    isSearchable={true}
                    name={"nmanufcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.manufList}//.Manufacturer
                    optionId='nmanufcode'
                    optionValue='smanufname'
                    value={props.selectedRecord ? props.selectedRecord["nmanufcode"] : ""}
                    onChange={(event) => props.onComboChange(event, 'nmanufcode')}
                    isMulti={false}

                    closeMenuOnSelect={true}
                //alphabeticalSort={true}
                />
            </Col>
            <Col md={12}>

                <FormInput
                    label={props.formatMessage({ id: "IDS_PLASMAFILENUMBER" })}
                    name={"splasmafilenumber"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_PLASMAFILENUMBER" })}
                    value={props.selectedRecord["splasmafilenumber"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    readOnly={props.userLogged}
                />

            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DESCRIPTION" })}
                    //defaultValue={props.selectedRecord["sdescription"]}
                    value={props.selectedRecord?props.selectedRecord["sdescription"]:""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>

        </Row>
    )
}
export default injectIntl(AddPlasmaMasterFile);
