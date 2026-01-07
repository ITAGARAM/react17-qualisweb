import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from "react-toastify";
import { initRequest } from './LoginAction';
import {getHomeDashBoard} from './DashBoardTypeAction';
import { intl } from '../components/App';

export function getListStaticDashBoard(userInfo) {
    return function (dispatch) {
        // let selectedRecordStatic = {};
        dispatch(initRequest(true));
        rsapi().post("/staticdashboard/getListStaticDashBoard", { 'userinfo': userInfo })

            .then(response => { 
                // response.data = null;

                let respObject = {masterDataStatic: response.data, loading: false,};
                if (response.data !== null && Object.keys(response.data).length > 0)
                {
                   respObject = {...respObject, currentPageNo : -1 };
                   // dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic: response.data, loading: false, currentPageNo : -1 } });
                } 
                dispatch(getHomeDashBoard(userInfo, 0, false, respObject));
             })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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

export function getStaticDashBoard(userInfo, selectedDashBoardDetail, masterDataStatic, selectedRecordStatic, showModal) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/staticdashboard/getStaticDashBoard", { 'userinfo': userInfo, "nstaticDashBoardCode": selectedDashBoardDetail.nstaticdashboardcode, "sparamValue" : selectedRecordStatic })

            .then(response => {

                masterDataStatic = { ...response.data, staticDashBoardMaster: masterDataStatic.staticDashBoardMaster,
                     selectedDashBoardDetail: selectedDashBoardDetail };
              
                dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic, loading: false,  openModalForHomeDashBoard : showModal} });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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

export function getSelectionStaticDashBoard(userInfo, nstaticDashBoardCode, sparamValue, masterDataStatic,selectedItem) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/staticdashboard/getSelectionStaticDashBoard", { 'userinfo': userInfo, "nstaticDashBoardCode": nstaticDashBoardCode, "sparamValue": sparamValue })

            .then(response => {

                masterDataStatic = { 
                    ...masterDataStatic, 
                    ...response.data,
                    selectedCategoryField:selectedItem.categoryField,
                    selectedValueField:selectedItem.valueField 
                };               
                dispatch({ type: DEFAULT_RETURN, payload: { masterDataStatic, loading: false } });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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