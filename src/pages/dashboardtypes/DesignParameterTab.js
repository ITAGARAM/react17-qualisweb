import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';

const DesignParameterTab = (props) => {

    const addDesignId = props.controlMap.has("AddDashBoardDesignConfig") && props.controlMap.get("AddDashBoardDesignConfig").ncontrolcode
    //console.log("dataResult:", props.dataResult, props.dataState);
    return (<>
        <div className="actions-stripe">
            <div className="d-flex justify-content-end">
                <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addDesignId) === -1}
                    onClick={() => props.getAddDashboardDesign(props.masterData.selectedDashBoardTypes, props.userInfo)}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id='IDS_DESIGNPARAMETER' defaultMessage='Design Parameter' />
                </Nav.Link>
            </div>
        </div>

        <Row noGutters={true}>
            <Col md={12}>
                <DataGrid primaryKeyField={"ndashboardtypecode"}
                    data={props.masterData["selectedDesignConfig"]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.extractedColumnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    pageable={false}
                    scrollable={"scrollable"}
                    isComponent={false}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                    name={props.name}
                    hideColumnFilter={true}
                />
            </Col>
        </Row>
    </>
    )
}
export default injectIntl(DesignParameterTab);