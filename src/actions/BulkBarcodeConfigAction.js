import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { constructOptionList, sortData } from '../components/CommonScript'//, getComboLabelValue, searchData
import { toast } from 'react-toastify';
import Axios from 'axios';
import { initRequest } from './LoginAction';
import { intl } from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getEditData(nbulkbarcodeconfigcode, userInfo, masterData, ncontrolcode, screenName) {
    return function (dispatch) {
        if (masterData.selectedBulkBarcodeConfig["ntransactionstatus"] === transactionStatus.APPROVED ||
            masterData.selectedBulkBarcodeConfig["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            const inputData = {
                nbulkbarcodeconfigcode: nbulkbarcodeconfigcode,
                userinfo: userInfo
            }
            dispatch(initRequest(true));
            rsapi().post("bulkbarcodeconfiguration/getActiveBulkBarcodeConfigurationById", inputData)
                .then(response => {
                    let selectedRecord = {};
                    selectedRecord = {
                        'sconfigname': response.data.sconfigname,
                        'nbarcodelength': response.data.nbarcodelength,
                        'sdescription': response.data.sdescription,
                        'nprojecttypecode': {
                            'label': response.data.sprojecttypename,
                            'value': response.data.nprojecttypecode
                        },
                        'nbulkbarcodeconfigcode': response.data.nbulkbarcodeconfigcode
                    }


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            openModal: true, selectedRecord, masterData,
                            ncontrolcode: ncontrolcode, loadBulkBarcodeConfig: true,loadBarcodeMaster:false,
                            loading: false, screenName: screenName, operation: 'update',

                        }
                    })
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
}

export function getFilterProjectType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bulkbarcodeconfiguration/getFilterProjectType", {
            'userinfo': inputParam.inputData.userinfo,
            'nprojecttypecode': inputParam.inputData.nprojecttypecode
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.inputData.masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
    }
}


export function getBulkBarcodeConfigDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("bulkbarcodeconfiguration/getBulkBarcodeConfig", {
            'userinfo': inputParam.userinfo,
            'nprojecttypecode': inputParam.nprojecttypecode || -1,
            'nbulkbarcodeconfigcode': inputParam.nbulkbarcodeconfigcode || -1
        })
            .then(response => {
                let masterData = {};
                masterData = { ...inputParam.masterData, ...response.data };
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { masterData, loading: false } });
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

export function addBarcodeMaster(screenName, userInfo, operation, masterData,fieldName,ncontrolcode) {
    return function (dispatch) {
        if (masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED ||
            masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            dispatch(initRequest(true));
            return rsapi().post("bulkbarcodeconfiguration/getBarcodeMaster", {
                'userinfo': userInfo,"nbulkbarcodeconfigcode":masterData.selectedBulkBarcodeConfig.nbulkbarcodeconfigcode
            })
                .then(response => {
                    const bulkBarcodeMasterMap = constructOptionList(response.data.BulkBarcodeMaster || [], "nbarcodemastercode",
                        "sformname", undefined, undefined, false);
                    const bulkBarcodeMasterList = bulkBarcodeMasterMap.get("OptionList");
                    masterData = { ...masterData, ...response.data };
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            bulkBarcodeMasterList, masterData,
                            loading: false, openChildModal: true, loadBarcodeMaster: true, fieldName: fieldName, loadBulkBarcodeConfig: false,
                            operation: operation, selectedMasterRecord: undefined, screenName,ncontrolcode:ncontrolcode
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {

                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }

                })
        }
    }
}

export function getFieldLengthService(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/bulkbarcodeconfiguration/getFieldLengthService",
            {
                "userinfo": methodParam.inputData.userinfo, "nprojecttypecode": methodParam.inputData.nprojecttypecode,
                'stablename': methodParam.inputData.stablename
            })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                let selectedMasterRecord = {};
                selectedMasterRecord = {
                    ...methodParam.inputData.selectedMasterRecord,
                    'nfieldlength': response[0].data && (response[0].data.FieldLength || "")
                }

                dispatch({
                    type: DEFAULT_RETURN, payload:
                        { loading: false, data: undefined, dataState: undefined, selectedMasterRecord }
                })
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

export function getParentBarcodeService(methodParam) {
    return function (dispatch) {
        let URL = [];
        URL = rsapi().post("/bulkbarcodeconfiguration/getParentBulkBarcodeMaster",
            {
                "userinfo": methodParam.inputData.userinfo, "nprojecttypecode": methodParam.inputData.nprojecttypecode,
                'nbulkbarcodeconfigcode': methodParam.inputData.masterData.selectedBulkBarcodeConfig.nbulkbarcodeconfigcode,
                'selectedBarcodeFormatting': methodParam.inputData.selectedMasterRecord &&  
                methodParam.inputData.selectedMasterRecord.nbarcodemastercode && 
                methodParam.inputData.selectedMasterRecord.nbarcodemastercode.item
            })
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
               // let masterData = {};
                const bulkBarcodeMasterMap = constructOptionList(response[0].data.ParentBarcodeDetails || [], "nbulkbarcodeconfigdetailscode",
                    "sdisplayname", undefined, undefined, false);
                const ParentBarcodeMasterList = bulkBarcodeMasterMap.get("OptionList");
              //  masterData = { ...methodParam.inputData.masterData, ...response.data };
                let selectedMasterRecord = { ...methodParam.inputData.selectedMasterRecord };

                dispatch({
                    type: DEFAULT_RETURN, payload:
                        { loading: false, data: undefined, dataState: undefined, ParentBarcodeMasterList, selectedMasterRecord }
                })
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

export function getBulkBarcodeDetailsEditData(fetchRecord) {
    return function (dispatch) {
        if (fetchRecord.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.APPROVED ||
            fetchRecord.masterData.selectedBulkBarcodeConfig.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
        } else {
            let urlArray = [];
            let selectedId = null;
            const ActiveByID = rsapi().post("/bulkbarcodeconfiguration/getActiveBulkBarcodeMasterById",
                {
                    "nbulkbarcodeconfigdetailscode": fetchRecord.editRow.nbulkbarcodeconfigdetailscode,
                    "userinfo": fetchRecord.userInfo
                });
            urlArray = [ActiveByID];
            selectedId = fetchRecord.editRow.nbulkbarcodeconfigdetailscode;

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedMasterRecord = {};
                    selectedMasterRecord = {
                        "nbarcodemastercode": { label: response[0].data.sformname, value: response[0].data.nbarcodemastercode },
                        "sfieldname": response[0].data.sfieldname,
                        "nfieldlength": response[0].data.nfieldlength,
                        "nsorter": response[0].data.nsorter,
                        "sdescription": response[0].data.sdescription === 'null' ? "" : response[0].data.sdescription,
                        "isneedparent": response[0].data.isneedparent,
                        "isvalidationrequired": response[0].data.isvalidationrequired,	//ALPD-5082 Added isvalidationrequired to send value to the backend by VISHAKH
                        "nparentmastercode": response[0].data.isneedparent === transactionStatus.YES ?
                            { label: response[0].data.sparentformname, value: response[0].data.nparentnbarcodemastercode } : undefined,
                        nbulkbarcodeconfigdetailscode: response[0].data.nbulkbarcodeconfigdetailscode
                    }
                    let fieldName = response[0].data.nneedmaster === transactionStatus.YES ? "barcodemaster" : "";
                    let screenname=response[0].data.nneedmaster === transactionStatus.YES? "IDS_BARCODEMASTERNAME" : "IDS_BARCODEFORMATTINGFIELD" ;
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            openChildModal: true, operation: fetchRecord.operation,
                            selectedMasterRecord, fieldName,loadBulkBarcodeConfig:false,
                            ncontrolcode: fetchRecord.ncontrolCode, loadBarcodeMaster: true,
                            screenName: screenname, loading: false, selectedId
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
    }
}

export function saveBarcodeMaster(inputParam, masterData, modalName) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        return requestUrl
            .then(response => {
                let openModal = false;
                const retrievedData = sortData(response.data);
                masterData = {
                    ...masterData,
                    ...retrievedData
                }
                sortData(masterData);
                dispatch({ type: DEFAULT_RETURN, payload: { loadEsign: false, loadBarcodeMaster: true,selectedId: inputParam.selectedId, loading: false, masterData, [modalName]: openModal, selectedMasterRecord: {} } })


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


export function validateEsignCredentialSaveBarcodeMaster(inputParam, modalName) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {



                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                    dispatch(saveBarcodeMaster(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"], modalName))


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