import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';

const DefaultValueTab = (props) => {

    const parameterMapId = props.controlMap.has("AddDashBoardParameterMapping") && props.controlMap.get("AddDashBoardParameterMapping").ncontrolcode;

    return (<>
        {/* <div className="actions-stripe">
            <div className="d-flex justify-content-end">
                <Nav.Link name="defaultValuelink"
                    hidden={props.userRoleControlRights.indexOf(parameterMapId) === -1}
                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DEFAULTVALUE" })}
                    onClick={() => props.checkParametersAvailableForDefaultValue(
                        props.masterData.selectedDashBoardTypes,
                        props.userInfo,
                        props.masterData,
                        "update",
                        "IDS_DEFAULTVALUE"
                    )}>
                    <FontAwesomeIcon icon={faLink} name="mappingreporticon"
                        title={props.intl.formatMessage({ id: "IDS_DEFAULTVALUE" })} />
                </Nav.Link>
            </div>
        </div> */}

        <div className="actions-stripe">
            <div className="d-flex justify-content-end">
                <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(parameterMapId) === -1}
                  onClick={() => props.checkParametersAvailableForDefaultValue(
                    props.masterData.selectedDashBoardTypes,
                    props.userInfo,
                    props.masterData,
                    "update",
                    "IDS_DEFAULTVALUE")}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id='IDS_DEFAULTVALUE' defaultMessage='Default Value' />
                </Nav.Link>
            </div>
        </div>


        <Row noGutters={true}>
            <Col md={12}>
                <DataGrid primaryKeyField={"ndashboarddesigncode"}
                    data={props.masterData["dashBoardDefaultValue"] || []}
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
export default injectIntl(DefaultValueTab);