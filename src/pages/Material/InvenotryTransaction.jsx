import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';



const InvenotryTransaction = (props) => {
    const QuantityTransaction = props.controlMap.has("QuantityTransaction") && props.controlMap.get("QuantityTransaction").ncontrolcode;
    //const ViewMaterialInventoryTrans = props.controlMap.has("ViewMaterialInventoryTrans") && props.controlMap.get("ViewMaterialInventoryTrans").ncontrolcode;
    // const fieldsForGrid = [
    //     { "idsName": "IDS_INVENTORYID", "dataField": "IDS_INVENTORYID", "width": "200px" },
    //     {
    //         "idsName": "IDS_TRANSACTIONDATE", "dataField": "IDS_TRANSACTIONDATE", "width": "100px"
    //     }
    //     ,
    //     {
    //         "idsName": "IDS_INVENTORYTRANSACTIONTYPE", "dataField": "IDS_INVENTORYTRANSACTIONTYPE", "width": "100px"
    //     }
    //     ,
    //     {
    //         "idsName": "IDS_TRANSACTIONTYPE", "dataField": "IDS_TRANSACTIONTYPE", "width": "100px"
    //     }
    // ];
   // let fieldsForGrid=[];
   // let fieldsForExpandedGrid=[];
   // let x=[];
    // if(props.SelectedMaterialInventory['jsondata'].hasOwnProperty(props.DesignMappedFeilds.fieldsForGrid[index]&&
    //     props.DesignMappedFeilds.fieldsForGrid[index][designProperties.VALUE]))
    // {
        // props.DesignMappedFeilds.fieldsForGrid!==undefined&&
        // props.DesignMappedFeilds.fieldsForGrid.map((temp,i)=>{
        //     fieldsForGrid.push(
        //         { "idsName":  props.DesignMappedFeilds.fieldsForGrid[i][designProperties.VALUE], "dataField": 
        //         props.DesignMappedFeilds.fieldsForGrid[i][designProperties.VALUE], "width": "200px" }
        //     );
        // })

   // }
    // props.Template.map((row) => {
        
    //     row.children.map((column) => {
    //         column.children.map((component) => {
    //             if (component.hasOwnProperty('fieldsForGrid')) {
    //                 fieldsForGrid.push(
    //                     { "idsName": component.label, "dataField": component.label, "width": "200px" }
    //                 );
    //             }
    //             if (component.hasOwnProperty('fieldsForExpandedGrid')) {
    //                 fieldsForExpandedGrid.push(
    //                     { dataField: component.label, idsName: component.label, columnSize: "4" },
    //                 );
    //             }
    //             component.hasOwnProperty("children") && component.children.map((componentrow) => {
    //                 if (componentrow.hasOwnProperty('fieldsForGrid')) {
    //                     fieldsForGrid.push(
    //                         { "idsName": componentrow.label, "dataField": componentrow.label, "width": "200px" }
    //                     );
    //                 }
    //                 if (componentrow.hasOwnProperty('fieldsForExpandedGrid')) {
    //                     fieldsForExpandedGrid.push(
    //                         { dataField: componentrow.label, idsName: componentrow.label, columnSize: "4" },
    //                     );
    //                 }
    //             })
    //         })
    //     })
    // })
    // fieldsForGrid[0]=fieldsForGrid
    // let fieldsForExpandedGrid1=[]
    // fieldsForExpandedGrid1.push(fieldsForExpandedGrid)
    // detailedFieldList = [
    //     { dataField: "ssectionname", idsName: "IDS_SECTIONNAME", columnSize: "4" },
    //     { dataField: "sfullname", idsName: "IDS_PARTICIPANTS", columnSize: "4" },
    //     // { dataField: "sfaxno", idsName: "IDS_FAXNO", columnSize:"4" },
    //     // //{ dataField: "sdisplaystatus", idsName: "IDS_DISPLAYSTATUS" },
    //     //{ "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "20%", "isIdsField": true, "controlName": "ndefaultstatus" }

    // ];
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="QuantityTransaction" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(QuantityTransaction) === -1}
                        onClick={() => props.quantityTransaction(QuantityTransaction, "create", {}, props.userInfo)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_QUANTITYTRANSACTION" defaultMessage="Quantity Transaction" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nmaterialinventtranscode"
                        expandField="expanded"
                        detailedFieldList={props.QuantityTransactionForExpandedGrid}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={props.QuantityTransactionForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        fetchRecord={props.fetchRecord}
                        deleteRecord={props.deleteRecord}
                        pageable={true}
                        scrollable={'scrollable'} 
                       // isActionRequired={true}
                        hideColumnFilter={false}
                        selectedId={0}
                       // isJsonFeild={true}
                        // isActionRequired={true}
                        // actionIcons={[{
                        //     title: props.intl.formatMessage({ id: "IDS_VIEW" }),
                        //     controlname: "faEye",
                        //     objectName: "materialinventorytransaction",
                        //     hidden: props.userRoleControlRights.indexOf(ViewMaterialInventoryTrans) === -1,
                        //     onClick: (viewdetails) => props.viewQuantityTrans(viewdetails)
                        // }]}
                      //  jsonField='jsondata'
                    >
                    </DataGrid>

                </Col>
            </Row>
        </>
    );
};

export default InvenotryTransaction;