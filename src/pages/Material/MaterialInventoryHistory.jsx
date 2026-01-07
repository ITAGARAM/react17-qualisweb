import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import ReactTooltip from 'react-tooltip';
import { designProperties } from '../../components/Enumeration';


const MaterialInventoryHistory = (props) => {
    const fieldsForGrid = [
        { "idsName": "IDS_INVENTORYID", "dataField": "Inventory ID", "width": "200px" },
        { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "200px" }, 
        { "idsName": "IDS_NEXTVALIDATIONDATE", "dataField": "dnextvalidationdate", "width": "200px" }

    ];
    return (
        <>
            <Row noGutters={true}>
                <Col md="12"> 
                    <DataGrid
                        key="materialinventoryhistorycode"
                        primaryKeyField="materialinventoryhistorycode" 
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
                       // scrollable={"scrollable"}
                    >
                    </DataGrid>

                </Col>
            </Row>
        </>
    );
};

export default MaterialInventoryHistory;