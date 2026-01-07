import React, { Component } from 'react';
import ListMaster from '../../../components/list-master/list-master.component';
import { connect } from 'react-redux';
import { Col, Row, Card, FormGroup, FormLabel, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ProductList, ContentPanel, MediaLabel } from '../product.styled';

import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCopy, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { getControlMap, showEsign, constructOptionList } from '../../../components/CommonScript';
import ProductMaHolderFilter from './ProductMaHolderFilter';
import AddProductMAHolder from '../AddProductMAHolder';
import ProductMAHTabs from './ProductMAHTabs';
import {
    callService, crudMaster, updateStore, validateEsignCredential, getProductMAHolderComboService, selectProductMaholderDetail,
    getProductChange, getProductManufactureChange, filterColumnData
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import Esign from '../../audittrail/Esign';
// import ConfirmDialog from '../../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../../components/Enumeration';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ActionPopOver from '../ActionPopover';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';
class ProductMaHolder extends Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };

        this.state = {
            isOpen: false,
            masterStatus: "",
            error: "",
            selectedRecord: {},
            Product: [],
            operation: "",
            selectedProductmaholder: undefined,
            screenName: "Product",
            ProductManufacturer: [],
            productmaholder: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            selectedFilter: [],
            skip: 0,
            //take:10,
            listtake: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            dataState
            
        };
        this.onMultiColumnValue = this.onMultiColumnValue.bind(this);
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.ProductmaholderFieldList = ['sproducttradename', 'sproductcertificatename', 'sdosagepercontainer', 'slicencenumber'];
        this.extractedColumnList = [
            { "idsName": "IDS_PRODUCTCERTIFICATENAME", "dataField": "sproductcertificatename", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CERTIFICATETYPE", "dataField": "ncertificatetypecode", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_LICENCENUMBER", "dataField": "slicencenumber", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_DOSEPERCONTAINER", "dataField": "sdosagepercontainer", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_CONTAINERTYPE", "dataField": "ncontainertypecode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_LICENSEAUTHORITY", "dataField": "sauthorityshortname", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MAHNAME", "dataField": "nmahcode", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        ]
        this.searchFieldList = ["sproductcertificatename", "smanufname", "stransdisplaystatus", "sproducttradename", "scertificatetype",
            "sauthorityshortname", "scontainertype", "smahname"];
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }
    
    dataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }

    render() {
        let userStatusCSS = "";
        if (this.props.Login.masterData.selectedProductmaholder && this.props.Login.masterData.selectedProductmaholder.ntransactionstatus === transactionStatus.DRAFT) {
            userStatusCSS = "outline-secondary";
        }
        else if (this.props.Login.masterData.selectedProductmaholder && this.props.Login.masterData.selectedProductmaholder.ntransactionstatus === transactionStatus.COMPLETED) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedProductmaholder && this.props.Login.masterData.selectedProductmaholder.ntransactionstatus === transactionStatus.CORRECTION) {
            userStatusCSS = "outline-correction";
        } else {
            userStatusCSS = "outline-Final";
        }
        const addProductMaholder = this.state.controlMap.has("AddProductMaholder") && this.state.controlMap.get("AddProductMaholder").ncontrolcode
        const editProductMaholder = this.state.controlMap.has("EditProductMaholder") && this.state.controlMap.get("EditProductMaholder").ncontrolcode;
        const deleteProductMaholder = this.state.controlMap.has("DeleteProductMaholder") && this.state.controlMap.get("DeleteProductMaholder").ncontrolcode

        const copyProductMaholder = this.state.controlMap.has("CopyProductMaholder") && this.state.controlMap.get("CopyProductMaholder").ncontrolcode
        const completeProductMaholder = this.state.controlMap.has("CompleteProductMaholder") && this.state.controlMap.get("CompleteProductMaholder").ncontrolcode;
        const approvalActionId = this.state.controlMap.has("ProductMAHApprovalAction") && this.state.controlMap.get("ProductMAHApprovalAction").ncontrolcode;

        const filterParam = {
            inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder", primaryKeyField: "nproductmahcode",
            fetchUrl: "productmaholder/getProductMahByManufcode", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        const mandatoryFields = [];
        this.extractedColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix>
                        : ""
                    }
                    <Row noGutters={true}>
                        <Col md={4}>
                            <Affix top={90}>
                                <ListMaster filterColumnData={this.props.filterColumnData}
                                    formatMessage={this.props.intl.formatMessage}
                                    screenName={"Product MAH "}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.MAHproductmaholder}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    getMasterDetail={(productmaholder) => this.props.selectProductMaholderDetail(productmaholder, this.props.Login.masterData, this.props.Login.userInfo)}
                                    selectedMaster={this.props.Login.masterData.selectedProductmaholder}
                                    primaryKeyField="nproductmahcode"
                                    mainField="sproductcertificatename"
                                    firstField="smanufname"
                                    secondField="stransdisplaystatus"
                                    isIDSField="Yes"
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addProductMaholder}
                                    filterParam={filterParam}
                                    searchRef={this.searchRef}
                                    //  openModal = {()=>this.setState({screenName:"Add Product", operation:"create", isOpen:true})}
                                    openModal={() => this.props.getProductMAHolderComboService("IDS_PRODUCTMAHOLDER", "create", "nproductmahcode", undefined, this.state.selectedFilter, this.props.Login.masterData, this.props.Login.userInfo, addProductMaholder)}
                                    needFilter={true}
                                    needAccordianFilter={false}
                                    reloadData={this.reloadData}
                                    // accordianClassName={"ma-holder- "}
                                    // handlePageChange={this.handlePageChange}
                                    // skip={this.state.skip}
                                    // take={this.state.listtake}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    showFilterIcon={true}
                                    showFilter={this.props.Login.showFilter}
                                    // filterTitle={["IDS_TESTFILTER", "Sample Filter"]}
                                    filterComponent={[
                                        {
                                            "IDS_PRODUCTMAHOLDERFILTER":
                                                <ProductMaHolderFilter
                                                    formatMessage={this.props.intl.formatMessage}
                                                    Product={this.state.MAHProduct || []}
                                                    ProductManufacturer={this.props.Login.masterData.MAHProductManufacturer || []}
                                                    selectedRecord={this.state.selectedFilter || {}}
                                                    onProductChange={this.onProductChange}
                                                    onProductManufChange={this.onProductManufChange}
                                                    onMultiColumnValue={this.onMultiColumnValue}
                                                />
                                        }
                                    ]}
                                />
                            </Affix>
                        </Col>
                        <Col md='8'>
                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                            <ProductList className="panel-main-content">
                                {this.props.Login.masterData.MAHproductmaholder && this.props.Login.masterData.MAHproductmaholder.length > 0 && this.props.Login.masterData.selectedProductmaholder ?
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main"
                                                //data-tooltip-id="my-tooltip" data-tooltip-content={this.props.Login.masterData.selectedProductmaholder.sproductcertificatename}
                                                //data-for="tooltip_list_wrap"
                                                >{this.props.Login.masterData.selectedProductmaholder.sproductcertificatename}</Card.Title>
                                            <ContentPanel className="d-flex product-category title-grid-wrap-width-md">
                                                <ContentPanel>
                                                    {/* <h2 className="title-grid-width-md product-title-sub" 
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.Login.masterData.selectedProductmaholder.smanufname} data-for="tooltip_list_wrap"
                                                        >
                                                            {this.props.Login.masterData.selectedProductmaholder.smanufname}
                                                    </h2> */}
                                                    <MediaLabel className={`btn btn-outlined  ${userStatusCSS} btn-sm ml-3`}>
                                                        <FormattedMessage id={this.props.Login.masterData.selectedProductmaholder.stransdisplaystatus} message={this.props.Login.masterData.selectedProductmaholder.stransdisplaystatus} />
                                                    </MediaLabel>
                                                </ContentPanel>

                                                <ProductList className="d-inline dropdown badget_menu">
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey mr-2"
                                                        hidden={this.state.userRoleControlRights.indexOf(editProductMaholder) === -1}
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                       // data-for="tooltip_list_wrap"
                                                        href="#" onClick={() => this.props.getProductMAHolderComboService("IDS_PRODUCTMAHOLDER", "update", "nproductmahcode",
                                                            parseInt(this.props.Login.masterData.selectedProductmaholder.nproductmahcode), this.state.selectedFilter, this.props.Login.masterData, this.props.Login.userInfo, editProductMaholder)}>
                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey mr-2 "
                                                        hidden={this.state.userRoleControlRights.indexOf(deleteProductMaholder) === -1}
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                       // data-for="tooltip_list_wrap"
                                                        onClick={() => this.ConfirmDelete("productmaholder", "ProductMaHolder", this.props.Login.masterData.selectedProductmaholder, this.props.Login.masterData, this.props.Login.userInfo, deleteProductMaholder)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                        {/* <ConfirmDialog
                                                                name="deleteMessage"
                                                                message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                icon={faTrashAlt}
                                                                title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteProductMaholder) === -1}
                                                                handleClickDelete={() => this.deleteRecord("productmaholder", "ProductMaHolder", this.props.Login.masterData.selectedProductmaholder, this.props.Login.masterData, this.props.Login.userInfo, deleteProductMaholder)}
                                                            /> */}
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey mr-2"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                      //  data-for="tooltip_list_wrap"
                                                        hidden={this.state.userRoleControlRights.indexOf(completeProductMaholder) === -1}
                                                        onClick={() => this.completeRecord("productmaholder", "ProductMaHolder", this.props.Login.masterData.selectedProductmaholder, this.props.Login.masterData, this.props.Login.userInfo, completeProductMaholder)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        className="btn btn-circle outline-grey mr-2"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                     //   data-for="tooltip_list_wrap"
                                                        hidden={this.state.userRoleControlRights.indexOf(copyProductMaholder) === -1}
                                                        onClick={() => this.copyRecord("productmaholder", "ProductMaHolder", this.props.Login.masterData.selectedProductmaholder, this.props.Login.masterData, this.props.Login.userInfo, copyProductMaholder)}>
                                                        <FontAwesomeIcon icon={faCopy} />
                                                    </Nav.Link>
                                                    {/* </Tooltip> */}
                                                </ProductList>
                                                {/* <Dropdown >
                                                    <Dropdown.Toggle className="btn-circle solid-blue" style={{ display: Object.keys(this.props.Login.masterData.ApprovalRoleActionDetail).length > 0 ? "flex" : "none" }}>
                                                        <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu style={{ borderRadius: "0.5rem!important" }}>
                                                        <>
                                                            {this.props.Login.masterData.ApprovalRoleActionDetail.length > 0 &&
                                                                this.props.Login.masterData.ApprovalRoleActionDetail.map((Action) =>
                                                                    <Dropdown.Item className="mb-2" onClick={() => this.DynamicButton(Action.ntransactionstatus, Action.nesignneed)}>
                                                                        <FormattedMessage id={Action.sactiondisplaystatus} defaultMessage={Action.sactiondisplaystatus} />
                                                                    </Dropdown.Item>
                                                                )}
                                                        </>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {this.state.userRoleControlRights.indexOf(approvalActionId) !== -1 ?
                                                    <ActionPopOver
                                                        actionDetails={this.props.Login.masterData.ApprovalRoleActionDetail}
                                                        roleActionDetails={this.props.Login.masterData.ApprovalRoleActionDetail}
                                                        dynamicButton={(value) => this.DynamicButton(value.paramstatus, value.sign)}
                                                    />
                                                    : ""}
                                            </ContentPanel>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                            <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.smanufname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_TRADENAME" message="Trade Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.sproducttradename}</MediaLabel>
                                                    </FormGroup>
                                                </Col>

                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.scertificatetype}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_AUTHORITYNAME" message="Authority Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.sauthorityshortname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_CONTAINERTYPE" message="Container Type" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.scontainertype}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_DOSEPERCONTAINER" message="Dose Per Container" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.sdosagepercontainer}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_LICENSENUMBER" message="Licence Number" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.slicencenumber}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_MAHNAME" message="MAH Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.smahname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS1" message="Address1" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.saddress1}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS2" message="Address2" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.saddress2}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS3" message="Address3" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.saddress3}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_COUNTRYNAME" message="Country Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductmaholder.scountryname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <ProductMAHTabs
                                                userInfo={this.props.Login.userInfo}
                                                inputParam={this.props.Login.inputParam}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                controlMap={this.state.controlMap}
                                                masterData={{
                                                    "ProductMaHistory": this.props.Login.masterData.ProductMaHistory || [],
                                                }}
                                                crudMaster={this.props.crudMaster}
                                                dataState={this.state.dataState} 
                                                dataStateChange={this.dataStateChange}
                                                settings = {this.props.Login.settings}
                                            />
                                        </Card.Body>
                                    </Card> : ""}
                            </ProductList>
                        </Col>
                    </Row>

                </div>

                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        onSaveClick={this.onSaveClick}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddProductMAHolder
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                onMultiColumnValue={this.onMultiColumnValue}
                                onMAHChange={this.onMAHChange}
                                CertificateType={this.props.Login.CertificateType || []}
                                ContainerType={this.props.Login.ContainerType || []}
                                LicenseAuthority={this.props.Login.LicenseAuthority || []}
                                MAHolder={this.props.Login.MAHolder || []}
                                selectedProductmaholder={this.props.Login.masterData.selectedProductmaholder || {}}
                                operation={this.props.Login.operation}
                            />
                        }
                    /> : ""}

            </>
        );
    }
    ConfirmDelete = (key, methodUrl, selectedRecord, masterData, userInfo, ncontrolCode) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(key, methodUrl, selectedRecord, masterData, userInfo, ncontrolCode));
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        // this.reloadData(this.state.selectedRecord, true);
        this.props.getProductManufactureChange(this.props.Login.userInfo, this.state.selectedFilter, this.props.Login.masterData, this.searchRef);
    }


    componentDidUpdate(previousProps) {
        // console.log('Main Get', this.props);
        //  if (this.props.Login.masterData !== previousProps.Login.masterData){
        const masterData = this.props.Login.masterData;

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const selectedFilter = this.state.selectedFilter;
            let MAHProductList = this.state.MAHProduct;

            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
                this.setState({ dataState });
            }
            if (this.props.Login.masterData.MAHProduct && this.props.Login.masterData.MAHProduct !== previousProps.Login.masterData.MAHProduct) {
                const MAHProduct = constructOptionList(this.props.Login.masterData.MAHProduct, "nproductcode", "sproductname", undefined, undefined, true)

                MAHProductList = MAHProduct.get("OptionList");

                // this.setState({ MAHProduct: MAHProductList });

                selectedFilter["nproductcode"] = masterData.MAHProduct && masterData.MAHProduct.length > 0 ? {
                    "value": masterData.MAHProduct[0].nproductcode,
                    "label": masterData.MAHProduct[0].sproductname
                } : this.state.selectedRecord["nproductcode"];
            }
            if (this.props.Login.masterData.MAHProductManufacturer && this.props.Login.masterData.MAHProductManufacturer !== previousProps.Login.masterData.MAHProductManufacturer) {
                selectedFilter["smanufname"] = masterData.MAHProductManufacturer && masterData.MAHProductManufacturer.length > 0 ?
                    masterData.MAHProductManufacturer[0].smanufname : this.state.selectedRecord["smanufname"];
                selectedFilter["nproductmanufcode"] = masterData.MAHProductManufacturer && masterData.MAHProductManufacturer.length > 0 ?
                    masterData.MAHProductManufacturer[0].nproductmanufcode : this.state.selectedRecord["nproductmanufcode"];
            }
            this.setState({ selectedFilter, MAHProduct: MAHProductList });
        }
        // if (this.props.Login.masterData.MAHProduct !== previousProps.Login.masterData.MAHProduct) {
        //     const MAHProduct = constructOptionList(this.props.Login.masterData.MAHProduct, "nproductcode", "sproductname", undefined, undefined, true)

        //     const MAHProductList = MAHProduct.get("OptionList");

        //     this.setState({ MAHProduct: MAHProductList });
        // }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }


        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.MAHProduct) {

            breadCrumbData.push(
                {
                    "label": "IDS_PRODUCT",
                    "value": this.props.Login.masterData.SelectedMahProduct ? this.props.Login.masterData.SelectedMahProduct.sproductname : "NA"

                },
                {
                    "label": "IDS_PRODUCTMANUFACTURE",
                    "value": this.props.Login.masterData.SelectedManufacture ? this.props.Login.masterData.SelectedManufacture.smanufname : "NA"

                },

            );
        }
        return breadCrumbData;
    }

    onMultiColumnValue = (value, key) => {
        if (value.length > 0) {
            const selectedRecord = this.state.selectedRecord || {};
            key.forEach(objarray => {
                selectedRecord[objarray] = value[0][objarray];
            });
            this.setState({ selectedRecord });
        }
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            listtake: e.take
        });
    };
    getLabelValue = (selectedItem, optionList, FindKey, LabelKey) => {
        let lblValueList = []
        optionList.map((option) => {
            if (selectedItem && selectedItem[FindKey] === option[FindKey]) {
                lblValueList.push({ "value": option[FindKey], "label": option[LabelKey] })
            }
            return null;
        })
        selectedItem[FindKey] = lblValueList[0];
    }
    getLabelValuewithExtraValue = (selectedItem, optionList, FindKey, LabelKey) => {
        let LblValueList = [];
        let item = {};
        optionList.map((option) => {
            if (selectedItem && selectedItem[FindKey] === option[FindKey]) {
                LblValueList.push({ "value": option[FindKey], "label": option[LabelKey] })
                item = option;
            }
            return null;
        })
        selectedItem[FindKey] = LblValueList[0];
        selectedItem["saddress1"] = item.saddress1;
        selectedItem["saddress2"] = item.saddress2;
        selectedItem["saddress3"] = item.saddress3;
        selectedItem["scountryname"] = item.scountryname;
    }
    deleteRecord = (key, methodUrl, selectedRecord, masterData, userInfo, ncontrolCode) => {
        if (selectedRecord.ntransactionstatus === 8) {
            const postParam = {
                inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder",
                primaryKeyField: "nproductmahcode",
                primaryKeyValue: selectedRecord.nproductmahcode,
                fetchUrl: "product/getProductMahByManufcode",
                fecthInputObject: { userInfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: methodUrl,
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: { [key]: selectedRecord, "userinfo": userInfo },
                operation: "delete", postParam
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "ProductMAHolder", operation: "delete"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
            // const masterData = this.getMasterDataFromState()
            // this.props.crudMaster(inputParam, masterData, "openModal");
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONLYDRAFTRECORDTODELETE" }));
        }

    }
    copyRecord = (key, methodUrl, selectedRecord, masterData, userInfo, ncontrolCode) => {
        const postParam = {
            inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder",
            primaryKeyField: "nproductmahcode",
            primaryKeyValue: selectedRecord.nproductmahcode,
            fetchUrl: "product/getProductMahByManufcode",
            fecthInputObject: { userInfo: this.props.Login.userInfo },
        }

        const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: { [key]: selectedRecord, "userinfo": this.props.Login.userInfo },
            operation: "copy", postParam
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "ProductMAHolder", operation: "copy"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    completeRecord = (key, methodUrl, selectedRecord, masterData, userInfo, ncontrolCode) => {
        if (selectedRecord.ntransactionstatus === transactionStatus.DRAFT || selectedRecord.ntransactionstatus === transactionStatus.CORRECTION) {
            if (selectedRecord.sdosagepercontainer !== "") {
                const postParam = {
                    inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder",
                    primaryKeyField: "nproductmahcode",
                    primaryKeyValue: selectedRecord.nproductmahcode,
                    fetchUrl: "product/getProductMahByManufcode",
                    fecthInputObject: { userInfo: this.props.Login.userInfo }
                }
                const inputParam = {
                    methodUrl: methodUrl,
                    classUrl: this.props.Login.inputParam.classUrl,
                    inputData: { [key]: selectedRecord, "userinfo": this.props.Login.userInfo },
                    operation: "complete", postParam
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: "ProductMAHolder", operation: "complete"
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, masterData, "openModal");
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERDOSAGETOCOMPLETE" }));
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ALREADYCOMPLETED" }));
        }

    }
    onProductChange = (event, fieldName) => {
        if (event !== null) {
            let Map = {};
            Map["nproductcode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            const selectedRecord = this.state.selectedFilter;
            selectedRecord[fieldName] = event;
            selectedRecord["nproductmanufcode"] = "";
            this.props.getProductChange(Map, selectedRecord, this.props.Login.masterData, this.searchRef);
        }
    }

    getMasterDataFromState() {
        return {
            Product: this.state.Product,
            selectedFilter: this.state.selectedFilter,
            selectedProductmaholder: this.state.selectedProductmaholder,
            ProductManufacturer: this.state.ProductManufacturer,
            productmaholder: this.state.productmaholder,
            ProductMaHistory: this.state.ProductMaHistory,
            ApprovalRoleActionDetail: this.state.ApprovalRoleActionDetail
        }
    }

    onProductManufChange = (value, key) => {
        if (value !== null) {
            // let Map = {};
            const selectedRecord = this.state.selectedFilter;
            //  Map["nproductmanufcode"] = parseInt(value[0].nproductmanufcode);
            // Map['userinfo'] = this.props.Login.userInfo;
            key.forEach(objarray => {
                selectedRecord[objarray] = value[0][objarray];
            });
            this.setState({
                selectedRecord
            });
            //this.props.getProductManufactureChange(Map, selectedRecord, this.props.Login.masterData, this.searchRef);
        }
    }
    onInputOnChange = (event) => {
        // console.log("event:", this);
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            // console.log("comboData, field:", comboData, fieldName);
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            // console.log("combo change:", selectedRecord);
            this.setState({ selectedRecord });
        }
    }
    onMAHChange = (event, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = event;
        selectedRecord["saddress1"] = event.item.saddress1;
        selectedRecord["saddress2"] = event.item.saddress2;
        selectedRecord["saddress3"] = event.item.saddress3;
        selectedRecord["scountryname"] = event.item.scountryname;
        this.setState({ selectedRecord });
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "complete" || this.props.Login.operation === "copy" || this.props.Login.operation === "dynamic") {
                loadEsign = false;
                openModal = false;
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null//, operation: undefined 
            }
        }
        this.props.updateStore(updateInfo);

    }
    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            inputData["productmaholder"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            postParam = { inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder", primaryKeyField: "nproductmahcode" }
            // inputData["productmaholder"] = this.state.selectedRecord;
            this.ProductmaholderFieldList.map(item => {
                return inputData["productmaholder"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
        } else {
            inputData["productmaholder"] = { "nstatus": 1 };
            this.ProductmaholderFieldList.map(item => {
                return inputData["productmaholder"][item] = this.state.selectedRecord[item]
            });
            inputData["productmaholder"]["nproductcode"] = this.state.selectedFilter["nproductcode"] ? this.state.selectedFilter["nproductcode"].value : -1;
            inputData["productmaholder"]["nauthoritycode"] = this.state.selectedRecord["nauthoritycode"] ? this.state.selectedRecord["nauthoritycode"] : -1;
            inputData["productmaholder"]["nproductmanufcode"] = this.state.selectedFilter["nproductmanufcode"] ? this.state.selectedFilter["nproductmanufcode"] : -1;
        }
        inputData["productmaholder"]["nmahcode"] = this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : -1;
        inputData["productmaholder"]["ncertificatetypecode"] = this.state.selectedRecord["ncertificatetypecode"] ? this.state.selectedRecord["ncertificatetypecode"].value : -1;
        inputData["productmaholder"]["ncontainertypecode"] = this.state.selectedRecord["ncontainertypecode"] ? this.state.selectedRecord["ncontainertypecode"].value : -1;
        const masterData = this.props.Login.masterData;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ProductMaHolder",
            inputData: inputData,
            operation: this.props.Login.operation, 
            saveType, formRef, postParam, 
            searchRef: this.searchRef
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    DynamicButton = (ntransactionstatus, nesignneed) => {
        let inputData = [];
        if (Object.keys(this.props.Login.masterData.selectedProductmaholder).length > 0) {
            inputData["productmaholder"] = this.props.Login.masterData.selectedProductmaholder;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["ntransactionstatus"] = parseInt(this.props.Login.masterData.selectedProductmaholder.ntransactionstatus);
            inputData["napprovalstatus"] = parseInt(ntransactionstatus);
            inputData["validationstatus"] = 2;
            const postParam = {
                inputListName: "MAHproductmaholder", selectedObject: "selectedProductmaholder",
                primaryKeyField: "nproductmahcode",
                primaryKeyValue: this.props.Login.masterData.selectedProductmaholder.nproductmahcode,
                fetchUrl: "product/getProductMahByManufcode",
                fecthInputObject: { userInfo: this.props.Login.userInfo }
            }

            const inputParam = {
                methodUrl: "StatusByApprovalConfig",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: inputData,
                operation: "dynamic", postParam
            }
            const masterData = this.props.Login.masterData;
            if (nesignneed === 3) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "ProductMaholder", operation: "dynamic"
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTPRODUCT" }));
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        //console.log("validate esign input:", inputParam);
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "productmaholder",
            methodUrl: "ProductMaHolder",
            userInfo: this.props.Login.userInfo,
            displayName: "IDS_PRODUCTMAHOLDER"
        };
        this.props.callService(inputParam);
    }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, getProductMAHolderComboService,
    selectProductMaholderDetail, getProductChange, getProductManufactureChange, filterColumnData
})(injectIntl(ProductMaHolder));