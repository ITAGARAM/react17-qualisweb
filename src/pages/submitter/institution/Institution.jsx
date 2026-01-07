import React from "react";
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from "react-intl";
import {
    callService, crudMaster, validateEsignCredential, updateStore, getInstitutionDetail, getInstitutionCombo,
    getInstitutionSiteData, addInstitutionFile, changeInstitutionCategoryFilter, viewAttachment, filterColumnData, getCitComboServices, getDistComboServices
} from "../../../actions";
import BreadcrumbComponent from "../../../components/Breadcrumb.Component";
import { Affix } from 'rsuite';
import { constructOptionList, getControlMap, showEsign, onDropAttachFileList, deleteAttachmentDropZone, create_UUID, validatePhoneNumber, validateEmail, Lims_JSON_stringify,replaceBackSlash } from '../../../components/CommonScript';
import { Row, Col, Card, FormGroup, FormLabel, Nav } from "react-bootstrap";
import { ContentPanel } from '../../product/product.styled';
import ListMaster from "../../../components/list-master/list-master.component";

import InstitutionCategoryFilter from "./InstitutionCategoryFilter";
import { ReadOnlyText } from '../../../components/App.styles';
import CustomTab from "../../../components/custom-tabs/custom-tabs.component";
import InstitutionSiteTab from "./InstitutionSiteTab";
import InstitutionFileTab from "./InstitutionFileTab";
import { DEFAULT_RETURN } from "../../../actions/LoginTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SlideOutModal from "../../../components/slide-out-modal/SlideOutModal";
import Esign from "../../audittrail/Esign";
import AddInstitution from "./AddInstitution";
import AddInstitutionSite from "./AddInstitutionSite";
import AddInstitutionFile from "./AddInstitutionFile";
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { toast } from 'react-toastify';
import { attachmentType, transactionStatus } from "../../../components/Enumeration";

//component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17 */}
import { Tooltip } from 'react-tooltip';



const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class Institution extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchRef = React.createRef();
        this.fieldInstitutionList = [];
        this.fieldInstitutionSiteList = [];
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
        if (this.props.Login.screenName === this.props.intl.formatMessage({id: "IDS_INSTITUTION"})) {
            mandatoryFields.push(
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTIONCATEGORY",
                    dataField: "ninstitutioncatcode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTION",
                    dataField: "sinstitutionname",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTIONCODE",
                    dataField: "sinstitutioncode",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },

            );



        } else if (this.props.Login.screenName === this.props.intl.formatMessage({id: "IDS_INSTITUTIONSITE"})) {
            mandatoryFields.push(
                {
                    mandatory: true,
                    idsName: "IDS_INSTITUTIONSITE",
                    dataField: "sinstitutionsitename",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_REGIONNAME",
                    dataField: "nregioncode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_DISTRICT",
                    dataField: "ndistrictcode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_CITY",
                    dataField: "scityname",
                    mandatoryLabel: "IDS_ENTER",
                    controlType: "textbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_COUNTRY",
                    dataField: "ncountrycode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                },
                {
                    mandatory: true,
                    idsName: "IDS_LIMSSITE",
                    dataField: "nsitecode",
                    mandatoryLabel: "IDS_SELECT",
                    controlType: "selectbox",
                }
            );
        }
        else {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFields.push(
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                );
            } else {
                // if (this.props.operation !== 'update') {
                mandatoryFields.push(
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
                )
            }
        }


        this.fieldInstitutionList = ["sinstitutionname", "sinstitutioncode", "sdescription"];
        this.fieldInstitutionSiteList = ["sinstitutionsitename", "sinstitutionsiteaddress", "szipcode", "sstate", "stelephone", "sfaxno", "semail", "swebsite","scityname","scitycode"];



        const addId = this.state.controlMap.has("AddInstitution") && this.state.controlMap.get("AddInstitution").ncontrolcode;
        const editId = this.state.controlMap.has("EditInstitution") && this.state.controlMap.get("EditInstitution").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteInstitution") && this.state.controlMap.get("DeleteInstitution").ncontrolcode;

        const filterParam = {
            inputListName: "Institution", selectedObject: "selectedInstitution", primaryKeyField: "ninstitutioncode",
            fetchUrl: "institution/getSelectedInstitutionDetail", fecthInputObject: { userinfo: this.props.Login.userInfo, Institution: this.props.Login.masterData.selectedInstitution },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sinstitutioncatname", "sinstitutionname", "sdescription"]
        };

        const { selectedInstitution } = this.props.Login.masterData;
        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Institution}
                                getMasterDetail={(Institution) => this.props.getInstitutionDetail(Institution, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedInstitution}
                                primaryKeyField="ninstitutioncode"
                                mainField="sinstitutionname"
                                firstField="sinstitutioncatname"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() =>
                                    this.props.getInstitutionCombo(
                                        this.props.intl.formatMessage({ id: "IDS_INSTITUTION" }),
                                        "create",
                                        "ninstitutioncode",
                                        this.props.Login.masterData,
                                        this.props.Login.userInfo,
                                        addId
                                    )
                                }
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_INSTITUTIONCATEGORYFILTER":
                                            <InstitutionCategoryFilter
                                                FilterInstitutionCategory={this.state.FilterInstitutionCategory || []}
                                                nfilterInstitutionCategory={this.props.Login.masterData.defaultInstitutionCategory || {}}
                                                selectedFilterRecord={this.state.selectedFilterRecord || {}}
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
                                            {this.props.Login.masterData.selectedInstitution ? (
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
                                                            {this.props.Login.masterData.selectedInstitution.sinstitutionname}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category">
                                                                <h2 className="product-title-sub flex-grow-1"></h2>
                                                                <div className="d-inline">
                                                                    <Nav.Link
                                                                        name="editInstitution"
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT", })}
                                                                        data-for="tooltip_list_wrap" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                        className="btn btn-circle outline-grey mr-2"
                                                                        onClick={(e) => this.props.getInstitutionCombo(this.props.intl.formatMessage({ id: "IDS_INSTITUTION" }), "update", "ninstitutioncode", this.props.Login.masterData, this.props.Login.userInfo, editId)}

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
                                                                </div>
                                                            </div>
                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage id="IDS_INSTITUTION" messasge="Institution"/>
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.selectedInstitution.sinstitutionname}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                            {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage id="IDS_INSTITUTIONCATEGORY" messasge="Institution Category"/>
                                                                </FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.selectedInstitution.sinstitutioncatname}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_INSTITUTIONCODE" messasge="Institution" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedInstitution.sinstitutioncode}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel>
                                                                        <FormattedMessage id="IDS_DESCRIPTION" messasge="Description" />
                                                                    </FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.selectedInstitution.sdescription}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        {selectedInstitution && (
                                                            <CustomTab
                                                                tabDetail={this.tabDetail()}
                                                                onTabChange={this.onTabChange}
                                                            />
                                                        )}
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
                {(this.props.Login.openModal || this.props.Login.openChildModal) && (
                    <SlideOutModal
                        show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={this.props.Login.screenName==="Institution File"?false:true}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        mandatoryFields={mandatoryFields}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={
                            this.props.Login.loadEsign ? (
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                            ) : this.props.Login.screenName === this.props.intl.formatMessage({
                                id: "IDS_INSTITUTION"}) ? (
                                <AddInstitution
                                    onNumericInputOnChange={this.onNumericInputOnChange}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                    InstitutionCategory={this.props.Login.InstitutionCategory}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.inputParam}
                                    userInfo={this.props.Login.userInfo}

                                />
                            ) : this.props.Login.screenName === this.props.intl.formatMessage({
                                id: "IDS_INSTITUTIONSITE"}) ? (
                                <AddInstitutionSite
                                    selectedRecord={this.state.selectedRecord || {}}
                                    Site={this.props.Login.Site}
                                    Region={this.props.Login.Region}
                                    Country={this.props.Login.Country}
                                    onComboChange={this.onComboChange}
                                    onInputOnChange={this.onInputOnChange}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    districtList={this.props.Login.districtList}
                                    cityList={this.props.Login.cityList}

                                />
                            ) : this.props.Login.screenName === this.props.intl.formatMessage({
                                id: "IDS_INSTITUTIONFILE"}) ? (
                                <AddInstitutionFile
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onDrop={this.onDropInstitutionFile}
                                    label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                    deleteAttachment={this.deleteAttachment}
                                    linkMaster={this.props.Login.linkMaster}
                                    maxSize={20}
                                    maxFiles={1}
                                    settings={this.props.Login.settings}
                                />
                            ) : (
                                ""
                            )
                        }
                    />
                )}
            </>
        )

    }

    tabDetail = () => {
        const tabMap = new Map();

        const editSiteId = this.state.controlMap.has("EditInstitutionSite") && this.state.controlMap.get("EditInstitutionSite").ncontrolcode;
        const deleteSiteId = this.state.controlMap.has("DeleteInstitutionSite") && this.state.controlMap.get("DeleteInstitutionSite").ncontrolcode;
        const deleteFileId = this.state.controlMap.has("DeleteInstitutionFile") && this.state.controlMap.get("DeleteInstitutionFile").ncontrolcode;
        const deleteParam = { operation: "delete", deleteSiteId };
        const deleteTestParam = { operation: "delete", deleteFileId };
        const editParam = {
            screenName: this.props.intl.formatMessage({
                id: "IDS_INSTITUTIONSITE"
              }), operation: "update", primaryKeyField: "ninstitutionsitecode",
            userInfo: this.props.Login.userInfo, inputParam: this.props.Login.inputParam, ncontrolcode: editSiteId,
            instItem: this.props.Login.masterData.selectedInstitution, instItemSite: this.props.Login.masterData.selectedInstitutionSite
        }

        tabMap.set("IDS_INSTITUTIONSITE",
            <InstitutionSiteTab
                selectedId={this.props.Login.selectedId}
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                selectedInstitution={this.props.Login.masterData.selectedInstitution}
                InstitutionSite={this.props.Login.masterData.InstitutionSite}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                getInstitutionSiteData={this.props.getInstitutionSiteData}
                inputParam={this.props.Login.inputParam}
                selectedRecord={this.state.selectedRecord}
                dataState={this.props.Login.dataState}
                deleteRecord={this.DeleteInstitutionSite}
                deleteParam={deleteParam}
                fetchRecord={this.props.getInstitutionSiteData}
                editParam={editParam}
                InstitutionSiteData={this.props.Login.masterData.InstitutionSite || []}
                screenName="Institution Site"
                settings={this.props.Login.settings}
                errorCode={this.props.Login.errorCode}
            />);





        tabMap.set("IDS_INSTITUTIONFILE",
            <InstitutionFileTab
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
                InstitutionFile={this.props.Login.masterData.InstitutionFile || []}
                settings={this.props.Login.settings}
                addInstitutionFile={this.props.addInstitutionFile}
                deleteRecord={this.DeleteInstitutionFile}
                deleteParam={deleteTestParam}
                //editParam={editTestParam}
                viewInstitutionFile={this.viewInstitutionFile}
                screenName={this.props.intl.formatMessage({
                    id: "IDS_INSTITUTIONFILE"
                  })}
            />);

        return tabMap;
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
        if (this.props.Login.masterData.defaultInstitutionCategory) {
            let inputParam = {
                inputData: {
                    ninstitutioncatcode: this.state.selectedFilterRecord.ninstitutioncatcode.value,
                    userinfo: this.props.Login.userInfo,

                },
                classUrl: "institution",
                methodUrl: "InstitutionByCategory"
            }
            this.props.changeInstitutionCategoryFilter(inputParam, this.props.Login.masterData.FilterInstitutionCategory, this.state.selectedFilterRecord);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORYNOTAVAILABLE" }));
        }
    }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
            inputData: {
                "ninstitutioncatcode": this.props.Login.masterData.SelectedInstitutionCategory.ninstitutioncatcode,
                "userinfo": this.props.Login.userInfo
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "InstitutionByCategory",
            displayName: this.props.intl.formatMessage({ id: "IDS_INSTITUTION" }),
        };
        this.props.changeInstitutionCategoryFilter(inputParam, this.props.Login.masterData.FilterInstitutionCategory, this.props.Login.masterData.SelectedInstitutionCategory);

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


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = [];
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
                selectedRecord = selectedRecord;
            }
        } else {
            openModal = false;
            openChildModal = false;
            selectedRecord = [];
            this.props.Login.cityList = [];
            this.props.Login.districtList = [];
            selectedId = null;
            //this.setState({ selectedRecord });
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId, openChildModal },
        };
        this.props.updateStore(updateInfo);
    };

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName },
        };
        this.props.updateStore(updateInfo);
    };
    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    };

    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else if (event.target.type === "radio") {
            selectedRecord[event.target.name] = optional;
        } else {
            if (event.target.name === "sfaxno" || event.target.name === "stelephone") {
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
        const selectedFilterRecord = this.state.selectedFilterRecord || [];
        if (comboData) {
            if (fieldName === "ninstitutioncatcode") {
                //    if(comboData.value !== this.props.Login.masterData.defaultInstitutionCategory. ninstitutioncatcode) {
                //         let masterData = { ...this.props.Login.masterData, defaultInstitutionCategory: comboData.item}
                //         const updateInfo = { 
                //             typeName: DEFAULT_RETURN,
                //             data: { masterData }
                //         }
                //         this.props.updateStore(updateInfo);
                //     }  

                selectedFilterRecord[fieldName] = comboData;
            }
            this.setState({ selectedFilterRecord });
        }
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData != null) {
            if (fieldName === "ninstitutioncatcode") {
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
            } else if (fieldName === "nsitecode") {
                selectedRecord["nsitecode"] = comboData;
                selectedRecord["ssitecode"] = comboData.item["ssitecode"];
                this.setState({ selectedRecord });
            } else if (fieldName === "nregioncode") {
                selectedRecord["nregioncode"] = comboData;
                selectedRecord["sregioncode"] = comboData.item["sregioncode"];
                this.props.getDistComboServices({
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sdisplayname: selectedRecord.nregioncode.label,
                        primarykey: selectedRecord.nregioncode.value,
                    }
                });
                selectedRecord["ndistrictcode"] = "";
                selectedRecord["sdistrictcode"] = "";
                selectedRecord["ncitycode"] = "";
                selectedRecord["scitycode"] = "";
                this.setState({ selectedRecord });
            } else if (fieldName === "ncountrycode") {
                selectedRecord["ncountrycode"] = comboData;
                this.setState({ selectedRecord });
            } else if (fieldName === "ndistrictcode") {
                selectedRecord["ndistrictcode"] = comboData;
                selectedRecord["sdistrictcode"] = comboData.item["sdistrictcode"];
                this.props.getCitComboServices({
                    inputData: {
                        userinfo: this.props.Login.userInfo,
                        sdisplayname: selectedRecord.ndistrictcode.label,
                        primarykey: selectedRecord.ndistrictcode.value,
                    }
                });
                selectedRecord["ncitycode"] = "";
                selectedRecord["scitycode"] = "";
                this.setState({ selectedRecord });
            } else if (fieldName === "ncitycode") {
                selectedRecord["ncitycode"] = comboData;
                selectedRecord["scitycode"] = comboData.item["scitycode"];
                this.setState({ selectedRecord });
            }
        }
    }

    onSaveClick = (saveType, formRef) => {
        let postParam = undefined;
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;

        if (this.props.Login.screenName === this.props.intl.formatMessage({id: "IDS_INSTITUTION"})) {
            if (this.props.Login.operation === "update") {  // edit
                const selectedRecord = this.state.selectedRecord;
                postParam = {
                    inputListName: "Institution",
                    selectedObject: "selectedInstitution",
                    primaryKeyField: "ninstitutioncode",
                };
                inputData["institution"] = {};

                this.fieldInstitutionList.map(item => {
                    return inputData["institution"][item] = selectedRecord[item] !== null ? selectedRecord[item] : "";
                })
                inputData["institution"]["ninstitutioncode"] = selectedRecord["ninstitutioncode"] ? selectedRecord["ninstitutioncode"] : -1;
                inputData["institution"]["ninstitutioncatcode"] = this.state.selectedRecord ? this.state.selectedRecord.ninstitutioncatcode.value : -1;
                dataState = this.state.dataState;
            } else {
                //add               
                inputData["institution"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


                this.fieldInstitutionList.map(item => {
                    return inputData["institution"][item] = this.state.selectedRecord[item] !== undefined ? this.state.selectedRecord[item] : "";
                })
                inputData["institution"]["ninstitutioncatcode"] = this.state.selectedRecord ? this.state.selectedRecord.ninstitutioncatcode.value : -1;
            }
            let clearSelectedRecordField =[
                { "idsName": "IDS_INSTITUTION", "dataField": "sinstitutionname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                { "idsName": "IDS_INSTITUTIONCODE", "dataField": "sinstitutioncode", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
            ]
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "Institution",
                displayName: this.props.Login.screenName,
                inputData: inputData,
                selectedId: this.state.selectedRecord["ninstututioncode"],
                operation: this.props.Login.operation, saveType, formRef, dataState,
                searchRef: this.searchRef,
                postParam: postParam,
                selectedRecord: {...this.state.selectedRecord},
                filtercombochange: this.props.Login.masterData.searchedData !== undefined ?
                    this.state.selectedRecord.ninstitutioncatcode.value ===
                        this.props.Login.masterData.defaultInstitutionCategory.ninstitutioncatcode ? false : true : false,
                
            }

            let masterData = {
                ...this.props.Login.masterData
            };

            if (this.state.selectedRecord.ninstitutioncatcode.value !==
                this.props.Login.masterData.defaultInstitutionCategory.ninstitutioncatcode) {
                masterData = {
                    ...this.props.Login.masterData,
                    defaultInstitutionCategory: this.state.selectedRecord.ninstitutioncatcode.item,
                    SelectedInstitutionCategory: this.state.selectedRecord.ninstitutioncatcode.item
                };
            }

            //  this.setState({ FilterInstitutionCategory: { "label":  this.state.selectedRecord.ninstitutioncatcode.label, "value":  this.state.selectedRecord.ninstitutioncatcode.value } });
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.screenName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
            }
        } else if (this.props.Login.screenName === this.props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE"})) {

            const isValidateEmail = this.state.selectedRecord["semail"] ? validateEmail(this.state.selectedRecord["semail"]) : true;
            if (isValidateEmail) {

                if (this.props.Login.operation === "update") {  // edit
                    const selectedRecord = this.state.selectedRecord;
                    postParam = {
                        inputListName: "InstitutionSite",
                        selectedObject: "selectedInstitutionSite",
                        primaryKeyField: "ninstitutionsitecode",
                    };
                    inputData["institutionsite"] = {};

                    inputData["institutionsite"]["ninstitutionsitecode"] = selectedRecord["ninstitutionsitecode"] ? selectedRecord["ninstitutionsitecode"] : -1;
                    inputData["institutionsite"]["ninstitutioncode"] = this.props.Login.instItem["ninstitutioncode"];;
                    inputData["institutionsite"]["nregionalsitecode"] = this.state.selectedRecord["nsitecode"] ? this.state.selectedRecord["nsitecode"].value : -1;
                    inputData["institutionsite"]["nregioncode"] = this.state.selectedRecord["nregioncode"] ? this.state.selectedRecord["nregioncode"].value : -1;
                    inputData["institutionsite"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : -1;
                    inputData["institutionsite"]["ncitycode"] = this.state.selectedRecord["ncitycode"] ? this.state.selectedRecord["ncitycode"].value : -1;
                    inputData["institutionsite"]["ndistrictcode"] = this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value : -1;

                    this.fieldInstitutionSiteList.map(item => {
                        return inputData["institutionsite"][item] = selectedRecord[item] !== null ? selectedRecord[item] : "";
                    })


                    dataState = this.state.dataState;
                } else {
                    postParam = undefined;
                    //add               
                    //inputData["institutionsite"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };  
                    inputData["institutionsite"] = {};
                    inputData["institutionsite"]["ninstitutioncode"] = this.props.Login.instItem["ninstitutioncode"];;
                    inputData["institutionsite"]["nregionalsitecode"] = this.state.selectedRecord["nsitecode"] ? this.state.selectedRecord["nsitecode"].value : -1;
                    inputData["institutionsite"]["nregioncode"] = this.state.selectedRecord["nregioncode"] ? this.state.selectedRecord["nregioncode"].value : -1;
                    inputData["institutionsite"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : -1;
                    inputData["institutionsite"]["ncitycode"] = this.state.selectedRecord["ncitycode"] ? this.state.selectedRecord["ncitycode"].value : -1;
                    inputData["institutionsite"]["ndistrictcode"] = this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value : -1;


                    this.fieldInstitutionSiteList.map(item => {
                        return inputData["institutionsite"][item] = this.state.selectedRecord[item] !== undefined ? this.state.selectedRecord[item] : "";
                    })
                }
                let clearSelectedRecordField =[
                    { "idsName": "IDS_INSTITUTIONSITE", "dataField": "sinstitutionsitename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_INSTITUTIONSITEADDRESS", "dataField": "sinstitutionsiteaddress", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_REGIONCODE", "dataField": "sregioncode", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_DISTRICTCODE", "dataField": "sdistrictcode", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_CITY", "dataField": "scityname", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_ZIPCODE", "dataField": "szipcode", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_STATE", "dataField": "sstate", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_LIMSSITECODE", "dataField": "ssitecode", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_TELEPHONE", "dataField": "stelephone", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_FAX", "dataField": "sfaxno", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_WEBSITE", "dataField": "swebsite", "width": "200px","controlType": "textbox","isClearField":true },
                ]
                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "InstitutionSite",
                    displayName: this.props.Login.screenName,
                    inputData: inputData,
                    selectedId: this.state.selectedRecord["ninstitutionsitecode"],
                    operation: this.props.Login.operation, saveType, formRef, dataState,
                    searchRef: this.searchRef,
                    postParam: postParam,
                    selectedRecord: {...this.state.selectedRecord}
                }
                //this.setState({ FilterClientCategory: { "label":  this.state.selectedRecord.ninstitutioncatcode.label, "value":  this.state.selectedRecord.ninstitutioncatcode.value } });
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.screenName }),
                            operation: this.props.Login.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal","","",clearSelectedRecordField);
                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }))
            }

        } else if (this.props.Login.screenName === this.props.intl.formatMessage({id: "IDS_INSTITUTIONFILE"})) {
            const selectedRecord = this.state.selectedRecord;
            const acceptedFiles = selectedRecord.sfilename;
            const nattachmenttypecode = selectedRecord.nattachmenttypecode;
            let isFileEdited = transactionStatus.NO;
            let institutionFileArray = [];
            let institutionFile = {
                ninstitutioncode: this.props.Login.masterData.selectedInstitution.ninstitutioncode,
                ninstitutionfilecode: selectedRecord.ninstitutionfilecode ? selectedRecord.ninstitutionfilecode : 0,
                nstatus: transactionStatus.ACTIVE,
                nattachmenttypecode,
            };
            const formData = new FormData();
            if (nattachmenttypecode === attachmentType.FTP) {
                if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                    acceptedFiles.forEach((file, index) => {
                        const tempData = Object.assign({}, institutionFile);
                        const splittedFileName = file.name.split('.');
                        const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                        const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                        const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                        const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ntestfilecode && selectedRecord.ntestfilecode > 0
                            && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                        tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                        tempData["sfiledesc"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : ""), false);
                        tempData["nlinkcode"] = transactionStatus.NA;
                        tempData["ssystemfilename"] = uniquefilename;
                        tempData["nfilesize"] = file.size;
                        formData.append("uploadedFile" + index, file);
                        formData.append("uniquefilename" + index, uniquefilename);
                        institutionFileArray.push(tempData);
                    });

                    formData.append("filecount", acceptedFiles.length);
                    isFileEdited = transactionStatus.YES;
                } else {
                    institutionFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                    institutionFile["sfiledesc"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : ""), false);
                    institutionFile["nlinkcode"] = transactionStatus.NA;
                    institutionFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                    institutionFile["nfilesize"] = selectedRecord.nfilesize;
                    institutionFileArray.push(institutionFile);
                }
            } else {
                institutionFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename.trim()), false);
                institutionFile["sfiledesc"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""), false);
                institutionFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
                institutionFile["ssystemfilename"] = "";
                institutionFile["nfilesize"] = 0;
                institutionFileArray.push(institutionFile);
            }
            formData.append("isFileEdited", isFileEdited);
            formData.append("institutionfile", JSON.stringify(institutionFileArray));
            let selectedId = null;
            let postParam = undefined;
            if (this.props.Login.operation === "update") {
                postParam = { inputListName: "Institution", selectedObject: "selectedInstitution", primaryKeyField: "ninstitutioncode" };
                selectedId = selectedRecord["ninstitutionfilecode"];
            }
            let clearSelectedRecordField =[
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                { "idsName": "IDS_DESCRIPTION", "dataField": "sfiledesc", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
                
            ]
            const inputParam = {
                inputData: {
                    "userinfo": {
                        ...this.props.Login.userInfo,
                        sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                        smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                        //ALPD-1628(while file saving,audit trail is not captured respective language)
                        slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                    }
                },
                formData: formData,
                isFileupload: true,
                operation: this.props.Login.operation,
                classUrl: "institution",
                saveType, formRef, methodUrl: "InstitutionFile", postParam,
                selectedRecord: {...this.state.selectedRecord}
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.screenName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal","","",clearSelectedRecordField);
            }

        }



    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.DeleteInstitution("delete", deleteId));
    }

    DeleteInstitutionFile = (deleteTestParam) => {
        let inputData = [];
        let ncontrolcode = deleteTestParam.ncontrolCode;
        let operation = deleteTestParam.operation;
        inputData["institutionfile"] = deleteTestParam.selectedRecord;
        inputData["userinfo"] = this.props.Login.userInfo;
        const postParam = {
            inputListName: "institutionfile", selectedObject: "selectedInstitutionFile",
            primaryKeyField: "ninstitutionfilecode",
            primaryKeyValue: deleteTestParam.selectedRecord.ninstitutionfilecode,
            fetchUrl: "institution/getInstitutionFile",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "InstitutionFile",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, screenName: "Institution File", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }


    DeleteInstitutionSite = (deleteParam) => {
        let inputData = [];
        let ncontrolcode = deleteParam.ncontrolCode;
        let operation = deleteParam.operation;
        delete (deleteParam.selectedRecord.expanded);
        inputData["institutionsite"] = deleteParam.selectedRecord;
        inputData["userinfo"] = this.props.Login.userInfo;
        const postParam = {
            inputListName: "institutionsite", selectedObject: "selectedInstitutionSite",
            primaryKeyField: "ninstitutionsitecode",
            primaryKeyValue: deleteParam.selectedRecord.ninstitutionsitecode,
            fetchUrl: "institution/getInstitutionSite",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "InstitutionSite",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, screenName: "Institution Site", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }

    DeleteInstitution = (operation, ncontrolCode) => {
        let inputData = [];

        inputData["institution"] = this.props.Login.masterData.selectedInstitution;
        inputData["userinfo"] = this.props.Login.userInfo;
        const postParam = {
            inputListName: "institution", selectedObject: "selectedInstitution",
            primaryKeyField: "ninstitutioncode",
            primaryKeyValue: this.props.Login.masterData.selectedInstitution.ninstitutioncode,
            fetchUrl: "institution/getSelectedInstitutionDetail",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "Institution",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "Institution", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    viewInstitutionFile = (filedata) => {
        const inputParam = {
            inputData: {
                institutionfile: filedata,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "institution",
            operation: "view",
            methodUrl: "InstitutionFile",
            screenName: "IDS_INSTITUTION"
        }
        this.props.viewAttachment(inputParam);
    }

    onDropInstitutionFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(
            selectedRecord[fieldName],
            attachedFiles,
            maxSize
        );
        this.setState({ selectedRecord, actionType: "new" });
    };

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(
            selectedRecord[fieldName],
            file
        );

        this.setState({
            selectedRecord,
            actionType: "delete",
        });
    };

    validateEsign = () => {
        let modalName;
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
        // ALPD-5346 - changed by gowtham r - Institution-->While Edit the Record and the Record has been Updated.But Still edit Popup is Opened
        // if (this.props.Login.screenName === 'Institution')) {
        if (this.props.Login.screenName === this.props.intl.formatMessage({id: "IDS_INSTITUTION"})) {
            modalName = "openModal";
        }
        else {
            modalName = "openChildModal";
        }
        this.props.validateEsignCredential(inputParam, modalName);
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.FilterInstitutionCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_INSTITUTIONCATEGORY",
                    "value": this.props.Login.masterData.defaultInstitutionCategory ? this.props.Login.masterData.defaultInstitutionCategory.sinstitutioncatname : "-"
                }
            );
        }
        return breadCrumbData;
    }

    componentDidUpdate(previousProps) {
        let selectedRecord = this.state.selectedRecord || {};

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord
            this.setState({ selectedRecord });
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



            ///     let FilterInstitutionCategory = this.state.FilterInstitutionCategory || {};

            //   if (this.props.Login.masterData.FilterInstitutionCategory !== previousProps.Login.masterData.FilterInstitutionCategory) {
            const InstitutionCategoryMap = constructOptionList(this.props.Login.masterData.FilterInstitutionCategory || [], "ninstitutioncatcode", "sinstitutioncatname", 'ninstitutioncatcode', 'descending', false);
            const FilterInstitutionCategory = InstitutionCategoryMap.get("OptionList");
            //  } 


            const filterData = this.generateBreadCrumData();

            const selectedFilterRecord = {
                "ninstitutioncatcode": {
                    "label": this.props.Login.masterData.defaultInstitutionCategory ? this.props.Login.masterData.defaultInstitutionCategory.sinstitutioncatname : "",
                    "value": this.props.Login.masterData.defaultInstitutionCategory ? this.props.Login.masterData.defaultInstitutionCategory.ninstitutioncatcode : '-',
                    "item": this.props.Login.masterData.defaultInstitutionCategory ? this.props.Login.masterData.defaultInstitutionCategory : {}
                }
            }



            this.setState({ FilterInstitutionCategory, filterData, selectedFilterRecord });

            // if(this.props.Login.comboSet){
            //     const updateInfo = {
            //         typeName: DEFAULT_RETURN,
            //         data: { comboSet: false }
            //     }
            //     this.props.updateStore(updateInfo);
            // }
        }



        // if (this.props.Login.masterData !== previousProps.Login.masterData) {

        //     this.setState({ filterData });
        // }
    }

}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, getInstitutionDetail, getInstitutionCombo, getInstitutionSiteData, addInstitutionFile, changeInstitutionCategoryFilter, viewAttachment, filterColumnData, getCitComboServices, getDistComboServices
})(injectIntl(Institution));
