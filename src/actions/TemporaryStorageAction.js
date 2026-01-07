import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';

import {
    rearrangeDateFormat
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';

export function getComboTemporaryStorage(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("unit/getUnit", { userinfo: addParam.userInfo });
        let userInfo = addParam.userInfo;
        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo: userInfo
        });



        urlArray = [service1, service2]

        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            let selectedId = null;
         

            let date = rearrangeDateFormat(userInfo, response[1].data?.date);

            let selectedRecord = { ...addParam.selectedRecord, "dstoragedatetime": date }

            let masterData = { ...addParam.masterData, "jsondataBarcodeData": undefined }


            selectedId = addParam.primaryKeyField;
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    //  unit,
                 masterData,
                    operation: addParam.operation, screenName: addParam.screenName,
                    selectedRecord: selectedRecord,
                    openModal: true,
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



export function getBarcodeDataTemporaryStorage(inputParam) {
    return function (dispatch) {
      
            dispatch(initRequest(true));

            rsapi().post("temporarystorage/getBarcodeConfigData", { userinfo: inputParam.userinfo, nprojecttypecode: inputParam.nprojecttypecode, spositionvalue: inputParam.spositionvalue, nbarcodeLength: inputParam.nbarcodeLength, jsondata: inputParam.jsondata }).then(response => {

                let masterData = { ...inputParam.masterData, "jsondataBarcodeData": response.data.jsondataBarcodeData, "jsondataBarcodeFields": response.data.jsondataBarcodeFields }
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
       // }
    }
}

export function saveTemporaryStorage(inputParam, masterData) {
    return function (dispatch) {


        dispatch(initRequest(true));

        const service1 = rsapi().post("temporarystorage/" + inputParam.operation + "TemporaryStorage", inputParam.inputData);

        const service2 = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo:inputParam.inputData.userinfo
        });
        let urlArray=[];
        urlArray = [service1, service2];

        Axios.all(urlArray).then(response => {

            let openModal=false;
            if(inputParam.saveType===2){
             openModal=true;
            }

            let date = rearrangeDateFormat(inputParam.inputData.userinfo, response[1].data?.date);

            masterData = { ...masterData, "TemporaryStorage": response[0].data.TemporaryStorage, "jsondataBarcodeData": "" }
            let selectedRecord = { ...inputParam.selectedRecord, "sbarcodeid": "", "nsampleqty": "", "nunitcode": "", "scomments": "" ,"dstoragedatetime":date}

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    selectedRecord,
                    openModal: openModal,
                    loading: false,
                    loadEsign: false
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

export function getActiveTemporaryStorageById(editParam) {
    return function (dispatch) {

        let selectedId = null;
        rsapi().post("temporarystorage/getActiveTemporaryStorageById", { [editParam.primaryKeyField]: editParam.primaryKeyValue,"nprojecttypecode":editParam.editRow.nprojecttypecode, "userinfo": editParam.userInfo }).then(response => {
            selectedId = editParam.primaryKeyValue;
            /*let instname = [];
            instname.push({
                "value": response.data.activeSampleColletionByID["nunitcode"],
                "label": response.data.activeSampleColletionByID["sunitname"]
            });*/
            let date = rearrangeDateFormat(editParam.userInfo, response.data.activeTemporaryStorageByID['sstoragedatetime']);
            let jsondataBarcodeFields = response.data.jsondataBarcodeFields;
            let barcodedata = response.data && response.data.activeTemporaryStorageByID.jsondata;
            let masterData = { ...editParam.masterData, "jsondataBarcodeData": barcodedata ,"jsondataBarcodeFields":jsondataBarcodeFields}
            let selectedRecord = {
                ...editParam.selectedRecord, "sbarcodeid": response.data.activeTemporaryStorageByID['sbarcodeid'],// "nsampleqty": response.data.activeSampleColletionByID['nsampleqty'],

                "dstoragedatetime": date, "scomments": response.data.activeTemporaryStorageByID['scomments']
            }
            //selectedRecord["nunitcode"] = instname[0];
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


export function getTemporaryStorage(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("temporarystorage/getTemporaryStorage", inputParam.inputData)
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


export function validateEsignCredentialTemporaryStorage(inputParam) {
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


                    dispatch(saveTemporaryStorage(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))


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