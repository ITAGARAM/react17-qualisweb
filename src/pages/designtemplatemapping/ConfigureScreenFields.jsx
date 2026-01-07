import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import React from 'react'
import { injectIntl } from 'react-intl'
import 'rc-tabs/assets/index.css';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';

import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs, { TabPane } from "rc-tabs";
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { formCode, SampleType } from '../../components/Enumeration';

class ConfigureScreenFields extends React.Component {
    constructor(props) {
        super(props);
        
        if(this.props.selectedSampleType !== SampleType.STABILITY){
        const  screens = [{ eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: formCode.SAMPLEREGISTRATION }];
        if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedjoballocation === true)  {
            screens.push({ eventKey: 'joballocation', name: "IDS_JOBALLOCATION", formcode: formCode.JOBALLOCATION });
        }

        if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedmyjob === true) {
            //screens.push({ eventKey: 'myjobs', name: "IDS_MYJOBS", formcode: formCode.MYJOBS });
            screens.push({ eventKey: 'testwisemyjobs', name: "IDS_MYJOBS", formcode: formCode.TESTWISEMYJOBS });
        }

        if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedworklist === true)  {
            screens.push({ eventKey: 'worklist', name: "IDS_WORKLIST", formcode: formCode.WORKLIST });
        }
        if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedbatch === true)  {
            screens.push({ eventKey: 'batchcreation', name: "IDS_BATCHCREATION", formcode: formCode.BATCHCREATION });
        }

        screens.push({ eventKey: 'resultentry', name: "IDS_RESULTENTRY", formcode: formCode.RESULTENTRY },
                    { eventKey: 'approval', name: "IDS_APPROVAL", formcode: formCode.APPROVAL },
                    { eventKey: 'release', name: "IDS_RELEASE", formcode: formCode.RELEASE },
                    );

        // let extractedColumnList =[];
        // if (this.props.selectedSampleType === SampleType.Masters || this.props.selectedSampleType === SampleType.GOODSIN){
        //     extractedColumnList.push(              
        //         { "title": "IDS_GRIDITEM", "field": "griditem", "width": "600px" },
        //         { "title": "IDS_GRIDMOREITEM", "field": "gridmoreitem", "width": "600px" }
        //     );
        // }
        // else{
        //     if(this.props.operation === 'configuresubsample'){
        //     //if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedsubsample === true) {
        //         extractedColumnList.push(
        //             { "title": "IDS_LISTITEM", "field": "subsamplelistitem", "width": "600px" },
        //         );
        //     }
        //     else
        //     {
        //         extractedColumnList.push(
        //             { "title": "IDS_DISPLAYFIELDS", "field": "sampledisplayfields", "width": "600px" },
        //             { "title": "IDS_LISTITEM", "field": "samplelistitem", "width": "600px" },
        //             // { "title": "IDS_LISTMOREITEM", "field": "samplelistmoreitems", "width": "600px" },
        //             { "title": "IDS_GRIDITEM", "field": "samplegriditem", "width": "600px" },
        //             { "title": "IDS_GRIDMOREITEM", "field": "samplegridmoreitem", "width": "600px" },
        //             { "title": "IDS_FILTERITEM", "field": "samplefilteritem", "width": "600px" }
        //         );
        //     }
        // }
        this.state = {
            screens,
            //extractedColumnList,
            selectedScreen: { eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: formCode.SAMPLEREGISTRATION }
        }
    }else{
        const  screens = [{ eventKey: 'stability', name: "IDS_STABILITYSTUDYPLAN", formcode: formCode.STUDYALLOCATION }];
        this.state = {
            screens,
            selectedScreen: { eventKey: 'stability', name: "IDS_STABILITYSTUDYPLAN", formcode: formCode.STUDYALLOCATION }
    }
    }
    }
    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
        })
    }
    render() {
        //console.log("props:",this.props, this.state.screens, this.state.selectedScreen);
        let extractedColumnList =[];
        if (this.props.selectedSampleType === SampleType.Masters || this.props.selectedSampleType === SampleType.GOODSIN){
            extractedColumnList.push(              
                { "title": "IDS_GRIDITEM", "field": "griditem", "width": "600px" },
                { "title": "IDS_GRIDMOREITEM", "field": "gridmoreitem", "width": "600px" }
            );
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
       else if (this.props.selectedSampleType === SampleType.PROTOCOL){
            extractedColumnList.push(              
                { "title": "IDS_LISTITEM", "field": "listItem", "width": "600px" },
                { "title": "IDS_DISPLAYFIELDS", "field": "displayFields", "width": "600px" }
            );
        }
        else{
            if(this.props.operation === 'configuresubsample'){
            //if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedsubsample === true) {
                extractedColumnList.push(
                    { "title": "IDS_LISTITEM", "field": "subsamplelistitem", "width": "600px" },
                );
            }
            else
            {
                extractedColumnList.push(
                    { "title": "IDS_DISPLAYFIELDS", "field": "sampledisplayfields", "width": "600px" },
                    { "title": "IDS_LISTITEM", "field": "samplelistitem", "width": "600px" },
                    // { "title": "IDS_LISTMOREITEM", "field": "samplelistmoreitems", "width": "600px" },
                    { "title": "IDS_GRIDITEM", "field": "samplegriditem", "width": "600px" },
                    { "title": "IDS_GRIDMOREITEM", "field": "samplegridmoreitem", "width": "600px" },
                );
                if(this.state.selectedScreen.formcode !== formCode.RELEASE ){
                    extractedColumnList.push({ "title": "IDS_FILTERITEM", "field": "samplefilteritem", "width": "600px" })
                }
            }
        }

        return (
            <>
            {/* Added by sonia on 11th NOV 2024 for jira id:ALPD-5025 */}
            {this.props.selectedSampleType === SampleType.Masters || this.props.selectedSampleType === SampleType.GOODSIN 
            || this.props.selectedSampleType === SampleType.PROTOCOL ?
                    <PerfectScrollbar>
                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                        <AtTableWrap className="at-list-table">
                            <LocalizationProvider language="lang">
                                <>
                                    <Grid
                                        className={"active-paging"}
                                        style={{ height: '550px' }}
                                        resizable
                                        reorderable
                                        scrollable={"scrollable"}
                                        // pageable={{ buttonCount: 5, pageSizes: 4, previousNext: false }}
                                        data={this.props.dataResult}
                                        {...this.state.dataState}
                                        onDataStateChange={this.dataStateChange}>
                                        <GridColumn
                                            field="label"
                                            // columnMenu={ColumnMenu}
                                            title={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                            cell={(row) => (
                                                <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]['label']} 
                                                //data-for="tooltip-grid-wrap"
                                                >
                                                    {row["dataItem"]['label']}
                                                </td>
                                            )}
                                        />
                                        {//this.state.
                                        extractedColumnList.map(column =>
                                            <GridColumn
                                                field={column.field}
                                                title={this.props.intl.formatMessage({ id: column.title })}
                                                headerClassName="text-center"
                                                cell={(row) => (
                                                    <td style={{ textAlign: "center" }} data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: column.title })} 
                                                    //data-for="tooltip-grid-wrap"
                                                    >
                                                        <CustomSwitch type="switch" id={row["dataItem"][column.field]}
                                                            onChange={(event) => this.props.onChangeToggle(event, row["dataItem"], column.field, row.dataIndex)}
                                                            checked={row["dataItem"][column.field] || false}
                                                            name={row["dataItem"]["label"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                    </td>)}
                                            />
                                        )}

                                    </Grid>
                                </>
                            </LocalizationProvider>
                        </AtTableWrap>
                        {/* <ReactTooltip /> */}
                    </PerfectScrollbar>        

                :
                <AtTabs>
                    <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                        {this.state.screens.map(screen =>
                            <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                                <PerfectScrollbar>
                                    {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                                    <AtTableWrap className="at-list-table">
                                        <LocalizationProvider language="lang">
                                            <>
                                                <Grid
                                                    className={"active-paging"}
                                                    //style={{ height: '550px' }}
                                                    resizable
                                                    reorderable
                                                    scrollable={"scrollable"}
                                                    // pageable={{ buttonCount: 5, pageSizes: 4, previousNext: false }}
                                                    data={this.props.dataResult[this.state.selectedScreen.formcode]}
                                                    {...this.state.dataState}
                                                    onDataStateChange={this.dataStateChange}>
                                                    <GridColumn
                                                        field="label"
                                                        // columnMenu={ColumnMenu}
                                                        title={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                        cell={(row) => (
                                                            <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"]['label']}
                                                            // data-for="tooltip-grid-wrap"
                                                            >
                                                                {row["dataItem"]['label']}
                                                            </td>
                                                        )}
                                                    />
                                                    {//this.state.
                                                    extractedColumnList.map(column =>
                                                        <GridColumn
                                                            field={column.field}
                                                            title={this.props.intl.formatMessage({ id: column.title })}
                                                            headerClassName="text-center"
                                                            cell={(row) => (
                                                                <td style={{ textAlign: "center" }} data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: column.title })} data-for="tooltip-grid-wrap">
                                                                   <CustomSwitch type="switch" id={row["dataItem"][column.field]}
                                                                        onChange={(event) => this.props.onChangeToggle(event, row["dataItem"], column.field, row.dataIndex, this.state.selectedScreen.formcode,this.props.operation)}
                                                                        checked={row["dataItem"][column.field] || false}
                                                                        //checked={column.field === "samplelistitem" ? (row["dataItem"][column.field] === "none" ? false :row["dataItem"][column.field]) : (row["dataItem"][column.field] || false)}
                                                                        //disabled={column.field === "samplelistitem" ? (row["dataItem"][column.field] === "none" ? true : false):false}
                                                                        name={row["dataItem"]["label"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                       
                                                                </td>)}
                                                        />
                                                    )}

                                                </Grid>
                                            </>
                                        </LocalizationProvider>
                                    </AtTableWrap>
                                    {/* <ReactTooltip /> */}
                                </PerfectScrollbar>
                            </TabPane>
                        )}
                    </Tabs>
                </AtTabs>
            }
            </>
        );
    }
}
export default injectIntl(ConfigureScreenFields)