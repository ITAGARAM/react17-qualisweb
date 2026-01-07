import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

const AddProduct = (props) => {

    return (

        <Row>
            <Col md={12}>

                <FormSelectSearch
                    formLabel={props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    isSearchable={true}
                    name={"nproductcatcode"}
                    isDisabled={false}
                    placeholder={props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    isMandatory={true}
                    options={props.productCategoryList}
                    alphabeticalSort="true"
                    optionId="nproductcatcode"
                    optionValue="sproductcatname"
                    value={props.selectedRecord ? props.selectedRecord["nproductcatcode"] : ""}
                    defaultValue={props.selectedRecord ? props.selectedRecord["nproductcatcode"] : ""}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nproductcatcode')}>
                </FormSelectSearch>

                <FormInput
                    label={props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                    name="sproductname"
                    type="text"
                    isMandatory={"*"}
                    required={true}
                    maxLength="100"
                    value={props.selectedRecord["sproductname"] || []}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                />

                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    name={"sdescription"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={250}
                >
                </FormTextarea>

                <CustomSwitch
                    name={"ndefaultstatus"}
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    onChange={(event) => props.onInputOnChange(event, 1, [3, 4])}
                    //onChange={(event)=>props.onActiveStatusChange(event, [1, 2])}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                    checked={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                >
                </CustomSwitch>

            </Col>

        </Row>
    );
}

export default injectIntl(AddProduct);
