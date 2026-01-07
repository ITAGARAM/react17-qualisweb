import React from 'react'
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../../components/Enumeration';
import DataGrid from '../../../components/data-grid/data-grid.component';
const DecisionStatusTab = (props) => {  
    const extractedColumnList=[
        {"idsName":"IDS_DECISIONSTATUS","dataField":"sdecisionstatus","width":"250px"},
        { "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width":"250px",
        "componentName": "switch",  "switchFieldName": "ndefaultstatus", 
        "switchStatus": transactionStatus.YES, "needRights": false}
    ]   
    return(
        <>
        <Row no-gutters={true}>
            <Col md={12}>
                {/* <Grid data={props.decisionData} > 
                    <GridColumn title={props.intl.formatMessage({ id:"IDS_DECISIONSTATUS"})}
                        field={"sdecisionstatus"}   
                        cell={(row) =>  ( 
                            <td>
                                {row["dataItem"]["sdecisionstatus"]} 
                            </td>)}
                    />
                    <GridColumn
                        field={"ndefaultstatus"}
                        title={props.intl.formatMessage({ id: "IDS_DEFAULTSTATUS" })}
                        cell={(row) => (
                            <td>
                                <CustomSwitch type="switch" id={row["dataItem"]["ndefaultstatus"]}
                                    onChange={(event) => props.setDefault(event, row["dataItem"],2,props.selectedRole.napprovalconfigrolecode,props.napprovalsubtypecode
                                                                                ,props.userInfo,props.masterData)}
                                    checked={row["dataItem"]["ndefaultstatus"] === transactionStatus.YES ? true : false}
                                    name={row["dataItem"]["ntransactionstatus"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                            </td>)}
                    />
                </Grid> */}
                <DataGrid
                    primaryKeyField={"napprovaldecisioncode"}
                    data={props.decisionData}
                    dataResult={props.decisionData}
                    dataState={{skip:0}}
                    extractedColumnList={extractedColumnList}
                    controlMap={new Map()}
                    userRoleControlRights={{}}
                    inputParam={props.inputParam}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    hideColumnFilter={true}
                    methodUrl=""
                    onSwitchChange={props.setDefault}
                    switchParam={{operation:"",flag:2,napprovalconfigrolecode:props.selectedRole.napprovalconfigrolecode,napprovalsubtypecode:props.napprovalsubtypecode,userInfo:props.userInfo,masterData:props.masterData}}
                    
                />
            </Col>
        </Row>
        </>
    )
}
export default injectIntl(DecisionStatusTab)