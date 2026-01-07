import rsapi from '../rsapi';
import Axios from 'axios';
import {
    constructOptionList,
    replaceUpdatedObject
} from '../components/CommonScript'

import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';

import {
    initRequest
} from './LoginAction';
import {
    toast
} from 'react-toastify';
import {
    sortData
} from '../components/CommonScript';
import { intl } from '../components/App';
import {
    saveAs,
    encodeBase64
} from '@progress/kendo-file-saver';

export function getSampleCertTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/samplecertification/getFilterSampleData", Map)
            .then(response => {
                const regtypeMap = constructOptionList(response.data.RegTypeValue || [], "nregtypecode",
                    "sregtypename", undefined, undefined, false);
                const RegTypeValue = regtypeMap.get("OptionList");
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: {
                        ...event.item
                    }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        RegTypeValue
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getSampleCertRegSubTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        rsapi().post("/samplecertification/getFilterRegData", Map)
            .then(response => {
                const regsubtypeMap = constructOptionList(response.data.RegistrationSubType || [], "nregsubtypecode",
                    "sregsubtypename", undefined, undefined, false);
                const RegSubTypeValue = regsubtypeMap.get("OptionList");
                masterData = {
                    ...masterData,
                    ...response.data,
                    RegSubTypeValue,
                    [labelname]: {
                        ...event.item
                    }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getTestResultData(methodParam) {
    return function (dispatch) {
        return rsapi().post("/samplecertification/getParameterSampleResults", {
            transactiontestcode: methodParam.primaryKeyValue,
            userinfo: methodParam.userInfo
        })
            .then(response => {
                let sampleTestResults = methodParam.masterData.sampleTestResults||new Map();
                sampleTestResults.set(methodParam.primaryKeyValue,
                    Object.values(response.data["ParameterSampleResults"]));
                const masterData = {
                    ...methodParam.masterData,
                    sampleTestResults,
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        //...masterData,
                        masterData: masterData,
                        dataState: methodParam.dataState,
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getActiveSample(Sample, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplecertification/getSampleCertificationById", {
            npreregno: parseInt(Sample.npreregno),
            userinfo: userInfo
        })
            .then(response => {
                const printHistory = response.data.printHistory;
                const TransactionSampleResults = response.data.TransactionSampleResults
                const TransactionSampleTests = response.data.TransactionSampleTests;
                const emailSentHistory = response.data.emailSentHistory;
                masterData = {
                    ...masterData,
                    ...response.data,
                    printHistory,
                    emailSentHistory,
                    TransactionSampleResults,
                    TransactionSampleTests

                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        operation: null,
                        modalName: undefined,
                        loading: false,
                        dataState:undefined
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}



export function generateCertificateAction(inputParam) {
    return function (dispatch) {
        let urlArray = [];
        const CertificateStatus = rsapi().post("/samplecertification/generateCertificationStatus", {
            "registration": inputParam.registration,
            "npreregno": inputParam.npreregno,
            "nversioncode": inputParam.nversioncode,
            "userinfo": inputParam.userinfo,
            "ncontrolcode":inputParam.ncontrolcode
        });
        urlArray = [CertificateStatus];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let SAMPLESTATUS = response[0].data.SAMPLESTATUS
                let REPORTSTATUS = response[0].data.REPORTSTATUS
                let SampleResponse = response[0].data.SampleResponse
                let ReportResponse = response[0].data.ReportResponse

            

                if(SAMPLESTATUS === 200){
                    const masterData  = {
                        ...inputParam.masterData,
                        SelectedRegistration: response[0].data.SampleResponse.SelectedRegistration,
                        Registration: replaceUpdatedObject([response[0].data.SampleResponse.SelectedRegistration], inputParam.masterData.Registration, 'npreregno'),
                        CertificateHistoryView: response[0].data.SampleResponse.CertificateHistoryView,
                        ReportHistory:sortData(response[0].data.SampleResponse.ReportHistory||[])
                    };
                    // sortData(masterData);
                    dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, dataState: undefined, loadEsign: false, openModal: false } });
                }else{
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openModal: false, loadEsign: false,
                        dataState:undefined } })
                    toast.warn(SampleResponse);
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}



export function sentCertificateAction(SendData, operation, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplecertification/sendCertification", {
            npreregno: SendData.npreregno,
            nregtypecode: SendData.nregtypecode,
            nregsubtypecode: SendData.nregsubtypecode,
            userinfo: SendData.userinfo,
            ncontrolcode:SendData.ncontrolcode,

        })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    SelectedRegistration: response.data.SelectedRegistration,
                    Registration: replaceUpdatedObject([response.data.SelectedRegistration], masterData.Registration, 'npreregno'),
                };
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        operation: null,
                        modalName: undefined,
                        loading: false,
                        dataState:undefined
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function correctionCertificateAction(CorrectionData, operation, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplecertification/correctionCertificate", {
            npreregno: CorrectionData.npreregno,
            userinfo: CorrectionData.userinfo,
            fromDate: CorrectionData.fromDate,
            toDate: CorrectionData.toDate,
            nregtypecode: CorrectionData.nregtypecode,
            nregsubtypecode: CorrectionData.nregsubtypecode,
            napprovalversioncode:CorrectionData.napprovalversioncode

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
                        dataState:undefined
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function xmlExportAction(inputParam, masterData,inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("samplecertification/xmlExport", {
            npreregno: inputParam.npreregno,
            userinfo:  inputData.userinfo,
            ncontrolcode: inputParam.ncontrolcode
        })
            .then(response => {
                // let value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        dataState:undefined
                    }
                })
                const dataURI = "data:" + response["headers"]["content-type"] + ";base64," + encodeBase64(response["data"]);
                saveAs(dataURI, "XMLFile");
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
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getWholeFilterStatus(masterData, inputData, operation, searchRef) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplecertification/getFilterWholeStatus", {
            FromDate: inputData.FromDate,
            ToDate: inputData.ToDate,
            userinfo: inputData.userinfo,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            nfilterstatus: inputData.nfilterstatus,
            napprovalversioncode: inputData.napprovalversioncode,
            approvalVersionValue:inputData.approvalVersionValue
        })

            .then(response => {
                const SelectedRegistration = response.data.SelectedRegistration ? response.data.SelectedRegistration : "";
                const Registration = response.data.Registration ? response.data.Registration : "";
                const FilterStatusValue = response.data.FilterStatusValue ? response.data.FilterStatusValue : "";
                const RegistrationSubTypeValue = response.data.RegistrationSubTypeValue ? response.data.RegistrationSubTypeValue : masterData.RegistrationSubTypeValue;

                masterData = {
                    ...masterData,
                    ...response.data,
                    Registration,
                    SelectedRegistration,
                    FilterStatusValue,
                    RegistrationSubTypeValue,
                    operation,
                };
                if (searchRef.current !== null) {
                    searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        dataState:undefined
                    }
                })
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

export const validateXMLEsignCredential = (inputParam, modalName) => {
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
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];                          
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    if(inputParam["screenData"]["inputParam"]['methodUrl'] === 'regenerateCertificate')
                    {
                        dispatch(onClickReportSample(inputParam["screenData"]["inputParam"]));
                    }
                    else if(inputParam["screenData"]["inputParam"]['operation'] === 'xml'){
                        dispatch(xmlExportAction(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["masterData"], inputParam["inputData"]))
                    }
                    else if(inputParam["screenData"]["inputParam"]['operation'] === 'generate'){
                        dispatch(generateCertificateAction(inputParam["screenData"]["inputParam"]["inputData"]))
                    }
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
};

export function getApprovalVersionSampleCertification(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("samplecertification/getApprovalVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ApprovalVersion:response.data.ApprovalVersion,
                            ApprovalVersionValue: response.data.ApprovalVersionValue,
                            ...responseData,
                            FromDate: inputParam.inputData.FromDate,
                            ToDate: inputParam.inputData.ToDate,
                        },
                        loading: false,
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
    };
};

export function onClickReportSample(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post(inputParam.classUrl + "/" + inputParam.methodUrl,inputParam.inputData)
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



export function validateEsignforSampCerGen(inputParam) {
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
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                        dispatch(generateCertificateAction(inputParam["screenData"]["inputParam"]["inputData"]))
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

export function viewReportForSample(inputParam){
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("samplecertification/viewCertificateReport",inputParam.inputData)
          
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

// export function getApprovalVersionSampleCertificate(inputParam) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         rsapi().post("approval/getApprovalVersion", inputParam.inputData)
//             .then(response => {
//                 let responseData = { ...response.data }
//                 responseData = sortData(responseData)
//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         masterData: {
//                             ...inputParam.masterData,
//                             ...responseData,
//                             fromDate: inputParam.inputData.dfrom,
//                             toDate: inputParam.inputData.dto,
//                         },
//                         loading: false,
//                     }
//                 })
//             })
//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
//     }
// }