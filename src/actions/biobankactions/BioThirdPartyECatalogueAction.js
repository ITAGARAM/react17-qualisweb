import { toast } from 'react-toastify';
import React from "react";
import { intl } from '../../components/App';
import { constructOptionList, replaceUpdatedObject, sortData } from '../../components/CommonScript';
import rsapi from "../../rsapi";
import { initRequest } from './../LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../LoginTypes';
import { transactionStatus } from '../../components/Enumeration';

export function getThirdPartyCatalogueCombo(masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        const base = rsapi().post("biothirdpartyecatalogue/getComboDataForCatalogue", { userinfo, isOpenCatalogue: true });
        const byProject = rsapi().post("biothirdpartyecatalogue/getSubjectCountsByProductAndProject", { userinfo });
        const byDisease = rsapi().post("biothirdpartyecatalogue/getSubjectCountsByProductAndDisease", { userinfo });

        Promise.all([base, byProject, byDisease])
            .then(([comboRes, projRes, disRes]) => {
                let masterDataValues = {
                    ...masterData,
                    ...comboRes.data,
                    subjectCountsByProductAndProjectRows: projRes?.data?.rows || [],
                    subjectCountsByProductAndDiseaseRows: disRes?.data?.rows || [],
                    showCatalogueModal: true
                };

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

export function getThirdPartyECatalogueByFilterSubmit(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("biothirdpartyecatalogue/getThirdPartyECatalogueByFilterSubmit", { ...inputData.inputData })
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
                    toast.info(error.response.data);
                }
            })
    }
}
export function getActiveThirdPartyECatalogueRequestForm(inputParam, viewModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/getActiveThirdPartyECatalogueRequestForm", {
            'userinfo': inputParam.userinfo,
            'nthirdpartyecatrequestcode': inputParam.nthirdpartyecatrequestcode || -1
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
export function getThirdPartyECatalogueComboforAdd(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("biothirdpartyecatalogue/getComboDataForCatalogue", { 'userinfo': inputParam.userinfo })
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
                    showCatalogueModal: false,

                };
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        loading: false,
                        shouldRender: true,
                        showFilter: false,

                        operation: "create",
                        addRequestModal: true,
                        sampleState: { skip: 0, take: undefined },
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function createThirdPartyECatalogueRequest(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/createThirdPartyECatalogueRequest", { ...inputParam.inputData })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                let addRequestModal = false
                let selectedChildRecord = {}
                if (saveType == 2) {
                    addRequestModal = true;
                    selectedChildRecord["nselectedbioprojectcode"] = inputParam.selectedRecord.nselectedbioprojectcode;
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        addRequestModal: addRequestModal,
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

export function sendThirdPartyECatalogueRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/sendThirdPartyECatalogueRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nthirdpartyecatrequestcode': inputParam.inputData.nthirdpartyecatrequestcode || -1
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBioThirdPartyECatalogueRequests: replaceUpdatedObject([response.data["selectedBioThirdPartyECatalogueRequest"]], masterDataValues.lstBioThirdPartyECatalogueRequests, "nthirdpartyecatrequestcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioThirdPartyECatalogueRequest"]], masterDataValues.searchedData, "nthirdpartyecatrequestcode"),
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
export function cancelThirdPartyECatalogueRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/cancelThirdPartyECatalogueRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nthirdpartyecatrequestcode': inputParam.inputData.nthirdpartyecatrequestcode || -1
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBioThirdPartyECatalogueRequests: replaceUpdatedObject([response.data["selectedBioThirdPartyECatalogueRequest"]], masterDataValues.lstBioThirdPartyECatalogueRequests, "nthirdpartyecatrequestcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioThirdPartyECatalogueRequest"]], masterDataValues.searchedData, "nthirdpartyecatrequestcode"),
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

export function getThirdPartyProductComboDataForSampleAdd(nthirdpartyecatrequestcode, userInfo, masterData, operation, screenName, ncontrolcode, skip) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/getProductComboDataForSampleAdd", {
            'userinfo': userInfo,
            'nthirdpartyecatrequestcode': nthirdpartyecatrequestcode || -1
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
                        masterData: masterDataValues, loading: false, addSampleModal: true,
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

export function deleteThirdPartyECatalogueRequestSample(inputParam, masterData) {
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

export function saveThirdPartyECatalogueRequestSample(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("biothirdpartyecatalogue/" + inputParam.operation + "ThirdPartyECatalogueRequestSample", { ...inputParam.inputData })
            .then(response => {
                let masterDataValues = {};
                let selectedId = null;
                const sampleTypeListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                let lstBioThirdPartyECatalogueDetailsObj = response?.data?.lstBioThirdPartyECatalogueDetails || [];
                if (inputParam.operation === "update") {
                    lstBioThirdPartyECatalogueDetailsObj = masterData?.lstBioThirdPartyECatalogueDetails || [];
                    selectedId = inputParam?.selectedId ?? null;
                    lstBioThirdPartyECatalogueDetailsObj = replaceUpdatedObject([response.data["selectedBioThirdPartyECatalogueDetails"]], lstBioThirdPartyECatalogueDetailsObj, "nthirdpartyecatreqdetailcode")
                }
                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'sampleTypeList': sampleTypeList,
                    availablecount: 0,
                    lstBioThirdPartyECatalogueDetails: Array.isArray(lstBioThirdPartyECatalogueDetailsObj) ? [...lstBioThirdPartyECatalogueDetailsObj] : lstBioThirdPartyECatalogueDetailsObj
                };
                let addSampleModal = false
                let selectedChildRecord = {}
                if (saveType == 2) {
                    addSampleModal = true;
                }
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        loading: false,
                        addSampleModal: addSampleModal,
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

export function getActiveThirdPartyECatalogueSampleDetail(fetchRecord) {
    return function (dispatch) {
        let selectedId = null;
        selectedId = fetchRecord.editRow.nthirdpartyecatreqdetailcode;
        let ntransactionstatus = fetchRecord?.masterData?.selectedBioThirdPartyECatalogueRequest?.ntransactionstatus || -1;
        if (ntransactionstatus == transactionStatus.DRAFT) {
            dispatch(initRequest(true));
            return rsapi().post("biothirdpartyecatalogue/getActiveSampleDetail", {
                "nthirdpartyecatreqdetailcode": fetchRecord.editRow.nthirdpartyecatreqdetailcode,
                "userinfo": fetchRecord.userInfo
            })
                .then(response => {
                    let selectedChildRecord = {};
                    let masterData = fetchRecord.masterData;
                    let selectedBioThirdPartyECatalogueDetails = response.data.selectedBioThirdPartyECatalogueDetails;
                    selectedBioThirdPartyECatalogueDetails["stotalqty"] = response.data.stotalqty;
                    let nproductcodeObj = {
                        label: selectedBioThirdPartyECatalogueDetails.sproductname,
                        value: selectedBioThirdPartyECatalogueDetails.nproductcode,
                        item: selectedBioThirdPartyECatalogueDetails
                    }
                    selectedChildRecord = {
                        // "nproductcode": {
                        //     label: selectedBioThirdPartyECatalogueDetails.sproductname,
                        //     value: selectedBioThirdPartyECatalogueDetails.nproductcode,
                        //     item: selectedBioThirdPartyECatalogueDetails
                        // },
                        "nproductcode": nproductcodeObj,
                        "sreqminvolume": (selectedBioThirdPartyECatalogueDetails.sreqminvolume ?? selectedBioThirdPartyECatalogueDetails.srequestedvolume ?? ""),
                        "nreqnoofsamples": selectedBioThirdPartyECatalogueDetails.nreqnoofsamples,
                        "sparentsamplecode": selectedBioThirdPartyECatalogueDetails.sparentsamplecode,
                        "nthirdpartyecatreqdetailcode": fetchRecord.editRow.nthirdpartyecatreqdetailcode,
                    };

                    //added by Vishakh BGSI-280 for sample type becomes empty when change min vol. per sample
                    let sampleTypeList = masterData?.sampleTypeList || []
                    sampleTypeList.push(nproductcodeObj)

                    masterData = { ...masterData, 'sampleTypeList': sampleTypeList };

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            addSampleModal: true, operation: fetchRecord.operation,
                            selectedChildRecord, masterData, ncontrolcode: fetchRecord.ncontrolCode,
                            screenName: fetchRecord.screenName, loading: false, selectedId, shouldRender: true,
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        } else {
            toast.warn(intl.formatMessage({ id: 'IDS_SELECTDRAFTSTATUSRECORD' }));
        }
    }
}

export function validateEsignforThirdPartyECatalogue(inputParam) {
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
                    if (inputParam?.screenData?.modalOperation === "sendThirdPartyECatalogueRequest") {
                        dispatch(sendThirdPartyECatalogueRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "cancelThirdPartyECatalogueRequest") {
                        dispatch(cancelThirdPartyECatalogueRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "deleteChild") {
                        dispatch(deleteThirdPartyECatalogueRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    } else if (inputParam?.screenData?.modalOperation === "updateChild") {
                        dispatch(saveThirdPartyECatalogueRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
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
                    toast.info(error.response.data);
                }
            })
    }
}
export function fetchBioThirdPartyECatalogueSampleAvailability(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('biothirdpartyecatalogue/getBioSampleAvailability', { ...input })
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
                    toast.info(error.response.data);
                }
            })
    };
}


export function fetchThirdPartyECatalogueParentSamples(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('biothirdpartyecatalogue/getParentSamples', { ...input })
            .then(response => {
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
                    toast.info(error.response.data);
                }
            })
    };
}