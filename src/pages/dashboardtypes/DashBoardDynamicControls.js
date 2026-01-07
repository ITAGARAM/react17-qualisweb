import React from 'react'
import { Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration'

const DashBoardDynamicControls = (props) => {
    //console.log("props. dynamic:", props);
    return(      
       props.viewDashBoardDesignConfigList.map(item=>{
        switch (item.ndesigncomponentcode) {

            case 1: {                
                return (
                    <Row>
                        <Col md={12}>
                            <FormInput
                                name={item.sfieldname}
                                type="text"
                                label={ item.sdisplayname}                   
                                placeholder={ item.sdisplayname}
                                value ={ props.selectedRecord[item.sfieldname] || "" }
                                isMandatory={item.nmandatory === transactionStatus.YES ? true :false}
                                required={item.nmandatory === transactionStatus.YES ? true :false}
                                maxLength={100}
                                onChange={(event)=> props.onInputOnChange(event, item)}
                            />                      
                        </Col>
                    </Row>
                    )
            }
            case 2: {                
                return (
                    <Row>
                        <Col md={12}>
                            <FormTextarea
                                   name={item.sfieldname}
                                   label={item.sdisplayname}                    
                                   placeholder={item.sdisplayname}
                                   value ={ props.selectedRecord[item.sfieldname] || ""}
                                   rows="2"
                                   isMandatory={item.nmandatory === transactionStatus.YES ? true :false}
                                   required={item.nmandatory === transactionStatus.YES ? true :false}
                                   maxLength={255}
                                   onChange={(event)=> props.onInputOnChange(event, item)}
                                   />
                        </Col>
                    </Row>
                    )
            }
            case 3: {
                return (
                    <Row>
                        <Col md={12}>
                            <FormSelectSearch
                                        name={item.sfieldname}
                                        formLabel={ item.sdisplayname}                              
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })  }                        
                                        options={item.dataList || []}
                                        value = { props.selectedRecord[item.sfieldname] || ""}
                                        isMandatory={item.nmandatory === transactionStatus.YES ? true :false}
                                        isMulti={false}
                                        isClearable={item.nmandatory === transactionStatus.YES ? false :true}
                                        isSearchable={true}                                
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        // alphabeticalSort={true}
                                        onChange = {(event)=> props.onComboChange(event, item.sfieldname, item)}                               
                                />  
                           
                        </Col>
                    </Row>
                );
            }
            case 4: {
                return (
                    <Row>
                        <Col md={12}>
                            <DateTimePicker
                                    name={item.sfieldname} 
                                    label={ item.sdisplayname}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord[item.sfieldname] || ""}
                                    dateFormat={props.userInfo.ssitedate}
                                    readOnly={props.operation === "update"}
                                    //timeInputLabel=  {props.intl.formatMessage({ id:"IDS_TIME"})}
                                    showTimeInput={false}
                                    isClearable={false}
                                    isMandatory={item.nmandatory === transactionStatus.YES ? true :false}                       
                                    required={item.nmandatory === transactionStatus.YES ? true :false}
                                    onChange={date => props.handleDateChange(item.sfieldname, date, item)}
                                    value={props.selectedRecord[item.sfieldname]}
                              />
                           
                        </Col>
                    </Row>
                );
            }
            case 5: {                
                return (
                    <Row>
                        <Col md={12}>
                            <FormNumericInput
                                   name={item.sfieldname}
                                   label={ item.sdisplayname}                          
                                   placeholder={ item.sdisplayname}
                                   value ={ props.selectedRecord[item.sfieldname] || ""}
                                   type="number"                               
                                   strict={true}
                                   maxLength={10}
                                   noStyle={true}
                                   onChange={(event) => props.onNumericInputOnChange(event, item.sfieldname, item)}
                                   precision={0}
                                   min={0}
                                   className="form-control"
                                   isMandatory={item.nmandatory === transactionStatus.YES ? true :false}                       
                                   required={item.nmandatory === transactionStatus.YES ? true :false}
                                   errors="Please provide a valid number."
                              />
                        </Col>
                    </Row>
                    )
            }
            case 6: {                
                return (
                    <Row>
                        <Col md={12}>
                            <CustomSwitch
                                   name={item.sfieldname}
                                   type="switch"
                                   label={item.sdisplayname}
                                   placeholder={item.sdisplayname}                            
                                   defaultValue ={ props.selectedRecord[item.sfieldname] === transactionStatus.YES ? true :false }  
                                   isMandatory={item.nmandatory === transactionStatus.YES ? true :false}                       
                                   required={item.nmandatory === transactionStatus.YES ? true :false}                                   
                                   checked={ props.selectedRecord[item.sfieldname] === transactionStatus.YES ? true :false}
                                   onChange={(event)=> props.onInputOnChange(event, item)}
                                   />
                        </Col>
                    </Row>
                    )
            }
            default :
                return "";
        }
        
        } )

    )
}

export default injectIntl(DashBoardDynamicControls);