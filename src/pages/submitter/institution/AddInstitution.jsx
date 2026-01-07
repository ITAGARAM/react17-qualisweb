import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import {injectIntl } from 'react-intl';

const AddInstitution = (props) => {
    return (
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORY" })}
                            isSearchable={true}
                            name={"ninstitutioncatcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.InstitutionCategory}
                            value = { props.selectedRecord["ninstitutioncatcode"] || "" }
                            defaultValue={props.selectedRecord["ninstitutioncatcode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstitutioncatcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                            name={"sinstitutionname"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstitutionname"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        />
                    </Col>

                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INSTITUTIONCODE" })}
                            name={"sinstitutioncode"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTIONCODE" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstitutioncode"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"5"}
                        />
                    </Col>


                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            name={"sdescription"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        />
                    </Col>
                </Row>
       

            
    

    );
}
export default injectIntl(AddInstitution);