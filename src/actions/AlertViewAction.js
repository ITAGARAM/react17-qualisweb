import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { sortData } from '../components/CommonScript';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import { intl } from '../components/App';

export function selectedAlertView(AlertView, userInfo, masterData, dataState) {
    return function (dispatch) {
        let selectedId = AlertView.nsqlquerycode;

        dispatch(initRequest(true));
        rsapi().post("/alertview/getSelectedAlertView", { 'userinfo': userInfo, "nsqlquerycode": AlertView.nsqlquerycode })

            .then(response => {

                if (response.data.ReturnStatus === false){
                    toast.warn(intl.formatMessage({ id: "IDS_INVALIDALERTQUERY" }));
                }
                masterData = { ...masterData, selectedAlertView: response.data.selectedAlertView,
                                SelectedAlert:response.data.SelectedAlert, 
                                sqlQueryName: response.data.sqlQueryName }; 
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false, 
                                                            selectedId, 
                                                            dataState:{...dataState, sort:undefined, filter:undefined}
                                                        } });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}

export function getListAlert(userInfo,loader) {
    return function (dispatch) {
        dispatch(initRequest(loader));
        rsapi().post("/alertview/getAlerts", { 'userinfo': userInfo})

            .then(response => {

                dispatch({ type: DEFAULT_RETURN, payload: {alert:response.data.alert ,selectedAlertView: response.data.selectedAlertView,selectedAlertView1: response.data.selectedAlertView1 ,loading: false } });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}

export function getSelectedAlert(action,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/alertview/getSelectedAlert", { 'nsqlquerycode':action.nsqlquerycode,'userinfo': userInfo})

            .then(response => {

                dispatch({ type: DEFAULT_RETURN, payload: {selectedAlertView: response.data.selectedAlertView,selectedAlertView1: response.data.selectedAlertView1, sqlQueryName: response.data.sqlQueryName , loading: false } });
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
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}