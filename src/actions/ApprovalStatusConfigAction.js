import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

import {
    constructOptionList
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';



export function getComboService(addParam) {
    return function (dispatch) {
        const nsampletypecode = addParam.nsampletypecode;
        const nregtypecode = addParam.nregtypecode;
        const nregsubtypecode = addParam.nregsubtypecode;

        const nformcode = addParam.nformcode;
        let isValid = true;
        if (nsampletypecode !== 4) {
            if ((nsampletypecode != -1) && (nregtypecode != -1) && (nregsubtypecode != -1) && (nregsubtypecode !== undefined) && nformcode != -1) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }
        if (nsampletypecode === 4) {
            if ((nsampletypecode != -1) && (nformcode != -1)) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }


        if (isValid) {
            let urlArray = [];

            const service1 = rsapi().post("/approvalstatusconfig/getStatusFunction", { userinfo: addParam.userInfo, nformcode: addParam.nformcode });

            const service2 = rsapi().post("approvalstatusconfig/getTransactionStatus", { userinfo: addParam.userInfo });

            urlArray = [service1, service2]

            dispatch(initRequest(true));

            Axios.all(urlArray).then(response => {


                let selectedId = null;
                const statusFunctionMap = constructOptionList(response[0].data || [], "nstatusfunctioncode",
                    "sapprovalstatusfunctions", undefined, undefined, true);
                const statusFunctionList = statusFunctionMap.get("OptionList");

                selectedId = addParam.primaryKeyField;

                const transactionsList = response[1].data;

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        statusFunctionList,
                        transactionsList,
                        operation: addParam.operation, screenName: addParam.screenName, selectedRecord: {},
                        openModal: true,
                        ncontrolCode: addParam.ncontrolCode,
                        loading: false, selectedId
                    }
                });
            })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
        } else if (error.response.status === 500) {
                        toast.error(error.message);
                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
        else {

            toast.warn(intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

}


export function getApprovalSubType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approvalstatusconfig/getApprovalSubType", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data, defaultForms: inputParam.inputData.defaultForms }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getRegTypeBySampleType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("approvalstatusconfig/getRegTypeBySampleType", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data, defaultSample: inputParam.inputData.defaultSample }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false,
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getRegSubTypeByRegtype(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("approvalstatusconfig/getRegSubTypeByRegtype", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data, defaultRegType: inputParam.inputData.defaultRegType }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
        } else if (error.response.status === 500) {
                    toast.warn(error.response.data);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}




export function getTransactionForms(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("approvalstatusconfig/getTransactionForms", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data, defaultRegSubType: inputParam.inputData.defaultRegSubType }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
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
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getFilterSubmit(inputParam) {

    return function (dispatch) {
        const nsampletypecode = inputParam.inputData.nsampletypecode;
        const nregtypecode = inputParam.inputData.nregtypecode;
        const nregsubtypecode = inputParam.inputData.nregsubtypecode;

        const nformcode = inputParam.inputData.nformcode;
        let isValid = true;
        if (nsampletypecode !== 4) {
            if ((nsampletypecode != -1) && (nregtypecode != -1) && (nregsubtypecode != -1) && (nformcode != -1)) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }
        if (nsampletypecode === 4) {
            if ((nsampletypecode != -1) && (nformcode != -1)) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }

        if (isValid) {
            dispatch(initRequest(true));
            return rsapi().post("approvalstatusconfig/getFilterSubmit", inputParam.inputData)
                .then(response => {
                    let masterData = { ...inputParam.masterData, ...response.data }
                    masterData = { ...masterData }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData, loading: false
                        }
                    });
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
        } else if (error.response.status === 500) {
                        toast.warn(error.response.data);
                    } else {
                        toast.warn(error.response.data);
                    }
                })
        }
        else {

            toast.warn(intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));
        }
    }

}

export function changeFilterSubmit(inputParam, SampleTypes, defaultSample, registrationTypes, defaultRegType, regSubTypeList, defaultRegSubType, qualisForms, defaultForms, approvalSubType, defaultApprovalSubType
) {

    return function (dispatch) {

        dispatch(initRequest(true));
        return rsapi().post("approvalstatusconfig/closeFilterService", inputParam.inputData)
            .then(response => {
                const masterData = {...response.data,...inputParam.masterData}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            SampleTypes,
                            defaultSample,
                            realSampleType: defaultSample,
                            defaultRegType,
                            realRegType: defaultRegType,
                            defaultRegSubType,
                            realRegSubType: defaultRegSubType,
                            defaultForms,
                            realdefaultForms: defaultForms,
                            defaultApprovalSubType,
                            realApprovalSubType: defaultApprovalSubType

                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
        } else if (error.respose.status === 500 ){
            toast.error(error.message);
        }
            });
    }
}

export function closeFilterService(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("approvalstatusconfig/closeFilterService", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data ,defaultSample: inputParam.inputData.defaultSample,defaultRegType: inputParam.inputData.defaultRegType,
                    defaultRegSubType: inputParam.inputData.defaultRegSubType,
                        defaultApprovalSubType: inputParam.inputData.defaultApprovalSubType,
                        defaultForms:inputParam.inputData.defaultForms,}
                masterData = { ...masterData }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
        } else if (error.respose.status === 500 ){
            toast.error(error.message);
        }
            });
    }
}




