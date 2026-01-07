import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {getComboLabelValue, constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getPackageService (packageParam) {            
    return function (dispatch) {   
     const packageService = rsapi().post("testpackage/getTestPackage", 
                                     {userinfo:packageParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    if (packageParam.operation === "create"){
        urlArray = [packageService];
    }
    else{           
        const url = packageParam.inputParam.classUrl+ "/getActive" + packageParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
        const packageById =  rsapi().post(url, { [packageParam.primaryKeyField] :packageParam.primaryKeyValue, "userinfo": packageParam.userInfo} );
        urlArray = [packageService, packageById];
        selectedId = packageParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};

            const packageMap = constructOptionList(response[0].data || [], "ntestpackagecode",
                                "stestpackagename", undefined, undefined, true);
            const packageList = packageMap.get("OptionList");
            
            if (packageParam.operation === "update"){
                selectedRecord = response[1].data;
               
            }
           
            dispatch({type: DEFAULT_RETURN, payload:{packageList,//:response[0].data || [],                               
                        operation:packageParam.operation, screenName:packageParam.screenName, selectedRecord, 
                        openModal : true,
                        ncontrolCode:packageParam.ncontrolCode,
                        loading:false,selectedId
                    }});
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
