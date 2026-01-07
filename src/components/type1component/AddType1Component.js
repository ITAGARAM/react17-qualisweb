import React from 'react'
import {injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../form-input/form-input.component';
import FormTextarea from '../form-textarea/form-textarea.component';

const AddType1Component = (props) => {

        return(
            <Row>                                
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id:props.extractedColumnList[0].idsName})}
                        name={props.extractedColumnList[0].dataField}
                        type="text"
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:props.extractedColumnList[0].idsName})}
                        value ={props.selectedRecord ? props.selectedRecord[props.extractedColumnList[0].dataField]  || "": ""}
                        isMandatory = {props.extractedColumnList[0].mandatory}
                        required={props.extractedColumnList[0].mandatory}
                        maxLength={props.extractedColumnList[0].fieldLength}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={props.intl.formatMessage({ id:props.extractedColumnList[1].idsName})}
                        name={props.extractedColumnList[1].dataField}
                        onChange={(event)=>props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id:props.extractedColumnList[1].idsName})}
                        value ={props.selectedRecord ? props.selectedRecord[props.extractedColumnList[1].dataField]  || "": ""}
                        rows="2"
                        isMandatory= {props.extractedColumnList[1].mandatory} 
                        required={props.extractedColumnList[1].mandatory}
                        maxLength={props.extractedColumnList[1].fieldLength}
                        >
                    </FormTextarea>
                </Col>
            </Row>
                                    
     )   
}

export default injectIntl(AddType1Component);