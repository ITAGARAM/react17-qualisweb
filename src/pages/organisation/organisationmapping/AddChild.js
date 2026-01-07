import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../../components/form-input/form-input.component';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';


const AddChild = (props) => {
        return (
                <Row>
                        <Col md={12}>
                                <FormInput
                                        label={props.intl.formatMessage({ id: props.extractedColumnList[0].idsName })}
                                        name={props.extractedColumnList[0].dataField}
                                        type="text"
                                        placeholder={props.intl.formatMessage({ id: props.extractedColumnList[0].idsName })}
                                        value={props.selectedRecord ? props.selectedRecord[props.extractedColumnList[0].dataField] : ""}
                                        isMandatory={props.extractedColumnList[0].mandatory}
                                        required={props.extractedColumnList[0].mandatory}
                                        readOnly={true}
                                />

                                {/* <FormSelectSearch
                                    name={props.extractedColumnList[1].dataField}
                                    formLabel={ props.intl.formatMessage({ id:props.extractedColumnList[1].idsName})}                              
                                    placeholder="Please Select..."                              
                                    options={ props.comboDataList || []}
                                    optionId={props.extractedColumnList[1].optionId}
                                    optionValue={props.extractedColumnList[1].optionValue}
                                    value = { props.selectedRecord ? props.selectedRecord[props.extractedColumnList[1].dataField]:""}
                                    isMandatory={true}
                                    required={true}
                                    isMulti={true}
                                    isClearable={true}
                                    isSearchable={true}                                
                                    isDisabled={false}
                                    closeMenuOnSelect={false}
                                    alphabeticalSort={true}
                                    onChange = {(event)=> props.onComboChange(event, props.extractedColumnList[1].dataField)}                               
                                    //isInvalid={props.failedControls.indexOf(props.extractedColumnList[1].dataField) !==-1}
                        
                            /> */}
                                <FormMultiSelect
                                        name={props.extractedColumnList[1].dataField}
                                        label={props.intl.formatMessage({ id: props.extractedColumnList[1].idsName })}
                                        options={props.comboDataList || []}
                                        optionId={props.extractedColumnList[1].optionId}
                                        optionValue={props.extractedColumnList[1].optionValue}
                                        value={props.selectedRecord ? props.selectedRecord[props.extractedColumnList[1].dataField]  || []: []}
                                        isMandatory={true}
                                        isClearable={true}
                                        disableSearch={false}
                                        disabled={false}
                                        closeMenuOnSelect={false}
                                        alphabeticalSort={true}
                                        onChange={(event) => props.onComboChange(event, props.extractedColumnList[1].dataField)}
                                //isInvalid={props.failedControls.indexOf(props.extractedColumnList[1].dataField) !==-1}

                                />
                        </Col>

                </Row>
        )
}

export default injectIntl(AddChild);