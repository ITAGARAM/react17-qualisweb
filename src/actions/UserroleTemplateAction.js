import rsapi from "../rsapi";
import {
    toast
} from "react-toastify";
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import Axios from "axios";
import {
    intl
} from '../components/App'
import {
    transactionStatus
} from "../components/Enumeration";
import { sortData } from "../components/CommonScript";
import { initRequest } from './LoginAction';

//add userroletemplate
export function addScreenModel(operation, masterData, userInfo, ncontrolCode, selectedInput) {
    return function (dispatch) {
        dispatch(initRequest(true));
       let nregtypecode= masterData.realRegTypeValue ? masterData.realRegTypeValue.value : -1
       let nregsubtypecode= masterData.realRegSubTypeValue ? masterData.realRegSubTypeValue.value : -1
       let napprovalsubtypecode = masterData.realApprovalSubTypeValue.value
        rsapi().post("/userroletemplate/getUserRoleforTree", {userinfo: userInfo,nregtypecode:nregtypecode,nregsubtypecode:nregsubtypecode,napprovalsubtypecode:napprovalsubtypecode})
            .then(response => {
                // const  TaguserRoleData  = constructOptionList(response.data ||[], "nuserrolecode",
                // "suserrolename" , undefined, undefined, undefined);
                // const  TagListuserRoleData  = TaguserRoleData.get("OptionList")


                const userRoleActualData = response.data.slice();
                selectedInput["sversiondescription"] = "";
                // masterData["selectedInput"] = selectedInput;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        userRoleData: response.data,
                        userRoleActualData,
                        openModal: true,
                        userRoleTreeData: [{
                            input: ""
                        }],
                        operation: operation,
                        ncontrolCode,
                        masterData,
                        selectedInput,
                        selectedRecord: {},
                        totalLevel: 1,
                        id: 0, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}



export function fetchRecordById(primaryKeyName, primaryKeyValue, masterData, operation, selectedRecord, selectedInput, userInfo, ncontrolCode) {
    return function (dispatch) {

        if (masterData.selectedURTVersion.ntransactionstatus === transactionStatus.APPROVED || masterData.selectedURTVersion.ntransactionstatus=== transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTDRAFTRECORDTOEDIT"
            }));
        } else {
            const userRole = rsapi().post("userroletemplate/getUserRoleforTree", {
                "nsitecode": userInfo.nmastersitecode,
                "userinfo": userInfo,
                "nregtypecode": masterData.realRegTypeValue ? masterData.realRegTypeValue.value : -1,
                "nregsubtypecode": masterData.realRegSubTypeValue ? masterData.realRegSubTypeValue.value : -1,
                "napprovalsubtypecode": masterData.realApprovalSubTypeValue.value

            });

            let urlArray = [];
            if (operation === "update") {
                const component = rsapi().post("userroletemplate/getTreetemplate", {
                    [primaryKeyName]: primaryKeyValue,
                    "userinfo": userInfo
                });
                urlArray = [userRole, component];
            } else {
                urlArray = [userRole];
            }
           // dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
               
                      
                  

                    selectedInput["sversiondescription"] = response[1].data.levelsuserroletemplate[0]["sversiondescription"];
                    // masterData["selectedInput"] = selectedInput;
                    selectedRecord["napprovalconfigcode"] = response[1].data.levelsuserroletemplate[0]["napprovalconfigcode"];
                    let userRoleActualData = response[0].data;
                    let listUserRoledata = response[0].data.slice();
                    response[1].data.levelsuserroletemplate.map((item, i) =>
                        selectedRecord[i] = (item["nuserrolecode"]).toString(),
                    )

                    for (let i in userRoleActualData) {
                        if (selectedRecord[i] !== undefined) {
                            let index = (listUserRoledata).findIndex(data => data.nuserrolecode === parseInt(selectedRecord[i]));
                            if (index > -1) {
                                listUserRoledata.splice(index, 1);
                            }
                        }
                    }

                    const id = response[1].data.levelsuserroletemplate.length - 1

                    if( response[1].data.levelsuserroletemplate[0]['ntransactionstatus']===transactionStatus.DRAFT){
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            userRoleTreeData: response[1].data.levelsuserroletemplate,
                            userRoleData: listUserRoledata,
                            userRoleActualData,
                            openModal: true,
                            operation: operation,
                            selectedRecord,
                            selectedInput,
                            ncontrolCode,
                            id,
                            totalLevel: response[1].data.levelsuserroletemplate.length,
                            masterData, loading: false
                        }
                    });
                }
                else{
                    toast.warn(intl.formatMessage({
                        id: "IDS_SELECTDRAFTRECORDTOEDIT"
                    }));
                }

                })
                .catch(error => {
                    dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                        toast.error(intl.formatMessage({
                            id: error.message
                        }));
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                });
        }

    }
}


export function getTreetemplate(URTvalue, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("userroletemplate/getTreetemplate", {
            ntreeversiontempcode: URTvalue.ntreeversiontempcode,
            userinfo: userInfo,
        })
            .then(response => {
                masterData["levelsuserroletemplate"] = response.data["levelsuserroletemplate"];
                masterData["selectedURTVersion"] = URTvalue;
                const selectedRecord = {};
                selectedRecord["napprovalconfigcode"] = response.data["levelsuserroletemplate"] ? response.data["levelsuserroletemplate"].length > 0 ?
                    response.data["levelsuserroletemplate"][0]["napprovalconfigcode"] : -1 : -1

                selectedRecord["ntransactionstatus"] = response.data["levelsuserroletemplate"] ? response.data["levelsuserroletemplate"].length > 0 ?
                    response.data["levelsuserroletemplate"][0]["ntransactionstatus"] :
                    this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ntransactionstatus"] : [] : []

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedRecord, loading: false

                    }
                });
            })
            .catch(error => {
                dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}
export function getURTFilterRegType(inputParam){
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("userroletemplate/getApprovalRegSubType", inputParam.inputData)
        .then(response=> {
            let masterData = {...inputParam.masterData,...response.data}
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData, loading: false
                }
            });
        })
        .catch(error=> {
            dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                toast.error(intl.formatMessage({
                    id: error.message
                }));
            } else {
                toast.warn(intl.formatMessage({
                    id: error.response.data
                }));
            }
        })
    }
}
export function getURTFilterRegSubType(inputParam){
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("userroletemplate/getApprovalRegSubType", inputParam.inputData)
        .then(response=> {
            let masterData = {...inputParam.masterData,...response.data}
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData, loading: false
                }
            });
        })
        .catch(error=> {
            dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                toast.error(intl.formatMessage({
                    id: error.message
                }));
            } else {
                toast.warn(intl.formatMessage({
                    id: error.response.data
                }));
            }
        })
    }
}
export function getURTFilterSubmit(inputParam){
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("userroletemplate/getFilterSubmit", inputParam.inputData)
        .then(response=> {
            let masterData = {...inputParam.masterData,...response.data}
            
            let listuserroletemplate = sortData(response.data.listuserroletemplate);
            if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                inputParam.searchRef.current.value = "";
                masterData['searchedData'] = undefined
            }
            masterData ={...masterData,listuserroletemplate}
          
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData, loading: false
                }
            });
        })
        .catch(error=> {
            dispatch({type: DEFAULT_RETURN, payload: {loading: false}}); 
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
                toast.error(intl.formatMessage({
                    id: error.message
                }));
            } else {
                toast.warn(intl.formatMessage({
                    id: error.response.data
                }));
            }
        })
    }

}