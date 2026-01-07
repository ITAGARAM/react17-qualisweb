import React from 'react'
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../../components/Enumeration';
import DataGrid from '../../../components/data-grid/data-grid.component';
const FilterStatusTab = (props) => {    
    const extractedColumnList=[
        {"idsName":"IDS_FILTERSTATUS","dataField":"sfilterstatus","width":"250px"},
        { "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width":"250px",
        "componentName": "switch",  "switchFieldName": "ndefaultstatus", 
        "switchStatus": transactionStatus.YES, "needRights": false}
    ] 
    return(
        <>
        <Row no-gutters={true}>
            <Col md={12}>
                {/* <Grid data={props.filterData} >                                       
                    <GridColumn 
                        title={props.intl.formatMessage({ id:"IDS_FILTERSTATUS"})}
                        field={"sfilterstatus"}   
                        cell={(row) =>  ( 
                            <td> 
                                {row["dataItem"]["sfilterstatus"]} 
                            </td>)}
                    />
                    <GridColumn
                        field={"ndefaultstatus"}
                        
                        title={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                        cell={(row) => (
                            <td>
                                <CustomSwitch type="switch" id={row["dataItem"]["ndefaultstatus"]}
                                    onChange={(event) =>  props.setDefault(event, row["dataItem"],1,props.selectedRole.napprovalconfigrolecode,props.napprovalsubtypecode
                                    ,props.userInfo,props.masterData)}
                                    checked={row["dataItem"]["ndefaultstatus"] === transactionStatus.YES ? true : false}
                                    name={row["dataItem"]["ntransactionstatus"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                            </td>)}
                    />
                </Grid>  */}
                <DataGrid
                    primaryKeyField={"napprovalfiltercode"}
                    data={props.filterData.data}
                    dataResult={props.filterData}
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
                    methodUrl=""
                    onSwitchChange={props.setDefault}
                    switchParam={{operation:"",flag:1,napprovalconfigrolecode:props.selectedRole.napprovalconfigrolecode,napprovalsubtypecode:props.napprovalsubtypecode,userInfo:props.userInfo,masterData:props.masterData}}
                    
                />
            </Col>
        </Row>
        </>
    )
}
export default injectIntl(FilterStatusTab);