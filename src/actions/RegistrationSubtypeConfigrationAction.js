import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData,constructOptionList } from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

export const SampleTypeFilterchange = (inputParam, filterSampleType) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/registrationsubtypeconfigration/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                //const masterData = response.data
                const masterData = {...inputParam.masterData,...response.data}
                sortData(masterData);
                    
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        masterData: {
                            ...masterData,
                            filterSampleType,
                            nfilterSampleType: inputParam.inputData.nfilterSampleType
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
            });
    }
}


export const getDepartmentData = (instItem, url, key, screenName, userInfo, ncontrolCode, selectedRecord) => {
    return function (dispatch) {
       // if(instItem.ninstrumentstatus!==transactionStatus.Disposed){
        dispatch(initRequest(true));
        let url = ''

        url = "/registrationsubtypeconfigration/getDepartment";

        return rsapi().post(url, {
                "userinfo": userInfo,"nregsubtypecode":instItem.nregsubtypecode
            })
            .then(response => {

                const secMap = constructOptionList(response.data.Section || [], "ndeptcode",
                    "sdeptname", undefined, undefined, false);
                
                const Lab = secMap.get("OptionList");
                selectedRecord["ndeltacheck"] = 3;
               
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        Lab,                       
                        isOpen: true,                        
                        operation: "create",
                        screenName: screenName,
                        // openModal: true,
                        openChildModal:true,
                        ncontrolCode: ncontrolCode,
                        instItem: instItem,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
        } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
//     }

// else{
//     toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
// }
}
}



export function getDepartmentBasedUser(ndeptcode, userInfo, selectedRecord, masterData, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("registrationsubtypeconfigration/getDepartmentBasedUser", {
                "ndeptcode": ndeptcode, 
                "userinfo": userInfo,
                "nregsubtypecode":masterData.selectedRegSubType.nregsubtypecode
            }
            )
            .then(response => {
                //console.log(" response:", response); 
                let Users = [];
                if (screenName === "IDS_DEPARTMENT") {
                    //let sectionusers=[];
                    const userName = constructOptionList(response.data.Users || [], "nusercode",
                        "susername", undefined, undefined, false);
                    Users = userName.get("OptionList");
                    //selectedRecord["nusercode"]="";
                    selectedRecord["nusercode"] = undefined; //{label:SectionUsers[0].label,value:SectionUsers[0].value,item:SectionUsers[0]};
                } else {
                    Users = response.data;
                    selectedRecord["nusercode"] = undefined;
                }
                let isdisable= response.data.isdisable;
                if(isdisable)
                {
                    selectedRecord["ndeltacheck"]=4
                }
                else{
                    selectedRecord["ndeltacheck"]=3
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                       // masterData,
                       masterData:{...masterData,isdisable},
                        Users,
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
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
                    toast.warn(error.response.data);
                }

            })
    }
}




export const getUserroleData = (instItem, url, key, screenName, userInfo, ncontrolCode, selectedRecord) => {
    return function (dispatch) {
       // if(instItem.ninstrumentstatus!==transactionStatus.Disposed){
        dispatch(initRequest(true));
        let url = ''

        url = "/registrationsubtypeconfigration/getUserRole";

        return rsapi().post(url, {
                "userinfo": userInfo,"nregsubtypecode":instItem.nregsubtypecode
            })
            .then(response => {

                const userroleMap = constructOptionList(response.data.UserRole || [], "nuserrolecode",
                    "suserrolename", undefined, undefined, false);
                
                const Lab = userroleMap.get("OptionList");
                selectedRecord["ndeltacheck"] = 3;
               
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        Lab,                       
                        isOpen: true,                        
                        operation: "create",
                        screenName: screenName,
                        // openModal: true,
                        openChildModal:true,
                        ncontrolCode: ncontrolCode,
                        instItem: instItem,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
        } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
//     }

// else{
//     toast.warn(intl.formatMessage({ id: "IDS_DISPOSEDINSTRUMENT"}));
// }
}
}


export function getUserRoleBasedUser(nuserrolecode, userInfo, selectedRecord, masterData, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("registrationsubtypeconfigration/getUserRoleBasedUser", {
                "nuserrolecode": nuserrolecode, 
                "userinfo": userInfo,
                "nregsubtypecode":masterData.selectedRegSubType.nregsubtypecode
            }
            )
            .then(response => {
                
                let Users = [];
                const userName = constructOptionList(response.data.Users || [], "nusercode",
                "susername", undefined, undefined, false);
            Users = userName.get("OptionList");
            selectedRecord["nusercode"] = undefined;
            let isdisable= response.data.isdisable;
            if(isdisable)
            {
                selectedRecord["ndeltacheck"]=4
            }
            else{
                selectedRecord["ndeltacheck"]=3
            }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData:{...masterData,isdisable},
                        Users,
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
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
                    toast.warn(error.response.data);
                }

            })
    }
}



export function getRegtypeBasedSampleType(ndeptcode, userInfo, selectedRecord, masterData, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("registrationsubtypeconfigration/getRegtypeBasedSampleType", {
                "nsampletype": ndeptcode, 
                "userinfo": userInfo,
            }
            )
            .then(response => {
                //console.log(" response:", response); 
               // let masterData = {...masterData}
                let responseData = { ...response.data }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        //masterData,   
                        masterData: {...masterData,...responseData
                        },                 
                        selectedRecord,
                        loading: false

                    }
                });

            }).catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
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
                    toast.warn(error.response.data);
                }

            })
    }
}



export function getTabdetails(regsubtype, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let tabdetails={ nregtypecode: regsubtype.nregtypecode,nregsubtypecode: regsubtype.nregsubtypecode,nsampletypecode: regsubtype.nsampletypecode,ntransfiltertypecode:regsubtype.ntransfiltertypecode}
        return rsapi().post("registrationsubtypeconfigration/getTabdetails", {
                tabdetails: tabdetails,
                userinfo: userInfo,
                nregsubtypecode: regsubtype.nregsubtypecode
            })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        operation: null,
                        modalName: undefined,
                        loading: false,
                        dataState: undefined
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
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
                    toast.warn(error.response.data);
                }

            })
    }
}



export const getListofUsers = (instItem, url, key, screenName, userInfo, ncontrolCode, selectedRecord) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = ''

        url = "/registrationsubtypeconfigration/getListofUsers";

        return rsapi().post(url, {
                "userinfo": userInfo,"nregsubtypecode":instItem.nregsubtypecode
            })
            .then(response => {

                let Users = [];
                const userName = constructOptionList(response.data.Users || [], "nusercode",
                    "susername", undefined, undefined, false);
                Users = userName.get("OptionList");
                //selectedRecord["nusercode"]="";
                selectedRecord["nusercode"] = undefined; 
               
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        Users,                       
                        isOpen: true,                        
                        operation: "create",
                        screenName: screenName,
                        openChildModal:true,
                        ncontrolCode: ncontrolCode,
                        instItem: instItem,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
        } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });

}
}