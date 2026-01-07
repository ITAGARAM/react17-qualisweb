import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
// import ReactTooltip from 'react-tooltip';


const MaterialInventoryTab = (props) => {
    const addParameterId = props.controlMap.has("AddMaterialSection") && props.controlMap.get("AddMaterialSection").ncontrolcode;
    const editId = props.controlMap.has("EditMaterialSection") && props.controlMap.get("EditMaterialSection").ncontrolcode;
    const testSectionColumnList = [
        
        { "idsName": "IDS_TRANSACTIONTYPE", "dataField": "sinventorytypename", "width": "200px" },
        { "idsName": "IDS_SAMPLENAME", "dataField": "sproductname", "width": "200px" },
        { "idsName": "IDS_TRANSACTIONDATE", "dataField": "stransactiondate", "width": "200px" },
        { "idsName": "IDS_QUANTITY", "dataField": "sqtyreceived", "width": "200px" },
        { "idsName": "IDS_URANIUMRECEIVEDCONTENT", "dataField": "suraniumreceived", "width": "200px" },
        //{ "idsName": "IDS_ISSUED", "dataField": "sqtyissued", "width": "200px" },
       //{ "idsName": "IDS_URANIUMISSEDCONTENT", "dataField": "suraniumissued", "width": "200px" },
        { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" },
    ];
    const methodUrl = "MaterialSection";
    let primaryKeyField = "nmaterialsectioncode";
     const editParam = {
         operation: "update", primaryKeyField, userInfo: props.userInfo, ncontrolCode: editId,
         masterData: props.masterData
         //, selectedRecord: props.selectedRecord
     }


    const inputParam = { classUrl: "material", methodUrl: "getActiveMaterialSectionById" }
    return (
        <>
            <Row noGutters={true}>
                <Col md="12">

                    <DataGrid
                        key="materialinventtranscodekey"
                        primaryKeyField="nmaterialinventtranscode"
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        data={props.data}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={testSectionColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={inputParam}
                        editParam={editParam}
                        fetchRecord={props.fetchRecord}
                        deleteRecord={props.deleteRecord} 
                        scrollable={'scrollable'} 
                        gridHeight={'500px'}
                        isActionRequired={false}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
                        pageable={true}
                        selectedId={props.selectedId}
                        isJsonFeild={true}
                        jsonFeild='jsondata'
                    >
                    </DataGrid>

                </Col>
            </Row>
        </>
    );
};

export default MaterialInventoryTab;