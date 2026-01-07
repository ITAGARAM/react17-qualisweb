import React from 'react'
import { Col, Form, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../form-input/form-input.component';
import CustomSwitch from '../custom-switch/custom-switch.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';


const InputFilterProperties = (props) => {
    return (
        <>
            <Col>

                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_NUMERIC" })}
                    type="switch"
                    name={"isnumeric"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_NUMERIC" })}
                    defaultValue={props.selectedFieldRecord["isnumeric"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isnumeric"]}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ALPHANUMERIC" })}
                    type="switch"
                    name={"isalphanumeric"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ALPHANUMERIC" })}
                    defaultValue={props.selectedFieldRecord["isalphanumeric"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isalphanumeric"]}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ALPHABETCAPITAL" })}
                    type="switch"
                    name={"isalphabetcaptial"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ALPHABETCAPITAL" })}
                    defaultValue={props.selectedFieldRecord["isalphabetcaptial"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isalphabetcaptial"]}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ALPHABETSMALL" })}
                    type="switch"
                    name={"isalphabetsmall"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ALPHABETSMALL" })}
                    defaultValue={props.selectedFieldRecord["isalphabetsmall"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isalphabetsmall"]}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_ALPHABETSPECIAL" })}
                    type="switch"
                    name={"isalphabetspl"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ALPHABETSPECIAL" })}
                    defaultValue={props.selectedFieldRecord["isalphabetspl"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isalphabetspl"]}
                />
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_NUMERICSPECIAL" })}
                    type="switch"
                    name={"isnumericspl"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_NUMERICSPECIAL" })} x
                    defaultValue={props.selectedFieldRecord["isnumericspl"]}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedFieldRecord["isnumericspl"]}
                />
                {/* </Col>
                </Row> */}
            </Col>

            <Col md={12} style={{
                "padding": "0px",
                "margin-bottom": "10px"
            }}>
                <Row>
                    <Col md={12} style={{
                        "margin": "16px",
                        "padding": "0px",
                        "margin-top": "1px",
                        "margin-left": "0.5px"
                    }}>
                        <Form.Check
                            //inline={true}
                            type="checkbox"
                            name={"ncustomization"}
                            label={props.intl.formatMessage({ id: "IDS_CUSTOMIZATION" })}
                            // label={checkbox.text}
                            onChange={(event) => props.onInputOnChange(event)}
                            //id={checkbox.id}
                            checked={props.selectedFieldRecord["ncustomization"] === true ? true : false}
                            //  defaultChecked={props.selectedFieldRecord["ncustomization"] === true ? true : false}
                            // isMandatory={control.mandatory}
                            //required={control.mandatory}
                            disabled={(props.selectedFieldRecord["isalphabetcaptial"] ||
                                props.selectedFieldRecord["isalphabetsmall"] || props.selectedFieldRecord["isnumeric"] ) === true ? true : false}
                            size={'xl'}
                        />
                    </Col>
                </Row>
            </Col>
            {/* {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["isnumeric"] ?
                <Row>
                    <Col>

                    <FormInput
                                label={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                                name={"precision"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                                value={props.selectedFieldRecord["precision"] ? props.selectedFieldRecord["precision"] : ""}
                                isMandatory={false}
                                required={true}
                                maxLength={"1"}
                            />
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MINVALUE" })}
                            name={"nminvalue"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MINVALUE" })}
                            value={props.selectedFieldRecord["nminvalue"] ? props.selectedFieldRecord["nminvalue"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"7"}
                        />
                         <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXVALUE" })}
                            name={"nmaxvalue"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXVALUE" })}
                            value={props.selectedFieldRecord["nmaxvalue"] ? props.selectedFieldRecord["nmaxvalue"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"7"}
                        />

                    </Col>
                </Row>
                : ""} */}

            {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["isalphanumeric"] ?
                <Row>
                    <Col>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            name={"nmaxletters"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            value={props.selectedFieldRecord["nmaxletters"] ? props.selectedFieldRecord["nmaxletters"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />

                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            name={"nmaxnumeric"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            value={props.selectedFieldRecord["nmaxnumeric"] ? props.selectedFieldRecord["nmaxnumeric"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                    </Col>
                </Row>
                : ""}



            {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["isalphabetspl"] ?
                <Row>
                    <Col>

                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            name={"nmaxletters"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            value={props.selectedFieldRecord["nmaxletters"] ? props.selectedFieldRecord["nmaxletters"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            name={"nsplchar"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            value={props.selectedFieldRecord["nsplchar"] ? props.selectedFieldRecord["nsplchar"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                    </Col>
                </Row> : ""}

            {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["isnumericspl"] ?
                <Row>
                    <Col>

                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            name={"nmaxnumeric"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            value={props.selectedFieldRecord["nmaxnumeric"] ? props.selectedFieldRecord["nmaxnumeric"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            name={"nsplchar"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            value={props.selectedFieldRecord["nsplchar"] ? props.selectedFieldRecord["nsplchar"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                    </Col>
                </Row> : ""}


            {props.selectedFieldRecord["ncustomization"] && (props.selectedFieldRecord["isalphabetspl"] || props.selectedFieldRecord["isalphanumeric"]) ?
                <Col md={12} style={{
                    "padding": "0px",
                    "margin-bottom": "10px"
                }}>
                    <Row>
                        <Col md={12} style={{
                            "margin": "16px",
                            "padding": "0px",
                            "margin-top": "1px",
                            "margin-left": "0.5px"
                        }}>
                            <Form.Check
                                //inline={true}
                                type="checkbox"
                                name={"ncasesensitive"}
                                label={props.intl.formatMessage({ id: "IDS_CASESENSITIVE" })}
                                // label={checkbox.text}
                                onChange={(event) => props.onInputOnChange(event)}
                                //id={checkbox.id}
                                checked={props.selectedFieldRecord["ncasesensitive"] ? true : false}
                                defaultChecked={props.selectedFieldRecord["ncasesensitive"] ? true : false}
                                // isMandatory={control.mandatory}
                                //required={control.mandatory}
                                size={'xl'}
                            />
                            <Form.Check
                                //inline={true}
                                type="checkbox"
                                name={"ncaptialletters"}
                                label={props.intl.formatMessage({ id: "IDS_CAPTICALLETTERS" })}
                                // label={checkbox.text}
                                onChange={(event) => props.onInputOnChange(event)}
                                //id={checkbox.id}
                                checked={props.selectedFieldRecord["ncaptialletters"] ? true : false}
                                defaultChecked={props.selectedFieldRecord["ncaptialletters"] ? true : false}
                                // isMandatory={control.mandatory}
                                //required={control.mandatory}
                                size={'xl'}
                            />
                            <Form.Check
                                //inline={true}
                                type="checkbox"
                                name={"nsmallletters"}
                                label={props.intl.formatMessage({ id: "IDS_SMALLLETTER" })}
                                // label={checkbox.text}
                                onChange={(event) => props.onInputOnChange(event)}
                                //id={checkbox.id}
                                checked={props.selectedFieldRecord["nsmallletters"] ? true : false}
                                defaultChecked={props.selectedFieldRecord["nsmallletters"] ? true : false}
                                // isMandatory={control.mandatory}
                                //required={control.mandatory}
                                size={'xl'}
                            />
                            {props.selectedFieldRecord['isalphabetspl'] || props.selectedFieldRecord['isnumericspl'] ?
                                <Row>
                                    <Col md={12} style={{
                                        "margin": "16px",
                                        "padding": "0px",
                                        "margin-top": "1px",
                                        "margin-left": "0.5px"
                                    }}>
                                        <Form.Check
                                            //inline={true}
                                            type="checkbox"
                                            name={"naviodsplchar"}
                                            label={props.intl.formatMessage({ id: "IDS_RESTRICTSPLCHAR" })}
                                            // label={checkbox.text}
                                            onChange={(event) => props.onInputOnChange(event)}
                                            //id={checkbox.id}
                                            checked={props.selectedFieldRecord["naviodsplchar"] ? true : false}
                                            defaultChecked={props.selectedFieldRecord["naviodsplchar"] ? true : false}
                                            // isMandatory={control.mandatory}
                                            //required={control.mandatory}
                                            size={'xl'}
                                        />
                                    </Col>
                                </Row> : ""}
                        </Col>
                    </Row>
                </Col>
                : ""}
            {props.selectedFieldRecord["ncustomization"] === true
                && (props.selectedFieldRecord["isalphabetspl"] === false || props.selectedFieldRecord['isalphabetspl'] === undefined)
                && (props.selectedFieldRecord["isnumericspl"] === false || props.selectedFieldRecord['isnumericspl'] === undefined)
                && (props.selectedFieldRecord["isalphabetsmall"] === false || props.selectedFieldRecord['isalphabetsmall'] === undefined)
                && (props.selectedFieldRecord["isalphanumeric"] === false || props.selectedFieldRecord['isalphanumeric'] === undefined)
                && (props.selectedFieldRecord["isalphabetcaptial"] === false || props.selectedFieldRecord['isalphabetcaptial'] === undefined)
                && (props.selectedFieldRecord["isnumeric"] === false || props.selectedFieldRecord['isnumeric'] === undefined) ?
                <Row>
                    <Col>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            name={"nmaxletters"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXLETTERS" })}
                            value={props.selectedFieldRecord["nmaxletters"] ? props.selectedFieldRecord["nmaxletters"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            name={"nmaxnumeric"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXNUMERIC" })}
                            value={props.selectedFieldRecord["nmaxnumeric"] ? props.selectedFieldRecord["nmaxnumeric"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            name={"nsplchar"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPLCHARACTER" })}
                            value={props.selectedFieldRecord["nsplchar"] ? props.selectedFieldRecord["nsplchar"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        />
                        <Col md={12} style={{
                            "padding": "0px",
                            "margin-bottom": "10px"
                        }}>
                            <Row>
                                <Col md={12} style={{
                                    "margin": "16px",
                                    "padding": "0px",
                                    "margin-top": "1px",
                                    "margin-left": "0.5px"
                                }}>
                                    <Form.Check
                                        //inline={true}
                                        type="checkbox"
                                        name={"ncasesensitive"}
                                        label={props.intl.formatMessage({ id: "IDS_CASESENSITIVE" })}
                                        // label={checkbox.text}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        //id={checkbox.id}
                                        checked={props.selectedFieldRecord["ncasesensitive"] ? true : false}
                                        defaultChecked={props.selectedFieldRecord["ncasesensitive"] ? true : false}
                                        // isMandatory={control.mandatory}
                                        //required={control.mandatory}
                                        size={'xl'}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row> : ""
            }
            {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["ncasesensitive"] ?
                <Col>
                    <Row>
                        <Col>
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_MAXCAPTICALLETTERS" })}
                                name={"nmaxcapticalletters"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_MAXCAPTICALLETTERS" })}
                                value={props.selectedFieldRecord["nmaxcapticalletters"] ? props.selectedFieldRecord["nmaxcapticalletters"] : ""}
                                isMandatory={true}
                                required={true}
                                maxLength={3}
                            />
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_MAXSMALLLETTERS" })}
                                name={"nmaxsmallletters"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_MAXSMALLLETTERS" })}
                                value={props.selectedFieldRecord["nmaxsmallletters"] ? props.selectedFieldRecord["nmaxsmallletters"] : ""}
                                isMandatory={true}
                                required={true}
                                maxLength={3}
                            />
                        </Col>
                    </Row>
                </Col> : ""}

            {props.selectedFieldRecord['ncustomization'] && props.selectedFieldRecord['isnumericspl'] ?
                <Col>
                    <Row>
                        <Col md={12} style={{
                            "margin": "16px",
                            "padding": "0px",
                            "margin-top": "1px",
                            "margin-left": "0.5px"
                        }}>
                            <Form.Check
                                //inline={true}
                                type="checkbox"
                                name={"naviodsplchar"}
                                label={props.intl.formatMessage({ id: "IDS_RESTRICTSPLCHAR" })}
                                // label={checkbox.text}
                                onChange={(event) => props.onInputOnChange(event)}
                                //id={checkbox.id}
                                checked={props.selectedFieldRecord["naviodsplchar"] ? true : false}
                                defaultChecked={props.selectedFieldRecord["naviodsplchar"] ? true : false}
                                // isMandatory={control.mandatory}
                                //required={control.mandatory}
                                size={'xl'}
                            />
                        </Col>
                    </Row>
                </Col> : ""}
            {props.selectedFieldRecord["ncustomization"] && props.selectedFieldRecord["naviodsplchar"] && (props.selectedFieldRecord["isalphabetspl"] || props.selectedFieldRecord["isnumericspl"]) ?
                <Row>
                    <Col>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SPLCHARACTERSNOTALLOWED" })}
                            name={"nsplcharnotallow"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPLCHARACTERSNOTALLOWED" })}
                            value={props.selectedFieldRecord["nsplcharnotallow"] ? props.selectedFieldRecord["nsplcharnotallow"] : ""}
                            isMandatory={true}
                            required={true}
                        //maxLength={"30"}
                        />
                    </Col>
                </Row> : ""}



        </>
    )
}
export default injectIntl(InputFilterProperties);