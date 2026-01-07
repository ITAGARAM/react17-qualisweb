import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Col, Form, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { condition } from '../Enumeration';
import FormInput from '../form-input/form-input.component';
import { ContentPanel, MediaLabel } from '../App.styles';
// import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';

const ComboFilterProperties = (props) => {
    return (
        <>
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_FILTERCOLUMN" })}
                isSearchable={true}
                name={"filtercolumn"}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.tableColumn}
                value={props.selectedFieldRecord && props.selectedFieldRecord["filtercolumn"] ? props.selectedFieldRecord["filtercolumn"] : ""}
                onChange={value => props.onComboChange(value, "filtercolumn")}
                closeMenuOnSelect={true}
                alphabeticalSort={true}
            />
            {/* <Col md={12} > */}
           
                <FormSelectSearch
                
                    formLabel={props.intl.formatMessage({ id: "IDS_CONDITION" })}
                    isSearchable={true}
                    name={"condition"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.selectedFieldRecord["filtercolumn"] && props.selectedFieldRecord["filtercolumn"].type === 'numeric' ?
                        props.numericConditions : props.stringConditions}
                    value={props.selectedFieldRecord && props.selectedFieldRecord["condition"] ? props.selectedFieldRecord["condition"] : ""}
                    onChange={value => props.onComboChange(value, "condition")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
              
            {/* </Col> */}

            {/* <CustomSwitch
                label={props.intl.formatMessage({ id: "IDS_SYSTEMCONFIGURATION" })}
                type="switch"
                name={"nsystemconfiguration"}
                onChange={(event) => props.onInputOnChange(event)}
                placeholder={props.intl.formatMessage({ id: "IDS_SYSTEMCONFIGURATION" })}
                defaultValue={props.selectedFieldRecord["nsystemconfiguration"]}
                isMandatory={false}
                required={false}
                checked={props.selectedFieldRecord["nsystemconfiguration"]}
            /> */}
            <Col md={12} style={{
                "padding": "0px",
               "margin-bottom":"10px" 
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
                            name={"nsystemconfiguration"}
                            label={props.intl.formatMessage({ id: "IDS_SYSTEMCONFIGURATION" })}
                            // label={checkbox.text}
                            onChange={(event) => props.onInputOnChange(event)}
                            //id={checkbox.id}
                            checked={props.selectedFieldRecord["nsystemconfiguration"] ? true : false}
                            defaultChecked={props.selectedFieldRecord["nsystemconfiguration"] ? true : false}
                            // isMandatory={control.mandatory}
                            //required={control.mandatory}
                            size={'xl'}
                        />
                    </Col>
                </Row>
            </Col>
            {props.selectedFieldRecord["nsystemconfiguration"] &&
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SYSTEMINFO" })}
                    isSearchable={true}
                    name={"staticfiltertable"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.staticfiltertables || []}
                    value={props.selectedFieldRecord && props.selectedFieldRecord["staticfiltertable"] ?
                        props.selectedFieldRecord["staticfiltertable"] : ""}
                    onChange={value => props.onComboChange(value, "staticfiltertable")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            }
            {props.selectedFieldRecord["nsystemconfiguration"] ?
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FIELDS" })}
                    isSearchable={true}
                    name={"staticfiltercolumn"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.staticfiltercolumn || []}
                    value={props.selectedFieldRecord && props.selectedFieldRecord["staticfiltercolumn"] ?
                        props.selectedFieldRecord["staticfiltercolumn"] : ""}
                    onChange={value => props.onComboChange(value, "staticfiltercolumn")}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                /> :

                props.selectedFieldRecord["filtercolumn"] && props.selectedFieldRecord["filtercolumn"].type !== 'numeric' ?
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_FILTERVALUE" })}
                        name={"staticfiltervalue"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_FILTERVALUE" })}
                        value={props.selectedFieldRecord["staticfiltervalue"] ? props.selectedFieldRecord["staticfiltervalue"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"30"}
                    />
                    :

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_FILTERVALUE" })}
                        isSearchable={true}
                        name={"filtervalue"}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.filterData}
                        value={props.selectedFieldRecord && props.selectedFieldRecord["filtervalue"] ? props.selectedFieldRecord["filtervalue"] : ""}
                        onChange={value => props.onComboChange(value, "filtervalue")}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        isMulti={props.selectedFieldRecord["condition"] && (
                            props.selectedFieldRecord["condition"].value === condition.CONTAINS ||
                            props.selectedFieldRecord["condition"].value === condition.NOTCONTAINS) ? true : false
                        }
                    />
            }
            <div className='d-flex justify-content-end'>
                <Nav.Link onClick={props.addCondition} className="add-txt-btn">
                    <FontAwesomeIcon icon={faPlus} />{ }
                    <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                </Nav.Link>
            </div>
            {props.selectedFieldRecord.conditionArrayUI && props.selectedFieldRecord.conditionArrayUI.map((condition, index) => {
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
export default injectIntl(ComboFilterProperties);