import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { initRequest } from './LoginAction';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {sortData, getComboLabelValue, constructOptionList,formatInputDate, rearrangeDateFormat, formatDate} from '../components/CommonScript';
import { intl } from '../components/App';
import {transactionStatus} from '../components/Enumeration';

export function getGrapicalSchedulerDetail (userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("graphicalscheduler/getgraphicalScheduler", {userinfo:userInfo})
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
}
}