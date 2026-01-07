
import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { sortData} from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { transactionStatus } from '../components/Enumeration';
import { intl } from "../components/App";

export function getTestPriceVersionDetail (testPriceVersion, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("testpricing/getTestPriceVersion", {npriceversioncode:testPriceVersion.npriceversioncode, 
                                                          userinfo:userInfo})
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

export function getEditTestPriceVersionService(inputParam){
    return function(dispatch){
        if (inputParam.masterData.SelectedTestPriceVersion.ntransactionstatus !== transactionStatus.APPROVED && inputParam.masterData.SelectedTestPriceVersion.ntransactionstatus !== transactionStatus.RETIRED) {
        dispatch(initRequest(true));
        rsapi().post("testpricing/getActiveTestPriceVersionById",{[inputParam.primaryKeyName]:inputParam.masterData.SelectedTestPriceVersion[inputParam.primaryKeyName], 
                                                                    userinfo:inputParam.userInfo})
        .then(response=>{
            //const masterData = {...inputParam.masterData, SelectedTestPriceVersion: response.data};
            
            
            dispatch({type: DEFAULT_RETURN, payload:{ openModal:true,
                                                       operation:inputParam.operation, 
                                                       loading:false,
                                                       screenName:inputParam.screenName,   
                                                       selectedRecord:response.data,
                                                       ncontrolCode:inputParam.ncontrolcode,}})
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
    else {
        //toast.warn(this.props.formatMessage({ id: masterData.SelectedSupplier.stranstatus }));
        toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTTESTPRICEVERSION" }));
    }
    }
}

export function getPricingAddTestService(screenName, operation, masterData, userInfo, ncontrolCode){
    return function (dispatch) {    
        if (masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT){     
        
        dispatch(initRequest(true));
        rsapi().post("testpricing/getPriceUnmappedTest",{"npriceversioncode":masterData.SelectedTestPriceVersion["npriceversioncode"], 
            userinfo:userInfo})

        .then(response=>{

                // const testMap = constructOptionList(response.data || [], "ntestcode", "stestname",
                //              undefined, undefined, true) ;

                // const testList = testMap.get("OptionList");                          
                dispatch({type: DEFAULT_RETURN, payload:{//pricingTestList:testList, 
                                                        pricingTestList:response.data,
                                                        openModal:true,
                                                        operation, screenName, ncontrolCode,
                                                        //selectedRecord, 
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
    else{
        toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTTESTPRICEVERSION"}));
    }
}}

export function getPricingEditService(editParam){
    return function (dispatch) {    
       // screenName, operation, masterData, userInfo, ncontrolCode
       //console.log("editParam:", editParam);
        if (editParam.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT){     
        
        dispatch(initRequest(true));
        rsapi().post("testpricing/getTestPrice",{"npriceversioncode":editParam.masterData.SelectedTestPriceVersion["npriceversioncode"], 
                                                "ntestpricedetailcode":editParam.editRow ? editParam.editRow.ntestpricedetailcode :null,
                                                userinfo:editParam.userInfo})

        .then(response=>{
            let selectedRecord =[];
            if(response.data.hasOwnProperty("TestPrice") && response.data["TestPrice"].length === 0){
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false
                    }
                });

                toast.warn(intl.formatMessage({id:"IDS_SELECTTEST"}));
            }else {
                if (editParam.editRow){
                    selectedRecord.push(response.data["SelectedTestPrice"]);
                }else{
                    selectedRecord = sortData(response.data["TestPrice"])
                }
                dispatch({type: DEFAULT_RETURN, payload:{//pricingTestList:testList, 
                    //testPriceList:response.data["TestPrice"],
                    openModal:true,
                    operation:editParam.operation,
                    screenName:editParam.screenName, 
                    ncontrolCode:editParam.ncontrolCode,
                    selectedRecord, 
                    selectedId:editParam.editRow ? editParam.editRow.ntestpricedetailcode :null,
                    loading:false,
                    priceDataState:editParam.priceDataState
                }});
            }


             
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
    else{
        toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTTESTPRICEVERSION"}));
    }
}}