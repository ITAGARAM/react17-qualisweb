import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {getComboLabelValue,constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

    export function getModuleSortingComboService (methodParam) {            
    return function (dispatch) {   
    const methodTypeService = rsapi().post("modulesorting/getModuleSorting", 
                                    {userinfo:methodParam.userInfo});
    let urlArray = [];
    let selectedId = null;
   
    if (methodParam.operation === "create"){
        urlArray = [methodTypeService];
       
    }
    else{           
        const url = methodParam.inputParam.classUrl+ "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
        const methodById =  rsapi().post(url, { [methodParam.primaryKeyField] :methodParam.primaryKeyValue, "userinfo": methodParam.userInfo} );
        urlArray = [methodTypeService, methodById];
        selectedId = methodParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
           
            let selectedRecord =  {};
            const menuMap = constructOptionList(response[0].data.moduleList || [], "nmenucode",
                                  "smenuname", undefined, undefined, false);
            const formMap = constructOptionList(response[0].data || [], "nformcode",
                                  "sformname", undefined, undefined, false);
            const moduleMap = constructOptionList(response[1].data.moduleList|| [], "nmodulecode",
                                  "smoduledisplayname", undefined, undefined, false);
            const  menuMapList = menuMap.get("OptionList");
            const  formMapList = formMap.get("OptionList");
            const  moduleMapList = moduleMap.get("OptionList");


            if (methodParam.operation === "update"){
                selectedRecord = response[1].data.selectedForms;
                selectedRecord["nmodulecode"] = getComboLabelValue(selectedRecord[0], response[0].data, 
                    "nmodulecode", "smoduledisplayname"); 
                selectedRecord["nformcode"] = getComboLabelValue(selectedRecord[0], response[0].data, 
                    "nformcode", "sformdisplayname");   
                selectedRecord["nmenucode"] = getComboLabelValue(selectedRecord[0], response[0].data, 
                    "nmenucode", "smenuname");    
                              
            };               
            dispatch({type: DEFAULT_RETURN, payload:{moduleSortingData:response[0].data || [],   
                formMapList,   
                moduleMapList,
                menuMapList,                    
                operation:methodParam.operation, screenName:methodParam.screenName, selectedRecord, 
                openModal : true,
                ncontrolCode:methodParam.ncontrolCode,
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
                toast.error(intl.formatMessage({id: error.message}));
            } 
            else{               
                toast.warn(intl.formatMessage({id: error.response.data}));
            }  
        })        
    }
}