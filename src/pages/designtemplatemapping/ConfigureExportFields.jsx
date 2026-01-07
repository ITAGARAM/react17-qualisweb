
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
import { SampleType, formCode } from '../../components/Enumeration';

class ConfigureExportFields extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.selectedSampleType === SampleType.Masters) {
            const screens = [{ eventKey: 'master', name: this.props.formName }];

            let sampleColumnList = [{ "title": "IDS_EXPORTFIELDS", "field": "sampleexportfields", "width": "600px" },
            ];

            this.state = {
                screens, sampleColumnList, extractedColumnList: sampleColumnList,
                selectedScreen: { eventKey: 'master', name: this.props.formName }
            }

        } else if(this.props.selectedSampleType === SampleType.GOODSIN) {
            const screens = [{ eventKey: 'master', name: "IDS_GOODSIN" }];

            let sampleColumnList = [{ "title": "IDS_EXPORTFIELDS", "field": "sampleexportfields", "width": "600px" },
            ];

            this.state = {
                screens, sampleColumnList, extractedColumnList: sampleColumnList,
                selectedScreen: { eventKey: 'master', name: "IDS_GOODSIN" }
            }
        } 
        else {
            const screens = [{ eventKey: 'sample', name: "IDS_SAMPLE" }];

            let sampleColumnList = [{ "title": "IDS_EXPORTFIELDS", "field": "sampleexportfields", "width": "600px" },
            ];

            if (this.props.needSubSample||this.props.selectedSampleType === SampleType.STABILITY) {
                screens.push({ eventKey: 'subsample', name: "IDS_SUBSAMPLE" });
            }

            this.state = {
                screens, sampleColumnList, extractedColumnList: sampleColumnList,
                selectedScreen: { eventKey: 'sample', name: "IDS_SAMPLE" }
            }


        }
    }

    onTabChange = (tab) => {
        this.setState({
            selectedScreen: this.state.screens.find(screen => screen.eventKey === tab)
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
                                                                            onChange={(event) => this.props.onChangeToggle(event, row["dataItem"], column.field,
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
                                </PerfectScrollbar>

                            </TabPane>
                            //}
                        )}
                    </Tabs>
                </AtTabs>
            </>
        );
    }
}
export default injectIntl(ConfigureExportFields)