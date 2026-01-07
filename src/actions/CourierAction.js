import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    getComboLabelValue
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from './../components/Enumeration';


    export function openCourierModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
        return function (dispatch) {
            if (operation === "create" || operation === "update" ) {
                const Country = rsapi().post("/country/getCountry", {
                    "userinfo": userInfo
                });
                let urlArray = [];
                if (operation === "create") {
                   
                    urlArray = [Country];
                } 
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                          let selectedRecord = {};
                            selectedRecord["nstatus"] = transactionStatus.ACTIVE;
                            selectedRecord["ncouriercode"] = 0;
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                Country: response[0].data || [],
                                operation,
                                screenName,
                                selectedRecord,
                                openModal: true,
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
    
    export function fetchCourierById (editParam){  
        return function(dispatch){
            const URL1= rsapi().post('country/getCountry',{"userinfo":editParam.userInfo})
            const URL2=rsapi().post("courier/getActiveCourierById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
            dispatch(initRequest(true));
            Axios.all([URL1,URL2])
            .then(response=> { 
                let selectedRecord={}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord=response[1].data
                let Country = response[0].data;
               getComboLabelValue(selectedRecord, Country, "ncountrycode", "scountryname");
                dispatch({
                    type: DEFAULT_RETURN, payload:{
                    selectedRecord ,
                    Country: response[0].data || [],
                    operation:editParam.operation,
                    openModal: true,
                    screenName:editParam.screenName,
                    ncontrolcode:editParam.ncontrolCode,
                    loading:false,selectedId
                }
                }); 
                
            })
            .catch(error => {
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
        }
     }
