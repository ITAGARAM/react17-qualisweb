import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {DEFAULT_RETURN,UPDATE_PROFILE_IMAGE,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {sortData, getComboLabelValue, constructOptionList, rearrangeDateFormat} from '../components/CommonScript';
import { intl } from '../components/App';
import {transactionStatus} from '../components/Enumeration';

export function getUserDetail (user, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("users/getUsers", {nusercode:user.nusercode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response?.status === 429) {
            toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            dispatch({
            type: UN_AUTHORIZED_ACCESS,
                payload: {
                    navigation: 'forbiddenaccess',
                    loading: false,
                    responseStatus: error.response.status
                }
            });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
   })
}}

export function getUserComboService(inputParam){ 
    return function (dispatch) {    
    if (inputParam.operation === "create" || (inputParam.operation === "update" && inputParam.masterData.SelectedUser.ntransactionstatus !== transactionStatus.RETIRED))
    {       //ntransactionstatus = 7 -- User Retired           

            let userLogged = false;
            const designationService = rsapi().post("designation/getAllActiveDesignation", {userinfo:inputParam.userInfo});
            const departmentService = rsapi().post("department/getDepartment", {userinfo:inputParam.userInfo});
            const countryService = rsapi().post("country/getCountry", { userinfo:inputParam.userInfo});
            const roleService = rsapi().post("userrole/getInternalUserRoleComboData", { nsitecode:inputParam.userInfo.nmastersitecode, userinfo:inputParam.userInfo});
            const siteService = rsapi().post("site/getSite",{userinfo:inputParam.userInfo});
            const controlService = rsapi().post("controlmaster/getUploadControlsByFormCode", {userinfo:inputParam.userInfo});

            let urlArray = [];
            if (inputParam.operation === "create"){
                urlArray = [designationService, departmentService, countryService, roleService, siteService, controlService];
            }
            else{                    
                const userById =  rsapi().post("users/getActiveUsersById", 
                                { [inputParam.primaryKeyName] :inputParam.masterData.SelectedUser[inputParam.primaryKeyName] , 
                                    "userinfo": inputParam.userInfo} );
                urlArray = [designationService, departmentService, countryService, roleService, siteService, controlService, userById];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response=>{                   
                    let designation =[];
                    let country = [];
                    let department = [];

                    const designationMap = constructOptionList(response[0].data || [], "ndesignationcode",
                                          "sdesignationname", undefined, undefined, false);
                    const departmentMap  = constructOptionList(response[1].data  || [], "ndeptcode",
                                        "sdeptname" , undefined, undefined, true);
                    const countryMap = constructOptionList(response[2].data  || [], 'ncountrycode',
                                        'scountryname', undefined, undefined, true) ;
                    const roleMap = constructOptionList(response[3].data  || [],  "nuserrolecode",
                                        "suserrolename", undefined, undefined, true) ;
                    const siteMap = constructOptionList(response[4].data || [],"nsitecode", "ssitename",
                                            undefined, undefined, true) ;

                    const designationList = designationMap.get("OptionList");
                    const departmentList = departmentMap.get("OptionList");
                    const countryList = countryMap.get("OptionList");
                    const roleList = roleMap.get("OptionList");
                    const siteList = siteMap.get("OptionList");
                    
                    let selectedRecord =  {};
                   
                    if (inputParam.operation === "update"){
                        selectedRecord = response[6].data;
                        if (response[6].data["ndesignationcode"] !== -1){
                            designation.push({"value": response[6].data["ndesignationcode"],"label": response[6].data["sdesignationname"]});
                            selectedRecord["ndesignationcode"]= designation[0];
                        }
                        department.push({"value" : response[6].data["ndeptcode"], "label" : response[6].data["sdeptname"]});
                        country.push({"value": response[6].data["ncountrycode"], "label": response[6].data["scountryname"]});
                                             
                        selectedRecord["ndeptcode"] = department[0];
                        selectedRecord["ncountrycode"] = country[0];

                        if (selectedRecord["ddateofjoin"] !== null){
                            selectedRecord["ddateofjoin"] = rearrangeDateFormat(inputParam.userInfo, selectedRecord["sdateofjoin"]);
                             //new Date(selectedRecord["ddateofjoin"]);
                        }

                        if (inputParam.masterData.UserMultiRole.length > 0)
                        {
                            const foundIndex = inputParam.masterData.UserMultiRole.findIndex(
                                x => x["ndefaultrole"] === transactionStatus.YES);
                            const defaultRole =  inputParam.masterData.UserMultiRole[foundIndex] ;
                            
                            if (defaultRole && defaultRole.spassword && defaultRole.dpasswordvalidatedate ){
                                userLogged = true;
                            } 
                            else{
                                userLogged = false;
                            }   
                        }                                
                    }
                    else{                            
                        selectedRecord["ntransactionstatus"]  = transactionStatus.ACTIVE;
                        selectedRecord["nlockmode"] = transactionStatus.UNLOCK;
                       
                        selectedRecord["ndesignationcode"] =designationMap.get("DefaultValue");
                        selectedRecord["ndeptcode"] =departmentMap.get("DefaultValue");
                        selectedRecord["ncountrycode"] =countryMap.get("DefaultValue");
                       

                        const foundIndex = response[4].data.findIndex(
                            x => x["ndefaultstatus"] === transactionStatus.YES);
                        const defaultSite =  response[4].data[foundIndex];
                        if(defaultSite)
                            selectedRecord["usersite"] = {value:defaultSite["nsitecode"], label:defaultSite["ssitename"] };
                      
                        // if (response[3].data.length >0){
                        //     selectedRecord["nuserrolecode"] = {value:response[3].data[0]["nuserrolecode"], label:response[3].data[0]["suserrolename"]}
                        // }                        
                        userLogged = false;
                    }
                  
                    dispatch({type: DEFAULT_RETURN, payload:{designationList,//:response[0].data || [], 
                                                            departmentList,//:response[1].data  || [], 
                                                            countryList,//:response[2].data  || [],   
                                                            roleList,//:response[3].data  || [],  
                                                            siteList,//:response[4].data || [],   
                                                            uploadControlList:response[5].data || [],                              
                                                            operation:inputParam.operation, 
                                                            screenName:inputParam.screenName,   
                                                            selectedRecord, userLogged,
                                                            openModal : true,
                                                            ncontrolCode:inputParam.ncontrolcode,
                                                            loading:false
                                                            }});
                })
                .catch(error=>{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                        toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        });
                    } else if (error.response?.status === 500) {
                      toast.error(error.message);
                    } else {
                      toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                }) 
    }
    else{       
        toast.warn(intl.formatMessage({id: "IDS_CANNOTUPDATERETIREDUSER"}));
    }
}}

export function getUserMultiRoleComboDataService(inputParam) {            
    return function (dispatch) {    
       
        if (inputParam.masterData.SelectedUser.ntransactionstatus !== transactionStatus.RETIRED){
      
        const roleData = {"nusermultirolecode":inputParam.primaryKeyValue, "users" : inputParam.masterData.SelectedUser, 
                            "nusersitecode":inputParam.masterData.UsersSite.nusersitecode,
                            "nsitecode": inputParam.userInfo.nmastersitecode,
                            "userinfo":inputParam.userInfo};
        const roleService = rsapi().post("userrole/getUserRoleComboData", roleData);
        
        let urlArray = [];
        let selectedId = null;
        if (inputParam.operation === "create"){
            urlArray = [roleService];
        }
        else{
            const userMultiRoleById =  rsapi().post("users/getActiveUserMultiRoleById", { [inputParam.primaryKeyField] :inputParam.primaryKeyValue , "userinfo": inputParam.userInfo} );
            urlArray = [roleService, userMultiRoleById];
            selectedId = inputParam.primaryKeyValue;
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response=>{

                const userMultiRoleMap = constructOptionList(response[0].data || [], "nuserrolecode", "suserrolename",
                                            undefined, undefined, true) ;

                const userMultiRoleList = userMultiRoleMap.get("OptionList");
             
                let selectedRecord =  {"ntransactionstatus": transactionStatus.ACTIVE};
                if (inputParam.operation === "update"){
                    selectedRecord = response[1].data;
                    
                    selectedRecord["nuserrolecode"] = getComboLabelValue (selectedRecord, response[0].data, 
                        "nuserrolecode", "suserrolename");
                }        
              
                dispatch({type: DEFAULT_RETURN, payload:{roleListUserMultiRole:userMultiRoleList,  
                                openChildModal:true,
                                operation:inputParam.operation, screenName:inputParam.screenName,
                                selectedRecord, ncontrolCode:inputParam.ncontrolCode,   
                                loading:false, selectedId}});
            })
            .catch(error=>{
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            }) 
    }
    else{
        const message = "IDS_CANNOT".concat(inputParam.operation.toUpperCase()).concat("ROLERETIREDUSER");
        toast.warn(intl.formatMessage({id:message}));
    }
}}

export function getUserMultiDeputyComboDataService(inputParam){
    return function (dispatch) {   
    if (inputParam.masterData.SelectedUser.ntransactionstatus !== transactionStatus.RETIRED){       
        const comboDataService = rsapi().post("users/getComboDataforUserMultiDeputy", { nmastersitecode:inputParam.userInfo.nmastersitecode,
            nusersitecode: inputParam.masterData.UsersSite.nusersitecode, nusercode: inputParam.masterData.SelectedUser.nusercode,
            userinfo:inputParam.userInfo});
        let urlArray = [];
        let selectedId = null;
        if (inputParam.operation === "create"){
            urlArray = [comboDataService];
        }
        else{
            const userMultiDeputyById =  rsapi().post("users/getActiveUserMultiDeputyById", { [inputParam.primaryKeyField] :inputParam.primaryKeyValue , "userinfo": inputParam.userInfo} );
            urlArray = [comboDataService, userMultiDeputyById];
            selectedId = inputParam.primaryKeyValue;
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)                               
        .then(response=>{          

            const deputyUserMap = constructOptionList(response[0].data["DeputyUsersList"] || [], "nusersitecode", "sloginid",
                                     undefined, undefined, true) ;

            const userList = deputyUserMap.get("OptionList");

            const userMultiRoleMap = constructOptionList(response[0].data["UserRoleToAssignForDeputyUser"] || [], "nuserrolecode", "suserrolename",
                                    undefined, undefined, true) ;

            const userRoleListToAssignForDeputyUser = userMultiRoleMap.get("OptionList");

            const userListService = response[0].data["DeputyUsersList"];
            const userRoleListService = response[0].data["UserRoleToAssignForDeputyUser"];
                    
            let selectedRecord =  {"ntransactionstatus": transactionStatus.DEACTIVE};
            if (inputParam.operation === "update"){
                selectedRecord = response[1].data;
               
                let role = [];
                let deputyUser = [];
                let deputyName = "";
                userListService.map((option) => {                  
                    if (response[1].data && response[1].data["ndeputyusersitecode"] === option["nusersitecode"]){
                        deputyUser.push({"value":option["nusersitecode"], label:option["sloginid"]})
                        deputyName = option["sfirstname"] + " "+ option["slastname"];
                    }  
                    return null;                   
                })
                selectedRecord["ndeputyusersitecode"]= deputyUser[0];
                selectedRecord["sdeputyname"] = deputyName;

                userRoleListService.map((option) => {                  
                    if (response[1].data && response[1].data["nuserrolecode"] === option["nuserrolecode"]){
                        role.push({"value":option["nuserrolecode"], label:option["suserrolename"]})
                    }    
                    return null;                       
                })
                selectedRecord["nuserrolecode"]= role[0];
            }           
          
            dispatch({type: DEFAULT_RETURN, payload:{deputyUserList:userList,
                userRoleList:userRoleListToAssignForDeputyUser, 
                openChildModal:true,ncontrolCode:inputParam.ncontrolCode,
                operation:inputParam.operation, screenName:inputParam.screenName, selectedRecord,
                loading:false, selectedId}});
        })
        .catch(error=>{
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if (error.response?.status === 429) {
                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        }) 
    }
    else{
        const message = "IDS_CANNOT".concat(inputParam.operation.toUpperCase()).concat("DEPUTYRETIREDUSER");
        toast.warn(intl.formatMessage({id: message}));
    }
} }

export function getUserSiteDetail(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    const userSiteCode = inputParam.userSite.nusersitecode;
    let masterData = inputParam.masterData;
    
    return rsapi().post("users/getRoleDeputyByUserSite", {nusersitecode: userSiteCode, userinfo:inputParam.userInfo})
   .then(response=>{            
        const retrievedData =  response.data; 
        if (masterData === undefined){
            masterData = retrievedData
        }                       
        else{
            masterData = {...masterData, ...retrievedData};
        }          
        
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData,  dataState:undefined, loading:false}});   
   })
   .catch(error=>{
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response?.status === 429) {
            toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            dispatch({
            type: UN_AUTHORIZED_ACCESS,
                payload: {
                    navigation: 'forbiddenaccess',
                    loading: false,
                    responseStatus: error.response.status
                }
            });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
   })
}}

export function getUserSiteComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo,   ncontrolCode){
    return function (dispatch) {    
        if (masterData.SelectedUser.ntransactionstatus !== transactionStatus.RETIRED){
      
        const siteData = {"nusersitecode":primaryKeyValue, "users" : masterData.SelectedUser, "userinfo": userInfo};
        const siteService = rsapi().post("users/getUnAssignedSiteListByUser", siteData);

        let urlArray = [];
        if (operation === "create"){
            urlArray = [siteService];
        }
        else{                    
            const userSiteById =  rsapi().post("users/getActiveUsersSiteById", { [primaryKeyName] :primaryKeyValue , "userinfo": userInfo} );
            urlArray = [siteService, userSiteById];
        }
        dispatch(initRequest(true));
        Axios.all(urlArray)
        .then(response=>{

                const siteMap = constructOptionList(response[0].data || [], "nsitecode", "ssitename",
                             undefined, undefined, true) ;

                const siteList = siteMap.get("OptionList");

                let selectedRecord =  {"ndefaultsite": transactionStatus.NO};
                if (operation === "update"){
                    selectedRecord = response[1].data;
                    
                    selectedRecord["nsitecode"] = getComboLabelValue (selectedRecord, response[0].data, 
                        "nsitecode", "ssitename");
                }    
              //const siteList =  response[0].data;                         
              dispatch({type: DEFAULT_RETURN, payload:{siteList, openChildModal:true,
                                                        operation, screenName, ncontrolCode,
                                                        selectedRecord,  loading:false}});
            })
            .catch(error=>{
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            }) 
    }
    else{
        const message = "IDS_CANNOT".concat(operation.toUpperCase()).concat("SITERETIREDUSER");
        toast.warn(intl.formatMessage({id: message}));
    }
}}

export function viewUserImage(inputParam) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("users/viewSelectedUserImage", {users:inputParam.selectedUser, userinfo:inputParam.userInfo})
   .then(response=>{  
   
       // masterData = {...masterData, ...response.data};       
        //sortData(masterData);
        if(response.data.hasOwnProperty("rtn")){
            if(response.data["rtn"] === "Success" )
            {
                    const masterData = {...inputParam.masterData, ...response.data};
                    dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:"view", openModal:true, 
                    loading:false}}); 
            }
            else  
            {
                toast.warn(response.data["rtn"]);
                dispatch({type: DEFAULT_RETURN, payload:{loading:false}}); 
            }
        }
        else
        {
            const masterData = {...inputParam.masterData, ...response.data};
            dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:"view", openModal:true, 
                loading:false}}); 
        }
   })
   .catch(error=>{
        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
        if (error.response?.status === 429) {
            toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            dispatch({
            type: UN_AUTHORIZED_ACCESS,
                payload: {
                    navigation: 'forbiddenaccess',
                    loading: false,
                    responseStatus: error.response.status
                }
            });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(intl.formatMessage({ id: error.response.data }));
        }
   })
}}

export const getUserProfileImage=(userinfo)=>{

    return(dispatch)=>{
        dispatch(initRequest(true));
        rsapi().post("users/getUserProfilePictureData",{
            userinfo
        })        
        .then(response=>{            
           // console.log(response)
            dispatch({
                type: DEFAULT_RETURN,
                payload:{
                    profiledata : {...response.data},
                    openProfilePictureDialog: true,
                    // openCPModal: true,
                    screenName:"IDS_UPDATEUSERPROFILEIMAGE",
                    loading:false
                }
            });          
        })
        .catch(error=>{            
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if (error.response?.status === 429) {
                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export const getUpdatedUserProfileImage=(userinfo)=>{

    return(dispatch)=>{
        dispatch(initRequest(true));
        rsapi().post("users/getUpdateUserProfilePicture",{
            userinfo
        })        
        .then(response=>{            
           // console.log(response)
            if(response.data.Error && response.data.Error!=='' && response.data.Error!==undefined){
                toast.error( response.data.Error);
                dispatch({
                    type:DEFAULT_RETURN,
                    payload:{
                        loading:false
                    }    
                });
            }
            else{
                dispatch({
                    type: UPDATE_PROFILE_IMAGE,
                    payload:{
                        profiledata : {...response.data.rtn },
                        openProfilePictureDialog: false,
                        // openCPModal: false,  
                        loading:false                   
                    },
                    userImagePath:response.data['UserProfileImage']
                }); 
            }         
        })
        .catch(error=>{            
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if (error.response?.status === 429) {
                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export const updateUserProfilePicture=(file)=>{
    return(dispatch)=>{
        dispatch(initRequest(true));
        
        rsapi().post("users/updateUserProfilePicture",file)
        .then(response=>{
              
            if(response.status===200 && response.data.rtn ==="Success"){
                toast.success(intl.formatMessage({id:"IDS_IMAGEUPLOADED_SUCCESS"})); 
                const parsedObj = JSON.parse(file.get('userinfo'));
                dispatch(getUpdatedUserProfileImage(parsedObj));
            }
    
        }).catch(error=>{
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if (error.response?.status === 429) {
                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export const viewQR=(SelectedUser)=>{
    return(dispatch)=>{
        dispatch(initRequest(true));
        rsapi().post("users/viewQR",SelectedUser)
        .then(response=>{
            dispatch({type: DEFAULT_RETURN, 
                payload:{qrUrl:response.data.qrUrl,  openModal : true, operation:"viewQR", loading:false}});
        }).catch(error=>{
          dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
            if (error.response?.status === 429) {
                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                dispatch({
                type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export const closeProfilePictureDialog=()=>{

    return(dispatch)=>{
        dispatch({type:DEFAULT_RETURN, payload: {openProfilePictureDialog: false}})
    }
   
}
