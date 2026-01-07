import React from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';

import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPencilAlt, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MediaLabel } from '../../components/App.styles';

import './product.css'

import DataGrid from '../../components/data-grid/data-grid.component';
// import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';


const ProductManufacturerAccordion = (props) => {
    return (<>
     {/* <ReactTooltip place="bottom" globalEventOff='click'  id="tooltip_list_wrap"/> */}
        <Row>
            <Col md="12" className="d-flex justify-content-end">
            {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_EDIT" })}
                       //  data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(props.editProductManufacturer) === -1}
                        onClick={(e) => props.getProductManufactureComboService("IDS_PRODUCTMANUFACTURER", "update", "nproductmanufcode", parseInt(props.objProductManufacturer.nproductmanufcode),
                            props.masterData, props.userInfo, props.editProductManufacturer)}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                         data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
                       //   data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(props.deleteProductManufacturer) === -1}
                        onClick={() => props.ConfirmDelete("productmanufacturer", "ProductManufacturer", "delete", props.objProductManufacturer, "productmanufacturer", props.deleteProductManufacturer)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        {/* <ConfirmDialog
                            name="deleteMessage"
                            message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                            doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                            doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                            icon={faTrashAlt}
                            // title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                            hidden={props.userRoleControlRights && props.userRoleControlRights.indexOf(props.deleteProductManufacturer) === -1}
                            handleClickDelete={() => props.deleteRecord("productmanufacturer", "ProductManufacturer", "delete", props.objProductManufacturer, "productmanufacturer", props.deleteProductManufacturer)}
                        /> */}
                    </Nav.Link>
                {/* </Tooltip> */}
            </Col>
        </Row>
        <Row>
            <Col md='6'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id="IDS_MANUFACTURESITE" defaultMessage="Manufacture site" />
                    </FormLabel>
                    <MediaLabel className="readonly-text font-weight-normal">{props.objProductManufacturer.smanufsitename}</MediaLabel>
                </FormGroup>
            </Col>
            <Col md='6'>
                <FormGroup>

                    <FormLabel>
                        <FormattedMessage id="IDS_EPROTOCOL" defaultMessage="E-Protocol" />
                    </FormLabel>
                    <MediaLabel className="readonly-text font-weight-normal">{props.objProductManufacturer.seprotocolname}</MediaLabel>
                </FormGroup>
            </Col>
        </Row>
        <Card>
            <Card.Body className="p-0">
                <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom">
                    <Col md={12}>
                        <Row noGutters={true} >
                            <Col md={12}>
                                <div className="d-flex justify-content-end">
                                {/* <ReactTooltip place="bottom" /> */}
                                    <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(props.addProductMaholder) === -1}
                                    //    data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDPRODUCTMAHOLDER" })}
                                      onClick={() => props.getProductMAHComboService({ objProductManufacturer: props.objProductManufacturer, ...props.addProductMaholderParam })}>
                                       <FontAwesomeIcon icon={faPlus} /> { }
                                       <FormattedMessage id='IDS_PRODUCTMAHOLDER' defaultMessage='Product MA Holder' />
                                    </Nav.Link>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
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
                            data={props.masterData.Productmaholder || []}
                            dataResult={props.dataResult}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            controlMap={props.controlMap}
                            userRoleControlRights={props.userRoleControlRights || []}
                            methodUrl="ProductMaholder"
                            fetchRecord={props.fetchRecord}
                            editParam={props.editProductMaholderParam}
                            deleteParam={{ operation: "delete" }}
                            deleteRecord={props.dataGridDeleteRecord}
                            copyRecord={props.copyRecord}
                            completeRecord={props.completeRecord}
                            pageable={true}
                            scrollable={"auto"}
                            isActionRequired={true}
                            selectedId={props.selectedId}
                        >
                        </DataGrid>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    </>)
}
export default injectIntl(ProductManufacturerAccordion);