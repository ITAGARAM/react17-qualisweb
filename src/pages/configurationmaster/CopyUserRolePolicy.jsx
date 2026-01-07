import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const CopyUserRolePolicy = (props) => {
    return (

        <Row>
            <Col md={12}>

                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_POLICYNAME" })}
                        name={"spolicyname"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_POLICYNAME" })}
                        defaultValue={props.selectedRecord["spolicyname"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}

                    />
                </Col>

                <Col md={12}>

                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_USERROLEPOLICY" })}
                        isSearchable={false}
                        name={"nuserrolecode"}
                        isDisabled={false}
                        isMulti={true}
                        placeholder="Please Select..."
                        isMandatory={true}
                        showOption={true}
                        options={props.filterUserRole}
                        optionId='nuserrolecode'
                        optionValue='suserrolename'
                        onChange={value => props.onComboChange(value, "nuserrolecode", 4)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
            </Col>

        </Row>



    )
}
export default CopyUserRolePolicy;
