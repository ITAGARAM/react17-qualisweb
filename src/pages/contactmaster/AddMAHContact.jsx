import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
//import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddMAHContact = (props) => {

    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_MAHCONTACTNAME" })}
                    name={"smahcontactname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_MAHCONTACTNAME" })}
                    value={props.selectedRecord["smahcontactname"]}
                    error={"*"}
                    isMandatory={true}
                    required={true}
                    maxLength={100}

                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_PHONENO" })}
                    name={"sphoneno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_PHONENO" })}
                    value={props.selectedRecord["sphoneno"]}
                    isMandatory={false}
                    required={false}
                    maxLength={50}

                />

            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_MOBILENO" })}
                    name={"smobileno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_MOBILENO" })}
                    value={props.selectedRecord["smobileno"]}
                    isMandatory={false}
                    required={false}
                    maxLength={50}

                />
            </Col>

            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_FAXNO" })}
                    name={"sfaxno"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_FAXNO" })}
                    value={props.selectedRecord["sfaxno"]}
                    isMandatory={false}
                    required={false}
                    maxLength={50}

                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_EMAIL" })}
                    name={"semail"}
                    type="email"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_EMAIL" })}
                    value={props.selectedRecord["semail"]}
                    error={"*"}
                    isMandatory={true}
                    required={true}
                    maxLength={50}

                />
            </Col>

            <Col md={12}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                    defaultValue={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                    isMandatory={false}
                    checked={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                />
            </Col>
        </Row>
    )
}

export default AddMAHContact;