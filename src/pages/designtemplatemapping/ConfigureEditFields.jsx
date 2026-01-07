import { LocalizationProvider } from '@progress/kendo-react-intl';
import React from 'react'
import { injectIntl,FormattedMessage } from 'react-intl'
// import ReactTooltip from 'react-tooltip';
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import {  ReadOnlyText } from '../../components/App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Tabs, { TabPane } from "rc-tabs";
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { formCode, SampleType } from '../../components/Enumeration';
import 'rc-tabs/assets/index.css';
import { Col, Row ,Card} from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

class ConfigureEditFields extends React.Component {
    constructor(props) {
        super(props);

        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        const  screens = [];

            if(this.props.selectedSampleType === SampleType.PROTOCOL){
                screens.push({ eventKey: 'protocol', name: "IDS_PROTOCOL", formcode: formCode.PROTOCOL });
            }else{
                screens.push({ eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: formCode.SAMPLEREGISTRATION });
            }
           
           
        
        // if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedjoballocation === true)  {
        //     screens.push({ eventKey: 'joballocation', name: "IDS_JOBALLOCATION", formcode: formCode.JOBALLOCATION });
        // }

        // if (this.props.approvedRegSubTypeVersion && this.props.approvedRegSubTypeVersion.jsondata.nneedmyjob === true) {
        //     screens.push({ eventKey: 'myjobs', name: "IDS_MYJOBS", formcode: formCode.MYJOBS });
        // }

        // screens.push({ eventKey: 'resultentry', name: "IDS_RESULTENTRY", formcode: formCode.RESULTENTRY },
        //             { eventKey: 'approval', name: "IDS_APPROVAL", formcode: formCode.APPROVAL });

        let extractedColumnList =[];
        if (this.props.selectedTemplateType === SampleType.Masters){
            extractedColumnList.push(              
                { "title": "IDS_GRIDITEM", "field": "griditem", "width": "600px" },
                { "title": "IDS_GRIDMOREITEM", "field": "gridmoreitem", "width": "600px" }
            );
        }
        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
        if (this.props.selectedSampleType === SampleType.PROTOCOL){
            extractedColumnList.push(              
                { "title": "IDS_LISTITEM", "field": "listItem", "width": "600px" },
                { "title": "IDS_DISPLAYFIELDS", "field": "displayFields", "width": "600px" }
            );
        }
        else{
            extractedColumnList.push(
                { "title": "IDS_EDITABLESTATUS", "field": "editablestatus", "width": "600px" },
               
            );
        }
          
       
        
        this.state = {
            screens,
            extractedColumnList,
           // selectedScreen: { eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: 43 }
           //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
            selectedScreen: this.props.selectedSampleType === SampleType.PROTOCOL ?
                            { eventKey: 'protocol', name: "IDS_PROTOCOL", formcode: formCode.PROTOCOL } : 
                            { eventKey: 'registration', name: "IDS_SAMPLEREGISTRATION", formcode: 43 }
        }
    }
    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
        })
    }



    render() {

        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025

        let dataResult ={};
        if(this.props.selectedSampleType === SampleType.PROTOCOL){
            dataResult = this.props.dataResult;
        }else {
            dataResult = this.props.dataResult[this.state.selectedScreen.formcode];
        }  
      
        //console.log("props:",this.props)
        //console.log(" this.props.dataResult[this.state.selectedScreen.formcode]:", this.props.dataResult[this.state.selectedScreen.formcode]);
        return (
            <>
            {this.props.selectedTemplateType === SampleType.Masters  ?
                    <PerfectScrollbar>
                        {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                        <AtTableWrap className="at-list-table">
                            <LocalizationProvider language="lang">
                                <>
                                    
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
                                            {/* <>
                                            <Grid
                                                    className={"active-paging"}
                                                    style={{ height: '550px' }}
                                                    resizable
                                                    reorderable
                                                    scrollable={"scrollable"}
                                                    // pageable={{ buttonCount: 5, pageSizes: 4, previousNext: false }}
                                                    data={this.props.dataResult[this.state.selectedScreen.formcode]}
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
                                                                    {/* <CustomSwitch type="switch" id={row["dataItem"][column.field]}
                                                                        onChange={(event) => this.props.onChangeToggle(event, row["dataItem"], column.field, row.dataIndex, this.state.selectedScreen.formcode,this.props.operation)}
                                                                        checked={row["dataItem"][column.field] || false}
                                                                        name={row["dataItem"]["label"] + "_" + row.dataIndex + "_" + row.columnIndex} />
                                                                 */}
                                                                    {/* <FormMultiSelect
                                                                            name={row["dataItem"]["label"]}
                                                                            options={row["dataItem"][column.field] || []}
                                                                            optionId={"ntransactionstatus"}
                                                                            optionValue={"stransdisplaystatus"}
                                                                            value={this.props.selectedRecord  && this.props.selectedRecord[this.state.selectedScreen.formcode] ? this.props.selectedRecord[this.state.selectedScreen.formcode][row["dataItem"]["label"]]  || []: []}
                                                                            isMandatory={false}
                                                                            isClearable={true}
                                                                            disableSearch={false}
                                                                            disabled={false}
                                                                            closeMenuOnSelect={false}
                                                                            alphabeticalSort={true}
                                                                            onChange={(event) => this.props.onComboChange(event, this.state.selectedScreen.formcode, row["dataItem"])}
                                                                    />
                                                                </td>)}
                                                        />
                                                    )}

                                            </Grid> */}
                                            {/* </>  */}
                                            <Card className="border-0">
                                               
                                                <Card.Header>
                                                    <Row>
                                                            <Col md={6}>
                                                                <ReadOnlyText>
                                                                    <FormattedMessage id="IDS_FIELDS" message="Fields" />
                                                                </ReadOnlyText>
                                                            </Col>
                                                            <Col md={6}>
                                                                <ReadOnlyText>
                                                                    <FormattedMessage id="IDS_EDITABLESTATUS" message="Editable Status" />
                                                                </ReadOnlyText>
                                                            </Col>
                                                    </Row>
                                                    </Card.Header>
                                                     <Card.Body>

                                                    {/*Added by sonia on 11th NOV 2024 for jira id:ALPD-5025*/}
                                                    {dataResult.map((item, index)=>
                                                                                           
                                                        <Row>
                                                            <Col md={6}>
                                                            {/* <FormGroup> */}
                                                            <ReadOnlyText> {item.label} </ReadOnlyText> 
                                                            
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormMultiSelect
                                                                        name={item.label}
                                                                        //label={this.props.intl.formatMessage({ id: item.label + "_" + index})}
                                                                        options={item.editablestatus || []}
                                                                        optionId={"ntransactionstatus"}
                                                                        optionValue={"stransdisplaystatus"}


                                                                        //Added by sonia on 11th NOV 2024 for jira id:ALPD-5025
                                                                        value = { this.props.selectedSampleType === SampleType.PROTOCOL ? 
                                                                            this.props.selectedRecord ? this.props.selectedRecord[item.label]  || []: []
                                                                                : this.props.selectedRecord && this.props.selectedRecord[this.state.selectedScreen.formcode] 
                                                                            ? this.props.selectedRecord[this.state.selectedScreen.formcode][item.label]  || []: []

                                                                        }


                                                                        // value={this.props.selectedRecord 
                                                                        //      && this.props.selectedRecord 
                                                                        //      ? this.props.selectedRecord[item.label]  || []: []}
                                                                        isMandatory={false}
                                                                        isClearable={true}
                                                                        disableSearch={false}
                                                                        disabled={false}
                                                                        closeMenuOnSelect={false}
                                                                        alphabeticalSort={true}
                                                                        onChange={(event) => this.props.onComboChange(event, this.state.selectedScreen.formcode, item)}
                                                                /> 
                                                                {/* </FormGroup> */}
                                                             </Col>
                                                        </Row>
                                                            )
                                                        }
                                                    </Card.Body> 
                                                </Card>
                                              
                                            
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
export default injectIntl(ConfigureEditFields)