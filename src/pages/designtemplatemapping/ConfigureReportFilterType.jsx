
import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'rc-tabs/assets/index.css';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import Tabs, { TabPane } from 'rc-tabs';
import ReactTooltip from 'react-tooltip';
import { Grid,GridColumn } from '@progress/kendo-react-grid';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { LocalizationProvider } from '@progress/kendo-react-intl';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { SampleType, designProperties, formCode } from '../../components/Enumeration';
import FilterQueryBuilder from '../../components/FilterQueryBuilder';
import { toast } from 'react-toastify';
import {queryBuilderfillingColumns,getFilterConditionsBasedonDataType} from '../../components/CommonScript'
import {  Col, Card,  } from "react-bootstrap";
import {DEFAULT_RETURN} from '../../actions/LoginTypes';
import {Utils as QbUtils,} from "@react-awesome-query-builder/ui";


class ConfigureReportFilterType extends React.Component {
    constructor(props) {
        super(props);

            const screens = [{ eventKey: 'sample', name: "IDS_SAMPLE" },
            { eventKey: 'configuredfilterinputs', name: "IDS_CONFIGUREDFILTERINPUTS" }];

            let sampleColumnList = [{ "title": "IDS_FILTERFIELD", "field": "samplefiltertypefields", "width": "600px" },
            { "title": "IDS_REPORTFILTERTYPEMANDATORY", "field": "ismandatory", "width": "600px" },
            ];


            this.state = {
                screens, sampleColumnList, extractedColumnList: sampleColumnList,
                selectedScreen: { eventKey: 'sample', name: "IDS_SAMPLE" },fields:this.props.fields,
                awesomeTree:this.props.awesomeTree
                //fields:this.props.fields||[]
            }

    }

    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab),
           // awesomeTree:this.state.awesomeTree,

            //,extractedColumnList:
          //  tab==='sample'||tab==='master'?this.state.sampleColumnList:this.state.subsampleColumnList
        })
    }

    render() {

        return (
            <>
                <AtTabs>

                    <Tabs activeKey={this.state.selectedScreen.eventKey} moreIcon="..." onChange={this.onTabChange}>
                        {this.state.screens.map(screen =>//{
                            <TabPane name={screen.eventKey} tab={this.props.intl.formatMessage({ id: screen.name })} key={screen.eventKey}>
                                {this.state.selectedScreen.eventKey==='sample'&&
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
                                                    data={this.props.dataResult[this.state.selectedScreen.eventKey]?this.props.dataResult[this.state.selectedScreen.eventKey]:[]}
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
                                                                            onChange={(event) => this.onChangeReportFilterTypeFields(event, row["dataItem"], column.field,
                                                                                row.dataIndex, this.state.selectedScreen.eventKey,
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
                                    {/* <ReactTooltip /> */}
                                </PerfectScrollbar>}

                            </TabPane>
                            //}
                        )}
                    </Tabs>
                </AtTabs>
                <Col md='12'className='pb-0 mt-4'>
                      {/* <Card.Title >
                        <FormattedMessage
                          id="IDS_CONFIGUREDFILTERINPUTS" />
                      </Card.Title> */}
                      
                      {this.state.selectedScreen.eventKey==='configuredfilterinputs'&&
                <FilterQueryBuilder
                            fields={this.state.fields || {}}
                            onChange={this.onChangeAwesomeQueryBuilder}
                            tree={this.state.isRender?undefined:this.state.awesomeTree}
                            //config={this.props.awesomeConfig}
                            skip={this.props.kendoSkip||0}
                            take={this.props.kendoTake||5}
                            handlePageChange={this.props.handlePageChange}
                            gridColumns={this.props.gridColumns || []}
                            filterData={this.props.filterDataRecord}
                            onRowClick={this.props.handleKendoRowClick}
                            handleExecuteClick={this.props.handleExecuteClick}
                            userInfo={this.props.userInfo}

                            static={true}
                            isRender={this.state.isRender}
                         
                          />
                         
                       }
                        </Col>
            </>
        );
    }

    onChangeReportFilterTypeFields = (event, dataItem, field, dataIndex, formCode, operation) => {
        let   comboValues=this.state.comboValues||[];
        let count=0;
        const sampleReportFilterTypeData = this.props.sampleReportFilterTypeData
        if(field!=='ismandatory'){
        sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex],
             samplefiltertypefields: event.target.checked, }
             if(!event.target.checked){
             sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex],
                ismandatory: event.target.checked, }
             }

        sampleReportFilterTypeData.sample.map(x=>{
            if(x.samplefiltertypefields===true){
                count++
            }
        })
        if(count>this.props.settingsCount){
            sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex], samplefiltertypefields: false }
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXIMUMSELECTIONEXCEEDSFILTEERTYPE" })) 
         }else{
           // let  extractedColumnList=this.props.extractedColumnList(this.props.sampleReportFilterTypeData["sample"])
            let  extractedColumnList=queryBuilderfillingColumns(this.props.sampleReportFilterTypeData["sample"],this.props.userInfo.slanguagetypecode)
             sampleReportFilterTypeData["sample"].map(x=>{
                if(x.realData[designProperties.LISTITEM]==="combo"){
                    comboValues={...comboValues,
                        [x.realData[designProperties.LABEL][this.props.userInfo.slanguagetypecode]]:
                    [{"value":-1,"title":'NA'}]}
                }})
            let fields =getFilterConditionsBasedonDataType(extractedColumnList,comboValues);
        let data={sampleReportFilterTypeData:sampleReportFilterTypeData,fields:fields,fieldName:formCode,fieldIndex:dataIndex}
        
        this.setState({sampleReportFilterTypeData:sampleReportFilterTypeData,fields:{...fields},isRender:true,comboValues})
       this.props.childDataChange(data);
    }
    }else{
        if(sampleReportFilterTypeData[formCode][dataIndex].samplefiltertypefields===true){
            sampleReportFilterTypeData[formCode][dataIndex] = { ...sampleReportFilterTypeData[formCode][dataIndex], ismandatory: event.target.checked }
            this.setState({sampleReportFilterTypeData:sampleReportFilterTypeData})
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENABLEFIELDSFORTHISFIELD" })) 
        }
    }
    }
    onChangeAwesomeQueryBuilder = (immutableTree, config) => {
        const filterquery = QbUtils.sqlFormat(immutableTree, config);
        const filterQueryTreeStr = QbUtils.getTree(immutableTree);
        let data={awesomeTree: immutableTree, awesomeConfig: config, filterquery, filterQueryTreeStr}
        this.setState({awesomeTree: immutableTree, awesomeConfig: config, filterquery, filterQueryTreeStr,isRender:false})
        this.props.childDataChange(data);
    };
    
    componentDidUpdate(previousProps,previousState) {
        let { selectedRecord , sampleReportFilterTypeData,fields,awesomeTree
        } = this.state
        let bool = false;

        if (this.props.sampleReportFilterTypeData !== previousProps.sampleReportFilterTypeData) {
            bool = true;
            sampleReportFilterTypeData = this.props.sampleReportFilterTypeData || {};
        }
        if (this.props.fields !== previousProps.fields) {
            bool = true;
            fields = this.props.fields || {};
        }
        if (this.props.awesomeTree !== previousProps.awesomeTree) {
            bool = true;
            awesomeTree = this.props.awesomeTree || {};
        }
        if (this.state.awesomeTree !== previousState.awesomeTree) {
            bool = true;
            awesomeTree = this.state.awesomeTree || {};
        }
        if (bool) {
            this.setState({
                selectedRecord ,sampleReportFilterTypeData,fields,awesomeTree
            });
        }
    }

}
export default injectIntl(ConfigureReportFilterType)