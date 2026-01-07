import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
// import ReactTooltip from 'react-tooltip';


const MaterialSectionTab = (props) => {
    const addParameterId = props.controlMap.has("AddMaterialSection") && props.controlMap.get("AddMaterialSection").ncontrolcode;
    const editId = props.controlMap.has("EditMaterialSection") && props.controlMap.get("EditMaterialSection").ncontrolcode;
    const testSectionColumnList = [
        { "idsName": "IDS_MATERIALSECTION", "dataField": "ssectionname", "width": "200px" },
        {
            "idsName": "IDS_REORDERLEVEL", "dataField": "nreorderlevel", "width": "100px"
        }
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
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="addtestparameter" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addParameterId) === -1}
                        onClick={() => props.addParameter(addParameterId, "create", {}, props.userInfo)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDMATERIALSECTION" defaultMessage="Add MaterialSection" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nmaterialsectioncode"
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
                        isActionRequired={true}
                        deleteParam={{ operation: "delete", methodUrl }}
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

export default MaterialSectionTab;