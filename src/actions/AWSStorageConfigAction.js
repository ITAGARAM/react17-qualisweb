import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';




export function fetchAWSStorageConfigByID(editParam){

    return function(dispatch){
    //const url1=rsapi().post("site/getSiteForFTP",{"userinfo": editParam.userInfo})
    //const url1=rsapi().post("awsstorageconfig/getActiveAWSStorageConfigById",
       //     { [editParam.primaryKeyField] :editParam.primaryKeyValue,"userinfo":editParam.userInfo} )
     //const url2=rsapi().post("awsstorageconfig/getAWSStorageConfig",{"userinfo": editParam.userInfo})
    dispatch(initRequest(true));
   rsapi().post("awsstorageconfig/getActiveAWSStorageConfigById",
            { [editParam.primaryKeyField] :editParam.primaryKeyValue,"userinfo":editParam.userInfo} )
    .then(response=> { 
        let selectedId=editParam.primaryKeyValue
        let selectedRecord=response.data
        
        dispatch({
            type: DEFAULT_RETURN, payload:{
            openModal:true, 
            selectedRecord ,
            operation:editParam.operation,
            screenName:editParam.screenName,
            ncontrolcode:editParam.ncontrolCode,
            inputparam:editParam.inputparam,
            loading:false,selectedId
        }}) 
    })
    .catch(error => {
        dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
        if (error.response.status === 401 || error.response.status === 403) {
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