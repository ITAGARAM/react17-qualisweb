import React from 'react'
import { connect } from 'react-redux';
import { toast } from 'react-toastify'
import { Row, Col, Nav, Button, Image, Media } from 'react-bootstrap'
import { DEFAULT_RETURN } from '../../../actions/LoginTypes'
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, getUserMappingFilterChange, getUserMappingBySite, getUserMappingGraphView,
    getChildUsers, openUserMappingModal, updateStore, validateEsignCredential, filterColumnData,
    getCopyUserMapping, getCopyUserMappingSubType,getUserMapping
} from '../../../actions';
import { getControlMap, sortData, showEsign, constructOptionList } from '../../../components/CommonScript'
import UserMappingFilter from './UserMappingFilter';
import { MediaHeader, ContentPanel } from '../../../components/App.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSitemap, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { SearchAdd } from '../../product/product.styled';
import ConfirmDialog from '../../../components/confirm-alert/confirm-alert.component';
import { Grid, GridColumn, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { ApprovalSubType, transactionStatus } from '../../../components/Enumeration';
import ColumnMenu from '../../../components/data-grid/ColumnMenu';
import UserTree from './UserTree'
import { AtTableWrap, FontIconWrap } from '../../../components/data-grid/data-grid.styles';
   
/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
//import ReactTooltip from 'react-tooltip';
import './UserMapping.css'
import { AtHeader } from '../../../components/header/header.styles';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { fileViewUrl } from '../../../rsapi';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
// import messages_en from '../../../assets/translations/en.json';
// import messages_de from '../../../assets/translations/de.json';
import { Affix } from 'rsuite';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
// const messages = {
//     'en-US': messages_en,
//     'ko-KR': messages_de
// }
class UserMapping extends React.Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };

        this.state = {
            masterStatus: "", error: "", selectedRecord: {},
            dataResult: [], dataState: { 0: dataState },
            userRoleControlRights: [],
            controlMap: new Map(),
            ApprovalsubtypeList: [],
            RegistrationTypeList: [],
            RegistrationSubTypeList: [],
            templateVersionOptionList: [],
            userRoleList: [],
            userList: [],
            data: [],
            a: 0.5,
            b: 0.5,
            scale: 1,
            expanded: false,
            //dataResult:{}
            sidebarview: false
        }
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    handlePanAndZoom = (a, b, scale) => {
        scale = scale > 1 ? 1 : scale
        this.setState({ a, b, scale });
    }

    handlePanMove = (a, b) => {
        this.setState({ a, b });
    }

    dataStateChange = (event, nuserrolecode) => {
        let dataState = { ...this.state.dataState, [nuserrolecode]: event.dataState };
        let dataResult = this.state.dataResult;
        dataResult[nuserrolecode]=process(this.props.Login.masterData[nuserrolecode],event.dataState)
        this.props.Login.dataState = dataState;
        this.setState({ dataState,dataResult });
    }

    acceptCopy = (saveType, inputParam, masterData) => {
        const copyId = this.state.controlMap.has("CopyUserMapping") && this.state.controlMap.get("CopyUserMapping").ncontrolcode;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, copyId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType,
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }

    onSaveClick = (saveType, formRef) => {
        let addedUsers = [];
        let inputData = {};
        if (this.props.Login.operation === 'copy') {
            inputData = {
                usermapping: {
                    ntreeversiontempcode: this.templateVersionValue.value,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    nregtypecode: this.state.selectedRecord["regtype"].value,
                    nregsubtypecode: this.state.selectedRecord["regsubtype"].value,
                    userinfo: this.props.Login.userInfo,
                    nsitecode: this.props.Login.masterData.selectedSite.nsitecode,
                },
                userinfo: this.props.Login.userInfo
            }
            const masterData = this.props.Login.masterData;
            const inputParam = {
                methodUrl: 'UserMapping',
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData, saveType, formRef,
                operation: 'copy',
                searchRef: this.searchRef,
                dataState: { ...this.state.dataState, [this.props.Login.childRole]: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 } }

            }
            this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }) + "!",
                this.props.intl.formatMessage({ id: "IDS_COPYUSERMAPPINGALERT" }) + " ?",
                this.props.intl.formatMessage({ id: "IDS_OK" }),
                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => this.acceptCopy(saveType, inputParam, masterData));
        }
        if (this.state.selectedRecord.nusercode && this.state.selectedRecord.nusercode.length > 0) {
            this.state.selectedRecord.nusercode.map(user => {
                addedUsers.push({
                    nversioncode: this.templateVersionValue.value,
                    napprovalconfigcode: this.props.Login.masterData.approvalConfigCode || this.templateVersionValue.item.napprovalconfigcode || -1,
                    nparentrolecode: this.props.Login.parentRole,
                    nparentusercode: this.props.Login.parentRole === -2 ? -2 : this.props.Login.masterData[`selectedUser_${this.props.Login.parentRole}`].UserCode,
                    nparentusersitecode: this.props.Login.parentRole === -2 ? -2 : this.props.Login.masterData[`selectedUser_${this.props.Login.parentRole}`].usersitecode,
                    nchildrolecode: user.item.nuserrolecode,
                    nchildusercode: user.item.UserCode,
                    nchildusersitecode: user.item.nusersitecode,
                    nparusermappingcode: this.props.Login.parentRole === -2 ? -2 : this.props.Login.masterData[`selectedUser_${this.props.Login.parentRole}`].nusermappingcode,
                    nlevel: user.item.nlevelno,
                    nsitecode: this.props.Login.masterData.selectedSite.nsitecode,
                    nstatus: 1,
                    })
                return null;
            })
            const masterData = this.props.Login.masterData;
            inputData = {
                users: {
                    userinfo: this.props.Login.userInfo,
                    usermapping: addedUsers,
                    nparusermappingcode: this.props.Login.parentRole === -2 ? -2 : this.props.Login.masterData[`selectedUser_${this.props.Login.parentRole}`].nusermappingcode,
                    nuserrolecode: this.props.Login.parentRole,
                    nsitecode: this.props.Login.masterData.selectedSite.nsitecode,
                    nversioncode: this.templateVersionValue.value,
                    levelno: this.props.Login.nlevelno,
                    nregtypecode:  this.props.Login.masterData.registrationTypeValue.value ?  this.props.Login.masterData.registrationTypeValue.value : -1,
                    nregsubtypecode: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.value : -1,
                },
                userinfo: this.props.Login.userInfo,

            }
            const inputParam = {
                methodUrl: 'Users',
                classUrl: this.props.Login.inputParam.classUrl,
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData, saveType, formRef,
                operation: 'create',
                searchRef: this.searchRef,
                dataState: { ...this.state.dataState, [this.props.Login.childRole]: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 } }

            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType,
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openChildModal");
            }
        }
    }

    deleteUsers = (deleteId, nusermappingcode, nparusermappingcode, role) => {

        const inputData = {
            'users': {
                nusermappingcode: nusermappingcode,
                nparusermappingcode: nparusermappingcode,
                nuserrolecode: role.nparentrolecode,
                nsitecode: this.props.Login.masterData.selectedSite.nsitecode,
                nversioncode: this.templateVersionValue.value,
                levelno: role.nlevelno,
                userinfo: this.props.Login.userInfo
            }
        }
        inputData['userinfo'] = this.props.Login.userInfo
        const inputParam = {
            methodUrl: 'Users',
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: "delete",
            dataState: this.state.dataState,
            postParam : {
                inputListName: "Site",
                selectedObject: "selectedSite",
                primaryKeyField: "nsitecode",
                searchFieldList: ["ssitename"],
                fetchUrl: "usermapping/getUserMappingBySite",
                fecthInputObject: { nversioncode: this.templateVersionValue ? this.templateVersionValue.value : -1, userinfo: this.props.Login.userInfo },
                unchangeList: ["TreeVersion", "templateVersionValue",
                 "Approvalsubtype", "approvalSubTypeValue", "RegistrationType", "registrationTypeValue", 
                 "RegistrationSubType", "registrationSubTypeValue",
                 "realApprovalSubTypeValue","realRegistrationTypeValue","realRegistrationSubTypeValue","realTemplateVersionValue"],
                masterData: this.props.Login.masterData
            }
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, operation: "delete",
                    openChildModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName })
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }

    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openChildModal = this.props.Login.openChildModal;
        let graphView = this.props.Login.graphView;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
               
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason']=undefined;
            }
        }
        else {
            openChildModal = false;
            graphView = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, graphView }
        }
        this.props.updateStore(updateInfo);
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
        if (props.Login.multilingualError && props.Login.multilingualError !== "") {
            toast.warn(props.intl.formatMessage({ id: props.Login.multilingualError }))
            props.Login.multilingualError = "";
        }
        if (props.Login.dataState === undefined) {
            props.Login.dataState = undefined;
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
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
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }

    columnProps(field, nuserrolecode) {
        return {
            field: field,
            columnMenu: ColumnMenu,
            headerClassName: this.isColumnActive(field, this.state.dataState, nuserrolecode) ? 'active' : ''
        };
    }

    isColumnActive(field, dataState, nuserrolecode) {
        return GridColumnMenuFilter.active(field, dataState[nuserrolecode] ? dataState[nuserrolecode].filter : dataState['0'].filter)
    }

    getUserMapping = () => {
        if (this.state.ApprovalsubtypeList.length>0) {
           // this.searchRef.current.value = ""

            // let approvalSubTypeValue = this.approvalSubTypeValue ? this.approvalSubTypeValue : this.state.ApprovalsubtypeList.length > 0 ? 
            //                             this.state.ApprovalsubtypeList[0] : -1;
         
            let masterData = {
                ...this.props.Login.masterData,
                realApprovalSubTypeValue: this.props.Login.masterData.approvalSubTypeValue  ? this.props.Login.masterData.approvalSubTypeValue : this.props.Login.masterData.realApprovalSubTypeValue?this.props.Login.masterData.realApprovalSubTypeValue: -1,
                //realApprovalSubTypeValue: this.props.Login.masterData.approvalSubTypeValue?this.props.Login.masterData.approvalSubTypeValue.value === 1 ? this.props.Login.masterData.approvalSubTypeValue :this.props.Login.masterData.realApprovalSubTypeValue?this.props.Login.masterData.realApprovalSubTypeValue:-1:this.props.Login.masterData.realApprovalSubTypeValue,
                realRegistrationTypeValue: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue : -1,
                realRegistrationSubTypeValue: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue : -1,
                //realTemplateVersionValue: this.props.Login.masterData.templateVersionValue ? this.props.Login.masterData.templateVersionValue : -1,
                realTemplateVersionValue: this.props.Login.masterData.templateVersionValue ? this.props.Login.masterData.templateVersionValue : this.props.Login.masterData.realTemplateVersionValue?this.props.Login.masterData.realTemplateVersionValue: -1,

            }
       
            let inputParamData = { 
                nFlag:6,
                // napprovalsubtypecode: this.props.Login.masterData.approvalSubTypeValue.value,
                napprovalsubtypecode:this.approvalSubTypeValue.value?this.approvalSubTypeValue.value:-1,
                nregtypecode:  this.props.Login.masterData.registrationTypeValue.value ?  this.props.Login.masterData.registrationTypeValue.value : -1,
                nregsubtypecode: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue.value : -1,
                //ntemplatecode: this.props.Login.masterData.approvalSubTypeValue.item.ntemplatecode,
                ntemplatecode: this.approvalSubTypeValue.item.ntemplatecode,
               // nversioncode:  this.props.Login.masterData.templateVersionValue ?  this.props.Login.masterData.templateVersionValue.value : -1,
                nversioncode: this.templateVersionValue.value?this.templateVersionValue.value:-1,
                userinfo: this.props.Login.userInfo, 
                masterData ,
                searchRef: this.searchRef
            }
            
            if(inputParamData.napprovalsubtypecode > 0 &&  inputParamData.nregtypecode > 0 && inputParamData.nregsubtypecode > 0 && inputParamData.nversioncode > 0)
            {
                this.props.getUserMapping(inputParamData);
            }
            else
            {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLVALUESINFILTER" }))
            }
           
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_APPROVALSUBTYPENOTAVAILABLE" }))
        }
    }


    reloadData = () => {
        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "usermapping",
        //     methodUrl: "UserMapping",
        //     displayName: "IDS_USERMAPPING",
        //     userInfo: this.props.Login.userInfo
        // };

        // this.props.callService(inputParam);
        
            if (this.props.Login.masterData.approvalSubTypeValue) {
                //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
                if (this.searchRef && this.searchRef.current) {
                    this.searchRef.current.value = "";
                  }                
                let masterData = {
                    ...this.props.Login.masterData,
                    realApprovalSubTypeValue: this.props.Login.masterData.approvalSubTypeValue ? this.props.Login.masterData.approvalSubTypeValue : -1,
                    realRegistrationTypeValue: this.props.Login.masterData.registrationTypeValue ? this.props.Login.masterData.registrationTypeValue : -1,
                    realRegistrationSubTypeValue: this.props.Login.masterData.registrationSubTypeValue ? this.props.Login.masterData.registrationSubTypeValue : -1,
                    realApprovalConfigCode: this.props.Login.masterData.approvalConfigCode || -1,
                    realTreeVersionTemplateValue: this.props.Login.masterData.userroleTemplateValue || -1,
    
                }
                const inputData = {
                    napprovalsubtypecode: this.props.Login.masterData.approvalSubTypeValue ?
                        this.props.Login.masterData.approvalSubTypeValue.value : -1,
                    napprovalconfigcode: this.props.Login.masterData.approvalConfigCode,
                    ntreeversiontempcode: this.props.Login.masterData.userroleTemplateValue.value,
                    userinfo: this.props.Login.userInfo
                }
                let inputParamData = { inputData, masterData }
                this.props.getApprovalConfigurationVersion(inputParamData);
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_APPROVALSUBTYPENOTAVAILABLE" }))
            }
    }

    render() {
       // loadMessages(messages[this.props.Login.userInfo.slanguagetypecode], "lang");
        const extractedColumnList = [
            { "idsName": "IDS_USERNAME", "dataField": "Name", "width": "35%" },
            { "idsName": "IDS_LOGINID", "dataField": "LoginId", "width": "35%" },
            { "idsName": "IDS_DEPARTMENT", "dataField": "sdeptname", "width": "10%" },
        ]


        const addId = this.state.controlMap.has("AddUserMapping") && this.state.controlMap.get("AddUserMapping").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteUserMapping") && this.state.controlMap.get("DeleteUserMapping").ncontrolcode;
        const copyId = this.state.controlMap.has("CopyUserMapping") && this.state.controlMap.get("CopyUserMapping").ncontrolcode;

        //  let approvalSubTypes = this.props.Login.masterData.Approvalsubtype ? sortData(this.props.Login.masterData.Approvalsubtype, 'ascending', 'ntemplatecode') : [];
        let approvalSubTypes = this.state.ApprovalsubtypeList ? this.state.ApprovalsubtypeList : [];
        this.approvalSubTypeValue = this.props.Login.masterData.approvalSubTypeValue ?
            this.props.Login.masterData.approvalSubTypeValue :
            approvalSubTypes.length > 0 ? approvalSubTypes[0]: {};

        this.templateVersionValue = this.props.Login.masterData.templateVersionValue ?
            this.props.Login.masterData.templateVersionValue : this.props.Login.masterData.TreeVersion ? this.props.Login.masterData.TreeVersion.length > 0 ?
                {
                    value: this.props.Login.masterData.TreeVersion[0].ntreeversiontempcode,
                    label: this.props.Login.masterData.TreeVersion[0].sversiondescription,
                    item: this.props.Login.masterData.TreeVersion[0]
                } : {} : {};
        const userRole = this.props.Login.masterData.UserRole ? sortData(this.props.Login.masterData.UserRole, 'ascending', 'nlevelno') : []
        const filterParam = {
            inputListName: "Site",
            selectedObject: "selectedSite",
            primaryKeyField: "nsitecode",
            searchFieldList: ["ssitename"],
            fetchUrl: "usermapping/getUserMappingBySite",
            fecthInputObject: { nversioncode: this.templateVersionValue ? this.templateVersionValue.value : -1, userinfo: this.props.Login.userInfo },
            unchangeList: ["TreeVersion", "templateVersionValue",
             "Approvalsubtype", "approvalSubTypeValue", "RegistrationType", "registrationTypeValue", 
             "RegistrationSubType", "registrationSubTypeValue",
             "realApprovalSubTypeValue","realRegistrationTypeValue","realRegistrationSubTypeValue","realTemplateVersionValue"],
            masterData: this.props.Login.masterData
        };
        let mandatoryFields = [
            { "idsName": "IDS_USERS", "dataField": "nusercode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
        ];
        if (this.props.Login.operation === 'copy') {
            mandatoryFields = [
                { "idsName": "IDS_REGISTRATIONTYPE", "dataField": "regtype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                { "idsName": "IDS_REGISTRATIONSUBTYPE", "dataField": "regsubtype" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
            ]
        }

         let breadCrumbData = []
         if (this.props.Login.masterData.realApprovalSubTypeValue && this.props.Login.masterData.realApprovalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL) {
         breadCrumbData = [
                {
                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "NA"
                },
                {
                    "label": "IDS_REGISTRATIONTYPE",
                    "value": this.props.Login.masterData.realRegistrationTypeValue ? this.props.Login.masterData.realRegistrationTypeValue.label : "NA"
                }, 
                {
                    "label": "IDS_REGISTRATIONSUBTYPE",
                    "value": this.props.Login.masterData.realRegistrationSubTypeValue ? this.props.Login.masterData.realRegistrationSubTypeValue.label : "NA"
                }, 
                {
                    "label": "IDS_USERROLETEMPLATE",
                    "value": this.props.Login.masterData.realTemplateVersionValue ? this.props.Login.masterData.realTemplateVersionValue.label : "NA"
                }
             ];
        } 
        else
        {
            breadCrumbData = [  {
                "label": "IDS_APPROVALSUBTYPE",
                "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "NA"
            },
            
            {
                "label": "IDS_USERROLETEMPLATE",
                "value": this.props.Login.masterData.realTemplateVersionValue ? this.props.Login.masterData.realTemplateVersionValue.label : "NA"
            }
            ]
        }

        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                </Affix>
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                //filterColumnData ={(filterValue)=>this.props.filterApprovalConfigColumnData(filterValue,this.props.Login.masterData,this.props.Login.userInfo,this.approvalSubTypeValue.value)}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                screenName={this.props.intl.formatMessage({ id: "IDS_USERMAPPING" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Site}
                                getMasterDetail={(site) => this.props.getUserMappingBySite(site, this.templateVersionValue.value, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedSite}
                                primaryKeyField="nsitecode"
                                mainField="ssitename"
                                //firstField="ssiteaddress"
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={-1}
                                hidePaging={true}
                                reloadData={this.getUserMapping}
                                searchRef={this.searchRef}
                                filterParam={filterParam}
                                filterColumnData={this.props.filterColumnData}
                                copyId={copyId}
                                showCopy={this.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL}
                                copyData={this.copyData}
                                showGraphView={true}
                                hideSearch={false}
                                getGraphView={() => this.props.getUserMappingGraphView(this.props.Login.masterData.selectedSite, this.templateVersionValue.value, this.props.Login.userInfo)}
                                needAccordianFilter={false}
                                showFilterIcon={true}
                                onFilterSubmit={this.getUserMapping}
                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <UserMappingFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                filterComboChange={this.onFilterComboChange}
                                                templateVersionOptions={this.state.templateVersionOptionList}
                                                templateVersionValue={this.templateVersionValue}
                                                Approvalsubtype={this.state.ApprovalsubtypeList}
                                                approvalSubTypeValue={this.approvalSubTypeValue}
                                                RegistrationType={this.state.RegistrationTypeList}
                                                registrationTypeValue={this.props.Login.masterData.registrationTypeValue}
                                                RegistrationSubType={this.state.RegistrationSubTypeList}
                                                registrationSubTypeValue={this.props.Login.masterData.registrationSubTypeValue}
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
                            <ContentPanel className="panel-main-content">
                                <Row>
                                    {userRole.map((role, index) =>
                                        <Col md={12}>
                                            <SearchAdd className="d-flex justify-content-between">
                                                <MediaHeader>
                                                    <h4 style={{ fontWeight: "bold" }}>{role.suserrolename}</h4>
                                                </MediaHeader>
                                                <Button id={`adduser_${role.nuserrolecode}`} className="btn btn-circle solid-blue" role="button"
                                                    hidden={this.state.userRoleControlRights.indexOf(addId) === -1}
                                                    onClick={() => this.props.openUserMappingModal(role, this.props.Login.masterData.selectedSite.nsitecode,
                                                        this.props.Login.masterData[`selectedUser_${role.nlevelno === 1 ? role.nuserrolecode : role.nparentrolecode}`],
                                                        this.templateVersionValue.value, this.props.Login.userInfo,
                                                        this.props.Login.masterData,
                                                        userRole.filter(x => x.nuserrolecode === role.nparentrolecode).length > 0 ?
                                                            userRole.filter(x => x.nuserrolecode === role.nparentrolecode)[0].suserrolename : ""
                                                    )}>
                                                    <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                                                </Button>
                                            </SearchAdd>
                                            <Row>
                                                <Col md={12}>
                                                    {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                                                    <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                                                        {/* <Tooltip openDelay={100} position="bottom" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                                                        <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                            <Grid
                                                                key={role.nuserrolecode}
                                                                data={this.state.dataResult[`${role.nuserrolecode}`]}

                                                                onRowClick={(user) => this.props.getChildUsers(user.dataItem, role, this.props.Login.masterData.selectedSite.nsitecode, this.templateVersionValue.value,
                                                                    this.props.Login.userInfo, this.props.Login.masterData, this.state.dataState, userRole)}
                                                                selectedField="selected"
                                                                style={{ minHeight: '20em' }}
                                                                onDataStateChange={(event) => this.dataStateChange(event, role.nuserrolecode)}
                                                                resizable={true}
                                                                reorderable
                                                                scrollable
                                                                sortable
                                                                pageable={{ buttonCount: 2, pageSizes: this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting)), previousNext: false }}
                                                                {...this.state.dataState[role.nuserrolecode] ? this.state.dataState[role.nuserrolecode] : this.state.dataState['0']}

                                                            >

                                                                {extractedColumnList.map((item, key) =>
                                                                    <GridColumn key={key} title={this.props.intl.formatMessage({ id: item.idsName })}
                                                                        field={item.dataField}
                                                                        {...this.columnProps(item.dataField, role.nuserrolecode)}
                                                                        cell={(row) => (
                                                                            <td data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}
                                                                           //  data-for="tooltip-grid-wrap" 
                                                                             className={this.props.Login.masterData[`selectedUser_${role.nuserrolecode}`].nusermappingcode === row["dataItem"]['nusermappingcode'] ? 'active' : ''}>
                                                                                {row["dataItem"][item.dataField]}
                                                                            </td>)}
                                                                    />
                                                                )}
                                                                <GridColumn locked headerClassName="text-center" sort={false} title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                                                    cell={(row) => (
                                                                        <td>
                                                                            <Nav.Link className="action-icons-wrap text-center">
                                                                                <FontIconWrap className="d-font-icon"
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })} data-place="left"
                                                                                title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}>
                                                                                    <ConfirmDialog
                                                                                        name="deleteMessage"
                                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                                        icon={faTrashAlt}
                                                                                        // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                                        handleClickDelete={() => this.deleteUsers(deleteId, row['dataItem'].nusermappingcode, row['dataItem'].nparusermappingcode, role)}
                                                                                    />
                                                                                </FontIconWrap>
                                                                                {userRole.length - 1 === index ? "" :
                                                                                    <FontIconWrap className="d-font-icon" 
                                                                                    onClick={() => this.props.getUserMappingGraphView(
                                                                                        this.props.Login.masterData.selectedSite, this.templateVersionValue.value,
                                                                                        this.props.Login.userInfo, row['dataItem'], role)}
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_GRAPH" })} data-place="left"
                                                                                    title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}>
                                                                                        <FontAwesomeIcon icon={faSitemap} className="fa-rotate-270"
                                                                                            // onClick={() => this.props.getUserMappingGraphView(
                                                                                            //     this.props.Login.masterData.selectedSite, this.templateVersionValue.value,
                                                                                            //     this.props.Login.userInfo, row['dataItem'], role)}
                                                                                        // title={this.props.intl.formatMessage({ id: "IDS_GRAPH" })}
                                                                                        />
                                                                                    </FontIconWrap>
                                                                                }
                                                                            </Nav.Link>
                                                                        </td>
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </LocalizationProvider>
                                                        {/* </Tooltip> */}
                                                    </AtTableWrap>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                    }
                                </Row>
                            </ContentPanel>
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openChildModal ?
                    <SlideOutModal
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={this.props.Login.graphView ? "IDS_USERMAPPING" : this.props.Login.childRoleName || "IDS_USERMAPPING"}
                        closeModal={this.closeModal}
                        show={this.props.Login.openChildModal}
                        inputParam={this.props.Login.inputParam}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        graphView={this.props.Login.graphView}
                        size={this.props.Login.graphView ? 'xl' : 'lg'}
                        addComponent={
                            this.props.Login.loadEsign ?
                                <Esign
                                    operation={this.props.Login.operation}
                                    onInputOnChange={this.onInputOnChange}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedRecord || {}}
                                />
                                : this.props.Login.operation === 'copy' ?

                                    <Row>
                                        <Col md={12}>
                                            {this.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL ?
                                                <>
                                                    {this.props.Login.optCopyRegType ?
                                                        <FormSelectSearch
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                            name="regtype"
                                                            optionId="nregtypecode"
                                                            optionValue="sregtypename"
                                                            options={this.props.Login.optCopyRegType}
                                                            value={this.state.selectedRecord ? this.state.selectedRecord["regtype"] : this.registrationTypeValue}
                                                            onChange={(event) => this.onComboChange(event, 'regtype')}
                                                            isMandatory={false}
                                                            isMulti={false}
                                                            isSearchable={true}
                                                            isDisabled={false}
                                                        />
                                                        : ""}
                                                    {this.props.Login.optCopyRegSubType ?
                                                        <FormSelectSearch
                                                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                            name="regsubtype"
                                                            optionId="nregsubtypecode"
                                                            optionValue="sregsubtypename"
                                                            options={this.props.Login.optCopyRegSubType}
                                                            value={this.state.selectedRecord && this.state.selectedRecord["regsubtype"]}
                                                            isMandatory={false}
                                                            isMulti={false}
                                                            isSearchable={true}
                                                            isDisabled={false}
                                                            onChange={(event) => this.onComboChange(event, 'regsubtype')}

                                                        />
                                                        : ""}
                                                </>
                                                : ""}
                                        </Col>
                                    </Row>
                                    : this.props.Login.graphView ?
                                        <UserTree
                                            userRoleList={this.state.userRoleList}
                                            userList={this.state.userList}
                                            data={this.state.data}
                                            expanded={this.state.expanded}
                                            collapseAll={this.collapseAll}
                                            selectedRecord={this.state.selectedRecord}
                                            clearFilter={this.clearFilter}
                                            filterTree={this.filterTree}
                                            userSearchFilterChange={this.userSearchFilterChange}
                                            a={this.state.a}
                                            b={this.state.b}
                                            scale={this.state.scale}
                                            handlePanAndZoom={this.handlePanAndZoom}
                                            handlePanMove={this.handlePanMove}
                                            hideFilters={this.props.Login.hideFilters}
                                        />
                                        :
                                        <Row>
                                            <Col md={12}>
                                                <FormSelectSearch
                                                    name={'users'}
                                                    formLabel={this.props.Login.childRoleName}//{this.props.intl.formatMessage({ id: "IDS_USERS" })}
                                                    // placeholder={this.props.Login.childRoleName}//{this.props.intl.formatMessage({ id: "IDS_USERS" })}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                    value={this.state.selectedRecord ? this.state.selectedRecord.nusercode ? this.state.selectedRecord.nusercode : [] : []}
                                                    options={this.props.Login.AvailableUsers ? this.props.Login.AvailableUsers : []}
                                                    optionId="id"
                                                    optionValue="Name"
                                                    isMandatory={true}
                                                    isMulti={true}
                                                    isDisabled={false}
                                                    isSearchable={true}
                                                    closeMenuOnSelect={false}
                                                    isClearable={true}
                                                    as={"select"}
                                                    onChange={(event) => this.onComboChange(event, 'nusercode')}
                                                />
                                            </Col>
                                        </Row>
                        }
                    /> : ""}
            </>
        )
    }

    componentDidUpdate(previousProps) {
           /* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */
        //ReactTooltip.rebuild();
     
        let { selectedRecord, dataState, userRoleControlRights, controlMap, ApprovalsubtypeList, data, dataResult,
            RegistrationTypeList, RegistrationSubTypeList, templateVersionOptionList, userRoleList } = this.state;
        let updateState = false;

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            //this.setState({ selectedRecord: this.props.Login.selectedRecord });
            selectedRecord = this.props.Login.selectedRecord;
            updateState = true;
        }
        if (this.props.Login.userTree !== previousProps.Login.userTree) {
            let filter = selectedRecord.filteredUser ? true : false
            if (this.props.Login.selectedTreeParent !== undefined) {
                let status = true;
                this.props.Login.selectedTreeParent.suserimgftp !== null && this.props.Login.files && this.props.Login.files.includes(this.props.Login.selectedTreeParent.suserimgftp)
                    ? status = true : status = false
                let element = this.props.Login.selectedTreeParent
                data = {
                    id: this.props.Login.selectedTreeParent.nusermappingcode,
                    label:
                        <div style={{ userSelect: 'none' }}>
                            <AtHeader>
                                <Media>
                                    {status && this.props.Login.settings && this.props.Login.settings[5] && element.suserimgftp && element.suserimgftp !== "" ?
                                        <Image src={this.props.Login.settings[5] + element.suserimgftp} alt="avatar" className="img-profile rounded-circle mr-2" />
                                        : <span className="img-profile rounded-circle mr-2" style={
                                            {
                                                background: "#e7e6f5",
                                                borderRadius: "50%",
                                                border: "1px solid #cbc5f7",
                                                color: "#6554c0",
                                                padding: "3px"
                                            }} >
                                            {element.username && element.username.split(" ").length > 1 ?
                                                element.username.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                element.username.split(" ")[1].substring(0, 1).toUpperCase()
                                            :
                                                element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                            }
                                        </span>
                                    }
                                    <Media.Body>
                                        <span className="user-name">{element.username}</span>
                                        <span className="role" style={{ paddingTop: "3px" }}>{element.suserrolename}</span>
                                    </Media.Body>
                                </Media>
                            </AtHeader>
                        </div>,
                    children: this.getRoottree(this.props.Login.userTree || [], this.props.Login.selectedTreeParent.nusermappingcode, false)
                }

            } else {
                let siteName = this.props.Login.masterData.selectedSite ? this.props.Login.masterData.selectedSite.ssitename : ""
                data = {
                    id: 0,
                    label:
                        <div>
                            <AtHeader>
                                <Media>
                                    <span className="img-profile rounded-circle mr-2" style={
                                        {
                                            background: "#e7e6f5",
                                            borderRadius: "50%",
                                            border: "1px solid #cbc5f7",
                                            color: "#6554c0",
                                            padding: "3px"
                                        }} >
                                        {
                                            siteName.split(" ").length > 1 ?
                                                siteName.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                siteName.split(" ")[1].substring(0, 1).toUpperCase()
                                                :
                                                siteName.split(" ")[0].substring(0, 1).toUpperCase()
                                        }
                                    </span>
                                    <Media.Body>

                                        <span className="role" style={{ paddingTop: "6px" }}>{siteName}</span>
                                    </Media.Body>
                                </Media>
                            </AtHeader>
                        </div>,
                    children: this.getRoottree(this.props.Login.userTree || [], -2, filter, selectedRecord.filteredUser, selectedRecord.filteredRole)
                }
            }
            updateState = true;
        }
        if (this.props.Login.dataState !== previousProps.Login.dataState) {
            if (this.props.Login.dataState === undefined) {
                // this.setState({ dataState: { '0': this.state.dataState['0'] } })
                dataState = { '0': this.state.dataState['0'] }
                updateState = true;
            } else {
                // this.setState({ dataState: this.props.Login.dataState ? this.props.Login.dataState : this.state.dataState['0'] });
                dataState =  this.props.Login.dataState ? {...this.props.Login.dataState} : {'0':this.state.dataState['0'] }
                updateState = true;
            }
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            updateState = true;
            const userMap = constructOptionList(this.props.Login.masterData.UserRole || [], "nuserrolecode", "suserrolename", undefined, undefined, true);
            userRoleList = userMap.get("OptionList");

            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", 'nregtypecode', 'ascending', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", 'nregsubtypecode', 'ascending', false);
            const templateVersionOptionListMap = constructOptionList(this.props.Login.masterData.TreeVersion || [], "ntreeversiontempcode", "sversiondescription", 'ntreeversiontempcode', 'decending', false);

            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            templateVersionOptionList = templateVersionOptionListMap.get("OptionList");


        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            const ApprovalsubtypeListMap = constructOptionList(this.props.Login.masterData.Approvalsubtype || [], "napprovalsubtypecode", "ssubtypename", 'ntemplatecode', 'ascending', false);
            const RegistrationTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationType || [], "nregtypecode", "sregtypename", 'nregtypecode', 'ascending', false);
            const RegistrationSubTypeListMap = constructOptionList(this.props.Login.masterData.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", 'nregsubtypecode', 'ascending', false);
            const templateVersionOptionListMap = constructOptionList(this.props.Login.masterData.TreeVersion || [], "ntreeversiontempcode", "sversiondescription", 'ntreeversiontempcode', 'decending', false);
            ApprovalsubtypeList = ApprovalsubtypeListMap.get("OptionList");
            RegistrationTypeList = RegistrationTypeListMap.get("OptionList");
            RegistrationSubTypeList = RegistrationSubTypeListMap.get("OptionList");
            templateVersionOptionList = templateVersionOptionListMap.get("OptionList");
            //this.setState({userRoleControlRights, controlMap, ApprovalsubtypeList, RegistrationTypeList, RegistrationSubTypeList, templateVersionOptionList});
            updateState = true;
        }

        if (updateState) {
            const userRole = this.props.Login.masterData.UserRole ? sortData(this.props.Login.masterData.UserRole, 'ascending', 'nlevelno') : []
            userRole.map(role =>
                {
                    let roleUsers = this.props.Login.masterData[`${role.nuserrolecode}`] ? sortData(this.props.Login.masterData[`${role.nuserrolecode}`],'descending','nusermappingcode'): []
                    dataResult[`${role.nuserrolecode}`]=process(roleUsers.map(item => 
                            (
                                { 
                                    ...item, 
                                    selected: item.nusermappingcode === this.props.Login.masterData[`selectedUser_${role.nuserrolecode}`].nusermappingcode 
                                }
                            )
                        )
                    , dataState[role.nuserrolecode] ? dataState[role.nuserrolecode] : dataState['0'])
                    return null;
                })
            this.setState({
                selectedRecord, dataState, userRoleControlRights, controlMap, ApprovalsubtypeList, data,
                RegistrationTypeList, RegistrationSubTypeList, templateVersionOptionList, userRoleList
            });
        }
    }

    onComboChange = (comboData, comboName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (comboData && comboName === "regtype") {
            selectedRecord[comboName] = comboData;
            let nregsubtypecode = this.props.Login.masterData.registrationSubTypeValue.value
            this.props.getCopyUserMappingSubType(comboData, nregsubtypecode, selectedRecord, this.props.Login.userInfo, this.props.Login.masterData, this.props.Login.optCopyRegType)
        } else {
            if (comboData) {
                selectedRecord[comboName] = comboData;
                this.setState({ selectedRecord });
            } else {
                selectedRecord[comboName] = []
                this.setState({ selectedRecord, availableQB: [] });
            }
        }
    }

    onFilterComboChange = (comboData, fieldName) => {

        const selectedRecord = this.state.selectedRecord || {};


        let registrationTypeValue = this.props.Login.masterData.registrationTypeValue;
        let registrationSubTypeValue = this.props.Login.masterData.registrationSubTypeValue;
        let templateVersionValue = this.props.Login.masterData.templateVersionValue;

        if (comboData) {

            selectedRecord[fieldName] = comboData.value;
            let inputParamData = {};
            if (fieldName === 'napprovalsubtypecode') {

                this.approvalSubTypeValue = comboData
                inputParamData = {
                    nFlag: 2,
                    napprovalsubtypecode: comboData.value,
                    ntemplatecode: comboData.item.ntemplatecode,
                    userinfo: this.props.Login.userInfo
                };

            } else if (fieldName === 'nregtypecode') {

                registrationTypeValue = comboData
                inputParamData = {
                    nFlag: 3,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    ntemplatecode: this.approvalSubTypeValue.item.ntemplatecode,
                    nregtypecode: comboData.value,
                    userinfo: this.props.Login.userInfo
                }

            } else if (fieldName === 'nregsubtypecode') {

                registrationSubTypeValue = comboData
                inputParamData = {
                    nFlag: 4,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    nregtypecode: registrationTypeValue.value,
                    nregsubtypecode: comboData.value,
                    ntemplatecode: this.approvalSubTypeValue.item.ntemplatecode,
                    userinfo: this.props.Login.userInfo
                }
            } else {

                this.templateVersionValue = comboData
                templateVersionValue = comboData
                inputParamData = {
                    nFlag: 5,
                    napprovalsubtypecode: this.approvalSubTypeValue.value,
                    nregtypecode: this.approvalSubTypeValue.value === 2 ? registrationTypeValue.value : -1,
                    nregsubtypecode: this.approvalSubTypeValue.value === 2 ? registrationSubTypeValue.value : -1,
                    ntemplatecode: this.approvalSubTypeValue.item.ntemplatecode,
                    nversioncode: comboData.value,
                    userinfo: this.props.Login.userInfo
                }
            }

            const oldState = {
                Approvalsubtype: this.props.Login.masterData.Approvalsubtype,
                RegistrationType: this.props.Login.masterData.RegistrationType,
                RegistrationSubType: this.props.Login.masterData.RegistrationSubType,
                TreeVersion: this.props.Login.masterData.TreeVersion,
                approvalSubTypeValue: this.approvalSubTypeValue,
                registrationTypeValue,
                registrationSubTypeValue,
                templateVersionValue,
                RegistrationTypeList: this.state.RegistrationTypeList,
                RegistrationSubTypeList: this.state.RegistrationSubTypeList,
                templateVersionOptionList: this.state.templateVersionOptionList
            }
            this.props.getUserMappingFilterChange(inputParamData, oldState, this.props.Login.masterData)

        } else {
            selectedRecord[fieldName] = "";
            if (fieldName === 'napprovalsubtypecode') {

                this.approvalSubTypeValue = []
                registrationTypeValue = []
                registrationSubTypeValue = []
                templateVersionValue = []

            } else if (fieldName === 'nregtypecode') {

                registrationTypeValue = []
                registrationSubTypeValue = []
                templateVersionValue = []

            } else if (fieldName === 'nregsubtypecode') {

                registrationSubTypeValue = []
                templateVersionValue = []

            } else {
                templateVersionValue = []
                this.templateVersionValue = []
            }
            this.setState({ selectedRecord });
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

    changeViewMode = (event) => {
        event.target.checked === true ? this.setState({ viewMode: "Grid" }) : this.setState({ viewMode: "List" })
    }

    copyData = () => {
        let napprovalsubtypecode = this.approvalSubTypeValue.value
        let nregsubtypecode = this.props.Login.masterData.registrationSubTypeValue.value;

        this.props.getCopyUserMapping(napprovalsubtypecode, nregsubtypecode, this.props.Login.userInfo, this.props.Login.masterData)
    }

   

    userSearchFilterChange = (comboData, comboName) => {
        let { selectedRecord, userList } = this.state || [];
        if (comboData) {
            if (comboName === 'nuserrolecode') {
                let roleUsers = []
                this.props.Login.userTree.map(x => {
                    if (x.nchildrolecode === comboData.value && !roleUsers.find(y => y.nchildusercode === x.nchildusercode)) {
                        roleUsers.push(x)
                    }
                    return null
                }
                )
                const userMap = constructOptionList(roleUsers, "nusermappingcode", "username", undefined, undefined, true);
                userList = userMap.get("OptionList");
                selectedRecord["filteredRole"] = comboData;
                selectedRecord["filteredUser"] = null
            } else {
                selectedRecord["filteredUser"] = comboData
            }
        } else {
            if (comboName === 'nuserrolecode') {
                selectedRecord["filteredRole"] = comboData;
                selectedRecord["filteredUser"] = null
                userList = []
            } else {
                selectedRecord["filteredUser"] = comboData
            }
        }
        this.setState({ selectedRecord, userList })
    }

    getRoottree(master, parent, filter, user, role) {
        let child = []
        this.child = []
        let userTree = this.props.Login.userTree ? this.props.Login.userTree : []
        let fiteredUserParentRole = []
        let fiteredUserParentUser = []
        let filteredUser = this.state.selectedRecord.filteredUser || user
        let filteredRole = this.state.selectedRecord.filteredRole || role
        if (filter) {
            this.props.Login.userTree.map(y => {
                if (filteredRole && y.nchildrolecode === filteredRole.value &&
                    y.nchildusercode === filteredUser.item.nchildusercode) {
                    fiteredUserParentRole.push(y.nparentrolecode)
                }
                if (y.nchildusercode === filteredUser.item.nchildusercode) {
                    fiteredUserParentUser.push(y.nparentusercode)
                }
                return null;
            })
        }
        userTree.forEach((element, index) => {
            const labelColor = ['#e63109', '#2fb47d', '#eaa203', '#6554c0'];
            const labelBGColor = ['#fcd7cd', '#e5f8f1', '#fcf3dd', '#e7e6f5'];
            const borderColor = ['#e6310', '#c6f6e4', '#fde2a4', '#cbc5f7'];

            if (element.nparusermappingcode === parent) {
                let status = true;
                element.suserimgftp !== null && this.props.Login.files && this.props.Login.files.includes(element.suserimgftp) ? status = true : status = false
                if (filteredRole && element.nchildrolecode === filteredRole.value) {
                    if (filteredUser && element.nchildusercode === filteredUser.item.nchildusercode) {
                        child.push(
                            {
                                id: element.nusermappingcode,
                                label:
                                    <div style={{ userSelect: 'none' }}>
                                        <AtHeader>
                                            <Media>
                                                {status && this.props.Login.settings && this.props.Login.settings[5] && element.suserimgftp && element.suserimgftp !== "" ?
                                                    <Image src={this.props.Login.settings[5] + element.suserimgftp} alt="avatar" className="img-profile rounded-circle mr-2" />
                                                    : <span className="img-profile rounded-circle mr-2" style={
                                                        {
                                                            background: labelBGColor[index % 4],
                                                            borderRadius: "50%",
                                                            border: `1px solid ${borderColor[index % 4]}`,
                                                            color: labelColor[index % 4],
                                                            padding: "3px"
                                                        }} >
                                                        {element.username &&
                                                            // element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                            element.username.split(" ").length > 1 ?
                                                            element.username.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                            element.username.split(" ")[1].substring(0, 1).toUpperCase()
                                                            :
                                                            element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                        }
                                                    </span>
                                                }
                                                <Media.Body>
                                                    <span className="user-name">{element.username}</span>
                                                    <span className="role" style={{ paddingTop: "3px" }}>{element.suserrolename}</span>
                                                </Media.Body>
                                            </Media>
                                        </AtHeader>
                                    </div>,
                                children: this.getRoottree(this.props.Login.userTree, element.nusermappingcode, filter, user, role)
                            }
                        )
                    }
                }
                else {

                    child.push(
                        {
                            id: element.nusermappingcode,
                            label:
                                <div style={{ userSelect: 'none' }}>
                                    {/* <Row>
                                        <Col className="p-1 pl-2" md={3}>
                                            {status ?
                                                < Image
                                                    src={fileViewUrl + "/SharedFolder/" + element.suserimgftp}
                                                    alt={"userimg"}
                                                    title={element.suserimgname}
                                                    // onError={this.addDefaultSrc}
                                                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                                                />
                                                :
                                                <span className={`mr-3 label-circle ${labelColor[index % 4]}`} style={
                                                    {
                                                        background: labelBGColor[index % 4],
                                                        borderRadius: "50%",
                                                        border: `1px solid ${borderColor[index % 4]}`,
                                                        color: labelColor[index % 4],
                                                        fontSize: "23px",
                                                        fontWeight: "300",
                                                        padding: "3px"
                                                    }} >
                                                    {element.username &&
                                                        // element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                        element.username.split(" ").length > 1 ?
                                                        element.username.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                        element.username.split(" ")[1].substring(0, 1).toUpperCase()
                                                        :
                                                        element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                    }
                                                </span>

                                            }
                                        </Col>
                                        <Col md={9}>
                                            <span className="d-flex ml-3">
                                                {element.username}
                                                <br />
                                                {element.suserrolename}
                                            </span>
                                        </Col>
                                    </Row> */}
                                    <AtHeader>
                                        <Media>
                                            {status && this.props.Login.settings && this.props.Login.settings[5] && element.suserimgftp && element.suserimgftp !== "" ?
                                                <Image src={this.props.Login.settings[5] + element.suserimgftp} alt="avatar" className="img-profile rounded-circle mr-2" />
                                                : <span className="img-profile rounded-circle mr-2" style={
                                                    {
                                                        background: labelBGColor[index % 4],
                                                        borderRadius: "50%",
                                                        border: `1px solid ${borderColor[index % 4]}`,
                                                        color: labelColor[index % 4],
                                                        padding: "3px"
                                                    }} >
                                                    {element.username &&
                                                        // element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                        element.username.split(" ").length > 1 ?
                                                        element.username.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                        element.username.split(" ")[1].substring(0, 1).toUpperCase()
                                                        :
                                                        element.username.split(" ")[0].substring(0, 1).toUpperCase()
                                                    }
                                                </span>
                                            }
                                            <Media.Body>
                                                <span className="user-name">{element.username}</span>
                                                <span className="role" style={{ paddingTop: "3px" }}>{element.suserrolename}</span>
                                            </Media.Body>
                                        </Media>
                                    </AtHeader>
                                </div>,
                            children: this.getRoottree(this.props.Login.userTree, element.nusermappingcode, filter, user, role)
                        }
                    )
                }
            }
        })
        return child
    }

    addDefaultSrc(ev) {
        ev.target.src = fileViewUrl() + "/SharedFolder/Default-User-Image.png"
    }

    // getchildtree(master, parent, child) {
    //     this.props.Login.userTree && this.props.Login.userTree.forEach(element => {
    //         if (element.nparusermappingcode === parent) {
    //             this.child.push(
    //                 {
    //                     id: element.nusermappingcode,
    //                     label:
    //                         <div className="d-flex justify-content-between" style={{ userSelect: 'none' }}>
    //                             <Row>
    //                                 <Col md={12}>
    //                                     {element.suserimgftp === null ?
    //                                         <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> :
    //                                         <img
    //                                             src={fileViewUrl + "/SharedFolder////" + element.suserimgftp}
    //                                             alt={"userimg"}
    //                                             // onClick={() => window.open(signImgPath, '_blank')}
    //                                             title={element.suserimgname}
    //                                             style={{ borderRadius: "50%", width: "30px" }}
    //                                         />
    //                                     }
    //                                 </Col>
    //                                 <Col md={11}>
    //                                     {element.username} <br /> {element.suserrolename}
    //                                 </Col>
    //                             </Row>
    //                         </div>,
    //                     children: this.getchildtree(this.props.Login.userTree, element.nusermappingcode)
    //                 }
    //             )
    //         }
    //     })
    //     return child;
    // }

    filterTree = () => {
        if (this.state.selectedRecord.filteredRole) {
            if (this.state.selectedRecord.filteredUser) {
                let siteName = this.props.Login.masterData.selectedSite ? this.props.Login.masterData.selectedSite.ssitename : ""
                let data = {
                    id: 0,
                    label:
                        <div>
                            <AtHeader>
                                <Media>
                                    <span className="img-profile rounded-circle mr-2" style={
                                        {
                                            background: "#e7e6f5",
                                            borderRadius: "50%",
                                            border: "1px solid #cbc5f7",
                                            color: "#6554c0",
                                            padding: "3px"
                                        }} >
                                        {
                                            siteName.split(" ").length > 1 ?
                                                siteName.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                                siteName.split(" ")[1].substring(0, 1).toUpperCase()
                                                :
                                                siteName.split(" ")[0].substring(0, 1).toUpperCase()
                                        }
                                    </span>
                                    <Media.Body>

                                        <span className="role" style={{ paddingTop: "6px" }}>{siteName}</span>
                                    </Media.Body>
                                </Media>
                            </AtHeader>
                        </div>,
                    children: this.getRoottree(this.props.Login.userTree || [], -2, true)
                }

                this.setState({ data })
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAUSERTOSEARCH" }))
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAUSERROLETOSEARCH" }))
        }
    }

    clearFilter = () => {

        let { selectedRecord, userList } = this.state
        selectedRecord["filteredUser"] = null
        selectedRecord["filteredRole"] = null
        userList = []
        let siteName = this.props.Login.masterData.selectedSite ? this.props.Login.masterData.selectedSite.ssitename : ""
        let data = {
            id: 0,
            label:
                <div>
                    <AtHeader>
                        <Media>
                            <span className="img-profile rounded-circle mr-2" style={
                                {
                                    background: "#e7e6f5",
                                    borderRadius: "50%",
                                    border: "1px solid #cbc5f7",
                                    color: "#6554c0",
                                    padding: "3px"
                                }} >
                                {
                                    siteName.split(" ").length > 1 ?
                                        siteName.split(" ")[0].substring(0, 1).toUpperCase() + "" +
                                        siteName.split(" ")[1].substring(0, 1).toUpperCase()
                                        :
                                        siteName.split(" ")[0].substring(0, 1).toUpperCase()
                                }
                            </span>
                            <Media.Body>
                                <span className="role" style={{ paddingTop: "6px" }}>{siteName}</span>
                            </Media.Body>
                        </Media>
                    </AtHeader>
                </div>,
            children: this.getRoottree(this.props.Login.userTree || [], -2, false)
        }
        this.setState({ data, selectedRecord, userList })
    }

    collapseAll = () => {
        this.setState({ expanded: !this.state.expanded })
    }
}


export default connect(mapStateToProps, {
    callService, crudMaster, openUserMappingModal, updateStore, getUserMappingGraphView, getCopyUserMapping,
    getUserMappingFilterChange, getUserMappingBySite, getChildUsers, validateEsignCredential,
    filterColumnData, getCopyUserMappingSubType,getUserMapping
})(injectIntl(UserMapping));