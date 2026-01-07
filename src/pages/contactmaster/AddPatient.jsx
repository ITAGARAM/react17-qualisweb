import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { MediaHeader } from '../../components/App.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import { transactionStatus } from '../../components/Enumeration';

const AddPatient = (props) => {
     return (
          <Row>
               <Col md={6}>
                    {/* <Row>
                         <Col md={12}> */}
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
                        // isDisabled={props.operation !== "update" ? false : true}
                          isDisabled={false}

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
                        // isDisabled={props.operation !== "update" ? false : true}
                        isDisabled={false}

                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sfathername"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_FATHERNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_FATHERNAME" })}
                         value={props.selectedRecord && props.selectedRecord["sfathername"] !== "null" ? props.selectedRecord["sfathername"] : ""}
                         isMandatory={false}
                         required={true}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"ngendercode"}
                         formLabel={props.intl.formatMessage({ id: "IDS_GENDER" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.genderList}
                         value={props.selectedRecord["ngendercode"]}
                         isMandatory={true}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                       //  isDisabled={props.operation !== "update" ? false : true}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ngendercode')}
                         isDisabled={false}

                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <DateTimePicker
                         name={"ddob"}
                         label={props.intl.formatMessage({ id: "IDS_DATEOFBIRTH" })}
                         className='form-control'
                         placeholderText="Select date.."
                         selected={props.selectedRecord["ddob"] || ""}
                         dateFormat={props.userInfo.ssitedate}
                         isClearable={false}
                         isMandatory={true}
                         required={true}
                         maxDate={props.currentTime}
                         maxTime={props.currentTime}
                         onChange={date => props.handleDateChange("ddob", date)}
                         value={props.selectedRecord["ddob"]}
                         //isDisabled={props.operation !== "update" ? false : true}
                         isDisabled={false}


                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sage"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_AGE" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_AGE" })}
                         value={props.selectedRecord["sage"]}
                         isMandatory={false}
                         required={true}
                         readOnly
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}
                    {/* <Col md={12}> */}
                    <CustomSwitch
                         label={props.intl.formatMessage({ id: "IDS_MIGRANT" })}
                         type="switch"
                         name={"nneedmigrant"}
                         onChange={(event) => props.onInputOnChange(event)}
                         placeholder={props.intl.formatMessage({ id: "IDS_MIGRANT" })}
                         defaultValue={props.selectedRecord["nneedmigrant"] === 3 ? true : false}
                         isMandatory={false}
                         required={false}
                         checked={props.selectedRecord["nneedmigrant"] === 3 ? true : false}
                    />
                    {/* </Col> */}


                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"ncountrycode"}
                         formLabel={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.countryList}
                         value={props.selectedRecord["ncountrycode"]}
                         isMandatory={true}
                         required={false}
                         isClearable={true}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                    />
                    {/* </Col> */}

                    <MediaHeader className='mb-3'>
                         <h6>{props.intl.formatMessage({ id: "IDS_PERMANENTADDRESS" })}</h6>
                    </MediaHeader>


                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"nregioncode"}
                         formLabel={props.intl.formatMessage({ id: "IDS_REGIONNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.regionList}
                         value={props.selectedRecord["nregioncode"]}
                         isMandatory={false}
                         required={true}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'nregioncode', 'districtList')}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"ndistrictcode"}
                         formLabel={props.intl.formatMessage({ id: "IDS_DISTRICTNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.districtList}
                         value={props.selectedRecord["ndistrictcode"]}
                         isMandatory={false}
                         required={true}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ndistrictcode', 'cityList')}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    {/* <FormInput
                                   name={"sdistrict"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_DISTRICT" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_DISTRICT" })}
                                   value={props.selectedRecord && props.selectedRecord["sdistrict"] !== "null" ?props.selectedRecord["sdistrict"]:""}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={100}
                                   onChange={(event) => props.onInputOnChange(event)}
                              /> */}
                    {/* </Col> */}


                    {/* <Col md={12}> */}
                    {/* <FormSelectSearch
                         name={"ncitycode"}
                         formLabel={props.intl.formatMessage({ id: "IDS_CITY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.cityList}
                         value={props.selectedRecord["ncitycode"]}
                         isMandatory={true}
                         required={false}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ncitycode')}
                    /> */}

                    <FormInput
                         name={"scityname"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_REGIONCITY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_REGIONCITY" })}
                         value={props.selectedRecord && props.selectedRecord["scityname"] !== "null" ? props.selectedRecord["scityname"] : ""}
                         isMandatory={false}
                         required={true}
                         maxLength={50}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"spostalcode"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                         value={props.selectedRecord["spostalcode"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sstreet"}
                         label={props.intl.formatMessage({ id: "IDS_STREET" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_STREET" })}
                         value={props.selectedRecord["sstreet"]}
                         rows="2"
                         isMandatory={false}
                         required={true}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"shouseno"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_HOUSENO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_HOUSENO" })}
                         value={props.selectedRecord["shouseno"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}
                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sflatno"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_FLATNO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_FLATNO" })}
                         value={props.selectedRecord["sflatno"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    {/* <FormCheckbox
                               name={props.primaryKeyField }
                               type="checkbox"
                               value={["dataItem"] !== 0 ? true : false}
                               isMandatory={false}
                               required={false}
                               className= "custom-checkbox"
                               //checked={row["dataItem"][item.checkBoxField] === item.switchStatus ? true : false}
                               checked={["dataItem"] !== 0 ? true : false}
                               onChange={(event) =>props.onInputOnChange(event)}
                           />                
                               <FormCheckbox  className= {true}
                               name={props.primaryKeyField }
                               type="checkbox"
                               value={["dataItem"] !== 0 ? true : false}                            
                               isMandatory={false}
                               required={false}
                               //checked={row["dataItem"][item.checkBoxField] === item.switchStatus ? true : false}
                               checked={["dataItem"] !== 0 ? false : false}
                               onChange={(event) =>props.onInputOnChange(event)}
                           />                                  */}
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    {/* <CustomSwitch
                         label={props.intl.formatMessage({ id: "IDS_ADDRESSSTATUS" })}
                         type="switch"
                         name={"nneedcurrentaddress"}
                         onChange={(event) => props.onInputOnChange(event)}
                         placeholder={props.intl.formatMessage({ id: "IDS_ADDRESSSTATUS" })}
                         defaultValue={props.selectedRecord["nneedcurrentaddress"] === 3 ? true : false}
                         isMandatory={false}
                         required={false}
                         checked={props.selectedRecord["nneedcurrentaddress"] === 3 ? true : false}
                    /> */}
                    {/* </Col> */}

               </Col>


               <Col md={6}>

                    <CustomSwitch
                         label={props.intl.formatMessage({ id: "IDS_ADDRESSSTATUS" })}
                         type="switch"
                         name={"nneedcurrentaddress"}
                         onChange={(event) => props.onInputOnChange(event)}
                         placeholder={props.intl.formatMessage({ id: "IDS_ADDRESSSTATUS" })}
                         defaultValue={props.selectedRecord["nneedcurrentaddress"] === 3 ? true : false}
                         isMandatory={false}
                         required={false}
                         checked={props.selectedRecord["nneedcurrentaddress"] === 3 ? true : false}
                    />

                    <MediaHeader className='mb-3'>
                         <h6>{props.intl.formatMessage({ id: "IDS_CURRENTADDRESS" })}</h6>
                    </MediaHeader>


                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"nregioncodetemp"}
                         formLabel={props.intl.formatMessage({ id: "IDS_REGIONNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.regionList}
                         value={props.selectedRecord["nregioncodetemp"]}
                         isMandatory={false}
                         required={true}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'nregioncodetemp', 'districtListTemp')}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormSelectSearch
                         name={"ndistrictcodetemp"}
                         formLabel={props.intl.formatMessage({ id: "IDS_DISTRICTNAME" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.districtListTemp}
                         value={props.selectedRecord["ndistrictcodetemp"]}
                         isMandatory={false}
                         required={true}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ndistrictcodetemp', "cityListTemp")}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    {/* <FormInput
                                   name={"sdistrict"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_DISTRICT" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_DISTRICT" })}
                                   value={props.selectedRecord && props.selectedRecord["sdistrict"] !== "null" ?props.selectedRecord["sdistrict"]:""}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={100}
                                   onChange={(event) => props.onInputOnChange(event)}
                              /> */}
                    {/* </Col> */}


                    {/* <Col md={12}> */}
                    {/* <FormSelectSearch
                         name={"ncitycodetemp"}
                         formLabel={props.intl.formatMessage({ id: "IDS_CITY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                         options={props.cityListTemp}
                         value={props.selectedRecord["ncitycodetemp"]}
                         isMandatory={true}
                         required={false}
                         isClearable={false}
                         isMulti={false}
                         isSearchable={false}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                         closeMenuOnSelect={true}
                         onChange={(event) => props.onComboChange(event, 'ncitycodetemp')}
                    /> */}

                    <FormInput
                         name={"scitynametemp"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_REGIONCITY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_REGIONCITY" })}
                         value={props.selectedRecord && props.selectedRecord["scitynametemp"] !== "null" ? props.selectedRecord["scitynametemp"] : ""}
                         isMandatory={false}
                         required={false}
                         maxLength={50}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"spostalcodetemp"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                         value={props.selectedRecord["spostalcodetemp"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sstreettemp"}
                         label={props.intl.formatMessage({ id: "IDS_STREET" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_STREET" })}
                         value={props.selectedRecord["sstreettemp"]}
                         rows="2"
                         isMandatory={false}
                         required={true}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                    />
                    {/* </Col> */}

                    {/* <Col md={12}> */}
                    <FormInput
                         name={"shousenotemp"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_HOUSENO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_HOUSENO" })}
                         value={props.selectedRecord["shousenotemp"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                    />
                    {/* </Col> */}
                    {/* <Col md={12}> */}
                    <FormInput
                         name={"sflatnotemp"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_FLATNO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_FLATNO" })}
                         value={props.selectedRecord["sflatnotemp"]}
                         isMandatory={false}
                         required={true}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                         isDisabled={props.selectedRecord["nneedcurrentaddress"] === transactionStatus.YES ? true : false}
                    />
                    {/* </Col> */}


                    {/* <Col md={12}>
                              <FormSelectSearch
                                   name={"npatientsitecode"}
                                   formLabel={props.intl.formatMessage({ id: "IDS_PARENTSITE" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                   options={props.patientSiteList}
                                   value={props.selectedRecord["npatientsitecode"]}
                                   isMandatory={false}
                                   isClearable={true}
                                   isMulti={false}
                                   isSearchable={false}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   onChange={(event) => props.onComboChange(event, 'npatientsitecode')}
                              />
                         </Col> */}

                    {/* <Col md={12}>
                              <FormInput
                                   name={"snationalid"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_NATIONALID" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_NATIONALID" })}
                                   value={props.selectedRecord["snationalid"]}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={100}
                                   onChange={(event) => props.onInputOnChange(event)}
                              />
                         </Col> */}
                    {/* </Row> */}

                    {/* <Row>

                    <Col md={12}> */}
                    {/* <FormInput
                                   name={"spostalcode"}
                                   type="text"
                                   label={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_POSTALCODE" })}
                                   value={props.selectedRecord && props.selectedRecord["spostalcode"] !== "null" ? props.selectedRecord["spostalcode"] : ""}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={20}
                                   onChange={(event) => props.onInputOnChange(event)}
                              /> */}
                    {/* </Col>

                          <Col md={12}> */}
                    {/* <FormSelectSearch
                                   name={"ncountrycode"}
                                   formLabel={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                   options={props.countryList}
                                   value={props.selectedRecord["ncountrycode"]}
                                   isMandatory={false}
                                   required={false}
                                   isClearable={true}
                                   isMulti={false}
                                   isSearchable={false}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   onChange={(event) => props.onComboChange(event, 'ncountrycode')}
                              /> */}
                    {/* </Col>

                         <Col md={12}> */}
                    <FormInput
                         name={"sphoneno"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                         value={props.selectedRecord && props.selectedRecord["sphoneno"] !== "null" ? props.selectedRecord["sphoneno"] : ""}
                         isMandatory={false}
                         required={false}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>

                         <Col md={12}> */}
                    <FormInput
                         name={"smobileno"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_MOBILENO" })}
                         value={props.selectedRecord && props.selectedRecord["smobileno"] !== "null" ? props.selectedRecord["smobileno"] : ""}
                         isMandatory={false}
                         required={false}
                         maxLength={20}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>

                         <Col md={12}> */}
                    <FormInput
                         name={"semail"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                         value={props.selectedRecord && props.selectedRecord["semail"] !== "null" ? props.selectedRecord["semail"] : ""}
                         isMandatory={false}
                         required={false}
                         maxLength={100}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>

                          <Col md={12}> */}
                    <FormInput
                         name={"spassportno"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_PASSPORTNO" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_PASSPORTNO" })}
                         value={props.selectedRecord && props.selectedRecord["spassportno"] !== "null" ? props.selectedRecord["spassportno"] : ""}
                         isMandatory={false}
                         required={false}
                         maxLength={50}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>


                          <Col md={12}> */}
                    <FormTextarea
                         name={"srefid"}
                         label={props.intl.formatMessage({ id: "IDS_REFERENCEID" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_REFERENCEID" })}
                         value={props.selectedRecord && props.selectedRecord["srefid"] !== "null" ? props.selectedRecord["srefid"] : ""}
                         rows="2"
                         isMandatory={false}
                         required={false}
                         maxLength={255}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>

                         <Col md={12}> */}
                    <FormTextarea
                         name={"sexternalid"}
                         label={props.intl.formatMessage({ id: "IDS_EXTERNALID" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_EXTERNALID" })}
                         value={props.selectedRecord && props.selectedRecord["sexternalid"] !== "null" ? props.selectedRecord["sexternalid"] : ""}
                         rows="2"
                         isMandatory={false}
                         required={false}
                         maxLength={255}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                    {/* </Col>
                    </Row> */}
               </Col>
          </Row>
     )
}
export default injectIntl(AddPatient);
