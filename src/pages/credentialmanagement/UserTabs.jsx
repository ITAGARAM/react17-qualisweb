import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
// import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';

import {Row, Col, Card, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddUserMultiRole from './AddUserMultiRole';
import AddUserMultiDeputy from './AddUserMultiDeputy';
import AddUserSite from './AddUserSite';
import Esign from '../audittrail/Esign';
import UserMultiRoleTab from './UserMultiRoleTab';
import UserMultiDeputyTab from './UserMultiDeputyTab';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {showEsign} from '../../components/CommonScript';
import {transactionStatus} from '../../components/Enumeration';
import UserTabsAccordion from './UserTabsAccordion';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';


class UserTabs extends React.Component{
    constructor(props){
        super(props);  
        const roleDataState = {
            skip: 0,
            take: 10,
        }; 
        const deputyDataState = {
            skip: 0,
            take: 10,
        };       
        this.state = { 
                        selectedRecord:{},  dataResult:[],
                        roleDataState, deputyDataState};

                     
        this.multiRoleColumnList=[{"idsName":"IDS_ROLE","dataField":"suserrolename","width":"200px"},
                                    {"idsName":"IDS_DEFAULTROLE","dataField":"sdefaultstatus","width":"200px"},
                                    {"idsName":"IDS_ACTIVESTATUS","dataField":"sactivestatus","width":"200px"},
                                    ];

        this.multiDeputyColumnList=[{"idsName":"IDS_ROLE","dataField":"suserrolename","width":"150px"},
                                    {"idsName":"IDS_DEPUTYID","dataField":"sdeputyid","width":"150px"},
                                    {"idsName":"IDS_DEPUTYNAME","dataField":"sdeputyname","width":"150px"},
                                    {"idsName":"IDS_ACTIVESTATUS","dataField":"sdisplaystatus","width":"150px"},
                                    ];      

        this.confirmMessage = new ConfirmMessage();
    }    

    render(){

        const addUsersSiteId = this.props.controlMap.has("AddSite") && this.props.controlMap.get("AddSite").ncontrolcode;
        const usersSiteList = this.props.masterData.UsersSiteList ;

        let mandatoryFields =[];
        if (this.props.screenName === "IDS_SITE"){
            mandatoryFields.push({"idsName":"IDS_SITE","dataField":"nsitecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"});
        }
        else if (this.props.screenName === "IDS_ROLE"){
            mandatoryFields.push({"idsName":"IDS_USERROLE","dataField":"nuserrolecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"});
        }
        else{
            mandatoryFields.push({"idsName":"IDS_DEPUTYID","dataField":"ndeputyusersitecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                    {"idsName":"IDS_USERROLE","dataField":"nuserrolecode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"});
        }

        return(
            <>
                <Row noGutters>
                    <Col md={12}>  
                        <Card className="at-tabs border-0">
                            <Row noGutters>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                    <Nav.Link name="addSite" className="add-txt-btn" 
                                              hidden={this.props.userRoleControlRights.indexOf(addUsersSiteId) === -1}
                                              onClick={()=>this.props.getUserSiteComboService("IDS_SITE", "create", "nusersitecode", -2, this.props.masterData, this.props.userInfo, addUsersSiteId)}>
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id='IDS_SITE' defaultMessage='Site' />
                                    </Nav.Link>
                                    </div>
                                </Col>
                            </Row>
                            <Row noGutters>
                                <Col md={12}>
                                {usersSiteList.length > 0 && this.props.masterData.UsersSite ?
                                    <CustomAccordion    key="filter"   
                                                        accordionTitle={"ssitename"}                                                                     
                                                        accordionComponent={this.userSiteAccordion(usersSiteList)}
                                                        inputParam={{masterData:this.props.masterData, userInfo:this.props.userInfo}}                                    
                                                        accordionClick={this.props.getUserSiteDetail}  
                                                        accordionPrimaryKey={"nusersitecode"}  
                                                        accordionObjectName={"userSite"} 
                                                        selectedKey={this.props.masterData.UsersSite.nusersitecode}
                                                        />
                                 :""}
                                </Col>
                            </Row>
                         </Card>   
                    </Col>
                </Row>
                
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.openChildModal ? 
                <SlideOutModal show={this.props.openChildModal} 
                    closeModal={this.closeModal}  
                    operation={this.props.operation}
                    inputParam={this.props.inputParam}  
                    screenName={this.props.screenName}
                    showSaveContinue={this.props.screenName === "IDS_SITE" || this.props.screenName === "IDS_ROLE" ? true:false}    
                    onSaveClick={this.onSaveClick} 
                    updateStore={this.props.updateStore}
                    esign={this.props.loadEsign}
                    validateEsign={this.validateEsign}   
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}           
                    addComponent ={this.props.loadEsign ? 
                                <Esign  operation={this.props.operation}
                                        onInputOnChange={this.onInputOnChange}
                                        inputParam={this.props.inputParam}                                               
                                        selectedRecord={this.state.selectedRecord ||{}}
                                 /> :
                                 this.props.screenName === "IDS_SITE" ? 
                                    <AddUserSite selectedRecord={this.state.selectedRecord || {}} 
                                                        onInputOnChange={this.onInputOnChange}                                 
                                                        onComboChange={this.onComboChange}                                                      
                                                        siteList={this.props.siteList || []}
                                                        selectedUser={this.props.masterData.SelectedUser || {}}/>
                                    : this.props.screenName === "IDS_ROLE" ? 
                                        <AddUserMultiRole selectedRecord={this.state.selectedRecord || {}}                                  
                                                            onInputOnChange={this.onInputOnChange}
                                                            onComboChange={this.onComboChange}                                                      
                                                            roleList={this.props.roleList || []}
                                                            selectedUser={this.props.masterData.SelectedUser || {}}
                                                            /> 
                                         : <AddUserMultiDeputy selectedRecord={this.state.selectedRecord ||{}}                                  
                                                            onInputOnChange={this.onInputOnChange}
                                                            onComboChange={this.onComboChange}                                                           
                                                            userRoleList={this.props.userRoleList || []}
                                                            deputyUserList={this.props.deputyUserList || []}
                                                            selectedUser={this.props.masterData.selectedUser ||{}}
                                                            operation={this.props.operation}
                                                         />
                                    }               
                        
                />:""}
            </>
        ) 
    }

    userSiteAccordion = (userSiteList) => {
        const selectedUserSite = this.props.masterData.UsersSite;
        const foundIndex = userSiteList.findIndex(
            x => x["nusersitecode"] === selectedUserSite.nusersitecode
        );
        userSiteList[foundIndex] = selectedUserSite; 

        const accordionMap = new Map();
        userSiteList.map((userSite)=>
            accordionMap.set(userSite.nusersitecode, 
                <UserTabsAccordion  userSite={userSite}  
                                    accordionTitle="ssitename"                                 
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    controlMap={this.props.controlMap}
                                    userInfo={this.props.userInfo} 
                                    getUserSiteComboService={this.props.getUserSiteComboService}
                                    masterData={this.props.masterData}
                                    ConfirmDelete={this.ConfirmDelete}
                                    tabDetail={this.tabDetail(userSite)}   
                                    onTabChange = {this.onTabChange}                                                                              
                    />)
        )
        return accordionMap;
    }
    ConfirmDelete = (obj) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(obj));
    }
    tabDetail = (userSite) => {
        const tabMap = new Map();
        tabMap.set("IDS_USERMULTIROLE", <UserMultiRoleTab   userRoleControlRights={this.props.userRoleControlRights}
                                                            controlMap={this.props.controlMap}
                                                            inputParam={this.props.inputParam}
                                                            userInfo={this.props.userInfo}  
                                                            screenName={"IDS_ROLE"}                                                            
                                                            resetPassword={this.resetPassword}                                                            
                                                            getUserMultiRoleComboDataService={this.props.getUserMultiRoleComboDataService}
                                                            masterData={this.props.masterData}
                                                            userSite={userSite}
                                                            dataResult={this.props.masterData["UserMultiRole"]||[]}
                                                            // dataResult={process(this.props.masterData["UserMultiRole"],(this.props.screenName === undefined || this.props.screenName === "IDS_ROLE") ?this.state.roleDataState :{skip:0, take:10})}
                                                            dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_ROLE") ?  
                                                                            this.state.roleDataState :{skip:0, take:10}}
                                                            dataStateChange={(event)=> this.setState({roleDataState: event.dataState})}
                                                            multiRoleColumnList={this.multiRoleColumnList}
                                                            deleteRecord={this.deleteRecord} 
                                                            selectedId={this.props.selectedId}
                                                    />)
        tabMap.set("IDS_USERMULTIDEPUTY", <UserMultiDeputyTab   userRoleControlRights={this.props.userRoleControlRights}
                                                                controlMap={this.props.controlMap}
                                                                inputParam={this.props.inputParam}
                                                                userInfo={this.props.userInfo}   
                                                                screenName={"IDS_DEPUTY"} 
                                                                getUserMultiDeputyComboDataService={this.props.getUserMultiDeputyComboDataService}
                                                                masterData={this.props.masterData}
                                                                userSite={userSite}
                                                                dataResult={this.props.masterData["UserMultiDeputy"]||[]}
                                                                // dataResult={process(this.props.masterData["UserMultiDeputy"],(this.props.screenName === undefined || this.props.screenName === "IDS_DEPUTY") ?this.state.deputyDataState :  {skip:0, take:10})}
                                                                dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_DEPUTY") ? 
                                                                                this.state.deputyDataState :  {skip:0, take:10}}
                                                                dataStateChange={(event)=> this.setState({deputyDataState: event.dataState})}
                                                                multiDeputyColumnList={this.multiDeputyColumnList}
                                                                deleteRecord={this.deleteRecord} 
                                                                selectedId={this.props.selectedId}
                                                    />)
       return tabMap;
    }    

    onTabChange = (tabProps) =>{
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {screenName}
        }
        this.props.updateStore(updateInfo);
    }
    
    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign){          
            if (this.props.operation === "delete" || this.props.operation === "reset"){
                loadEsign = false;
                openChildModal =  false;

                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
            else{
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
              selectedRecord['esigncomments'] = ""
              selectedRecord['esignreason']=""
            }
        }
        else{
            openChildModal =  false;
            selectedRecord={};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {openChildModal, loadEsign, selectedRecord, selectedId:null}
        }
        this.props.updateStore(updateInfo);
        
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
       
        if(fieldName === "ndeputyusersitecode"){
            if (comboData === null){
                selectedRecord["sdeputyname"] ="";
            }
            else{
                this.props.deputyUserList.map(dataItem=>{
                    if (dataItem.item.nusersitecode === comboData.value){
                        selectedRecord["sdeputyname"] =  dataItem.item.sfirstname + " " +dataItem.item.slastname 
                    }
                    return null;      
                }) 
            }        
        }
        this.setState({selectedRecord});
        
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
      
        if (event.target.type === 'checkbox')
        {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else if (event.target.name === "nlockmode")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else    
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else{
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({selectedRecord});
    }

    componentDidUpdate(previousProps){       
        if (this.props.masterData !== previousProps.masterData ){    
            let {roleDataState, deputyDataState} = this.state;
                if(this.props.dataState === undefined){
                    if (this.props.screenName === "IDS_ROLE")
                    {
                        roleDataState = {skip:0,take:10};
                    }
                    else if (this.props.screenName === "IDS_DEPUTY")
                    {
                        deputyDataState = {skip:0,take:10};
                    }
                    else// if (this.props.screenName === "IDS_SITE")
                    {
                        roleDataState = {skip:0,take:10};
                        deputyDataState = {skip:0,take:10};
                    }
                }         
            this.setState({ roleDataState, deputyDataState});
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord ){             
            this.setState({selectedRecord:this.props.selectedRecord});
         }       
    }

    onSaveClick = (saveType, formRef) => {
              //add / edit  
        let inputParam = {};
        let clearSelectedRecordField =[];
        if (this.props.screenName === "IDS_ROLE")
        {
            inputParam = this.saveRole(saveType, formRef);

            clearSelectedRecordField =[
                
                { "idsName": "IDS_DEFAULTROLE", "dataField": "ndefaultrole", "width": "100px","isClearField":true,"preSetValue":4},
                { "idsName": "IDS_ISACTIVE", "dataField": "ntransactionstatus", "width": "100px","isClearField":true,"preSetValue":1},
                
            ]
        }
        else if (this.props.screenName === "IDS_DEPUTY")
        {
            inputParam = this.saveDeputy(saveType, formRef);
        }
        else if (this.props.screenName === "IDS_SITE")
        {
            inputParam = this.saveUserSite(saveType, formRef);

            clearSelectedRecordField =[
                
                { "idsName": "IDS_DEFAULTSITE", "dataField": "ndefaultsite", "width": "100px","isClearField":true,"preSetValue":4},
                
            ]
        }
      
       if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else{
            if(this.props.screenName === "IDS_SITE" || this.props.screenName === "IDS_ROLE")
            {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal","","",clearSelectedRecordField);
            }
            else
            {
               this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
           
    }
    
    saveRole(saveType, formRef ){
       
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["users"] = this.props.masterData.SelectedUser;
        inputData["usermultirole"] = {};
  
        let dataState = undefined;
        let selectedId = null;

        let postParam = undefined;
        if ( this.props.operation === "update"){
            // edit
            postParam =  { inputListName : "Users", selectedObject : "SelectedUser", primaryKeyField : "nusercode" };
           
            inputData["usermultirole"] = JSON.parse(JSON.stringify(this.props.selectedRecord));      
            selectedId = this.props.selectedRecord.nusermultirolecode; 
            dataState = this.state.roleDataState;  
        }
        if (inputData["usermultirole"].hasOwnProperty('esignpassword')) {
            if (inputData["usermultirole"]['esignpassword'] === '') {
                delete inputData["usermultirole"]['esigncomments']
                delete inputData["usermultirole"]['esignpassword']
                delete inputData["usermultirole"]['esignreason']

            }
        }        
        inputData["usermultirole"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : "";
        inputData["usermultirole"]["nusersitecode"] = this.props.masterData.UsersSite.nusersitecode;
     
        inputData["usermultirole"]["ndefaultrole"] = this.state.selectedRecord["ndefaultrole"] ? this.state.selectedRecord["ndefaultrole"]:transactionStatus.NO;
        inputData["usermultirole"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"];
        const inputParam = {
                                classUrl: this.props.inputParam.classUrl,
                                methodUrl: "UserMultiRole", 
                                inputData: inputData, selectedId, dataState, postParam,
                                operation: this.props.operation , saveType, formRef , selectedRecord:{...this.state.selectedRecord}      
                            }       
        return inputParam;
    }

    saveDeputy(saveType, formRef ){
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["users"] = this.props.masterData.SelectedUser;
        inputData["usermultideputy"]  = {};
  
        let dataState = undefined;
        let selectedId = null;

        let postParam = undefined;

        if ( this.props.operation === "update"){
            // edit
            postParam =  { inputListName : "Users", selectedObject : "SelectedUser", primaryKeyField : "nusercode" };
           
            inputData["usermultideputy"] = JSON.parse(JSON.stringify(this.props.selectedRecord));  
            selectedId = this.props.selectedRecord.nusermultideputycode; 
            dataState = this.state.deputyDataState;       
        }
        if (inputData["usermultideputy"].hasOwnProperty('esignpassword')) {
            if (inputData["usermultideputy"]['esignpassword'] === '') {
                delete inputData["usermultideputy"]['esigncomments']
                delete inputData["usermultideputy"]['esignpassword']
                delete inputData["usermultideputy"]['esignreason']
            }
        }     
        inputData["usermultideputy"]["nuserrolecode"] = this.state.selectedRecord["nuserrolecode"] ? this.state.selectedRecord["nuserrolecode"].value : "";
        inputData["usermultideputy"]["nusersitecode"] = this.props.masterData.UsersSite.nusersitecode;
        inputData["usermultideputy"]["ndeputyusersitecode"] = this.state.selectedRecord["ndeputyusersitecode"] ? this.state.selectedRecord["ndeputyusersitecode"].value : "";                                      
        inputData["usermultideputy"]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"];

        const inputParam = {
                                classUrl: this.props.inputParam.classUrl,
                                methodUrl: "UserMultiDeputy",                         
                                inputData: inputData, selectedId, dataState, postParam,
                                operation: this.props.operation, saveType, formRef  , selectedRecord:{...this.state.selectedRecord}     
                            }
        return inputParam;
    }

    saveUserSite(saveType, formRef ){      
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["userssite"] = {};
  
        let postParam = undefined;
        if ( this.props.operation === "update"){
            // edit
            postParam =  { inputListName : "Users", selectedObject : "SelectedUser", primaryKeyField : "nusercode" };
           
            inputData["userssite"] = JSON.parse(JSON.stringify(this.props.selectedRecord));         
        }
        inputData["userssite"]["nusercode"] = this.props.masterData.SelectedUser.nusercode;  
        inputData["userssite"]["nsitecode"] = this.state.selectedRecord["nsitecode"] ? this.state.selectedRecord["nsitecode"].value : "";
        inputData["userssite"]["ndefaultsite"] = this.state.selectedRecord["ndefaultsite"] ? this.state.selectedRecord["ndefaultsite"]:transactionStatus.NO;
        const inputParam = {
                                classUrl: this.props.inputParam.classUrl,
                                methodUrl: "UsersSite", 
                                inputData: inputData, dataState :undefined, postParam,
                                operation: this.props.operation, saveType, formRef ,selectedRecord:{...this.state.selectedRecord}      
                            }       
        return inputParam;
    }

    resetPassword = () =>{
        if (this.props.masterData.SelectedUser.ntransactionstatus === transactionStatus.RETIRED){
            toast.warn(this.props.intl.formatMessage({id: "IDS_CANNOTRESETPWDRETIREDUSER"}));
        }
        else{
            const inputParam = {
                                    classUrl: this.props.inputParam.classUrl,
                                    methodUrl:"Password",                                  
                                    inputData: {"users":this.props.masterData.SelectedUser,
                                                "userinfo": this.props.userInfo,
                                                "nusersitecode":this.props.masterData.UsersSite.nusersitecode
                                            },
                                    operation:"reset",
                                    dataState:this.state.roleDataState,
                                    selectedRecord:{...this.state.selectedRecord}    
                            }     
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.controlMap.get("ResetPassword").ncontrolcode)){
                const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, 
                            openChildModal:true, screenName:"IDS_ROLE", operation:"reset"
                            }
                        }
                    this.props.updateStore(updateInfo);
            }
            else{              
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal"); 
            }          
        }
    }

    deleteRecord = (deleteParam) =>{       
       
        if (this.props.masterData.SelectedUser.ntransactionstatus === transactionStatus.RETIRED){
            //const message = "IDS_CANNOTDELETE"+deleteParam.screenName.toUpperCase() +"RETIREDUSER";
            const message = "IDS_CANNOTDELETE"+deleteParam.screenName.split("IDS_")[1].toUpperCase() +"RETIREDUSER";
            toast.warn(this.props.intl.formatMessage({id:message}));
        }
        else{
            let dataState = undefined;
            if (this.props.screenName === "IDS_ROLE")
            {
                dataState = this.state.roleDataState;
            }
            else if (this.props.screenName === "IDS_DEPUTY")
            {
                dataState = this.state.deputyDataState;
            }
            const postParam = { inputListName : "Users", selectedObject : "SelectedUser",
                                primaryKeyField : "nusercode", 
                                primaryKeyValue : this.props.masterData.SelectedUser.nusercode,
                                fetchUrl : "users/getUsers",
                                fecthInputObject : {userinfo:this.props.userInfo},
        } 
            const inputParam = {
                                    classUrl: this.props.inputParam.classUrl,
                                    methodUrl:deleteParam.methodUrl,                                  
                                    inputData: {[deleteParam.methodUrl.toLowerCase()] :deleteParam.selectedRecord,
                                                "userinfo": this.props.userInfo,
                                                "users":this.props.masterData.SelectedUser},
                                    operation:deleteParam.operation , dataState, postParam,
                                    selectedRecord:{...this.state.selectedRecord}
                                }        
         
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)){
                const updateInfo = {
                     typeName: DEFAULT_RETURN,
                     data: {
                         loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, 
                         openChildModal:true, screenName:deleteParam.screenName, operation:deleteParam.operation
                         }
                     }
                 this.props.updateStore(updateInfo);
             }
             else{
                 this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
             }
        }
    }  

    validateEsign = () =>{       
        const inputParam = {
                                inputData: {"userinfo": {...this.props.userInfo, 
                                                        sreason: this.state.selectedRecord["esigncomments"],
                                                        nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                                        spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                                                    },
                                             password : this.state.selectedRecord["esignpassword"]
                                            },
                                screenData : this.props.screenData
                            }        
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
}

export default injectIntl(UserTabs);