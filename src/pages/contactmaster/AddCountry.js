import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
//import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddCountry = (props) => {
    return (

        <Row>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_COUNTRYNAME" })}
                    name={"scountryname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_COUNTRYNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["scountryname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_COUNTRYABBREVIATION" })}
                    name={"scountryshortname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_COUNTRYABBREVIATION" })}
                    value={props.selectedRecord ? props.selectedRecord["scountryshortname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={10}
                />
            </Col>
            {/* <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_TWOCHARCOUNTRY" })}
                    name={"stwocharcountry"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TWOCHARCOUNTRY" })}
                    value={props.selectedRecord ? props.selectedRecord["stwocharcountry"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={2}
                />
            </Col> 
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_THREECHARCOUNTRY" })}
                    name={"sthreecharcountry"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_THREECHARCOUNTRY" })}
                    value={props.selectedRecord ? props.selectedRecord["sthreecharcountry"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={3}
                />
            </Col>*/}
        </Row>
    )
}
export default AddCountry;
