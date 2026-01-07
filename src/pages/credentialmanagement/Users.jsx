import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faUserTimes } from '@fortawesome/free-solid-svg-icons';

import {
    callService, crudMaster, validateEsignCredential, updateStore, getUserDetail,
    getUserComboService, getUserMultiRoleComboDataService, getUserMultiDeputyComboDataService,
    getUserSiteDetail, getUserSiteComboService, filterColumnData, viewUserImage
} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, validatePhoneNumber, create_UUID, validateEmail, validateLoginId, formatDate, onDropAttachFileList, deleteAttachmentDropZone, Lims_JSON_stringify } from '../../components/CommonScript';
//import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';

// import 'react-perfect-scrollbar/dist/css/styles.css';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';

import AddUser from './AddUser';
import UserTabs from './UserTabs';
import Esign from '../audittrail/Esign';
//import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedUser: undefined,
            screenName: undefined,
            userLogged: true,
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            sidebarview: false

        };
        this.searchRef = React.createRef();
        this.emailRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();

        this.userFieldList = ['sloginid', 'sfirstname', 'slastname', 'sempid',
            'sjobdescription', 'squalification', 'semail', 'sphoneno', 'smobileno', "ddateofjoin",
            'saddress1', 'saddress2', 'saddress3', 'sbloodgroup'];

        this.searchFieldList = ["sactivestatus", "saddress1", "saddress2", "saddress3", "sbloodgroup",
            "scountryname", "sdateofjoin", "sdeptname", "sdesignationname", "semail",
            "sfirstname", "sempid", "sjobdescription",
            "slastname", "slockstatus", "sloginid", "smobileno", "sphoneno",
            "squalification", "stransstatus",
            "susername"];
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    render() {

        let userStatusCSS = "outline-secondary";
        let activeIconCSS = "fa fa-check"
        if (this.props.Login.masterData.SelectedUser && this.props.Login.masterData.SelectedUser.ntransactionstatus === transactionStatus.ACTIVE) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedUser && this.props.Login.masterData.SelectedUser.ntransactionstatus === transactionStatus.RETIRED) {
            userStatusCSS = "outline-danger";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.SelectedUser && this.props.Login.masterData.SelectedUser.ntransactionstatus === transactionStatus.DEACTIVE) {
            activeIconCSS = "";
        }

        const addId = this.state.controlMap.has("AddUser") && this.state.controlMap.get("AddUser").ncontrolcode;
        const editId = this.state.controlMap.has("EditUser") && this.state.controlMap.get("EditUser").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteUser") && this.state.controlMap.get("DeleteUser").ncontrolcode
        const retireId = this.state.controlMap.has("RetireUser") && this.state.controlMap.get("RetireUser").ncontrolcode

        const filterParam = {
            inputListName: "Users", selectedObject: "SelectedUser", primaryKeyField: "nusercode",
            fetchUrl: "users/getUsers", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const addParam = {
            screenName: "IDS_USERS", operation: "create", primaryKeyName: "nusercode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
        }

        const editParam = {
            screenName: "IDS_USERS", operation: "update", primaryKeyName: "nusercode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "Users", selectedObject: "SelectedUser"
        };

        // const userImgPath = fileViewURL + "/SharedFolder/FileUpload/" + this.props.Login.masterData.UserImagePath;
        // const signImgPath = fileViewURL + "/SharedFolder/FileUpload/" + this.props.Login.masterData.SignImagePath;

        //console.log("signImgPath:", this.props.Login.masterData);
        //const userImgPath = this.props.Login.settings && this.props.Login.settings[6] + this.props.Login.masterData.UserImagePath;
        //const signImgPath = this.props.Login.settings && this.props.Login.settings[6] + this.props.Login.masterData.SignImagePath;
       
        //const userImgPath = this.props.Login.settings && this.props.Login.settings[27] + this.props.Login.masterData.UserImagePath;
        //const signImgPath = this.props.Login.settings && this.props.Login.settings[28] + this.props.Login.masterData.SignImagePath;

        const signImgPath = this.props.Login.settings && this.props.Login.settings[27] + this.props.Login.masterData.SignImagePath;
        const userImgPath = this.props.Login.settings && this.props.Login.settings[28] + this.props.Login.masterData.UserImagePath;
      
        //console.log("signImgPath:", signImgPath);
        const mandatoryFields = [{ "idsName": "IDS_LOGINID", "dataField": "sloginid", "alertSuffix": this.props.intl.formatMessage({ id: "IDS_WITHOUTSPACE" }), "validateFunction": validateLoginId, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_LASTNAME", "dataField": "slastname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        //    { "idsName": "IDS_INITIAL", "dataField": "sempid" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_DEPARTMENT", "dataField": "ndeptcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_EMAIL", "dataField": "semail", "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }), "validateFunction": validateEmail, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        ];
        if (this.props.Login.operation === "create") {
            mandatoryFields.push({ "idsName": "IDS_SITE", "dataField": "usersite", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
            mandatoryFields.push({ "idsName": "IDS_USERROLE", "dataField": "nuserrolecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
        }
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                <Row noGutters>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        {/* <Row noGutters>
                            <Col md={12}> */}
                        {/* <div className="list-fixed-wrap"> */}
                        <ListMaster
                            screenName={this.props.intl.formatMessage({ id: "IDS_USERS" })}
                            masterData={this.props.Login.masterData}
                            userInfo={this.props.Login.userInfo}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Users}
                            getMasterDetail={(user) => this.props.getUserDetail(user, this.props.Login.userInfo, this.props.Login.masterData)}
                            selectedMaster={this.props.Login.masterData.SelectedUser}
                            primaryKeyField="nusercode"
                            mainField="susername"
                            firstField="sloginid"
                            secondField="sactivestatus"
                            filterColumnData={this.props.filterColumnData}
                            filterParam={filterParam}
                            userRoleControlRights={this.state.userRoleControlRights}
                            addId={addId}
                            searchRef={this.searchRef}
                            reloadData={this.reloadData}
                            openModal={() => this.props.getUserComboService(addParam)}
                            isMultiSelecct={false}
                            hidePaging={false}
                            isClearSearch={this.props.Login.isClearSearch}
                        />
                        {/* </div>
                        </Col></Row> */}
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
                        {/* <Row>
                            <Col md={12}> */}
                        <ContentPanel className="panel-main-content">
                            <Card className="border-0">
                                {this.props.Login.masterData.Users && this.props.Login.masterData.Users.length > 0 && this.props.Login.masterData.SelectedUser ?
                                    <>
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.SelectedUser.sloginid}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">

                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                            {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                            {this.props.Login.masterData.SelectedUser.sactivestatus}
                                                            {/* <FormattedMessage id= {this.props.Login.masterData.SelectedUser.sactivestatus}/> */}

                                                        </span>
                                                    </h2>
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <div className="d-inline">
                                                        <Nav.Link name="editUser" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={() => this.props.getUserComboService(editParam)}
                                                        >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>

                                                        {/* <Nav.Link name="viewImage" //hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEWIMAGE" })}
                                                            onClick={() => this.props.viewUserImage({ selectedUser: this.props.Login.masterData.SelectedUser, userInfo: this.props.Login.userInfo, masterData: this.props.Login.masterData })}
                                                        >
                                                            <FontAwesomeIcon icon={faUser} />
                                                        </Nav.Link> */}

                                                        <Nav.Link name="deleteUser" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            // data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            {/* <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        title={this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DELETECONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        //hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        handleClickDelete={() => this.deleteOrRetireUser("Users", this.props.Login.masterData.SelectedUser,
                                                                            "delete", deleteId)}
                                                                    /> */}
                                                        </Nav.Link>
                                                        <Nav.Link name="retireUser" className="btn btn-circle outline-grey mr-2"
                                                            hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={() => this.deleteOrRetireUser("Users", this.props.Login.masterData.SelectedUser,
                                                                "retire", retireId)}>
                                                            <FontAwesomeIcon icon={faUserTimes} />
                                                        </Nav.Link>
                                                    </div>
                                                    {/* </Tooltip> */}
                                                </div>

                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            {/* <Card.Text> */}

                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_EMPID" message="Emp Id" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.sempid === null || this.props.Login.masterData.SelectedUser.sempid.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sempid}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_DATEOFJOIN" message="Date Of Join" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.sdateofjoin === null || this.props.Login.masterData.SelectedUser.sdateofjoin.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sdateofjoin}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_DEPARTMENT" message="Division" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.sdeptname === null || this.props.Login.masterData.SelectedUser.sdeptname.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sdeptname}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_DESIGNATION" message="Designation" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.ndesignationcode === -1 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sdesignationname}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS1" message="Address1" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.saddress1}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS2" message="Address2" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.saddress2 === null || this.props.Login.masterData.SelectedUser.saddress2.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.saddress2}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_ADDRESS3" message="Address3" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.saddress3 === null || this.props.Login.masterData.SelectedUser.saddress3.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.saddress3}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_QUALIFICATION" message="Qualification" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.squalification === null || this.props.Login.masterData.SelectedUser.squalification.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.squalification}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BLOODGROUP" message="Blood Group" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.sbloodgroup === null || this.props.Login.masterData.SelectedUser.sbloodgroup.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sbloodgroup}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_JOBDESCRIPTION" message="Job Description" /></FormLabel>
                                                        <ReadOnlyText>
                                                            {this.props.Login.masterData.SelectedUser.sjobdescription === null || this.props.Login.masterData.SelectedUser.sjobdescription.length === 0 ? '-' :
                                                                this.props.Login.masterData.SelectedUser.sjobdescription}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_EMAIL" message="Email" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.semail}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_PHONENO" message="Phone No" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.sphoneno}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_MOBILENO" message="Mobile No" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.smobileno === null || this.props.Login.masterData.SelectedUser.smobileno.length === 0 ? '-' :
                                                            this.props.Login.masterData.SelectedUser.smobileno}
                                                        </ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_COUNTRY" message="Country" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.scountryname}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_LOCKSTATUS" message="Lock Status" /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedUser.slockstatus}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="horizontal-line"></div>
                                                </Col>
                                            </Row>
                                             <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SSIGNIMGNAME" message="Signature Image" /></FormLabel>
                                                            {this.props.Login.masterData.SignImagePath === null ? "-" :
                                                                <a href={signImgPath} download>
                                                                    <Image src={signImgPath}
                                                                        width={100} height={75}
                                                                        rounded
                                                                        //onClick={() => window.open(signImgPath, '_blank')}
                                                                        //onClick={()=>this.downloadImage(this.props.Login.masterData.SignImagePath)}
                                                                        title={this.props.Login.masterData.SelectedUser.ssignimgname} />
                                                                </a>
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SUSERIMGNAME" message="User Image" /></FormLabel>
                                                            {this.props.Login.masterData.UserImagePath === null ? "-" :
                                                                <a href={userImgPath} download>
                                                                    <Image src={userImgPath}
                                                                        width={100} height={75}
                                                                        rounded
                                                                        //onClick={() => window.open(userImgPath, '_blank')}
                                                                        //onClick={()=>this.downloadImage(this.props.Login.masterData.UserImagePath)}
                                                                        title={this.props.Login.masterData.SelectedUser.suserimgname} />
                                                                </a>}

                                                        </FormGroup>
                                                    </Col>
                                                </Row> 
                                                {/* </Card.Text> */}
                                            <UserTabs
                                                operation={this.props.Login.operation}
                                                inputParam={this.props.Login.inputParam}
                                                screenName={this.props.Login.screenName}
                                                userInfo={this.props.Login.userInfo}
                                                masterData={this.props.Login.masterData}
                                                crudMaster={this.props.crudMaster}
                                                errorCode={this.props.Login.errorCode}
                                                masterStatus={this.props.Login.masterStatus}
                                                openChildModal={this.props.Login.openChildModal}
                                                roleList={this.props.Login.roleListUserMultiRole}
                                                userRoleList={this.props.Login.userRoleList || []}
                                                deputyUserList={this.props.Login.deputyUserList || []}
                                                updateStore={this.props.updateStore}
                                                selectedRecord={this.props.Login.selectedRecord}
                                                getUserMultiRoleComboDataService={this.props.getUserMultiRoleComboDataService}
                                                getUserMultiDeputyComboDataService={this.props.getUserMultiDeputyComboDataService}
                                                getUserSiteDetail={this.props.getUserSiteDetail}
                                                getUserSiteComboService={this.props.getUserSiteComboService}
                                                siteList={this.props.Login.siteList || []}
                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                loadEsign={this.props.Login.loadEsign}
                                                controlMap={this.state.controlMap}
                                                selectedId={this.props.Login.selectedId}
                                                dataState={this.props.Login.dataState}
                                            />

                                        </Card.Body>
                                    </>
                                    : ""
                                }
                            </Card>
                        </ContentPanel>
                    </Col></Row>
                {/* </Col>
                </Row> */}
            </div>

            {/* End of get display*/}

            {/* Start of Modal Sideout for User Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.props.Login.openModal ?
                <SlideOutModal show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.operation === "view" ? "" : this.props.Login.screenName}
                    showSaveContinue={true}
                    onSaveClick={this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}
                    hideSave={this.props.Login.operation === "view" ? true : false}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : this.props.Login.operation === "view" ?
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_SSIGNIMGNAME" message="Signature Image" /></FormLabel>
                                        {this.props.Login.masterData.SignImagePath === null ? "-" :
                                            <a href={signImgPath} download>
                                                <Image src={signImgPath}
                                                    width={200} height={150}
                                                    rounded
                                                    //onClick={() => window.open(signImgPath, '_blank')}
                                                    //onClick={()=>this.downloadImage(this.props.Login.masterData.SignImagePath)}
                                                    title={this.props.Login.masterData.SelectedUser.ssignimgname} />
                                            </a>
                                        }
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_SUSERIMGNAME" message="User Image" /></FormLabel>
                                        {this.props.Login.masterData.UserImagePath === null ? "-" :
                                            <a href={userImgPath} download>
                                                <Image src={userImgPath}
                                                    width={200} height={150}
                                                    rounded
                                                    //onClick={() => window.open(userImgPath, '_blank')}
                                                    //onClick={()=>this.downloadImage(this.props.Login.masterData.UserImagePath)}
                                                    title={this.props.Login.masterData.SelectedUser.suserimgname} />
                                            </a>}

                                    </FormGroup>
                                </Col>
                            </Row>

                            : <AddUser
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                handleDateChange={this.handleDateChange}
                                designationList={this.props.Login.designationList || []}
                                departmentList={this.props.Login.departmentList || []}
                                countryList={this.props.Login.countryList || []}
                                siteList={this.props.Login.siteList || []}
                                roleList={this.props.Login.roleList || []}
                                selectedUser={this.props.Login.masterData.SelectedUser || {}}
                                operation={this.props.Login.operation}
                                userLogged={this.props.Login.userLogged}
                                inputParam={this.props.Login.inputParam}
                                onDropImage={this.onDropImage}
                                deleteUserFile={this.deleteUserFile}
                                actionType={this.state.actionType}
                                emailRef={this.emailRef}
                                userInfo={this.props.Login.userInfo}
                            //fileToDelete={this.state.fileToDelete}
                            />}
                /> : ""}
            {/* End of Modal Sideout for User Creation */}
        </>
        );
    }

    componentDidUpdate(previousProps) {
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
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteOrRetireUser("Users", this.props.Login.masterData.SelectedUser, "delete", deleteId));
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "retire") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};

                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
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
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    // downloadImage = (filePath) =>{
    //     document.getElementById("download_data").setAttribute("href", filePath);
    //     document.getElementById("download_data").click();
    // }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else if (event.target.name === "nlockmode")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

        }
        else {
            if (event.target.name === "sphoneno" || event.target.name === "smobileno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else if (event.target.name === "sloginid") {
                if (event.target.value !== "") {
                    if (validateLoginId(event.target.value)) {
                        selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                    }
                }
                else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    // validateEmail =(event, emailRef)=>{
    //     if (event.target.value !== ""){
    //         const valid = validateEmail(event.target.value);
    //         if (valid){
    //             const selectedRecord = this.state.selectedRecord || {};
    //             selectedRecord[event.target.name] = event.target.value; 
    //             this.setState({selectedRecord}); 
    //         }    
    //         else{
    //             //emailRef.current.focus();
    //             toast.info("invalid email")
    //         }            
    //         //event.target.value = validateEmail(event.target.value);
    //         // selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value:selectedRecord[event.target.name];
    //     }
    // }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onDropImage = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });

    }




    onSaveClick = (saveType, formRef) => {

        let userData = [];
        userData["userinfo"] = this.props.Login.userInfo;

        const signImageFile = this.state.selectedRecord.ssignimgname;
        const userImageFile = this.state.selectedRecord.suserimgname;

        let isSignFileEdited = transactionStatus.NO;
        let isUserFileEdited = transactionStatus.NO;
        const formData = new FormData();
        let signImageCount = 0;
        let userImageCount = 0;
        let userfile = {};

        let postParam = undefined;

        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "Users", selectedObject: "SelectedUser", primaryKeyField: "nusercode" };
            userData["users"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

            this.userFieldList.map(item => {
                return userData["users"][item] = typeof this.state.selectedRecord[item] === "string" ? Lims_JSON_stringify(this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "", false) : this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            })
            if (userData["users"]["esignpassword"]) {
                delete userData["users"]["esignpassword"]
                delete userData["users"]["esigncomments"]
                delete userData["users"]["esignreason"]
                delete userData["users"]["agree"]
            }
        }
        else {
            //add               
            userData["users"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            this.userFieldList.map(item => {
                return userData["users"][item] = typeof this.state.selectedRecord[item] === "string" ? Lims_JSON_stringify(this.state.selectedRecord[item], false) : this.state.selectedRecord[item]
            });

            userData["usermultirole"] = {
                "nuserrolecode": this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : "",
                "ndefaultrole": transactionStatus.YES, "ntransactionstatus": transactionStatus.ACTIVE
            }

            userData["userssite"] = {
                "nsitecode": this.state.selectedRecord["usersite"] ? this.state.selectedRecord["usersite"].value : "",
                "ndefaultsite": transactionStatus.YES
            }

            formData.append("usermultirole", JSON.stringify(userData["usermultirole"]));
            formData.append("userssite", JSON.stringify(userData["userssite"]));

        }
        if (userData["users"].hasOwnProperty('esignpassword')) {
            if (userData["users"]['esignpassword'] === '') {
                delete userData["users"]['esigncomments']
                delete userData["users"]['esignpassword']
                delete userData["users"]['esignreason']
            }
        }
        userData["users"]["ndesignationcode"] = this.state.selectedRecord["ndesignationcode"] ? this.state.selectedRecord["ndesignationcode"].value : transactionStatus.NA;
        userData["users"]["ndeptcode"] = this.state.selectedRecord["ndeptcode"] ? this.state.selectedRecord["ndeptcode"].value : transactionStatus.NA;
        userData["users"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : transactionStatus.NA;
        userData["users"]["nlockmode"] = this.state.selectedRecord["nlockmode"] ? this.state.selectedRecord["nlockmode"] : transactionStatus.UNLOCK;
        userData["users"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.ACTIVE;


        if (userData["users"]["ddateofjoin"] !== undefined
            && userData["users"]["ddateofjoin"] !== null && userData["users"]["ddateofjoin"] !== "") {
            userData["users"]["ddateofjoin"] = formatDate(userData["users"]["ddateofjoin"]);
        }
        if (signImageFile && Array.isArray(signImageFile) && signImageFile.length > 0) {

            const splittedFileName = signImageFile[0].name.split('.');
            const fileExtension = signImageFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.ssignimgname === "" ?
                this.state.selectedRecord.ssignimgname : create_UUID() + '.' + fileExtension;

            userfile["ssignimgname"] = Lims_JSON_stringify(signImageFile[0].name, false);
            userfile["ssignimgftp"] = uniquefilename;
            formData.append("SignImage_uploadedFile" + signImageCount, signImageFile[0]);
            formData.append("SignImage_uniquefilename" + signImageCount, uniquefilename);
            signImageCount++;
            isSignFileEdited = transactionStatus.YES;
            userData["users"]["ssignimgname"] = "";
        }
        else {
            if (this.props.Login.operation === "update") {

                if (signImageFile === "" || signImageFile.length === 0) {
                    if (userData["users"]["ssignimgftp"] !== null && userData["users"]["ssignimgftp"] !== "") {
                        isSignFileEdited = transactionStatus.YES;
                    }
                    userfile["ssignimgname"] = null;
                    userfile["ssignimgftp"] = null;
                    userData["users"]["ssignimgname"] = "";
                }
                else {
                    userfile["ssignimgname"] = Lims_JSON_stringify(userData["users"]["ssignimgname"], false);
                    userfile["ssignimgftp"] = userData["users"]["ssignimgftp"];
                }
            }
        }

        if (userImageFile && Array.isArray(userImageFile) && userImageFile.length > 0) {

            const splittedFileName = userImageFile[0].name.split('.');
            const fileExtension = userImageFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.suserimgname === "" ?
                this.state.selectedRecord.suserimgname : create_UUID() + '.' + fileExtension;

            userfile["suserimgname"] = Lims_JSON_stringify(userImageFile[0].name, false);
            userfile["suserimgftp"] = uniquefilename;
            formData.append("UserImage_uploadedFile" + userImageCount, userImageFile[0]);
            formData.append("UserImage_uniquefilename" + userImageCount, uniquefilename);
            userImageCount++;
            isUserFileEdited = transactionStatus.YES;
            userData["users"]["suserimgname"] = "";
        }
        else {
            if (this.props.Login.operation === "update") {
                //console.log("userImageFile:", userImageFile);
                if (userImageFile === "" || userImageFile.length === 0) {
                    //isFileEdited = transactionStatus.YES;
                    if (userData["users"]["suserimgftp"] !== null && userData["users"]["suserimgftp"] !== "") {
                        isUserFileEdited = transactionStatus.YES;
                    }
                    userfile["suserimgname"] = null;
                    userfile["suserimgftp"] = null;
                    userData["users"]["suserimgname"] = "";
                }
                else {
                    userfile["suserimgname"] = Lims_JSON_stringify(userData["users"]["suserimgname"], false);
                    userfile["suserimgftp"] = userData["users"]["suserimgftp"];
                }
            }
        }

        // const controlMaster = [{ncontrolcode:517, scontrolname:'UserImage', ssubfolder:"users"},
        //                         {ncontrolcode:518, scontrolname:'SignImage', ssubfolder:""}]

        formData.append("isSignFileEdited", isSignFileEdited);
        formData.append("isUserFileEdited", isUserFileEdited);
        formData.append("UserImage_filecount", userImageCount);
        formData.append("SignImage_filecount", signImageCount);
        formData.append("filecount", signImageCount + userImageCount);
        formData.append("controlcodelist", JSON.stringify(this.props.Login.uploadControlList));
        formData.append("userfile", JSON.stringify(userfile));
        // formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
        formData.append("users", JSON.stringify(userData["users"]));

        let clearSelectedRecordField =[
            { "idsName": "IDS_LOGINID", "dataField": "sloginid", "width": "200px" ,"controlType": "textbox","isClearField":true},
            { "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_LASTNAME", "dataField": "slastname", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_EMPID", "dataField": "sempid", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_ADDRESS2", "dataField": "saddress2", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_ADDRESS3", "dataField": "saddress3", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_QUALIFICATION", "dataField": "squalification", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_BLOODGROUP", "dataField": "sbloodgroup", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_JOBDESCRIPTION", "dataField": "sjobdescription", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_ISACTIVE", "dataField": "ntransactionstatus", "width": "100px","isClearField":true,"preSetValue":1},
            { "idsName": "IDS_LOCKMODE", "dataField": "nlockmode", "width": "100px","isClearField":true,"preSetValue":6},
            
        ]

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Users",
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
                    //ALPD-1628(while saving the image and sign,audit trail is not captured the respective language)
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch,
            selectedRecord:{...this.state.selectedRecord}
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
            this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
        }

    }

    // deleteUserFile = (fieldName)=>{
    //     let selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[fieldName] = "";
    //     this.setState({ selectedRecord, actionType:"delete" })
    // }

    deleteUserFile = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

    deleteUserFile1 = (event, name, file) => {
        // let selectedRecord = this.state.selectedRecord || {};

        // if (typeof selectedRecord[fieldName] === "string"){
        //     selectedRecord[fieldName] = "";
        // }
        // else{
        //     if (selectedRecord[fieldName].length > 1){
        //         const fileList = selectedRecord[fieldName].filter(fileItem=>{

        //           // return fileItem.name === file.name ?  fileItem.name = "" : ""})
        //            return fileItem.name !== file.name})
        //         selectedRecord[fieldName] = fileList;  
        //     }
        //     else{
        //         selectedRecord[fieldName] = "";
        //     }
        // }

        // this.setState({ selectedRecord, actionType:"delete", fileToDelete:file.name });
    }

    deleteOrRetireUser = (methodUrl, selectedUser, operation, ncontrolCode) => {
        if (selectedUser.ntransactionstatus === transactionStatus.RETIRED) {
            let message = "IDS_CANNOTDELETERETIREDUSER";
            if (operation === "retire") {
                message = "IDS_USERALREADYRETIRED";
            }
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {

            const postParam = {
                inputListName: "Users", selectedObject: "SelectedUser",
                primaryKeyField: "nusercode",
                primaryKeyValue: selectedUser.nusercode,
                fetchUrl: "users/getUsers",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "users": selectedUser
                },
                operation,
                isClearSearch: this.props.Login.isClearSearch,
                selectedRecord:{...this.state.selectedRecord}
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_USERS", operation
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

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
        this.searchRef.current.value = "";

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "users",
            methodUrl: "Users",
            displayName: "IDS_USERS",
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch

        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getUserDetail, getUserComboService, getUserMultiRoleComboDataService, viewUserImage,
    getUserMultiDeputyComboDataService, getUserSiteDetail, getUserSiteComboService, filterColumnData
})(injectIntl(Users));

