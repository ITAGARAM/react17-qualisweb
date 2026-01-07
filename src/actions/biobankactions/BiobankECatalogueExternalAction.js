import rsapi from "../../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../LoginTypes';
import { constructOptionList, sortData, replaceUpdatedObject } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import { initRequest } from './../LoginAction';
import { intl } from '../../components/App';
import { transactionStatus } from '../../components/Enumeration';

export function getCatalogueComboForBiobankECatalogueExternal(masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        const base = rsapi().post("biobankecatalogueexternal/getComboDataForCatalogue", { userinfo });
        const byProject = rsapi().post("biobankecatalogueexternal/getSubjectCountsByProductAndProject", { userinfo });
        const byDisease = rsapi().post("biobankecatalogueexternal/getSubjectCountsByProductAndDisease", { userinfo });

        Promise.all([base, byProject, byDisease])
            .then(([comboRes, projRes, disRes]) => {
                let masterDataValues = {
                    ...masterData,
                    ...comboRes.data,
                    // Stash raw rows for charts; modal will transform them for stacked charts.
                    subjectCountsByProductAndProjectRows: projRes?.data?.rows || [],
                    subjectCountsByProductAndDiseaseRows: disRes?.data?.rows || [],
                    showExternalCatalogueModal: true
                };

                // Preserve existing sort behavior used across screens
                sortData(masterDataValues);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: masterDataValues,
                        loading: false,
                        showFilter: false,
                        operation: "view",
                        sampleState: { skip: 0, take: undefined },
                        shouldRender: true
                    }
                });
            })
            .catch(error => {
                let status = error?.response?.status;
                let payload = { loading: false };

                if (status === 401 || status === 403) {
                    payload = {
                        ...payload,
                        navigation: 'forbiddenaccess',
                        responseStatus: status
                    };
                    dispatch({ type: UN_AUTHORIZED_ACCESS, payload });
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload });
                    if (status === 500) {
                        toast.error(error.message);
                    } else {
                        const msg = error?.response?.data || "Failed to load catalogue data";
                        toast.warn(msg);
                    }
                }
            });
    };
}

export function getBiobankECatalogueExternalByFilterSubmit(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("biobankecatalogueexternal/getBiobankECatalogueExternalByFilterSubmit", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                if (inputData.searchRef !== undefined && inputData.searchRef.current !== null) {
                    inputData.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }

                let respObject = {};
                if (inputData.selectedFilter) {
                    respObject = { selectedFilter: { ...inputData.selectedFilter } };
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        take: inputData.take,
                        operation: "view",
                        sampleState: { skip: 0, take: undefined },
                        ...respObject,
                        shouldRender: true,
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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
export function getActiveBiobankECatalogueExternalRequestForm(inputParam, viewModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/getActiveBiobankECatalogueExternalRequestForm", {
            'userinfo': inputParam.userinfo,
            'nbiobankecatreqexternalcode': inputParam.nbiobankecatreqexternalcode || -1
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.masterData, ...response.data };
                sortData(masterData);
                let openModal = false;
                if (viewModal == "viewModal") {
                    openModal = true;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false, viewModal: openModal,
                        skip: inputParam.skip, operation: "view", shouldRender: true,
                        sampleState: { skip: 0, take: undefined },
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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
export function getCatalogueComboforAddForBiobankECatalogueExternal(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("biobankecatalogueexternal/getComboDataForCatalogueForAdd", { 'userinfo': inputParam.userinfo })
            .then(response => {
                let masterDataValues = {};
                const BioProjectListData = constructOptionList(response.data['lstBioProject'] || [], "nbioprojectcode",
                    "sprojecttitle", "nbioprojectcode", undefined, false);
                const SiteListData = constructOptionList(response.data['lstSite'] || [], "nsitecode",
                    "ssitename", "nsitecode", undefined, false);
                const bioProjectList = BioProjectListData.get("OptionList");
                const projectSiteList = SiteListData.get("OptionList");
                const ReqFormListData = constructOptionList(response.data['lstReqFormType'] || [], "nreqformtypecode",
                    "sreqformtypename", "nreqformtypecode", undefined, false);
                const requestFormList = ReqFormListData.get("OptionList");
                const BioSampleListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const sampleTypeList = BioSampleListData.get("OptionList");


                masterDataValues = {
                    ...inputParam.masterData,
                    ...response.data,
                    'bioProjectList': bioProjectList,
                    'projectSiteList': projectSiteList,
                    'requestFormList': requestFormList,
                    'sampleTypeList': sampleTypeList,
                    showExternalCatalogueModal: false,

                };
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        loading: false,
                        shouldRender: true,
                        showFilter: false,

                        operation: "create",
                        addExternalRequestModal: true,
                        sampleState: { skip: 0, take: undefined },
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });

                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error?.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    const d = error?.response?.data;
                    // Support both string and map payloads
                    const msg = (typeof d === 'string') ? d : (d?.message || JSON.stringify(d));
                    toast.warn(msg);
                }
            })
    }
}

export function createBiobankECatalogueExternalRequest(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/createBiobankECatalogueExternalRequest", { ...inputParam.inputData })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                let addExternalRequestModal = false
                let selectedChildRecord = {}
                if (saveType == 2) {
                    addExternalRequestModal = true;
                    selectedChildRecord["nselectedbioprojectcode"] = inputParam.selectedRecord.nselectedbioprojectcode;
                    selectedChildRecord["nselectedsitecode"] = inputParam.selectedRecord.nselectedsitecode;
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        addExternalRequestModal: addExternalRequestModal,
                        selectedChildRecord: selectedChildRecord,
                        selectedRecord: {},
                        shouldRender: true,
                        skip: inputParam.skip,
                        operation: "create",
                    }
                });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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

export function sendBiobankECatalogueExternalRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/sendBiobankECatalogueExternalRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nbiobankecatreqexternalcode': inputParam.inputData.nbiobankecatreqexternalcode || -1
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBiobankECatalogueExternalRequests: replaceUpdatedObject([response.data["selectedBiobankECatalogueExternalRequest"]], masterDataValues.lstBiobankECatalogueExternalRequests, "nbiobankecatreqexternalcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBiobankECatalogueExternalRequest"]], masterDataValues.searchedData, "nbiobankecatreqexternalcode"),
                };
                sortData(masterDataUpdated);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataUpdated,
                        loading: false,
                        selectedChildRecord: {},
                        selectedRecord: {},
                        operation: "send",
                        loadEsign: false,
                        shouldRender: true,
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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
export function cancelBiobankECatalogueExternalRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/cancelBiobankECatalogueExternalRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nbiobankecatreqexternalcode': inputParam.inputData.nbiobankecatreqexternalcode || -1
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBiobankECatalogueExternalRequests: replaceUpdatedObject([response.data["selectedBiobankECatalogueExternalRequest"]], masterDataValues.lstBiobankECatalogueExternalRequests, "nbiobankecatreqexternalcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBiobankECatalogueExternalRequest"]], masterDataValues.searchedData, "nbiobankecatreqexternalcode"),
                };
                sortData(masterDataUpdated);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataUpdated,
                        loading: false,
                        selectedChildRecord: {},
                        selectedRecord: {},
                        operation: "send",
                        loadEsign: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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

export function getProductComboDataForSampleAddBiobankECatalogueExternal(nbiobankecatreqexternalcode, userInfo, masterData, operation, screenName, ncontrolcode, skip) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/getProductComboDataForSampleAdd", {
            'userinfo': userInfo,
            'nbiobankecatreqexternalcode': nbiobankecatreqexternalcode || -1
        })
            .then(response => {
                let masterDataValues = {};

                const sampleTypeListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'sampleTypeList': sampleTypeList,
                };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues, loading: false, addExternalSampleModal: true,
                        loadEsign: false, operation, screenName, ncontrolcode, skip: skip, shouldRender: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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

export function deleteBiobankECatalogueExternalRequestSample(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        return requestUrl
            .then(response => {
                const retrievedData = sortData(response.data);
                let masterDataValue = {};
                masterDataValue = {
                    ...masterData,
                    ...retrievedData
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadEsign: false, loading: false, openModal: false, shouldRender: true,
                        masterData: masterDataValue, operation: inputParam.operation, selectedRecord: {},
                    }
                })

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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

export function saveBiobankECatalogueExternalRequestSample(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biobankecatalogueexternal/" + inputParam.operation + "BiobankECatalogueExternalRequestSample", { ...inputParam.inputData })
            .then(response => {
                let masterDataValues = {};
                let selectedId = null;
                const sampleTypeListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                let lstBiobankECatalogueExternalDetailsObj = response?.data?.lstBiobankECatalogueExternalDetails || [];
                if (inputParam.operation === "update") {
                    lstBiobankECatalogueExternalDetailsObj = masterData?.lstBiobankECatalogueExternalDetails || [];
                    selectedId = inputParam?.selectedId ?? null;
                    lstBiobankECatalogueExternalDetailsObj = replaceUpdatedObject([response.data["selectedBiobankECatalogueExternalDetails"]], lstBiobankECatalogueExternalDetailsObj, "nbiobankecatreqexternaldetailcode")
                }
                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'sampleTypeList': sampleTypeList,
                    availablecount: 0,
                    lstBiobankECatalogueExternalDetails: Array.isArray(lstBiobankECatalogueExternalDetailsObj) ? [...lstBiobankECatalogueExternalDetailsObj] : lstBiobankECatalogueExternalDetailsObj
                };
                let addExternalSampleModal = false
                let selectedChildRecord = {}
                if (saveType == 2) {
                    addExternalSampleModal = true;
                }
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        loading: false,
                        addExternalSampleModal: addExternalSampleModal,
                        selectedChildRecord: selectedChildRecord,
                        selectedRecord: {},
                        loadEsign: false,
                        shouldRender: true,
                        skip: inputParam.skip,
                        operation: inputParam.operation,
                        selectedId
                    }
                });

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
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

export function getActiveBiobankECatalogueExternalSampleDetail(fetchRecord) {
    return function (dispatch) {
        let selectedId = null;
        selectedId = fetchRecord.editRow.nbiobankecatreqexternaldetailcode;
        let ntransactionstatus = fetchRecord?.masterData?.selectedBiobankECatalogueExternalRequest?.ntransactionstatus || -1;
        if (ntransactionstatus == transactionStatus.DRAFT) {
            dispatch(initRequest(true));
            return rsapi().post("biobankecatalogueexternal/getActiveSampleDetail", {
                "nbiobankecatreqexternaldetailcode": fetchRecord.editRow.nbiobankecatreqexternaldetailcode,
                "userinfo": fetchRecord.userInfo
            })
                .then(response => {
                    let selectedChildRecord = {};
                    let masterData = fetchRecord.masterData;
                    let selectedBiobankECatalogueExternalDetails = response.data.selectedBiobankECatalogueExternalDetails;
                    let nproductcodeObj= {
                            "label": selectedBiobankECatalogueExternalDetails.sproductname,
                            "value": selectedBiobankECatalogueExternalDetails.nproductcode,
                            "item": selectedBiobankECatalogueExternalDetails
                        };
                    selectedChildRecord = {
                        "nproductcode": nproductcodeObj,
                        "sreqminvolume": (selectedBiobankECatalogueExternalDetails.sreqminvolume ?? selectedBiobankECatalogueExternalDetails.srequestedvolume ?? ""),
                        "nreqnoofsamples": selectedBiobankECatalogueExternalDetails.nreqnoofsamples,
                        "sparentsamplecode": selectedBiobankECatalogueExternalDetails.sparentsamplecode,
                        "nbiobankecatreqexternaldetailcode": fetchRecord.editRow.nbiobankecatreqexternaldetailcode,
                    };
                    let sampleTypeList = masterData?.sampleTypeList || []
                    sampleTypeList.push(nproductcodeObj)

                    masterData = { ...masterData, 'sampleTypeList': sampleTypeList };

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            addExternalSampleModal: true, operation: fetchRecord.operation,
                            selectedChildRecord, masterData, ncontrolcode: fetchRecord.ncontrolCode,
                            screenName: fetchRecord.screenName, loading: false, selectedId, shouldRender: true,
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });

                    const status = error?.response?.status;

                    if (status === 401 || status === 403) {
                        dispatch({
                            type: UN_AUTHORIZED_ACCESS,
                            payload: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: status
                            }
                        });
                        return;
                    }

                    // Prefer server-provided text on 500s too
                    if (status === 500) {
                        const d = error?.response?.data;
                        const serverMsg =
                            (typeof d === 'string') ? d :
                                (d && typeof d === 'object')
                                    ? (d.message || d.msg || d.error || d.errorMessage || d.smessage ||
                                        d.title || d.reason || d.detail || d?.errors?.[0]?.message)
                                    : null;

                        toast.error(serverMsg || error.message || 'Internal Server Error');
                        return;
                    }

                    // Generic branch: normalize anything (string, map, array, blob)
                    const d = error?.response?.data;
                    let msg = '';

                    if (typeof d === 'string') {
                        msg = d;
                    } else if (d && typeof d === 'object') {
                        // common server keys
                        msg = d.message || d.msg || d.error || d.errorMessage || d.smessage ||
                            d.title || d.reason || d.detail || (Array.isArray(d.errors) && d.errors[0]?.message);
                        if (!msg) {
                            try { msg = JSON.stringify(d); } catch { msg = '[Unexpected error object]'; }
                        }
                    } else if (d instanceof Blob) {
                        // sometimes backends send text payloads as Blob
                        msg = 'Request failed'; // keep simple here; if needed, read blob text upstream
                    } else {
                        msg = error?.message || 'Unexpected error';
                    }

                    toast.warn(msg);
                });

        } else {
            toast.warn(intl.formatMessage({ id: 'IDS_SELECTDRAFTSTATUSRECORD' }));
        }
    }
}

export function validateEsignforBiobankECatalogueExternal(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data === "Success") {
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    let { selectedRecord } = inputParam["screenData"];
                    delete selectedRecord.esignpassword;
                    delete selectedRecord.esigncomments;
                    delete selectedRecord.esignreason;
                    delete selectedRecord.agree;
                    delete inputParam.inputData.password;
                    if (inputParam?.screenData?.modalOperation === "sendBiobankECatalogueExternalRequest") {
                        dispatch(sendBiobankECatalogueExternalRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "cancelBiobankECatalogueExternalRequest") {
                        dispatch(cancelBiobankECatalogueExternalRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "deleteChild") {
                        dispatch(deleteBiobankECatalogueExternalRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    } else if (inputParam?.screenData?.modalOperation === "updateChild") {
                        dispatch(saveBiobankECatalogueExternalRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    }
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function fetchBioSampleAvailabilityForBiobankECatalogueExternal(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('biobankecatalogueexternal/getBioSampleAvailability', { ...input })
            .then(response => {
                const availablecount = response?.data?.availablecount ?? 0;
                const md = (getState().Login && getState().Login.masterData) || {};
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: { ...md, availablecount }
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    };
}


export function fetchParentSamplesForBiobankECatalogueExternal(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('biobankecatalogueexternal/getParentSamples', { ...input })
            .then(response => {
                // Accept either an array or { parentSamples: [...] }
                const raw = Array.isArray(response?.data)
                    ? response.data
                    : (response?.data?.parentSamples || []);
                const list = Array.isArray(raw) ? raw : [];

                const md = (getState().Login && getState().Login.masterData) || {};
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: { ...md, parentSamples: list }
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    };
}