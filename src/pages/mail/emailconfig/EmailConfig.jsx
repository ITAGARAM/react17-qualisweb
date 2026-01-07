import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddEmailConfig from './AddEmailConfig';
import EmailConfigTab from './EmailConfigTab';
import AddUsersEmailConfig from './AddUsersEmailConfig';
import Esign from '../../audittrail/Esign';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { getEmailConfigDetail, callService, crudMaster, fetchEmailConfigById,reloadMailConfig, getUserEmailConfig, getUserRoles, deleteEmailUserRole,
    getEmailUserOnUserRole, filterColumnData, validateEsignCredential, openEmailConfigModal, getFormControls,getSchedulerForEmailScreen,getEmailUserQuery, updateStore, getEmailUsers } from '../../../actions';
import { constructOptionList, getControlMap, showEsign } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { mailScheduleType, transactionStatus } from '../../../components/Enumeration';
import { ContentPanel, ReadOnlyText, } from '../../../components/App.styles';
import { faPencilAlt, faTrashAlt, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListMaster from '../../../components/list-master/list-master.component';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { process } from '@progress/kendo-data-query';
import EmailConfigFilter from './EmailConfigFilter';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailConfig extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        // this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.userColumnList = [];
        this.fieldList = [];

        this.state = {
            availableDatas: "",
            availableList: "",
            dataSource: [], masterStatus: "", error: "", selectedRecord: {},
            isOpen: false,
            emailHost: [],
            emailTemplate: [],
            emailTypeList: [],//Added by sonia on 30th Oct 2025 for jira id:BGSI-155
            emailScreen: [],
            formControls:[],
            emailScreenScheduler:[],               
            emailUserQuery : [],
            //ActionType: [],           
           // EmailType: [], //Added by sonia on 03th Sept 2025 for jira id:SWSM-12  
            userRoleControlRights: [],
            controlMap: new Map(),
            dataState:{
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
            },
            dataResult: [],
            dataStateUserRole:{
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
            },
            dataResultUserRole: [],
            dataStateUsers:{
                skip: 0,
                take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
            },
            dataResultUsers: []
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["shostname", "sscreenname", "scontrolids", "sformname", "stemplatename"];

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
    };

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data.EmailConfig ? this.state.data.EmailConfig : [], event.dataState),
            dataState: event.dataState
        });
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    dataStateUserRoleChange = (event) => {
        this.setState({
            dataResultUserRole: process(this.state.gridUserRole ? this.state.gridUserRole : [], event.dataState),
            dataStateUserRole: event.dataState
        });
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    dataStateUsersChange = (event) => {
        this.setState({
            dataResultUsers: process(this.state.gridUsers ? this.state.gridUsers : [], event.dataState),
            dataStateUsers: event.dataState
        });
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    addUserRole = () => {
        this.props.getUserRoles("IDS_ROLE", "create", this.props.Login.userInfo, this.state.controlMap.get("AddEmailConfigUsers").ncontrolcode, this.state.selectedRecord);
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    addUsers = () => {
        const { nuserrolecode } = this.state.selectedRecord;
        const selectedUserRole = this.state.selectedUserRole ? this.state.selectedUserRole : nuserrolecode && nuserrolecode.length > 0 ? nuserrolecode[0].item : null;
        if(selectedUserRole && this.state.gridUserRole && this.state.gridUserRole.length > 0) {
            this.props.getEmailUsers("IDS_EMAILUSER", this.state.selectedUserRole, this.props.Login.userInfo);
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
        }
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    deleteUserRole = (event) => {
        let { selectedRecord, selectedUserRole, userRoleUsers, gridUserRole, gridUsers, dataStateUserRole, dataResultUserRole } = this.state;
        selectedRecord['nuserrolecode'] = [ ...gridUserRole, ...selectedRecord['nuserrolecode'] ].filter(
            userRole => userRole.item.nuserrolecode !== event.nuserrolecode
        );
        selectedRecord['nuserrolecode'] = [ ...new Map(selectedRecord['nuserrolecode'].map(role => [role.item.nuserrolecode, role])).values() ];
        if (selectedUserRole.nuserrolecode === event.nuserrolecode && selectedRecord['nuserrolecode'] && selectedRecord['nuserrolecode'].length > 0) {
            selectedUserRole = selectedRecord['nuserrolecode'][0]['item'];
        }
        gridUsers = selectedUserRole && selectedUserRole.nuserrolecode !== event.nuserrolecode ? userRoleUsers[selectedUserRole.nuserrolecode] : []
        gridUserRole = selectedRecord['nuserrolecode'];
        selectedRecord["nusercode"] = gridUsers;
        userRoleUsers[event.nuserrolecode] = [];
        if (dataResultUserRole.data) {
            if (dataResultUserRole.data.length === 1) {
                let skipcount = dataStateUserRole.skip > 0 ? (dataStateUserRole.skip - dataStateUserRole.take) :
                    dataStateUserRole.skip
                dataStateUserRole = { skip: skipcount, take: dataStateUserRole.take }
                dataResultUserRole = process(this.state.gridUserRole ? this.state.gridUserRole : [], dataStateUserRole)
            }
        }
        this.setState({ selectedRecord, selectedUserRole, gridUserRole, gridUsers, dataStateUserRole, dataResultUserRole, userRoleUsers });
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    deleteUser = (event) => {
        let { selectedRecord, userRoleUsers, gridUsers, dataStateUsers, dataResultUsers } = this.state;
        selectedRecord['nusercode'] = [ ...gridUsers, ...selectedRecord['nusercode'] ].filter(
            user => user.item.nusercode !== event.nusercode
        );
        selectedRecord['nusercode'] = [ ...new Map(selectedRecord['nusercode'].map(user => [user.item.nusercode, user])).values() ];
        const index = this.state.selectedUserRole && this.state.selectedUserRole.nuserrolecode || 0;
        userRoleUsers[index] = selectedRecord['nusercode'];
        gridUsers = selectedRecord['nusercode'];
        if (this.state.dataResultUsers.data) {
            if (this.state.dataResultUsers.data.length === 1) {
                let skipcount = dataStateUsers.skip > 0 ? (dataStateUsers.skip - dataStateUsers.take) :
                    dataStateUsers.skip
                dataStateUsers = { skip: skipcount, take: dataStateUsers.take }
                dataResultUsers = process(this.props.Login.masterData.users ? this.props.Login.masterData.users : [], dataStateUsers)
            }
        }
        this.setState({ selectedRecord, userRoleUsers, gridUsers, dataStateUsers, dataResultUsers });
    }

    // Added by Gowtham on 29th Oct 2025 for BGSI-147
    userRoleClick = (event) => {
        const selectedUserRole = event.dataItem;
        let { selectedRecord, gridUsers, userRoleUsers } = this.state;
        gridUsers = userRoleUsers && userRoleUsers[selectedUserRole.nuserrolecode] ? userRoleUsers[selectedUserRole.nuserrolecode] : []
        selectedRecord["nusercode"] = gridUsers;
        this.setState({ selectedRecord, selectedUserRole, gridUsers });
    }

    ConfirmDelete = (screenname, SelectedEmailConfig, operation, ncontrolcode) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(//screenname, SelectedEmailConfig, 
                operation, ncontrolcode));
    };

    closeModal = () => {
        let { loadEsign, openModal, openChildModel, selectedRecord, screenName  } = this.props.Login;
        let { gridUserRole, gridUsers, selectedUserRole } = this.state;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
            }
        // Added else if block by Gowtham on 29th Oct 2025 for BGSI-147
        } else if (openChildModel && ( screenName === "IDS_ROLE" || screenName === "IDS_EMAILUSER")) {
            screenName = "IDS_MAILCONFIG"
            openChildModel = false;
            selectedRecord = { ...this.state.selectedRecord, nuserrolecode: this.state.gridUserRole, nusercode: this.state.gridUsers };
            // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
            if (selectedUserRole && this.state.gridUserRole && this.state.gridUserRole.length > 0 
                && !this.state.gridUserRole.some(userRole => userRole.item.nuserrolecode === selectedUserRole.nuserrolecode)) {
                selectedUserRole = this.state.gridUserRole[0].item;
            }
        } else {
            openModal = false;
            selectedRecord = {};
            gridUserRole= [];    // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
            gridUsers= [];    // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
            selectedUserRole= screenName === "IDS_USERS" ? selectedUserRole :   // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
                this.props.Login.masterData.SelectedEmailConfig && this.props.Login.masterData.emailUserRoles ? this.props.Login.masterData.emailUserRoles[0] : null
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { 
                openModal, openChildModel, loadEsign, selectedRecord, selectedId: null, 
                screenName, gridUserRole, gridUsers, selectedUserRole
            }
        }
        this.props.updateStore(updateInfo);
    }


    render() {
        this.extractedColumnList = [
            { "controlType": "textbox", "idsName": "IDS_USERS", "dataField": "susername", "width": "200px" },
            { "controlType": "textbox", "idsName": "IDS_EMAILID", "dataField": "semail", "width": "200px" },
        ];

        // Added by Gowtham on Oct 29 2025 for BGSI-147 - start
        const emailUsers = this.props.Login.users || [];
        let comboUsers = emailUsers && this.state.selectedUserRole ? emailUsers.filter(item => 
            item.nuserrolecode === this.state.selectedUserRole.nuserrolecode
        ) : emailUsers;
        comboUsers = emailUsers ? [ ...new Map(emailUsers.map(item => [item.nusercode, item])).values() ] : [];
        // end

        let mandatoryFields = [
            { "mandatory": true, "idsName": "IDS_HOSTNAME", "dataField": "nemailhostcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_SCREENNAME", "dataField": "nemailscreencode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_TEMPLATENAME", "dataField": "nemailtemplatecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_EMAILQUERY", "dataField": "nemailuserquerycode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }, //Added by sonia on 18th Nov 2025 for jira id:BGSI-234
        ];

        if(this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.CONTROL_BASED_MAIL){
            mandatoryFields.push ({ "mandatory": true, "idsName": "IDS_CONTROLNAME", "dataField": "ncontrolcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
        }
        if(this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.SCHEDULE_BASED_MAIL){
            mandatoryFields.push({ "mandatory": true, "idsName": "IDS_EMAILSCREENSCHEDULERNAME", "dataField": "nemailscreenschedulercode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" });
        }

        // Added by Gowtham on Oct 29 2025 for BGSI-147
        if (this.props.Login.screenName === "IDS_USERS" || this.props.Login.screenName === "IDS_EMAILUSER") {
            mandatoryFields = [{ "mandatory": true, "idsName": "IDS_USERS", "dataField": "nusercode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
        }

        // Added by Gowtham on Oct 29 2025 for BGSI-147
        if (this.props.Login.screenName === "IDS_ROLE") {
            mandatoryFields = [{ "mandatory": true, "idsName": "IDS_ROLE", "dataField": "nuserrolecode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
        }

        const addId = this.props.Login.inputParam && this.state.controlMap.has("AddEmailConfig")
            && this.state.controlMap.get("AddEmailConfig").ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("EditEmailConfig")
            && this.state.controlMap.get("EditEmailConfig").ncontrolcode;

        const deleteID = this.props.Login.inputParam && this.state.controlMap.has("DeleteEmailConfig")
            && this.state.controlMap.get("DeleteEmailConfig").ncontrolcode;

        const addUserId = this.props.Login.inputParam && this.state.controlMap.has("AddEmailConfigUsers")
            && this.state.controlMap.get("AddEmailConfigUsers").ncontrolcode;

        // Added by Gowtham on Nov 1 2025 for BGSI-147
        const addUserRoleId = this.props.Login.inputParam && this.state.controlMap.has("AddEmailConfigUserRoles")
            && this.state.controlMap.get("AddEmailConfigUserRoles").ncontrolcode;

        const editParam = {
            SelectedEmailConfig: this.props.Login.masterData.SelectedEmailConfig,
            nemailtypecode : this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode,
            screenName: "IDS_MAILCONFIG", primaryKeyField: "nemailconfigcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        const deleteParam = { operation: "delete" };

        const filterParam = {
            inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig", primaryKeyField: "nemailconfigcode",
            fetchUrl: "emailconfig/getEmailConfig", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4">
                <Row noGutters={true}>
                    <Col md={4}>
                        <Row noGutters={true}><Col md={12}>
                            <div className="list-fixed-wrap">
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_MAILCONFIG" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.EmailConfig}
                                    getMasterDetail={(emailconfig) => this.props.getEmailConfigDetail(emailconfig, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedEmailConfig}
                                    primaryKeyField="nemailconfigcode"
                                    mainField="stemplatename"
                                    firstField="sscreenname"
                                    secondField="scontrolids"
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    openModal={() => this.props.openEmailConfigModal("IDS_MAILCONFIG", "create", this.props.Login.userInfo, addId)}
                                    isMultiSelecct={false}
                                    hidePaging={true}
                                    showFilterIcon={true}
                                    showFilter={this.props.Login.showFilter}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.reloadData}
                                    callCloseFunction={true}
                                    filterComponent={[
                                        {
                                            "IDS_EMAILCONFIGFILTER":
                                            <EmailConfigFilter
                                                emailType={this.state.emailTypeList || []}
                                                emailTypeValue={this.props.Login.masterData && this.props.Login.masterData.emailTypeValue || {}}
                                                onComboChange={this.onComboChangeFilter}
                                                userInfo={this.props.Login.userInfo}
                                />
                                        }
                                    ]}
                                />
                            </div>
                        </Col></Row>
                    </Col>
                    <Col md={8}>
                        <Row><Col md={12}>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.EmailConfig && this.props.Login.masterData.EmailConfig.length > 0 && this.props.Login.masterData.SelectedEmailConfig ?
                                        <>
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedEmailConfig.stemplatename}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category title-grid-wrap-width-md">
                                                        <div>
                                                            <h6 className="title-grid-width-md product-title-sub flex-grow-1">
                                                                {this.props.Login.masterData.SelectedEmailConfig.shostname}{' | '}{this.props.Login.masterData.SelectedEmailConfig.senablestatus}
                                                                {/* <FormattedMessage id= {this.props.Login.masterData.SelectedUser.sactivestatus}/> */}
                                                            </h6>
                                                        </div>

                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <div className="product-category" style={{ float: "right" }}>
                                                            <Nav.Link name="editUser"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                //    data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(editID) === -1}
                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                onClick={() => this.props.fetchEmailConfigById(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>
                                                            <Nav.Link name="deleteUser"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                //   data-for="tooltip_list_wrap"
                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteID) === -1}
                                                                onClick={() => this.ConfirmDelete("IDS_MAILCONFIG", this.props.Login.masterData.SelectedEmailConfig, "delete", deleteID)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog 
                                                                name="deleteMessage" 
                                                                message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG"})}
                                                                doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}  
                                                                doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                icon={faTrashAlt}
                                                               // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                //hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                handleClickDelete={() => this.deleteRecord("IDS_MAILCONFIG", this.props.Login.masterData.SelectedEmailConfig, 
                                                                "delete", deleteID)} 
                                                            /> */}
                                                            </Nav.Link>
                                                        </div>
                                                        {/* </Tooltip> */}
                                                    </div>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_HOSTNAME" message="Host Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.shostname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_SCREENNAME" message="Screen Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sformname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MAILENABLE" message="Mail Enable" /></FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.SelectedEmailConfig.senablestatus}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        {/* Added by Gowtham on 27th Sept 2025 for jira id:SWSM-64 */}
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_SMSENABLE" message="SMS Enable" /></FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.SelectedEmailConfig.senablesmsstatus}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_FORMNAME" message="Form Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sformname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                        {/*Added by sonia on 03th Sept 2025 for jira id:SWSM-12*/}
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MAILTYPE" message="Mail Type" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.semailtypename}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        {this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.CONTROL_BASED_MAIL ?
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_CONTROLNAME" message="Control Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.scontrolids}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> :""}
                                                        {this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.SCHEDULE_BASED_MAIL ?
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MAILSCREENSCHEDULER" message="Mail Screen Scheduler Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sscheduletypename}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>:""}
                                                        

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_EMAILQUERY" message="Email Query" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sdisplayname === null ||
                                                                    this.props.Login.masterData.SelectedEmailConfig.sdisplayname.length === 0 ||
                                                                    this.props.Login.masterData.SelectedEmailConfig.sdisplayname === 'NA' ? '-' :
                                                                    this.props.Login.masterData.SelectedEmailConfig.sdisplayname}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_ACTIONTYPE" message="Action Type" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sactiontype}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                    </Row>
                                                </Card.Text>
                                                <EmailConfigTab
                                                    getUserEmailConfig={this.props.getUserEmailConfig}
                                                    addUserId={addUserId}
                                                    addUserRoleId={addUserRoleId} // Added by Gowtham on Nov 1 2025 for BGSI-147
                                                    userInfo={this.props.Login.userInfo}
                                                    inputParam={this.props.Login.inputParam}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    controlMap={this.state.controlMap}
                                                    masterData={{
                                                        "users": this.state.selectedUserRole && this.props.Login.masterData.users ? [ ...new Map(this.props.Login.masterData.users.filter(item => 
                                                                    item.nuserrolecode === this.state.selectedUserRole.nuserrolecode
                                                                ).map(item => [item.nusercode, item])).values() ] : [],
                                                    }}
                                                    //  crudMaster={this.props.crudMaster}
                                                    methodUrl="EmailConfigUsers"
                                                    deleteUsersRecord={this.deleteUsersRecord}
                                                    deleteUserRoleRecord={this.deleteUserRoleRecord}
                                                    deleteParam={deleteParam}
                                                    SelectedEmailConfig={this.props.Login.masterData.SelectedEmailConfig}
                                                    masterdata={this.props.Login.masterData}
                                                    // Added following props by Gowtham on Oct 29 2025 for BGSI-147 - start
                                                    operation={this.props.Login.operation}
                                                    selectedUserRole={this.props.Login.openModal ? null : this.state.selectedUserRole}
                                                    dataStateUserRole={this.state.dataStateUserRole}
                                                    dataStateUsers={this.state.dataStateUsers}
                                                    dataStateUserRoleChange={this.dataStateUserRoleChange}
                                                    dataStateUsersChange={this.dataStateUsersChange}
                                                    userRoleClick={(event) => this.props.getEmailUserOnUserRole(event.dataItem, this.props.Login.userInfo, this.props.Login.masterData)}
                                                    deleteUserRole={this.deleteUserRole}
                                                    deleteUser={this.deleteUser}
                                                    // end
                                                />
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col></Row>
                    </Col>
                </Row>
            </div>
            {this.props.Login.openModal &&
                <SlideOutModal
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.props.Login.screenName === "IDS_USERS" ? this.onUserSaveClick 
                        : this.props.Login.screenName === "IDS_ROLE" ? this.onUserRoleSaveClick // Added by Gowtham on Oct 30 2025 for BGSI-147
                        : this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign
                            operation={this.props.Login.operation}
                            formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : this.props.Login.screenName === "IDS_MAILCONFIG" ? <AddEmailConfig
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            emailHost={this.state.emailHost || []}
                            emailTemplate={this.state.emailTemplate || []}
                            emailTypeValue={this.props.Login.masterData && this.props.Login.masterData.emailTypeValue || {}}
                            emailScreen={this.state.emailScreen || []}                            
                            formControls={this.state.formControls} 
                            emailScreenScheduler={this.state.emailScreenScheduler}                   
                            emailUserQuery={this.state.emailUserQuery || []}
                            //actionType={this.state.ActionType || []}
                            //formName={this.state.FormName}
                            //emailType={this.state.EmailType || []}  //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
                            users={this.state.gridUsers ? this.state.gridUsers.map(user => user.item) : []} // Added by Gowtham on Oct 29 2025 for BGSI-147 - start
                            operation={this.props.Login.operation}
                            // Added following props by Gowtham on Oct 29 2025 for BGSI-147 - start
                            userRole={this.state.gridUserRole ? this.state.gridUserRole.map(user => user.item) : []}
                            selectedUserRole={this.state.selectedUserRole}
                            dataStateUserRole={this.state.dataStateUserRole}
                            dataStateUsers={this.state.dataStateUsers}
                            dataStateUserRoleChange={this.dataStateUserRoleChange}
                            dataStateUsersChange={this.dataStateUsersChange}
                            addUserRole={this.addUserRole}
                            addUsers={this.addUsers}
                            controlMap={this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            userInfo={this.props.Login.userInfo}
                            userRoleClick={this.userRoleClick}
                            deleteUserRole={this.deleteUserRole}
                            deleteUser={this.deleteUser}
                            // end
                        /> : <AddUsersEmailConfig
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            userRole={this.state.gridUserRole && this.state.gridUserRole.length > 0 ? this.props.Login.UserRoles && this.props.Login.UserRoles.filter(userRole => !this.state.gridUserRole.map(role => role.value).includes(userRole.nuserrolecode)) : this.props.Login.UserRoles || []}
                            users={this.state.gridUsers ? comboUsers && comboUsers.filter(user => !this.state.gridUsers.map(user => user.value).includes(user.nusercode)) : comboUsers}
                            operation={this.props.Login.operation}
                            screenName={this.props.Login.screenName}
                        />
                    }
                />
            }
        </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ userRoleControlRights, controlMap,
                    dataResult: process(this.props.Login.masterData.EmailConfig ? this.props.Login.masterData.EmailConfig : [], this.state.dataState),
                    dataResultUserRole: process(this.props.Login.masterData.emailUserRoles ? this.props.Login.masterData.emailUserRoles : [], this.state.dataStateUserRole),
                    dataResultUsers: process(this.props.Login.masterData.users ? this.props.Login.masterData.users : [], this.state.dataStateUsers)
                 });
            // Added by Gowtham on Oct 29 2025 for BGSI-147 - start
            } else {
                let { dataState, dataStateUserRole, dataStateUsers } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take };
                    dataStateUserRole = { skip: 0, take: this.state.dataStateUserRole.take };
                    dataStateUsers = { skip: 0, take: this.state.dataStateUsers.take };
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }
                // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
                if (this.state.dataResultUserRole.data) {
                    if (this.state.dataResultUserRole.data.length === 1) {
                        let skipcount = this.state.dataStateUserRole.skip > 0 ? (this.state.dataStateUserRole.skip - this.state.dataStateUserRole.take) :
                            this.state.dataStateUserRole.skip
                        dataStateUserRole = { skip: skipcount, take: this.state.dataStateUserRole.take }
                    }
                }
                // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
                if (this.state.dataResultUsers.data) {
                    if (this.state.dataResultUsers.data.length === 1) {
                        let skipcount = this.state.dataStateUsers.skip > 0 ? (this.state.dataStateUsers.skip - this.state.dataStateUsers.take) :
                            this.state.dataStateUsers.skip
                        dataStateUsers = { skip: skipcount, take: this.state.dataStateUsers.take }
                    }
                }
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.EmailConfig ? this.props.Login.masterData.EmailConfig : [], dataState),
                    dataState, dataResultUserRole: process(this.props.Login.masterData.emailUserRoles ? this.props.Login.masterData.emailUserRoles : [], dataStateUserRole),
                    dataStateUserRole, dataResultUsers: process(this.props.Login.masterData.users ? this.props.Login.masterData.users : [], dataStateUsers),
                    dataStateUsers,
                });
            }
            
            if(this.props.Login.masterData.emailType !== previousProps.Login.masterData.emailType){
                const emailTypeListMap = constructOptionList(this.props.Login.masterData.emailType || [], "nemailtypecode", "semailtypename", false, false, true);
                this.setState({emailTypeList : emailTypeListMap.get("OptionList")});
            }
            
            // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
            if (this.props.Login.masterData.emailUserRoles && this.props.Login.masterData.emailUserRoles.length > 0) {
                let { selectedUserRole } = this.state;
                selectedUserRole = this.props.Login.masterData.SelectedEmailConfig?.nemailconfigcode === previousProps.Login.masterData.SelectedEmailConfig?.nemailconfigcode
                                && this.props.Login.masterData.emailUserRoles && selectedUserRole 
                                && this.props.Login.masterData.emailUserRoles.some(userRole => userRole.nuserrolecode === selectedUserRole.nuserrolecode) ? 
                    selectedUserRole : this.props.Login.masterData.emailUserRoles[0];
                this.setState({ selectedUserRole });
            }
            // end
        }
        // Added openModal in condition by Gowtham on 29th Oct 2025 for BGSI-147
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord && (this.props.Login.openModal !== previousProps.Login.openModal || this.props.Login.openChildModel !== previousProps.Login.openChildModel)) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.emailHost !== previousProps.Login.emailHost
            || this.props.Login.emailTemplate !== previousProps.Login.emailTemplate
            || this.props.Login.emailScreen !== previousProps.Login.emailScreen
            || this.props.Login.formControls !== previousProps.Login.formControls
            || this.props.Login.emailScreenScheduler !== previousProps.Login.emailScreenScheduler
            //|| this.props.Login.EmailType !== previousProps.Login.EmailType  //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
           // || this.props.Login.FormName !== previousProps.Login.FormName
            || this.props.Login.emailUserQuery !== previousProps.Login.emailUserQuery) {

			//#SECURITY-VULNERABILITY-MERGING-START
			const { selectedRecord } = this.props.Login;
			//#SECURITY-VULNERABILITY-MERGING-END
			
            const emailHost = constructOptionList(this.props.Login.emailHost || [], "nemailhostcode",
                "shostname", undefined, undefined, undefined);
            const emailHostList = emailHost.get("OptionList");
            const DefaultEmailHost = emailHost.get("DefaultValue"); // Added by Gowtham on 24 nov 2025 for jira.id:SWSM-122

			//#SECURITY-VULNERABILITY-MERGING-START
			if (!this.state.selectedRecord?.nemailhostcode) {
                selectedRecord["nemailhostcode"]= DefaultEmailHost;
            }
			//#SECURITY-VULNERABILITY-MERGING-END

            const emailTemplate = constructOptionList(this.props.Login.emailTemplate || [], "nemailtemplatecode",
                "stemplatename", undefined, undefined, undefined);
            const emailTemplateList = emailTemplate.get("OptionList");

            const emailScreen = constructOptionList(this.props.Login.emailScreen || [], "nemailscreencode",
                "sscreenname", undefined, undefined, undefined);
            const emailScreenList = emailScreen.get("OptionList");

            // const ActionType = constructOptionList(this.props.Login.ActionType || [], "nactiontype",
            //     "stransdisplaystatus", undefined, undefined, undefined);
            // const ActionTypeList = ActionType.get("OptionList");

            // const FormName = constructOptionList(this.props.Login.FormName || [], "nformcode",
            //     "sformname", undefined, undefined, undefined);
            // const FormNameList = FormName.get("OptionList");

            const formControls = constructOptionList(this.props.Login.formControls || [], "ncontrolcode",
                "scontrolids", undefined, undefined, undefined);
            const formControlList = formControls.get("OptionList");

            const emailScreenScheduler = constructOptionList(this.props.Login.emailScreenScheduler || [], "nemailscreenschedulercode","sscheduletypename", undefined, undefined, undefined);
            const emailScreenSchedulerList = emailScreenScheduler.get("OptionList");           

            const emailUserQuery = constructOptionList(this.props.Login.emailUserQuery || [], "nemailuserquerycode","sdisplayname", undefined, undefined, undefined);
            const emailQueryList = emailUserQuery.get("OptionList");

			//#SECURITY-VULNERABILITY-MERGING-START
			//Added by sonia on 03th Sept 2025 for jira id:SWSM-12
            /*
            const EmailTypeDefault = EmailType.get("DefaultValue");
            if (EmailTypeDefault !== undefined && this.props.Login.operation !== "update") {
                selectedRecord["nemailtypecode"] = EmailTypeDefault
            }
                */
			//#SECURITY-VULNERABILITY-MERGING-END
			
            this.setState({
                emailHost: emailHostList, emailTemplate: emailTemplateList, emailScreen: emailScreenList,selectedRecord, 
                formControls: formControlList, emailScreenScheduler:emailScreenSchedulerList, emailUserQuery: emailQueryList
            });
        }

        // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
        if (
            (this.props.Login.gridUserRole !== previousProps.Login.gridUserRole) ||
            (this.props.Login.gridUsers !== previousProps.Login.gridUsers) ||
            (this.props.Login.selectedUserRole !== previousProps.Login.selectedUserRole) ||
            (this.props.Login.userRoleUsers !== previousProps.Login.userRoleUsers)
        ) {
            const gridUserRole = this.props.Login.gridUserRole || this.state.gridUserRole;
            const gridUsers = this.props.Login.gridUsers || this.state.gridUsers;
            const userRoleUsers = this.props.Login.userRoleUsers || this.state.userRoleUsers;
            let selectedUserRole = this.props.Login.selectedUserRole || this.state.selectedUserRole;
            selectedUserRole = selectedUserRole ? selectedUserRole : this.props.Login.masterData.emailUserRoles ? this.props.Login.masterData.emailUserRoles[0] : selectedUserRole
            this.setState({ gridUserRole, gridUsers, selectedUserRole, userRoleUsers });
        } else if (!this.props.Login.selectedUserRole && this.props.Login.selectedUserRole && this.props.Login.masterData.emailUserRoles) {
            this.setState({ selectedUserRole: this.props.Login.masterData.emailUserRoles[0] });
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord && Object.keys(this.props.Login.selectedRecord).length === 0) {
            this.setState({ gridUserRole: [], gridUsers: [] })
        }
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        let { selectedRecord, selectedUserRole } = this.state;

        if (fieldName === 'nusercode' || fieldName === 'nuserrolecode') {
            selectedRecord[fieldName] = comboData;
            let availableDatas = "";
            let availableList = [];
            this.state.selectedRecord[fieldName].map(data => {
                availableDatas = availableDatas + "," + data.value;
                availableList.push(data.item);
                return availableDatas;
            });
            this.setState({ selectedRecord, availableDatas, availableList });
        } else if (fieldName === 'nemailscreencode') {
            if(this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.CONTROL_BASED_MAIL){
            selectedRecord[fieldName] = comboData;
            this.props.getFormControls(selectedRecord, this.props.Login.userInfo);
            }else if(this.props.Login.masterData && this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode===mailScheduleType.SCHEDULE_BASED_MAIL){
                selectedRecord[fieldName] = comboData;
                this.props.getSchedulerForEmailScreen(selectedRecord, this.props.Login.userInfo);
            }    
        }else if(fieldName === 'ncontrolcode'|| fieldName === 'nemailscreenschedulercode') {
            selectedRecord[fieldName] = comboData;
                this.props.getEmailUserQuery(selectedRecord,this.props.Login.masterData, this.props.Login.userInfo);
        }else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }

    // Added by Gowtham on Oct 29 2025 for BGSI-147
    deleteUserRoleRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "UserRole",

            inputData: {
                "emailUserRoleConfig": {
                    nemailconfigcode: inputData.selectedRecord.nemailconfigcode,
                    nuserrolecode: inputData.selectedRecord.nuserrolecode,
                },
                "userinfo": this.props.Login.userInfo
            },
            operation: 'delete',
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState, isChild: true,
            postParam: {
                inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig",
                primaryKeyField: "nemailconfigcode",
                fetchUrl: "emailconfig/getEmailConfig",
                fecthInputObject: { userinfo: this.props.Login.userInfo }
            }
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: 'IDS_USERS',
                    operation: 'delete'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
            const gridUserRole = this.props.Login.masterData.emailUserRoles.filter(role => role.nuserrolecode !== inputData.selectedRecord.nuserrolecode);
            const selectedUserRole = this.state.selectedUserRole && this.state.selectedUserRole.nuserrolecode === inputData.selectedRecord.nuserrolecode
                && this.props.Login.masterData.emailUserRoles && this.props.Login.masterData.emailUserRoles.length>1 ? gridUserRole[0] : this.props.Login.masterData.emailUserRoles 
                && this.props.Login.masterData.emailUserRoles.length>1 ? this.state.selectedUserRole : null;
            this.props.deleteEmailUserRole(inputParam.inputData, this.props.Login.masterData, selectedUserRole);
        }
    }

    deleteUsersRecord = (inputData) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Users",

            inputData: {
                "emailuserconfig": inputData.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: 'delete',
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState, isChild: true,
            postParam: {
                inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig",
                primaryKeyField: "nemailconfigcode",
                fetchUrl: "emailconfig/getEmailConfig",
                fecthInputObject: { userinfo: this.props.Login.userInfo }
            }
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: 'IDS_USERS',
                    operation: 'delete'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    deleteRecord = (//screenname, SelectedEmailConfig, 
        operation, ncontrolcode) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",

            inputData: {
                "emailconfig": this.props.Login.masterData.SelectedEmailConfig,
                "userinfo": this.props.Login.userInfo
            },
            operation: operation,
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState,
            postParam: {
                inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig",
                primaryKeyField: "nemailconfigcode",
                fetchUrl: "emailconfig/getEmailConfig",
                fecthInputObject: { userinfo: this.props.Login.userInfo }
            }
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () => {

        this.searchRef.current.value = "";
        const checkExistingData = this.props.Login.masterData.emailTypeValue;
        const masterData = { ...this.props.Login.masterData,checkExistingData }
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo ,
                nemailtypecode: this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode || -1,
                masterData
            },
            searchRef: this.searchRef ,
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName
        };

        this.props.reloadMailConfig(inputParam);
    }

    // Modifed by Gowtham (onSaveClick -> saveClickAction) on Oct 29 2025 for BGSI-147
    onSaveClick = (saveType, formRef) => {
        if (!this.state.selectedUserRole && this.state.selectedRecord["nuserrolecode"] === -1 && this.state.selectedRecord["nuserrolecode"].length > 0) {
            const selectedUserRole = this.state.selectedRecord["nuserrolecode"][0]['item'];
            this.setState({ selectedUserRole });
        }
        const { selectedRecord, selectedUserRole, gridUserRole } = this.state;
        let gridUsers = this.state.gridUsers || [];
        const userRoleUsers = this.state.userRoleUsers || [];
        if (this.props.Login.openChildModel){
            let { loadEsign, openModal, openChildModel, screenName } = this.props.Login;
            if (screenName === "IDS_EMAILUSER") {
                const index = selectedUserRole && selectedUserRole.nuserrolecode || 0;
                userRoleUsers[index] = selectedRecord.nusercode;
                const usersForGrid = userRoleUsers[index] && userRoleUsers[index] ? [ ...userRoleUsers[index] ] : [];
                gridUsers = [ ...gridUsers, ...usersForGrid ];
                gridUsers = [ ...new Map(gridUsers.map(user => [user.item.nusercode, user])).values() ];
                userRoleUsers[index] = gridUsers;
            }
            if (screenName === "IDS_ROLE" || screenName === "IDS_EMAILUSER") {
                screenName = "IDS_MAILCONFIG"
                openChildModel = false;
            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { 
                    openModal, openChildModel, loadEsign, selectedRecord, gridUsers, gridUserRole,
                    selectedId: null, EmailUserQuery: [], screenName, userRoleUsers, selectedUserRole
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.saveClickAction(saveType, formRef);
        }
    }

    saveClickAction = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;

        const selectedRecord = this.state.selectedRecord;
        
        selectedRecord["nusercode"] = this.state.userRoleUsers ? this.state.userRoleUsers.flat() : this.state.gridUsers; // Added by Gowtham on Oct 29 2025 for BGSI-147 - start
        if (this.props.Login.operation === "update") {
            // edit
            postParam = {
                inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig",
                primaryKeyField: "nemailconfigcode"
            }
            // Added by Gowtham on Oct 29 2025 for BGSI-147 - start
            delete selectedRecord["nusercode"];
            delete selectedRecord["nuserrolecode"];
            // end
            inputData["emailconfig"] = JSON.parse(JSON.stringify(selectedRecord));
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
        } else {
            inputData["emailconfig"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            // ALPD-4077 (15-05-2024) Changed this.state.availableDatas to selectedRecord["nusercode"] to form nusercode as string by joining comma
        }
        inputData["emailuserconfig"] = selectedRecord["nusercode"] && selectedRecord["nusercode"].length > 0 ? selectedRecord["nusercode"].map(item => item.item) : [];
        inputData["emailuserroleconfig"] = this.state.gridUserRole && this.state.gridUserRole.length > 0 ? this.state.gridUserRole.map(item => item.item): []

        //inputData["emailconfig"]["ntranscode"] = this.state.selectedRecord["ntranscode"] ? this.state.selectedRecord["ntranscode"] : 14;
        inputData["emailconfig"]["nneedattachment"] = selectedRecord["nneedattachment"] ? selectedRecord["nneedattachment"] : 4;
        inputData["emailconfig"]["nenableemail"] = selectedRecord["nenableemail"] ? selectedRecord["nenableemail"] : transactionStatus.NO;
        inputData["emailconfig"]["nenablesms"] = selectedRecord["nenablesms"] ? selectedRecord["nenablesms"] : transactionStatus.NO;  // Added by Gowtham on 27th Sept 2025 for jira id:SWSM-64
        //inputData["emailconfig"]["nactiontype"] = selectedRecord["nactiontype"] ? selectedRecord["nactiontype"].value : -1;
        inputData["emailconfig"]["ncontrolcode"] = selectedRecord["ncontrolcode"] && selectedRecord["ncontrolcode"]!==-1 ? selectedRecord["ncontrolcode"].value : -1;        inputData["emailconfig"]["nformcode"] = selectedRecord["nemailscreencode"] ? selectedRecord.nemailscreencode.item.nformcode : -1;
        inputData["emailconfig"]["nemailtemplatecode"] = selectedRecord["nemailtemplatecode"] ? selectedRecord["nemailtemplatecode"].value : -1;
        inputData["emailconfig"]["nemailscreencode"] = selectedRecord["nemailscreencode"] ? selectedRecord["nemailscreencode"].value : -1;
        inputData["emailconfig"]["nemailhostcode"] = selectedRecord["nemailhostcode"] ? selectedRecord["nemailhostcode"].value : -1;
        inputData["emailconfig"]["nemailuserquerycode"] = selectedRecord["nemailuserquerycode"] ? selectedRecord["nemailuserquerycode"].value : -1;
        inputData["emailconfig"]["nstatus"] = transactionStatus.ACTIVE;
       // inputData["emailconfig"]["nemailtypecode"] = selectedRecord["nemailtypecode"] ? selectedRecord["nemailtypecode"].value : -1;  //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
        inputData["emailconfig"]["nemailscreenschedulercode"] = selectedRecord["nemailscreenschedulercode"] && selectedRecord["nemailscreenschedulercode"]!==-1 ? selectedRecord["nemailscreenschedulercode"].value : -1; 
        inputData["emailconfig"]["nemailtypecode"] = this.props.Login.masterData.emailTypeValue && this.props.Login.masterData.emailTypeValue.nemailtypecode;  

        if (inputData["emailconfig"]["nemailuserquerycode"] === undefined) {
            inputData["emailconfig"]["nemailuserquerycode"] = -1;
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

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

    // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
    onUserRoleSaveClick = (saveType, formRef) => {
        if (this.props.Login.openChildModel && this.props.Login.openModal) {
            let { selectedUserRole, gridUsers, userRoleUsers } = this.state;
            let gridUserRole = this.state.gridUserRole || [];
            gridUserRole = [ ...gridUserRole, ...this.state.selectedRecord["nuserrolecode"] ];
            gridUserRole = [ ...new Map(gridUserRole.map(role => [role.item.nuserrolecode, role])).values() ];
            selectedUserRole = gridUserRole[0]['item'];
            gridUsers = selectedUserRole ? userRoleUsers[selectedUserRole.nuserrolecode] : []
            let { loadEsign, openModal, screenName } = this.props.Login;
            screenName = "IDS_MAILCONFIG";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { 
                    openModal, loadEsign, openChildModel: false, selectedId: null, EmailUserQuery: [], 
                    screenName, selectedUserRole, gridUserRole, gridUsers: gridUsers || []
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam = undefined;
            let selectedId = null;
            const selectedRecord = this.state.selectedRecord;
            inputData["nuserrolecode"] = selectedRecord["nuserrolecode"] && selectedRecord["nuserrolecode"].length > 0 ? selectedRecord["nuserrolecode"].map(item => item.value).join(",") : null;
            inputData["nemailconfigcode"] = this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode ? this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode : -1;
            inputData["nstatus"] = transactionStatus.ACTIVE;
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "UserRoles",
                displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
                inputData: inputData,
                operation: this.props.Login.operation, isChild: true,
                saveType, formRef, postParam, searchRef: this.searchRef, selectedId
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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

    onUserSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        let selectedId = null;
        const selectedRecord = this.state.selectedRecord;
        // ALPD-4077 (15-05-2024) Changed this.state.availableDatas to selectedRecord["nusercode"] to form nusercode as string by joining comma
        inputData["nusercode"] = selectedRecord["nusercode"] && selectedRecord["nusercode"].length > 0 ? selectedRecord["nusercode"].map(item => item.value).join(",") : null;
        inputData["nemailconfigcode"] = this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode ? this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode : -1;
        inputData["nuserrolecode"] = this.state.selectedUserRole.nuserrolecode || -1; // Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Users",
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation, isChild: true,
            saveType, formRef, postParam, searchRef: this.searchRef, selectedId
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

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

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }
    
    closeFilter = () => {   
        const inputValues = {
            emailTypeValue:this.props.Login.masterData.checkExistingData || {} ,
        }    
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false,masterData: { ...this.props.Login.masterData, ...inputValues} }
        }
        this.props.updateStore(updateInfo);
    }

    
    onComboChangeFilter = (comboData, fieldName) => {
        if (comboData) {
            if (fieldName === 'nemailtypecode') {
                if (comboData.value !== this.props.Login.masterData.emailTypeValue.nemailtypecode) {
                    const checkExistingData= this.props.Login.masterData.emailTypeValue
                    const masterData = { ...this.props.Login.masterData, emailTypeValue: comboData.item,checkExistingData };
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { masterData, ...checkExistingData}
                    };
                    this.props.updateStore(updateInfo);
                }
            }
        }
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

}
export default connect(mapStateToProps, { getEmailConfigDetail, callService, filterColumnData, getUserEmailConfig, getUserRoles, deleteEmailUserRole, getEmailUsers,
    getEmailUserOnUserRole, crudMaster, fetchEmailConfigById,reloadMailConfig,validateEsignCredential, openEmailConfigModal, getFormControls,getSchedulerForEmailScreen,getEmailUserQuery, updateStore })(injectIntl(EmailConfig));