import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddRetrievalCertificate = (props) => {
    return (
        <Row>
            <Col md={6}>
                <Col md={12}>
                    <FormTextarea
                        label={props.formatMessage({ id: "IDS_BIOLOGICALMATERIALTYPE" })}
                        name={"sbiomaterialtype"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_BIOLOGICALMATERIALTYPE" })}
                        value={props.selectedRecord["sbiomaterialtype"]}
                        isMandatory={true}
                        required={true}
                        maxLength={255}

                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_REQUESTID" })}
                        name={"srequestid"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_REQUESTID" })}
                        value={props.selectedRecord["srequestid"]}
                        isMandatory={true}
                        required={true}
                        maxLength={30}

                    />
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_PROJECTTYPE" })}
                        isSearchable={true}
                        name={"nprojecttypecode"}
                        placeholder={props.formatMessage({ id: "IDS_PROJECTTYPE" })}
                        isMandatory={true}
                        options={props.projectTypeList}
                        optionId='nprojecttypecode'
                        optionValue='sprojecttypename'
                        value={props.selectedRecord["nprojecttypecode"]}
                        onChange={(event) => props.onComboChange(event, 'nprojecttypecode', 1)}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_PROJECTNAME" })}
                        isSearchable={true}
                        name={"nprojectmastercode"}
                        placeholder={props.formatMessage({ id: "IDS_PROJECTNAME" })}
                        isMandatory={true}
                        options={props.projectList}
                        optionId='nprojectmastercode'
                        optionValue='sprojectname'
                        value={props.selectedRecord["nprojectmastercode"]}
                        //defaultValue={props.selectedRecord["ncountrycode"]}
                        onChange={(event) => props.onComboChange(event, 'nprojectmastercode', 1)}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.formatMessage({ id: "IDS_INVESTIGATORNAME" })}
                        name={"sinvestigatorname"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_INVESTIGATORNAME" })}
                        value={props.selectedRecord["sinvestigatorname"]}
                        isMandatory={true}
                        required={true}
                        maxLength={50}
                        isDisabled={true}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                        name={"semail"}
                        type="email"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                        value={props.selectedRecord ? props.selectedRecord["semail"] : ""}
                        isMandatory={false}
                        required={false}
                        maxLength={50}
                    />
                </Col>
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                        name={"sphoneno"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PHONENO" })}
                        value={props.selectedRecord ? props.selectedRecord["sphoneno"] : ""}
                        isMandatory={false}
                        required={false}
                        maxLength={50}
                    />
                </Col>
            </Col>
            <Col md={6}>
                <Col md={12}>
                    <FormTextarea
                        name={"sorganizationaddress"}
                        label={props.intl.formatMessage({ id: "IDS_ORGANIZATIONADDRESS" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_ORGANIZATIONADDRESS" })}
                        value={props.selectedRecord["sorganizationaddress"]}
                        rows="2"
                        isMandatory={false}
                        required={false}
                        maxLength={255}
                        onChange={(event) => props.onInputOnChange(event)}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={props.formatMessage({ id: "IDS_PREPARATIONMETHOD" })}
                        name={"spreparationmethod"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_PREPARATIONMETHOD" })}
                        value={props.selectedRecord["spreparationmethod"]}
                        isMandatory={true}
                        required={true}
                        maxLength={255}

                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        label={props.formatMessage({ id: "IDS_TESTINGMETHOD" })}
                        name={"stestingmethod"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_TESTINGMETHOD" })}
                        value={props.selectedRecord["stestingmethod"]}
                        isMandatory={true}
                        required={true}
                        maxLength={255}

                    />
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_STORAGECONDITION" })}
                        isSearchable={true}
                        name={"nstorageconditioncode"}
                        placeholder={props.formatMessage({ id: "IDS_STORAGECONDITION" })}
                        isMandatory={true}
                        options={props.storageconditionList}
                        optionId='nstorageconditioncode'
                        optionValue='sstorageconditionname'
                        value={props.selectedRecord["nstorageconditioncode"]}
                        onChange={(event) => props.onComboChange(event, 'nstorageconditioncode', 2)}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                </Col>
                <Col md={12}>
                    <DateTimePicker
                        name={"dretrievalcertificatedate"}
                        label={props.intl.formatMessage({ id: "IDS_RETRIEVALCERTIFICATEDATE" })}
                        className='form-control'
                        placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                        dateFormat={props.userInfo.ssitedate}
                        isClearable={false}
                        isMandatory={true}
                        required={true}
                        maxDate={props.currentTime}
                        maxTime={props.currentTime}
                        onChange={date => props.handleDateChange("dretrievalcertificatedate", date)}
                        selected={props.selectedRecord ? props.selectedRecord["dretrievalcertificatedate"] : new Date()}
                        value={props.selectedRecord ? props.selectedRecord["dretrievalcertificatedate"] : new Date()}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        name={"scomment"}
                        label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        value={props.selectedRecord["scomment"]}
                        rows="2"
                        isMandatory={false}
                        required={false}
                        maxLength={255}
                        onChange={(event) => props.onInputOnChange(event)}
                    />
            </Col>
            </Col>
        </Row>
    )
}
export default injectIntl(AddRetrievalCertificate);
