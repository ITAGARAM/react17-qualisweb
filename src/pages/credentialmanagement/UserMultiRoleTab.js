import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {Row, Col, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';

const UserMultiRoleTab = (props) => {    
    
    const addUserMultiRoleId = props.controlMap.has("AddRole") && props.controlMap.get("AddRole").ncontrolcode
    const editUserMultiRoleId = props.controlMap.has("EditRole") && props.controlMap.get("EditRole").ncontrolcode;
       
    const resetPasswordId = props.controlMap.has("ResetPassword") && props.controlMap.get("ResetPassword").ncontrolcode
    
    const roleAddParam = {screenName:"IDS_ROLE", operation:"create", primaryKeyField:"nusermultirolecode", 
                          primaryKeyValue:-2, masterData:props.masterData, userInfo:props.userInfo,
                          ncontrolCode:addUserMultiRoleId};
                          
    const roleEditParam = {screenName:"IDS_ROLE", operation:"update",  primaryKeyField:"nusermultirolecode", 
                          masterData:props.masterData,   userInfo:props.userInfo,  ncontrolCode:editUserMultiRoleId};
       
    const roleDeleteParam ={screenName:"IDS_ROLE", methodUrl:"UserMultiRole", operation:"delete"};

    return(<>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="resetrole" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(resetPasswordId) === -1}
                                onClick={()=>props.resetPassword()}>
                        <FormattedMessage id="IDS_RESETPASSWORD" defaultMessage='Reset Password' />
                    </Nav.Link>
                    <Nav.Link name="addrole" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addUserMultiRoleId) === -1}
                                onClick={()=>props.getUserMultiRoleComboDataService(roleAddParam)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id='IDS_ROLE' defaultMessage='Role' />
                    </Nav.Link>
                </div>
            </div>

            {props.userSite.nusersitecode === props.masterData.UsersSite.nusersitecode ?  
                <Row noGutters={true}>
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={"nusermultirolecode"}
                            data={props.masterData["UserMultiRole"]}
                            dataResult={props.dataResult}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            extractedColumnList={props.multiRoleColumnList}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            inputParam={props.inputParam}
                            userInfo={props.userInfo}
                            methodUrl="Role"
                            fetchRecord={props.getUserMultiRoleComboDataService}
                            editParam={roleEditParam}
                            deleteRecord={props.deleteRecord} 
                            deleteParam={roleDeleteParam}                                                                                          
                            pageable={false}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            isToolBarRequired={false}
                            selectedId={props.selectedId}
                            hideColumnFilter={true}
                        />
                    </Col>
                </Row>
            :""}
        </>
    )   
}
                
export default injectIntl(UserMultiRoleTab);