import rsapi from '../rsapi';
import Axios from 'axios';
import { toast } from 'react-toastify';

import {
    constructOptionList, convertDateValuetoString
    
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';


export function getProjectBarcodceConfig(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bulkbarcodegeneration/getProjectBarcodceConfig", inputParam.inputData)
            .then(response => {

                let bulkbarcodeconfigMap = [];
                let bulkbarcodeconfig = [];
                bulkbarcodeconfigMap = constructOptionList(response.data.bulkBarcodeConfig || [], "nbulkbarcodeconfigcode",
                    "sconfigname", undefined, undefined, false);
                bulkbarcodeconfig = bulkbarcodeconfigMap.get("OptionList");
                /*    let selectedRecord={...inputParam.selectedRecord};
                   if(bulkbarcodeconfig.length>0){
                        selectedRecord={...selectedRecord,"nbulkbarcodeconfigcode":bulkbarcodeconfig[0]}
                   }else{
                       selectedRecord={...selectedRecord,"nbulkbarcodeconfigcode":""}

                   }
*/
              
                let masterData = { ...inputParam.masterData,defaultBarcodeConfig:response.data.defaultBarcodeConfig, defaultProjectType: inputParam.inputData.defaultProjectType, bulkBarcodeConfig: response.data.bulkBarcodeConfig  }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,  isInitialRender:false, loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                    toast.warn(error.response.data);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function importBulkBarcodeGeneration(inputParam) {
    return function (dispatch) {
        const formData = inputParam.formData;
        formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
        dispatch(initRequest(true));
        return rsapi().post("bulkbarcodegeneration/importBulkBarcodeGeneration", formData)
            .then(response => {

                /*    let bulkbarcodeconfigMap=[];
                    let bulkbarcodeconfig=[];
                    bulkbarcodeconfigMap = constructOptionList(response.data.bulkBarcodeConfig || [], "nbulkbarcodeconfigcode",
                            "sconfigname", undefined, undefined, false);
                             bulkbarcodeconfig=bulkbarcodeconfigMap.get("OptionList");
                         /*    let selectedRecord={...inputParam.selectedRecord};
                            if(bulkbarcodeconfig.length>0){
                                 selectedRecord={...selectedRecord,"nbulkbarcodeconfigcode":bulkbarcodeconfig[0]}
                            }else{
                                selectedRecord={...selectedRecord,"nbulkbarcodeconfigcode":""}
    
                            }
    */
                let selectedRecord = { ...inputParam.selectedRecord, "sfilename": "", "simportfilename": "", "sdescription": "" }
                let masterData = { ...inputParam.masterData, ...response.data,"searchedData":undefined }
                dispatch({  
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,addedComponentList: [], isInitialRender:true,selectAll:false,loading: false, selectedRecord,
                        openModal: false,
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                    toast.warn(error.response.data);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getTabBulkBarcodeGeneration(bulkbarcodegeneration, userInfo, masterData,selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let obj = convertDateValuetoString(masterData.FromDate, masterData.ToDate, userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        return rsapi().post("bulkbarcodegeneration/getSelectedBarcodeGenerationDetail", { nbulkbarcodegenerationcode: bulkbarcodegeneration.nbulkbarcodegenerationcode, nprojecttypecode: masterData.realProjectType.value, nbulkbarcodeconfigcode: masterData.realBarcodeConfig.value, userinfo: userInfo, fromDate: fromDate, toDate: toDate })
            .then(response => {
                masterData = { ...masterData, ...response.data };
                selectedRecord={...selectedRecord,"isInitialRender":true}
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,isInitialRender:true,addedComponentList:[],selectAll:false,
                         operation: null, modalName: undefined,
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

export function getBulkBarcodeGenData(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("bulkbarcodegeneration/getBulkBarcodeGenData", inputParam.inputData)
            .then(response => {
                let masterData = { ...inputParam.masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData, operation: null, modalName: undefined,
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

export function getBulkBarcodeGeneration(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("bulkbarcodegeneration/getBulkBarcodeGeneration", inputParam.inputData)
            .then(response => {
                //ALPD-4617-Vignesh R(31-07-2024)--Bulk barcode generation-->Blank page occurs, when submit the filter.
                let masterData = { ...inputParam.masterData,"searchedData":undefined, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,addedComponentList:[],selectAll:false,  isInitialRender:true,//addSelectAll:false,
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

export function deleteBulkBarcodeGeneration(inputParam,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("bulkbarcodegeneration/deleteBulkBarcodeGeneration", inputParam.inputData)
            .then(response => {
                 masterData = { ...masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                       addedComponentList:[],selectAll:false,
                        isInitialRender:true,
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


export function deleteBarcodeData(inputParam,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        return rsapi().post("bulkbarcodegeneration/deleteBarcodeData", inputParam.inputData)
            .then(response => {
                 masterData = { ...masterData, ...response.data };

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        //addedComponentList:[],
                        selectAll:false,
                        isInitialRender:true,
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