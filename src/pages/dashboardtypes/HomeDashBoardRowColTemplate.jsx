import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import HomeDashBoardChartTemplates from '../dashboardtypes/HomeDashBoardChartTemplates';
const HomeDashBoardRowColTemplate = (props) => {
   // console.log("RCtemplate:", props);
    switch (props.homeDashBoard &&
    props.homeDashBoard.ntemplatecode && props.homeDashBoard.ntemplatecode) {
        case 1:
            return (
                <Row noGutters={true}>
                    <Col md={12} className="mt-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0"   style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            )
        case 2:
            return (
                <Row noGutters={true}>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0"   style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 ml-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                            <Col md={12} className="mt-0 mr-0">
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType2}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType2"} templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            );
        case 3:
            return (
                <Row noGutters={true}>
                    <Col md={12} className="mt-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0"   style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={12} className="mt-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                            <Col md={12} className="mt-0 mr-0">
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType2}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType2"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            );
        case 4:
            return (
                <Row noGutters={true}>
                    <Col md={6} className="mt-0 pr-0 mr-0" style={{ position: "relative" }}>
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0" 
                                        style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                                {height:'300px', position: "absolute", top: "27%"}
                                                : {position: "absolute", top: "27%"}}
                            >
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 ml-0">
                        <Row>
                            <Col md={12}>
                                {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                                    <Col md={12} className="mt-0 mr-0">
                                        <HomeDashBoardChartTemplates
                                            dashBoardType={props.homeDashBoard.dashBoardType2}
                                            userInfo={props.userInfo}
                                            masterData={props.masterData}
                                            checkParametersAvailable={props.checkParametersAvailable}
                                            dashBoardTypeNo={"dashBoardType2"} 
                                            templateCode={props.homeDashBoard.ntemplatecode}
                                            selectedRecord={props.selectedRecord || {}}
                                        />
                                    </Col>
                                }
                            </Col>
                            <Col md={12}>
                                {props.homeDashBoard && props.homeDashBoard.dashBoardType3 &&
                                    <Col md={12} className="mt-0 mr-0" style={props.homeDashBoard.dashBoardType3.chartData.length === 0 ? 
                                        {height:'300px'}: {}}>
                                        <HomeDashBoardChartTemplates
                                            dashBoardType={props.homeDashBoard.dashBoardType3}
                                            userInfo={props.userInfo}
                                            masterData={props.masterData}
                                            checkParametersAvailable={props.checkParametersAvailable}
                                            dashBoardTypeNo={"dashBoardType3"} 
                                            templateCode={props.homeDashBoard.ntemplatecode}
                                            selectedRecord={props.selectedRecord || {}}
                                        />
                                    </Col>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        case 5:
            return (
                <Row noGutters={true}>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        <Row>
                            <Col md={12} >
                                {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                                    <Col md={12} className="mt-0 mr-0"    style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                        {height:'300px'}: {}}>
                                        <HomeDashBoardChartTemplates
                                            dashBoardType={props.homeDashBoard.dashBoardType1}
                                            userInfo={props.userInfo}
                                            masterData={props.masterData}
                                            checkParametersAvailable={props.checkParametersAvailable}
                                            dashBoardTypeNo={"dashBoardType1"} 
                                            templateCode={props.homeDashBoard.ntemplatecode}
                                            selectedRecord={props.selectedRecord || {}}
                                        />
                                    </Col>
                                }
                            </Col>
                            <Col md={12} >
                                {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                                    <Col md={12} className="mt-0 mr-0">
                                        <HomeDashBoardChartTemplates
                                            dashBoardType={props.homeDashBoard.dashBoardType2}
                                            userInfo={props.userInfo}
                                            masterData={props.masterData}
                                            checkParametersAvailable={props.checkParametersAvailable}
                                            dashBoardTypeNo={"dashBoardType2"} 
                                            templateCode={props.homeDashBoard.ntemplatecode}
                                            selectedRecord={props.selectedRecord || {}}
                                        />
                                    </Col>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} className="mt-0 pl-0 ml-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType3 &&
                            <Col md={12} className="mt-0 mr-0" style={props.homeDashBoard.dashBoardType3.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType3}
                                    userInfo={props.userInfo}
                                    masterData={props.masterData}
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType3"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            )
        case 6:
            return (
                <Row noGutters={true}>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0"    
                                    style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                            {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                            <Col md={12} className="mt-0 mr-0">
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType2}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType2"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={12} className="mt-0 ml-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType3 &&
                            <Col md={12} className="mt-0 mr-0" style={props.homeDashBoard.dashBoardType3.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType3}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType3"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            )
        case 7:
            return (
                <Row noGutters={true}>
                    <Col md={12} className="mt-0 ml-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0"   
                                 style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                        {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                            <Col md={12} className="mt-0 mr-0">
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType2}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType2"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType3 &&
                            <Col md={12} className="mt-0 mr-0" style={props.homeDashBoard.dashBoardType3.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType3}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType3"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            )


        case 8:
            return (
                <Row noGutters={true}>
                    <Col md={6} className="mt-0 pr-4 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType1 &&
                            <Col md={12} className="mt-0 mr-0" 
                                style={props.homeDashBoard.dashBoardType1.chartData.length === 0 ? 
                                        {height:'300px'}: {}}
                                        >
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType1}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType1"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType2 &&
                            <Col md={12} className="mt-0 mr-0"
                                //  style={props.homeDashBoard.dashBoardType2.chartData.length === 0 ? 
                                //         {height:'300px', borderRadius:'5px', borderWidth:"1px", borderStyle:'solid', 
                                //         borderColor:'gray'}: {}}
                                >
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType2}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType2"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pr-4 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType3 &&
                            <Col md={12} className="mt-2 mr-0" style={props.homeDashBoard.dashBoardType3.chartData.length === 0 ? 
                                {height:'300px'}: {}}>
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType3}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType3"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        {props.homeDashBoard && props.homeDashBoard.dashBoardType4 &&
                            <Col md={12} className="mt-2 mr-0">
                                <HomeDashBoardChartTemplates
                                    dashBoardType={props.homeDashBoard.dashBoardType4}
                                    masterData={props.masterData}
                                    userInfo={props.userInfo} 
                                    checkParametersAvailable={props.checkParametersAvailable}
                                    dashBoardTypeNo={"dashBoardType4"} 
                                    templateCode={props.homeDashBoard.ntemplatecode}
                                    selectedRecord={props.selectedRecord || {}}
                                />
                            </Col>
                        }
                    </Col>
                </Row>
            )

        default:
            return (<></>);
    }

}
export default injectIntl(HomeDashBoardRowColTemplate);
