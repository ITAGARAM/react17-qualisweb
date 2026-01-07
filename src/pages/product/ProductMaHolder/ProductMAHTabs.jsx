import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../../components/data-grid/data-grid.component';

class ProductMAHTabs extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            dataState: dataState
        }
    }
    extractedHistoryColumnList = [
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_APPROVALSTATUS", "dataField": "stransdisplaystatus", "width": "150px", "isIdsField": true },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERNAME", "dataField": "sfirstname", "width": "130px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "130px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_APPROVALDATE", "dataField": "stransactiondate", "width": "140px" },
        { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COMMENTS", "dataField": "scomments" }
    ]
    render() {
        return (
            <>
                <Row noGutters={true}>
                    <Col md='12'>
                        <Card>
                            {/* <Tab.Container defaultActiveKey="ProductmahhistoryKey"> */}
                            <Card.Header className="add-txt-btn">
                                {/* <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">
                                        <Nav.Item as='li'>
                                            <Nav.Link eventKey="ProductmahhistoryKey"> */}
                                <strong><FormattedMessage id="IDS_APPROVALHISTORY" defaultMessage="Approval History" /></strong>
                                {/* </Nav.Link>
                                        </Nav.Item>
                                    </Nav> */}
                            </Card.Header>
                            <Card.Body>
                                {/* <Tab.Content>
                                    <Tab.Pane className="fade p-0" eventKey="ProductmahhistoryKey"> */}
                                <Row className="no-gutters">
                                    <Col md={12}>
                                        <DataGrid
                                            extractedColumnList={this.extractedHistoryColumnList}
                                            primaryKeyField="npmahpprovalhistorycode"
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            data={this.props.masterData.ProductMaHistory || []}
                                            //dataResult={process(this.props.masterData.ProductMaHistory || [], this.state.dataState)}
                                            // dataState={this.state.dataState}
                                            // dataStateChange={(event)=> this.setState({dataState: event.dataState})} 
                                            dataResult={process(this.props.masterData.ProductMaHistory || [], this.props.dataState)}
                                            dataState={this.props.dataState}
                                            dataStateChange={this.props.dataStateChange}   
                                            width="500px"
                                            pageable={true}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights || []}
                                            scrollable={"auto"}
                                            isActionRequired={false}
                                            isToolBarRequired={false}
                                        />
                                    </Col>
                                </Row>
                                {/* </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }



    // componentDidUpdate(previousProps) {
    //     if (this.props.masterData !== previousProps.masterData) {
    //         let { dataState } = this.state;
    //         if(this.props.dataState === undefined)
    //         {
    //             dataState={skip: 0,take:10}
    //         } 
    //         this.setState({ dataState});
    //     }
    // }

}

export default injectIntl(ProductMAHTabs);