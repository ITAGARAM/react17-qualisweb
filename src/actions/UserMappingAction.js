import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, sortData } from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { ApprovalSubType } from '../components/Enumeration';


export function getUserMappingFilterChange(inputParamData, oldState, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("usermapping/getUserMapping", inputParamData)
            .then(response => {
                const RegistrationTypeListMap = constructOptionList(response.data.RegistrationType || [], "nregtypecode", "sregtypename", 'ascending', 'nregtypecode', false);
                const RegistrationSubTypeListMap = constructOptionList(response.data.RegistrationSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nregsubtypecode', false);
                const templateVersionOptionListMap = constructOptionList(response.data.TreeVersion || [], "ntreeversiontempcode", "sversiondescription", 'decending', 'ntreeversiontempcode', false);
                const RegistrationTypeList = response.data.RegistrationType ? RegistrationTypeListMap.get("OptionList") : oldState.RegistrationTypeList;
                const RegistrationSubTypeList = response.data.RegistrationSubType ? RegistrationSubTypeListMap.get("OptionList") : oldState.RegistrationSubTypeList;
                const templateVersionOptionList = response.data.TreeVersion ? templateVersionOptionListMap.get("OptionList") : oldState.templateVersionOptionList;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...masterData,
                            Approvalsubtype: oldState.Approvalsubtype,
                            RegistrationTypeList, RegistrationSubTypeList, templateVersionOptionList,
                            approvalSubTypeValue: oldState.approvalSubTypeValue,

                            RegistrationType: response.data.RegistrationType ?
                                response.data.RegistrationType
                                : oldState.RegistrationType,

                            registrationTypeValue: response.data.RegistrationType ?
                                response.data.RegistrationType.length > 0 ?
                                    {
                                        value: response.data.RegistrationType[0].nregtypecode,
                                        label: response.data.RegistrationType[0].sregtypename
                                    }
                                    : oldState.registrationTypeValue
                                : oldState.registrationTypeValue,

                            RegistrationSubType: response.data.RegistrationSubType ?
                                response.data.RegistrationSubType
                                : oldState.RegistrationSubType,

                            registrationSubTypeValue: response.data.RegistrationSubType ?
                                response.data.RegistrationSubType.length > 0 ?
                                    {
                                        value: response.data.RegistrationSubType[0].nregsubtypecode,
                                        label: response.data.RegistrationSubType[0].sregsubtypename
                                    }
                                    : oldState.registrationSubTypeValue
                                : oldState.registrationSubTypeValue,

                            TreeVersion: response.data.TreeVersion ?
                                response.data.TreeVersion
                                : oldState.TreeVersion,

                            templateVersionValue: response.data.TreeVersion ?
                                response.data.TreeVersion.length > 0 ?
                                    {
                                        value: response.data.TreeVersion[0].ntreeversiontempcode,
                                        label: response.data.TreeVersion[0].sversiondescription
                                    }
                                    : {}
                                : oldState.templateVersionValue,
                            // Site: response.data.Site ? sortData(response.data.Site) : [],
                            // selectedSite: response.data.selectedSite,
                            // UserRole: response.data.UserRole ? sortData(response.data.UserRole) : [],
                            ...sortData(response.data)
                        }, loading: false,
                        dataState: undefined

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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getUserMapping(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const Map={userinfo:inputData.userinfo,
            nFlag:inputData.nFlag,
            napprovalsubtypecode:inputData.napprovalsubtypecode,
            nregtypecode:inputData.nregtypecode,
            nregsubtypecode:inputData.nregsubtypecode,
            ntemplatecode:inputData.ntemplatecode,
            nversioncode:inputData.nversioncode
        }
        rsapi().post("usermapping/getUserMapping", Map)
            .then(response => {

                if (inputData.searchRef !== undefined && inputData.searchRef.current.value !== "") {
                    inputData.searchRef.current.value=""
                    inputData.masterData["searchedData"] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            selectedSite: response.data.selectedSite,
                            site: response.data.Site,
                            UserRole: response.data.UserRole ? sortData(response.data.UserRole) : [],
                            ...sortData(response.data)
                        }, loading: false

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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getUserMappingBySite(site, nversioncode, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("usermapping/getUserMappingBySite", { nsitecode: site.nsitecode, nversioncode: nversioncode ? nversioncode : -1, userinfo: userInfo })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...masterData,
                            //  selectedSite: site,
                            // UserRole: sortData(response.data.UserRole),
                            ...sortData(response.data)
                        }, loading: false

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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

}
export function getChildUsers(user, role, siteCode, nversionCode, userInfo, masterData, dataState, userRoles) {

    return function (dispatch) {
        if (role.schildnode > 0) {
            dispatch(initRequest(true));
            rsapi().post("usermapping/getChildUserMapping",
                {
                    nparusermappingcode: user.nusermappingcode,
                    nuserrolecode: role.nuserrolecode,
                    nsitecode: siteCode,
                    nversioncode: nversionCode,
                    levelno: -1,
                    userinfo: userInfo,
                    loading: false
                }
            )
                .then(response => {
                    let datastate = { ...dataState }
                    userRoles.map(userRole => {
                        if (userRole.nlevelno <= role.nlevelno) {
                            if (dataState[userRole.nuserrolecode]) {
                                datastate[userRole.nuserrolecode] = dataState[userRole.nuserrolecode]
                            } else {
                                datastate[userRole.nuserrolecode] = { skip: 0, take: 10 }
                            }
                        }
                        return null;
                    })
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...masterData,
                                [`selectedUser_${role.nuserrolecode}`]: user,
                                ...sortData(response.data)
                            }, loading: false, dataState: datastate

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
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }
}

export function openUserMappingModal(role, siteCode, selectedUser, versionCode, userInfo, masterData, parentRoleName) {
    return function (dispatch) {
        if (role.nlevelno === 1 ? true : selectedUser ? Object.keys(selectedUser).length > 0 ? true : false : false) {
            dispatch(initRequest(true));
            rsapi().post("usermapping/getAvailableUsers",
                {
                    nuserrolecode: role.nuserrolecode,
                    nsitecode: siteCode,
                    nparusermappingcode: role.nlevelno === 1 ? -2 : selectedUser.nusermappingcode,
                    nversioncode: versionCode,
                    napprovalconfigcode:masterData.approvalConfigCode,
                    ntreeversiontempcode:masterData.templateVersionValue.value,
                    userinfo: userInfo
                }
            )
                .then(response => {
                    const AvailableUsersMap = constructOptionList(response.data.AvailableUsers || [], "id", "Name", undefined, undefined, true);
                    const AvailableUsers = AvailableUsersMap.get("OptionList");
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            openChildModal: true,
                            graphView: false,
                            operation: 'create',
                            loading: false,
                            AvailableUsers,
                            parentRole: role.nparentrolecode,
                            childRole: role.nuserrolecode,
                            childRoleName: role.suserrolename,
                            nlevelno: role.nlevelno,
                            selectedRecord: {},
                            ...masterData
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
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECT" }) + ' ' + parentRoleName);
        }
    }

}

// export function filterUserColumn(filterValue, masterData, userInfo,role,siteCode,nversionCode) {
//     return function(dispatch){
//         let nusermappingcode = 0;   
//         let searchedData = undefined;
//         if (filterValue === ""){
//             nusermappingcode = masterData[role.nuserrolecode][0].nusermappingcode;
//         } 
//         else{

//             searchedData = searchData(filterValue, masterData[role.nuserrolecode]);

//             if (searchedData.length > 0){
//                 nusermappingcode = searchedData[0].nusermappingcode; 
//             }

//         }
//         if (nusermappingcode !== 0){

//             dispatch(initRequest(true));
//             rsapi().post("usermapping/getChildUserMapping",{
//                                                             nparusermappingcode:nusermappingcode,
//                                                             nuserrolecode:role.nuserrolecode,
//                                                             nsitecode:siteCode,
//                                                             nversioncode:nversionCode,
//                                                             levelno:-1,
//                                                             userinfo:userInfo,
//                                                             loading:false
//                                                         }
//                     )
//             .then(response=>{  
//                 masterData={
//                     ...masterData,
//                     [`selectedUser_${role.nuserrolecode}`]:searchedData?searchedData[0]:masterData[role.nuserrolecode][0],
//                     ...sortData(response.data),
//                     [`searchedData_${role.nuserrolecode}`] : searchedData
//                 }              


//                 dispatch({type: DEFAULT_RETURN, payload:{masterData,   loading:false}});
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })

//         }else{
//             masterData["checklistversion"] = [];
//             masterData["selectedversion"] = [];
//             masterData["checklistversionqb"] = [];
//             masterData["selectedchecklist"] =[];
//             masterData["searchedData"] = [];
//             dispatch({type: DEFAULT_RETURN, payload:{masterData,   loading:false}});

//         }
//     }
// }
export function getUserMappingGraphView(site, nversioncode, userinfo, selectedUser, selectedRole) {

    return function (dispatch) {
        if (site && site.nsitecode) {
            let inputData = { nsitecode: site.nsitecode, nversioncode: nversioncode ? nversioncode : -1, userinfo };
            if (selectedUser) {
                inputData['nusermappingcode'] = selectedUser.nusermappingcode
            }

            //let files=fs.readdirSync(fileViewURL+"/SharedFolder")
            dispatch(initRequest(true));
            rsapi().post("usermapping/getUserMappingTree", inputData)
                .then(response => {
                    let selectedRecord = {};
                    let hideFilters = false;
                    let selectedTreeParent = undefined;
                    if (selectedUser) {
                        selectedTreeParent = response.data.userTree && response.data.userTree.length > 0 ? response.data.userTree.find(x => x.nusermappingcode = selectedUser.nusermappingcode) : {}
                        hideFilters = true;
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            userTree: response.data.userTree,
                            openChildModal: true,
                            graphView: true,
                            operation: "view",
                            selectedTreeParent,
                            selectedRecord,
                            hideFilters,
                            files: response.data.folderFiles
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
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        } else {
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false, multilingualError: "IDS_SELECTSITE" } })
        }
    }
}
export function getCopyUserMapping(nsubtypecode, nregsubtypecode, userInfo, masterData, ncontrolcode) {
    return function (dispatch) {
        if (nsubtypecode === ApprovalSubType.TESTRESULTAPPROVAL) {
            dispatch(initRequest(true));
            rsapi().post('usermapping/getUserMappingCopy', { nsubtypecode: nsubtypecode, nregsubtypecode, nsitecode: userInfo.nmastersitecode, userinfo: userInfo })
                .then(response => {
                    if (response.data.CopyRegType.length === 0) {
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                loadEsign: false,
                                openChildModal: false
                            }
                        });
                        return toast.warn(intl.formatMessage({ id: "IDS_NOREGISTRATIONTOCOPY" }));
                    }

                    let selectedRecord = {};
                    const RegistrationTypeListMap = constructOptionList(response.data.CopyRegType || [], "nregtypecode", "sregtypename", 'ascending', 'nregtypecode', false);
                    const RegistrationSubTypeListMap = constructOptionList(response.data.CopyRegSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nregsubtypecode', false);
                    let optCopyRegType = RegistrationTypeListMap.get("OptionList");
                    let optCopyRegSubType = RegistrationSubTypeListMap.get("OptionList");
                    selectedRecord['regtype'] = response.data.CopyRegType.length > 0 ? { value: response.data.CopyRegType[0].nregtypecode, label: response.data.CopyRegType[0].sregtypename } : []
                    selectedRecord['regsubtype'] = response.data.CopyRegSubType ? response.data.CopyRegSubType.length > 0 ? { value: response.data.CopyRegSubType[0].nregsubtypecode, label: response.data.CopyRegSubType[0].sregsubtypename } : [] : []
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            operation: "copy", openChildModal: true,
                            optCopyRegSubType,
                            optCopyRegType,
                            selectedRecord,
                            masterData, ncontrolcode, loading: false
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
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
    }

}
export function getCopyUserMappingSubType(comboData, nregsubtypecode, selectedRecord, userInfo, masterData, optCopyRegType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('usermapping/getCopyRegSubType', { nregtypecode: comboData.value, nregsubtypecode, nsitecode: userInfo.nmastersitecode, userinfo: userInfo })
            .then(response => {
                const RegistrationSubTypeListMap = constructOptionList(response.data.CopyRegSubType || [], "nregsubtypecode", "sregsubtypename", 'ascending', 'nregsubtypecode', false);
                let optCopyRegSubType = RegistrationSubTypeListMap.get("OptionList");
                selectedRecord['regsubtype'] = response.data.CopyRegSubType.length > 0 ? { value: response.data.CopyRegSubType[0].nregsubtypecode, label: response.data.CopyRegSubType[0].sregsubtypename } : []
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        operation: "copy", openChildModal: true, loading: false,
                        optCopyRegType,
                        optCopyRegSubType,
                        selectedRecord,
                        masterData
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}