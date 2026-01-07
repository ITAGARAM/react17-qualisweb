import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@progress/kendo-react-tooltip';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import {transactionStatus} from '../../components/Enumeration';

const UserTabsAccordion = (props) => {

    const editUsersSiteId = props.controlMap.has("EditSite") && props.controlMap.get("EditSite").ncontrolcode;
    const deleteUsersSiteId = props.controlMap.has("DeleteSite") && props.controlMap.get("DeleteSite").ncontrolcode
    const deleteUserSiteParam = {screenName:"IDS_SITE", methodUrl:"UsersSite", operation:"delete", ncontrolCode:deleteUsersSiteId};
    return(<>
        <div className="d-flex justify-content-end mb-3">  
            {props.userSite.ndefaultsite === transactionStatus.YES ? 
                            <span className={`btn btn-outlined outline-success mr-auto btn-sm`}>
                            <i class={"fa fa-check mr-1"}></i> 
                            <FormattedMessage id= {"IDS_DEFAULTSITE"} defaultMessage="Default Site"/>
                            </span>		
            :""}
            <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                                                
            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        hidden={props.userRoleControlRights.indexOf(editUsersSiteId) === -1}
                        title={props.intl.formatMessage({ id: "IDS_EDITSITE" })} 
                        onClick={()=> props.getUserSiteComboService("IDS_SITE", "update", "nusersitecode", 
                                        props.userSite.nusersitecode, props.masterData, props.userInfo, editUsersSiteId)}
                      >
                <FontAwesomeIcon  name="editSite"  icon={faPencilAlt} 
                        title={props.intl.formatMessage({id:"IDS_EDITSITE"})}/>  
            </Nav.Link>
            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        title={props.intl.formatMessage({ id: "IDS_DELETESITE" })} 
                      hidden={props.userRoleControlRights.indexOf(deleteUsersSiteId) === -1}
                      onClick={() => props.ConfirmDelete({...deleteUserSiteParam, selectedRecord:props.userSite})}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                {/* <ConfirmDialog 
                    name="deleteMessage" 
                    message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG"})}
                    doLabel={props.intl.formatMessage({ id: "IDS_OK" })} 
                    doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                    icon={faTrashAlt}
                    title={props.intl.formatMessage({ id: "IDS_DELETESITE" })}
                    hidden={props.userRoleControlRights.indexOf(deleteUsersSiteId) === -1}  
                    handleClickDelete={() => props.deleteRecord({...deleteUserSiteParam, selectedRecord:props.userSite})}
                /> */}
            </Nav.Link>
            </Tooltip>
         </div>

        <Row>
            <Col md={12} >
                <CustomTabs tabDetail={props.tabDetail} onTabChange={props.onTabChange}/> 
            </Col>
        </Row>
        </>
    )
}
export default injectIntl(UserTabsAccordion);