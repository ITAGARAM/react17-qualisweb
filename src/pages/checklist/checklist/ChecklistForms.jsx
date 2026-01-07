import React from 'react'
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import {Row, Col,} from 'react-bootstrap';

import { injectIntl } from 'react-intl';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import Esign from '../../audittrail/Esign';
import { transactionStatus } from '../../../components/Enumeration';
class ChecklistForms extends React.Component{
    render(){
        let mandatoryFields=this.props.id==='checklist'?[{"idsName": "IDS_CHECKLISTNAME", "dataField": "schecklistname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}]
                            :this.props.id==='checklistversion'?[{"idsName": "IDS_CHECKLISTVERSION", "dataField": "schecklistversionname", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}]
                            :this.props.id==="checklistversionqb"&&this.props.operation!=="update"?[
                                {"idsName": "IDS_QBCATEGORYNAME", "dataField": "schecklistqbcategoryname", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                {"idsName": "IDS_QUESTION", "dataField": this.props.selectedRecord['schecklistqbcategoryname'], "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
                                ]
                            :[]
        return(
            <SlideOutModal
            onSaveClick={this.props.onSaveClick}
            operation={this.props.operation?this.props.operation:''}
            screenName={this.props.id==='checklist'?"IDS_CHECKLIST":this.props.id==='checklistversion'?"IDS_CHECKLISTVERSION":"IDS_CHECKLISTVERSIONQB"}
            closeModal={this.props.handleClose}
            show={this.props.isOpen}
            inputParam={this.props.Login.inputParam}
            esign={this.props.Login.loadEsign}
            validateEsign={this.props.validateEsign}
            selectedRecord={this.props.selectedRecord || {}}
            mandatoryFields={mandatoryFields}
            addComponent={this.props.Login.loadEsign ? 
                <Esign  
                    operation={this.props.Login.operation}
                    onInputOnChange={(event)=>this.props.onInputOnChange(event)}
                    inputParam={this.props.Login.inputParam}                                               
                    selectedRecord={this.props.selectedRecord ||{}}
                    />
                :
            <Row>
                <Col md={12}>
                    {this.props.id==='checklist'?
                        <>
                            <FormInput
                                name="schecklistname"
                                type="text"
                                label={this.props.intl.formatMessage({ id:"IDS_CHECKLISTNAME"})}
                                onChange={(event)=>this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_CHECKLISTNAME"})}
                                value ={this.props.selectedRecord ? this.props.selectedRecord["schecklistname"] : ""}
                                isMandatory={true}
                                required={ true}
                                maxLength={100}
                            />
                            <FormTextarea
                                label={this.props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}
                                name="sdescription"
                                onChange={(event)=>this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}
                                value ={this.props.selectedRecord ? this.props.selectedRecord["sdescription"] : ""}
                                rows="2"
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                            />
                        </>
                        :""
                        }
                        {this.props.id==='checklistversion'?
                            <FormInput
                                name={"schecklistversionname"}
                                type="text"
                                label={this.props.intl.formatMessage({ id:"IDS_CHECKLISTVERSION"})}
                                onChange={(event)=>this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_CHECKLISTVERSION"})}
                                value ={this.props.selectedRecord ? this.props.selectedRecord["schecklistversionname"] : ""}
                                isMandatory={true}
                                required={ true}
                                maxLength={100}
                            />
                        :""}
                        {this.props.id==="checklistversionqb"?
                        <>
                            <FormSelectSearch
                                name="nchecklistqbcategorycode"
                                formLabel={this.props.intl.formatMessage({ id:"IDS_QBCATEGORYNAME"})}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}
                                value={this.props.QBCategory}
                                options={this.props.availableQBCategory||[]}
                                optionId="nchecklistqbcategorycode"
                                optionValue="schecklistqbcategoryname"
                                isMandatory={true}
                                isMulti={false}
                                isDisabled={this.props.operation==="update"?true:false}
                                isSearchable={false}
                                as="select"
                                onChange={(event)=>this.props.onComboChange(event,"nchecklistqbcategorycode")}
                        />
                            <FormSelectSearch
                                name="nchecklistqbcode"
                                formLabel={this.props.intl.formatMessage({ id:"IDS_QUESTION"})}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}
                                key={this.props.selectedRecord&&this.props.selectedRecord.schecklistqbcategoryname?this.props.selectedRecord.schecklistqbcategoryname:''}
                                value={this.props.QB}
                                options={this.props.selectedRecord&&this.props.selectedRecord.schecklistqbcategoryname?this.props.availableQB||[]:[]}
                                optionId="nchecklistqbcode"
                                optionValue="squestion"
                                isMandatory={true}
                                isMulti={this.props.operation==="update"?false:true}
                                isDisabled={this.props.operation==="update"?true:false}
                                isSearchable={false}
                                closeMenuOnSelect={false}
                                as={"select"}
                                isClearable={true}
                                onChange={(event)=>this.props.onComboChange(event,"nchecklistqbcode")}
                        />
                        {this.props.operation==="update"? 
                        
                            <CustomSwitch
                                label={this.props.intl.formatMessage({ id:"IDS_MANDATORY"})}
                                type="switch"
                                name={"nmandatoryfield"}
                                onChange={(event)=>this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id:"IDS_MANDATORY"})}
                                defaultValue ={this.props.selectedRecord ? this.props.selectedRecord["nmandatoryfield"] === transactionStatus.YES ? true :false  : false}
                                isMandatory={false}
                                required={false}
                                checked={this.props.selectedRecord ? this.props.selectedRecord.nmandatoryfield === transactionStatus.YES ? true :false  : false}
                                disabled={false}
                            />                                               
                        :""}
                        </>
                    :""}
                    </Col>
                </Row>}/>
        )
    }
}
export default injectIntl(ChecklistForms)