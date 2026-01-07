import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';

import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import './product.css';
//import ReactTooltip from 'react-tooltip';

const ProductManufacturerTab = (props) => {
    return (
        <>
            <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom">
                <Col md={12}>
                    <Row noGutters={true} >
                        <Col md={12}>
                            <div className="d-flex justify-content-end">
                            {/* <ReactTooltip place="bottom"  globalEventOff='click'/> */}
                                <Nav.Link className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(props.addProductManufacturer) === -1}
                                    // data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDPRODUCTMANUFACTURE" })}
                                   onClick={(e) => props.getProductManufactureComboService("IDS_PRODUCTMANUFACTURER", "create", "nproductmanufcode", undefined, props.masterData, props.userInfo, props.addProductManufacturer)} >
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id='IDS_PRODUCTMANUFACTURE' defaultMessage='Product Manufacture' />
                                </Nav.Link>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <CustomAccordion key="filter"
                accordionTitle={"smanufname"}
                accordionComponent={props.productManufacturerAccordion(props.masterData.ProductManufacturer)}
                inputParam={{ masterData: props.masterData, userInfo: props.userInfo }}
                accordionClick={props.getProductMaHolder}
                accordionPrimaryKey={"nproductmanufcode"}
                accordionObjectName={"objProductManufacturer"}
                selectedKey={props.masterData.selectedManuf ? props.masterData.selectedManuf.nproductmanufcode :
                    props.masterData.ProductManufacturer && props.masterData.ProductManufacturer.length > 0 ?
                        props.masterData.ProductManufacturer[0].nproductmanufcode : 0}
            />
        </>
    )
}
export default injectIntl(ProductManufacturerTab);