import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Nav, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { constructjsonOptionList, convertDateTimetoString, convertDateTimetoStringDBformat, rearrangeDateFormatDateOnly, formatInputDate, convertDateTimetoStringDBFormat, sortData, Lims_JSON_stringify,replaceBackSlash,convertDateValuetoString } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import CustomTab from '../../components/custom-tabs/custom-tabs.component'
import { showEsign, getControlMap, constructOptionList, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, rearrangeDateFormat } from '../../components/CommonScript';
import {
    callService, updateStore, crudMaster, filterColumnData, validateEsignCredential, viewAttachment,
    initialcombochangeget, addSafetyInstructions, getAddMaterialPopup, getMaterialDetails, addMaterialProperty, getMaterialReload,
    getMaterialEdit, getMaterialByTypeCode, getAddMaterialSectionPopup, getMaterialSectionEdit, addMaterialFile,addMaterialAccountingProperty,getAddMaterialAccountingPopup,getReportDetails,generateControlBasedReport
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus, attachmentType } from '../../components/Enumeration';
import { ContentPanel, ReadOnlyText, MediaLabel } from '../../components/App.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
// import ReactTooltip from 'react-tooltip';
import MaterialFilter from './MaterialFilter';
import MaterialSectionTab from './MaterialSectionTab';
import MaterialInventoryTab from './MaterialInventoryTab';
import AddMaterialSection from './AddMaterialSection';
import AddReportDetails from './AddReportDetails';

import { Affix } from 'rsuite';
import MaterialMsdsAttachmentTab from './MaterialMsdsAttachmentTab';
import AddMaterialFile from './AddMaterialFile';
import { ReactComponent as Safety } from '../../assets/image/safety.svg';
import { ReactComponent as Property } from '../../assets/image/managed-hosting.svg';
import { ReactComponent as Generate } from '../../assets/image/generate-certificate.svg'
import { ReactComponent as Powder } from '../../assets/image/powder-material-removal.svg'
import { ReactComponent as Issue } from '../../assets/image/normal-material-remvl.svg'
import { ReactComponent as Solution } from '../../assets/image/solution-material-removal.svg'
import { ProductList } from '../product/product.styled';
import PortalModal from '../../PortalModal';
import ModalShow from '../../components/ModalShow';
import SampleInfoView from '../approval/SampleInfoView';
import DynamicSlideoutMaterial from './DynamicSlideoutMaterial';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class Material extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.state = {
            masterStatus: "",
            sectionDataState: { skip: 0, take: 10 },
            error: "",
            selectedRecord: {},
            filterCatList: [],
            operation: "",
            comboitem: undefined,
            screenName: undefined,
            selectedcombo: undefined,
            isSelectedRecordChange: false,
            showSectionWhileEdit: false,
            selectedMaterialCat: undefined,
            materialCatList: [],
            userRoleControlRights: [],
            ControlRights: undefined,
            controlMap: new Map(),
            dataResult: [],
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            dataState: dataState,
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
      
        //  console.log('selected r :', this.props.Login.masterData)
        let addId=-1
        {this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===5 ? addId=-1:  addId = (this.state.controlMap.has("AddMaterial") && this.state.controlMap.get("AddMaterial").ncontrolcode);}
        
        const editId = this.state.controlMap.has("EditMaterial") && this.state.controlMap.get("EditMaterial").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteMaterial") && this.state.controlMap.get("DeleteMaterial").ncontrolcode;
        const addParameterId = this.state.controlMap.has("AddMaterialSafetyInstructions")
            && this.state.controlMap.get("AddMaterialSafetyInstructions").ncontrolcode;
        const addMaterialProperty = this.state.controlMap.has("AddMaterialProperties")
            && this.state.controlMap.get("AddMaterialProperties").ncontrolcode;
            const addMaterialAccounting = this.state.controlMap.has("MaterialAccounting")
            && this.state.controlMap.get("MaterialAccounting").ncontrolcode;
            const addMaterialAccountingPowder = this.state.controlMap.has("MaterialAccountingPowder")
            && this.state.controlMap.get("MaterialAccountingPowder").ncontrolcode;
            const addMaterialAccountingSolution = this.state.controlMap.has("MaterialAccountingSolution")
            && this.state.controlMap.get("MaterialAccountingSolution").ncontrolcode;
            const materialAccountingReport = this.state.controlMap.has("MaterialAccountingReport")
            && this.state.controlMap.get("MaterialAccountingReport").ncontrolcode;
        let masterlistmain = []
        this.props.Login.masterData.Material = this.props.Login.masterData.Material &&
            sortData(this.props.Login.masterData.Material, "descending", "nmaterialcode")
        this.props.Login.masterData.MaterialType = this.props.Login.masterData.MaterialType &&
            sortData(this.props.Login.masterData.MaterialType, "ascending", "nmaterialtypecode")
        this.props.Login.masterData.MaterialCategoryMain = this.props.Login.masterData.MaterialCategoryMain &&
            sortData(this.props.Login.masterData.MaterialCategoryMain, "ascending", "nmaterialcatcode")
        this.props.Login.masterData.searchedData = this.props.Login.masterData.searchedData &&
            sortData(this.props.Login.masterData.searchedData, "descending", "nmaterialcode")

        if (this.props.Login.masterData.SelectedMaterialCategory &&
            this.props.Login.masterData.SelectedMaterialCategory.needSectionwise === transactionStatus.YES) {
            if (this.props.Login.masterData.SelectedMaterial) {
                delete this.props.Login.masterData.SelectedMaterial['Section'];
                delete this.props.Login.masterData.SelectedMaterial['Reorder Level'];
            }
        }

        // this.props.Login.masterData.Material &&
        //     this.props.Login.masterData.Material.map((temp, i) => {
        //         return masterlistmain.push(this.props.Login.masterData.Material[i].jsondata)
        //     })
        let searchedDatalistmain = []

        // if (this.props.Login.masterData.searchedData === undefined) {
        //     searchedDatalistmain = undefined
        // } else {
        //     this.props.Login.masterData.searchedData &&
        //         this.props.Login.masterData.searchedData.map((temp, i) => {
        //             return searchedDatalistmain.push(this.props.Login.masterData.searchedData[i].jsondata)
        //         })
        // }
        let searchFieldList = []
        let mandatoryFieldsMaterialFile = []
        let mandatoryFieldsMaterialSection =[]
       let mandatoryAccounting = [
        { 
            "mandatory": false, "idsName": "IDS_MATERIALSECTION", "dataField": "materialinventorytype",
            "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
        }
        ]


        let mandatoryAccountingReport = [
            { 
                "mandatory": true, "idsName": "IDS_REPORTTYPE", "dataField": "nmaterialaccountinggroupcode",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            { 
                "mandatory": true, "idsName": "IDS_URANIUMCONTENTTYPE", "dataField": "nuraniumcontenttypecode",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            { 
                "mandatory": true, "idsName": "IDS_MONTH", "dataField": "nmonth",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            { 
                "mandatory": true, "idsName": "IDS_YEAR", "dataField": "syear",
                "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
            },
            ]
        // if (this.props.Login.masterData.SelectedMaterialType) {
        //     if (this.props.Login.masterData.SelectedMaterialType.length > 0) {
        //         if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1) {
        //             searchFieldList = [
        //                 "Standard Name"
        //             ]
        //         }
        //         else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2) {
        //             searchFieldList = [
        //                 "Volumetric Name"
        //             ]
        //         }
        //         else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 3) {
        //             searchFieldList = [
        //                 "Material Name"
        //             ]
        //         }
        //     }
        // }
        const filterParam = {
            inputListName: "Material", selectedObject: "SelectedMaterial", primaryKeyField: "nmaterialcode",
            fetchUrl: "material/getMaterialByID", fecthInputObject: { userinfo: this.props.Login.userInfo,
                fromDate : this.props.Login.masterData.fromDate,
               toDate: this.props.Login.masterData.toDate },
            masterData: this.props.Login.masterData,
            // isjsondata: true,
            searchFieldList: this.props.Login.masterData.DesignMappedFeilds &&
                JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['searchFieldList'][0]['searchFieldList'] &&
                JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['searchFieldList'][0]['searchFieldList']
        };
        this.props.Login.screenname === 'IDS_MATERIALMSDSATTACHMENT' && (this.props.Login.selectedRecord &&
            this.props.Login.selectedRecord.nattachmenttypecode === attachmentType.LINK) ?
            mandatoryFieldsMaterialFile = [
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
            :
            mandatoryFieldsMaterialFile = [
                { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
            ]

        
            this.props.Login.screenname === 'IDS_MATERIALACCOUNTING' ? 
             mandatoryFieldsMaterialSection = [
                {
                    mandatory: true,
                    idsName: "IDS_ISSUEDQUANTITY",
                    dataField: "quantity",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                  }
            ] : 
        
             mandatoryFieldsMaterialSection = [
                { 
                    "mandatory": false, "idsName": "IDS_MATERIALSECTION", "dataField": "nmaterialsectioncode",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                }
            ];


        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd ">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix>
                        : ""
                    }
                    <Row noGutters>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"Material"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                //  masterList={searchedDatalistmain || masterlistmain}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Material}
                                getMasterDetail={(master) => this.props.getMaterialDetails(master, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.SelectedMaterial && this.props.Login.masterData.SelectedMaterial}
                                primaryKeyField="nmaterialcode"
                                // mainField={this.props.Login.masterData.SelectedMaterialType ?
                                //     this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1 ?
                                //         "Standard Name" :
                                //         this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2 ?
                                //             "Volumetric Name" :
                                //             "Material Name" : ""}
                                // firstField={"Reorder Level"}
                                mainField={this.props.Login.masterData.DesignMappedFeilds &&
                                    JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['mainField']}
                                // firstField={
                                //     this.props.Login.masterData.DesignMappedFeilds &&
                                //     JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField'] &&
                                //     JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField']
                                //     //||JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)['ListMasterProps'][0]['firstField']
                                // }
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                showFilterIcon={true}
                                onFilterSubmit={this.onFilterSubmit}
                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <MaterialFilter
                                                filterCatList={this.state.filterCatList || []}
                                                materialCatList={this.state.materialCatList || []}
                                                selectedRecord={this.state.selectedcombo || {}}//
                                                selectedMaterialCat={this.state.selectedMaterialCat || {}}
                                                userInfo={this.props.Login.userInfo||{}}
                                                onComboChange={this.onComboChange}
                                                 handleDateChange={this.handleDateChanges}
                                                 fromDate={this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()}
                                                 toDate={this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()}
                                             />
                                    }
                                ]}
                                openModal={() => this.openModal(
                                    "create", this.props.Login, this.state.selectedcombo,
                                    addId, this.props.Login.masterData,
                                    this.state.selectedRecord,"IDS_MATERIAL")}
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
                                        {this.props.Login.masterData.Material && this.props.Login.masterData.Material.length > 0 && this.props.Login.masterData.SelectedMaterial ?
                                            <Card className="border-0">
                                                <Card.Header>
                                                    <Card.Title className="product-title-main">
                                                        {this.props.Login.masterData.SelectedMaterialType ?
                                                            this.props.Login.masterData.SelectedMaterial['Material Name'] : ""}
                                                    </Card.Title>
                                                    <Card.Subtitle>
                                                        <ProductList className="d-flex product-category icon-group-wrap">                                                      
                                                           
                                                        {  this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===5 ?
                                                       <h2 className="material-accounting flex-grow-1">
                                                     <MediaLabel >
                                                           {this.props.intl.formatMessage({ id: "IDS_OPENQTY" })} : {this.props.Login.masterData.OpenQty} & {this.props.intl.formatMessage({ id: "IDS_CLOSEQTY" })} : {this.props.Login.masterData.CloseQty}
                                                       </MediaLabel>

                                                   </h2> 
                                                        :
                                                        <h2 className="product-title-sub flex-grow-1">
                                                                 <MediaLabel >
                                                                    {this.props.intl.formatMessage({ id: "IDS_QUARANTINE" })} :
                                                                </MediaLabel>
                                                                <MediaLabel
                                                                    className={`btn btn-outlined ${this.props.Login.masterData.
                                                                        SelectedMaterial['ntransactionstatus'] === transactionStatus.YES ?
                                                                        "outline-success" : "outline-danger"} btn-sm ml-3`}>
                                                                    {this.props.Login.masterData.SelectedMaterial
                                                                    ['ntransactionstatus'] === transactionStatus.YES ?
                                                                    this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" })}
                                                                </MediaLabel> 


                                                            </h2>
                                                        }       

                                                            {  this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode!==5 ?
                                                             <div className="d-inline ">
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}

                                                                    
                                                                    hidden={
                                                                        this.state.userRoleControlRights.indexOf(
                                                                            editId
                                                                        ) === -1
                                                                      }
                                                                    //   data-for="tooltip_list_wrap"
                                                                    onClick={(e) =>
                                                                        this.props.getAddMaterialPopup(
                                                                            "update", this.props.Login, this.state.selectedcombo,
                                                                            editId, this.props.Login.masterData,
                                                                            this.state.selectedRecord,"IDS_MATERIAL")
                                                                    }
                                                                >

                                                                    <FontAwesomeIcon icon={faPencilAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}

                                                                    hidden={
                                                                        this.state.userRoleControlRights.indexOf(
                                                                          deleteId
                                                                        ) === -1
                                                                      }
                                                                    //   data-for="tooltip_list_wrap"
                                                                    onClick={() => this.ConfirmDelete(deleteId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />

                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDMATERIALSAFETYINSTRUCTIONS" })}
                                                                    //   data-for="tooltip_list_wrap"

                                                                    hidden={
                                                                        this.state.userRoleControlRights.indexOf(
                                                                            addParameterId
                                                                        ) === -1
                                                                      }
                                                                    onClick={(e) => this.props.addSafetyInstructions(this.props.Login.masterData,
                                                                        this.props.Login.userInfo, addParameterId, "create", {})}
                                                                >
                                                                    <Safety className="custom_icons" width="15" height="15" />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MATERIALPROPERTY" })}

                                                                    hidden={
                                                                        this.state.userRoleControlRights.indexOf(
                                                                            addMaterialProperty
                                                                        ) === -1
                                                                      }
                                                                    //  data-for="tooltip_list_wrap"
                                                                    onClick={(e) => this.props.addMaterialProperty(this.props.Login.masterData,
                                                                        this.props.Login.userInfo, addMaterialProperty, this.props.Login.timeZone)}
                                                                >
                                                                    <Property className="custom_icons" width="18" height="18" />
                                                                </Nav.Link>

                                                                </div>
                                                             :
                                                             
                                                             <div className="d-inline ">
                                                             {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MATERIALACCOUNTINGPELLET" })}

                                                                 hidden={
                                                                     this.state.userRoleControlRights.indexOf(
                                                                        addMaterialAccounting
                                                                     ) === -1
                                                                   }
                                                              onClick={(e) =>  this.props.getAddMaterialAccountingPopup("create", this.props.Login, this.state.selectedcombo,
                                                                        addId, this.props.Login.masterData,this.state.selectedRecord,"IDS_MATERIALACCOUNTING","Pellet")}
                                                             >
                                                                 <Issue className="custom_icons" width="18" height="18" />
                                                             </Nav.Link>


                                                             <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MATERIALACCOUNTINGPOWDER" })}

                                                                 hidden={
                                                                     this.state.userRoleControlRights.indexOf(
                                                                        addMaterialAccountingPowder
                                                                     ) === -1
                                                                   }


                                    onClick={(e) =>  this.props.getAddMaterialAccountingPopup("create", this.props.Login, this.state.selectedcombo,
                                    addId, this.props.Login.masterData,this.state.selectedRecord,"IDS_MATERIALACCOUNTING","powder")}

                                                             >
                                                                 <Powder className="custom_icons" width="18" height="18" />
                                                             </Nav.Link>

                                                             <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MATERIALACCOUNTINGLIQUID" })}

                                                                 hidden={
                                                                     this.state.userRoleControlRights.indexOf(
                                                                        addMaterialAccountingSolution
                                                                     ) === -1
                                                                   }


                                    onClick={(e) =>  this.props.getAddMaterialAccountingPopup("create", this.props.Login, this.state.selectedcombo,
                                    addId, this.props.Login.masterData,this.state.selectedRecord,"IDS_MATERIALACCOUNTING","Liquid")}

                                                             >
                                                                 <Solution className="custom_icons" width="18" height="18" />
                                                             </Nav.Link>

                                                             {/* <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REPORT" })}

                                                                 hidden={                                                                    
                                                                          this.state.userRoleControlRights.indexOf(
                                                                        materialAccountingReport
                                                                     ) === -1
                                                                    
                                                                   }
                                                                   onClick={(e) =>  this.props.getReportDetails(this.props.Login.masterData, this.props.Login.userInfo)} 
                                                             >
                                                                 <Generate className="custom_icons" width="18" height="18" />
                                                             </Nav.Link> */}
                                                             
                                                         </div>
                                                             
                                                             }

                                                        </ProductList>
                                                    </Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>
                                                  {  this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===5 ? 
                                                   "" 
                                                  :<Row>
                                                        {/* {this.accordianDesign()} */}
                                                        <SampleInfoView
                                                            data={this.props.Login.masterData.SelectedMaterial}
                                                            SingleItem={JSON.parse(this.props.Login.masterData.DesignMappedFeilds['jsondata'].value)
                                                            ['MaterialViewFields'
                                                            ]}
                                                            screenName="IDS_SAMPLEINFO"
                                                            userInfo={this.props.Login.userInfo}
                                                            // ALPD-950
                                                            size={4}
                                                        />
                                                    </Row>}
                                                  
                                                    {  this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===5 ? 
                                                  
                                                    <MaterialInventoryTab
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        // dataResult={process(sortData(this.props.Login.masterData["MaterialSection"], 'descending', 'nmaterialsectioncode'),
                                                        //     (this.props.screenName === undefined || this.props.screenName === "IDS_MATERIALSECTION")
                                                        //         ? this.state.sectionDataState : { skip: 0, take: 10 })}
                                                        
                                                        //dataResult={process(this.props.Login.masterData["MaterialSection"]|| [],{ skip: 0, take: 10 })}
                                                        //dataState={(this.props.screenName === undefined || this.props.Login.screenname === "IDS_MATERIALSECTION" || this.props.Login.screenname === "IDS_MATERIALACCOUNTING")
                                                       //     ? this.state.sectionDataState : { skip: 0, take: 10 }}
                                                       // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                                                        data={this.props.Login.masterData["MaterialSection"]}
                                                        dataResult={process(sortData(this.props.Login.masterData["MaterialSection"], 'descending', 'nmaterialinventtranscode'),
                            (this.props.screenName === undefined || this.props.screenName === "IDS_MATERIALSECTION")
                                ? this.state.sectionDataState : { skip: 0, take: 10 })}
                        dataState={(this.props.screenName === undefined || this.props.screenname === "IDS_MATERIALSECTION")
                            ? this.state.sectionDataState : { skip: 0, take: 10 }}
                        dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                                                        masterData={this.props.Login.masterData}
                                                        userInfo={this.props.Login.userInfo}
                                                        getTestDetails={this.props.getTestDetails}
                                                       getAddMaterialSectionPopup={this.props.getAddMaterialSectionPopup}
                                                        addParameter={this.addMaterialSection}
                                                        deleteRecord={this.deleteRecordmain}
                                                        fetchRecord={this.props.getMaterialSectionEdit}
                                                        selectedRecord={this.props.Login.selectedRecord}
                                                        selectedId={this.props.Login.selectedId}
                                                        screenName="IDS_MATERIALSECTION"
                                                    />
                                               
                                                    
                                                    :
                                                    this.props.Login.masterData && <CustomTab activeKey={this.props.Login.masterData.tabScreen || 'IDS_MATERIALMSDSATTACHMENT'} tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                    }
                                                    
                                                </Card.Body>
                                            </Card> : ""}
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                {/* {this.props.Login.openPortal &&

                        <DynamicSlideoutMaterial
                            selectedRecord={this.state.selectedRecord}
                            enableDisableTextInput={this.props.Login.selectedRecord['IDS_EXPIRY']}
                            templateData={this.props.Login.masterData.selectedTemplate &&
                                this.props.Login.masterData.selectedTemplate[0].jsondata}
                            onNumericInputChange={this.onNumericInputChange}
                            handleChange={this.handleChange}
                            onInputOnChange={this.onInputOnChange}
                            comboData={this.props.Login.templateData && this.props.Login.templateData.comboData}
                            onComboChange={this.onComboChangedynamic}

                        />
                } */}
                {
                    (this.props.Login.openModal || this.props.Login.openChildModal) &&
                    <SlideOutModal show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.screenname === 'IDS_MATERIALSAFETYINSTRUCTIONS' ? '' :
                            this.props.Login.screenname === 'IDS_MATERIALPROPERTY' ? '' :
                                this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenname}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenname === 'IDS_MATERIALMSDSATTACHMENT' ? mandatoryFieldsMaterialFile : this.props.Login.screenname === 'IDS_MATERIAL' ? this.dynamicmandatoryFeilds() :
                            this.props.Login.screenname !== 'IDS_MATERIALPROPERTY' ?
                                this.props.Login.screenname !== 'IDS_MATERIALSAFETYINSTRUCTIONS' ? mandatoryFieldsMaterialSection : ''
                                : ''}
                        updateStore={this.props.updateStore}
                        addComponent={
                            this.props.Login.loadEsign ?
                                <Esign operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                :
                                this.props.Login.screenname !== "IDS_MATERIALMSDSATTACHMENT" ?
                                    this.props.Login.screenname !== 'IDS_MATERIALPROPERTY' ?
                                        this.props.Login.screenname !== 'IDS_MATERIALSAFETYINSTRUCTIONS' ?
                                            this.props.Login.showMaterialSection ?
                                                <AddMaterialSection
                                                    selectedRecord={this.props.Login.selectedRecord || {}}
                                                    onInputOnChange={this.onInputOnChange}
                                                    MaterialSectionCombodata={this.props.Login.masterData.MaterialSection && this.props.Login.masterData.MaterialSection}
                                                    onNumericInputChange={this.onNumericInputChange}
                                                    onComboChange={this.onComboChange}
                                                    isDisabled={this.props.Login.isneedcombomulti && this.props.Login.isneedcombomulti}
                                                    ismaterialsectionEdit={this.props.Login.ismaterialsectionEdit}

                                                    comboData={this.props.Login.masterData.productCategoryList}
                                                />
                                                :
                                                <DynamicSlideoutMaterial
                                                    operation={this.props.Login.operation}
                                                    showSectionWhileEdit={this.state.showSectionWhileEdit}
                                                    selectedRecord={this.state.selectedRecord}
                                                    userInfo={this.props.Login.userInfo}
                                                    isBreadCrumbCategory=
                                                    {this.props.Login.operation === 'update' ?
                                                        this.props.Login.masterData.SelectedMaterialCategory.nmaterialcatcode ===
                                                            this.props.Login.selectedRecord['Material Category'].value ? true : false
                                                        : false}
                                                    enableDisableNeedExpiry={this.props.Login.selectedRecord['Expiry']}
                                                    enableDisableOpenExpiry={this.props.Login.selectedRecord['Open Expiry Need']}
                                                    enableDisableNextValidation={this.props.Login.selectedRecord['Next Validation Need']}
                                                    enableDisableNextValidationNeed={this.props.Login.selectedRecord['Quarantine']}
                                                    enableDisableExpiryPolicy={this.props.Login.selectedRecord['Expiry Validations']}

                                                    templateData={this.props.Login.masterData.selectedTemplate &&
                                                        this.props.Login.masterData.selectedTemplate[0].jsondata}
                                                    onNumericInputChange={this.onNumericInputChange}
                                                    handleChange={this.handleChange}
                                                    onInputOnChange={this.onInputOnChange}
                                                    timeZoneList={this.props.Login.timeZoneList}
                                                    handleDateChange={this.handleDateChange}
                                                    CurrentTime={rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.Currentdate)}
                                                    comboData={this.props.Login.templateData && this.props.Login.templateData.comboData}
                                                    onComboChange={this.onComboChangedynamic}
                                                    // ismaterialSectionneed={this.state.ismaterialSectionneed}
                                                    screenname={this.props.Login.screenname}
                                                    ismaterialSectionneed={this.props.Login.selectedRecord['Material Category'] && this.props.Login.selectedRecord['Material Category'].item &&
                                                        this.props.Login.selectedRecord['Material Category'].item.jsondata.needsectionwise
                                                        || this.props.Login.selectedRecord['Material Category'] && this.props.Login.selectedRecord['Material Category'].needsectionwise || this.props.Login.masterData.ismaterialSectionneed}
                                                    checkSectionNeed={this.props.Login.selectedRecord['Material Category'] && this.props.Login.selectedRecord['Material Category'].item &&
                                                        this.props.Login.selectedRecord['Material Category'].item.jsondata.needsectionwise === transactionStatus.YES && this.props.Login.masterData.SelectedMaterialCategory.needSectionwise === transactionStatus.YES ? true : false}
                                                />
                                            :
                                            <DynamicSlideoutMaterial
                                                selectedRecord={this.state.selectedRecord}
                                                userInfo={this.props.Login.userInfo}
                                                templateData={this.props.Login.masterData.selectedTemplateSafetyInstructions &&
                                                    this.props.Login.masterData.selectedTemplateSafetyInstructions[0].jsondata}
                                                handleChange={this.handleChange}
                                                onInputOnChange={this.onInputOnChangeDynamic}
                                            />
                                        :
                                        <DynamicSlideoutMaterial
                                            selectedRecord={this.props.Login.selectedRecord}
                                            userInfo={this.props.Login.userInfo}
                                            templateData={this.props.Login.masterData.selectedTemplateProperties &&
                                                this.props.Login.masterData.selectedTemplateProperties[0].jsondata}
                                            // userInfo={this.props.Login.userInfo}
                                            handleChange={this.handleChange}
                                            onInputOnChange={this.onInputOnChange}
                                            handleDateChange={this.handleDateChange}
                                            timeZoneList={this.props.Login.timeZoneList && this.props.Login.timeZoneList}
                                            onComboChange={this.onComboChangedynamic}
                                            defaultTimeZone={this.props.Login.defaultTimeZone}
                                        /> :
                                    <AddMaterialFile
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onDrop={this.onDropMaterialFile}
                                        deleteAttachment={this.deleteAttachment}
                                        onComboChange={this.onComboChange}
                                        linkMaster={this.props.Login.linkMaster}
                                        maxSize={20}
                                        maxFiles={1}
                                        multiple={false}
                                        hideDefaultToggle={true}
                                        settings={this.props.Login.settings}
                                        label={this.props.intl.formatMessage({ id: "IDS_MATERIALMSDSATTACHMENT" })}
                                        name="testfilename"
                                    />
                        }
                    />
                }

{this.props.Login.modalShow ? (
          <ModalShow
            modalShow={this.props.Login.modalShow}
            closeModal={this.closeModalShow}
            onSaveClick={this.onSaveModalClick}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={mandatoryAccountingReport}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            modalTitle={this.props.intl.formatMessage({ id: "IDS_REPORT" })}
            modalBody={
             
                <AddReportDetails
                  selectedRecord={this.state.selectedRecord || {}}
                  masterData={this.props.Login.masterData}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  onInputOnChange={this.onInputOnChange}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                  userInfo={this.props.Login.userInfo}
                  esign={this.props.Login.loadEsign}
                  handleFilterDateChange={this.handleFilterDateChange}
                  currentTime={this.props.Login.currentTime}
                />
                
            }
          />
        ) : (
          ""
        )}
            </>
        );
    }

    openModal = (operation, loginProps, selectedCombo,
        addId, masterData, selectedRecord,screenname) => {
        if (this.state.selectedcombo["nmaterialtypecode"] && this.state.selectedMaterialCat["nmaterialcatcode"]) {
            this.props.getAddMaterialPopup(operation, loginProps, selectedCombo,
                addId, masterData, selectedRecord,screenname)
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

    dynamicmandatoryFeilds = () => {
        let mandatoryFeildsMaterial = [];
        let slanguagetypecode = this.props.Login.userInfo.slanguagetypecode
        this.props.Login.masterData.selectedTemplate &&
            this.props.Login.masterData.selectedTemplate[0].jsondata.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        if (component.mandatory) {
                            if (component.inputtype === 'combo') {
                                mandatoryFeildsMaterial.push({
                                    "idsName": component.displayname[slanguagetypecode], "dataField": component.label,
                                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                                })
                            }
                            else {
                                mandatoryFeildsMaterial.push({
                                    "idsName": component.displayname[slanguagetypecode], "dataField": component.label,
                                    "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                                })
                            }
                        }
                        component.hasOwnProperty("children") && component.children.map((componentrow) => {
                            if (componentrow.mandatory) {
                                if (componentrow.inputtype === 'combo') {
                                    mandatoryFeildsMaterial.push({
                                        "idsName": componentrow.displayname[slanguagetypecode], "dataField": componentrow.label,
                                        "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                                    })
                                }
                                else {
                                    mandatoryFeildsMaterial.push({
                                        "idsName": componentrow.displayname[slanguagetypecode], "dataField": componentrow.label,
                                        "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                                    })
                                }
                            }
                        })
                    })
                })
            })
        if (this.props.Login.selectedRecord['Expiry Validations']) {
            if (this.props.Login.selectedRecord['Expiry Validations'] === 'Expiry policy') {
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_EXPIRYPOLICY", "dataField": "Expiry Policy Days",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "textbox"
                });
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_EXPIRYPOLICYPERIOD", "dataField": "Expiry Policy Period",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                });
            }
        }

        if (this.props.Login.selectedRecord['Open Expiry Need']) {
            if (this.props.Login.selectedRecord['Open Expiry Need'] === 3) {
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_OPENEXIPIRY", "dataField": "Open Expiry",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "textbox"
                });
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_OPENEXIPIRYPERIOD", "dataField": "Open Expiry Period",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                });
            }
        }

        if (this.props.Login.selectedRecord['Next Validation Need']) {
            if (this.props.Login.selectedRecord['Next Validation Need'] === 3) {
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_NEXTVALIDATION", "dataField": "Next Validation",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "textbox"
                });
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_NEXTVALIDATIONPERIOD", "dataField": "Next Validation Period",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                });
            }
        }
        // if (this.props.Login.masterData.ismaterialSectionneed === transactionStatus.YES) {
        if (this.props.Login.selectedRecord['Material Category'] !== undefined) {
            if ((this.props.Login.selectedRecord['Material Category'] && this.props.Login.selectedRecord['Material Category'].item ?
                this.props.Login.selectedRecord['Material Category'].item.jsondata.needsectionwise :
                this.props.Login.selectedRecord['Material Category'].needsectionwise) === transactionStatus.YES) {
                mandatoryFeildsMaterial.push({
                    "idsName": "IDS_SECTION", "dataField": "Section",
                    "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"
                }, {
                    "idsName": "IDS_REORDERLEVEL", "dataField": "Reorder Level",
                    "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox"
                })
            } else {
                mandatoryFeildsMaterial.map((temp, i) => {
                    if (temp.dataField === 'Section' || temp.dataField === 'Reorder Level') {
                        delete mandatoryFeildsMaterial[i];
                    }
                });
            }
        }
        return mandatoryFeildsMaterial;
    }

    accordianDesign = () => {
        let selectedmasterlistmain = [];
        this.props.Login.masterData.SelectedMaterial && this.props.Login.masterData.SelectedMaterial.jsondata !== undefined &&
            selectedmasterlistmain.push(this.props.Login.masterData.SelectedMaterial.jsondata)

        let designaccordian = [];
        this.props.Login.masterData.selectedTemplate[0].jsondata.map((row) => {
            row.children.map((column) => {
                column.children.map((component) => {
                    if (component.inputtype === 'combo') {
                        if (component.label !== undefined) {
                            designaccordian.push(<Col md='4'>
                                <FormGroup>
                                    <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                    <ReadOnlyText>
                                        {selectedmasterlistmain.length > 0 &&
                                            selectedmasterlistmain[0][component.label] ?
                                            selectedmasterlistmain[0][component.label]['label'] : "-"}
                                    </ReadOnlyText>

                                </FormGroup>
                            </Col>)
                        }
                    }
                    else if (component.inputtype === 'toggle') {
                        if (component.label !== undefined) {
                            designaccordian.push(<Col md='4'>
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
                            designaccordian.push(<Col md='4'>
                                <FormGroup>
                                    <FormLabel><FormattedMessage id={[component.label]} message={[component.label]} /></FormLabel>
                                    <ReadOnlyText>
                                        {selectedmasterlistmain.length > 0 &&
                                            selectedmasterlistmain[0][component.label] ? selectedmasterlistmain[0][component.label] : "-"}
                                    </ReadOnlyText>

                                </FormGroup>
                            </Col>)
                        }
                    }
                    component.hasOwnProperty("children") && component.children.map((componentrow) => {
                        if (componentrow.inputtype === 'combo') {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md='4'>
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
                        else if (componentrow.inputtype === 'toggle') {
                            if (componentrow.label !== undefined) {
                                designaccordian.push(<Col md='4'>
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
                                designaccordian.push(<Col md='4'>
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

    handleDateChange = (dateValue, dateName) => {

        const { selectedRecord } = this.state;
        let isSelectedRecordChange = this.state.isSelectedRecordChange
        isSelectedRecordChange = true;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord, isSelectedRecordChange });
    }

    onTabChange = (tabProps) => {
        const tabScreen = tabProps.screenName;
        let masterData = this.props.Login.masterData
        masterData['tabScreen'] = tabScreen
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
        }
        this.props.updateStore(updateInfo);
    }

    handleDateChanges = (dateName,dateValue) => {
        let masterData = this.props.Login.masterData
        if (dateValue === null) {
            dateValue = new Date();
          }
          let fromdate = this.props.Login.masterData.fromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.fromDate) : new Date()
          let todate = this.props.Login.masterData.toDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.toDate) : new Date()
          let obj = {}
          if (dateName === 'fromDate') {
            
            // obj = convertDateValuetoString(dateValue, todate, this.props.Login.userInfo)
            // fromdate = obj.fromDate
            // todate = obj.toDate
            // let fromDate = obj.fromDate
            // let toDate = obj.toDate
            //masterData[dateName] = rearrangeDateFormat(this.props.Login.userInfo,dateValue) ;
            masterData[dateName] =convertDateTimetoString(dateValue,this.props.Login.userInfo);
          } else {
            // obj = convertDateValuetoString(fromdate, dateValue, this.props.Login.userInfo)
            // fromdate = obj.fromDate
            // todate = obj.toDate
            // let fromDate = obj.fromDate
            // let toDate = obj.toDate
            // masterData[dateName] = todate;
            masterData[dateName] =convertDateTimetoString(dateValue,this.props.Login.userInfo);
          }
        
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { masterData }
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
        let nmaterialconfigcode;
        let testFile = {
            nmaterialconfigcode: this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
            nmaterialcode: this.props.Login.masterData.SelectedMaterial.nmaterialcode,
            nmaterialfilecode: selectedRecord.nmaterialfilecode ? selectedRecord.nmaterialfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,

            ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ?
                selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
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
            testFile["slinkname"] = selectedRecord['nlinkcode'].label && selectedRecord['nlinkcode'].label;
            testFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            testFile["ssystemfilename"] = "";
            testFile["dcreateddate"] = this.props.Login.dcreateddate &&
                convertDateTimetoStringDBFormat(this.props.Login.dcreateddate, this.props.Login.userInfo)
            testFile["nfilesize"] = 0;
            testFileArray.push(testFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("materialmsdsattachment", JSON.stringify(testFileArray[0]));

        let inputParam;
        if (this.props.Login.operation === 'create') {
            inputParam = {
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
                classUrl: "material",
                methodUrl: "MaterialMsdsAttachment",
                searchRef: this.searchRef,
                isChild: true,
                selectedRecord:{...this.state.selectedRecord}
                
            }
        }
        else {
            let postParam = {
                inputListName: "MaterialMsdsAttachment",
                selectedObject: "SelectedMaterialMsdsAttachment",
                primaryKeyField: "nmaterialfilecode",
            }
            inputParam = {
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)

                    }
                },
                formData: formData,
                isFileupload: true,
                operation: "update",
                classUrl: "material",
                methodUrl: "MaterialMsdsAttachment",
                searchRef: this.searchRef,
                postParam: postParam,
                isChild: true,
                selectedRecord:{...this.state.selectedRecord}
            }
        }

        return inputParam;
    }

    tabDetail = () => {
        const tabMap = new Map();
        {
            // let dataresultarr1 = []
            // console.log('dcv :', this.props.Login.masterData.MaterialMsdsAttachment && this.props.Login.masterData.MaterialMsdsAttachment)
            // this.props.Login.masterData.MaterialMsdsAttachment.map((temp) => {
            //     temp['jsondata'].dcreateddate =
            //      rearrangeDateFormatDateOnly(this.props.Login.userInfo, temp['jsondata'].dcreateddate)
            // })
            // console.log('dataresultarr1 :', this.props.Login.masterData.MaterialMsdsAttachment)

            // let dataresultarr = []
            // this.props.Login.masterData["MaterialSection"] &&
            //     this.props.Login.masterData["MaterialSection"].map((temp) => {
            //         return dataresultarr.push(temp.jsondata)
            //     })
            // console.log('xxx->>>', sortData(this.props.Login.masterData["MaterialSection"], 'descending', 'nmaterialsectioncode'))
            this.props.Login.masterData.ismaterialSectionneed === 3 && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode!==5 &&
                tabMap.set("IDS_MATERIALSECTION",
                    <MaterialSectionTab
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        dataResult={process(sortData(this.props.Login.masterData["MaterialSection"], 'descending', 'nmaterialsectioncode'),
                            (this.props.screenName === undefined || this.props.screenName === "IDS_MATERIALSECTION")
                                ? this.state.sectionDataState : { skip: 0, take: 10 })}
                        dataState={(this.props.screenName === undefined || this.props.screenname === "IDS_MATERIALSECTION")
                            ? this.state.sectionDataState : { skip: 0, take: 10 }}
                        dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                        //data={process(sortData(this.props.Login.masterData["MaterialSection"], 'descending',
                        //'nmaterialsectioncode'))}
                        data={this.props.Login.masterData["MaterialSection"]}
                        masterData={this.props.Login.masterData}
                        userInfo={this.props.Login.userInfo}
                        getTestDetails={this.props.getTestDetails}
                        getAddMaterialSectionPopup={this.props.getAddMaterialSectionPopup}
                        addParameter={this.addMaterialSection}
                        deleteRecord={this.deleteRecordmain}
                        fetchRecord={this.props.getMaterialSectionEdit}
                        selectedRecord={this.props.Login.selectedRecord}
                        selectedId={this.props.Login.selectedId}
                        screenName="IDS_MATERIALSECTION"
                    />
                );
            tabMap.set("IDS_MATERIALMSDSATTACHMENT",
                <MaterialMsdsAttachmentTab
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                    userInfo={this.props.Login.userInfo}
                    deleteRecord={this.deleteRecordmain}
                    MaterialMsdsAttachment={sortData(this.props.Login.masterData.MaterialMsdsAttachment, "descending", "nmaterialfilecode") || []}
                    addMaterialFile={(param) => this.props.addMaterialFile(param, this.props.Login.masterData.SelectedMaterial)}
                    viewMaterialFile={this.viewMaterialFile}
                    screenName="IDS_MATERIALMSDSATTACHMENT"
                    settings={this.props.settings}
                />);


        }

        return tabMap;
    }

    deleteRecordmain = (deleteParam) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.methodUrl === 'MaterialSection' ? JSON.stringify(deleteParam.selectedRecord) :
            JSON.stringify(deleteParam.selectedRecord);
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
            classUrl: "material",
            operation: deleteParam.operation,
            ncontrolCode: deleteParam.ncontrolCode,
            methodUrl: methodUrl,
            screenName: "IDS_MATERIAL", dataState,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: false, openChildModal: true, screenName: "IDS_MATERIAL", operation: deleteParam.operation, selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
    }

    addMaterialSection = (param) => {
        let showMaterialSection = this.props.Login.showMaterialSection
        let ncontrolCode = this.props.Login.ncontrolCode

        let openModal = this.props.Login.openModal
        let isneedcombomulti = this.props.Login.isneedcombomulti;
        isneedcombomulti = false;
        showMaterialSection = true
        openModal = true
        ncontrolCode = param;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showMaterialSection, isneedcombomulti, openModal }
        }
        this.props.getAddMaterialSectionPopup(this.props.Login.masterData, this.props.Login.userInfo, updateInfo, ncontrolCode)


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
        inputData["nmaterialtypecode"] = this.state.selectedcombo["nmaterialtypecode"];
        inputData["materialCatList"] = this.state.materialCatList;
        inputData["fromDate"] = this.props.Login.masterData.fromDate;
        inputData["toDate"] = this.props.Login.masterData.toDate;
        if (this.state.selectedcombo["nmaterialtypecode"] && this.state.selectedMaterialCat["nmaterialcatcode"]) {
            this.props.getMaterialByTypeCode(this.state.selectedcombo,
                this.state.selectedMaterialCat, this.props.Login.masterData, this.props.Login.userInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
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
        // if (Array.isArray(this.props.Login.masterData)) {
            const obj = convertDateValuetoString(this.props.Login.masterData.fromDate, this.props.Login.masterData.toDate, this.props.Login.userInfo)
            {this.props.Login.masterData.SelectedMaterialType && this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode===5 ?  breadCrumbData.push(
           
            
                {
    
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                  }, {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                  },
               
                {
                    "label": "IDS_MATERIALTYPE",
                    "value": this.props.Login.masterData.SelectedMaterialType ?
                        this.props.Login.masterData.SelectedMaterialType[0]['jsondata'].smaterialtypename && this.props.Login.masterData.SelectedMaterialType[0]['jsondata'].smaterialtypename[this.props.Login.userInfo.slanguagetypecode] : "NA",
    
                }, {
    
                "label": "IDS_SAMPLEGROUPNAME",
                "value": this.props.Login.masterData.SelectedMaterialCategoryFilter ?
                    this.props.Login.masterData.SelectedMaterialCategoryFilter.smaterialcatname !== undefined ?
                        this.props.Login.masterData.SelectedMaterialCategoryFilter.smaterialcatname : "NA" : "NA",
            }
            
            
            ): breadCrumbData.push(          
                {
                    "label": "IDS_MATERIALTYPE",
                    "value": this.props.Login.masterData.SelectedMaterialType ?
                        this.props.Login.masterData.SelectedMaterialType[0]['jsondata'].smaterialtypename && this.props.Login.masterData.SelectedMaterialType[0]['jsondata'].smaterialtypename[this.props.Login.userInfo.slanguagetypecode] : "NA",
    
                }, {
    
                "label": "IDS_MATERIALCAT",
                "value": this.props.Login.masterData.SelectedMaterialCategoryFilter ?
                    this.props.Login.masterData.SelectedMaterialCategoryFilter.smaterialcatname !== undefined ?
                        this.props.Login.masterData.SelectedMaterialCategoryFilter.smaterialcatname : "NA" : "NA",
            }
            
            
            )}
       
        //  }
        return breadCrumbData;
    }

    componentDidUpdate(previousProps) {
        let bool = false;
        let { selectedRecord, selectedcombo, comboitem, filterData, filterCatList, selectedMaterialCat,
            materialCatList, ismaterialSectionneed, showSectionWhileEdit } = this.state
        const masterData = this.props.Login.masterData;
        // if (this.props.Login.isSelectedRecordChange !== previousProps.Login.isSelectedRecordChange) {
        //     bool = true;
        //   isSelectedRecordChange = this.props.Login.isSelectedRecordChange
        // }
        // if (this.props.Login.selectedRecord.IDS_MATERIALCAT &&
        //     this.props.Login.selectedRecord.IDS_MATERIALCAT.item.jsondata.needsectionwise
        //     != previousProps.Login.selectedRecord.IDS_MATERIALCAT.item.jsondata.needsectionwise) {
        //     bool = true;
        //     ismaterialSectionneed = this.props.Login.selectedRecord.IDS_MATERIALCAT.item.jsondata.needsectionwise
        // }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            bool = true;
            selectedRecord = this.props.Login.selectedRecord
        }
        if (this.props.Login.selectedcombo !== previousProps.Login.selectedcombo) {
            bool = true;
            selectedcombo = this.props.Login.selectedcombo
        }

        if (this.props.Login.showSectionWhileEdit !== previousProps.Login.showSectionWhileEdit) {
            bool = true;
            showSectionWhileEdit = this.props.Login.showSectionWhileEdit
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
                // const materialTypeList = constructOptionList(this.props.Login.masterData.MaterialType || [], "nmaterialtypecode",
                //     "smaterialtypename", undefined, undefined, undefined);
                //     constructOptionList(options, optionId,
                //         optionValue, sortField, sortOrder, alphabeticalSort,
                //          defaultStatusFieldName) 
                const materialTypeList = constructjsonOptionList(this.props.Login.masterData.MaterialType,
                    "nmaterialtypecode", "smaterialtypename", undefined, undefined,
                    undefined, undefined,
                    undefined, true, this.props.Login.userInfo.slanguagetypecode)
                filterCatList = materialTypeList.get("OptionList");
                //  console.log('masterData.MaterialType :', masterData.MaterialType)
                selectedcombo = {
                    nmaterialtypecode: masterData.MaterialType && masterData.MaterialType.length > 0 ? {
                        "value": masterData.MaterialType[0].nmaterialtypecode,
                        "label": masterData.MaterialType[0]['jsondata'].smaterialtypename[this.props.Login.userInfo.slanguagetypecode]
                    } : ""
                }
            }
        }

        if (this.props.Login.masterData.MaterialCategoryMain !== previousProps.Login.masterData.MaterialCategoryMain) {
            const MaterialCategoryMain = constructOptionList(this.props.Login.masterData.MaterialCategoryMain || [], "nmaterialcatcode",
                "smaterialcatname", undefined, undefined, undefined);
            materialCatList = MaterialCategoryMain.get("OptionList");
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            bool = true;
            filterData = this.generateBreadCrumData();
            if (masterData.SelectedMaterialCategory !== previousProps.Login.masterData.SelectedMaterialCategory) {

                const MaterialCategoryMain = constructOptionList(this.props.Login.masterData.MaterialCategoryMain || [], "nmaterialcatcode",
                    "smaterialcatname", undefined, undefined, undefined);
                materialCatList = MaterialCategoryMain.get("OptionList");

                selectedMaterialCat = {
                    nmaterialcatcode: masterData.MaterialCategoryMain && masterData.MaterialCategoryMain.length > 0 ? {
                        "value": masterData.SelectedMaterialCategory.nmaterialcatcode,
                        "label": masterData.SelectedMaterialCategory.smaterialcatname
                    } : ""
                }
            }
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
                selectedRecord, comboitem, filterData, selectedcombo, filterCatList, selectedMaterialCat,
                materialCatList, isSelectedRecordChange: false, showSectionWhileEdit
                //, 
                // ismaterialSectionneed 
                // : bool?this.props.Login.selectedRecord.IDS_MATERIALCAT&&
                // this.props.Login.selectedRecord.IDS_MATERIALCAT.item.jsondata.needsectionwise:ismaterialSectionneed
            });
        }

        //Vishakh: I commented updateStore. Because this updateStore won't get any change in the flow.
        //  Even the udpateStore is there or not, there is no change in the flow.
        // if(this.props.Login.comboSet){
        //     this.setState({ selectedMaterialCat: this.props.Login.selectedMaterialCat});

        //     const updateInfo = {
        //         typeName: DEFAULT_RETURN,
        //         data: { comboSet: false }
        //     }
        //     this.props.updateStore(updateInfo);
        // }

        // else
        // {
        //     this.setState({
        //     ismaterialSectionneed 
        //     : this.props.Login.selectedRecord.IDS_MATERIALCAT&&
        //     this.props.Login.selectedRecord.IDS_MATERIALCAT.item.jsondata.needsectionwise
        // });
        // }
    }

    handlePageChange = e => {

        this.setState({
            skip: e.skip,
            take: e.take
        });

    };

    validateEsign = () => {
        let modal = "openModal";
        if (this.props.Login.operation === "delete" && (this.props.Login.screenData.inputParam.methodUrl === "MaterialSection" || this.props.Login.screenData.inputParam.methodUrl === "MaterialMsdsAttachment")) {
            modal = "openChildModal";
        }
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
        this.props.validateEsignCredential(inputParam, modal);
    }

    closeModalShow = () => {
        let loadEsign = this.props.Login.loadEsign;
        let modalShow = false;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            loadEsign = false;
        } else {
            modalShow = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { modalShow, selectedRecord, selectedId: null, loadEsign },
        };
        this.props.updateStore(updateInfo);
    };



    onSaveModalClick = () => {
        let selectedRecord = this.state.selectedRecord || {};
        const dateVariable = new Date(this.state.selectedRecord.syear);
        const yearOnly = dateVariable.getFullYear();
        const  reportdetails={
            "nmaterialaccountinggroupcode":this.state.selectedRecord.nmaterialaccountinggroupcode.value,
            "nuraniumcontenttypecode":this.state.selectedRecord.nuraniumcontenttypecode.value,
            "nmonth":this.state.selectedRecord.nmonth.value,
            "smonth":this.state.selectedRecord.nmonth.label,
            "nyear":yearOnly,
            "scomments":this.state.selectedRecord.scomments,
            
        };
        const materialAccountingReport = this.state.controlMap.has("MaterialAccountingReport")
        && this.state.controlMap.get("MaterialAccountingReport").ncontrolcode;
        selectedRecord= {};
        this.setState({ selectedRecord });
        this.props.generateControlBasedReport(materialAccountingReport,reportdetails,this.props.Login,"materialaccounting",this.props.Login.masterData.SelectedMaterial.nmaterialcode);
    }
    handleFilterDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    viewMaterialFile = (filedata) => {
        const inputParam = {
            inputData: {
                nmaterialcode: this.props.Login.masterData.SelectedMaterial.nmaterialcode
                    && this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                ndesigntemplatemappingcode: this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
                materialmsdsattachment: JSON.stringify(filedata),
                userinfo: this.props.Login.userInfo
            },
            classUrl: "material",
            operation: "view",
            methodUrl: "AttachedMaterialMsdsAttachment",
            screenname: "IDS_MATERIALMSDSATTACHMENT"
        }
        this.props.viewAttachment(inputParam);
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        //ALPD-3485,ALPD-3484 Issue:delete material section and cancel esign pop up window open.
        //Set openchildmodal false, issue fixed by Saravanan - 13-11-2024
        let openChildModal=this.props.Login.openChildModal;
        let showSectionWhileEdit = this.props.Login.showSectionWhileEdit
        let showMaterialSection = this.props.Login.showMaterialSection
        let isneedcombomulti = this.props.Login.isneedcombomulti;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "retire") {
                loadEsign = false;
                openModal = false;
                openChildModal=false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            openChildModal=false;
            showMaterialSection = false;
            isneedcombomulti = false;
            showSectionWhileEdit = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal,openChildModal, showMaterialSection,screenName: "IDS_MATERIAL", showMaterialSection, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            if (fieldName === "nmaterialtypecode") {
                const selectedcombo = this.state.selectedcombo || {};
                selectedcombo[fieldName] = comboData;
                this.searchRef.current.value = "";
                this.props.initialcombochangeget(comboData.item.nmaterialtypecode, this.props.Login.masterData, this.props.Login.userInfo);

            }
            else if (fieldName === "nmaterialcatcode") {
                const selectedMaterialCat = this.state.selectedMaterialCat || {};
                selectedMaterialCat[fieldName] = comboData;
                this.setState({ selectedMaterialCat });
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

            else{
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
              } 
        }
    }

    onComboChangedynamic = (comboData, control) => {

        let isSelectedRecordChange = this.state.isSelectedRecordChange
        if (comboData === null && comboData === undefined && control.valuemember && control.nquerybuildertablecode) {
            comboData["item"] = {
                ...comboData["item"], pkey: control.valuemember,
                nquerybuildertablecode: control.nquerybuildertablecode,
                "source": control.source
            }
        }
        if (control.inputtype === 'date') {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[`tz${control.label}`] = comboData;
            isSelectedRecordChange = true
            this.setState({ selectedRecord, isSelectedRecordChange });
        }
        else {
            if (control.label === 'Material Category') {
                let ismaterialSectionneed = this.props.Login.masterData.ismaterialSectionneed
                let showSectionWhileEdit = this.state.showSectionWhileEdit
                ismaterialSectionneed = comboData.item.jsondata.needsectionwise
                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: {
                //         ismaterialSectionneed
                //     }
                // }

                // ALPD-956 begin
                this.state.selectedRecord['Section'] = ismaterialSectionneed == 4 ? this.state.selectedRecord['Section'] = undefined : this.state.selectedRecord['Section'];
                // ALPD-956 end
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[control.label] = comboData;
                isSelectedRecordChange = true
                showSectionWhileEdit = true
                this.setState({ selectedRecord, isSelectedRecordChange, ismaterialSectionneed, showSectionWhileEdit });
                //   this.props.onMaterialCatChange(comboData.item.jsondata.needsectionwise );
            }
            else {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[control.label] = comboData && (comboData === null || comboData === undefined) ? undefined : comboData;
                isSelectedRecordChange = true
                this.setState({ selectedRecord, isSelectedRecordChange });
            }
        }


    }
    onInputOnChangeDynamic = (event, radiotext) => {
        const selectedRecord = this.state.selectedRecord || {};
        let isSelectedRecordChange = this.state.isSelectedRecordChange
        if (event.target.type === 'checkbox') {
            if (event.target.name === 'timeonly') {
                selectedRecord['dateonly'] = false;
            }
            if (event.target.name === 'dateonly') {
                selectedRecord['timeonly'] = false;
            }
            const value = selectedRecord[event.target.name];
            if (value !== '' && value !== undefined) {
                if (value.includes(radiotext)) {
                    const index = value.indexOf(radiotext);
                    if (index !== -1) {
                        if (index == 0) {
                            const indexcomma = value.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedRecord[event.target.name] = value.slice(indexcomma + 1)

                            } else {
                                selectedRecord[event.target.name] = ""
                            }
                        } else {
                            //  const  indexcomma= value.indexOf(",")
                            if (value.slice(index).indexOf(",") !== -1) {
                                selectedRecord[event.target.name] = value.slice(0, index) + value.slice(index + value.slice(index).indexOf(",") + 1)
                            } else {
                                selectedRecord[event.target.name] = value.slice(0, index - 1)
                            }

                        }
                    }

                } else {
                    selectedRecord[event.target.name] = value + ',' + radiotext;
                }

            } else {
                selectedRecord[event.target.name] = radiotext;
            }
        }
        else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = radiotext;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        isSelectedRecordChange = true;
        this.setState({ selectedRecord, isSelectedRecordChange });
    }
    onInputOnChange = (event, optional2) => {
        const selectedRecord = this.state.selectedRecord || {};
        let isSelectedRecordChange = this.state.isSelectedRecordChange
        if (this.props.Login.screenname !== "IDS_MATERIALMSDSATTACHMENT") {
            if (event.target.type === 'checkbox') {
                if (event.target.name === "ntransactionstatus")
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
                else
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                if (event.target.name === 'Expiry') {
                    if (selectedRecord[event.target.name] === 4) {
                        if (selectedRecord['Expiry Policy Days']) {
                            delete selectedRecord['Expiry Policy Days']
                        }

                        if (selectedRecord['tzExpiry Policy Days']) {
                            delete selectedRecord['tzExpiry Policy Days']
                        }
                        if (selectedRecord['Need Expiry']) {
                            selectedRecord['Need Expiry'] = 4
                        }
                    }
                }
                if (event.target.name === 'Need Expiry' || event.target.name === 'Expiry Validations') {
                    if (selectedRecord[event.target.name] === 4) {
                        if (selectedRecord['Expiry Policy Days']) {
                            delete selectedRecord['Expiry Policy Days']
                        }
                        if (selectedRecord['tzExpiry Policy Days']) {
                            delete selectedRecord['tzExpiry Policy Days']
                        }
                    }
                }

                if (event.target.name === 'Open Expiry Need') {
                    if (selectedRecord[event.target.name] === 4) {
                        if (selectedRecord['Open Expiry']) {
                            delete selectedRecord['Open Expiry']
                        }
                        if (selectedRecord['tzOpen Expiry']) {
                            delete selectedRecord['tzOpen Expiry']
                        }
                        if (selectedRecord['Open Expiry Period']) {
                            delete selectedRecord['Open Expiry Period']
                        }
                    }
                    else {
                        selectedRecord['Open Expiry Period'] = this.props.Login.templateData.comboData['Open Expiry Period'].filter(x =>
                            x.item.jsondata.jsondata.ndefaultstatus === transactionStatus.YES)[0]

                    }
                }
                if (event.target.name === 'Next Validation Need') {
                    if (selectedRecord[event.target.name] === 4) {
                        if (selectedRecord['Next Validation']) {
                            delete selectedRecord['Next Validation']
                        }
                        if (selectedRecord['tzNext Validation']) {
                            delete selectedRecord['tzNext Validation']
                        }
                        if (selectedRecord['Next Validation Period']) {
                            delete selectedRecord['Next Validation Period']
                        }
                    }
                    else {
                        selectedRecord['Next Validation Period'] = this.props.Login.templateData.comboData['Next Validation Period'].filter(x =>
                            x.item.jsondata.jsondata.ndefaultstatus === transactionStatus.YES)[0]

                    }
                }
                if (event.target.name === 'Quarantine') {
                    if (selectedRecord[event.target.name] === 4) {
                        if (selectedRecord['Next Validation Need']) {
                            selectedRecord['Next Validation Need'] = 4
                        }
                        if (selectedRecord['Next Validation']) {
                            delete selectedRecord['Next Validation']
                        }

                        if (selectedRecord['Next Validation Period']) {
                            delete selectedRecord['Next Validation Period']
                        }
                    }
                }
            } else if (event.target.type === 'radio') {
                if (optional2 !== 'Expiry policy') {
                    if (selectedRecord['Expiry Policy Days']) {
                        delete selectedRecord['Expiry Policy Days']
                    }
                    if (selectedRecord['tzExpiry Policy Days']) {
                        delete selectedRecord['tzExpiry Policy Days']
                    }
                    if (selectedRecord['Expiry Policy Period']) {
                        delete selectedRecord['Expiry Policy Period']
                    }
                }
                else {
                    selectedRecord['Expiry Policy Period'] = this.props.Login.templateData.comboData['Expiry Policy Period'].filter(x =>
                        x.item.jsondata.jsondata.ndefaultstatus === transactionStatus.YES)[0]


                }
                selectedRecord[event.target.name] = optional2
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
            isSelectedRecordChange = true
            this.setState({ selectedRecord, isSelectedRecordChange });
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
    onSaveClick = (saveType, formRef) => {
        // console.log("selected:", this.state.selectedRecord);
        let inputData = [];
        let inputParam = {};
        let varmain = {};
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        inputData["DateList"] = []
        let nmaterialconfigcode;
        nmaterialconfigcode = this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode
        if (this.props.Login.screenname === "IDS_MATERIAL") {

            // if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1) {
            //     varmain = "Standard Name"
            // }
            // else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2) {
            //     varmain = "Volumetric Name"
            // }
            // else if (this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 3) {
            //     varmain = "Material Name"
            // }
            inputData["Material"] = {}
            inputData["jsonuidata"] = {}

            const Layout = this.props.Login.masterData.selectedTemplate[0].jsondata
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {


                        if (component.inputtype === 'combo') {
                            let isValid = false;
                            if (component.label === 'Expiry Policy Period') {
                                if (this.state.selectedRecord['Expiry Policy Days'] && this.state.selectedRecord['Expiry Policy Days'] > 0) {
                                    isValid = true;
                                }
                            }
                            else if (component.label === 'Open Expiry Period') {
                                if (this.state.selectedRecord['Open Expiry'] && this.state.selectedRecord['Open Expiry'] > 0) {
                                    isValid = true;
                                }
                            }
                            else if (component.label === 'Next Validation Period') {
                                if (this.state.selectedRecord['Next Validation'] && this.state.selectedRecord['Next Validation'] > 0) {
                                    isValid = true;
                                }
                            }
                            else {
                                isValid = true;
                            }
                            if (isValid) {
                                inputData["Material"][component.label] = this.state.selectedRecord[component.label] ? {
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
                                inputData["Material"][`tz${component.label}`] = component.hasOwnProperty('timezone') ? {
                                    label: this.state.selectedRecord[`tz${component.label}`]["label"],
                                    value: this.state.selectedRecord[`tz${component.label}`]["value"]
                                } : {
                                    label: this.props.Login.userInfo['stimezoneid'],
                                    value: this.props.Login.userInfo['ntimezonecode']
                                }
                                inputData["Material"][component.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)
                                inputData["DateList"].push(component.label)
                            }
                            inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] ?
                                convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)
                                : ""

                        }
                        else if (component.inputtype === 'toggle') {
                            // if (component.label === 'Quarantine') {
                            //     inputData["Material"][component.label] = this.state.selectedRecord[component.label]===undefined?4:
                            //     this.state.selectedRecord[component.label]
                            // }
                            // else if (component.label === 'Expiry') {
                            //     inputData["Material"][component.label] = this.state.selectedRecord[component.label]
                            // }
                            // else if (component.label === 'Need Expiry') {
                            //     inputData["Material"][component.label] = this.state.selectedRecord[component.label]
                            // }
                            // else if (component.label === 'Open Expiry Need') {
                            //     inputData["Material"][component.label] = this.state.selectedRecord[component.label]
                            // }
                            // else if (component.label === 'Reusable') {
                            //     inputData["Material"][component.label] = this.state.selectedRecord[component.label]
                            // }
                            if (this.state.selectedRecord[component.label] === "") {
                                inputData["Material"][component.label] = 4
                            } else if (this.state.selectedRecord[component.label] === undefined) {
                                inputData["Material"][component.label] = 4
                            }
                            else {
                                inputData["Material"][component.label] = this.state.selectedRecord[component.label]
                            }
                            if (this.state.selectedRecord[component.label] !== "") {
                                inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] === transactionStatus.YES ?
                                this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" })
                            }
                        }
                        else {
                            if (component.label !== undefined) {
                                inputData["Material"][component.label] = this.state.selectedRecord[component.label] !== undefined ?
                                    this.state.selectedRecord[component.label] ? this.state.selectedRecord[component.label] : "" : ""
                                // }
                                //    if (this.state.selectedRecord[component.label] !== undefined) {
                                inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label] !== undefined ?
                                    this.state.selectedRecord[component.label] ? this.state.selectedRecord[component.label] : "" : ""
                            }
                        }
                        component.hasOwnProperty("children") && component.children.map(
                            (componentrow) => {

                                if (componentrow.inputtype === 'combo') {
                                    let isValid = false;
                                    if (componentrow.label === 'Expiry Policy Period') {
                                        if (this.state.selectedRecord['Expiry Policy Days'] && this.state.selectedRecord['Expiry Policy Days'] > 0) {
                                            isValid = true;
                                        }
                                    }
                                    else if (componentrow.label === 'Open Expiry Period') {
                                        if (this.state.selectedRecord['Open Expiry'] && this.state.selectedRecord['Open Expiry'] > 0) {
                                            isValid = true;
                                        }
                                    }
                                    else if (componentrow.label === 'Next Validation Period') {
                                        if (this.state.selectedRecord['Next Validation'] && this.state.selectedRecord['Next Validation'] > 0) {
                                            isValid = true;
                                        }
                                    }
                                    else {
                                        isValid = true;
                                    }
                                    if (isValid) {
                                        inputData["Material"][componentrow.label] = this.state.selectedRecord[componentrow.label] ?
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
                                } else if (componentrow.inputtype === 'date') {
                                    if (this.state.selectedRecord[componentrow.label]) {
                                        inputData["Material"][`tz${componentrow.label}`] = componentrow.hasOwnProperty('timezone') ? {
                                            label: this.state.selectedRecord[`tz${componentrow.label}`]["label"],
                                            value: this.state.selectedRecord[`tz${componentrow.label}`]["value"]
                                        } : {
                                            label: this.props.Login.userInfo['stimezoneid'],
                                            value: this.props.Login.userInfo['ntimezonecode']
                                        }
                                        inputData["Material"][componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label],
                                            this.props.Login.userInfo)
                                        inputData["DateList"].push(componentrow.label)
                                    }
                                    inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] ?
                                        convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label], this.props.Login.userInfo)
                                        : ""

                                } else if (componentrow.inputtype === 'toggle') {
                                    if (this.state.selectedRecord[componentrow.label] === "") {
                                        inputData["Material"][componentrow.label] = 4
                                    } else if (this.state.selectedRecord[componentrow.label] === undefined) {
                                        inputData["Material"][componentrow.label] = 4
                                    }
                                    else {
                                        inputData["Material"][componentrow.label] = this.state.selectedRecord[componentrow.label]
                                    }
                                    if (this.state.selectedRecord[componentrow.label] !== "") {
                                        inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] === transactionStatus.YES ?
                                            'Yes' : 'No'
                                    }
                                }
                                else {
                                    //  if (this.state.selectedRecord[componentrow.label] !== undefined) {
                                    inputData["Material"][componentrow.label] = this.state.selectedRecord[componentrow.label] !== undefined ?
                                        this.state.selectedRecord[componentrow.label] ? this.state.selectedRecord[componentrow.label] : "" : ""
                                    // }
                                    // if (this.state.selectedRecord[componentrow.label] !== undefined) {
                                    inputData["jsonuidata"][componentrow.label] = this.state.selectedRecord[componentrow.label] !== undefined ?
                                        this.state.selectedRecord[componentrow.label] ? this.state.selectedRecord[componentrow.label] : "" : ""
                                    // }
                                }
                            }
                        )
                    })
                })
            })
            // inputData["Material"][varmain] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 1 ?
            //     this.state.selectedRecord['Standard Name'] :
            //     this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode === 2 ?
            //         this.state.selectedRecord['Volumetric Name'] :
            //         this.state.selectedRecord['Material Name']

            inputData["Material"]["Material Name"] = this.state.selectedRecord['Material Name'] && this.state.selectedRecord['Material Name']
            inputData["jsonuidata"] = {
                ...inputData["jsonuidata"],
                "nmaterialcatcode": this.state.selectedRecord['Material Category'].value,
                "nmaterialconfigcode": nmaterialconfigcode
            }
            inputData["Material"] = {
                ...inputData["Material"],
                "nmaterialcatcode": this.state.selectedRecord['Material Category'].value,
                "nmaterialtypecode": this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
            }

            inputData["materialJson"] = JSON.stringify(inputData["Material"])
            inputData["jsonuidata"] = JSON.stringify(inputData["jsonuidata"])
            inputData["ntransactionstatus"] = inputData["Material"]['Quarantine']
            inputData["nmaterialtypecode"] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
            inputData["nmaterialcatcode"] = this.state.selectedRecord['Material Category'].value

            inputData["needsectionwise"] = this.props.Login.selectedRecord['Material Category'].item ?
                this.props.Login.selectedRecord['Material Category'].item.jsondata.needsectionwise :
                this.props.Login.selectedRecord['Material Category'].needsectionwise
            if (this.props.Login.selectedRecord['Material Category'].item ?
                this.props.Login.selectedRecord['Material Category'].item.jsondata.needsectionwise :
                this.props.Login.selectedRecord['Material Category'].needsectionwise === transactionStatus.YES) {
                // inputData["materialSectionJson"] = [{
                //     "ssectionname": this.state.selectedRecord["Section"].label,
                //     "nsectioncode": this.state.selectedRecord["Section"].value,
                //     "nreorderlevel": this.state.selectedRecord["Reorder Level"] && this.state.selectedRecord["Reorder Level"]
                //     //,
                //     //"nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode
                // }];
                inputData["materialSectionJson"] = {
                    "nreorderlevel": this.state.selectedRecord["Reorder Level"] && this.state.selectedRecord["Reorder Level"],
                    "nsectioncode": this.state.selectedRecord["Section"] && this.state.selectedRecord["Section"].value,
                    'nmaterialconfigcode': nmaterialconfigcode
                }
                inputData["materialSectionJson"] = JSON.stringify(inputData["materialSectionJson"])
            }
            const masterData = this.props.Login.masterData;
            // console.log("data:", inputData);
            if (this.props.Login.operation === 'create') {

                inputParam = {
                    classUrl: "material",
                    methodUrl: "Material",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef,
                    dataState: this.state.dataState,
                    selectedRecord:{...this.state.selectedRecord}
                }
            }
            else {
                inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode
                inputParam = {
                    classUrl: "material",
                    methodUrl: "Material",
                    inputData: inputData,
                    operation: this.props.Login.operation,
                    saveType, formRef, postParam: {
                        selectedObject: "SelectedMaterial",
                        primaryKeyField: "nmaterialcode", inputListName: "Material",
                        selectedComboName: "selectedMaterialCat", selectedCombo: this.state.selectedRecord['Material Category'],
                        selectedComboId: "nmaterialcatcode"
                    }, selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef,
                    dataState: this.state.dataState,
                    filtercombochange: this.props.Login.masterData.searchedData !== undefined ?
                        this.state.selectedRecord['Material Category'].value ===
                            this.props.Login.masterData.SelectedMaterialCategoryFilter.nmaterialcatcode ? false : true : false,
                    selectedRecord:{...this.state.selectedRecord}
                }

                // if(this.state.selectedRecord['Material Category'].value!==this.props.Login.masterData.SelectedMaterialCategory.nmaterialcatcode){
                //     masterData={...masterData,searchedData}
                // }

            }

            // if (this.props.Login.screenName === "IDS_MATERIAL") {
            //     // if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            //     //     const updateInfo = {
            //     //         typeName: DEFAULT_RETURN,
            //     //         data: {
            //     //             loadEsign: true, screenData: { inputParam, masterData }, saveType
            //     //         }
            //     //     }
            //     //     this.props.updateStore(updateInfo);
            //     // }
            //     // else {
            //     //     this.props.crudMaster(inputParam, masterData, "openModal");
            //     // }
            // } else {
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
                // }
            }
        }
        else if (this.props.Login.screenname === "IDS_MATERIALSAFETYINSTRUCTIONS") {
            const Layout = this.props.Login.masterData.selectedTemplateSafetyInstructions[0].jsondata
            const dynamicobj = {};
            let jsonuidata = {}
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        //if (component.inputtype === 'combo') {
                        // if (this.state.selectedRecord[component.label]) {
                        //     dynamicobj[component.label] = {
                        //         label: this.state.selectedRecord[component.label]["label"],
                        //         value: this.state.selectedRecord[component.label]["value"]
                        //     }

                        // }
                        //     jsonuidata[component.label] =  this.state.selectedRecord[component.label] ?
                        //     component.label ? 'Yes' : 'No' :  'No' 
                        // }
                        // else {
                        if (component.inputtype === 'checkbox') {
                            //  if (this.state.selectedRecord[component.label]) {
                            dynamicobj[component.label] = this.state.selectedRecord[component.label]
                            jsonuidata[component.label] = this.state.selectedRecord[component.label] ?
                               // component.label ? 'Yes' : 'No' : 'No'
                                component.label ? this.props.intl.formatMessage({ id: "IDS_YES" }): 
                                this.props.intl.formatMessage({ id: "IDS_NO" }) : this.props.intl.formatMessage({ id: "IDS_NO" })
                              
                            //   }
                            // jsonuidata[component.label] =  this.state.selectedRecord[component.label] ?
                            // component.label ? 'Yes' : 'No' :  'No' 
                        }
                        else {
                            if (this.state.selectedRecord[component.label]) {
                                dynamicobj[component.label] = this.state.selectedRecord[component.label]
                                jsonuidata[component.label] = this.state.selectedRecord[component.label]
                            }
                        }
                        component.hasOwnProperty("children") && component.children.map(
                            (componentrow) => {
                                // if (componentrow.inputtype === 'combo') {
                                //     // if (this.state.selectedRecord[componentrow.label]) {
                                //     //     dynamicobj[componentrow.label] =
                                //     //     {
                                //     //         label: this.state.selectedRecord[componentrow.label]["label"],
                                //     //         value: this.state.selectedRecord[componentrow.label]["value"]
                                //     //     }

                                //     // }
                                //     jsonuidata[componentrow.label] =  this.state.selectedRecord[componentrow.label] ?
                                //         componentrow.label ? 'Yes' : 'No' :  'No' 
                                // }
                                // else {
                                //     if (this.state.selectedRecord[componentrow.label]) {
                                //         dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                //         jsonuidata[componentrow.label] =  this.state.selectedRecord[componentrow.label] ?
                                //          componentrow.label ? 'Yes' : 'No' :  'No' 
                                //     }
                                //     //jsonuidata[componentrow.label] =  this.state.selectedRecord[componentrow.label] ?
                                //     //componentrow.label ? 'Yes' : 'No' :  'No' 
                                // }
                                if (componentrow.inputtype === 'checkbox') {
                                    //  if (this.state.selectedRecord[componentrow.label]) {
                                    dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                    jsonuidata[componentrow.label] = this.state.selectedRecord[componentrow.label] ?
                                        componentrow.label ? 'Yes' : 'No' : 'No'
                                    //  }
                                    // jsonuidata[component.label] =  this.state.selectedRecord[component.label] ?
                                    // component.label ? 'Yes' : 'No' :  'No' 
                                }
                                else {
                                    if (this.state.selectedRecord[componentrow.label]) {
                                        dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                        jsonuidata[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                    }
                                }
                            }
                        )
                    })
                })
            })
            inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode
            if (this.props.Login.masterData.MaterialSafetyInstructions.length > 0) {
                inputData["nmaterialsafetyinstructionscode"] =
                    this.props.Login.masterData.MaterialSafetyInstructions[0].nmaterialsafetyinstructionscode
            }
            else {
                inputData["nmaterialsafetyinstructionscode"] = 0
            }
            inputData["jsonuidata"] = JSON.stringify(jsonuidata)
            inputData["materialSafetyInstructions"] = JSON.stringify(dynamicobj)
            inputData["nflag"] = 1;
            inputData['nmaterialconfigcode'] = nmaterialconfigcode
            inputParam = {
                classUrl: "material",
                methodUrl: "MaterialSafetyInstructions",
                inputData: inputData,
                operation: 'create',
                saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                searchRef: this.searchRef,
                dataState: this.state.dataState,
                selectedRecord:{...this.state.selectedRecord}
            }
            let masterData = this.props.Login.masterData
            if (this.state.isSelectedRecordChange) {
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
            else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        openModal: false
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }
        else if (this.props.Login.screenname === "IDS_MATERIALMSDSATTACHMENT") {
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
        else if (this.props.Login.screenname === "IDS_MATERIALPROPERTY") {

            let masterData = this.props.Login.masterData
            const Layout = this.props.Login.masterData.selectedTemplateProperties[0].jsondata
            const dynamicobj = {};
            inputData["DateList"] = [];
            inputData["jsonuidata"] = {};
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        if (component.inputtype === 'combo') {
                            if (this.state.selectedRecord[component.label]) {
                                dynamicobj[component.label] = {
                                    label: this.state.selectedRecord[component.label]["label"],
                                    value: this.state.selectedRecord[component.label]["value"]
                                }
                                inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label]["label"]
                            }
                        }
                        else if (component.inputtype === 'date') {

                            if (this.state.selectedRecord[component.label]) {
                                dynamicobj[`tz${component.label}`] = this.props.Login.userInfo.isutcenabled === transactionStatus.YES && this.props.Login.userInfo.istimezoneshow === transactionStatus.YES ? {
                               // component.hasOwnProperty('timezone') ? {
                                    label: this.state.selectedRecord[`tz${component.label}`]["label"],
                                    value: this.state.selectedRecord[`tz${component.label}`]["value"]
                                } : {
                                    label: this.props.Login.userInfo['stimezoneid'],
                                    value: this.props.Login.userInfo['ntimezonecode']
                                }
                                dynamicobj[component.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[component.label], this.props.Login.userInfo)
                                inputData["DateList"].push(component.label)
                                inputData["jsonuidata"][`tz${component.label}`] = dynamicobj[`tz${component.label}`].label
                                inputData["jsonuidata"][component.label] = dynamicobj[component.label]
                            }

                        }
                        else {
                            if (this.state.selectedRecord.hasOwnProperty(component.label)) {
                                dynamicobj[component.label] = this.state.selectedRecord[component.label]
                                inputData["jsonuidata"][component.label] = dynamicobj[component.label]
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
                                        inputData["jsonuidata"][component.label] = dynamicobj[component.label].label
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
                                        dynamicobj[componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label],
                                            this.props.Login.userInfo)
                                        inputData["DateList"].push(componentrow.label)
                                        inputData["jsonuidata"][`tz${componentrow.label}`] = dynamicobj[`tz${componentrow.label}`].label
                                        inputData["jsonuidata"][componentrow.label] = dynamicobj[componentrow.label]
                                    }

                                }
                                else {
                                    if (this.state.selectedRecord[componentrow.label]) {
                                        dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                        inputData["jsonuidata"][componentrow.label] = dynamicobj[componentrow.label]
                                    }
                                }
                            }
                        )
                    })
                })
            })
            /* ALPD-925 Begin */
            inputData["nmaterialtypecode"] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode;
            /* ALPD-925 End */
            inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode
            if (this.props.Login.masterData.MaterialProperties.length > 0) {
                inputData["nmaterialpropertycode"] =
                    this.props.Login.masterData.MaterialProperties[0].nmaterialpropertycode
            } else {
                inputData["nmaterialpropertycode"] = 0
            }
            //inputData["DateList"] = JSON.stringify(DateList) 
            inputData["jsonuidata"] = { ...inputData["jsonuidata"], 'nmaterialconfigcode': nmaterialconfigcode }
            inputData["jsonuidata"] = JSON.stringify(inputData["jsonuidata"])

            inputData["materialProperty"] = JSON.stringify(dynamicobj)
            inputData["nflag"] = 2;
            inputParam = {
                classUrl: "material",
                methodUrl: "MaterialSafetyInstructions",
                inputData: inputData,
                operation: 'create',
                saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                searchRef: this.searchRef,
                dataState: this.state.dataState,
                selectedRecord:{...this.state.selectedRecord}
            }
            if (this.state.isSelectedRecordChange) {
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
            else {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        openModal: false
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }

        else if (this.props.Login.screenname === "IDS_MATERIALACCOUNTING") {
            
            if(this.state.selectedRecord.SampleName.label!==undefined){

            //let validateQty=((this.state.selectedRecord.quantity*this.state.selectedRecord.AvailableQty)/1000)
            let nuraniumqtyissued =this.props.Login.masterData.samplestate==="Liquid"?(this.state.selectedRecord.quantity*this.state.selectedRecord.suraniumconversionfactor)/1000:(this.state.selectedRecord.quantity*this.state.selectedRecord.suraniumconversionfactor)/100;
            if((this.state.selectedRecord.AvailableUraniumQty>=(nuraniumqtyissued)) || (this.state.selectedRecord.materialinventorytype.value===1)){
            let masterData = this.props.Login.masterData
            const Layout = this.props.Login.masterData.selectedTemplateSafetyInstructions[0].jsondata
            const dynamicobj = {};
            inputData["DateList"] = [];
            inputData["jsonuidata"] = {};
            Layout.map((row) => {
                row.children.map((column) => {
                    column.children.map((component) => {
                        if (component.inputtype === 'combo') {
                            if (this.state.selectedRecord[component.label]) {
                                dynamicobj[component.label] = {
                                    label: this.state.selectedRecord[component.label]["label"],
                                    value: this.state.selectedRecord[component.label]["value"]
                                }
                                inputData["jsonuidata"][component.label] = this.state.selectedRecord[component.label]["label"]
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
                                inputData["DateList"].push(component.label)
                                inputData["jsonuidata"][`tz${component.label}`] = dynamicobj[`tz${component.label}`].label
                                inputData["jsonuidata"][component.label] = dynamicobj[component.label]
                            }

                        }
                        else {
                            if (this.state.selectedRecord.hasOwnProperty(component.label)) {
                                dynamicobj[component.label] = this.state.selectedRecord[component.label]
                                inputData["jsonuidata"][component.label] = dynamicobj[component.label]
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
                                        inputData["jsonuidata"][component.label] = dynamicobj[component.label].label
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
                                        dynamicobj[componentrow.label] = convertDateTimetoStringDBFormat(this.state.selectedRecord[componentrow.label],
                                            this.props.Login.userInfo)
                                        inputData["DateList"].push(componentrow.label)
                                        inputData["jsonuidata"][`tz${componentrow.label}`] = dynamicobj[`tz${componentrow.label}`].label
                                        inputData["jsonuidata"][componentrow.label] = dynamicobj[componentrow.label]
                                    }

                                }
                                else {
                                    if (this.state.selectedRecord[componentrow.label]) {
                                        dynamicobj[componentrow.label] = this.state.selectedRecord[componentrow.label]
                                        inputData["jsonuidata"][componentrow.label] = dynamicobj[componentrow.label]
                                    }
                                }
                            }
                        )
                    })
                })
            })
            /* ALPD-925 Begin */
            inputData["nmaterialtypecode"] = this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode;
            /* ALPD-925 End */
            inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode;
            inputData["issueaction"] =this.props.Login.masterData.samplestate;
            inputData["inventorytype"] =this.state.selectedRecord.materialinventorytype.value;
            inputData["quantity"] =this.state.selectedRecord.quantity; 
            inputData["suraniumconversionfactor"] =this.state.selectedRecord.suraniumconversionfactor;
            inputData["nuraniumqtyissued"] =nuraniumqtyissued;
            inputData["fromDate"] = this.props.Login.masterData.fromDate;
            inputData["SampleName"] =this.state.selectedRecord.SampleName.label;
        inputData["toDate"] = this.props.Login.masterData.toDate;
            inputData["jsonuidata"] = { ...inputData["jsonuidata"], 'nmaterialconfigcode': nmaterialconfigcode
            , 'nmaterialcode':this.props.Login.masterData.SelectedMaterial.nmaterialcode,                                       
                'Material Name':this.props.Login.masterData.SelectedMaterial['Material Name']
            ,'smaterialcatname':this.props.Login.masterData.SelectedMaterialCategory.smaterialcatname,
           'nmaterialcatcode':this.props.Login.masterData.SelectedMaterialCategory.nmaterialcatcode,
         'smaterialtypename' :this.props.Login.masterData.SelectedMaterialType[0].smaterialtypename,
           'nmaterialtypecode':this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
           ,'Comments':this.state.selectedRecord.Comments   
           ,'ssamplename':this.props.Login.masterData.SelectedMaterial['Material Name']                    
           ,'quantity':this.state.selectedRecord.quantity
           ,'sinventorytypename':this.state.selectedRecord.materialinventorytype.label
           ,'AvailableQty':this.state.selectedRecord.AvailableQty,
           'SampleName':this.state.selectedRecord.SampleName.label
           
           }
            inputData["jsonuidata"] = JSON.stringify(inputData["jsonuidata"])

            inputData["materialProperty"] = JSON.stringify(dynamicobj)
            inputData["nflag"] = 2;
            inputParam = {
                classUrl: "material",
                methodUrl: "MaterialInventory",
                inputData: inputData,
                operation: 'create',
                saveType, formRef, postParam, selectedRecord: this.state.selectedRecord,
                searchRef: this.searchRef,
                dataState: this.state.dataState,
                selectedRecord:{...this.state.selectedRecord}
            }
            //if (this.state.isSelectedRecordChange) {
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
            //}
            // else {
            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: {
            //             openModal: false
            //         }
            //     }
            //     this.props.updateStore(updateInfo);
            // }
        }
        else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_NOQUANTTYTOISSUED" }));
        }

    }
        else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERSAMPLENAME" }));
        }


    }

        else {
            if (this.props.Login.operation !== "update") {
                let showMaterialSection = this.props.Login.showMaterialSection
                let newarr = []
                let newarr1 = []
                let postParam = undefined;
                inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode
                if (this.state.selectedRecord["nmaterialsectioncode"].length > 1) {
                    newarr = this.state.selectedRecord.nmaterialsectioncode.map(temp => {
                        return {
                            "ssectionname": temp.label,
                            "nsectioncode": temp.value,
                            "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                            "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                            'nmaterialconfigcode': nmaterialconfigcode
                        }
                    })
                    newarr1["nsectioncode"] = ""
                    // let nsectioncode;
                    this.state.selectedRecord.nmaterialsectioncode.map(temp => {
                        newarr1["nsectioncode"] += temp.value + ','
                    })
                    newarr1 = {
                        "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                        "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                        "nsectioncode": newarr1["nsectioncode"].substring(0, newarr1["nsectioncode"].length - 1),
                        'nmaterialconfigcode': nmaterialconfigcode
                    }
                }
                else {
                    newarr.push({
                        "ssectionname": this.state.selectedRecord["nmaterialsectioncode"][0].label,
                        "nsectioncode": this.state.selectedRecord["nmaterialsectioncode"][0].value,
                        "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                        "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                        'nmaterialconfigcode': nmaterialconfigcode
                    });
                    newarr1 = {
                        "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                        "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                        "nsectioncode": this.state.selectedRecord["nmaterialsectioncode"][0].value,
                        'nmaterialconfigcode': nmaterialconfigcode
                    }
                }
                inputData["materialSectionJson"] = JSON.stringify(newarr)
                inputData["materialSectionJson"] = JSON.stringify(newarr1)
                inputData["nmaterialconfigcode"] = nmaterialconfigcode

                inputParam = {
                    classUrl: "material",
                    methodUrl: "MaterialSection",
                    inputData: inputData,
                    operation: "create",
                    showMaterialSection: showMaterialSection,
                    selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef, postParam: postParam, isChild: true,
                    selectedRecord:{...this.state.selectedRecord}
                }
            }
            else {
                let newarrobj = []
                let postParam = {
                    inputListName: "MaterialSection",
                    selectedObject: "SelectedMaterialSection",
                    primaryKeyField: "nmaterialsectioncode",
                }
                inputData["nmaterialcode"] = this.props.Login.masterData.SelectedMaterial.nmaterialcode
                if (Array.isArray(this.state.selectedRecord["nmaterialsectioncode"])) {
                    newarrobj.push({
                        "ssectionname": this.state.selectedRecord["nmaterialsectioncode"][0].label,
                        "nsectioncode": this.state.selectedRecord["nmaterialsectioncode"][0].value,
                        "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                        "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                        'nmaterialconfigcode': nmaterialconfigcode
                    });
                }
                else {
                    newarrobj.push({
                        "ssectionname": this.state.selectedRecord["nmaterialsectioncode"].label,
                        "nsectioncode": this.state.selectedRecord["nmaterialsectioncode"].value,
                        "nreorderlevel": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0,
                        "nmaterialcode": this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                        'nmaterialconfigcode': nmaterialconfigcode
                    });
                }
                inputData["materialSectionJson"] = JSON.stringify(newarrobj)
                inputData["MaterialSection"] = {
                    "Reorder Level": this.state.selectedRecord["nreorderlevel"] ? this.state.selectedRecord["nreorderlevel"] : 0

                }
                inputData["nmaterialsectioncode"] = this.state.selectedRecord.nmaterialsectioncodeprimaryKeyValue
                inputData["nmaterialconfigcode"] = nmaterialconfigcode
                inputParam = {
                    classUrl: "material",
                    methodUrl: "MaterialSection",
                    inputData: inputData,
                    showMaterialSection: false,
                    operation: "update",
                    selectedRecord: this.state.selectedRecord,
                    searchRef: this.searchRef, postParam: postParam, isChild: true,
                    selectedRecord:{...this.state.selectedRecord}
                }
            }
            const masterData = this.props.Login.masterData;
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
    // onNumericInputChange = (value, name) => {
    //     // const re = /^[0-9\b]+$/;
    //     // let selectedRecord = this.state.selectedRecord
    //     // if (re.test(value)) {
    //     //     selectedRecord[name] = value;
    //     //     this.setState({selectedRecord})
    //     //  }
    //     let selectedRecord = this.state.selectedRecord
    //     selectedRecord[name] = value;
    //     this.setState({ selectedRecord });
    // }
    // handleDateChange = (dateValue, dateName) => {
    //     const { selectedRecord } = this.state;
    //     selectedRecord[dateName] = dateValue;
    //     this.setState({ selectedRecord });
    // }
    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        // let value = event.target.value;

        // if (isNaN(value)) {
        // if (parseInt(value) < 10) {
        //  let x=value.toString().replace(/\D/g,'')
        // if (value === 0) {
        //     delete selectedRecord[name]
        //     selectedRecord[name]=''
        // }
        // else {
        if (name === "Open Expiry" || name === "Next Validation") {
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

        //   }

        // }
        // }

    }
    // onNumericInputChange = (value, name) => {
    //     console.log("value:", value, name);
    //     const selectedRecord = this.state.selectedRecord || {};
    //     if (name === "nroundingdigits") {

    //         if (/^-?\d*?$/.test(value.target.value) || value.target.value === "") {
    //             console.log("val:", value.target.value);
    //             selectedRecord[name] = value.target.value;
    //         }
    //     }
    //     else {
    //         selectedRecord[name] = value;
    //     }

    //     this.setState({ selectedRecord });
    // }
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
        const fieldArray = [];
        let postParam = {
            inputListName: "Material", selectedObject: "SelectedMaterial",
            primaryKeyField: "nmaterialcode",
            primaryKeyValue: this.props.Login.masterData.SelectedMaterial && this.props.Login.masterData.SelectedMaterial.nmaterialcode,
            fetchUrl: "material/getMaterialByID",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        modalName = 'openModal'
        const inputParam = {
            methodUrl: "Material",
            classUrl: "material",
            inputData: {
                "nmaterialconfigcode": this.props.Login.masterData.selectedTemplate[0].nmaterialconfigcode,
                "material": this.props.Login.masterData.SelectedMaterial,
                "nmaterialcatcode": this.props.Login.masterData.SelectedMaterialCategory.nmaterialcatcode,
                "userinfo": this.props.Login.userInfo,
                "nmaterialcode": this.props.Login.masterData.SelectedMaterial && this.props.Login.masterData.SelectedMaterial.nmaterialcode,
                "nmaterialtypecode": this.props.Login.masterData.SelectedMaterialType[0].nmaterialtypecode
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
    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        let inputData = [];
        inputData["nmaterialtypecode"] = this.state.selectedcombo["nmaterialtypecode"];
        inputData["materialCatList"] = this.state.materialCatList;
        inputData["fromDate"] = this.props.Login.masterData.fromDate;
        inputData["toDate"] = this.props.Login.masterData.toDate;
        this.setState({ sectionDataState: { skip: 0, take: 10 } })
        if (this.state.selectedcombo["nmaterialtypecode"]) {
            this.props.getMaterialReload(this.props.Login.masterData.SelectedMaterialTypeFilter, this.props.Login.masterData.SelectedMaterialCategoryFilter,
                this.props.Login.masterData, this.props.Login.userInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
        }
    }
}
export default connect(mapStateToProps, {
    callService, updateStore, initialcombochangeget, getAddMaterialPopup, viewAttachment, getMaterialReload,
    crudMaster, getMaterialDetails, getMaterialEdit, getMaterialByTypeCode, addMaterialFile
    , getAddMaterialSectionPopup, getMaterialSectionEdit, filterColumnData, validateEsignCredential, addSafetyInstructions, addMaterialProperty,addMaterialAccountingProperty,getAddMaterialAccountingPopup,getReportDetails,generateControlBasedReport
})(injectIntl(Material));

