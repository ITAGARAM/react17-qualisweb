import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
// import ReactTooltip from 'react-tooltip';
import { designProperties } from '../../components/Enumeration';


const TestInitiateTab = (props) => {
    const fieldsForGrid = [
        { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
        { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" },
        { "idsName": "Used Quantity", "dataField": "nqtyused", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "dtransactiondate", "width": "200px" }

    ];
    return (
        <>
            <Row className="no-gutters">
            <Col md={12}>

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nresultusedmaterialcode"
                        expandField="expanded"
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={fieldsForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        pageable={true}
                        scrollable={'scrollable'} 
                        hideColumnFilter={false}
                        selectedId={0}
                        gridHeight={"550px"}
                        hasDynamicColSize={true}
                       // scrollable={"scrollable"}
                    >
                    </DataGrid>

                </Col>
            </Row>
        </>
    );
};

export default TestInitiateTab;