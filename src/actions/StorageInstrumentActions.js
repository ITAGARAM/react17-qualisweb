import rsapi from '../rsapi';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    sortData,
    constructOptionList,
    rearrangeDateFormat, getComboLabelValue, getRecordBasedOnPrimaryKeyName   	//added by sujatha ALPDJ21-21 
} from '../components/CommonScript';
import Axios from 'axios';
import {
    initRequest
} from './LoginAction';
import {
    intl
} from '../components/App';
import {
    toast
} from 'react-toastify';
import {
    transactionStatus,
    attachmentType
} from "../components/Enumeration";

export function addComServiceStorageInstrument(addParam) {
    return function (dispatch) {

        let urlArray = [];
        const service1 = rsapi().post("storagecategory/getStorageCategory", { userinfo: addParam.userInfo });

        // const service2 = rsapi().post("storageinstrument/getStorageInstrumentCategory", {
        //     userinfo: addParam.userInfo
        // });

        const service3 = rsapi().post("storagecondition/getStorageCondition", {
            userinfo: addParam.userInfo
        });
         const service2= rsapi().post("storageinstrument/getStorageInstrumentType", {
            userinfo: addParam.userInfo
        });



        urlArray = [service1, service2,service3]
        dispatch(initRequest(true));

        Axios.all(urlArray).then(response => {


            const storageCategoryMap = constructOptionList(response[0].data || [], "nstoragecategorycode",
                "sstoragecategoryname", undefined, undefined, true);
            const storageCategory = storageCategoryMap.get("OptionList");

            const instrumentTypeMap = constructOptionList(response[1].data && response[1].data.InstrumentType || [], "ninstrumenttypecode",
                "sinstrumenttype", undefined, undefined, true);

            const instrumentCategoryMap = constructOptionList(response[1].data && response[1].data.InstrumentCategory || [], "ninstrumentcatcode",
                "sinstrumentcatname", undefined, undefined, true);

                const storageConditionMap = constructOptionList(response[2] && response[2].data || [], "nstorageconditioncode",
                "sstorageconditionname", undefined, undefined, true);
            const selectedInstrumentTypeMap = constructOptionList(response[1] && response[1].data.selectedInstrumentType || [], "ninstrumenttypecode",
                "sinstrumenttype", undefined, undefined, true).get("OptionList");

            const instrumentType = instrumentTypeMap.get("OptionList");
             
            const instruemntCategory = instrumentCategoryMap.get("OptionList");
             
            const storageCondition = storageConditionMap.get("OptionList");


            let selectedRecord = { ...addParam.selectedRecord };

            selectedRecord['ninstrumentcatcode'] = instrumentCategoryMap.get("DefaultValue") ? instrumentCategoryMap.get("DefaultValue") : "";
            selectedRecord['nstorageconditioncode'] = storageConditionMap.get("DefaultValue") ? storageConditionMap.get("DefaultValue") : "";
            selectedRecord['ninstrumenttypecode']=constructOptionList(response[1] && response[1].data.selectedInstrumentType || [], "ninstrumenttypecode",
                "sinstrumenttype", undefined, undefined, true).get("OptionList");

            let instrumentyMap;
            
            let instrument;

            if (response[1].data && response[1].data.Instrument && selectedRecord['ninstrumentcatcode'] !== "" && response[1].data.Instrument.length > 0) {
                instrumentyMap = constructOptionList(response[1].data && response[1].data.Instrument || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, true);
                instrument = instrumentyMap.get("OptionList");
            }

            


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    storageCategory,
                    operation: addParam.operation, screenName: addParam.screenName,
                    openModal: true,
                    selectedRecord,
                    instruemntCategory,
                    instrument,
                    storageCondition,
                    ncontrolcode: addParam.ncontrolCode,
                    loading: false,instrumentType
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

export function getStorageStructure(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));

        rsapi().post("storageinstrument/getStorageStructure", { userinfo: inputData.userinfo, nstoragecategorycode: inputData.nstoragecategorycode }).then(response => {


            const storageStructureMap = constructOptionList(response.data || [], "nsamplestoragelocationcode",
                "ssamplestoragelocationname", undefined, undefined, true);
            const storageStructure = storageStructureMap.get("OptionList");


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    storageStructure,
                    selectedRecord: inputData.selectedRecord,
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

export function getInstrumentByCategory(inputData, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
       

        rsapi().post("storageinstrument/getInstrumentByCategory", {...inputData}).then(response => {
            const instrumentyMap = constructOptionList(response.data && response.data.Instrument || [], "ninstrumentcode",
                "sinstrumentid", undefined, undefined, true);
            let instrument = instrumentyMap.get("OptionList");
           // selectedRecord['ninstrumentcode'] = instrument;


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    instrument,
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

export function getActiveStorageInstrument(editParam) {
    return function (dispatch) {

        let selectedId = null;
        dispatch(initRequest(true));
        let urlArray = [];
         const service1 = rsapi().post("storagecondition/getStorageCondition", {
            userinfo: editParam.userInfo
        });

        const service2 = rsapi().post("storageinstrument/getActiveStorageInstrument", {
        [editParam.primaryKeyField]: editParam.primaryKeyValue, "userinfo": editParam.userInfo        });

        urlArray = [service1, service2]
        Axios.all(urlArray).then(response => {
            selectedId = editParam.primaryKeyValue;
            
            let storagecategorycodeMap=[];
            let samplestoragelocationcodeMap=[];
              let instrumenttypecodeMap=[];
            let instrumentcatcodeMap=[];
            let instrumentcodeMap=[];
            let storagecondition=[];

             const storageConditionMap = constructOptionList(response[0] && response[0].data || [], "nstorageconditioncode",
                "sstorageconditionname", undefined, undefined, true);

             const storageCondition = storageConditionMap.get("OptionList");

            storagecategorycodeMap.push(
                {"label":response[1].data.sstoragecategoryname,
                "value":response[1].data.nstoragecategorycode}
            );

            samplestoragelocationcodeMap.push({
                "label":response[1].data.ssamplestoragelocationname,
                "value":response[1].data.nsamplestoragelocationcode
            });

             instrumenttypecodeMap.push({
                "label":response[1].data.sinstrumenttype,
                "value":response[1].data.ninstrumenttypecode
            });


            instrumentcatcodeMap.push({
                "label":response[1].data.sinstrumentcatname,
                "value":response[1].data.ninstrumentcatcode
            });

            instrumentcodeMap.push({
                "label":response[1].data.sinstrumentid,
                "value":response[1].data.ninstrumentcode
            });

            storagecondition.push({
                "label":response[1].data.sstorageconditionname,
                "value":response[1].data.nstorageconditioncode
            });


            let selectedRecord={};
            selectedRecord["nstoragecategorycode"]=storagecategorycodeMap[0];
            selectedRecord["nsamplestoragelocationcode"]=samplestoragelocationcodeMap[0];
            selectedRecord["ninstrumentcatcode"]=instrumentcatcodeMap[0];
             selectedRecord["ninstrumenttypecode"]=instrumenttypecodeMap[0];
            selectedRecord["ninstrumentcode"]=instrumentcodeMap[0];
            selectedRecord["nstorageconditioncode"]=storagecondition[0];


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    selectedRecord,
                    operation: editParam.operation,
                    ncontrolcode: editParam.ncontrolCode,
                    openModal: true,
                    loading: false,
                    storageCondition,
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


export function getStorageInstrumentCategoryByInstrumentType(inputData, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
       

        rsapi().post("storageinstrument/getStorageInstrumentCategory", {...inputData}).then(response => {
            const instrumentCategoryMap = constructOptionList(response.data && response.data.InstrumentCategory || [], "ninstrumentcatcode",
                "sinstrumentcatname", undefined, undefined, true);
            let instruemntCategory = instrumentCategoryMap.get("OptionList");
            selectedRecord = { ...selectedRecord };

            selectedRecord['ninstrumentcatcode'] = instrumentCategoryMap.get("DefaultValue") ? instrumentCategoryMap.get("DefaultValue") : "";


            dispatch({
                type: DEFAULT_RETURN, payload: {
                    instruemntCategory,
                    selectedRecord: {...selectedRecord},
                    loading: false
                }
            });
        })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response.status === 401 || error.response.status === 403) {
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