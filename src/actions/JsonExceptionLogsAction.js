import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function ViewJsonExceptionLogs(masterData, userInfo, viewJsonExceptionLogs, screenName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("jsonexceptionlogs/getJsonExceptionLogsDetails", { njsonexceptioncode:viewJsonExceptionLogs.njsonexceptioncode,userinfo:userInfo})
            .then(response => {
                 masterData = {
                    ...masterData,
                    ...response.data
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        viewJsonExceptionLogs:viewJsonExceptionLogs,
                        masterData,
                        selectedId:viewJsonExceptionLogs.njsonexceptioncode,
                        screenName,
                        loading: false,
                        openModal:true,
                        needOldValueColumn:response.data['needOldValueColumn'] 
                        
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