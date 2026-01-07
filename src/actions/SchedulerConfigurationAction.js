import rsapi from '../rsapi';
import {
    toast
} from 'react-toastify';
import {filterRecordBasedOnTwoArrays,sortData, fillRecordBasedOnCheckBoxSelection,updatedObjectWithNewElement, getRecordBasedOnPrimaryKeyName, reArrangeArrays,filterRecordBasedOnPrimaryKeyName, 
    rearrangeDateFormat, getSameRecordFromTwoArrays,sortDataByParent,constructOptionList,parentChildComboLoad,constructjsonOptionList,childComboLoadForEdit,constructjsonOptionDefault,replaceUpdatedObject} from '../components/CommonScript';
import {transactionStatus,checkBoxOperation} from '../components/Enumeration';
import Axios from 'axios';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { initRequest } from './LoginAction';
import { postCRUDOrganiseTransSearch } from './ServiceAction'
import { intl } from '../components/App';

// ALPD-4914 created SchedulerConfigurationAction.js file for scheduler configuration screen
export function onSampleTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/schedulerconfiguration/getRegistrationType", Map)
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onRegTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        rsapi().post("/schedulerconfiguration/getRegistrationSubType", Map)
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function onRegSubTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/schedulerconfiguration/getApprovalConfigVersion", Map)

            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function changeApprovalConfigVersionChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/schedulerconfiguration/getApproveConfigVersionRegTemplate", Map)

            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data,
                    [labelname]: { ...event.item }
                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, loading: false
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function getSchedulerConfigSample(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("schedulerconfiguration/getSchedulerConfigByFilterSubmit", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    inputData.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                let respObject = {};
                if (inputData.selectedFilter) {
                    respObject = { selectedFilter: { ...inputData.selectedFilter } };
                }
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        subsampleskip: 0,
                        subsampletake: undefined,
                        showSample: undefined,
                        ...respObject,
                        activeSampleTab: inputData.inputData.activeSampleTab, regSampleExisted: false
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
                    toast.info(error.response.data);
                }
            })
    }
}



export function insertSchedulerConfig(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/schedulerconfiguration/createSchedulerConfigWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/schedulerconfiguration/createSchedulerConfig", inputParam.inputData)
        }
        return requestUrl
            .then(response => {
                if (response.data.rtn === "Success") {

                    let SchedulerConfigGetSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.SchedulerConfigGetSample, 'SchedulerConfigSample');
                    let selectedSample = response.data["selectedSample"];
                    let SchedulerConfigGetSubSample = response.data["SchedulerConfigGetSubSample"];
                    let SchedulerConfigGetTest = response.data["SchedulerConfigGetTest"];
                    let selectedSubSample = SchedulerConfigGetSubSample;
                    SchedulerConfigGetTest = sortData(SchedulerConfigGetTest, "nschedulersamplecode", "desc");
                    let selectedTest = SchedulerConfigGetTest.length > 0 ? [SchedulerConfigGetTest[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        SchedulerConfigGetSubSample = sortData(response.data["SchedulerConfigGetSubSample"], 'nschedulersamplecode', 'desc')
                        selectedSubSample = SchedulerConfigGetSubSample.length > 0 ? [SchedulerConfigGetSubSample[0]] : [];
                        SchedulerConfigGetTest = SchedulerConfigGetTest.filter(x => x.nschedulersubsamplecode === selectedSubSample[0].nschedulersubsamplecode)
                        selectedTest = SchedulerConfigGetTest.length > 0 ? response.data["selectedTest"] : [];
                    }
                    if (inputParam.multipleselectionFlag) {
                        selectedSample = updatedObjectWithNewElement(response.data["selectedSample"], masterData.selectedSample);
                        updatedObjectWithNewElement(response.data["selectedSubSample"], masterData.SchedulerConfigGetSubSample);
                        updatedObjectWithNewElement(response.data["selectedTest"], masterData.SchedulerConfigGetTest);
                        SchedulerConfigGetSubSample = masterData.SchedulerConfigGetSubSample;
                        SchedulerConfigGetTest = masterData.SchedulerConfigGetTest;
                    }

                    masterData = {
                        ...masterData, ...response.data,
                        selectedSample, selectedSubSample, selectedTest,
                        SchedulerConfigGetSubSample, SchedulerConfigGetTest, SchedulerConfigGetSample,
                    }
                    if (masterData["kendoFilterList"] !== undefined) {
                        masterData["kendoFilterList"] = undefined;
                    }
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        selectedRecord: undefined,
                        loading: false,
                        loadPreregister: false,
                        showSample: undefined,
                        openPortal: false,
                        selectedSpec: {},
                        selectComponent: {},
                        SelectedTest: {},
                        selectedComponent: {},
                        Component: [],
                        selectedRecord: {},
                        SelectedTest: [],
                        Test: [],
                        selectedComponent: {},
                        subSampleDataGridList: [],
                        preregConfirmMessage: undefined,
                        regSampleExisted, loadImportFileData: false, loadImportSampleCountData: false,
                        skip: 0,
                        subsampleskip: 0,
                        testskip: 0,
                        isDynamicViewSlideOut: false,
                    }
                    inputParam.postParamList[0]['clearFilter'] = 'yes';
                    inputParam.postParamList[1]['clearFilter'] = 'yes';
                    inputParam.postParamList[2]['clearFilter'] = 'yes';
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    toast.warn(response.data.rtn);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false, preregConfirmMessage: undefined } })
                }

            })
            .catch(error => {
                // console.log(error);
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false, preregConfirmMessage: undefined } })
                    toast.error(error.message);
                }
                else {
                    if (error.response.data.NeedConfirmAlert) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                showConfirmAlert: true,
                                preregConfirmMessage: error.response.data.rtn,
                                preregConfirmParam: { inputParam, masterData },
                                loading: false,
                                showSample: undefined,
                            }
                        });
                    }
                    else {
                        toast.warn(error.response.data);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                                showConfirmAlert: false, preregConfirmMessage: undefined
                            }
                        });

                    }
                }
            })
    }
}

export function getSchedulerConfigSubSampleDetail(inputData, isServiceRequired, isParentValue) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
           // activeTestTab: inputData.activeTestTab,
          //  activeSampleTab: inputData.activeTestTab,
          //  activeSubSampleTab: inputData.activeTestTab,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedsubsample: inputData.nneedsubsample,
            nschedulersamplecode: inputData.nschedulersamplecode,
        ntype: inputData.nneedsubsample === true ? inputData.checkBoxOperation === 7 ? 4 : undefined:2, //ALPD-497
            ntype: inputData.nneedsubsample === true ? inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL ? checkBoxOperation.SINGLEDESELECT : undefined : checkBoxOperation.DESELECT, //ALPD-497
           checkBoxOperation: inputData.nneedsubsample === true ?
               inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS ? checkBoxOperation.SINGLESELECT : inputData.checkBoxOperation : inputData.checkBoxOperation,
           // OrderCodeData: inputData.selectedSample ? inputData.selectedSample.length > 0 && inputData.selectedSample.map(item => item.hasOwnProperty("OrderCodeData") ? item.OrderCodeData : -1).join(",") : null,
            selectednschedulersamplecode: inputData.selectedSample && inputData.selectedSample.length > 0 ? inputData.selectedSample.map(item => item.nschedulersamplecode).join(",") : null,
            selectedTransactionSamplecode: inputData.selectedSample && inputData.selectedSample.length > 1
                && inputData.masterData.selectedSubSample ? inputData.masterData.selectedSubSample.map(item => item.nschedulersubsamplecode).join(",") : null,
          //  noutsourcerequired: inputData.masterData && inputData.masterData.RealSampleTypeValue ? inputData.masterData.RealSampleTypeValue.noutsourcerequired : transactionStatus.NA
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("schedulerconfiguration/getSchedulerConfigSubSample", inputParamData)
                .then(response => {
                    sortData(response.data, "descending", "nschedulersamplecode");
                    // if(isParentValue){
                    response.data['SchedulerConfigGetSubSample'] = sortDataByParent(response.data['SchedulerConfigGetSubSample'], inputData.sample, "nschedulersamplecode");
                    //response.data['SchedulerConfigGetTest']= sortDataByParent(response.data['SchedulerConfigGetTest'],response.data['SchedulerConfigGetSubSample'], "ntransactionsamplecode");
                    //  }
                   
                    let masterData = {}
                    let skipInfo = {}
                    let oldSelectedTest = inputData.masterData.selectedTest || []
                 //   let externalOrderAttachmentList = response.data && response.data.ExternalOrderAttachmentList;
                //    let outsourceDetailsList = response.data && response.data.OutsourceDetailsList;
                    if (subSample) {
                        let oldSelectedSubSample = inputData.masterData.selectedSubSample
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                            inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersamplecode",
                            inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample,
                            selectedPreregno: inputData.nschedulersamplecode,
                            selectedSubSample: inputData.masterData.SchedulerConfigGetSubSample.length > 0 ?
                                [inputData.masterData.SchedulerConfigGetSubSample[0]] : [],
                            activeTabIndex: inputData.activeTabIndex,
                        }
                       // let RegistrationTestComment = [];
                   //     let RegistrationTestAttachment = [];
                     //   let RegistrationParameter = [];
                     //   let RegistrationComment = [];
                        //if (inputData.checkBoxOperation === 1 || inputData.checkBoxOperation === 7) {  
                        //if (inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {

                            const wholeSubSampleList = masterData.SchedulerConfigGetSubSample.map(b => b.nschedulersubsamplecode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedSubSample.forEach((subsample, index) => {
                            //     if (!wholeSubSampleList.includes(subsample.ntransactionsamplecode)) {
                            //         oldSelectedSubSample.splice(index, 1)
                            //     }

                            // })
                            oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                                wholeSubSampleList.includes(item.nschedulersubsamplecode)
                            );
                            // END ALPD-3625 VISHAKH
                            if (oldSelectedSubSample.length > 0) {
                                masterData = {
                                    ...masterData,
                                    selectedSubSample: oldSelectedSubSample
                                }
                            }
                            const selectedTest = getSameRecordFromTwoArrays(oldSelectedTest,
                                masterData.selectedSubSample, 'nschedulersamplecode')
                            masterData = {
                                ...masterData,
                                selectedTest
                            }
                        }
                        //  if (inputData.checkBoxOperation === 7) {
                        if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                           
                      /*      switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    {
                                        let ResponseData = response.data.RegistrationTestAttachment ? response.data.RegistrationTestAttachment : [];
                                        let RegistrationTestAttachment1 = [];
                                        if (inputData.masterData.RegistrationTestAttachment !== undefined) {
                                            RegistrationTestAttachment1 = [...inputData.masterData.RegistrationTestAttachment, ...ResponseData];
                                        }
                                        let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                        RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"
                                    }
                                    break;
                                case "IDS_PARAMETERRESULTS":
                                    let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                    let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                    let ntransactiontestcode1 = masterData.selectedTest.length > 0 ? masterData.selectedTest[0].ntransactiontestcode : -1
                                    RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                default:
                                    let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment2 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment2 = [...inputData.masterData.RegistrationTestComment, ...ResponseData1];
                                    }
                                    let ntransactionTestCode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                            masterData['RegistrationTestComment'] = RegistrationTestComment;
                            masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                            masterData["RegistrationParameter"] = RegistrationParameter;
                            masterData["RegistrationComment"] = RegistrationComment;*/
                        }
                        //if (inputData.checkBoxOperation === 3 || inputData.checkBoxOperation === 5) {
                        if (inputData.checkBoxOperation === checkBoxOperation.SINGLESELECT || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                            masterData = {
                                ...masterData,
                                selectedTest: masterData.SchedulerConfigGetTest.length > 0 ? [masterData.SchedulerConfigGetTest[0]] : []
                            }

                          /*  switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [
                                            // ...inputData.masterData.RegistrationTestComment, 
                                            ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    {
                                        let ResponseData = response.data.RegistrationTestAttachment ? response.data.RegistrationTestAttachment : [];
                                        let RegistrationTestAttachment1 = [];
                                        if (inputData.masterData.RegistrationTestAttachment !== undefined) {
                                            RegistrationTestAttachment1 = [
                                                // ...inputData.masterData.RegistrationTestAttachment, 
                                                ...ResponseData];
                                        }
                                        let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                        RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"
                                    }
                                    break;
                                case "IDS_PARAMETERRESULTS":
                                    let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                    let RegistrationParameter1 = [
                                        // ...inputData.masterData.RegistrationParameter, 
                                        ...resultResponseData];
                                    let ntransactiontestcode1 = masterData.selectedTest.length > 0 ? masterData.selectedTest[0].ntransactiontestcode : -1
                                    RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_SAMPLECOMMENTS":
                                    RegistrationComment = response.data.RegistrationComment ?
                                        [...response.data.RegistrationComment] : [];
                                    activeName = "RegistrationComment"
                                    dataStateName = "sampleCommentsDataState"
                                    break;
                                default:
                                    let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment2 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment2 = [
                                            // ...inputData.masterData.RegistrationTestComment, 
                                            ...ResponseData1];
                                    }
                                    let ntransactionTestCode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                            masterData['RegistrationTestComment'] = RegistrationTestComment;
                            masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                            masterData["RegistrationParameter"] = RegistrationParameter;
                            masterData["RegistrationComment"] = RegistrationComment;*/

                        }
                       // masterData['ExternalOrderAttachmentList'] = externalOrderAttachmentList;
                       // masterData['OutsourceDetailsList'] = outsourceDetailsList;
                        let { testskip, testtake, subsampleskip, subsampletake } = inputData
                        // let bool = false;
                        // Commented bool value because no need to check bool condition to update skipInfo value.
                        // if (inputData.masterData.SchedulerConfigGetSubSample.length < inputData.subsampleskip) {
                        testskip = 0;
                        subsampleskip = 0;
                        // bool = true
                        // }
                        // if (bool) {
                        skipInfo = { testskip, testtake, subsampleskip, subsampletake }
                        // }
                    } else {

                        //let oldSelectedTest = inputData.masterData.selectedTest
                        //  let oldSelectedSubSample = inputData.masterData.selectedSubSample
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                            inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersamplecode",
                            inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample,
                            selectednschedulersamplecode: inputData.nschedulersamplecode,
                            selectedTest: inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                                [inputData.masterData.SchedulerConfigGetTest[0]] : [],
                            selectedSubSample: inputData.masterData.SchedulerConfigGetSubSample,
                        }
                        // let RegistrationTestComment = [];
                        // let RegistrationParameter = [];
                        // let RegistrationTestAttachment = [];
                        // let RegistrationComment = [];

                        //if (inputData.checkBoxOperation === 7 || inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL || inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
                            const wholeTestList = masterData.SchedulerConfigGetTest.map(b => b.nschedulertestcode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedTest.forEach((test, index) => {
                            //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            //         oldSelectedTest.splice(index, 1)
                            //     }

                            // })
                            oldSelectedTest = oldSelectedTest.filter(item =>
                                wholeTestList.includes(item.nschedulertestcode)
                            );
                            // START ALPD-3625 VISHAKH
                            let keepOld = false;
                            let nschedulertestcode;
                            let nschedulersamplecode;
                            if (oldSelectedTest.length > 0) {
                                keepOld = true
                                masterData = {
                                    ...masterData,
                                    selectedTest: oldSelectedTest,
                                }
                            } else {
                                nschedulertestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                                    inputData.masterData.SchedulerConfigGetTest[0].nschedulertestcode : ""
                                    nschedulersamplecode = inputData.masterData.SchedulerConfigGetSample.length > 0 ?
                                    inputData.masterData.SchedulerConfigGetSample[0].nschedulersamplecode : ""
                            }
                           /* switch (inputData.activeTestTab) {
                                case "IDS_PARAMETERRESULTS":
                                    RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter ?
                                        inputData.masterData.RegistrationParameter : [] :
                                        getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    {
                                        RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment ?
                                            inputData.masterData.RegistrationTestAttachment : [] :
                                            getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"

                                    }
                                    break;
                                case "IDS_TESTCOMMENTS":
                                    RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment ?
                                        inputData.masterData.RegistrationTestComment : [] :
                                        getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_SAMPLECOMMENTS":
                                    RegistrationComment = keepOld ? inputData.masterData.RegistrationComment ?
                                        inputData.masterData.RegistrationComment : [] :
                                        getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationComment, npreregno, "npreregno")
                                    activeName = "RegistrationComment"
                                    dataStateName = "sampleCommentsDataState"
                                    break;
                                default:
                                    RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter ?
                                        inputData.masterData.RegistrationParameter : [] :
                                        getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }*/
                        }
                        //else if (inputData.checkBoxOperation === 5) {
                        else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                         /*   switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment1 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    {
                                        let ResponseData = response.data.RegistrationTestAttachment ? response.data.RegistrationTestAttachment : [];
                                        let RegistrationTestAttachment1 = [];
                                        if (inputData.masterData.RegistrationTestAttachment !== undefined) {
                                            RegistrationTestAttachment1 = [...inputData.masterData.RegistrationTestAttachment, ...ResponseData];
                                        }
                                        let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                        RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"

                                    }
                                    break;
                                case "IDS_PARAMETERRESULTS":
                                    let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                    let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                    let ntransactiontestcode1 = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_SAMPLECOMMENTS":
                                    RegistrationComment = response.data.RegistrationComment ?
                                        [...response.data.RegistrationComment] : [];
                                    activeName = "RegistrationComment"
                                    dataStateName = "sampleCommentsDataState"
                                    break;
                                default:
                                    let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                    let RegistrationTestComment2 = [];
                                    if (inputData.masterData.RegistrationTestComment !== undefined) {
                                        RegistrationTestComment2 = [...inputData.masterData.RegistrationTestComment, ...ResponseData1];
                                    }
                                    let ntransactionTestCode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }*/
                            // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                        }
                        else {
                            /*switch (inputData.activeTestTab) {
                                case "IDS_TESTCOMMENTS":
                                    RegistrationTestComment = response.data.RegistrationTestComment ?
                                        [...response.data.RegistrationTestComment] : [];
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    {
                                        RegistrationTestAttachment = response.data.RegistrationTestAttachment ?
                                            [...response.data.RegistrationTestAttachment] : [];
                                        activeName = "RegistrationTestAttachment"
                                        dataStateName = "testCommentDataState"

                                    }
                                    break;
                                case "IDS_PARAMETERRESULTS":
                                    RegistrationParameter = response.data.RegistrationParameter ?
                                        [...response.data.RegistrationParameter] : [];
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_SAMPLECOMMENTS":
                                    RegistrationComment = response.data.RegistrationComment ?
                                        [...response.data.RegistrationComment] : [];
                                    activeName = "RegistrationComment"
                                    dataStateName = "sampleCommentsDataState"
                                    break;
                                default:
                                    RegistrationParameter = response.data.RegistrationParameter ?
                                        [...response.data.RegistrationParameter] : [];
                                    activeName = "RegistrationParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }*/
                        }
                     
                        let { testskip, testtake } = inputData
                        let bool = false;

                        if (inputData.masterData.SchedulerConfigGetTest.length < inputData.testskip) {
                            testskip = 0;
                            bool = true
                        }
                        if (bool) {
                            skipInfo = { testskip, testtake }
                        }

                    }
                    if (inputData.masterData.selectedSample && inputData.sampleGridDataState
                        && inputData.masterData.selectedSample.length <= inputData.sampleGridDataState.skip) {
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState: {
                                ...inputData.sampleGridDataState,
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState: {
                                ...inputData.sampleGridDataState,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTest'] = undefined
                    }
                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = ""
                        masterData['searchedSubSample'] = undefined
                    }
                    // let inputParam = { attachmentskip: undefined }
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
                   // Start of ALPD-4130 on Save Additional Filter - ATE-241
                    let multifilterInfo = {}
                    if (inputData.multiFilterLoad !== undefined) {
                        if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                            inputData.searchSampleRef.current.value = "";
                        }
                        if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                            inputData.searchSubSampleRef.current.value = "";
                        }
                        if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                            inputData.searchTestRef.current.value = "";
                        }
                        multifilterInfo = {
                            multiFilterLoad: inputData.multiFilterLoad,
                            openModal: inputData.openModal,
                            searchSampleRef: inputData.searchSampleRef,
                            searchSubSampleRef: inputData.searchSubSampleRef,
                            searchTestRef: inputData.searchTestRef,
                            testskip: inputData.testskip,
                            subsampleskip: inputData.subsampleskip,
                            skip: inputData.skip,
                            // filterColumnActive:true
                        }
                    }
                    //  End of ALPD-4130 ATE-241
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeSampleTab: inputData.activeSampleTab,
                            activeTestTab: inputData.activeTestTab,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo,
                            activeTabIndex: inputData.activeTabIndex,
                            // ALPD-4130 Additional Filter Info ATE-241
                            ...multifilterInfo,
                            // inputParam:inputData
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
                        toast.info(error.response.data);
                    }
                })
        }
        else {

            let bool = false;
            let skipInfo = {};
            let { testskip, testtake, subsampletake, subsampleskip } = inputData;
            let oldSelectedTest = inputData.masterData.selectedTest
            let oldSelectedSubSample = inputData.masterData.selectedSubSample
            // let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let isGrandChildGetRequired = false;
            let TestSelected = [];
            let subSampleSelected = [];


            if (inputData["statusNone"]) {
                TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].nschedulersamplecode, "nschedulersamplecode");
                subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].nschedulersamplecode, "nschedulersamplecode");
            }
            else {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].nschedulersamplecode, "nschedulersamplecode");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].nschedulersamplecode, "nschedulersamplecode");
            }

            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let selectedSample = inputData.selectedSample;
                let filterTestSameOldSelectedTest = getSameRecordFromTwoArrays(oldSelectedTest, inputData.masterData.SchedulerConfigGetTest, "nschedulertestcode");
                let selectedTest = filterTestSameOldSelectedTest.length > 0 ? filterTestSameOldSelectedTest :
                    inputData.masterData.SchedulerConfigGetTest.length > 0 ? [inputData.masterData.SchedulerConfigGetTest[0]] : [];
                let nschedulertestcode = selectedTest.length > 0 ? selectedTest.map(x => x.nschedulertestcode).join(",") : "-1";
                let selectedSubSample = inputData.masterData.SchedulerConfigGetSubSample

                if (subSample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
                    selectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.SchedulerConfigGetSubSample[0]];
                    if (inputData.masterData.SchedulerConfigGetSubSample.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }

                }
                // START ALPD-3671 VISHAKH
                let masterData = { ...inputData.masterData, selectedSample, selectedSubSample, selectedTest }
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                if (inputData.masterData.SchedulerConfigGetTest.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = { ...skipInfo, testskip, testtake }
                }
                // inputData = {
                //     ...inputData, childTabsKey: ["RegistrationTestComment", "RegistrationParameter"], ntransactiontestcode, masterData, selectedTest,
                //     selectedSubSample, checkBoxOperation: 3, skipInfo, masterData
                // }
                inputData = {
                    ...inputData, nschedulertestcode, masterData, selectedTest,
                    selectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, skipInfo, masterData
                }
                if (subSample) {
                    if (selectedTest.length === 0) {
                        inputData["nschedulersamplecode"] = selectedSubSample.map(x => x.nschedulersamplecode).join(",")
                        inputData["nschedulersubsamplecode"] = selectedSubSample.map(x => x.nschedulersubsamplecode).join(",")
                        // inputData["checkBoxOperation"] = 3
                        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                        inputData["childTabsKey"] = ["SchedulerConfigGetTest"]
                       dispatch(getSchedulerTestDetail(inputData, true));
                    } else {
                        //dispatch(getTestChildTabDetailRegistration(inputData, true));
                    }
                } else {
                  //  dispatch(getTestChildTabDetailRegistration(inputData, true));
                }
            }
            else {
                let masterData = {
                    ...inputData.masterData,
                    selectedSample: inputData.selectedSample,
                    selectedPreregno: inputData.nschedulersamplecode,
                    selectedTest: TestSelected ? TestSelected : inputData.masterData.SchedulerConfigGetTest.length > 0 ? [inputData.masterData.SchedulerConfigGetTest[0]] : [],
                    // RegistrationTestComment,
                    selectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.SchedulerConfigGetSubSample
                }
                // START ALPD-3671 VISHAKH
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                let subsamplecheck = true;
                if (subSample) {
                    let SubSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedSubSample, inputData.removeElementFromArray[0].nschedulersamplecode, "nschedulersamplecode");
                    if (SubSampleSelected.length > 0) {
                        let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
                        if (filterSelectedSubSample.length === 0) {
                            let wholeSubSample = masterData.SchedulerConfigGetSubSample.map(b => b.nschedulersubsamplecode)
                            // START ALPD-3625 VISHAKH
                            // oldSelectedSubSample.forEach((test, index) => {
                            //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                            //         oldSelectedSubSample.splice(index, 1)
                            //     }
                            //     return null;
                            // })
                            oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                                wholeSubSample.includes(item.nschedulersubsamplecode)
                            );
                            // END ALPD-3625 VISHAKH
                            if (oldSelectedSubSample.length === 0 && wholeSubSample.length > 0
                                && masterData.selectedTest.length === 0) {
                                const selectedSubSample1 = [inputData.masterData.SchedulerConfigGetSubSample[0]];
                                masterData = {
                                    ...masterData,
                                    selectedSubSample: selectedSubSample1,
                                    selectedTest: []
                                }
                                inputData = { ...inputData, ...masterData }
                                inputData["nschedulersamplecode"] = selectedSubSample1.map(x => x.nschedulersamplecode).join(",")
                                inputData["nschedulersubsamplecode"] = selectedSubSample1.map(x => x.nschedulersubsamplecode).join(",")
                                // inputData["checkBoxOperation"] = 3
                                inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                                inputData["childTabsKey"] = ["SchedulerConfigGetTest"]
                                subsamplecheck = false;
                              //  dispatch(getRegistrationTestDetail(inputData, true));

                            }
                        } else {
                            oldSelectedSubSample = filterSelectedSubSample
                        }

                    } else {
                        let wholeSubSample = masterData.SchedulerConfigGetSubSample.map(b => b.nschedulersubsamplecode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedSubSample.forEach((test, index) => {
                        //     if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubSample.includes(item.nschedulersubsamplecode)
                        );
                        // END ALPD-3625 VISHAKH
                    }

                    if (subsamplecheck) {
                        masterData = {
                            ...masterData,
                            selectedSubSample: oldSelectedSubSample
                        }
                    }
                    if (inputData.masterData.SchedulerConfigGetSubSample.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampleskip, subsampletake }
                    }
                }
                let wholeTestList = masterData.SchedulerConfigGetTest.map(b => b.nschedulertestcode)
                // START ALPD-3625 VISHAKH
                // oldSelectedTest.forEach((test, index) => {
                //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                //         oldSelectedTest.splice(index, 1)
                //     }
                //     return null;
                // })
                oldSelectedTest = oldSelectedTest.filter(item =>
                    wholeTestList.includes(item.nschedulertestcode)
                );
                // END ALPD-3625 VISHAKH
                let keepOld = false;
                let nschedulertestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        selectedTest: oldSelectedTest
                    }
                } else {
                    nschedulertestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].nschedulertestcode : "-1"
                }
               // masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, nschedulertestcode, "nschedulertestcode")
              //  masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, nschedulertestcode, "nschedulertestcode")
                let skipInfo = {};
                if (inputData.masterData.SchedulerConfigGetTest.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = { ...skipInfo, testskip, testtake }
                }

                let dataStateArray = [
                    { activeName: 'selectedSample', dataStateName: 'sampleGridDataState' },
                    { activeName: 'RegistrationSourceCountry', dataStateName: 'sourceDataState' },
                    { activeName: 'RegistrationTestComment', dataStateName: 'testCommentDataState' },
                    { activeName: 'RegistrationParameter', dataStateName: 'resultDataState' },
                ]
                dataStateArray.map(arr => {
                    if (inputData[arr.dataStateName] && masterData[arr.activeName] &&
                        masterData[arr.activeName].length <= inputData[arr.dataStateName].skip) {
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    return null;
                });
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        ...skipInfo,
                        // activeTabIndex: inputData.activeTabIndex
                    }
                })
            }

        }

    }
}export function getSchedulerTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            nschedulersubsamplecode: inputData.nschedulersubsamplecode,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            activeSubSampleTab: inputData.activeSubSampleTab,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation,
            nneedsubsample: inputData.nneedsubsample,
            selectedTransactionsamplecode: inputData.selectedSubSample && inputData.selectedSubSample.length > 0 && inputData.selectedSubSample.map(item => item.nschedulersubsamplecode).join(","),
            noutsourcerequired: inputData.masterData && inputData.masterData.RealSampleTypeValue ? inputData.masterData.RealSampleTypeValue.noutsourcerequired : transactionStatus.NA

        }
        const subSample = inputData.nneedsubsample;
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("schedulerconfiguration/getSchedulerConfigTest", inputParamData)
                .then(response => {
                    //sortData(response.data);
                    //ALPD-1609
                    sortData(response.data, 'descending', 'nschedulersamplecode')
                    let oldSelectedTest = inputData.masterData.selectedTest || []
                    let oldSelectedSubSample = inputData.masterData.selectedSubSample || []
                   // let outsourceDetailsList = response.data && response.data.OutsourceDetailsList;
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                        inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersubsamplecode",
                        inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        selectedSubSample: inputData.selectedSubSample,
                        selectedTransactionsamplecode: inputData.nschedulersubsamplecode,
                        selectedTest: inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                            [inputData.masterData.SchedulerConfigGetTest[0]] : [],
                        // RegistrationTestComment,
                    }

                    //let wholeRegistrationTestComments = [];
                    // let RegistrationTestComment = [];
                    // let RegistrationTestAttachment = [];
                    // let RegistrationParameter = [];
                    // let RegistrationSampleComment = [];
                    // let RegistrationSampleAttachment = [];
                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
                        const wholeTestList = masterData.SchedulerConfigGetTest.map(b => b.nschedulertestcode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedTest.forEach((test, index) => {
                        //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        //         oldSelectedTest.splice(index, 1)
                        //     }

                        // })
                        oldSelectedTest = oldSelectedTest.filter(item =>
                            wholeTestList.includes(item.nschedulertestcode)
                        );
                        // END ALPD-3625 VISHAKH
                        let keepOld = false;
                        let nschedulertestcode;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                selectedTest: oldSelectedTest,
                            }
                        } else {
                            nschedulertestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                                inputData.masterData.SchedulerConfigGetTest[0].nschedulertestcode : ""
                        }
                     /*   switch (inputData.activeTestTab) {
                            case "IDS_PARAMETERRESULTS":
                                RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter ?
                                    inputData.masterData.RegistrationParameter : [] :
                                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment ?
                                    inputData.masterData.RegistrationTestComment : [] :
                                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment ?
                                    inputData.masterData.RegistrationTestAttachment : [] :
                                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testCommentDataState"
                                break;
                            default:
                                RegistrationParameter = keepOld ? inputData.masterData.RegistrationParameter ?
                                    inputData.masterData.RegistrationParameter : [] :
                                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
*/


                    }
                    // else if (inputData.checkBoxOperation === 5) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                        /*switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment1 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                }
                                let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                {
                                    let ResponseData = response.data.RegistrationTestAttachment ? response.data.RegistrationTestAttachment : [];
                                    let RegistrationTestAttachment1 = [];
                                    if (inputData.masterData.RegistrationTestAttachment !== undefined) {
                                        RegistrationTestAttachment1 = [...inputData.masterData.RegistrationTestAttachment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestAttachment"
                                    dataStateName = "testCommentDataState"
                                }
                                break;
                            case "IDS_PARAMETERRESULTS":
                                let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                let ntransactiontestcode1 = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            default:
                                let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment2 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment2 = [...inputData.masterData.RegistrationTestComment, ...ResponseData1];
                                }
                                let ntransactionTestCode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }*/
                        // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                    }
                    // else if (inputData.checkBoxOperation === 7) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                        let testList = reArrangeArrays(inputData.masterData.SchedulerConfigGetSubSample, response.data.SchedulerConfigGetTest, "nschedulersubsamplecode");
                        masterData = {
                            ...masterData,
                            selectedTest: testList ? testList.length > 0 ? [testList[0]] : [] : [],
                            SchedulerConfigGetTest: testList ? testList.length > 0 ? testList : [] : [],
                            //ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                        }

                       /* switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                let ResponseData = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment1 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment1 = [...inputData.masterData.RegistrationTestComment, ...ResponseData];
                                }
                                let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment1, ntransactiontestcode, "ntransactiontestcode");
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                {
                                    let ResponseData = response.data.RegistrationTestAttachment ? response.data.RegistrationTestAttachment : [];
                                    let RegistrationTestAttachment1 = [];
                                    if (inputData.masterData.RegistrationTestAttachment !== undefined) {
                                        RegistrationTestAttachment1 = [...inputData.masterData.RegistrationTestAttachment, ...ResponseData];
                                    }
                                    let ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(RegistrationTestAttachment1, ntransactiontestcode, "ntransactiontestcode");
                                    activeName = "RegistrationTestAttachment"
                                    dataStateName = "testCommentDataState"
                                }
                                break;
                            case "IDS_PARAMETERRESULTS":
                                let resultResponseData = response.data.RegistrationParameter ? response.data.RegistrationParameter : [];
                                // let RegistrationParameter1 = [...inputData.masterData.RegistrationParameter, ...resultResponseData];
                                let RegistrationParameter1 = [...resultResponseData];
                                let ntransactiontestcode1 = testList ? testList.length > 0 ? testList[0].ntransactiontestcode : inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1 : -1

                                RegistrationParameter = getRecordBasedOnPrimaryKeyName(RegistrationParameter1, ntransactiontestcode1, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            default:
                                let ResponseData1 = response.data.RegistrationTestComment ? response.data.RegistrationTestComment : [];
                                let RegistrationTestComment2 = [];
                                if (inputData.masterData.RegistrationTestComment !== undefined) {
                                    RegistrationTestComment2 = [...inputData.masterData.RegistrationTestComment, ...ResponseData1];
                                }
                                let ntransactionTestCode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : -1
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(RegistrationTestComment2, ntransactionTestCode, "ntransactiontestcode");
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }*/
                        // RegistrationTestComment = response.data.RegistrationTestComment ? [...response.data.RegistrationTestComment] : [];
                    }
                    else {
                      /*  switch (inputData.activeTestTab) {
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = response.data.RegistrationTestComment ?
                                    [...response.data.RegistrationTestComment] : [];
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = response.data.RegistrationTestAttachment ?
                                    [...response.data.RegistrationTestAttachment] : [];
                                activeName = "RegistrationTestAttachment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_PARAMETERRESULTS":
                                RegistrationParameter = response.data.RegistrationParameter ?
                                    [...response.data.RegistrationParameter] : [];
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                            default:
                                RegistrationParameter = response.data.RegistrationParameter ?
                                    [...response.data.RegistrationParameter] : [];
                                activeName = "RegistrationParameter"
                                dataStateName = "resultDataState"
                                break;
                        }*/
                    }
                    if (subSample) {
                        let wholeSubsampleList = masterData.SchedulerConfigGetSubSample.map(b => b.nschedulersubsamplecode)
                        // START ALPD-3625 VISHAKH
                        // oldSelectedSubSample.map((test, index) => {
                        //     if (!wholeSubsampleList.includes(test.ntransactionsamplecode)) {
                        //         oldSelectedSubSample.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        oldSelectedSubSample = oldSelectedSubSample.filter(item =>
                            wholeSubsampleList.includes(item.nschedulersubsamplecode)
                        );
                        // END ALPD-3625 VISHAKH
                        let keepOld = false;
                        let nschedulersubsamplecode;
                        if (oldSelectedSubSample.length > 0) {
                            keepOld = true
                        } else {
                            nschedulersubsamplecode = masterData.selectedSubSample[0].nschedulersubsamplecode
                        }

                       /* switch (inputData.activeSubSampleTab) {
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
                        }*/
                    }
                  /*  masterData['RegistrationTestComment'] = RegistrationTestComment;
                    masterData['RegistrationTestAttachment'] = RegistrationTestAttachment;
                    masterData["RegistrationParameter"] = RegistrationParameter;
                    masterData["RegistrationSampleComment"] = RegistrationSampleComment;
                    masterData["RegistrationSampleAttachment"] = RegistrationSampleAttachment;
                    masterData['OutsourceDetailsList'] = outsourceDetailsList;*/
                    let { testskip, testtake, subsampleskip, subsampletake } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.SchedulerConfigGetTest.length < inputData.testskip) {
                    testskip = 0;
                    // bool = true
                    // }
                    if (inputData.masterData.SchedulerConfigGetSubSample.length < inputData.subsampleskip) {
                        subsampleskip = 0;
                        // bool = true
                    }
                    // if (bool) {
                    skipInfo = { testskip, testtake, subsampleskip, subsampletake }
                    // }
                    if (inputData.masterData.selectedSample && inputData.sampleGridDataState
                        && inputData.masterData.selectedSample.length <= inputData.sampleGridDataState.skip) {
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState: {
                                ...inputData.sampleGridDataState,
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            sampleGridDataState: {
                                ...inputData.sampleGridDataState,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTest'] = undefined
                    }
                    //  let inputParam = { attachmentskip: undefined }
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
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            // activeTabIndex: inputData.activeTabIndex,
                            activeSampleTab: inputData.activeSampleTab,
                            activeTestTab: inputData.activeTestTab,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo,
                            //  inputParam
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
                        toast.info(error.response.data);
                    }
                })
        } else {
            let oldSelectedTest = inputData.masterData.selectedTest
            // START ALPD-3625 VISHAKH
            // let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            let TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedTest, inputData.removeElementFromArray[0].nschedulersubsamplecode, "nschedulersubsamplecode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            // END ALPD-3625 VISHAKH
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersubsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let nschedulertestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ? inputData.masterData.SchedulerConfigGetTest[0].nschedulertestcode.toString() : "-1";
                let selectedSubSample = inputData.selectedSubSample;
                // let selectedPreregno = inputData.npreregno;
                let selectedTest = inputData.masterData.SchedulerConfigGetTest.length > 0 ? [inputData.masterData.SchedulerConfigGetTest[0]] : [];
                // let selectedSubSample = inputData.masterData.SchedulerConfigGetSubSample
                let masterData = { ...inputData.masterData, selectedSubSample, selectedTest }
                // inputData = {
                //     ...inputData, childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "RegistrationParameter"], ntransactiontestcode, masterData, selectedTest,
                //     selectedSubSample, checkBoxOperation: 3, activeTabIndex: inputData.masterData.activeTabIndex
                // }
                // START ALPD-3671 VISHAKH
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                inputData = {
                    ...inputData, childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "RegistrationParameter"], nschedulertestcode, masterData, selectedTest,
                    selectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, activeTabIndex: inputData.masterData.activeTabIndex
                }
                //dispatch(getTestChildTabDetailRegistration(inputData, true));
            } else {
                let masterData = {
                    ...inputData.masterData,
                    selectedSubSample: inputData.selectedSubSample,
                    selectedSchedulersubsamplecode: inputData.nschedulersubsamplecode,
                    selectedTest: inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                        [inputData.masterData.SchedulerConfigGetTest[0]] : [],
                }
                // START ALPD-3671 VISHAKH
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                const wholeTestList = masterData.SchedulerConfigGetTest.map(b => b.ntransactiontestcode)
                // START ALPD-3625 VISHAKH
                // oldSelectedTest.forEach((test, index) => {
                //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                //         oldSelectedTest.splice(index, 1)
                //     }
                //     return null;
                // })
                oldSelectedTest = oldSelectedTest.filter(item =>
                    wholeTestList.includes(item.ntransactiontestcode)
                );
                // END ALPD-3625 VISHAKH
                let keepOld = false;
                let ntransactiontestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        selectedTest: oldSelectedTest,
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.SchedulerConfigGetTest.length > 0 ?
                        inputData.masterData.SchedulerConfigGetTest[0].ntransactiontestcode : "-1"
                }
                masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment ?
                    inputData.masterData.RegistrationTestComment : [] :
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter ?
                    inputData.masterData.RegistrationParameter : [] :
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, ntransactiontestcode, "ntransactiontestcode")
                let skipInfo = {};
                let dataStateArray = [
                    { activeName: 'selectedSample', dataStateName: 'sampleGridDataState' },
                    { activeName: 'RegistrationSourceCountry', dataStateName: 'sourceDataState' },
                    { activeName: 'RegistrationTestComment', dataStateName: 'testCommentDataState' },
                    { activeName: 'RegistrationParameter', dataStateName: 'resultDataState' },
                ]
                dataStateArray.map(arr => {
                    if (inputData[arr.dataStateName] && masterData[arr.activeName] &&
                        masterData[arr.activeName].length <= inputData[arr.dataStateName].skip) {
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            [arr.dataStateName]: {
                                ...inputData[arr.dataStateName],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    return null;
                });
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        // activeTabIndex: inputData.activeTabIndex,
                        ...skipInfo
                    }
                })
            }

        }

    }
}

export function ReloadDataSchedulerConfig(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("schedulerconfiguration/getSchedulerConfigByFilterSubmit", { ...inputData.inputData })
            .then(response => {
                let masterData = {
                    ...inputData.masterData,
                    ...response.data
                }
                if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    inputData.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                    inputData.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                let respObject = {};
                if (inputData.selectedFilter) {
                    respObject = { selectedFilter: { ...inputData.selectedFilter } };
                }
                sortData(masterData, "descending", "nschedulersamplecode");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        subsampleskip: 0,
                        subsampletake: undefined,
                        showSample: undefined,
                        ...respObject,
                        activeSampleTab: inputData.inputData.activeSampleTab, regSampleExisted: false
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
                    toast.info(error.response.data);
                }
            })
    }
}

export function getTestChildTabDetailSchedulerConiguration(inputData, isServiceRequired) {
    return function (dispatch) {
        if (inputData.nschedulertestcode === "") {
            inputData.nschedulertestcode = "0";
        }
        if (inputData.nschedulertestcode && inputData.nschedulertestcode.length > 0) {
            let inputParamData = {
                nschedulertestcode: inputData.nschedulertestcode,
                nschedulersamplecode: inputData.nschedulersamplecode,
                ndesigntemplatemappingcode:inputData.ndesigntemplatemappingcode,
                userinfo: inputData.userinfo,
                nschedulersubsamplecode: inputData.nschedulersubsamplecode ? inputData.nschedulersubsamplecode :
                    inputData.selectedSubSample && inputData.selectedSubSample.map(item => item.nschedulersubsamplecode).join(",")
            }
            let url = null
            let { testtake } = inputData;
            let activeName = "";
            let dataStateName = "";
         
          
                dispatch(initRequest(true));
                if (isServiceRequired) {
                    rsapi().post("schedulerconfiguration/getSchedulerConfigParameter", { ...inputParamData })
                        .then(response => {
                            let skipInfo = {};
                            let responseData = { ...response.data, selectedSample: inputData.selectedSample || inputData.masterData.selectedSample, selectedTest: inputData.selectedTest }
                            //responseData = sortData(responseData)
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "nschedulersubsamplecode", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                selectedSample: inputData.selectedSample || inputData.masterData.selectedSample,
                                selectedTest: inputData.selectedTest,
                                selectedSchedulerSamplecode: inputData.nschedulersamplecode,
                                selectedSchedulerSubSamplecode: inputData.nschedulersubsamplecode,
                                selectedSchedulerTestCode: inputData.nschedulertestcode,
                                activeTabIndex: inputData.activeTabIndex,
                                activeTabId: inputData.activeTabId
                            }
                            if (inputData["resultDataState"] && masterData["RegistrationParameter"] && masterData["RegistrationParameter"].length <= inputData["resultDataState"].skip) {

                                skipInfo = {

                                    ["resultDataState"]: {
                                        ...inputData["resultDataState"],
                                        skip: 0,
                                        sort: undefined,
                                        filter: undefined
                                    }
                                }
                            } else {
                                skipInfo = {
                                    ...skipInfo,
                                    ["resultDataState"]: {
                                        ...inputData["resultDataState"],
                                        sort: undefined,
                                        filter: undefined
                                    }
                                }
                            }
                            dispatch({
                                type: DEFAULT_RETURN, payload: {
                                    masterData,
                                    activeTabIndex: inputData.activeTabIndex,
                                    activeTabId: inputData.activeTabId,
                                    loading: false,
                                    showFilter: false,
                                    activeTestTab: inputData.activeTestTab,
                                    screenName: inputData.screenName,
                                    testtake, testskip: undefined,
                                    ...skipInfo
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
                                toast.info(error.response.data);
                            }
                        })
                } else {
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "nschedulertestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        selectedTest: inputData.selectedTest,
                        selectedSchedulerSamplecode: inputData.nschedulersamplecode,
                        selectedSchedulerSubSamplecode: inputData.nschedulersubsamplecode,
                        selectedSchedulerTestCode: inputData.nschedulertestcode,
                    }
                    if (inputData["resultDataState"] && masterData["SchedulerConfigurationParameter"].length <= inputData["resultDataState"].skip) {

                        skipInfo = {

                            ["resultDataState"]: {
                                ...inputData["resultDataState"],
                                skip: 0,
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    } else {
                        skipInfo = {
                            ...skipInfo,
                            ["resultDataState"]: {
                                ...inputData["resultDataState"],
                                sort: undefined,
                                filter: undefined
                            }
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            screenName: inputData.screenName,
                            testtake, testskip: undefined,
                            ...skipInfo
                        }
                    })
                }

            
            } else {
            let {  SchedulerConfigurationParameter } = inputData.masterData
            SchedulerConfigurationParameter=[];

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData: {
                        ...inputData.masterData,
                        selectedTest: [],
                        SchedulerConfigurationParameter
                    }, loading: false,
                    activeTabIndex: inputData.activeTabIndex,
                    activeTabId: inputData.activeTabId,
                }
            })
        }
    }
}

export function addsubSampleSchedulerConfiguration(masterData, userinfo, regcolumnList,
    selectRecord, regchildColumnList,
    regSubSamplecomboComponents,
    regSubSamplewithoutCombocomponent, Map, ncontrolcode, specBasedComponent, specBasedTestPackage) {
    return function (dispatch) {
        const urlArray = []
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const parentcolumnlist= regcolumnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true))
        urlArray[0] = timeZoneService;
        const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist:parentcolumnlist ,
            childcolumnlist: regchildColumnList,
            userinfo
        })
        urlArray[1] = actualService;

        if (specBasedComponent) {
            const ComponentTestBySpec = rsapi().post("/schedulerconfiguration/getComponentBySpec", {
                ...Map,
                specBasedComponent: specBasedComponent,
                userinfo
            })
            urlArray[2] = ComponentTestBySpec;
        } else {

            const TestGet = rsapi().post("/schedulerconfiguration/getTestfromDB", {
                nallottedspeccode: Map["nallottedspeccode"],
                slno: 1,
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,
                conditionalTestPackage: true,
                nneedsubsample: Map["nneedsubsample"],
                userinfo

            })
            urlArray[2] = TestGet;
            const TestPackageGet = rsapi().post("/schedulerconfiguration/getTestfromTestPackage", {
                nallottedspeccode: Map["nallottedspeccode"],
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,userinfo
            });
            urlArray[5] = TestPackageGet;
            const TestSectionGet = rsapi().post("/schedulerconfiguration/getTestfromSection", {
                nallottedspeccode: Map["nallottedspeccode"],
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,
                userinfo
            });
            urlArray[6] = TestSectionGet;

        }
        const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo
        })

        urlArray[3] = currentDate

        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: regSubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo
        })
        urlArray[4] = dateService
        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userinfo.stimezoneid, value: userinfo.ntimezonecode }
                const newcomboData = parentChildComboLoad(regcolumnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)), response[1].data,
                    selectRecord, regchildColumnList, regSubSamplewithoutCombocomponent, undefined, userinfo.slanguagetypecode, userinfo)
                let TestCombined = [];
                let lstComponent = [];
                let PackageData = [];
                let TestSectionData = [];
                const selectedRecord1 = newcomboData.selectedRecord
                if (specBasedComponent) {

                    const lstComponentMap = constructOptionList(response[2].data.lstComponent || [], "ncomponentcode",
                        "scomponentname", undefined, undefined, true);

                    lstComponent = lstComponentMap.get("OptionList");
                    //Commented by Dhanushya for jira ETICA-22
                    // if (lstComponent.length > 0) {
                    //     selectedRecord1['ncomponentcode'] = { ...lstComponent[0] }
                    //     selectedRecord1["Sample Name"] = selectedRecord1['ncomponentcode'].label;
                    //     selectedRecord1["nspecsampletypecode"] = selectedRecord1['ncomponentcode'].item.nspecsampletypecode;
                    //     selectedRecord1["nneedsubsample"] = Map.nneedsubsample

                    // }

                } else {
                    //if (specBasedTestPackage) {
                    const PackageDataMap = constructOptionList(response[5].data.TestPackage || [], "ntestpackagecode",
                        "stestpackagename", undefined, undefined, true);
                    PackageData = PackageDataMap.get("OptionList");

                    const TestSectionDataMap = constructOptionList(response[6].data.TestSection || [], "nsectioncode",
                        "ssectionname", undefined, undefined, true);
                    TestSectionData = TestSectionDataMap.get("OptionList");

                    // if (PackageData.length === 0) {
                    //     dispatch(getAllTest(selectComponent, LoginProps, undefined, specBasedComponent, undefined, false, undefined)); 
                    // } 
                    // }
                    // else {
                    TestCombined = response[2].data;
                    // }
                }
                const comboData1 = newcomboData.comboData

                regSubSamplewithoutCombocomponent.map(componentrow => {
                    if (componentrow.inputtype === "date") {
                        if (componentrow.loadcurrentdate) {
                            selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[3].data) : "";
                            selectedRecord1[componentrow.label + "value"] = selectedRecord1[componentrow.label];
                        } else if (componentrow.nperiodcode) {
                            selectedRecord1[componentrow.label + "value"] = response[4].data[componentrow.label] ?
                                new Date(response[4].data[componentrow.label]["datevalue"]) : null;
                            if (componentrow.loadselecteddate) {
                                selectedRecord1[componentrow.label] = response[4].data[componentrow.label] ?
                                    new Date(response[4].data[componentrow.label]["datevalue"]) : null;
                            }
                            //    selectedRecord1[componentrow.label]=response[2].data[componentrow.label]?
                            //    new Date(response[2].data[componentrow.label]):null;
                        } else {
                            selectedRecord1[componentrow.label + "value"] = new Date();
                        }

                        if (componentrow.hidebeforedate) {
                            selectedRecord1[componentrow.label + "min"] = selectedRecord1[componentrow.label + "value"]
                        }
                        if (componentrow.hideafterdate) {
                            selectedRecord1[componentrow.label + "max"] = selectedRecord1[componentrow.label + "value"]
                        }

                    }
                    else if (componentrow.inputtype === "radio"
                        || componentrow.inputtype === "checkbox"
                        || componentrow.inputtype === "predefineddropdown") {

                        if (componentrow['radiodefaultvalue']) {
                            if (componentrow.inputtype === "checkbox") {

                                let val = ''
                                componentrow.radiodefaultvalue &&
                                    componentrow.radiodefaultvalue.length > 0 && componentrow.radiodefaultvalue.map((x, i) => {
                                        val = val + (i === componentrow.radiodefaultvalue.length - 1 ? x.label : x.label + ',')
                                    })

                                selectedRecord1[componentrow.label] = val

                            } else if (componentrow.inputtype === "predefineddropdown") {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue : "";
                            } else {
                                selectedRecord1[componentrow.label] = componentrow.radiodefaultvalue ?
                                    componentrow.radiodefaultvalue.label : "";
                            }

                        } else {
                            if (componentrow.inputtype === "radio") {
                                selectedRecord1[componentrow.label] = componentrow.radioOptions ?
                                    componentrow.radioOptions.tags[0].text : "";
                            }
                        }

                    }

                })

                const inputParam = {
                    screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    showSaveContinue: false,
                    parentPopUpSize: "lg",
                    loading: false,
                    lstComponent,
                    openModal: true,
                    loadPrinter: false,
                    operation: "create",
                    loadScheduleSubSample: true,
                    selectedRecord: selectedRecord1,
                    regSubSamplecomboData: comboData1,
                    regSubSamplecomboComponents,
                    regSubSamplewithoutCombocomponent,
                    TestCombined,
                    regparentSubSampleColumnList: regcolumnList,
                    regchildSubSampleColumnList: regchildColumnList,
                    ncontrolCode: ncontrolcode,
                    timeZoneList,
                    defaultTimeZone,
                    masterData,
                    specBasedComponent,
                    specBasedTestPackage,
                    TestPackage: PackageData,
                    //ALPD-624
                    testskip: 0,
                    subsampleskip: 0,
                    TestSection: TestSectionData, AllTest: TestCombined, AllSection: TestSectionData,
                    userinfo
                }
                // if (specBasedComponent) {
                //Added by Dhanushya for jira ETICA-22
                if (specBasedComponent && selectedRecord1['ncomponentcode']!==undefined) {

                    dispatch(schedulerComponentTest(selectedRecord1, true, specBasedComponent, [], specBasedTestPackage, true, inputParam))
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { ...inputParam } })
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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }

}

//method renamed by L.Subashini 13/12/2025 while upgrading to React 17
export function schedulerComponentTest(selectedobject, Reg, specBasedComponent, Component, specBasedTestPackage, conditionalTestPackage, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const urlArray = []
        Component = Component ? Component : []
        const TestGet = rsapi().post("/schedulerconfiguration/getTestfromDB", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            nneedsubsample: selectedobject.nneedsubsample,
            userinfo:inputParam.userinfo
        });
        urlArray[0] = TestGet;
        const TestPackageGet = rsapi().post("/schedulerconfiguration/getTestfromTestPackage", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            userinfo:inputParam.userinfo
        });
        urlArray[1] = TestPackageGet;

        const TestSectionGet = rsapi().post("/schedulerconfiguration/getTestfromSection", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            userinfo:inputParam.userinfo
        });
        urlArray[2] = TestSectionGet;
        Axios.all(urlArray).then(response => {
            let PackageData = []
            let TestData = []
            let TestSectionData = []
            // if (specBasedTestPackage) {
            const PackageDataMap = constructOptionList(response[1].data.TestPackage || [], "ntestpackagecode",
                "stestpackagename", undefined, undefined, true);
            PackageData = PackageDataMap.get("OptionList");

            const testSectionDataMap = constructOptionList(response[2].data.TestSection || [], "nsectioncode",
                "ssectionname", undefined, undefined, true);
            TestSectionData = testSectionDataMap.get("OptionList");

            // if (PackageData.length === 0) {
            //     dispatch(getAllTest(selectComponent, LoginProps, undefined, specBasedComponent, undefined, false, undefined)); 
            // } 
            //   }
            //    else {
            TestData = response[0].data;
            //  }
            //let Test = [];
            // Test[selectedobject.slno] = TestData;
            const Map = {}
            if (Reg) {
                Map["selectedRecord"] = selectedobject
            } else {
                Map["selectComponent"] = selectedobject
            }
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    ...inputParam, TestCombined: TestData, AllTest: TestData, TestPackage: PackageData, ...Map, loading: false, selectedTestData: [],
                    selectPackage: [], TestSection: TestSectionData, selectSection: [], AllSection: TestSectionData

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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

//method renamed by L.Subashini 13/12/2025 while upgrading to React 17
export function schedulerTestSectionTest(selectedobject, Reg, specBasedComponent, Component, selectComponent, objComponent, LoginProps, selectPackage, selectSection, subSampleBased, selectedSpec, nneedsubsample, action) {

    return function (dispatch) {
        dispatch(initRequest(true));
        Component = Component ? Component : [];
        // console.log("LoginProps:", LoginProps);
        rsapi().post("/schedulerconfiguration/getTestBasedTestSection", {
            nspecsampletypecode: selectComponent && selectComponent.nspecsampletypecode ? selectComponent.nspecsampletypecode : selectedobject.nspecsampletypecode,
            specBasedComponent: specBasedComponent,
            ntestpackagecode: selectPackage.ntestpackagecode && selectPackage.ntestpackagecode.value || -1,
            nsectioncode: selectSection.nsectioncode.value,
            nallottedspeccode: selectedSpec && selectedSpec.value !== undefined ? selectedSpec.value : selectedobject.nallottedspeccode,
            userinfo:LoginProps.userInfo
        })
            .then(response => {
                const Map = {}
                let TestData = response.data;
                let Test = (action !== "AddSubSample") ? (LoginProps.Test || []) : [];

                let componentTest = [];
                if (subSampleBased) {
                    componentTest = Test[Component ? Object.keys(Component).length + 1 : 1] ? Test[Component ? Object.keys(Component).length + 1 : 1] : [];

                } else {
                    componentTest = objComponent && Test[objComponent.slno] ? Test[objComponent.slno] : [];

                }
                const availableTest = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");
                const TestCombined = filterRecordBasedOnTwoArrays(TestData, componentTest, "ntestcode");

                delete selectedobject.ntestgrouptestcode;
                if (Reg) {
                    Map["selectedRecord"] = selectedobject
                } else {
                    Map["selectPackage"] = selectPackage
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        availableTest, TestCombined, ...Map, loading: false, selectedTestData: [],
                        AllTest: LoginProps.AllTest

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
                } else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function saveSchedulerSubSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/schedulerconfiguration/createSubSampleWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/schedulerconfiguration/createSubSample", inputParam.inputData);
        }
        return requestUrl
            .then(response => {
                let SchedulerConfigGetSubSample = updatedObjectWithNewElement(inputParam.inputData.masterData.SchedulerConfigGetSubSample, response.data["selectedSubSample"]);
                let SchedulerConfigGetTest = response.data["selectedTest"];
                let selectedSubSample = response.data["selectedSubSample"];
                //let SchedulerConfigGetSubSample=response.data["SchedulerConfigGetSubSample"] && response.data["SchedulerConfigGetSubSample"];
                SchedulerConfigGetTest = sortData(SchedulerConfigGetTest, "nschedulersamplecode", "desc");
                let selectedTest = SchedulerConfigGetTest.length > 0 ? [SchedulerConfigGetTest[0]] : [];
                let SchedulerConfigurationParameter = response.data["SchedulerConfigurationParameter"];
                SchedulerConfigurationParameter = SchedulerConfigurationParameter ? getSameRecordFromTwoArrays(SchedulerConfigurationParameter, selectedTest, 'nschedulertestcode') : SchedulerConfigurationParameter;
              //  let SchedulerConfigGetSample = replaceUpdatedObject(response.data["selectedSample"], inputParam.inputData.masterData.SchedulerConfigGetSample, 'nschedulersamplecode');
                //let selectedSample = response.data["selectedSample"];



                let masterData = { ...inputParam.inputData.masterData }
                masterData = {
                    ...masterData, ...response.data,
                    selectedSubSample, selectedTest,
                    SchedulerConfigGetSubSample, SchedulerConfigGetTest, SchedulerConfigurationParameter,
                }
                let respObject = {
                    masterData,
                    openModal: false,
                    loadEsign: false,
                    loading: false,
                    showSample: undefined,
                    selectedRecord: {},
                    loadScheduleSubSample: false,
                    showConfirmAlert: false,
                    subSampleConfirmMessage: undefined
                }
                inputParam.postParamList[0]['clearFilter'] = 'no';
                inputParam.postParamList[1]['clearFilter'] = 'yes';
                inputParam.postParamList[2]['clearFilter'] = 'yes';
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                
            })
            .catch(error => {
               
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false, subSampleConfirmMessage: undefined } })
                    toast.error(error.message);
                }
                else {
                    if (error.response.data.NeedConfirmAlert) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                showConfirmAlert: true,
                                subSampleConfirmMessage: error.response.data.rtn,
                                subSampleConfirmParam: { inputParam },
                                loading: false
                            }
                        });
                    } else if (error.response.data.rtn) {
                        toast.warn(intl.formatMessage({
                            id: error.response.data.rtn
                        }));
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                            }
                        });
                    }
                    else {
                        toast.error(error.message);
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                                showConfirmAlert: false, subSampleConfirmMessage: undefined
                            }
                        });

                    }
                }
            })
    }

}

export function getEditSchedulerSubSampleComboService(inputParam, columnList, selectedRecord1,
    childColumnList, comboComponents,
    withoutCombocomponent, specBasedComponent) {
    return function (dispatch) {
        let { userInfo, operation, masterData } = { ...inputParam };
        if(masterData["selectedSubSample"][0].ntransactionstatus===transactionStatus.DRAFT){

        if (masterData["selectedSubSample"].length > 1 ||
            masterData["selectedSubSample"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            inputParam.editSubSampleSchedulerParam["getSubSampleChildDetail"] = true;
        }

        masterData["selectedSubSample"] = [];
        masterData["selectedSubSample"].push(inputParam["mastertoedit"]);

        inputParam.editSubSampleSchedulerParam["nschedulersamplecode"] = inputParam["mastertoedit"]["nschedulersamplecode"];
        inputParam.editSubSampleSchedulerParam["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
        inputParam.editSubSampleSchedulerParam["nfilterstatus"] = inputParam["mastertoedit"]["ntransactionstatus"];
        inputParam.editSubSampleSchedulerParam["napprovalconfigcode"] = inputParam["mastertoedit"]["napprovalconfigcode"];

        const nschedulersubsamplecode = inputParam.mastertoedit[inputParam.primaryKeyName];
        if (nschedulersubsamplecode === undefined) {
            toast.info(intl.formattedMessage({ id: "IDS_SELECTVALIDSUBSAMPLE" }));
        }
        else {
            let urlArray = [];

            const timeZoneService = rsapi().post("timezone/getTimeZone");
           
            const selectedRegistration = rsapi().post("/schedulerconfiguration/getEditSchedulerSubSampleComboService", {
                ...inputParam.editSubSampleSchedulerParam, nschedulersubsamplecode, parentcolumnlist: columnList,
                childcolumnlist: childColumnList,
                userinfo: userInfo
            })

            const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
                userinfo: userInfo
            })


            urlArray = [timeZoneService, selectedRegistration, dateService]
          
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    let selectedRecord = { ...response[1].data["EditData"] };

                    selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }

                    const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                    const timeZoneList = timeZoneMap.get("OptionList");
                    const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }

                    if (specBasedComponent) {
                        selectedRecord["ncomponentcode"] = { label: selectedRecord["scomponentname"], value: selectedRecord["ncomponentcode"] }
                    }
                    const languagetypeCode = undefined
                    const comboData = response[1].data;
                    delete comboData['EditData']
                    let comboValues = {}
                    if (columnList.length > 0) {
                        columnList.map(x => {
                            if (x.inputtype === 'combo') {
                                if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
                                {
                                    if (comboData[x.label].length > 0) {
                                        if (comboData[x.label][0].label === undefined) {
                                            const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                            comboData[x.label] = optionList.get("OptionList");
                                        } else {
                                            comboData[x.label] = comboData[x.label]
                                            const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                        }
                                    } else {
                                        comboData[x.label] = []
                                    }
                                    //comboValues = childComboLoad(x, comboData, selectedRecord, 
                                    //   childColumnList, withoutCombocomponent)\
                                    comboValues = childComboLoadForEdit(x, comboData, selectedRecord,
                                        childColumnList, withoutCombocomponent)
                                } else {
                                    comboValues = {
                                        "comboData": comboData,
                                    }
                                }
                            } else {
                                comboValues = {
                                    comboData: comboData,
                                    ...comboValues
                                }
                            }
                        })
                    }
                    else {
                        comboValues = {
                            "comboData": comboData,
                        }
                    }
                    // withoutCombocomponent.map(date => {
                    //     if (date.inputtype === 'date')
                    //         selectedRecord[date.label] = selectedRecord[date.label] && selectedRecord[date.label] !== '-' ?
                    //             rearrangeDateFormat(userInfo, selectedRecord[date.label]) : "";
                    // })

                    withoutCombocomponent.map(date => {
                        if (date.inputtype === 'date') {
                            selectedRecord[date.label] = selectedRecord[date.label] && selectedRecord[date.label] !== '-' ?
                                rearrangeDateFormat(userInfo, selectedRecord[date.label]) : ""

                            if (date.nperiodcode) {
                                selectedRecord[date.label + "value"] = response[2].data[date.label] ?
                                    new Date(response[2].data[date.label]["datevalue"]) : null;
                            } else {
                                selectedRecord[date.label + "value"] = new Date();
                            }

                            if (date.hidebeforedate) {
                                selectedRecord[date.label + "min"] = selectedRecord[date.label + "value"]
                            }
                            if (date.hideafterdate) {
                                selectedRecord[date.label + "max"] = selectedRecord[date.label + "value"]
                            }
                        }
                    })

                    selectedRecord = { ...selectedRecord }

                    if (inputParam.editSubSampleSchedulerParam["getSubSampleChildDetail"] === true) {
                        if (masterData["searchedTest"]) {
                            if (inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null) {
                                inputParam.searchTestRef.current.value = ""
                                masterData['searchedTest'] = undefined
                            }
                        }
                        masterData = { ...masterData, ...response[1].data["SubSampleChildDetail"] };
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            operation,
                            timeZoneList,
                            defaultTimeZone,
                            selectedRecord,
                            openModal: true,
                            ncontrolCode: inputParam.ncontrolCode,
                            parentPopUpSize: "lg",
                            loading: false,
                            showSample: undefined,
                            regSubSamplecomboData: comboValues.comboData,
                            loadScheduleSubSample: true,
                            screenName: "IDS_SUBSAMPLE",
                            operation: "update",
                            specBasedComponent,
                            //  regRecordToEdit:recordToEdit
                            masterData,
                            loadPreregister:true,
                            withoutCombocomponent
                        }
                    })
                
                    // }
                })
                
                .catch(error => {
                    //console.log("error:", error);
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
                    } else {
                        toast.info(intl.formatMessage({
                            id: error.response.data
                        }));
                    }
                })
            
            
            
        }
    }else{
        toast.warn(intl.formatMessage({
            id:"IDS_DRAFTTOEDITSUBSAMPLE"
        }));
    }
    }
}
export function updateSchedulerConfigSubSample(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/schedulerconfiguration/updateSchedulerConfigSubSampleWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/schedulerconfiguration/updateSchedulerConfigSubSample", inputParam.inputData)
        }
        return requestUrl
            // rsapi().post("/registration/updateRegistrationSubSample", inputParam.inputData)
            .then(response => {
                sortData(response.data);
                //if(inputParam.inputData.masterData.SchedulerConfigGetSubSample!==undefined){
                replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
              //  }
                // else{
                //     masterData={...masterData,"SchedulerConfigGetSubSample":response.data["SchedulerConfigGetSubSample"]} 
                // }
                
                let SchedulerConfigGetTest = response.data["SchedulerConfigGetTest"];
                masterData = {
                    ...masterData,
                    selectedSubSample: response.data["selectedSubSample"],
                    selectedTest: replaceUpdatedObject(response.data["SchedulerConfigGetTest"], masterData.selectedTest, "nschedulertestcode"),
                    SchedulerConfigGetTest,
                    
                    
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}, showSample: undefined, screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    }
                });
                // let inputData = {
                //     masterData,
                //     selectedTest: masterData.selectedTest,
                //     ntransactiontestcode: masterData.selectedTest ?
                //         String(masterData.selectedTest.map(item => item.ntransactiontestcode).join(",")) : "-1",
                //     npreregno: masterData.selectedSample ?
                //         masterData.selectedSample.map(item => item.npreregno).join(",") : "-1",
                //     userinfo: inputParam.inputData.userinfo,
                //     activeTestTab : masterData.activeTestTab,
                //     screenName: masterData.activeTestTab,
                //     resultDataState: inputParam.resultDataState,
                //     testCommentDataState: inputParam.testCommentDataState,
                // }
                // dispatch(getTestChildTabDetail(inputData, true))
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
                else if (error.response.status === 302) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false, loadEsign: false,
                            regEditParam: inputParam,
                            showConfirmAlert: true,
                            parentPopUpSize: "xl",
                            regDateEditConfirmMessage: error.response.data, showSample: undefined
                        }
                    });
                }
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export function deleteSchedulerSubSample(Map, userInfo,masterData,ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
       
            requestUrl = rsapi().post("/schedulerconfiguration/deleteSchedulerConfigSubSample", {...Map,"userinfo":userInfo})
        
        return requestUrl
            .then(response => {
                sortData(response.data);
                //replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
              
                let SchedulerConfigGetTest = response.data["SchedulerConfigGetTest"];
                let SchedulerConfigGetSubSample = response.data["SchedulerConfigGetSubSample"];

                masterData = {
                    ...masterData,
                   
                    selectedSubSample: response.data["selectedSubSample"],
                    //selectedTest: response.data["selectedTest"],
                    selectedTest: response.data["selectedTest"],
                    SchedulerConfigGetTest,
                    SchedulerConfigGetSubSample,
                    searchedSubSample:undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,ncontrolcode,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}, showSample: undefined, screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    }
                });
               
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
              
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export const addMoreSchedulerConfigTest = (inputParam, ncontrolCode) => {
    return (dispatch) => {
        let { sampleList } = inputParam;
        let value = false;
        if (inputParam.selectedSample && inputParam.selectedSample.length > 0) {
            if (inputParam.selectedSubSample && inputParam.selectedSubSample.length > 0) {
                value = inputParam.selectedSubSample.some(obj => obj.nspecsampletypecode !== inputParam.selectedSubSample[0].nspecsampletypecode)
                if (value) {
                    return toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                }
                //sampleList = sampleList ? [...sampleList.slice(inputParam.skip, inputParam.take)] : [];
                //const selectedsample = getSameRecordFromTwoArrays(sampleList, inputParam.selectedSample, "npreregno");
                // const selectsubsample = getSameRecordFromTwoArrays(subsampleList, inputParam.selectedsubsample, "ntransactionsamplecode");
                //if (selectedsample && selectedsample.length > 0) {

                const selectedsample = inputParam.selectedSample;
                const findTransactionStatus = [...new Set(selectedsample.map(item => item.ntransactionstatus))];

                if (findTransactionStatus.length === 1) {
                    if (findTransactionStatus[0] !== transactionStatus.REJECT && findTransactionStatus[0] !== transactionStatus.CANCELLED) {
                        if (findTransactionStatus[0] !== transactionStatus.RELEASED) {

                            // if (selectsubsample && selectsubsample.length > 0) {
                            //     const findSubSampleStatus = [...new Set(selectsubsample.map(item => item.ntransactionstatus))];
                            //
                            //     if (findSubSampleStatus[0] !== transactionStatus.REJECT && findSubSampleStatus[0] !== transactionStatus.CANCELLED) 
                            //     {                    

                            const findApprovalVersion = [...new Set(selectedsample.map(item => item.napprovalversioncode))];
                            if (findApprovalVersion.length === 1) {
                                const findSampleSpec = [...new Set(selectedsample.map(item => item.nallottedspeccode))];
                                //const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                                if (findSampleSpec.length === 1)//&& findComponent.length === 1 
                                {
                                    inputParam["snspecsampletypecode"] = inputParam.selectedSubSample &&
                                        [...new Set(inputParam.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")
                                    dispatch(initRequest(true));
                                    const urlArray = []
                                    const TestGet = rsapi().post("/schedulerconfiguration/getMoreTest", {
                                        ...inputParam
                                    });
                                    urlArray[0] = TestGet;
                                    const TestPackageGet = rsapi().post("/schedulerconfiguration/getMoreTestPackage", {
                                        ...inputParam
                                    });
                                    urlArray[1] = TestPackageGet;

                                    const TestSectionGet = rsapi().post("/schedulerconfiguration/getMoreTestSection", {
                                        ...inputParam
                                    });
                                    urlArray[2] = TestSectionGet;

                                    Axios.all(urlArray)
                                        .then(response => {
                                            let PackageData = []
                                            let TestSectionData = []
                                            const PackageDataMap = constructOptionList(response[1].data || [], "ntestpackagecode",
                                                "stestpackagename", undefined, undefined, true);
                                            PackageData = PackageDataMap.get("OptionList");
                                            const TestSectionDataMap = constructOptionList(response[2].data || [], "nsectioncode",
                                                "ssectionname", undefined, undefined, true);
                                            TestSectionData = TestSectionDataMap.get("OptionList");
                                            dispatch({
                                                type: DEFAULT_RETURN,
                                                payload: {
                                                    availableTest: response[0].data,
                                                    TestCombined: response[0].data,
                                                    AllTest: response[0].data,
                                                    TestPackage: PackageData,
                                                    loadChildTest: true,
                                                    loading: false, ncontrolCode,
                                                    screenName: "IDS_TEST",
                                                    operation: "create",
                                                    openModal: true,
                                                    parentPopUpSize: "lg",
                                                    selectedRecord: {},
                                                    showSample: undefined,
                                                    loadPrinter: false, TestSection: TestSectionData, AllSection: TestSectionData
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
                                            } else {
                                                toast.info(this.props.formatMessage({ id: error.response.data }));
                                            }
                                        });
                                } else {
                                    toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                                }
                            } else {
                                toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMEAPPROVALCONFIG" }));
                            }
                            //     }
                            //     else {
                            //         toast.info(intl.formatMessage({ id: "IDS_SUBSAMPLEISREJECTEDORCANCELLED" }));
                            //     }
                            // }                               
                        }
                        else {
                            toast.info(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORRELEASEDSAMPLES" }));
                        }
                    }
                    else {
                        ////     toast.info(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORCANCELLEDREJECTSAMPLES" }));
                        toast.info(intl.formatMessage({ id: "IDS_SAMPLEISREJECTEDORCANCELLED" }));
                    }
                } else {
                    toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESTATUS" }));
                }
                // } else {
                //     toast.info(intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));
                // }
            } else {
                toast.info(intl.formatMessage({ id: "IDS_SELECTSUBSAMPLE" }));
            }
        } else {
            toast.info(intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));
        }
    }


}

export const createSchedulerTest = (inputParam, masterData, modalName) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
            .then(response => {
                let SchedulerConfigGetTest = updatedObjectWithNewElement(masterData["SchedulerConfigGetTest"], response.data["SchedulerConfigGetTest"]);

                //let RegistrationGetSub    Sample = updatedObjectWithNewElement(masterData["RegistrationGetSubSample"], response.data["RegistrationGetSubSample"]);
                masterData = {
                    ...masterData,
                    SchedulerConfigGetTest: sortData(SchedulerConfigGetTest, "descending", "nschedulertestcode"),
                    SchedulerConfigurationParameter:response.data["SchedulerConfigurationParameter"]&&response.data["SchedulerConfigurationParameter"],
                    selectedTest: response.data["SchedulerConfigGetTest"],
                }
                let respObject = {
                    masterData,
                    [modalName]: false,
                    loading: false,
                    loadChildTest: false,
                    showSample: undefined,
                    openModal: false,
                    selectedRecord: {},
                    showConfirmAlert: false,
                    createTestConfirmMessage: undefined

                }
                inputParam.postParamList[0]['clearFilter'] = 'no';
                inputParam.postParamList[1]['clearFilter'] = 'no';
                inputParam.postParamList[2]['clearFilter'] = 'yes';
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))

            })
            .catch(error => {

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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, createTestConfirmMessage: undefined } })
                    toast.error(error.message);
                }
                else {
                    if (error.response.data.NeedConfirmAlert) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                showConfirmAlert: true,
                                createTestConfirmMessage: error.response.data.rtn,
                                createTestConfirmParam: { inputParam, masterData, modalName },

                                //[modalName]: false,
                                loading: false,
                                loadChildTest: true,
                                showSample: undefined


                                //openModal: false,
                                //selectedRecord: {}
                            }
                        });
                    }
                    else {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                [modalName]: false,
                                loading: false,
                                loadChildTest: false,
                                showSample: undefined,
                                openModal: false,
                                selectedRecord: {},
                                createTestConfirmMessage: undefined


                            }
                        });
                        toast.info(error.response.data.rtn);
                    }
                }
            });
    }
}

export function deleteSchedulerConfigTest(Map, userInfo,masterData,ncontrolcode) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
       
            requestUrl = rsapi().post("/schedulerconfiguration/deleteSchedulerConfigTest", {...Map,"userinfo":userInfo})
        
        return requestUrl
            .then(response => {
                sortData(response.data);
                replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
              
                let SchedulerConfigGetTest = response.data["SchedulerConfigGetTest"];
                let SchedulerConfigurationParameter = response.data["SchedulerConfigurationParameter"];

                //let SchedulerConfigGetSubSample = response.data["SchedulerConfigGetSubSample"];

                masterData = {
                    ...masterData,
                    selectedSubSample: response.data["selectedSubSample"],
                    //selectedTest: response.data["selectedTest"],
                    selectedTest: response.data["selectedTest"],
                    SchedulerConfigGetTest,
                    SchedulerConfigurationParameter,
                    searchedTest:undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,ncontrolcode,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}, showSample: undefined, screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    }
                });
               
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
              
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}
export function getEditSchedulerConfigComboService(inputParam, columnList,
    selectedRecord1, childColumnList, comboComponents,
    withoutCombocomponent, editableComboList) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const { userInfo, operation } = { ...inputParam };
        let masterData = inputParam["masterData"];
        let parentColumnList = [...columnList, ...editableComboList];
        if (masterData["selectedSample"].length > 1 ||
            masterData["selectedSample"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            inputParam.editSchedulerSampleParam["getSampleChildDetail"] = true;
        }
        masterData["selectedSample"] = [];
        masterData["selectedSample"].push(inputParam["mastertoedit"]);

        const nschedulersamplecode = inputParam.mastertoedit[inputParam.primaryKeyName];
        let urlArray = [];

        const timeZoneService = rsapi().post("timezone/getTimeZone");
       
        const selectedRegistration = rsapi().post("/schedulerconfiguration/getEditSchedulerConfigDetails", {
            ...inputParam.editSchedulerSampleParam, nschedulersamplecode, parentcolumnlist: parentColumnList,
            childcolumnlist: childColumnList,
            userinfo: userInfo, nallottedspeccode: inputParam.mastertoedit.nallottedspeccode || -1
        })

        

        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: withoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo: userInfo
        })
        const siteService = rsapi().post("schedulerconfiguration/getSiteByUser", {
            userinfo: userInfo})
         
            const schedulerMasterService = rsapi().post("schedulerconfiguration/getSchedulerMaster", {
                userinfo: userInfo})

        urlArray = [timeZoneService, selectedRegistration, dateService,siteService,schedulerMasterService]

        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = { ...response[1].data["EditData"] };
                selectedRecord = { ...selectedRecord, ...selectedRecord['jsondata'] }
              
                let siteMap=[];
                let siteList=[];
                let schedulerList=[];
                if(response[3].data.userSite!==undefined){
                    siteMap = constructOptionList(response[3].data.userSite || [], "nsitecode", "ssitename", undefined, undefined, true);
                    siteList = siteMap.get("OptionList");
                }
                if(response[4].data.ScheduleMaster!==undefined){
                    schedulerList = constructOptionList(response[4].data.ScheduleMaster || [], "nschedulecode", "sschedulename", undefined, undefined, true).get("OptionList");
                  
                }
                 

                    // if(selectedRecord['Site']!==undefined){
                    //     selectedRecord['nsitecode'] = constructOptionList(response[3].data.userSite || [], "nsitecode", "ssitename", undefined, undefined, true).get("OptionList");
                    // // siteList = siteMap.get("OptionList");
                    // }

                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userInfo.stimezoneid, value: userInfo.ntimezonecode }


                

                if (selectedRecord.ntransactionstatus === transactionStatus.CANCELLED
                    || selectedRecord.ntransactionstatus === transactionStatus.REJECT) {
                    toast.info(intl.formatMessage({ id: "IDS_CANNOTEDITCANCELLEDSAMPLE" }));
                    // ALPD-3393
                    if (inputParam.editSchedulerSampleParam["getSampleChildDetail"] === true) {
                        masterData = sortData({ ...masterData, ...response[1].data["SampleChildDetail"] })
                    }
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, masterData } });
                }
                else {
                    const languagetypeCode = undefined
                    const comboData = response[1].data;
                    delete comboData['EditData']
                    let comboValues = {}
                    if (columnList.length > 0) {
                        columnList.map(x => {
                            if (x.inputtype === 'combo') {
                                if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
                                {
                                    if (comboData[x.label].length > 0) {
                                        if (comboData[x.label][0].label === undefined) {
                                            const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                            comboData[x.label] = optionList.get("OptionList");
                                        } else {
                                            comboData[x.label] = comboData[x.label]
                                            const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                        }
                                    } else {
                                        comboData[x.label] = []
                                    }
                                    //comboValues = childComboLoad(x, comboData, selectedRecord, 
                                    //   childColumnList, withoutCombocomponent)\
                                    comboValues = childComboLoadForEdit(x, comboData, selectedRecord,
                                        childColumnList, withoutCombocomponent)
                                } else {
                                    comboValues = {
                                        "comboData": comboData,
                                    }
                                }
                            } else {
                                comboValues = {
                                    comboData: comboData,
                                    ...comboValues
                                }
                            }
                        })
                    }
                    else {
                        comboValues = {
                            "comboData": comboData,
                        }
                    }
                    if (editableComboList.length > 0) {
                        editableComboList.map(x => {
                            if (x.inputtype === 'combo') {
                                if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
                                {
                                    if (comboData[x.label].length > 0) {
                                        if (comboData[x.label][0].label === undefined) {
                                            const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                            comboData[x.label] = optionList.get("OptionList");
                                        } else {
                                            comboData[x.label] = comboData[x.label]
                                            const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                                                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
                                        }
                                    } else {
                                        comboData[x.label] = []
                                    }
                                    comboValues = {
                                        "comboData": comboData,
                                    }

                                } else {
                                    comboValues = {
                                        "comboData": comboData,
                                    }
                                }
                            } else {
                                comboValues = {
                                    comboData: comboData,
                                    ...comboValues
                                }
                            }
                        })

                    }

                    withoutCombocomponent.map(date => {
                        if (date.inputtype === 'date') {
                            selectedRecord[date.label] = selectedRecord[date.label] && selectedRecord[date.label] !== '-' ?
                                rearrangeDateFormat(userInfo, selectedRecord[date.label]) : ""

                            if (date.nperiodcode) {
                                selectedRecord[date.label + "value"] = response[2].data[date.label] ?
                                    new Date(response[2].data[date.label]["datevalue"]) : null;
                            } else {
                                selectedRecord[date.label + "value"] = new Date();
                            }

                            if (date.hidebeforedate) {
                                selectedRecord[date.label + "min"] = selectedRecord[date.label + "value"]
                            }
                            if (date.hideafterdate) {
                                selectedRecord[date.label + "max"] = selectedRecord[date.label + "value"]
                            }
                        }
                    })

                    let { Specification, AgaramTree, ActiveKey, FocusKey, OpenNodes, specValue } = [];
                    specValue = [{ nallottedspeccode: selectedRecord.nallottedspeccode, sspecname: selectedRecord.sspecname, sversion: selectedRecord.sversion }];
                    const selectedSpec = {}
                    Specification = constructOptionList(specValue || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, true).get("OptionList");
                    
                    selectedSpec["nallottedspeccode"] = Specification.length > 0 ? {
                        "value": Specification[0].value,
                        "label": Specification[0].label,
                        "item": Specification[0].item
                    } : "";

                    selectedSpec["sversion"] = Specification.length > 0 ? Specification[0].item.sversion : ""
                    selectedSpec["ntemplatemanipulationcode"] = Specification.length > 0 ?
                        Specification[0].item.ntemplatemanipulationcode : -1
                    selectedRecord = { ...selectedRecord, ...selectedSpec }

                    if (inputParam.editSchedulerSampleParam["getSampleChildDetail"] === true) {
                        masterData = sortData({ ...masterData, ...response[1].data["SampleChildDetail"] })
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                           
                            selectedSpec,
                            Specification,
                            operation: "update",
                            screenName: inputParam.masterData.RealRegSubTypeValue.sregsubtypename,
                            timeZoneList,
                            defaultTimeZone,
                            selectedRecord,
                            openPortal: true,
                            ncontrolCode: inputParam.editSchedulerSampleParam.ncontrolCode,
                            loadPreregister:true,
                            parentPopUpSize: "xl",
                            loading: false,
                            showSample: undefined,
                            comboData: comboValues.comboData,
                            childColumnList, comboComponents,
                            withoutCombocomponent,
                            columnList,
                            masterData,
                            siteList,
                            schedulerList

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
                } else {
                    toast.info(intl.formatMessage({
                        id: error.response.data
                    }));
                }
            })

    }
}

export function updateSchedulerConfig(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/schedulerconfiguration/updateSchedulerConfigWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/schedulerconfiguration/updateSchedulerConfig", inputParam.inputData)
        }
        return requestUrl
            .then(response => {
                if (response.data.rtn === "Success") {
                    replaceUpdatedObject(response.data["SchedulerConfigGetSample"], masterData.SchedulerConfigGetSample, "nschedulersamplecode");
                    replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode");
                    replaceUpdatedObject(response.data["SchedulerConfigGetTest"], masterData.SchedulerConfigGetTest, "nschedulertestcode");
                    //  let RegistrationGetSubSample = response.data["RegistrationGetSubSample"];
                    //let RegistrationGetTest = response.data["RegistrationGetTest"];
                    masterData = {
                        ...masterData,
                        selectedSample: response.data["selectedSample"],
                        
                        SchedulerConfigurationParameter: masterData["SchedulerConfigurationParameter"]
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData, openPortal: false, loading: false, showConfirmAlert: false,
                            regDateEditConfirmMessage: undefined, loadEsign: false, openModal: false,
                            loadPreregister: false, selectedRecord: {}, showSample: undefined
                        }
                    });
                  
                } else {
                    toast.info(response.data.rtn);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
                else if (error.response.status === 302) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false, loadEsign: false,
                            regEditParam: inputParam,
                            showConfirmAlert: true,
                            parentPopUpSize: "xl",
                            regDateEditConfirmMessage: error.response.data, showSample: undefined
                        }
                    });
                }
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export function validateEsignforSchedulerConfig(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    const methodUrl = "schedulerconfiguration";
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                    }
                    //dispatch(inputParam["screenData"]["inputParam"].performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
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

                case "editSchedulerConfig":
                    dispatch(updateSchedulerConfig(screenData.inputParam, screenData.masterData));
                    break;

                    case "editSubSample":
                    dispatch(updateSchedulerConfigSubSample(screenData.inputParam, screenData.masterData));
                    break;

                    case "deleteSubSample":
                    dispatch(deleteSchedulerSubSample(screenData.inputParam.Map, screenData.inputParam.inputData.userinfo,screenData.masterData,screenData.inputParam.ncontrolCode));
                    break;

                    case "deleteSchedulerTest":
                    dispatch(deleteSchedulerConfigTest(screenData.inputParam.Map, screenData.inputParam.inputData.userinfo,screenData.masterData,screenData.inputParam.ncontrolCode));
                     break;   

                     case "deleteSample":
                    dispatch(deleteSchedulerConfig(screenData.inputParam.Map, screenData.masterData));
                     break;  

                     case "approveSample":
                        dispatch(approveSchedulerConfig(screenData.inputParam, screenData.masterData));
                         break; 

                         case "activeInactive":
                            dispatch(updateActiveStatusSchedulerConfig(screenData.inputParam));
                             break;
            default:
                break;
        }
    }
}


export function approveSchedulerConfig(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
      
            requestUrl = rsapi().post("/schedulerconfiguration/approveSchedulerConfig", {...inputParam.approveSchedulerSampleParam,nschedulersamplecode:inputParam.nschedulersamplecode,
                sinstrumentid:inputParam.masterData.selectedSample[0][inputParam.approveSchedulerSampleParam.sinstrumentidLabel],
                ninstrumentcode:inputParam.masterData.selectedSample[0]['ninstrumentcode'],
				//ALPD-5453-->Added by Vignesh R(19-02-2025)--Scheduler Configuration
                //ALPD-5453-start
				ninstrumentcatcode:inputParam.masterData.selectedSample[0]['ninstrumentcatcode'],
                //ALPD-5453--end
                nschedulecode:inputParam.mastertoapprove.nschedulecode,
                // ALPD-5332 Added by Abdul for MAterial Scheduler
                nmaterialcode:inputParam.masterData.selectedSample[0]['nmaterialcode'],
                nsitecode:(inputParam.mastertoapprove && inputParam.mastertoapprove.ninstrumentsitecode && inputParam.mastertoapprove.ninstrumentsitecode!==-1) ?inputParam.mastertoapprove.ninstrumentsitecode :-1 ,
// ALPD-5332 End           
}
            
            )
       
        return requestUrl
           
            .then(response => {
                sortData(response.data);
                //if(inputParam.inputData.masterData.SchedulerConfigGetSubSample!==undefined){
                    replaceUpdatedObject(response.data["SchedulerConfigGetSample"], inputParam.masterData.SchedulerConfigGetSample, "nschedulersamplecode");
                replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], inputParam.masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode")
                replaceUpdatedObject(response.data["SchedulerConfigGetTest"], inputParam.masterData.SchedulerConfigGetTest, "nschedulertestcode");
                // let SchedulerConfigGetSample=response.data["SchedulerConfigGetSample"]&&response.data["SchedulerConfigGetSample"];
                // let SchedulerConfigGetSubSample=response.data["SchedulerConfigGetSubSample"]&&response.data["SchedulerConfigGetSubSample"];
                // let SchedulerConfigGetTest=response.data["SchedulerConfigGetTest"]&&response.data["SchedulerConfigGetTest"];
                 if(response.data["SchedulerConfigGetSampleBefore"]!==undefined){
                    replaceUpdatedObject(response.data["SchedulerConfigGetSampleBefore"], inputParam.masterData.SchedulerConfigGetSample, "nschedulersamplecode");

                 }

                masterData = {
                    ...masterData,
                    // SchedulerConfigGetSample,
                    // SchedulerConfigGetSubSample,
                    // SchedulerConfigGetTest,
                    selectedTest: replaceUpdatedObject(response.data["SchedulerConfigGetSample"], inputParam.masterData.selectedSample, "nschedulersamplecode"),
                    selectedSubSample: replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], inputParam.masterData.selectedSubSample, "nschedulersubsamplecode"),
                    selectedTest: replaceUpdatedObject(response.data["SchedulerConfigGetTest"], inputParam.masterData.selectedTest, "nschedulertestcode"),
                    
                    
                    
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}
                    }
                });
                
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
                else if (error.response.status === 302) {
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false, loadEsign: false,
                            regEditParam: inputParam,
                            showConfirmAlert: true,
                            parentPopUpSize: "xl",
                            regDateEditConfirmMessage: error.response.data, showSample: undefined
                        }
                    });
                }
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export function deleteSchedulerConfig(inputParam,masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
       
            requestUrl = rsapi().post("/schedulerconfiguration/deleteSchedulerConfig", {...inputParam.deleteSchedulerSampleParam,
                nschedulersamplecode:inputParam.nschedulersamplecode
                })
        
        return requestUrl
            .then(response => {
                sortData(response.data);
              
                let SchedulerConfigGetTest = response.data["SchedulerConfigGetTest"];
                let SchedulerConfigGetSubSample = response.data["SchedulerConfigGetSubSample"];
                let SchedulerConfigGetSample = response.data["SchedulerConfigGetSample"];

                masterData = {
                    ...masterData,
                    selectedSample: response.data["selectedSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    selectedTest: response.data["selectedTest"],
                    SchedulerConfigGetTest,
                    SchedulerConfigGetSubSample,
                    SchedulerConfigGetSample,
                    searchedSubSample:undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                         selectedRecord: {}, showSample: undefined
                    }
                });
               
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
              
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}


export function updateActiveStatusSchedulerConfig(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
       
            requestUrl = rsapi().post("/schedulerconfiguration/updateActiveStatusSchedulerConfig", {...inputParam.activeInactiveSchedulerSampleParam,
                nschedulersamplecode:inputParam.nschedulersamplecode,nactivestatus:inputParam.selectedSample[0].nactivestatus
            })
        
        return requestUrl
            .then(response => {
                sortData(response.data);
              let masterData={...inputParam.masterData};
                replaceUpdatedObject(response.data["SchedulerConfigGetSample"], masterData.SchedulerConfigGetSample, "nschedulersamplecode");
                replaceUpdatedObject(response.data["SchedulerConfigGetSubSample"], masterData.SchedulerConfigGetSubSample, "nschedulersubsamplecode")
                replaceUpdatedObject(response.data["SchedulerConfigGetTest"], masterData.SchedulerConfigGetTest, "nschedulertestcode");

                masterData = {
                    ...masterData,
                    selectedSample: response.data["selectedSample"],
                    selectedSubSample: response.data["selectedSubSample"],
                    selectedTest: response.data["selectedTest"],
                    searchedSubSample:undefined
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}, showSample: undefined, screenName: intl.formatMessage({ id: "IDS_SUBSAMPLE" }),
                    }
                });
               
            })
            .catch(error => {
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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
              
                else {
                    toast.info(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showSample: undefined } })
                }
            })
    }
}

export function getSchedulerMasteDetails(Map, selectedFilter, masterData, searchRef) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/schedulerconfiguration/getSchedulerMasteDetails", Map)
            .then(response => {
                const SchedulerMasterDeatils = response.data["ScheduleMasterDetails"] && response.data["ScheduleMasterDetails"];
                sortData(response.data)
                // MAHProductManufacturer.length > 0 ?
                //     selectedFilter["nproductmanufcode"] = {
                //         "value": MAHProductManufacturer[0].nproductmanufcode,
                //         "label": MAHProductManufacturer[0].smanufname
                //     } : selectedFilter["nproductmanufcode"] = "";
                selectedFilter["sschedulename"] = SchedulerMasterDeatils && 
                SchedulerMasterDeatils[0].sschedulename ||""

                let startdate=SchedulerMasterDeatils[0].sstartdate !== undefined ?
                SchedulerMasterDeatils[0].sstartdate.substring(0, 10):"";

                let starttime=SchedulerMasterDeatils[0] &&
                SchedulerMasterDeatils[0].sstarttime !== undefined ?
                SchedulerMasterDeatils[0].sstarttime.substring(16, 11):"";
           
                let enddate=SchedulerMasterDeatils[0] !== undefined ?
                SchedulerMasterDeatils[0].senddate.substring(0, 10) : "";

                 let endtime=SchedulerMasterDeatils[0] &&
                 SchedulerMasterDeatils[0].sendtime !== undefined ?
                 SchedulerMasterDeatils[0].sendtime.substring(16, 11) : ""
                 
                let startdatetime= startdate+" "+starttime;
                let enddatetime=enddate+" "+endtime;
               
                // SchedulerMasterDeatils = {
                //     ...SchedulerMasterDeatils,
                //     "0": {  
                //         ...SchedulerMasterDeatils["0"],
                //       "startdatetime": startdatetime,
                //       "enddatetime": enddatetime
                //     }
                //   };
                  
                  
                  /*  let idslabel;
                    let fieldToShow;

                    if (SchedulerMasterDeatils.sscheduletype === "O") {
                        idslabel="IDS_ONETIME";
                      } else if (SchedulerMasterDeatils.sscheduletype === "D") {
                        idslabel="IDS_DAILY";
                      } else if (SchedulerMasterDeatils.sscheduletype === "W") {
                        idslabel="IDS_WEEKLY";
                      } else {
                        idslabel="IDS_MONTHLY";
                      }

               /*     SchedulerMasterDeatils = {
                        ...SchedulerMasterDeatils,
                        sscheduletype: SchedulerMasterDeatils.sscheduletype === "O" ? intl.formatMessage({ id: "IDS_ONETIME" }) :
                                       SchedulerMasterDeatils.sscheduletype === "D" ? intl.formatMessage({ id: "IDS_DAILY" }) :
                                       SchedulerMasterDeatils.sscheduletype === "W" ? intl.formatMessage({ id: "IDS_WEEKLY" }) :
                                       intl.formatMessage({ id: "IDS_MONTHLY" })  // Default case
                      };

                    //idslabel=idslabel.push("IDS_STARTDATEANDTIME");
                    fieldToShow="stempscheduleType";
*/


                // selectedFilter["nproductmanufcode"] = MAHProductManufacturer && MAHProductManufacturer.length > 0 ?
                //     MAHProductManufacturer[0].nproductmanufcode : -1

                    let selectedRecord={};
                    selectedRecord=selectedFilter;

                masterData = {
                    ...masterData,
                   ...response.data
                    
                   
                };
                if(searchRef!== undefined &&searchRef.current !== null){
                    searchRef.current.value='';
                    masterData['searchedData']=undefined;
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                       // selectedFilter,
                        selectedRecord,
                        loading: false
                    }
                });

            })
            .catch(error => {
                dispatch(initRequest(false));
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