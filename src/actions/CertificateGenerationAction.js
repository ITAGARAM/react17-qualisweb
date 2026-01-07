import { toast } from "react-toastify";
import { intl } from "../components/App";
import { replaceUpdatedObject, sortData } from "../components/CommonScript";
import rsapi from "../rsapi";
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';


export function getCerGenDetail(CerGen, fromDate, toDate, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("certificategeneration/getCertificateGeneration", {
            "nreleasebatchcode": CerGen["nreleasebatchcode"],
            "userinfo": userInfo
        })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined } });
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
                    toast.warn(error.response.data);
                }
            }
            )
    }
}

export function getTestParameter(methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("certificategeneration/getTestParameter",
            {
                npreregno: methodParam.primaryKeyValue,
                userinfo: methodParam.userInfo
            })
            .then(response => {
                let testMap = methodParam.masterData.testMap || new Map();
                testMap.set(parseInt(Object.keys(response.data["Parameter"])[0]), Object.values(response.data["Parameter"])[0]);
                const masterData = { ...methodParam.masterData, testMap };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        data: methodParam.data, testMap,
                        dataState: methodParam.dataState,
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function certifyBatch(certificateParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post(certificateParam.classUrl + "/" + certificateParam.methodUrl, {
            "nreleasebatchcode": certificateParam.inputData.nreleasebatchcode,
            "ncontrolcode": certificateParam.inputData.ncontrolcode,
            "userinfo": certificateParam.inputData.userinfo
        })
            .then(response => {
                let BATCHSTATUS = response.data.BATCHSTATUS
                let REPORTSTATUS = response.data.REPORTSTATUS
                let BatchResponse = response.data.BatchResponse
                let ReportResponse = response.data.ReportResponse
                if(BATCHSTATUS === 200){
                    const masterData = {
                        ...certificateParam.masterData,
                        ...BatchResponse,
                        CerGen: replaceUpdatedObject(BatchResponse.updatedCerGen, certificateParam.masterData.CerGen, 'nreleasebatchcode'),
                    };
                    // sortData(masterData);
                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined, loadEsign: false, openModal: false } });
                }else{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, loadEsign: false } })
                    toast.warn(BatchResponse);
                }
                if(REPORTSTATUS === 200){
                    document.getElementById("download_data").setAttribute("href", ReportResponse.filepath);
                    document.getElementById("download_data").click();
                }else{
                    toast.warn(ReportResponse);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, loadEsign: false } })
                }   
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, loadEsign: false } })
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
                    toast.warn(error.response.data);
                }
            }
            )
    }
}
export function onClickCertificate(certificateParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post(certificateParam.classUrl + "/" + certificateParam.methodUrl, {
            "nreleasebatchcode": certificateParam.inputData.nreleasebatchcode,
            "userinfo": certificateParam.inputData.userinfo,
            "ncontrolcode": certificateParam.inputData.ncontrolcode

        })
            .then(response => {
                const masterData = {
                    ...certificateParam.masterData,
                    ...response.data,
                    CerGen: replaceUpdatedObject(response.data.updatedCerGen, certificateParam.masterData.CerGen, 'nreleasebatchcode'),
                };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined, loadEsign: false, openModal: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, loadEsign: false } })
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
                    toast.warn(error.response.data);
                }
            }
            )
    }
}


export function onClickXmlExport(certificateParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post(certificateParam.classUrl + "/" + certificateParam.methodUrl, {
            "nreleasebatchcode": certificateParam.inputData.nreleasebatchcode,
            "userinfo": certificateParam.inputData.userinfo
        }).then(response => {
            dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false, openModal: false, dataState: undefined } })
            let sfilename = "";

            if (certificateParam.nversioncode === 0) {
                sfilename = "C" + certificateParam.scertificatehistorycode + ".xml";
            } else {
                sfilename = "C" + certificateParam.scertificatehistorycode + "(Supp " + certificateParam.nversioncode + ").xml";
            }
            const dataURI = "data:" + response["headers"]["content-type"] + ";base64," + encodeBase64(response["data"]);
            saveAs(dataURI, sfilename);
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false, openModal: false } })
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
                    toast.warn(error.response.data);
                }
            }
            )
    }
}

export function validateEsignforCerGen(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    const methodUrl = ""
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]  ;                        
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    if (inputParam["screenData"]["inputParam"]['methodUrl'] === 'InsertCertificate'||inputParam["screenData"]["inputParam"]['methodUrl'] === 'insertCertificateNullified') {
                        dispatch(certifyBatch(inputParam["screenData"]["inputParam"]))
                    } 
                    else if (inputParam["screenData"]["inputParam"]['methodUrl'] === 'reportGeneration') {
                        dispatch(onClickReport(inputParam["screenData"]["inputParam"]))
                    } 
                    else if (inputParam["screenData"]["inputParam"]['operation'] === 'xml') {
                        dispatch(onClickXmlExport(inputParam["screenData"]["inputParam"]))
                    } 
                    else {
                        dispatch(onClickCertificate(inputParam["screenData"]["inputParam"]))
                   
                    }
                    
                    // else if (inputParam["screenData"]["inputParam"]['operation'] !== 'xml') {
                    //     dispatch(onClickCertificate(inputParam["screenData"]["inputParam"]))
                    // } else {
                    //     dispatch(onClickXmlExport(inputParam["screenData"]["inputParam"]))
                    // }
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    };
}

export function onClickReport(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post(inputParam.classUrl + "/" + inputParam.methodUrl,inputParam.inputData)
            // {
            //     nprimarykey: inputParam[inputParam.nprimarykey],
            //     sprimarykeyname:inputParam.nprimarykey,
            //     userinfo: inputParam.userInfo,
            //     ndecisionstatus: inputParam.ndecisionStatus, 
            //     nflag: 1, 
            //    "nreporttypecode": 3
            // }
        
            .then(response => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false, openModal: false ,showConfirmAlert:false} })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function viewReport(inputParam){
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("certificategeneration/viewCertificateReport",inputParam.inputData)
          
            .then(response => {
                 dispatch({ type: DEFAULT_RETURN, 
                    payload: {
                      ...response.data,
                        loading: false, 
                        loadEsign: false, 
                        openModal: false ,
                        showReport:true
                    } 
                })
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
