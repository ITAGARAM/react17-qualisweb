import rsapi from '../rsapi';
import {DEFAULT_RETURN, UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { constructOptionList } from '../components/CommonScript';
import { intl } from '../components/App';

export function showRegTypeAddScreen (userInfo, ncontrolcode){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi().post('registrationtype/getSampleType',{"userinfo":userInfo}) 
        .then(response=> { 
           
            const optionsSampleTypeMap = constructOptionList(response.data.SampleTypes || [], "nsampletypecode","ssampletypename", undefined, undefined, true);

            const optionsSampleType = optionsSampleTypeMap.get("OptionList");
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    optionsSampleType,
                    openModal:true,
                    operation:"create",
                    selectedRecord:{}
                    , ncontrolcode,loading:false
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


export function fetchRegTypeById (editParam){  
    return function(dispatch){
        const URL1= rsapi().post('registrationtype/getSampleType',{"userinfo":editParam.userInfo})
        const URL2=rsapi().post("registrationtype/getRegistrationTypeById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        dispatch(initRequest(true));
        Axios.all([URL1,URL2])
        .then(response=> { 
            let selectedRecord={}
            let selectedId = editParam.primaryKeyValue;
            const optionsSampleTypeMap = constructOptionList(response[0].data.SampleTypes || [], "nsampletypecode","ssampletypename", undefined, undefined, true);
            const optionsSampleType = optionsSampleTypeMap.get("OptionList");
            selectedRecord=response[1].data
            selectedRecord['SampleTypes']={value:response[1].data.nsampletypecode,label:response[1].data.ssampletypename}
            let mandatoryFields=[
                {"idsName":"IDS_SAMPLETYPENAME","dataField":"SampleTypes","mandatoryLabel": "IDS_ENTER", "controlType": "textbox","ismultilingual":"false"},
                {"idsName":"IDS_REGISTRATIONTYPENAME","dataField":"sregtypename","mandatoryLabel": "IDS_ENTER", "controlType": "textbox","ismultilingual":"true"},
                //{"idsName":"IDS_DESCRIPTION","dataField":"sdescription" },
            ];
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    selectedRecord: { ...response[1].data, ...response[1].data.jsondata },
                operation:editParam.operation,
                optionsSampleType,
                openModal: true,
                screenName:editParam.screenName,
                ncontrolcode:editParam.ncontrolCode,
                loading:false,selectedId,
                mandatoryFields
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
            else {               
                toast.warn(error.response.data);
            }         
        })
    }
 }