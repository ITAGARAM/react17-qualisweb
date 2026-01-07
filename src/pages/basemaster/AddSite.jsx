import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';


const AddSite = (props) => {
    return (
        <Row>

            <Col md={6}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SITE" })}
                    name={"ssitename"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event,"ssitecode",props.sitecodemaxlength)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SITE" })}
                    value={props.selectedRecord ? props.selectedRecord["ssitename"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={"100"}
                />
                {/* </Col>
           
           
          {/*   <Col md={12}> */}

                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SITECODE" })}
                    name={"ssitecode"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SITECODE" })}
                    value={props.selectedRecord ? props.selectedRecord["ssitecode"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={props.sitecodemaxlength}
                />


                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_SITEADDRESS" })}
                    name={"ssiteaddress"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SITEADDRESS" })}
                    value={props.selectedRecord["ssiteaddress"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                />
                {/* </Col>
            <Col md={12}> */}
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_SCONTACTPERSON" })}
                    name={"scontactperson"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SCONTACTPERSON" })}
                    value={props.selectedRecord ? props.selectedRecord["scontactperson"] : ""}
                    rows="3"
                    isMandatory={false}
                    required={false}
                    maxLength={"100"}
                >
                </FormInput>


            </Col>
            <Col md={6}>
                <FormInput
                    name={"sphoneno"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                    value={props.selectedRecord["sphoneno"]}
                    isMandatory={false}
                    required={false}
                    maxLength={20} // modified by sujatha for BGSI-258
                    onChange={(event) => props.onInputOnChange(event)}

                />

                {/* </Col>
            <Col md={12}> */}
                <FormInput
                    name={"sfaxno"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_FAXNO" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_FAXNO" })}
                    value={props.selectedRecord["sfaxno"]}
                    isMandatory={false}
                    required={true}
                    maxLength={20}  // modified by sujatha for BGSI-258
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
                    isMandatory={false}
                    required={true}
                    maxLength={50}
                    onChange={(event) => props.onInputOnChange(event)}
                //onBlur={(event)=>props.validateEmail(event, props.emailRef)}                            
                />



                <FormSelectSearch
                    name={"nsitetypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SITETYPE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.siteTypeList}
                    value={props.selectedRecord["nsitetypecode"]}
                    defaultValue={props.selectedRecord["nsitetypecode"]}
                    isMandatory={false}
                    isMulti={false}
                    isClearable={true}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    onChange={(event) => props.onComboChange(event, 'nsitetypecode', 1)}
                />

            </Col>

            <Col md={4}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    type="switch"
                    name={"ndefaultstatus"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                    defaultValue={props.selectedRecord["ndefaultstatus"] === 3 ? true : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                />
            </Col>
            {props.siteAdditionalInfo === transactionStatus.YES ?
                <Col md={4}>
                    <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_NEEDDISTRIBUTED" })}
                        type="switch"
                        name={"nisstandaloneserver"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_NEEDDISTRIBUTED" })}
                        defaultValue={props.selectedRecord["nisstandaloneserver"] === 3 ? true : false}
                        isMandatory={false}
                        required={false}
                        disabled={props.selectedRecord["nissyncserver"] === 3 ? true : false}
                        checked={props.selectedRecord ? props.selectedRecord["nisstandaloneserver"] === 3 ? true : false : false}
                    />
                </Col>
                : ""}
            {props.siteAdditionalInfo === transactionStatus.YES ?
                <Col md={4}>
                    <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_PRIMAEYSERVER" })}
                        type="switch"
                        name={"nissyncserver"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PRIMAEYSERVER" })}
                        defaultValue={props.selectedRecord["nissyncserver"] === 3 ? true : false}
                        isMandatory={false}
                        required={false}
                        disabled={props.selectedRecord["nisstandaloneserver"] === 3 ? true : false}
                        checked={props.selectedRecord ? props.selectedRecord["nissyncserver"] === 3 ? true : false : false}
                    />
                </Col>
                : ""}
            {/* <Col md={4}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_NEEDUTCCONVERSATION" })}
                    type="switch"
                    name={"nutcconversation"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_NEEDUTCCONVERSATION" })}
                    defaultValue={props.selectedRecord["nutcconversation"] === 3 ? true : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord ? props.selectedRecord["nutcconversation"] === 3 ? true : false : false}
                />

            </Col> */}
            {props.siteAdditionalInfo === transactionStatus.YES ?
                <Col md={12}>
                    {/* <div className="horizontal-line"></div> */}
                    <FormSelectSearch
                        name={"nregioncode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_REGIONNAME" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.regionList}
                        value={props.selectedRecord["nregioncode"]}
                        isMandatory={false}
                        required={true}
                        isClearable={true}
                        isMulti={false}
                        isSearchable={false}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'nregioncode')}
                    />
                    <FormSelectSearch
                        name={"ndistrictcode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_DISTRICTNAME" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.selectedRecord["nregioncode"] ? props.districtList : []}
                        value={props.selectedRecord["ndistrictcode"] || []}
                        isMandatory={false}
                        required={true}
                        isClearable={true}
                        isMulti={false}
                        isSearchable={false}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'ndistrictcode')}
                    />

                    {/* <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_NEEDDISTRIBUTED" })}
                        type="switch"
                        name={"nisdistributed"}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_NEEDDISTRIBUTED" })}
                        defaultValue={props.selectedRecord["nisdistributed"] === 3 ? true : false}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord ? props.selectedRecord["nisdistributed"] === 3 ? true : false : false}
                    /> */}
                </Col>
                : ""}
            {/* {props.NeedUTCConversation === transactionStatus.YES ? */}

                <Col md={12}>
                    {/* <div className="horizontal-line"></div> */}

                    <FormSelectSearch
                        name={"ntimezonecode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntimezonecode"]}
                        defaultValue={props.selectedRecord["ntimezonecode"]}
                        isMandatory={true}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntimezonecode', 1)}
                    />

                     <FormSelectSearch
                        name={"ninputtimezonecode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_INPUTTIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ninputtimezonecode"]}
                        defaultValue={props.selectedRecord["ninputtimezonecode"]}
                        isMandatory={true}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ninputtimezonecode', 1)}
                    />

                    <FormSelectSearch
                        name={"ndateformatcode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_SITEDATE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.dateFormatList}
                        value={props.selectedRecord["ndateformatcode"]}
                        defaultValue={props.selectedRecord["ndateformatcode"]}
                        isMandatory={true}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ndateformatcode', 1)}
                    />
                </Col> 
                {/* : ""} */}

        </Row>
    )
}
export default injectIntl(AddSite);