import { toast } from "react-toastify";
import rsapi from "../rsapi";
import { initRequest } from "./LoginAction";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { constructOptionList, rearrangeDateFormat, sortData } from "../components/CommonScript";
import { intl } from "../components/App";
import Axios from "axios";
import { transactionStatus } from "../components/Enumeration";

export function getRetrievalCertificateForFilter(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("retrievalcertificate/getRetrievalCertificate", { ...inputParam.inputData })
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false
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
export function getRetrievalCertificateComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (operation==="create" || operation==="update" && masterData.SelectedRetrievalCertificate.ntransactionstatus===transactionStatus.DRAFT) {

        let urlArray = [];
        const projectTypeService = rsapi().post("projecttype/getProjectType", { userinfo: userInfo });
        const storageConditionService = rsapi().post("storagecondition/getStorageCondition", { userinfo: userInfo });
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: userInfo });
        const siteaddressService = rsapi().post("retrievalcertificate/getSiteAddress", { userinfo: userInfo });

        if (operation === "create") {
            urlArray = [projectTypeService, storageConditionService, UTCtimeZoneService,siteaddressService];
        }
        else{
            const projectService = rsapi().post("retrievalcertificate/getProject", { "nprojecttypecode": masterData.SelectedRetrievalCertificate.nprojecttypecode, userinfo: userInfo });
            const retrievalcertificateServiceById = rsapi().post("retrievalcertificate/getActiveRetrievalCertificateById", { [primaryKeyName]: primaryKeyValue, "userinfo": userInfo });//this.props.Login.userInfo
            urlArray = [projectTypeService, storageConditionService, UTCtimeZoneService,retrievalcertificateServiceById, projectService];
            }

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                
                    let selectedRecord = {};

                    const projectTypeMap = constructOptionList(response[0].data || [], "nprojecttypecode",
                    "sprojecttypename", undefined, undefined, true);
                    const projectTypeList = projectTypeMap.get("OptionList");
                    const storageconditionMap = constructOptionList(response[1].data || [], "nstorageconditioncode",
                        "sstorageconditionname", undefined, undefined, true);
                    let projectList = null;
                    if(operation !== "create"){
                        const projectMap = constructOptionList(response[4].data || [], "nprojectmastercode",
                            "sprojectname", undefined, undefined, true);
                        projectList = projectMap.get("OptionList");
                    }
                    const storageconditionList = storageconditionMap.get("OptionList");
                    const currentTime = rearrangeDateFormat(userInfo, response[2].data?.date);
                    if (operation === "update") {
                        selectedRecord = response[3].data;

                        selectedRecord["dretrievalcertificatedate"] = rearrangeDateFormat(userInfo, response[3].data.sretrievalcertificatedate)
                        selectedRecord["nprojectmastercode"] = { "value": response[3].data.nprojectmastercode, "label": response[3].data.sprojectname };
                        selectedRecord["nprojecttypecode"] = { "value": response[3].data.nprojecttypecode, "label": response[3].data.sprojecttypename };
                        selectedRecord["nstorageconditioncode"] = { "value": response[3].data.nstorageconditioncode, "label": response[3].data.sstorageconditionname };
                      //  selectedRecord["ntztrainingdate"] = { "value": response[4].data.ntztrainingdate, "label": response[4].data.stimezoneid };
                    }
                    else {
                        selectedRecord["sorganizationaddress"] = response[3].data[0].ssiteaddress;
                        selectedRecord["dretrievalcertificatedate"] = rearrangeDateFormat(userInfo, response[2].data?.date);

                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            currentTime,
                            projectList, 
                            projectTypeList,
                            storageconditionList,
                            operation, screenName, selectedRecord, openModal: true,
                            ncontrolCode, loading: false
                        }
                    });
            
            }
            )
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        
            } else {
                toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
            }
    }
}
export function getProjectBasedUsers(nprojectmastercode, userInfo, selectedRecord, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("retrievalcertificate/getProjectUsers", {"nprojectmastercode": nprojectmastercode,userinfo: userInfo})
            .then(response => {
                //console.log(" response:", response); 
                let Users = [];
                    const userName = constructOptionList(response.data || [], "nusercode",
                        "susername", undefined, undefined, false);
                    Users = userName.get("OptionList");
                    //selectedRecord["nusercode"] = undefined; 
                selectedRecord["sinvestigatorname"] = response.data[0].susername; 
                selectedRecord["sphoneno"] = response.data[0].sphoneno; 
                selectedRecord["semail"] = response.data[0].semail; 

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
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

export function getRetrievalCertificateDetail(retrievalcertificate, fromDate, toDate, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("retrievalcertificate/getRetrievalCertificate", {
            nretrievalcertificatecode: retrievalcertificate.nretrievalcertificatecode, fromDate, toDate,
            "userinfo": userInfo
        })
            .then(response => {

                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }

            })
    }
}
export function reloadRetrievalCertificate(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("retrievalcertificate/getRetrievalCertificate", { ...inputParam.inputData })
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false
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

export const reportRetrievalCetificate = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("retrievalcertificate/RetrievalReportCertificate", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showConfirmAlert: false
                    }
                })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
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

export const getProjectBasedOnProjectType = (nprojectTypeCode, userInfo, selectedRecord) =>{
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("retrievalcertificate/getProject", {
            "nprojecttypecode": nprojectTypeCode, "userinfo": userInfo
        })
            .then(response => {
                const projectMap = constructOptionList(response.data || [], "nprojectmastercode",
                    "sprojectname", undefined, undefined, true);
                const projectList = projectMap.get("OptionList");
                selectedRecord["nprojectmastercode"] = "";
                selectedRecord["semail"] = "";
                selectedRecord["sinvestigatorname"] = "";
                selectedRecord["sphoneno"] = "";
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    projectList,
                    selectedRecord,
                    loading: false

                }
            })
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