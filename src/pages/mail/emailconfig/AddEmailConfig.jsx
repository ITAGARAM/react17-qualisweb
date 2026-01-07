import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Nav } from 'react-bootstrap';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { mailScheduleType, transactionStatus } from '../../../components/Enumeration';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../../../components/form-input/form-input.component';

const AddEmailConfig = (props) => {
    return (
        <Row>
            <Col md={6}>

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_HOSTNAME" })}
                    name={"nemailhostcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailhostcode"] ? props.selectedRecord["nemailhostcode"] : ""}
                    options={props.emailHost}
                    optionId="nemailhostcode"
                    optionValue="shostname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    // isDisabled={props.operation=== "update"? true : false}
                    onChange={(event) => props.onComboChange(event, "nemailhostcode")}
                />
           
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                    name={"nemailtemplatecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailtemplatecode"] ? props.selectedRecord["nemailtemplatecode"] : ""}
                    options={props.emailTemplate}
                    optionId="nemailtemplatecode"
                    optionValue="stemplatename"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailtemplatecode")}
                />
           
            {/* <Col md={12}>
            <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_ACTIONTYPE" })}
                            name={"ntranscode"} 
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={props.selectedRecord["nactiontype"] ? props.selectedRecord["nactiontype"] : ""}
                            options={props.actionType}
                            optionId="nactiontype"
                            optionValue="stransdisplaystatus"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            as={"select"}
                            onChange={(event) => props.onComboChange(event, "nactiontype")} 
                        />
            </Col> */}
            {/* <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FORMNAME" })}
                    name={"ntranscode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nformcode"] ? props.selectedRecord["nformcode"] : ""}
                    options={props.formName}
                    optionId="nformcode"
                    optionValue="sformname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nformcode")}
                />
            </Col> */}

                {/*Added by sonia on 03th Sept 2025 for jira id:SWSM-12*/}
                {/*commented by sonia on 04th Nov 2025 for jira id:BGSI-155*/}
                {/*<FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_MAILTYPE" })}
                    name={"nemailtypecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailtypecode"] ? props.selectedRecord["nemailtypecode"] : ""}
                    options={props.emailType}
                    optionId="nemailtypecode"
                    optionValue="semailtypename"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailtypecode")}
                />*/}
                {/*Added by sonia on 04th Nov 2025 for jira id:BGSI-155*/}
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_MAILTYPE" })}
                    name={"semailtypename"}
                    type="text"
                    placeholder={props.intl.formatMessage({ id: "IDS_MAILTYPE" })}
                    value={props.emailTypeValue["semailtypename"]}
                    required={true}
                    readOnly={true}
                    isDisabled={true}
                />
            </Col>

            {/* Added by Gowtham on 29th Oct 2025 */}
            <Col md={6}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SCREENNAME" })}
                    name={"nemailscreencode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailscreencode"] ? props.selectedRecord["nemailscreencode"] : ""}
                    options={props.emailScreen}
                    optionId="nemailscreencode"
                    optionValue="sscreenname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailscreencode")}
                />

                {/*Added by sonia on 04th Nov 2025 for jira id:BGSI-155*/}
                {props.emailTypeValue["nemailtypecode"]===mailScheduleType.CONTROL_BASED_MAIL ?
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_CONTROLNAME" })}
                    name={"ncontrolcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["ncontrolcode"] ? props.selectedRecord["ncontrolcode"] : ""}
                    options={props.formControls}
                    optionId="ncontrolcode"
                    optionValue="scontrolname"
                    isMandatory={props.emailTypeValue["nemailtypecode"]===mailScheduleType.CONTROL_BASED_MAIL ? true:false }
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ncontrolcode")}
                />:""}

                {props.emailTypeValue["nemailtypecode"]===mailScheduleType.SCHEDULE_BASED_MAIL ?
                <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_MAILSCREENSCHEDULER" })}
                        name={"nemailscreenschedulercode"}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        value={props.selectedRecord["nemailscreenschedulercode"] ? props.selectedRecord["nemailscreenschedulercode"] : ""}
                        options={props.emailScreenScheduler}
                        optionId="nemailscreenschedulercode"
                        optionValue="sscheduletypename"
                        isMandatory={props.emailTypeValue["nemailtypecode"]===mailScheduleType.SCHEDULE_BASED_MAIL ? true:false}
                        isMulti={false}
                        isSearchable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        as={"select"}
                        onChange={(event) => props.onComboChange(event, "nemailscreenschedulercode")}
                />:""}

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_EMAILQUERY" })}
                    name={"nemailuserquerycode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailuserquerycode"] ? props.selectedRecord["nemailuserquerycode"] : ""}
                    options={props.emailUserQuery}
                    optionId="nemailuserquerycode"
                    optionValue="squery"
                    isMandatory={true} //Modified by sonia on 18th Nov 2025 for jira id:BGSI-234
                    isMulti={false}
                    //isClearable={true}  //commented by sonia on 18th Nov 2025 for jira id:BGSI-234
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailuserquerycode")}
                />
            </Col>

            <Col md={2}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_MAILENABLE" })}
                    type="switch"
                    name={"nenableemail"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_MAILENABLE" })}
                    defaultValue={props.selectedRecord["nenableemail"] ? props.selectedRecord["nenableemail"] === transactionStatus.YES ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["nenableemail"] ? props.selectedRecord["nenableemail"] === transactionStatus.YES ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>

            <Col md={2}>
                {/*Added by Gowtham on 27th Sept 2025 for jira id:SWSM-64*/}
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_SMSENABLE" })}
                    type="switch"
                    name={"nenablesms"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SMSENABLE" })}
                    defaultValue={props.selectedRecord["nenablesms"] ? props.selectedRecord["nenablesms"] === transactionStatus.YES ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["nenablesms"] ? props.selectedRecord["nenablesms"] === transactionStatus.YES ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>

            {props.operation === 'create' ?
                <Row>
                    <Col md={6}>
                        {/* <FormMultiSelect
                            name={"nusercode"}
                            label={props.intl.formatMessage({ id: "IDS_USERS" })}
                            options={props.users || []}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                  
                            optionId="nusercode"
                            optionValue="semail"
                            value={props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] || [] :[]}
                            isMandatory={false}
                            isClearable={true}
                            disableSearch={false}
                            disabled={false}
                            closeMenuOnSelect={false}
                            alphabeticalSort={true}
                            onChange={(event) => props.onComboChange(event, "nusercode")}
                        /> */}
                        <Nav.Link className="add-txt-btn text-right" 
                            onClick={() => props.addUserRole()} >
                            <FontAwesomeIcon icon={faPlus} />
                            <FormattedMessage id='IDS_USERROLE' />
                        </Nav.Link>
                        <DataGrid
                            key="nuserrolecode"
                            primaryKeyField="nuserrolecode"
                            selectedId={props.selectedUserRole ? props.selectedUserRole.nuserrolecode : null}
                            data={props.userRole}
                            dataResult={process(props.userRole || [], props.dataStateUserRole)}
                            dataState={props.dataStateUserRole}
                            dataStateChange={props.dataStateUserRoleChange}
                            extractedColumnList={[{ idsName: "IDS_USERROLE", dataField: "suserrolename", width: "150px" }]}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            hasControlWithOutRights={true}
                            userInfo={props.userInfo}
                            pageable={true}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            handleRowClick={props.userRoleClick}
                            gridHeight={"450px"}
                            deleteRecordWORights={props.deleteUserRole}
                            showdeleteRecordWORights={true}
                            showeditRecordWORights={false}
                        />
                    </Col>

                    {/* Added by Gowtham on 29th Oct 2025 */}
                    <Col md={6}>
                        <Nav.Link className="add-txt-btn text-right" 
                            onClick={() => props.addUsers()} >
                            <FontAwesomeIcon icon={faPlus} />
                            <FormattedMessage id='IDS_USER' />
                        </Nav.Link>
                        <DataGrid
                            key="nusercode"
                            primaryKeyField="nusercode"
                            selectedId={props.selectedUser ? props.selectedUser.nusercode : null}
                            data={props.users}
                            dataResult={process(props.users || [], props.dataStateUsers)}
                            dataState={props.dataStateUsers}
                            dataStateChange={props.dataStateUsersChange}
                            extractedColumnList={[{ idsName: "IDS_USER", dataField: "semail", width: "150px" }]}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            hasControlWithOutRights={true}
                            userInfo={props.userInfo}
                            pageable={true}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            gridHeight={"450px"}
                            deleteRecordWORights={props.deleteUser}
                            showdeleteRecordWORights={true}
                            showeditRecordWORights={false}
                        />
                    </Col>
                </Row>
                
                : ""}

        </Row>
    );
};

export default injectIntl(AddEmailConfig);