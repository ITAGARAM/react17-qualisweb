import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { injectIntl } from 'react-intl';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { transactionStatus } from '../../components/Enumeration';
import ReactSelectAddEdit from '../../components/react-select-add-edit/react-select-add-edit-component'



const AddInstrument = (props) => {
    return (
        <Row>
            <Col md={4}>

                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                            isSearchable={true}
                            name={"ninstrumentcatcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.InstrumentCategory}
                            value={props.selectedRecord["ninstrumentcatcode"] || ""}
                            defaultValue={props.selectedRecord["ninstrumentcatcode"]}
                            onChange={(event) => props.onComboChange(event, "ninstrumentcatcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                            name={"sinstrumentid"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstrumentid"] : ""}
                            //isMandatory = {true} //Commented by sonia on 04th Mar 2025 for  jira id:ALPD-5504
                            isMandatory={props.operation ==='update' ? false : parseInt(props.settings[78])!==transactionStatus.YES ? true:false}
                            required={true}
                            maxLength={"100"}   
                            //Added by sonia on 04th Mar 2025 for  jira id:ALPD-5504                 
                            readOnly={props.operation ==='update' ? true : parseInt(props.settings[78])===transactionStatus.YES ? true:false}
                            isDisabled={props.operation ==='update' ? true : parseInt(props.settings[78])===transactionStatus.YES ? true:false}
                        />
                    </Col>

                    <Col md={12}>
                        <ReactSelectAddEdit
                            name="ninstrumentnamecode"
                            label={props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            className="color-select"
                            classNamePrefix="react-select"
                            optionId="ninstrumentnamecode"
                            optionValue="sinstrumentname"
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            options={props.InstrumentName || []}
                            isMandatory={true}
                            getValue={value => props.onComboChange(value, "ninstrumentnamecode", 1)}
                            value={props.selectedRecord["ninstrumentnamecode"] ? props.selectedRecord["ninstrumentnamecode"] : ""}
                            displayNameSearch={props.intl.formatMessage({ id: "IDS_SEARCH" })}

                        // defaultValue={props.selectedRecord? props.selectedRecord["sparametername"]:""}
                        />
                        {/* <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            name={"sinstrumentname"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstrumentname"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        /> */}
                    </Col>


                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SUPPLIER" })}
                            isSearchable={true}
                            name={"nsuppliercode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.Supplier}  
                            isMulti={false}
                            value={props.selectedRecord["nsuppliercode"] || ""}
                            defaultValue={props.selectedRecord["nsuppliercode"]}
                            onChange={(event) => props.onComboChange(event, "nsuppliercode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    

                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SERIALNO" })}
                            name={"sserialno"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SERIALNO" })}
                            value={props.selectedRecord ? props.selectedRecord["sserialno"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"50"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_MANUFACTURENAME" })}
                            isSearchable={true}
                            name={"nmanufcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={false}
                            options={props.Manufacturer}
                            value={props.selectedRecord["nmanufcode"] || ""}
                            defaultValue={props.selectedRecord["nmanufcode"]}
                            onChange={(event) => props.onComboChange(event, "nmanufcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dmanufacdate"}
                            label={props.intl.formatMessage({ id: "IDS_MANUFACTURERDATEWOTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dmanufacdate"]}
                            dateFormat={props.userInfo.ssitedate}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dmanufacdate", date)}
                            value={props.selectedRecord["dmanufacdate"]}




                        //      name={"dmanufacdate"} 
                        //      label={ props.intl.formatMessage({ id:"IDS_MANUFACTURERDATE"})}                     
                        //      className='form-control'
                        //      placeholderText="Select date.."
                        //      selected={props.selectedRecord["dmanufacdate"]}
                        //      dateFormat={props.userInfo.ssitedate }
                        //      isClearable={false}
                        //      timeInputLabel=  {props.intl.formatMessage({ id:"IDS_TIME"})}
                        //      showTimeInput={true}
                        //      maxTime={props.currentTime}
                        //    //  minTime={props.manuDate}
                        //      onChange={date => props.handleDateChange("dmanufacdate", date)}
                        //      value={props.selectedRecord["dmanufacdate"]}

                        />
                    </Col>
                    

                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzgoodsindate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzmanufdate"] || ""}
                                //value = { props.selectedRecord["ntztimezoneid"] }
                                defaultValue={props.selectedRecord["ntzmanufdate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                //isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzmanufdate', 1)}
                            />
                        </Col>
                    }
                   
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzpodate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                optionId="ntimezonecode"
                                optionValue="stimezoneid"
                                value={props.selectedRecord["ntzpodate"] || ""}
                                defaultValue={props.selectedRecord["ntzpodate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzpodate', 1)}
                            />
                        </Col>
                    }
                      
                      <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_PONO" })}
                            name={"spono"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PONO" })}
                            value={props.selectedRecord ? props.selectedRecord["spono"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"50"}
                        />
                    </Col>

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dpodate"}
                            label={props.intl.formatMessage({ id: "IDS_PODATEWOTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dpodate"]}
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            //  maxTime={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dpodate", date)}
                            value={props.selectedRecord["dpodate"]}

                        />
                    </Col>
                   
                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dreceiveddate"}
                            label={props.intl.formatMessage({ id: "IDS_RECEIVEDDATEWOTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dreceiveddate"]}
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            //  maxTime={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dreceiveddate", date)}
                            value={props.selectedRecord["dreceiveddate"] || ""}

                        />
                    </Col>

                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzreceivedate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzreceivedate"] || ""}
                                defaultValue={props.selectedRecord["ntzreceivedate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzreceivedate', 1)}
                            />
                        </Col>
                    }
                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dinstallationdate"}
                            label={props.intl.formatMessage({ id: "IDS_INSTALLATIONDATEWOTIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dinstallationdate"]}
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            //  maxTime={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dinstallationdate", date)}
                            value={props.selectedRecord["dinstallationdate"] || ""}

                        />
                    </Col>
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzinstallationdate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzinstallationdate"] || ""}
                                defaultValue={props.selectedRecord["ntzinstallationdate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzinstallationdate', 1)}
                            />
                        </Col>
                    }

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dexpirydate"}
                            label={props.intl.formatMessage({ id: "IDS_WARRANTYEXPIRY" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dexpirydate"]}
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={true}
                            required={true}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            maxTime={props.expiryDate}
                            isMandatory={false}
                            // minTime={props.expiryDate}
                            onChange={date => props.handleDateChange("dexpirydate", date)}
                            value={props.selectedRecord["dexpirydate"] || ""}
                        />
                    </Col>
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzexpirydate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzexpirydate"] || ""}
                                defaultValue={props.selectedRecord["ntzexpirydate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzexpirydate', 1)}
                            />
                        </Col>
                    }

                            
<Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                        <DateTimePicker
                            name={"dservicedate"}
                            label={props.intl.formatMessage({ id: "IDS_SERVICEDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dservicedate"]}
                            dateFormat={props.userInfo.ssitedate}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={true}
                            isMandatory={false}
                            required={false}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dservicedate", date)}
                            value={props.selectedRecord["dservicedate"]} />
                    </Col>
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzservicedate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                optionId="ntimezonecode"
                                optionValue="stimezoneid"
                                value={props.selectedRecord["ntzservicedate"] || ""}
                                defaultValue={props.selectedRecord["ntzservicedate"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzservicedate', 1)}
                            />
                        </Col>
                    }
                  

                   
                    {/* <FormInput
                            label={props.intl.formatMessage({ id: "IDS_NEXTCALIBRATION" })}
                            name={"nnextcalibration"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_NEXTCALIBRATION" })}
                            value={props.selectedRecord ? props.selectedRecord["nnextcalibration"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        /> */}
                    
                   
                </Row>
            </Col>
            

            <Col md={4}>
                <Row>
                {props.CalibrationRequired === transactionStatus.YES ?
                        <Col md={6}>

                            <FormNumericInput
                                name="nnextcalibration"
                                label={props.intl.formatMessage({ id: "IDS_CALIBRATIONINTERVAL" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_CALIBRATIONINTERVAL" })}
                                type="number"
                                value={props.selectedRecord["nnextcalibration"]}
                                max={99}
                                min={1}
                                strict={true}
                                maxLength={3}
                                onChange={(event) => props.onInputOnChange(event, 1, "nnextcalibration")}
                                noStyle={true}
                                precision={0}
                                className="form-control"

                                isMandatory={true}
                                errors="Please provide a valid number."
                            />
                        </Col>
                        : ""}
                    {props.CalibrationRequired === transactionStatus.YES ?
                        <Col md={6}>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                                isSearchable={true}
                                name={"nperiodcode"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={true}
                                required={false}
                                isMulti={false}
                                options={props.Period}
                                value={props.selectedRecord["nnextcalibrationperiod"] || ""}
                                defaultValue={props.selectedRecord["nnextcalibrationperiod"]}
                                onChange={(event) => props.onComboChange(event, "nnextcalibrationperiod", 1)}
                                closeMenuOnSelect={true}
                            >
                            </FormSelectSearch>


                        </Col>
                        : ""}
	                   {/* added by sujatha ALPDJ21-21  */}
                        {/*  */}

                        <Col md={6}>

                            <FormNumericInput
                                name="nnextmaintenance"
                                label={props.intl.formatMessage({ id: "IDS_MAINTENANCEINTERVAL" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_MAINTENANCEINTERVAL" })}
                                type="number"
                                value={props.selectedRecord["nnextmaintenance"]}
                                max={99}
                                min={1}
                                strict={true}
                                maxLength={3}
                                onChange={(event) => props.onInputOnChange(event, 1, "nnextmaintenance")}
                                noStyle={true}
                                precision={0}
                                className="form-control"
                                isMandatory={true}
                                errors="Please provide a valid number."
                            />
                        </Col>
	                    {/* added by sujatha ALPDJ21-21  */}
                        <Col md={6}>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                                isSearchable={true}
                                name={"nperiodcode"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={true}
                                required={false}
                                isMulti={false}
                                options={props.Period}
                                value={props.selectedRecord["nnextmaintenanceperiod"] || ""}
                                defaultValue={props.selectedRecord["nnextmaintenanceperiod"]}
                                onChange={(event) => props.onComboChange(event, "nnextmaintenanceperiod", 1)}
                                closeMenuOnSelect={true}
                            >
                            </FormSelectSearch>
                        </Col>
                        {/*  */}
                <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MODELNO" })}
                            name={"smodelnumber"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MODELNO" })}
                            value={props.selectedRecord ? props.selectedRecord["smodelnumber"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"100"}
                        />
                    </Col>
                  


                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SERVICEBY" })}
                            isSearchable={true}
                            name={"nservicecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Supplier}
                            value={props.selectedRecord["nservicecode"] || ""}
                            defaultValue={props.selectedRecord["nservicecode"]}
                            onChange={(event) => props.onComboChange(event, "nservicecode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTAVAILABLESITE" })}
                            isSearchable={true}
                            name={"nregionalsitecode"}
                            //isDisabled={props.validateOpenDate === false ? false : true}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Site}
                            value={props.selectedRecord["nregionalsitecode"] || ""}
                            defaultValue={props.selectedRecord["nregionalsitecode"]}
                            onChange={(event) => props.onComboChange(event, "nregionalsitecode", 1)}
                            closeMenuOnSelect={true}
                        />
                    </Col>

                      <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTLOCATION" })}
                            isSearchable={true}
                            name={"ninstrumentlocationcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.InstrumentLocation}
                            isMulti={false}
                            value={props.selectedRecord["ninstrumentlocationcode"] || ""}
                            defaultValue={props.selectedRecord["ninstrumentlocationcode"]}
                            onChange={(event) => props.onComboChange(event, "ninstrumentlocationcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    {props.operation === "create" &&
                        <>
                            <Col md={12}>
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                                    isSearchable={false}
                                    name={"nsectioncode"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    isMulti={false}

                                    //  required={true}
                                    isClearable={true}
                                    options={props.Lab || ""}
                                    disableSearch={false}
                                    value={props.selectedRecord["nsectioncode"] || ""}
                                    defaultValue={props.selectedRecord["nsectioncode"] || ""}
                                    onChange={(event) => props.onComboChange(event, "nsectioncode", 2)}
                                // closeMenuOnSelect={true}

                                />
                            </Col>
                            <Col md={12}>
                                <FormMultiSelect
                                    label={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                                    isSearchable={true}
                                    name={"nusercode"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={props.selectedRecord["nsectioncode"] ? true : false}
                                    isClearable={false}
                                    options={props.selectedRecord["nsectioncode"] ? props.SectionUsers || [] : []}
                                    optionId='nusercode'
                                    optionValue='susername'
                                    disableSearch={false}
                                    value={props.selectedRecord["nusercode"] || []}
                                    //defaultValue={props.selectedRecord["SectionUsers"]}
                                    onChange={(event) => props.onComboChange(event, "nusercode", 1)}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                />
                            </Col>


                            <Col md={12}>
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_VALIDATIONSTATUS" })}
                                    isSearchable={false}
                                    name={"validation"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isMulti={false}
                                    isClearable={false}
                                    options={props.ValidationStatus || ""}
                                    disableSearch={false}
                                    value={props.selectedRecord["validation"] || ""}
                                    defaultValue={props.selectedRecord["validation"] || ""}
                                    onChange={(event) => props.onComboChange(event, "validation", 1)}

                                />
                            </Col>
                            {props.CalibrationRequired === transactionStatus.YES ?
                                <Col md={12}>
                                    <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_CALIBRATIONSTATUS" })}
                                        isSearchable={false}
                                        name={"calibration"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isMulti={false}
                                        isClearable={false}
                                        options={props.CalibrationStatus || ""}
                                        disableSearch={false}
                                        value={props.selectedRecord["calibration"] || ""}
                                        defaultValue={props.selectedRecord["calibration"] || ""}
                                        onChange={(event) => props.onComboChange(event, "calibration", 1)}

                                    />
                                </Col>
                                : ""}

                            <Col md={12}>
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_MAINTENANCESTATUS" })}
                                    isSearchable={false}
                                    name={"maintenance"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={props.MaintenanceStatus || ""}
                                    disableSearch={false}
                                    value={props.selectedRecord["maintenance"] || ""}
                                    defaultValue={props.selectedRecord["maintenance"] || ""}
                                    onChange={(event) => props.onComboChange(event, "maintenance", 1)}

                                />
                            </Col>
                        </>
                        //  :  
                        //                 <Col md={12}>
                        //                 <FormSelectSearch
                        //                 formLabel={props.intl.formatMessage({ id: "IDS_LAB" })}
                        //                 isSearchable={true}
                        //                 name={"nsectioncode"}
                        //                 isDisabled={true}
                        //                 placeholder="Please Select..."
                        //                 isMandatory={true}
                        //                 isClearable={false}
                        //                 options={props.Lab}
                        //                 optionId='nsectioncode'
                        //                 optionValue='ssectionname'
                        //                 disableSearch={true}    
                        //                 value = { props.selectedRecord["nsectioncode"] }
                        //                 defaultValue={props.selectedRecord["nsectioncode"]}
                        //                 onChange={(event)=>props.onComboChange(event, "nsectioncode",2)}
                        //                 closeMenuOnSelect={true}
                        //                 alphabeticalSort={true}

                        //             />
                        // </Col>


                    }

                    {/* 
 { props.SectionUsers  &&
            <Col md={12}>
            <FormMultiSelect
                    label={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                    isSearchable={true}
                    name={"nusercode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={true}
                    isClearable={false}
                    options={props.SectionUsers || []}
                    optionId='nusercode'
                    optionValue='susername'
                    disableSearch={false}    
                    value = { props.selectedRecord["nusercode"] }
                    //defaultValue={props.selectedRecord["SectionUsers"]}
                    onChange={(event)=>props.onComboChange(event, "nusercode",1)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}                    
            />
         </Col>
    }

        { props.operation ==="update" &&
            <Col md={12}>
            <FormMultiSelect
                    label={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                    isSearchable={true}
                    name={"nusercode"}
                    isDisabled={true}
                    placeholder="Please Select..."
                    isMandatory={true}
                    isClearable={false}
                    options={props.SectionUsers || []}
                    optionId='nusercode'
                    optionValue='susername'
                    disableSearch={false}    
                   // value = { props.selectedRecord["susername"] }
                    defaultValue={props.selectedRecord["susername"]}
                    //onChange={(event)=>props.onComboChange(event, "nusercode",1)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}                    
            />
         </Col>
} */}



                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTSTATUS" })}
                            isSearchable={true}
                            name={"ntranscode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.InstrumentStatus}
                            value={props.selectedRecord["ntranscode"] || ""}
                            defaultValue={props.selectedRecord["ntranscode"]}
                            onChange={(event) => props.onComboChange(event, "ntranscode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                 
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            name={"sremarks"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={props.selectedRecord ? props.selectedRecord["sremarks"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MOVEMENT" })}
                            name={"smovement"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MOVEMENT" })}
                            value={props.selectedRecord ? props.selectedRecord["smovement"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"50"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_ASSOCIATEDDOCUMENT" })}
                            name={"sassociateddocument"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_ASSOCIATEDDOCUMENT" })}
                            value={props.selectedRecord ? props.selectedRecord["sassociateddocument"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"1000"}
                        >
                        </FormTextarea>
                    </Col>
                    
                 

                    {/* <Col md={6}>
                <FormNumericInput
                    label={props.intl.formatMessage({ id: "IDS_WINDOW" }).concat(  "(+)" )}
                    name={"nwindowsperiodplus"}
                    type="number"
                    onChange={(event) => props.onNumericInputOnChange(event,"nwindowsperiodplus")}
                    placeholder={props.intl.formatMessage({ id: "IDS_WINDOW" })}
                    value={ props.selectedRecord["nwindowsperiodplus"] }
                    isMandatory={false}
                    required={true}
                    noStyle={true}
                    className="form-control"
                    maxLength={10}
                    strict={true}
                />
            </Col>
            <Col md={6}>
                <FormSelectSearch
                   // formLabel={props.intl.formatMessage({ id: "IDS_WINDOWPERIOD" })}
                    isSearchable={true}
                    name={"nperiodcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={false}
                    options={props.Period}
                    value = { props.selectedRecord["nwindowsperiodplusunit"] || ""}
                    defaultValue={props.selectedRecord["nwindowsperiodplusunit"]}
                    onChange={(event)=>props.onComboChange(event, "nwindowsperiodplusunit",1)}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col>

            <Col md={6}>
                <FormNumericInput
                    label={props.intl.formatMessage({ id: "IDS_WINDOW" }).concat(  "(-)" )}
                    name={"nwindowsperiodminus"}
                    type="number"
                    onChange={(event) => props.onNumericInputOnChange(event,"nwindowsperiodminus")}
                    placeholder={props.intl.formatMessage({ id: "IDS_WINDOW" })}
                    value={props.selectedRecord["nwindowsperiodminus"]}
                    isMandatory={false}
                    required={true}
                    noStyle={true}
                    className="form-control"
                    maxLength={10}
                    strict={true}
                />
            </Col>
            <Col md={6}>
                <FormSelectSearch
                   // formLabel={props.intl.formatMessage({ id: "IDS_WINDOWPERIOD" })}
                    isSearchable={true}
                    name={"nperiodcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    isClearable={false}
                    options={props.Period}
                    value = { props.selectedRecord["nwindowsperiodminusunit"] || ""}
                    defaultValue={props.selectedRecord["nwindowsperiodminusunit"]}
                    onChange={(event)=>props.onComboChange(event, "nwindowsperiodminusunit",1)}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col> */}


                  

                    {/* <Col md={4}>
                <FormInput
                    //label={props.intl.formatMessage({ id: "IDS_PONO" })}
                    name={"spono"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                   // placeholder={props.intl.formatMessage({ id: "IDS_PONO" })}
                    value={props.selectedRecord ? props.selectedRecord["spono"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>

            <Col md={4}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_LAB" })}
                    isSearchable={true}
                    name={"nlabcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id:"IDS_LAB"})}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Lab}
                    optionId='nlabcode'
                    optionValue='slabname'
                    // defaultValue={props.selectedRecord ? props.selectedRecord["nofficialmanufcode"]:""}
                    defaultValue={props.defaultValue ? props.defaultValue:""}
                    onChange={(event)=>props.onComboChange(event, "nlabcode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col> */}
                </Row>
            </Col>
            

<Col md={4}>
    <Row>

        
    <Col md={12}>


<FormNumericInput
    name="npurchasecost"
    label={props.intl.formatMessage({ id: "IDS_PURCHASECOST" })}
    placeholder={props.intl.formatMessage({ id: "IDS_PURCHASECOST" })}
    type="number"
    value={props.selectedRecord["npurchasecost"]}
    min={0}
    strict={true}
    maxLength={11}
    onChange={(event) => props.onInputOnChange(event, 1, "npurchasecost")}
    noStyle={true}
    precision={2}
    className="form-control"
    isMandatory={false}
    errors="Please provide a valid number."
/>
</Col>
 
   

 
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            name={"sdescription"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sdescription"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>

                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_SOFTWAREINFORMATION" })}
                            name={"ssoftwareinformation"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SOFTWAREINFORMATION" })}
                            value={props.selectedRecord ? props.selectedRecord["ssoftwareinformation"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_PERFORMNACECAPABILITIES" })}
                            name={"sperformancecapabilities"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PERFORMNACECAPABILITIES" })}
                            value={props.selectedRecord ? props.selectedRecord["sperformancecapabilities"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_ACCEPTANCECRETERIA" })}
                            name={"sacceptancecriteria"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_ACCEPTANCECRETERIA" })}
                            value={props.selectedRecord ? props.selectedRecord["sacceptancecriteria"] : ""}
                            rows="2"
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        >
                        </FormTextarea>
                    </Col>
                    <Col md={12}>
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                            type="switch"
                            name={"ndefaultstatus"}
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                        />
                    </Col>
                    
    </Row>
</Col>
        </Row>

    );
}
export default injectIntl(AddInstrument);