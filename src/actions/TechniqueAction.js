import rsapi from '../rsapi';
import {DEFAULT_RETURN,UN_AUTHORIZED_ACCESS} from './LoginTypes';
import { sortData} from '../components/CommonScript'
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { transactionStatus } from '../components/Enumeration';
import { intl } from "../components/App";
import ConfirmMessage from '../components/confirm-alert/confirm-message.component';


export function getTechniqueDetail (technique, userInfo, masterData) {
    return function (dispatch) {   
    dispatch(initRequest(true));
    return rsapi().post("technique/getTechnique", {ntechniquecode:technique.ntechniquecode, 
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

export function getEditTechniqueService(inputParam){
    return function(dispatch){
        dispatch(initRequest(true));
        rsapi().post("technique/getActiveTechniqueById",{[inputParam.primaryKeyName]:inputParam.masterData.SelectedTechnique[inputParam.primaryKeyName],userinfo:inputParam.userInfo 
                                                                    })
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
}

export function getAddTestService(screenName, operation, masterData, userInfo, ncontrolCode,confirmMessage){
    return function (dispatch) {    
        //if (masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT){     
        
        dispatch(initRequest(true));

        rsapi().post("technique/getTechniqueConducted",{"ntechniquecode":masterData.SelectedTechnique["ntechniquecode"], 
        userinfo:userInfo})
        .then(response=>{
          if(response.data!==null && response.data.length >0)
          {
            
            toast.warn(intl.formatMessage({id: "IDS_TESTTRAININGALREADYCONDUCTED"}));
            dispatch({type: DEFAULT_RETURN, payload:{//pricingTestList:testList, 
                openChildModal:false,
                operation, screenName, ncontrolCode,
                loading:false}});
          }
          else
          {
            dispatch({type: DEFAULT_RETURN, payload:{
                openChildModal:false,
                operation, screenName, ncontrolCode,
                loading:false}});
            rsapi().post("technique/getTechniqueScheduled",{"ntechniquecode":masterData.SelectedTechnique["ntechniquecode"], 
            userinfo:userInfo})
            .then(response=>{
              if(response.data!==null && response.data.length >0)
              {
                
                confirmMessage.confirm("addMessage", intl.formatMessage({ id: "IDS_ADDTEST" }), intl.formatMessage({ id: "IDS_TESTTRAININGSCHEDULEDADD" }),
                intl.formatMessage({ id: "IDS_OK" }), intl.formatMessage({ id: "IDS_CANCEL" }),
                () =>  rsapi().post("technique/getTechniqueTest",{"ntechniquecode":masterData.SelectedTechnique["ntechniquecode"], 
                userinfo:userInfo})
    
            .then(response=>{
                                               
                    dispatch({type: DEFAULT_RETURN, payload:{
                                                            techniqueTestList:response.data,
                                                          
                                                            openChildModal:true,
                                                            operation, screenName, ncontrolCode,
                                                            
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
                }));
              }
              else
              {
                rsapi().post("technique/getTechniqueTest",{"ntechniquecode":masterData.SelectedTechnique["ntechniquecode"], 
                userinfo:userInfo})
    
            .then(response=>{
                                               
                    dispatch({type: DEFAULT_RETURN, payload:{
                      techniqueTestList:response.data,
                     
                      openChildModal:true,
                      operation, screenName, ncontrolCode,
                      
                      loading:false}});
                })
                .catch(error=>{
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
                  dispatch({type: DEFAULT_RETURN, payload: {loading:false}})
                })
              }
    
           }).catch(error => {
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

       }).catch(error => {
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
         
    // }
    // else{
    //     toast.warn(intl.formatMessage({id: "IDS_SELECTDRAFTTESTPRICEVERSION"}));
    // }
}}