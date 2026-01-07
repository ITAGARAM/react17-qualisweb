import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const UserRolePolicy = (props) => {
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
                        value={props.selectedRecord["spolicyname"]?props.selectedRecord["spolicyname"]:""}
                        isMandatory={true}
                        required={true}
                        maxLength={100}

                    />
                </Col>

                <Col md={12}>

                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_USERROLE" })}
                        isSearchable={false}
                        name={"nuserrolecode"}
                        isDisabled={false}
                        isMulti={true}
                        // placeholder="Please Select..."
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        showOption={true}
                        options={props.filterUserRole}
                        optionId='nuserrolecode'
                        optionValue='suserrolename'
                        value={props.selectedRecord['nuserrolecode']}
                        onChange={value => props.onComboChange(value, "nuserrolecode", 4)}
                        alphabeticalSort={true}
                        closeMenuOnSelect={false}
                    >
                    </FormSelectSearch>
                </Col>
            </Col>

        </Row>



    )
}
export default UserRolePolicy;
