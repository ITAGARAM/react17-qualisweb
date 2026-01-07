import React from 'react'
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ReadOnlyText } from '../../components/App.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { ProductList } from '../product/product.styled';
// import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';

const ManufacturerTabsAccordion = (props) => {

    //const addManufacturerSiteId = props.controlMap.has("AddManufacturerSiteAddress") && props.controlMap.get("AddManufacturerSiteAddress").ncontrolcode
    const editManufacturerSiteId = props.controlMap.has("EditManufacturerSiteAddress") && props.controlMap.get("EditManufacturerSiteAddress").ncontrolcode;
    const deleteManufacturerSiteId = props.controlMap.has("DeleteManufacturerSiteAddress") && props.controlMap.get("DeleteManufacturerSiteAddress").ncontrolcode

    const deleteParam = { screenName: "ManufacturerSiteAddress", selectedRecord: props.siteAddress, Type: "manufacturersiteaddress", methodURL: "SiteAddress", operation: "delete", ncontrolCode: deleteManufacturerSiteId }

    return (<>
            {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
        <Row>
            {/* <Col md='12' > */}
            
                <ProductList className="ml-auto">
                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                    {/* <ReactTooltip place="bottom" globalEventOff='click'/> */}
                        <Nav.Link className="mr-2 btn btn-circle outline-grey" 
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_EDIT" })}
                     //    data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(editManufacturerSiteId) === -1} 
                        onClick={(e) => props.getSiteManufacturerLoadEdit("SiteManufacturer", "update", props.masterData.selectedManufacturer.nmanufcode, props.siteAddress.nmanufsitecode, editManufacturerSiteId, props.userInfo)}>
                            <FontAwesomeIcon icon={faPencilAlt}/>
                        </Nav.Link>
                        {/* <FontAwesomeIcon icon={faTrashAlt} title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                            hidden={props.userRoleControlRights.indexOf(deleteManufacturerSiteId) === -1}
                            onClick={(e) => props.deleteRecordSite(e, props.siteAddress, "manufacturersiteaddress", "SiteAddress", deleteManufacturerSiteId)} /> */}

                        <Nav.Link 
                            className="mr-2 btn btn-circle outline-grey action-icons-wrap"
                            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}
                           //  data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(deleteManufacturerSiteId) === -1}
                            onClick={() => props.ConfirmDelete({ ...deleteParam, selectedRecord: props.siteAddress })}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            {/* <ConfirmDialog
                                name="deleteMessage"
                                message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                icon={faTrashAlt}
                                title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                hidden={props.userRoleControlRights.indexOf(deleteManufacturerSiteId) === -1}
                                handleClickDelete={(e) => props.deleteRecordSite({ ...deleteParam, selectedRecord: props.siteAddress })}
                            /> */}
                        </Nav.Link>
                    {/* </Tooltip> */}
                </ProductList>
            
            {/* </Col> */}
        </Row>
        <Row>
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_MANUFSITENAME"} defaultMessage="Site Name" />
                    </FormLabel>
                    <ReadOnlyText>{props.siteAddress.smanufsitename}</ReadOnlyText>
                </FormGroup>
            </Col>
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_ADDRESS1"} defaultMessage="Address 1" />
                    </FormLabel>
                    <ReadOnlyText>{props.siteAddress.saddress1}</ReadOnlyText>
                </FormGroup>
            </Col>
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_ADDRESS2"} defaultMessage="Address 2" />
                    </FormLabel>
                    <ReadOnlyText>
                        {props.siteAddress.saddress2 ? props.siteAddress.saddress2 === "" ? '-' : props.siteAddress.saddress2 : '-'}
                    </ReadOnlyText>
                </FormGroup>
            </Col>
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_ADDRESS3"} defaultMessage="Address 3" />
                    </FormLabel>
                    <ReadOnlyText>
                        {props.siteAddress.saddress3 ? props.siteAddress.saddress3 === "" ? '-' : props.siteAddress.saddress3 : '-'}
                    </ReadOnlyText>
                </FormGroup>
            </Col>
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_COUNTRY"} defaultMessage="Country" />
                    </FormLabel>
                    <ReadOnlyText>{props.siteAddress.scountryname}</ReadOnlyText>
                </FormGroup>
            </Col>
            {/* <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_ACTIVE"} defaultMessage="Status" />
                    </FormLabel>
                    <ReadOnlyText>
                        {/* <FormattedMessage id={props.siteAddress.stransdisplaystatus} defaultMessage={props.siteAddress.stransdisplaystatus} /> */}
                        {/* {props.siteAddress.stransdisplaystatus} */}
                  {/*    </ReadOnlyText>
                </FormGroup>
            </Col> */}
            <Col md='4'>
                <FormGroup>
                    <FormLabel>
                        <FormattedMessage id={"IDS_DEFAULT"} defaultMessage="Default" />
                    </FormLabel>
                    <ReadOnlyText>
                        {/* <FormattedMessage id={props.siteAddress.defaultstatus} defaultMessage={props.siteAddress.defaultstatus} /> */}
                        {props.siteAddress.defaultstatus}
                    </ReadOnlyText>
                </FormGroup>
            </Col>
        </Row>
        <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom">
            <Col md={12}>
            <div className="d-flex justify-content-end">
            {/* <ReactTooltip place="bottom" />  */}
                <Nav.Link className="add-txt-btn"
                //   data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDCONTACTDETAILS" })}
                    hidden={props.userRoleControlRights.indexOf(props.addManufacturerContactId) === -1}
                    onClick={() => props.openModalContact(props.AddContactParam)}                >
                    <FontAwesomeIcon icon={faPlus} /> {}
                    <FormattedMessage id='IDS_SITECONTACT' defaultMessage='Contact Details' />
                </Nav.Link>
            </div>
            </Col>
        </Row>
        {/* {props.siteAddress.nmanufsitecode === props.masterData.ManufacturerSiteAddress.nmanufsitecode ? */}
        <Row>
            <Col>
                <DataGrid
                    primaryKeyField={"nmanufcontactcode"}
                    expandField="expanded"
                    detailedFieldList={props.detailedFieldList || []}
                    extractedColumnList={props.extractedColumnList || [] }
                    inputParam={props.inputParam}
                    userInfo={props.userInfo}
                    data={props.data}
                    dataResult={process(props.ManufacturerContactInfo || [], props.dataState)}
                    dataState={props.dataState}
                    dataStateChange={props.dataStateChange}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights || []}
                    methodUrl="ManufacturerContactInfo"
                    fetchRecord={props.getContactManufacturerLoadEdit}
                    editParam={props.editParam}
                    deleteParam={{ operation: "delete" }}
                    deleteRecord={props.deleteRecord}
                    pageable={true}
                    scrollable={"scrollable"}
                    isActionRequired={true}
                    selectedId={props.selectedId}
                // isComponent={true}
                    hasDynamicColSize={props.hasDynamicColSize}
                >
                </DataGrid>
            </Col>
        </Row>
        {/* : ""} */}
    </>)
}
export default injectIntl(ManufacturerTabsAccordion);