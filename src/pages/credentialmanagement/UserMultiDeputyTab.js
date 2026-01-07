import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {Row, Col,Nav,} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';

const UserMultiDeputyTab = (props) => {  
    const addUserMultiDeputyId = props.controlMap.has("AddDeputyUser") && props.controlMap.get("AddDeputyUser").ncontrolcode
    const editUserMultiDeputyId = props.controlMap.has("EditDeputyUser") && props.controlMap.get("EditDeputyUser").ncontrolcode;
 
    const deputyAddParam = {screenName:"IDS_DEPUTY", operation:"create", primaryKeyField:"nusermultideputycode", 
                            primaryKeyValue:undefined, masterData:props.masterData, userInfo:props.userInfo,
                            ncontrolCode:addUserMultiDeputyId};

    const deputyEditParam = {screenName:"IDS_DEPUTY", operation:"update",  primaryKeyField:"nusermultideputycode", 
                            masterData:props.masterData, userInfo:props.userInfo,  ncontrolCode:editUserMultiDeputyId}

    const deputyDeleteParam ={screenName:"IDS_DEPUTY", methodUrl:"UserMultiDeputy", operation:"delete"};

    return(<>
            <Row noGutters={true}>
                <Col md={12}>
                    <div className="actions-stripe d-flex justify-content-end">
                        <Nav.Link name="adddeputy" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addUserMultiDeputyId) === -1}
                                    onClick={()=>props.getUserMultiDeputyComboDataService(deputyAddParam)}>
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id='IDS_DEPUTY' defaultMessage='Deputy' />
                        </Nav.Link>
                    </div>
                </Col>
            </Row>

            {props.userSite.nusersitecode === props.masterData.UsersSite.nusersitecode ? 
                <Row noGutters={true}>
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={"nusermultideputycode"}
                            data={props.masterData["UserMultiDeputy"]}
                            dataResult={props.dataResult}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            extractedColumnList={props.multiDeputyColumnList}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights}
                            inputParam={props.inputParam}
                            userInfo={props.userInfo}
                            methodUrl="DeputyUser"
                            fetchRecord={props.getUserMultiDeputyComboDataService}
                            editParam={deputyEditParam}
                            deleteRecord={props.deleteRecord}   
                            deleteParam={deputyDeleteParam}                                                                                         
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
export default injectIntl(UserMultiDeputyTab);