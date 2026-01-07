import React from 'react'
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faEye, faPencilAlt, faPlus, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { injectIntl, FormattedMessage } from "react-intl";
import ConfirmDialog from "../../components/confirm-alert/confirm-alert.component";
import DataGrid from '../../components/data-grid/data-grid.component';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';

const ConfigureCheckList = (props) => {

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
                <Col md={12}>
                    <Nav.Link className="add-txt-btn float-right"
                        onClick={() => props.onClickAddCheckList()}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} /> { }
                        <FormattedMessage id="IDS_CHECKLIST" defaultMessage='CheckList' />
                    </Nav.Link>
                </Col>
            </Row>
            <Row>
            <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_CHECKLISTNAME"} message="Checklist Name:" /></FormLabel>
                        <ReadOnlyText>{props.version.schecklistname}</ReadOnlyText>
                    </FormGroup>
                </Col>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_CHECKLISTVERSIONNAME"} message="Checklist Name:" /></FormLabel>
                        <ReadOnlyText>{props.version.schecklistversionname}</ReadOnlyText>
                    </FormGroup>
                </Col>
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
                    <DataGrid
                        primaryKeyField={"nchecklistversionqbcode"}
                        data={props.checklistversionqb}
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
                        selectedId={props.selectedId}
                        isComponent={true}
                        isActionRequired={false}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}

                    />
                </Col>
            </Row>
        </>
    )

}
export default injectIntl(ConfigureCheckList);