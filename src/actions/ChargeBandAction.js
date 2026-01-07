import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function fetchChargeBandById(editParam){  
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi().post("chargeband/getActiveChargeBandById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        .then(response=> {
            let selectedId=editParam.primaryKeyValue
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    selectedRecord : response.data,
                    operation:"update",
                    openModal: true,
                    screenName:editParam.screenName,
                    inputparam:editParam.inputparam,
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