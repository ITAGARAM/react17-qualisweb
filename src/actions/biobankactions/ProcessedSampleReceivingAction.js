import rsapi from "../../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../LoginTypes';
import { constructOptionList, sortData, replaceUpdatedObject } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './../LoginAction';
import { intl } from '../../components/App';
import { transactionStatus } from '../../components/Enumeration';

export function getProcessedSampleByFilterSubmit(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("processedsamplereceiving/getProcessedSampleByFilterSubmit", { ...inputData.inputData })
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
                        // dataState: inputData.dataState,
                        operation: "view",
                        sampleState: { skip: 0, take: undefined },
                        ...respObject,
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function getActiveSampleCollection(inputParam, viewModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/getActiveSampleCollection", {
            'userinfo': inputParam.userinfo,
            'nbioparentsamplecollectioncode': inputParam.nbioparentsamplecollectioncode || -1
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
                        skip: inputParam.skip, operation: "view",
                        sampleState: { skip: 0, take: undefined },
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

export function createProcessedSampleReceiving(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/createProcessedSampleReceiving", { ...inputParam.inputData })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                let addBioSampleModal = false
                let selectedChildRecord = {
                    ddateReceived: new Date(),
                }
                if (saveType == 2) {
                    addBioSampleModal = true;
                    selectedChildRecord["ddateReceived"] = inputParam.selectedRecord.ddateReceived;
                    selectedChildRecord["ndiagnostictypecode"] = inputParam.selectedRecord.ndiagnostictypecode;
                    selectedChildRecord["ncontainertypecode"] = inputParam.selectedRecord.ncontainertypecode;
                    selectedChildRecord["nproductcode"] = inputParam.selectedRecord.nproductcode;
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        addBioSampleModal: addBioSampleModal,
                        aliquotList: [],
                        selectedChildRecord: selectedChildRecord,
                        shouldRender: true,
                        skip: inputParam.skip,
                        operation: "create",
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

export function getParentSampleCollectionDataForAdd(nbioparentsamplecollectioncode, userInfo, masterData, operation, screenName, ncontrolcode, skip) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/getParentSampleCollectionDataForAdd", {
            'userinfo': userInfo,
            'nbioparentsamplecollectioncode': nbioparentsamplecollectioncode || -1
        })
            .then(response => {
                let masterDataValues = {};
                const containerTypeListData = constructOptionList(response.data['lstContainerType'] || [], "ncontainertypecode",
                    "scontainertype", "ncontainertypecode", undefined, false);
                const sampleTypeListData = constructOptionList(response.data['lstProduct'] || [], "nproductcode",
                    "sproductname", "nproductcode", undefined, false);
                const diagnosticTypeListData = constructOptionList(response.data['lstDiagnosticType'] || [], "ndiagnostictypecode",
                    "sdiagnostictypename", "ndiagnostictypecode", undefined, false);
                const storageTypeListData = constructOptionList(response.data['lstStorageType'] || [], "nstoragetypecode",
                    "sstoragetypename", "nstoragetypecode", undefined, false);
                const containerTypeList = containerTypeListData.get("OptionList");
                const sampleTypeList = sampleTypeListData.get("OptionList");
                const diagnosticTypeList = diagnosticTypeListData.get("OptionList");
                const storageTypeList = storageTypeListData.get("OptionList");

                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'containerTypeList': containerTypeList,
                    'sampleTypeList': sampleTypeList,
                    'diagnosticTypeList': diagnosticTypeList,
                    'storageTypeList': storageTypeList,
                };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues, loading: false, addBioSampleModal: true,
                        loadEsign: false, operation, screenName, ncontrolcode, skip: skip, shouldRender: false
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

export function deleteProcessedSampleReceiving(inputParam, masterData) {
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
                        loadEsign: false, loading: false, selectedRecord:{},
                        masterData: masterDataValue, skip: inputParam.skip, operation: inputParam.operation
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
export function updateBioSampleCollectionAsProcessed(nbioparentsamplecollectioncode, masterDataValues, userinfo, skip) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/updateBioSampleCollectionAsProcessed",
            {
                'userinfo': userinfo,
                'nbioparentsamplecollectioncode': nbioparentsamplecollectioncode || -1
            })
            .then(response => {
                let masterDataUpdated = {
                    ...masterDataValues,
                    ...response.data,
                    lstBioParentSampleCollection: replaceUpdatedObject([response.data["selectedBioParentSampleCollection"]], masterDataValues.lstBioParentSampleCollection, "nbioparentsamplecollectioncode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioParentSampleCollection"]], masterDataValues.searchedData, "nbioparentsamplecollectioncode"),
                };
                sortData(masterDataUpdated);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataUpdated,
                        loading: false,
                        aliquotList: [],
                        selectedChildRecord: {},
                        skip: skip,
                        operation: "update",
                        loadEsign: false
                    }
                });

            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    toast.error(error.message);
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false } })
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getStorageDataForAdd(nbioparentsamplecollectioncode, nstorageinstrumentcode, userInfo, masterData, operation, screenName, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/getStorageFreezerData", {
            'userinfo': userInfo,
            'nstorageinstrumentcode': nstorageinstrumentcode || -1,
            'nbioparentsamplecollectioncode': nbioparentsamplecollectioncode || -1
        })
            .then(response => {
                let masterDataValues = {};
                //changed input data to storagecondition master by sathish -> 06-AUG-2025
                const freezerListData = constructOptionList(response.data['freezerList'] || [], "nstorageinstrumentcode",
                    "sinstrumentid", "nstorageinstrumentcode", undefined, false);
                const freezerDatas = freezerListData.get("OptionList");


                const selectedFreezerRecord = {

                    "nstorageinstrumentcode": {
                        label: response.data.selectedFreezerData.sinstrumentid,
                        value: response.data.selectedFreezerData.nstorageinstrumentcode,
                        item: response.data.selectedFreezerData
                    },
                    "selectedSuggestedStorage": response.data.selectedSuggestedStorage
                }
                masterDataValues = {
                    ...masterData,
                    ...response.data,
                    'freezerList': freezerDatas
                };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues, loading: false, selectedFreezerRecord, initialSelectedFreezerRecord: { ...selectedFreezerRecord },
                        storageModal: true, loadEsign: false, operation, screenName, ncontrolcode, shouldRender: false
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
export function storeProcessedSampleReceiving(inputParam, masterData, saveType) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("processedsamplereceiving/storeProcessedSampleReceiving", { ...inputParam.inputData })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        storageModal: false,
                        sampleState: inputParam.sampleState,
                        selectedRecord:{},
                        shouldRender: true,
                        skip: inputParam.skip,
                        operation: "store",
                        loadEsign: false
                    }
                });

            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                    toast.error(error.message);
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false } })
                    toast.warn(error.response.data);
                }
            })
    }
}

export function validateEsignCredentialProcessedSampleReceiving(inputParam) {
    return (dispatch) => {
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
                    if (inputParam["screenData"].modalOperation === "processParent") {
                        dispatch(updateBioSampleCollectionAsProcessed(inputParam["screenData"].inputParam.inputData.nbioparentsamplecollectioncode, inputParam["screenData"].masterData, inputParam["screenData"].inputParam.inputData.userinfo, inputParam["screenData"].inputParam.inputData.skip));
                    }
                    if (inputParam["screenData"].modalOperation === "storeChild") {
                        dispatch(storeProcessedSampleReceiving(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    }
                    if (inputParam["screenData"].modalOperation === "deleteChild") {
                        dispatch(deleteProcessedSampleReceiving(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    }
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: {  loading: false }})
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
    };
}