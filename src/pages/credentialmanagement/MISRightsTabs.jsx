import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const MISRightsTabs = (props) => {
    return (<>
        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
            <Col md={12}>
                <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(props.addId) === -1}
                    onClick={() => props.comboDataService(props.addParam)}>
                    <FontAwesomeIcon icon={faPlus} /> { }
                    <FormattedMessage id={props.addTitleIDS} defaultMessage={props.addTitleDefaultMsg} />
                </Nav.Link>
            </Col>
        </Row>
        <Row className="no-gutters">
            <Col md={12}>
                <DataGrid
                    primaryKeyField={props.primaryKeyField}
                    data={props.masterData[props.primaryList]}
                    dataResult={props.dataResult}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    extractedColumnList={props.columnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    methodUrl={props.methodUrl}
                    deleteRecord={props.deleteRecord}
                    deleteParam={props.deleteParam}
                    pageable={true}
                    scrollable={"scrollable"}
                    //isComponent={true}
                    isActionRequired={true}
                    isToolBarRequired={false}
                    selectedId={props.selectedId}
                    hideColumnFilter={true}
                />

            </Col>
        </Row>
    </>
    );
}
export default injectIntl(MISRightsTabs);