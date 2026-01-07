import Axios from "axios";
import { toast } from "react-toastify";
import { intl } from "../components/App";
import { constructOptionList, sortData, getFilterConditionsBasedonDataType, getSameRecordFromTwoArrays } from "../components/CommonScript";
import { designProperties, reportCOAType, transactionStatus,releaseTestFilter } from "../components/Enumeration";

import {rsapi,serverUrl} from "../rsapi";//  SWSM-121 Start - added the code for security vulnerability - by rukshana
import { initRequest, sendOTPMail } from "./LoginAction";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "./LoginTypes";
import { crudMaster } from "./ServiceAction";
import { getFieldSpecification as getFieldSpecification3 } from '../components/type3component/Type3FieldSpecificationList';
import { filterObjectForReactAwesomeFilter } from "./RegistrationAction";
import { reportUrl } from '../rsapi'

// export function getReleasedSelectedSampleSubSampleTest(userInfo, Data1, inputData) {
import { Utils as QbUtils } from "@react-awesome-query-builder/ui";

const { checkTree, loadTree } = QbUtils;

//     return function (dispatch) {
//       if (inputData !== undefined &&inputData.npreregno!=="") {

//         dispatch(initRequest(true));
//         return rsapi().post("release/updateRelease",

//             inputData
//         )
//             .then(response => {
//                 if (response.data.statusCodeValue !== 200) {
//                     toast.warn(intl.formatMessage({
//                         id: response.data.body
//                     }));
//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             loading: false
//                         }
//                     });


//                 }
//                 else {

//                     if (response.data.body["PortalStatus"] && response.data.body["PortalStatus"].length > 0) {
//                         dispatch(UpdateExternalOrderStatus(response.data.body["PortalStatus"],inputData));
//                     }
//                     let masterData = {

//                         ...Data1, ...response.data.body,


//                     };

//                     console.log("ReleasedTest,", masterData);
//                      sortData(masterData.ReleaseHistory,"",'sreportno');
//                   //  dispatch(generateReport(inputData,masterData))

//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             masterData,
//                             change: inputData.change,
//                             loading: false,
//                             openModal:false
//                         }
//                     });
//                 }
//             })

//             .catch(error => {
//                 dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                     console.log("ErrorRelease,", error);

//                 }
//                 else {
//                     toast.warn(error.response.data);
//                 }
//             })


//         }
//         else {
//             toast.warn(intl.formatMessage({
//                 id: "IDS_SELECTANYONESAMPLE"
//             }));
//         }
//     }
// }
export function getReleasedRegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getRegistrationType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            SampleTypeValue: inputData.SampleTypeValue,
                            realSampleTypeList: inputData.realSampleTypeList || [],
                            realReportTypeList: inputData.realReportTypeList || [],
                            realRegTypeList: inputData.realRegTypeList || [],
                            realRegSubTypeList: inputData.realRegSubTypeList || [],
                            realFilterStatusList: inputData.realFilterStatusList || [],
                            realApprovalVersionList: inputData.realApprovalVersionList || [],
                            realDesignTemplateMappingList: inputData.realDesignTemplateMappingList || []
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
export function getReleasedRegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getRegistrationSubType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegTypeValue: inputData.RegTypeValue,
                            realSampleTypeList: inputData.realSampleTypeList || [],
                            realReportTypeList: inputData.realReportTypeList || [],
                            realRegTypeList: inputData.realRegTypeList || [],
                            realRegSubTypeList: inputData.realRegSubTypeList || [],
                            realFilterStatusList: inputData.realFilterStatusList || [],
                            realApprovalVersionList: inputData.realApprovalVersionList || [],
                            realDesignTemplateMappingList: inputData.realDesignTemplateMappingList || []
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

export function getReleasedFilterBasedTest(inputData) {
    return function (dispatch) {
        if (inputData.napprovalversioncode) {
            dispatch(initRequest(true));
            rsapi().post("release/getFilterBasedTest", inputData)
                .then(response => {


                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...responseData,
                                RegSubTypeValue: inputData.RegSubTypeValue,
                                ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                                DesignTemplateMappingValue: inputData.DesignTemplateMappingValue
                            },
                            loading: false
                        }
                    })
                    if (response.data.rtn) {
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
                        toast.warn(error.response.data);
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_PLSSELECTALLVALUESINFILTER"
            }));
        }
    }

}

export function getReleasedApprovalVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getApprovalVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            realSampleTypeList: inputParam.inputData.realSampleTypeList || [],
                            realReportTypeList: inputParam.inputData.realReportTypeList || [],
                            realRegTypeList: inputParam.inputData.realRegTypeList || [],
                            realRegSubTypeList: inputParam.inputData.realRegSubTypeList || [],
                            realFilterStatusList: inputParam.inputData.realFilterStatusList || [],
                            realApprovalVersionList: inputParam.inputData.realApprovalVersionList || [],
                            realDesignTemplateMappingList: inputParam.inputData.realDesignTemplateMappingList || []
                            // fromDate: inputParam.inputData.dfrom,
                            // toDate: inputParam.inputData.dto,
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
export function getReleasedSample(inputParam, selectedRecordLogin, selectedRecordState, LoginData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let urlArray = [];
        const approvedReportTemplate = rsapi().post("release/getApprovedReportTemplate", inputParam.inputData);
        const filteredSample = rsapi().post("release/getReleaseSample", inputParam.inputData);
        urlArray = [filteredSample, approvedReportTemplate];
        Axios.all(urlArray).then(response => {
            let reportTemplateList = [];
            const reportTemplateMap = constructOptionList(response[1].data || [], "nreporttemplatecode", "sreporttemplatename", "nreporttemplatecode",
                "ascending", false);
            reportTemplateList = reportTemplateMap.get("OptionList");
            let responseData = { ...response[0].data }
            // responseData = sortData(responseData)
            let masterData = {}
            let nsectioncode = {};
            let selectedRecord = {};
            //ALPD-4797--Vignesh R(05-09-2024)
            //   let slideOutClose = true;
            // if (response.data.ReleasedSampleDetails && response.data.ReleasedSampleDetails.length !== 0 ||
            //     response.data.ReleaseSample && response.data.ReleaseSample.length === 0) {
            masterData = {
                ...inputParam.masterData,
                ...responseData,
            }
            if (inputParam.inputData.isClear) {

                masterData.ReleaseSample.map(x => {
                    const matchingItem = inputParam.masterData.ReleaseSample.find(item => item.npreregno === x.npreregno && item.selected === true);
                    if (matchingItem) {
                        x.selected = true;
                    }
                });
                Object.values(masterData.ReleaseSubSample).flat().forEach(x => {
                    const matchingItem = Object.values(inputParam.masterData.ReleaseSubSample).flat()
                        .find(item => item.ntransactionsamplecode === x.ntransactionsamplecode && item.selected === true);
                    if (matchingItem) {
                        x.selected = true;
                    }
                });
                Object.values(masterData.ReleaseTest).flat().forEach(x => {
                    const matchingItem = Object.values(inputParam.masterData.ReleaseTest)
                        .flat().find(item => item.ntransactiontestcode === x.ntransactiontestcode && item.selected === true);
                    if (matchingItem) {
                        x.selected = true;
                    }
                });
            }
            if (nsectioncode !== undefined) {
                nsectioncode = inputParam.inputData.nsectioncode;
            }

            if (selectedRecordState !== undefined && inputParam.inputData.isClear !== true) {
                delete selectedRecordState.nreporttemplatecode;
            }
            selectedRecord = { ...selectedRecordLogin, ...selectedRecordState }
            masterData["reportTemplateList"] = reportTemplateList;
            //sortData(masterData,"ascending","nfilternamecode");
            //sortData(masterData, "", "ncoaparentcode"); 
            sortData(masterData);
            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData,
                    loading: false,
                    showFilter: false,
                    nsectioncode: nsectioncode,
                    FilterQueryBuilder: false,
                    screenName: inputParam.inputData.screenName,
                    awesomeTree: inputParam.inputData.isClear ? undefined : inputParam.inputData.awesomeTree,
                    filterquery: inputParam.inputData.isClear ? undefined : inputParam.inputData.filterquery,
                    slideOutClose: true,    // ALPD-5603    Changed slideoutclose to true to clear the selection by Vishakh (06-05-2025)
                    selectedRecord,
                    isClear: inputParam.inputData.isClear ? false : true,
                    // awesomeTree: LoginData && LoginData.awesomeTree,
                    // filterquery:LoginData && LoginData.filterquery,
                    fields: LoginData && LoginData.fields,
                    filterQueryTreeStr: LoginData && LoginData.filterQueryTreeStr




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
export function getApprovedSample(inputParam, ncontrolCode) {
    if (inputParam.masterData.realReportTypeValue.ncoareporttypecode === reportCOAType.PATIENTWISE) {

        let fieldList = [];
        fieldList = getFieldSpecification3().get("ExternalOrder") || [];

        const languageTypeCode = inputParam.inputData.userinfo.slanguagetypecode;
        const { fields, gridColumns } = filterObjectForReactAwesomeFilter(fieldList[0].filterfields, languageTypeCode, undefined, undefined)
        let awesomeTree = fieldList[0].awesomeTree ? checkTree(loadTree(fieldList[0].awesomeTree), fieldList[0].awesomeConfig) : undefined

        return function (dispatch) {
            let urlArray = [];


            dispatch(initRequest(true));
            Axios.all(urlArray)

                .then(response => {

                    let ProjectTypeList = [];
                    let sectionList = [];


                    let masterData = {};
                    let openModal = true;

                    masterData = {
                        ...inputParam.masterData
                    }



                    sortData(masterData);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            fields,
                            gridColumns,
                            awesomeTree,
                            seletedFilterComponent: fieldList[0],
                            // awesomeTree:fieldList[0].awesomeTree,
                            awesomeConfig: undefined,
                            lstPatient: [],
                            kendoSkip: 0,
                            kendoTake: 5,
                            masterData,
                            expandCheck: false,
                            ProjectTypeList,
                            ncontrolCode,
                            isDeletePopup: false,
                            isComboCheck: false,
                            isEditPopup: false,
                            screenName: "IDS_PATIENTSEARCH",
                            sectionList,
                            loading: false,
                            showFilter: false,
                            openModal: openModal,
                            isAddPopup: true,
                            operation: "save",
                            slideOutClose: false    // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
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
    else {
        return function (dispatch) {
            let ismandatory = false
            inputParam.DynamicReportFilterTypeItem && inputParam.DynamicReportFilterTypeItem.map(x => {
                if (x.ismandatory) {
                    ismandatory = true
                }
            })
            if (ismandatory) {
                inputParam['inputData'] = { ...inputParam.inputData, ismandatory: true }
            }
            const screenName = "";
            let urlArray = [];

            inputParam.inputData['isAddPopup'] = true
            const releaseSample = rsapi().post("release/getReleaseSample", inputParam.inputData);
            //  const reportType = rsapi().post("release/getCOAReportType", { userinfo: inputParam.inputData.userinfo });
            const projectType = rsapi().post("release/getApprovedProjectType", inputParam.inputData);
            const sectionType = rsapi().post("release/getSection", inputParam.inputData);
            const testList = rsapi().post("release/getTest", inputParam.inputData);
            const approvedReportTemplate = rsapi().post("release/getApprovedReportTemplate", inputParam.inputData);

            urlArray = [releaseSample, projectType, sectionType, testList, approvedReportTemplate];
            if (inputParam.DynamicReportFilterTypeItem && inputParam.DynamicReportFilterTypeItem.length > 0) {
                let itemList = [];
                inputParam.DynamicReportFilterTypeItem.map(x => {
                    if (x[designProperties.LISTITEM] === "combo") {
                        itemList.push(
                            {
                                "Pkey": x[designProperties.PRIMARYKEY],
                                "nquerybuildertablecode": x[designProperties.QUERYBUILDERTABLECODE],
                                "tablename": x[designProperties.TABLENAME],
                                "columnname": x[designProperties.COLUMNNAME],
                                "keyName": x[designProperties.VALUE],
                                 //ALPDJ21-69--Added by Vignesh(06-10-2025)-->500 error thrown the while clicking the Add Sample
                                "isMultiLingual": x.hasOwnProperty(designProperties.COLUMNDETAILS) && x[designProperties.COLUMNDETAILS].hasOwnProperty("isMultiLingual") && x[designProperties.COLUMNDETAILS].isMultiLingual,
                                "languageTypeCode": inputParam.inputData.userinfo.slanguagetypecode,
                                "recordType": x[designProperties.RECORDTYPE]
                            })
                    }
                })
                inputParam["inputData"]["itemList"] = itemList;
                const reportFilterType = rsapi().post("release/getComboValues", { ...inputParam.inputData, 'userInfo': inputParam.inputData.userinfo });
                urlArray.push(reportFilterType);
            }
            dispatch(initRequest(true));
            Axios.all(urlArray)

                .then(response => {
                    // const reportTypeMap = constructOptionList(response[1].data.ReportType || [], "ncoareporttypecode",
                    //     "scoareporttypename", undefined, undefined, false);

                    // const ReportTypeList = reportTypeMap.get("OptionList");
                    let ProjectTypeList = [];
                    let sectionList = [];

                    // let selectedRecord = {"ncoareporttypecode": {
                    //     "value": response[1].data.ReportType[0].ncoareporttypecode,
                    //      "label": response[1].data.ReportType[0].scoareporttypename
                    // }
                    // };
                    let masterData = {};
                    let openModal = true;
                    let sectionvalue = [];
                    let comboValues = {};
                    let reportTemplateList = [];
                    let selectedRecord = {};

                    delete selectedRecord["nsectioncode"];
                    delete selectedRecord["nreporttemplatecode"];
                    // let selectedRecord = inputParam.inputData.selectedRecord;
                    // let selectedRecord = inputParam.selectedRecord;
                    // selectedRecord["nmultiplesampleinsinglerelease"] = inputParam.realReportTypeValue["nmultiplesampleinsinglerelease"];
                    const sectionTypeMap = constructOptionList(response[2].data.sectionList || [], "nsectioncode",
                        "ssectionname", undefined, undefined, false);
                    sectionList = sectionTypeMap.get("OptionList");
                    sectionList.map(x => sectionvalue.push({ "value": x.value, "title": x.label }));
                    let testListMap = response[3] && response[3].data;
                    if (inputParam.inputData.isneedsection !== transactionStatus.YES) {
                        const reportTemplateMap = constructOptionList(response[4].data || [], "nreporttemplatecode", "sreporttemplatename", "nreporttemplatecode",
                            "ascending", false);
                        reportTemplateList = reportTemplateMap.get("OptionList");
                    }
                    let combovaluesListMap = response[5] && response[5].data;
                    let comboValueList = { ...testListMap, ...combovaluesListMap } || {};
                    comboValues = { "s.nsectioncode": sectionvalue, ...comboValueList };
                    // if (inputParam.inputData.ncoareporttypecode === reportCOAType.PROJECTWISE ||
                    //     inputParam.inputData.nsampletypecode === SampleType.PROJECTSAMPLETYPE && inputParam.inputData.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) {
                    //     const projectTypeMap = constructOptionList(response[0].data || [], "nprojecttypecode",
                    //         "sprojecttypename", undefined, undefined, false);

                    //     ProjectTypeList = projectTypeMap.get("OptionList");
                    //     masterData = { ...inputParam.masterData, ReleaseSubSample: [], ReleaseTest: [], ReleaseSample: [] };
                    //     if (inputParam.inputData.selectedRecord.nprojecttypecode) {
                    //         delete inputParam.inputData.selectedRecord.nprojecttypecode
                    //     }
                    //     if (inputParam.inputData.selectedRecord.nprojectmastercode) {
                    //         delete inputParam.inputData.selectedRecord.nprojectmastercode
                    //     }
                    //     const sectionTypeMap = constructOptionList(response[1].data.sectionList || [], "nsectioncode",
                    //     "ssectionname", undefined, undefined, false);
                    // sectionList = sectionTypeMap.get("OptionList");
                    // sectionList.map(x=>sectionvalue.push({"value":x.value,"title":x.label}));
                    // let comboValueList=response[2] && response[2].data ||{};
                    //  comboValues={"s.nsectioncode":sectionvalue,...comboValueList}

                    // }
                    // else 
                    // if (inputParam.inputData.isneedsection === transactionStatus.YES || inputParam.inputData.ncoareporttypecode === reportCOAType.SECTIONWISE || inputParam.inputData.ncoareporttypecode === reportCOAType.SECTIONWISEMULTIPLESAMPLE) {
                    //     const sectionTypeMap = constructOptionList(response[0].data.sectionList || [], "nsectioncode",
                    //         "ssectionname", undefined, undefined, false);
                    //     sectionList = sectionTypeMap.get("OptionList");
                    //     sectionList.map(x=>sectionvalue.push({"value":x.value,"title":x.label}));
                    //     let comboValueList=response[1] && response[1].data ||{};
                    //      comboValues={"s.nsectioncode":sectionvalue,...comboValueList}
                    //     masterData = { ...inputParam.masterData, ReleaseSubSample: [], ReleaseTest: [], ReleaseSample: [] };
                    //     if (inputParam.inputData.selectedRecord.nsectioncode) {
                    //         delete inputParam.inputData.selectedRecord.nsectioncode
                    //     }

                    // }
                    // else {
                    if (ismandatory) {
                        masterData = { ...inputParam.masterData, ReleaseSubSample: [], ReleaseTest: [], ReleaseSample: [] };
                    } else {
                        if (response[0].data && response[0].data.ReleaseSample.length !== 0) {

                            let responseData = { ...response[0].data }
                            masterData = {
                                ...inputParam.masterData, ...responseData
                            }
                        }
                        else {
                            let responseData = { ...response[0].data }
                            masterData = {
                                ...inputParam.masterData, ...responseData
                            }
                            openModal = false;
                            toast.warn(intl.formatMessage({ id: "IDS_NOSAMPLESAREAVAILABLE" }));
                        }
                    }

                    // }
                    let awesomeTree;
                    let filterquery;
                    let filterQueryTreeStr;
                    let fields = getFilterConditionsBasedonDataType(inputParam.extractedColumnList, comboValues);
                    if (inputParam.DynamicDefaultStructureItem && inputParam.DynamicDefaultStructureItem.nsampletypecode === inputParam.inputData.nsampletypecode
                        && inputParam.DynamicDefaultStructureItem.nregtypecode === inputParam.inputData.nregtypecode
                        && inputParam.DynamicDefaultStructureItem.nregsubtypecode === inputParam.inputData.nregsubtypecode) {
                        awesomeTree = inputParam.DynamicDefaultStructureItem && inputParam.DynamicDefaultStructureItem.awesomeTree && checkTree(loadTree(inputParam.DynamicDefaultStructureItem.awesomeTree), inputParam.DynamicDefaultStructureItem.awesomeConfig)
                        filterquery = inputParam.DynamicDefaultStructureItem.filterquery
                        filterQueryTreeStr = inputParam.DynamicDefaultStructureItem.filterQueryTreeStr

                    } else {
                        awesomeTree = undefined;
                    }

                    sortData(masterData);
                    masterData["reportTemplateList"] = reportTemplateList;
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            selectedRecord,
                            expandCheck: false,
                            ProjectTypeList,
                            ncontrolCode,
                            isDeletePopup: false,
                            isComboCheck: false,
                            isEditPopup: false,
                            screenName: inputParam.inputData.screenName,
                            sectionList,
                            loading: false,
                            showFilter: false,
                            openModal: openModal,
                            isAddPopup: true,
                            operation: "save",
                            kendoSkip: 0,
                            kendoTake: 5,
                            sectionvalue,
                            comboValues,
                            awesomeTree: awesomeTree, filterquery, fields, filterQueryTreeStr,
                            FilterQueryBuilder: false,
                            screenNameCopy: inputParam.inputData.screenName,
                            ismandatory,
                            slideOutClose: false    // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                            //awesomeConfig:undefined
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

// ALPDJ21-69--Added by Vignesh(02-09-2025)--Test wise release
export function getApprovedTest(inputParam, ncontrolCode, selectedRecord) {
    return function (dispatch) {
        let urlArray = [];
        inputParam.inputData['isAddPopup'] = true
        inputParam.inputData['isTestAddPopup'] = true
        const releaseSample = rsapi().post("release/getReleaseSample", inputParam.inputData);
        let sectionType = [];
        let testStatus = [];

        if (selectedRecord && selectedRecord.ntestfiltercode && selectedRecord.ntestfiltercode.value === releaseTestFilter.SECTION) {
            sectionType = rsapi().post("release/getSection", inputParam.inputData);
        } else if (selectedRecord && selectedRecord.ntestfiltercode && selectedRecord.ntestfiltercode.value === releaseTestFilter.ACCREDITEDSTATUS) {
            testStatus = rsapi().post("release/getReleseTestStatus", { userinfo: inputParam.inputData.userinfo });

        }
        const testFilter = rsapi().post("release/getRelaseTestFilter", { userinfo: inputParam.inputData.userinfo });
        const approvedReportTemplate = rsapi().post("release/getApprovedReportTemplate", inputParam.inputData);

        urlArray = [releaseSample, sectionType, testStatus, testFilter, approvedReportTemplate];

        dispatch(initRequest(true));
        Axios.all(urlArray)

            .then(response => {

                let sectionList = [];
                let testStatusList = [];
                let releaseTestFilterList = [];
                let masterData = {};
                let openModal = true;
                let sectionvalue = [];
                let comboValues = {};
                let reportTemplateList = [];

                if (!(inputParam.inputData.isComboChange)) {

                    if (response[0].data && response[0].data.ReleaseSample.length !== 0) {

                        let responseData = { ...response[0].data }
                        masterData = {
                            ...inputParam.masterData, ...responseData
                        }
                    }
                    else {
                        let responseData = { ...response[0].data }
                        masterData = {
                            ...inputParam.masterData, ...responseData
                        }
                        openModal = false;
                        toast.warn(intl.formatMessage({ id: "IDS_TESTISNOTAVAILABLE" }));
                    }


                } else {
                    let responseData = { ...response[0].data }
                    masterData = {
                        ...inputParam.masterData, ...responseData
                    }
                }

                const testFilterMap = constructOptionList(response[3].data || [], "nreleasetestfiltercode",
                    "sreleasetestfilter", undefined, undefined, false);
                releaseTestFilterList = testFilterMap.get("OptionList");


                const reportTemplateMap = constructOptionList(response[4].data || [], "nreporttemplatecode", "sreporttemplatename", "nreporttemplatecode",
                    "ascending", false);
                reportTemplateList = reportTemplateMap.get("OptionList");


                if (selectedRecord["ntestfiltercode"] === undefined)
                    selectedRecord["ntestfiltercode"] = releaseTestFilterList[0];

                if (response[1].data !== undefined) {
                    const sectionTypeMap = constructOptionList(response[1].data.sectionList || [], "nsectioncode",
                        "ssectionname", undefined, undefined, false);
                    sectionList = sectionTypeMap.get("OptionList");

                    
                    sectionList.unshift({ value: response[1].data.sectionAll.ntranscode, label: response[1].data.sectionAll.stransdisplaystatus});

                    if (selectedRecord["ntestsectioncode"] === undefined)
                        selectedRecord["ntestsectioncode"] = sectionList[0];
                }
                if (response[2].data !== undefined) {
                    const testStatusMap = constructOptionList(response[2].data.TransactionStatus || [], "ntranscode",
                        "stransstatus", undefined, undefined, false);
                    testStatusList = testStatusMap.get("OptionList");

                    if (selectedRecord["ntranscode"] === undefined)
                        selectedRecord["ntranscode"] = testStatusList[0];
                }

                sortData(masterData);
                masterData["reportTemplateList"] = reportTemplateList;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        releaseTestFilterList: releaseTestFilterList,
                        selectedRecord,
                        expandCheck: false,
                        ncontrolCode,
                        sectionList: sectionList,
                        testStatusList: testStatusList,
                        isDeletePopup: false,
                        screenName: "IDS_ADDTEST",
                        loading: false,
                        showFilter: false,
                        openModal: openModal,
                        isAddPopup: true,
                        operation: "save",
                        kendoSkip: 0,
                        kendoTake: 5,
                        sectionvalue,
                        comboValues,
                        screenNameCopy: inputParam.inputData.screenName,
                        slideOutClose: false
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

export function generateReleasedReport(inputData, Data, preventtb) {
    return function (dispatch) {
        dispatch(initRequest(true));

        let urlArray = [];
        //   const releaseSample = rsapi().post("release/updateRelease", inputData)  ;
        //   const afterCorrection = rsapi().post("release/updateReleaseAfterCorrection", inputData)  ;
        inputData['preventTbFlow'] = preventtb === true ? preventtb : false
        if (inputData.listStatus === transactionStatus.CORRECTION) {

            const afterCorrection = rsapi().post("release/updateReleaseAfterCorrection", inputData);
            urlArray = [afterCorrection];
        }

        else {
            const releaseSample = rsapi().post("release/updateRelease", inputData);

            urlArray = [releaseSample];
        }
        Axios.all(urlArray)
            .then(response => {
                if (response[0].data.rtn === "MappingNeeded") {


                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            modalShow: false,
                            // selectedRecord: {}, 
                            loadEsign: false,
                            //openModal: false,
                            // preventTbCheck:true
                        }
                    })

                    inputData.confirmMessage.confirm("PortalMapping", intl.formatMessage({ id: "IDS_SUBSAMPLEWASNOTMAPPED" }), intl.formatMessage({ id: "IDS_DOYOUWANTTOCONTINUEWITHOUTSENDRESULTTOPREVENTTB" }),
                        intl.formatMessage({ id: "IDS_OK" }), intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => dispatch(generateReleasedReport(inputData, Data, true)), false, () => dispatch(cancelPopUp(inputData, Data)))

                } else {
                    // if (response[0].data["isPortalData"] && response[0].data["PortalStatus"] && response[0].data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response[0].data["PortalStatus"], inputData));
                    // }

                    if (response[0].data["PreventTb"]) {
                        toast.warn(response[0].data["PreventTb"])
                    }

                    // ALPD-4229 (30-05-2024) Added code when search and do action
                    let searchedData = Data.searchedData;
                    if (Data.searchedData && Data.searchedData !== undefined && Data.searchedData.length > 0) {
                        searchedData = response[0].data && response[0].data.ReleaseHistory &&
                            getSameRecordFromTwoArrays(response[0].data.ReleaseHistory, Data.searchedData, "ncoaparentcode");
                    }
                    sortData(searchedData, '', 'ncoaparentcode');   // ALPD-4229 (12-06-2024) Added sortData for searchedData
                    let masterData = {
                        ...Data,
                        ...response[0].data,
                        searchedData
                    }
                    //Added by sonia on 18-08-2024 for JIRA ID:4716 
                    //if (inputData.generateReport){
                    //   if(inputData.newTabReport){
                    if (response[0].data && response[0].data.rtn) {
                        if (response[0].data.rtn === "Success") {
                            if (inputData.newTabReport) {
                                if (response[0].data.filetype === 'jrxml') {
                                    let value = "";
                                    value = response[0]["data"]["reportViewURL"];
                                    var win = window.open(value);
                                    if (win) {
                                        win.focus();
                                    } else {
                                        intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                                    }
                                } else if (response[0].data.filetype === 'mrt') {

                                    if (response[0].data.sourceparameter != undefined && response[0].data.sourceparameter != "") {
                                        // Added btoa() to encode the sapi and srepotlink values by Gowtham on dec 2 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                        // Added btoa() to encode the For ALl Parameter values by Neeraj on dec 4 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                        let mrtfilePath = reportUrl()
                                            + "?name=" + btoa(inputData.userinfo.sreportingtoolfilename)     //en-xml
                                            + "&slanguagetypecode=" + btoa(inputData.userinfo.sreportlanguagecode)    //en-us
                                            + "&foldername=" + btoa(response[0].data.folderName)   //"Quotation-002"//this.props.Login.masterData.SelectedReportDetails.sreportname
                                            + "&filename=" + btoa(response[0].data.FILEName)  //"a6008692-3e1a-422b-b4da-5e9ad9cf3be6.mrt"//"b701dbc4-d90e-4840-b8e1-942649d6ec25.mrt"//this.props.Login.masterData.SelectedReportDetails.ssystemfilename
                                            + "&sconnectionstring=" + inputData.userinfo.sconnectionString
                                            + "&sapi=" + btoa(serverUrl() + "/reststimulsoft/urljson")  //SWSM-121 Start - added the code for security vulnerability - by rukshana
                                            + "&sreportlink=" + btoa(response[0].data.sreportlink) //inputParam.sreportlink //"//localhost:8090/SharedFolder/QuaLISjrxml"//this.props.Login.reportSettings[15] //this.props.Login.userInfo.sreportLink  
                                            // + "&smrttemplatelink=" + response[0].data.smrttemplatelink  //inputParam.smrttemplatelink //"//localhost:8090//SharedFolder//ReportJSON//ReportTemplate.json"//this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink
                                            + "&sourceparameter=" + btoa(JSON.stringify(response[0].data.sourceparameter)); //JSON.stringify(response[0].data.sourceparameter)

                                        //console.log("path1:",mrtfilePath);
                                        window.open(mrtfilePath);

                                    }
                                }

                            } else {
                                document.getElementById("download_data").setAttribute("href", response[0].data.filepath);
                                document.getElementById("download_data").click();
                            }
                        } else {
                            toast.warn(response[0].data.rtn);
                        }
                    }
                    //   }

                    sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false, change: inputData.change, masterData, openCPModal:false, selectedAuthRecord: {},
                            showEmailOTPModal:false, emailidChange: false, isValidOtp: inputData.isValidOtp,
                            modalShow: false, selectedRecord: {}, loadEsign: false, openModal: false
                        }
                    })
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
                    //toast.warn(error.response.data['rtn']);
                    toast.warn(error.response.data);
                }
            })
    }
}


export function cancelPopUp(inputData, Data) {
    return function (dispatch) {
        dispatch({
            type: DEFAULT_RETURN, payload: {
                loading: false,
                modalShow: false, selectedRecord: {}, loadEsign: false, openModal: false
            }
        })
    }
}

export function getReleasedFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getReleaseConfigVersionRegTemplateDesign", inputData)
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
export function getReleasedDataDetails(inputParam, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            dfrom: inputParam.inputData.dfrom,
            dto: inputParam.inputData.dto,

            nsampletypecode: inputParam.inputData.nsampletypecode,
            nregtypecode: inputParam.inputData.nregtypecode,
            nregsubtypecode: inputParam.inputData.nregsubtypecode,
            ntransactionstatus: inputParam.inputData.ntransactionstatus,
            nsectioncode: inputParam.inputData.nsectioncode,
            ntestcode: inputParam.inputData.ntestcode,
            napprovalversioncode: inputParam.inputData.napprovalversioncode,
            napprovalconfigcode: inputParam.inputData.napprovalconfigcode,
            userinfo: inputParam.inputData.userinfo,
            nneedsubsample: inputParam.inputData.nneedsubsample,
            // ncoaparentcode: inputParam.ncoaparentcode,
            ncoaparentcode: inputParam.releaseno ? inputParam.releaseno.map(item => item.ncoaparentcode).join(",") : "-1",
            npreregno: inputParam.npreregno,
            ncoareporttypecode: inputParam.inputData.ncoareporttypecode,
            isneedsection: inputParam.inputData.isneedsection,
            ndesigntemplatemappingcode: inputParam.masterData.ndesigntemplatemappingcode,
            isAddPopup: false
        }
        dispatch(initRequest(true));
        rsapi().post("release/getReleaseSample", inputParamData)
            .then(response => {
                let responseData = { ...response.data }
                // responseData = sortData(responseData)
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        expandCheck: false,

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
export function getApprovedProjectByProjectType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getApprovedProjectByProjectType", inputData)
            .then(response => {
                const projectMasterMap = constructOptionList(response.data.projectMasterList || [], "nprojectmastercode",
                    "sprojectcode", undefined, undefined, false);

                const projectMasterList = projectMasterMap.get("OptionList");
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        projectMasterList,
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            ReleaseSample: []
                        },
                        // selectedRecord: {},
                        loading: false,
                        expandCheck: false,

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
export function getApprovedProjectType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getApprovedProjectType", inputData)
            .then(response => {
                const projectTypeMap = constructOptionList(response.data || [], "nprojecttypecode",
                    "sprojecttypename", undefined, undefined, false);

                const ProjectTypeList = projectTypeMap.get("OptionList");

                //     const projectMasterMap = constructOptionList(response.data || [], "nprojecttypecode",
                //     "sprojecttypename", undefined, undefined, false);

                // const projectMasterList = projectMasterMap.get("OptionList");
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        ProjectTypeList,
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            ProjectTypeValue: inputData.ProjectTypeValue
                        },
                        loading: false,
                        expandCheck: false,

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
export function getSectionForSectionWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getSection", inputData.inputData)
            .then(response => {
                const sectionMap = constructOptionList(response.data.sectionList || [], "nsectioncode",
                    "ssectionname", undefined, undefined, false);

                const sectionList = sectionMap.get("OptionList");
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        sectionList,
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            ReleaseSample: []

                        },
                        loading: false,
                        expandCheck: false,

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
export function getReportForPortal(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/SendToPortalReport", inputData)
            .then(response => {

                if (response.data["rtn"]) {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
function UpdateExternalOrderStatus(portallist, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post((String)(inputParam["url"]) + "/portal/UpdateMultiSampleStatus", JSON.stringify(portallist), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {

                dispatch({
                    type: DEFAULT_RETURN, payload: {
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
                } else if (error.response !== undefined && error.response.status === 500) {
                    toast.error(error.message);
                }
                else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function getApprovedRecordsAsDraft(inputData, Data1, seletedRecord) {


    return function (dispatch) {
        if (inputData !== undefined && inputData.npreregno !== "") {
            // ALPD-4229 (30-05-2024) Added searchRef to clear search text in search filter
            let searchRef = inputData.searchRef;
            delete (inputData.searchRef);

            dispatch(initRequest(true));
            return rsapi().post("release/saveRelease", inputData)
                .then(response => {
                    if (response.data.rtn === "Success") {
                        //SearchRef undefined issue fixed - L.Subashini
                        if (searchRef !== undefined)
                            searchRef.current.value = "";
                        let masterData = {
                            ...Data1, ...response.data, searchedData: undefined
                        };
                        delete (seletedRecord.nreporttemplatecode);
                        seletedRecord["nisarnowiserelease"] = transactionStatus.NO;
                        sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData,
                                change: inputData.change,
                                loading: false,
                                loadEsign: false,
                                openModal: false,
                                expandCheck: false,
                                slideOutClose: true,             // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                                isClear: true,  //  ALPD-5603   Added isClear by Vishakh for filter issue (06-05-2025)
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
                    }
                    else {
                        toast.warn(response.data.rtn);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                //  masterData,
                                change: inputData.change,
                                loading: false,
                                // loadEsign: false,
                                //openModal: false,
                                slideOutClose: true,
                                expandCheck: false,
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
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
                        //  console.log("ErrorRelease,", error);

                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })


        }
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTANYONESAMPLE"
            }));
        }
    }
}

export function preliminaryReport(inputParam, Data, screenName) {
    return function (dispatch) {

        dispatch(initRequest(true));
        // const inputData = {
        //     npreregno: inputParam.npreregno,
        //  //   nsectioncode: inputParam.nsectioncode || -1,
        //     userinfo: inputParam.userinfo,
        //     nprimarykey: inputParam.npreregno,
        //     nreporttypecode: REPORTTYPE.COAREPORT,
        //     sprimarykeyname: "npreregno",
        //     ncontrolcode: inputParam.ncontrolCode,
        //     nregtypecode: inputParam.nregtypecode,
        //     nregsubtypecode: inputParam.nregsubtypecode,
        //     ntransactiontestcode:inputParam.ntransactiontestcode,
        //     napproveconfversioncode: inputParam.napprovalversioncode,
        //     ncoaparentcode: inputParam.ncoaparentcode,
        //     ntransactionstatus:inputParam.ntransactionstatus
        // }
        // rsapi().post("release/generateReleasedReport", inputParam.inputData)
        rsapi().post("release/preliminaryRegenerateReport", inputParam.inputData)
            .then(response => {
                // ALPD-4229 (30-05-2024) Added code when search and do action
                let searchedData = Data.searchedData;
                if (Data.searchedData && Data.searchedData !== undefined && Data.searchedData.length > 0) {
                    searchedData = response.data && response.data.ReleaseHistory &&
                        getSameRecordFromTwoArrays(response.data.ReleaseHistory, Data.searchedData, "ncoaparentcode");
                }
                sortData(searchedData, '', 'ncoaparentcode');   // ALPD-4229 (12-06-2024) Added sortData for searchedData
                let masterData = {
                    ...Data,
                    ...response.data,
                    searchedData
                }
                sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                //Added by sonia on 18-08-2024 for JIRA ID:4716
                if (response.data.rtn === "Success") {
                    if (inputParam.inputData.newTabReport) {
                        // let value = "";
                        // value = response.data["reportViewURL"];
                        // var win = window.open(value);
                        // if (win) {
                        //     win.focus();
                        // } else {
                        //     intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                        // }
                        if (response.data.filetype === 'jrxml') {
                            let value = "";
                            value = response.data["reportViewURL"];
                            var win = window.open(value);
                            if (win) {
                                win.focus();
                            } else {
                                intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                            }
                        }
                        else if (response.data.filetype === 'mrt') {
                            if (response.data.sourceparameter != undefined && response.data.sourceparameter != "") {
                                // Added btoa() to encode the sapi and srepotlink values by Gowtham on dec 2 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                // Added btoa() to encode the For ALl Parameter values by Neeraj on dec 4 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                let mrtfilePath = reportUrl()
                                    + "?name=" + btoa(inputParam.inputData.userinfo.sreportingtoolfilename)     //en-xml
                                    + "&slanguagetypecode=" + btoa(inputParam.inputData.userinfo.sreportlanguagecode)    //en-us
                                    + "&foldername=" + btoa(response.data.folderName)   //"Quotation-002"//this.props.Login.masterData.SelectedReportDetails.sreportname
                                    + "&filename=" + btoa(response.data.FILEName)  //"a6008692-3e1a-422b-b4da-5e9ad9cf3be6.mrt"//"b701dbc4-d90e-4840-b8e1-942649d6ec25.mrt"//this.props.Login.masterData.SelectedReportDetails.ssystemfilename
                                    + "&sconnectionstring=" + inputParam.inputData.userinfo.sconnectionString
                                    + "&sapi=" + btoa(serverUrl() + "/reststimulsoft/urljson")  //SWSM-121 Start - added the code for security vulnerability - by rukshana
                                    + "&sreportlink=" + btoa(response.data.sreportlink) //inputParam.sreportlink //"//localhost:8090/SharedFolder/QuaLISjrxml"//this.props.Login.reportSettings[15] //this.props.Login.userInfo.sreportLink  
                                    // + "&smrttemplatelink=" + response.data.smrttemplatelink  //inputParam.smrttemplatelink //"//localhost:8090//SharedFolder//ReportJSON//ReportTemplate.json"//this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink
                                    + "&sourceparameter=" + btoa(JSON.stringify(response.data.sourceparameter)); //JSON.stringify(response[0].data.sourceparameter)

                                //console.log("path:",mrtfilePath);
                                window.open(mrtfilePath);

                            }
                        }

                    } else {
                        document.getElementById("download_data").setAttribute("href", response.data.filepath);
                        document.getElementById("download_data").click();
                    }


                } else {
                    toast.warn(response.data.rtn);
                }



                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, change: inputParam.change, masterData, screenName: screenName,
                        modalShow: false, selectedRecord: {}, loadEsign: false, openModal: inputParam.inputData.openModal
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
                    toast.warn(error.response.data['rtn']);
                }
            })
    }
}

export function previewAndFinalReport(inputParam, Data, screenName) {
    return function (dispatch) {

        dispatch(initRequest(true));

        rsapi().post("release/preliminaryRegenerateReport", inputParam.inputData)
            .then(response => {

                let masterData = {
                    ...Data,
                    ...response.data,
                }

                //Added by sonia on 18-08-2024 for JIRA ID:4716 
                if (response.data.rtn === "Success") {
                    if (inputParam.inputData.action == 'Regenerate') {
                        document.getElementById("download_data").setAttribute("href", response.data.filepath);
                        document.getElementById("download_data").click();
                    }
                    else {
                        if (inputParam.inputData.newTabReport) {
                            if (response.data.filetype === 'jrxml') {
                                let value = "";
                                value = response.data["reportViewURL"];
                                var win = window.open(value);
                                if (win) {
                                    win.focus();
                                } else {
                                    intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                                }
                            }
                            else if (response.data.filetype === 'mrt') {
                                if (response.data.sourceparameter != undefined && response.data.sourceparameter != "") {
                                    // Added btoa() to encode the sapi and srepotlink values by Gowtham on dec 2 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                   // Added btoa() to encode the For ALl Parameter values by Neeraj on dec 4 2025 for SWSM-125 JavaReportingTool sensetive data hide through url
                                    let mrtfilePath = reportUrl()
                                        + "?name=" + btoa(inputParam.inputData.userinfo.sreportingtoolfilename)     //en-xml
                                        + "&slanguagetypecode=" + btoa(inputParam.inputData.userinfo.sreportlanguagecode)    //en-us
                                        + "&foldername=" + btoa(response.data.folderName)   //"Quotation-002"//this.props.Login.masterData.SelectedReportDetails.sreportname
                                        + "&filename=" + btoa(response.data.FILEName)  //"a6008692-3e1a-422b-b4da-5e9ad9cf3be6.mrt"//"b701dbc4-d90e-4840-b8e1-942649d6ec25.mrt"//this.props.Login.masterData.SelectedReportDetails.ssystemfilename
                                        + "&sconnectionstring=" + inputParam.inputData.userinfo.sconnectionString
                                        + "&sapi=" + btoa(serverUrl() + "/reststimulsoft/urljson")  //SWSM-121 Start - added the code for security vulnerability - by rukshana
                                        + "&sreportlink=" + btoa(response.data.sreportlink) //inputParam.sreportlink //"//localhost:8090/SharedFolder/QuaLISjrxml"//this.props.Login.reportSettings[15] //this.props.Login.userInfo.sreportLink  
                                        // + "&smrttemplatelink=" + response.data.smrttemplatelink  //inputParam.smrttemplatelink //"//localhost:8090//SharedFolder//ReportJSON//ReportTemplate.json"//this.props.Login.reportSettings[16]//this.props.Login.userInfo.smrttemplateLink
                                        + "&sourceparameter=" + btoa(JSON.stringify(response.data.sourceparameter)); //JSON.stringify(response[0].data.sourceparameter)

                                    //console.log("path:",mrtfilePath);
                                    window.open(mrtfilePath);

                                }
                            }

                        } else {
                            //if(inputParam.inputData.generateReport || inputParam.inputData.action == 'Regenerate')
                            //{                        
                            document.getElementById("download_data").setAttribute("href", response.data.filepath);
                            document.getElementById("download_data").click();
                            // }
                        }
                    }
                } else {
                    toast.warn(response.data.rtn);
                }


                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, change: inputParam.change, masterData, screenName: screenName,
                        modalShow: false, selectedRecord: {}, loadEsign: false, openModal: inputParam.inputData.openModal
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
                    toast.warn(error.response.data['rtn']);
                }
            })
    }
}

export function getRemoveApprovedSample(inputParam, ncontrolCode) {
    return function (dispatch) {
        if (inputParam.masterData && inputParam.masterData.selectedReleaseHistory && inputParam.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let urlArray = [];
            inputParam.inputData['isPopup'] = true
            if (inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.YES) {
                // if(inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.YES && 
                // (inputParam.inputData['nneedsubsample'] === false || 
                // (inputParam.inputData['nneedsubsample'] === true && inputParam.inputData['ncoaparenttranscode'] === transactionStatus.DRAFT))){
                const releaseSample = rsapi().post("release/getReleaseSample", inputParam.inputData);
                //  const reportType = rsapi().post("release/getCOAReportType", { userinfo: inputParam.inputData.userinfo });
                // const projectType = rsapi().post("release/getApprovedProjectType", inputParam.inputData);
                const statusService = rsapi().post("release/getStatusAlert", inputParam.inputData);

                urlArray = [releaseSample, statusService
                    //,reportType
                ];

                dispatch(initRequest(true));
                Axios.all(urlArray)

                    .then(response => {
                        if (response[1].data.Status === "Success") {

                            let masterData = {};
                            let selectedRecord = inputParam.inputData.selectedRecord;

                            let responseData = { ...response[0].data }
                            masterData = {
                                ...inputParam.masterData, ...responseData
                            }


                            // responseData = sortData(responseData)


                            sortData(masterData);
                            dispatch({
                                type: DEFAULT_RETURN, payload: {
                                    masterData,
                                    // selectedRecord,
                                    isDeletePopup: true,
                                    isComboCheck: true,
                                    isEditPopup: false,
                                    ncontrolCode,
                                    loading: false,
                                    showFilter: false,
                                    openModal: true,
                                    isAddPopup: false,
                                    operation: "delete",
                                    ncontrolCode: inputParam.inputData.ncontrolCode,
                                    expandCheck: false,
                                    screenName: inputParam.inputData.screenName,
                                    slideOutClose: false    // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                                }
                            })
                        }
                        else {
                            toast.warn(intl.formatMessage({
                                id: response[1].data.ValidationStatus
                            }));
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    ncontrolCode: ncontrolCode,
                                    loading: false
                                }
                            });

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
                // } else if(inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.NO || 
                //     (inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.YES && inputParam.inputData['ncoaparenttranscode'] !== transactionStatus.DRAFT)){
                //         toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" }));
            } else {
                toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" }));
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                });
                // toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" })+ " "+ intl.formatMessage({ id: "IDS_FOR" })+ " "+ inputParam.inputData['sregsubtypename']);
            }
        }
    }
}
export function getDeleteApprovedSample(inputData, Data1) {


    return function (dispatch) {
        if (inputData !== undefined && inputData.npreregno !== "") {
            // ALPD-4229 (12-06-2024) Deleted searchRef from inputData
            delete (inputData.searchRef);
            dispatch(initRequest(true));
            return rsapi().post("release/deleteRelease",

                inputData
            )
                .then(response => {
                    if (response.data.rtn === "Success") {

                        let masterData = {
                            ...Data1, ...response.data,
                        };
                        sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData,
                                change: inputData.change,
                                loading: false,
                                loadEsign: false,
                                openModal: false,
                                expandCheck: false,
                                slideOutClose: true, // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
                    }
                    else {
                        toast.warn(response.data.rtn);

                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                //    masterData,
                                change: inputData.change,
                                loading: false,
                                // loadEsign: false,
                                // openModal: false,
                                expandCheck: false,
                                slideOutClose: false,
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
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
                        //  console.log("ErrorRelease,", error);

                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTANYONESAMPLE"
            }));
        }
    }
}

//Added by sonia on 11-06-2024 for JIRA ID:4122 Sample Count Validation
export function validationforAppendSamples(inputParam, ncontrolCode) {
    return function (dispatch) {
        if (inputParam.masterData && inputParam.masterData.selectedReleaseHistory && inputParam.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let urlArray = [];
            const sampleCountValidation = rsapi().post("release/sampleCountValidation", inputParam.inputData);
            urlArray = [sampleCountValidation];
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    if (response[0].data.rtn === "Success") {
                        dispatch(getEditApprovedSample(inputParam, ncontrolCode));
                    } else {
                        toast.warn(intl.formatMessage({ id: "IDS_MAXIMUMSAMPLESAPPENDED" }));
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ncontrolCode: ncontrolCode,
                                loading: false
                            }
                        });
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
        }
    }
}
//Modified by sonia on 11-06-2024 for JIRA ID:4122 Sample Count Validation
export function getEditApprovedSample(inputParam, ncontrolCode) {
    return function (dispatch) {
        let urlArray = [];
        inputParam.inputData['isPopup'] = true
        if (inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.YES) {
            // const sampleCountValidation = rsapi().post("release/sampleCountValidation", inputParam.inputData);
            const releaseSample = rsapi().post("release/getReleaseSample", inputParam.inputData);
            //  const reportType = rsapi().post("release/getCOAReportType", { userinfo: inputParam.inputData.userinfo });
            //  const projectType = rsapi().post("release/getApprovedProjectType", inputParam.inputData);
            const statusService = rsapi().post("release/getStatusAlert", inputParam.inputData);
            // const projectStatus = rsapi().post("release/getProjectBasedAlert", inputParam.inputData);

            const testList = rsapi().post("release/getTest", inputParam.inputData)
            const sectionType = rsapi().post("release/getSection", inputParam.inputData);

            // if (inputParam.inputData.ncoareporttypecode === 7) {

            //     urlArray = [ projectType,statusService];
            // }
            // else if (inputParam.inputData.ncoareporttypecode === 8) {
            //     urlArray = [ releaseSample,statusService];
            // }
            // else {
            urlArray = [releaseSample, statusService, testList, sectionType
                //,reportType
            ];
            if (inputParam.DynamicReportFilterTypeItem && inputParam.DynamicReportFilterTypeItem.length > 0) {
                let itemList = [];
                inputParam.DynamicReportFilterTypeItem.map(x => {
                    if (x[designProperties.LISTITEM] === "combo") {
                        itemList.push(
                            {
                                "Pkey": x[designProperties.PRIMARYKEY],
                                "nquerybuildertablecode": x[designProperties.QUERYBUILDERTABLECODE],
                                "tablename": x[designProperties.TABLENAME],
                                "columnname": x[designProperties.COLUMNNAME],
                                "keyName": x[designProperties.VALUE],
                                //ALPDJ21-69--Added by Vignesh(06-10-2025)-->500 error thrown the while clicking the Add Sample
                                "isMultiLingual": x.hasOwnProperty(designProperties.COLUMNDETAILS) && x[designProperties.COLUMNDETAILS].hasOwnProperty("isMultiLingual") && x[designProperties.COLUMNDETAILS].isMultiLingual,
                                "languageTypeCode": inputParam.inputData.userinfo.slanguagetypecode,
                                "recordType": x[designProperties.RECORDTYPE]
                            })
                    }
                })
                inputParam["inputData"]["itemList"] = itemList;
                const reportFilterType = rsapi().post("release/getComboValues", { ...inputParam.inputData, 'userInfo': inputParam.inputData.userinfo });
                urlArray.push(reportFilterType);
            }
            // }
            dispatch(initRequest(true));
            Axios.all(urlArray)

                .then(response => {
                    // const reportTypeMap = constructOptionList(response[1].data.ReportType || [], "ncoareporttypecode",
                    //     "scoareporttypename", undefined, undefined, false);

                    // const ReportTypeList = reportTypeMap.get("OptionList");                   
                    if (response[1].data.Status === "Success") {
                        let ProjectTypeList = [];
                        let sectionList = [];
                        let comboValues = {};
                        let sectionvalue = [];
                        const sectionTypeMap = constructOptionList(response[3].data.sectionList || [], "nsectioncode",
                            "ssectionname", undefined, undefined, false);
                        sectionList = sectionTypeMap.get("OptionList");
                        sectionList.map(x => sectionvalue.push({ "value": x.value, "title": x.label }));
                        let testListMap = response[2] && response[2].data
                        let combovaluesListMap = response[4] && response[4].data
                        let comboValueList = { ...testListMap, ...combovaluesListMap } || {};
                        comboValues = { "s.nsectioncode": sectionvalue, ...comboValueList }
                        // let selectedRecord = {"ncoareporttypecode": {
                        //     "value": response[1].data.ReportType[0].ncoareporttypecode,
                        //      "label": response[1].data.ReportType[0].scoareporttypename
                        // }
                        // };
                        let masterData = {};
                        let openModal = true;

                        let selectedRecord = inputParam.inputData.selectedRecord;

                        if (response[0].data && response[0].data.ReleaseSample.length !== 0) {

                            let responseData = { ...response[0].data }
                            masterData = {
                                ...inputParam.masterData, ...responseData
                            }
                        }
                        else {
                            let responseData = { ...response[0].data }
                            masterData = {
                                ...inputParam.masterData, ...responseData
                            }
                            openModal = false;
                            toast.warn(intl.formatMessage({ id: "IDS_NOSAMPLESAREAVAILABLE" }));
                        }
                        // responseData = sortData(responseData)
                        let awesomeTree;
                        let filterquery;
                        let fields = getFilterConditionsBasedonDataType(inputParam.extractedColumnList, comboValues);
                        if (inputParam.DynamicDefaultStructureItem &&
                            inputParam.DynamicDefaultStructureItem.nsampletypecode === inputParam.inputData.nsampletypecode
                            && inputParam.DynamicDefaultStructureItem.nregtypecode === inputParam.inputData.nregtypecode
                            && inputParam.DynamicDefaultStructureItem.nregsubtypecode === inputParam.inputData.nregsubtypecode) {
                            awesomeTree = inputParam.DynamicDefaultStructureItem && inputParam.DynamicDefaultStructureItem.awesomeTree && checkTree(loadTree(inputParam.DynamicDefaultStructureItem.awesomeTree), inputParam.DynamicDefaultStructureItem.awesomeConfig)
                            filterquery = inputParam.DynamicDefaultStructureItem.filterquery
                        } else {
                            awesomeTree = undefined;
                        }

                        sortData(masterData);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData,
                                // selectedRecord,
                                sectionList,
                                ncontrolCode: inputParam.inputData.ncontrolCode,
                                isDeletePopup: false,
                                isComboCheck: false,
                                isEditPopup: true,
                                ProjectTypeList,
                                loading: false,
                                showFilter: false,
                                openModal: openModal,
                                isAddPopup: false,
                                operation: "append",
                                expandCheck: false,
                                screenName: inputParam.inputData.screenName,
                                sectionvalue,
                                comboValues,
                                awesomeTree: awesomeTree, filterquery, fields,
                                screenNameCopy: inputParam.inputData.screenName,
                                slideOutClose: false    // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                            }
                        })
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: response[1].data.ValidationStatus }));
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ncontrolCode: ncontrolCode,
                                loading: false
                            }
                        });

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
            // }  else if(inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.NO || 
            // (inputParam.inputData['allowAppendRemoveSamples'] === transactionStatus.YES && inputParam.inputData['ncoaparenttranscode'] !== transactionStatus.DRAFT)){
            //     toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" }));
        } else {
            toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" }));
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            });
            // toast.warn(intl.formatMessage({ id: "IDS_SAMPLESARENOTALLOWEDTODELETE" })+ " "+ intl.formatMessage({ id: "IDS_FOR" })+ " "+ inputParam.inputData['sregsubtypename']);
        }

    }
}
export function UpdateApprovedSample(inputData, Data1) {


    return function (dispatch) {
        if (inputData !== undefined && inputData.npreregno !== "") {
            // ALPD-4229 (12-06-2024) Deleted searchRef from inputData
            delete (inputData.searchRef);
            dispatch(initRequest(true));
            return rsapi().post("release/appendRelease", inputData)
                .then(response => {
                    if (response.data.rtn === "Success") {

                        let masterData = {
                            ...Data1, ...response.data,
                        };
                        sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData,
                                change: inputData.change,
                                loading: false,
                                loadEsign: false,
                                openModal: false,
                                expandCheck: false,
                                slideOutClose: true, // ALPD-4208 (22-05-2024) Changes done for expand function in add sample popup
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
                    }
                    else {
                        toast.warn(response.data.rtn);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                //  masterData,
                                change: inputData.change,
                                loading: false,
                                //loadEsign: false,
                                // openModal: false,
                                slideOutClose: false,
                                expandCheck: false,
                                expandFlag: false   //  ALPD-5570   Added expandFlag by Vishakh to handle pagination
                            }
                        });
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
                        // console.log("ErrorRelease,", error);

                    }
                    else {
                        toast.warn(error.response.data);
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTANYONESAMPLE"
            }));
        }
    }
}



export function getreportcomments(inputData, Data) {
    return function (dispatch) {

        dispatch(initRequest(true));

        rsapi().post("release/getreportcomments", inputData)
            .then(response => {
                let masterData = {
                    ...Data,
                    ...response.data,
                }


                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, change: inputData.change, masterData,
                        screenName: "IDS_REPORTINFOCOMMENT",
                        openModal: true, selectedRecord: {}, loadEsign: false
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

export function fetchReportInfoReleaseById(editParam) {
    return function (dispatch) {
        let additionalInfo = [];

        let inputParamData = {
            nreportinforeleasecode: editParam.editRow.nreportinforeleasecode,
            userinfo: editParam.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("release/getActiveReportInfoReleaseById", inputParamData)
            .then(response => {

                // const parameterResults = response.data.ReleaseParameter
                let selectedId = editParam.editRow.nreportinforeleasecode;
                const selectedComment = { ...response.data };
                const masterData = {
                    ...editParam.masterData,
                    selectedComment
                }

                dispatch({
                    type: DEFAULT_RETURN,

                    payload: {
                        screenName: "IDS_REPORTINFOCOMMENTS",
                        selectedId,
                        masterData,
                        //isParameterInitialRender: true,
                        loading: false,
                        openModal: true,
                        // modalShow: true,
                        ReportmodalShow: true,
                        operation: "update",
                        modalTitle: intl.formatMessage({ id: "IDS_COMMENTS" }),

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
        //}


    }
}

//  ALPD-5566   Commented by Vishakh for Report Comments issue
// export function fetchReportInfoReleaseById(editParam) {
//     return function (dispatch) {
//         // let additionalInfo = [];
//         if(editParam.editRow.sreportfieldname === "Report Template"){
//             const alertMsg = intl.formatMessage({ id: "IDS_CANNOTEDIT" }) + " "+ editParam.editRow.sreportfieldname;
//             toast.warn(alertMsg);
//         } else {
//             let inputParamData = {
//                 nreportinforeleasecode: editParam.editRow.nreportinforeleasecode,
//                 userinfo: editParam.userInfo
//             }
//             dispatch(initRequest(true));
//             rsapi().post("release/getActiveReportInfoReleaseById", inputParamData)
//                 .then(response => {

//                     // const parameterResults = response.data.ReleaseParameter
//                     let selectedId = editParam.editRow.nreportinforeleasecode;
//                     const selectedComment = { ...response.data };
//                     const masterData = {
//                         ...editParam.masterData,
//                         selectedComment
//                     }

//                     dispatch({
//                         type: DEFAULT_RETURN,

//                         payload: {
//                             screenName: "IDS_REPORTINFOCOMMENTS",
//                             selectedId,
//                             masterData,
//                             //isParameterInitialRender: true,
//                             loading: false,
//                             openModal: true,
//                             // modalShow: true,
//                             ReportmodalShow: true,
//                             operation: "update",
//                             modalTitle: intl.formatMessage({ id: "IDS_COMMENTS" }),

//                         }
//                     })
//                 })
//                 .catch(error => {
//                     dispatch({
//                         type: DEFAULT_RETURN,
//                         payload: {
//                             loading: false
//                         }
//                     })
//                     if (error.response?.status === 429) {
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                         toast.error(error.message);
//                     } else {
//                         toast.warn(error.response.data);
//                     }
//                 })
//             //}
//         }
//     }
// }


export function UpdateReportComments(userInfo, Data1, inputData) {
    let inputParamData = {
        selectedComment: Data1.selectedComment,
        userinfo: userInfo
    }

    return function (dispatch) {
        //if (inputData !== undefined &&inputData.npreregno!=="") {

        dispatch(initRequest(true));
        return rsapi().post("release/updateReportComment",

            inputParamData
        )
            .then(response => {
                let masterData = {

                    ...Data1, ...response.data,
                    selectedComment: {},
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        screenName: "IDS_REPORTINFOCOMMENT",
                        loading: false,
                        openModal: true,
                        expandCheck: false,
                        modalShow: false,
                        ReportmodalShow: false,
                        isComboCheck: true,

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
                    // console.log("ErrorRelease,", error);

                }
                else {
                    toast.warn(error.response.data);
                }
            })
        // }
        // else {
        //     toast.warn(intl.formatMessage({
        //         id: "IDS_SELECTANYONESAMPLE"
        //     }));
        //}
    }
}
export function getResultCorrectionData(inputParam, ncontrolCode) {
    return function (dispatch) {
        if (inputParam.masterData && inputParam.masterData.selectedReleaseHistory && inputParam.masterData.selectedReleaseHistory.length > 1) {
            toast.warn(intl.formatMessage({ id: "IDS_MULTISELECTAPPLICABLEONLYFORRELEASEACTION" }));
        } else {
            let urlArray = [];
            inputParam.inputData['isPopup'] = true
            const resultCorrection = rsapi().post("release/getResultCorrection", inputParam.inputData);
            //  const reportType = rsapi().post("release/getCOAReportType", { userinfo: inputParam.inputData.userinfo });
            // const projectType = rsapi().post("release/getApprovedProjectType", inputParam.inputData);
            const statusService = rsapi().post("release/getStatusAlert", inputParam.inputData);

            urlArray = [resultCorrection, statusService
                //,reportType
            ];

            dispatch(initRequest(true));
            Axios.all(urlArray)

                .then(response => {
                    if (response[1].data.Status === "Success") {

                        let masterData = {};
                        let selectedRecord = inputParam.inputData.selectedRecord;

                        let responseData = { ...response[0].data }
                        masterData = {
                            ...inputParam.masterData, ...responseData
                        }

                        sortData(masterData);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData,
                                // selectedRecord,
                                isDeletePopup: true,
                                isComboCheck: true,
                                isEditPopup: false,
                                loadEsign: false,
                                ncontrolCode,
                                loading: false,
                                showFilter: false,
                                openModal: true,
                                isCorrectionNeed: true,
                                isAddPopup: false,
                                operation: "delete",
                                ncontrolCode: inputParam.inputData.ncontrolCode,
                                expandCheck: false,
                                hideSave: true,
                                screenName: inputParam.inputData.screenName,


                            }
                        })
                    }
                    else {
                        toast.warn(intl.formatMessage({
                            id: response[1].data.ValidationStatus
                        }));
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ncontrolCode: ncontrolCode,
                                loading: false,
                                expandCheck: false,
                                loadEsign: false,
                                openModal: false
                            }
                        });

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
        }
    }
}
export function fetchParameterById(editParam) {
    return function (dispatch) {
        let additionalInfo = [];

        let inputParamData = {
            ntransactionresultcode: editParam.primaryKeyValue,
            userinfo: editParam.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("release/getReleaseResults", inputParamData)
            .then(response => {
                let selectedResultGrade = [];
                let paremterResultcode = [];
                const parameterResults = response.data.ReleaseParameter
                let predefDefaultFlag = false;
                parameterResults.map((param, index) => {
                    selectedResultGrade[index] = { ngradecode: param.ngradecode };
                    paremterResultcode[index] = param.ntransactionresultcode;
                    let jsondata = JSON.parse(param.jsondata['value'])
                    if (jsondata.hasOwnProperty('additionalInfo')) {
                        additionalInfo[param.ntransactionresultcode] = jsondata['additionalInfo']
                    }
                    predefDefaultFlag = false;
                    (response.data.PredefinedValues && response.data.PredefinedValues[parameterResults[index].ntransactionresultcode]) &&
                        response.data.PredefinedValues[parameterResults[index].ntransactionresultcode].map(predefinedvalue => {
                            // if (predefinedvalue.ndefaultstatus === transactionStatus.YES) {
                            //     if (!predefDefaultFlag) {
                            //         predefDefaultFlag = true;
                            //         response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] = constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                            //             undefined, undefined).get("OptionList");
                            //     }
                            // response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] =
                            //     constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'spredefinedname', 'spredefinedname', undefined,
                            //         undefined, undefined).get("OptionList");
                            //     if (response.data.ResultParameter[index].sresult === null) {
                            //         response.data.ResultParameter[index].sresult = predefinedvalue.spredefinedname;
                            //         response.data.ResultParameter[index].sresultpredefinedname = predefinedvalue.sresultpredefinedname;
                            //         response.data.ResultParameter[index].sfinal = predefinedvalue.spredefinedsynonym;
                            //         response.data.ResultParameter[index].editable = true;
                            //         response.data.ResultParameter[index].ngradecode = predefinedvalue.ngradecode;
                            //         if(predefinedvalue.spredefinedcomments&&predefinedvalue.spredefinedcomments!==null){
                            //             response.data.ResultParameter[index].sresultcomment = predefinedvalue.spredefinedcomments
                            //             &&predefinedvalue.spredefinedcomments;
                            //         }
                            //     }
                            // }
                            //  else {
                            if (!predefDefaultFlag) {
                                predefDefaultFlag = true;
                                response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] = constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                                    undefined, undefined).get("OptionList");
                            }

                            //   }
                            //return null;

                        });
                    //Modified by sonia on 6th Aug 2024 for JIRA ID: ALPD-4566
                    if (parameterResults[index]["nparametertypecode"] == 1) {
                        parameterResults[index]["resultaccuracycode"] = {
                            "value": parameterResults[index]["nresultaccuracycode"],
                            "label": parameterResults[index]["sresultaccuracyname"],
                        };

                        //Modified by sonia on 6th Aug 2024 for JIRA ID: ALPD-4566
                        parameterResults[index]["unitcode"] = {
                            "value": parameterResults[index]["nunitcode"],
                            "label": parameterResults[index]["sunitname"],
                        };
                    }
                    param['editable'] = false;
                    //return null;
                    // response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] =  constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'spredefinedname', 'spredefinedname', undefined,
                    // undefined, undefined).get("OptionList");
                    parameterResults[index] = { ...parameterResults[index], ...jsondata }
                });

                const ResultAccuracyList = constructOptionList(response.data["ResultAccuracy"] || [], "nresultaccuracycode", "sresultaccuracyname", undefined, undefined, false);
                const ResultAccuracy = ResultAccuracyList.get("OptionList");

                const UnitList = constructOptionList(response.data["Unit"] || [], "nunitcode", "sunitname", undefined, undefined, false);
                const Unit = UnitList.get("OptionList");
                //ALPD-4387
                let formFields = [];
                if (response.data.FormFields && response.data.FormFields.length > 0) {
                    let formFieldJSON = JSON.parse(response.data.FormFields[0].jsondata['value'])
                    Object.entries(formFieldJSON).map(([key, value]) => (
                        formFields.push(value)
                    ))
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...editParam.masterData,
                            //...sortData(response.data,"desc","ntransactiontestcode"),
                            ...response.data,
                            paremterResultcode,//,
                            selectedResultGrade,
                            ResultAccuracy,
                            Unit, formFields

                        },
                        selectedRecord: {
                            additionalInfo: additionalInfo.length > 0 ? additionalInfo : [],
                            selectedResultGrade: selectedResultGrade,
                            ReleaseParameter: response.data.ReleaseParameter

                        },
                        parameterResults: response.data.ReleaseParameter,
                        isParameterInitialRender: true,
                        loading: false,
                        // screenName: "IDS_RESULTENTRY",
                        openModal: true,
                        modalShow: true,
                        operation: "update",
                        modalTitle: intl.formatMessage({ id: "IDS_CHANGERESULT" }),
                        selectedId: editParam.primaryKeyValue,
                        //activeTestKey: "IDS_RESULTS",
                        ncontrolcode: editParam.editResultId
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
        //}


    }

}
export function updateCorrectionStatus(inputData, Data, screenname) {


    return function (dispatch) {

        dispatch(initRequest(true));
        return rsapi().post("release/updateCorrectionStatus",

            inputData
        )
            .then(response => {

                if (response.data.rtn === "Success") {
                    // ALPD-4229 (30-05-2024) Added code when search and do action
                    let searchedData = Data.searchedData;
                    if (Data.searchedData && Data.searchedData !== undefined && Data.searchedData.length > 0) {
                        searchedData = response.data && response.data.ReleaseHistory &&
                            getSameRecordFromTwoArrays(response.data.ReleaseHistory, Data.searchedData, "ncoaparentcode");
                    }
                    sortData(searchedData, '', 'ncoaparentcode');   // ALPD-4229 (12-06-2024) Added sortData for searchedData
                    let masterData = {
                        ...Data, ...response.data, searchedData
                    };
                    sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            change: inputData.change,
                            openModal: false,
                            loading: false,
                            loadEsign: false,
                            screenName: screenname

                        }
                    });
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            // masterData,
                            //  change: inputData.change,
                            openModal: false,
                            loading: false,
                            loadEsign: false,

                            //  screenName:screenname

                        }
                    });
                    toast.warn(intl.formatMessage({ id: response.data }));

                }

                // }
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
                    //  console.log("ErrorRelease,", error);

                }
                else {
                    toast.warn(error.response.data);
                }
            })



    }
}
export function validateEsignforRelease(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        // SWSM-48 - Commented by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
        // return rsapi().post("login/validateEsignCredential", inputParam.inputData)
        return inputParam.isEsignOTP ? dispatch(dispatchMethods(inputParam["screenData"])) : rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = "release";
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                        // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["isValidOtp"]
                        delete inputParam["screenData"]["seletedRecord"]["isValidOtp"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["sonetimepassword"]
                    }
                    //dispatch(inputParam["screenData"]["inputParam"].performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
                    // SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication(ONLY FOR RELEASE)
                    if (inputParam["sotpneed"]===true && !inputParam["isValidOtp"]) {
                        dispatch(sendOTPMail(inputParam.inputData.userinfo, "", true))
                    } else {
                        dispatch(dispatchMethods(inputParam["screenData"]))
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
                    toast.info(error.response.data);
                }
            })
    };
}
function dispatchMethods(screenData) {
    return (dispatch) => {
        let doAction = screenData.inputParam.inputData.doAction
        switch (doAction) {
            case "appendsample":
                dispatch(UpdateApprovedSample(screenData.inputParam.inputData, screenData.masterData));
                break;
            case "removesample":
                dispatch(getDeleteApprovedSample(screenData.inputParam.inputData, screenData.masterData, 'openModal'));
                break;
            case "generate":
                dispatch(generateReleasedReport(screenData.inputParam.inputData, screenData.masterData));
                break;
            case "download":
                dispatch(previewAndFinalReport(screenData.inputParam, screenData.masterData));
                break;
            case "correction":
                dispatch(updateCorrectionStatus(screenData.inputParam.inputData, screenData.masterData, screenData.inputParam.inputData.screenName));
                break;
            case "saveasdraft":
                dispatch(getApprovedRecordsAsDraft(screenData.inputParam.inputData, screenData.masterData, screenData.seletedRecord));
                break;
            case "editresult":
                dispatch(crudMaster(screenData.inputParam, screenData.masterData, "modalShow"))
                break;
            case "preliminary":
                dispatch(preliminaryReport(screenData.inputParam, screenData.masterData))
                break;
            case "editReleaseTestAttachment":
                dispatch(onSaveReleaseTestAttachment(screenData.inputParam))
                break;
            case "deleteReleaseTestAttachment":
                dispatch(onDeleteReleaseTestAttachment(screenData.inputParam))
                break;
            case "editReleaseTestComment":
                dispatch(onSaveReleaseTestComment(screenData.inputParam))
                break;
            case "deleteReleaseTestComment":
                dispatch(onDeleteReleaseTestComment(screenData.inputParam))
                break;
            case "editReportTemplate":
                dispatch(SaveReportTemplate(screenData.inputParam))
                break;
            case "createReleaseComment":
                dispatch(SaveReleaseComment(screenData.inputParam))
                break;
            //ALPDJ21-93--Added by Vignesh(19-09-2025)-->Release and report screen -> 500 error occurs, when add the report comments.
            case "sendEmail":
                dispatch(sendReportByMail(screenData.inputParam))
                 break; 

            //ALPDJ21-93--Added by Vignesh(30-10-2025)-->Release and report screen -> new icon added for the HL7 Format Conversion
            case "uploadInHL7Format":
                dispatch(uploadInHL7Format(screenData.inputParam))
                 break; 

            default:
                break;
        }
    }
}

export function viewReportHistory(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/viewReportHistory", inputParam.inputData)
            .then(response => {
                let masterData = inputParam.masterData;
                let PatientReports = response.data.PatientReports;
                masterData = { ...masterData, PatientReports };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        isPatientReports: true,
                        openModal: true,
                        hideSave: true,
                        isAddPopup: false,
                        isEditPopup: false,
                        isDeletePopup: false,
                        masterData,
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function viewReleaseTestAttachment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let methodUrl = "";
        if (inputParam.inputData.actionName === "IDS_RELEASETESTATTACHMENT") {
            methodUrl = "getReleaseTestAttachment";
        } else {
            methodUrl = "getReleaseTestComment";
        }
        rsapi().post("release/" + methodUrl, inputParam.inputData)
            .then(response => {
                let masterData = inputParam.masterData;
                const ReleaseTestAttachmentDetails = response.data.ReleaseTestAttachmentDetails;
                const ReleaseTestCommentDetails = response.data.ReleaseTestCommentDetails;
                const isReleaseTestAttachment = inputParam.inputData.actionName === "IDS_RELEASETESTATTACHMENT";
                const isReleaseTestComment = inputParam.inputData.actionName === "IDS_RELEASETESTCOMMENT";

                const lstRegistrationArno = constructOptionList(response.data.RegistrationArno || [], "npreregno", "sarno", false, false, true);
                const RegistrationArno = lstRegistrationArno.get("OptionList");

                const lstRegistrationSampleArno = constructOptionList(response.data.RegistrationSampleArno || [], "ntransactionsamplecode", "ssamplearno", false, false, true);
                const RegistrationSampleArno = lstRegistrationSampleArno.get("OptionList");

                const lstRegistrationTest = constructOptionList(response.data.RegistrationTest || [], "ntransactiontestcode", "stestsynonym", false, false, true);
                const RegistrationTest = lstRegistrationTest.get("OptionList");

                const lstCommentSubType = constructOptionList(response.data.CommentSubType || [], "ncommentsubtypecode", "scommentsubtype", false, false, true);
                const CommentSubType = lstCommentSubType.get("OptionList");

                // ALPD-4948 Added sample test comments for showing NA record as NA instead of showing '-'
                const lstSampleTestComments = constructOptionList(response.data.SampleTestComments || [], "nsampletestcommentscode", "spredefinedname", false, false, true);
                const SampleTestComments = lstSampleTestComments.get("OptionList");

                masterData = { ...masterData, ReleaseTestAttachmentDetails, ReleaseTestCommentDetails, RegistrationArno, RegistrationSampleArno, RegistrationTest, CommentSubType, SampleTestComments };
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        isReleaseTestAttachment,
                        isReleaseTestComment,
                        openModal: true,
                        isAddPopup: false,
                        isEditPopup: false,
                        isDeletePopup: false,
                        masterData,
                        screenName: inputParam.inputData.actionName,
                        loading: false,
                        isAddReleaseTestAttachment: false,
                        isInitialRender: false
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
                    toast.info(error.response.data);
                }
            })
    }
}

// export function writeJSONTemplate(inputParam){ 
//     return function (dispatch) {    

//         return rsapi().post("release/writeJSONTemplate",

//         { [inputParam.primaryKeyName] :inputParam.selectedReleaseHistory.ncoaparentcode , 
//             "userinfo": inputParam.userInfo}
//     )
//         .then(response => {

//                 dispatch({
//                     type: DEFAULT_RETURN, payload: {
//                         loading: false,
//                         openModal: false,
//                         expandCheck: false,


//                     }
//                 });
//         })
//         .catch(error => {
//             dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
//             if (error.response?.status === 429) {
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                 toast.error(error.message);


//             }
//             else {
//                 toast.warn(error.response.data);
//             }
//         })

// }
// }

export function releaseReportHistory(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("release/getPreliminaryReportHistory", inputParam)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        },
                        //hange: inputData.change,
                        openModal: true,
                        loading: false,
                        loadEsign: false,
                        screenName: inputParam.screenName
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
    };
}
export function versionHistory(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("release/getVersionHistory", inputParam)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        },
                        //hange: inputData.change,
                        openModal: true,
                        loading: false,
                        loadEsign: false,
                        openModalTitle: "IDS_VERSIONHISTORY"
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
    };
}


export function downloadVersionReport(inputParam, Data, screenName) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("release/downloadVersionHistory", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...Data,
                    ...response.data,
                }
                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.FilePath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }

                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, change: inputParam.change, masterData, screenName: screenName,
                        modalShow: false, selectedRecord: {}, loadEsign: false, openModal: inputParam.inputData.openModal
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

export function downloadHistory(inputParam, Data, screenName) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("release/downloadHistory", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...Data,
                    ...response.data,
                }
                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.FilePath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }

                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, change: inputParam.change, masterData, screenName: screenName,
                        modalShow: false, selectedRecord: {}, loadEsign: false
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
                    toast.warn(error.response.data['rtn']);
                }
            })
    }
}

export function getPatientFilterExecuteData(inputParam) {
    return function (dispatch) {

        let obj = { ...inputParam.component, filterquery: inputParam.filterquery, userinfo: inputParam.userinfo }
        dispatch(initRequest(true));
        rsapi().post("/dynamicpreregdesign/getdynamicfilterexecutedata", obj)
            .then(response => {
                const source = inputParam.component.source
                const languageTypeCode = inputParam.userinfo.slanguagetypecode
                const lstData = response.data[inputParam.component.label]
                const multilingual = []
                inputParam.component.filterfields.map(item => {
                    if (item.ismultilingual) {
                        multilingual.push(item.columnname)
                    }
                })
                const optionList = lstData.map(item => {
                    const jsondata = item[source] ? item[source].value ?
                        JSON.parse(item[source].value) : item.jsondata : item.jsondata

                    multilingual.map(mul => {
                        jsondata[mul] =
                            jsondata[mul][languageTypeCode] || jsondata[mul]['en-US'];
                    })
                    // let label = isMultiLingual ?
                    //   jsondata[optionValue]
                    //   [languageTypeCode] || jsondata[optionValue]['en-US']
                    //   : jsondata[optionValue];

                    return jsondata
                });
                if (inputParam.userinfo.nformcode === 161) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: optionList,
                            onExecute: false,
                            loading: false,
                            screenName: "IDS_PATIENTSEARCH"
                        }
                    })
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            lstPatient: optionList,
                            // onExecute: false,
                            loading: false,
                            screenName: "IDS_PATIENTSEARCH"
                        }
                    })
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
                    toast.info(error.response.data.rtn);
                }

            })
    }
}

export function getPatientWiseSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getPatientWiseSample", inputParam)
            .then(response => {
                let openModal = true;
                let screenName = "IDS_ADDSAMPLE";
                let responseData = { ...response.data }

                let masterData = {}
                let lstPatient = []
                masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                }

                if (responseData && responseData.ReleaseSample.length !== 0) {

                    let responseData = { ...response.data }
                    masterData = {
                        ...inputParam.masterData, ...responseData
                    }
                }
                else {
                    let responseData = { ...response.data }
                    masterData = {
                        ...inputParam.masterData, ...responseData
                    }
                    lstPatient = inputParam.Login.lstPatient
                    //openModal = false;
                    screenName = "IDS_PATIENTSEARCH";
                    toast.warn(intl.formatMessage({ id: "IDS_NOSAMPLESAREAVAILABLE" }));
                }




                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {


                        // awesomeTree:fieldList[0].awesomeTree,
                        awesomeConfig: undefined,
                        lstPatient: lstPatient,
                        //lstPatient:[],
                        kendoSkip: 0,
                        kendoTake: 5,
                        masterData,
                        expandCheck: false,


                        isDeletePopup: false,
                        isComboCheck: false,
                        isEditPopup: false,
                        screenName: screenName,//"IDS_ADDSAMPLE",

                        loading: false,
                        showFilter: false,
                        openModal: openModal,
                        isAddPopup: true,
                        operation: "save"
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

export function onSaveReleaseTestAttachment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.inputData.classUrl + "/" + inputParam.inputData.operation + inputParam.inputData.methodUrl, inputParam.inputData.formData)
            .then(response => {
                let ReleaseTestAttachmentDetails = response.data.ReleaseTestAttachmentDetails;
                let masterData = { ...inputParam.inputData.masterData, ReleaseTestAttachmentDetails };
                let selectedRecord = {};
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        isAddReleaseTestAttachment: false,
                        isReleaseTestAttachment: true,
                        loading: false,
                        screenName: inputParam.inputData.screenName,
                        masterData,
                        isInitialRender: false,
                        loadEsign: false,
                        loadEsignStateHandle: false
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
                } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                }
                else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onDeleteReleaseTestAttachment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.inputData.url, {
            "releasetestattachment": inputParam.inputData.releasetestattachment, "userinfo": inputParam.inputData.userinfo
        })
            .then(response => {
                let ReleaseTestAttachmentDetails = response.data.ReleaseTestAttachmentDetails;
                let selectedRecord = {
                    ...inputParam.inputData.selectedRecord, ...response.data
                };
                let masterData = inputParam.inputData.masterData;
                masterData["ReleaseTestAttachmentDetails"] = ReleaseTestAttachmentDetails;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        isReleaseTestAttachment: true,
                        loading: false,
                        screenName: inputParam.inputData.screenName,
                        masterData,
                        loadEsignStateHandle: false
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
                } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                }
                else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onSaveReleaseTestComment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.inputData.classUrl + "/" + inputParam.inputData.operation + inputParam.inputData.methodUrl, inputParam.inputData.formData)
            .then(response => {
                let ReleaseTestCommentDetails = response.data.ReleaseTestCommentDetails;
                let masterData = { ...inputParam.inputData.masterData, ReleaseTestCommentDetails };
                let selectedRecord = {};
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        isAddReleaseTestComment: false,
                        isReleaseTestComment: true,
                        loading: false,
                        screenName: inputParam.inputData.screenName,
                        masterData,
                        isInitialRender: false,
                        loadEsignStateHandle: false
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
                } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                } else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onDeleteReleaseTestComment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post(inputParam.inputData.url, {
            "releasetestcomment": inputParam.inputData.releasetestcomment, "userinfo": inputParam.inputData.userinfo
        })
            .then(response => {
                let ReleaseTestCommentDetails = response.data.ReleaseTestCommentDetails;
                let selectedRecord = {
                    ...inputParam.inputData.selectedRecord, ...response.data
                };
                let masterData = inputParam.inputData.masterData;
                masterData["ReleaseTestCommentDetails"] = ReleaseTestCommentDetails;
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        isReleaseTestComment: true,
                        loading: false,
                        screenName: inputParam.inputData.screenName,
                        masterData,
                        loadEsignStateHandle: false
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
                } else if (error.response && error.response.status === 500) {
                    toast.error(error.message);
                }
                else if (error.response === undefined) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function generatereport(inputParam, Data, screenName) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("release/generateReport", inputParam.inputData)
            .then(response => {
                // let masterData = {
                //     ...Data,
                //     ...response.data,
                // }
                // if (response.data.rtn === "Success") {
                //     document.getElementById("download_data").setAttribute("href", response.data.FilePath);
                //     document.getElementById("download_data").click();
                // } else {
                //     toast.warn(response.data.rtn);
                // }

                dispatch({
                    type: DEFAULT_RETURN, payload:
                    {
                        loading: false, change: inputParam.change, screenName: screenName,
                        modalShow: false, selectedRecord: {}, loadEsign: false
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
                    toast.warn(error.response.data['rtn']);
                }
            })
    }
}

export function editReportTemplate(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getApprovedReportTemplateById", inputParam.inputData)
            .then(response => {
                let responseData = response.data;
                let selectedRecord = inputParam.selectedRecord;
                selectedRecord["nreporttemplatecode"] = responseData.nreporttemplatecode;
                const reportTemplateMap = constructOptionList(responseData.reportTemplateList || [], "nreporttemplatecode", "sreporttemplatename", "nreporttemplatecode",
                    "ascending", false);
                const reportTemplateList = reportTemplateMap.get("OptionList");
                let masterData = inputParam.masterData;
                masterData["reportTemplateList"] = reportTemplateList;
                masterData["selectedReleaseHistory"] = masterData.selectedReleaseHistory && masterData.selectedReleaseHistory.length > 0 &&
                    masterData.selectedReleaseHistory.filter(item => item.ncoaparentcode === inputParam.ncoaparentcode)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData,
                        screenName: intl.formatMessage({ id: "IDS_REPORTTEMPLATE" }),
                        modalTitle: intl.formatMessage({ id: "IDS_EDITREPORTTEMPLATE" }),
                        modalShow: true,
                        loadEsign: false,
                        selectedRecord
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

export function SaveReportTemplate(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/updateReportTemplate", inputParam.inputData)
            .then(response => {
                let masterData = inputParam.masterData;
                // ALPD-4229 (30-05-2024) Added code when search and do action
                if (masterData.searchedData && masterData.searchedData !== undefined && masterData.searchedData.length > 0) {
                    masterData.searchedData.map(item => {
                        if (item.ncoaparentcode === inputParam.inputData.ncoaparentcode) {
                            item["nreporttemplatecode"] = inputParam.inputData.nreporttemplatecode;
                            item["sreporttemplatename"] = inputParam.inputData.sreporttemplatename;
                        }
                    });
                }
                masterData.selectedReleaseHistory[0]["nreporttemplatecode"] = inputParam.inputData.nreporttemplatecode;
                masterData.selectedReleaseHistory[0]["sreporttemplatename"] = inputParam.inputData.sreporttemplatename;
                masterData.ReleaseHistory.map(item => {
                    if (item.ncoaparentcode === inputParam.inputData.ncoaparentcode) {
                        item["nreporttemplatecode"] = inputParam.inputData.nreporttemplatecode;
                        item["sreporttemplatename"] = inputParam.inputData.sreporttemplatename;
                    }
                });
                delete (inputParam.selectedRecord.nreporttemplatecode);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData,
                        modalShow: false,
                        loadEsign: false,
                        openModal: false
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

export function deleteSamples(inputParam, data) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/deleteSamples", inputParam.inputData)
            .then(response => {
                // ALPD-4229 (30-05-2024) Added searchedData as undefined
                inputParam.searchRef.current.value = "";
                let masterData = {
                    ...data, ...response.data, searchedData: undefined
                };
                sortData(masterData.ReleaseHistory, "", 'ncoaparentcode');
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
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
//ALPD-4878-To get previously save filter details when click the filter name,done by Dhanushya RI
export function getReleaseFilter(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getReleaseFilter", { ...inputParam.inputData })
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    ...response.data
                }

                sortData(masterData, "", "nfilternamecode");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        nfilternamecode: inputParam.inputData.nfilternamecode,
                        masterData,
                        loading: false,
                        modalShow: false,
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
export function openReleaseComments(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/getReleaseCommentDetails", inputParam.inputData)
            .then(response => {
                let responseData = response.data;
                let selectedRecord = inputParam.selectedRecord;
                selectedRecord["sreleasecomments"] = responseData.sreleasecomments;

                let masterData = inputParam.masterData;

                // masterData["selectedReleaseHistory"] = masterData.selectedReleaseHistory && masterData.selectedReleaseHistory.length > 0 && 
                //     masterData.selectedReleaseHistory.filter(item => item.ncoaparentcode === inputParam.inputData.ncoaparentcode)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData,
                        screenName: intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }),
                        //modalTitle: intl.formatMessage({ id: "IDS_RELEASECOMMENTS" }),
                        //modalShow: true,
                        openModal: true,
                        loadEsign: false,
                        selectedRecord
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
export function SaveReleaseComment(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/createReleaseComment", inputParam.inputData)
            .then(response => {
                let masterData = inputParam.masterData;
                if (masterData.searchedData && masterData.searchedData !== undefined && masterData.searchedData.length > 0) {
                    masterData.searchedData.map(item => {
                        if (item.ncoaparentcode === inputParam.inputData.ncoaparentcode) {
                            item["ncoaparentcode"] = inputParam.inputData.ncoaparentcode;
                            item["sreleasecomments"] = inputParam.inputData.sreleasecomments;
                        }
                    });
                }
                masterData.selectedReleaseHistory[0]["ncoaparentcode"] = inputParam.inputData.ncoaparentcode;
                masterData.selectedReleaseHistory[0]["sreleasecomments"] = inputParam.inputData.sreleasecomments;
                masterData.ReleaseHistory.map(item => {
                    if (item.ncoaparentcode === inputParam.inputData.ncoaparentcode) {
                        item["ncoaparentcode"] = inputParam.inputData.ncoaparentcode;
                        item["sreleasecomments"] = inputParam.inputData.sreleasecomments;
                    }
                });
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        masterData,
                        modalShow: false,
                        loadEsign: false,
                        openModal: false
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

/* ALPDJ21-55--Added by Vignesh(16-08-2025)--Sent the report by the mail */
export function sendReportByMail(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/sendReportByMail", inputParam.inputData)
            .then(response => {
                const returnStr = response.data["rtn"];
                if (returnStr.toUpperCase() === "SUCCESS") {
                    toast.success(intl.formatMessage({
                        id: "IDS_MAILINITIATED"
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: response.data.rtn
                    }));
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false

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

export function getSync(inputData, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("wqmismasterapiview/createAPIIntegrationDetails", inputData)
            .then(response => {
                if (response.data.rtn !== undefined) {
                    toast.success(intl.formatMessage({
                        id: response.data.rtn
                    }));
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            RegSubTypeValue: inputParam.masterData.RegSubTypeValue
                        },
                        loading: false
                    }
                })
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



//ALPDJ21-93--Added by Vignesh(30-10-2025)-->Release and report screen -> new icon added for the HL7 Format Conversion
export function uploadInHL7Format(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("release/uploadInHL7Format", inputParam.inputData)
            .then(response => {
               const returnStr = response.data["rtn"];
                if (returnStr.toUpperCase() === "SUCCESS") {
                    toast.success(intl.formatMessage({
                        id: "IDS_HL7CONVERSIONINITIATED"
                    }));
                } else {
                    toast.warn(intl.formatMessage({
                        id: response.data.rtn
                    }));
                }

                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false

                    }
                })
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