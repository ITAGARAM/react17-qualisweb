import React from 'react';
import {
    Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartTooltip,
    ChartYAxis, ChartYAxisItem
} from '@progress/kendo-react-charts';
import { PDFExport } from "@progress/kendo-react-pdf";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Nav, Row } from 'react-bootstrap';
import { ProductList } from '../../../pages/product/product.styled';
import { ReactComponent as ChartRefresh } from '../../../assets/image/chart-refresh.svg';
import { injectIntl } from 'react-intl';
import '../../../assets/styles/dashboard.css';
import 'hammerjs';
import { designComponents } from '../../../components/Enumeration';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Breadcrumb } from 'react-bootstrap';
import { convertDatetoStringByTimeZone } from '../../../components/CommonScript';
import { Attachments } from '../../../components/dropzone/dropzone.styles';



class BubbleChart extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}

        }
    }
    exportPDF = () => {
        this.pdfExportComponent.save();
    }
    BreadcrumDesign(viewDashBoardDesignConfigList) {
        let breadCrumValue = "";
        let arryalist = [];
        let selectedRecord = this.props.selectedRecord || {}
        
        viewDashBoardDesignConfigList.forEach(item => {

            if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                breadCrumValue = selectedRecord ? selectedRecord[item.sfieldname] ? convertDatetoStringByTimeZone(this.props.userInfo, selectedRecord[item.sfieldname]) :
                    convertDatetoStringByTimeZone(this.props.userInfo, new Date(item.dataList[0])) : convertDatetoStringByTimeZone(this.props.userInfo, new Date(item.dataList[0]));
            }
            else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                let listvalue = [];
                if (selectedRecord && selectedRecord[item.sfieldname]) {
                    listvalue.push({ [item.sdisplaymember]: selectedRecord[item.sfieldname].label })
                } else {
                    listvalue = item.dataList.filter(lst => {
                        return lst[item.sfieldname] === parseInt(item.sdefaultvalue);
                    });
                }

                breadCrumValue = listvalue[0][item.sdisplaymember];
            }else if (item.ndesigncomponentcode === designComponents.USERINFO) {
                let listvalue = [];
                //commenting now for restricting breadcrumbs
                // if(selectedRecord && selectedRecord[item.sfieldname]) {
                //     listvalue.push({ [item.sfieldname]: selectedRecord[item.sfieldname] })
                // }else{
                //     listvalue.push({ [item.sfieldname]: this.props.userInfo && this.props.userInfo[item.sfieldname] })
                // }
                //breadCrumValue = listvalue && listvalue.length > 0 ? listvalue[0][item.sfieldname] : "-";
               breadCrumValue = listvalue && listvalue.length == 0 ? "" : "-";
            }
            else {
                breadCrumValue = selectedRecord ? selectedRecord[item.sfieldname] ? selectedRecord[item.sfieldname] : item.sdefaultvalue : item.sdefaultvalue;
            }
            if(item.ndesigncomponentcode !== designComponents.USERINFO){
                arryalist.push({ "label": item.sdisplayname, "value": breadCrumValue });
            }
           
        });


        return (
            < Row >
                <Col md={12} className="p-0">
                    < ScrollContainer className="breadcrumbs-scroll-container">
                        <Breadcrumb className="filter-breadcrumbs">
                            {arryalist.map((item, index) =>
                                <Breadcrumb.Item key={index}>
                                    <span>{item["label"]}{" "}:{" "}</span>
                                    <span>{item["value"]}</span>
                                </Breadcrumb.Item>
                            )}
                        </Breadcrumb>
                    </ScrollContainer>
                </Col >
            </Row >
        )

    }

    render() {
        let Series = [];
        // const labelContent = (props) => {
        //     return `${props.dataItem}`;
        // }

        // if (this.props.bubbleSeries !== undefined) {
        //     this.props.bubbleSeries.map(item => {
        //         Series.push(
        //         <ChartSeriesItem type="bubble" data={item.Series} name={item.yField} color={item.colors} aggregate="count" stack={this.props.chartTypeName === 'area' ? true : false}
        //         />               
        //         );
        //         return null;
        //     })color={item.colorFill}

        // }
        if (this.props.bubbleSeries !== undefined) {
            this.props.bubbleSeries.forEach(item => {
                Series.push(<ChartSeriesItem type="bubble" data={this.props.chartData} xField={item.xFieldBubble} yField={item.ySeriesBubble} sizeField={item.sizeSeriesBubble}
                    categoryField={item.categorySeriesBubble} name={item.sizeSeriesBubbleForLegend} color={item.colorFill} />);
            });
        }

        return (
            <>

                {this.props.viewDashBoardDesignConfigList &&
                    this.BreadcrumDesign(this.props.viewDashBoardDesignConfigList)
                }
                <Row>
                    <Col md={8} >
                        <h4 hidden={this.props.hiddenExport} className="text-left">{this.props.masterData.selectedDashBoardTypes && this.props.masterData.selectedDashBoardTypes.sdashboardtypename}</h4>
                    </Col>
                    <Col md={4} >
                        <ProductList className="d-inline dropdown badget_menu d-flex justify-content-end ">
                            <Nav.Link

                                className="btn btn-circle outline-grey mr-2" hidden={this.props.hiddenParam}
                                title={"ChartRefresh"}
                                onClick={() => this.props.checkParametersAvailable(this.props.masterData.selectedDashBoardTypes, this.props.userInfo, this.props.masterData,
                                    this.props.dashBoardTypeNo, this.props.templateCode)} >
                                <ChartRefresh className="custom_icons" width="20" height="20" style={{ marginLeft: '0.35rem' }} />

                            </Nav.Link>
                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#" hidden={this.props.hiddenExport}
                            >
                                <FontAwesomeIcon icon={faFilePdf} className="ActionIconColor"
                                    onClick={() => this.exportPDF()} />
                            </Nav.Link>
                        </ProductList>
                    </Col>
                </Row>


                {this.props.bubbleSeries && this.props.bubbleSeries.length > 0 ?
                    <PDFExport
                        ref={component => (this.pdfExportComponent = component)}
                        paperSize="auto"
                        margin={40}
                    >

                        <Chart pannable={true} zoomable={true} style={this.props.style}>
                            <ChartSeries>
                                {Series}
                            </ChartSeries>
                            <ChartLegend position="bottom" orientation="horizontal" />
                            <ChartYAxis>
                                <ChartYAxisItem labels={{ format: '{0:N0}' }} />
                            </ChartYAxis>

                            <ChartTooltip format="{3}: {2:N0}" opacity={1} />
                        </Chart>


                    </PDFExport>
                    :
                    <Attachments className="norecordchart">
                        {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                    </Attachments>
                }

            </>

        );
    }

}

export default injectIntl(BubbleChart);