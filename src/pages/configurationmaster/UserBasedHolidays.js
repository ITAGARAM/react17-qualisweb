import React from 'react'
import { Row, Col, Nav, } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';


const UserBasedHolidays = (props) => {

    const addUserHolidaysId = props.controlMap.has("AddUserBasedHoliday") && props.controlMap.get("AddUserBasedHoliday").ncontrolcode
    const editUserHolidayssId = props.controlMap.has("EditUserBasedHoliday") && props.controlMap.get("EditUserBasedHoliday").ncontrolcode;

    const AddUserBasedHolidaysParam = {
        screenName: "IDS_USERBASEDHOLIDAYS", primaryKeyField: "nuserbasedholidaycode", undefined, operation: "create",
        inputParam: props.inputParam, userInfo: props.userInfo, masterData: props.masterData, ncontrolCode: addUserHolidaysId
    };

    const userBasedHolidaysEditParam = {
        screenName: "IDS_USERBASEDHOLIDAYS", operation: "update", primaryKeyField: "nuserbasedholidaycode",
        masterData: props.masterData, userInfo: props.userInfo, ncontrolCode: editUserHolidayssId
    }

    const userBasedHolidaysDeleteParam = { screenName: "IDS_USERBASEDHOLIDAYS", methodUrl: "UserBasedHoliday", operation: "delete" };

    return (<>

        <div className="actions-stripe">
            <div className="d-flex justify-content-end">
                <Nav.Link className="add-txt-btn"
                    hidden={props.userRoleControlRights.indexOf(addUserHolidaysId) === -1}
                    onClick={() => props.getUserBasedHolidays(AddUserBasedHolidaysParam)}
                >
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id='IDS_USERBASEDHOLIDAYS' defaultMessage='User Holidays' />
                </Nav.Link>
            </div>
        </div>

        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                    primaryKeyField={"nuserbasedholidaycode"}
                    data={props.masterData["UserBasedHolidays"]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.userBasedHolidaysColumns}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    methodUrl="UserBasedHoliday"
                    fetchRecord={props.getUserBasedHolidays}
                    editParam={userBasedHolidaysEditParam}
                    deleteRecord={props.deleteRecord}
                    deleteParam={userBasedHolidaysDeleteParam}
                    pageable={true}
                    scrollable={"scrollable"}
                    isActionRequired={true}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                />
            </Col>
        </Row>


    </>
    );


}
export default injectIntl(UserBasedHolidays);