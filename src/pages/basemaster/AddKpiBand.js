import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { injectIntl } from 'react-intl';

const AddKpiBand = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PRODUCTNAME" })}
                    isSearchable={true}
                    name={"nproductcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.productList || []}
                    optionId='nproductcode'
                    optionValue='sproductname'

                    value={props.selectedRecord ? props.selectedRecord["nproductcode"] : ""}

                    onChange={(event) => props.onComboChange(event, 'nproductcode')}
                    isMulti={false}

                    closeMenuOnSelect={true}
                //alphabeticalSort={true}
                />
            </Col>
            <Col md={12}>

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_KPIBANDNAME" })}
                    name={"skpibandname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_KPIBANDNAME" })}
                    value={props.selectedRecord["skpibandname"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    readOnly={props.userLogged}
                />

            </Col>
            <Col md={12}>
                <FormNumericInput
                    name="nnumberofdays"
                    label={props.intl.formatMessage({ id: "IDS_NUMBEROFDAYS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_NUMBEROFDAYS" })}
                    type="number"
                    value={props.selectedRecord["nnumberofdays"]}
                    //max={99}
                    min={0}
                    strict={true}
                    maxLength={5}
                    onChange={(event) => props.onNumericInputOnChange(event, "nnumberofdays")}
                    //onChange={(event) => props.onInputOnChange(event, "nnumberofdays")}
                    //noStyle={true}
                    precision={0}
                    className="form-control"
                    noStyle={true}
                    isMandatory={true}
                    errors="Please provide a valid number."
                />

            </Col>

            <Col md={6} className={"p-0"}>
                <Col md={12}>
                    <FormNumericInput
                        name="nbeforewindowperiod"
                        label={props.intl.formatMessage({ id: "IDS_BEFOREWINDOWPERIOD" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_BEFOREWINDOWPERIOD" })}
                        type="number"
                        value={props.selectedRecord["nbeforewindowperiod"]}
                        //max={99}
                        min={0}
                        strict={true}
                        maxLength={5}
                        onChange={(event) => props.onNumericInputOnChange(event, "nbeforewindowperiod")}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />

                </Col>

                <Col md={12}>
                    <FormNumericInput
                        name="nafterwindowperiod"
                        label={props.intl.formatMessage({ id: "IDS_AFTERWINDOWPERIOD" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_AFTERWINDOWPERIOD" })}
                        type="number"
                        value={props.selectedRecord["nafterwindowperiod"]}
                        //max={99}
                        min={0}
                        strict={true}
                        maxLength={5}
                        onChange={(event) => props.onNumericInputOnChange(event, "nafterwindowperiod")}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />

                </Col>
            </Col>
            <Col md={6} className={"p-0"}>
                <Col md={12}>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_BEFOREPERIODCODE" })}
                        isSearchable={false}
                        name={"nbeforeperiodcode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.periodList || []}
                        optionId='nperiodcode'
                        optionValue='speriodname'

                        value={props.selectedRecord ? props.selectedRecord["nbeforeperiodcode"] : ""}
                        showOption={true}
                        required={true}

                        onChange={(event) => props.onComboChange(event, 'nbeforeperiodcode')}
                        isMulti={false}
                        closeMenuOnSelect={true}
                    //alphabeticalSort={true}
                    />
                </Col>

                <Col md={12}>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_AFTERPERIODCODE" })}
                        isSearchable={false}
                        name={"nafterperiodcode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.periodList || []}
                        optionId='nperiodcode'
                        optionValue='speriodname'

                        value={props.selectedRecord ? props.selectedRecord["nafterperiodcode"] : ""}
                        showOption={true}
                        required={true}

                        onChange={(event) => props.onComboChange(event, 'nafterperiodcode')}
                        isMulti={false}
                        closeMenuOnSelect={true}
                    //alphabeticalSort={true}
                    />
                </Col>
            </Col>


        </Row>
    )
}
export default injectIntl(AddKpiBand);
