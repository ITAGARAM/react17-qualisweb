import React from 'react';
import { Row, Col, Card, Tab, Nav,FormGroup, FormLabel } from 'react-bootstrap';
import {injectIntl, FormattedMessage } from 'react-intl';
import FormInput from '../../../components/form-input/form-input.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component'
import { ApprovalSubType, transactionStatus } from '../../../components/Enumeration'
const AddApprovalConfig = (props) => {
   
    if (props.operation === 'copy')
        return (
            <>
            <Row>    
                                             
                   <Col md={12}><FormGroup>
                         <Card>
                              <Card.Header><FormattedMessage id="IDS_COPYAPPROVALCONFIG" message="Copy Approval Config"/></Card.Header>
                              <Card.Body>                                
                                   <Row>  
                                        <Col md={6}>
                                             <FormGroup>
                                                {/*ALPD-5616--Added by Vignesh R(04-04-2025)-->Copy Approval Configuration grid data displaying wrongly in specific scenario.*/}
                                                <FormLabel><FormattedMessage id="IDS_APPROVALSUBTYPE" message="Approval Sub Type"/></FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.masterData.realApprovalSubTypeValue["label"]}</span>
                                             </FormGroup>
                                        </Col>    
                                        {props.masterData.registrationTypeValue && 
                                                       props.masterData.registrationSubTypeValue ? 
                                        <>
                                         <Col md={6}>
                                             <FormGroup>
                                                 {/*ALPD-5616--Added by Vignesh R(04-04-2025)-->Copy Approval Configuration grid data displaying wrongly in specific scenario.*/}
                                                  <FormLabel><FormattedMessage id="IDS_REGISTRATIONTYPE" message="Registration Type"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal"> {props.masterData.realRegistrationTypeValue["label"]}</span>
                                             </FormGroup>
                                        </Col>    

                                        <Col md={6}>
                                             <FormGroup>
                                                {/*ALPD-5616--Added by Vignesh R(04-04-2025)-->Copy Approval Configuration grid data displaying wrongly in specific scenario.*/}
                                                  <FormLabel><FormattedMessage id="IDS_REGISTRATIONSUBTYPE" message="Registration Sub Type"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal"> {props.masterData.realRegistrationSubTypeValue["label"]}</span>
                                             </FormGroup>
                                        </Col>  
                                        </> 
                                       :"" }    
                                        <Col md={6}>
                                             <FormGroup>
                                                  <FormLabel><FormattedMessage id="IDS_VERSIONNAME" message="Version Name"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal">  {props.selectedVersion["sversionname"]}</span>
                                             </FormGroup>
                                        </Col>    

                                        <Col md={6}>
                                             <FormGroup>
                                                  <FormLabel><FormattedMessage id="IDS_VERSIONNO" message="Version No"/></FormLabel>
                                                  <span className="readonly-text font-weight-normal"> {props.selectedVersion["sapproveconfversiondesc"]}</span>
                                             </FormGroup>
                                        </Col>                                                                                             
                                   </Row>
                              </Card.Body>       
                         </Card> </FormGroup>                       
                    </Col>                            
               </Row>
              
            <Row>
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_VERSIONNAME" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_VERSIONNAME" })}
                        name={"sversionname"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        value={props.selectedRecord ? props.selectedRecord["sversionname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={100}
                    />

                  

                    {props.nsubType === ApprovalSubType.TESTRESULTAPPROVAL ?
                        <>
                            {props.registrationTypeOptions ?
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    name="regtype"
                                    optionId="nregtypecode"
                                    optionValue="sregtypename"
                                    options={props.registrationTypeOptions}
                                    value={props.selectedRecord ? props.selectedRecord["regtype"] : props.sthis.props.registrationTypeValue}
                                    onChange={(event) => props.onComboChange(event, null, 'regtype')}
                                    isMandatory={false}
                                    isMulti={false}
                                    isSearchable={true}
                                    isDisabled={false}
                                />
                                : ""}
                            {props.registrationSubTypeOptions ?
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    name="regsubtype"
                                    optionId="nregsubtypecode"
                                    optionValue="sregsubtypename"
                                    options={props.registrationSubTypeOptions}
                                    value={props.selectedRecord ? props.selectedRecord["regsubtype"] : props.registrationSubTypeValue}
                                    isMandatory={false}
                                    isMulti={false}
                                    isSearchable={true}
                                    isDisabled={false}
                                    onChange={(event) => props.onComboChange(event, null, 'regsubtype')}

                                />
                                : ""}
                        </>
                        : ""}
                </Col>
            </Row>
            </>
        )
    else {
        return (

            <Row>
                
                {props.userRoleTree ? props.userRoleTree.length > 0 ?
                    <>
                 
                        <Col md={12}>
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_VERSIONNAME" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_VERSIONNAME" })}
                                name={"sversionname"}
                                type="text"
                                onChange={(event) => props.onInputOnChange(event)}
                                value={props.selectedRecord ? props.selectedRecord["sversionname"] : ""}
                                isMandatory={true}
                                required={true}
                                maxLength={100}
                            />
                        </Col>
                    
                        { /*Added by sonia on 14th NOV 2024 for jira id: ALPD-5086	*/  }
                                               
                            {props.nsubType == ApprovalSubType.TESTRESULTAPPROVAL ?
                                <Col md={12}>
                                  <h6>  <FormattedMessage id={"IDS_AUTOAPPROVAL"} /> </h6>
                                </Col>  
                            : ""}                                           
                        
                        {props.nsubType !== ApprovalSubType.TESTRESULTAPPROVAL ?
                                <>
                                {props.versionConfig.map(action =>
                                    <Col md={4}>
                                        <CustomSwitch
                                            label={props.intl.formatMessage({ id: 'IDS_AUTOAPPROVAL'})}
                                            placeholder={props.intl.formatMessage({ id: 'IDS_AUTOAPPROVAL'})}
                                            type="switch"
                                            name={`${action.stransdisplaystatus}`}
                                            onChange={(event) => props.onInputOnChange(event)}
                                            defaultValue={props.selectedRecord[action.stransdisplaystatus] ? props.selectedRecord[action.stransdisplaystatus] === transactionStatus.YES ? true : false : false}
                                            isMandatory={false}
                                            required={false}
                                            checked={props.selectedRecord[action.stransdisplaystatus] ? props.selectedRecord[action.stransdisplaystatus] === transactionStatus.YES ? true : false : false}
                                            disabled={false}
                                        >
                                        </CustomSwitch>
                                     </Col>
                                )}
                                </>
                        :""}         
                            {props.nsubType === ApprovalSubType.TESTRESULTAPPROVAL ?                                
                                    <Col md={4}>
                                        <CustomSwitch
                                            label={props.intl.formatMessage({ id: "IDS_AUTOINNERBAND" })}
                                            placeholder={props.intl.formatMessage({ id: "IDS_AUTOINNERBAND" })}
                                            type="switch"
                                            name={"nneedautoinnerband"}
                                            onChange={(event) => props.onInputOnChange(event)}
                                            defaultValue={props.selectedRecord["nneedautoinnerband"] ? props.selectedRecord["nneedautoinnerband"] === transactionStatus.YES ? true : false : false}
                                            isMandatory={false}
                                            required={false}
                                            checked={props.selectedRecord["nneedautoinnerband"] ? props.selectedRecord["nneedautoinnerband"] === transactionStatus.YES ? true : false : false}
                                            disabled={false}
                                        >
                                        </CustomSwitch>
                                    </Col>
                            :""}                    
                           {props.nsubType === ApprovalSubType.TESTRESULTAPPROVAL ?     
                                <Col md={4}>
                                    <CustomSwitch
                                        label={props.intl.formatMessage({ id: "IDS_AUTOOUTERBAND" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_AUTOOUTERBAND" })}
                                        type="switch"
                                        name={"nneedautoouterband"}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        defaultValue={props.selectedRecord["nneedautoouterband"] ? props.selectedRecord["nneedautoouterband"] === transactionStatus.YES ? true : false : false}
                                        isMandatory={false}
                                        required={false}
                                        checked={props.selectedRecord["nneedautoouterband"] ? props.selectedRecord["nneedautoouterband"] === transactionStatus.YES ? true : false : false}
                                        disabled={false}
                                    >
                                    </CustomSwitch>
                                </Col>
                            :""}
                            {props.nsubType === ApprovalSubType.TESTRESULTAPPROVAL ? 
                                <>
                                {props.versionConfig.map(action =>
                                    <Col md={4}>
                                        <CustomSwitch
                                            label={props.intl.formatMessage({ id: 'IDS_ANYCASE'})}
                                            placeholder={props.intl.formatMessage({ id: 'IDS_ANYCASE'})}
                                            type="switch"
                                            name={`${action.stransdisplaystatus}`}
                                            onChange={(event) => props.onInputOnChange(event)}
                                            defaultValue={props.selectedRecord[action.stransdisplaystatus] ? props.selectedRecord[action.stransdisplaystatus] === transactionStatus.YES ? true : false : false}
                                            isMandatory={false}
                                            required={false}
                                            checked={props.selectedRecord[action.stransdisplaystatus] ? props.selectedRecord[action.stransdisplaystatus] === transactionStatus.YES ? true : false : false}
                                            disabled={false}
                                        >
                                        </CustomSwitch>
                                    </Col>
                                )}
                                </>  
                                
                            :""}
                        <Col md={12}>
                            <Row noGutters={true}>
                                <Col md="12">
                                    <Card className="at-tabs">

                                        <Tab.Container defaultActiveKey={props.userRoleTree[0].suserrolename}>
                                            <Card.Header className="d-flex tab-card-header">
                                                <Nav as="ul" className="nav nav-tabs card-header-tabs flex-grow-1">
                                                    {props.userRoleTree.map((userrole, index) =>
                                                        <Nav.Item as="li">
                                                            <Nav.Link eventKey={userrole.suserrolename}>{userrole.suserrolenamelevel}
                                                            {/* {index === props.userRoleTree.length-1  ?
                                                                     `${userrole.suserrolename}( ${props.intl.formatMessage({id:"IDS_TOPLEVEL"})} )` 
                                                                     :userrole.suserrolename} */}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )}
                                                </Nav>
                                            </Card.Header>
                                            <Tab.Content>
                                                {props.userRoleTree.map((userrole, index1) =>
                                                    <Tab.Pane className="p-5 fade " eventKey={userrole.suserrolename}>
                                                        <div className="border border-dark border-top-0 border-right-0 border-left-0">
                                                            <Row>
                                                            
                                                                {props.roleConfig.map(action =>
                                                                    <>
                                                                        {action.ntranscode !== transactionStatus.SECTIONWISEAPPROVAL &&
                                                                            <Col md={6}>
                                                                                <CustomSwitch
                                                                                    label={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                                    placeholder={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                                    type="switch"
                                                                                    name={`${action.stransstatus}_${userrole.nuserrolecode}`}
                                                                                    onChange={(event) => props.onInputOnChange(event, userrole)}
                                                                                    defaultValue={props.selectedRecord && props.selectedRecord[userrole.nuserrolecode] && props.selectedRecord[userrole.nuserrolecode][action.stransdisplaystatus+'_'+userrole.nuserrolecode] === transactionStatus.YES ? true : false}
                                                                                    isMandatory={false}
                                                                                    required={false}
                                                                                    checked={props.selectedRecord && props.selectedRecord[userrole.nuserrolecode] && props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] ? props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.YES ? true : false : action.ntranscode === transactionStatus.PARTIALAPPROVAL ? true : false}
                                                                                    disabled={props.selectedRecord && props.selectedRecord['IDS_AUTOAPPROVAL'] && props.selectedRecord['IDS_AUTOAPPROVAL'] === transactionStatus.YES && action.ntranscode === transactionStatus.AUTOAPPROVAL ? true : false}
                                                                                />

                                                                            </Col>
                                                                        }
                                                                        {action.ntranscode === transactionStatus.SECTIONWISEAPPROVAL &&
                                                                            <Col md={6}>
                                                                                <CustomSwitch
                                                                                    label={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                                    placeholder={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                                    type="switch"
                                                                                    name={`${action.stransstatus}_${userrole.nuserrolecode}`}
                                                                                    onChange={(event) => props.onInputOnChange(event, userrole)}
                                                                                    defaultValue={props.selectedRecord ? props.selectedRecord[userrole.nuserrolecode] ? props.selectedRecord[userrole.nuserrolecode][action.stransdisplaystatus+'_'+userrole.nuserrolecode] === transactionStatus.YES ? true : false : false : false}
                                                                                    isMandatory={false}
                                                                                    required={false}
                                                                                    checked={props.selectedRecord ? props.selectedRecord[userrole.nuserrolecode] ? props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.YES && props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.NO ? true : false : false : false}
                                                                                    disabled={props.selectedRecord && props.selectedRecord[userrole.nuserrolecode] && props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] && props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.NO ? false : true}
                                                                                />
                                                                            </Col>
                                                                        }
                                                                    </>
                                                                )}
                                                            
                                                            </Row>
                                                        </div>
                                                        <Row>
                                                            {props.actionStatus.map(action =>

                                                                <Col md={6}>
                                                                    <CustomSwitch
                                                                        label={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                        placeholder={props.intl.formatMessage({ id: action.stransdisplaystatus ? action.stransdisplaystatus : '' })}
                                                                        type="switch"
                                                                        name={`${action.stransstatus}_${userrole.nuserrolecode}`}
                                                                        onChange={(event) => props.onInputOnChange(event, userrole, action)}
                                                                        defaultValue={props.selectedRecord ? props.selectedRecord[userrole.nuserrolecode] ? props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.YES ? true : false : false : false}
                                                                        isMandatory={false}
                                                                        required={false}
                                                                        checked={props.selectedRecord ? props.selectedRecord[userrole.nuserrolecode] ? props.selectedRecord[userrole.nuserrolecode][action.stransstatus+'_'+userrole.nuserrolecode] === transactionStatus.YES ? true : false : false : false}
                                                                        disabled={false}
                                                                    >
                                                                    </CustomSwitch>
                                                                </Col>
                                                            )}
                                                        </Row>
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    name={`napprovalstatuscode_${userrole.nuserrolecode}`}
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_APPROVALSTATUS" })}
                                                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    //key={`napprovalstatuscode_${userrole.nuserrolecode}`}
                                                                    value={props.selectedRecord[`approvalstatus_${userrole.nuserrolecode}`] ? props.selectedRecord[`approvalstatus_${userrole.nuserrolecode}`] : props.approvalStatusValue}
                                                                    options={props.approvalStatusOptions}
                                                                    optionId="ntranscode"
                                                                    optionValue="stransdisplaystatus"
                                                                    isMandatory={true}
                                                                    isMulti={false}
                                                                    isDisabled={false}
                                                                    isSearchable={true}
                                                                    as={"select"}
                                                                    onChange={(event) => props.onComboChange(event, userrole, `approvalstatus_${userrole.nuserrolecode}`)}
                                                                />
                                                                <FormSelectSearch
                                                                    name={`filterstatus_${userrole.nuserrolecode}`}
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_FILTERSTATUS" })}
                                                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    key={`filterstatus_${userrole.nuserrolecode}`}
                                                                    value={props.selectedRecord[`filterstatus_${userrole.nuserrolecode}`] ? props.selectedRecord[`filterstatus_${userrole.nuserrolecode}`] : props.filterStatusValues}
                                                                    options={props.filterStatusOptions}
                                                                    optionId="ntranscode"
                                                                    optionValue="stransstatus"
                                                                    isMandatory={true}
                                                                    isMulti={true}
                                                                    isDisabled={false}
                                                                    isSearchable={true}
                                                                    closeMenuOnSelect={false}
                                                                    as={"select"}
                                                                    onChange={(event) => props.onComboChange(event, userrole, `filterstatus_${userrole.nuserrolecode}`)}
                                                                    isClearable={true}
                                                                />
                                                                <FormSelectSearch
                                                                    name={`validationstatus_${userrole.nuserrolecode}`}
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_VALIDATIONSTATUS" })}
                                                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                    key={`validationstatus_${userrole.nuserrolecode}`}
                                                                    value={props.selectedRecord[`validationstatus_${userrole.nuserrolecode}`] ? props.selectedRecord[`validationstatus_${userrole.nuserrolecode}`] : props.validationStatusValues}
                                                                    options={(props.userRoleTree.length > 1 && index1 === props.userRoleTree.length-1)  ? props.validationStatusOptions : props.userRoleTree.length === 1 ? props.validationStatusOptions : props.topLevelValidStatusOptions}
                                                                 
                                                                    ///options={props.validationStatusOptions}
                                                                    optionId="ntranscode"
                                                                    optionValue="stransstatus"
                                                                    isMandatory={true}
                                                                    isMulti={true}
                                                                    isDisabled={false}
                                                                    isSearchable={true}
                                                                    closeMenuOnSelect={false}
                                                                    isClearable={true}
                                                                    as={"select"}
                                                                    onChange={(event) => props.onComboChange(event, userrole, `validationstatus_${userrole.nuserrolecode}`)}
                                                                />
                                                                
                                                                {props.nsubType !== ApprovalSubType.TESTGROUPAPPROVAL &&              //ALPD-5394 added by Dhanushya RI,Decision Status tab and combo should hide for testgroup and protocol subtype
                                                                  props.nsubType !== ApprovalSubType.PROTOCOLAPPROVAL &&
                                                                props.decisionStatusOptions ? props.decisionStatusOptions.length > 0 ?
                                                                    <FormSelectSearch
                                                                        name={`decisionstatus_${userrole.nuserrolecode}`}
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_DECISIONSTATUS" })}
                                                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        key={`decisionstatus_${userrole.nuserrolecode}`}
                                                                        value={props.selectedRecord[`decisionstatus_${userrole.nuserrolecode}`] ? props.selectedRecord[`decisionstatus_${userrole.nuserrolecode}`] : props.decisionStatusValues}
                                                                        options={props.decisionStatusOptions}
                                                                        optionId="ntranscode"
                                                                        optionValue="stransstatus"
                                                                        isMandatory={false}																
                                                                        isMulti={true}
                                                                        isDisabled={false}
                                                                        isSearchable={true}
                                                                        closeMenuOnSelect={false}
                                                                        isClearable={true}
                                                                        as={"select"}
                                                                        onChange={(event) => props.onComboChange(event, userrole, `decisionstatus_${userrole.nuserrolecode}`)}
                                                                    />   : "" : ""} 
                                                                {props.checklistOptions ? props.checklistOptions.length > 0 ?
                                                                <>
                                                                    <FormSelectSearch
                                                                        name={`checklist_${userrole.nuserrolecode}`}
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        key={`checklist_${userrole.nuserrolecode}`}
                                                                        value={props.selectedRecord[`checklist_${userrole.nuserrolecode}`] ? props.selectedRecord[`checklist_${userrole.nuserrolecode}`] : props.checklistValues}
                                                                        options={props.checklistOptions}
                                                                        optionId="nchecklistcode"
                                                                        optionValue="schecklistname"
                                                                        isMandatory={true}
                                                                        isMulti={false}
                                                                        isDisabled={false}
                                                                        isSearchable={true}
                                                                        closeMenuOnSelect={true}
                                                                        as={"select"}
                                                                        onChange={(event) => props.onComboChange(event, userrole, `checklist_${userrole.nuserrolecode}`)}
                                                                    />
                                                                    <FormSelectSearch
                                                                        name={`checklist_${userrole.nuserrolecode}`}
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                                                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                        key={`checklist_${userrole.nuserrolecode}`}
                                                                        value={props.selectedRecord[`checklistVersion_${userrole.nuserrolecode}`] ? props.selectedRecord[`checklistVersion_${userrole.nuserrolecode}`] : props.checklistVersionValues}
                                                                        options={props.checklistVersionOptions}
                                                                        optionId="nchecklistversioncode"
                                                                        optionValue="schecklistversionname"
                                                                        isMandatory={true}
                                                                        isMulti={false}
                                                                        isDisabled={true}
                                                                        isSearchable={true}
                                                                        closeMenuOnSelect={false}
                                                                        as={"select"}
                                                                        onChange={(event) => props.onComboChange(event, userrole, `checklist_${userrole.nuserrolecode}`)}
                                                                    />
                                                                </>
                                                                    : "" : ""}
                                                            </Col>
                                                        </Row>
                                                    </Tab.Pane>
                                                )}
                                            </Tab.Content>
                                        </Tab.Container>

                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                       
                    </>
                    : "" : ""}
                    
            </Row>

        );
                                                                    
    }
    
}


export default injectIntl(AddApprovalConfig);