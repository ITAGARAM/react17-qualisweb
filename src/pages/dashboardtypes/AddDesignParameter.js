import React from 'react'
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

import { designComponents } from '../../components/Enumeration';

const AddDesignParameter = (props) => {
    return (

        <Row>

            {

                props.selectedDesignConfig.map((parameter, index) => (
                    parameter.ndesigncomponentcode === designComponents.DATEPICKER ?
                        <>

                            <Col lg={12}>
                                {/* <DateTimePicker
                    name={props.parameters[index].lableName}
                    label={props.formatMessage({ id: props.parameters[index].lableName })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.parameters[index].Datetime}
                    dateFormat={"dd/MM/yyyy"}
                    isClearable={true}
                    onChange={props.onChange(index)}
                    value={props.parameters[index].Datetime}

                /> */}

                            </Col>

                        </>

                        :
                        parameter.ndesigncomponentcode === (designComponents.TEXTBOX || designComponents.NUMBER) ?
                            <>

                                <Col lg={12}>
                                    <FormInput
                                        label={props.intl.formatMessage({ id: parameter.sdisplayname })}
                                        name={parameter.sfieldname}
                                        type="text"
                                        onChange={(event) => props.onInputOnChange(event)}
                                        placeholder={props.intl.formatMessage({ id: parameter.sfieldname })}
                                        value={props.selectedRecord ? props.selectedRecord[parameter.sfieldname] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}

                                    />
                                </Col>


                            </>
                            :
                            parameter.ndesigncomponentcode === designComponents.TEXTAREA ?
                                <>

                                    <Col md={12}>
                                        <FormTextarea
                                            label={props.intl.formatMessage({ id: parameter.sdisplayname })}
                                            name={parameter.sfieldname}
                                            onChange={(event) => props.onInputOnChange(event)}
                                            placeholder={props.intl.formatMessage({ id: parameter.sfieldname })}
                                            value={props.selectedRecord ? props.selectedRecord[parameter.sfieldname] : ""}
                                            isMandatory={true}
                                            required={true}
                                            maxLength={"255"}
                                        >
                                        </FormTextarea>
                                    </Col>
                                </>
                                :                               
                                   parameter.ndesigncomponentcode === designComponents.COMBOBOX ?

                                   props.comboParamData.map((combo, index) => (
                                    parameter.sfieldname === combo.fieldName ?
                                   <>
                                    <Col md={12}>
                                        <FormSelectSearch
                                            formLabel={parameter.sdisplayname}
                                            isSearchable={true}
                                            name={parameter.sfieldname}
                                            isDisabled={false}
                                            placeholder="Please Select..."
                                            isMandatory={true}
                                            isClearable={false}
                                            options={combo.data}
                                            optionId={combo.svaluemember}
                                            optionValue={combo.sdisplaymember} // props.Value 
                                            //   value={props.operation === "update" ? props.xValue : props.selectedRecord["xColumnName"] || []}
                                            //value={props.selectedRecord["xColumnName"] || []}
                                            onChange={value => props.handleChange(value, parameter.sfieldname)}
                                            closeMenuOnSelect={true}
                                            alphabeticalSort={true}
                                        >
                                        </FormSelectSearch>
                                    </Col>
                                    </>
                                    :
                                    <></>                                   
                                   ))
                                   :
                                   <></>
                               

                ))

            }

        </Row>
    )
}
export default injectIntl(AddDesignParameter);