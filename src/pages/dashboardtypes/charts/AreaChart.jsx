import React from 'react';
import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
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
import { convertDatetoStringByTimeZone, rearrangeDateFormat } from '../../../components/CommonScript'
import ScrollContainer from 'react-indiana-drag-scroll';
import { Breadcrumb } from 'react-bootstrap';
import { Attachments } from '../../../components/dropzone/dropzone.styles';


// const mapStateToProps = state => {
//     return ({ Login: state.Login })
// }


class AreaChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}
        }
    }
    exportPDF = () => {
        this.pdfExportComponent.save();
    }

    breadcrumDesign(viewDashBoardDesignConfigList) {
        let breadCrumValue = "";
        let arryalist = [];
        let selectedRecord = this.props.selectedRecord || {}
        
        viewDashBoardDesignConfigList.forEach(item => {

            if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                let date = rearrangeDateFormat(this.props.userInfo,item.dataList[0])
                breadCrumValue = selectedRecord ? selectedRecord[item.sfieldname] ? convertDatetoStringByTimeZone(this.props.userInfo, selectedRecord[item.sfieldname]) :
                    convertDatetoStringByTimeZone(this.props.userInfo, date) : convertDatetoStringByTimeZone(this.props.userInfo, date);
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

                breadCrumValue = listvalue && listvalue.length > 0 ? listvalue[0][item.sdisplaymember] : "-";
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
        const labelContent = (props) => {
            return `${props.dataItem === null ? 0 : props.dataItem}`;
        }

        if (this.props.ySeries !== undefined) {
            this.props.ySeries.map(item => {
                Series.push(
                    <ChartSeriesItem type={this.props.chartTypeName}
                        line={{ style: "smooth" }}
                        data={item.Series}
                        name={item.yField}
                        color={item.colors} 
                        aggregate="count"
                        stack={this.props.chartTypeName === 'area' ? true : false}
                        labels={this.props.chartTypeName !== 'area' ?
                            { visible: true, content: labelContent, position: "center" } : {}}
                        gap={1.5}
                        overlay={false}
                    />);
                return null;            })
        }
        return (
            <>
                {/* {this.props.viewDashBoardDesignConfigList &&
                    this.breadcrumDesign(this.props.viewDashBoardDesignConfigList)
                } */}
                <Row>
                    <Col md={8} >
                        {/* <h4 hidden={this.props.hiddenExport} className="text-left">
                            {this.props.masterData.selectedDashBoardTypes && 
                            this.props.masterData.selectedDashBoardTypes.sdashboardtypename}
                        </h4> */}
                        <h4 className="text-left">
                            {this.props.isStaticDashBoard ? this.props.staticTitle : this.props.dashBoardType.selectedDashBoardTypes
                                && this.props.dashBoardType.selectedDashBoardTypes.sdashboardtypename}
                        </h4>
                    </Col>
                    <Col md={4} >
                        <ProductList className="d-inline dropdown badget_menu d-flex justify-content-end ">
                            <Nav.Link
                                //className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="#"
                                className="btn btn-circle outline-grey mr-2"
                                hidden={this.props.hiddenParam}
                                //title={"ChartRefresh"}
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESHCHART" })}
                                onClick={(e) => this.props.checkParametersAvailable(this.props.dashBoardType.selectedDashBoardTypes, this.props.userInfo, this.props.masterData,
                                    this.props.dashBoardTypeNo, this.props.templateCode)} >
                                <ChartRefresh className="custom_icons" width="20" height="20" style={{ marginLeft: '0.35rem' }} />

                            </Nav.Link>
                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                href="#" hidden={this.props.hiddenExport}
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADPDF" })}
                            >
                                <FontAwesomeIcon icon={faFilePdf} className="ActionIconColor"
                                    onClick={() => this.exportPDF()} />
                            </Nav.Link>
                        </ProductList>
                    </Col>
                </Row>

                {this.props.dashBoardType.viewDashBoardDesignConfigList &&
                    this.breadcrumDesign(this.props.dashBoardType.viewDashBoardDesignConfigList)
                }

                {this.props.ySeries && this.props.ySeries.length > 0 ?
                    <PDFExport
                        ref={component => (this.pdfExportComponent = component)}
                        paperSize="auto"
                        margin={40} >
                        <Chart pannable={true} zoomable={false} style={this.props.style}>
                            <ChartTooltip />

                            <ChartLegend position="bottom" orientation="horizontal" />
                            <ChartCategoryAxis>
                                <ChartCategoryAxisItem labels={{ rotation: "auto" }}
                                    //labels={{ visible: true, content: labelContent }}
                                    categories={this.props.xSeries} />
                            </ChartCategoryAxis>

                            <ChartSeries>
                                {Series}
                            </ChartSeries>
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

export default injectIntl(AreaChart);