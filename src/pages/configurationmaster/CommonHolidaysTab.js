import React from 'react'
import { Row, Col, Nav, } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
// import ReactTooltip from 'react-tooltip';
const CommonHolidaysTab = (props) => {

    const editCommonHolidaysId = props.controlMap.has("EditCommonHolidays") && props.controlMap.get("EditCommonHolidays").ncontrolcode;

    return (<>
        <div className="d-flex justify-content-between mb-3">
            {/* <Row className="no-gutters text-right border-bottom pt-2 pb-2" > */}
            {/* <Col md={9}> */}
            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-list-wrap"/> */}
            <Nav.Link className="add-txt-btn ml-auto"
            //    data-tooltip-id="my-tooltip" data-tooltip-content={ "Edit" }
            //    data-for = "tooltip-list-wrap"
                hidden={props.userRoleControlRights.indexOf(editCommonHolidaysId) === -1}
                onClick={() => props.getCommonHolidays("IDS_COMMONHOLIDAYS", "update", props.masterData, props.userInfo, editCommonHolidaysId)}
            >
                <FormattedMessage id="IDS_EDIT" defaultMessage='Edit' />
            </Nav.Link> 
            {/* </Col> */}
            {/* </Row> */}
        </div>
        {/* {version.nholidayyearversion === this.props.masterData.YearVersion.nholidayyearversion ? */}
        <Row className="no-gutters">

        {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nsunday === 3 ?
                <Col md={12}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined  outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_SUNDAY"} defaultMessage="Sunday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={12}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_SUNDAY"} defaultMessage="Sunday" />
                        </span>
                    </Nav.Link>
                </Col>}
            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nmonday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_MONDAY"} defaultMessage="Monday" />
                        </span>
                    </Nav.Link>

                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_MONDAY"} defaultMessage="Monday" />
                        </span>
                    </Nav.Link>
                </Col>}
            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].ntuesday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_TUESDAY"} defaultMessage="Tuesday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_TUESDAY"} defaultMessage="Tuesday" />
                        </span>
                    </Nav.Link>
                </Col>}

            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nwednesday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_WEDNESDAY"} defaultMessage="Wednesday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_WEDNESDAY"} defaultMessage="Wednesday" />
                        </span>
                    </Nav.Link>
                </Col>}
            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nthursday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_THURSDAY"} defaultMessage="Thursday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_THURSDAY"} defaultMessage="Thursday" />
                        </span>
                    </Nav.Link>
                </Col>}
            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nfriday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_FRIDAY"} defaultMessage="Friday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_FRIDAY"} defaultMessage="Friday" />
                        </span>
                    </Nav.Link>
                </Col>}
            {props.masterData.CommonHolidays.length > 0 && props.masterData.CommonHolidays[0].nsaturday === 3 ?
                <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-success btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_SATURDAY"} defaultMessage="Saturday" />
                        </span>
                    </Nav.Link>
                </Col>
                : <Col md={4}>
                    <Nav.Link className="action-icons-wrap ml-auto">
                        <span className={`btn btn-outlined outline-secondary btn-sm ml-3`}>
                            <FormattedMessage id={"IDS_SATURDAY"} defaultMessage="Saturday" />
                        </span>
                    </Nav.Link>
                </Col>}
        </Row>
        {/* : ""} */}
    </>
    );
}
export default injectIntl(CommonHolidaysTab);