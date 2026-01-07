import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { Droppable } from 'react-drag-and-drop';
import { DynamicDiv } from '../../components/add-design/dashboard-dynamic-div.styles';
import { injectIntl } from 'react-intl';


const TemplateHomeDashBoardConfig = (props) => {

    switch (props.ntemplatecode) {
        case 1:
            return (
                <Row>
                    <Col md={12} className="mt-4 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                            <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                </Row>
            )
        case 2:
            return (
                <Row>
                    <Col md={6} className="mt-4 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                            <DynamicDiv borderRight={true} height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-4 pl-0 ml-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                            <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype2"] ?
                                    props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                            </DynamicDiv>

                        </Droppable>
                    </Col>
                </Row>
            );
        case 3:
            return (
                <Row>
                    <Col md={12} className="mt-4 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                            <DynamicDiv borderBottom={true} height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                    <Col md={12} className="mt-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                            <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype2"] ?
                                    props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                </Row>
            );
        case 4:
            return (
                <Row>
                    <Col md={6} className="mt-4 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                            <DynamicDiv borderRight={true} height={"30"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-4 pl-0 ml-0">
                        <Row>
                            <Col md={12}>
                                <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                                    <DynamicDiv borderBottom={true} height={"15"}>
                                        {props.selectedRecord["dashboardtype2"] ?
                                            props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                                    </DynamicDiv>
                                </Droppable>
                            </Col>
                            <Col md={12}>
                                <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 3)}>
                                    <DynamicDiv height={"15"}>
                                        {props.selectedRecord["dashboardtype3"] ?
                                            props.selectedRecord["dashboardtype3"].sdashboardtypename : ""}
                                    </DynamicDiv>
                                </Droppable>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        case 5:
            return (
                <Row>
                    <Col md={6} className="mt-4 pr-0 mr-0">
                        <Row>
                            <Col md={12} >
                                <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                                    <DynamicDiv borderBottom={true} height={"15"}>
                                        {props.selectedRecord["dashboardtype1"] ?
                                            props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                                    </DynamicDiv>
                                </Droppable>
                            </Col>
                            <Col md={12} >
                                <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                                    <DynamicDiv height={"15"}>
                                        {props.selectedRecord["dashboardtype2"] ?
                                            props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                                    </DynamicDiv>
                                </Droppable>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} className="mt-4 pl-0 ml-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 3)}>
                            <DynamicDiv borderLeft={true} height={"30"}>
                                {props.selectedRecord["dashboardtype3"] ?
                                    props.selectedRecord["dashboardtype3"].sdashboardtypename : ""}
                            </DynamicDiv>
                        </Droppable>
                    </Col>
                </Row>
            )
        case 6:
            return (
                <Row>
                    <Col md={6} className="mt-4 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                             <DynamicDiv borderRight={true} height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>                         
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-4 pl-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                           <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype2"] ?
                                    props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                            </DynamicDiv>                            
                        </Droppable>
                    </Col>
                    <Col md={12} className="mt-0 ml-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 3)}>
                            <DynamicDiv borderTop={true} height={"15"}>
                                {props.selectedRecord["dashboardtype3"] ?
                                    props.selectedRecord["dashboardtype3"].sdashboardtypename : ""}
                            </DynamicDiv>                           
                        </Droppable>
                    </Col>
                </Row>
            )
        case 7:
            return (
                <Row>
                    <Col md={12} className="mt-4 ml-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                             <DynamicDiv  borderBottom={true} height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>                            
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                            <DynamicDiv  borderRight={true} height={"15"}>
                                {props.selectedRecord["dashboardtype2"] ?
                                    props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                            </DynamicDiv>                           
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 3)}>
                            <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype3"] ?
                                    props.selectedRecord["dashboardtype3"].sdashboardtypename : ""}
                            </DynamicDiv>                             
                        </Droppable>
                    </Col>
                </Row>
            )


        case 8:
            return (
                <Row>
                    <Col md={6} className="mt-4 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 1)}>
                            <DynamicDiv borderRight={true} borderBottom={true} height={"15"}>
                                {props.selectedRecord["dashboardtype1"] ?
                                    props.selectedRecord["dashboardtype1"].sdashboardtypename : ""}
                            </DynamicDiv>                            
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-4 pl-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 2)}>
                            <DynamicDiv borderBottom={true} height={"15"}>
                                {props.selectedRecord["dashboardtype2"] ?
                                    props.selectedRecord["dashboardtype2"].sdashboardtypename : ""}
                            </DynamicDiv>                            
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-0 pr-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 3)}>
                            <DynamicDiv borderRight={true} height={"15"}>
                                {props.selectedRecord["dashboardtype3"] ?
                                    props.selectedRecord["dashboardtype3"].sdashboardtypename : ""}
                            </DynamicDiv>    
                        </Droppable>
                    </Col>
                    <Col md={6} className="mt-0 pl-0 mr-0">
                        <Droppable types={['dashboardtype']} onDrop={(event) => props.onDrop(event, 4)}>
                            <DynamicDiv height={"15"}>
                                {props.selectedRecord["dashboardtype4"] ?
                                    props.selectedRecord["dashboardtype4"].sdashboardtypename : ""}
                            </DynamicDiv>                            
                        </Droppable>
                    </Col>
                </Row>
            )

        default:
            return (<></>);
    }


}

export default injectIntl(TemplateHomeDashBoardConfig);