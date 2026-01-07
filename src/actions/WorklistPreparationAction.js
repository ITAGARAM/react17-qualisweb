import { toast} from 'react-toastify';

import rsapi from '../rsapi';
import { constructOptionList, sortData, reArrangeArrays } from '../components/CommonScript';
import Axios from 'axios';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    initRequest
} from "./LoginAction";
import {
    intl
} from '../components/App';
import { transactionStatus } from '../components/Enumeration';

export function getSectionAndTest(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        //Added by sonia on 06th May 2025 for jira id:ALPD-5769
        if(!Array.isArray(masterData.defaultRegTypeValue)){
            if (masterData.SelectedInsCat !== null) {
                let urlArray = [];
                const Section = rsapi().post("worklist/getSectionAndTest", { "ncontrolCode": ncontrolCode, "userinfo": userInfo, "nregtypecode": masterData.defaultRegTypeValue.nregtypecode, "nregsubtypecode": masterData.defaultRegSubTypeValue.nregsubtypecode })
                urlArray = [Section];
    
    
                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        const SectionMap = constructOptionList(response[0].data || [], "nsectioncode",
                            "ssectionname", undefined, undefined, false);
                        const Section = SectionMap.get("OptionList");
                        let selectedRecord = {};
                        let instrumentCategory = [];
    
    
    
    
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                Section,
                                Test:[],
                                instrumentCategory: instrumentCategory,
                                isOpen: true,
                                selectedRecord: selectedRecord,
                                operation: operation,
                                screenName: screenName,
                                openModal: true,
                                ncontrolCode: ncontrolCode,
                                loading: false,
    
                            }
                        });
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
                            toast.error(intl.formatMessage({
                                id: error.message
                            }));
                        } else {
                            toast.warn(intl.formatMessage({
                                id: error.response.data
                            }));
                        }
                    })
            }
            else {
                toast.warn(intl.formatMessage({ id: "IDS_SECTIONNOTAVALIABLE" }));
            }
        }else{
            toast.warn(intl.formatMessage({ id: "IDS_REGISTRATIONTYPENOTAVALIABLE" }));
        }
        
    }
}




export function getWorklistSample(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode,dataStateSample) {
    return function (dispatch) {

        let urlArray = [];
        const InstrumentCategory = rsapi().post("/worklist/refreshGetForAddComponent", {
            [primaryKeyName]: masterData.selectedWorklist[primaryKeyName],
            "ntestcode": masterData.selectedWorklist['ntestcode'],
            "ntransactionstatus": masterData.defaultFilterStatusValue['ntransactionstatus'],
            "nsampletypecode": masterData.selectedWorklist['nsampletypecode'],
            "nregtypecode": masterData.selectedWorklist['nregtypecode'],
            "nregsubtypecode": masterData.selectedWorklist['nregsubtypecode'],
            "napprovalconfigversioncode": masterData.defaultApprovalVersionValue['napprovalconfigversioncode'],
            "userinfo": userInfo,
            "ncontrolCode": ncontrolCode,
            "nsectioncode": masterData.selectedWorklist['nsectioncode'],
        });
        urlArray = [InstrumentCategory];


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                let expiryDate = undefined;
                let currentTime = undefined;
                masterData={...masterData,addComponentDataList: response[0].data || []};


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        dataState:dataStateSample,
                        activeKey: "IDS_WORKLISTSAMPLE",
                        addedComponentList: [],
                        //addComponentDataList: response[0].data || [],
                        isOpen: true,

                        operation: operation,
                        screenName: screenName,
                        openModal: true,
                        ncontrolCode: ncontrolCode,
                        loading: false,
                        currentTime,
                        expiryDate,addComponentSortedList:[]
                    }
                });
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })
    }

}








export function getRegTypeWorklist(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("worklist/getRegistrationTypeBySampleType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                //responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultSampleTypeValue: inputData.defaultSampleTypeValue,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realApprovalVersionValue:inputData.realApprovalVersionValue,
                        },
                        loading: false
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })
    }
}





export function getWorklistDetail(Worklist, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("worklist/getWorklistSample", {
            nworklistcode: Worklist.nworklistcode,
            ndesigntemplatemappingcode:masterData.ndesigntemplatemappingcode,
            userinfo: userInfo
        })
            .then(response => {
                delete masterData['selectedWorklist']
                masterData['selectedWorklist'] = {}

                masterData['selectedWorklist'] = Worklist


                masterData = {
                    ...masterData,
                    ...response.data
                };
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        activeKey: "IDS_WORKLISTSAMPLE",
                        masterData,
                        operation: null,
                        modalName: undefined,
                        loading: false,
                        dataState: undefined
                    }
                });
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })
    }
}






export function getSectionbaseTest(inputParam, userInfo, masterData,addId) {
    return function (dispatch) {
        if (inputParam.SelectedInsCat !== null) {
            let urlArray = [];
            const Section = rsapi().post("worklist/getSectionbaseTest", { nsectionCode: inputParam.nsectioncode.value,"userinfo": userInfo,"ncontrolCode":addId,"nregtypecode": masterData.defaultRegTypeValue.nregtypecode, "nregsubtypecode": masterData.defaultRegSubTypeValue.nregsubtypecode  })
            urlArray = [Section];


            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    const TestMap = constructOptionList(response[0].data || [], "ntestcode",
                        "stestsynonym", undefined, undefined, false);
                    const Test = TestMap.get("OptionList");
                    let selectedRecord = { ...inputParam };
                    let instrumentCategory = [];
                    //nsectioncode=inputParam.nsectioncode,
                    masterData = {
                        ...masterData,
                    }



                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            Test,
                            instrumentCategory: instrumentCategory,
                            isOpen: true,
                            selectedRecord: selectedRecord,
                            // operation: operation,
                            //screenName: screenName,
                            //openModal: true,
                            //ncontrolCode: ncontrolCode,
                            loading: false,

                        }
                    });
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
                        toast.error(intl.formatMessage({
                            id: error.message
                        }));
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORYNOTAVALIABLE" }));
        }
    }
}


export const getWorklistDetailFilter = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("worklist/getWorklistDetailFilter", inputParam.inputData)
            .then(response => {

                delete inputParam.masterData['Worklist']
                delete inputParam.masterData['WorklistSamples']
                delete inputParam.masterData['WorklistHistory']
                delete inputParam.masterData['selectedWorklist']
                inputParam.masterData['Worklist'] = {}
                inputParam.masterData['WorklistSamples'] = {}
                inputParam.masterData['WorklistHistory'] = {}
                inputParam.masterData['selectedWorklist'] = {}
                inputParam.masterData['Worklist'] = response.data.Worklist
                inputParam.masterData['WorklistSamples'] = response.data.WorklistSamples
                inputParam.masterData['WorklistHistory'] = response.data.WorklistHistory
                inputParam.masterData['selectedWorklist'] = response.data.selectedWorklist
                //const masterData = response.data
                //sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        dataState: undefined,
                        activeKey: "IDS_WORKLISTSAMPLE",
                        masterData: {
                            ...inputParam.masterData,
                            defaultRegSubTypeValue: inputParam.masterData.RegSubTypeValue,
                            FilterStatusValue: inputParam.masterData.defaultFilterStatusValue
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}








export const onWorklistApproveClick = (masterData, userInfo, ConfirmMessage, approvalId,operation) => {
    return (dispatch) => {
        dispatch(initRequest(true));
     //   rsapi().post("worklist/updateWorklistDetail", { "worklist": masterData.selectedWorklist, "userinfo": userInfo, "ncontrolCode": approvalId,"ndesigntemplatemappingcode":masterData.ndesigntemplatemappingcode }
            
       
     
     rsapi().post("worklist/prepareWorklist", { "worklist": masterData.selectedWorklist, "userinfo": userInfo, "ncontrolCode": approvalId,"ndesigntemplatemappingcode":masterData.ndesigntemplatemappingcode })
            .then(response => {

                let Worklist=[];
                Worklist=masterData.Worklist;

                Worklist.map((item,index)=>{
                    if(response.data["selectedWorklist"].nworklistcode===item.nworklistcode){
                        Worklist.splice(index,1)
                        Worklist.splice(index,0,response.data["selectedWorklist"]);
                     }
                     return null;
                    })
              
    
                 masterData = {
                    ...masterData,
                    ...response.data, 
                     Worklist:Worklist
                }

            if(!(masterData.searchedData && masterData.searchedData.length > 0)){
                dispatch({
                    type: DEFAULT_RETURN,
                    activeKey: "IDS_WORKLISTSAMPLE",
                    payload: {
                        loading: false,
                        loadEsign :false,
                        dataState: undefined,
                        openModal:false,
                        openChildModal:false,
                        masterData: {
                            ...masterData
                        }
                    }
                });
            } else{
                let searchedData = reArrangeArrays(masterData["searchedData"], masterData.Worklist, "nworklistcode");
                rsapi().post("worklist/getWorklistSelectSample", { "nworklistcode": searchedData.length > 0 ? searchedData[0].nworklistcode : -1, "userinfo": userInfo,"ndesigntemplatemappingcode":masterData.ndesigntemplatemappingcode, "nneedsampleandhistory": transactionStatus.YES })
                .then(response => {
                    let responseData = response.data;
                    responseData["searchedData"] = searchedData;
                     masterData = {
                        ...masterData, ...responseData
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        activeKey: "IDS_WORKLISTSAMPLE",
                        payload: {
                            loading: false,
                            dataState: undefined,
                            openModal:false,
                            openChildModal:false,
                            loadEsign :false,
                            masterData: {
                                ...masterData
                            }
                        }
                    });
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
                });
            }
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });

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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                }
                else if (error.response.status === 417) {
                    ConfirmMessage.confirm("information", "Information!", error.response.data, undefined, "ok", undefined, true, undefined);
                }
                else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
                //toast.error(error.message);
            });
    }
}



export function getEditSectionAndTest(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {
        if (masterData.SelectedInsCat !== null) {
            let urlArray = [];
            const Section = rsapi().post("worklist/getSectionAndTest", { "ncontrolCode": ncontrolCode, "userinfo": userInfo })
            // const GetEditSetionAndTest={}
            if (operation === "update") {
                const GetEditSetionAndTest = rsapi().post("/worklistpreparation/getEditSectionAndTest", {
                    [primaryKeyName]: masterData.selectedWorklist[primaryKeyName],
                    "userinfo": userInfo
                });

                const TestGet = rsapi().post("worklist/getSectionbaseTest", { nsectionCode: masterData.selectedWorklist["nsectioncode"], "userinfo": userInfo })
                urlArray = [Section, GetEditSetionAndTest, TestGet];
            }
            //urlArray = [Section,GetEditSetionAndTest];


            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    const SectionMap = constructOptionList(response[0].data || [], "nsectioncode",
                        "ssectionname", undefined, undefined, false);
                    const Section = SectionMap.get("OptionList");

                    const TestMap = constructOptionList(response[2].data || [], "ntestcode",
                        "stestsynonym", undefined, undefined, false);
                    const Test = TestMap.get("OptionList");


                    let selectedRecord = {};
                    let instrumentCategory = [];

                    selectedRecord = {
                        "nsectioncode": {
                            "value": response[1].data.nsectioncode,
                            "label": response[1].data.ssectionname
                        },
                        "ntestcode": {
                            "value": response[1].data.ntestcode,
                            "label": response[1].data.stestsynonym
                        }
                    };


                    dispatch({
                        type: DEFAULT_RETURN,
                        activeKey: "IDS_WORKLISTSAMPLE",
                        payload: {
                            masterData: {
                                ...masterData,
                            },
                            Section, Test,
                            instrumentCategory: instrumentCategory,
                            isOpen: true,
                            selectedRecord: selectedRecord,
                            operation: operation,
                            screenName: screenName,
                            openModal: true,
                            ncontrolCode: ncontrolCode,
                            loading: false,



                        }
                    });
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
                        toast.error(intl.formatMessage({
                            id: error.message
                        }));
                    } else {
                        toast.warn(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORYNOTAVALIABLE" }));
        }
    }
}






export const createWorklistCreation = (inputParam, masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("worklist/createWorklistCreation", inputParam.inputData)
            .then(response => {

                delete inputParam.masterData['WorklistSamples']
                inputParam.masterData['WorklistSamples'] = {}

                inputParam.masterData['WorklistSamples'] = response.data.WorklistSamples
                delete inputParam.masterData['WorklistHistory']
                inputParam.masterData['WorklistHistory'] = {}

                inputParam.masterData['WorklistHistory'] = response.data.WorklistHistory

                //const masterData = response.data
                //sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        openModal: false,
                        dataState: undefined,
                        addedComponentList: [],
                        addComponentSortedList:[],
                        masterData: {
                            ...inputParam.masterData,
                        }
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                // toast.error(error.message);
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
                    toast.error(intl.formatMessage({
                        id: error.message
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            });
    }
}




export function getConfigVersionTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("worklist/getApprovalConfigVersionByRegSubType", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            RegSubTypeValue: inputParam.masterData.RegSubTypeValue,
                            RegistrationSubTypeList: inputParam.masterData.RegistrationSubTypeList,
                            realApprovalConfigVersionList:inputParam.inputData.realApprovalConfigVersionList,
                            realApprovalVersionValue:inputParam.inputData.realApprovalVersionValue,
                            //nneedsubsample:inputParam.masterData.realRegSubTypeValue.nneedsubsample
                        },
                        loading: false,
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




export function ViewSampleDetails(masterData, screenName, userInfo, viewdetails) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("worklist/getSampleViewDetails", { selectedRecord: masterData.selectedWorklist, PatientId: viewdetails["Patient Id"], npreregno: viewdetails["npreregno"], userinfo: userInfo })
            .then(response => {
                //  masterData = {
                //     ...masterData,
                //     ...response.data
                // }
                masterData['AuditModifiedComments'] = [];
                masterData['AuditModifiedComments'] = response.data['AuditModifiedComments']
                masterData['viewdetails'] = [];
                masterData['viewdetails'] = response.data['viewdetails'][0]
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        //viewdetails:viewdetails,
                        masterData,
                        screenName: "IDS_PREVIOUSRESULTVIEW",
                        operation: "",
                        loading: false,
                        openModal: true,

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


export function getWorklisthistoryAction(inputData) {

    return function (dispatch) {



        dispatch(initRequest(true));

        rsapi().post("worklist/getWorklisthistory", inputData)

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

                        activeKey: "IDS_WORKLISTHISTORY"

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

export function getRegSubTypeWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("worklist/getRegistrationsubTypeByRegType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            //defaultRegTypeValue: inputData.defaultRegTypeValue
                            RegTypeValue: inputData.masterData.RegTypeValue,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realApprovalVersionValue:inputData.realApprovalVersionValue,
                        },
                        loading: false
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


export const reportWorklist = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("worklist/worklistReportGenerate", {
            ...inputParam,
            nworklistcode: inputParam.nworklistcode
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showConfirmAlert: false
                    }
                })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
            }).catch(error => {
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

export function insertWorklist(inputParam,masterData){
    return (dispatch) => {
        dispatch(initRequest(true));
        let requestUrl = '';
        requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });

        requestUrl.then(response => {
            

           if(masterData.searchedData!==undefined){
            masterData.searchedData=undefined;
           }
           let Worklist=[];
            Worklist=masterData.Worklist;
           Worklist.unshift(response.data["selectedWorklist"]);
           //  Worklist={...Worklist};
                masterData = {
                    ...masterData, ...response.data,
                    Worklist:Worklist
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                        },
                        loading: false,
                        loadEsign: false,
                        openModal: false
                       
                    }
                })
             
            }).catch(error => {
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
export function validateEsignforWorklist(inputParam,modalName,ConfirmMessage) {
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
                   
                        dispatch(onWorklistApproveClick(inputParam["screenData"]["masterData"],inputParam["screenData"]["inputParam"]["inputData"]["userinfo"],ConfirmMessage,inputParam["screenData"]["inputParam"]["inputData"]["ncontrolCode"],inputParam["screenData"]["inputParam"]["operation"] ))


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

export function getWorklistFilterDetails(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("worklist/getWorklistFilterDetails", { ...inputParam.inputData })
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    ...response.data
                }
                         
                sortData(masterData,"","nfilternamecode");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        nfilternamecode:inputParam.inputData.nfilternamecode,
                        masterData,
                        loading: false,                
                        modalShow:false,
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
