import React from 'react'
import AreaChart from '../dashboardtypes/charts/AreaChart';
import PieChart from '../dashboardtypes/charts/PieChart';
import BubbleChart from '../dashboardtypes/charts/BubbleChart';
import { chartType } from '../../components/Enumeration';
import { injectIntl } from 'react-intl';

const HomeDashBoardChartTemplates = (props) => {

    return (
        <>
            {(props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.PIECHART ||
                props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.DONUT) ?
                // <div className="k-card">
                // <div className="k-card-body height-1">
                <PieChart
                    series={props.dashBoardType.pieChart}
                    //masterData={props.dashBoardType}
                    dashBoardType = {props.dashBoardType}
                    masterData={props.masterData}
                    userInfo={props.userInfo}
                    dashBoardTypeNo={props.dashBoardTypeNo} 
                    templateCode={props.templateCode}
                    checkParametersAvailable={props.checkParametersAvailable}
                    chartTypeName={props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.PIECHART ? "pie" : "donut"}
                    valueField={"valueField"}
                    categoryField={"categoryField"}
                    viewDashBoardDesignConfigList={props.dashBoardType.filterParameter.viewDashBoardDesignConfigList}
                    selectedRecord={props.selectedRecord || {}}

                />
                // </div></div>
                :
                // <div className="k-card">
                // <div className="k-card-body height-1">
                props.dashBoardType.selectedDashBoardTypes.ncharttypecode !== chartType.BUBBLE ?
                    <AreaChart
                        xSeries={props.dashBoardType.xSeries}
                        ySeries={props.dashBoardType.ySeries}
                        //masterData={props.dashBoardType}
                        dashBoardType = {props.dashBoardType}
                        masterData={props.masterData}
                        userInfo={props.userInfo}
                        dashBoardTypeNo={props.dashBoardTypeNo} 
                        templateCode={props.templateCode}
                        checkParametersAvailable={props.checkParametersAvailable}
                        //chartTypeName={"column"}
                        chartTypeName={props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.AREACHART ? "area" :
                            props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.COLUMNCHART ? "column" :
                                props.dashBoardType.selectedDashBoardTypes.ncharttypecode === chartType.BARCHART ? "bar" : "area"}
                        selectedRecord={props.selectedRecord || {}}
                        viewDashBoardDesignConfigList={props.dashBoardType.filterParameter.viewDashBoardDesignConfigList}
                    />
                    :
                    <BubbleChart
                        bubbleSeries={props.dashBoardType.bubbleSeries}
                        chartData={props.dashBoardType.chartData}
                        dashBoardType = {props.dashBoardType}
                        //masterData={props.dashBoardType}
                        masterData={props.masterData}
                        userInfo={props.userInfo}
                        checkParametersAvailable={props.checkParametersAvailable}
                        dashBoardTypeNo={props.dashBoardTypeNo} templateCode={props.templateCode}
                        selectedRecord={props.selectedRecord || {}}
                        viewDashBoardDesignConfigList={props.dashBoardType.filterParameter.viewDashBoardDesignConfigList}
                    />
                //   </div></div>

            }
        </>
    );
}
export default injectIntl(HomeDashBoardChartTemplates);