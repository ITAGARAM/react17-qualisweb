import React from 'react'
import { Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../form-textarea/form-textarea.component';
import FormInput from '../form-input/form-input.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';
import DateTimePicker from '../date-time-picker/date-time-picker.component';
import FormNumericInput from '../form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../custom-switch/custom-switch.component';
// import { transactionStatus } from '../Enumeration'
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddType3Component = (props) => {
    
 
    
    return(      
       props.extractedColumnList.map(item=>{
        if(item.child){ 
            let index=props.extractedColumnList.findIndex(x=>x.dataField== item.childdatafield ) 
                if(index!=-1)
                    { 
                        props.extractedColumnList[index][item.childprops]= props.selectedRecord[item.dataField] ;
                    }  
            }


        switch (item.ndesigncomponentcode) {

            case 1: {    
                //TextBox            
                return (
                    <Row>
                        <Col md={12}>
                            <FormInput
                                label={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                name={item.dataField}
                                type={item.formInputType ? item.formInputType : "text"} // ALPD-3660 VISHAKH
                                onChange={(event)=>props.onInputOnChange(event, item)}
                                placeholder={props.intl.formatMessage({ id:item.idsName})}
                                value ={props.selectedRecord[item.dataField]  || ""}
                                isMandatory={item.mandatory}
                                required={item.mandatory}
                                maxLength={item.fieldLength}
                                isDisabled = {item.isDisabled !== "" ? item.isDisabled : false}
                            />
                            {item.noteNeed &&
                                <div style={{ fontSize: '12px', color: 'red',position: 'relative', top: '-25px'}}>
                                    {props.intl.formatMessage({id: "IDS_NOTE" })+":"+props.intl.formatMessage({ id: item.noteText })}
                                </div>
                            }
                        </Col>
                    </Row>
                    )
            }
            case 2: {     
                //Textarea           
                return (
                    <Row>
                        <Col md={12}>
                            <FormTextarea
                                label={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                name={item.dataField}
                                onChange={(event)=>props.onInputOnChange(event,item)}
                                placeholder={props.intl.formatMessage({ id:item.idsName})}
                                value ={props.selectedRecord[item.dataField] || ""}
                                rows="2"
                                isMandatory={item.mandatory}
                                required={item.mandatory}
                                maxLength={item.fieldLength}
                                isDisabled = {item.isDisabled !== "" ? item.isDisabled : false}
                            />
                          
                        </Col>
                    </Row>
                    )
            }
            case 3: {
                // props.extractedColumnList.map(item => {
                    return (
                        <Row>
                            <Col md={12}>
                                <FormSelectSearch
                                    name={item.dataField}
                                    formLabel={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                           
                                    options={props.dataList[item.dataField] || []}
                                    //value = { props.selectedRecord[item.dataField] ? props.selectedRecord[item.dataField] : "" }
                                    value = { item.defaultValueRequired? props.dataList[`Default${item.dataField}`] : props.selectedRecord[item.dataField] ? props.selectedRecord[item.dataField] : ""}
                                    isMandatory={item.mandatory}
                                    isMulti={false}
                                    isClearable={item.mandatory ? false : true}
                                    isSearchable={true}                                
                                    // isDisabled={false}
                                    defaultValue={item.defaultValueRequired? props.dataList[`Default${item.dataField}`] : props.selectedRecord[item.dataField] ? props.selectedRecord[item.dataField] : []}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, item.dataField, item)}  
                                    isDisabled = {item.isDisabled !== "" ? item.isDisabled : false}                             
                                />  
                               
                            </Col>
                        </Row>
                    );
                // })
                //Combobox--yet to include functionality & logic to handle this case in Type3Component.jsx
               
            }
            case 4: {
                //Date Picker
                return (
                    <Row>
                        <Col md={12}>
                            <DateTimePicker
                                    name={item.dataField} 
                                    label={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord[item.dataField] || ""}
                                    dateFormat={item.showtime===true?props.userInfo.ssitedatetime:props.userInfo.ssitedate}
                                    showTimeInput={item.showtime?true:false}
                                    isClearable={false}
                                    isMandatory={item.mandatory}                       
                                    required={item.mandatory}
                                    onChange={date => props.handleDateChange(item.dataField, date, item)}
                                    value={props.selectedRecord[item.dataField]}
                                    isDisabled = {item.isDisabled !== "" ? item.isDisabled : false} 
                              />
                           
                        </Col>
                    </Row>
                );
            }
            case 5: {   
                //Numeric Input             
                return (
                    <Row>
                        <Col md={12}>
                            <FormNumericInput
                                   name={item.dataField}
                                   label={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                   placeholder={props.intl.formatMessage({ id:item.idsName})}
                             //    value ={ props.selectedRecord[item.dataField] || ""}
                                   value ={ props.selectedRecord[item.dataField]}
                                   type="number"                               
                                   strict={true}
                                   maxLength={item.fieldLength ? item.fieldLength : 10}
                                   noStyle={true}
                                   onChange={(event) => props.onNumericInputOnChange(event, item.dataField, item)}
                                   precision={ item.precision ? item.precision : 0}
                                   min={0}
                                   className="form-control"
                                   isMandatory={item.mandatory}                       
                                   required={item.mandatory}
                                   errors="Please provide a valid number."
                                   isDisabled = {item.isDisabled !== "" ? item.isDisabled : false}
                              />
                        </Col>
                    </Row>
                    )
            }
            case 6: {     
                //Check box/switch           
                return (
                    <Row>
                        <Col>
                            <CustomSwitch
                                   name={item.controlName}
                                   type="switch"
                                   label={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                   placeholder={props.intl.formatMessage({ id:item.idsName})}                            
                                   isMandatory={item.mandatory}                       
                                   required={item.mandatory}                                   
                                   onChange={(event)=> props.onInputOnChange(event, item)}
                                   defaultValue ={props.selectedRecord[item.controlName] === 3 ? true :false }
                                   checked={props.selectedRecord[item.controlName] === 3 ? true :false}
                                   />
                        </Col>
                    </Row>
                    )
            }
            case 7: {     
                //BackEndSearch        
                return (
                    <Row>
                        <Col>
                            <button className="btn btn-primary btn-padd-custom"
                                disabled={false}                              
                                onClick={(e) => props.custombuttonclick(e, item)}
                            >
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> { }
                                {props.intl.formatMessage({ id: item.idsName })}
                            </button>
                        </Col>
                    </Row>)
            }
            case 8:{
                //multi select
                return (
                    <Row>
                        <Col md={12}>
                            <FormSelectSearch
                                name={item.dataField}
                                formLabel={props.Login&&props.Login.genericLabelIDS && props.Login.genericLabelIDS[item.idsName] !== undefined ?  props.Login.genericLabelIDS[item.idsName]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.intl.formatMessage({ id: item.idsName })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                           
                                options={props.dataList[item.dataField] || []}
                                value = { props.selectedRecord[item.dataField] ? props.selectedRecord[item.dataField] : "" }
                                isMandatory={item.mandatory}
                                isMulti={props.operation === "create" ? true : false}
                                isClearable={item.mandatory ? false : true}
                                isSearchable={true}
                                // isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.onComboChange(event, item.dataField, item)}  
                                isDisabled = {item.isDisabled !== "" ? item.isDisabled : false}                             
                            />  
                           
                        </Col>
                    </Row>
                );

            }

            default :
                return "";
        }
        
        } )

    )
}

export default injectIntl(AddType3Component);