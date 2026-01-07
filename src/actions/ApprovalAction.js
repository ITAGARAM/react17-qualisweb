import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { constructOptionList, fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, replaceUpdatedObject, sortData, getSameRecordFromTwoArrays, getSameRecordFromTwoDifferentArrays, filterRecordBasedOnPrimaryKeyName, reArrangeArrays,sortDataByParent } from '../components/CommonScript';
import { postCRUDOrganiseTransSearch } from './ServiceAction';
import { REPORTTYPE, checkBoxOperation, reportCOAType, transactionStatus } from '../components/Enumeration';
import { intl } from '../components/App';
import Axios from 'axios';

export function getsubSampleDetail(inputData, isServiceRequired,isParentValue) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
            nflag: 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: inputData.napprovalversioncode,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeTestTab,
            activeSubSampleTab: inputData.activeTestTab,
            userinfo: inputData.userinfo,
            nneedsubsample: inputData.masterData.realRegSubTypeValue.nneedsubsample,
            ndesigntemplatemappingcode : inputData.ndesigntemplatemappingcode ? inputData.ndesigntemplatemappingcode : inputData.masterData.ndesigntemplatemappingcode,
            // checkBoxOperation: inputData.masterData.searchedSubSample ?  
            //     inputData.masterData.searchedSubSample.length > 0 ? inputData.checkBoxOperation:3:inputData.checkBoxOperation,

            checkBoxOperation: inputData.masterData.searchedSubSample ?  
                inputData.masterData.searchedSubSample.length > 0 ? inputData.checkBoxOperation:checkBoxOperation.SINGLESELECT:inputData.checkBoxOperation,   

           // noParameterget:inputData.checkBoxOperation == 1 ? 3 : 4,
           // noParameterget:inputData.checkBoxOperation == checkBoxOperation.MULTISELECT ? checkBoxOperation.SINGLESELECT : checkBoxOperation.,
            nbatchmastercode:inputData.nbatchmastercode
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("approval/getApprovalSubSample", inputParamData)
                .then(response => {
                    let responseData = { ...response.data, APSelectedSample: inputData.APSelectedSample }
                    responseData = sortData(responseData);
                    let oldSelectedTest = inputData.masterData.APSelectedTest ? inputData.masterData.APSelectedTest : []
                    inputData.masterData.APSelectedTest = responseData.APSelectedTest ? responseData.APSelectedTest : inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                    //inputData.masterData.APSelectedSubSample = responseData.APSelectedSubSample ? responseData.APSelectedSubSample : inputData.masterData.AP_SUBSAMPLE.length > 0 ? [inputData.masterData.AP_SUBSAMPLE[0]] : []
                    let skipInfo = {}
                    let masterData = {}
                    
                    
                    if (subSample) {
                        
                        let oldSelectedSubSample = inputData.masterData.APSelectedSubSample
                        let AP_TEST = inputData.masterData.AP_TEST
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                        if(isParentValue){
                        inputData.masterData.AP_SUBSAMPLE= sortDataByParent(responseData['AP_SUBSAMPLE'],inputData.masterData.AP_SAMPLE, "npreregno");
                    }
                        masterData = {
                            ...inputData.masterData,
                            APSelectedSample: inputData.APSelectedSample,
                            selectedPreregno: inputData.npreregno,
                            APSelectedSubSample: inputData.masterData.AP_SUBSAMPLE.length > 0 ?
                                [inputData.masterData.AP_SUBSAMPLE[0]] : [],
                        }
                        
                        if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                            inputData.searchTestRef.current.value = ""
                            masterData['searchedTests'] = undefined
                        }
                        if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                            inputData.searchSubSampleRef.current.value = "";
                            masterData['searchedSubSample'] = undefined
                        }
                        //if (inputData.checkBoxOperation === 1 || inputData.checkBoxOperation === 5) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {    

                            const wholeSubSampleList = masterData.AP_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample.forEach((subsample, index) => {
                                if (!wholeSubSampleList.includes(subsample.ntransactionsamplecode)) {
                                    oldSelectedSubSample.splice(index, 1)
                                }

                            })
                            if (oldSelectedSubSample.length > 0) {
                                masterData = {
                                    ...masterData,
                                    APSelectedSubSample: oldSelectedSubSample
                                }
                            }
                            const APSelectedTest = oldSelectedTest.length >0 ? getSameRecordFromTwoArrays(oldSelectedTest,
                                masterData.APSelectedSubSample, 'npreregno') : responseData.APSelectedTest
                            masterData = {
                                ...masterData,
                                APSelectedTest,
                                AP_TEST,
                                ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter,
                                RegistrationSampleAttachment : responseData.RegistrationSampleAttachment ? responseData.RegistrationSampleAttachment.length > 0  ? responseData.RegistrationSampleAttachment : masterData.RegistrationSampleAttachment: masterData.RegistrationSampleAttachment
                            }
                        }
                       // if(inputData.checkBoxOperation === 7 )
                        if(inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL)
                        {
                            masterData = {
                                ...masterData,
                                APSelectedTest:responseData.APSelectedTest,
                                AP_TEST:responseData.AP_TEST,
                                ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter,
                                RegistrationSampleAttachment : responseData.RegistrationSampleAttachment ? responseData.RegistrationSampleAttachment.length > 0  ? responseData.RegistrationSampleAttachment : masterData.RegistrationSampleAttachment: masterData.RegistrationSampleAttachment
                            }
                        }
                        //if (inputData.checkBoxOperation === 3) {
                        if (inputData.checkBoxOperation === checkBoxOperation.SINGLESELECT || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {    
                            masterData = {
                                ...masterData,
                                APSelectedTest: masterData.AP_TEST.length > 0 ? [masterData.AP_TEST[0]] : [],
                                ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter :masterData.ApprovalParameter : masterData.ApprovalParameter,
                                RegistrationSampleAttachment : responseData.RegistrationSampleAttachment ? responseData.RegistrationSampleAttachment.length > 0  ? responseData.RegistrationSampleAttachment : []: [],
                                RegistrationTestAttachment : responseData.RegistrationTestAttachment ? responseData.RegistrationTestAttachment.length > 0  ? responseData.RegistrationTestAttachment : []: [],
                                RegistrationAttachment : responseData.RegistrationAttachment ? responseData.RegistrationAttachment.length > 0  ? responseData.RegistrationAttachment : []: [],
                                RegistrationSampleComment : responseData.RegistrationSampleComment ? responseData.RegistrationSampleComment.length > 0  ? responseData.RegistrationSampleComment : []: [],
                                RegistrationTestComment : responseData.RegistrationTestComment ? responseData.RegistrationTestComment.length > 0  ? responseData.RegistrationTestComment : []: [],
                                RegistrationComment : responseData.RegistrationComment ? responseData.RegistrationComment.length > 0  ? responseData.RegistrationComment : []: []
                               

                            }
                        }


                        let { testskip, testtake, subSampleSkip, subSampleTake } = inputData
                        // let bool = false;
                        // Commented bool value because no need to check bool condition to update skipInfo value.
                        // if (inputData.masterData.AP_SUBSAMPLE.length < inputData.subSampleSkip) {
                            testskip = 0;
                            subSampleSkip = 0;
                        //     bool = true
                        // }
                        // if (bool) {
                            skipInfo = { testskip, testtake, subSampleSkip, subSampleTake }
                        // }
                    }
                    else {
                        let oldApprovalParameter = inputData.masterData.ApprovalParameter;
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                        let APSelectedSubSamplenew = []
                        //Added by sonia on 01-06-2024 Jira ID:ALPD-4270 Handling the undefined condition
                        let APSelectedSubSample =[];
                        if(response.data.APSelectedSubSample && response.data.APSelectedSubSample !==undefined){
                            APSelectedSubSample =response.data.APSelectedSubSample;
                        }

                        APSelectedSubSamplenew=[
                        ...inputData.masterData.APSelectedSubSample,
                        APSelectedSubSample];


                        masterData = {
                            ...inputData.masterData,
                            APSelectedSample: inputData.APSelectedSample,
                            //APSelectedSubSample: inputData.masterData.APSelectedSubSample,
                            APSelectedSubSample:APSelectedSubSamplenew,
                            APSelectedTest: inputData.masterData.APSelectedTest || [],
                            selectedPreregno: inputData.npreregno,
                        }
                        if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                            inputData.searchTestRef.current.value = ""
                            masterData['searchedTests'] = undefined
                        }
                        // if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        //     inputData.searchSubSampleRef.current.value = "";
                        //     masterData['searchedSubSample'] = undefined
                        // }
                        // if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        //     inputData.searchTestRef.current.value = ""
                        //     masterData['searchedTests'] = undefined
                        // }
                        let { testskip, testtake } = inputData
                        let bool = false;
                        if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                            testskip = 0;
                            bool = true
                        }

                        if (bool) {
                            skipInfo = { testskip, testtake }
                        }

                        let ApprovalParameter = [];
                        let ResultUsedInstrument = [];
                        let ResultUsedTasks = [];
                        let RegistrationTestAttachment = [];
                        let ApprovalResultChangeHistory = [];
                        let RegistrationTestComment = [];
                        let ApprovalHistory = [];

                        //if (inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {    

                            let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
                            oldSelectedTest.map((test, index) => {
                                if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                    oldSelectedTest.splice(index, 1)
                                }
                                return null;
                            })
                            let keepOld = false;
                            let ntransactiontestcode;
                            if (oldSelectedTest.length > 0) {
                                keepOld = true
                                inputData.masterData['ApprovalParameter'] = oldApprovalParameter
                                masterData = {
                                    ...masterData,
                                    //AP_TEST:responseData.AP_TEST,
                                    ApprovalParameter:oldApprovalParameter,
                                    APSelectedTest: oldSelectedTest
                                }
                            } else {
                                ntransactiontestcode = masterData.APSelectedTest[0].ntransactiontestcode
                            }
                            switch (inputData.activeTestTab) {
                                case "IDS_RESULTS":
                                    ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_INSTRUMENT":
                                    ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ResultUsedInstrument"
                                    dataStateName = "instrumentDataState"
                                    break;
                                case "IDS_TASK":
                                    ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ResultUsedTasks"
                                    dataStateName = "taskDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                                case "IDS_RESULTCHANGEHISTORY":
                                    ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalResultChangeHistory"
                                    dataStateName = "resultChangeDataState"
                                    break;
                                case "IDS_TESTCOMMENTS":
                                    RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTAPPROVALHISTORY":
                                    ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalHistory"
                                    dataStateName = "historyDataState"
                                    break;
                                default:
                                    ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                       // } else if (inputData.checkBoxOperation === 5) {
                        } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {    
                            let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0;
                            let list = [];
                            let dbData = []
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                            }
                           
                            switch (inputData.activeTestTab) {
                                case "IDS_RESULTS":
                                    dbData = response.data.ApprovalParameter || []
                                    list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                    break;
                                case "IDS_INSTRUMENT":
                                    dbData = response.data.ResultUsedInstrument || []
                                    list = [...inputData.masterData.ResultUsedInstrument, ...dbData]
                                    ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                case "IDS_TASK":
                                    dbData = response.data.ResultUsedTasks || []
                                    list = [...inputData.masterData.ResultUsedTasks, ...dbData]
                                    ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    dbData = response.data.RegistrationTestAttachment || []
                                    list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                case "IDS_RESULTCHANGEHISTORY":
                                    dbData = response.data.ApprovalResultChangeHistory || []
                                    list = [...inputData.masterData.ApprovalResultChangeHistory, ...dbData]
                                    ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                case "IDS_TESTCOMMENTS":
                                    dbData = response.data.RegistrationTestComment || []
                                    list = [...inputData.masterData.RegistrationTestComment, ...dbData]
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                case "IDS_TESTAPPROVALHISTORY":
                                    dbData = response.data.ApprovalHistory || []
                                    list = [...inputData.masterData.ApprovalHistory, ...dbData]
                                    ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                                default:
                                    dbData = response.data.ApprovalParameter || []
                                    list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                            }
                        } 
                       // else if(inputData.checkBoxOperation === 7 )
                        else if(inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL)
                        {
                            // masterData = {
                            //     ...masterData,
                            //     APSelectedTest:responseData.APSelectedTest,
                            //     AP_TEST:responseData.AP_TEST,
                            //     ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                            // }

                            let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0
                            let list = [];
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                            }
                          
                            switch (inputData.activeTestTab) {
                                case "IDS_RESULTS":
                                    list = response.data.ApprovalParameter || []
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_INSTRUMENT":
                                    list = response.data.ResultUsedInstrument || []
                                    ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ResultUsedInstrument"
                                    dataStateName = "instrumentDataState"
                                    break;
                                case "IDS_TASK":
                                    list = response.data.ResultUsedTasks || []
                                    ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ResultUsedTasks"
                                    dataStateName = "taskDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    list = response.data.RegistrationTestAttachment || []
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                                case "IDS_RESULTCHANGEHISTORY":
                                    list = response.data.ApprovalResultChangeHistory || []
                                    ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalResultChangeHistory"
                                    dataStateName = "resultChangeDataState"
                                    break;
                                case "IDS_TESTCOMMENTS":
                                    list = response.data.RegistrationTestComment || []
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTAPPROVALHISTORY":
                                    list = response.data.ApprovalHistory || []
                                    ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalHistory"
                                    dataStateName = "historyDataState"
                                    break;
                                default:
                                    list = response.data.ApprovalParameter?[...inputData.masterData.ApprovalParameter, ...response.data.ApprovalParameter]:
                                    [...inputData.masterData.ApprovalParameter]
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                        }else {
                            let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0
                            let list = [];
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                            }
                          
                            switch (inputData.activeTestTab) {
                                case "IDS_RESULTS":
                                    list = response.data.ApprovalParameter || []
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                                case "IDS_INSTRUMENT":
                                    list = response.data.ResultUsedInstrument || []
                                    ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ResultUsedInstrument"
                                    dataStateName = "instrumentDataState"
                                    break;
                                case "IDS_TASK":
                                    list = response.data.ResultUsedTasks || []
                                    ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ResultUsedTasks"
                                    dataStateName = "taskDataState"
                                    break;
                                case "IDS_TESTATTACHMENTS":
                                    list = response.data.RegistrationTestAttachment || []
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                                case "IDS_RESULTCHANGEHISTORY":
                                    list = response.data.ApprovalResultChangeHistory || []
                                    ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalResultChangeHistory"
                                    dataStateName = "resultChangeDataState"
                                    break;
                                case "IDS_TESTCOMMENTS":
                                    list = response.data.RegistrationTestComment || []
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                case "IDS_TESTAPPROVALHISTORY":
                                    list = response.data.ApprovalHistory || []
                                    ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalHistory"
                                    dataStateName = "historyDataState"
                                    break;
                                default:
                                    list = response.data.ApprovalParameter?[...inputData.masterData.ApprovalParameter, ...response.data.ApprovalParameter]:
                                    [...inputData.masterData.ApprovalParameter]
                                    ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "ApprovalParameter"
                                    dataStateName = "resultDataState"
                                    break;
                            }
                        }

                        masterData = {
                            ...masterData,
                            ApprovalParameter,
                            ResultUsedInstrument,
                            ResultUsedTasks,
                            RegistrationTestAttachment,
                            ApprovalResultChangeHistory,
                            RegistrationTestComment,
                            ApprovalHistory
                        }
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
                    skipInfo = {
                        ...skipInfo,
                        samplePrintHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        },
                        sampleHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        }
                    }
                    // ALPD-4133 Start of Additional filter info to be Dispatched on Additional filter save - ATE-241
                    let multifilterInfo = {};
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
                                openChildModal:inputData.openChildModal,
                                searchSampleRef: inputData.searchSampleRef,
                                searchSubSampleRef: inputData.searchSubSampleRef,
                                searchTestRef: inputData.searchTestRef,
                                testskip: inputData.testskip,
                                subsampleskip: inputData.subsampleskip,
                                skip: inputData.skip,
                                // filterColumnActive:true
                            };
                        }
                    //  End of Additional filter info ALPD-4133 ATE-241
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            activeSampleTab: inputData.activeSampleTab,
                            activeSubSampleTab:inputData.activeSubSampleTab,
                            skip: undefined,
                            take: undefined,
                            ...skipInfo,
                            activeTabIndex: inputData.activeTabIndex,
                            //  Additional Filter INfo to be dispatched on Save - ALPD-4133 ATE-241
                            ...multifilterInfo,
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }))
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
        } else {
            let skipInfo = {};
            let bool = false;
            let { testskip, testtake, subsampletake, subsampleskip } = inputData;
            let oldSelectedTest = inputData.masterData.APSelectedTest
            let oldSelectedSubSample = inputData.masterData.APSelectedSubSample
            let TestSelected = [];
            let subSampleSelected = [];
            let ApprovalParameter = [];
            let ResultUsedInstrument = [];
            let ResultUsedTasks = [];
            let RegistrationTestAttachment = [];
            let ApprovalResultChangeHistory = [];
            let RegistrationTestComment = [];
            let ApprovalHistory = [];
            let isGrandChildGetRequired = false;
            if(inputData["statusNone"])
            {
             TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
             subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
            else
            {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
          
                if (TestSelected.length > 0) {
                    isGrandChildGetRequired = false;
                } else {
                    isGrandChildGetRequired = true;
                }

            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.APSelectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
        
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode.toString() : "";
                let APSelectedSample = inputData.APSelectedSample;
                let selectedPreregno = inputData.npreregno;
                let APSelectedTest = inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [];
                let APSelectedSubSample = inputData.masterData.AP_SUBSAMPLE

                if (subSample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.AP_SUBSAMPLE, "ntransactionsamplecode");
                    APSelectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.AP_SUBSAMPLE[0]];
                    if (inputData.masterData.AP_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }

                }
                let masterData = { ...inputData.masterData, APSelectedSample, APSelectedSubSample, APSelectedTest }
                if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = { ...skipInfo, testskip, testtake }
                }
                // inputData = {
                //     ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                //         "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, APSelectedSample, selectedPreregno, APSelectedTest,
                //     APSelectedSubSample, checkBoxOperation: 3,masterData,...skipInfo
                // }

                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, APSelectedSample, selectedPreregno, APSelectedTest,
                    APSelectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT,masterData,...skipInfo
                }

                if (subSample) {
                    if (APSelectedTest.length === 0) {
                        inputData["npreregno"] = APSelectedSubSample.map(x => x.npreregno).join(",")
                        inputData["ntransactionsamplecode"] = APSelectedSubSample.map(x => x.ntransactionsamplecode).join(",")
                       // inputData["checkBoxOperation"] = 3
                        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                        inputData["childTabsKey"] = ["AP_TEST"]
                        dispatch(getTestDetail(inputData, true));
                    } else {
                        dispatch(getTestChildTabDetail(inputData, true));
                    }
                } else {
                    dispatch(getTestChildTabDetail(inputData, true));
                }

                // dispatch(getTestChildTabDetail(inputData, true));
            } else {
              
                let masterData = {
                    ...inputData.masterData,
                    APSelectedTest: TestSelected ? TestSelected :inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [],
                    APSelectedSample: inputData.APSelectedSample,
                    APSelectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.AP_SUBSAMPLE.length>0 ? [inputData.masterData.AP_SUBSAMPLE[0]]:[]
                }
                let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
                oldSelectedTest.map((test, index) => {
                    if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        oldSelectedTest.splice(index, 1)
                    }
                    return null;
                });

                if(subSample)
                {
                    if (inputData.masterData.AP_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }
    
                }
                let keepOld = false;
                let ntransactiontestcode;
                if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = { ...skipInfo, testskip, testtake }
                }
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        selectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "-1";
                }
                switch (inputData.activeTestTab) {
                    case "IDS_RESULTS":
                        ApprovalParameter = keepOld ? inputData["statusNone"] ? getRecordBasedOnPrimaryKeyName (inputData.masterData.ApprovalParameter,inputData.removeElementFromArray[0].npreregno, "npreregno"): filterRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter,inputData.removeElementFromArray[0].npreregno, "npreregno") : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")

                        break;
                    case "IDS_INSTRUMENT":
                        ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    case "IDS_TASK":
                        ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    case "IDS_TESTATTACHMENTS":
                        RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    case "IDS_RESULTCHANGEHISTORY":
                        ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    case "IDS_TESTCOMMENTS":
                        RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    case "IDS_TESTAPPROVALHISTORY":
                        ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                        break;
                    default:
                        ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                        break;
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...masterData,
                            ApprovalParameter,
                            ResultUsedInstrument,
                            ResultUsedTasks,
                            RegistrationTestAttachment,
                            ApprovalResultChangeHistory,
                            RegistrationTestComment,
                            ApprovalHistory,
                            ...skipInfo,
                        },
                        ...skipInfo,
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab,
                        activeSubSampleTab:inputData.activeSubSampleTab,
                        activeTabIndex: inputData.activeTabIndex
                    }
                })
            }
        }
    }
}


export function getTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
            nflag: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalversioncode: inputData.napprovalversioncode,
            napprovalconfigcode: inputData.napprovalconfigcode,
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            activeSubSampleTab: inputData.activeSubSampleTab,
            userinfo: inputData.userinfo,
            ntransactionstatus:inputData.ntransactionstatus,
          //  ndesigntemplatemappingcode : inputData.masterData.ndesigntemplatemappingcode,
            ndesigntemplatemappingcode : inputData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation,
            nneedsubsample: inputData.masterData.realRegSubTypeValue.nneedsubsample,
            nbatchmastercode:inputData.nbatchmastercode

        }
        let activeName = "";
        let dataStateName = "";
        let masterData = {};
        let subSample = inputData.nneedsubsample;
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("approval/getApprovalTest", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    //responseData = sortData(responseData,'descending', 'npreregno')
                    inputData.searchTestRef.current.null = ""
                    //inputData.masterData.APSelectedTest = responseData.APSelectedTest ? responseData.APSelectedTest : inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []

                    let oldSelectedTest = inputData.masterData.APSelectedTest
                    let oldSelectedSubSample = inputData.masterData.APSelectedSubSample

                    inputData.masterData.APSelectedTest = oldSelectedTest.length > 0 ? oldSelectedTest : responseData.APSelectedTest ? responseData.APSelectedTest : inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []

                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        APSelectedTest: inputData.masterData.APSelectedTest,
                        // APselectedSample: inputData.APSelectedSample,
                        APSelectedSubSample: inputData.APSelectedSubSample,
                        selectedPreregno: inputData.npreregno,
                    }

                    if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                        inputData.searchSubSampleRef.current.value = "";
                        masterData['searchedSubSample'] = undefined
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTests'] = undefined
                    }

                    let { testskip, testtake, subSampleSkip, subSampleTake } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    if (inputData.masterData.AP_SUBSAMPLE.length <= inputData.subSampleSkip) {
                        subSampleSkip = 0;
                    }
                    // if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        // bool = true
                    // }
                    let skipInfo = {}
                    // if (bool) {
                        skipInfo = { testskip, testtake, subSampleSkip, subSampleTake }
                    // }

                    let ApprovalParameter = [];
                    let ResultUsedInstrument = [];
                    let ResultUsedTasks = [];
                    let RegistrationTestAttachment = [];
                    let ApprovalResultChangeHistory = [];
                    let RegistrationTestComment = [];
                    let ApprovalHistory = [];
                    let RegistrationSampleComment = [];
                    let RegistrationSampleAttachment = [];



                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {    
                        let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
                        oldSelectedTest.map((test, index) => {
                            if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                oldSelectedTest.splice(index, 1)
                            }
                            return null;
                        })
                        let keepOld = false;
                        let ntransactiontestcode;
                       
                        ntransactiontestcode = masterData.APSelectedTest[0].ntransactiontestcode
                        // }
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalHistory"
                                dataStateName = "historyDataState"
                                break;
                            default:
                                ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                        if(subSample)
                        {
                            let wholeSubsampleList = masterData.AP_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample.map((test, index) => {
                                if (!wholeSubsampleList.includes(test.ntransactionsamplecode)) {
                                    oldSelectedSubSample.splice(index, 1)
                                }
                                return null;
                            })
                        let keepOld = false;
                        let ntransactionsamplecode;
                       
                        ntransactionsamplecode = masterData.APSelectedSubSample[0].ntransactionsamplecode
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
                        
                  //  } else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {    
                        masterData = {
                            ...masterData,
                            APSelectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                        }
                        let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : 0;
                        let list = [];
                        let dbData = []
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                dbData = response.data.ApprovalParameter || []
                                list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(dbData, ntransactiontestcode, "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.ResultUsedInstrument || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...dbData]
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData]
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ApprovalResultChangeHistory || []
                                list = [...inputData.masterData.ApprovalResultChangeHistory, ...dbData]
                                ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData]
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                dbData = response.data.ApprovalHistory || []
                                list = [...inputData.masterData.ApprovalHistory, ...dbData]
                                ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            default:
                                dbData = response.data.ApprovalParameter || []
                                list = [...inputData.masterData.ApprovalParameter, ...dbData]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                   // } else if (inputData.checkBoxOperation === 7) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {    
                        let testList = reArrangeArrays( inputData.masterData.AP_SUBSAMPLE, responseData.AP_TEST, "ntransactionsamplecode");
                        masterData = {
                            ...masterData,
                            APSelectedTest:[testList[0]],
                            AP_TEST: testList,
                            ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                        }
                        // let wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
                    
                         let keepOld = false;
                        // let ntransactiontestcode;
                        // if (oldSelectedTest.length > 0) {
                        //     keepOld = true
                        //     masterData = {
                        //         ...masterData,
                        //         APSelectedTest: oldSelectedTest
                        //     }
                        // } else {
                        //     ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : ""
                        // }
                        let ntransactiontestcode = testList.length > 0 ? testList[0].ntransactiontestcode : ""
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                ApprovalParameter =  getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalHistory"
                                dataStateName = "historyDataState"
                                break;
                            default:
                                ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                        }

                    } else {
                        masterData = {
                            ...masterData,
                            APSelectedTest: inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : []
                        }
                        let ntransactiontestcode = response.data.APSelectedTest ? response.data.APSelectedTest.length > 0 ? 
                                response.data.APSelectedTest[0].ntransactiontestcode : inputData.masterData.AP_TEST ? inputData.masterData.AP_TEST.length > 0 ?  inputData.masterData.AP_TEST[0].ntransactiontestcode :-1:-1:-1
                                
                                //inputData.masterData.AP_TEST ? inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode: -1 : -1
                        let list = [];
                        switch (inputData.activeTestTab) {
                            case "IDS_RESULTS":
                                list = response.data.ApprovalParameter || []
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument || []
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks || []
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment || []
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ApprovalResultChangeHistory || []
                                ApprovalResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment || []
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_TESTAPPROVALHISTORY":
                                list = response.data.ApprovalHistory || []
                                ApprovalHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalHistory"
                                dataStateName = "historyDataState"
                                break;
                            default:
                                list = response.data.ApprovalParameter?[...inputData.masterData.ApprovalParameter, ...response.data.ApprovalParameter]:
                                [...inputData.masterData.ApprovalParameter]
                                ApprovalParameter = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ApprovalParameter"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }
                    if(subSample)
                        {
                            let wholeSubsampleList = masterData.AP_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample.map((test, index) => {
                                if (!wholeSubsampleList.includes(test.ntransactionsamplecode)) {
                                    oldSelectedSubSample.splice(index, 1)
                                }
                                return null;
                            })
                        let keepOld = false;
                        let ntransactionsamplecode;

                        if (oldSelectedSubSample.length > 0) {
                            keepOld = true
                            // masterData = {
                            //     ...masterData,
                            //     //AP_TEST:responseData.AP_TEST,
                            //     ApprovalParameter:oldApprovalParameter,
                            //     APSelectedSubSample: oldSelectedSubSample
                            // }
                        } else {
                            ntransactionsamplecode = masterData.APSelectedSubSample[0].ntransactionsamplecode
                        }
                       
                       // ntransactionsamplecode = masterData.APSelectedSubSample[0].ntransactionsamplecode
                            switch (inputData.activeSubSampleTab) {
                                case "IDS_SUBSAMPLECOMMENTS":
                                    RegistrationSampleComment = keepOld ? inputData.masterData.RegistrationSampleComment : getRecordBasedOnPrimaryKeyName(responseData.RegistrationSampleComment, ntransactionsamplecode, "ntransactionsamplecode")
                                    activeName = "RegistrationSampleComment"
                                    dataStateName = "subSampleCommentDataState"
                                    break;
                                default:
                                    RegistrationSampleAttachment = keepOld ? inputData.masterData.RegistrationSampleAttachment : getRecordBasedOnPrimaryKeyName(responseData.RegistrationSampleAttachment, ntransactionsamplecode, "ntransactionsamplecode")
                                    activeName = "RegistrationSampleAttachment"
                                    dataStateName = "subSampleAttachmentDataState"
                                break;
                            }
                        }

                    masterData = {
                        ...masterData,
                        ApprovalParameter,
                        ResultUsedInstrument,
                        ResultUsedTasks,
                        RegistrationTestAttachment,
                        ApprovalResultChangeHistory,
                        RegistrationTestComment,
                        ApprovalHistory,
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
                    skipInfo = {
                        ...skipInfo,
                        samplePrintHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        },
                        sampleHistoryDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        }
                    }
                    skipInfo = {
                        ...skipInfo,
                        subSampleCommentDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        },
                        subSampleAttachmentDataState: {
                            ...inputData[dataStateName],
                            sort: undefined,
                            filter: undefined
                        }
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...masterData,
                                APSelectedSubSample: inputData.APSelectedSubSample,
                                selectedPreregno: inputData.npreregno,
                                selectedSampleCode: inputData.ntransactionsamplecode,
                                activeTestTab: inputData.activeTestTab,
                                activeSampleTab: inputData.activeSampleTab,
                                skip: undefined,
                                take: undefined,
                                ...skipInfo
                            },
                            ...skipInfo,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
            let bool = false;
            let skipInfo = {};
            let { testskip, testtake } = inputData;
            let oldSelectedTest = inputData.masterData.APSelectedTest
            let TestSelected = 
          inputData["statusNone"] ?
            getRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode"):
            filterRecordBasedOnPrimaryKeyName(inputData.masterData.APSelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }

            let ApprovalParameter = [];
            let ResultUsedInstrument = [];
            let ResultUsedTasks = [];
            let RegistrationTestAttachment = [];
            let ApprovalResultChangeHistory = [];
            let RegistrationTestComment = [];

            let ApprovalHistory = [];
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.APSelectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                //let ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ? inputData.masterData.AP_TEST[0].ntransactiontestcode.toString() : "";
                let APSelectedSample = inputData.masterData.APSelectedSample;
                let selectedPreregno = inputData.npreregno;
                //let selectedTest = inputData.masterData.AP_TEST.length > 0 ? [inputData.masterData.AP_TEST[0]] : [];
                let APSelectedSubSample = inputData.APSelectedSubSample
                //let APSelectedSubSample = inputData.masterData.APSelectedSubSample
                let filterTestSameOldSelectedTest = getSameRecordFromTwoDifferentArrays(oldSelectedTest, inputData.masterData.AP_TEST, "ntransactiontestcode");
                let APSelectedTest = filterTestSameOldSelectedTest.length > 0 ? filterTestSameOldSelectedTest : [inputData.masterData.AP_TEST[0]];
                let ntransactiontestcode = APSelectedTest.length > 0 ? APSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1";

                if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true;
                }
                if (bool) {
                    skipInfo = { testskip, testtake }
                }
                // inputData = {
                //     ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                //         "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, APSelectedSample, selectedPreregno, APSelectedTest,
                //     APSelectedSubSample, checkBoxOperation: 3, skipInfo
                // }

                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, APSelectedSample, selectedPreregno, APSelectedTest,
                    APSelectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, skipInfo
                }
                dispatch(getTestChildTabDetail(inputData, true));
            } 
            else {
                    let keepOld = false;
                    let ntransactiontestcode;

                    let masterData = {
                        ...inputData.masterData,
                        APSelectedSubSample: inputData.APSelectedSubSample,
                        selectedTransactioncode: inputData.ntransactionsamplecode,
                        APSelectedTest: TestSelected ? TestSelected : inputData.masterData.AP_TEST.length > 0 ?
                            [inputData.masterData.AP_TEST[0]] : [],
                    }

                    const wholeTestList = masterData.AP_TEST.map(b => b.ntransactiontestcode)
                    oldSelectedTest.forEach((test, index) => {
                        if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            oldSelectedTest.splice(index, 1)
                        }
                        return null;
                    });
                    if (inputData.masterData.AP_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        bool = true
                    }
                    let skipInfo = {}
                    if (bool) {
                        skipInfo = { testskip, testtake }
                    }

                    if (oldSelectedTest.length > 0) {
                        keepOld = true
                        masterData = {
                            ...masterData,
                            APSelectedTest: oldSelectedTest,
                        }
                    } else {
                        ntransactiontestcode = inputData.masterData.AP_TEST.length > 0 ?
                            inputData.masterData.AP_TEST[0].ntransactiontestcode : "-1"
                    }


                    switch (inputData.activeTestTab) {
                        case "IDS_RESULTS":
                            ApprovalParameter = keepOld ? 
                            inputData["statusNone"] ?
                            getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter,inputData.removeElementFromArray[0].ntransactionsamplecode,'ntransactionsamplecode'):
                            filterRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter,inputData.removeElementFromArray[0].ntransactionsamplecode,'ntransactionsamplecode') : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_INSTRUMENT":
                            ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_TASK":
                            ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_TESTATTACHMENTS":
                            RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_RESULTCHANGEHISTORY":
                            ApprovalResultChangeHistory = keepOld ? inputData.masterData.ApprovalResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_TESTCOMMENTS":
                            RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        case "IDS_TESTAPPROVALHISTORY":
                            ApprovalHistory = keepOld ? inputData.masterData.ApprovalHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalHistory, ntransactiontestcode, "ntransactiontestcode")
                            break;
                        default:
                            ApprovalParameter = keepOld ? inputData.masterData.ApprovalParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.ApprovalParameter, ntransactiontestcode, "ntransactiontestcode")
                            break;
                    }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...masterData,
                                ApprovalParameter,
                                ResultUsedInstrument,
                                ResultUsedTasks,
                                RegistrationTestAttachment,
                                ApprovalResultChangeHistory,
                                RegistrationTestComment,
                                ApprovalHistory
                            },
                            loading: false,
                            showFilter: false,
                            ...skipInfo,
                            activeSampleTab: inputData.activeSampleTab,
                            activeTestTab: inputData.activeTestTab
                        }
                    })
                }
            }
        //}
    }
}



export function getTestChildTabDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            let inputParamData = {
                ntransactiontestcode: inputData.ntransactiontestcode,
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo
            }
            let url = null
            let { testtake } = inputData;
            let activeName = "";
            let dataStateName = "";
            switch (inputData.activeTestTab) {
                case "IDS_RESULTS":
                    url = "approval/getapprovalparameter"
                    activeName = "ApprovalParameter"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_PARAMETERRESULTS":
                    url = "registration/getregistrationparameter"
                    activeName = "RegistrationParameter"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    url = "resultentrybysample/getResultUsedInstrument"
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    url = "resultentrybysample/getResultUsedMaterial"
                    break;
                case "IDS_TASK":
                    url = "resultentrybysample/getResultUsedTask"
                    activeName = "ResultUsedTasks"
                    dataStateName = "taskDataState"
                    break;
                case "IDS_TESTATTACHMENTS":
                    url = "attachment/getTestAttachment"
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    url = "comments/getTestComment"
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_DOCUMENTS":
                    url = "approval/getapprovalparameter"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    url = "approval/getApprovalResultChangeHistory"
                    activeName = "ApprovalResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_TESTAPPROVALHISTORY":
                    url = "approval/getSampleApprovalHistory"
                    activeName = "ApprovalHistory"
                    dataStateName = "historyDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                case "IDS_TESTHISTORY":
                    url = "history/getTestHistory"
                    activeName = "RegistrationTestHistory"
                    dataStateName = "registrationTestHistoryDataState"
                    break;
                default:
                    url = "approval/getapprovalparameter"
                    activeName = "ApprovalParameter"
                    dataStateName = "resultDataState"
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                if (isServiceRequired) {
                    rsapi().post(url, inputParamData)
                        .then(response => {
                            let skipInfo = {};
                            let responseData = { ...response.data, APSelectedSubSample: inputData.APSelectedSubSample || inputData.masterData.APSelectedSubSample, selectedTest: inputData.APselectedTest }
                            //responseData = inputData.checkBoxOperation === 7 ?  sortData( response.data,"descending","npreregno"):responseData;
                            //sortData( responseData,"descending","ntransactionsamplecode")
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                APSelectedSample: inputData.APSelectedSample || inputData.masterData.APSelectedSample,
                                APSelectedSubSample: inputData.APSelectedSubSample || inputData.masterData.APSelectedSubSample,
                                APSelectedTest: inputData.APSelectedTest,
                                selectedPreregno: inputData.npreregno,
                                selectedSampleCode: inputData.ntransactionsamplecode ? inputData.ntransactionsamplecode :inputData.masterData.APSelectedSubSample[0].ntransactionsamplecode ,
                                selectedTestCode: inputData.ntransactiontestcode,
                                activeTabIndex:inputData.activeTabIndex,
                                activeTabId:inputData.activeTabId
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
                                type: DEFAULT_RETURN, payload: {
                                    masterData,
                                    loading: false,
                                    showFilter: false,
                                    availableReleaseRecord:undefined,
                                    activeTabIndex:inputData.activeTabIndex,
                                    activeTabId:inputData.activeTabId,
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
                } else {
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.APSelectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        APSelectedTest: inputData.APSelectedTest,
                        selectedPreregno: inputData.npreregno,
                        selectedSampleCode: inputData.ntransactionsamplecode,
                        selectedTestCode: inputData.ntransactiontestcode,
                    }
                    if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

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
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            screenName: inputData.screenName,
                            testtake, testskip: undefined,
                            availableReleaseRecord:undefined,
                            ...skipInfo
                        }
                    })
                }

            } else {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData
                        },
                        loading: false,
                        showFilter: false,
                        availableReleaseRecord:undefined,
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            let { ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment, ApprovalResultChangeHistory,
                RegistrationTestComment, ApprovalHistory, RegistrationTestHistory } = inputData.masterData
            switch (inputData.activeTestTab) {
                case "IDS_RESULTS":
                    ApprovalParameter = [];
                    break;
                case "IDS_INSTRUMENT":
                    ResultUsedInstrument = []
                    break;
                case "IDS_TASK":
                    ResultUsedTasks = []
                    break;
                case "IDS_TESTATTACHMENTS":
                    RegistrationTestAttachment = []
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    ApprovalResultChangeHistory = []
                    break;
                case "IDS_TESTCOMMENTS":
                    RegistrationTestComment = []
                    break;
                case "IDS_APPROVALHISTORY":
                    ApprovalHistory = []
                    break;
                case "IDS_TESTHISTORY":
                    RegistrationTestHistory = []
                    break;
                default:
                    ApprovalParameter = []
                    break;
            }

            dispatch({
                type: DEFAULT_RETURN, payload: {
                    masterData: {
                        ...inputData.masterData,
                        selectedTest: [],
                        ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment,
                        ApprovalResultChangeHistory, RegistrationTestComment, ApprovalHistory
                    }, loading: false
                }
            })
        }
    }
}
export function getSampleChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.npreregno.length > 0) {
            let inputParamData = {
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo,
                OrderCodeData: inputData.OrderCodeData ? inputData.OrderCodeData : -1
            }
            let url = null
            switch (inputData.activeSampleTab) {
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                case "IDS_SAMPLECOMMENTS":
                    url = "comments/getSampleComment"
                    break;
                case "IDS_SUBSAMPLEATTACHMENTS":
                    url = "resultentrybysample/getResultUsedMaterial"
                    break;
                case "IDS_SUBSAMPLECOMMENTS":
                    url = "resultentrybysample/getResultUsedTask"
                    break;
                case "IDS_SOURCE":
                    url = "registration/getRegistrationSourceCountry"
                    break;
                case "IDS_SAMPLEAPPROVALHISTORY":
                    url = "approval/getSampleApprovalHistory"
                    break;

                case "IDS_PRINTHISTORY":
                    url = "approval/getPrintHistory"
                    break;
                case "IDS_REPORTHISTORY":
                    url = "approval/getCOAHistory"
                    break;
                case "IDS_EXTERNALORDERREPORTS":
                    url = "registration/getExternalOrderAttachment"
                    break;
                //ALPDJ21-110--Added by Vignesh(29-09-2025)-->Test Package tab added in Sample Registration Screen.    
                case "IDS_TESTPACKAGE":
                    url = "registration/getTestPackageBySample"
                    break;
                default:
                    url = null
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                rsapi().post(url, inputParamData)
                    .then(response => {
                        let responseData = { ...response.data }
                        responseData = sortData(responseData)
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData: {
                                    ...inputData.masterData,
                                    ...responseData,
                                    selectedSample: inputData.selectedSample,
                                    selectedTestCode: inputData.ntransactiontestcode,
                                },
                                loading: false,
                                showFilter: false,
                                activeSampleTab: inputData.activeSampleTab,
                                activeTestTab: inputData.activeSampleTab,
                                screenName: inputData.screenName,
                                selectedId: null,
                                activeTabIndex: inputData.activeTabIndex
                            }
                        })
                    })
                    .catch(error => {
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                        if (error.response?.status === 429) {
                            toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            selectedSample: inputData.selectedSample
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            
            toast.warn(intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));
        }
    }
}
export function performAction(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("approval/performAction", inputParam.inputData)
            .then(response => {
                if(response.data.rtn === undefined || response.data.rtn==="Success"){
                    replaceUpdatedObject(response.data["AP_SAMPLE"], inputParam.masterData.AP_SAMPLE, "npreregno");
                    replaceUpdatedObject(response.data["AP_SUBSAMPLE"], inputParam.masterData.AP_SUBSAMPLE, "ntransactionsamplecode");
                    replaceUpdatedObject(response.data["AP_TEST"], inputParam.masterData.AP_TEST, "ntransactiontestcode");

                    let AP_SAMPLE = response.data["AP_SAMPLE"];
                    let AP_SUBSAMPLE = response.data["AP_SUBSAMPLE"];
                    let AP_TEST = response.data["AP_TEST"];


                    delete response.data["AP_SAMPLE"];
                    delete response.data["AP_SUBSAMPLE"];
                    delete response.data["AP_TEST"];
                    let masterData = {
                        ...inputParam.masterData,
                         ...response.data,
                         APSelectedSample: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.APSelectedSample, "npreregno"),
                          APSelectedSubSample: replaceUpdatedObject(AP_SUBSAMPLE, inputParam.masterData.APSelectedSubSample, "ntransactionsamplecode"),
                         //APSelectedSubSample: getSameRecordFromTwoArrays(response.data.updatedSubSample, inputParam.masterData.APSelectedSubSample, "ntransactionsamplecode", undefined),
                         APSelectedTest: replaceUpdatedObject(AP_TEST, inputParam.masterData.APSelectedTest, "ntransactiontestcode"),
                        //APSelectedTest: getSameRecordFromTwoArrays(response.data.updatedTest, inputParam.masterData.APSelectedTest, "ntransactiontestcode", undefined),
                    }
                // let masterData = {
                //     ...inputParam.masterData,
                //     ...response.data,
                //     AP_SAMPLE: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.AP_SAMPLE, 'npreregno'),
                //     AP_SUBSAMPLE: replaceUpdatedObject(response.data.updatedSubSample, inputParam.masterData.AP_SUBSAMPLE, 'ntransactionsamplecode'),
                //     AP_TEST: replaceUpdatedObject(response.data.updatedTest, inputParam.masterData.AP_TEST, 'ntransactiontestcode')
                // }
                // dispatch({type: DEFAULT_RETURN, payload:{
                // masterData:{
                //     ...inputParam.inputData.masterData,
                //     ...response.data, 
                //     AP_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam   .inputData.masterData.AP_SAMPLE,'npreregno'),
                //     AP_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.inputData.masterData.AP_SUBSAMPLE,'ntransactionsamplecode'),
                //     AP_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.inputData.masterData.AP_TEST,'ntransactiontestcode')
                // },
                //     loading:false ,
                //     loadEsign:false,
                //     openChildModal:false                     
                // }}) 
                let respObject = {
                    masterData,
                    inputParam,
                    openChildModal: false,
                    operation: "dynamic",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false,
                    availableReleaseRecord:undefined                }

                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))


                
            }else{
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false
                    }
                });
                //toast.warn(response.data.rtn);
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    //toast.error(intl.formatMessage({ id: "IDS_SERVICEERROR" }));
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
export function updateDecision(inputParam) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/updateDecision", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                // dispatch({type: DEFAULT_RETURN, payload:{
                //     masterData:{
                //         ...inputParam.masterData,
                //         ...responseData, 
                //         AP_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam.masterData.AP_SAMPLE,'npreregno'),
                //         AP_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.masterData.AP_SUBSAMPLE,'ntransactionsamplecode'),
                //         AP_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.masterData.AP_TEST,'ntransactiontestcode')

                //     },
                //     loading:false                      
                // }}) 
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                    AP_SAMPLE: replaceUpdatedObject(response.data.AP_SAMPLE, inputParam.masterData.AP_SAMPLE, 'npreregno'),
                    AP_SUBSAMPLE: replaceUpdatedObject(response.data.AP_SUBSAMPLE, inputParam.masterData.AP_SUBSAMPLE, 'ntransactionsamplecode'),
                    // ALPD-5676    Added AP_TEST by Vishakh to replace the updated test in front end (08-04-2025)
                    AP_TEST: replaceUpdatedObject(response.data.AP_TEST, inputParam.masterData.AP_TEST, 'ntransactiontestcode')
                }
                let respObject = {
                    masterData,
                    inputParam,
                    openChildModal: false,
                    operation: "dynamic",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false,
                    // ALPD-5676    Added skip and take for test and subsample by Vishakh to update in store (08-04-2025)
                    testskip: inputParam.testskip,
                    testtake: inputParam.testtake, 
                    subSampleSkip: inputParam.subSampleSkip, 
                    subSampleTake: inputParam.subSampleTake
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getRegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getRegistrationType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            SampleTypeValue: inputData.SampleTypeValue,
                            realApprovalVersionList:inputData.realApprovalVersionList,
                            realDesignTemplateMappingList:inputData.realDesignTemplateMappingList,
                            realRegTypeList:inputData.realRegTypeList,
                            realRegSubTypeList :inputData.realRegSubTypeList,
                            realFilterStatusList:inputData.realFilterStatusList
                        },
                        loading: false
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getRegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getRegistrationSubType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            RegTypeValue: inputData.RegTypeValue,
                            realApprovalVersionList:inputData.realApprovalVersionList,
                            realDesignTemplateMappingList:inputData.realDesignTemplateMappingList,
                            realRegTypeList:inputData.realRegTypeList,
                            realRegSubTypeList :inputData.realRegSubTypeList,
                            realFilterStatusList:inputData.realFilterStatusList
                        },
                        loading: false
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getApproveConfigVersionRegTemplateDesign", inputData)
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

export function getFilterBasedTest(inputData) {
    return function (dispatch) {
        if (inputData.napprovalversioncode) {
            dispatch(initRequest(true));
            rsapi().post("approval/getFilterBasedTest", inputData)
                .then(response => {


                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...responseData,
                                RegSubTypeValue: inputData.RegSubTypeValue,
                                ndesigntemplatemappingcode:inputData.ndesigntemplatemappingcode,
                                DesignTemplateMappingValue:inputData.DesignTemplateMappingValue
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
            //toast.warn("Please Select All the Values in Filter");
            toast.warn(intl.FormattedMessage({
                id: "IDS_PLSSELECTALLVALUESINFILTER"
            }));
        }
    }

}

export function getApprovalVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getApprovalVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
              //  responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            realApprovalVersionList:inputParam.inputData.realApprovalVersionList,
                            realDesignTemplateMappingList:inputParam.inputData.realDesignTemplateMappingList,
                            realRegTypeList:inputParam.inputData.realRegTypeList,
                            realRegSubTypeList :inputParam.inputData.realRegSubTypeList,
                            realFilterStatusList:inputParam.inputData.realFilterStatusList
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
export function getApprovalSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getApprovalSample", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                // responseData = sortData(responseData)
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
                    // masterData['searchedTest'] = undefined
                    masterData['searchedTests'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        take: inputParam.take,
                        testskip: 0,
                        testtake: inputParam.testtake,
                        //ALPD-5193--Added byNeeraj  Test Approval screen -> Records are disappeared in Sub-sample column in specific scenario. ( Both Product & French )
                        //start
                        subSampleSkip:0,
                        subSampleTake:inputParam.subSampleTake,
                        //end
                        resultDataState: { ...inputParam.resultDataState, sort: undefined, filter: undefined },
                        instrumentDataState: { ...inputParam.instrumentDataState, sort: undefined, filter: undefined },
                        materialDataState: { ...inputParam.materialDataState, sort: undefined, filter: undefined },
                        taskDataState: { ...inputParam.taskDataState, sort: undefined, filter: undefined },
                        documentDataState: { ...inputParam.documentDataState, sort: undefined, filter: undefined },
                        resultChangeDataState: { ...inputParam.resultChangeDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParam.testCommentDataState, sort: undefined, filter: undefined },
                        historyDataState: { ...inputParam.historyDataState, sort: undefined, filter: undefined },
                        samplePrintHistoryDataState: { ...inputParam.samplePrintHistoryDataState, sort: undefined, filter: undefined },
                        sampleHistoryDataState: { ...inputParam.sampleHistoryDataState, sort: undefined, filter: undefined },
                        filterSubmitValueEmpty: false   // ALPDJ21-17  Added filterSubmitValueEmpty by Vishakh (10-07-2025)
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getStatusCombo(inputParam) {
    return function (dispatch) {
        let inputData = {
            ntransactionresultcode: inputParam.primaryKeyValue,
            userinfo: inputParam.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("approval/getStatusCombo", inputData)
            .then(response => {
                let responseData = { ...response.data }
                //responseData = sortData(responseData)
                const GradeListMap = constructOptionList(response.data.Grade || [], "ngradecode", "scombodisplaystatus", 'ascending', 'ngradecode', false);
                let Grade = GradeListMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            Grade,
                            selectedParamId: inputParam.primaryKeyValue
                        },
                        loading: false,
                        showFilter: false,
                        openChildModal: true,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord: {
                            senforcestatuscomment: response.data.parameterComment && response.data.parameterComment.senforcestatuscomment,
                            ntransactionresultcode: response.data.parameterComment && response.data.parameterComment.ntransactionresultcode,
                            ntransactiontestcode: response.data.parameterComment && response.data.parameterComment.ntransactiontestcode
                        },
                        operation: "enforce",
                        screenName: "IDS_STATUS"
                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getParameterEdit(inputParam) {
    return function (dispatch) {
        let inputData = {
            ntransactiontestcode: inputParam.selectedTest && inputParam.selectedTest.map(item => item.ntransactiontestcode).join(","),
            userinfo: inputParam.userInfo
        }
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            dispatch(initRequest(true));
            rsapi().post("approval/getEditParameter", inputData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            ...responseData,
                            loading: false,
                            openChildModal: true,
                            operation: "update",
                            screenName: "IDS_APPROVALPARAMETER"
                            // ncontrolCode:inputParam.ncontrolCode,
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    multilingualMsg: "IDS_SELECTTEST",
                }
            });
        }
    }
}
export function validateEsignforApproval(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {

                    if (inputParam.operation === 'dynamic') {
                        const methodUrl = "performaction"
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                        if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                            inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                        }
                        dispatch(performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
                    } else if (inputParam.operation === 'reportgeneration') {
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esignreason"];
                        delete inputParam["screenData"]["inputParam"]['reporparam']["agree"];
                        inputParam["screenData"]["inputParam"]["reporparam"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(generateCOAReport(inputParam["screenData"]["inputParam"]['reporparam']))
                    }
                    else if (inputParam.operation === 'decision') {
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["agree"];
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(updateDecision(inputParam["screenData"]["inputParam"]))
                    }
                    else if (inputParam.operation === 'enforce') {
                        const methodUrl = inputParam.screenData.inputParam.methodUrl;
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
    
                        if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                            inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                        }
                        dispatch(updateEnforceStatus(inputParam["screenData"].inputParam))
                    }
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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

export function previewSampleReport(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        let ndecisionStatus = inputParam.sample.ndecisionstatus;
        if (inputParam.sample.ndecisionstatus === undefined || inputParam.sample.ndecisionstatus === transactionStatus.DRAFT) {
            ndecisionStatus = transactionStatus.PASS;
        }
        const inputData = {
            ndecisionstatus: ndecisionStatus,
            userinfo: inputParam.userinfo,
            nprimarykey: inputParam.sample.npreregno,
            ncoareporttypecode: reportCOAType.SAMPLECERTIFICATEPRIVIEW,
            nreporttypecode: REPORTTYPE.SAMPLEREPORT,
            sprimarykeyname: "npreregno",
            ncontrolcode: inputParam.ncontrolCode,
            nregtypecode: inputParam.sample.nregtypecode,
            nregsubtypecode: inputParam.sample.nregsubtypecode,
            npreregno: inputParam.sample.npreregno
        }
        rsapi().post("approval/previewSampleReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openChildModal: false, loadEsign: false } })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function generateCOAReport(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const inputData = {
            npreregno: inputParam.sample.npreregno,
            nsectioncode: inputParam.nsectioncode || -1,
            userinfo: inputParam.userinfo,
            nprimarykey: inputParam.sample.npreregno,
            ncoareporttypecode: reportCOAType.SAMPLEWISE,
            nreporttypecode: REPORTTYPE.COAREPORT,
            sprimarykeyname: "npreregno",
            ncontrolcode: inputParam.ncontrolCode,
            nregtypecode: inputParam.nregtypecode,
            nregsubtypecode: inputParam.nregsubtypecode
        }
        rsapi().post("approval/generateCOAReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {
                    document.getElementById("download_data").setAttribute("href", response.data.filepath);
                    document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openChildModal: false, selectedRecord: {}, loadEsign: false } })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function getEnforceCommentsHistory(selectedParam, masterData, userInfo,idsName,dataField) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getEnforceCommentsHistory", {
            ntransactionresultcode: selectedParam.ntransactionresultcode,
            userinfo: userInfo,
            fetchField:dataField
        })
            .then(response => {
                if (response.data.length > 0) {
                    masterData = { ...masterData, enforceCommentsHistory: response.data }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            masterData,
                            openChildModal: true,
                            operation: "view",
                            screenName: "IDS_ENFORCECOMMENTHISTORY",
                            idsName:idsName,
                            dataField:dataField
                        }
                    })
                } else {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false, multilingualMsg: "IDS_NOPREVIOUSCOMMENTSFOUND" } })

                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
export function reportGenerate(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const inputData = {
            npreregno: inputParam.sample.npreregno,
            userinfo: inputParam.userinfo,
            nregsubtypecode: inputParam.sample.nregsubtypecode,
            reportName:"RJ_Testwise_Report_QRCode",
            reportFormat:"pdf"
           
        }
        rsapi().post("reportjasper/generateCOAReport", inputData)
            .then(response => {

                if (response.data.rtn === "Success") {

                    if (response.data.filePath) {
                       // let user = response;
                        let elnURL = response.data.filePath;
                        window.open(elnURL, '_blank');
                    } else {
                        toast.info(intl.FormattedMessage({
                            id: "IDS_ELNUIURLNOTAVAILABLE"
                        }))
                    }

                    // document.getElementById("download_data").setAttribute("href", response.data.filePath);
                    // document.getElementById("download_data").click();
                } else {
                    toast.warn(response.data.rtn);
                }
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, openChildModal: false, selectedRecord: {}, loadEsign: false } })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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

export function getSubSampleChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.ntransactionsamplecode.length > 0) {
            let inputParamData = {
                ntransactionsamplecode: inputData.ntransactionsamplecode,
                userinfo: inputData.userinfo
            }
            let url = null
            switch (inputData.activeSubSampleTab) {
                case "IDS_SUBSAMPLEATTACHMENTS":
                    url = "attachment/getSubSampleAttachment"
                    break;
                case "IDS_SUBSAMPLECOMMENTS":
                    url = "comments/getSubSampleComment"
                    break;
                default:
                    url = null
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                rsapi().post(url, inputParamData)
                    .then(response => {
                        let responseData = { ...response.data }
                        responseData = sortData(responseData)
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                masterData: {
                                    ...inputData.masterData,
                                    ...responseData,
                                    APSelectedSubSample: inputData.APSelectedSubSample,
                                   // selectedTestCode: inputData.ntransactiontestcode,
                                },
                                loading: false,
                                showFilter: false,
                                activeTestTab: inputData.activeSubSampleTab,
                                screenName: inputData.screenName
                            }
                        })
                    })
                    .catch(error => {
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                        if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            APSelectedSample: inputData.APSelectedSample
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            //toast.warn("Please Select a Sample");
            toast.warn(intl.FormattedMessage({
                id: "IDS_PLSSELECTASAMPLE"
            }));
        }
    }
}


export function ViewPatientDetails(masterData, screenName, userInfo, viewdetails,inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const selectedRecord={
            ntestcode:viewdetails.test.ntestcode
        }

         let inputParamData = {
            ntype: 2,
            nflag: 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactionstatus: inputData.ntransactionstatus,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: inputData.napprovalversioncode,
            napprovalconfigcode: inputData.napprovalconfigcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeTestTab,
            activeSubSampleTab: inputData.activeTestTab,
            userinfo: inputData.userinfo,
            nneedsubsample: inputData.nneedsubsample,
            ndesigntemplatemappingcode : inputData.ndesigntemplatemappingcode 
            ? inputData.ndesigntemplatemappingcode : masterData.ndesigntemplatemappingcode,
            checkBoxOperation: masterData.searchedSubSample ?  
            masterData.searchedSubSample.length > 0 ?
            inputData.checkBoxOperation:checkBoxOperation.SINGLESELECT:inputData.checkBoxOperation,   
            nbatchmastercode:inputData.nbatchmastercode
        }
        let urlArray = [];
        const sampleDetails=rsapi().post("approval/getSampleViewDetails", { selectedRecord, PatientId:viewdetails.test.spatientid, npreregno: viewdetails.test.npreregno, userinfo: userInfo })
        const subSampleDetails =rsapi().post("approval/getApprovalSubSample", inputParamData)
        urlArray=[sampleDetails,subSampleDetails]
              Axios.all(urlArray).then(response => {
                let APSelectedSample=[];
                let responseData = sortData(response[1].data);
                APSelectedSample.push({...viewdetails.test})
                masterData['AuditModifiedComments'] = [];
                masterData['AuditModifiedComments'] = response[0].data['AuditModifiedComments']
                masterData['CurrentResult'] = [];
                masterData['CurrentResult'] = response[0].data['CurrentResult']
                masterData['viewdetails'] = [];
                masterData['viewdetails'] = response[0].data['viewdetails'][0]
                masterData={...masterData,...responseData,APSelectedSample}
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        screenName: "IDS_PREVIOUSRESULTVIEW",
                        operation: "",
                        loading: false,
                        openChildModal: true,

                    }
                })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    toast.warn(error.response.data);
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                }
            })
    }
}

export function  getTestBasedCompletedBatch (inputData){
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getTestBasedOnCompletedBatch", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                           // defaultTestvalues: inputData.defaultTestvalues //,
                            // defaultRegistrationSubType: inputData.masterData.defaultRegistrationSubType,//inputData.defaultRegistrationSubType,
                            // ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                            // DesignTemplateMappingValue: inputData.DesignTemplateMappingValue
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

//Added by sonia on 4th July 2025 for jira id:ALPDJ21-6
export function  updateResultCorrection(inputParam) {
        return function (dispatch) {
        dispatch(initRequest(true));
        const formData = inputParam.formData;
        formData.append("userinfo", JSON.stringify(inputParam.inputData.userinfo));
        rsapi().post("approval/updateReleaseParameter", formData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                replaceUpdatedObject(responseData["AP_SAMPLE"], inputParam.masterData.AP_SAMPLE, "npreregno");
                replaceUpdatedObject(responseData["AP_SUBSAMPLE"], inputParam.masterData.AP_SUBSAMPLE, "ntransactionsamplecode");
                replaceUpdatedObject(responseData["AP_TEST"], inputParam.masterData.AP_TEST, "ntransactiontestcode");

                delete responseData["AP_SAMPLE"];
                delete responseData["AP_SUBSAMPLE"];
                delete responseData["AP_TEST"];
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                    APSelectedSample: replaceUpdatedObject(responseData.updatedSample, inputParam.masterData.APSelectedSample, "npreregno"),
                    APSelectedSubSample: replaceUpdatedObject(responseData.updatedSubSample, inputParam.masterData.APSelectedSubSample, 'ntransactionsamplecode'),
                    APSelectedTest: replaceUpdatedObject(responseData.updatedTest, inputParam.masterData.APSelectedTest, 'ntransactiontestcode')

                }
                let respObject = {
                    masterData,
                    inputParam,
                    operation: "update",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false,
                    modalShow: false,
                    openModal: true,
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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

export function updateEnforceStatus(inputParam) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/updateEnforceStatus", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                replaceUpdatedObject(responseData["AP_SAMPLE"], inputParam.masterData.AP_SAMPLE, "npreregno");
                replaceUpdatedObject(responseData["AP_SUBSAMPLE"], inputParam.masterData.AP_SUBSAMPLE, "ntransactionsamplecode");
                replaceUpdatedObject(responseData["AP_TEST"], inputParam.masterData.AP_TEST, "ntransactiontestcode");

                delete responseData["AP_SAMPLE"];
                delete responseData["AP_SUBSAMPLE"];
                delete responseData["AP_TEST"];
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                    APSelectedSample: replaceUpdatedObject(responseData.updatedSample, inputParam.masterData.APSelectedSample, "npreregno"),
                    APSelectedSubSample: replaceUpdatedObject(responseData.updatedSubSample, inputParam.masterData.APSelectedSubSample, 'ntransactionsamplecode'),
                    APSelectedTest: replaceUpdatedObject(responseData.updatedTest, inputParam.masterData.APSelectedTest, 'ntransactiontestcode')

                }
                let respObject = {
                    masterData,
                    inputParam,
                    openChildModal: false,
                    operation: "update",
                    masterStatus: "",
                    errorCode: undefined,
                    loadEsign: false,
                    showEsign: false,
                    selectedRecord: {},
                    loading: false
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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

export function checkReleaseRecord(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("approval/checkReleaseRecord", inputParam.inputData)
            .then(response => {
                let availableReleaseRecord;
                if(response.data.rtn=="Success"){
                    availableReleaseRecord = true
                }else{
                    availableReleaseRecord = false
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        availableReleaseRecord,
                        loading: false,
                        action:inputParam.action,
                        ncontrolCode:inputParam.inputData.performaction.ncontrolCode
                    }
                });
                // else{
                //     dispatch(performAction(inputParam))
                // } 

               // dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))

              
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    //toast.error(intl.formatMessage({ id: "IDS_SERVICEERROR" }));
                }
            })
    }
}


export function getTestResultCorrection(inputParam) {
    return function (dispatch) {
        let transactiontestcode= inputParam.APSelectedTest && inputParam.APSelectedTest.filter(i => i.ntransactionstatus===25).map(item => item.ntransactiontestcode).join(",");
        let inputData = {
            userinfo: inputParam.userInfo,
            ntransactiontestcode:transactiontestcode
        }
        if (inputData.ntransactiontestcode && inputData.ntransactiontestcode.length > 0) {
            dispatch(initRequest(true));
            rsapi().post("approval/getTestResultCorrection", inputData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    let masterData = {
                        ...inputParam.masterData,
                        ...response.data
                                }
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            openChildModal: true,
                            operation: "",
                            screenName: "IDS_RESULTCORRECTION"
                            // ncontrolCode:inputParam.ncontrolCode,
                        }
                    })
                })
                .catch(error => {
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    multilingualMsg: "IDS_SELECTCOMPLETETEST",
                }
            });
        }
    }
}


export function fetchParameterDetails(editParam) {
    return function (dispatch) {
        let additionalInfo = [];

        let inputParamData = {
            ntransactionresultcode: editParam.primaryKeyValue,
            userinfo: editParam.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("approval/getReleaseResults", inputParamData)
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
                            if (!predefDefaultFlag) {
                                predefDefaultFlag = true;
                                response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] = constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                                    undefined, undefined).get("OptionList");
                            }
                        });
                        if( parameterResults[index]["nparametertypecode"] ==1) {
                            parameterResults[index]["resultaccuracycode"] ={
                                "value": parameterResults[index]["nresultaccuracycode"],
                                "label": parameterResults[index]["sresultaccuracyname"],
                            };

                            parameterResults[index]["unitcode"] ={
                                "value": parameterResults[index]["nunitcode"],
                                "label": parameterResults[index]["sunitname"],
                            };
                        }
                    param['editable'] = false;
                    parameterResults[index]={...parameterResults[index],...jsondata}
                    });

                    const ResultAccuracyList = constructOptionList(response.data["ResultAccuracy"] || [], "nresultaccuracycode","sresultaccuracyname", undefined, undefined, false);   
                    const ResultAccuracy = ResultAccuracyList.get("OptionList");

                    const UnitList = constructOptionList(response.data["Unit"] || [], "nunitcode","sunitname", undefined, undefined, false);   
                    const Unit = UnitList.get("OptionList");
                    let formFields=[];
                    if(response.data.FormFields && response.data.FormFields.length>0){
                    let formFieldJSON=JSON.parse(response.data.FormFields[0].jsondata['value'])
                    Object.entries(formFieldJSON).map(([key, value])=>(
                        formFields.push(value)
                    ))
                }
                     //parameterResults[0]= {...parameterResults,nunitcode };
      
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        screenName: "IDS_RESULTCORRECTION",
                        masterData: {
                            ...editParam.masterData,
                            ...response.data,
                            paremterResultcode,//,
                            selectedResultGrade,
                            ResultAccuracy,
                            Unit,formFields

                        },
                        selectedRecord: {
                            additionalInfo: additionalInfo.length > 0 ? additionalInfo : [],
                            selectedResultGrade: selectedResultGrade,
                            ReleaseParameter: parameterResults//response.data.ReleaseParameter

                        },
                        parameterResults: response.data.ReleaseParameter,
                        isParameterInitialRender: true,
                        loading: false,
                        openModal: true,
                        modalShow: true,
                        //operation: "update",
                        modalTitle: intl.formatMessage({ id: "IDS_CHANGERESULT" }),
                        selectedId: editParam.primaryKeyValue,
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
    //Ate234 Janakumar ALPD-5123 Test Approval -> To get previously saved filter details when click the filter name
export function getTestApprovalFilterDetails(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getTestApprovalFilterDetails", { ...inputParam.inputData })
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