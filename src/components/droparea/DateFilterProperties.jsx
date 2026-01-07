import React from 'react';
import { faChevronDown, faChevronUp, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionCollapse, Col, Form, InputGroup, Nav, Row, useAccordionToggle ,} from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { condition } from '../Enumeration';
import FormInput from '../form-input/form-input.component';
import { ContentPanel, MediaHeader, MediaLabel } from '../App.styles';
import FormSelectSearch from '../form-select-search/form-select-search.component';
import DateTimePicker from '../date-time-picker/date-time-picker.component';
import FormNumericInput from '../form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { AtAccordion } from '../custom-accordion/custom-accordion.styles';
import AccordionContext from "react-bootstrap/AccordionContext";

const CustomToggle = ({ children, eventKey }) => {
    const currentEventKey = React.useContext(AccordionContext);
    const isCurrentEventKey = currentEventKey === eventKey;
    const decoratedOnClick = useAccordionToggle(eventKey, "");

    return (
        <div
          className="d-flex justify-content-between accordion-button"
          onClick={decoratedOnClick}>
          {children}
          {isCurrentEventKey ?
            <span className="pr-2"><FontAwesomeIcon icon={faChevronUp} /></span>
            : <span className="pr-2"><FontAwesomeIcon icon={faChevronDown} //onClick={children.props.onExpandCall}
            /></span>}
        </div>
      );
    }

    const DateFilterProperties = (props) => {
        return (
            <>
                <AtAccordion>
                    <Accordion >
                        <CustomToggle eventKey={"DateValidation"}>
                        {props.intl.formatMessage({ id: "IDS_DATEVALIDATION" })}
                            {/* <MediaHeader className="pl-2">{props.intl.formatMessage({ id: "IDS_DATEVALIDATION" })}</MediaHeader> */}
                        </CustomToggle>
                        <AccordionCollapse eventKey={"DateValidation"}>
                            <>
                            <Row style={{'margin-top':'25px'}}>
                                <Col md={12}>
                                    <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                                        isSearchable={true}
                                        name={"period"}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={false}
                                        isClearable={true}
                                        options={props.period}
                                        value={props.selectedFieldRecord && props.selectedFieldRecord["period"] ?
                                            props.selectedFieldRecord["period"] : ""}
                                        onChange={value => props.onComboChange(value, "period")}
                                        closeMenuOnSelect={true}
                                        alphabeticalSort={true}
                                    />
                                </Col>
                                <Col md={12}>
                                    {props.selectedFieldRecord && props.selectedFieldRecord["period"] &&
                                    <FormInput
                                        label={props.intl.formatMessage({ id: "IDS_DATEVALUE" })}
                                        name={"windowperiod"}
                                        type="numeric"
                                        onChange={(event) => props.onNumericInputChange(event)}
                                        placeholder={props.intl.formatMessage({ id: "IDS_DATEVALUE" })}
                                        value={props.selectedFieldRecord && props.selectedFieldRecord["windowperiod"] ?
                                            props.selectedFieldRecord["windowperiod"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={"7"}
                                    />
        }

                                    {/* <FormNumericInput
                        name={"windowperiod"}
                        label={props.intl.formatMessage({ id: "IDS_DATEVALUE" }) }
                        className="form-control"
                        type="text"
                        strict={true}
                        value={props.selectedFieldRecord && props.selectedFieldRecord["windowperiod"] ?
                        props.selectedFieldRecord["windowperiod"] : ""}
                        isMandatory={false}
                        required={false}
                        //maxLength={control.sfieldlength}

                        // isDisabled={control.readonly ?
                        //     control.readonly : checkReadOnly}

                        onChange={(event) => props.onNumericInputChange(event, "windowperiod")}
                        // precision={control.precision || 0}
                        // max={control.max}
                        // min={control.min}
                        noStyle={true}
                    // id={control.nchecklistversionqbcode}
                    /> */}
                                </Col>
                            </Row>
                            {props.selectedFieldRecord["period"] ?
                                props.selectedFieldRecord["period"].value === 6 ?
                                    <>
                                        <FormInput
                                            label={props.intl.formatMessage({ id: "IDS_MONTH" })}
                                            name={"nmonth"}
                                            type="numeric"
                                            onChange={(event) => props.onNumericInputChange(event)}
                                            placeholder={props.intl.formatMessage({ id: "IDS_MONTH" })}
                                            value={props.selectedFieldRecord && props.selectedFieldRecord["nmonth"] ?
                                                props.selectedFieldRecord["nmonth"] : ""}
                                            isMandatory={false}
                                            required={true}
                                            maxLength={"7"}
                                        />
                                        <FormInput
                                            label={props.intl.formatMessage({ id: "IDS_DAYS" })}
                                            name={"nday"}
                                            type="numeric"
                                            onChange={(event) => props.onNumericInputChange(event)}
                                            placeholder={props.intl.formatMessage({ id: "IDS_DAYS" })}
                                            value={props.selectedFieldRecord && props.selectedFieldRecord["nday"] ?
                                                props.selectedFieldRecord["nday"] : ""}
                                            isMandatory={false}
                                            required={true}
                                            maxLength={"7"}
                                        />
                                    </>
                                    : "" : ""

                            }
                            {props.selectedFieldRecord["period"] ?
                                props.selectedFieldRecord["period"].value === 5 ?
                                    <FormInput
                                        label={props.intl.formatMessage({ id: "IDS_DAYS" })}
                                        name={"nday"}
                                        type="numeric"
                                        onChange={(event) => props.onNumericInputChange(event)}
                                        placeholder={props.intl.formatMessage({ id: "IDS_DAYS" })}
                                        value={props.selectedFieldRecord && props.selectedFieldRecord["nday"] ?
                                            props.selectedFieldRecord["nday"] : ""}
                                        isMandatory={false}
                                        required={true}
                                        maxLength={"7"}
                                    />
                                    : "" : ""

                            }
                            <Row>
                                <Col md={6}>
                                    <CustomSwitch
                                        label={props.intl.formatMessage({ id: "IDS_HIDEBEFOREDATE" })}
                                        type="switch"
                                        name={"hidebeforedate"}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        // defaultValue={props.selectedFieldRecord["readonly"]}
                                        isMandatory={false}
                                        required={true}
                                        checked={props.selectedFieldRecord["hidebeforedate"]}
                                    />
                                </Col>
                                <Col md={6}>
                                    <CustomSwitch
                                        label={props.intl.formatMessage({ id: "IDS_HIDEAFTERDATE" })}
                                        type="switch"
                                        name={"hideafterdate"}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        // defaultValue={props.selectedFieldRecord["readonly"]}
                                        isMandatory={false}
                                        required={true}
                                        checked={props.selectedFieldRecord["hideafterdate"]}
                                    />
                                </Col>
                            </Row>

                            {/* <Col md={12}> */}
                            <InputGroup>
                                <Form.Group>
                                    {/* <Form.Label as="legend" htmlFor={control.squestion}>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label> */}
                                    <Form.Check
                                        inline={true}
                                        type="checkbox"
                                        name={'loadselecteddate'}
                                        label={props.intl.formatMessage({ id: "IDS_LOADSELECTEDDATE" })}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        id={"loadselecteddate"}
                                        checked={props.selectedFieldRecord["loadselecteddate"]}
                                    // isMandatory={control.mandatory}
                                    // required={control.mandatory}
                                    />
                                </Form.Group>
                            </InputGroup >
                            </>
                        </AccordionCollapse>
                    </Accordion>
                    </AtAccordion>
                    <hr />
                {/* </Col> */}
                {/* <DateTimePicker
                name={"mindate"}
                label={props.intl.formatMessage({ id: "IDS_MINDATE" })}
                className='form-control'
                placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                selected={props.selectedFieldRecord && props.selectedFieldRecord["mindate"] ?
                    props.selectedFieldRecord["mindate"] : null}
                dateFormat={props.userinfo["ssitedatetime"]}
                timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                showTimeInput={true}
                showTimeSelectOnly={false}
                // isClearable={false}
                isDisabled={false}
                isMandatory={false}
                //maxDate={props.CurrentTime}
                //maxTime={props.CurrentTime}
                onChange={(date) => props.handleDateChange(date, "mindate")}
                // value={props.selectedFieldRecord && props.selectedFieldRecord["mindate"] ?
                //     props.selectedFieldRecord["mindate"] : null}
            />
            <DateTimePicker
                name={"maxdate"}
                label={props.intl.formatMessage({ id: "IDS_MAXDATE" })}
                className='form-control'
                placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                selected={props.selectedFieldRecord && props.selectedFieldRecord["maxdate"] ?
                    props.selectedFieldRecord["maxdate"] : null}
                dateFormat={props.userinfo["ssitedatetime"]}
                timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                showTimeInput={true}
                showTimeSelectOnly={false}
                // isClearable={false}
                isDisabled={false}
                isMandatory={false}
                //maxDate={props.CurrentTime}
                //maxTime={props.CurrentTime}
                onChange={(date) => props.handleDateChange(date, "maxdate")}
                value={props.selectedFieldRecord && props.selectedFieldRecord["maxdate"] ?
                    props.selectedFieldRecord["maxdate"] : new Date()}
            /> */}

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_CONDITION" })}
                    isSearchable={true}
                    name={"condition"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={false}
                    options={props.dateConditions}
                    value={props.selectedFieldRecord && props.selectedFieldRecord["condition"] ? props.selectedFieldRecord["condition"] : ""}
                    onChange={value => props.onComboChange(value, "condition")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FILTERVALUE" })}
                    isSearchable={true}
                    name={"filtervalue"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={false}
                    options={props.dateComponents}
                    value={props.selectedFieldRecord && props.selectedFieldRecord["filtervalue"] ? props.selectedFieldRecord["filtervalue"] : ""}
                    onChange={value => props.onComboChange(value, "filtervalue")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
                <div className='d-flex justify-content-end'>
                    <Nav.Link onClick={props.addDateConstraints} className="add-txt-btn">
                        <FontAwesomeIcon icon={faPlus} />{ }
                        <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                    </Nav.Link>
                </div>
                {props.selectedFieldRecord.dateConstraintArrayUI && props.selectedFieldRecord.dateConstraintArrayUI.map((condition, index) => {
                    return (
                        <ContentPanel className='d-flex justify-content-between'>
                            <MediaLabel style={{ border: ".5rem" }}>
                                {condition}
                            </MediaLabel>
                            <Nav.Link onClick={() => props.deleteCondition(index)}>
                                <FontAwesomeIcon icon={faTrashAlt} className="pt-1"></FontAwesomeIcon>
                            </Nav.Link>
                        </ContentPanel>
                    );
                })}
            </>
        )
    }
    export default injectIntl(DateFilterProperties);