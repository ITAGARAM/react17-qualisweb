import React from 'react'
import { Row, Col, Nav, } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
// import ReactTooltip from 'react-tooltip';


const PublicHolidaysTab = (props) => {

    const addPublicHolidaysId = props.controlMap.has("AddPublicHolidays") && props.controlMap.get("AddPublicHolidays").ncontrolcode
    const editPublicHolidaysId = props.controlMap.has("EditPublicHolidays") && props.controlMap.get("EditPublicHolidays").ncontrolcode;
    //const deletePublicHolidaysId = this.props.controlMap.has("DeletePublicHolidays") && this.props.controlMap.get("DeletePublicHolidays").ncontrolcode

    const AddPublicHolidaysParam = {
        screenName:"IDS_PUBLICHOLIDAYS", primaryKeyField: "npublicholidaycode", undefined, operation: "create",
        inputParam: props.inputParam, userInfo: props.userInfo, masterData: props.masterData, ncontrolCode: addPublicHolidaysId
    };

    const publicHolidaysEditParam = {screenName:"IDS_PUBLICHOLIDAYS", operation:"update",  primaryKeyField:"npublicholidaycode", 
    masterData:props.masterData, userInfo:props.userInfo,  ncontrolCode:editPublicHolidaysId}

    const publicHolidaysDeleteParam ={screenName:"IDS_PUBLICHOLIDAYS", methodUrl:"PublicHolidays", operation:"delete"};

    return (<>
        {/* <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
            <Col md={12}>
                <Nav.Link className="add-txt-btn"
                    hidden={props.userRoleControlRights.indexOf(addPublicHolidaysId) === -1}
                  //  onClick={() => props.getPublicHolidays("PublicHolidays", "create", "npublicholidaycode", undefined, props.masterData, props.userInfo, addPublicHolidaysId)}
                  onClick={() => props.getPublicHolidays(AddPublicHolidaysParam)}
                >
                    <FontAwesomeIcon icon={faPlus} /> {}
                    <FormattedMessage id='IDS_PUBLICHOLIDAYS' defaultMessage='Public Holidays' />
                </Nav.Link>
            </Col>
        </Row> */}

        <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-list-wrap"/> */}
                    <Nav.Link className="add-txt-btn"
                    //  data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDPUBLICHOLIDAYS" })}
                    //  data-for = "tooltip-list-wrap"
                        hidden={props.userRoleControlRights.indexOf(addPublicHolidaysId) === -1}
                    //  onClick={() => props.getPublicHolidays("PublicHolidays", "create", "npublicholidaycode", undefined, props.masterData, props.userInfo, addPublicHolidaysId)}
                    onClick={() => props.getPublicHolidays(AddPublicHolidaysParam)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> {}
                        <FormattedMessage id='IDS_PUBLICHOLIDAYS' defaultMessage='Public Holidays' />
                    </Nav.Link>
                </div>
            </div>

        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                    primaryKeyField={"npublicholidaycode"}                   
                    data={props.masterData["PublicHolidays"]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.publicHolidaysColumns}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    methodUrl="PublicHolidays"
                    fetchRecord={props.getPublicHolidays}
                    editParam={publicHolidaysEditParam}
                    deleteRecord={props.deleteRecord}
                    deleteParam={publicHolidaysDeleteParam}
                    pageable={true}
                    scrollable={"scrollable"}
                   // isComponent={true}
                    isActionRequired={true}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                />
            </Col>
        </Row>


    </>
    );


}
export default injectIntl(PublicHolidaysTab);