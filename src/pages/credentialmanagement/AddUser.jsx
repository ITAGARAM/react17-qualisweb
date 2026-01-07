import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';

import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';

import { transactionStatus, attachmentType } from '../../components/Enumeration';
import DropZone from '../../components/dropzone/dropzone.component';

const AddUser = (props) => {
     return (<>
          <Row>
               <Col md={6}>
                    <Row>
                         <Col md={12}>
                              <FormInput
                                   name={"sloginid"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_LOGINID" })}
                                   value={props.selectedRecord["sloginid"]}
                                   isMandatory={true}
                                   required={true}
                                   maxLength={20}
                                   //readOnly={props.userLogged}
                                   //SMTL-29
                                   readOnly={props.operation === "create" ? false:true}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />

                              <FormInput
                                   name={"sfirstname"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_FIRSTNAME" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_FIRSTNAME" })}
                                   value={props.selectedRecord["sfirstname"]}
                                   isMandatory={true}
                                   required={true}
                                   maxLength={50}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                         <Col md={12}> */}
                              <FormInput
                                   name={"slastname"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_LASTNAME" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_LASTNAME" })}
                                   value={props.selectedRecord["slastname"]}
                                   isMandatory={true}
                                   required={true}
                                   maxLength={50}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                              <Col md={12}> */}
                              <FormInput
                                   name={"sempid"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_EMPID" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_EMPID" })}
                                   value={props.selectedRecord["sempid"]}
                                   isMandatory={false}
                                   required={true}
                                   maxLength={20}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                              <Col md={12}>                      */}

                              <DateTimePicker
                                   name={"ddateofjoin"}
                                   label={props.intl.formatMessage({ id: "IDS_DATEOFJOIN" })}
                                   className='form-control'
                                   placeholderText="Select date.."
                                   selected={props.selectedRecord["ddateofjoin"] || ""}
                                   // dateFormat={"dd/MM/yyyy"}
                                   dateFormat={props.userInfo.ssitedate}
                                   isClearable={true}
                                   onChange={date => props.handleDateChange("ddateofjoin", date)}
                                   value={props.selectedRecord["ddateofjoin"]}

                              />

                              {/* </Col>
                              <Col md={12}> */}
                              <FormSelectSearch
                                   name={"ndesignationcode"}
                                   formLabel={props.intl.formatMessage({ id: "IDS_DESIGNATION" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                   options={props.designationList}
                                   // optionId="ndesignationcode"
                                   // optionValue="sdesignationname"
                                   value={props.selectedRecord["ndesignationcode"]}
                                   // defaultValue={props.selectedRecord["ndesignationcode"]}
                                   isMandatory={false}
                                   isClearable={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   //alphabeticalSort={false}
                                   onChange={(event) => props.onComboChange(event, 'ndesignationcode')}
                              />
                              {/* </Col>
                              <Col md={12}> */}
                              <FormSelectSearch
                                   name={"ndeptcode"}
                                   formLabel={props.intl.formatMessage({ id: "IDS_DEPARTMENT" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                   options={props.departmentList}
                                   // optionId="ndeptcode"
                                   // optionValue="sdeptname"                            
                                   value={props.selectedRecord["ndeptcode"]}
                                   // defaultValue = { props.selectedRecord["ndeptcode"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   //alphabeticalSort={true}                    
                                   onChange={(event) => props.onComboChange(event, 'ndeptcode')}
                              />
                              {/* </Col>
                              <Col md={12}> */}
                              <FormTextarea
                                   name={"saddress1"}
                                   label={props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS1" })}
                                   value={props.selectedRecord["saddress1"]}
                                   rows="2"
                                   isMandatory={true}
                                   required={true}
                                   maxLength={255}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                              <Col md={12}> */}
                              <FormTextarea
                                   name={"saddress2"}
                                   label={props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS2" })}
                                   value={props.selectedRecord["saddress2"]}
                                   rows="2"
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                              <Col md={12}> */}
                              <FormTextarea
                                   name={"saddress3"}
                                   label={props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_ADDRESS3" })}
                                   value={props.selectedRecord["saddress3"]}
                                   rows="2"
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                         </Col>
                    </Row>
               </Col>
               <Col md={6}>
                    <Row>
                         <Col md={12}>
                              <FormInput
                                   name={"squalification"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_QUALIFICATION" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_QUALIFICATION" })}
                                   value={props.selectedRecord["squalification"]}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={10}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                    <Col md={12}> */}
                              <FormInput
                                   name={"sbloodgroup"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_BLOODGROUP" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_BLOODGROUP" })}
                                   value={props.selectedRecord["sbloodgroup"]}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={10}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                    <Col md={12}> */}
                              <FormInput
                                   name={"sjobdescription"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_JOBDESCRIPTION" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_JOBDESCRIPTION" })}
                                   value={props.selectedRecord["sjobdescription"]}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                    <Col md={12}> */}
                              <FormInput
                                   name={"semail"}
                                   type="email"
                                   ref={props.emailRef}
                                   label={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                                   value={props.selectedRecord["semail"]}
                                   isMandatory={true}
                                   required={true}
                                   maxLength={50}
                                   onChange={(event) => props.onInputOnChange(event)}
                              //onBlur={(event)=>props.validateEmail(event, props.emailRef)}                            
                              />
                              {/* </Col>
                    <Col md={12}> */}
                              <FormInput
                                   name={"sphoneno"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                                   value={props.selectedRecord["sphoneno"]}
                                   isMandatory={true}
                                   required={true}
                                   maxLength={50}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />

                              {/* </Col>
                    <Col md={12}> */}
                              <FormInput
                                   name={"smobileno"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                                   value={props.selectedRecord["smobileno"]}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={50}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                              {/* </Col>
                    <Col md={12}> */}

                              <FormSelectSearch
                                   name={"ncountrycode"}
                                   formLabel={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                   options={props.countryList}
                                   //   optionId='ncountrycode'
                                   //   optionValue='scountryname'
                                   value={props.selectedRecord["ncountrycode"]}
                                   // defaultValue = { props.selectedRecord["ncountrycode"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   //alphabeticalSort={true}
                                   onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                              />
                              {/* </Col> */}
                              {props.operation === "create" ? <>
                                   {/* <Col md={12}> */}
                                   <FormSelectSearch
                                        name={"usersite"}
                                        formLabel={props.intl.formatMessage({ id: "IDS_SITE" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={props.siteList}
                                        //  optionId="nsitecode"
                                        //  optionValue="ssitename"
                                        value={props.selectedRecord["usersite"]}
                                        isMandatory={true}
                                        isMulti={false}
                                        isSearchable={true}
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        //alphabeticalSort={true}
                                        onChange={(event) => props.onComboChange(event, 'usersite')}
                                   />
                                   {/* </Col>
                        <Col md={12}> */}
                                   <FormSelectSearch
                                        name={"nuserrolecode"}
                                        formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={props.roleList}
                                        // optionId="nuserrolecode"
                                        // optionValue="suserrolename"
                                        value={props.selectedRecord["nuserrolecode"]}
                                        isMandatory={true}
                                        isMulti={false}
                                        isSearchable={true}
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        //alphabeticalSort={true}
                                        onChange={(event) => props.onComboChange(event, 'nuserrolecode')}
                                   />
                                   {/* </Col> */}
                              </>
                                   : " "
                              }
                         </Col>
                    </Row>
                    <Row>
                         <Col md={6}>
                              <CustomSwitch
                                   name={"ntransactionstatus"}
                                   type="switch"
                                   label={props.intl.formatMessage({ id: "IDS_ISACTIVE" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_ISACTIVE" })}
                                   defaultValue={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                                   isMandatory={false}
                                   required={false}
                                   //   disabled={props.selectedRecord["nlogintypecode"] === transactionStatus.LOGINTYPE_ADS}
                                   checked={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                         </Col>
                         <Col md={6}>
                              <CustomSwitch
                                   name={"nlockmode"}
                                   type="switch"
                                   label={props.intl.formatMessage({ id: "IDS_LOCKMODE" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_LOCKMODE" })}
                                   defaultValue={props.selectedRecord["nlockmode"] === transactionStatus.UNLOCK ? true : false}
                                   isMandatory={false}
                                   required={false}
                                   //    disabled={props.selectedRecord["nlogintypecode"] === transactionStatus.LOGINTYPE_ADS}
                                   checked={props.selectedRecord["nlockmode"] === transactionStatus.UNLOCK ? true : false}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                         </Col>

                    </Row>
               </Col>
          </Row>

          <Row>
               {Object.keys(props.selectedRecord).length > 0 &&
                    <Col md={6}>
                         <DropZone
                              name={"ssignimgname"}
                              label={props.intl.formatMessage({ id: "IDS_SSIGNIMGNAME" })}
                              maxFiles={1}
                              accept="image/*"
                              minSize={0}
                              maxSize={1}
                              onDrop={(event) => props.onDropImage(event, "ssignimgname", 1)}
                              multiple={false}
                              editFiles={props.selectedRecord ? props.selectedRecord : {}}
                              attachmentTypeCode={props.operation === "update" ? attachmentType.OTHERS : ""}
                              fileName="ssignimgname"
                              deleteAttachment={props.deleteUserFile}
                              //deleteAttachment={(event)=>props.deleteUserFile(event, "ssignimgname")}
                              //deleteAttachment={()=>props.deleteUserFile("ssignimgname")}
                              actionType={props.actionType}
                         />
                    </Col>}
               {Object.keys(props.selectedRecord).length > 0 &&
                    <Col md={6}>
                         <DropZone
                              name={"suserimgname"}
                              label={props.intl.formatMessage({ id: "IDS_SUSERIMGNAME" })}
                              maxFiles={1}
                              accept="image/*"
                              minSize={0}
                              maxSize={1}
                              onDrop={(event) => props.onDropImage(event, "suserimgname", 1)}
                              multiple={false}
                              editFiles={props.selectedRecord ? props.selectedRecord : {}}
                              attachmentTypeCode={props.operation === "update" ? attachmentType.OTHERS : ""}
                              fileName="suserimgname"
                              deleteAttachment={props.deleteUserFile}
                              //deleteAttachment={(event)=>props.deleteUserFile(event, "suserimgname")}
                              //deleteAttachment={()=>props.deleteUserFile("suserimgname")}
                              actionType={props.actionType}
                         />
                    </Col>}
          </Row></>
     )
}
export default injectIntl(AddUser);
