import { toast } from 'react-toastify';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { rearrangeDateFormat } from '../components/CommonScript'
import { intl } from '../components/App';

export function getSelectedSchemeDetails(schemes, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoiceschemes/getSeletedScheme", { nschemecode: schemes.nschemecode, userinfo: userInfo })
            .then(response => {
                masterData = { ...masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.warn(error.response.data);
                }
            })
    }
}

export function activeAndRetiredSchemes(masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoiceschemes/activeAndRetiredSchemes", { nschemecode: masterData.nschemecode, userinfo: userInfo, ntransactionstatus: masterData.ntransactionstatus })
            .then(response => {
                masterData = { ...masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getUpdateSchemeData(schemeParam, selectedRecord,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("invoiceschemes/getUpdateSchemeDataById", { nschemecode: schemeParam.masterData.selectedScheme.nschemecode,userinfo: userInfo })
            .then(response => {
                selectedRecord["sschemename"] = response.data[0].sschemename;
                selectedRecord["dfromdate"] = rearrangeDateFormat(schemeParam.userInfo, response.data[0].sfromdate);
                selectedRecord["dtodate"] = rearrangeDateFormat(schemeParam.userInfo, response.data[0].stodate);
                selectedRecord["nschemecode"] = response.data[0].nschemecode;

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        openModal: true,
                        loading: false,
                        operation: "Edit",
                        screenName: schemeParam.screenName
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getExportProductdata(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const requestUrl = rsapi().post("invoiceschemes/exportproductmaster", { ...inputParam.inputData });
        return requestUrl
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
                    toast.warn(error.response.data);
                }
            })
    }
}

export function importDataProduct(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("invoiceschemes/importProductMaster", inputParam.formData, { scheme: inputParam.Schemeid })
            .then(response => {
                masterData = {
                    ...masterData, ...response.data
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        openModal: false,
                        loadEsign: false,
                        masterData,
                        importdesignopen: inputParam.importdesignopen
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.warn(error.response.data);
                }
            })
    }

}

export function getExportSchemedata(inputParam) {

    return function (dispatch) {
        dispatch(initRequest(true));
        const requestUrl = rsapi().post("invoiceschemes/exportschememaster", { ...inputParam.inputData });
        return requestUrl
            .then(response => {
                let value = response.data;
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
                    toast.warn(error.response.data);
                }
            })
    }
}