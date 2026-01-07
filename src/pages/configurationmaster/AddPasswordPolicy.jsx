import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
//import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

const AddPasswordPolicy = (props) => {
    return (

        <Row>
            <Col md={6}>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_POLICYNAME" })}
                        name={"spolicyname"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_POLICYNAME" })}
                        value={props.selectedRecord["spolicyname"]}
                        isMandatory={true}
                        required={true}
                        maxLength={100}

                    />

                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nminnoofnumberchar"
                        label={props.formatMessage({ id: "IDS_MINNUMBERCHAR" })}
                        placeholder={props.formatMessage({ id: "IDS_MINNUMBERCHAR" })}
                        type="number"
                        value={props.selectedRecord["nminnoofnumberchar"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, "nminnoofnumberchar")}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nminnooflowerchar"
                        label={props.formatMessage({ id: "IDS_MINLOWERCHAR" })}
                        placeholder={props.formatMessage({ id: "IDS_MINLOWERCHAR" })}
                        type="number"
                        value={props.selectedRecord["nminnooflowerchar"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nminnooflowerchar')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nminnoofupperchar"
                        label={props.formatMessage({ id: "IDS_MINUPPERCHAR" })}
                        placeholder={props.formatMessage({ id: "IDS_MINUPPERCHAR" })}
                        type="number"
                        value={props.selectedRecord["nminnoofupperchar"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nminnoofupperchar')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nminnoofspecialchar"
                        label={props.formatMessage({ id: "IDS_MINSPECIALCHAR" })}
                        placeholder={props.formatMessage({ id: "IDS_MINSPECIALCHAR" })}
                        type="number"
                        value={props.selectedRecord["nminnoofspecialchar"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, "nminnoofspecialchar")}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nminpasslength"
                        label={props.formatMessage({ id: "IDS_MINPASSWORDLENGTH" })}
                        placeholder={props.formatMessage({ id: "IDS_MINPASSWORDLENGTH" })}
                        type="number"
                        value={props.selectedRecord["nminpasslength"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nminpasslength')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
            </Col>
            <Col md={6}>
                <Col md={12}>

                    <FormNumericInput
                        name="nmaxpasslength"
                        label={props.formatMessage({ id: "IDS_MAXPASSWORDLENGTH" })}
                        placeholder={props.formatMessage({ id: "IDS_MAXPASSWORDLENGTH" })}
                        type="number"
                        value={props.selectedRecord["nmaxpasslength"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nmaxpasslength')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nnooffailedattempt"
                        label={props.formatMessage({ id: "IDS_NOOFFAILEDATTEPT" })}
                        placeholder={props.formatMessage({ id: "IDS_NOOFFAILEDATTEPT" })}
                        type="number"
                        value={props.selectedRecord["nnooffailedattempt"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nnooffailedattempt')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={true}
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={12}>
                    <CustomSwitch
                        label={props.formatMessage({ id: "IDS_EXPIRYREQUIRED" })}
                        type="switch"
                        name={"nexpirypolicyrequired"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_EXPIRYREQUIRED" })}
                        defaultValue={props.selectedRecord["nexpirypolicyrequired"] === 3 ? true : false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord["nexpirypolicyrequired"] === 3 ? true : false}
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nexpirypolicy"
                        label={props.formatMessage({ id: "IDS_EXPIRYPOLICY" })}
                        placeholder={props.formatMessage({ id: "IDS_EXPIRYPOLICY" })}
                        type="number"
                        //value={props.selectedRecord["nexpirypolicy"]}
                        value={props.selectedRecord["nexpirypolicyrequired"] === 4 ? "" : props.selectedRecord["nexpirypolicy"]}
                        max={999}
                        min={0}
                        strict={true}
                        maxLength={3}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nexpirypolicy')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={props.selectedRecord["nexpirypolicyrequired"] === 3 ? true : false}
                        errors="Please provide a valid number."
                        isDisabled={props.selectedRecord["nexpirypolicyrequired"] === 3 ? false : true}
                    />
                </Col>
                <Col md={12}>

                    <FormNumericInput
                        name="nremainderdays"
                        label={props.formatMessage({ id: "IDS_REMINDERDAYS" })}
                        placeholder={props.formatMessage({ id: "IDS_REMINDERDAYS" })}
                        type="number"
                        //value={props.selectedRecord["nremainderdays"]}
                        value={props.selectedRecord["nexpirypolicyrequired"] === 4 ? "" : props.selectedRecord["nremainderdays"]}
                        max={99}
                        min={0}
                        strict={true}
                        maxLength={2}
                        onChange={(event) => props.onNumericInputOnChange(event, 'nremainderdays')}
                        noStyle={true}
                        precision={0}
                        className="form-control"

                        isMandatory={props.selectedRecord["nexpirypolicyrequired"] === 3 ? true : false}
                        errors="Please provide a valid number."
                        isDisabled={props.selectedRecord["nexpirypolicyrequired"] === 3 ? false : true}
                    />
                </Col>
                <Col md={12}>

                    <FormTextarea
                        label={props.formatMessage({ id: "IDS_COMMENTS" })}
                        name={"scomments"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_COMMENTS" })}
                        value={props.selectedRecord["scomments"] || ""}
                        rows="2"
                        isMandatory={false}
                        required={false}
                        maxLength={255}
                    />

                </Col>
            </Col>

        </Row>



    )
}
export default AddPasswordPolicy;
