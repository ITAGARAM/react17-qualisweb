import React from 'react'
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Nav, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt, faCalendar, faEye, faRocket } from '@fortawesome/free-solid-svg-icons';

//import { faTrashAlt, faPencilAlt, faCalendar, faEye } from '@fortawesome/free-solid-svg-icons';

//import { faTrashAlt, faPencilAlt, faCalendar, faEye, faRocket } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import ListMaster from '../../components/list-master/list-master.component';
import ModalShow from '../../components/ModalShow.jsx';
import CustomTab from '../../components/custom-tabs/custom-tabs.component'
import { showEsign, getControlMap, constructOptionList, rearrangeDateFormatDateOnly, sortData, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, constructjsonOptionList, comboChild, convertDateTimetoStringDBFormat, Lims_JSON_stringify,replaceBackSlash } from '../../components/CommonScript';

import {
    callService, updateStore, crudMaster, filterColumnData, validateEsignCredential, viewAttachment,
    initialcombochangeMaterialInvget, getMaterialInventoryByID,
    getAddMaterialInventoryPopup, getMaterialInventoryDetails, addMaterialInventoryFile,
    updateMaterialStatus, openDatePopup, getQuantityTransactionPopup, getMaterialChildValues, getQuantityTransactionOnchange, getSiteonchange
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus, attachmentType, designProperties } from '../../components/Enumeration';
import { ContentPanel, ReadOnlyText } from '../../components/App.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
// import ReactTooltip from 'react-tooltip';
import MaterialFilter from './MaterialFilter';
import { Affix } from 'rsuite';
import AddMaterialOpenDate from './AddMaterialOpenDate';
import AddMaterialFile from './AddMaterialFile';
import InvenotryTransaction from './InvenotryTransaction';
import MaterialInvFileTab from './MaterialInvFileTab';
import { MediaLabel, ProductList } from '../product/product.styled';
import SampleInfoView from '../approval/SampleInfoView';
import ResultEntryTransactionTab from './ResultEntryTransactionTab';
import DynamicSlideoutMaterial from './DynamicSlideoutMaterial';
import MaterialInventoryHistory from './MaterialInventoryHistory';
import AddPrinter from '../registration/AddPrinter';
//import { ReactComponent as Reject } from '../../assets/image/reject.svg';
import {ReactComponent as RetireaMaterialInventory} from '../../assets/image/RetireaMaterialInventory.svg';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class MaterialInventory extends React.Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.state = {
            masterStatus: "",
            sectionDataState: { skip: 0, take: 10 },
            historyDataState: { skip: 0, take: 10 },
            error: "",
            isOpen: false,
            selectedRecord: {},
            filterCatList: [],
            operation: "",
            comboitem: undefined,
            screenName: undefined,
            selectedcombo: undefined, selectedMaterialCatRole: undefined,
            isSelectedRecordChange: false,
            selectedMaterialCat: undefined,
            materialCatList: [],
            userRoleControlRights: [],
            ControlRights: undefined,
            controlMap: new Map(),
            showAccordian: true,
            disablefields: false,
            dataResult: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            dataState: dataState,
            columnName: '',
            rowIndex: 0,
            data: [],
            splitChangeWidthPercentage: 30,
            sidebarview: false
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    expandChange = event => {
        const isExpanded =
            event.dataItem.expanded === undefined
                ? event.dataItem.aggregates
                : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.state });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }


    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }
    render() {

        //console.log('dxc :', this.props.Login.masterData.MaterialInventoryTrans && this.props.Login.masterData.MaterialInventoryTrans)
        const addId = this.state.controlMap.has("AddMaterialInventory") && this.state.controlMap.get("AddMaterialInventory").ncontrolcode;
        const editId = this.state.controlMap.has("EditMaterialInventory") && this.state.controlMap.get("EditMaterialInventory").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteMaterialInventory") && this.state.controlMap.get("DeleteMaterialInventory").ncontrolcode;
        const releaseId = this.state.controlMap.has("ReleaseMaterialInventory") && this.state.controlMap.get("ReleaseMaterialInventory").ncontrolcode;
        const retireId = this.state.controlMap.has("RetireMaterialInventory") && this.state.controlMap.get("RetireMaterialInventory").ncontrolcode;
        const openDateId = this.state.controlMap.has("OpenDateMaterialInventory") && this.state.controlMap.get("OpenDateMaterialInventory").ncontrolcode;
        const viewId = this.state.controlMap.has("ViewMaterialInventory") && this.state.controlMap.get("ViewMaterialInventory").ncontrolcode;
        // const printBarcodeId = this.state.controlMap.has("PrintBarcode") ? this.state.controlMap.get("PrintBarcode").ncontrolcode : -1;

        let masterlistmain = []
        // this.props.Login.masterData.SelectedMaterialInventory &&
        //     console.log('SelectedMaterialInventory :', this.props.Login.masterData.SelectedMaterialInventory)
        // this.props.Login.masterData.SelectedMaterialInventory.jsondata['IDS_OPENDATE']
        // this.props.Login.masterData.MaterialInventory &&
        //     this.props.Login.masterData.MaterialInventory.map((temp, i) => {
        //         return masterlistmain.push(this.props.Login.masterData.MaterialInventory[i].jsondata)
        //     })
        //let searchedDatalistmain = []
        // if (this.props.Login.masterData.searchedData === undefined) {
        //     searchedDatalistmain = undefined
        // } else {
        //     this.props.Login.masterData.searchedData &&
        //         this.props.Login.masterData.searchedData.map((temp, i) => {
        //             return searchedDatalistmain.push(this.props.Login.masterData.searchedData[i].jsondata)
        //         })
        // }
       // let searchFieldList = []
        let mandatoryFieldsMaterialFile = []
        // if (this.props.Login.masterData.SelectedMaterialType) {
        //     if (this.props.Login.masterData.SelectedMaterialType.length > 0) {
        //         if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1) {
        //             searchFieldList = [{
        //                 feild: "IDS_INVENTORYID", jsonfeild: "jsondata"
        //             }]
        //         }
        //         else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2) {
        //             searchFieldList = [{
        //                 feild: "IDS_INVENTORYID", jsonfeild: "jsondata"
        //             }]
        //         }
        //         else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 3) {
        //             searchFieldList = [{
        //                 feild: "IDS_INVENTORYID", jsonfeild: "jsondata"
        //             }]
        //         }
        //     }
        // }
        this.props.Login.masterData.MaterialInventory = this.props.Login.masterData.MaterialInventory &&
            sortData(this.props.Login.masterData.MaterialInventory, "descending", "nmaterialinventorycode")
        this.props.Login.masterData.searchedData = this.props.Login.masterData.searchedData &&
            sortData(this.props.Login.masterData.searchedData, "descending", "nmaterialinventorycode")

        this.props.Login.masterData.MaterialCombo = this.props.Login.masterData.MaterialCombo &&
            sortData(this.props.Login.masterData.MaterialCombo, "ascending", "nmaterialcode")
        this.props.Login.masterData.MaterialType = this.props.Login.masterData.MaterialType &&
            sortData(this.props.Login.masterData.MaterialType, "ascending", "nmaterialtypecode")
        this.props.Login.masterData.MaterialCategoryMain = this.props.Login.masterData.MaterialCategoryMain &&
            sortData(this.props.Login.masterData.MaterialCategoryMain, "ascending", "nmaterialcatcode")


        const filterParam = {
            inputListName: "MaterialInventory", selectedObject: "SelectedMaterialInventory", primaryKeyField: "nmaterialinventorycode",
            fetchUrl: "materialinventory/getMaterialInventorySearchByID",
            fecthInputObject: { userinfo: this.props.Login.userInfo, nmaterialtypecode: this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode },
            masterData: this.props.Login.masterData,
            // isjsondata: true,
            searchFieldList: this.props.Login.masterData.DesignMappedFeilds &&
                JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['searchFieldList'] &&
                JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['searchFieldList']
        };
        let mandatoryFieldsOpenDate = []
        mandatoryFieldsOpenDate = [
            { "idsName": "Open Date", "dataField": "Open Date", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }
        ]
        this.props.Login.screenname === 'IDS_MATERIALINVENTORYFILE' && (this.props.Login.selectedRecord &&
            this.props.Login.selectedRecord.nattachmenttypecode === attachmentType.LINK) ?
            mandatoryFieldsMaterialFile = [
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
            :
            mandatoryFieldsMaterialFile = [
                { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
            ]
        const breadCrumbData = this.state.filterData || [];
        // console.log('masterlistmain', masterlistmain)
        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                <div className="client-listing-wrap mtop-fixed-breadcrumb  fixed_breadcrumd ">
                    {breadCrumbData.length > 0 ?
                        <Affix top={64}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix>
                        : ""
                    }
                    <Row noGutters>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"MaterialInventory"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.MaterialInventory}
                                getMasterDetail={(master) => this.props.getMaterialInventoryDetails(master, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.SelectedMaterialInventory && this.props.Login.masterData.SelectedMaterialInventory}
                                primaryKeyField="nmaterialinventorycode"
                                //mainField="IDS_INVENTORYID"
                                mainField={this.props.Login.masterData.DesignMappedFeilds &&
                                    JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['mainField']}
                                firstField={this.props.Login.masterData.SelectedMaterialCrumb && this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === transactionStatus.YES ?
                                    this.props.Login.masterData.DesignMappedFeilds &&
                                    JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField'] &&
                                    JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField'] :
                                    "Site"
                                    //||JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField']
                                }
                                secondField={this.props.Login.masterData.DesignMappedFeilds &&
                                    JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['secondField']}
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                viewId={viewId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                showFilterIcon={true}
                                onFilterSubmit={this.onFilterSubmit}
                                //viewMaterialInventoryDetails={this.viewMaterialInventoryDetails}
                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <MaterialFilter
                                                filterCatList={this.state.filterCatList || []}
                                                materialCatList={this.state.materialCatList || []}
                                                MaterialComboList={this.state.MaterialComboList || []}
                                                selectedRecord={this.state.selectedcombo || {}}//
                                                selectedMaterialCat={this.state.selectedMaterialCat || {}}
                                                selectedMaterialcombo={this.state.selectedMaterialcombo || {}}
                                                onComboChange={this.onComboChange}
                                                ismaterialInventory={true}
                                            />
                                    }
                                ]}
                                openModal={() => this.props.getAddMaterialInventoryPopup(
                                    "create", this.props.Login, this.props.Login.masterData.SelectedMaterialCrumb,
                                    addId, this.props.Login.masterData,
                                    this.state.selectedRecord)}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            <Row>
                                <Col md={12}>
                                    <ContentPanel className="panel-main-content">
                                        {this.props.Login.masterData.MaterialInventory && this.props.Login.masterData.MaterialInventory.length > 0 && this.props.Login.masterData.SelectedMaterialInventory ?
                                            <Card className="border-0">
                                                <Card.Header>
                                                    {/* <Card.Title className="product-title-main">{this.props.intl.formatMessage({ id: "IDS_MATERIALINVENTORY" })}</Card.Title> */}
                                                    <Card.Title className="product-title-main">{
                                                        this.props.Login.masterData.SelectedMaterialInventory &&
                                                        this.props.Login.masterData.SelectedMaterialInventory['Inventory ID']
                                                    }</Card.Title>
                                                    <Card.Subtitle>
                                                        <ProductList className="d-flex product-category icon-group-wrap">
                                                            <h2 className="product-title-subMaterial flex-grow-1">
                                                                <MediaLabel
                                                                    className={`btn btn-outlined 
                                                                    outline-success btn-sm ml-3`}>
                                                                    {/* <h2 className="product-title-sub flex-grow-1"> */}
                                                                    {
                                                                        this.props.intl.formatMessage({ id: "IDS_AVAILABLEQTY" })
                                                                        // this.props.Login.masterData.SelectedMaterialInventory &&
                                                                        // this.props.Login.masterData.SelectedMaterialInventory['jsondata']['status']
                                                                    }: {this.props.Login.masterData.MaterialInventoryTrans.length > 0 ?
                                                                        this.props.Login.masterData.MaterialInventoryTrans && this.props.Login.masterData.MaterialInventoryTrans[0]['Available Quantity']===this.props.Login.masterData.MaterialInventoryTrans[0]['Overall Available Quantity']?
                                                                        this.props.Login.masterData.MaterialInventoryTrans[0]['Overall Available Quantity'] :this.props.Login.masterData.MaterialInventoryTrans &&
                                                                        this.props.Login.masterData.MaterialInventoryTrans[0]
                                                                        //[0]['jsondata']
                                                                        ['Available Quantity'] + ' / ' 
                                                                        +     this.props.Login.masterData.MaterialInventoryTrans[0]
                                                                            //[0]['jsondata']
                                                                            ['Overall Available Quantity'] : "-"     }
                                                                    {/*   {':'}
                                                                    {
                                                                        this.props.intl.formatMessage({ id: "IDS_OVAERALLAVAILABLEQTY" })
                                                                        // this.props.Login.masterData.SelectedMaterialInventory &&
                                                                        // this.props.Login.masterData.SelectedMaterialInventory['jsondata']['status']
                                                                    }: {this.props.Login.masterData.MaterialInventoryTrans.length > 0 ? this.props.Login.masterData.MaterialInventoryTrans &&
                                                                        this.props.Login.masterData.MaterialInventoryTrans[0]
                                                                        //[0]['jsondata']
                                                                        ['Overall Available Quantity'] : "-"} */}
                                                                </MediaLabel>


                                                            </h2>
                                                            <div className="d-inline ">
                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#" 
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWMATERIALINVDETAILS" })}
                                                                    //    data-for="tooltip_list_wrap"
                                                                    onClick={this.viewMaterialInventoryDetails}
                                                                >
                                                                    <FontAwesomeIcon icon={faEye}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_VIEWMATERIALINVDETAILS" })} />
                                                                   
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    //  data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.props.getAddMaterialInventoryPopup(
                                                                            "update", this.props.Login, this.props.Login.masterData.SelectedMaterialCrumb,
                                                                            editId, this.props.Login.masterData,
                                                                            this.state.selectedRecord)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>

                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    //  data-for="tooltip_list_wrap"
                                                                    onClick={() => this.ConfirmDelete(deleteId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />

                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_OPENDATE" })}
                                                                    //  data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.props.openDatePopup(this.props.Login.masterData, openDateId, this.props.Login.userInfo)
                                                                    }
                                                                // disabled={this.props.Login.masterData.
                                                                //     SelectedMaterialCrumb['jsondata'].IDS_OPENEXIPIRYNEED === '4' ?
                                                                //     true : false}
                                                                // disabled={this.props.Login.masterData.
                                                                //     SelectedMaterialCrumb['jsondata'].IDS_OPENEXIPIRYNEED === '4' ?
                                                                //     true : false}

                                                                // disabled={this.props.Login.masterData.
                                                                //     SelectedMaterialCrumb['jsondata'].IDS_OPENEXIPIRYNEED === '4' ?
                                                                //     true : false}

                                                                //disabled={true}
                                                                >
                                                                    <FontAwesomeIcon icon={faCalendar}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_OPENDATE" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RELEASE" })}
                                                                    //   data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.updateMaterialStatus(releaseId, 1)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={faRocket}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_RELEASE" })} />
                                                                </Nav.Link>

                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                                    //  data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.updateMaterialStatus(retireId, 2)
                                                                    }
                                                                >
                                                                    <RetireaMaterialInventory/>
                                                                    {/* <FontAwesomeIcon icon={faUserTimes} /> */}
                                                                    {/* <Reject className="custom_icons" width="20" height="20" /> */}
                                                                    {/* <FontAwesomeIcon icon={faEraser}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_RETIRE" })} /> */}
                                                                    {/* <FontAwesomeIcon icon={faTrashAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_RETIRE" })} /> */}

                                                                    {/* <FontAwesomeIcon icon={faTrashAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_RETIRE" })} /> */}

                                                                </Nav.Link>
                                                                {/* <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                                                 //   data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.printBarcode()
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={faPrint}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })} />
                                                                </Nav.Link> */}
                                                            </div>
                                                        </ProductList>
                                                    </Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        {this.state.showInventoryDetails &&


                                                            // this.props.Login.masterData.DesignMappedFeilds &&
                                                            // JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)
                                                            // [this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===1?
                                                            //     'MaterialInventoryStandardViewFields':this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===2?
                                                            //     'MaterialInventoryVolumetricViewFields':'MaterialInventoryMatInventViewFields'
                                                            // ].map((field, index) =>
                                                            //     <Col md={4} key={index}>
                                                            //         <FormGroup>
                                                            //             <FormLabel>
                                                            //                 <FormattedMessage id={field[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode]} message={field[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode]} />
                                                            //             </FormLabel>
                                                            //             <ReadOnlyText>{
                                                            //                 field.hasOwnProperty('isDateFeild')? this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]] ?
                                                            //              rearrangeDateFormatDateOnly(this.props.Login.userInfo
                                                            //                     ,this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]] )
                                                            //                 : "-":
                                                            //                 this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]] ?
                                                            //                     this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]].label ?
                                                            //                         this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]].label
                                                            //                         : this.props.Login.masterData.SelectedMaterialInventory.jsondata[field[designProperties.VALUE]]
                                                            //                     : "-"}</ReadOnlyText>
                                                            //         </FormGroup>
                                                            //     </Col>
                                                            // )
                                                            <SampleInfoView
                                                                data={this.props.Login.masterData.SelectedMaterialInventory}
                                                                SingleItem={JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)
                                                                [
                                                                    'MaterialInventoryViewFields'
                                                                ]}
                                                                screenName="IDS_SAMPLEINFO"
                                                                userInfo={this.props.Login.userInfo}
                                                                // ALPD-950
                                                                size={4}

                                                            />

                                                        }
                                                    </Row>
                                                    {this.state.showInventoryDetails ? "": this.props.Login.masterData && <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />}
                                                </Card.Body>
                                            </Card> : ""}
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                { }
                {
                    (this.props.Login.openModal || this.props.Login.openChildModal) &&
                    <SlideOutModal show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.screenname === 'IDS_QUANTITYTRANSACTION' ? '' :
                            this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenname === 'IDS_QUANTITYTRANSACTION' ? 'IDS_TRANSFERQUANTITY'
                            : this.props.Login.screenname}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenname !== 'IDS_MATERIALINVENTORYFILE' ?
                            this.props.Login.screenname !== 'IDS_QUANTITYTRANSACTION' ? (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1
                                || this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2 ||
                                this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 3 ||
                                this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 4) && this.dynamicmandatoryFeilds(this.props.Login.masterData.selectedTemplate[0].jsondata)
                                : this.dynamicmandatoryFeilds(this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata) : mandatoryFieldsMaterialFile}
                        updateStore={this.props.updateStore}
                        addComponent={
                            this.props.Login.loadPrinter ?
                                <AddPrinter
                                    printer={this.props.Login.printer}
                                    selectedPrinterData={this.state.selectedPrinterData}
                                    PrinterChange={this.PrinterChange}
                                /> :
                                this.props.Login.loadEsign ?
                                    <Esign operation={this.props.Login.operation}
                                        onInputOnChange={this.onInputOnChange}
                                        inputParam={this.props.Login.inputParam}
                                        selectedRecord={this.state.selectedRecord || {}}
                                    />
                                    :
                                    this.props.Login.screenname === "IDS_MATERIALINVENTORYFILE" ?
                                        <AddMaterialFile
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChangeFile}
                                            onDrop={this.onDropMaterialFile}
                                            deleteAttachment={this.deleteAttachment}
                                            onComboChange={this.onComboChange}
                                            linkMaster={this.props.Login.linkMaster}
                                            maxSize={20}
                                            maxFiles={1}
                                            multiple={false}
                                            label={this.props.intl.formatMessage({ id: "IDS_MATERIALINVENTORYFILE" })}
                                            name="testfilename"
                                            settings={this.props.Login.settings}
                                        />
                                        :
                                        <DynamicSlideoutMaterial
                                            operation={this.props.Login.operation}
                                            disablefields={this.state.disablefields}
                                            selectedRecord={this.state.selectedRecord}
                                            // isSectionneed={this.props.Login.isSectionneed ? this.props.Login.isSectionneed :
                                            //     this.props.Login.masterData.SelectedMaterialCategory.needSectionwise}
                                           isSectionneed={this.props.Login.masterData.SelectedMaterialCategory.needSectionwise ===transactionStatus.NO? this.props.Login.masterData.SelectedMaterialCategory.needSectionwise:this.props.Login.isSectionneed }
                                           //isSectionneed={4}
                                                needsectionwise=  {this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise}
                                            //enabledisableSectionInvTrans={this.state.selectedRecord['IDS_INVENTORYTRANSACTIONTYPE'] && this.state.selectedRecord['IDS_INVENTORYTRANSACTIONTYPE'].value}
                                            ismaterialSectionneed={this.props.Login.screenname !== 'IDS_QUANTITYTRANSACTION' ? this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise :
                                                this.state.selectedRecord['Inventory Transaction Type']
                                                    && this.state.selectedRecord['Inventory Transaction Type'].value === 2 ? 4 : 3}
                                            screenname={this.props.Login.screenname}
                                            templateData={this.props.Login.screenname !== 'IDS_QUANTITYTRANSACTION' ? this.props.Login.masterData.selectedTemplate &&
                                                this.props.Login.masterData.selectedTemplate[0].jsondata
                                                : this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata}
                                            onNumericInputChange={this.onNumericInputChange}
                                            enabledisableAvailableQty={this.state.selectedRecord['Transaction Type'] && this.state.selectedRecord['Transaction Type'].value}
                                            handleChange={this.handleChange}
                                            onInputOnChange={this.onInputOnChange}
                                            // isExpiryNeed={parseInt(this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].isExpiryNeed)}
                                            comboData={this.props.Login.templateData && this.props.Login.templateData.comboData}
                                            onComboChange={this.onComboChangedynamic}
                                            userInfo={this.props.Login.userInfo}
                                            handleDateChange={this.handleDateChange}
                                            nprecision={this.props.Login.masterData.nprecision}
                                            timeZoneList={this.props.Login.timeZoneList}
                                            isreusable={this.props.Login.masterData.SelectedMaterialCrumb['jsondata']['Reusable']}
                                            needfeild={this.state.selectedRecord['Transaction Type'] && this.state.selectedRecord['Transaction Type'].value === transactionStatus.RECEIVED ? transactionStatus.YES :
                                                transactionStatus.NO}
                                        />
                        }
                    />



                }

                {this.props.Login.showModalPopup &&
                    <ModalShow
                        modalShow={true}
                        selectedRecord={this.state.selectedRecord}
                        modalTitle={this.props.intl.formatMessage({ id: this.props.Login.ModaTitle })}
                        needSave={this.props.Login.ModaTitle === 'IDS_OPENDATE' ? false : true}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.props.Login.ModaTitle === 'IDS_OPENDATE' && this.saveClick}
                        validateEsign={this.validateEsign}
                        mandatoryFields={this.props.Login.ModaTitle === 'IDS_OPENDATE' && mandatoryFieldsOpenDate}
                        modalBody={
                            this.props.Login.ModaTitle === 'IDS_OPENDATE' ? <AddMaterialOpenDate
                                isMultiLingualLabel={true}
                                label={this.props.intl.formatMessage({ id: "IDS_OPENDATE" })}
                                intl={this.props.intl.formatMessage}
                                selectedRecord={this.state.selectedRecord}
                                dateonly={true}
                                onComboChange={this.onComboChangeopendate}
                                userInfo={this.props.Login.userInfo}
                                handleDateChange={this.handleDateChange}
                                mandatory={true}
                                timeZoneList={this.props.Login.timeZoneList}
                            /> :
                                this.props.Login.ModaTitle !== 'IDS_QUANTITYTRANSACTION' ?
                                    <Row>
                                        <Col md='4'>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id={'Inventory ID'} message={'Inventory ID'} /></FormLabel>
                                                <ReadOnlyText>
                                                    {this.props.Login.masterData.SelectedMaterialInventory.jsondata &&
                                                        this.props.Login.masterData.SelectedMaterialInventory['Inventory ID'] ?
                                                        this.props.Login.masterData.SelectedMaterialInventory['Inventory ID'] : "-"}
                                                </ReadOnlyText>
                                            </FormGroup>
                                        </Col>
                                        {this.accordianDesign(this.props.Login.masterData.selectedTemplate[0].jsondata,
                                            this.props.Login.masterData.SelectedMaterialInventory.jsondata)}
                                        <Col md='4'>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id={'IDS_OPENDATE'} message={'Open Date'} /></FormLabel>
                                                <ReadOnlyText>
                                                    {this.props.Login.masterData.SelectedMaterialInventory.jsondata &&
                                                        this.props.Login.masterData.SelectedMaterialInventory.jsondata['IDS_OPENDATE'] ?
                                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                                            this.props.Login.masterData.SelectedMaterialInventory.jsondata['IDS_OPENDATE']
                                                        )
                                                        : "-"}
                                                </ReadOnlyText>

                                            </FormGroup>
                                        </Col>
                                    </Row> :
                                    <Row>
                                        {this.accordianDesign(this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata,
                                            this.props.Login.viewQuantityTransdetails)}
                                        <Col md='4'>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id={'IDS_AVAILABLEQTY'} message={'Open Date'} /></FormLabel>
                                                <ReadOnlyText>
                                                    {this.props.Login.masterData.SelectedMaterialInventory.jsondata &&
                                                        this.props.Login.viewQuantityTransdetails['namountleft'] ?
                                                        this.props.Login.viewQuantityTransdetails['namountleft'] : "-"
                                                        // this.props.Login.navailableqty
                                                    }
                                                </ReadOnlyText>

                                            </FormGroup>
                                        </Col>
                                        <Col md='4'>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id={'IDS_ISSUEDQUANTITY'} message={'Open Date'} /></FormLabel>
                                                <ReadOnlyText>
                                                    {this.props.Login.masterData.SelectedMaterialInventory.jsondata &&
                                                        this.props.Login.viewQuantityTransdetails['nqtyissued'] ?
                                                        this.props.Login.viewQuantityTransdetails['nqtyissued'] : "-"}
                                                </ReadOnlyText>

                                            </FormGroup>
                                        </Col>
                                    </Row>
                        }
                    />
                }

            </>
        );
    }
    gridfillingColumn(data) {
        const temparray = data && data.map((option) => {
            return {
                "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode],
                "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3"
            };
        });
        return temparray;
    }
    quantityTransaction = (param) => {
        //if (this.props.Login.masterData['SelectedMaterialInventory'].jsondata.ntranscode === transactionStatus.RELEASED) {
        let ncontrolCode = this.props.Login.ncontrolCode
        let openModal = this.props.Login.openModal
        openModal = true
        ncontrolCode = param;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal }
        }
        this.props.getQuantityTransactionPopup(this.props.Login.masterData, this.props.Login.userInfo, updateInfo, ncontrolCode)
        // }
        // else {
        //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRELEASEDINVENTORY" }));

        // }
    }
    viewQuantityTrans = (viewQuantityTransdetails) => {
        let showModalPopup = this.props.Login.showModalPopup;
        let ModaTitle = this.props.Login.ModaTitle;
        showModalPopup = true;
        ModaTitle = 'IDS_QUANTITYTRANSACTION'
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showModalPopup, ModaTitle, viewQuantityTransdetails }
        }
        this.props.updateStore(updateInfo);
    }
    accordianDesign = (Template, selectedmasterlistmain1) => {
        let selectedmasterlistmain = [];
        selectedmasterlistmain.push(selectedmasterlistmain1)
        let designaccordian = [];
        Template.map((row) => {
            row.children.map((column) => {
                column.children.map((component) => {
                    if (component.inputtype === 'combo') {
                        if (component.label !== undefined) {
                            designaccordian.push(<Col md={4}>
                                <FormGroup>
                                    <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                    <ReadOnlyText >
                                        {selectedmasterlistmain.length > 0 &&
                                            selectedmasterlistmain[0][component.label] ?
                                            selectedmasterlistmain[0][component.label]['label'] : "-"}
                                    </ReadOnlyText>

                                </FormGroup>
                            </Col>)
                        }
                    }
                    else if (component.inputtype === 'date') {
                        if (component.label !== undefined) {
                            designaccordian.push(<Col md={4}>
                                <FormGroup>
                                    <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                    <ReadOnlyText>
                                        {selectedmasterlistmain.length > 0 &&
                                            selectedmasterlistmain[0][component.label] ?
                                            rearrangeDateFormatDateOnly(
                                                this.props.Login.userInfo, selectedmasterlistmain[0][component.label])
                                            // selectedmasterlistmain[0][component.label]
                                            : "-"}

                                    </ReadOnlyText>

                                </FormGroup>
                            </Col>)
                        }
                    }
                    else if (component.inputtype === 'toggle') {
                        if (component.label !== undefined) {
                            designaccordian.push(<Col md={4}>
                                <FormGroup>
                                    <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                    <ReadOnlyText>
                                        {selectedmasterlistmain.length > 0 &&
                                            selectedmasterlistmain[0][component.label] &&
                                            selectedmasterlistmain[0][component.label] === transactionStatus.YES ?
                                            'Yes' : 'No'}
                                    </ReadOnlyText>

                                </FormGroup>
                            </Col>)
                        }
                    }
                    else {
                        if (component.label !== undefined) {
                            if (!component.needAccordian) {
                                designaccordian.push(<Col md={4}>
                                    <FormGroup >

                                        <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                        <ReadOnlyText >
                                            {selectedmasterlistmain.length > 0 &&
                                                selectedmasterlistmain[0][component.label] ? selectedmasterlistmain[0][component.label] : "-"}
                                        </ReadOnlyText>

                                    </FormGroup>
                                </Col>
                                )
                            }
                        }
                    }
                    component.hasOwnProperty("children") && component.children.map((componentrow) => {
                        if (componentrow.inputtype === 'combo') {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id={[componentrow.label]} message={[componentrow.label]} /></FormLabel>
                                        <ReadOnlyText>
                                            {selectedmasterlistmain.length > 0 &&
                                                selectedmasterlistmain[0][componentrow.label] ?
                                                selectedmasterlistmain[0][componentrow.label]['label'] : "-"}
                                        </ReadOnlyText>

                                    </FormGroup>
                                </Col>)
                            }
                        }
                        else if (componentrow.inputtype === 'date') {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id={[componentrow.label]} message={[componentrow.label]} /></FormLabel>
                                        <ReadOnlyText>
                                            {selectedmasterlistmain.length > 0 &&
                                                selectedmasterlistmain[0][componentrow.label] ?
                                                selectedmasterlistmain[0][componentrow.label] : "-"}
                                        </ReadOnlyText>

                                    </FormGroup>
                                </Col>)
                            }
                        }
                        else if (componentrow.inputtype === 'toggle') {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id={[componentrow.label]} message={[componentrow.label]} /></FormLabel>
                                        <ReadOnlyText>
                                            {selectedmasterlistmain.length > 0 &&
                                                selectedmasterlistmain[0][componentrow.label] &&
                                                selectedmasterlistmain[0][componentrow.label]['label'] === transactionStatus.YES ?
                                                'Yes' : 'No'}
                                        </ReadOnlyText>

                                    </FormGroup>
                                </Col>)
                            }
                        }
                        else {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id={[componentrow.label]} message={[componentrow.label]} /></FormLabel>
                                        <ReadOnlyText>
                                            {selectedmasterlistmain.length > 0 &&
                                                selectedmasterlistmain[0][componentrow.label] ?
                                                selectedmasterlistmain[0][componentrow.label] : "-"}
                                        </ReadOnlyText>

                                    </FormGroup>
                                </Col>)
                            }
                        }
                    }
                    )
                })
            })
        })
        return designaccordian;
    }
    onComboChangeopendate = (comboData, control) => {

        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[control] = comboData;
        this.setState({ selectedRecord });


    }
    // onComboChangedynamic = (comboData, control, customName) => {
    //     let comboName = customName || control.label;
    //     let selectedRecord = this.state.selectedRecord || {};
    //     let comboDataList=this.props.Login.templateData.comboData
    //     //   if(comboData!==null){
    //     if (comboData) {
    //         selectedRecord[comboName] = comboData;
    //     } else {
    //         selectedRecord[comboName] = []
    //     }
    //     if (control.inputtype === 'date') {
    //         const selectedRecord = this.state.selectedRecord || {};
    //         selectedRecord[`tz${control.label}`] = comboData;
    //         this.setState({ selectedRecord });
    //     }
    //     else if (control.parent && control.parent === true) {
    //         let data = [];
    //         const Layout = this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata
    //         Layout.map((row) => {
    //             row.children.map((column) => {
    //                 column.children.map((component) => {
    //                     if (component.inputtype === 'combo') {
    //                         data.push(component)
    //                     }
    //                     component.hasOwnProperty("children") && component.children.map(
    //                         (componentrow) => {
    //                             if (componentrow.inputtype === 'combo') {
    //                                 data.push(componentrow)
    //                             }
    //                         }
    //                     )
    //                 })
    //             })
    //         })
    //         const comboComponents = data
    //         let parentcolumnlist = []
    //         comboComponents.map(columnList => {
    //             if (columnList.hasOwnProperty('child')) {
    //                 parentcolumnlist.push(columnList)
    //             }
    //         })
    //         if (comboData !== null) {
    //             let childColumnList = {};
    //             parentcolumnlist.map(columnList => {
    //                 const val = comboChild(data, columnList, childColumnList, true);
    //                 data = val.data;
    //                 childColumnList = val.childColumnList
    //             })
    //             const inputParem = {
    //                 child: control.child,
    //                 source: control.source,
    //                 primarykeyField: control.valuemember,
    //                 value: comboData.value && comboData.value,
    //                 item: comboData.item
    //             }
    //             if (control.label === 'Section') {
    //                 // comboData
    //                 this.props.getQuantityTransactionOnchange(comboData, this.props.Login.masterData,
    //                     this.props.Login.userInfo, selectedRecord, this.props.Login.templateData, true)
    //             }
    //             else {
    //                 this.props.getMaterialChildValues(inputParem,
    //                     this.props.Login.userInfo, selectedRecord,
    //                     parentcolumnlist, childColumnList, this.props.Login.templateData.comboData, Object.keys(childColumnList)[0]
    //                     , childColumnList[Object.keys(childColumnList)[0]][0].label, this.props.Login.masterData)
    //             }
    //         }
    //         else {
    //             parentcolumnlist.map(columnList => {
    //                 if(columnList.hasOwnProperty('child'))
    //                 {
    //                     columnList.child.map(childLabel=>{
    //                         selectedRecord={
    //                             ...selectedRecord,
    //                             [childLabel.label]:""
    //                         }
    //                         comboDataList[childLabel.label]=""
    //                         if(childLabel.hasOwnProperty('dependentComponent'))
    //                         {
    //                             selectedRecord={
    //                                 ...selectedRecord,
    //                                 [childLabel.dependentComponent]:""
    //                             } 
    //                         }
    //                     })
    //                 }
    //                 //selectedRecord="" 
    //             })
    //            // this.setState({ selectedRecord });
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: { selectedRecord,comboDataList }
    //             }
    //             this.props.updateStore(updateInfo);
    //         }
    //     }
    //     else {
    //         if (control.label === 'Transaction Type'
    //             // || control.label === 'IDS_SECTION'
    //         ) {
    //             if(comboData!==null)
    //             {
    //                 this.props.getQuantityTransactionOnchange(comboData, this.props.Login.masterData,
    //                     this.props.Login.userInfo, selectedRecord, this.props.Login.templateData)
    //             }
    //             else{
    //                 selectedRecord[control.label]=""
    //                 if(control.hasOwnProperty('dependentComponent'))
    //                 {
    //                     selectedRecord[control.dependentComponent]=""
    //                 }
    //                 const updateInfo = {
    //                     typeName: DEFAULT_RETURN,
    //                     data: { selectedRecord  }
    //                 }
    //                 this.props.updateStore(updateInfo);
    //             } 
    //         }
    //         else {
    //             selectedRecord[control.label] = comboData;
    //             this.setState({ selectedRecord });
    //         }
    //     }
    //     //}
    //     // else
    //     // {
    //     //     selectedRecord=""
    //     //     this.setState({ selectedRecord });
    //     // }
    // }
    onComboChangedynamic = (comboData, control, customName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if(comboData!==null){
        //const comboDatamain = this.props.Login.templateData.comboData
        if (control.valuemember && control.nquerybuildertablecode) {
            comboData["item"] = {
                ...comboData["item"], pkey: control.valuemember,
                nquerybuildertablecode: control.nquerybuildertablecode, "source": control.source
            }
        }
        let comboName = customName || control.label;
        if (comboData) {
            selectedRecord[comboName] = comboData;
        } else {
            selectedRecord[comboName] = []
        }
        if (control.inputtype === 'date') {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[`tz${control.label}`] = comboData;
            this.setState({ selectedRecord });
        }
        else if (this.props.Login.screenname === 'IDS_QUANTITYTRANSACTION' ?
            control.label !== 'Section' ? control.parent && control.parent === true : true : control.parent && control.parent === true) {
            let data = [];
            const Layout = this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        if (component.hasOwnProperty('child')) {
                            component.child.map((c) => {
                                if (comboData === null) {
                                    if (c.label === control.label) {
                                        if (control.label === 'Section') {
                                            if (this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === transactionStatus.YES)
                                                delete selectedRecord["Available Quantity/Unit"]
                                            //  delete selectedRecord["Transaction Type"]  
                                            // delete selectedRecord["Inventory Transaction Type"]  
                                        }
                                        // delete comboDatamain["Transaction Type"] 
                                        //  delete comboDatamain["Site"] 
                                        //  delete comboDatamain[control.label] 
                                        delete selectedRecord[control.label]
                                        //delete selectedRecord[component.label]  

                                    }
                                }
                            })
                        }
                        if (component.inputtype === 'combo') {
                            data.push(component)
                        }
                        component.hasOwnProperty("children") && component.children.map(
                            (componentrow) => {
                                if (componentrow.inputtype === 'combo') {
                                    data.push(componentrow)
                                }
                            }
                        )
                    })
                })
            })
            const comboComponents = data
            if (comboData) {
                let parentcolumnlist = []
                comboComponents.map(columnList => {
                    if (columnList.hasOwnProperty('child')) {
                        if (control.label === columnList.label)
                            parentcolumnlist.push(columnList)
                    }
                })
                let childColumnList = {};
                parentcolumnlist.map(columnList => {
                    const val = comboChild(data, columnList, childColumnList, true);
                    data = val.data;
                    if (control.label === columnList.label)
                        childColumnList = val.childColumnList
                })
                const inputParem = {
                    child: control.child,
                    source: control.source,
                    primarykeyField: control.valuemember,
                    value: comboData.value,
                    item: comboData.item
                }
                //       if (control.label === 'Site') {
                //         // comboData
                //         this.props.getSiteonchange(comboData, this.props.Login.masterData,
                //             this.props.Login.userInfo, selectedRecord, this.props.Login.templateData, true)
                //     }
                //    else 

                if (control.label === 'Section') {
                    // comboData
                    this.props.getQuantityTransactionOnchange(comboData, this.props.Login.masterData,
                        this.props.Login.userInfo, selectedRecord, this.props.Login.templateData, true)
                }
                else {
                    this.props.getMaterialChildValues(inputParem,
                        this.props.Login.userInfo, selectedRecord,
                        parentcolumnlist, childColumnList, this.props.Login.templateData.comboData, control.label
                        , childColumnList[control.label][0].label, this.props.Login.masterData)
                }
            }
            else {
                this.setState({
                    selectedRecord
                    //    ,disablefields:true
                });
            }
        }
        else {
            if (control.label === 'Transaction Type'
                // || control.label === 'IDS_SECTION'
            ) {
                this.props.getQuantityTransactionOnchange(comboData, this.props.Login.masterData,
                    this.props.Login.userInfo, selectedRecord, this.props.Login.templateData)
            }
            else {
                selectedRecord[control.label] = comboData;
                this.setState({ selectedRecord });
            }
        }
    }
    else{
        if(control.label === 'Storage Location'){
            delete selectedRecord[control.label ];
        }
        else if(control.label === 'Supplier'){
            delete selectedRecord[control.label ];
        }
        else if(control.label === 'Manufacturer'){
            delete selectedRecord[control.label ];
        }
        //ALPD-5425 Material Inventory - Cant able to clear the material grade.
        else if (control.label === 'Grade') {
            delete selectedRecord[control.label];
        }
        else if (control.label === 'Storage Condition') {
            delete selectedRecord[control.label];
        }
        this.setState({selectedRecord});
    }
    }
    viewMaterialInventoryDetails = () => {
       // console.log('this.state.SelectedMaterialInventory :', this.state.SelectedMaterialInventory)
       // console.log('tthis.props.Login.showModalPopup :', this.props.Login.masterData.SelectedMaterialInventory)
        if (this.props.Login.masterData.SelectedMaterialInventory) {
            if (this.props.Login.masterData.SelectedMaterialInventory.length !== 0) {
                // let showModalPopup = this.props.Login.showModalPopup;
                let showInventoryDetails = this.state.showInventoryDetails;
                //showModalPopup = true;

                if (showInventoryDetails === undefined) {
                    this.setState({ showInventoryDetails: true })
                }
                if (showInventoryDetails) {
                    this.setState({ showInventoryDetails: false })
                }
                else {
                    this.setState({ showInventoryDetails: true })
                }


                // ModaTitle = 'IDS_MATERIALINVENTORYDETAILS'
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //    // data: { showModalPopup, ModaTitle }
                //    data: { showInventoryDetails, ModaTitle }
                // }
                // this.props.updateStore(updateInfo);
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMATERIALINVENTORY" }))
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMATERIALINVENTORY" }))
        }
    }
    closeModalShow = () => {
        let showModalPopup = this.props.Login.showModalPopup;
        showModalPopup = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showModalPopup }
        }
        this.props.updateStore(updateInfo);
    }
    handleDateChange = (dateValue, dateName) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    onDropMaterialFile = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete"
        });
    }
    onSaveMaterialFile = () => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let testFileArray = [];
       
        let testFile = {
            nmaterialconfigcode: this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
            nmaterialinventorycode: this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode,
            nmaterialinventoryfilecode: selectedRecord.nmaterialinventoryfilecode ? selectedRecord.nmaterialinventoryfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        testFile['sdefaultstatus'] = {}
        testFile['sdefaultstatus'] = testFile['ndefaultstatus'] === 3 ? 'Yes' : 'No'
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, testFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ntestfilecode && selectedRecord.ntestfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    tempData["dcreateddate"] = this.props.Login.dcreateddate &&
                        convertDateTimetoStringDBFormat(this.props.Login.dcreateddate, this.props.Login.userInfo)

                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    testFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                testFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                testFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                testFile["nlinkcode"] = transactionStatus.NA;
                testFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                testFile["nfilesize"] = selectedRecord.nfilesize;
                testFile["dcreateddate"] = this.props.Login.dcreateddate &&
                    convertDateTimetoStringDBFormat(this.props.Login.dcreateddate, this.props.Login.userInfo)
                testFileArray.push(testFile);
            }
        } else {
            testFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename.trim()), false);
            testFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""), false);
            testFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            testFile["slinkname"] = selectedRecord['nlinkcode'].label && selectedRecord['nlinkcode'].label;
            testFile["dcreateddate"] = this.props.Login.dcreateddate &&
                convertDateTimetoStringDBFormat(this.props.Login.dcreateddate, this.props.Login.userInfo)
            testFile["ssystemfilename"] = "";
            testFile["nfilesize"] = 0;
            testFileArray.push(testFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("materialinventoryfile", JSON.stringify(testFileArray[0]));
        //let selectedId = null;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "MaterialInventory", selectedObject: "SelectedMaterialInventory", primaryKeyField: "nmaterialinventorycode" };
            //selectedId = selectedRecord["nmaterialinventoryfilecode"];
        }
        let inputParam;
        if (this.props.Login.operation === 'create') {
            inputParam = {
                // inputData: { userinfo: this.props.Login.userInfo },
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)

                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)

                    }
                },
                formData: formData,
                isFileupload: true,
                operation: "create",
                classUrl: "materialinventory",
                methodUrl: "MaterialInventoryFile", postParam, searchRef: this.searchRef, isChild: true
            }
        }
        else {
            inputParam = {
                // inputData: { userinfo: this.props.Login.userInfo },
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)

                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                    }
                },
                formData: formData,
                isFileupload: true,
                operation: "update",
                classUrl: "materialinventory",
                methodUrl: "MaterialInventoryFile", postParam
            }
        }
        return inputParam;
    }

    dynamicmandatoryFeilds = (Template) => {
        // console.log('mandatory', Template)
        let mandatoryFeildsMaterial = [];
        let slanguagetypecode = this.props.Login.userInfo.slanguagetypecode;
        let bool = false; 
        //ALPD-4842 material Inventory-->while add the Quantity transaction, section not showing
        let sectionneed=this.props.Login.masterData.SelectedMaterialCategory && this.props.Login.masterData.SelectedMaterialCategory.needSectionwise ||-1;
        Template.map((row) => {
            row.children.map((column) => {
                column.children.map((component) => {
                    if (component.mandatory) {
                        if (component.inputtype === 'combo') {

                            if(component.label==='Section' ){
                                if(sectionneed===transactionStatus.YES){
                                    mandatoryFeildsMaterial.push({
                                        // "idsName": component.label, "dataField": component.label,
                                        "idsName": component.displayname[slanguagetypecode], "dataField": component.label,
                                        "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                                    })
                                }
                            }else{
                                mandatoryFeildsMaterial.push({
                                    // "idsName": component.label, "dataField": component.label,
                                    "idsName": component.displayname[slanguagetypecode], "dataField": component.label,
                                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                                })
                            }
                           
                        }
                        else {
                            mandatoryFeildsMaterial.push({
                                // "idsName": component.label, "dataField": component.label,
                                "idsName": component.displayname[slanguagetypecode], "dataField": component.label,
                                "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                            })
                        }
                    }
                    component.hasOwnProperty("children") && component.children.map((componentrow) => {
                        if (componentrow.mandatory) {
                            if (componentrow.inputtype === 'combo') {
                                mandatoryFeildsMaterial.push({
                                    // "idsName": componentrow.label, "dataField": componentrow.label,
                                    "idsName": componentrow.displayname[slanguagetypecode], "dataField": componentrow.label,
                                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                                })
                            }
                            else {
                                mandatoryFeildsMaterial.push({
                                    // "idsName": componentrow.label, "dataField": componentrow.label,
                                    "idsName": componentrow.displayname[slanguagetypecode], "dataField": componentrow.label,
                                    "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                                })
                            }
                        }
                    })
                })
            })
        })
        if (this.state.selectedRecord['Transaction Type']) {
            // if ( (this.props.Login.screenname === "IDS_QUANTITYTRANSACTION"&&
            // this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise!== transactionStatus.YES)
            //  ? this.props.Login.isSectionneed !== transactionStatus.YES :
            //  this.state.selectedRecord['Transaction Type'].value === 2 ? false : true) {
            if (this.state.selectedRecord['Transaction Type'].value === transactionStatus.RECEIVED ||
                this.state.selectedRecord['Transaction Type'].value === transactionStatus.REJECT ? true : false) {
                bool = true;
                mandatoryFeildsMaterial.map((temp, i) => {
                    if (temp.dataField === 'Section' || temp.dataField === 'Site') {
                        delete mandatoryFeildsMaterial[i];
                    }
                });
            }
        }
        if (this.props.Login.screenname === "IDS_QUANTITYTRANSACTION" ?
            this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === transactionStatus.NO ?
                this.props.Login.isSectionneed === transactionStatus.YES ? false : true
                : this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === transactionStatus.NO && bool !== true
            : this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === transactionStatus.NO) {
            mandatoryFeildsMaterial.map((temp, i) => {
                if (temp.dataField === 'Section') {
                    delete mandatoryFeildsMaterial[i];
                }
            });
        }
        //console.log('mandatoryFeildsMaterial', mandatoryFeildsMaterial)
        return mandatoryFeildsMaterial;
    }

    tabDetail = () => {
        const tabMap = new Map();
        {
           // let dataresultarr = []
            //let IDS_TRANSACTIONDATE;
            // this.props.Login.masterData["MaterialInventoryTrans"] &&
            //     this.props.Login.masterData["MaterialInventoryTrans"].map((temp, index) => {
            //         // temp.jsondata['IDS_TRANSACTIONDATE'] =
            //         // this.props.Login.masterData["MaterialInventoryTrans"][index].jsondata['IDS_TRANSACTIONDATE'] =
            //         //     rearrangeDateFormatDateOnly(
            //         //         this.props.Login.userInfo,
            //         //         temp.jsondata['IDS_TRANSACTIONDATE']
            //         //     )
            //         //     temp.jsondata['IDS_TRANSACTIONDATE']=
            //         //     rearrangeDateFormatDateOnly(
            //         //         this.props.Login.userInfo,
            //         //         temp.jsondata['IDS_TRANSACTIONDATE']
            //         //     )
            //         Object.entries(temp.jsondata).map(item => {
            //             if (item[1] && item[1].hasOwnProperty('label')) {
            //                 let key = item[0]
            //                 let label = item[1].label
            //                 let comboObject = { [key]: label }
            //                 //x=y
            //                 temp.jsondata = { ...temp.jsondata, ...comboObject }
            //                 // dataresultarr.push({[x]:y})     
            //             }
            //         })
            //         // for (let [key, value] of Object.entries(temp.jsondata)) {
            //         //     if(key.hasOwnProperty('label'))
            //         //         {
            //         //             let  temp2=[key, value]
            //         //             //x=y
            //         //             temp.jsondata={...temp.jsondata,...temp2}
            //         //            // dataresultarr.push({[x]:y})     
            //         //         }
            //         // }
            //         return dataresultarr.push(temp.jsondata)
            //     })
            tabMap.set("IDS_INVENTORYTRANSACTION",
                <InvenotryTransaction
                    Template={this.props.Login.masterData.QuantityTransactionTemplate &&
                        this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata}
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    dataResult={process(sortData(this.props.Login.masterData["MaterialInventoryTrans"], "descending", "nmaterialinventtranscode"),
                        (this.props.screenName === undefined || this.props.screenName === "IDS_QUANTITYTRANSACTION")
                            ? this.state.sectionDataState : { skip: 0, take: 10 })}
                    dataState={(this.props.screenName === undefined || this.props.screenname === "IDS_QUANTITYTRANSACTION")
                        ? this.state.sectionDataState : { skip: 0, take: 10 }}

                    dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                    masterData={this.props.Login.masterData}
                    userInfo={this.props.Login.userInfo}
                    getTestDetails={this.props.getTestDetails}
                    SelectedMaterialInventory={this.props.Login.masterData.SelectedMaterialInventory}
                    quantityTransaction={this.quantityTransaction}
                    // dataState={{ skip: 0, take: 10 }}
                    deleteRecord={this.deleteRecordmain}
                    QuantityTransactionForGrid={this.gridfillingColumn(JSON.parse(this.props.Login.masterData.DesignMappedFeildsQuantityTransaction &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'] !== null &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'].value)['QuantityTransactionForGrid'])}
                    QuantityTransactionForExpandedGrid={this.gridfillingColumn(JSON.parse(this.props.Login.masterData.DesignMappedFeildsQuantityTransaction &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'] !== null &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'].value)['QuantityTransactionForExpandedGrid'])}
                    viewQuantityTrans={this.viewQuantityTrans}
                    selectedRecord={this.props.Login.selectedRecord}
                    intl={this.props.intl}
                    DesignMappedFeilds={JSON.parse(this.props.Login.masterData.DesignMappedFeildsQuantityTransaction &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'] !== null &&
                        this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'].value)}
                    screenName="IDS_QUANTITYTRANSACTION"
                />
            );
            tabMap.set("IDS_MATERIALINVENTORYFILE",
                <MaterialInvFileTab
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    userInfo={this.props.Login.userInfo}
                    deleteRecord={this.deleteRecordmain}
                    MaterialFile={sortData(this.props.Login.masterData.MaterialInventoryFile, "descending", "nmaterialinventoryfilecode") || []}
                    addMaterialFile={(param) => this.props.addMaterialInventoryFile(param, this.props.Login.masterData.SelectedMaterialInventory)}
                    viewMaterialFile={this.viewMaterialFile}
                    screenName="IDS_MATERIALINVENTORYFILE"
                    settings={this.props.settings}
                />);
            tabMap.set("IDS_RESULTENTRYTRANSACTION",
                <ResultEntryTransactionTab
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    dataResult={this.props.Login.masterData["ResultUsedMaterial"] && process(this.props.Login.masterData["ResultUsedMaterial"],
                        (this.props.screenName === undefined || this.props.screenName === "IDS_RESULTENTRYTRANSACTION")
                            ? this.state.sectionDataState : { skip: 0, take: 10 })}
                    dataState={(this.props.screenName === undefined || this.props.screenname === "IDS_RESULTENTRYTRANSACTION")
                        ? this.state.sectionDataState : { skip: 0, take: 10 }}

                    dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                    masterData={this.props.Login.masterData}
                    userInfo={this.props.Login.userInfo}
                    // dynamicFeildsForGrid={this.gridfillingColumn(JSON.parse(this.props.Login.masterData.DesignMappedFeildsQuantityTransaction &&
                    //     this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'] !== null &&
                    //     this.props.Login.
                    //         masterData.DesignMappedFeildsQuantityTransaction['jsondata'].value)['ResultUsedMaterialGrid'])}
                    selectedRecord={this.props.Login.selectedRecord}
                    intl={this.props.intl}
                    screenName="IDS_RESULTENTRYTRANSACTION"
                />);
            tabMap.set("IDS_MATERIALINVENTORYHISTORY",
                <MaterialInventoryHistory
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}

                    dataResult={this.props.Login.masterData["MaterialInventoryHistory"] && process(sortData(this.props.Login.masterData["MaterialInventoryHistory"], "descending", "nmaterialinventoryhistorycode"),
                        (this.props.screenName === undefined || this.props.screenName === "IDS_MATERIALINVENTORYHISTORY")
                            ? this.state.historyDataState : { skip: 0, take: 10 })}
                    dataState={(this.props.screenName === undefined || this.props.screenname === "IDS_MATERIALINVENTORYHISTORY")
                        ? this.state.historyDataState : { skip: 0, take: 10 }}

                    dataStateChange={(event) => this.setState({ historyDataState: event.dataState })}
                    masterData={this.props.Login.masterData}
                    userInfo={this.props.Login.userInfo}
                    // dynamicFeildsForGrid={this.gridfillingColumn(JSON.parse(this.props.Login.masterData.DesignMappedFeildsQuantityTransaction &&
                    //     this.props.Login.masterData.DesignMappedFeildsQuantityTransaction['jsondata'] !== null &&
                    //     this.props.Login.
                    //         masterData.DesignMappedFeildsQuantityTransaction['jsondata'].value)['ResultUsedMaterialGrid'])}
                    selectedRecord={this.props.Login.selectedRecord}
                    intl={this.props.intl}
                    screenName="IDS_MATERIALINVENTORYHISTORY"
                />);
        }

        return tabMap;
    }

    onInputOnChangeFile = (event, optional2) => {
        const selectedRecord = this.state.selectedRecord || {};
       // let isSelectedRecordChange = this.state.isSelectedRecordChange
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? optional2[0] : optional2[1];
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional2;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }
    updateMaterialStatus = (buttonId, nflag) => {
        let inputParam = {}
        let inputData = [];
        let operation;
        let masterData = this.props.Login.masterData
        inputData["nflag"] = nflag
        operation = nflag === 1 ? 'RELEASED' : 'RETIRE'
        inputData["nmaterialinventorycode"] = masterData["SelectedMaterialInventory"].nmaterialinventorycode
        inputData["nmaterialcode"] = masterData["SelectedMaterialInventory"].nmaterialcode
        inputData["nmaterialtypecode"] = masterData["SelectedMaterialInventory"].nmaterialtypecode
        inputData["nmaterialcatcode"] = masterData["SelectedMaterialInventory"].nmaterialcatcode
        inputData["userinfo"] = this.props.Login.userInfo
        inputData["nmaterialconfigcode"] = this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode
        inputParam = {
            classUrl: "materialinventory",
            methodUrl: "MaterialStatus",
            inputData: inputData,
            operation: 'update',
            selectedRecord: this.state.selectedRecord,
            searchRef: this.searchRef,
            dataState: this.state.dataState,
            postParam: {
                selectedObject: "SelectedMaterialInventory",
                primaryKeyField: "nmaterialinventorycode", 
                inputListName: "MaterialInventory"
            }
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, buttonId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal: true, loadEsign: true, screenData: { inputParam, masterData }, operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    deleteRecordmain = (deleteParam) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = JSON.stringify(deleteParam.selectedRecord);
        let dataState = undefined;
        if (this.props.screenName === "IDS_SECTION") {
            dataState = this.state.sectionDataState;
        } else if (this.props.screenName === "IDS_METHOD") {
            dataState = this.state.methodDataState;
        } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") {
            dataState = this.state.instrumentCatDataState;
        }
        const inputParam = {
            inputData: {
                nmaterialconfigcode: this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
                ncontrolCode: deleteParam.ncontrolCode,
                [methodUrl.toLowerCase()]: selected,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "materialinventory",
            operation: deleteParam.operation,
            ncontrolCode: deleteParam.ncontrolCode,
            methodUrl: methodUrl,
            screenName: "IDS_MATERIALINVENTORY", dataState,
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_MATERIALINVENTORY", operation: deleteParam.operation, selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.handleClickDelete(this.props.Login.masterData, deleteId, "openModal"));
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
        this.searchRef.current.value = "";
        let inputData = [];
        if (this.state.selectedMaterialCat !== undefined ? this.state.selectedMaterialCat["nmaterialcatcode"] !== "" : false) {
            if (this.state.selectedMaterialcombo !== undefined ? this.state.selectedMaterialcombo["nmaterialcode"] !== "" : false) {
                // if (this.state.selectedMaterialCat["nmaterialcatcode"] !== "" ) {
                //     if (this.state.selectedMaterialcombo["nmaterialcode"] !== "" ) {
                inputData["nmaterialtypecode"] = this.state.selectedcombo["nmaterialtypecode"];
                inputData["materialCatList"] = this.state.materialCatList;
                inputData["nmaterialcode"] = this.state.selectedMaterialcombo["nmaterialcode"].value
                inputData["nmaterialcatcode"] = this.state.selectedMaterialCat["nmaterialcatcode"].value
                if (this.state.selectedcombo["nmaterialtypecode"]) {
                    this.props.getMaterialInventoryByID(this.state.selectedcombo,
                        this.state.selectedMaterialCat, this.state.selectedMaterialcombo, this.props.Login.masterData, this.props.Login.userInfo);

                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
                }
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMATERIAL" }));
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTMATERIALCATEGORY" }));
        }
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height
            });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        breadCrumbData.push(
            {
                "label": "IDS_MATERIALTYPE",
                "value": this.props.Login.masterData.SelectedMaterialType ? this.props.Login.masterData.SelectedMaterialType[0]['jsondata'].smaterialtypename[this.props.Login.userInfo.slanguagetypecode] : "NA",

            }, {

            "label": "IDS_MATERIALCAT",
            "value": this.props.Login.masterData.SelectedMaterialCategory ?
                this.props.Login.masterData.SelectedMaterialCategory.smaterialcatname !== undefined ?
                    this.props.Login.masterData.SelectedMaterialCategory.smaterialcatname : "NA" : "NA",
        }, {

            "label": "IDS_MATERIAL",
            "value": this.props.Login.masterData.SelectedMaterialCrumb ?
                this.props.Login.masterData.SelectedMaterialCrumb['jsondata']['Material Name'] !== undefined ?
                    this.props.Login.masterData.SelectedMaterialCrumb['jsondata']['Material Name'] : "NA" : "NA",
        }
        );
        return breadCrumbData;
    }

    componentDidUpdate(previousProps) {
        let bool = false;
        let { selectedRecord, selectedcombo, comboitem, filterData, filterCatList, selectedMaterialCat, selectedMaterialcombo,
            materialCatList, MaterialComboList, SelectedMaterialInventory } = this.state
        let masterData = this.props.Login.masterData;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            bool = true;
            selectedRecord = this.props.Login.selectedRecord
        }
        if (this.props.Login.selectedMaterialCat !== previousProps.Login.selectedMaterialCat) {
            bool = true;
            selectedMaterialCat = this.props.Login.selectedMaterialCat
        }
        if (this.props.Login.masterData.SelectedMaterialInventory !== previousProps.Login.masterData.SelectedMaterialInventory) {
            bool = true;
            SelectedMaterialInventory = this.props.Login.SelectedMaterialInventory
        }

        if (this.props.Login.comboitem !== previousProps.Login.comboitem) {
            bool = true;
            comboitem = this.props.Login.comboitem
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights
            });
        }
        if (this.props.Login.masterData.MaterialType !== undefined) {
            if (this.props.Login.masterData.MaterialType !== previousProps.Login.masterData.MaterialType) {
                bool = true;
                const materialTypeList = constructjsonOptionList(this.props.Login.masterData.MaterialType,
                    "nmaterialtypecode", "smaterialtypename", undefined, undefined,
                    undefined, undefined,
                    undefined, true, this.props.Login.userInfo.slanguagetypecode)
                filterCatList = materialTypeList.get("OptionList");

                selectedcombo = {
                    nmaterialtypecode: masterData.MaterialType && masterData.MaterialType.length > 0 ? {
                        "value": masterData.MaterialType[0].nmaterialtypecode,
                        "label": masterData.MaterialType[0]['jsondata'].smaterialtypename[this.props.Login.userInfo.slanguagetypecode]
                    } : ""
                }
            }
        }
        if (this.props.Login.masterData.MaterialCategoryMain !== previousProps.Login.masterData.MaterialCategoryMain) {
            bool = true;
            const MaterialCategoryMain = constructOptionList(this.props.Login.masterData.MaterialCategoryMain || [], "nmaterialcatcode",
                "smaterialcatname", undefined, undefined, undefined);
            materialCatList = MaterialCategoryMain.get("OptionList");

            selectedMaterialCat = {
                nmaterialcatcode: masterData.MaterialCategoryMain && masterData.MaterialCategoryMain.length > 0 ? {
                    "value": masterData.MaterialCategoryMain[0].nmaterialcatcode,
                    "label": masterData.MaterialCategoryMain[0].smaterialcatname
                } : ""
            }
        }
        if (this.props.Login.masterData.MaterialCombo !== previousProps.Login.masterData.MaterialCombo) {
            bool = true;
            let MaterialComboArr = [];
            if (this.props.Login.masterData.MaterialCombo) {
                this.props.Login.masterData.MaterialCombo.map((temp => {
                    MaterialComboArr.push(temp.jsondata)
                }))
                const MaterialCombo = constructOptionList(MaterialComboArr || [], "nmaterialcode",
                    "Material Name", undefined, undefined, undefined);
                MaterialComboList = MaterialCombo.get("OptionList");
                selectedMaterialcombo = {
                    nmaterialcode: masterData.MaterialCombo && masterData.MaterialCombo.length > 0 ? {
                        "value": masterData.MaterialCombo[0]["jsondata"].nmaterialcode,
                        "label": masterData.MaterialCombo[0]["jsondata"]['Material Name']
                    } : ""
                }
            }
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            filterData = this.generateBreadCrumData();
        }
        if (this.props.Login.masterData.searchedData !== previousProps.Login.masterData.searchedData) {
            if (this.props.Login.masterData.searchedData) {
                if (this.props.Login.masterData.searchedData.length <= this.state.skip) {
                    this.setState({ skip: 0 });
                }
            }
        }
        if (bool) {
            this.setState({
                selectedRecord, comboitem, filterData, selectedcombo, filterCatList, selectedMaterialCat, selectedMaterialcombo,
                materialCatList, MaterialComboList, SelectedMaterialInventory
            });
        }
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });

    };

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    viewMaterialFile = (filedata) => {
        const inputParam = {
            inputData: {
                nmaterialinventorycode: this.props.Login.masterData.SelectedMaterialInventory
                    && this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode,
                ndesigntemplatemappingcode: this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
                materialinventoryfile: JSON.stringify(filedata),
                userinfo: this.props.Login.userInfo
            },
            classUrl: "materialinventory",
            operation: "view",
            methodUrl: "AttachedMaterialInventoryFile",
            screenname: "IDS_MATERIALINVENTORY"
        }
        this.props.viewAttachment(inputParam);
    }
    printBarcode = (inputParam) => {

        this.setState({
            selectedRecord: {
                barcodevalue: inputParam.sample.sarno,
                barcodeData: inputParam.sample
            },
            openModal: true
        })
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal
        let showMaterialSection = this.props.Login.showMaterialSection
       // let isneedcombomulti = this.props.Login.isneedcombomulti;
        let selectedRecord = this.props.Login.selectedRecord;
        let showModalPopup = this.props.Login.showModalPopup
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "RETIRE"
                || this.props.Login.operation === "RELEASED" || this.props.Login.operation === "IDS_OPENDATE") {
                loadEsign = false;
                openModal = false;
                showModalPopup = this.props.Login.operation === "IDS_OPENDATE" ? true : false;
                // selectedRecord =  this.props.Login.operation === "IDS_OPENDATE"?selectedRecord["IDS_OPENDATE"]
                // &&selectedRecord["IDS_OPENDATE"]:{};
                if (this.props.Login.operation === "IDS_OPENDATE") {
                    let temp = selectedRecord["IDS_OPENDATE"];
                    selectedRecord = {};
                    selectedRecord["IDS_OPENDATE"] = temp;
                }
                else {
                    selectedRecord = {};
                }

            }
            else {
                loadEsign = false;
                //openChildModal=false;
                //openModal = false;
                showModalPopup = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            showMaterialSection = false;
            //isneedcombomulti = false;
            openChildModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, showMaterialSection, loadEsign, selectedRecord, selectedId: null, showModalPopup, openChildModal }
        }
        this.props.updateStore(updateInfo);
    }

    onComboChange = (comboData, fieldName) => {
        
            if (fieldName === "nmaterialtypecode") {
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;
                this.searchRef.current.value = "";
                this.props.initialcombochangeMaterialInvget(comboData.item.nmaterialtypecode, undefined, this.props.Login.masterData, this.props.Login.userInfo);

            }
            if (fieldName === "nmaterialcode") {
                const selectedMaterialcombo = this.state.selectedMaterialcombo || {};
                selectedMaterialcombo["nmaterialcode"] = comboData;
                this.setState({ selectedMaterialcombo });

            }
            else if (fieldName === "nmaterialcatcode") {
                const selectedMaterialCat = this.state.selectedMaterialCat || {};
                selectedMaterialCat[fieldName] = comboData;
                this.props.initialcombochangeMaterialInvget(this.state.selectedcombo["nmaterialtypecode"].value, comboData.item.nmaterialcatcode, this.props.Login.masterData, this.props.Login.userInfo);

            }

            else if (fieldName === "nmaterialsectioncode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord["nmaterialsectioncode"] = comboData;
                this.setState({ selectedRecord });
            }
            else if (fieldName === "nlinkcode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord["nlinkcode"] = comboData;
                this.setState({ selectedRecord });
            }

            else if (fieldName.displaymember === "smaterialcatname" || fieldName.displaymember === "sunitname" || fieldName.displaymember === "speriodname") {
                const selectedMaterialCat = this.state.selectedMaterialCat || {};
                selectedMaterialCat[fieldName] = comboData;
                this.setState({ selectedMaterialCat });

                let comboName = fieldName.label
                const selectedRecord = this.state.selectedRecord || {};
                if (comboData) {
                    selectedRecord[comboName] = comboData;
                } else {
                    selectedRecord[comboName] = []
                }

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord }
                }
                this.props.updateStore(updateInfo);
            }

            else if (fieldName.label === "IDS_STORAGECONDITION") {
                let comboName = fieldName.label
                const selectedRecord = this.state.selectedRecord || {};
                if (comboData) {
                    selectedRecord[comboName] = comboData;
                } else {
                    selectedRecord[comboName] = []
                }

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord }
                }
                this.props.updateStore(updateInfo);
            }
            else if (fieldName === "value") {
                const comboitem = this.state.comboitem || {};
                comboitem[fieldName] = comboData;
                this.setState({ comboitem });
            }
        
        
    }
    onInputOnChange = (event, optional1, optional2) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (this.props.Login.screenname !== "IDS_MATERIALINVENTORYFILE") {
            if (event.target.type === 'checkbox') {
                if (event.target.name === "ntransactionstatus")
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
                else
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
            this.setState({ selectedRecord });
        }
        else {
            if (event.target.type === 'checkbox') {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            } else if (event.target.type === 'radio') {
                selectedRecord[event.target.name] = optional2;
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }


            this.setState({ selectedRecord });
        }

    }

    saveClick = () => {
        let operation = "update";
        let operations = 'IDS_OPENDATE';
        let inputData = [];
        inputData["Open Date"] = this.state.selectedRecord['Open Date'] &&
            convertDateTimetoStringDBFormat(this.state.selectedRecord['Open Date'], this.props.Login.userInfo);
        inputData["tzOpen Date"] = this.state.selectedRecord["tzOpen Date"] && this.state.selectedRecord["tzOpen Date"];
        inputData["nflag"] = 3;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["nmaterialtypecode"] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
        inputData["nmaterialcatcode"] = this.props.Login.masterData.SelectedMaterialCategory.nmaterialcatcode
        inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode
        inputData["nmaterialinventorycode"] = this.props.Login.masterData["SelectedMaterialInventory"].nmaterialinventorycode
        const inputParam = {
            classUrl: "materialinventory",
            methodUrl: "MaterialStatus",
            inputData: inputData,
            operation: operation
        }

        let masterData = this.props.Login.masterData
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal: true, loadEsign: true, screenData: { inputParam, masterData }, operations, showModalPopup: false
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "showModalPopup");
        }

    }
    PrinterChange = (comboData, fieldName) => {
        const selectedPrinterData = this.state.selectedPrinterData || {};
        selectedPrinterData[fieldName] = comboData;
        this.setState({ selectedPrinterData });
    }
    onSavePrinterClick = () => {
        let insertlist = [];
        //this.state.selectedPrinterData.sprintername && this.state.selectedPrinterData.sprintername.map(source=>insertlist.push({npreregno:this.props.Login.insertSourcePreregno,sprintername:source.value}))
        const inputParam = {
            classUrl: 'barcode',
            methodUrl: 'Barcode',
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                npreregno: this.props.Login.insertPrinterPreregno,
                sprintername: this.state.selectedPrinterData.sprintername ? this.state.selectedPrinterData.sprintername.value : '',
                insertlist,
                npreregno1: this.props.Login.masterData.selectedSample.map(x => x.npreregno).join(","),
                userinfo: this.props.Login.userInfo,
                ncontrolcode: this.props.Login.ncontrolcode
            },
            operation: 'printer',
            // dataState:this.state.sourceDataState,
            // activeSampleTab:"IDS_SOURCE",
            action: 'printer'
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: 'printer'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let inputParam = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        let nmaterialconfigcode;
        nmaterialconfigcode = this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode
        if (this.props.Login.screenname === "IDS_MATERIALINVENTORY") {
            inputData["MaterialInventory"] = {}
            inputData["jsonuidata"] = {}
            inputData["DateList"] = []
            const Layout = this.props.Login.masterData.selectedTemplate[0].jsondata
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        if (component.inputtype === 'combo') {

                            if (component.label === 'Section') {
                                inputData["MaterialInventory"][component.label] =
                                    this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                                        inputData["MaterialInventory"][component.label] = this.state.selectedRecord[component.label] ? {
                                            label: this.state.selectedRecord[component.label]["label"],
                                            value: this.state.selectedRecord[component.label]["value"],
                                            pkey: this.state.selectedRecord[component.label].item.pkey,
                                            nquerybuildertablecode: this.state.selectedRecord[component.label].item.nquerybuildertablecode,
                                            item: this.state.selectedRecord[component.label].item
                                        } : "" :
                                        {
                                            label: "Default",
                                            value: -1
                                        }
                                inputData["jsonuidata"][component.label] =
                                    this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                                        this.state.selectedRecord[component.label] ?
                                            this.state.selectedRecord[component.label]["label"]
                                            : "" :
                                        "Default"
                                inputData["jsonuidata"]['nsectioncode'] =
                                    this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                                        this.state.selectedRecord[component.label] ?
                                            this.state.selectedRecord[component.label]["value"]
                                            : "" : -1
                            }
                            else {
                                inputData["MaterialInventory"][component.label] = this.state.selectedRecord[component.label] ? {
                                    label: this.state.selectedRecord[component.label]["label"],
                                    value: this.state.selectedRecord[component.label]["value"],
                                    pkey: this.state.selectedRecord[component.label].item.pkey,
                                    nquerybuildertablecode: this.state.selectedRecord[component.label].item.nquerybuildertablecode,
                                    item: this.state.selectedRecord[component.label].item
                                } : ""
                                inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] ?
                                    this.state.selectedRecord[component.label]["label"]
                                    : ""
                            }

                        }
                        else if (component.inputtype === 'date') {
                            if (this.state.selectedRecord[component.label]) {
                                inputData["MaterialInventory"][`tz${component.label}`] = component.hasOwnProperty('timezone') ? {
                                    label: this.state.selectedRecord[`tz${component.label}`]["label"],
                                    value: this.state.selectedRecord[`tz${component.label}`]["value"]
                                } : {
                                    label: this.props.Login.userInfo['stimezoneid'],
                                    value: this.props.Login.userInfo['ntimezonecode']
                                }
                                inputData["MaterialInventory"][component.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)
                                inputData["DateList"].push(component.label)
                            }
                            inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] ?
                                convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)
                                : ""

                        }
                        else {
                            inputData["MaterialInventory"][component.label] = this.state.selectedRecord[component.label] && this.state.selectedRecord[component.label]
                            //    if (this.state.selectedRecord[component.label] !== "") {
                            inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] && this.state.selectedRecord[component.label]
                            //   }
                        }
                        component.hasOwnProperty("children") && component.children.map(
                            (componentrow) => {

                                if (componentrow.inputtype === 'combo') {
                                    if (componentrow.label === 'Unit') {
                                        inputData["jsonuidata"]['sbatchunitname'] = this.state.selectedRecord[componentrow.label] && this.state.selectedRecord[componentrow.label]["label"];
                                        inputData["jsonuidata"]['nbatchunitcode'] = this.state.selectedRecord[componentrow.label] && this.state.selectedRecord[componentrow.label]["value"];

                                    }

                                    inputData["MaterialInventory"][componentrow.label] = this.state.selectedRecord[componentrow.label] ?
                                        {
                                            label: this.state.selectedRecord[componentrow.label]["label"],
                                            value: this.state.selectedRecord[componentrow.label]["value"],
                                            pkey: this.state.selectedRecord[componentrow.label].item.pkey,
                                            nquerybuildertablecode: this.state.selectedRecord[componentrow.label].item.nquerybuildertablecode,
                                            item: this.state.selectedRecord[componentrow.label].item
                                        } : ""
                                    inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] ?
                                        this.state.selectedRecord[componentrow.label]["label"]
                                        : ""
                                }
                                else if (componentrow.inputtype === 'date') {
                                    if (this.state.selectedRecord[componentrow.label]) {
                                        inputData["MaterialInventory"][`tz${componentrow.label}`] = componentrow.hasOwnProperty('timezone') ? {
                                            label: this.state.selectedRecord[`tz${componentrow.label}`]["label"],
                                            value: this.state.selectedRecord[`tz${componentrow.label}`]["value"]
                                        } : {
                                            label: this.props.Login.userInfo['stimezoneid'],
                                            value: this.props.Login.userInfo['ntimezonecode']
                                        }
                                        inputData["MaterialInventory"][componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label],
                                            this.props.Login.userInfo)
                                        inputData["DateList"].push(componentrow.label)
                                    }
                                    inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] ?
                                        convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label], this.props.Login.userInfo)
                                        : ""

                                }
                                else {
                                    inputData["MaterialInventory"][componentrow.label] = this.state.selectedRecord[componentrow.label] &&
                                        this.state.selectedRecord[componentrow.label]
                                    inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] &&
                                        this.state.selectedRecord[componentrow.label]
                                }
                            }
                        )
                    })
                })
            })
            inputData["MaterialInventory"] = {
                ...inputData["MaterialInventory"],
                // "IDS_INVENTORYTRANSACTIONTYPE": {
                //     label: "Outside",
                //     value: 2
                // },
                // "IDS_TRANSACTIONTYPE": {
                //     label: "Received",
                //     value: 47
                // },
                // [this.props.Login.masterData.siteLabelName && this.props.Login.masterData.siteLabelName]: {
                //     label: this.props.Login.masterData.siteName && this.props.Login.masterData.siteName,
                //     value: this.props.Login.userInfo.nsitecode && this.props.Login.userInfo.nsitecode
                // },
                needsectionwise: this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise,
                "dretestdate": this.props.Login.masterData.SelectedMaterialInventory &&
                    this.props.Login.masterData.SelectedMaterialInventory['jsondata'] &&
                    this.props.Login.masterData.SelectedMaterialInventory['jsondata'].dretestdate,
                // "IDS_AVAILABLEQUANTITY": this.state.selectedRecord['IDS_RECEIVEDQUANTITY'],
                "nmaterialtypecode": this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode,
                "nmaterialcatcode": this.state.selectedMaterialCat["nmaterialcatcode"].value,
                "nmaterialcode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode,
                "ntranscode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].ntranscode === 3 ?
                    transactionStatus.QUARANTINE : transactionStatus.RELEASED,
                "sdisplaystatus": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].sdisplaystatus,
                "Inventory ID": this.state.selectedRecord["Inventory ID"] && this.state.selectedRecord["Inventory ID"],
                nsitecode: this.props.Login.userInfo.nsitecode,
                nusercode: this.props.Login.userInfo.nusercode
            }
            inputData["jsonuidata"] = {
                ...inputData["jsonuidata"],
                "dretestdate": this.props.Login.masterData.SelectedMaterialInventory &&
                    this.props.Login.masterData.SelectedMaterialInventory['jsondata'] &&
                    this.props.Login.masterData.SelectedMaterialInventory['jsondata'].dretestdate,
                "nmaterialtypecode": this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode,
                "nmaterialcatcode": this.state.selectedMaterialCat["nmaterialcatcode"].value,
                "nmaterialcode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode,
                "ntranscode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].ntranscode === 3 ?
                    transactionStatus.QUARANTINE : transactionStatus.RELEASED,
                "Inventory ID": this.state.selectedRecord["Inventory ID"] && this.state.selectedRecord["Inventory ID"],
                "nmaterialconfigcode": nmaterialconfigcode,
                "sdisplaystatus": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].sdisplaystatus,
                nsitecode: this.props.Login.userInfo.nsitecode
            }
            inputData["MaterialInventoryTrans"] = {
                ...inputData["MaterialInventory"],
                "nqtyissued": 0,
                "nsectioncode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                    inputData["MaterialInventory"]["Section"].value : -1,

                "Section": {
                    "label": inputData["MaterialInventory"]["Section"].label,
                    "value": inputData["MaterialInventory"]["Section"].value
                },
                "Available Quantity/Unit": this.state.selectedRecord['Received Quantity'],
                "Inventory ID": this.state.selectedRecord["Inventory ID"] && this.state.selectedRecord["Inventory ID"],
                "ntransactiontype": transactionStatus.RECEIVED,
                "ninventorytranscode": 2,
                "Transaction Type": {
                    "label": this.props.Login.masterData.TransactionType[1]
                        .jsondata.stransdisplaystatus[this.props.Login.userInfo.slanguagetypecode],
                    "value": transactionStatus.RECEIVED
                },
                "Received Quantity": this.state.selectedRecord['Received Quantity'],
                "Inventory Transaction Type": {
                    "label": this.props.Login.masterData.MaterialInventoryType[1]
                        .jsondata.sinventorytypename[this.props.Login.userInfo.slanguagetypecode],
                    "value": 2
                },
                nusercode: this.props.Login.userInfo.nusercode

            }
            inputData["jsonuidataTrans"] = {
                ...inputData["jsonuidata"],
                "nqtyissued": 0,
                "nsectioncode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                    inputData["MaterialInventory"]["Section"].value : -1,

                "Section": inputData["MaterialInventory"]["Section"].label,


                "Available Quantity/Unit": this.state.selectedRecord['Received Quantity'],
                "Inventory ID": this.state.selectedRecord["Inventory ID"] && this.state.selectedRecord["Inventory ID"],
                "ntransactiontype": 14,
                "ninventorytranscode": 2,
                "Transaction Type": this.props.Login.masterData.TransactionType[1]
                    .jsondata.stransdisplaystatus[this.props.Login.userInfo.slanguagetypecode],
                "Received Quantity": this.state.selectedRecord['Received Quantity'],
                "Inventory Transaction Type": this.props.Login.masterData.MaterialInventoryType[1]
                    .jsondata.sinventorytypename[this.props.Login.userInfo.slanguagetypecode],
                "sprecision": this.props.Login.masterData.sprecision,
                "needsectionwise": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise
            }
            if (this.props.Login.masterData.siteLabelName) {
                inputData["MaterialInventoryTrans"][this.props.Login.masterData.siteLabelName] = {
                    label: this.props.Login.masterData.siteName && this.props.Login.masterData.siteName,
                    value: this.props.Login.masterData.siteName && this.props.Login.userInfo.nsitecode
                }
            }
            inputData["ntransactionstatus"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].ntranscode === 3 ?
                transactionStatus.QUARANTINE : transactionStatus.RELEASED
            inputData["nsectioncode"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                inputData["MaterialInventory"]["Section"].value : -1
            inputData["needsectionwise"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise
            inputData["jsonuidata"] = JSON.stringify(inputData["jsonuidata"])
            inputData["jsonuidataTrans"] = JSON.stringify(inputData["jsonuidataTrans"])
            inputData["MaterialInventoryTrans"] = JSON.stringify(inputData["MaterialInventoryTrans"])
            inputData["materialInventoryJson"] = JSON.stringify(inputData["MaterialInventory"])
            inputData["nmaterialtypecode"] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
            inputData["nmaterialcatcode"] = this.state.selectedMaterialCat["nmaterialcatcode"].value
            inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode
            if (this.props.Login.operation === 'create') {
                inputParam = {
                    classUrl: "materialinventory",
                    methodUrl: "MaterialInventory",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef,
                    dataState: this.state.dataState
                }
            }
            else {
                postParam = {
                     inputListName: "MaterialInventory", 
                     selectedObject: "SelectedMaterialInventory", 
                     primaryKeyField: "nmaterialinventorycode"
                     };

                inputData["nmaterialinventorycode"] = this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode
                inputData["sprecision"] = this.props.Login.masterData.sprecision
                inputParam = {
                    classUrl: "materialinventory",
                    methodUrl: "MaterialInventory",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef,
                    dataState: this.state.dataState
                }
            }
            const masterData = this.props.Login.masterData;
            if (this.props.Login.screenName === "IDS_MATERIAL") {
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
            } else {
                if (this.props.Login.masterData.copyScreenRights ? this.props.Login.masterData.copyScreenRights.length > 0 : false) {
                    this.ConfirmComponent()
                }
                else {
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
            }
        }
        else if (this.props.Login.screenname === "IDS_QUANTITYTRANSACTION") {
            if (this.state.selectedRecord['Transaction Type'].value === 64&&this.state.selectedRecord.Site.value !== this.props.Login.userInfo.nsitecode){
                    return  toast.info(this.props.intl.formatMessage({ id: "IDS_CANNOTRETURNFROMANOTHERSITE" }));
            }
            let nflag = true;
            if (this.state.selectedRecord['Transaction Type'].value === transactionStatus.RECEIVED) {
                nflag = false
            }
            if (nflag ? (this.state.selectedRecord['Received Quantity'] <= parseFloat(this.state.selectedRecord['Available Quantity/Unit'])) : true) {
                if (this.state.selectedRecord['Received Quantity'] > 0) {
                    const Layout = this.props.Login.masterData.QuantityTransactionTemplate[0].jsondata
                    let dynamicobj = {};
                    // dynamicobj["jsonuidata"] = {}
                    let jsonuidata = {};
                    inputData["DateList"] = [];
                    Layout.map((row) => {
                        row.children.map((column) => {
                            column.children.map((component) => {
                                if (component.inputtype === 'combo') {
                                    if (component.label === 'Section') {
                                        if (this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3) {
                                            dynamicobj['nsectioncode'] =
                                                this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                                                    this.state.selectedRecord['Inventory Transaction Type'] &&
                                                        this.state.selectedRecord['Inventory Transaction Type'].value === 1 ?
                                                        this.state.selectedRecord[component.label]["value"] :
                                                        this.props.Login.masterData.sourceSection
                                                    :
                                                    this.state.selectedRecord['Inventory Transaction Type'] &&
                                                        this.state.selectedRecord['Inventory Transaction Type'].value === 1 ?
                                                        this.state.selectedRecord[component.label]["value"] : -1
                                            jsonuidata['nsectioncode'] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise === 3 ?
                                                this.state.selectedRecord['Inventory Transaction Type'] &&
                                                    this.state.selectedRecord['Inventory Transaction Type'].value === 1 ?
                                                    this.state.selectedRecord[component.label]["value"] :
                                                    this.props.Login.masterData.sourceSection
                                                :
                                                this.state.selectedRecord['Inventory Transaction Type'] &&
                                                    this.state.selectedRecord['Inventory Transaction Type'].value === 1 ?
                                                    this.state.selectedRecord[component.label]["value"] : -1
                                        }
                                        else {
                                            dynamicobj['nsectioncode'] = this.state.selectedRecord[component.label] ?
                                                this.state.selectedRecord[component.label]["value"] : -1
                                            jsonuidata['nsectioncode'] = this.state.selectedRecord[component.label] ?
                                                this.state.selectedRecord[component.label]["value"] : -1
                                        }



                                        dynamicobj[component.label] = this.state.selectedRecord[component.label] ? {
                                            label: this.state.selectedRecord[component.label]["label"],
                                            value: this.state.selectedRecord[component.label]["value"]
                                        } : 'NA'
                                        jsonuidata[component.label] = this.state.selectedRecord[component.label] ?
                                            this.state.selectedRecord[component.label]["label"] : 'NA'
                                    }
                                    else {
                                        if (this.state.selectedRecord[component.label]) {
                                            dynamicobj[component.label] = {
                                                label: this.state.selectedRecord[component.label]["label"],
                                                value: this.state.selectedRecord[component.label]["value"]
                                            }

                                            jsonuidata[component.label] = this.state.selectedRecord[component.label]["label"]

                                        }
                                    }
                                }
                                else if (component.inputtype === 'Numeric') {
                                    if (this.state.selectedRecord[component.label]) {
                                        dynamicobj[component.label] = this.state.selectedRecord[component.label].toString()
                                        jsonuidata[component.label] = this.state.selectedRecord[component.label].toString()

                                    }
                                }
                                else if (component.inputtype === 'date') {
                                    if (this.state.selectedRecord[component.label]) {
                                        dynamicobj[`tz${component.label}`] = component.hasOwnProperty('timezone') ? {
                                            label: this.state.selectedRecord[`tz${component.label}`]["label"],
                                            value: this.state.selectedRecord[`tz${component.label}`]["value"]
                                        } : {
                                            label: this.props.Login.userInfo['stimezoneid'],
                                            value: this.props.Login.userInfo['ntimezonecode']
                                        }
                                        dynamicobj[component.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)

                                        jsonuidata[`tz${component.label}`] = component.hasOwnProperty('timezone') ?
                                            this.state.selectedRecord[`tz${component.label}`]["label"]
                                            : this.props.Login.userInfo['stimezoneid']
                                        jsonuidata[component.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)

                                        inputData["DateList"].push(component.label)
                                    }

                                }
                                else {
                                    if (this.state.selectedRecord[component.label]) {
                                        dynamicobj[component.label] = this.state.selectedRecord[component.label]
                                        jsonuidata[component.label] = this.state.selectedRecord[component.label]
                                    }
                                }
                                component.hasOwnProperty("children") && component.children.map(
                                    (componentrow) => {
                                        if (componentrow.inputtype === 'combo') {
                                            if (this.state.selectedRecord[componentrow.label]) {
                                                dynamicobj[componentrow.label] =
                                                {
                                                    label: this.state.selectedRecord[componentrow.label]["label"],
                                                    value: this.state.selectedRecord[componentrow.label]["value"]
                                                }
                                                jsonuidata[componentrow.label] = this.state.selectedRecord[componentrow.label]["label"]

                                            }

                                        }
                                        else if (componentrow.inputtype === 'date') {
                                            if (this.state.selectedRecord[componentrow.label]) {
                                                dynamicobj[`tz${componentrow.label}`] = componentrow.hasOwnProperty('timezone') ? {
                                                    label: this.state.selectedRecord[`tz${componentrow.label}`]["label"],
                                                    value: this.state.selectedRecord[`tz${componentrow.label}`]["value"]
                                                } : {
                                                    label: this.props.Login.userInfo['stimezoneid'],
                                                    value: this.props.Login.userInfo['ntimezonecode']
                                                }
                                                dynamicobj[componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label], this.props.Login.userInfo)


                                                jsonuidata[`tz${componentrow.label}`] = componentrow.hasOwnProperty('timezone') ?
                                                    this.state.selectedRecord[`tz${componentrow.label}`]["label"]
                                                    : this.props.Login.userInfo['stimezoneid']
                                                jsonuidata[componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label], this.props.Login.userInfo)

                                                inputData["DateList"].push(componentrow.label)
                                            }

                                        }
                                        else {
                                            if (this.state.selectedRecord[componentrow.label]) {
                                                dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                                //ALPD-1045
                                                jsonuidata[componentrow.label] = this.state.selectedRecord[componentrow.label]

                                            }
                                        }

                                    }
                                )
                            })
                        })
                    })
                    dynamicobj = {
                        ...this.props.Login.masterData.SelectedMaterialInventory,
                        ...dynamicobj, "ntransactiontype":
                            this.state.selectedRecord['Transaction Type'] && this.state.selectedRecord['Transaction Type'].value,
                        "ninventorytranscode": this.state.selectedRecord['Inventory Transaction Type'] && this.state.selectedRecord['Inventory Transaction Type'].value,
                        "navailableqty": this.state.selectedRecord['Available Quantity/Unit'] !== undefined
                            ? parseFloat(this.state.selectedRecord['Available Quantity/Unit']) :
                            this.props.Login.navailableqtyref,
                        "Inventory ID": this.props.Login.masterData["SelectedMaterialInventory"]['Inventory ID'],
                        nusercode: this.props.Login.userInfo.nusercode,
                        parent: false

                    }

                    jsonuidata = {
                        ...this.props.Login.masterData.SelectedMaterialInventory,
                        ...jsonuidata, "ntransactiontype":
                            this.state.selectedRecord['Transaction Type'] && this.state.selectedRecord['Transaction Type'].value,
                        "ninventorytranscode": this.state.selectedRecord['Inventory Transaction Type'] && this.state.selectedRecord['Inventory Transaction Type'].value,
                        "navailableqty": this.state.selectedRecord['Available Quantity/Unit'] !== undefined
                            ? this.state.selectedRecord['Available Quantity/Unit'] :
                            this.props.Login.navailableqtyref,
                        "Inventory ID": this.props.Login.masterData["SelectedMaterialInventory"]['Inventory ID']

                    }
                    inputData["needsectionwise"] = this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].needsectionwise
                    inputData["nprecision"] = this.props.Login.masterData.nprecision && this.props.Login.masterData.nprecision
                    inputData["nmaterialinventorycode"] = this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode
                    inputData["MaterialInventoryTrans"] = JSON.stringify(dynamicobj)
                    inputData["jsonuidata"] = JSON.stringify(jsonuidata)
                    inputParam = {
                        classUrl: "materialinventory",
                        methodUrl: "MaterialInventoryTrans",
                        inputData: inputData,
                        operation: 'create',
                        saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                        searchRef: this.searchRef,
                        dataState: this.state.dataState,
                        isChild: true
                    }
                    let masterData = this.props.Login.masterData
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
                        this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                    }
                }
                else { //ALPD-4842 material Inventory-->while add the Quantity transaction, section not showing
                    toast.info(this.props.intl.formatMessage({ id: "IDS_NOQUANTTYTORECEIVE" }));
                }

            }///////////////////
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_RETURNEDLESSTHANAVAILABLE" }));
            }
        }
        else if (this.props.Login.screenname === "IDS_MATERIALINVENTORYFILE") {
            inputParam = this.onSaveMaterialFile();
            let masterData = this.props.Login.masterData
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
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }

        }
    }
    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        if (name === "Received Quantity") {
            if (value === 0) {
                selectedRecord[name] = "";
            }
            else {
                selectedRecord[name] = value;
            }
        }
        else {
            selectedRecord[name] = value;
        }
        this.setState({ selectedRecord });
    }

    ConfirmComponent = () => {
        this.confirmMessage.confirm("confirmation", "Confiramtion!", this.props.intl.formatMessage({ id: "IDS_OVERWRITRTHEEXISTINGSCREENRIGHTS" }),
            "ok", "cancel", () => this.copyAlertSave());
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

    handleClickDelete(masterData, ncontrolcode, modalName) {
        // if (this.props.Login.masterData["SelectedMaterialInventory"].jsondata.ntranscode !== transactionStatus.RETIRED &&
        //     this.props.Login.masterData["SelectedMaterialInventory"].jsondata.ntranscode !== transactionStatus.RELEASED) {
        if (this.props.Login.masterData["SelectedMaterialInventory"].ntranscode === transactionStatus.QUARANTINE) {
           // const fieldArray = [];
            let postParam = {
                inputListName: "MaterialInventory", selectedObject: "SelectedMaterialInventory",
                primaryKeyField: "nmaterialinventorycode",
                primaryKeyValue: this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode,
                fetchUrl: "materialinventory/getMaterialInventoryByID",
                fecthInputObject: { userinfo: this.props.Login.userInfo,
                "nmaterialtypecode": this.props.Login.masterData && this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode,
                "nmaterialcatcode": this.state.selectedMaterialCat["nmaterialcatcode"].value,
                "nmaterialcode": this.props.Login.masterData && this.props.Login.masterData.SelectedMaterialCrumb && this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode,
                 },
                // "nmaterialtypecode": this.props.Login.masterData && this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode,
                // "nmaterialcatcode": this.state.selectedMaterialCat["nmaterialcatcode"].value,
                // "nmaterialcode": this.props.Login.masterData && this.props.Login.masterData.SelectedMaterialCrumb && this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode,
            }
            modalName = 'openModal'

            const inputParam = {
                methodUrl: "MaterialInventory",
                classUrl: "materialinventory",
                inputData: {
                    "nmaterialconfigcode": this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
                    "material": this.props.Login.masterData.SelectedMaterial,
                    "nmaterialcode": this.props.Login.masterData.SelectedMaterialCrumb['jsondata'].nmaterialcode,
                    "nmaterialinventorycode": this.props.Login.masterData.SelectedMaterialInventory.nmaterialinventorycode,
                    "nmaterialcatcode": this.state.selectedMaterialCat["nmaterialcatcode"].value,
                    "userinfo": this.props.Login.userInfo,
                    "nmaterialtypecode": this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode,
                },
                operation: "delete", postParam,
                displayName: "Material",
                selectedRecord:{...this.state.selectedRecord}

            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, [modalName]: true,
                        operation: 'delete', screenName: "Material", id: "material"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, modalName);
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTQUARENTINEINVENTORY" }));
        }
    }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        let inputData = [];
        inputData["nmaterialtypecode"] = this.state.selectedcombo["nmaterialtypecode"];
        inputData["materialCatList"] = this.state.materialCatList;
        // const inputParam = {
        //     classUrl: "materialinventory",
        //     methodUrl: "getMaterialInventoryByID",
        //     displayName: "MaterialInventory",
        //     inputData: inputData
        // }
        this.setState({ sectionDataState: { skip: 0, take: 10 } })
        if (this.state.selectedcombo["nmaterialtypecode"] && this.props.Login.masterData.SelectedMaterialCategory && this.props.Login.masterData.SelectedMaterialCrumb) {
            this.props.getMaterialInventoryByID(this.props.Login.masterData.SelectedMaterialType[0],
                this.props.Login.masterData.SelectedMaterialCategory, this.props.Login.masterData.SelectedMaterialCrumb['jsondata'], this.props.Login.masterData, this.props.Login.userInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGMATERIALCATANDMATERIAL" }));
        }
    }
}

export default connect(mapStateToProps, {
    callService, getAddMaterialInventoryPopup, updateMaterialStatus, openDatePopup, getQuantityTransactionPopup, getQuantityTransactionOnchange,
    updateStore, initialcombochangeMaterialInvget, viewAttachment, getMaterialChildValues,
    crudMaster, getMaterialInventoryDetails, getMaterialInventoryByID, addMaterialInventoryFile
    , filterColumnData, validateEsignCredential, getSiteonchange
})(injectIntl(MaterialInventory));

