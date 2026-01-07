import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';


const AddCourier = (props) => {
    const { Country } = props;
    return (
        <Row>
            <Col md={6}>
                    <Row>
                        <Col md={12}>
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_COURIERNAME" })}
                                name= "scouriername"
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_COURIERNAME" })}
                                value={props.selectedRecord["scouriername"] ? props.selectedRecord["scouriername"] : ""}
                                isMandatory={true}
                                required={true}
                                maxLength={100}
                            />
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_CONTACTPERSON" })}
                                name= "scontactperson"
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_CONTACTPERSON" })}
                                value={props.selectedRecord["scontactperson"] ? props.selectedRecord["scontactperson"] : ""}
                                isMandatory={false}
                                required={false}
                                maxLength={100}
                            />
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={props.intl.formatMessage({ id:"IDS_ADDRESS1" })}
                                name="saddress1"
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                                value={props.selectedRecord["saddress1"] ? props.selectedRecord["saddress1"] : ""}
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                            />
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={props.intl.formatMessage({ id:"IDS_ADDRESS2" })}
                                name="saddress2"
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                                value={props.selectedRecord["saddress2"] ? props.selectedRecord["saddress2"] : ""}
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                            />
                        </Col>
                        <Col md={12}>
                            <FormTextarea
                                label={props.intl.formatMessage({ id:"IDS_ADDRESS3" })}
                                name="saddress3"
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                                value={props.selectedRecord["saddress3"] ? props.selectedRecord["saddress3"] : ""}
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                            />
                        </Col>
                    </Row>
                </Col>
                 <Col md={6}>   
                <Row>  
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                            name={"ncountrycode"} 
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={props.selectedRecord ? props.selectedRecord["ncountrycode"] : ""}
                            options={Country}
                            optionId="ncountrycode"
                            optionValue="scountryname"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            as={"select"}
                            onChange={(event) => props.onComboChange(event, "ncountrycode")}
                            
                        />
                     </Col>
          
                    <Col md={12}>
                       <FormInput
                            name={"semail"}
                            type="email"
                            label={ props.intl.formatMessage({ id:"IDS_EMAIL"})}                            
                            placeholder={ props.intl.formatMessage({ id:"IDS_EMAIL"})}
                            value ={ props.selectedRecord["semail"] ? props.selectedRecord["semail"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={50}
                            onChange={(event)=> props.onInputOnChange(event)}                            
                       />
                   </Col>
                    <Col md={12}>
                       <FormInput
                            name={"smobileno"}
                            type="text"
                            label={ props.intl.formatMessage({ id:"IDS_MOBILENO"})}                   
                            placeholder={ props.intl.formatMessage({ id:"IDS_MOBILENO"})}
                            value ={ props.selectedRecord["smobileno"] ? props.selectedRecord["smobileno"] : "" }
                            isMandatory={false}
                            required={false}
                            maxLength={50}
                            onChange={(event)=> props.onInputOnChange(event)}
                       /> 
                       
                        {/* <FormNumericInput
                              name={"smobileno"}
                              label={ props.intl.formatMessage({ id:"IDS_MOBILENO"})}                   
                              placeholder={ props.intl.formatMessage({ id:"IDS_MOBILENO"})}
                              type="number"
                              value ={ props.selectedRecord["smobileno"] }
                              strict={true}
                              maxLength={10}
                              onChange={(event) => props.onNumericInputOnChange(event, "smobileno")}
                              precision={0}
                              className="form-control"
                              isMandatory={false}
                              errors="Please provide a valid number."
                            /> */}
                    </Col>
                    <Col md={12}>
                        <FormInput
                            name={"sphoneno"}
                            type="text"
                            label={ props.intl.formatMessage({ id:"IDS_PHONENO"})}                  
                            placeholder={ props.intl.formatMessage({ id:"IDS_PHONENO"})}
                            value ={ props.selectedRecord["sphoneno"] ? props.selectedRecord["sphoneno"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={50}
                            onChange={(event)=> props.onInputOnChange(event)}
                       /> 
                        {/* <FormNumericInput
                                name={"sphoneno"}
                                label={ props.intl.formatMessage({ id:"IDS_PHONENO"})}                  
                                placeholder={ props.intl.formatMessage({ id:"IDS_PHONENO"})}
                                type="number"
                                value ={ props.selectedRecord["sphoneno"]}
                                strict={true}
                                maxLength={10}
                                onChange={(event) => props.onNumericInputOnChange(event, "sphoneno")}
                                precision={0}
                                className="form-control"
                                isMandatory={true}
                                required={true}
                                errors="Please provide a valid number."
                            />*/}
                   </Col>
                   
                  
                   <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_FAXNO" })}
                            name= "sfaxno"
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_FAXNO" })}
                            value={props.selectedRecord["sfaxno"] ? props.selectedRecord["sfaxno"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={50}
                        />
                    </Col>
                 
                   </Row>
                   </Col>
        </Row>
    );
};

export default injectIntl(AddCourier);