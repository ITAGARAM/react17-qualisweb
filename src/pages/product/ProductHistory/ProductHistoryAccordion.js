import React from 'react';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MediaLabel } from '../../../components/App.styles';
import '../product.css'
import DataGrid from '../../../components/data-grid/data-grid.component';

const ProductHistoryAccordion = (props) => {
    return (
        <Card className="mb-0 border-0">
            <Card.Body className="custom-padding">
                <Row>
                    <Col md='6'>
                        <FormGroup>
                            <FormLabel>
                                <FormattedMessage id="IDS_MANUFACTURESITE" defaultMessage="Manufacture site" />
                            </FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{props.objProductManufacturerHistory.smanufsitename}</MediaLabel>
                        </FormGroup>
                    </Col>
                    <Col md='6'>
                        <FormGroup>

                            <FormLabel>
                                <FormattedMessage id="IDS_EPROTOCOL" defaultMessage="E-Protocol" />
                            </FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{props.objProductManufacturerHistory.seprotocolname}</MediaLabel>
                        </FormGroup>
                    </Col>
                </Row>
            </Card.Body>
            {/* <Row></Row> */}
            <Card>
                <Card.Body className="p-0">
                    <Row>
                        <Col>
                            <DataGrid
                                primaryKeyField="nproductmahcode"
                                expandField="expanded"
                                detailedFieldList={props.detailedFieldList}
                                extractedColumnList={props.extractedColumnList}
                                inputParam={props.inputParam}
                                userInfo={props.userInfo}
                                width="600px"
                                data={props.ProductMAholderHistory || []}
                                dataResult={props.dataResult}
                                dataState={props.dataState}
                                dataStateChange={props.dataStateChange}
                                controlMap={props.controlMap}
                                userRoleControlRights={props.userRoleControlRights || []}
                                methodUrl="ProductHistory"
                                pageable={true}
                                scrollable={"auto"}
                                isActionRequired={false}
                                isComponent={true}
                            >
                            </DataGrid>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Card>
    )
}
export default injectIntl(ProductHistoryAccordion);