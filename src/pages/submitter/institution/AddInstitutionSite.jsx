import React from 'react';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';




const AddInstitutionSite = (props) => {
    return (
        <Row>
            <Col md={6}>
                <Row>                   
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                            name={"sinstitutionsitename"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstitutionsitename"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormTextarea
                            label={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITEADDRESS" })}
                            name={"sinstitutionsiteaddress"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITEADDRESS" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstitutionsiteaddress"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"255"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_REGIONNAME" })}
                            isSearchable={true}
                            name={"nregioncode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Region}
                            value = { props.selectedRecord["nregioncode"] || "" }
                            defaultValue={props.selectedRecord["nregioncode"]}
                            onChange={(event)=>props.onComboChange(event, "nregioncode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            name={"sregioncode"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_REGIONCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_REGIONCODE" })}
                            value={props.selectedRecord["sregioncode"]}
                            isMandatory={false}
                            required={false}
                            readOnly
                        />   

                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_DISTRICTNAME" })}
                            isSearchable={true}
                            name={"ndistrictcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.districtList}
                            value = { props.selectedRecord["ndistrictcode"] || "" }
                            defaultValue={props.selectedRecord["ndistrictcode"]}
                            onChange={(event)=>props.onComboChange(event, "ndistrictcode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            name={"sdistrictcode"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_DISTRICTCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_DISTRICTCODE" })}
                            value={props.selectedRecord["sdistrictcode"]}
                            isMandatory={false}
                            required={false}
                            readOnly
                        />   

                    </Col>
                    {/* <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CITY" })}
                            isSearchable={true}
                            name={"ncitycode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.cityList}
                            value = { props.selectedRecord["ncitycode"] || "" }
                            defaultValue={props.selectedRecord["ncitycode"]}
                            onChange={(event)=>props.onComboChange(event, "ncitycode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col> */}
                    <Col md={12}>
                    <FormInput
                         name={"scityname"}
                         type="text"
                         label={props.intl.formatMessage({ id: "IDS_CITY" })}
                         placeholder={props.intl.formatMessage({ id: "IDS_CITY" })}
                         value={props.selectedRecord && props.selectedRecord["scityname"] !== "null" ? props.selectedRecord["scityname"] : ""}
                         isMandatory={true}
                         required={true}
                         maxLength={50}
                         onChange={(event) => props.onInputOnChange(event)}
                    />
                       </Col>
                    {/* <Col md={12}>
                        <FormInput
                            name={"scitycode"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_CITYCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_CITYCODE" })}
                            value={props.selectedRecord["scitycode"]}
                            isMandatory={true}
                            required={false}
                            maxLength={50}
                            //readOnly
                        />   

                    </Col> */}
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_ZIPCODE" })}
                            name={"szipcode"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_ZIPCODE" })}
                            value={props.selectedRecord ? props.selectedRecord["szipcode"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"20"}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_STATE" })}
                            name={"sstate"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_STATE" })}
                            value={props.selectedRecord ? props.selectedRecord["sstate"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                        />
                    </Col>
                </Row>
            </Col> 
            <Col md={6}>
                <Row>       
                    
                    
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                            isSearchable={true}
                            name={"ncountrycode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_COUNTRY" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Country}
                            value = { props.selectedRecord["ncountrycode"] || "" }
                            defaultValue={props.selectedRecord["ncountrycode"]}
                            onChange={(event)=>props.onComboChange(event, "ncountrycode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_LIMSSITE" })}
                            isSearchable={true}
                            name={"nsitecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Site}
                            value = { props.selectedRecord["nsitecode"] || "" }
                            defaultValue={props.selectedRecord["nsitecode"]}
                            onChange={(event)=>props.onComboChange(event, "nsitecode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col> 
                    <Col md={12}>
                        <FormInput
                            name={"ssitecode"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_LIMSSITECODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_LIMSSITECODE" })}
                            value={props.selectedRecord["ssitecode"]||""}
                            isMandatory={false}
                            required={false}
                            readOnly
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
                            label={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                            name={"semail"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_EMAIL" })}
                            value={props.selectedRecord ? props.selectedRecord["semail"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                        />
                    </Col>
                    <Col md={12}>
                    <FormInput
                            label={props.intl.formatMessage({ id: "IDS_WEBSITE" })}
                            name={"swebsite"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_WEBSITE" })}
                            value={props.selectedRecord ? props.selectedRecord["swebsite"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                        />
                    </Col>  
                </Row>
             </Col>   
         </Row>   
        
            
                

                
        
    );
}

export default injectIntl(AddInstitutionSite);