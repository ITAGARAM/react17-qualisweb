import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

import { FormattedMessage } from 'react-intl';

import { process } from '@progress/kendo-data-query';


import '../product.css'

import CustomAccordion from '../../../components/custom-accordion/custom-accordion.component';
import ProductHistoryAccordion from './ProductHistoryAccordion';
class ProductHistoryTabs extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            dataState: dataState, ProductMAholderHistory: this.props.masterData.ProductMAholderHistory
        };
    }
    dataStateChange = (event) => {
        this.setState({
            dataState: event.data
        });
    }
    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }
    render() {
        const selectedKey=this.props.masterData.SelectedProductManufHistory?this.props.masterData.SelectedProductManufHistory.nproductmanufhistorycode:
                            this.props.masterData.ProductManufacturerHistory&&this.props.masterData.ProductManufacturerHistory.length>0&&this.props.masterData.ProductManufacturerHistory[0].nproductmanufhistorycode;
        return (
            <>
                <Row noGutters={true}>
                    <Col md='12'>
                        <Card>
                            {/* <Tab.Container defaultActiveKey="ProductmanufcturerKey"> */}
                            <Card.Header className="add-txt-btn" >
                                <strong><FormattedMessage id="IDS_MANUFACTURE" defaultMessage="Manufacture" /></strong>
                                {/* <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">
                                        <Nav.Item as='li'>
                                            <Nav.Link eventKey="ProductmanufcturerKey">
                                                <FormattedMessage id="IDS_MANUFACTURE" defaultMessage="Manufacture" />
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav> */}
                            </Card.Header>
                            <CustomAccordion 
                                key="filter"
                                accordionTitle="smanufname"
                                accordionComponent={this.productManufacturerHistoryAccordion(this.props.masterData.ProductManufacturerHistory)}
                                inputParam={{ ProductManufacturerHistory: this.props.masterData.ProductManufacturerHistory, masterData: this.props.masterData, userInfo: this.props.userInfo }}
                                accordionClick={this.props.getProductMaHolderHistory}
                                accordionPrimaryKey={"nproductmanufhistorycode"}
                                accordionObjectName={"objProductManufacturerHistory"}
                                selectedKey={selectedKey}
                            />

                            {/* <Tab.Content> */}
                            {/* <Tab.Pane className="fade p-0 " eventKey="ProductmanufcturerKey"> */}
                            {/* <Accordion defaultActiveKey={0}>
                                {Object.keys(this.props.masterData.ProductManufacturerHistory).length > 0 && this.props.masterData.ProductManufacturerHistory.map((objProductManufacturerHistory, index) => {

                                })}
                            </Accordion> */}
                            {/* </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container> */}
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
    productManufacturerHistoryAccordion = (productManufacturerList) => {
        const accordionMap = new Map();
        productManufacturerList.map((objProductManufacturerHistory) =>
            accordionMap.set(objProductManufacturerHistory.nproductmanufhistorycode,
                <ProductHistoryAccordion objProductManufacturerHistory={objProductManufacturerHistory}
                    userRoleControlRights={this.props.userRoleControlRights}
                    controlMap={this.props.controlMap}
                    userInfo={this.props.userInfo}
                    masterData={this.props.masterData}
                    //  objProductManufacturerHistory={objProductManufacturerHistory}
                    detailedFieldList={this.detailedFieldList}
                    extractedColumnList={this.extractedColumnList}
                    inputParam={this.props.inputParam}
                    ProductMAholderHistory={this.state.ProductMAholderHistory}
                    dataResult={process(this.state.ProductMAholderHistory || [], this.state.dataState)}
                    dataState={this.state.dataState}
                    dataStateChange={this.dataStateChange}
                />)
        )
        return accordionMap;
    }

    detailedFieldList = [
        { dataField: "sproducttradename", idsName: "IDS_TRADENAME" },
        { dataField: "sdosagepercontainer", idsName: "IDS_DOSEPERCONTAINER" },
        { dataField: "scertificatetype", idsName: "IDS_CERTIFICATETYPE" },
        { dataField: "sauthorityshortname", idsName: "IDS_LICENSEAUTHORITY" },
        { dataField: "scontainertype", idsName: "IDS_CONTAINERTYPE" },
        { dataField: "smahname", idsName: "IDS_MAHNAME" },
        { dataField: "saddress1", idsName: "IDS_ADDRESS1" },
        { dataField: "saddress2", idsName: "IDS_ADDRESS2" },
        { dataField: "saddress3", idsName: "IDS_ADDRESS3" },
        { dataField: "scountryname", idsName: "IDS_COUNTRYNAME" }
    ];
    extractedColumnList = [{ "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRODUCTCERTIFICATENAME", "dataField": "sproductcertificatename", "width": "200%" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LICENCENUMBER", "dataField": "slicencenumber", "width": "150%" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DOSEPERCONTAINER", "dataField": "sdosagepercontainer", "width": "100%" },
    { "fieldLength": "40", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "125%", "isIdsField": true }
    ]

    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {
            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
                this.setState({ dataState });
            }
            this.setState({
                ProductMAholderHistory: this.props.masterData.ProductMAholderHistory,
                dataState
            });
        }
    }
}

export default ProductHistoryTabs;