import React from 'react';
import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartTooltip, ChartSeriesLabels } from '@progress/kendo-react-charts';
import { PDFExport } from "@progress/kendo-react-pdf";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Col, Nav, Row } from 'react-bootstrap';
import { ProductList } from '../../../pages/product/product.styled';
import { ReactComponent as ChartRefresh } from '../../../assets/image/chart-refresh.svg';
import { injectIntl } from 'react-intl';
import { convertDatetoStringByTimeZone, rearrangeDateFormat } from '../../../components/CommonScript';
import ScrollContainer from 'react-indiana-drag-scroll';
import { designComponents } from '../../../components/Enumeration';
import { toast } from 'react-toastify';
import { Attachments } from '../../../components/dropzone/dropzone.styles';

// const mapStateToProps = state => {
//     return ({ Login: state.Login })
// }

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {}
        }
    }

    exportPDF = () => {
        this.pdfExportComponent ? this.pdfExportComponent.save()
            : toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
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
            }
            else if (item.ndesigncomponentcode === designComponents.USERINFO) {
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
        // console.log("data:", arryalist);

        return (

            < Row >
                <Col md={12} className="p-0">
                    {arryalist.length > 0 ?
                        < ScrollContainer className="breadcrumbs-scroll-container">
                            <Breadcrumb className="filter-breadcrumbs">
                                {arryalist.map((item, index) =>
                                    <Breadcrumb.Item key={index}>
                                        <span>{item["label"]}{" "} {" "}</span>
                                        <span>{item["value"]}</span>
                                    </Breadcrumb.Item>
                                )}
                            </Breadcrumb>
                        </ScrollContainer> : ""}
                </Col >
            </Row >
        )

    }


    render() {
        // console.log("pt:", this.props);
        const labelContent = (props) => {
            return `${props.category} : ${props.value}`;
        }
        const renderTooltip = (context) => {
            const { category, value } = context.point || context;
            return (<div>{category}: {value}</div>);
        };
        // let breadCrumValue = "";
        // let arryalist = []
        // this.props.viewDashBoardDesignConfigList && this.props.viewDashBoardDesignConfigList.forEach(item => {

        //     if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
        //         breadCrumValue = this.covertDatetoString(new Date(item.dataList[0]));
        //     }
        //     else if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
        //         let listvalue = item.dataList.filter(lst => {
        //             return lst[item.sfieldname] === parseInt(item.sdefaultvalue);
        //         });
        //         breadCrumValue = listvalue && listvalue.length > 0? listvalue[0][item.sdisplaymember]: "";
        //     }
        //     else {
        //         breadCrumValue = item.sdefaultvalue;
        //     }
        //     arryalist.push({ "label": item.sdisplayname, "value": breadCrumValue });
        // })


        return (
            <>
                {//this.props.filterParam && 
                    // this.props.masterData.viewDashBoardDesignConfigList && this.props.selectedRecord &&
                    //     <Row>
                    //         <Col md={12} className="p-0">
                    //             <ScrollContainer className="breadcrumbs-scroll-container">
                    //                 <Breadcrumb className="filter-breadcrumbs">
                    //                     {//this.props.filterParam
                    //                     this.props.viewDashBoardDesignConfigList.map((param, index) =>
                    //                         <Breadcrumb.Item key={index}>
                    //                             <span>{param.sdisplayname}{" "}:{" "}</span>
                    //                             <span>{this.getValueByComponent(param, this.props.selectedRecord[param.sfieldname])}</span>
                    //                         </Breadcrumb.Item>
                    //                     )}
                    //                 </Breadcrumb>
                    //             </ScrollContainer>
                    //         </Col>
                    //     </Row>
                }


                {/* {this.props.dashBoardType.viewDashBoardDesignConfigList &&
                    this.breadcrumDesign(this.props.dashBoardType.viewDashBoardDesignConfigList)
                }  */}

                <Row className="p-2">
                    <Col md={8} >
                        {/* <h4 hidden={this.props.hiddenExport} className="text-left"> */}
                        <h4 className="text-left">
                            {this.props.isStaticDashBoard ? this.props.staticTitle : this.props.dashBoardType.selectedDashBoardTypes
                                && this.props.dashBoardType.selectedDashBoardTypes.sdashboardtypename}
                        </h4>
                    </Col>
                    <Col md={4} >
                        <ProductList className="d-inline dropdown badget_menu d-flex justify-content-end">
                            <Nav.Link
                                //className="btn btn-circle outline-grey mr-2 action-icons-wrap" 
                                href="#"
                                className="btn btn-circle outline-grey mr-2"
                                hidden={this.props.hiddenParam}
                                // title={"ChartRefresh"}
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESHCHART" })}
                                onClick={(e) => this.props.checkParametersAvailable(this.props.dashBoardType.selectedDashBoardTypes, this.props.userInfo, this.props.masterData,
                                    this.props.dashBoardTypeNo, this.props.templateCode)} >
                                <ChartRefresh className="custom_icons" width="20" height="20" style={{ marginLeft: '0.35rem' }} />

                            </Nav.Link>
                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADPDF" })}
                                href="#" hidden={this.props.hiddenExport}
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
                {
                    this.props.series && this.props.series.length > 0 ?
                        <PDFExport
                            ref={component => (this.pdfExportComponent = component)}
                            paperSize="auto"
                            margin={40}
                        >
                            {this.props.chartTypeName === "pie" ?

                                <Chart style={this.props.style} >
                                    <ChartTooltip render={renderTooltip} />
                                    <ChartLegend position="bottom" />
                                    <ChartSeries>
                                        <ChartSeriesItem autoFit="autofit"
                                            type="pie"
                                            data={this.props.series}
                                            field={this.props.valueField}
                                            categoryField={this.props.categoryField}
                                            labels={{ visible: true, content: labelContent }}
                                            overlay={{ gradient: "roundedBevel" }}
                                        />
                                    </ChartSeries>
                                </Chart>

                                :

                                <Chart style={this.props.style} onSeriesClick={(item) => this.props.chartItemClick(item)}>
                                    <ChartTooltip render={renderTooltip} />
                                    <ChartLegend position="bottom" />
                                    <ChartSeries>
                                        <ChartSeriesItem autoFit="autofit" type="donut" data={this.props.series} field={this.props.valueField} categoryField={this.props.categoryField} >
                                            <ChartSeriesLabels position="outsideEnd" background="none" content={labelContent} />
                                        </ChartSeriesItem>
                                    </ChartSeries>
                                </Chart>


                            }
                        </PDFExport>
                        :
                        <>
                            <Attachments className = "norecordchart">
                                {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                            </Attachments>
                        </>
                }
            </>
        );
    }

    getValueByComponent = (param, value) => {
        let componentCode = param.ndesigncomponentcode;
        switch (componentCode) {
            case 4: return value ? convertDatetoStringByTimeZone(this.props.userInfo, value) : "-"
            default: return value
        }
    }

    // covertDatetoString = (value) => {
    //     const userInfo = this.props.userInfo;
    //     const dateValue = new Date(value);
    //     const prevMonth = validateTwoDigitDate(String(dateValue.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(dateValue.getDate()));
    //     const dateArray = [];

    //     const splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";
    //     const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    //     const secondField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[1];

    //         if (firstField === "dd"){
    //             dateArray.push(prevDay);
    //             dateArray.push(splitChar);
    //             if (secondField === "MM"){
    //                 dateArray.push(prevMonth);
    //                 dateArray.push(splitChar);
    //                 dateArray.push(dateValue.getFullYear());
    //             }
    //             else{
    //                 dateArray.push(dateValue.getFullYear());
    //                 dateArray.push(splitChar);
    //                 dateArray.push(prevMonth);
    //             }
    //         }
    //         else  if (firstField === "MM"){
    //             dateArray.push(prevMonth);               
    //             dateArray.push(splitChar);
    //             if (secondField === "dd"){
    //                 dateArray.push(prevDay);
    //                 dateArray.push(splitChar);
    //                 dateArray.push(dateValue.getFullYear());
    //             }
    //             else{
    //                 dateArray.push(dateValue.getFullYear());
    //                 dateArray.push(splitChar);
    //                 dateArray.push(prevDay);                
    //             }
    //         }
    //         else{
    //             dateArray.push(dateValue.getFullYear());
    //             dateArray.push(splitChar);
    //             if (secondField === "dd"){
    //                 dateArray.push(prevDay);
    //                 dateArray.push(splitChar);
    //                 dateArray.push(prevMonth);       
    //             }
    //             else{
    //                 dateArray.push(prevMonth);       
    //                 dateArray.push(splitChar);
    //                 dateArray.push(prevDay);                
    //             }
    //         }
    //      return dateArray;
    //     // const fromDateOnly = dateValue.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     // return fromDateOnly;
    // }
}
export default injectIntl(PieChart);