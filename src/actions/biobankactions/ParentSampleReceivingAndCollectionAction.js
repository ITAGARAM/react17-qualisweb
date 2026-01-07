import rsapi from "../../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../LoginTypes';
import { constructOptionList, sortData, replaceUpdatedObject, filterRecordBasedOnTwoArrays, rearrangeDateFormat } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './../LoginAction';
import { intl } from '../../components/App';
import { transactionStatus } from '../../components/Enumeration';


export function getBioSampleReceiving(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getActiveBioParentSampleReceiving", {
            'userinfo': inputParam.userinfo,
            'nbioparentsamplecode': inputParam.nbioparentsamplecode || '-1'
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.masterData, ...response.data };
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
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getEditBioParentData(inputParam) {
    return function (dispatch) {
        let urlArray = [];
        const ActiveSample = rsapi().post("bioparentsamplereceiving/getActiveBioParentSampleReceiving", {
            'userinfo': inputParam.userinfo,
            'nbioparentsamplecode': inputParam.nbioparentsamplecode || '-1'
        });
        const StorageStructure = rsapi().post("bioparentsamplereceiving/getStorageStructureBasedonSite", {
            "userinfo": inputParam.userinfo
        });
        const CollectionSite = rsapi().post("bioparentsamplereceiving/getCollectionSiteBasedonProject", {
            'userinfo': inputParam.userinfo, 'nbioprojectcode': inputParam.nbioprojectcode
        });
         const CollectionHospital = rsapi().post("bioparentsamplereceiving/getHospitalBasedonSite", {
            'userinfo': inputParam.userinfo, 'ncollectionsitecode': inputParam.masterData.selectedBioParentSampleReceiving.ncollectionsitecode
        });

        urlArray = [ActiveSample, StorageStructure, CollectionSite,CollectionHospital]
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let masterDataValues = {};
                masterDataValues = { ...inputParam.masterData, ...response[0].data };
                sortData(masterDataValues);
                const collectionsiteMap = constructOptionList(response[2].data['lstSite'] || [], "nsitecode",
                    "ssitename", undefined, undefined, false);
                const collectionsiteList = collectionsiteMap.get("OptionList");
                const storagestructureMap = constructOptionList(response[1].data['lstStorageStructure'] || [], "nstorageinstrumentcode",
                    "sinstrumentid", undefined, undefined, false);
                const storagestructureList = storagestructureMap.get("OptionList");
                const collectedHospitalMap = constructOptionList(response[3].data['lstHospital'] || [], "nhospitalcode",
                    "shospitalname", undefined, undefined, false);
                const collectedHospitalList = collectedHospitalMap.get("OptionList");

                const parentCode = Number(response?.[0]?.data?.selectedBioParentSampleReceiving?.nstorageinstrumentcode);

                let selectedRecord = {
                    "ndiseasecode": {
                        label: response[0].data.selectedBioParentSampleReceiving.sdiseasename,
                        value: response[0].data.selectedBioParentSampleReceiving.ndiseasecode,
                    },
                    "ssubjectid": response[0].data.selectedBioParentSampleReceiving.ssubjectid,
                    "scasetype": response[0].data.selectedBioParentSampleReceiving.scasetype,
                    "nisthirdpartysharable": response[0].data.selectedBioParentSampleReceiving.nisthirdpartysharable, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                    "nissampleaccesable": response[0].data.selectedBioParentSampleReceiving.nissampleaccesable, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                    "nbioprojectcode": {
                        label: response[0].data.selectedBioParentSampleReceiving.sprojecttitle,
                        value: response[0].data.selectedBioParentSampleReceiving.nbioprojectcode,
                        item: {
                            sprojecttitle: response[0].data.selectedBioParentSampleReceiving.sprojecttitle,
                            sprojectcode: response[0].data.selectedBioParentSampleReceiving.sprojectcode,
                            suserName: response[0].data.selectedBioParentSampleReceiving.sprojectincharge
                        }
                    },
                    "ncollectionsitecode": {
                        label: response[0].data.selectedBioParentSampleReceiving.scollectionsitename,
                        value: response[0].data.selectedBioParentSampleReceiving.ncollectionsitecode,
                    },
                    "nhospitalcode": {
                        label: response[0].data.selectedBioParentSampleReceiving.shospitalname,
                        value: response[0].data.selectedBioParentSampleReceiving.ncollectedhospitalcode,
                    },
                    "nstoragelocationcode": {
                       // label: response[0].data.selectedBioParentSampleReceiving.sinstrumentid,
                        label: response?.[1]?.data?.lstStorageStructure?.find(  s => Number(s?.nstorageinstrumentcode) === parentCode)?.sinstrumentid ?? null,
                        value: response[0].data.selectedBioParentSampleReceiving.nstorageinstrumentcode,
                        item: {
                            sstoragetemperature: response[0].data.selectedBioParentSampleReceiving.sstoragetemperature,
                        }
                    },
                    "darrivaldatetime": new Date(response[0].data.selectedBioParentSampleReceiving.darrivaldate),

                };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        loading: false,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode,
                        collectionsiteList,
                        storagestructureList,
                        collectedHospitalList,
                        addParentModal: true,
                        selectedRecord: selectedRecord,
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

export function getListBioParentSampleReceiving(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getBioParentSampleReceiving", {
            ...inputParam.inputData
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.masterData, ...response.data };
                if (inputParam.searchRef !== undefined && inputParam.searchRef.current !== null) {
                    inputParam.searchRef.current.value = "";
                    masterData['searchedData'] = undefined
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        skip: 0,
                        take: inputParam.take,
                        dataState: inputParam.dataState
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

export function getDiseaseforAddParent(inputParam) {
    return function (dispatch) {
        let urlArray = [];
        const Disease = rsapi().post("bioparentsamplereceiving/getDiseaseforLoggedInSite", {
            "userinfo": inputParam.userinfo
        });
        const StorageStructure = rsapi().post("bioparentsamplereceiving/getStorageStructureBasedonSite", {
            "userinfo": inputParam.userinfo
        });
        //Added by ATE-234 Janakumar BGSI-13 --Start
        const timeZone = rsapi().post("timezone/getLocalTimeByZone", {
            "userinfo": inputParam.userinfo
        });
        urlArray = [Disease, StorageStructure, timeZone]
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const diseaseMap = constructOptionList(response[0].data['lstDisease'] || [], "ndiseasecode",
                    "sdiseasename", undefined, undefined, false);
                const diseaseList = diseaseMap.get("OptionList");
                const storagestructureMap = constructOptionList(response[1].data['lstStorageStructure'] || [], "nstorageinstrumentcode",
                    "sinstrumentid", undefined, undefined, false);
                const storagestructureList = storagestructureMap.get("OptionList");

                const currentDataAndTime = response?.[2]?.data ?? null;
                const date = rearrangeDateFormat(inputParam.userinfo, currentDataAndTime);
                const selectedRecord = { "darrivaldatetime": date }
                //Added by ATE-234 Janakumar BGSI-13 --End
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        diseaseList, storagestructureList,
                        loading: false,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolcode: inputParam.ncontrolcode,
                        addParentModal: true,
                        selectedRecord: selectedRecord,
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

export function getBioProjectforLoggedInSite(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getBioProjectforLoggedInSite", {
            'userinfo': inputParam.userinfo, 'ndiseasecode': inputParam.ndiseasecode
        })
            .then(response => {
                const bioprojectMap = constructOptionList(response.data['lstBioProject'] || [], "nbioprojectcode",
                    "sprojecttitle", undefined, undefined, false);
                const bioprojectList = bioprojectMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        bioprojectList,
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
export function getCollectionSiteBasedonProject(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getCollectionSiteBasedonProject", {
            'userinfo': inputParam.userinfo, 'nbioprojectcode': inputParam.nbioprojectcode
        })
            .then(response => {
                const collectionsiteMap = constructOptionList(response.data['lstSite'] || [], "nsitecode",
                    "ssitename", undefined, undefined, false);
                const collectionsiteList = collectionsiteMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        collectionsiteList,
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

export function getHospitalBasedonSite(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getHospitalBasedonSite", {
            'userinfo': inputParam.userinfo, 'ncollectionsitecode': inputParam.ncollectionsitecode
        })
            .then(response => {
                const collectedHospitalMap = constructOptionList(response.data['lstHospital'] || [], "nhospitalcode",
                    "shospitalname", undefined, undefined, false);
                const collectedHospitalList = collectedHospitalMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        collectedHospitalList,
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

export function onValidateSubjectId(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/validateSubjectID", {
            'userinfo': inputParam.userinfo, 'ssubjectid': inputParam.ssubjectid
        })
            .then(response => {
                const isValidSubjectID = response.data['isValidSubjectID'] || false;
                const scasetype = response.data['scasetype'];
                const nisthirdpartysharable = response.data['nisthirdpartysharable']; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                const nissampleaccesable = response.data['nissampleaccesable']; // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        isValidSubjectID, scasetype,
                        nisthirdpartysharable, nissampleaccesable, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
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
export function createBioParentSampleReceiving(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/createBioParentSampleReceiving", inputParam.inputData)
            .then(response => {
                let masterDataValues = {};
                masterDataValues = { ...inputParam.masterData, ...response.data };
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        diseaseList: [],
                        bioprojectList: [],
                        collectionsiteList: [],
                        collectedHospitalList: [],
                        storagestructureList: [],
                        loading: false,
                        addParentModal: false,
                        isValidSubjectID: false,
                        nisthirdpartysharable: null, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                        nissampleaccesable: null, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                        scasetype: "",
                        selectedRecord: {},
                        skip: 0,
                        take: inputParam.take
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
export function updateBioParentSampleReceiving(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/updateBioParentSampleReceiving", inputParam.inputData)
            .then(response => {
                let masterDataValues = {};
                masterDataValues = {
                    ...inputParam.masterData,
                    ...response.data,
                    lstBioParentSampleReceiving: replaceUpdatedObject([response.data["selectedBioParentSampleReceiving"]], inputParam.masterData.lstBioParentSampleReceiving, "nbioparentsamplecode"),
                    searchedData: replaceUpdatedObject([response.data["selectedBioParentSampleReceiving"]], inputParam.masterData.searchedData, "nbioparentsamplecode"),
                };
                sortData(masterDataValues);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues,
                        diseaseList: [],
                        bioprojectList: [],
                        collectionsiteList: [],
                        collectedHospitalList: [],
                        storagestructureList: [],
                        loading: false,
                        addParentModal: false,
                        isValidSubjectID: false,
                        nisthirdpartysharable: null, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216
                        nissampleaccesable: null, // Added by Gowtham on nov 14 2025 for jira.id:BGSI-216s
                        scasetype: "",
                        selectedRecord: {},
                        openModal: false,
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
                }
                else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false } })
                    toast.warn(error.response.data);
                }

            })
    }
}

export function getBioSampleReceivingData(nbioparentsamplecode, userInfo, masterData, operation, screenName, ncontrolcode) {
    return function (dispatch) {
        
 //changed input data to storagecondition master by sathish -> 06-AUG-2025
        let urlArray = [];
        const ActiveByID = rsapi().post("bioparentsamplereceiving/getActiveBioParentSampleReceiving",
                    {
                       'userinfo': userInfo,
                        'nbioparentsamplecode': nbioparentsamplecode || -1
                    });
        const timeZone = rsapi().post("timezone/getLocalTimeByZone", {
                    "userinfo": userInfo
                });
                

        urlArray = [ActiveByID,timeZone];
     
        //  rsapi().post("bioparentsamplereceiving/getActiveBioParentSampleReceiving", {
        //     'userinfo': userInfo,
        //     'nbioparentsamplecode': nbioparentsamplecode || -1
        // })
        dispatch(initRequest(true));
        Axios.all(urlArray).then(response => {
            // Added if condition by Gowtham on nov 14 2025 for jira.id:BGSI-216
            if(response[0].data?.selectedBioParentSampleReceiving?.nissampleaccesable !== transactionStatus.YES) {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                toast.warn(intl.formatMessage({ id: "IDS_SAMPLEISNOTACCESSIBLE" }));
            } else {
                let masterDataValues = {};
                const recipientsListData = constructOptionList(response[0].data['recipientsList'] || [], "nrecipientusercode",
                    "srecipientusername", "nrecipientusercode", undefined, false);
                const recipientsList = recipientsListData.get("OptionList");
                const sampleTypeListData = constructOptionList(response[0].data['sampleTypeList'] || [], "nproductcatcode",
                    "sproductcatname", "nproductcatcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                 //changed input data to storagecondition master by sathish -> 06-AUG-2025
                const storageConditionListData = constructOptionList(response[0].data['storageConditionList'] || [], "nstorageconditioncode",
                    "sstorageconditionname", "nstorageconditioncode", undefined, false);
                const storageConditionListDetails = storageConditionListData.get("OptionList");
                masterDataValues = { ...masterData, ...response[0].data, 'recipientsList': recipientsList, 'sampleTypeList': sampleTypeList,'storageConditionListDetails':storageConditionListDetails };
                 //changed input data to storagecondition master by sathish -> 06-AUG-2025
                 const currentDataAndTime = response?.[1]?.data ?? null;
                 const date = rearrangeDateFormat(userInfo, currentDataAndTime);
                let selectedChildRecord = { "nnoofsamples": 0,"dbiobankarrivaldate": date};

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: masterDataValues, loading: false, openModal: true, loadParentSampleCollection: true,
                        loadEsign: false, operation, screenName, selectedChildRecord, ncontrolcode
                    }
                });
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

export function saveParentSampleCollection(inputParam, masterData, modalName) {
    return function (dispatch) {
        //dispatch(initRequest(true));
        //let requestUrl = '';
       // requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        
         //changed input data to storagecondition master by sathish -> 06-AUG-2025
        const ActiveByID = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });    
        
        let urlArray = [];
        if (inputParam.saveType === 1) {
            urlArray = [ActiveByID];
        } else {
            const timeZone = rsapi().post("timezone/getLocalTimeByZone", { "userinfo": inputParam.inputData['userinfo'] });
            urlArray = [ActiveByID, timeZone];
        }
        
        //return requestUrl
          dispatch(initRequest(true));
          Axios.all(urlArray).then(response => {
                let openModal = false;
                const retrievedData = sortData(response[0].data);
                let selectedChildRecord = inputParam.selectedRecord;
                let sampleTypeFilteredList = [];
                let productCatCode = [];
                let loadParentSampleCollection = true;
                productCatCode.push(selectedChildRecord.nproductcatcode);
                masterData = {
                    ...masterData,
                    ...retrievedData
                }
                if (inputParam.saveType === 1) {
                    selectedChildRecord = {};
                    openModal = false;
                    loadParentSampleCollection = false;
                } else {

                    //changed input data to storagecondition master by sathish -> 06-AUG-2025
                  const currentDataAndTime = response?.[1]?.data ?? null;
                  const date = rearrangeDateFormat(inputParam.inputData['userinfo'], currentDataAndTime);
                  let selectedChildRecord1 = { "nnoofsamples": 0,"dbiobankarrivaldate": date};

                    sampleTypeFilteredList = filterRecordBasedOnTwoArrays(masterData.sampleTypeList, productCatCode, 'value');
                    masterData["sampleTypeList"] = sampleTypeFilteredList;
                    //selectedChildRecord["dbiobankarrivaldate"] = selectedChildRecord.dbiobankarrivaldate;
                    selectedChildRecord1["dtemporarystoragedate"] = "";
                    selectedChildRecord1["nnoofsamples"] = 1;
                    selectedChildRecord1["nproductcatcode"] = "";
                    //changed input data to storagecondition master by sathish -> 06-AUG-2025
                    //selectedChildRecord["ntemperature"] = "";
                    selectedChildRecord1["scollectorname"] = "";
                    selectedChildRecord1["sinformation"] = "";
                    selectedChildRecord1["ssendername"] = "";
                    selectedChildRecord1["stemporarystoragename"] = "";
                    selectedChildRecord = {...selectedChildRecord,...selectedChildRecord1}
                    openModal = true;
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loadEsign: false, selectedId: inputParam.selectedId, loading: false,
                        masterData, [modalName]: openModal, selectedChildRecord, loadParentSampleCollection
                    }
                })

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
                }
                else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, loadEsign: false } })
                    toast.warn(error.response.data);
                }
            })
    }
}

export function deleteParentSampleCollection(inputParam, masterData) {
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
                        loadEsign: false, loading: false, openModal: false,
                        masterData: masterDataValue
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

export function getParentSampleCollection(fetchRecord) {
    return function (dispatch) {
        if (fetchRecord.editRow.ntransactionstatus !== transactionStatus.UNPROCESSED) {
            return toast.warn(intl.formatMessage({ id: "IDS_SELETNOTYETPROCESSEDSTATUSRECORD" }));
        }

        let urlArray = [];
        let selectedId = null;
        const ActiveByID = rsapi().post("/bioparentsamplereceiving/getActiveBioParentSampleCollection",
            {
                "nbioparentsamplecollectioncode": fetchRecord.editRow.nbioparentsamplecollectioncode,
                "userinfo": fetchRecord.userInfo
            });

        const timeZone = rsapi().post("timezone/getLocalTimeByZone", {
            "userinfo": fetchRecord.userInfo
        });

        urlArray = [ActiveByID,timeZone];
        selectedId = fetchRecord.editRow.nbioparentsamplecollectioncode;

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedChildRecord = {};
                let masterData = fetchRecord.masterData;
                const recipientsListData = constructOptionList(response[0].data['recipientsList'] || [], "nrecipientusercode",
                    "srecipientusername", "nrecipientusercode", undefined, false);
                const recipientsList = recipientsListData.get("OptionList");
                const sampleTypeListData = constructOptionList(response[0].data['sampleTypeList'] || [], "nproductcatcode",
                    "sproductcatname", "nproductcatcode", undefined, false);
                const sampleTypeList = sampleTypeListData.get("OptionList");
                 //changed input data to storagecondition master by sathish -> 06-AUG-2025
                const storageConditionListData = constructOptionList(response[0].data['storageConditionList'] || [], "nstorageconditioncode",
                    "sstorageconditionname", "nstorageconditioncode", undefined, false);
                const storageConditionListDetails = storageConditionListData.get("OptionList");
                const currentDataAndTime = response?.[1]?.data ?? null;
                const date = rearrangeDateFormat(fetchRecord.userInfo, currentDataAndTime);
                // selectedChildRecord = { "dbiobankarrivaldate": date }


                selectedChildRecord = {
                    "nproductcatcode": {
                        label: response[0].data.selectedBioParentSampleCollection.sproductcatname,
                        value: response[0].data.selectedBioParentSampleCollection.nproductcatcode,
                        item: response[0].data.selectedBioParentSampleCollection
                    },
                    "nstorageconditioncode": {
                        label: response[0].data.selectedBioParentSampleCollection.sstorageconditionname,
                        value: response[0].data.selectedBioParentSampleCollection.nstorageconditioncode,
                        item: response[0].data.selectedBioParentSampleCollection
                    },
                    "nnoofsamples": response[0].data.selectedBioParentSampleCollection.nnoofsamples,
                    "dsamplecollectiondate": new Date(response[0].data.selectedBioParentSampleCollection.dsamplecollectiondate),
                    "scollectorname": response[0].data.selectedBioParentSampleCollection.scollectorname,
                    "dtemporarystoragedate": response[0].data.selectedBioParentSampleCollection.dtemporarystoragedate != null && new Date(response[0].data.selectedBioParentSampleCollection.dtemporarystoragedate) || "",
                    //"nstorageconditioncode": response[0].data.selectedBioParentSampleCollection.nstorageconditioncode,
                    "stemporarystoragename": response[0].data.selectedBioParentSampleCollection.stemporarystoragename,
                    "dbiobankarrivaldate": new Date(response[0].data.selectedBioParentSampleCollection.dbiobankarrivaldate),
                    "ssendername": response[0].data.selectedBioParentSampleCollection.ssendername,
                    "nrecipientusercode": {
                        label: response[0].data.selectedBioParentSampleCollection.srecipientusername,
                        value: response[0].data.selectedBioParentSampleCollection.nrecipientusercode,
                        item: response[0].data.selectedBioParentSampleCollection
                    },
                    "sinformation": response[0].data.selectedBioParentSampleCollection.sinformation
                };

                masterData = { ...masterData, 'recipientsList': recipientsList, 'sampleTypeList': sampleTypeList, 'storageConditionListDetails' : storageConditionListDetails };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        openModal: true, operation: fetchRecord.operation,
                        selectedChildRecord, masterData, ncontrolcode: fetchRecord.ncontrolCode,
                        screenName: fetchRecord.screenName, loading: false, selectedId, loadParentSampleCollection: true
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

export function validateEsignCredentialParentSampleReceiving(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    let { selectedRecord } = inputParam["screenData"];
                    delete selectedRecord.esignpassword;
                    delete selectedRecord.esigncomments;
                    delete selectedRecord.esignreason;
                    delete selectedRecord.agree;
                    delete inputParam.inputData.password;
                    if (inputParam["screenData"].modalOperation === "updateParent") {
                        dispatch(updateBioParentSampleReceiving(inputParam["screenData"].inputParam));
                    }
                    if (inputParam["screenData"].modalOperation === "updateChild") {
                        dispatch(saveParentSampleCollection(inputParam["screenData"].inputParam, inputParam["screenData"].masterData, "openModal"))
                    }
                    if (inputParam["screenData"].modalOperation === "deleteChild") {
                        dispatch(deleteParentSampleCollection(inputParam["screenData"].inputParam, inputParam["screenData"].masterData))
                    }
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    };
}

export function getParentSampleReceivingAndCollection(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bioparentsamplereceiving/getBioParentSampleReceiving", { ...inputData.inputData })
            .then(response => {
                sortData(response.data);
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
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