import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DropZone from '../../components/dropzone/dropzone.component';
import {injectIntl } from 'react-intl';
import { attachmentType } from '../../components/Enumeration';
//import { Row, Col, Form } from 'react-bootstrap';

const AddBarcode = (props) => {
    return(
          <Row>                       
            <Col md={12}>
                  <FormInput
                    label={props.intl.formatMessage({ id: "IDS_BARCODE" })}
                    name= "sbarcodename"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_BARCODE" })}
                    value={ props.selectedRecord["sbarcodename"] ? props.selectedRecord["sbarcodename"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>

            <Col md={12}>
                        <FormSelectSearch
                                    name={props.barcodeData.nquerycode}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_QUERY"})}                              
                                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                            
                                    options={ props.queryMapList || []}
                                    value = { props.selectedRecord ? props.selectedRecord["nsqlquerycode"]:""}
                                    isMandatory={true}
                                    required={true}
                                    isMulti={false}
                                    isSearchable={true}                                
                                    isDisabled={false}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, "nsqlquerycode")}                               
                            />
                    </Col>

                    <Col md={12}>
                            <FormSelectSearch
                                    name={props.barcodeData.ncontrolcode}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_CONTROTYPE"})}                              
                                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                    options={ props.controlMapList || []}
                                    value = { props.selectedRecord ? props.selectedRecord["ncontrolcode"]:""}
                                    isMandatory={true}
                                    required={true}
                                    isMulti={false}
                                    isSearchable={true}                                
                                    isDisabled={false}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, "ncontrolcode")}                               
                            />
                    </Col>

                      <Col md={12}>
                            <FormSelectSearch
                                    name={props.barcodeData.nlabelformattypecode}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_LABELFORMATTYPE"})}                              
                                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                    options={ props.labelFormatTypeList || []}
                                    value = { props.selectedRecord ? props.selectedRecord["nlabelformattypecode"]:""}
                                    isMandatory={true}
                                    required={true}
                                    isMulti={false}
                                    isSearchable={true}                                
                                    isDisabled={false}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, "nlabelformattypecode")}                               
                            />
                    </Col>


            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id:"IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                />
            </Col>

            {/* <Col md="12">
                <Form.Group>
                    <Form.Check 
                        name="nattachmenttypecode" 
                        type="radio"
                        id="AddFiles"
                        label={props.intl.formatMessage({ id: "IDS_FTP" })}
                        inline={true}
                        onChange={(event)=>props.onInputOnChange(event, 1)}
                        //checked={nattachmenttypecode===attachmentType.FTP?true:false}
                        //disabled={disabled}
                    >
                    </Form.Check>
                    </Form.Group>
                </Col> */}


            <Col md={12}>
                <DropZone
                    name='TestBarcode' 
                    label={props.intl.formatMessage({ id: "IDS_BARCODE" })}
                    maxFiles={1}
                    accept=".prn"
                    minSize={0}
                    maxSize={1}
                    onDrop={(event)=>props.onDropTestFile(event,'sfilename',1)}
                    multiple={false}
                    editFiles={props.selectedRecord?props.selectedRecord:{}}
                    attachmentTypeCode={props.operation === "update" ? attachmentType.PRN : ""}            
                    fileSizeName="nfilesize"
                    fileName="sfilename"
                    deleteAttachment={props.deleteAttachment}
                    actionType={props.actionType}
                     isMandatory={true}
                    //disabled={disabled}
                />
            </Col>
         </Row>
    );
};
export default injectIntl(AddBarcode);