import React from "react";
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from "react-intl";
import { getControlMap, constructOptionList, showEsign, validateEmail, validatePhoneNumber } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import SlideOutModal from "../../../components/slide-out-modal/SlideOutModal";
import { callService, crudMaster, validateEsignCredential, updateStore, getSubmitterDetail, getSubmitterCombo,
     getInstitution, getInstitutionSite, changeInstitutionCategoryFilterSubmit, filterColumnData, updateSubmitter,
     getInstitutionCategory,getSubmitterInstitution,getSubmitterSite
     } from "../../../actions";
import { Row, Col, Card, FormGroup, FormLabel, Nav } from "react-bootstrap";
import ListMaster from "../../../components/list-master/list-master.component";
import SubmitterCategoryFilter from "./SubmitterCategoryFilter";
import { ReadOnlyText } from '../../../components/App.styles';
import { ContentPanel } from '../../product/product.styled';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt, faUserTimes } from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_RETURN } from "../../../actions/LoginTypes";
import AddSubmitter from "./AddSubmitter";

import Esign from "../../audittrail/Esign";
import SubmitterTab from "./SubmitterTab";
import { transactionStatus } from "../../../components/Enumeration";
import { toast } from "react-toastify";
import CustomTab from '../../../components/custom-tabs/custom-tabs.component';
//import SubmitterTab from "./SubmitterTab";
import AddInstitutionCategory from "./AddInstitutionCategory";
//component commented by L.Subashini 13/12/2025 while upgrading to React 17 
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
import { Tooltip } from 'react-tooltip';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Submitter extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchRef = React.createRef();
        this.searchFieldList = ["sinstitutioncatname", "sinstitutionname", "sinstitutionsitename", "sfirstname", "slastname", "ssubmitterid", "sshortname", "swardname", "stelephone", "smobileno",
            "sfaxno", "semail", "sspecialization", "sreportrequirement", "ssampletransport", "stransdisplaystatus"];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            sidebarview: false
        }
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }
    render() {
        let mandatoryFields = [];
        if (this.props.Login.screenName === "IDS_SUBMITTER") {
            mandatoryFields.push(
                {
                    mandatory: true,
                    idsName: "IDS_FIRSTNAME",
                    dataField: "sfirstname",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_LASTNAME",
                    dataField: "slastname",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_SHORTNAME",
                    dataField: "sshortname",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTIONDEPARTMENT",
                    dataField: "ninstitutiondeptcode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_MOBILENO",
                    dataField: "smobileno",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_EMAIL",
                    dataField: "semail",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
            );
        }
        else{

            mandatoryFields.push(
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTIONCATEGORY",
                    dataField: "sinstitutioncatname",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTION",
                    dataField: "sinstitutionname",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                // {
                //     mandatory: true,
                //     idsName: "IDS_INSTITUTIONSITE",
                //     dataField: "sinstitutionsitename",
                //     mandatoryLabel: "IDS_SELECT",
                //     controlType: "selectbox",
                // }
                );

        }

        this.fieldSubmitterList = ["ninstitutioncatcode", "ninstitutioncode", "ninstitutionsitecode", "ninstitutiondeptcode",
            "sfirstname", "slastname", "sshortname", "swardname", "stelephone", "smobileno", "sfaxno", "semail", "sspecialization", "sreportrequirement", "ssampletransport", "ntransactionstatus"];


        let submitterStatusCSS = "outline-secondary";
        let activeIconCSS = "fa fa-check"
        if (this.props.Login.masterData.selectedSubmitter && this.props.Login.masterData.selectedSubmitter.ntransactionstatus === transactionStatus.ACTIVE) {
            submitterStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedSubmitter && this.props.Login.masterData.selectedSubmitter.ntransactionstatus === transactionStatus.RETIRED) {
            submitterStatusCSS = "outline-danger";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.selectedSubmitter && this.props.Login.masterData.selectedSubmitter.ntransactionstatus === transactionStatus.DEACTIVE) {
            activeIconCSS = "";
        }

        const addId = this.state.controlMap.has("AddSubmitter") && this.state.controlMap.get("AddSubmitter").ncontrolcode;
        const editId = this.state.controlMap.has("EditSubmitter") && this.state.controlMap.get("EditSubmitter").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSubmitter") && this.state.controlMap.get("DeleteSubmitter").ncontrolcode;
        const retireId = this.state.controlMap.has("RetireSubmitter") && this.state.controlMap.get("RetireSubmitter").ncontrolcode;
        const addSubmitterMapping = this.state.controlMap.has("AddSubmitterMapping") && this.state.controlMap.get("AddSubmitterMapping").ncontrolcode;


        const filterParam = {
            inputListName: "Submitter", selectedObject: "selectedSubmitter", primaryKeyField: "ssubmittercode",
            fetchUrl: "submitter/getSelectedSubmitterDetail", fecthInputObject: { userinfo: this.props.Login.userInfo, submitter: this.props.Login.masterData.selectedSubmitter },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList


        };

        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {/* {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    } */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"Submitter"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Submitter}
                                getMasterDetail={(Submitter) => this.props.getSubmitterDetail(Submitter, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedSubmitter}
                                primaryKeyField="ssubmittercode"
                                mainField="ssubmittername"
                                firstField="ssubmitterid"
                                secondField="stransdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() =>
                                    this.props.getSubmitterCombo(
                                        "IDS_SUBMITTER",
                                        "create",
                                        "ssubmittercode",
                                        // this.state.selectedRecord,
                                        this.props.Login.masterData,
                                        this.props.Login.userInfo,
                                        addId
                                    )
                                }
                                //openFilter={this.openFilter}
                                //closeFilter={this.closeFilter}
                                //onFilterSubmit={this.onFilterSubmit}
                               // showFilterIcon={true}
                               // showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_SUBMITTERCATEGORYFILTER":
                                            <SubmitterCategoryFilter
                                                FilterInstitutionCategory={this.state.FilterInstitutionCategory || []}
                                                nfilterInstitutionCategory={this.props.Login.masterData.defaultInstitutionCategory || {}}
                                                FilterInstitution={this.state.FilterInstitution || []}
                                                nfilterInstitution={this.props.Login.masterData.defaultInstitution || {}}
                                                FilterInstitutionSite={this.state.FilterInstitutionSite || []}
                                                nfilterInstitutionSite={this.props.Login.masterData.defaultInstitutionSite || {}}
                                                selectedRecord={this.state.selectedRecord || {}}
                                                onFilterComboChange={this.onComboChangeFilter}
                                            />
                                    }
                                ]}
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
                                        <Card className="border-0">
                                            {this.props.Login.masterData.selectedSubmitter ? (
                                                <>
                                                    <Card.Header>
                                                      
                                                           {/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
                                                            {/*  <ReactTooltip  place="bottom"
                                                                                globalEventOff="click"
                                                                                id="tooltip_list_wrap" />*/}
                                                                        
                                                            {/* Tooltip component changed by L.Subashini 13/12/2025 while upgrading to React 17 */}
                                                            <Tooltip   place="bottom"
                                                                        globalEventOff="click"
                                                                        id="tooltip_list_wrap" />

                                                        <Card.Title className="product-title-main">
                                                            {this.props.Login.masterData.selectedSubmitter.ssubmittername}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category">
                                                                <h2 className="product-title-sub flex-grow-1">
                                                                    <span className={`btn btn-outlined ${submitterStatusCSS} btn-sm ml-3`}>
                                                                        {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                                        {this.props.Login.masterData.selectedSubmitter.stransdisplaystatus}

                                                                    </span>
                                                                </h2>
                                                                <div className="d-inline">
                                                                    <Nav.Link
                                                                        name="editInstitution"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT", })}
                                                                        data-for="tooltip_list_wrap" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2"
                                                                        onClick={(e) => this.props.getSubmitterCombo("IDS_SUBMITTER", "update", "ssubmittercode", this.props.Login.masterData, this.props.Login.userInfo, editId)}

                                                                    >
                                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                                    </Nav.Link>
                                                                    <Nav.Link
                                                                        name="deleteInstitution"
                                                                        className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE", })}
                                                                        data-for="tooltip_list_wrap" hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        onClick={() => this.ConfirmDelete(deleteId)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </Nav.Link>
                                                                    <Nav.Link
                                                                        name="retireSubmitter" className="btn btn-circle outline-grey mr-2"
                                                                        hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                                        data-for="tooltip_list_wrap"
                                                                        onClick={() => this.retireSubmitter("Submitter", this.props.Login.masterData.selectedSubmitter, "retire", retireId)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faUserTimes} />
                                                                    </Nav.Link>

                                                                </div>
                                                            </div>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage id="IDS_SUBMITTER" messasge="Submitter"/>
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.selectedSubmitter.ssubmittername}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_SHORTNAME" messasge="Short Name" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.sshortname}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_WARDNAME" messasge="Ward Name" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.swardname}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_TELEPHONE" messasge="Telephone" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.stelephone}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_MOBILENO" messasge="Mobile No" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.smobileno}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_FAX" messasge="Fax No" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.sfaxno}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_EMAIL" messasge="Email" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.semail}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_SPECIALIZATION" messasge="Specialization" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.sspecialization}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_REPORTINGREQUIREMENT" messasge="Report Requriement" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.sreportrequirement}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_SAMPLETRANSPORT" messasge="Sample Transport" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.ssampletransport}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_DISPLAYSTATUS" messasge="Display Status" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedSubmitter.stransdisplaystatus}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        {this.props.Login.masterData && <CustomTab activeKey={ 'IDS_SITE'} tabDetail={this.tabDetail()}   destroyInactiveTabPane={true}  onTabChange={this.onTabChange} /> }

                                                    </Card.Body>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </Card>
                                    </ContentPanel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openModal && (
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        showSaveContinue={this.props.Login.screenName === "IDS_SUBMITTER"?true:false}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        mandatoryFields={mandatoryFields}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={
                            this.props.Login.loadEsign ?
                             (
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                            ) 
                            :

                             this.props.Login.screenName === "IDS_SUBMITTER" ?
                              (
                                <AddSubmitter
                                    onNumericInputOnChange={this.onNumericInputOnChange}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    InstitutionDepartment={this.props.Login.InstitutionDepartment}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.inputParam}
                                    userInfo={this.props.Login.userInfo}

                                />
                            ) 
                            : 

                            this.props.Login.screenName === "IDS_SITE" ?
                              (
                                <AddInstitutionCategory
                                    onNumericInputOnChange={this.onNumericInputOnChange}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    selectedSupplierCategory={this.state.selectedSupplierCategory || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onTabComboChange={this.onTabComboChange}
                                    institutionCategory={this.props.Login.institutionCategory}
                                    institution={this.props.Login.FilterInstitution}
                                    institutionSite={this.props.Login.FilterInstitutionSite}
                                    selectedInstitutionSite={this.props.Login.selectedInstitutionSite}
                                    InstitutionDepartment={this.props.Login.InstitutionDepartment}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    

                                />
                            ) :("")
                            
                            (
                                ""
                            )
                        }
                    />
                )}
            </>
        )
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        breadCrumbData.push(
            {
                "label": "IDS_INSTITUTIONCATEGORY",
                "value": this.props.Login.masterData.selectedInstitutionCategory ? this.props.Login.masterData.selectedInstitutionCategory.sinstitutioncatname : "-"
            },
            {
                "label": "IDS_INSTITUTION",
                "value": this.props.Login.masterData.selectedInstitution ? this.props.Login.masterData.selectedInstitution.sinstitutionname : "-"

            },
            {
                "label": "IDS_INSTITUTIONSITE",
                "value": this.props.Login.masterData.selectedInstitutionSite ? this.props.Login.masterData.selectedInstitutionSite.sinstitutionsitename : "-"

            }
        );

        return breadCrumbData;
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


    deleteSite = (productparam) => {
       
        let inputParam = {};
        
            inputParam = {
                classUrl: "submitter",
                methodUrl: productparam.methodUrl,
                inputData: {
                    [productparam.methodUrl.toLowerCase()]: productparam.selectedRecord,
                    "userinfo": this.props.Login.userInfo,

                },
                operation: productparam.operation,
                dataState: this.state.dataState,
                selectedRecord: {...this.state.selectedRecord}
            }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, productparam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) , operation: productparam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
   
}

ConfirmDelete = (operation, deleteId) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.deleteSite(
          operation,
          deleteId,
          operation.screenName ? operation.screenName : "IDS_INSTRUMENT"
        )
    );
  };

    tabDetail = () => {
        const tabMap = new Map();
        {
            tabMap.set("IDS_SITE",
            <SubmitterTab 
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        dataState={this.props.Login.dataState}
        masterData={this.props.Login|| []}
        SubmitterMapping={this.props.Login.masterData.SubmitterMapping||[]}
        selectedInstrument={this.props.Login.masterData.selectedRecord||[]}
        selectedSubmitter={this.props.Login.masterData.selectedSubmitter||[]}
        userInfo={this.props.Login.userInfo}
        inputParam={this.props.Login.inputParam}
        deleteRecord={this.deleteSite}
        addSubmitterMapping={this.addSubmitterMapping}
        getInstitutionCategory={this.props.getInstitutionCategory}
        InstrumentSection={this.props.Login.masterData.Institution || []}
        screenName="IDS_SITE"
        selectedRecord={this.state.selectedRecord||[]}
        settings={this.props.Login.settings}
            />
            );
        }
        return tabMap;
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

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let screenName = this.props.Login.screenName;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else if (this.props.Login.operation === "update") {
                loadEsign = false;
                openModal = true;
                screenName = "IDS_SUBMITTER";
                selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
            } else {
                loadEsign = false;
                openModal = false;
                selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, screenName },
        };
        this.props.updateStore(updateInfo);
    };


    updateSubmitter(inputParam, masterData, ncontrolcode) {
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    openModal: true,
                    //screenName: "completeaction",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.updateSubmitter(inputParam, this.props.Login.masterData);
        }
    }

    onSaveClick = (saveType, formRef) => {
        if(this.props.Login.screenName === "IDS_SITE")
        {   const selectedRecord = this.state.selectedRecord;
            let inputData = [];
            inputData["submittermapping"] = {};
            inputData["userinfo"] = this.props.Login.userInfo;
            let suppliermatrixArray = []

            suppliermatrixArray=this.state.selectedSupplierCategory.map(item => {
                let suppliermat = {}
            suppliermat["ninstitutionsitecode"]=item.value;
            suppliermat["ninstitutioncatcode"]=selectedRecord["ninstitutioncatcode"].value ;
            suppliermat["ninstitutioncode"]=selectedRecord["ninstitutioncode"].value ;
            suppliermat["ssubmittercode"]=this.props.Login.masterData.selectedSubmitter.ssubmittercode;
            return suppliermat
            });

            
            inputData['submittermapping'] = suppliermatrixArray;

            //inputData["submittermapping"]["selectedSubmitterSite"]=this.state.selectedSupplierCategory;
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "SubmitterMapping",
                displayName: this.props.Login.screenName,
                inputData: inputData,
                selectedId: this.state.selectedRecord["ssubmittercode"],
                operation: this.props.Login.operation, saveType, formRef,
                searchRef: this.searchRef,
                //postParam: postParam
            }

            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }

        else{
        const isValidateEmail = this.state.selectedRecord["semail"] ? validateEmail(this.state.selectedRecord["semail"]) : true;
        let postParam = undefined;
        if (isValidateEmail) {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let dataState = undefined;
            if (this.props.Login.screenName === "IDS_SUBMITTER") {
                if (this.props.Login.operation === "update") {  // edit
                    const selectedRecord = this.state.selectedRecord;
                    postParam = {
                        inputListName: "Submitter",
                        selectedObject: "selectedSubmitter",
                        primaryKeyField: "ssubmittercode",
                    };
                    inputData["submitter"] = {};

                    this.fieldSubmitterList.map(item => {
                        return inputData["submitter"][item] = selectedRecord[item] !== null ? selectedRecord[item] : "";
                    })
                    inputData["submitter"]["ssubmittercode"] = selectedRecord["ssubmittercode"] ? selectedRecord["ssubmittercode"] : "";
                    inputData["submitter"]["ninstitutioncatcode"] = this.props.Login.masterData.selectedInstitutionCategory ? this.props.Login.masterData.selectedInstitutionCategory.ninstitutioncatcode : -1;
                    inputData["submitter"]["ninstitutioncode"] = this.props.Login.masterData.selectedInstitution ? this.props.Login.masterData.selectedInstitution.ninstitutioncode : -1;
                    inputData["submitter"]["ninstitutionsitecode"] = this.props.Login.masterData.selectedInstitutionSite ? this.props.Login.masterData.selectedInstitutionSite.ninstitutionsitecode : -1;
                    inputData["submitter"]["ninstitutiondeptcode"] = this.state.selectedRecord["ninstitutiondeptcode"] ? this.state.selectedRecord["ninstitutiondeptcode"].value : -1;
                    inputData["submitter"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.ACTIVE;
                    inputData["submitter"]["ssubmitterid"] = this.state.selectedRecord["ssubmitterid"] ? this.state.selectedRecord["ssubmitterid"] : "";
                    dataState = this.state.dataState;



                    const inputParam = {
                        classUrl: this.props.Login.inputParam.classUrl,
                        methodUrl: "Submitter",
                        displayName: this.props.Login.screenName,
                        inputData: inputData,
                        selectedId: this.state.selectedRecord["ssubmittercode"],
                        operation: this.props.Login.operation, saveType, formRef, dataState,
                        searchRef: this.searchRef,
                        postParam: postParam
                    }


                    this.updateSubmitter(inputParam, this.props.Login.masterData, this.props.Login.ncontrolCode);
                    return;
                } else {
                    //add               
                    inputData["submitter"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


                    this.fieldSubmitterList.map(item => {
                        return inputData["submitter"][item] = this.state.selectedRecord[item] !== undefined ? this.state.selectedRecord[item] : "";
                    })
                    inputData["submitter"]["ninstitutioncatcode"] = this.props.Login.masterData.selectedInstitutionCategory ? this.props.Login.masterData.selectedInstitutionCategory.ninstitutioncatcode : -1;
                    inputData["submitter"]["ninstitutioncode"] = this.props.Login.masterData.selectedInstitution ? this.props.Login.masterData.selectedInstitution.ninstitutioncode : -1;
                    inputData["submitter"]["ninstitutionsitecode"] = this.props.Login.masterData.selectedInstitutionSite ? this.props.Login.masterData.selectedInstitutionSite.ninstitutionsitecode : -1;
                    inputData["submitter"]["ninstitutiondeptcode"] = this.state.selectedRecord["ninstitutiondeptcode"] ? this.state.selectedRecord["ninstitutiondeptcode"].value : -1;
                    inputData["submitter"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.ACTIVE;


                }
                let clearSelectedRecordField =[
                    { "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_LASTNAME", "dataField": "slastname", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_SHORTNAME", "dataField": "sshortname", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_INSTITUTIONDEPARTMENTCODE", "dataField": "sinstitutiondeptcode", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_WARDNAME", "dataField": "swardname", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_FAX", "dataField": "sfaxno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_TELEPHONE", "dataField": "stelephone", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_SPECIALIZATION", "dataField": "sspecialization", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_REPORTINGREQUIREMENT", "dataField": "sreportrequirement", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_SAMPLETRANSPORT", "dataField": "ssampletransport", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ACTIVE", "dataField": "ntransactionstatus", "width": "100px","isClearField":true,"preSetValue":1},
                ]
                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "Submitter",
                    displayName: this.props.Login.screenName,
                    inputData: inputData,
                    selectedId: this.state.selectedRecord["ssubmittercode"],
                    operation: this.props.Login.operation, saveType, formRef, dataState,
                    searchRef: this.searchRef,
                    postParam: postParam,
                    selectedRecord: {...this.state.selectedRecord}
                }
                //this.setState({ FilterInstitutionCategory: { "label":  this.state.selectedRecord.ninstitutioncatcode.label, "value":  this.state.selectedRecord.ninstitutioncatcode.value } });
                //this.setState({ FilterInstitution: { "label":  this.state.selectedRecord.ninstitutioncode.label, "value":  this.state.selectedRecord.ninstitutioncode.value } });
                //this.setState({ FilterInstitutionSite: { "label":  this.state.selectedRecord.ninstitutionsitecode.label, "value":  this.state.selectedRecord.ninstitutionsitecode.value } });


                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.screenName }),
                            operation: this.props.Login.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
                }
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }))
        }

    }
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.DeleteSubmitter("delete", deleteId));
    }

    DeleteSubmitter = (operation, ncontrolCode) => {
        let inputData = [];

        inputData["submitter"] = this.props.Login.masterData.selectedSubmitter;
        inputData["userinfo"] = this.props.Login.userInfo;
        const postParam = {
            inputListName: "submitter", selectedObject: "selectedSubmitter",
            primaryKeyField: "ssubmittercode",
            primaryKeyValue: this.props.Login.masterData.selectedSubmitter.ssubmittercode,
            fetchUrl: "submitter/getSelectedSubmitterDetail",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "Submitter",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam,
            isClearSearch: this.props.Login.isClearSearch,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "Submitter", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== "" && props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    retireSubmitter = (methodUrl, selectedSubmitter, operation, ncontrolCode) => {
        if (selectedSubmitter.ntransactionstatus === transactionStatus.RETIRED) {
            let message = "";
            if (operation === "retire") {
                message = "IDS_SUBMITTERALREADYRETIRED";
            }
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {

            const postParam = {
                inputListName: "Submitter", selectedObject: "selectedSubmitter",
                primaryKeyField: "ssubmittercode",
                primaryKeyValue: selectedSubmitter.ssubmittercode,
                fetchUrl: "submitter/getSubmitter",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "submitter": selectedSubmitter
                },
                operation,
                isClearSearch: this.props.Login.isClearSearch
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_SUBMITTER", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }

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

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    };

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
        } else {
            if (event.target.name === "smobileno" || event.target.name === "sfaxno" || event.target.name === "stelephone") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }



        }
        this.setState({ selectedRecord });
    };

    onComboChangeFilter = (comboData, fieldName) => {
        //const selectedRecord =this.state.selectedRecord || [];
        if (comboData) {
            if (fieldName === "ninstitutioncatcode") {
                if (comboData.value !== this.props.Login.masterData.defaultInstitutionCategory.ninstitutioncatcode) {

                    let inputParam = {};
                    inputParam = {
                        nflag: 2,
                        ninstitutioncatcode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        defaultInstitutionCategory: comboData.item,

                    }
                    this.props.getInstitution(inputParam)
                    //this.setState({nfilterInstitutionCategory:comboData});

                }
            }
            else if (fieldName === "ninstitutioncode") {
                if (comboData.value !== this.props.Login.masterData.defaultInstitution.ninstitutioncode) {
                    let inputParam = {};
                    inputParam = {
                        nflag: 3,
                        ninstitutioncode: comboData.value,
                        userinfo: this.props.Login.userInfo,
                        masterData: this.props.Login.masterData,
                        defaultInstitution: comboData.item
                    }
                    this.props.getInstitutionSite(inputParam)
                }
            }
            else if (fieldName === "ninstitutionsitecode") {
                if (comboData.value !== this.props.Login.masterData.defaultInstitutionSite.ninstitutionsitecode) {
                    let masterData = { ...this.props.Login.masterData, defaultInstitutionSite: comboData.item }
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData }
                    }
                    this.props.updateStore(updateInfo);
                }
            }
        }
    }

    onFilterSubmit = () => {
        if (this.props.Login.masterData.defaultInstitutionCategory) {
            if (this.props.Login.masterData.defaultInstitution) {
                if (this.props.Login.masterData.defaultInstitutionSite) {
                    let inputParam = {
                        inputData: {
                            ninstitutioncatcode: this.props.Login.masterData.defaultInstitutionCategory.ninstitutioncatcode,
                            ninstitutioncode: this.props.Login.masterData.defaultInstitution.ninstitutioncode,
                            ninstitutionsitecode: this.props.Login.masterData.defaultInstitutionSite.ninstitutionsitecode,
                            userinfo: this.props.Login.userInfo,

                        },
                        classUrl: "submitter",
                        methodUrl: "SubmitterByFilter"
                    }
                    this.props.changeInstitutionCategoryFilterSubmit(inputParam, this.props.Login.masterData.FilterInstitutionCategory, this.props.Login.masterData.defaultInstitutionCategory,
                        this.props.Login.masterData.FilterInstitution, this.props.Login.masterData.defaultInstitution,
                        this.props.Login.masterData.FilterInstitutionSite, this.props.Login.masterData.defaultInstitutionSite);

                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTITUTIONSITENOTAVAILABLE" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTITUTIONNOTAVAILABLE" }));
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORYNOTAVAILABLE" }));
        }
    }

    // reloadData = () => {
    //     if (this.props.Login.masterData.selectedInstitutionCategory !== null) {
    //         if (this.props.Login.masterData.selectedInstitution !== null) {
    //             if (this.props.Login.masterData.selectedInstitutionSite !== null) {
    //                 this.searchRef.current.value = "";

    //                 const inputParam = {
    //                     inputData: {
    //                         "ninstitutioncatcode": this.props.Login.masterData.selectedInstitutionCategory.ninstitutioncatcode,
    //                         "ninstitutioncode": this.props.Login.masterData.selectedInstitution.ninstitutioncode,
    //                         "ninstitutionsitecode": this.props.Login.masterData.selectedInstitutionSite.ninstitutionsitecode,
    //                         "userinfo": this.props.Login.userInfo
    //                     },
    //                     classUrl: this.props.Login.inputParam.classUrl,
    //                     methodUrl: "SubmitterByFilter",
    //                     displayName: this.props.intl.formatMessage({ id: "IDS_SUBMITTER" }),
    //                 };
    //                 this.props.changeInstitutionCategoryFilterSubmit(inputParam, this.props.Login.masterData.FilterInstitutionCategory, this.props.Login.masterData.selectedInstitutionCategory,
    //                     this.props.Login.masterData.FilterInstitution, this.props.Login.masterData.selectedInstitution,
    //                     this.props.Login.masterData.FilterInstitutionSite, this.props.Login.masterData.selectedInstitutionSite);
    //             } else {
    //                 toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGINSTITUTIONSITE" }));
    //             }
    //         } else {
    //             toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGINSTITUTION" }));
    //         }
    //     } else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_CONFIGINSTITUTIONCATEGORY" }));
    //     }
    // }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
                        inputData : {"userinfo":this.props.Login.userInfo},                        
                        classUrl: this.props.Login.inputParam.classUrl,
                        methodUrl: "Submitter",//this.props.Login.inputParam.methodUrl,
                        displayName: this.props.intl.formatMessage({ id: "IDS_SUBMITTER" }),
                        userInfo: this.props.Login.userInfo
                    };     
        this.props.callService(inputParam);
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData != null) {
            if (fieldName === "ninstitutiondeptcode") {
                selectedRecord["ninstitutiondeptcode"] = comboData;
                selectedRecord["sinstitutiondeptcode"] = comboData.item["sinstitutiondeptcode"];
                this.setState({ selectedRecord });
            }
        }
    }

    onTabComboChange = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData != null) {

            switch (caseNo) {
                case 1:

            if (fieldName === "ninstitutioncatcode") {
                selectedRecord["ninstitutioncatcode"] = comboData;
                selectedRecord["sinstitutioncatname"] = comboData.item["sinstitutioncatname"];
                selectedRecord["ninstitutioncode"]={};
                selectedRecord["sinstitutionname"]="";
                //selectedRecord["sinstitutionsitename"]=""
                this.props.getSubmitterInstitution(
                    this.state.selectedRecord.ninstitutioncatcode.value,
                    this.props.Login.userInfo,
                    selectedRecord,
                    this.props.Login.screenName
                );
                //this.setState({ selectedRecord,selectedSupplierCategory:undefined,selectedInstitutionSite:undefined});
            }


            case 2:
                
            if (fieldName === "ninstitutioncode") {
                selectedRecord["ninstitutioncode"] = comboData;
                selectedRecord["sinstitutionname"] = comboData.item["sinstitutionname"];

                 this.props.getSubmitterSite(
                     this.state.selectedRecord.ninstitutioncode.value,
                     this.props.Login.masterData.selectedSubmitter,
                     this.props.Login.userInfo,
                     selectedRecord,
                     this.props.Login.screenName
                 );
                //this.setState({ selectedRecord });
            }

            case 3:

            if (fieldName === "ninstitutionsitecode") {
                let selectedSupplierCategory = comboData;
                //let selectedRecord= comboData;
               // selectedRecord["sinstitutionsitename"] = comboData.item["sinstitutionsitename"];
                this.setState({ selectedRecord, selectedSupplierCategory });
            }

            
        }
        }
    }

    componentDidUpdate(previousProps) {
        let selectedRecord = this.state.selectedRecord || {};
        let selectedSupplierCategory = this.state.selectedSupplierCategory || {};
        

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord
            this.setState({ selectedRecord,selectedSupplierCategory:{} });
        }

        if (this.props.Login.selectedSupplierCategory !== previousProps.Login.selectedSupplierCategory) {
            selectedSupplierCategory = this.props.Login.selectedSupplierCategory
            this.setState({ selectedSupplierCategory });
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ userRoleControlRights, controlMap, data: this.props.Login.masterData });
            }
            else {

                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({ data: this.props.Login.masterData, dataState, selectedRecord: this.props.Login.selectedRecord });
            }



            let FilterInstitutionCategory = this.state.FilterInstitutionCategory || {};
            let FilterInstitution = this.state.FilterInstitution || {};
            let FilterInstitutionSite = this.state.FilterInstitutionSite || {};

            // let nfilterInstitutionCategory =this.state.nfilterInstitutionCategory ||{};
            // let nfilterInstitution =this.state.nfilterInstitution || {};
            // let nfilterInstitutionSite = this.state.nfilterInstitutionSite ||{};

            if (this.props.Login.masterData.FilterInstitutionCategory !== previousProps.Login.masterData.FilterInstitutionCategory) {
                const InstitutionCategoryMap = constructOptionList(this.props.Login.masterData.FilterInstitutionCategory || [], "ninstitutioncatcode", "sinstitutioncatname", 'ninstitutioncatcode', 'descending', false);
                FilterInstitutionCategory = InstitutionCategoryMap.get("OptionList");

                // if(FilterInstitutionCategory && FilterInstitutionCategory.length >=0){
                //     // const FTC =this.props.Login.masterData.selectedInstitutionCategory;
                //     // nfilterInstitutionCategory = FTC;
                //     nfilterInstitutionCategory = FilterInstitutionCategory[0];
                // }       
            }
            if (this.props.Login.masterData.FilterInstitution !== previousProps.Login.masterData.FilterInstitution) {
                const InstitutionMap = constructOptionList(this.props.Login.masterData.FilterInstitution || [], "ninstitutioncode", "sinstitutionname", 'ninstitutioncode', 'descending', false);
                FilterInstitution = InstitutionMap.get("OptionList");

                // if(FilterInstitution && FilterInstitution.length >=0){
                //     nfilterInstitution = FilterInstitution[0];
                // }  

            }
            if (this.props.Login.masterData.FilterInstitutionSite !== previousProps.Login.masterData.FilterInstitutionSite) {
                const InstitutionMap = constructOptionList(this.props.Login.masterData.FilterInstitutionSite || [], "ninstitutionsitecode", "sinstitutionsitename", 'ninstitutionsitecode', 'descending', false);
                FilterInstitutionSite = InstitutionMap.get("OptionList");

                // if(FilterInstitutionSite && FilterInstitutionSite.length>=0){
                //     nfilterInstitutionSite =FilterInstitutionSite[0] ;
                // }   

            }

            //this.setState({ FilterInstitutionCategory,nfilterInstitutionCategory,FilterInstitution,nfilterInstitution,FilterInstitutionSite,nfilterInstitutionSite});
            this.setState({ FilterInstitutionCategory, FilterInstitution, FilterInstitutionSite });

        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, getSubmitterDetail, getSubmitterCombo, getInstitution, getInstitutionSite, changeInstitutionCategoryFilterSubmit, filterColumnData, updateSubmitter,
    getInstitutionCategory,getSubmitterInstitution,getSubmitterSite
})(injectIntl(Submitter));

