import React from 'react'
import { Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../../components/form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration'

const DynamicControl = (props) => {
    return(      
       props.viewReportDesignConfigList.map(item=>{
        switch (item.ndesigncomponentcode) {

            case 1: {                
                return (
                    <Row>
                        <Col md={12}>
                            <FormInput
                                name={item.sreportparametername}
                                type="text"
                                label={ item.sdisplayname}                   
                                placeholder={ item.sdisplayname}
                                value ={ props.selectedRecord[item.sreportparametername]  || ""}
                                isMandatory={item.nmandatory === transactionStatus.YES ? true :false}
                                required={item.nmandatory === transactionStatus.YES ? true :false}
                                maxLength={150}
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
                                   name={item.sreportparametername}
                                   label={item.sdisplayname}                    
                                   placeholder={item.sdisplayname}
                                   value ={ props.selectedRecord[item.sreportparametername] || ""}
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
                                        name={item.sreportparametername}
                                        formLabel={ item.sdisplayname}                              
                                       // placeholder="Please Select..."  
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                        
                                        options={item.dataList || []}
                                        value = { props.selectedRecord[item.sreportparametername] || ""}
                                        isMandatory={item.nmandatory === transactionStatus.YES ? true :false}
                                        isMulti={false}
                                        isClearable={false}
                                        isSearchable={true}                                
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        onChange = {(event)=> props.onComboChange(event, item.sreportparametername, item)}                               
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
                                    name={item.sreportparametername} 
                                    label={ item.sdisplayname}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord[item.sreportparametername] || ""}
                                    dateFormat={props.userInfo.ssitedate}
                                    showTimeInput={false}
                                    isClearable={false}
                                    isMandatory={item.nmandatory === transactionStatus.YES ? true :false}                       
                                    required={item.nmandatory === transactionStatus.YES ? true :false}
                                    onChange={date => props.handleDateChange(item.sreportparametername, date, item)}
                                    value={props.selectedRecord[item.sreportparametername]}
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
                                   name={item.sreportparametername}
                                   label={ item.sdisplayname}                          
                                   placeholder={ item.sdisplayname}
                                   value ={ props.selectedRecord[item.sreportparametername] || ""}
                                   type="number"                               
                                   strict={true}
                                   maxLength={10}
                                   noStyle={true}
                                   onChange={(event) => props.onNumericInputOnChange(event, item.sreportparametername, item)}
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
                                   name={item.sreportparametername}
                                   type="switch"
                                   label={item.sdisplayname}
                                   placeholder={item.sdisplayname}                            
                                   defaultValue ={ props.selectedRecord[item.sreportparametername] === transactionStatus.YES ? true :false }  
                                   isMandatory={item.nmandatory === transactionStatus.YES ? true :false}                       
                                   required={item.nmandatory === transactionStatus.YES ? true :false}                                   
                                   checked={ props.selectedRecord[item.sreportparametername] === transactionStatus.YES ? true :false}
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

export default injectIntl(DynamicControl);