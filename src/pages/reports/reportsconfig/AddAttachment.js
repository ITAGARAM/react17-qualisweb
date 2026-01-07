import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {injectIntl } from 'react-intl';
import DropZone from '../../../components/dropzone/dropzone.component';
import FormInput from '../../../components/form-input/form-input.component';

const AddAttachment = (props) => {
        return(
                 <Row> 
                        <Col md={12}> 
                                <FormInput
                                        label={props.intl.formatMessage({ id:"IDS_REPORTNAME"})}
                                        name={"sreportname"}
                                        type="text"
                                        placeholder={props.intl.formatMessage({ id:"sreportname"})}
                                        value ={props.selectedRecord ? props.selectedRecord["sreportname"] : ""}
                                        // isMandatory = {true}
                                        // required={true}
                                        readOnly
                                        onChange={(event)=> props.onInputOnChange(event)}
                                />
                                <DropZone 
                                        label={ props.intl.formatMessage({ id:"IDS_FILE"})} 
                                        maxFiles={1}
                                        accept={props.attachmentType}
                                        minSize={0}
                                        maxSize={10}
                                        onDrop={(event)=>props.onDropImage(event, "sfilename")}
                                        multiple={false}
                                        isMandatory={true}
                                        editFiles={props.selectedRecord ? props.selectedRecord :{}}
                                       // attachmentTypeCode={props.operation==="update"? attachmentType.OTHERS:""}            
                                        fileName="sfilename"
                                        deleteAttachment={()=>props.deleteFile("sfilename")}
                                        actionType={props.actionType}
                                        />
                              
                                       
                   </Col>
                </Row>
            )   
}

export default injectIntl(AddAttachment);