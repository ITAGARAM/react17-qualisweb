import React from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const EmailConfigTab = (props) => {
    const extractedColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EMAILID", "dataField": "semail", "width": "130px" }
    ]
    return (
        <>
            <Row className="g-0">
                {/* Added by Gowtham on Oct 29 - start */}
                <Col md='6'>
                    <Card className="h-100">

                        <Card.Header className="add-txt-btn">
                            <strong><FormattedMessage id="IDS_USERROLE" defaultMessage="UserRole" /></strong>
                        </Card.Header>

                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                       <Nav.Link name="addSite" className="add-txt-btn"  hidden={props.userRoleControlRights.indexOf(props.addUserRoleId) === -1}
                                           onClick={()=>props.getUserEmailConfig("IDS_ROLE", "create", "nemailconfigcode", props.SelectedEmailConfig, props.masterdata, props.userInfo, props.addUserId, true)}>
                                          <FontAwesomeIcon icon={faPlus} />
                                          <FormattedMessage id='IDS_ADDUSERROLE' defaultMessage='Add User Role' />
                                      </Nav.Link>
                                 </div>
                            </div>
                            <DataGrid
                                extractedColumnList={[{ idsName: "IDS_USERROLE", dataField: "suserrolename", width: "150px" }]}
                                key="nuserrolecode"
                                primaryKeyField="nuserrolecode"
                                inputParam={props.inputParam}
                                userInfo={props.userInfo}
                                data={props.masterdata.emailUserRoles || []}
                                dataResult={process(props.masterdata.emailUserRoles || [], { skip: 0, take: 100 })}
                                dataState={{ skip: 0, take: 100 }}
                                width="500px"
                                pageable={false}
                                controlMap={props.controlMap}
                                userRoleControlRights={props.userRoleControlRights || []}
                                scrollable={"Scrollable"}
                                isActionRequired={true}
                                isToolBarRequired={false}
                                methodUrl={"EmailConfigUserRole"}
                                deleteRecord={props.deleteUserRoleRecord}
                                deleteParam={props.deleteParam}
                                hideColumnFilter={true}
                                selectedId={props.selectedUserRole ? props.selectedUserRole.nuserrolecode : null}
                                dataStateChange={props.dataStateUserRoleChange}
                                hasControlWithOutRights={true}
                                handleRowClick={props.userRoleClick}
                            />
                    </Card>
                </Col>
                {/* end */}

                <Col md='6'>
                    <Card className="h-100">
                        {/* <Tab.Container defaultActiveKey=""> */}
                        <Card.Header className="add-txt-btn">
                            {/* <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">
                                    <Nav.Item as='li'>
                                        <Nav.Link eventKey=""> */}
                            <strong><FormattedMessage id="IDS_USERS" defaultMessage="Users" /></strong>
                            {/* </Nav.Link>
                                    </Nav.Item>
                                </Nav> */}
                        </Card.Header>
                       
                            {/* <Tab.Content>
                                <Tab.Pane className="fade p-0" eventKey="ProductmahhistoryKey"> */}
                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                           <Nav.Link name="addSite" className="add-txt-btn"  hidden={props.userRoleControlRights.indexOf(props.addUserId) === -1}
                                               onClick={()=>props.getUserEmailConfig("IDS_USERS", "create", "nemailconfigcode", 
                                               { ...props.SelectedEmailConfig, nuserrolecode: props.selectedUserRole && props.masterdata.emailUserRoles 
                                                    && props.masterdata.emailUserRoles.length>0 ? props.selectedUserRole.nuserrolecode : null }, 
                                               props.masterdata, props.userInfo, props.addUserId)}>
                                              <FontAwesomeIcon icon={faPlus} /> { }
                                              <FormattedMessage id='IDS_ADDUSERS' defaultMessage='Add Users' />
                                          </Nav.Link>
                                     </div>
                                </div>
                                <DataGrid
                                    extractedColumnList={extractedColumnList}
                                    primaryKeyField="nemailuserconfigcode"
                                    inputParam={props.inputParam}
                                    userInfo={props.userInfo}
                                    data={props.masterData.users || []}
                                    dataResult={process(props.masterData.users || [], { skip: 0, take: 100 })}
                                    dataState={{ skip: 0, take: 100 }}
                                    width="500px"
                                    pageable={false}
                                    controlMap={props.controlMap}
                                    userRoleControlRights={props.userRoleControlRights || []}
                                    scrollable={"Scrollable"}
                                    isActionRequired={true}
                                    isToolBarRequired={false}
                                    dataStateChange={props.dataStateUsersChange}
                                    methodUrl={props.methodUrl}
                                    deleteRecord={props.deleteUsersRecord}
                                    deleteParam={props.deleteParam}
                                    hideColumnFilter={true}
                                  
                                />
                            {/* </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container> */}
                       
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default injectIntl(EmailConfigTab);