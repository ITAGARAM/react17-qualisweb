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
import { transactionStatus } from '../components/Enumeration';


//Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18
export function getComboSampleCollection(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("unit/getUnit", { userinfo: addParam.userInfo });
    
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: addParam.userInfo
        });

        const service3 = rsapi.post("timezone/getTimeZone", {
            userinfo: addParam.userInfo
        });

        urlArray = [service1, service2,service3]


        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let selectedId = null;
            let unit;
            let timeZone;
            let selectedRecord={};
            const unitMap = constructOptionList(response[0].data || [], "nunitcode",
                "sunitname", undefined, undefined, true);
            unit = unitMap.get("OptionList");

            const TimeZoneMap = constructOptionList(response[2].data || [], "ntimezonecode",
                "stimezoneid", undefined, undefined, true);
            timeZone = TimeZoneMap.get("OptionList");


            let date = rearrangeDateFormat(addParam.userInfo, response[1].data?.date);

            selectedRecord = { ...addParam.selectedRecord, "dcollectiondatetime": date }

            if(addParam.userInfo.isutcenabled === transactionStatus.YES){
                selectedRecord.ntzcollectiondatetime={
                            "value": addParam.userInfo.ntimezonecode,
                            "label": addParam.userInfo.stimezoneid
                }               
            }

                let masterData={...addParam.masterData,"barcodedata":undefined}

            selectedId = addParam.primaryKeyField;
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    unit,
                    timeZone,
                    operation: addParam.operation, screenName: addParam.screenName,
                    selectedRecord: selectedRecord,
                    masterData,
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



export function getBarcodeDataCollection(inputParam) {
    return function (dispatch) {
      
            dispatch(initRequest(true));

        rsapi().post("storagesamplecollection/getBarcodeConfigDataCollection", { userinfo: inputParam.userinfo, nprojecttypecode: inputParam.nprojecttypecode, spositionvalue: inputParam.spositionvalue, nbarcodeLength: inputParam.nbarcodeLength, jsondata: inputParam.jsondata }).then(response => {

            let barcodedata = response.data.jsondataBarcodeData;

            let masterData = { ...inputParam.masterData, "barcodedata": barcodedata,"jsondataBarcodeFields":response.data.jsondataBarcodeFields }
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    ...inputParam.selectedRecord,
                    loading: false
                }
            });
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

//Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18
export function saveCollection(inputParam, masterData) {
    return function (dispatch) {


        dispatch(initRequest(true));
        let urlArray = [];
        const service1 = rsapi().post("storagesamplecollection/" + inputParam.operation + "SampleCollection", inputParam.inputData);
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo:inputParam.inputData.userinfo
        });

        urlArray = [service1, service2]

        Axios.all(urlArray).then(response => {
        let openModal=false;
           if(inputParam.saveType===2){
            openModal=true;
           }
           let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[1].data);

            masterData = { ...masterData, "SampleCollection": response[0].data.SampleCollection, "barcodedata":"" }
            let selectedRecord = { ...inputParam.selectedRecord, "sbarcodeid": "", "nsampleqty": "", "nunitcode": "", "scomments": "", "dcollectiondatetime": date}

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

//Modified by sonia on 18th July 2025 for jira id:ALPDJ21-18
export function getActiveSampleCollectionById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        dispatch(initRequest(true));
        let urlArray =[];
        let timeZone;
        const service1 = rsapi().post("storagesamplecollection/getActiveSampleCollectionById", { [editParam.primaryKeyField]: editParam.primaryKeyValue,"nprojecttypecode":editParam.editRow.nprojecttypecode, "userinfo": editParam.userInfo });
        const service2 = rsapi().post("timezone/getTimeZone", {userinfo: editParam.userInfo});

       // rsapi().post("storagesamplecollection/getActiveSampleCollectionById", { [editParam.primaryKeyField]: editParam.primaryKeyValue,"nprojecttypecode":editParam.editRow.nprojecttypecode, "userinfo": editParam.userInfo }).then(response => {
		urlArray = [service1, service2]


        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {   

            const TimeZoneMap = constructOptionList(response[1].data || [], "ntimezonecode","stimezoneid", undefined, undefined, true);
            timeZone = TimeZoneMap.get("OptionList");
            selectedId = editParam.primaryKeyValue;
            let instname = [];
            instname.push({
                "value": response[0].data.activeSampleColletionByID[0]["nunitcode"],
                "label": response[0].data.activeSampleColletionByID[0]["sunitname"]
            });
            let tzname =[];
            tzname.push({
                "value": response[0].data.activeSampleColletionByID[0]["ntzcollectiondatetime"],
                "label": response[0].data.activeSampleColletionByID[0]["stimezoneid"]
            })
            let date = rearrangeDateFormat(editParam.userInfo, response[0].data.activeSampleColletionByID[0]['scollectiondatetime']);

            //let selectedRecord = response.data && response.data.activeSampleColletionByID

            let barcodedata = response[0].data && response[0].data.activeSampleColletionByID[0].jsondata;
            let masterData = { ...editParam.masterData, "barcodedata": barcodedata, "jsondataBarcodeFields":response[0].data.jsondataBarcodeFields }
            let selectedRecord = {
                ...editParam.selectedRecord, "sbarcodeid": response[0].data.activeSampleColletionByID[0]['sbarcodeid'], "nsampleqty": response[0].data.activeSampleColletionByID[0]['nsampleqty'],
                "dcollectiondatetime": date, "scomments": response[0].data.activeSampleColletionByID[0]['scomments']
            }
            selectedRecord["nunitcode"] = instname[0];
            selectedRecord["ntzcollectiondatetime"]=tzname[0];
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    timeZone,
                    operation: editParam.operation,
                    ncontrolcode: editParam.ncontrolCode,
                    openModal: true,
                    loading: false,
                    selectedId,
                    dataState:editParam.dataState,
                    screenName: editParam.screenName
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


export function getSampleCollection(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("storagesamplecollection/getSampleCollection", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data }
                let selectedId=null;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false,selectedId
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


export function validateEsignCredentialSampleCollection(inputParam) {
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
                    
	
                        dispatch(saveCollection(inputParam["screenData"]["inputParam"],inputParam["screenData"]["masterData"]))
 
                 
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