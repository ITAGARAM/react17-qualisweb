import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddMAHolder = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_MAHNAME" })}
                    name={"smahname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_MAHNAME" })}
                    value={props.selectedRecord["smahname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    readOnly={props.userLogged}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS1" })}
                    name={"saddress1"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS1" })}
                    value={props.selectedRecord["saddress1"]}
                    rows="2"
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS2" })}
                    name={"saddress2"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS2" })}
                    value={props.selectedRecord["saddress2"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.formatMessage({ id: "IDS_ADDRESS3" })}
                    name={"saddress3"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_ADDRESS3" })}
                    value={props.selectedRecord["saddress3"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_COUNTRY" })}
                    isSearchable={true}
                    name={"ncountrycode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.countryList}
                    optionId='ncountrycode'
                    optionValue='scountryname'
                    value={props.selectedRecord["ncountrycode"]}
                    defaultValue={props.selectedRecord["ncountrycode"]}

                    onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            </Col>

            <Col md={12}>
                <CustomSwitch
                    label={props.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    type="switch"
                    name={"ntransactionstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                    defaultValue={props.selectedRecord["ntransactionstatus"] === 1 ? true : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["ntransactionstatus"] === 1 ? true : false}
                />
            </Col>


        </Row>
    )
}
export default AddMAHolder;
