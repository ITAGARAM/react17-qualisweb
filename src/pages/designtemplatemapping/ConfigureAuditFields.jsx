import { LocalizationProvider } from '@progress/kendo-react-intl';
import React from 'react'
import { injectIntl} from 'react-intl'
//component commented by L.Subashini 13/12/2025 while upgrading to React 17
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
import { Tooltip } from 'react-tooltip';

import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs, { TabPane } from "rc-tabs";
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { formCode, SampleType } from '../../components/Enumeration';
import 'rc-tabs/assets/index.css';
import { Grid, GridColumn } from '@progress/kendo-react-grid';


class ConfigureAuditFields extends React.Component {
    constructor(props) {
        super(props);

        if(this.props.selectedSampleType === SampleType.Masters ){
            const  screens = [{ eventKey: 'dynamicmaster', name:this.props.formName, formcode: Object.keys(this.props.auditData)[0] }];
            let sampleColumnList =[  { "title": "IDS_AUDITOTHERACTIONCAPTURE", "field": "sampleauditfields", "width": "600px" },
                                     { "title": "IDS_AUDITEDITCAPTURE", "field": "sampleauditeditfields", "width": "600px" },
                                ];
            const  auditTable = [{ eventKey: 'dynamicmaster', name: "IDS_FIELDS" },];

            this.state = {
                screens,auditTable,
                sampleColumnList,
                extractedColumnList:sampleColumnList,
                selectedScreen: { eventKey: 'dynamicmaster', name:this.props.formName, formcode:  Object.keys(this.props.auditData)[0]},
                selectedAuditTable: { eventKey: 'dynamicmaster', name: "IDS_FIELDS", formcode: 1}
            }
        }
        else if(this.props.selectedSampleType === SampleType.GOODSIN){
            const  screens = [{ eventKey: 'goodsinsample', name:"IDS_GOODSIN", formcode: Object.keys(this.props.auditData)[0] }];
            let sampleColumnList =[  { "title": "IDS_AUDITOTHERACTIONCAPTURE", "field": "sampleauditfields", "width": "600px" },
                                     { "title": "IDS_AUDITEDITCAPTURE", "field": "sampleauditeditfields", "width": "600px" },
                                ];
            const  auditTable = [{ eventKey: 'goodsinsample', name: "IDS_FIELDS" },];

            this.state = {
                screens,auditTable,
                sampleColumnList,
                extractedColumnList:sampleColumnList,
                selectedScreen: { eventKey: 'goodsinsample', name:"IDS_GOODSIN", formcode:  Object.keys(this.props.auditData)[0]},
                selectedAuditTable: { eventKey: 'goodsinsample', name: "IDS_FIELDS", formcode: 1}
            } 
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        else if(this.props.selectedSampleType === SampleType.PROTOCOL){
            const  screens = [{ eventKey: 'protocol', name:"IDS_PROTOCOL", formcode: Object.keys(this.props.auditData)[0] }];
            let sampleColumnList =[  { "title": "IDS_AUDITOTHERACTIONCAPTURE", "field": "sampleauditfields", "width": "600px" },
                                     { "title": "IDS_AUDITEDITCAPTURE", "field": "sampleauditeditfields", "width": "600px" },
                                ];
            const  auditTable = [{ eventKey: 'protocol', name: "IDS_FIELDS" },];

            this.state = {
                screens,auditTable,
                sampleColumnList,
                extractedColumnList:sampleColumnList,
                selectedScreen: { eventKey: 'protocol', name:"IDS_GOIDS_PROTOCOLODSIN", formcode:  Object.keys(this.props.auditData)[0]},
                selectedAuditTable: { eventKey: 'protocol', name: "IDS_FIELDS", formcode: 1}
            } 
        }
        else{
            const  screens = [{ eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: formCode.SAMPLEREGISTRATION }];
            let sampleColumnList =[  { "title": "IDS_AUDITOTHERACTIONCAPTURE", "field": "sampleauditfields", "width": "600px" },
                                    { "title": "IDS_AUDITEDITCAPTURE", "field": "sampleauditeditfields", "width": "600px" },];
            
            let subSampleColumnList =[  { "title": "IDS_AUDITOTHERACTIONCAPTURE", "field": "subsampleauditfields", "width": "600px" },
                                        { "title": "IDS_AUDITEDITCAPTURE", "field": "subsampleauditeditfields", "width": "600px" },];
        

            const  auditTable = [{ eventKey: 'registration', name: "IDS_SAMPLEFIELDS" },];
            if(this.props.needSubSample){
                    auditTable.push({ eventKey: 'registrationsample', name: "IDS_SUBSAMPLEFIELDS"});
            }
            this.state = {
                screens,auditTable,
                sampleColumnList, subSampleColumnList,
                extractedColumnList:sampleColumnList,
                selectedScreen: { eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: formCode.SAMPLEREGISTRATION },
                selectedAuditTable: { eventKey: 'registration', name: "IDS_SAMPLEFIELDS", formcode: 1}
            }
        }
    }
    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
        })
    }

    onAuditTabChange = (tab) => {
        this.setState({
            selectedAuditTable: this.state.auditTable.find(screen => screen.eventKey === tab),
            extractedColumnList: tab === "registrationsample" ? this.state.subSampleColumnList : this.state.sampleColumnList
        })
    }
    render() {
      
        //console.log("props:",this.props, this.state);
        //console.log(" this.props.dataResult[this.state.selectedScreen.formcode]:", this.props.dataResult[this.state.selectedScreen.formcode]);
        return (
            <>
        {/* {this.props.selectedSampleType === SampleType.Masters ?
                    <PerfectScrollbar>
                        <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' />
                        <AtTableWrap className="at-list-table">
                            <LocalizationProvider language="lang">
                                <>
                                    
                                </>
                            </LocalizationProvider>
                        </AtTableWrap>
                        <ReactTooltip />
                    </PerfectScrollbar>        

                : */}
                <AtTabs>
                    <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                        {this.state.screens.map(screen =>//{
                       //return console.log("screen.name:", screen.name, this.props.dataResult[this.state.selectedScreen.formcode]),
                            <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                              
                              <Tabs activeKey={this.state.selectedAuditTable.eventKey} moreIcon="..." onChange={this.onAuditTabChange}>
                                    {this.state.auditTable.map(auditTable =>//{
                                        //return console.log("screen.name2:", auditTable.name, this.props.dataResult[this.state.selectedScreen.formcode][this.state.selectedAuditTable.eventKey]),
                                        <TabPane name={auditTable.eventKey} tab={this.props.intl.formatMessage({ id: auditTable.name })} key={auditTable.eventKey}>
                                        
                                        <PerfectScrollbar>
                                                {/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
                                                {/*  <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click'/>*/}
                                        
                                                {/* Tooltip component changed by L.Subashini 13/12/2025 while upgrading to React 17 */}
                                                <Tooltip  place="bottom" id="tooltip-grid-wrap" globalEventOff='click' />

                                                <AtTableWrap className="at-list-table">
                                                    <LocalizationProvider language="lang">
                                                        <>
                                                        <Grid
                                                                className={"active-paging"}
                                                                style={{ height: '550px' }}
                                                                resizable
                                                                reorderable
                                                                scrollable={"scrollable"}
                                                                data={this.props.dataResult[this.state.selectedScreen.formcode][this.state.selectedAuditTable.eventKey]}
                                                                {...this.state.dataState}
                                                                onDataStateChange={this.dataStateChange}>
                                                                <GridColumn
                                                                    field="label"
                                                                    title={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                                    cell={(row) => (
                                                                        <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]['label']} data-for="tooltip-grid-wrap">
                                                                            {row["dataItem"]['label']}
                                                                        </td>
                                                                    )}
                                                                />
                                                                {this.state.extractedColumnList.map(column =>
                                                                    <GridColumn
                                                                        field={column.field}
                                                                        title={this.props.intl.formatMessage({ id: column.title })}
                                                                        headerClassName="text-center"
                                                                        cell={(row) => (
                                                                            <td style={{ textAlign: "center" }} data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: column.title })} data-for="tooltip-grid-wrap">
                                                                                <CustomSwitch type="switch" id={row["dataItem"][column.field]}
                                                                                    onChange={(event) => this.props.onChangeToggle(event, row["dataItem"], column.field, 
                                                                                                    row.dataIndex, this.state.selectedScreen.formcode,
                                                                                                    this.props.operation)}
                                                                                    checked={row["dataItem"][column.field] || false}
                                                                                    name={row["dataItem"]["label"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                            
                                                                            
                                                                            </td>)}
                                                                    />
                                                                )}

                                                        </Grid>
                                                        </> 
                                                    
                                                    </LocalizationProvider>
                                                </AtTableWrap>
                                                  {/* component commented by L.Subashini 13/12/2025 while upgrading to React 17  */}
                                                {/* <ReactTooltip /> */}
                                                <Tooltip />
                                            </PerfectScrollbar>
                                            
                                        </TabPane>
                                        //}
                                    )}
                                </Tabs>
                                
                             </TabPane>
                             //}
                        )}
                    </Tabs>
                </AtTabs>
           {/* // }  */}
            </>
        );
    }


}
export default injectIntl(ConfigureAuditFields)