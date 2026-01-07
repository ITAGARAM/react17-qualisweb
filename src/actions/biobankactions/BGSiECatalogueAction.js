import rsapi from "../../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../LoginTypes';
import { constructOptionList, sortData, replaceUpdatedObject } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './../LoginAction';
import { intl } from '../../components/App';
import { transactionStatus } from '../../components/Enumeration';

export function getCatalogueCombo(masterData, userinfo) {
    return function (dispatch) {
        dispatch(initRequest(true));

        // Fetch base combos + both chart datasets in parallel
        const base = rsapi().post("bgsiecatalogue/getComboDataForCatalogue", { userinfo });
        const byProject = rsapi().post("bgsiecatalogue/getSubjectCountsByProductAndProject", { userinfo });
        const byDisease = rsapi().post("bgsiecatalogue/getSubjectCountsByProductAndDisease", { userinfo });

        Promise.all([base, byProject, byDisease])
            .then(([comboRes, projRes, disRes]) => {
                let masterDataValues = {
                    ...masterData,
                    ...comboRes.data,
                    // Stash raw rows for charts; modal will transform them for stacked charts.
                    subjectCountsByProductAndProjectRows: projRes?.data?.rows || [],
                    subjectCountsByProductAndDiseaseRows: disRes?.data?.rows || [],
                    showCatalogueModal: true
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

export function getBGSiECatalogueByFilterSubmit(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("bgsiecatalogue/getBGSiECatalogueByFilterSubmit", { ...inputData.inputData })
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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
export function getActiveBGSiECatalogueRequestForm(inputParam, viewModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/getActiveBGSiECatalogueRequestForm", {
            'userinfo': inputParam.userinfo,
            'nbgsiecatrequestcode': inputParam.nbgsiecatrequestcode || -1
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
                 if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                //#SECURITY-VULNERABILITY-MERGING-END
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
export function getCatalogueComboforAdd(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("bgsiecatalogue/getComboDataForCatalogue", { 'userinfo': inputParam.userinfo })
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				 if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function createBGSiECatalogueRequest(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/createBGSiECatalogueRequest", { ...inputParam.inputData })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                let addRequestModal = false
                let selectedChildRecord = {}
                if (saveType == 2) {
                    addRequestModal = true;
                    selectedChildRecord["nselectedbioprojectcode"] = inputParam.selectedRecord.nselectedbioprojectcode;
                    selectedChildRecord["nselectedsitecode"] = inputParam.selectedRecord.nselectedsitecode;
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function sendBGSiECatalogueRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/sendBGSiECatalogueRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nbgsiecatrequestcode': inputParam.inputData.nbgsiecatrequestcode || -1,
            'ncontrolcode': inputParam.inputData.ncontrolcode
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBioBGSiECatalogueRequests: replaceUpdatedObject([response.data["selectedBioBGSiECatalogueRequest"]], masterDataValues.lstBioBGSiECatalogueRequests, "nbgsiecatrequestcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioBGSiECatalogueRequest"]], masterDataValues.searchedData, "nbgsiecatrequestcode"),
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
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {					//#SECURITY-VULNERABILITY-MERGING-END
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
export function cancelBGSiECatalogueRequest(inputParam, masterDataValues) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/cancelBGSiECatalogueRequest", {
            'userinfo': inputParam.inputData.userinfo,
            'nbgsiecatrequestcode': inputParam.inputData.nbgsiecatrequestcode || -1
        })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBioBGSiECatalogueRequests: replaceUpdatedObject([response.data["selectedBioBGSiECatalogueRequest"]], masterDataValues.lstBioBGSiECatalogueRequests, "nbgsiecatrequestcode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioBGSiECatalogueRequest"]], masterDataValues.searchedData, "nbgsiecatrequestcode"),
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function getProductComboDataForSampleAdd(nbgsiecatrequestcode, userInfo, masterData, operation, screenName, ncontrolcode, skip) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/getProductComboDataForSampleAdd", {
            'userinfo': userInfo,
            'nbgsiecatrequestcode': nbgsiecatrequestcode || -1
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function deleteBGSiECatalogueRequestSample(inputParam, masterData) {
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function saveBGSiECatalogueRequestSample(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bgsiecatalogue/" + inputParam.operation + "BGSiECatalogueRequestSample", { ...inputParam.inputData })
            .then(response => {
                let masterDataValues = {};
                let selectedId = null;
                const sampleTypeListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                let lstBioBGSiECatalogueDetailsObj = response?.data?.lstBioBGSiECatalogueDetails || [];
                if (inputParam.operation === "update") {
                    lstBioBGSiECatalogueDetailsObj = masterData?.lstBioBGSiECatalogueDetails || [];
                    selectedId = inputParam?.selectedId ?? null;
                    lstBioBGSiECatalogueDetailsObj = replaceUpdatedObject([response.data["selectedBioBGSiECatalogueDetails"]], lstBioBGSiECatalogueDetailsObj, "nbgsiecatdetailcode")
                }
                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'sampleTypeList': sampleTypeList,
                    availablecount: 0,
                    lstBioBGSiECatalogueDetails: Array.isArray(lstBioBGSiECatalogueDetailsObj) ? [...lstBioBGSiECatalogueDetailsObj] : lstBioBGSiECatalogueDetailsObj
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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

export function getActiveBGSiECatalogueSampleDetail(fetchRecord) {
    return function (dispatch) {
        let selectedId = null;
        selectedId = fetchRecord.editRow.nbgsiecatdetailcode;
        let ntransactionstatus = fetchRecord?.masterData?.selectedBioBGSiECatalogueRequest?.ntransactionstatus || -1;
        if (ntransactionstatus == transactionStatus.DRAFT) {
            dispatch(initRequest(true));
            return rsapi().post("bgsiecatalogue/getActiveSampleDetail", {
                "nbgsiecatdetailcode": fetchRecord.editRow.nbgsiecatdetailcode,
                "userinfo": fetchRecord.userInfo
            })
                .then(response => {
                    let selectedChildRecord = {};
                    let masterData = fetchRecord.masterData;
                    let selectedBioBGSiECatalogueDetails = response.data.selectedBioBGSiECatalogueDetails;
                    selectedBioBGSiECatalogueDetails["stotalqty"] = response.data.stotalqty;
                    let nproductcodeObj = {
                        label: selectedBioBGSiECatalogueDetails.sproductname,
                        value: selectedBioBGSiECatalogueDetails.nproductcode,
                        item: selectedBioBGSiECatalogueDetails
                    }
                    selectedChildRecord = {
                        "nproductcode": nproductcodeObj,
                        "sreqminvolume": (selectedBioBGSiECatalogueDetails.sreqminvolume ?? selectedBioBGSiECatalogueDetails.srequestedvolume ?? ""),
                        "nreqnoofsamples": selectedBioBGSiECatalogueDetails.nreqnoofsamples,
                        "sparentsamplecode": selectedBioBGSiECatalogueDetails.sparentsamplecode,
                        "nbgsiecatdetailcode": fetchRecord.editRow.nbgsiecatdetailcode,
                    };

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
                    
                    //#SECURITY-VULNERABILITY-MERGING-START
                    //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
					if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                	} else if (error.response?.status === 401 || error.response?.status === 403) {
					//#SECURITY-VULNERABILITY-MERGING-END
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

export function validateEsignforBGSiECatalogue(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    let { selectedRecord } = inputParam["screenData"];
                    delete selectedRecord.esignpassword;
                    delete selectedRecord.esigncomments;
                    delete selectedRecord.esignreason;
                    delete selectedRecord.agree;
                    delete inputParam.inputData.password;
                    if (inputParam?.screenData?.modalOperation === "sendBGSiECatalogueRequest") {
                        dispatch(sendBGSiECatalogueRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "cancelBGSiECatalogueRequest") {
                        dispatch(cancelBGSiECatalogueRequest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]));
                    } else if (inputParam?.screenData?.modalOperation === "deleteChild") {
                        dispatch(deleteBGSiECatalogueRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    } else if (inputParam?.screenData?.modalOperation === "updateChild") {
                        dispatch(saveBGSiECatalogueRequestSample(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    }
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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
export function fetchBioSampleAvailability(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('bgsiecatalogue/getBioSampleAvailability', { ...input })
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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


export function fetchParentSamples(input) {
    return function (dispatch, getState) {
        dispatch(initRequest(true));
        return rsapi().post('bgsiecatalogue/getParentSamples', { ...input })
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
                
                //#SECURITY-VULNERABILITY-MERGING-START
                //if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
				 if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
				//#SECURITY-VULNERABILITY-MERGING-END
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