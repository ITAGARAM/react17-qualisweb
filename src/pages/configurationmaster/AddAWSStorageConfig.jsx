import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';


const AddAWSStorageConfig = (props) => {

    return (

        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_ACCESSKEYID" })}
                    name={"saccesskeyid"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ACCESSKEYID" })}
                    value={props.selectedRecord ? props.selectedRecord["saccesskeyid"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                    readOnly={props.operation === "update"}
                />

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SECRETPASSKEY" })}
                    name={"ssecretpasskey"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SECRETPASSKEY" })}
                    value={props.selectedRecord ? props.selectedRecord["ssecretpasskey"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                    readOnly={props.operation === "update"}
                />

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_BUCKETNAME" })}
                    name={"sbucketname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_BUCKETNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["sbucketname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                    readOnly={props.operation === "update"}
                />

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_REGIONS" })}
                    name={"sregion"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REGIONS" })}
                    value={props.selectedRecord ? props.selectedRecord["sregion"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                    readOnly={props.operation === "update"}

                />




            </Col>

            <Col md={6}>
                <CustomSwitch
                    name={"ndefaultstatus"}
                    type="switch"
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                    //isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === transactionStatus.YES ? true : false : false}
                    onChange={(event) => props.onInputOnChange(event)}
                />
            </Col>
        </Row>
    )

}
export default injectIntl(AddAWSStorageConfig);
