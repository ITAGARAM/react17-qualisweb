import React from 'react'
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
//import { Grid, GridColumn } from '@progress/kendo-react-grid';
import DataGrid from '../../../components/data-grid/data-grid.component';
const ValidationStatusTab = (props) => {  
    const extractedColumnList=[
        {"idsName":"IDS_VALIDATIONSTATUS","dataField":"svalidationstatus","width":"300px"},
    ]  
    return(
        <>
        <Row no-gutters={true}>
            <Col md={12}>
                {/* <Grid data={props.validationStatus} > 
                    <GridColumn title={props.intl.formatMessage({ id:"IDS_VALIDATIONSTATUS"})}
                        field={"svalidationstatus"}   
                        cell={(row) =>  ( 
                            <td>
                                {row["dataItem"]["svalidationstatus"]} 
                                
                            </td>)}
                    />
                </Grid> */}
                <DataGrid
                    primaryKeyField={"napprovalvalidationcode"}
                    data={props.validationStatus.data}
                    dataResult={props.validationStatus}
                    //dataState={{skip:0}}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList={extractedColumnList}
                    controlMap={new Map()}
                    userRoleControlRights={{}}
                    inputParam={props.inputParam}                                                                                   
                    isComponent={true}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    hideColumnFilter={true}
                    pageable={true}
                    
                />
            </Col>
        </Row>
        </>
    )
}
export default injectIntl(ValidationStatusTab);