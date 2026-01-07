import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { toast } from 'react-toastify';
import {sortData} from '../components/CommonScript';
import { intl } from '../components/App';

export function SyncRecords (userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/synchronization/syncRecords",
            { 'userinfo': userInfo})
            .then(response => {             

                if(response.data["SyncMessage"])
                {
                    toast.info(response.data["SyncMessage"]);
                }
                //masterData = {...masterData, ...response.data}; 
                const masterData = response.data;      
                sortData(masterData);
                dispatch({type: DEFAULT_RETURN, payload:{masterData, operation:null, modalName:undefined, 
                     loading:false}}); 
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
            });
    }
}

export function getSyncHistoryDetail (syncHistory, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    // console.log("syncHistory:", syncHistory);
    return rsapi().post("synchistory/getSyncHistory", {nsyncbatchcode:syncHistory.nsyncbatchcode, userinfo:userInfo})
   .then(response=>{     
        masterData = {...masterData, ...response.data};       
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