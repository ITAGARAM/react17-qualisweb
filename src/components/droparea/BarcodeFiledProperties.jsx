import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Row, Col, FormLabel, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { ReactComponents } from '../../components/Enumeration';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';


const BarcodeFieldProperties = (props) => {
    return (
        Object.keys(props.selectedFieldRecord).length > 0 ?
            <Row className='j-s-b--flex'>
                <Col md={9} className="floating-margin">

                    <FormLabel className="mb-3">{props.intl.formatMessage({ id: "IDS_INPUTTYPE" })} : <strong>{props.selectedFieldRecord.componentname}</strong></FormLabel>

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_LABELID" })}
                        name={"label"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_LABELID" })}
                        value={props.selectedFieldRecord["label"] ? props.selectedFieldRecord["label"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"30"}
                    />
                </Col>
                <Col md={3} className="p-0 icon-wrap">
                    <Nav.Link name="addsynonym"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDSYNONYMN" })}
                        className="btn btn-circle mg-t-1 outline-grey mr-2"
                        onClick={(e) => props.addSynonym()}
                    >
                        <FontAwesomeIcon icon={faLanguage} />
                    </Nav.Link>
                </Col>
                <Col md={12} className='mt-2'>
                    {props.selectedFieldRecord.componentcode === ReactComponents.COMBO ?
                        <>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_SOURCE" })}
                                isSearchable={true}
                                name={"source"}
                                isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tables}
                                value={props.selectedFieldRecord && props.selectedFieldRecord["table"] ? props.selectedFieldRecord["table"] : ""}
                                onChange={value => props.onComboChange(value, "table")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_DISPLAYMEMBER" })}
                                isSearchable={true}
                                name={"displaymember"}
                                isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tableColumn}
                                value={props.selectedFieldRecord && props.selectedFieldRecord["column"] ? props.selectedFieldRecord["column"] : ""}
                                onChange={value => props.onComboChange(value, "column")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />

                            {
                                props.selectedFieldRecord.componentcode === ReactComponents.COMBO &&
                                <>
                                    <FormSelectSearch
                                        name={"child"}
                                        as={"select"}
                                        onChange={(event) => props.onComboChange(event, 'childValue')}
                                        formLabel={props.intl.formatMessage({ id: "IDS_PARENTCOMPONENT" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={false}
                                        options={props.inputFields.filter(x => x.inputtype !== 'radio')}
                                        value={props.selectedFieldRecord.childValue ? props.selectedFieldRecord.childValue : []}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={true}
                                        isClearable={true}
                                    />
                                    {props.selectedFieldRecord.childValue && props.valueMembers.length > 1 &&
                                        <FormSelectSearch
                                            formLabel={props.intl.formatMessage({ id: "IDS_VALUEMEMBER" })}
                                            isSearchable={true}
                                            name={"valuemember"}
                                            // isDisabled={props.selectedFieldRecord.templatemandatory}
                                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            isMandatory={true}
                                            isClearable={false}
                                            options={props.valueMembers}
                                            value={props.selectedFieldRecord && props.selectedFieldRecord["valuecolumn"] ? props.selectedFieldRecord["valuecolumn"] : ""}
                                            onChange={value => props.onComboChange(value, "valuecolumn")}
                                            closeMenuOnSelect={true}
                                            alphabeticalSort={true}
                                        />
                                    }
                                </>
                            }

                        </> : ""
                    }


                </Col>


            </Row >
            : ""
    )
}

export default injectIntl(BarcodeFieldProperties);