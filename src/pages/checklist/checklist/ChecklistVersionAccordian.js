import React from 'react'
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faEye, faPencilAlt, faPlus, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { injectIntl, FormattedMessage } from "react-intl";
import ConfirmDialog from "../../../components/confirm-alert/confirm-alert.component";
import DataGrid from '../../components/data-grid/data-grid.component';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { ReadOnlyText } from '../../../components/login/login.styles';
import { ReadOnlyText } from '../../../components/App.styles';
// import ReactTooltip from 'react-tooltip';

const ChecklistVersionAccordian = (props) => {
    const addQBId = props.controlMap.has("AddChecklistVersionQB") && props.controlMap.get("AddChecklistVersionQB").ncontrolcode
    const approveVersionId = props.controlMap.has("ApproveChecklistVersion") && props.controlMap.get("ApproveChecklistVersion").ncontrolcode;
    const editVersionId = props.controlMap.has("EditChecklistVersion") && props.controlMap.get("EditChecklistVersion").ncontrolcode
    const viewVersionId = props.controlMap.has("ViewChecklistVersion") && props.controlMap.get("ViewChecklistVersion").ncontrolcode
    const deleteVersionId = props.controlMap.has("DeleteChecklistVersion") && props.controlMap.get("DeleteChecklistVersion").ncontrolcode;
    const editQBId = props.controlMap.has("EditChecklistVersionQB") && props.controlMap.get("EditChecklistVersionQB").ncontrolcode

    const qbEditParam = {
        screenName: "ChecklistVersionQB",
        operation: "update",
        primaryKeyField: "nchecklistversionqbcode",
        masterData: props.masterData,
        userInfo: props.userInfo,
        ncontrolCode: editQBId
    };

    const qbDeleteParam = {
        screenName: "ChecklistVersionQB",
        methodUrl: "ChecklistVersionQB",
        operation: "delete",
        key: 'checklistversionqb'
    };
    const checklistVersionEditParam = {
        screenName: "ChecklistVersion",
        operation: "update",
        primaryKeyField: "nchecklistversioncode",
        masterData: props.masterData,
        userInfo: props.userInfo,
        primaryKeyValue: props.masterData.selectedversion ? props.masterData.selectedversion.nchecklistversioncode : -1,
        ncontrolCode: editVersionId
    };
    const versionDeleteParam = {
        screenName: "Checklist",
        methodUrl: "ChecklistVersion",
        operation: "delete",
        key: 'checklistversion',
        ncontrolCode: deleteVersionId
    };

    const extractedColumnList = [
        { "idsName": "IDS_QUESTION", "dataField": "squestion", "width": "45%" }
    ]
    const detailedFieldList = [
        { "idsName": "IDS_QBCATEGORYNAME", "dataField": "schecklistqbcategoryname", "width": "15%" },
        { "idsName": "IDS_COMPONENT", "dataField": "scomponentname", "width": "10%" },
        { "idsName": "IDS_MANDATORY", "dataField": "smandatory", "width": "10%" }
    ]

    return (
        <>
            <Row>
                 {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
                <Col md={12}>
                    {/* <Nav.Link className="action-icons-wrap float-right"> */}
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                        hidden={props.userRoleControlRights.indexOf(editVersionId) === -1}
                        onClick={() => props.fetchChecklistRecordByID(checklistVersionEditParam)}
                    >
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                    //  data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                        hidden={props.userRoleControlRights.indexOf(deleteVersionId) === -1}
                        onClick={() => props.fetchChecklistRecordByID(checklistVersionEditParam)}
                    >
                        <ConfirmDialog
                            name="deleteMessage"
                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                            icon={faTrashAlt}
                            title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                            hidden={props.userRoleControlRights.indexOf(deleteVersionId) === -1}
                            handleClickDelete={() => props.deleteRecord({ ...versionDeleteParam, selectedRecord: props.version })}
                        />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        hidden={props.userRoleControlRights.indexOf(viewVersionId) === -1}
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                        onClick={() => props.viewVersionTemplate(props.version, props.userInfo)}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        hidden={props.userRoleControlRights.indexOf(approveVersionId) === -1}
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                        onClick={() => props.approveVersion(props.version, approveVersionId)}
                    >
                        <FontAwesomeIcon icon={faThumbsUp}/>
                    </Nav.Link>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_VERSIONNO"} message="Checklist Version No:" /></FormLabel>
                        <ReadOnlyText>{props.version.schecklistversiondesc}</ReadOnlyText>
                    </FormGroup>
                </Col>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_STATUS"} message="Status" /></FormLabel>
                        <ReadOnlyText>{props.version.stransdisplaystatus}</ReadOnlyText>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
                    <Nav.Link className="add-txt-btn float-right"
                    //   data-tooltip-id="my-tooltip" data-tooltip-content={"Add QB"}
                        hidden={props.userRoleControlRights.indexOf(addQBId) === -1}
                        onClick={() => props.showChecklistAddScreen(props.version.nchecklistversioncode, 'checklistversionqb', addQBId, props.userInfo)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_QB" defaultMessage='QB' />
                    </Nav.Link>
                </Col>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"nchecklistversionqbcode"}
                        data={props.masterData.checklistversionqb}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        expandField="expanded"
                        detailedFieldList={detailedFieldList}
                        extractedColumnList={extractedColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={props.inputParam}
                        userInfo={props.userInfo}
                        methodUrl="ChecklistVersionQB"
                        fetchRecord={props.fetchChecklistRecordByID}
                        editParam={qbEditParam}
                        deleteRecord={props.deleteRecord}
                        deleteParam={qbDeleteParam}
                        selectedId={props.selectedId}
                        isComponent={true}
                        isActionRequired={true}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}

                    />
                </Col>
            </Row>
        </>
    )

}
export default injectIntl(ChecklistVersionAccordian);