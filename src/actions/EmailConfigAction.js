import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { sortData, constructOptionList } from '../components/CommonScript';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus,mailScheduleType } from '../components/Enumeration';


//Added by sonia on 04th Nov 2025 for jira id:BGSI-155
export function reloadMailConfig(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("emailconfig/getEmailConfigData", { ...inputParam.inputData })
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.inputData.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 401 || error.response.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }

          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getEmailConfigDetail (emailconfig, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("emailconfig/getEmailConfigData", {'nemailconfigcode': emailconfig.nemailconfigcode, 'nemailtypecode': emailconfig.nemailtypecode, 'userinfo':userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
       if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
}}


export function openEmailConfigModal(screenName, operation,userinfo, ncontrolcode) {
    return function (dispatch) {
        if (operation === "create" || operation === "update") {
            const emailConfig = rsapi().post("/emailconfig/getEmailConfigDetails", {
                "userinfo": userinfo
            });
            let urlArray = [];
            let AvailableUsers = [];
            if (operation === "create") {

                urlArray = [emailConfig];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    selectedRecord["nemailconfigcode"] = 0;
                    selectedRecord["nusercode"] = undefined; // Added by Gowtham on 29th Oct 2025
                    AvailableUsers = response[0].data.Users;

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            emailHost: response[0].data.emailHost || [],
                            emailTemplate: response[0].data.emailTemplate|| [],
                            emailScreen: response[0].data.emailScreen|| [],
                            //ActionType: response[0].data.ActionType|| [],
                            //FormName:response[0].data.FormName|| [],
                            formControls:response[0].data.formControls|| [],
                             emailScreenScheduler:response[0].data.emailScreenScheduler|| [],
                            //EmailType: response[0].data.EmailType|| [], //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
                            UserRoles: response[0].data.UserRoles|| [], // Added by Gowtham on 29th Oct 2025
                            AvailableUsers,
                           // dataSource:response[0].data.dataSource||[],
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            gridUserRole: [],
                            gridUsers: [],
                            userRoleUsers: [],
                            emailUserQuery:[],
                            ncontrolcode, loading: false
                        }
                    })
                })
                .catch(error => {
                    dispatch(initRequest(false));
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        }
    }
}

export function fetchEmailConfigById(editParam) {
    return function (dispatch) {
        const URL1 = rsapi().post('emailconfig/getActiveEmailConfigById', { [editParam.primaryKeyField]: editParam.SelectedEmailConfig.nemailconfigcode, nemailtypecode:editParam.nemailtypecode,
            "userinfo": editParam.userInfo })
        dispatch(initRequest(true));
        Axios.all([URL1])
            .then(response => {
                let selectedRecord = {}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord = response[0].data.EmailConfig
                selectedRecord['nemailtemplatecode']={value:response[0].data.EmailConfig.nemailtemplatecode,
                                                     label:response[0].data.EmailConfig.stemplatename}
                selectedRecord['nemailscreencode']={value:response[0].data.EmailConfig.nemailscreencode,
                                                    label:response[0].data.EmailConfig.sscreenname, 
                                                    item:{nemailscreencode:response[0].data.EmailConfig.nemailscreencode,
                                                          sscreenname:response[0].data.EmailConfig.sscreenname,
                                                          nformcode:response[0].data.EmailConfig.nformcode,
                                                          sformname:response[0].data.EmailConfig.sformname}
                                                }
                //selectedRecord['nactiontype']={value:response[0].data.EmailConfig.nactiontype,label:response[0].data.EmailConfig.stransdisplaystatus}
                selectedRecord['nemailhostcode']={value:response[0].data.EmailConfig.nemailhostcode,label:response[0].data.EmailConfig.shostname}
                selectedRecord['nemailtypecode']={value:response[0].data.EmailConfig.nemailtypecode, //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
                                                  label:response[0].data.EmailConfig.semailtypename} //Added by sonia on 03th Sept 2025 for jira id:SWSM-12


               // selectedRecord['nuserrolecode']={value:response[0].data.EmailConfig.nuserrole,label:response[0].data.EmailConfig.suserrolename}
                selectedRecord['nenableemail']=response[0].data.EmailConfig.nenableemail
                selectedRecord['nuserrolecode']=constructOptionList(response[0].data.EmailUserRoles || [], "nuserrolecode", "suserrolename").get("OptionList"); // Added by Gowtham on 29th Oct 2025
                selectedRecord['nusercode']=constructOptionList(response[0].data.EmailUsers || [], "nusercode", "semail").get("OptionList"); // Added by Gowtham on 29th Oct 2025
               // selectedRecord['nformcode']={value:response[0].data.EmailConfig.nformcode,label:response[0].data.EmailConfig.sformname}
                if (response[0].data.EmailConfig.ncontrolcode !== -1){
                selectedRecord['ncontrolcode']={value:response[0].data.EmailConfig.ncontrolcode,label:response[0].data.EmailConfig.scontrolids}
                }
                if(response[0].data.EmailConfig.nemailscreenschedulercode !== -1){
                    selectedRecord['nemailscreenschedulercode']={value:response[0].data.EmailConfig.nemailscreenschedulercode,label:response[0].data.EmailConfig.sscheduletypename}
                } 

                if (response[0].data.EmailConfig.nemailuserquerycode !== -1){
                    selectedRecord['nemailuserquerycode']={value:response[0].data.EmailConfig.nemailuserquerycode,label:response[0].data.EmailConfig.sdisplayname}
                }
               
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        emailHost: response[0].data.emailHost || [],
                        emailTemplate: response[0].data.emailTemplate|| [],
                        emailScreen: response[0].data.emailScreen|| [],
                        //ActionType: response[0].data.ActionType|| [],
                        //FormName:response[0].data.FormName|| [],
                        formControls:response[0].data.formControls|| [],
                        emailScreenScheduler:response[0].data.emailScreenScheduler|| [],
                        //EmailType: response[0].data.EmailType || [], //Added by sonia on 03th Sept 2025 for jira id:SWSM-12
                        UserRoles: response[0].data.UserRoles || [], // Added by Gowtham on 29th Oct 2025
                        AvailableUsers: response[0].data.Users || [], // Added by Gowtham on 29th Oct 2025
                        emailUserQuery:response[0].data.emailUserQuery|| [],
                        selectedRecord,
                        operation: editParam.operation,
                        openModal: true,
                        screenName: editParam.screenName,
                        ncontrolcode: editParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

// Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
export function getUserRoles (screenName, operation, userinfo, ncontrolcode, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("emailconfig/getUserRoles", { "userinfo": userinfo })
        .then(response=>{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    UserRoles: response.data.userRole|| [],
                    operation,
                    screenName,
                    selectedRecord: selectedRecord || {},
                    openChildModel: true,
                    ncontrolcode, 
                    loading: false
            }});
            })
            .catch(error=>{
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                if (error.response.status === 401 || error.response.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response.status === 500){
                    toast.error(error.message);
                } else{               
                    toast.warn(error.response.data);
                }  
            })
    }
}

// Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
export function getEmailUserOnUserRole (selectedUserRole, userinfo, masterData) {            
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("emailconfig/getEmailUserOnUserRole", { "nuserrolecode": selectedUserRole.nuserrolecode,
            "nemailconfigcode": masterData.SelectedEmailConfig.nemailconfigcode, "userinfo": userinfo })
        .then(response=>{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: { ...masterData, ...response.data },
                    selectedUserRole,
                    loading: false
                }
            });
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 401 || error.response.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response.status === 500){
                toast.error(error.message);
            } else{               
                toast.warn(error.response.data);
            }  
        })
    }
}

// Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
export function getEmailUsers (screenName, selectedUserRole, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("emailconfig/getEmailUsers", { "nuserrolecode": selectedUserRole.nuserrolecode, "userinfo": userinfo })
        .then(response=>{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    ...response.data,
                    screenName,
                    openChildModel: true,
                    loading: false
                }
            });
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 401 || error.response.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response.status === 500){
                toast.error(error.message);
            } else{               
                toast.warn(error.response.data);
            }  
        })
    }
}

// Added by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
export function deleteEmailUserRole (inputData, masterData, selectedUserRole) {            
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("emailconfig/deleteUserRole", { ...inputData })
        .then(response=>{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: { ...masterData, ...response.data },
                    selectedUserRole,
                    loading: false
                }
            });
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 401 || error.response.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                    payload: {
                        navigation: 'forbiddenaccess',
                        loading: false,
                        responseStatus: error.response.status
                    }
                });
            } else if (error.response.status === 500){
                toast.error(error.message);
            } else{               
                toast.warn(error.response.data);
            }  
        })
    }
}

// Added isUserRole by Gowtham on 5 Nov 2025 for jira-id:BGSI-147
export function getUserEmailConfig (screenName, operation, primaryKey, SelectedEmailConfig, masterData, userinfo, ncontrolcode, isUserRole) {            
    return function (dispatch) {
    // Added if condition by Gowtham on 30 Oct 2025 for jira-id:BGSI-147
    if (screenName === "IDS_USERS" && !SelectedEmailConfig.nuserrolecode) {
        toast.info(intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
    } else {
        dispatch(initRequest(true));
        return rsapi().post("emailconfig/getUserEmailConfig", 
                                { nemailconfigcode: SelectedEmailConfig.nemailconfigcode || -1,
                                nuserrolecode: SelectedEmailConfig.nuserrolecode || -1,
                                isUserRole: isUserRole || false,
                                userinfo: userinfo})
        .then(response=>{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    users: response.data.users|| [],
                    UserRoles: response.data.userRole|| [], // Added by Gowtham on 29th Oct 2025
                   // dataSource:response[0].data.dataSource||[],
                    operation,
                    screenName,
                    selectedRecord: {},
                    openModal: true,
                    ncontrolcode, loading: false
            }});
            })
            .catch(error=>{
                dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response.status === 500){
                    toast.error(error.message);
                } else{               
                    toast.warn(error.response.data);
                }  
            })
        }
    }
}

//Modified by sonia on 04th Nov 2025 for jira id:BGSI-155
export function getFormControls (selectedRecord,userInfo) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi().post("emailconfig/getEmailConfigControl",
    {nformcode:selectedRecord.nemailscreencode.item.nformcode,userinfo:userInfo})
    .then(response=>{
        selectedRecord['ncontrolcode'] = undefined;
        selectedRecord['nemailuserquerycode'] = undefined;
        dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        formControls: response.data.formControls|| [],
                        emailUserQuery: response.data.emailUserQuery|| [],
                        // dataSource:response[0].data.dataSource||[],
                        //operation,
                        //screenName,
                        selectedRecord,
                        //openModal: true,
                        //ncontrolcode, 
                        loading: false
                }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500){
                toast.error(error.message);
            } 
            else{               
                toast.warn(error.response.data);
            }  
        })        
    }
}

//Added by sonia on 04th Nov 2025 for jira id:BGSI-155
export function getSchedulerForEmailScreen (selectedRecord,userInfo) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    return rsapi().post("emailconfig/getEmailConfigScheduler",{nformcode:selectedRecord.nemailscreencode.item.nformcode,userinfo:userInfo})
    .then(response=>{
        selectedRecord['nemailscreenschedulercode'] = undefined;
        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                emailScreenScheduler: response.data.emailScreenScheduler|| [],
                emailUserQuery: response.data.emailUserQuery|| [],
                selectedRecord,                        
                loading: false
            }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 401 || error.response.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
                });
            } else if (error.response.status === 500){
            toast.error(error.message);
            } else{               
            toast.warn(error.response.data);
            }  
        })        
    }
}

export function getEmailUserQuery (selectedRecord,masterData,userInfo) {            
    return function (dispatch) {  
    dispatch(initRequest(true));
    let  params={};
    if(masterData.emailTypeValue.nemailtypecode===mailScheduleType.CONTROL_BASED_MAIL){
        params ={
            nformcode:selectedRecord.nemailscreencode.item.nformcode,
            ncontrolcode:selectedRecord.ncontrolcode.value,
            nemailscreenschedulercode:-1
            
        };    
    }else if(masterData.emailTypeValue.nemailtypecode===mailScheduleType.SCHEDULE_BASED_MAIL){
        params ={
            nformcode:selectedRecord.nemailscreencode.item.nformcode,
            ncontrolcode:-1,
            nemailscreenschedulercode:selectedRecord.nemailscreenschedulercode.value,
        };    

    }
    return rsapi().post("emailconfig/getEmailUserQuery",{params,nemailtypecode:masterData.emailTypeValue.nemailtypecode, userinfo:userInfo})
    .then(response=>{
        selectedRecord['nemailuserquerycode'] = undefined;
        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                emailUserQuery: response.data.emailUserQuery|| [],                       
                selectedRecord,                        
                loading: false
            }});
        })
        .catch(error=>{
            dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
            if (error.response.status === 401 || error.response.status === 403) {
                dispatch({
                    type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
                });
            } else if (error.response.status === 500){
            toast.error(error.message);
            } else{               
            toast.warn(error.response.data);
            }  
        })        
    }
}