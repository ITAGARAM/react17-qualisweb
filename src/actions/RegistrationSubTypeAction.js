import Axios from "axios";
import { toast } from "react-toastify";
import { constructOptionList, sortData } from "../components/CommonScript";
import { transactionStatus } from "../components/Enumeration";
import rsapi from "../rsapi"
import { initRequest } from "./LoginAction"
import { intl } from '../components/App';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";

export function getSeqNoFormats(inputObj,selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let URL = [rsapi().post('/registrationsubtype/getAllSeqNoFormats', { userinfo: inputObj.userInfo })]

        URL.push(rsapi().post('/registrationsubtype/getPeriods', { userinfo: inputObj.userInfo }))
        URL.push(rsapi().post('/registrationsubtype/getSiteWiseAllSeqNoFormats', { userinfo: inputObj.userInfo }))
        URL.push(rsapi().post('/registrationsubtype/getSiteWiseAllSeqNoFormatsRelease', { userinfo: inputObj.userInfo }))
        URL.push(rsapi().post('/registrationsubtype/getAllSeqNoFormatsByRelease', { userinfo: inputObj.userInfo }))

        Axios.all(URL)
            .then(response => {
                let periodMap = constructOptionList(response[1].data || [], 'nperiodcode', 'speriodname');
                let periodList = periodMap.get("OptionList")
                const periodDefault = periodMap.get("DefaultValue");

                if (periodDefault !== undefined) {
                    selectedRecord = {
                        "nperiodcode": {
                            "value": periodDefault.value,
                            "label": periodDefault.label
                        },
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        existingFormats: response[0].data,
                        sitewiseexistingFormats: response[2].data,
                        sitewiseexistingFormatsRelease: response[3].data,
                        sreleaseexistingFormats: response[4].data,
                        periodList,
                        selectedRecord,
                        openChildModal: true,
                        loading: false,
                        operation: 'create',
                        screenName: "Version",
                        ncontrolcode:inputObj.ncontrolcode
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
export function getRegistrationSubTypeOnReload(userInfo,searchRef) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('registrationsubtype/getRegistrationSubType', { userinfo: userInfo })
            .then(res => {
                let masterData = {
                    ...res.data
                }
                if (searchRef !== undefined && searchRef.current !== null) {
                    searchRef.current.value = "";
                    //masterData['searchedData'] = undefined
                }
                sortData(masterData)
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                        reloadData: true
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN, payload: { loading: false }
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
        } else if (error.response.status === 500)
                    toast.error(error.message);
                else
                    toast.warn(error.response.data)
            })
    }
}
export function getRegistrationSubTypeMaster(selectedSampleType, selectedRegType, masterData, userInfo,searchRef,isFilterSubmit) {
    return function (dispatch) {
        if(selectedRegType.value === undefined){
            toast.warn(intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
        else{
            dispatch(initRequest(true));
            rsapi().post('registrationsubtype/getRegistrationSubTypeMaster', { nregtypecode: selectedRegType.value, userinfo: userInfo })
                .then(response => {
                    masterData = {
                        ...masterData,
                        ...response.data
                    }
                    //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
            if(isFilterSubmit!=='isFilterSubmit'){
                selectedSampleType=undefined;
                selectedRegType=undefined;
            }
                    if (searchRef !== undefined && searchRef.current !== null) {
                        searchRef.current.value = "";
                        masterData['searchedData'] = undefined
                    }
                    sortData(masterData);
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            realSampleType: selectedSampleType,
                            realRegtype: selectedRegType,
                            loading: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN, payload: { loading: false }
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
                    } else if (error.response.status === 500)
                        toast.error(error.message);
                    else
                        toast.warn(error.response.data)
                })
        }
    }
}
export function selectRegistrationSubType(selectedRegSubType, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('/registrationsubtype/getRegistrationSubTypeById', { nregsubtypecode: selectedRegSubType.nregsubtypecode, userinfo: userInfo })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    selectedRegistrationSubType: selectedRegSubType
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                })
            })
            .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN, payload: { loading: false }
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
                    } else if (error.response.status === 500)
                        toast.error(error.message);
                    else
                        toast.warn(error.response.data)
                })
    }
}
export function getEditRegSubType(nregsubtypecode, userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('/registrationsubtype/getEditRegSubType', { nregsubtypecode, userinfo: userInfo })
            .then(response => {
                let selectedRecord = {
                    nregsubtypecode: response.data.nregsubtypecode,
                    nregtypecode: response.data.nregtypecode,
                    ...response.data.jsondata
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        loading: false,
                        openModal: true,
                        screenName: "IDS_REGISTRATIONSUBTYPE",
                        ncontrolcode,
                        operation: "update"
                    }
                })
            })
            .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN, payload: { loading: false }
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
                    } else if (error.response.status === 500)
                        toast.error(error.message);
                    else
                        toast.warn(error.response.data)
                })
    }
}
export function getRegSubTypeDetails(inputObj) {
    let { version, masterData, userInfo } = inputObj;
    return function (dispatch) {
        if (!(masterData.selectedVersion.nregsubtypeversioncode === version.nregsubtypeversioncode)) {
            dispatch(initRequest(true));
            rsapi().post('registrationsubtype/getVersionDetails', { userinfo: userInfo, nregsubtypeversioncode: version.nregsubtypeversioncode })
                .then(res => {
                    masterData = {
                        ...masterData,
                        selectedVersion: res.data
                    }
                    sortData(masterData);
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
}
export function getVersionById(primaryKey, userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let URL = []
        URL.push(rsapi().post('/registrationsubtype/getAllSeqNoFormats', { userinfo: userInfo }))
        URL.push(rsapi().post('/registrationsubtype/getPeriods', { userinfo: userInfo }))
        URL.push(rsapi().post('registrationsubtype/getVersionDetails', { userinfo: userInfo, nregsubtypeversioncode: primaryKey }))
        Axios.all(URL)
            .then(res => {
                if (res[2].data.ntransactionstatus === transactionStatus.DRAFT) {
                    let periodList = constructOptionList(res[1].data || [], 'nperiodcode', 'speriodname').get("OptionList")
                    let nperiodcode = periodList.filter(period => period.value === res[2].data.nperiodcode)
                    let selectedRecord = {}
                    selectedRecord = {
                        ...res[2].data.jsondata,
                        nperiodcode:nperiodcode[0],
                        nregsubtypeversioncode: primaryKey
                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            existingFormats: res[0].data,
                            periodList,
                            selectedRecord,
                            openChildModal: true,
                            operation: 'update',
                            ncontrolcode,
                            loading: false,
                            screenName:"Version"
                        }
                    });
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, masterStatus: "IDS_SELECTDRAFTRECORD" } });

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
export function getRegistrationTypeBySampleType(comboData, masterData, userInfo, realRegtype) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post('registrationtype/getRegistrationTypeBySampleType', { nsampletypecode: comboData.value, userinfo: userInfo })
            .then(res => {
                masterData = {
                    ...masterData,
                    RegistrationTypes: res.data
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedSampleType: comboData,
                        realRegtype,
                        loading: false,
                        reloadData: false
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

export function getVersionByReleaseNo(primaryKey, userInfo, ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let URL = []
        URL.push(rsapi().post('/registrationsubtype/getAllSeqNoFormatsByRelease', { userinfo: userInfo }))
        URL.push(rsapi().post('/registrationsubtype/getPeriods', { userinfo: userInfo }))
        URL.push(rsapi().post('registrationsubtype/getVersionDetailsByRelease', { userinfo: userInfo, nregsubtypeversioncode: primaryKey }))
        Axios.all(URL)
            .then(res => {
                if (res[2].data.ntransactionstatus === transactionStatus.DRAFT) {
                    let periodList = constructOptionList(res[1].data || [], 'nperiodcode', 'speriodname').get("OptionList")
                    let nperiodcode = periodList.filter(period => period.value === res[2].data.nperiodcode)
                    let selectedRecord = {}
                    selectedRecord = {
                        ...res[2].data.jsondata,
                        nperiodcode:nperiodcode[0],
                        nregsubtypeversionreleasecode: res[2].data.nregsubtypeversionreleasecode

                    }

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            sreleaseexistingFormats: res[0].data,
                            periodList,
                            selectedRecord,
                            openChildModal: true,
                            operation: 'update',
                            ncontrolcode,
                            loading: false,
                            screenName:"IDS_RELEASEARNO"
                        }
                    });
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, masterStatus: "IDS_SELECTDRAFTRECORD" } });

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