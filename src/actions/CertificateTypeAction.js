import rsapi from '../rsapi';
import { intl } from '../components/App';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { constructOptionList, sortData } from '../components/CommonScript';


// export function fetchRecordCertificateType1(fetchRecordParam) {
//     //export function fetchRecordCertificateType (screenName, primaryKeyName, primaryKeyValue, operation, inputParam, userInfo, ncontrolCode){
//     return function (dispatch) {

//         let urlArray = [];
//         let selectedId = null; 
//         if (fetchRecordParam.operation === "update") {
//             const certificateType = rsapi().post(fetchRecordParam.inputParam.classUrl + "/getActiveCertificateTypeById", { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo });

//             urlArray = [certificateType];
//             selectedId = fetchRecordParam.primaryKeyValue;

//             dispatch(initRequest(true));
//             Axios.all(urlArray)
//                 .then(Axios.spread((...response) => {

//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             selectedRecord:
//                                 fetchRecordParam.operation === "update" ? response[0].data : undefined, operation: fetchRecordParam.operation,
//                             screenName: "IDS_CERTIFICATETYPE",
//                             openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
//                             loading: false, selectedId
//                         }
//                     });
//                 }))

//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//                     if (error.response?.status === 429) {
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
//                         toast.error(intl.formatMessage({ id: error.message }));
//                     }
//                     else {
//                         toast.warn(intl.formatMessage({ id: error.response.data }));
//                     }
//                 })
//         } else {
//             dispatch({
//                 type: DEFAULT_RETURN,
//                 payload: {
//                     selectedRecord: {}, operation: fetchRecordParam.operation,
//                     screenName: "IDS_CERTIFICATETYPE",
//                     openModal: true, ncontrolCode: fetchRecordParam.ncontrolCode,
//                     loading: false
//                 }
//             });
//         }

//     }
// }

export function fetchRecordCertificateType(fetchRecordParam) {
    return function (dispatch) {

        const reportBatchService = rsapi().post("certificatetype/getCertificateTypeComboData",
            { userinfo: fetchRecordParam.userInfo });

        let urlArray = [];
        // let selectedId = null;

        if (fetchRecordParam.operation === "update") {
            const certificateType = rsapi().post(fetchRecordParam.inputParam.classUrl + "/getActiveCertificateTypeById", { [fetchRecordParam.primaryKeyField]: fetchRecordParam.primaryKeyValue, "userinfo": fetchRecordParam.userInfo });

            urlArray = [reportBatchService, certificateType];
            // selectedId = fetchRecordParam.primaryKeyValue;
        }
        else {
            urlArray = [reportBatchService];
        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const reportBatchMap = constructOptionList(response[0].data || [], "ncertificatereporttypecode",
                    "sdisplayname", undefined, undefined, true);

                const reportBatchList = reportBatchMap.get("OptionList");
                let selectedRecord = {};
                if (fetchRecordParam.operation === "update") {
                    selectedRecord = response[1].data;
                    reportBatchList.map(item => item.value === selectedRecord.ncertificatereporttypecode ?
                        selectedRecord["ncertificatereporttypecode"] = {
                            "label": item.label,
                            "value": item.value,
                            "item": item
                        }
                        : "");

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        reportBatchTypeList: reportBatchList,
                        selectedRecord,
                        operation: fetchRecordParam.operation,
                        screenName: "IDS_CERTIFICATETYPE",
                        openModal: true,
                        ncontrolCode: fetchRecordParam.ncontrolCode,
                        loading: false,
                        //  selectedId
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: error.response.data }));
                }
            })
    }
}
export function getCertificateTypeVersion(certificatetype, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("certificatetype/getCertificateTypeByClick", { ncertificatetypecode: certificatetype.ncertificatetypecode, userinfo: userInfo })
            .then(response => {
                let responseData = sortData(response.data)
                masterData = { ...masterData, ...responseData }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
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
                } else {
                    toast.warn(error.response.data)
                }
            })
    }
}
export function getReportMasterByCertificateType(ncertificatetypecode, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("certificatetype/getReportMasterByCertificateType", { ncertificatetypecode, userinfo: userInfo })
            .then(response => {
                const reportmasterMap = constructOptionList(response.data.reportmaster || [], "nreportcode", "sreportname", undefined, undefined, true);
                const reportmaster = reportmasterMap.get("OptionList");

                const previewReportmasterMap = constructOptionList(response.data.previewreportmaster || [], "nreportcode", "sreportname", undefined, undefined, true);
                const previewReportmaster = previewReportmasterMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        reportMasterList: reportmaster,
                        previewReportMasterList: previewReportmaster,
                        openChildModal: true,
                        screenName: "IDS_CERTIFICATETYPEVERSION",
                        operation: "create",
                        id: 'certificatetypeversion',
                        selectedRecord:{},
                        reportDetailsList:[]
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
                } else {
                    toast.warn(error.response.data)
                }
            })
    }
}
export function getReportDetailByReport(nreportcode,ncertificatetypecode, selectedRecord, userInfo, fieldName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("certificatetype/getReportDetailByReport", { nreportcode,ncertificatetypecode, userinfo: userInfo })
            .then(response => {
                const reportdetailMap = constructOptionList(response.data.reportDetails || [], 
                                "nreportdetailcode", "nversionno", undefined, undefined, true);
                let reportDetail = reportdetailMap.get("OptionList");
               
                if (fieldName === "npreviewreportcode"){
                    selectedRecord['npreviewreportdetailcode'] = [];
                    selectedRecord['spreviewdisplaystatus'] = '';
                    dispatch({ type: DEFAULT_RETURN,payload: {  loading: false,
                                                                previewReportDetailsList: reportDetail,
                                                                selectedRecord
                                                            }
                            })
                }
                else{
                    selectedRecord['nreportdetailcode'] = [];
                    selectedRecord['sdisplaystatus'] = '';
                    dispatch({ type: DEFAULT_RETURN,payload: {  loading: false,
                                                                reportDetailsList: reportDetail,
                                                                selectedRecord
                                                            }
                                        })
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
                } else {
                    toast.warn(error.response.data)
                }
            })
    }
}
export function fetchCertificateTypeVersionById(editParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('certificatetype/fetchCertificateTypeVersionById', { ncertificatetypeversioncode: editParam.primaryKeyValue, userinfo: editParam.userInfo })
            .then(response => {
                const responseData = response.data.selectedRecord;
                
                const reportMasterMap = constructOptionList(response.data.reportmaster || [], "nreportcode", "sreportname", undefined, undefined, true);
                const reportMaster = reportMasterMap.get("OptionList");
                
                const reportdetailMap = constructOptionList(response.data.ReportDetails || [], "nreportdetailcode", "nversionno", undefined, undefined, true);
                const reportDetail = reportdetailMap.get("OptionList");

                const previewReportMasterMap = constructOptionList(response.data.previewreportmaster || [], "nreportcode", "sreportname", undefined, undefined, true);
                const previewReportMaster = previewReportMasterMap.get("OptionList");
                
                const previewReportdetailMap = constructOptionList(response.data.PreviewReportDetails || [], "nreportdetailcode", "nversionno", undefined, undefined, true);
                const previewReportDetail = previewReportdetailMap.get("OptionList");
              
                let selectedReportDetail = undefined;
                reportDetail.forEach(report =>{
                    if (report.value === responseData.nreportdetailcode) {
                        selectedReportDetail = report
                    }
                })

                let selectedPreviewReportDetail = undefined;
                previewReportDetail.forEach(report =>{
                    if (report.value === responseData.npreviewreportdetailcode) {
                        selectedPreviewReportDetail = report
                    }
                })

                let selectedRecord = {};
                if(selectedReportDetail){
                    reportMaster.forEach(master => {
                        if (master.value === selectedReportDetail.item.nreportcode) {
                            selectedRecord['nreportcode'] = master
                        }
                    })
                }else{
                    selectedReportDetail = {label:"NA",value:-1,item:{sreportname:"NA",nreportcode:-1}}
                }

                if(selectedPreviewReportDetail){
                    previewReportMaster.forEach(master => {
                        if (master.value === selectedPreviewReportDetail.item.nreportcode) {
                            selectedRecord['npreviewreportcode'] = master
                        }
                    })
                }else{
                    selectedPreviewReportDetail = {label:"NA",value:-1,item:{sreportname:"NA",nreportcode:-1}}
                }

                selectedRecord['nreportcode'] = selectedRecord['nreportcode']?selectedRecord['nreportcode'] :{label:"NA",value:-1,item:{}}
                selectedRecord['nreportdetailcode'] = selectedReportDetail;
                selectedRecord['sdisplaystatus'] =  selectedReportDetail.item.sdisplaystatus;

                selectedRecord['npreviewreportcode'] = selectedRecord['npreviewreportcode']?selectedRecord['npreviewreportcode'] :{label:"NA",value:-1,item:{}}
                selectedRecord['npreviewreportdetailcode'] = selectedPreviewReportDetail;
                selectedRecord['spreviewdisplaystatus'] =  selectedPreviewReportDetail.item.sdisplaystatus;

                selectedRecord['ntransactionstatus'] = responseData.ntransactionstatus
                selectedRecord['ncertificatetypeversionno'] = responseData.ncertificatetypeversionno
                selectedRecord['nversionno'] = responseData.nversionno

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        openChildModal:true,
                        operation:"update",
                        screenName:"IDS_CERTIFICATETYPEVERSION",
                        id: 'certificatetypeversion',
                        reportMasterList: reportMaster,
                        reportDetailsList: reportDetail,
                        previewReportMasterList: previewReportMaster,
                        previewReportDetailsList: previewReportDetail,
                        selectedId:editParam.primaryKeyValue,
                        selectedRecord,
                        ncontrolCode : editParam.ncontrolCode
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
                } else {
                    toast.warn(error.response.data)
                }
            })
    }
}