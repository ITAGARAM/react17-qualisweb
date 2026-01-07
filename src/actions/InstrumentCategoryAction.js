import rsapi from '../rsapi';
import Axios from 'axios';
import {toast} from 'react-toastify';
import {constructOptionList} from '../components/CommonScript';
import {transactionStatus} from "../components/Enumeration";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
//import { transactionStatus } from './../components/Enumeration';


    // export function openInstrumentCategoryModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
    //     return function (dispatch) {
    //         if (operation === "create" || operation === "update" ) {
    //             // const Technique = rsapi().post("/technique/getTechnique", {
    //             //     "userinfo": userInfo
    //             // });
    
    //             // const Interfacetype = rsapi().post("/instrumentcategory/getInterfacetype", {
    //             //     "userinfo": userInfo
    //             // });
//ALPDJ21-31-->Added by Vignesh(23-07-2025)-->Added the new dropdown Instrument Type-Standard, Storage
//start
export function addComboService(addParam){
    return function(dispatch){
            dispatch(initRequest(true));
           rsapi().post("instrumentcategory/getInstrumentType", {"userinfo": addParam.userInfo})
            .then(response=> { 
    
                        let selectedRecord = {};
                        selectedRecord["nstatus"] = transactionStatus.ACTIVE;
                        selectedRecord["ninstrumentcatcode"] = 0;
                        selectedRecord["ncalibrationreq"] = transactionStatus.NO;
                        selectedRecord["ncategorybasedflow"] = transactionStatus.NO;
                        selectedRecord["ndefaultstatus"] = transactionStatus.NO;
                        
               
                const instrumentType = constructOptionList(response.data || [], "ninstrumenttypecode",
                           "sinstrumenttype", undefined, undefined, true);
    
                selectedRecord['ninstrumenttypecode']=instrumentType.get("DefaultValue") ? instrumentType.get("DefaultValue") : "";
                dispatch({
                    type: DEFAULT_RETURN, payload:{
                    selectedRecord ,
                    operation:addParam.operation,
                    openModal: true,
                    screenName:addParam.screenName,
                    ncontrolcode:addParam.ncontrolCode,
                    loading:false,
                    instrumentType:instrumentType.get("OptionList")
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
//end
/*
    export function openInstrumentCategoryModal(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolcode) {
        return function (dispatch) {
            if (operation === "create" || operation === "update" ) {
                // const Technique = rsapi.post("/technique/getTechnique", {
                //     "userinfo": userInfo
    //      });
    
                // const Interfacetype = rsapi.post("/instrumentcategory/getInterfacetype", {
                //     "userinfo": userInfo
                // });
               
    
                let urlArray = [];
                if (operation === "create") {
                   
                    urlArray = [Interfacetype];
                } 
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                          let selectedRecord = {};
                            selectedRecord["nstatus"] = 1;
                            selectedRecord["ninstrumentcatcode"] = 0;
                            selectedRecord["ncalibrationreq"] = transactionStatus.NO;
                            selectedRecord["ncategorybasedflow"] = transactionStatus.NO;
                            selectedRecord["ndefaultstatus"] = transactionStatus.NO;
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                              //  Technique: response[0].data || [],
                                Interfacetype: response[0].data || [],
                                operation,
                                screenName,
                                selectedRecord,
                                openModal: true,
                                ncontrolcode, loading: false
                            }
                        })
                    })
                    .catch(error => {
                        dispatch(initRequest(false));
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
           payload: {
             navigation: 'forbiddenaccess',
             loading: false,
           }
         });
       } else if (error.response.status === 500) {
                            toast.error(error.message);
                        } else {
                            toast.warn(intl.formatMessage({
                                id: error.response.data
                            }));
                        }
                    })
            }
        }
    }*/
    
    export function fetchInstrumentCategoryById (editParam){  
        return function(dispatch){
           // const URL1= rsapi().post('technique/getTechnique',{"userinfo":editParam.userInfo})
           const URL1= rsapi().post('instrumentcategory/getInstrumentType',{"userinfo":editParam.userInfo})
            const URL2=rsapi().post("instrumentcategory/getActiveInstrumentCategoryById", { [editParam.primaryKeyField] :editParam.primaryKeyValue , "userinfo": editParam.userInfo} )
         //   const URL3= rsapi().post('instrumentcategory/getInterfacetype',{"userinfo":editParam.userInfo})
            dispatch(initRequest(true));
            Axios.all([URL1,URL2])
            .then(response=> { 
                let selectedRecord={}
                let selectedId = editParam.primaryKeyValue;
                selectedRecord=response[1].data;
                //ALPDJ21-31-->Added by Vignesh(23-07-2025)-->Added the new dropdown Instrument Type-Standard, Storage
                //start
                let instrumenttype = [];
                    instrumenttype.push({
                        "value": response[1].data["ninstrumenttypecode"],
                        "label": response[1].data["sinstrumenttype"]
                    });
                    
                if(instrumenttype[0].value!==transactionStatus.NA)
                selectedRecord["ninstrumenttypecode"] =instrumenttype[0];     

                const instrumentType = constructOptionList(response[0].data || [], "ninstrumenttypecode",
                           "sinstrumenttype", undefined, undefined, true);
                //end
               // let Technique = response[0].data;
               // let Interfacetype = response[2].data;

             //   selectedRecord['ntechniquecode']={value:response[1].data.ntechniquecode,label:response[1].data.stechniquename}
             //   selectedRecord['ninterfacetypecode']={value:response[1].data.ninterfacetypecode,label:response[1].data.sinterfacetypename}

              // getComboLabelValue(selectedRecord, Technique, "ntechniquecode", "stechniquename");
              //  getComboLabelValue(selectedRecord, Interfacetype, "ninterfacetype", "sinterfacetypename");
                dispatch({
                    type: DEFAULT_RETURN, payload:{
                    selectedRecord ,
                   // Technique: response[0].data || [],
                  //  Interfacetype: response[2].data || [],
                    operation:editParam.operation,
                    openModal: true,
                    screenName:editParam.screenName,
                    instrumentType:instrumentType.get("OptionList"),
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
