import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { constructOptionList } from '../components/CommonScript';
import { intl } from '../components/App';

export function showChecklistQBAddScreen (userInfo, ncontrolcode){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi().post('checklistqb/getAddEditData',{"userinfo":userInfo}) 
        .then(response=> { 
            // let optionsQBCategory =[];
            // let optionsChecklistComponent = [];

            const optionsQBCategoryMap = constructOptionList(response.data.qbcategory || [], "nchecklistqbcategorycode","schecklistqbcategoryname", undefined, undefined, true);
            const optionsChecklistComponentMap  = constructOptionList(response.data.checklistcomponent  || [], "nchecklistcomponentcode","scomponentname" , undefined, undefined, true);

            const optionsQBCategory = optionsQBCategoryMap.get("OptionList");
            const optionsChecklistComponent = optionsChecklistComponentMap.get("OptionList");
            dispatch({
                type: DEFAULT_RETURN, payload:{
                    // optionsQBCategory:response.data.qbcategory,
                    // optionsChecklistComponent:response.data.checklistcomponent,
                    optionsQBCategory,
                    optionsChecklistComponent,
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
        });
    }
}


export function fetchChecklistQBById (editParam){  
    return function(dispatch){
        const URL1= rsapi().post('checklistqb/getAddEditData',{"userinfo":editParam.userInfo})
        const URL2=rsapi().post("checklistqb/getActiveChecklistQBById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
        dispatch(initRequest(true));
        Axios.all([URL1,URL2])
        .then(response=> { 
            let selectedRecord={}
            let selectedId = editParam.primaryKeyValue;
            const optionsQBCategoryMap = constructOptionList(response[0].data.qbcategory || [], "nchecklistqbcategorycode","schecklistqbcategoryname", undefined, undefined, true);
            const optionsChecklistComponentMap  = constructOptionList(response[0].data.checklistcomponent  || [], "nchecklistcomponentcode","scomponentname" , undefined, undefined, true);
            const optionsQBCategory = optionsQBCategoryMap.get("OptionList");
            const optionsChecklistComponent = optionsChecklistComponentMap.get("OptionList");
            selectedRecord=response[1].data
            selectedRecord['valueQBCategory']={value:response[1].data.nchecklistqbcategorycode,label:response[1].data.schecklistqbcategoryname}
            selectedRecord['valueChecklistComponent']={value:response[1].data.nchecklistcomponentcode,label:response[1].data.scomponentname}
            let mandatoryFields=[
                {"idsName":"IDS_QBCATEGORYNAME","dataField":"valueQBCategory"},
                {"idsName":"IDS_QUESTION","dataField":"squestion"},
                {"idsName":"IDS_COMPONENT","dataField":"valueChecklistComponent"},
            ];
            if(parseInt(response[1].data.nchecklistcomponentcode)===1||parseInt(response[1].data.nchecklistcomponentcode)===4||parseInt(response[1].data.nchecklistcomponentcode)===8){
                mandatoryFields.push({"idsName":"IDS_QUESTIONDATA","dataField":"squestiondata"})
            }
            dispatch({
                type: DEFAULT_RETURN, payload:{
                selectedRecord : response[1].data,
                operation:editParam.operation,
                // optionsQBCategory:response[0].data.qbcategory,
                // optionsChecklistComponent:response[0].data.checklistcomponent,
                optionsQBCategory,
                optionsChecklistComponent,
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
            else{               
                toast.warn(error.response.data);
            }         
        })
    }
 }