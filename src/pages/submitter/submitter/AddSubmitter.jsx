import React from 'react';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration';



const AddSubmitter = (props) => {
    return (
        <Row>
            <Col md={6}>
                <Row>
                    <Col md={12}>
                    <FormInput
                         name={"sfirstname"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_FIRSTNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_FIRSTNAME" })}
                         value={props.selectedRecord["sfirstname"]}
                         isMandatory={true}
                         required={true}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.operation !== "update" ? false : true}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"slastname"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_LASTNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_LASTNAME" })}
                         value={props.selectedRecord["slastname"]}
                         isMandatory={true}
                         required={true}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.operation !== "update" ? false : true}
                    />
                        {/* <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SUBMITTER" })}
                            name={"ssubmittername"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SUBMITTER" })}
                            value={props.selectedRecord ? props.selectedRecord["ssubmittername"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                            isDisabled={props.operation !== "update" ? false : true}
                        /> */}
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SHORTNAME" })}
                            name={"sshortname"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SHORTNAME" })}
                            value={props.selectedRecord ? props.selectedRecord["sshortname"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"20"}
                            isDisabled={props.operation !== "update" ? false : true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTNAME" })}
                            isSearchable={true}
                            name={"ninstitutiondeptcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.InstitutionDepartment}
                            value = { props.selectedRecord["ninstitutiondeptcode"] || "" }
                            defaultValue={props.selectedRecord["ninstitutiondeptcode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstitutiondeptcode")}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            name={"sinstitutiondeptcode"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTIONDEPARTMENTCODE" })}
                            value={props.selectedRecord["sinstitutiondeptcode"]}
                            isMandatory={false}
                            required={false}
                            readOnly
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_WARDNAME" })}
                            name={"swardname"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_WARDNAME" })}
                            value={props.selectedRecord ? props.selectedRecord["swardname"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_FAX" })}
                            name={"sfaxno"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_FAX" })}
                            value={props.selectedRecord ? props.selectedRecord["sfaxno"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"20"}
                        />
                    </Col>
                    <Col md={12}>
                    <FormInput
                            label={props.intl.formatMessage({ id: "IDS_TELEPHONE" })}
                            name={"stelephone"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_TELEPHONE" })}
                            value={props.selectedRecord ? props.selectedRecord["stelephone"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"20"}
                        />
                    </Col>

                </Row>
            </Col> 
            <Col md={6}>
                <Row>
                <Col md={12}>
                    <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                            name={"smobileno"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                            value={props.selectedRecord ? props.selectedRecord["smobileno"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"20"}
                            isDisabled={props.operation !== "update" ? false : true}
                        />
                    </Col>       
                    
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                            name={"semail"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                            value={props.selectedRecord ? props.selectedRecord["semail"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                            isDisabled={props.operation !== "update" ? false : true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SPECIALIZATION" })}
                            name={"sspecialization"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPECIALIZATION" })}
                            value={props.selectedRecord ? props.selectedRecord["sspecialization"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_REPORTINGREQUIREMENT" })}
                            name={"sreportrequirement"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REPORTINGREQUIREMENT" })}
                            value={props.selectedRecord ? props.selectedRecord["sreportrequirement"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_SAMPLETRANSPORT" })}
                            name={"ssampletransport"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SAMPLETRANSPORT" })}
                            value={props.selectedRecord ? props.selectedRecord["ssampletransport"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        />
                    </Col>
                    <Col md={12}>
                            <CustomSwitch
                                name={"ntransactionstatus"}
                                type="switch"
                                label={ props.intl.formatMessage({ id:"IDS_ACTIVE"})}
                                placeholder={ props.intl.formatMessage({ id:"IDS_ACTIVE"})}                            
                                defaultValue ={props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false:false }  
                                isMandatory={false}                       
                                required={false}
                                checked={ props.selectedRecord ? props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true :false:false}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />
                    </Col>           
                </Row>
             </Col>   
         </Row>   
        
            
                

                
        
    );
}

export default injectIntl(AddSubmitter);