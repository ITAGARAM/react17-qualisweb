import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest} from './LoginAction';
import { sortData} from '../components/CommonScript';
import { intl } from '../components/App';
import Axios from 'axios';

export function getMISRightsDetail (MISRights, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("misrights/getMISRights", {nuserrolecode:MISRights.nuserrolecode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data,updateDataState:true};       
        sortData(masterData);
        dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
             loading:false}});   
   })
   .catch(error=>{
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
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
               } else if (error.response.status === 500){
           toast.error(error.message);
       } 
       else{               
           toast.warn(error.response.data);
       }  
  
   })
}}

export function getDashBoardRightsComboDataService(DashBoardparam) {
    return function (dispatch) {
            const contactData = {
                "nuserrolecode": DashBoardparam.masterData.SelectedMIS.nuserrolecode,
                "userinfo": DashBoardparam.userInfo

            }
            const contactService = rsapi().post("misrights/getDashBoardTypeByUserRole", contactData);
            let urlArray = [];
                urlArray = [contactService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    //const   DashBoardType= constructOptionList(response[0].data  || [], "ndashboardtypecode", "sdashboardtypename", false, false, true).get("OptionList"); 
                    const DashBoardType =response[0].data
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            DashBoardType,
                            selectedDashBoardRights: [],
                            selectedRecord,
                            openChildModal: true,
                            operation: DashBoardparam.operation, screenName: DashBoardparam.screenName,
                            ncontrolCode: DashBoardparam.ncontrolCode, loading: false
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
export function getReportRightsComboDataService(ReportParamparam) {
    return function (dispatch) {
            const contactData = {
                "nuserrolecode": ReportParamparam.masterData.SelectedMIS.nuserrolecode,
                "userinfo": ReportParamparam.userInfo

            }
            const contactService = rsapi().post("misrights/getReportByUserRole", contactData);
            let urlArray = [];
                urlArray = [contactService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    //const   Reports= constructOptionList(response[0].data  || [], "nreportcode", "sreportname", false, false, true).get("OptionList"); 
                    const Reports =response[0].data
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            Reports,
                            selectedReportRights: [],
                            selectedRecord,
                            openChildModal: true,
                            operation: ReportParamparam.operation, screenName: ReportParamparam.screenName,
                            ncontrolCode: ReportParamparam.ncontrolCode, loading: false
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
export function getAlertRightsComboDataService(AlertParamparam) {
    return function (dispatch) {
            const contactData = {
                "nuserrolecode": AlertParamparam.masterData.SelectedMIS.nuserrolecode,
                "userinfo": AlertParamparam.userInfo
            }
            const contactService = rsapi().post("misrights/getAlertByUserRole", contactData);
            let urlArray = [];
                urlArray = [contactService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    //const   Alert= constructOptionList(response[0].data  || [], "nsqlquerycode", "sscreenheader", false, false, true).get("OptionList"); 
                    const   Alert= response[0].data  

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            Alert,
                            selectedAlertRights: [],
                            selectedRecord,
                            openChildModal: true,
                            operation: AlertParamparam.operation, screenName: AlertParamparam.screenName,
                            ncontrolCode: AlertParamparam.ncontrolCode, loading: false
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

export function getHomeRightsComboDataService(HomeParamparam) {
    return function (dispatch) {
            const contactData = {
                "nuserrolecode": HomeParamparam.masterData.SelectedMIS.nuserrolecode,
                "userinfo": HomeParamparam.userInfo
            }
            const contactService = rsapi().post("misrights/getHomeDashBoardRightsByUserRole", contactData);
            let urlArray = [];
                urlArray = [contactService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                   // const   HomeRights= constructOptionList(response[0].data  || [], "ndashboardhomeprioritycode", "sdashboardhomepagename", false, false, true).get("OptionList"); 
                    const   HomeRights=response[0].data

                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            HomeRights,
                            selectedHomeRights: [],
                            selectedRecord,
                            openChildModal: true,
                            operation: HomeParamparam.operation, screenName: HomeParamparam.screenName,
                            ncontrolCode: HomeParamparam.ncontrolCode, loading: false
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


export function getAlertHomeRightsComboDataService(AlertHomeParamparam) {
    return function (dispatch) {
            const contactData = {
                "nuserrolecode": AlertHomeParamparam.masterData.SelectedMIS.nuserrolecode,
                "userinfo": AlertHomeParamparam.userInfo
            }
            const contactService = rsapi().post("misrights/getAlertHomeRightsByUserRole", contactData);
            let urlArray = [];
                urlArray = [contactService];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = {};
                    //const   AlertHomeRights= constructOptionList(response[0].data  || [], "nsqlquerycode", "sscreenheader", false, false, true).get("OptionList"); 
                    const AlertHomeRights =response[0].data
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            AlertHomeRights,
                            selectedAlertHomeRights: [],
                            selectedRecord,
                            openChildModal: true,
                            operation: AlertHomeParamparam.operation, screenName: AlertHomeParamparam.screenName,
                            ncontrolCode: AlertHomeParamparam.ncontrolCode, loading: false
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

