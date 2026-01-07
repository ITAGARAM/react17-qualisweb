import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';



export function getTransactionDetail(inputData) {
    return function (dispatch) {
        let inputParamData = {
            userinfo: inputData.userinfo,
            fromDate: inputData.fromDate,
            toDate: inputData.toDate,
            viewTypecode: inputData.viewTypecode,
            transFilterType: inputData.transFilterType,
            sregistereddate: inputData.sregistereddate
        }
        dispatch(initRequest(true));
        return rsapi().post("flextransaction/getTrendChartDate", inputParamData)
            .then(response => {
                let masterData = { ...inputData.masterData, ...response.data };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false, skip: inputData.skip, take: inputData.take
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

export function getFilterTransactionDetailsRecords(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("flextransaction/getFilterTransactionDetailsRecords", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data,
                    ViewType: inputData.masterData.breadCrumbViewType.item
                }

                if (inputData.searchRef !== undefined && inputData.searchRef.current !== null) {
                    inputData.searchRef.current.value = "";
                    masterData['searchedTransactionDetails'] = undefined;
                }
                let resetDataGridPage = false;
                if (masterData.TransactionDetails && masterData.TransactionDetails.length < inputData.detailSkip) {
                    resetDataGridPage = true
                } else {
                    resetDataGridPage = false
                }
                let respObject = {

                    masterData,
                    loading: false,
                    showFilter: false,
                    resetDataGridPage
                }
                dispatch({ type: DEFAULT_RETURN, payload: { ...respObject, skip: 0, take: 20 } })

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

export function ViewTransactionDetails(masterData, userInfo, details, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("flextransaction/getTransactionDetails", { ntransactionsampleresultno: details.ntransactionsampleresultno, userinfo: userInfo })
            .then(response => {
                let Details = JSON.parse(response.data['ViewTransactionDetails'][0].jsondata.value)
                let valueShow = [];
                response.data['FieldName'].map(x => {
                    valueShow.push({
                        ...x, svalue: (Details[x.sfieldname] === "" || Details[x.sfieldname] === null) ? '-' : Details[x.sfieldname],
                        ntransactionsampleresultno: details.ntransactionsampleresultno
                    })
                    return null;
                })
                masterData['ViewTransactionDetails'] = [];
                masterData['ViewTransactionDetails'] = valueShow
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        details: details,
                        masterData,
                        selectedId: details.ntransactionsampleresultno,
                        screenName,
                        loading: false,
                        openModal: true,

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
export function getexportdata(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("flextransaction/getExportData", { ...inputData.inputData })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        resultStatus: response.data["ExportExcel"] || '',
                        loading: false,

                    }
                })
                if (response.data["ExportExcel"] === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data["ExportExcelPath"]);
                    document.getElementById("download_data").click();
                }
                else {
                    toast.warn(response.data["ExportExcel"]);
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
    }
}


export function viewFlextTransactionReport(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("flextransaction/viewFlextTransactionReport", { ...inputParam.inputData })
        .then(response => {

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    resultStatus: response.data["ExportExcel"] || '',
                    loading: false,

                }
            })
            if (response.data["ExportExcel"] === "Success") {
                document.getElementById("download_data").setAttribute("href", response.data["ExportExcelPath"]);
                document.getElementById("download_data").click();
            }
            else {
                toast.warn(response.data["ExportExcel"]);
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
    }
}