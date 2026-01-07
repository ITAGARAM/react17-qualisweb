import rsapi from '../rsapi';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    toast
} from 'react-toastify';
import {
    initRequest
} from './LoginAction';
import Axios from 'axios';
import {
    intl
} from "../components/App";
import { transactionStatus } from '../components/Enumeration';
import { constructOptionList,rearrangeDateFormat,reArrangeArrays } from '../components/CommonScript';

export function getBatchCreationDetails(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchmaster", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            // fromDate: inputData.fromdate,
                            //  toDate: inputData.todate
                        },
                        loading: false
                    }
                })
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
    }
}


export function getProductcategoryAction(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getProductcategory", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            selectedTestSynonym: undefined,
                            selectedInstrument: undefined,
                            selectedInstrumentCategory: undefined,
                            instrumentCategory: undefined,
                            instrument: undefined
                            //defaultRegistrationSubType: inputData.defaultRegistrationSubType,
                        },
                        loading: false,
                        openModal: true,
                        operation: inputData.operation
                    }
                })
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
    }

}

export function getTestInstrumentComboService(inputData,masterData) {
    return function (dispatch) {
        if(masterData.Batchmaster === undefined){
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTALLVALUESINFILTER"
            }))
        }else{
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getTestBasedOnCombo",inputData)
            .then(response => {
                let responseData=[];
                if(response.data.rtn == "IDS_NOTESTTOADDFORTHISSECTION"){
                    toast.warn(intl.formatMessage({
                        id: "IDS_NOTESTTOADDFORTHISSECTION"
                    }))
                }
                //else{
                //     responseData = response.data;
                // }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedTestSynonym: undefined,
                            selectedInstrument: undefined,
                            selectedInstrumentCategory: undefined,
                            instrumentCategory: undefined,
                            instrument: undefined,
                            selectedProduct: undefined,
                            product: undefined,
                            selectedInstrumentId:undefined,
                            instrumentID:undefined,
                        },
                        isselectedrecordempty:false,
                        loading: false,
                        //operation: inputData.operation,
                        batchactiveKey : "IDS_SAMPLE",
                    }
                })
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
        }
    }

}

export function getBCRegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getRegistrationType", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            defaultSampleType: inputData.defaultSampleType,
                            ...response.data,
                            realRegTypeValue : inputData.realRegTypeValue,
                            realRegSubTypeValue : inputData.realRegSubTypeValue,
                            realApproveConfigVersion : inputData.realApproveConfigVersion,
                            realdefaultFilterStatus : inputData.realdefaultFilterStatus,
                            realRegistrationTypeList:inputData.realRegistrationTypeList,
                            realRegistrationSubTypeList:inputData.realRegistrationSubTypeList,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realBCFilterStatusList:inputData.realBCFilterStatusList
                        },
                        loading: false
                    }
                })
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
    }
}

export function getTestInstrumentCategory(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        // let urlArray = [];
        // const instrumentCategory = rsapi().post("batchcreation/getTestBasedInstrumentCat", inputData);
        // const section = rsapi().post("/batchcreation/getSection",inputData);
        // urlArray = [instrumentCategory,section];
        rsapi().post("batchcreation/getTestBasedInstrumentCat", inputData)
        //Axios.all(urlArray)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedInstrumentCategory: undefined,
                            selectedInstrumentId: undefined,
                            selectedInstrument:undefined,
                            selectedRecord:inputData
                            // selectedProduct: undefined,
                            // product: undefined
                        },
                        loading: false,
                        isselectedrecordempty:false
                    }
                })
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
                }else if (error.response.status === 417) {
                    toast.warn(error.response.data.rtn);
                }else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getInstrumentForInstCategory(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getInstrument", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedInstrument:undefined,
                            selectedInstrumentId:undefined,
                            instrumentID:undefined
                        },
                        loading: false,
                        isselectedrecordempty:false,
                    }
                })
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
    }
}

export function onActionFilterSubmit(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchmaster", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData : undefined,
                            realSampleTypeValue: response.data.defaultSampleType,
                           // realRegTypeValue: response.data.defaultRegistrationType,
                           // realRegSubTypeValue: response.data.defaultRegistrationSubType,
                          //  realApproveConfigVersion : inputData['realApproveConfigVersion'] ,
                          //  realdefaultFilterStatus : inputData['realdefaultFilterStatus'],

                         realRegistrationTypeList:   inputData["realRegistrationTypeList"] ,
                         realRegTypeValue:     inputData["realRegTypeValue"] ,
                         realRegistrationSubTypeList:   inputData["realRegistrationSubTypeList"] ,
                         realRegSubTypeValue:  inputData["realRegSubTypeValue"] ,
                         realBCFilterStatusList:   inputData["realBCFilterStatusList"],
                         realdefaultFilterStatus: inputData["realdefaultFilterStatus"] ,
                         realApprovalConfigVersionList:  inputData["realApprovalConfigVersionList"] ,
                         realApproveConfigVersion: inputData["realApproveConfigVersion"] ,
                         realndesigntemplatemappingcode:inputData["realndesigntemplatemappingcode"]
                        },
                        batchactiveKey : "IDS_SAMPLE",
                        loading: false,
                    }
                })
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
    }

}


export function createBatchmasterAction(inputData, masterData, operation) {
    return function (dispatch) {
        dispatch(initRequest(true));
        // let url = "";
        // if(operation == "create"){
        //     url="batchcreation/createBatchmaster"
        // }else{
        //     url="batchcreation/updateBatchcreation"
        // }
        // rsapi().post(url, inputData)
        rsapi().post("batchcreation/createBatchmaster", inputData)
            .then(response => {
				//ALPD-3399
                let Batchmaster=[];
                Batchmaster=masterData.Batchmaster;
				// ALPD-5564 - responseData changed by Gowtham R - RunBatch -> In Filter set To-Date as previous day and create new batch -> existing selected batch is duplicated.
                // let responseData={ ...response.data,Batchmaster};
                let responseData={ ...response.data };
                delete responseData["Batchmaster"];
                response.data["SelectedBatchmaster"] && Batchmaster.unshift(response.data["SelectedBatchmaster"]);
                responseData["Batchmaster"] = [ ...Batchmaster ];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...responseData,
                            searchedData : undefined,
                            // realSampleTypeValue: response.data.defaultSampleType,
                            // realRegTypeValue: response.data.defaultRegistrationType,
                            // realRegSubTypeValue: response.data.defaultRegistrationSubType
                        },
                        loading: false,
                        openModal: false,                       
                        batchactiveKey : "IDS_SAMPLE",
                    }
                })
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
    }

}

    //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
export function getSamplesForGrid(ntestcode, nbatchmastercode,userInfo, masterData,nregtypecode,
    nregsubtypecode,addSampleID,dataState,addedSamplesListSortedList) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getSample", { ntestcode: ntestcode,
            nbatchmastercode: nbatchmastercode,userInfo: userInfo,
            nregtypecode: nregtypecode,nregsubtypecode:nregsubtypecode,addSampleID,
            napprovalconfigversioncode:masterData.realApproveConfigVersion.napprovalconfigversioncode,
            nprojectmastercode:masterData.SelectedBatchmaster.nprojectmastercode,
            nneedmyjob: masterData.realRegSubTypeValue.nneedmyjob
         })
            .then(response => {
			//ALPD-3399
              let  samples = response.data.samples &&response.data.samples.map(item => {
                    item={...item,"selected":false};
                return item;
            });
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            samples
                        },
                        loading: false,
                        openModal: true,
                        operation: "createSample",
                        batchactiveKey : "IDS_SAMPLE",
                         //ALPD-5137--Vignesh R(20-12-2024)---Including filter in Data selection Kendo Grid
                         dataState,
                         addedSamplesListSortedList:[],
                        isselectedrecordempty:true
                    }
                })
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
    }

}


export function getSelectedBatchCreationDetail(inputData, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getActiveSelectedBatchmaster",
            { nbatchmastercode: inputData.nbatchmastercode, 
                userInfo: userInfo,
                ndesigntemplatemappingcode:masterData.ndesigntemplatemappingcode,
                nsampletypecode:inputData.nsampletypecode
            })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                        },
                        loading: false,
                        isselectedrecordempty:false,
                        batchactiveKey : "IDS_SAMPLE",
                    }
                })
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
    }

}

export function createSampleAction(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/createSample", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                        },
                        loading: false,
                        openModal: false
                    }
                })
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
    }
}


export function deleteSampleAction(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/deleteSample", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                        },
                        loading: false,
                        openModal: false,
                        batchactiveKey : "IDS_SAMPLE"
                    }
                })
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
    }
}


export function getActiveBatchCreationService(inputData,selectedBatchmaster) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getActiveSelectedBatchmasterByID",
              { nbatchmastercode: selectedBatchmaster.nbatchmastercode,
                ninstrumentcode:selectedBatchmaster.ninstrumentcode,
                sinstrumentid:selectedBatchmaster.sinstrumentid,
                nprojectmastercode:inputData.nprojectmastercode,
                userInfo: inputData.userInfo, ntestcode: selectedBatchmaster.ntestcode,
                naddcontrolCode : inputData.naddcontrolCode,nregtypecode :inputData.nregtypecode,
                nregsubtypecode:inputData.nregsubtypecode,nsampletypecode:inputData.nsampletypecode})
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                        },
                        loading: false,
                        openModal: true,
                        operation: inputData.operation,
                        editId: inputData.ncontrolCode,
                        naddcontrolCode:inputData.naddcontrolCode,
                        isselectedrecordempty:false
                    }
                })
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
    }

}

export function updateBatchcreationAction(inputData, masterData, operation) {
    return function (dispatch) {
        dispatch(initRequest(true));
        // let url = "";
        // let urlArray = [];
        // if(operation == "create"){
        //     url="batchcreation/createBatchmaster"
        // }else{
        //     url="batchcreation/updateBatchcreation"
        // }
        // urlArray = [url];
        let SelectedBatchmaster = [];
        rsapi().post("batchcreation/updateBatchcreation", inputData)
            .then(response => {
                //let array = [response.data.SelectedBatchmaster]

                masterData['Batchmaster'] =  masterData['Batchmaster'].map(item => {
                    if (item.nbatchmastercode === response.data.SelectedBatchmaster.nbatchmastercode) {
                        item = response.data.SelectedBatchmaster
                    }
                return item;
                })

               // masterData['Batchmaster'] = [...array, ...masterData['Batchmaster']]
                //SelectedBatchmaster = {...masterData.SelectedBatchmaster,...response.data.SelectedBatchmaster}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {

                        masterData: {
                            ...masterData,  
                            ...response.data,
                            realSampleTypeValue: inputData.defaultSampleType,
                            realRegTypeValue: inputData.defaultRegistrationType,
                            realRegSubTypeValue: inputData.defaultRegistrationSubType
                        },
                        loading: false,
                        openModal: false,
                        batchactiveKey : "IDS_SAMPLE"
                    }
                })
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
    }
}


export function deleteBatchCreation(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/deleteBatchcreation",inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                        },
                        loading : false,
                        openModal : false,
                        isClearSearch : inputData.isClearSearch,
                        batchactiveKey : "IDS_SAMPLE"
                    }
                })
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
    }
}


export function batchInitiateAction(inputData,masterData,ConfirmMessage) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/initiateBatchcreation",inputData)
            .then(response => {
			//ALPD-3399
                let Batchmaster=[];
                Batchmaster=masterData.Batchmaster;

				// ALPD-5564 - response.data["SelectedBatchmaster"] checked with && by Gowtham R - RunBatch -> In Filter set To-Date as previous day and create new batch -> existing selected batch is duplicated.
                Batchmaster.map((item,index)=>{
                    if(response.data["SelectedBatchmaster"] && response.data["SelectedBatchmaster"].nbatchmastercode===item.nbatchmastercode){
                        Batchmaster.splice(index,1)
                        Batchmaster.splice(index,0,response.data["SelectedBatchmaster"]);
                     }
                    })
                    let responseData={...response.data,Batchmaster}
                    if(masterData.searchedData && masterData.searchedData.length > 0){
                        let searchedData = reArrangeArrays(masterData["searchedData"], masterData.Batchmaster, "nbatchmastercode");
                        
                        masterData={...masterData,searchedData};
                      }
        
         
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...responseData
                          //  defaultFilterStatus:inputData.defaultFilterStatus,
                           // realdefaultFilterStatus : inputData.defaultFilterStatus
                        },
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        batchactiveKey : "IDS_SAMPLE",
                        selectedRecord: {}  // ALPD-5723    Added selectedRecord by Vishakh for initiate batch
                    }
                })
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
                }else if(error.response.status === 417){
                    toast.warn(error.response.data);
                    //ConfirmMessage.confirm("warning", "Warning!",  error.response.data, undefined, "ok", undefined, true, undefined);
                }else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function getBCRegistrationSubType(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getRegistrationsubType",inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            realRegTypeValue : inputData.realRegTypeValue,
                            realRegSubTypeValue : inputData.realRegSubTypeValue,
                            realApproveConfigVersion : inputData.realApproveConfigVersion,
                            realdefaultFilterStatus : inputData.realdefaultFilterStatus,
                            realRegistrationTypeList:inputData.realRegistrationTypeList,
                            realRegistrationSubTypeList:inputData.realRegistrationSubTypeList,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realBCFilterStatusList:inputData.realBCFilterStatusList,
                            //ALPD-3571--Vignesh R(05-09-2024)
                            // realndesigntemplatemappingcode:inputData.realndesigntemplatemappingcode,
                            // napprovalconfigcode:inputData.napprovalconfigcode,
                            // napprovalversioncode:inputData.napprovalversioncode
                        },
                        loading: false,
                        openModal: false,
                    }
                })
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
    }
}

export function batchCompleteAction(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/completeBatchcreation",inputData)
            .then(response => {
			//ALPD-3399
                let Batchmaster=[];


                Batchmaster=masterData.Batchmaster;

                Batchmaster.map((item,index)=>{
				// ALPD-5564 - response.data["SelectedBatchmaster"] checked by Gowtham R - RunBatch -> In Filter set To-Date as previous day and create new batch -> existing selected batch is duplicated.
                    if(response.data["SelectedBatchmaster"] && response.data["SelectedBatchmaster"].nbatchmastercode===item.nbatchmastercode){
                        Batchmaster.splice(index,1)
                        Batchmaster.splice(index,0,response.data["SelectedBatchmaster"]);
                     }
                    })
              let responseData={...response.data,Batchmaster}
           

         
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...responseData,
                           // defaultFilterStatus:inputData.defaultFilterStatus,
                            //realdefaultFilterStatus : inputData.defaultFilterStatus
                        },
                        loading: false,
                        openModal: false,
                        loadEsign: false,
                        batchactiveKey : "IDS_SAMPLE"
                    }
                })
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
    }
}


export function getBatchhistoryAction(inputData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchhistory", inputData)
        .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputData.masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: false,
                    batchactiveKey : "IDS_BATCHHISTORY"
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


export function getBatchSection(inputData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getSection", inputData)
        .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputData.masterData,
                        ...response.data,
                        Testvalues:undefined,
                        selectedSection: undefined,
                        selectedTestSynonym:undefined,
                        selectedInstrument: undefined,
                        selectedInstrumentCategory: undefined,
                        selectedInstrumentId:undefined,
                        instrumentID:undefined,
                        instrumentCategory: undefined,
                        instrument: undefined,
                        selectedProduct: undefined,
                        product: undefined,
                        selectedRecord:undefined,
                        ProjectCode:undefined,
                        selectedProjectedCode:undefined
                    },
                    naddcontrolCode : inputData.ncontrolCode,
                    isselectedrecordempty:true,
                    batchactiveKey : "IDS_SAMPLE",
                    loading: false,
                    openModal: true,
                    screenName: "Batch",
                    operation: inputData.operation
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


export function viewInfo(nbatchmastercode, userInfo, masterData,nsampletypecode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getActiveSelectedBatchmaster",
            { nbatchmastercode: nbatchmastercode, 
              userInfo: userInfo,
              ndesigntemplatemappingcode:masterData.ndesigntemplatemappingcode,
              nsampletypecode:masterData.defaultSampleType ? masterData.defaultSampleType.nsampletypecode : transactionStatus.NA
            }) 
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedRecordView : response.data.SelectedBatchmaster
                        },
                        loading: false,
                        batchactiveKey : "IDS_SAMPLE",
                        operation: "view",
                        openModal: true,
                    }
                })
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
    }
}

export function getIqcSamples(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
         const InstrumentCategory = rsapi().post("/patient/getGender", {"userinfo": inputData.userInfo});
        const periodService = rsapi().post("/period/getPeriodByControl", {"ncontrolcode": inputData.ncontrolCode,"userinfo": inputData.userInfo});
        const batchIQC =rsapi().post("batchcreation/getBatchIQC", inputData);
        let urlArray=[batchIQC,InstrumentCategory,periodService]
          Axios.all(urlArray)
            .then(response => {
                let Specification = constructOptionList(response[0].data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                let selectedSpec = {}
                
                //ALPD-5873 Loadind Spec While Opening IQC Sample Slideout for Default Spec Work. Added by Abdul on 04-06-2025
                let { AgaramTree, ActiveKey, FocusKey, OpenNodes, SelectedActiveKey, SelectedFocusKey } = [];

                selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                    "value": Specification[0].value,
                    "label": Specification[0].label,
                    "item": Specification[0].item
                } : "";
                selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                AgaramTree = response[0].data["AgaramTree"];
                ActiveKey = response[0].data["ActiveKey"];
                FocusKey = response[0].data["FocusKey"];
                SelectedActiveKey = response[0].data["ActiveKey"];
                SelectedFocusKey = response[0].data["FocusKey"];
                OpenNodes = response[0].data["OpenNodes"];
                const gradeMap = constructOptionList(response[1].data.genderList || [], "ngendercode", "sgendername", false, false, true);
                const gender = gradeMap.get("OptionList");                       
                const PeriodMap = constructOptionList(response[2].data || [], "nperiodcode", "speriodname", false, false, true);
                const period = PeriodMap.get("OptionList");  
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response[0].data,
                        },
                        //ALPD-5873 Loadind Spec While Opening IQC Sample Slideout for Default Spec Work. Added by Abdul on 04-06-2025
                        selectedRecord : {
                            ...selectedSpec,
                            //ALPD-5952-Start
                            smaterialtypename:response[0].data.selectedMaterialType,
                            smaterialcatname:response[0].data.selectedMaterialCategory,
                            smaterialname:response[0].data.selectedMaterial,
                            sinventoryid:response[0].data.selectedMaterialInventory,
                            savailablequatity:response[0].data.selectedInventoryUnit.savailablequatity,ngendercode:undefined,
                            nfromageperiod:undefined,sage:""
                             //ALPD-5952-End
                        },
                        loading: false,
                        openModal: true,
                        loadSpec:false,
                        Specification:[],
                        selectedSpec:selectedSpec,
                        operation: "createiqcsample",
                        isselectedrecordempty:false,
                        //ALPD-5873 Loadind Spec While Opening IQC Sample Slideout for Default Spec Work. Added by Abdul on 04-06-2025
                        AgaramTree,
                        ActiveKey,
                        FocusKey, 
                        SelectedActiveKey, 
                        SelectedFocusKey,
                        OpenNodes,gender,period
                        //activeKey : "IDS_SAMPLE"
                    }
                })
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
            });
    }

}

export function getMaterialBasedOnMaterialCategory(selectedRecord,masterData,selectedMaterialCategory) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchMaterial", 
         {  nmaterialcatcode: selectedRecord.nmaterialcatcode,
            nsectioncode:selectedRecord.nsectioncode,
            ntestcode:selectedRecord.ntestcode,
            ntestgroupspecrequired:masterData.realRegSubTypeValue && masterData.realRegSubTypeValue.ntestgroupspecrequired && masterData.realRegSubTypeValue.ntestgroupspecrequired === true? transactionStatus.YES :transactionStatus.NO,
            userInfo: selectedRecord.userInfo})  
            .then(response => {
                //ALPD-5873 Loadind Spec While Changing material Category Combo for Default Spec Work. Added by Abdul on 04-06-2025
                let Specification = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                let selectedSpec = {}
                let { AgaramTree, ActiveKey, FocusKey, OpenNodes, SelectedActiveKey, SelectedFocusKey } = [];

                selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                    "value": Specification[0].value,
                    "label": Specification[0].label,
                    "item": Specification[0].item
                } : "";
                selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                AgaramTree = response.data["AgaramTree"];
                ActiveKey = response.data["ActiveKey"];
                FocusKey = response.data["FocusKey"];
                SelectedActiveKey = response.data["ActiveKey"];
                SelectedFocusKey = response.data["FocusKey"];
                OpenNodes = response.data["OpenNodes"];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            ...selectedMaterialCategory
                            
                        },
                        //ALPD-5873 Loadind Spec While Changing material Category Combo for Default Spec Work. Added by Abdul on 04-06-2025
                        selectedRecord : {
                            ...selectedRecord,
                            ...selectedSpec,
                        },
                        Specification:[],
                        selectedSpec:selectedSpec,
                        AgaramTree,
                        ActiveKey,
                        FocusKey, 
                        SelectedActiveKey, 
                        SelectedFocusKey,
                        OpenNodes,
                        loading: false,
                        openModal: true,
                        operation: "createiqcsample",
                        //activeKey : "IDS_SAMPLE"
                    }
                })
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
            });
    }
}

export function getMaterialInventoryBasedOnMaterial(selectedRecord,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchMaterialInventory", 
         {nmaterialcode: selectedRecord.nmaterialcode,nsectioncode:selectedRecord.nsectioncode,
            needsection: selectedRecord.needsection,
            ntestgroupspecrequired:masterData.realRegSubTypeValue && masterData.realRegSubTypeValue.ntestgroupspecrequired && masterData.realRegSubTypeValue.ntestgroupspecrequired === true? transactionStatus.YES :transactionStatus.NO,
            ntestcode:selectedRecord.ntestcode,
            userInfo: selectedRecord.userInfo})
         .then(response => {
            //ALPD-5873 Loadind Spec While Changing material Combo for Default Spec Work. Added by Abdul on 04-06-2025
            let Specification = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                let selectedSpec = {}
                let { AgaramTree, ActiveKey, FocusKey, OpenNodes, SelectedActiveKey, SelectedFocusKey } = [];

                selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                    "value": Specification[0].value,
                    "label": Specification[0].label,
                    "item": Specification[0].item
                } : "";
                selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                AgaramTree = response.data["AgaramTree"];
                ActiveKey = response.data["ActiveKey"];
                FocusKey = response.data["FocusKey"];
                SelectedActiveKey = response.data["ActiveKey"];
                SelectedFocusKey = response.data["FocusKey"];
                OpenNodes = response.data["OpenNodes"];
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        ...response.data,
                    },
                    //ALPD-5873 Loadind Spec While Changing material Combo for Default Spec Work. Added by Abdul on 04-06-2025
                    selectedRecord : {
                      ...selectedRecord,
                      ...selectedSpec,
					//ALPDJ21-55--Added by Vignesh(14-08-2025)--for can't save the IQC sample
                      savailablequatity:response.data.selectedInventoryUnit.savailablequatity
                    },
                    Specification:[],
                    selectedSpec:selectedSpec,
                    AgaramTree,
                    ActiveKey,
                    FocusKey, 
                    SelectedActiveKey, 
                    SelectedFocusKey,
                    OpenNodes,
                    loading: false,
                    openModal: true,
                    operation: "createiqcsample",
                    //activeKey : "IDS_SAMPLE"
                }
            })
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
            });
    }
}

export function batchSaveIQCActions(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/createIQCSample", inputData)
         .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: false,
                    operation: "createiqcsample",
                    //activeKey : "IDS_SAMPLE"
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
                toast.warn(intl.formatMessage({
                    id: error.response.data.rtn}));
            }
        })
    }
}

export function getMaterialAvailQtyBasedOnInv(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getMaterialAvailQtyBasedOnInv", inputData)
        .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: true,
                   // operation: "createiqcsample",
                    //activeKey : "IDS_SAMPLE"
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
export function getBatchIqcSampleAction(inputData) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchIqcSampleAction", inputData)
        .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputData.masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: false,
                    batchactiveKey : "IDS_BATCHIQCSAMPLE"
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
        });
    }
}


export function getBCApprovalConfigVersion(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getApprovalConfigVersion", inputData)
        .then(response => {
            //ALPD-3571--Vignesh R(05-09-2024)
            if(response.data.Success&&response.data.Success!=="Success"){
                toast.warn(response.data.Success);
                dispatch(initRequest(false));
            }

        else{
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputData.masterData,
                        ...response.data,
                        fromDate:response.data.realFromDate,
                        toDate:response.data.realToDate,
                        realRegTypeValue : inputData.realRegTypeValue,
                        realRegSubTypeValue : inputData.realRegSubTypeValue,
                        realApproveConfigVersion : inputData.realApproveConfigVersion,
                        realdefaultFilterStatus : inputData.realdefaultFilterStatus,
                        realRegistrationTypeList:inputData.realRegistrationTypeList,
                        realRegistrationSubTypeList:inputData.realRegistrationSubTypeList,
                        realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                        realBCFilterStatusList:inputData.realBCFilterStatusList,
                        realFromDate:inputData.realFromDate,
                        realToDate:inputData.realToDate,
                       // ApprovalVersionValue:inputData.ApprovalVersionValue===""?inputData.masterData.ApprovalVersionValue:inputData.ApprovalVersionValue
                        

                    },
                    loading: false,
                    openModal: false,
                    batchactiveKey : "IDS_SAMPLE"
                }
            })
        }
        }) .catch(error => {
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

export function getTreeByMaterial(inputData,selectedRecord,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getSpecificationDetails", inputData)
            .then(response => {
                let { Specification, AgaramTree, ActiveKey, FocusKey, OpenNodes} = [];
                let selectedSpec = {}
                if (response.data["rtn"] === true) {
                    Specification = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                    AgaramTree = response.data["AgaramTree"];
                    ActiveKey = response.data["ActiveKey"];
                    FocusKey = response.data["FocusKey"];
                    OpenNodes = response.data["OpenNodes"];
                    //Manufacturer = response.data["Manufacturer"];
                    selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                        "value": Specification[0].value,
                        "label": Specification[0].label,
                        "item": Specification[0].item
                    } : "";

                   
                    selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                    selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ? Specification[0].item.ntemplatemanipulationcode : -1
                   // selectedRecord = { ...selectedRecord, ...selectedSpec }
                }
                selectedRecord = { ...selectedRecord, ...selectedSpec }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData
                        },
                            Specification,
                            ntemplatemanipulationcode:response.data["ntreetemplatemanipulationcode"],
                            selectedRecord,
                            AgaramTree, ActiveKey, FocusKey, OpenNodes,
                            Test: [],
                            SelectedTest: [],
                            loading: false,
                            selectedSpec,
                            Component: [],
                            selectComponent: {},
                            selectedComponent: {},
                            loadSpec : true,
                            loading: false,
                            openSpecModal:true
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
        });
    }
}

export function cancelIQCSampleAction(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/deleteIQCSample", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                        },
                        loading: false,
                        openModal: false,
                        batchactiveKey : "IDS_BATCHIQCSAMPLE"
                    }
                })
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
                }else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function batchCancelAction(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/cancelBatch", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            defaultFilterStatus:inputData.defaultFilterStatus,
                            realdefaultFilterStatus : inputData.defaultFilterStatus
                        },
                        loading: false,
                        openModal: false,
                        batchactiveKey : "IDS_SAMPLE"
                    }
                })
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
                }else if(error.response.status === 417){
                    toast.warn(error.response.data.rtn);
                }else {
                    toast.warn(error.response.data);
                }
            })
    }
}


export function batchInitiateDatePopup(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputData.userInfo })
         .then(response => {
            const currentTime = rearrangeDateFormat(inputData.userInfo, response.data?.date);
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: true,
                    operation: "initiate",
                    testStartId:inputData["testStartId"],
                    selectedRecord:inputData.selectedRecord,
                    currentTime:currentTime
                    //activeKey : "IDS_SAMPLE"
                }
            })
         }).catch(error => {
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


export function batchCompleteDatePopup(inputData,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputData.userInfo })
         .then(response => {
            const currentTime = rearrangeDateFormat(inputData.userInfo, response.data?.date);
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: true,
                    operation: "complete",
                    completeId:inputData["completeId"],
                    selectedRecord:inputData.selectedRecord,
                    currentTime:currentTime
                    //activeKey : "IDS_SAMPLE"
                }
            })
         }).catch(error => {
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

export function getInstrumentID(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getInstrumentID", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedInstrument : inputData['selectedInstrument'],
                           // selectedInstrument:undefined,
                            //selectedInstrumentId: undefined,
                            selectedRecord:inputData
                        },
                        loading: false,
                        isselectedrecordempty:false,
                    }
                })
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
    }
}



export function getBatchViewResultAction(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchViewResult", inputData)
        .then(response => {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...inputData.masterData,
                        ...response.data,
                    },
                    loading: false,
                    openModal: false,
                    batchactiveKey : "IDS_RESULTS"
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


// export function batchTAT(nbatchmastercode, userInfo, masterData) {
//     return function (dispatch) {
//         dispatch(initRequest(true));
//         rsapi().post("batchcreation/getBatchTAT",
//             { nbatchmastercode: nbatchmastercode, 
//               userInfo: userInfo,
//               ndesigntemplatemappingcode:masterData.ndesigntemplatemappingcode,
//               nsampletypecode:masterData.defaultSampleType ? masterData.defaultSampleType.nsampletypecode : transactionStatus.NA
//             }) 
//             .then(response => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         masterData: {
//                             ...masterData,
//                             ...response.data,
//                             selectedRecordView : response.data.SelectedBatchmaster
//                         },
//                         loading: false,
//                         batchactiveKey : "IDS_SAMPLE",
//                         operation: "batchTAT",
//                         openModal: true,
//                     }
//                 })
//             })
//             .catch(error => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         loading: false
//                     }
//                 })
//                 if (error.response?.status === 429) {
//                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
//                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
//                } else if (error.response?.status === 401 || error.response?.status === 403) {
//          dispatch({
//            type: UN_AUTHORIZED_ACCESS,
//                        payload: {
//                            navigation: 'forbiddenaccess',
//                            loading: false,
//                            responseStatus: error.response.status
//                        }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }

export function getProductBasedInstrument(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getProductInstrument", inputData)
        //Axios.all(urlArray)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            selectedInstrumentCategory: undefined,
                            selectedInstrumentId: undefined,
                            selectedInstrument:undefined,
                            instrument:undefined,
                            instrumentID:undefined,
                            selectedRecord:inputData
                            // selectedProduct: undefined,
                            // product: undefined
                        },
                        loading: false,
                        isselectedrecordempty:false
                    }
                })
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
    }
}
//ALPD-3399
export function validateEsignforBatch(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    const methodUrl = inputParam["screenData"]["inputParam"]["methodUrl"];

                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    // ALPD-2437 added for Type3 Component. Use selected record to clear esign values
                    if (inputParam["screenData"]["inputParam"]["selectedRecord"]) {

                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["selectedRecord"]["agree"];
                    }
                    if(inputParam["screenData"]["inputParam"]["operation"]==="initiate"){
                        dispatch(batchInitiateAction(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["masterData"]))

                    }
                    else{
                        dispatch(batchCompleteAction(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["masterData"]))

                    }

                }
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
    };
}
//ALPD-4999-To get previously saved filter details when click the filter name,done by Dhanushya RI
export function getBatchCreationFilter(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("batchcreation/getBatchCreationFilter", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData : undefined         
                        },
                        batchactiveKey : "IDS_SAMPLE",
                        loading: false,
                    }
                })
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
    }

}