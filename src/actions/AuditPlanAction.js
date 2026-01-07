import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import Axios from 'axios';
import { sortData,rearrangeDateFormat,constructOptionList,replaceUpdatedObject } from '../components/CommonScript';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus,attachmentType } from '../components/Enumeration';
import {postCRUDOrganiseTransSearch,crudMaster } from './ServiceAction';

export function reloadAuditPlan(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("auditplan/getAuditPlanData", { ...inputParam.inputData })
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.inputData.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedAuditPlan'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        auditPlanSkip: 0,
                        auditPlanTake: undefined,
                        loading: false
                    }
                })
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export const getAuditPlanDetail = (auditPlanItem) => {
    return function (dispatch) {
        dispatch(initRequest(true));
       
         rsapi().post("/auditplan/getSelectionAuditPlanById", {"nauditplancode": parseInt(auditPlanItem.nauditplancode),userinfo: auditPlanItem.userinfo })
            .then(response => {                
                    let masterData = {...auditPlanItem.masterData, ...response.data };

                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        masterData,
                        auditPlanSkip:auditPlanItem.auditPlanSkip,
                        auditPlanTake:auditPlanItem.auditPlanTake
                        
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }
}    

export function getAuditPlanComboService(addParam) {
    return function (dispatch) {
        let userInfo=addParam.userInfo;
        let urlArray=[];
               

        const auditMasterService =  rsapi().post("auditplan/getAuditMaster", { userinfo: userInfo });
        const auditTypeService =  rsapi().post("auditplan/getAuditType", { userinfo: userInfo });
        const auditCategoryService =  rsapi().post("auditplan/getAuditCategory", { userinfo: userInfo });
        const auditStandardCategoryService =  rsapi().post("auditplan/getAuditStandardCategory", { userinfo: userInfo });
        const departmentService =  rsapi().post("auditplan/getDepartment", { userinfo: userInfo });
        const timeZoneService =  rsapi().post("timezone/getTimeZone", { userinfo: userInfo });
        const localTimeZoneService =  rsapi().post("timezone/getLocalTimeByZone", { userinfo: userInfo });
        const usersService =  rsapi().post("auditplan/getUsers", { userinfo: userInfo });


        urlArray=[auditMasterService,auditTypeService,auditCategoryService,auditStandardCategoryService,departmentService,
                  timeZoneService,localTimeZoneService,usersService];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {     
                    let selectedId = null;
                    let auditMaster;
                    let auditType;
                    let auditCategory;
                    let auditStandardCategory;
                    let department;
                    let departmentHead; //Added by sonia on 17th sept 2025  for jira id:SWSM-28
                    let timeZone;
                    let users;
                    let selectedRecord={};

                    let currentTime = rearrangeDateFormat(addParam.userInfo, response[6].data?.date);
                    selectedRecord = { ...addParam.selectedRecord, "dauditdatetime": currentTime };

                    if(addParam.userInfo.isutcenabled === transactionStatus.YES){
                        selectedRecord.ntzauditdatetime={
                            "value": addParam.userInfo.ntimezonecode,
                            "label": addParam.userInfo.stimezoneid
                        }               
                    }         

                    const auditMasterMap = constructOptionList(response[0].data.auditMaster || [], "nauditmastercode","sauditorname", undefined, undefined, true);
                    const auditTypeMap = constructOptionList(response[1].data.auditType || [], "naudittypecode","saudittypename", undefined, undefined, true);
                    const auditCategoryMap = constructOptionList(response[2].data.auditCategory || [], "nauditcategorycode","sauditcategoryname", undefined, undefined, true);
                    const auditStandardCategoryMap = constructOptionList(response[3].data.auditStandardCategory || [], "nauditstandardcatcode","sauditstandardcatname", undefined, undefined, true);
                    const departmentMap = constructOptionList(response[4].data.department || [], "ndeptcode","sdeptname", undefined, undefined, true);
                    const timeZoneMap = constructOptionList(response[5].data || [], "ntimezonecode","stimezoneid", undefined, undefined, true);
                    const usersMap = constructOptionList(response[7].data.Users || [], "nusercode","susername", undefined, undefined, true);


                    auditMaster = auditMasterMap.get("OptionList");
                    auditType = auditTypeMap.get("OptionList");
                    auditCategory = auditCategoryMap.get("OptionList");
                    auditStandardCategory = auditStandardCategoryMap.get("OptionList");
                    department = departmentMap.get("OptionList");
                    timeZone = timeZoneMap.get("OptionList");
                    users = usersMap.get("OptionList");

                    selectedId = addParam.primaryKeyField;
                     let masterData={...addParam.masterData}
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            auditMaster,
                            auditType,
                            auditCategory,
                            auditStandardCategory,
                            department,
                            departmentHead,         //Added by sonia on 17th sept 2025  for jira id:SWSM-28

                            timeZone,
                            users,
                            operation: addParam.operation,
                            screenName: addParam.screenName,
                            selectedRecord: selectedRecord,
                            masterData,
                            openModal: true,
                            ncontrolcode: addParam.ncontrolCode,
                            loading: false, 
                            selectedId,
                            currentTime
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })        
    }
}

export function getDepartmentHead(ndeptcode,userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return  rsapi().post("auditplan/getDepartmentHead", {"ndeptcode": ndeptcode,"userinfo": userInfo})
            .then(response => {
                let departmentHead = [];                
                const departmentHeadMap = constructOptionList(response.data && response.data.departmentHead || [], "ndeptheadcode","sdeptheadname",
                     undefined, undefined, false);
                departmentHead = departmentHeadMap.get("OptionList");
                selectedRecord["ndeptheadcode"]="";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        departmentHead,                      
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}

export function getEditAuditPlanComboService(editParam) {
    return function (dispatch) {
        let userInfo=editParam.userInfo;
        let primaryKeyField = editParam.primaryKeyField;
        let urlArray=[];
               
        const editComboService =  rsapi().post("auditplan/getActiveAuditPlanById", { "nauditplancode": editParam.masterData.selectedAuditPlan[0].nauditplancode, userinfo: userInfo });
        const auditTypeService =  rsapi().post("auditplan/getAuditType", { userinfo: userInfo });
        const auditCategoryService =  rsapi().post("auditplan/getAuditCategory", { userinfo: userInfo });
        const auditStandardCategoryService =  rsapi().post("auditplan/getAuditStandardCategory", { userinfo: userInfo });
        const departmentService =  rsapi().post("auditplan/getDepartment", { userinfo: userInfo });
        const timeZoneService =  rsapi().post("timezone/getTimeZone", { userinfo: userInfo });


        urlArray=[editComboService,auditTypeService,auditCategoryService,auditStandardCategoryService,departmentService,timeZoneService];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {     
                    let selectedId = null;
                    let auditType;
                    let auditCategory;
                    let auditStandardCategory;
                    let department;
                    let timeZone;
                    let selectedRecord={};

                    let editData =response[0].data.selectedAuditPlan[0];

                    let currentTime = rearrangeDateFormat(editParam.userInfo, editData['sauditdatetime']);
                    
                    selectedRecord = { ...editParam.selectedRecord, "dauditdatetime": currentTime };

                    if(editParam.userInfo.isutcenabled === transactionStatus.YES){
                        selectedRecord.ntzauditdatetime={
                            "value": editData.ntzauditdatetime,
                            "label": editData.stimezoneid
                        }               
                    }         

                    selectedRecord.naudittypecode={
                        "value": editData.naudittypecode,
                        "label": editData.saudittypename
                    } 

                    selectedRecord.nauditcategorycode={
                        "value": editData.nauditcategorycode,
                        "label": editData.sauditcategoryname
                    } 

                    selectedRecord.nauditstandardcatcode={
                        "value": editData.nauditstandardcatcode,
                        "label": editData.sauditstandardcatname
                    } 

                    selectedRecord.ndeptcode={
                        "value": editData.ndeptcode,
                        "label": editData.sdeptname
                    } 

                     selectedRecord.ndeptheadcode={
                        "value": editData.ndeptheadcode,
                        "label": editData.sdeptheadname
                    } 
                    selectedRecord["saudittitle"]=editData.saudittitle;
                    selectedRecord["scompauditrep"]=editData.scompauditrep;

                    const auditTypeMap = constructOptionList(response[1].data.auditType || [], "naudittypecode","saudittypename", undefined, undefined, true);
                    const auditCategoryMap = constructOptionList(response[2].data.auditCategory || [], "nauditcategorycode","sauditcategoryname", undefined, undefined, true);
                    const auditStandardCategoryMap = constructOptionList(response[3].data.auditStandardCategory || [], "nauditstandardcatcode","sauditstandardcatname", undefined, undefined, true);
                    const departmentMap = constructOptionList(response[4].data.department || [], "ndeptcode","sdeptname", undefined, undefined, true);
                    const timeZoneMap = constructOptionList(response[5].data || [], "ntimezonecode","stimezoneid", undefined, undefined, true);

                    auditType = auditTypeMap.get("OptionList");
                    auditCategory = auditCategoryMap.get("OptionList");
                    auditStandardCategory = auditStandardCategoryMap.get("OptionList");
                    department = departmentMap.get("OptionList");
                    timeZone = timeZoneMap.get("OptionList");

                    selectedId = editParam.primaryKeyField;
                     let masterData={...editParam.masterData}
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            auditType,
                            auditCategory,
                            auditStandardCategory,
                            department,
                            timeZone,
                            operation: editParam.operation,
                            screenName: editParam.screenName,
                            selectedRecord: selectedRecord,
                            masterData,
                            openModal: true,
                            ncontrolcode: editParam.ncontrolCode,
                            loading: false, 
                            selectedId,
                            currentTime
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })        
    }
}

export function createAuditPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/" + inputParam.operation + "AuditPlan", inputParam.inputData);
        const service2 =  rsapi().post("timezone/getLocalTimeByZone", {userinfo:inputParam.inputData.userinfo });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            let selectedRecord ={};
            masterData = { ...masterData, "auditPlan": response[0].data.auditPlan,"selectedAuditPlan": response[0].data.selectedAuditPlan,
                          "auditPlanHistory":  response[0].data.auditPlanHistory,"auditPlanMember":response[0].data.auditPlanMember,"auditPlanAuditor":response[0].data.auditPlanAuditor }

            let respObject={
                masterData,
                selectedRecord,
                openModal: false,
                loading: false,
                loadEsign:false
            }

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }

}

export function updateAuditPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/" + inputParam.operation + "AuditPlan", inputParam.inputData);
        const service2 =  rsapi().post("timezone/getLocalTimeByZone", {userinfo:inputParam.inputData.userinfo });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            replaceUpdatedObject(response[0].data.auditPlan, masterData.auditPlan, "nauditplancode");
            masterData = { ...masterData,selectedAuditPlan: response[0].data["selectedAuditPlan"]}

            let selectedRecord ={};

            let respObject={
                masterData,
                selectedRecord,
                openModal: false,
                loading: false,
                loadEsign:false
            }

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }

}

export function getScheduleAuditPlan(scheduleParam) {
    return function (dispatch) {
        let userInfo=scheduleParam.userInfo;
        let primaryKeyField = scheduleParam.primaryKeyField;
        let urlArray=[];
               
        const dateService =  rsapi().post("auditplan/getTransactionDates", { "nauditplancode": scheduleParam.masterData.selectedAuditPlan[0].nauditplancode,"soperation":scheduleParam.operation, userinfo: userInfo });
        const timeZoneService =  rsapi().post("timezone/getTimeZone", { userinfo: userInfo });


        urlArray=[dateService,timeZoneService,];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {     
                    let selectedId = null;
                    let timeZone;
                    let selectedRecord={};

                    let dateData =response[0].data.date[0];

                    let currentTime = rearrangeDateFormat(scheduleParam.userInfo, dateData['sauditdatetime']);
                    
                    selectedRecord = { ...scheduleParam.selectedRecord, "dauditdatetime": currentTime };

                    if(scheduleParam.userInfo.isutcenabled === transactionStatus.YES){
                        selectedRecord.ntzauditdatetime={
                            "value": dateData.ntzauditdatetime,
                            "label": dateData.stimezoneid
                        }               
                    }                      

                    const timeZoneMap = constructOptionList(response[1].data || [], "ntimezonecode","stimezoneid", undefined, undefined, true);
                    timeZone = timeZoneMap.get("OptionList");

                    selectedId = scheduleParam.primaryKeyField;
                     let masterData={...scheduleParam.masterData}
                    dispatch({
                        type: DEFAULT_RETURN, payload: {                          
                            timeZone,
                            operation: scheduleParam.operation,
                            screenName: scheduleParam.screenName,
                            selectedRecord: selectedRecord,
                            masterData,
                            openModal: true,
                            ncontrolcode: scheduleParam.ncontrolCode,
                            loading: false, 
                            selectedId,
                            currentTime
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })        
    }
}

export function scheduleAuditPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/scheduleAuditPlan", inputParam.inputData);
        const service2 =  rsapi().post("timezone/getLocalTimeByZone", {userinfo:inputParam.inputData.userinfo });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            replaceUpdatedObject(response[0].data.auditPlan, masterData.auditPlan, "nauditplancode");
            masterData = { ...masterData,selectedAuditPlan: response[0].data["selectedAuditPlan"],
                           auditPlanHistory:response[0].data["auditPlanHistory"],
                           auditPlanMember:response[0].data["auditPlanMember"],//Added by sonia on 09th Sept 2025 for jira id:SWSM-6
                           auditPlanAuditor:response[0].data["auditPlanAuditor"]} //Added by sonia on 09th Sept 2025 for jira id:SWSM-6

            let selectedRecord ={};

            let respObject ={
                masterData,
                selectedRecord,
                openModal: false,
                loading: false,
                loadEsign:false
            };

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));  
            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }

}

export function closeAuditPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/closeAuditPlan", inputParam.inputData);
        const service2 =  rsapi().post("timezone/getLocalTimeByZone", {userinfo:inputParam.inputData.userinfo });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
            replaceUpdatedObject(response[0].data.auditPlan, masterData.auditPlan, "nauditplancode");
            masterData = { ...masterData,selectedAuditPlan: response[0].data["selectedAuditPlan"],auditPlanHistory:response[0].data["auditPlanHistory"]}

            let selectedRecord ={};
            
            let respObject ={
                masterData,
                selectedRecord,
                openModal: false,
                loading: false,
                loadEsign:false
            };

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));
            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }
}

export const getAvailableDatas = (auditPlanItem, url, key, screenName, userInfo, ncontrolCode) => {
    return (dispatch) => {
        const inputParam = {
            "nauditplancode": auditPlanItem,
            "userinfo": userInfo
        }
        dispatch(initRequest(true));
         rsapi().post("auditplan/" + url, inputParam)
            .then(response => {
               let auditMaster;
                let users;
                if(key === "Users"){
                    //Commented by sonia on 09th Sept 2025
                    // const availableUsersDataMap = constructOptionList(response.data.Users,"nusercode","susername",false, false, true);
                    // users = availableUsersDataMap.get("OptionList");

                    //Added by sonia on 09th Sept 2025 for jira id:SWSM-6
                    users = response.data.Users;

                }
                else{
                    //Commented by sonia on 09th Sept 2025
                    // const availableAuditMasterDataMap = constructOptionList(response.data.auditMaster,"nauditmastercode","sauditorname", false, false, true);
                    // auditMaster = availableAuditMasterDataMap.get("OptionList");

                    //Added by sonia on 09th Sept 2025 for jira id:SWSM-6
                    auditMaster = response.data.auditMaster;

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,                        
                        auditMaster,
                        users,                     
                        screenName: screenName,
                        selectedRecord: {},
                        operation: "create",
                        ncontrolCode,
                        loading: false
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            });
    }
}

//Modified by sonia on 09th Sept 2025 for jira id:SWSM-6
export function createAuditPlanMember(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/" + inputParam.operation + "AuditPlanMember", { ...inputParam.inputData });

        urlArray = [service1]

        Axios.all(urlArray).then(response => {
            let selectedRecord ={};
            masterData = { ...masterData, "auditPlanMember": response[0].data.auditPlanMember }

            let respObject ={
                masterData,
                selectedRecord,
                openChildModal: false,
                loading: false,
                loadEsign:false
            };

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject)); 

            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }

}
//Modified by sonia on 09th Sept 2025 for jira id:SWSM-6
export function createAuditPlanAuditor(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];   

        const service1 =  rsapi().post("auditplan/" + inputParam.operation + "AuditPlanAuditor", { ...inputParam.inputData });

        urlArray = [service1]

        Axios.all(urlArray).then(response => {
            let selectedRecord ={};
            masterData = { ...masterData, "auditPlanAuditor": response[0].data.auditPlanAuditor }

            let respObject ={
                masterData,
                selectedRecord,
                openChildModal: false,
                loading: false,
                loadEsign:false
            };

            inputParam.postParamList[0]['clearFilter'] = 'yes';
            dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));            
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
            } else if (error.response?.status === 500) {
              toast.error(error.message);
            } else {
              toast.warn(intl.formatMessage({ id: error.response.data }));
            }
        })
    }

}

export const addAuditPlanFile  = (inputParam) => {
    return (dispatch) => {
            dispatch(initRequest(true));
            let urlArray = [ rsapi().post("/linkmaster/getLinkMaster", { userinfo: inputParam.userInfo })];
            if (inputParam.operation === "update") {
                urlArray.push( rsapi().post("/auditplan/getActiveAuditPlanFileById", {
                    userinfo: inputParam.userInfo,
                    genericlabel:inputParam.genericLabel,
                    "nauditplancode": inputParam.selectedRecord.nauditplancode,
                    "nauditplanfilecode" : inputParam.selectedRecord.nauditplanfilecode,
                }))
            }
            Axios.all(urlArray)
                .then(response => {
                    const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                    const linkmaster = linkMap.get("OptionList");
                    let selectedRecord = {};
                    const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                    let disabled = false;
                    let editObject = {};
                    if (inputParam.operation === "update") {
                        editObject = response[1].data.auditPlanFile[0];
                        let nlinkcode = {};
                        let link = {};
                        if (editObject.nattachmenttypecode === attachmentType.LINK) {
                            nlinkcode = {
                                "label": editObject.slinkname,
                                "value": editObject.nlinkcode
                            }
    
                            link = {
                                slinkfilename: editObject.sfilename,
                                slinkdescription: editObject.sdescription,
                                nlinkdefaultstatus: editObject.ndefaultstatus,
                                sfilesize: '',
                                nfilesize: 0,
                                ndefaultstatus: 4,
                                sfilename: '',
                            }
    
                        } else {
                            nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                            link = {
                                slinkfilename: '',
                                slinkdescription: '',
                                nlinkdefaultstatus: 4,
                                sfilesize: editObject.sfilesize,
                                nfilesize: editObject.nfilesize,
                                ndefaultstatus: editObject.ndefaultstatus,
                                sfilename: editObject.sfilename,
                                ssystemfilename:editObject.ssystemfilename
                            }
                        }
    
                        selectedRecord = {
                            ...link,
                            nauditplanfilecode: editObject.nauditplanfilecode,
                            nattachmenttypecode: editObject.nattachmenttypecode,
                            sdescription:editObject.sdescription,
                            nlinkcode,
    
                            // disabled: true
                        };
                    } else {
                        selectedRecord = {
                            nattachmenttypecode: response[0].data.AttachmentType.length > 0 ?
                                response[0].data.AttachmentType[0].nattachmenttypecode : attachmentType.FTP,
                            nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", 
                            disabled
                        };
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            [inputParam.modalName]: true,
                            operation: inputParam.operation,
                            screenName: inputParam.screenName,
                            ncontrolCode: inputParam.ncontrolCode,
                            selectedRecord,
                            loading: false,
                            linkMaster: linkmaster,
                            showSaveContinue: false,
                            editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {}
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
                    } else if (error.response?.status === 500) {
                      toast.error(error.message);
                    } else {
                      toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                });
    }
}


export function validateEsignforAuditPlan(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return  rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = inputParam.screenData.inputParam.methodUrl;
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
                    dispatch(dispatchMethods(inputParam["screenData"]))
                }
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
                } else if (error.response?.status === 500) {
                  toast.error(error.message);
                } else {
                  toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    };
}

function dispatchMethods(screenData) {
    return (dispatch) => {
        let action = screenData.inputParam.action
        switch (action) {
            case "editauditplan":
                dispatch(updateAuditPlan(screenData.inputParam, screenData.masterData, "openModal"));
                break;
            case "deleteauditplan":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openModal"));
                break; 
            case "editauditplanfile":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openChildModal"));
                break; 
            case "deleteauditplanfile":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openChildModal"));
                break;     
            case "scheduleauditplan":
                dispatch(scheduleAuditPlan(screenData.inputParam, screenData.masterData,"openModal"));
                break;
            case "rescheduleauditplan":
                dispatch(scheduleAuditPlan(screenData.inputParam, screenData.masterData,"openModal"));
                break;
            case "closeauditplan":
                dispatch(closeAuditPlan(screenData.inputParam, screenData.masterData,"openModal"));
                break          
            case "delete":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData,"openChildModal"));
                break;                          
            default:
                break;
        }
    }
}