import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from './../components/Enumeration';


export function openEmailTemplateModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
    return function (dispatch) {
        if (operation === "create" || operation === "update") {
            const Tag = rsapi().post("/emailtemplate/getEmailTag", {
                "userinfo": userInfo
            });
            let urlArray = [];
            if (operation === "create") {

                urlArray = [Tag];
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    selectedRecord["nstatus"] = transactionStatus.ACTIVE;
                    selectedRecord["nemailtemplatecode"] = 0;
                    selectedRecord["nemailtagcode"] = '';
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            Tag: response[0].data || [],
                            operation,
                            screenName,
                            selectedRecord,
                            openModal: true,
                            EmailTagParameter: [],
                            ncontrolcode, loading: false
                        }
                    })
                })
                .catch(error => {
                    dispatch(initRequest(false));
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
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        }
    }
}

export function fetchEmailTemplateById(editParam) {
    return function (dispatch) {
        const URL1 = rsapi().post('emailtemplate/getActiveEmailTemplateById', { [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo })
        // const URL2=rsapi().post("instrumentcategory/getActiveInstrumentCategoryById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        // const URL3= rsapi().post('instrumentcategory/getInterfacetype',{"userinfo":editParam.userInfo})
        dispatch(initRequest(true));
        Axios.all([URL1])
            .then(response => {
                let selectedRecord = {}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord = response[0].data["EmailTemplate"][0]
                let Tag = response[0].data["EmailTag"];
                selectedRecord["nemailtagcode"]={label:response[0].data["EmailTemplate"][0].stagname,value:response[0].data["EmailTemplate"][0].nemailtagcode}
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        Tag: Tag || [],
                        EmailTagParameter: response[0].data["EmailParameter"] || [],
                        operation: editParam.operation,
                        openModal: true,
                        screenName: editParam.screenName,
                        ncontrolcode: editParam.ncontrolCode,
                        loading: false, selectedId
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
export function comboChangeEmailTag(Map, masterData, selectedRecord, value) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/emailtemplate/getEmailTagFilter", { ...Map })
            .then(response => {
                let EmailTagParameter = response.data;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, loading: false, EmailTagParameter, selectedRecord, value
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
            });
    }
}