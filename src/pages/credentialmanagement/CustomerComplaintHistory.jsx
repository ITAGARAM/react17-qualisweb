import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';

const CustomerComplaintHistory = (props) => {
    const historyColumnList = [

        { "idsName": "IDS_RECEIVEDFROM", "dataField": "sreceivedfrom", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransactionstatus", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransactiondate", "width": "250px", "fieldType": "dateOnlyFormat" },
        { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "250px" },

    ];

    return (
        <>
            <Row noGutters>
                <Col md={12}>
                    <DataGrid
                        key="ncustomercomplainthistorycode"
                        primaryKeyField="ncustomercomplainthistorycode"
                        data={props.data}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        // hideColumnFilter={true} // Commented by Gowtham on Oct 6 2025 for make this grid sortable and filterable
                        dataStateChange={props.historydataStateChange}
                        extractedColumnList={historyColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        userInfo={props.userInfo}
                        pageable={false}
                        scrollable={'scrollable'}
                        gridHeight={'200px'}
                        isActionRequired={false}
                        methodUrl=""
                        expandField="expanded"

                    >
                    </DataGrid>
                </Col>
            </Row>
            {/* } */}
        </>
    );
};

export default CustomerComplaintHistory;