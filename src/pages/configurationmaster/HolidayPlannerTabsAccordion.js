import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import { ProductList } from '../product/product.styled';
import { transactionStatus } from '../../components/Enumeration';
// import ReactTooltip from 'react-tooltip';


const HolidayPlannerTabsAccordion = (props) => {

    const approveYearVersionId = props.controlMap.has("ApproveHolidayYearVersion") && props.controlMap.get("ApproveHolidayYearVersion").ncontrolcode
    const approveYearVersionParam = { screenName: "HolidayYearVersion", methodUrl: "HolidayYearVersion", operation: "approve", ncontrolCode: approveYearVersionId };

    const deleteYearVersionId = props.controlMap.has("DeleteHolidayYearVersion") && props.controlMap.get("DeleteHolidayYearVersion").ncontrolcode
    const deleteYearVersionParam = { screenName: "HolidayYearVersion", methodUrl: "HolidayYearVersion", operation: "delete", ncontrolCode: deleteYearVersionId };


    return (<>
        <div className="d-flex justify-content-between mb-3">
            {/* <Nav.Link className="action-icons-wrap">
                <Row> */}
            <span className={props.version.ntransactionstatus === transactionStatus.APPROVED ? "btn btn-sm ml-3  btn-outlined  outline-success" : props.version.ntransactionstatus === transactionStatus.RETIRED
                ? "btn btn-sm ml-3  btn-outlined  outline-danger" : "btn btn-sm ml-3  btn-outlined  outline-secondary"}> <FormattedMessage id={props.version.stransdisplaystatus} defaultMessage={props.version.stransdisplaystatus} />
            </span>
            <ProductList className="action-icons-wrap ml-auto">
            {/* <ReactTooltip place="bottom" globalEventOff='click' id= "tooltip-list-wrap"/> */}
                <Nav.Link className="mr-2 btn btn-circle outline-grey"
                 hidden={props.userRoleControlRights.indexOf(approveYearVersionId) === -1} 
                 onClick={() => props.sendApproveYearVersion(props.version, approveYearVersionParam)}
               //  data-for = "tooltip-list-wrap"
                 data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_APPROVE" })}
                  >
                    <FontAwesomeIcon name="ApproveVersion" icon={faThumbsUp} />
                </Nav.Link>
                <Nav.Link className="mr-2 btn btn-circle outline-grey"
                hidden={props.userRoleControlRights.indexOf(deleteYearVersionId) === -1}
                data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
               // data-for = "tooltip-list-wrap"
                onClick={() => props.ConfirmDelete({ ...deleteYearVersionParam, selectedRecord: props.version })}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                    {/* <ConfirmDialog
                        name="deleteMessage"
                        message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                        doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                        doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                        icon={faTrashAlt}
                        title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                        hidden={props.userRoleControlRights.indexOf(deleteYearVersionId) === -1}
                        handleClickDelete={() => props.deleteRecord({ ...deleteYearVersionParam, selectedRecord: props.version })}
                    /> */}
                </Nav.Link>
            </ProductList>
            {/* </Row>
            </Nav.Link> */}
        </div>

        <Row>
            <Col md={12} >
                <CustomTabs tabDetail={props.tabDetail} onTabChange={props.onTabChange} />
            </Col>
        </Row>
    </>)
}

export default injectIntl(HolidayPlannerTabsAccordion);