import React from 'react'
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../form-input/form-input.component';
import FormTextarea from '../form-textarea/form-textarea.component';
import CustomSwitch from '../custom-switch/custom-switch.component';

const AddType2Component = (props) => { 
    return(<Row>
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id:props.extractedColumnList[0].idsName})}
                        name={props.extractedColumnList[0].dataField}
                        type="text"
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:props.extractedColumnList[0].idsName})}
                        value ={props.selectedRecord[props.extractedColumnList[0].dataField] || ""}
                        isMandatory={props.extractedColumnList[0].mandatory}
                        required={props.extractedColumnList[0].mandatory}
                        maxLength={props.extractedColumnList[0].fieldLength}
                        //isInvalid={props.failedControls.indexOf(props.extractedColumnList[0].dataField) !==-1}
                        
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={props.intl.formatMessage({ id:props.extractedColumnList[1].idsName})}
                        name={props.extractedColumnList[1].dataField}
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:props.extractedColumnList[1].idsName})}
                        value ={props.selectedRecord[props.extractedColumnList[1].dataField] || ""}
                        rows="2"
                        isMandatory={props.extractedColumnList[1].mandatory}
                        required={props.extractedColumnList[1].mandatory}
                        maxLength={props.extractedColumnList[1].fieldLength}
                        //isInvalid={props.failedControls.indexOf(props.extractedColumnList[1].dataField) !==-1}
                    />
                </Col>
                <Col md={12}>
                    <CustomSwitch
                        label={props.intl.formatMessage({ id:props.extractedColumnList[2].idsName})}
                        type="switch"
                        name={props.extractedColumnList[2].controlName}
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:props.extractedColumnList[2].idsName})}
                        defaultValue ={props.selectedRecord[props.extractedColumnList[2].controlName] === 3 ? true :false }
                        isMandatory={props.extractedColumnList[2].mandatory}
                        required={props.extractedColumnList[2].mandatory}
                        checked={props.selectedRecord[props.extractedColumnList[2].controlName] === 3 ? true :false}
                        //disabled={props.selectedRecord[props.extractedColumnList[2].controlName] === 3 ? true :false}
                    />                                               
                </Col>
            </Row>)
}
export default injectIntl(AddType2Component);