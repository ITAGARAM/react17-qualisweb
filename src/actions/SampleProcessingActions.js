import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';

import {
    constructOptionList, rearrangeDateFormat
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import {
    intl
} from '../components/App';

export function getComboSampleProcessing(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("projecttype/getProjectType", { userinfo: addParam.userInfo });
        const service2 = rsapi().post("storagesampleprocessing/getSampleType", { userinfo: addParam.userInfo, nprojecttypecode: addParam.masterData.selectedProjectType.value });
       const service3 = rsapi().post("storagesampleprocessing/getCollectionTubeType", { userinfo: addParam.userInfo, nprojecttypecode: addParam.masterData.selectedProjectType.value });

        let userInfo = addParam.userInfo;
        const service4 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: userInfo
        });



        urlArray = [service1, service2, service3,service4]

        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let selectedId = null;
            let sampletype;
           let collectiontubetype;

            const sampletypeMap = constructOptionList(response[1].data || [], "nproductcode",
                "sproductname", undefined, undefined, true);
            sampletype = sampletypeMap.get("OptionList");

            const collectiontubetypeMap = constructOptionList(response[2].data || [], "ncollectiontubetypecode",
                "stubename", undefined, undefined, true);
                collectiontubetype = collectiontubetypeMap.get("OptionList");

            let currenttime = rearrangeDateFormat(userInfo, response[3].data?.date);

            let selectedRecord = { ...addParam.selectedRecord, "dprocessstartdate": currenttime,"dprocessenddate":""}
            let masterData={...addParam.masterData,"sprocessstartdatesecondtime":false,"barcodedata":undefined }

            selectedId = addParam.primaryKeyField;
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    sampletype,
                    currenttime,
                   collectiontubetype,
                   masterData,
                    operation: addParam.operation, screenName: addParam.screenName,
                    selectedRecord: selectedRecord,
                    openModal: true,
		//ALPD-4618--Vignesh R(01-08-2024)
                    ncontrolcode: addParam.ncontrolCode,
                    loading: false, selectedId
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}

/*export function getCollectionTubeType(inputParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("storagesampleprocessing/getCollectionTubeType", { userinfo: inputParam.inputData.userinfo, nprojecttypecode: inputParam.inputData.nprojecttypecode });



        urlArray = [service1]

        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let collectiontubetype;


            const collectiontubetypeMap = constructOptionList(response[0].data || [], "ncollectiontubetypecode",
                "stubename", undefined, undefined, true);
            collectiontubetype = collectiontubetypeMap.get("OptionList");

            let selectedRecord = { ...inputParam.selectedRecord }


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    collectiontubetype,
                    selectedRecord: selectedRecord,
                    loading: false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}*/


export function getBarcodeDataDetails(inputParam) {
    return function (dispatch) {
        if(inputParam.selectedRecord["sbarcodeid"]&&inputParam.selectedRecord["sbarcodeid"].length!==inputParam.nbarcodeLength){
              toast.warn(intl.formatMessage({ id: "IDS_INVALIDBARCODEID"}));

        }else{
            dispatch(initRequest(true));

        rsapi().post("storagesampleprocessing/getBarcodeConfigData", { userinfo: inputParam.userinfo, nprojecttypecode: inputParam.nprojecttypecode, spositionvalue: inputParam.spositionvalue, nbarcodeLength: inputParam.nbarcodeLength, jsondata: inputParam.jsondata,nsampleprocesstypecode:inputParam.selectedRecord["nsampleprocesstypecode"] }).then(response => {


        //ALPD-5139--Vignesh R(24-12-2024)---added the collection tube type in data

            let checkCollectionTubeType=true;
            let checkSampleType=true;
            let jsonPrimaryKeyValue=response.data.jsonPrimaryKeyValue;
            
            if(jsonPrimaryKeyValue.ncollectiontubetypecode){
            if(jsonPrimaryKeyValue.ncollectiontubetypecode !== inputParam.selectedRecord['ncollectiontubetypecode'].value){
                checkCollectionTubeType=false;
            }
        }

        if(jsonPrimaryKeyValue.nsamplecollectiontypecode){

        if(jsonPrimaryKeyValue.nsamplecollectiontypecode !== inputParam.selectedRecord['nproductcode'].item.nsamplecollectiontypecode){
            checkSampleType=false;
        }
    }
    if(checkSampleType){
    if(checkCollectionTubeType){
            let barcodedata = response.data.jsondataBarcodeData&&response.data.jsondataBarcodeData;
            let sprocessstartdatesecondtime = response.data.sprocessstartdatesecondtime;
            let sprocessenddate="";
            if(response.data['sprocessenddate']!==undefined&&response.data['sprocessenddate']!==""){
                 sprocessenddate = rearrangeDateFormat(inputParam.userinfo, response.data['sprocessenddate']);

            }
            let scomments=response.data.scomments&&response.data.scomments || "";
            let sdeviationcomments=response.data.sdeviationcomments&&response.data.sdeviationcomments ||"";
          

            let selectedRecord={...inputParam.selectedRecord,"dprocessenddate":sprocessenddate,"scomments":scomments,"sdeviationcomments":sdeviationcomments}
            let masterData = { ...inputParam.masterData, "barcodedata": barcodedata,
                "jsondataBarcodeFields":response.data.jsondataBarcodeFields,
                "sprocessstartdatesecondtime":sprocessstartdatesecondtime,
                "jsonPrimaryKeyValue":response.data.jsonPrimaryKeyValue

            }
           
           
            if(response.data['sprocessstartdate']!==undefined&&response.data['sprocessstartdate']!==""){
               let sprocessstartdate = rearrangeDateFormat(inputParam.userinfo, response.data['sprocessstartdate']);
                    selectedRecord={...selectedRecord,"dprocessstartdate":sprocessstartdate}
           }
                       dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    loading: false
                }
            });
        }else{
            let masterData={...inputParam.masterData,"jsonPrimaryKeyValue":response.data.jsonPrimaryKeyValue};
            dispatch({ type: DEFAULT_RETURN, payload: {
                masterData,
                loading: false } })
            toast.warn(intl.formatMessage({ id: "IDS_INVALIDCOLLECTIONTUBETYPE"}));
 
        }
    }else{
        let masterData={...inputParam.masterData,"jsonPrimaryKeyValue":response.data.jsonPrimaryKeyValue};

        dispatch({ type: DEFAULT_RETURN, payload: { loading: false,masterData } })
        toast.warn(intl.formatMessage({ id: "IDS_INVALIDSAMPLETYPE"}));
 
    }
    }
        )
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
    }
}


export function getSampleProcessType(inputParam) {
    return function (dispatch) {
  
        dispatch(initRequest(true));

        rsapi().post("storagesampleprocessing/getSampleProcessType", inputParam.inputData)
        .then(response => {

                     let processtype;
                    
                        const processtypeMap = constructOptionList(response.data || [], "nprocesstypecode",
                            "sprocesstypename", undefined, undefined, false);
                            processtype = processtypeMap.get("OptionList");
                    
                     
                            let selectedRecord = { ...inputParam.selectedRecord,"processtype":processtype}
                            if(!(response.data&&response.data.length>0)){
                                selectedRecord={...selectedRecord,"nprocesstypecode":"","sprocessduration":"","sgraceduration":""}
          
                            }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    selectedRecord: selectedRecord,
                    loading: false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}

export function getProcessduration(inputParam) {
    return function (dispatch) {
  
        dispatch(initRequest(true));

        rsapi().post("storagesampleprocessing/getProcessduration", inputParam.inputData)
        .then(response => {

            let selectedRecord = { ...inputParam.selectedRecord,"nprocesstime":response.data[0]["nprocesstime"],"ngracetime":response.data[0]["ngracetime"],"sprocessduration":response.data[0]["sprocessduration"],
                "nsampleprocesstypecode":response.data[0]["nsampleprocesstypecode"],"sgraceduration":response.data[0]["sgraceduration"]}

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    selectedRecord: selectedRecord,
                    loading: false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}

export function saveSampleProcessing(inputParam, masterData) {
    return function (dispatch) {

        const service1 = rsapi().post("storagesampleprocessing/" + inputParam.operation + "SampleProcessing", inputParam.inputData);
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo:inputParam.inputData.userinfo
        });
        let urlArray=[];
        urlArray = [service1, service2];

        dispatch(initRequest(true));
        Axios.all(urlArray).then(response => {

           let openModal=false;

           if(inputParam.saveType===2){
            openModal=true;
           }
           let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[1].data?.date);


            masterData = { ...masterData, "SampleProcessing": response[0].data.SampleProcessing, "barcodedata":"","iscommentsrequired":false,"isdevaiationrequired":false,"sprocessstartdatesecondtime":false }
          

            let selectedRecord = { ...inputParam.selectedRecord, "sbarcodeid": "","nproductcode":undefined,"ncollectiontubetypecode":undefined,"nprocesstypecode":"","sprocessduration":"","dprocessenddate":"",
                "sdeviationcomments":"",  "scomments": "","sgraceduration":"" ,"processtype":[],"dprocessstartdate":date}
            

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    openModal: openModal,
                    loading: false,
                    loadEsign:false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}

export function getActiveSampleProcessingById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        dispatch(initRequest(true));

        rsapi().post("storagesampleprocessing/getActiveSampleProcessingById", { [editParam.primaryKeyField]: editParam.editRow.nsampleprocessingcode,"nprojecttypecode":editParam.editRow.nprojecttypecode, "userinfo": editParam.userInfo }).then(response => {
            selectedId = editParam.primaryKeyValue;
           
            let sprocessstartdate = rearrangeDateFormat(editParam.userInfo, response.data.activeSampleProcessingByID['sprocessstartdate']);
          

            //let selectedRecord = response.data && response.data.activeSampleProcessingByID
            let jsondataBarcodeFields = response.data.jsondataBarcodeFields;
            let barcodedata = response.data && response.data.activeSampleProcessingByID.jsondata;
            let masterData = { ...editParam.masterData, "barcodedata": barcodedata,
               "sprocessstartdatesecondtime":response.data.sprocessstartdatesecondtime,"jsondataBarcodeFields":jsondataBarcodeFields
            }
           let  selectedRecord = {
                ...editParam.selectedRecord, "sbarcodeid": response.data.activeSampleProcessingByID['sbarcodeid'],
            "dprocessenddate": response.data.activeSampleProcessingByID['sprocessenddate']&& rearrangeDateFormat(editParam.userInfo, response.data.activeSampleProcessingByID['sprocessenddate'])|| "","dprocessstartdate": sprocessstartdate, "scomments": response.data.activeSampleProcessingByID['scomments'],"sprocessduration":response.data.activeSampleProcessingByID['sprocessduration'],
            nsampleprocesstypecode:response.data.activeSampleProcessingByID["nsampleprocesstypecode"],
            "sdeviationcomments":response.data.activeSampleProcessingByID['sdeviationcomments'],
            "sgraceduration":response.data.activeSampleProcessingByID['sgraceduration'],
            "ngracetime":response.data.activeSampleProcessingByID&&response.data.activeSampleProcessingByID['ngracetime'],
          "nprocesstime":response.data.activeSampleProcessingByID&&response.data.activeSampleProcessingByID['nprocesstime']

            }

            let SampleType = [];
            let CollectionTubeType = [];
            let SampleProcessType = [];
            CollectionTubeType.push({
                "value": response.data.activeSampleProcessingByID["ncollectiontubetypecode"],
                "label": response.data.activeSampleProcessingByID["stubename"]
            });
            SampleType.push({
                "value": response.data.activeSampleProcessingByID["nproductcode"],
                "label": response.data.activeSampleProcessingByID["sproductname"]
            });
            SampleProcessType.push({
                "value": response.data.activeSampleProcessingByID["nprocesstypecode"],
                "label": response.data.activeSampleProcessingByID["sprocesstypename"]
            });
            selectedRecord["nproductcode"] = SampleType[0];
            selectedRecord["nprocesstypecode"] = SampleProcessType[0];
            selectedRecord["ncollectiontubetypecode"] = CollectionTubeType[0];


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    operation: editParam.operation,
                    ncontrolcode: editParam.ncontrolCode,
                    openModal: true,
                    loading: false,
                    selectedId,
                    screenName: editParam.screenName,
                    dataState:editParam.dataState

                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}

export function getSampleProcessing(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("storagesampleprocessing/getSampleProcessing", inputParam.inputData)
            .then(response => {
                let selectedId=null;
                let masterData = { ...inputParam.masterData, ...response.data }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId,
                        masterData, loading: false,
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
}
/*
export function getCommentsDeviation(inputParam) {
    return function (dispatch) {
  


        rsapi().post("storagesampleprocessing/getCommentsDeviation", {...inputParam.inputData})
        .then(response => {

            let masterData = { ...inputParam.masterData, ...response.data }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord: {...inputParam.selectedRecord},
                    loading: false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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

}
    */

export function validateEsignCredentialSampleProcessing(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {



                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    // if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                    //     inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                    //     delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    // }
                    
	
                        dispatch(saveSampleProcessing(inputParam["screenData"]["inputParam"],inputParam["screenData"]["masterData"]))
 
                 
                }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    };
}