import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import {constructOptionList} from '../components/CommonScript'
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getCityService (methodParam) {            
    return function (dispatch) {   
    const methodTypeService = rsapi().post("city/getCity", 
                                    {userinfo:methodParam.userInfo});
    const districtService = rsapi().post("city/getDistrict", 
                                    {userinfo:methodParam.userInfo});
    let urlArray = [];
    let selectedId = null;
    
    if (methodParam.operation === "create"){
        urlArray = [methodTypeService,districtService];
    }
    else{           
        const url = methodParam.inputParam.classUrl+ "/getActive" + methodParam.inputParam.methodUrl + "ById";   //"method/getActiveMethodById"      
        const methodById =  rsapi().post(url, { [methodParam.primaryKeyField] :methodParam.primaryKeyValue, "userinfo": methodParam.userInfo} );
        urlArray = [methodTypeService,districtService,methodById];
        selectedId = methodParam.primaryKeyValue;
    }
    dispatch(initRequest(true));
    Axios.all(urlArray)
        .then(response=>{                  
            
            let selectedRecord =  {};
            let districtCode=[];
            const cityList = constructOptionList(response[0].data  ||[],"ncitycode",
            "scityname" , undefined, undefined, undefined);
        const  cityList1  = cityList.get("OptionList");
        const  citydefault  = cityList.get("DefaultValue");
        
        const district = constructOptionList(response[1].data.districtList  ||[],"ndistrictcode",
            "sdistrictname" , undefined, undefined, undefined);
        const  districtList  = district.get("OptionList");
       
          
        if (methodParam.operation === "update"){
            selectedRecord = response[2].data;    
            districtCode.push({"value" : response[2].data["ndistrictcode"], "label" : response[2].data["sdistrictname"]});   
            selectedRecord["ndistrictcode"]=districtCode[0];                      
        }else{
            selectedRecord["ncitycode"] = citydefault; 
        }
           
            dispatch({type: DEFAULT_RETURN, 
                        payload:{cityList:cityList1 || [],
                        districtList:districtList||[],                       
                        operation:methodParam.operation, 
                        screenName:methodParam.screenName, selectedRecord, 
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