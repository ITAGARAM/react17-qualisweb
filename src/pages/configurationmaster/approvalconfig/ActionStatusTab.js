import React from 'react'
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
//import { Grid, GridColumn } from '@progress/kendo-react-grid';
import DataGrid from '../../../components/data-grid/data-grid.component';
const ActionStatusTab = (props) => {    
    const extractedColumnList=[
        {"idsName":"IDS_ACTIONSTATUS","dataField":"sactiondisplaystatus","width":"600px"},
    ]  
    return(
        <>
        <Row no-gutters={true}>
            <Col md={12}>
                {/* <Grid data={props.actionData} > 
                    <GridColumn title={props.intl.formatMessage({ id:"IDS_ACTIONSTATUS"})}
                        field={"sactiondisplaystatus"}   
                        cell={(row) =>  ( 
                            <td>
                                {row["dataItem"]["sactiondisplaystatus"]} 
                                
                            </td>)}
                    />
                </Grid> */}
                <DataGrid
                    primaryKeyField={"napprovalactioncode"}
                    data={props.actionData.data}
                    dataResult={props.actionData}
                    dataState={{skip:0}}
                    extractedColumnList={extractedColumnList}
                    controlMap={new Map()}
                    userRoleControlRights={{}}
                    inputParam={props.inputParam}                                                                                   
                    isComponent={true}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    hideColumnFilter={true}
                    
                />
            </Col>
        </Row>
        </>
    )
}
export default injectIntl(ActionStatusTab);