import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import {
    constructOptionList, replaceUpdatedObject, sortData, fillRecordBasedOnCheckBoxSelection, getSameRecordFromTwoArrays,
    getRecordBasedOnPrimaryKeyName, filterRecordBasedOnPrimaryKeyName, reArrangeArrays, rearrangeDateFormat, convertDateTimetoStringDBFormat
} from '../components/CommonScript';
import { postCRUDOrganiseTransSearch } from './ServiceAction';
import Axios from 'axios';
import { checkBoxOperation, transactionStatus } from '../components/Enumeration';
import {
    intl
} from '../components/App'
export function getRegTypeJobAllocation(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getRegistrationTypeBySampleType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultSampleTypeValue: inputData.defaultSampleTypeValue,
                            realDesignTemplateMappingValue: inputData.realDesignTemplateMappingValue,
                            realDynamicDesignMappingList: inputData.realDynamicDesignMappingList
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

export function getRegSubTypeJobAllocation(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getRegistrationsubTypeByRegType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultRegTypeValue: inputData.defaultRegTypeValue,
                            realDesignTemplateMappingValue: inputData.realDesignTemplateMappingValue,
                            realDynamicDesignMappingList: inputData.realDynamicDesignMappingList
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

export function getAppConfigVersionJobAllocation(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getApprovalConfigVersionByRegSubType", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            defaultRegSubTypeValue: inputParam.masterData.defaultRegSubTypeValue,
                            RegSubTypeValue: inputParam.masterData.realRegSubTypeValue,
                            realDesignTemplateMappingValue: inputParam.inputData.realDesignTemplateMappingValue,
                            realDynamicDesignMappingList: inputParam.inputData.realDynamicDesignMappingList
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

export function getSectionJobAllocation(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getTestComboBySection", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultUserSectionValue: inputData.masterData.defaultUserSectionValue,
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

export function getFilterStatusJobAllocation(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getTestComboBySection", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultFilterStatusValue: inputData.masterData.defaultFilterStatusValue,
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

export function getFilterStatusSectionJobAllocation(inputData) {
    return function (dispatch) {
        const testStatusService = rsapi().post("joballocation/getFilterStatusByApproveVersion", inputData);
        const sectionService = rsapi().post("joballocation/getSectionByApproveVersion", inputData);
        let urlArray = [];
        urlArray = [testStatusService, sectionService];
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            defaultApprovalVersionValue: inputData.masterData.defaultApprovalVersionValue,
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

export function getDesignTemplateJobAllocation(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getDesignTemplateByApprovalConfigVersion", inputParam)
            .then(response => {

                if (response.data["Success"]) {
                    toast.warn(response.data.Success);
                }

                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            defaultApprovalVersionValue: inputParam.masterData.defaultApprovalVersionValue,
                            ApprovalVersionValue: inputParam.masterData.realApprovalVersionValue,
                            realDesignTemplateMappingValue: inputParam.realDesignTemplateMappingValue,
                            realDynamicDesignMappingList: inputParam.realDynamicDesignMappingList
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

export function getTestStatusJobAllocation(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getFilterStatusByApproveVersion", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegSubTypeValue: inputData.RegSubTypeValue
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
//ALPD-4755-To get previously save filter details when click the filter name,done by Dhanushya RI
export function getJobAllcationFilterSubmit(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getJobAllocationDetails", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null) {
                    inputParam.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null) {
                    inputParam.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null) {
                    inputParam.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showTest: inputParam.inputData.showTest,
                        activeTestTab: inputParam.inputData.activeTestTab,
                        showFilter: false,
                        sampleskip: 0,
                        sampletake: inputParam.sampletake,
                        subsampleskip: 0,
                        subsampletake: inputParam.subsampletake,
                        testskip: 0,
                        testtake: inputParam.testtake,
                        documentDataState: { ...inputParam.documentDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParam.testCommentDataState, sort: undefined, filter: undefined },
                        filterSubmitValueEmpty: false   // ALPD-5908  Added filterSubmitValueEmpty by Vishakh for advance filter submit with empyty values enhancement(01-07-2025)
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

export function ReceiveinLabStatusWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/CreateReceiveinLab", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_SAMPLE"], inputParam.inputData.masterData.JA_SAMPLE, "nregistrationsectioncode");
                    replaceUpdatedObject(response.data["JA_SUBSAMPLE"], inputParam.inputData.masterData.JA_SUBSAMPLE, "ntransactionsamplecode");
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");

                    delete response.data["JA_SAMPLE"];
                    delete response.data["JA_SUBSAMPLE"];
                    delete response.data["JA_TEST"];
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data,
                        JASelectedSample: replaceUpdatedObject(response.data["JASelectedSample"], inputParam.inputData.masterData.JASelectedSample, "nregistrationsectioncode"),
                        JASelectedSubSample: replaceUpdatedObject(response.data["JASelectedSubSample"], inputParam.inputData.masterData.JASelectedSubSample, "ntransactionsamplecode"),
                        JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode"),
                    }
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
                }


            })
            .catch(error => {
                //toast.error(error.message); 
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

export function getAllottedTestWise(inputParam, type) {
    return function (dispatch) {
        let urlArray = [];

        const AllotDetails = rsapi().post("joballocation/getAllotDetails", { ...inputParam.inputData, calenderViewAfterAllot: type });



        if (inputParam.inputData.nselecttype === 1) {
            const RescheduleEditById = rsapi().post("joballocation/getRescheduleEdit",
                {
                    "npreregno": inputParam.inputData.npreregno, "ntransactionsamplecode": inputParam.inputData.ntransactionsamplecode,
                    "transactiontestcode": inputParam.inputData.transactiontestcode, ...inputParam.inputData
                });

            urlArray = [AllotDetails, RescheduleEditById];

        } else {
            if (type === 2) {
                const calenderProperties = rsapi().post("joballocation/calenderProperties", {...inputParam.inputData,startDate:convertDateTimetoStringDBFormat(new Date(), inputParam.inputData.userinfo)});
                urlArray = [AllotDetails, calenderProperties];
            } else {
                urlArray = [AllotDetails];
            }

        }

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};

                const TechniqueMap = constructOptionList(response[0].data.Technique || [], "ntechniquecode", "stechniquename", undefined, undefined, false);
                const Technique = TechniqueMap.get("OptionList");

        

                const UsersPeriodMap = constructOptionList(response[0].data.Period || [], "nuserperiodcode", "speriodname", undefined, undefined, false);
                const UsersPeriod = UsersPeriodMap.get("OptionList");

                const InstrumentCategoryMap = constructOptionList(response[0].data.InstrumentCategory || [], "ninstrumentcatcode", "sinstrumentcatname", undefined, undefined, false);
                const InstrumentCategory = InstrumentCategoryMap.get("OptionList");

                const InstrumentNameMap = constructOptionList(response[0].data.InstrumentName || [], "ninstrumentnamecode", "sinstrumentname", undefined, undefined, false);
                const InstrumentName = InstrumentNameMap.get("OptionList");

                const InstrumentIdMap = constructOptionList(response[0].data.InstrumentId || [], "ninstrumentcode", "sinstrumentid", undefined, undefined, false);
                const InstrumentId = InstrumentIdMap.get("OptionList");

                const InstrumentPeriodMap = constructOptionList(response[0].data.Period || [], "ninstrumentperiodcode", "speriodname", undefined, undefined, false);
                const InstrumentPeriod = InstrumentPeriodMap.get("OptionList");
              
                const SectionPeriodMap = constructOptionList(response[0].data.RescheduleSection || [], "nsectioncode", "ssectionname", undefined, undefined, false);
                const RescheduleSection = SectionPeriodMap.get("OptionList");

                const currentTime = rearrangeDateFormat(inputParam.inputData.userinfo, response[0].data.CurrentTime.body);
                let UsersMap =[];
                let Users =[];
                
               
               
                

                 if(inputParam.inputData.nselecttype==1&&response[0]&&response[0].data&&response[0].data.Users===undefined){
                    UsersMap=constructOptionList(response[1].data.Users || [], "nusercode", "susername", undefined, undefined, false);
                    Users = UsersMap.get("OptionList");
                }else{
                    UsersMap=constructOptionList(response[0].data.Users || [], "nusercode", "susername", undefined, undefined, false);
                    Users = UsersMap.get("OptionList");
                }

                if (inputParam.inputData.nselecttype === 1) {
                    const editData = response[1].data.JobAllocation;

                    selectedRecord["ninstrumentcatcode"] = {
                        "value": editData["ninstrumentcategorycode"],
                        "label": editData["sinstrumentcatname"]
                    };

                    editData["ninstrumentcategorycode"] !== -1 ?
                        selectedRecord["ninstrumentnamecode"] = {
                            "value": editData["ninstrumentnamecode"],
                            "label": editData["sinstrumentname"]
                        } : selectedRecord["ninstrumentnamecode"] = "";


                    editData["ninstrumentcategorycode"] !== -1 ?
                        selectedRecord["ninstrumentcode"] = {
                            "value": editData["ninstrumentcode"],
                            "label": editData["sinstrumentid"]
                        } : selectedRecord["ninstrumentcode"] = "";

                    editData["ninstrumentcategorycode"] !== -1 ?
                        selectedRecord["ninstrumentperiodcode"] = {
                            "value": editData["ninstrumentperiodcode"],
                            "label": editData["sinstrumentperiodname"]
                        } : selectedRecord["ninstrumentperiodcode"] = "";

                    editData["ninstrumentcategorycode"] !== -1 ?
                        selectedRecord["dinstblockfromdatetime"] = rearrangeDateFormat(inputParam.inputData.userinfo, editData.instrumentstartdate) :
                        selectedRecord["dinstblockfromdatetime"] = "";

                    editData["ninstrumentcategorycode"] !== -1 ?
                        selectedRecord["sinstrumentholdduration"] = editData.sinstrumentholdduration : selectedRecord["sinstrumentholdduration"] = "";

                    selectedRecord["scomments"] = editData.comments;
                    selectedRecord["suserholdduration"] = editData.suserholdduration;
                    selectedRecord["duserblockfromdatetime"] = rearrangeDateFormat(inputParam.inputData.userinfo, editData.userstartdate);

                    editData["ntechniquecode"] !== -1 ?
                        selectedRecord["ntechniquecode"] = {
                            "value": editData["ntechniquecode"],
                            "label": editData["stechniquename"]
                        } : selectedRecord["ntechniquecode"] = "";

                    selectedRecord["nusercode"] = {
                        "value": editData["nusercode"],
                        "label": editData["susername"]
                    };
                    selectedRecord["nuserperiodcode"] = {
                        "value": editData["nuserperiodcode"],
                        "label": editData["suserperiodname"]
                    };
                    selectedRecord["nsectioncode"] = {
                        "value": editData["nsectioncode"],
                        "label": editData["ssectionname"]
                    };

                    selectedRecord = { ...selectedRecord }
                } else if (type !== 2) {
                    selectedRecord["scomments"] = "";
                    selectedRecord["suserholdduration"] = "";
                    selectedRecord["sinstrumentholdduration"] = "";
                    selectedRecord["duserblockfromdatetime"] = new Date();
                }
                //Added by sonia on 8th Aug 2024 for JIRA ID:ALPD-4563
                //if(inputParam.inputData.controlAction ===3){
                    if(inputParam.inputData.operation==="Reschedule" && inputParam.inputData.nselecttype===2 ){
                        selectedRecord["nsectioncode"] = {
                            "value": response[0].data.RescheduleSection[0]["nsectioncode"],
                            "label": response[0].data.RescheduleSection[0]["ssectionname"]
                        };
                    }
                //}
                
                

                let calenderProperties = []
                let calenderColor = []
                let calenderCommonHolidays1 = {}
                let calenderPublicHolidays = []
                let calenderUserHolidays = []
                if (type === 2) {
                    calenderProperties = response[1].data.calenderSettings
                    calenderColor = response[1].data.calenderColor
                    calenderPublicHolidays= response[1].data.calenderPublicHolidays||[]
                    calenderCommonHolidays1 = response[1].data.calenderCommonHolidays.length>0?response[1].data.calenderCommonHolidays[0]:{};

                    calenderPublicHolidays = calenderPublicHolidays.map((dataItem, i) => {
                        return {
                            start: new Date(dataItem.dcalenderholidaystartdate),
                            end: new Date(dataItem.dcalenderholidayenddate),
                            title: dataItem.sdescription,
                            id: dataItem.id ? dataItem.id : i,
                            startTimezone: dataItem.startTimezone,
                            endTimezone: dataItem.endTimezone,
                            description:  dataItem.sdescription,
                            Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
                            InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,
                            isCalenderHolidays: true,
                            color: "#babaff",
                            startDateor: convertDateTimetoStringDBFormat(new Date(dataItem.dcalenderholidaystartdate), inputParam.inputData.userinfo),
                            endDateor: convertDateTimetoStringDBFormat(new Date(dataItem.dcalenderholidayenddate), inputParam.inputData.userinfo),
                            stestsynonym: "-",
                            ntransactionstatus: -1,
                            stransdisplaystatus:"-",
                        }
                    });

                //     calenderUserHolidays = calenderUserHolidays.map((dataItem, i) => {
                //         return {
                //             start: new Date(dataItem.dcalenderholidaystartdate),
                //             end: new Date(dataItem.dcalenderholidayenddate),
                //             title: dataItem.sdescription,
                //             id: dataItem.id ? dataItem.id : i,
                //             startTimezone: dataItem.startTimezone,
                //             endTimezone: dataItem.endTimezone,
                //             description:  dataItem.sdescription,
                //             Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
                //             InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,
                //             isCalenderHolidays: true,
                //             color: "#babaff",
                //             startDateor: convertDateTimetoStringDBFormat(new Date(dataItem.dcalenderholidaystartdate), inputParam.inputData.userinfo),
                //             endDateor: convertDateTimetoStringDBFormat(new Date(dataItem.dcalenderholidayenddate), inputParam.inputData.userinfo),
                //             stestsynonym: "-",
                //             ntransactionstatus: -1,
                //             stransdisplaystatus:"-",
                //         }
                //     });

                 }

        

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        Technique,
                        Users,
                        UsersPeriod,
                        InstrumentCategory,
                        InstrumentName,
                        InstrumentId,
                        InstrumentPeriod,
                        currentTime,
                        selectedRecord,
                        openModal: true,
                        isOpen: true,
                        operation: inputParam.inputData.operation,
                        screenName: inputParam.inputData.screenName,
                        ncontrolCode: inputParam.inputData.ncontrolcode,
                        loading: false,
                        calenderProperties,
                        calenderColor,
                        calenderPublicHolidays: calenderPublicHolidays,
                        holidaydateRestrict:calenderProperties.filter(x => x.ncalendersettingcode === 65).length > 0 ? calenderProperties.filter(x => x.ncalendersettingcode === 65)[0]["scalendersettingvalue"] === "3" ? true : false : true,
                        personalLeaveRestrict: calenderProperties.filter(x => x.ncalendersettingcode === 66).length > 0 ? calenderProperties.filter(x => x.ncalendersettingcode === 66)[0]["scalendersettingvalue"] === "3" ? true : false : true,
                        calenderUserHolidays:calenderUserHolidays,
                        calenderCommonHolidays1,
                        commonHolidaydateRestrict:calenderProperties.filter(x => x.ncalendersettingcode === 67).length > 0 ? calenderProperties.filter(x => x.ncalendersettingcode === 67)[0]["scalendersettingvalue"] === "3" ? true : false : true,   
                        RescheduleSection
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

export function getAllotAnotherUserTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getAllotAnotherUserDetails", inputParam.inputData)
            .then(response => {

                const UsersMap = constructOptionList(response.data.Users || [], "nusercode",
                    "susername", undefined, undefined, false);

                const UsersPeriodMap = constructOptionList(response.data.Period || [], "nuserperiodcode",
                    "speriodname", undefined, undefined, false);

                const Users = UsersMap.get("OptionList");
                const UsersPeriod = UsersPeriodMap.get("OptionList");

                const currentTime = rearrangeDateFormat(inputParam.inputData.userinfo, response.data.CurrentTime.body);
                const Technique = response.data.Technique && response.data.Technique[0].stechniquename;
                const TechniqueCode = response.data.Technique && response.data.Technique[0].ntechniquecode;
                let selectedRecord = {};
                selectedRecord["scomments"] = "";
                selectedRecord["suserholdduration"] = "";
                selectedRecord["sinstrumentholdduration"] = "";
                selectedRecord["duserblockfromdatetime"] = new Date();

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Technique,
                        TechniqueCode,
                        Users,
                        UsersPeriod,
                        currentTime,
                        selectedRecord,
                        isOpen: true,
                        operation: inputParam.inputData.operation,
                        screenName: inputParam.inputData.screenName,
                        openModal: true,
                        ncontrolCode: inputParam.inputData.ncontrolcode,
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

export function getInstrumentName(ninstrumentcatcode, ncalibrationreq, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getInstrumentNameBasedCategory", {
            "ninstrumentcatcode": ninstrumentcatcode, "ncalibrationreq": ncalibrationreq, "userinfo": userInfo
        })
            .then(response => {
                let InstrumentName = [];

                const InstrumentNameMap = constructOptionList(response.data.InstrumentName || [], "ninstrumentnamecode", "sinstrumentname", undefined, undefined, false);
                InstrumentName = InstrumentNameMap.get("OptionList");

                selectedRecord["ninstrumentnamecode"] ="";
                selectedRecord["ninstrumentcode"] ="";
                if (ninstrumentcatcode !== transactionStatus.NA) {
                    selectedRecord["dinstblockfromdatetime"] = new Date();
                } else {
                    selectedRecord["dinstblockfromdatetime"] = "";
                }



                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        InstrumentName,
                        selectedRecord,InstrumentId : [],
                        loading: false

                    }
                });

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


export function getInstrumentId(ninstrumentcatcode, ninstrumentnamecode, ncalibrationreq, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getInstrumentIdBasedCategory", {
            "ninstrumentcatcode": ninstrumentcatcode, "ninstrumentnamecode": ninstrumentnamecode, "ncalibrationreq": ncalibrationreq, "userinfo": userInfo
        })
            .then(response => {
                let InstrumentId = [];
                const InstrumentIdMap = constructOptionList(response.data.InstrumentId || [], "ninstrumentcode", "sinstrumentid", undefined, undefined, false);
                InstrumentId = InstrumentIdMap.get("OptionList");

                selectedRecord["ninstrumentcode"] ="";
                // if (ninstrumentcatcode !== transactionStatus.NA) {
                //     selectedRecord["dinstblockfromdatetime"] = new Date();
                // } else {
                //     selectedRecord["dinstblockfromdatetime"] = "";
                // }


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        InstrumentId,
                        selectedRecord,
                        loading: false

                    }
                });

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

export function getUsers(ntechniquecode, JASelectedTest, userInfo, selectedRecord, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getUsersBasedTechnique", {
            "ntechniquecode": ntechniquecode,
          //  "ssectioncode": JASelectedTest.JASelectedSample ? JASelectedTest.JASelectedSample.map(sample => sample.nsectioncode).join(",") : "",
          "ssectioncode":selectedRecord["nsectioncode"]?selectedRecord["nsectioncode"].value.toString():JASelectedTest.JASelectedSample ? JASelectedTest.JASelectedSample.map(sample => sample.nsectioncode).join(",") : "",
          "nregtypecode": JASelectedTest.realRegTypeValue.nregtypecode,
            "nregsubtypecode": JASelectedTest.realRegSubTypeValue.nregsubtypecode,
            "userinfo": userInfo
        })
            .then(response => {
                let Users = [];
                const UsersMap = constructOptionList(response.data.Users || [], "nusercode", "susername", undefined, undefined, false);
                Users = UsersMap.get("OptionList");
                selectedRecord["nusercode"] = "";


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        // masterData:{...masterData},
                        Users,
                        selectedRecord,
                        loading: false

                    }
                });

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

export function ViewAnalystCalendar(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/viewAnalystCalendar", (inputParam.inputData))
            .then(response => {
                let masterData = {
                    ...inputParam.inputData.masterData,
                    ...response.data,
                }
                let Users = [];
                const UsersMap = constructOptionList(response.data.Users || [], "nusercode", "susername", undefined, undefined, false);
                Users = UsersMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        Users,
                        screenName: inputParam.inputData.screenName,
                        loading: false,
                        openModal: true,
                        masterData,


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
export function CancelTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/cancelTest", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");
                    delete response.data["JA_TEST"];
                    fillRecordBasedOnCheckBoxSelection(inputParam.inputData.masterData, response.data, ["TestView"], 3, "ntransactiontestcode", []);
                    let masterData = {
                        ...inputParam.inputData.masterData,
                       
                        ...response.data,
                        JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode"),
                        TestView: inputParam.inputData.masterData.TestView
                    }
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function AllotJobAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/AllotJobCreate", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");
                    delete response.data["JA_TEST"];
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data,
                        JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode"),
                        TestView: replaceUpdatedObject(response.data["TestView"], inputParam.inputData.masterData.TestView, "ntransactiontestcode")
                    }
                    let respObject = {
                        ...inputParam.inputData,
                        masterData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function AllotAnotherUserAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/AllotAnotherUserCreate", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");
                    delete response.data["JA_TEST"];
                    fillRecordBasedOnCheckBoxSelection(inputParam.inputData.masterData, response.data, ["TestView"], 3, "ntransactiontestcode", []);
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data,
                        JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode"),
                        TestView: inputParam.inputData.masterData.TestView
                    }
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function RescheduleJobAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/RescheduleCreate", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");
                        if(parseInt(inputParam.inputData.nsectioncode)===parseInt(inputParam.inputData.nfiltersectioncode)){
 						delete response.data["JA_TEST"];
						}
                    fillRecordBasedOnCheckBoxSelection(inputParam.inputData.masterData, response.data, ["TestView"], 3, "ntransactiontestcode", []);
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data,
                        
                        TestView: inputParam.inputData.masterData.TestView
                    }
                    let UserSection = [];
                    const UserSectionMap = constructOptionList(response.data.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, false);
                    UserSection = UserSectionMap.get("OptionList");

                    if(parseInt(inputParam.inputData.nsectioncode)===parseInt(inputParam.inputData.nfiltersectioncode)){
                        masterData={...masterData,JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode")}
                    }
                    let respObject = {
                        UserSection,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                     respObject={...respObject,    masterData}
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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
                    toast.info(error.response.data);
                }
            })
    }
}


export function getJobAllocationSubSampleDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        //console.log("response :");
        let arr = [];
        // const vals= inputData.JASelectedSample && inputData.JASelectedSample.filter(
        // (item,index) => 
        // item.nsectioncode!==inputData.JASelectedSample[inputData.JASelectedSample.lastIndexOf(inputData.JASelectedSample[index])].nsectioncode
        // );

        inputData.JASelectedSample && inputData.JASelectedSample.map((item) => {
            if (!arr.includes(item.nsectioncode)) {
                arr.push(item.nsectioncode)
            }
        }
        )

        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.JASelectedSample && inputData.JASelectedSample.map(sample => sample.npreregno).join(","),
            nregistrationsectioncode: inputData.nregistrationsectioncode,
            // ssectioncode : inputData.JASelectedSample && inputData.JASelectedSample.map(sample => sample.nsectioncode).join(","),
            nsectioncode: arr.map(item => item).join(","),
            ntransactionstatus: String(inputData.ntransactionstatus),
            ntransactiontestcode: "0",
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: inputData.napprovalversioncode,
            fromdate: inputData.fromdate,
            todate: inputData.todate,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            activeSubSampleTab: inputData.activeSubSampleTab,
            nneedsubsample: inputData.masterData.realRegSubTypeValue.nneedsubsample,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: inputData.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
            checkBoxOperation: inputData.checkBoxOperation
        }
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("joballocation/getJobAllocationSubSampleDetails", { ...inputParamData, checkBoxOperation: inputData.checkBoxOperation })
                .then(response => {
                    if(response.data['JA_TEST']&&response.data['JA_TEST'].length===0){
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false
                            }
                        })
                        toast.warn(intl.formatMessage({
                            id: "IDS_TESTISNOTAVAILABLE"
                        }));
                    }
                    else{
                    let responseData = { ...response.data }
                    responseData = sortData(responseData, 'descending', 'ntransactionsamplecode')
                    // sortData(response.data);
                    let oldSelectedTest = inputData.masterData.JASelectedTest;
                    let oldSelectedSubSample = inputData.masterData.JASelectedSubSample;

                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "nregistrationsectioncode", inputData.removeElementFromArray);

                    // inputData.masterData.JA_SUBSAMPLE = response.data.JA_SUBSAMPLE;  
                    // inputData.masterData.JASelectedSubSample=response.data.JASelectedSubSample;
                    // inputData.masterData.JA_TEST = response.data.JA_TEST;  
                    // inputData.masterData.JASelectedTest=response.data.JASelectedTest;
                    // inputData.masterData.RegistrationAttachment =response.data.RegistrationAttachment;
                    // inputData.masterData.RegistrationSampleAttachment =response.data.RegistrationSampleAttachment;
                    // inputData.masterData.RegistrationComment =response.data.RegistrationComment;
                    // inputData.masterData.RegistrationSampleComment =response.data.RegistrationSampleComment;
                    let masterData = {
                        ...inputData.masterData,
                        JASelectedTest: inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [],
                        JASelectedSample: inputData.JASelectedSample
                    }

                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = "";
                        masterData['searchedSubSample'] = undefined
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTest'] = undefined
                    }
                    let {
                        testskip,
                        testtake,
                        subsampleskip, subsampletake,
                        sampleskip, sampletake
                    } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.JA_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    //     bool = true
                    // }
                    subsampleskip = 0;
                    // bool = true
                    // if (bool) {
                    skipInfo = {
                        testskip,
                        testtake,
                        subsampleskip, subsampletake,
                        sampleskip, sampletake
                    }
                    // }
                    let RegistrationTestAttachment = [];
                    let RegistrationTestComment = [];
                    let TestView = [];
                    let RegistrationComment = [];
                    let RegistrationSampleAttachment = [];

                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {


                        let wholeSubSampleList = masterData.JA_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubSampleList.includes(item.ntransactionsamplecode)
                        );
                        //ALPD-3398
                        // oldSelectedSubSample.forEach((subsample, index) => {
                        //     if (!wholeSubSampleList.includes(subsample.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }

                        // })
                        if (oldSelectedSubSample.length > 0) {
                            masterData = {
                                ...masterData,
                                JASelectedSubSample: oldSelectedSubSample
                            }
                        }


                        let wholeTestList = masterData.JA_TEST.map(b => b.ntransactiontestcode)
                        oldSelectedTest = oldSelectedTest.filter(item =>
                            wholeTestList.includes(item.ntransactiontestcode)
                        );
                        //ALPD-3398
                        // oldSelectedTest.map((test, index) => {
                        //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        //         oldSelectedTest.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        let keepOld = false;
                        let ntransactiontestcode;
                        let npreregno;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                JASelectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = masterData.JASelectedTest[0].ntransactiontestcode;
                            npreregno = masterData.JASelectedSample[0].npreregno;
                        }
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;

                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;

                            case "IDS_TESTVIEW":
                                TestView = keepOld ? inputData.masterData.TestView : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestView, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestView"
                                dataStateName = "testViewDataState"
                                break;

                            default:
                                RegistrationComment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "npreregno")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = " testAttachmentDataState"
                                break;
                        }


                        // } else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                        let list = []
                        let dbData = [];
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_TESTVIEW":
                                dbData = response.data.TestView || []
                                list = [...inputData.masterData.TestView, ...dbData];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_SAMPLECOMMENTS":
                                dbData = response.data.RegistrationComment || []
                                list = [...inputData.masterData.RegistrationComment, ...dbData];
                                RegistrationComment = getRecordBasedOnPrimaryKeyName(list, inputData.JASelectedSample.length > 0 ? inputData.JASelectedSample[0].npreregno : "", "npreregno")
                                break;
                            default:
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                    }
                    //else if (inputData.checkBoxOperation === 7) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                        let list = []
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;

                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;

                            case "IDS_TESTVIEW":
                                list = response.data.TestView ? sortData(response.data.TestView, 'descending', 'ntransactiontestcode') : [];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestView"
                                dataStateName = "testViewDataState"
                                break;

                            case "IDS_SAMPLECOMMENTS":

                                RegistrationComment = response.data.RegistrationComment ? [...response.data.RegistrationComment] : [];
                                activeName = "RegistrationComment"
                                dataStateName = "sampleCommentsDataState"
                                break;
                            default:
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;

                        }

                    }
                    else {
                        let list = []
                        if (!inputData.masterData.realRegSubTypeValue.nneedsubsample) {
                            let wholeTestList = masterData.JA_TEST.map(b => b.ntransactiontestcode)
                            oldSelectedTest = oldSelectedTest.filter(item =>
                                wholeTestList.includes(item.ntransactiontestcode)
                            );
                            //ALPD-3398
                            // oldSelectedTest.map((test, index) => {
                            //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            //         oldSelectedTest.splice(index, 1)
                            //     }
                            //     return null;
                            // })
                            let keepOld = false;
                            let ntransactiontestcode;
                            if (oldSelectedTest.length > 0) {
                                keepOld = true
                                masterData = {
                                    ...masterData,
                                    JASelectedTest: oldSelectedTest
                                }
                            } else {
                                ntransactiontestcode = masterData.JASelectedTest[0].ntransactiontestcode
                            }
                        }
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;

                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;

                            case "IDS_TESTVIEW":
                                list = response.data.TestView ? sortData(response.data.TestView, 'descending', 'ntransactiontestcode') : [];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestView"
                                dataStateName = "testViewDataState"
                                break;

                            case "IDS_SAMPLECOMMENTS":
                                list = response.data.RegistrationComment ? sortData(response.data.RegistrationComment, 'descending', 'nregcommentcode') : [];
                                RegistrationComment = getRecordBasedOnPrimaryKeyName(list, inputData.JASelectedSample.length > 0 ? inputData.JASelectedSample[0].npreregno : "", "npreregno")
                                activeName = "RegistrationComment"
                                dataStateName = "sampleChangeDataState"
                                break;

                            case "IDS_SUBSAMPLEATTACHMENTS":
                                list = response.data.RegistrationSampleAttachment ? sortData(response.data.RegistrationSampleAttachment, 'descending', 'nsampleattachmentcode') : [];
                                RegistrationSampleAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JASelectedSubSample.length > 0 ? inputData.masterData.JASelectedSubSample[0].ntransactionsamplecode : "", "ntransactionsamplecode")
                                activeName = "RegistrationSampleAttachment"
                                dataStateName = "subsampleAttachmentDataState"
                                break;

                            default:
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;
                        }
                    }

                    masterData = {
                        ...masterData,
                        RegistrationTestAttachment,
                        RegistrationTestComment,
                        TestView,
                        RegistrationComment,
                        RegistrationSampleAttachment
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            secondarySelection: inputData["secondarySelection"],
                            loading: false,
                            // sampleskip: undefined,
                            // sampletake: undefined,
                            ...skipInfo,
                            activeTabIndex: inputData.activeTabIndex
                        }
                    })
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
                });
        } else {
            let oldSelectedTest = inputData.masterData.JASelectedTest
            let oldSelectedSubSample = inputData.masterData.JASelectedSubSample
            let { subsampletake, subsampleskip } = inputData;
            let skipInfo = {};
            let TestSelected = [];
            let subSampleSelected = [];
            if (inputData["statusNone"]) {
                TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedTest, inputData.removeElementFromArray[0].nregistrationsectioncode, "nregistrationsectioncode");
                subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedSubSample, inputData.removeElementFromArray[0].nregistrationsectioncode, "nregistrationsectioncode");
            }
            else {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedTest, inputData.removeElementFromArray[0].nregistrationsectioncode, "nregistrationsectioncode");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedSubSample, inputData.removeElementFromArray[0].nregistrationsectioncode, "nregistrationsectioncode");
            }

            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.JASelectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "nregistrationsectioncode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode.toString() : "";
                let JASelectedSample = inputData.JASelectedSample;
                let JASelectedTest = inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [];
                let JASelectedSubSample = inputData.masterData.JA_SUBSAMPLE


                if (inputData.masterData.realRegSubTypeValue.nneedsubsample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.JA_SUBSAMPLE, "ntransactionsamplecode");
                    JASelectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.JA_SUBSAMPLE[0]];
                    if (inputData.masterData.JA_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }
                }
                let ntransactionsamplecode = JASelectedSubSample.map(subsample => subsample.ntransactionsamplecode).join(',');
                let npreregno = inputData.JASelectedSample && inputData.JASelectedSample.map(sample => sample.npreregno).join(',');
                let nsectioncode = inputData.JASelectedSample && inputData.JASelectedSample.map(sample => sample.nsectioncode).join(',');
                let masterData = { ...inputData.masterData, JASelectedSample, JASelectedSubSample, JASelectedTest }
                inputData = {
                    ...inputData,
                    ntransactiontestcode,
                    npreregno,
                    nsectioncode,
                    ntransactionsamplecode,
                    JASelectedSample,
                    JASelectedTest,
                    JASelectedSubSample,
                    //  checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestTab: inputData.activeTestTab, masterData
                }

                if (JASelectedTest.length > 0) {
                    inputData = {
                        ...inputData,
                        childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "TestView"]
                    }
                    dispatch(getTestChildTabDetailJobAllocation(inputData, true));
                } else {
                    inputData = {
                        ...inputData, masterData,
                        childTabsKey: ["JA_TEST"]
                    }
                    dispatch(getJobAllocationTestDetail(inputData, true));
                }
            } else {
                let masterData = {
                    ...inputData.masterData,
                    JASelectedTest: TestSelected ? TestSelected : inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [],
                    JASelectedSample: inputData.JASelectedSample,
                    JASelectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.JA_SUBSAMPLE.length > 0 ? [inputData.masterData.JA_SUBSAMPLE[0]] : []

                }
                let subsamplecheck = true;
                if (inputData.masterData.realRegSubTypeValue.nneedsubsample) {
                    let SubSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
                    if (SubSampleSelected.length > 0) {
                        let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.JA_SUBSAMPLE, "ntransactionsamplecode");
                        if (filterSelectedSubSample.length === 0) {
                            let wholeSubSample = masterData.JA_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                                wholeSubSample.includes(item.ntransactionsamplecode)
                            );
                            //ALPD-3398
                            // oldSelectedSubSample.forEach((test, index) => {
                            //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                            //         oldSelectedSubSample.splice(index, 1)
                            //     }
                            //     return null;
                            // })
                            if (oldSelectedSubSample.length === 0 && wholeSubSample.length > 0
                                && masterData.selectedTest.length === 0) {
                                const selectedSubSample1 = [inputData.masterData.JA_SUBSAMPLE[0]];
                                masterData = {
                                    ...masterData,
                                    JASelectedSubSample: selectedSubSample1,
                                    selectedTest: []
                                }
                                inputData = { ...inputData, ...masterData }
                                inputData["npreregno"] = selectedSubSample1.map(x => x.npreregno).join(",")
                                inputData["ntransactionsamplecode"] = selectedSubSample1.map(x => x.ntransactionsamplecode).join(",")
                                //inputData["checkBoxOperation"] = 3
                                inputData[" checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                                inputData["childTabsKey"] = ["JA_TEST"]
                                subsamplecheck = false;
                                dispatch(getJobAllocationTestDetail(inputData, true));

                            }
                        } else {
                            oldSelectedSubSample = filterSelectedSubSample
                        }

                    } else {
                        let wholeSubSample = masterData.JA_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubSample.includes(item.ntransactionsamplecode)
                        );
                        //ALPD-3398
                        // oldSelectedSubSample.forEach((test, index) => {
                        //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                    }

                    if (subsamplecheck) {
                        masterData = {
                            ...masterData,
                            JASelectedSubSample: oldSelectedSubSample
                        }
                    }
                    if (inputData.masterData.JA_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampleskip, subsampletake }
                    }
                }
                let wholeTestList = masterData.JA_TEST.map(b => b.ntransactiontestcode)

                oldSelectedTest = oldSelectedTest.filter(item =>
                    wholeTestList.includes(item.ntransactiontestcode)
                );
                //ALPD-3398         
                // oldSelectedTest.map((test, index) => {
                //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                //         oldSelectedTest.splice(index, 1)
                //     }
                //     return null;
                // })

                let keepOld = false;
                let ntransactiontestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        JASelectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.JA_TEST[0].ntransactiontestcode
                }
                const RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const TestView = keepOld ? inputData.masterData.TestView : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestView || [],
                    ntransactiontestcode, "ntransactiontestcode");
                let { testskip, testtake } = inputData
                let bool = false;
                let skipInfo = {}
                if (inputData.masterData.JA_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = {
                        testskip,
                        testtake
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            JASelectedSample: inputData.JASelectedSample,
                            RegistrationTestAttachment,
                            RegistrationTestComment,
                            TestView,
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        ...skipInfo,
                    }
                })
            }
        }
    }
}

export function getJobAllocationTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {

        //console.log("response :");
        let arr = [];
        let arr1 = [];
        // const vals= inputData.JASelectedSample && inputData.JASelectedSample.filter(
        // (item,index) => 
        // item.nsectioncode!==inputData.JASelectedSample[inputData.JASelectedSample.lastIndexOf(inputData.JASelectedSample[index])].nsectioncode
        // );
        //   const myArray = inputData.nsectioncode.split(",");
        //   myArray.map((item) => {
        //         if(!arr.includes(item)) {
        //             arr.push(item)
        //           }
        //         }
        //     )

        let JASelectedSubSample = inputData.JASelectedSubSample;
        JASelectedSubSample && JASelectedSubSample.map((item) => {
            if (!arr.includes(item.nsectioncode)) {
                arr.push(item.nsectioncode)
            }
        }
        )

        let activeName = "";
        let dataStateName = "";
        let inputParamData = {
            nflag: 3,
            ntype: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            nsectioncode: arr.map(nsectioncode => nsectioncode).join(","),
            ntransactiontestcode: "0",
            ntransactionstatus: inputData.ntransactionstatus.toString(),
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            activeTestTab: inputData.activeTestTab,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation,
            nneedsubsample: inputData.nneedsubsample
        }
        const subSample = inputData.nneedsubsample;
        if (isServiceRequired) {
            dispatch(initRequest(true));
            rsapi().post("joballocation/getJobAllocationTestDetails", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData, 'descending', 'ntransactionsamplecode')
                    let oldSelectedTest = inputData.masterData.JASelectedTest
                    let oldSelectedSubSample = inputData.masterData.JASelectedSubSample || []
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
                    //inputData.masterData.JA_TEST = response.data.JA_TEST;

                    let masterData = {
                        ...inputData.masterData,
                        JASelectedTest: inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [],
                        JASelectedSample: inputData.masterData.JASelectedSample,
                        JASelectedSubSample: inputData.JASelectedSubSample || inputData.masterData.JASelectedSubSample,
                    }

                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = "";
                        masterData['searchedSubSample'] = undefined
                    }

                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTests'] = undefined
                    }
                    let {
                        testskip,
                        testtake
                    } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.JA_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    // bool = true
                    // }
                    // if (bool) {
                    skipInfo = {
                        testskip,
                        testtake
                    }
                    // }
                    let RegistrationTestAttachment = [];
                    let RegistrationTestComment = [];
                    let TestView = [];
                    let RegistrationSampleComment = [];
                    let RegistrationSampleAttachment = [];

                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
                        let wholeTestList = masterData.JA_TEST.map(b => b.ntransactiontestcode)
                        oldSelectedTest = oldSelectedTest.filter(item =>
                            wholeTestList.includes(item.ntransactiontestcode)
                        );
                        //ALPD-3398
                        // oldSelectedTest.map((test, index) => {
                        //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        //         oldSelectedTest.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        let keepOld = false;
                        let ntransactiontestcode;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                JASelectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = masterData.JASelectedTest[0].ntransactiontestcode
                        }
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;

                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;

                            case "IDS_TESTVIEW":
                                TestView = keepOld ? inputData.masterData.TestView : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestView, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestView"
                                dataStateName = "testViewDataState"
                                break;

                            default:
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentDataState"
                                break;
                        }

                        //} else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                        let list = []
                        let dbData = [];
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_TESTVIEW":
                                dbData = response.data.TestView || []
                                list = [...inputData.masterData.TestView, ...dbData];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            default:
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                        // } else if (inputData.checkBoxOperation === 7) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                        let list = []
                        let dbData = [];
                        let testList = reArrangeArrays(inputData.masterData.JA_SUBSAMPLE, responseData.JA_TEST, "ntransactionsamplecode");
                        masterData = {
                            ...masterData,
                            JASelectedTest: [testList[0]],
                            JA_TEST: testList,
                        }

                        switch (inputData.activeTestTab) {

                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            case "IDS_TESTVIEW":
                                dbData = response.data.TestView || []
                                list = [...inputData.masterData.TestView, ...dbData];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;

                            default:
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }

                    } else {
                        let list = []
                        switch (inputData.activeTestTab) {
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentState"
                                break;

                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;

                            case "IDS_TESTVIEW":
                                list = response.data.TestView ? sortData(response.data.TestView, 'descending', 'ntransactiontestcode') : [];
                                TestView = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestView"
                                dataStateName = "testViewDataState"
                                break;

                            case "IDS_SUBSAMPLEATTACHMENTS":
                                list = response.data.RegistrationSampleComment ? sortData(response.data.RegistrationSampleComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_SUBSAMPLE.length > 0 ? inputData.masterData.JA_SUBSAMPLE[0].ntransactionsamplecode : "", "ntransactionsamplecode")
                                activeName = "RegistrationSampleComment"
                                dataStateName = "testCommentDataState"
                                break;
                            default:
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testAttachmentState"
                                break;
                        }
                    }
                    if (subSample) {
                        let wholeSubsampleList = masterData.JA_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubsampleList.includes(item.ntransactionsamplecode)
                        );
                        //ALPD-3398
                        // oldSelectedSubSample.map((test, index) => {
                        //     if (!wholeSubsampleList.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        let keepOld = false;
                        let ntransactionsamplecode;
                        if (oldSelectedSubSample.length > 0) {
                            keepOld = true
                        } else {
                            ntransactionsamplecode = masterData.selectedSubSample[0].ntransactionsamplecode
                        }

                        switch (inputData.activeSubSampleTab) {
                            case "IDS_SUBSAMPLECOMMENTS":
                                RegistrationSampleComment = keepOld ? inputData.masterData.RegistrationSampleComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationSampleComment, ntransactionsamplecode, "ntransactionsamplecode")
                                activeName = "RegistrationSampleComment"
                                dataStateName = "subSampleCommentDataState"
                                break;
                            default:
                                RegistrationSampleAttachment = keepOld ? inputData.masterData.RegistrationSampleAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationSampleAttachment, ntransactionsamplecode, "ntransactionsamplecode")
                                activeName = "RegistrationSampleAttachment"
                                dataStateName = "subSampleAttachmentDataState"
                                break;
                        }
                    }
                    masterData = {
                        ...masterData,
                        RegistrationTestAttachment,
                        RegistrationTestComment,
                        TestView,
                        RegistrationSampleComment,
                        RegistrationSampleAttachment
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            // activeTestTab: inputData.activeTestTab,
                            screenName: inputData.activeTestTab,
                            subsampleskip: undefined,
                            subsampletake: undefined,
                            ...skipInfo
                        }
                    })
                })
                .catch(error => {
                    //console.log("error:", error);
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
        } else {
            let oldSelectedTest = inputData.masterData.JASelectedTest
            let TestSelected =
                inputData["statusNone"] ?
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode") :
                    filterRecordBasedOnPrimaryKeyName(inputData.masterData.JASelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.JASelectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.JA_TEST.length > 0 ? inputData.masterData.JA_TEST[0].ntransactiontestcode.toString() : "";
                let JASelectedSubSample = inputData.RESelectedSubSample;
                let JASelectedTest = inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [];
                inputData = {
                    ...inputData,
                    childTabsKey: ["TestView", "RegistrationTestAttachment", "RegistrationTestComment"],
                    ntransactiontestcode,
                    JASelectedSample: inputData.masterData.JASelectedSample,
                    JASelectedTest,
                    JASelectedSubSample,
                    //  checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestTab: inputData.activeTestTab
                }
                dispatch(getTestChildTabDetailJobAllocation(inputData, true));
            } else {
                let masterData = {
                    ...inputData.masterData,
                    JASelectedTest: inputData.masterData.JA_TEST.length > 0 ? [inputData.masterData.JA_TEST[0]] : [],
                    JASelectedSubSample: inputData.JASelectedSubSample
                }
                let wholeTestList = masterData.JA_TEST.map(b => b.ntransactiontestcode)
                oldSelectedTest = oldSelectedTest.filter(item =>
                    wholeTestList.includes(item.ntransactiontestcode)
                );
                //ALPD-3398
                // oldSelectedTest.map((test, index) => {
                //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                //         oldSelectedTest.splice(index, 1)
                //     }
                //     return null;
                // })
                let keepOld = false;
                let ntransactiontestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        JASelectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = masterData.JA_TEST[0].ntransactiontestcode
                }
                const RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const TestView = keepOld ? inputData.masterData.TestView : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestView || [],
                    ntransactiontestcode, "ntransactiontestcode");

                let { testskip, testtake } = inputData
                let bool = false;
                let skipInfo = {}
                if (inputData.masterData.JA_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = {
                        testskip,
                        testtake
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            JASelectedSubSample: inputData.JASelectedSubSample,
                            RegistrationTestAttachment,
                            RegistrationTestComment,
                            TestView,
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        // activeTestTab: inputData.activeTestTab,
                        ...skipInfo
                    }
                })
            }
        }
    }
}

export function getTestChildTabDetailJobAllocation(inputData, isServiceRequired) {
    return function (dispatch) {
        let arr = [];
        inputData.JASelectedTest && inputData.JASelectedTest.map((item) => {
            if (!arr.includes(item.nsectioncode)) {
                arr.push(item.nsectioncode)
            }
        }
        )
        let inputParamData = {
            ntransactiontestcode: inputData.JASelectedTest.map(test => test.ntransactiontestcode).join(","),
            npreregno: inputData.npreregno,
            nsectioncode: arr.map(nsectioncode => nsectioncode).join(","),
            //ssectioncode :inputData.JASelectedTest.map(sample => sample.nsectioncode).join(","),
            ntransactionsamplecode: inputData.JASelectedTest.map(test => test.ntransactionsamplecode).join(","),
            ndesigntemplatemappingcode: inputData.masterData.realDesignTemplateMappingValue && inputData.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
            userinfo: inputData.userinfo
        }
        let activeName = "";
        let dataStateName = "";
        let url = "";

        switch (inputData.activeTestTab) {
            case "IDS_TESTATTACHMENTS":
                url = "attachment/getTestAttachment"
                activeName = "RegistrationTestAttachment"
                dataStateName = "testAttachmentDataState"
                break;
            case "IDS_TESTCOMMENTS":
                url = "comments/getTestComment"
                activeName = "RegistrationTestComment"
                dataStateName = "testCommentDataState"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                activeName = "RegistrationSampleAttachment"
                dataStateName = "sampleAttachmentDataState"
                break;
            case "IDS_TESTVIEW":
                url = "joballocation/getTestView"
                activeName = "TestView"
                dataStateName = "testViewDataState"
                break;
            default:
                url = "attachment/getTestAttachment"
                activeName = "RegistrationTestAttachment"
                dataStateName = "testAttachmentDataState"
                break;
        }
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post(url, inputParamData)
                .then(response => {
                    let responseData = {
                        ...response.data,
                        JASelectedSample: inputData.JASelectedSample || inputData.masterData.JASelectedSample,
                        JASelectedTest: inputData.JASelectedTest,
                        activeTabIndex: inputData.activeTabIndex,
                        activeTabId: inputData.activeTabId
                    }
                    let skipInfo = {};
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        ...responseData,
                        JASelectedTest: inputData.JASelectedTest
                    }
                    if (inputData[dataStateName] && masterData[activeName] && masterData[activeName].length <= inputData[dataStateName].skip) {

                        skipInfo = {

                            [dataStateName]: {
                                ...inputData[dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [dataStateName]: {
                                ...inputData[dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            activeTabIndex: inputData.activeTabIndex,
                            activeTabId: inputData.activeTabId,
                            activeTestTab: inputData.activeTestTab,
                            loading: false,
                            activeTestTab: inputData.activeTestTab,
                            screenName: inputData.activeTestTab,
                            testskip: undefined,
                            testtake: undefined,
                            ...skipInfo
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
        } else {
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.JASelectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
            let skipInfo = {};
            let masterData = {
                ...inputData.masterData,
                JASelectedTest: inputData.JASelectedTest
            }
            if (masterData[activeName].length <= inputData.skip) {

                skipInfo = {

                    [dataStateName]: {
                        ...inputData[dataStateName],
                        skip: 0,
                        sort: undefined,
                        filter: undefined
                    }
                }
            } else {
                skipInfo = {
                    ...skipInfo,
                    [dataStateName]: {
                        ...inputData[dataStateName],
                        sort: undefined,
                        filter: undefined
                    }
                }
            }
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData,
                    loading: false,
                    showFilter: false,
                    activeTestTab: inputData.activeTestTab,
                    screenName: inputData.screenName,
                    ...skipInfo
                }
            })
        }
    }
}

export function validateEsignforJobAllocation(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = inputParam.screenData.inputParam.methodUrl;
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
                    dispatch(dispatchMethods(inputParam["screenData"]))
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
                    toast.info(error.response.data);
                }
            })
    };
}

function dispatchMethods(screenData) {
    return (dispatch) => {
        let action = screenData.inputParam.action
        switch (action) {
            case "receiveinlab":
                dispatch(ReceiveinLabStatusWise(screenData.inputParam, screenData.masterData));
                break;
            case "allotjob":
                dispatch(AllotJobAction(screenData.inputParam, screenData.masterData));
                break;
            case "allotanotheruser":
                dispatch(AllotAnotherUserAction(screenData.inputParam, screenData.masterData));
                break;
            case "reschedule":
                dispatch(RescheduleJobAction(screenData.inputParam, screenData.masterData));
                break;
            case "canceltest":
                dispatch(CancelTestWise(screenData.inputParam, screenData.masterData));
                break;
            case "AllotJobCalendar":    // ALPD-5263 Added AllotJobCalendar condition by Vishakh due to not added this got loader issue
                dispatch(AllotJobActionCalendar(screenData.inputParam, screenData.masterData));
                break;
            case "updateSection":
                dispatch(updateSectionJobAllocation(screenData.inputParam));
                break;
            default:
                break;
        }
    }
}


export function updatedObjectWithNewElement1(oldList, newList) {
    oldList = [...newList, ...oldList];
    return oldList;
}



export function getAnalystCalenderBasedOnUser(nusercode, masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getAnalystCalendarBasedOnUser", {
            "nusercode": nusercode,
            "userinfo": userInfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: { ...masterData, analystCalenderData: response.data.UserData },
                        loading: false,
                        selectedRecord
                    }
                });

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


export function getInstrumentNameForSchedule(ninstrumentcatcode, userInfo, edit, ninstrumentnamecode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getInstrumentNameBasedCategoryForSchedule", {
            "ninstrumentcatcode": ninstrumentcatcode, "userinfo": userInfo
        })
            .then(response => {
                let InstrumentName = [];
                const InstrumentMap = constructOptionList(response.data.InstrumentName || [], "ninstrumentnamecode", "sinstrumentname", undefined, undefined, false);
                InstrumentName = InstrumentMap.get("OptionList");
                if (edit && ninstrumentnamecode) {

                    let obj = { InstrumentName, selectedInstrumentCatCode: ninstrumentcatcode }

                    dispatch(getInstrumentForSchedule(ninstrumentcatcode, ninstrumentnamecode, userInfo, edit, obj))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedInstrumentCatCode: ninstrumentcatcode,
                            InstrumentName,
                            Instrument: [],
                            loading: false
                        }
                    });
                }
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

export function getInstrumentForSchedule(ninstrumentcatcode, ninstrumentnamecode, userInfo, edit, obj) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getInstrumentBasedCategoryForSchedule", {
            "ninstrumentcatcode": ninstrumentcatcode, "ninstrumentnamecode": ninstrumentnamecode, "userinfo": userInfo
        })
            .then(response => {
                let Instrument = [];
                const InstrumentMap = constructOptionList(response.data.Instrument || [], "ninstrumentcode", "sinstrumentid", undefined, undefined, false);
                Instrument = InstrumentMap.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Instrument,
                        loading: false,
                        ...obj
                    }
                });

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

export function AllotJobActionCalendar(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/AllotJobCreateCalendar", inputParam.inputData)
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["JA_TEST"], inputParam.inputData.masterData.JA_TEST, "ntransactiontestcode");
                    delete response.data["JA_TEST"];
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data,
                        JASelectedTest: replaceUpdatedObject(response.data["JASelectedTest"], inputParam.inputData.masterData.JASelectedTest, "ntransactiontestcode"),
                        TestView: replaceUpdatedObject(response.data["TestView"], inputParam.inputData.masterData.TestView, "ntransactiontestcode")
                    }
                    let respObject = {
                        ...inputParam.inputData,
                        masterData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
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
                    toast.info(error.response.data);
                }
            })
    }
}



export function clearInstrumentLoginData() {
    return function (dispatch) {
        //  dispatch(initRequest(true));

        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                //Instrument
                Instrument: [],
                selectedInstrumentCatCode: undefined,
                InstrumentName: [],
                //  loading: false,
            }
        });


    }
}
//ALPD-3781
export function getSectionTest(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getSectionChange", inputParam.inputData
        )
            .then(response => {
                let Section = [];
                //ALPD-4050
                let selectedRecord={...inputParam.selectedRecord,nsectioncode:""}
                const SectionMap = constructOptionList(response.data.Section || [], "nsectioncode", "ssectionname", undefined, undefined, false);
                Section = SectionMap.get("OptionList");
           
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        Section,
                        loading: false,
                        loadEsign: false,
                        openModal: true,operation:inputParam.inputData.operation,
                        screenName:inputParam.inputData.screenName,
                        ncontrolcode:inputParam.inputData.ncontrolcode,
                        selectedRecord

                    }
                });

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
//ALPD-3781
export function updateSectionJobAllocation(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/updateSectionJobAllocation", inputParam.inputData
        )
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    let UserSection = [];
                    const UserSectionMap = constructOptionList(response.data.UserSection || [], "nsectioncode", "ssectionname", undefined, undefined, false);
                    UserSection = UserSectionMap.get("OptionList");
                    let masterData = {
                        ...inputParam.inputData.masterData,
                        ...response.data
                        
                    }
                    let selectedRecord={...inputParam.selectedRecord,"nsectioncode":""}

                    let respObject = {
                        ...inputParam.inputData,
                        masterData,
                        UserSection,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined,
                        selectedRecord
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
                }


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
//ALPD-3781
export function getUsersSection(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("joballocation/getUsersBySection", {"userinfo":inputParam.userInfo,"nsectioncode":inputParam.nsectioncode,"nregtypecode":inputParam.nregtypecode,"nregsubtypecode":inputParam.nregsubtypecode}
        )
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
                    let Users = [];
                    const SectionUsersMap = constructOptionList(response.data.Users || [], "nusercode", "susername", undefined, undefined, false);
                    Users =SectionUsersMap.get("OptionList");
                    let selectedRecord={...inputParam.selectedRecord,"nusercode":"","ntechniquecode":""}
                    let masterData = {
                        ...inputParam.masterData,
                        ...response.data
                        
                    }
                    let respObject = {
                        selectedRecord,
                        masterData,
                        Users,
                        loading: false,
                        loadEsign: false,
                     
                        showSample: undefined
                    }
                   
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))

                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false,
                            openModal: false
                        }
                    });
                    toast.warn(response.data.rtn);
                }


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
export function getJobAllcationFilterDetail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("joballocation/getJobAllocationFilter", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }
                if (inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null) {
                    inputParam.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null) {
                    inputParam.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null) {
                    inputParam.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,                    
                        showFilter: false,
                        nfilternamecode:inputParam.inputData.nfilternamecode,
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

