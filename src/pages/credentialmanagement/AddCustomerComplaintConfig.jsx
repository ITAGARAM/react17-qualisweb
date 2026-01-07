// import React from 'react';
// import { Col, Row } from 'react-bootstrap';
// import { injectIntl } from 'react-intl';
// import FormInput from '../../components/form-input/form-input.component';
// import FormSelectSearch from '../../components/form-select-search/Form-select-search-componnet';
// import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
// import { transactionStatus } from '../../components/Enumeration';
// import FormTextarea from '../../components/form-textarea/form-textarea.component';



// const AddCustomerComplaintConfig = (props) => {
//     const { selectedRecord, onInputOnChange, intl } = props;

//     return (
//         <>

//             <Row>
//                 <Col md={6}>
//                     <FormInput
//                         label={intl.formatMessage({ id: "IDS_RECEIVEDFROM" })}
//                         name="sreceivedfrom"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_RECEIVEDFROM" })}
//                         value={selectedRecord.sreceivedfrom || ""}
//                         isMandatory={true}
//                         required={true}
//                         maxLength={100}
//                     />
//                        <FormTextarea
//                         label={intl.formatMessage({ id: "IDS_COMPLAINTDETAILS" })}
//                         name="scomplaintdetails"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_COMPLAINTDETAILS" })}
//                         value={selectedRecord.scomplaintdetails || ""}
//                         required={true}
//                         maxLength={500}
//                         isMandatory={true}
//                     />

//                     {/* <FormSelectSearch
//                         formLabel={props.intl.formatMessage({ id: "IDS_REGION" })}
//                         isSearchable={true}
//                         name={"nregioncode"}
//                         isDisabled={false}
//                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory={true}
//                         isClearable={false}
//                         options={props.regionList || []}
//                         value={props.selectedRecord["nregioncode"] || ""}
//                         onChange={(event) => props.onComboChange(event, "nregioncode", 1)}
//                         closeMenuOnSelect={true}
//                         isMulti={false}
//                     />
//                     <FormSelectSearch
//                         formLabel={props.intl.formatMessage({ id: "IDS_DISTRICT" })}
//                         isSearchable={true}
//                         name={"ndistrictcode"}
//                         isDisabled={false}
//                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory={true}
//                         isClearable={false}
//                         options={props.districtList || []}
//                         value={props.selectedRecord["ndistrictcode"] || ""}
//                         onChange={(event) => props.onComboChange(event, "ndistrictcode", 2)}
//                         closeMenuOnSelect={true}
//                         isMulti={false}
//                     />
//                     <FormSelectSearch
//                         formLabel={props.intl.formatMessage({ id: "IDS_TALUK" })}
//                         isSearchable={true}
//                         name={"ncitycode"}
//                         isDisabled={false}
//                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory={true}
//                         isClearable={false}
//                         options={props.cityList || []}
//                         value={props.selectedRecord["ncitycode"] || ""}
//                         onChange={(event) => props.onComboChange(event, "ncitycode", 3)}
//                         closeMenuOnSelect={true}
//                         isMulti={false}
//                     />
//                     <FormSelectSearch
//                         formLabel={props.intl.formatMessage({ id: "IDS_VILLAGE" })}
//                         isSearchable={true}
//                         name={"nvillagecode"}
//                         isDisabled={false}
//                         placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory={true}
//                         isClearable={false}
//                         options={props.villageList || []}
//                         value={props.selectedRecord["nvillagecode"] || ""}
//                         onChange={(event) => props.onComboChange(event, "nvillagecode", 4)}
//                         closeMenuOnSelect={true}
//                         isMulti={false}
//                     /> */}


//                       {/* 1. State Laboratory */}
//                     <FormSelectSearch
//                         formLabel={intl.formatMessage({ id: "IDS_STATELABORATORY" })}
//                         name="nstatelabcode"
//                         isSearchable
//                         placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory
//                         isClearable={false}
//                         options={props.stateList || []}
//                         value={selectedRecord.nstatelabcode || null}
//                         onChange={(e) => props.onComboChange(e, "nstatelabcode", 1)}
//                         closeMenuOnSelect
//                         isMulti={false}
//                     />

//                     {/* 2. Regional Laboratory */}
//                     <FormSelectSearch
//                         formLabel={intl.formatMessage({ id: "IDS_REGIONALLABORATORY" })}
//                         name="nregionallabcode"
//                         isSearchable
//                         placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory
//                         isClearable={false}
//                         options={props.regionalList || []}
//                         value={selectedRecord.nregionallabcode || null}
//                         onChange={(e) => props.onComboChange(e, "nregionallabcode", 2)}
//                         closeMenuOnSelect
//                         isMulti={false}
//                     />

//                     {/* 3. District Laboratory */}
//                     <FormSelectSearch
//                         formLabel={intl.formatMessage({ id: "IDS_DISTRICTLABORATORY" })}
//                         name="ndistrictlabcode"
//                         isSearchable
//                         placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory
//                         isClearable={false}
//                         options={props.districtList || []}
//                         value={selectedRecord.ndistrictlabcode || null}
//                         onChange={(e) => props.onComboChange(e, "ndistrictlabcode", 3)}
//                         closeMenuOnSelect
//                         isMulti={false}
//                     />

//                     {/* 4. Sub Divisional Laboratory */}
//                     <FormSelectSearch
//                         formLabel={intl.formatMessage({ id: "IDS_SUBDIVISIONALLABORATORY" })}
//                         name="nsubdivisionallabcode"
//                         isSearchable
//                         placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                         isMandatory
//                         isClearable={false}
//                         options={props.subDivisionalList || []}
//                         value={selectedRecord.nsubdivisionallabcode || null}
//                         onChange={(e) => props.onComboChange(e, "nsubdivisionallabcode", 4)}
//                         closeMenuOnSelect
//                         isMulti={false}
//                     />
//                     <FormSelectSearch
// 							formLabel={intl.formatMessage({ id: "IDS_VILLAGE" })}
// 							name="nvillagecode"
// 							isSearchable
// 							placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
// 							isMandatory
// 							isClearable={false}
// 							options={props.villageList || []}
// 							value={selectedRecord.nvillagecode || null}
// 							onChange={(e) => props.onComboChange(e, "nvillagecode", 5)}
// 							closeMenuOnSelect
// 							isMulti={false}
// 						/>


//                 </Col>

//                 <Col md={6}>

//                      <FormInput
//                         label={intl.formatMessage({ id: "IDS_LOCATION" })}
//                         name="slocation"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_LOCATION" })}
//                         value={selectedRecord.slocation || ""}
//                         maxLength={150}
//                         isMandatory={true}
//                     />


//                     <FormInput
//                         label={intl.formatMessage({ id: "IDS_CONTACTNO" })}
//                         name="scontactnumber"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_PHONENO" })}
//                         value={selectedRecord.scontactnumber || ""}
//                         required={true}
//                         maxLength={20}
                     
//                     />

//                     <FormInput
//                         label={intl.formatMessage({ id: "IDS_EMAIL" })}
//                         name="semail"
//                         type="email"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_EMAIL" })}
//                         value={selectedRecord.semail || ""}
//                         required={true}
//                         maxLength={50}
//                         isMandatory={true}
//                     />

//                     <FormInput
//                         label={intl.formatMessage({ id: "IDS_LATITUDE" })}
//                         name="slatitude"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_LATITUDE" })}
//                         value={selectedRecord.slatitude || ""}
//                         maxLength={15}
//                     />

//                     <FormInput
//                         label={intl.formatMessage({ id: "IDS_LONGITUDE" })}
//                         name="slongitude"
//                         type="text"
//                         onChange={onInputOnChange}
//                         placeholder={intl.formatMessage({ id: "IDS_LONGITUDE" })}
//                         value={selectedRecord.slongitude || ""}
//                         maxLength={15}
//                     />


//                     <DateTimePicker
//                         name={"dcomplaintdate"}
//                         label={props.intl.formatMessage({ id: "IDS_RECEIVEDDATEWOTIME" })}
//                         className='form-control'
//                         placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
//                         selected={props.selectedRecord ? props.selectedRecord["dcomplaintdate"] : new Date()}
//                         dateFormat={props.userInfo.ssitedatetime}
//                         isClearable={false}
//                         isMandatory={true}
//                         required={true}
//                         timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
//                         showTimeInput={true}
//                         maxDate={props.currentTime}
//                         onChange={date => props.handleDateChange("dcomplaintdate", date)}
//                         value={props.selectedRecord["dcomplaintdate"] || ""}

//                     />

//                     {props.userInfo.istimezoneshow === transactionStatus.YES &&
//                         <Col md={6}>
//                             <FormSelectSearch
//                                 name={"ntzcomplaintdate"}
//                                 formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
//                                 placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                                 options={props.TimeZoneList}
//                                 value={props.selectedRecord["ntzcomplaintdate"] || ""}
//                                 defaultValue={props.selectedRecord["ntzcomplaintdate"]}
//                                 isMandatory={false}
//                                 isMulti={false}
//                                 isSearchable={true}
//                                 isDisabled={false}
//                                 closeMenuOnSelect={true}
//                                 alphabeticalSort={true}
//                                 onChange={(event) => props.onComboChange(event, 'ntzcomplaintdate', 4)}
//                             />
//                         </Col>

//                     }
//                 </Col>
//             </Row>

//         </>
//     );
// };





// export default injectIntl(AddCustomerComplaintConfig);
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/Form-select-search-componnet';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddCustomerComplaintConfig = (props) => {
    const { selectedRecord, onInputOnChange, intl } = props;

    return (
        <>
            <Row>
                <Col md={6}>
                    {/* Received From */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_RECEIVEDFROM" })}
                        name="sreceivedfrom"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_RECEIVEDFROM" })}
                        value={selectedRecord.sreceivedfrom || ""}
                        isMandatory
                        required
                        maxLength={100}
                    />

                    {/* Complaint Details */}
                    <FormTextarea
                        label={intl.formatMessage({ id: "IDS_COMPLAINTDETAILS" })}
                        name="scomplaintdetails"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_COMPLAINTDETAILS" })}
                        value={selectedRecord.scomplaintdetails || ""}
                        required
                        maxLength={500}
                        isMandatory
                    />

                    {/* 1. State Laboratory */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_CENTRALSITE" })} // IDS modified y sujatha ATE_274 IDS should be equal as in sample location & scheduling
                        name="nstatelabcode"
                        isSearchable
                        placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory
                        isClearable={false}
                        options={props.stateList || []}
                        value={selectedRecord.nstatelabcode || null}
                        onChange={(e) => props.onComboChange(e, "nstatelabcode", 1)}
                        closeMenuOnSelect
                        isMulti={false}
                        isOptionDisabled={(option) => option.isDisabled}   // disable parent/current
                    />

                    {/* 2. Regional Laboratory */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_REGION" })} // IDS modified y sujatha ATE_274 IDS should be equal as in sample location & scheduling
                        name="nregionallabcode"
                        isSearchable
                        placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory
                        isClearable={false}
                        options={props.regionalList || []}
                        value={selectedRecord.nregionallabcode || null}
                        onChange={(e) => props.onComboChange(e, "nregionallabcode", 2)}
                        closeMenuOnSelect
                        isMulti={false}
                        isOptionDisabled={(option) => option.isDisabled}   //  disable parent/current
                    />

                    {/* 3. District Laboratory */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_DISTRICT" })}  // IDS modified y sujatha ATE_274 IDS should be equal as in sample location & scheduling
                        name="ndistrictlabcode"
                        isSearchable
                        placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory
                        isClearable={false}
                        options={props.districtList || []}
                        value={selectedRecord.ndistrictlabcode || null}
                        onChange={(e) => props.onComboChange(e, "ndistrictlabcode", 3)}
                        closeMenuOnSelect
                        isMulti={false}
                        isOptionDisabled={(option) => option.isDisabled}   //  disable parent/current
                    />

                    {/* 4. Sub Divisional Laboratory */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_TALUKA" })}  // IDS modified y sujatha ATE_274 IDS should be equal as in sample location & scheduling
                        name="nsubdivisionallabcode"
                        isSearchable
                        placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory
                        isClearable={false}
                        options={props.subDivisionalList || []}
                        value={selectedRecord.nsubdivisionallabcode || null}
                        onChange={(e) => props.onComboChange(e, "nsubdivisionallabcode", 4)}
                        closeMenuOnSelect
                        isMulti={false}
                        isOptionDisabled={(option) => option.isDisabled}   //  disable parent/current
                    />

                    {/* 5. Village */}
                    <FormSelectSearch
                        formLabel={intl.formatMessage({ id: "IDS_VILLAGE" })}
                        name="nvillagecode"
                        isSearchable
                        placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory
                        isClearable={false}
                        options={props.villageList || []}
                        value={selectedRecord.nvillagecode || null }
                        onChange={(e) => props.onComboChange(e, "nvillagecode", 5)}
                        closeMenuOnSelect
                        isMulti={false}
                        isOptionDisabled={(option) => option.isDisabled}   //  villages remain editable
                    />

            
                </Col>

                <Col md={6}>
                    {/* Location */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_LOCATION" })}
                        name="slocation"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_LOCATION" })}
                        value={selectedRecord.slocation || ""}
                        maxLength={150}
                        isMandatory
                    />

                    {/* Contact No */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_CONTACTNO" })}
                        name="scontactnumber"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_PHONENO" })}
                        value={selectedRecord.scontactnumber || ""}
                        required
                        maxLength={20}
                    />

                    {/* Email */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_EMAIL" })}
                        name="semail"
                        type="email"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_EMAIL" })}
                        value={selectedRecord.semail || ""}
                        required
                        maxLength={50}
                        isMandatory
                    />

                    {/* Latitude */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_LATITUDE" })}
                        name="slatitude"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_LATITUDE" })}
                        value={selectedRecord.slatitude || ""}
                        maxLength={15}
                    />

                    {/* Longitude */}
                    <FormInput
                        label={intl.formatMessage({ id: "IDS_LONGITUDE" })}
                        name="slongitude"
                        type="text"
                        onChange={onInputOnChange}
                        placeholder={intl.formatMessage({ id: "IDS_LONGITUDE" })}
                        value={selectedRecord.slongitude || ""}
                        maxLength={15}
                    />

                    {/* Complaint Date */}
                    <DateTimePicker
                        name="dcomplaintdate"
                        label={props.intl.formatMessage({ id: "IDS_RECEIVEDDATEWOTIME" })}
                        className='form-control'
                        placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                        selected={selectedRecord?.dcomplaintdate || new Date()}
                        dateFormat={props.userInfo.ssitedate}  //modified by sujatha ATE_274 for showing only date without time
                        isClearable={false}
                        isMandatory
                        required
						//commented by sujatha ATE_274 01-10-2025 for showing only date without time
                        // timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                        // showTimeInput
                        maxDate={props.currentTime}
                        onChange={date => props.handleDateChange("dcomplaintdate", date)}
                        value={selectedRecord.dcomplaintdate || ""}
                    />

                    {/* Timezone */}
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name="ntzcomplaintdate"
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={selectedRecord.ntzcomplaintdate || ""}
                                defaultValue={selectedRecord.ntzcomplaintdate}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable
                                isDisabled={false}
                                closeMenuOnSelect
                                alphabeticalSort
                                onChange={(event) => props.onComboChange(event, 'ntzcomplaintdate', 4)}
                            />
                        </Col>
                    }
                </Col>
            </Row>
        </>
    );
};

export default injectIntl(AddCustomerComplaintConfig);
