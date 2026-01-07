import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';


const AuditArchival = (props) => {
        
        return(
                <Row>
                    <Col md={6}>
                            <FormInput
                            label={props.intl.formatMessage({ id:"IDS_FROMDATE"})}
                            name={"sfromdate"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_FROMDATE"})}
                            value ={props.sfromdate}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                    
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_MODULENAME"})}
                            name={"smodulename"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_MODULENAME"})}
                            value ={props.selectedRecord["nmodulecode"] && props.selectedRecord["nmodulecode"] ? props.selectedRecord["nmodulecode"].label: ""}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_USERROLENAME"})}
                            name={"smodulename"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_USERROLENAME"})}
                            value ={props.selectedRecord["nuserrolecode"] && props.selectedRecord["nuserrolecode"] ? props.selectedRecord["nuserrolecode"].label:""}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                        </Col>
                        <Col md={6}>
                            <FormInput
                            label={props.intl.formatMessage({ id:"IDS_TODATE"})}
                            name={"stodate"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_TODATE"})}
                            value ={props.stodate}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                    
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_FORMNAME"})}
                            name={"sformname"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_FORMNAME"})}
                            value ={props.selectedRecord["nformcode"] && props.selectedRecord["nformcode"] ? props.selectedRecord["nformcode"].label:""}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_USERNAME"})}
                            name={"susername"}
                            type="text"
                            //onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_USERNAME"})}
                            value ={props.selectedRecord["nusercode"] && props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"].label : ""}
                            //isMandatory={true}
                            required={true}
                            maxLength={100}
                            isDisabled={true}
                        />
                        </Col>
                    <Col md={12}>
                    <FormInput
                            label={props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                            name={"scomments"}
                            type="text"
                            onChange={(event)=>props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                            value ={props.selectedRecord["scomments"] && props.selectedRecord["scomments"] ? props.selectedRecord["scomments"].label : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                            
                        />
                        </Col>
                        
                        
                
                     
                     
                     
                      
                        
                       
                    

                    
                    
                        
                </Row>
            )   
}

export default injectIntl(AuditArchival);