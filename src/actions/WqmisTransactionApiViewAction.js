import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList , sortData } from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

export function getBlockData(ndistrictid) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("wqmistransactionapiview/getBlock", {
            "ndistrictid": ndistrictid,
        })
            .then(response => {
                let blockData = [];
                const block = constructOptionList(response.data.block || [], "nblockid",
                    "sblockname", undefined, undefined, false);
                blockData = block.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        blockData, panchayatData: [], villageData: [],
                        loading: false

                    }
                });

            }).catch(error => {
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
    }
}

export function getPanchayatData(nblockid) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("wqmistransactionapiview/getPanchayat", {
            "nblockid": nblockid,
        })
            .then(response => {
                let panchayatData = [];
                const panchayat = constructOptionList(response.data.panchayat || [], "npanchayatid",
                    "spanchayatname", undefined, undefined, false);
                panchayatData = panchayat.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        panchayatData, villageData: [],
                        loading: false

                    }
                });

            }).catch(error => {
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
    }
}

export function getVillageData(npanchayatid) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("wqmistransactionapiview/getVillage", {
            "npanchayatid": npanchayatid,
        })
            .then(response => {
                let villageData = [];
                const village = constructOptionList(response.data.village || [], "nvillageid",
                    "svillagename", undefined, undefined, false);
                villageData = village.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        villageData,
                        loading: false

                    }
                });

            }).catch(error => {
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
    }
}

export function getApiData(userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("wqmistransactionapiview/getWQMISTransactionApiDropdown", { userinfo: userInfo })
            .then(response => {
                sortData(response.data);
                const masterData = { ...response.data, apiData: response.data.apiData, district: response.data.district }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false

                    }
                });

            }).catch(error => {
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
    }
}

export function viewTransactionData(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("wqmistransactionapiview/" + inputParam.smethodurl, inputParam)
            .then(response => {
                if (response.status === 200) {
                    toast.success(intl.formatMessage({ id: response.data }));
                } else if (response.status === 204) {
                    toast.info(intl.formatMessage({ id: "IDS_NODATATOSYNCFROMSERVER" }));
                } else {
                    toast.info(intl.formatMessage({ id: response.data }));
                }
                dispatch(getApiData(inputParam.userinfo));
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });

            }).catch(error => {
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
    }
}