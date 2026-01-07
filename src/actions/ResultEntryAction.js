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
import {
    intl
} from '../components/App';
import Axios from 'axios';
import {
    numericGrade
} from '../pages/ResultEntryBySample/ResultEntryValidation';
import {
    constructOptionList,
    fillRecordBasedOnCheckBoxSelection,
    filterRecordBasedOnTwoArrays,
    getRecordBasedOnPrimaryKeyName,
    getSameRecordFromTwoArrays,
    replaceUpdatedObject,
    sortData,
    updatedObjectWithNewElement, rearrangeDateFormat, filterRecordBasedOnPrimaryKeyName, reArrangeArrays, compareArrays,CF_encryptionData,sortDataByParent
} from '../components/CommonScript';
import {
    checkBoxOperation,
    transactionStatus
} from '../components/Enumeration';
import { crudMaster, postCRUDOrganiseTransSearch } from './ServiceAction'

export function getsubSampleREDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
            nflag: inputData.nflag || 2,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntranscode: String(inputData.ntransactionstatus),
            ntransactiontestcode: 0,
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            napprovalversioncode: inputData.napprovalversioncode,
            fromdate: inputData.fromdate,
            todate: inputData.todate,
            activeTestKey: inputData.activeTestKey,
            activeSampleKey: inputData.activeSampleKey,
            //nneedsubsample: inputData.masterData.nneedsubsample,
            nneedsubsample: inputData.masterData.realRegSubTypeValue.nneedsubsample,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: inputData.nneedtemplatebasedflow,
            nworlistcode: inputData.nworlistcode,
            nbatchmastercode:inputData.nbatchmastercode,
            nneedReceivedInLab:inputData.nneedReceivedInLab
         }
        let activeName = "";
        let dataStateName = "";
        // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
        //     documentDataState, testCommentDataState } = inputData
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("resultentrybysample/getResultEntryDetails", { ...inputParamData, checkBoxOperation: inputData.checkBoxOperation })
                .then(response => {
                    // if (response.data.DynamicGetSamples) {
                    //     sortData(response.data.DynamicGetSamples, "", "");
                    // }
                    // if (response.data.DynamicGetTests) {
                    //     sortData(response.data.DynamicGetTests, "descending", "npreregno");
                    // }
                    sortData(response.data);
                //ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
                let check=false;
                        if(inputData.checkBoxOperation===checkBoxOperation.SINGLESELECT){
                            if(response.data['RE_TEST']===undefined)
                            check=true;
                        }
                        if(inputData.checkBoxOperation===checkBoxOperation.MULTISELECT){
                                if(response.data['RE_TEST']===undefined&&inputData.masterData.RESelectedTest.length===0)
                                    check=true;
                        }
                   if( check){
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
                    response.data['RE_SUBSAMPLE']= sortDataByParent(response.data['RE_SUBSAMPLE'],inputData.sample, "npreregno");
                    // let responseData = { ...response.data, RESelectedSubSample: inputData.RESelectedSubSample }
                    // responseData = sortData(responseData)
                    let oldSelectedTest = inputData.masterData.RESelectedTest
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);

                    //let RESelectedSubSample = inputData.checkBoxOperation === 3 || inputData.checkBoxOperation === 5 || inputData.checkBoxOperation === 7 ? response.data.RESelectedSubSample : inputData.masterData.RESelectedSubSample
                    let RESelectedSubSample = inputData.checkBoxOperation === checkBoxOperation.SINGLESELECT || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL ? response.data.RESelectedSubSample : inputData.masterData.RESelectedSubSample
                    RESelectedSubSample = inputData.masterData.realRegSubTypeValue.nneedsubsample ? RESelectedSubSample : inputData.masterData.RE_SUBSAMPLE;
                    //for with sub sample
                 /*   let check =true;
                    if(inputData.checkBoxOperation===checkBoxOperation.MULTISELECT){
                        if(inputData.masterData.realRegSubTypeValue.nneedsubsample){
                        if(!(RESelectedSubSample[0].ntransactionsamplecode===(inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactionsamplecode : -1)))
                            check =false;
                        }
                            else{
                                  check=response.data['RE_TEST']!==undefined;
                            }
                        }
                                        else if(inputData.checkBoxOperation===checkBoxOperation.SINGLESELECT){
                                          check=response.data['RE_TEST']!==undefined;
                                        }

            if( !check){
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
                   */
                    let masterData = {
                        ...inputData.masterData,
                        // ...response.data,
                        // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                        RE_TEST:response.data.RE_TEST || inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST : [],
                        RESelectedTest: response.data.RESelectedTest || inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                        RESelectedSample: inputData.RESelectedSample,
                        RESelectedSubSample
                    }
                    // if (inputData.searchSampleRef !== undefined && inputData.searchSampleRef.current !== null) {
                    //     inputData.searchSampleRef.current.value = "";
                    //     masterData['searchedSample'] = undefined
                    // }
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
                        testtake
                        , subSampleSkip, subSampleTake
                    } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        // bool = true
                    // }
                    subSampleSkip = 0;
                    // bool = true
                    // if (bool) {
                        skipInfo = {
                            testskip,
                            testtake
                            , subSampleSkip, subSampleTake
                        }
                    // }
                    let TestParameters = [];
                    let ResultUsedInstrument = [];
                    let ResultUsedMaterial = [];
                    let ResultUsedTasks = [];
                    let RegistrationTestAttachment = [];
                    let ResultChangeHistory = [];
                    let RegistrationTestComment = [];
                    let RegistrationComment = [];
                    // let RegistrationSampleAttachment = [];

                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {    
                        //added by sudharshanan for test select issue while sample click
                        let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
                        
                        /*oldSelectedTest.map((test, index) => {
                            if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                oldSelectedTest.splice(index, 1)
                            }
                            return null;
                        })*/

                            //ALPD-5970--Added by Vignesh R(06-06-2025)--Latest test and sub sample data were not loaded.
                        //ALPD-5970-->start
                             oldSelectedTest = oldSelectedTest.filter(item =>
                                wholeTestList.includes(item.ntransactiontestcode)
                            );
                        //ALPD-5970-->end

                        let keepOld = false;
                        let ntransactiontestcode;
                        let npreregno;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                           //ALPD-5970--Added by Vignesh R(06-06-2025)--Latest test and sub sample data were not loaded.
                            //ALPD-5970-->start
                            masterData = {
                                ...masterData,
                                RESelectedTest: oldSelectedTest
                            }
                            //ALPD-5970-->end
                        } else {
                            ntransactiontestcode = masterData.RESelectedTest[0].ntransactiontestcode;
                            npreregno = masterData.RESelectedSample[0].npreregno;
                        }
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_MATERIAL":
                                ResultUsedMaterial = keepOld ? inputData.masterData.ResultUsedMaterial : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedMaterial, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedMaterial"
                                dataStateName = "materialDataState"
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
                                ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_SAMPLECOMMENTS":
                                RegistrationComment = keepOld ? inputData.masterData.RegistrationComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationComment, npreregno, "npreregno")
                                activeName = "RegistrationComment"
                                dataStateName = " sampleChangeDataState"
                                break;


                            default:
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }


                   // } else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {    
                        let list = []
                        let dbData = [];
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...response.data.TestParameters];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...response.data.ResultUsedInstrument];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_MATERIAL":
                                list = [...inputData.masterData.ResultUsedMaterial, ...response.data.ResultUsedMaterial];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ResultChangeHistory || []
                                list = [...inputData.masterData.ResultChangeHistory, ...dbData];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_SAMPLECOMMENTS":
                                dbData = response.data.RegistrationComment || []
                                list = [...inputData.masterData.RegistrationComment, ...dbData];
                                RegistrationComment = getRecordBasedOnPrimaryKeyName(list, inputData.RESelectedSample.length > 0 ? inputData.RESelectedSample[0].npreregno : "", "npreregno")
                                break;
                            default:
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...dbData];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                    }
                    //else if (inputData.checkBoxOperation === 7) {
                    else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {    

                        //getSameRecordFromTwoArrays( inputData.masterData.RE_SAMPLE, responseData.RE_SUBSAMPLE, "ntransactionsamplecode");

                        let list = []
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument ? sortData(response.data.ResultUsedInstrument, 'descending', 'nresultusedinstrumentcode') : [];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_MATERIAL":
                                list = response.data.ResultUsedMaterial ? sortData(response.data.ResultUsedMaterial, 'descending', 'nresultusedmaterialcode') : [];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedMaterial"
                                dataStateName = "materialDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks ? sortData(response.data.ResultUsedTasks, 'descending', 'nresultusedtaskcode') : [];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ResultChangeHistory ? sortData(response.data.ResultChangeHistory, 'descending', 'nresultchangehistorycode') : [];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                                break;
                            case "IDS_SAMPLECOMMENTS":

                                RegistrationComment = response.data.RegistrationComment ? [...response.data.RegistrationComment] : [];
                                activeName = "RegistrationComment"
                                dataStateName = "sampleCommentsDataState"
                                break;
                            default:
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;

                        }

                    }
                    else {
                        let list = []
                        if (!inputData.masterData.realRegSubTypeValue.nneedsubsample) {
                            let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
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
                                // masterData = {
                                //     ...masterData,
                                //     RESelectedTest: oldSelectedTest
                                // }
                            } else {
                                ntransactiontestcode = masterData.RESelectedTest[0].ntransactiontestcode
                            }
                        }
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument ? sortData(response.data.ResultUsedInstrument, 'descending', 'nresultusedinstrumentcode') : [];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_MATERIAL":
                                list = response.data.ResultUsedMaterial ? sortData(response.data.ResultUsedMaterial, 'descending', 'nresultusedmaterialcode') : [];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedMaterial"
                                dataStateName = "materialDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks ? sortData(response.data.ResultUsedTasks, 'descending', 'nresultusedtaskcode') : [];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ResultChangeHistory ? sortData(response.data.ResultChangeHistory, 'descending', 'nresultchangehistorycode') : [];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_SAMPLECOMMENTS":
                                list = response.data.RegistrationComment ? sortData(response.data.RegistrationComment, 'descending', 'nregcommentcode') : [];
                                RegistrationComment = getRecordBasedOnPrimaryKeyName(list, inputData.RESelectedSample.length > 0 ? inputData.RESelectedSample[0].npreregno : "", "npreregno")
                                activeName = "RegistrationComment"
                                dataStateName = "sampleChangeDataState"
                                break;
                            
                            default:
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }

                    masterData = {
                        ...masterData,
                        // wholeApprovalParameter,
                        TestParameters,
                        // wholeResultUsedInstrument,
                        ResultUsedInstrument,
                        ResultUsedMaterial,
                        // wholeResultUsedTasks,
                        ResultUsedTasks,
                        // wholeRegistrationTestAttachment,
                        RegistrationTestAttachment,
                        // wholeResultChangeHistory,
                        ResultChangeHistory,
                        // wholeRegistrationTestComments,
                        RegistrationTestComment,

                        RegistrationComment,
                        // RegistrationSampleAttachment
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
                    // Start of ALPD-4132 Additional Filter info to be Dispatched on Save - ATE-241
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
                            openModal: inputData.openModal,
                            searchSampleRef: inputData.searchSampleRef,
                            searchSubSampleRef: inputData.searchSubSampleRef,
                            searchTestRef: inputData.searchTestRef,
                            testskip: inputData.testskip,
                            subsampleskip: inputData.subsampleskip,
                            skip: inputData.skip,
                        };
                    }
                    //  End of ALPD-4132 - ATE-241
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false,
                            skip: undefined,
                            take: undefined,
                            subSampleSkip: undefined,
                            subSampleTake: undefined,
                            ...skipInfo,
                            activeTabIndex: inputData.activeTabIndex,
                            //  ALPD-4132 Addition Filter Info to be dispatched on save - ATE-241
                            ...multifilterInfo,
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
            let oldSelectedTest = inputData.masterData.RESelectedTest
            //let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
            //let isGrandChildGetRequired = false;
            let oldSelectedSubSample = inputData.masterData.RESelectedSubSample
            let { subsampletake, subsampleskip } = inputData;
            let skipInfo = {};
            let TestSelected = [];
            let subSampleSelected = [];
            if (inputData["statusNone"]) {
                TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
            else {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }

            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.RESelectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode.toString() : "";
                let RESelectedSample = inputData.RESelectedSample;
                let RESelectedTest = inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [];
                let RESelectedSubSample = inputData.masterData.RE_SUBSAMPLE


                if (inputData.masterData.nneedsubsample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.RE_SUBSAMPLE, "ntransactionsamplecode");
                    RESelectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.RE_SUBSAMPLE[0]];
                    if (inputData.masterData.RE_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }
                }
                let ntransactionsamplecode = RESelectedSubSample.map(subsample => subsample.ntransactionsamplecode).join(',');
                let masterData = { ...inputData.masterData, RESelectedSample, RESelectedSubSample, RESelectedTest }
                inputData = {
                    ...inputData,
                    ntransactiontestcode,
                    ntransactionsamplecode,
                    RESelectedSample,
                    RESelectedTest,
                    RESelectedSubSample,
                    //checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestKey: inputData.activeTestKey, masterData
                }

                if (RESelectedTest.length > 0) {
                    inputData = {
                        ...inputData,
                        childTabsKey: ["TestParameters", "ResultUsedInstrument", "ResultUsedMaterial", "ResultUsedTasks", "RegistrationTestAttachment",
                            "ResultChangeHistory", "RegistrationTestComment", "ResultChangeHistory"
                        ]
                    }
                    dispatch(getTestChildTabREDetail(inputData, true));
                } else {
                    inputData = {
                        ...inputData, masterData,
                        childTabsKey: ["RE_TEST"]
                    }
                    dispatch(getTestREDetail(inputData, true));
                }
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                    // RESelectedSample: inputData.RESelectedSample,
                    // RESelectedSubSample: inputData.masterData.nneedsubsample && inputData.masterData.RE_SUBSAMPLE.length > 0 ? inputData.masterData.RESelectedSubSample : inputData.masterData.RE_SUBSAMPLE
                    RESelectedTest: TestSelected ? TestSelected : inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                    RESelectedSample: inputData.RESelectedSample,
                    RESelectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.RE_SUBSAMPLE.length > 0 ? [inputData.masterData.RE_SUBSAMPLE[0]] : []

                }
                let subsamplecheck = true;
                if (inputData.masterData.nneedsubsample) {
                    let SubSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
                    if (SubSampleSelected.length > 0) {
                        let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.RE_SUBSAMPLE, "ntransactionsamplecode");
                        if (filterSelectedSubSample.length === 0) {
                            let wholeSubSample = masterData.RE_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample.forEach((test, index) => {
                                if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                                    oldSelectedSubSample.splice(index, 1)
                                }
                                return null;
                            })
                            if (oldSelectedSubSample.length === 0 && wholeSubSample.length > 0
                                && masterData.selectedTest.length === 0) {
                                const selectedSubSample1 = [inputData.masterData.RE_SUBSAMPLE[0]];
                                masterData = {
                                    ...masterData,
                                    RESelectedSubSample: selectedSubSample1,
                                    selectedTest: []
                                }
                                inputData = { ...inputData, ...masterData }
                                inputData["npreregno"] = selectedSubSample1.map(x => x.npreregno).join(",")
                                inputData["ntransactionsamplecode"] = selectedSubSample1.map(x => x.ntransactionsamplecode).join(",")
                               // inputData["checkBoxOperation"] = 3
                                inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                                inputData["childTabsKey"] = ["RE_TEST"]
                                subsamplecheck = false;
                                dispatch(getTestREDetail(inputData, true));

                            }
                        } else {
                            oldSelectedSubSample = filterSelectedSubSample
                        }

                    } else {
                        let wholeSubSample = masterData.RE_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                        oldSelectedSubSample.forEach((test, index) => {
                            if (!wholeSubSample.includes(test.ntransactionsamplecode)) {
                                oldSelectedSubSample.splice(index, 1)
                            }
                            return null;
                        })
                    }

                    if (subsamplecheck) {
                        masterData = {
                            ...masterData,
                            RESelectedSubSample: oldSelectedSubSample
                        }
                    }
                    if (inputData.masterData.RE_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampleskip, subsampletake }
                    }
                }
                let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
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
                    masterData = {
                        ...masterData,
                        RESelectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = inputData.masterData.RE_TEST[0].ntransactiontestcode
                    // ntransactiontestcode = masterData.RE_TEST[0].ntransactiontestcode
                }
                //const TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters,
                //ntransactiontestcode, "ntransactiontestcode");
                const TestParameters = keepOld ? inputData["statusNone"] ? getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, inputData.removeElementFromArray[0].npreregno, "npreregno") : filterRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, inputData.removeElementFromArray[0].npreregno, "npreregno") : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")

                const ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedMaterial = keepOld ? inputData.masterData.ResultUsedMaterial : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedMaterial || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory || [],
                    ntransactiontestcode, "ntransactiontestcode");
                let { testskip, testtake } = inputData
                let bool = false;
                let skipInfo = {}
                if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
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
                            RESelectedSample: inputData.RESelectedSample,
                            // selectedPreregno: inputData.npreregno,
                            // RESelectedTest: inputData.masterData.searchedTest && inputData.masterData.searchedTest.length > 0 ? [inputData.masterData.
                            //     searchedTest[0]
                            // ] : inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.
                            //     RE_TEST[0]
                            // ] : [],
                            // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                            TestParameters,
                            ResultUsedInstrument,
                            ResultUsedMaterial,
                            ResultUsedTasks,
                            RegistrationTestAttachment,
                            RegistrationTestComment,
                            ResultChangeHistory,
                            // RESelectedSubSample: inputData.masterData.RE_SUBSAMPLE
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestKey: inputData.activeTestKey,
                        ...skipInfo,
                    }
                })
            }
        }
    }
}

export function getTestREDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let activeName = "";
        let dataStateName = "";
        let inputParamData = {
            nflag: 3,
            ntype: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
            ntransactiontestcode: 0,
            ntranscode: inputData.ntransactionstatus.toString(),
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            userinfo: inputData.userinfo,
            ntestcode: inputData.ntestcode,
            activeTestKey: inputData.activeTestKey,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation,
            nneedsubsample: inputData.nneedsubsample,
            nworlistcode: inputData.nworlistcode,
            nbatchmastercode:inputData.nbatchmastercode,
            nneedReceivedInLab:inputData.nneedReceivedInLab,
            napprovalversioncode: inputData.napprovalversioncode,
        }
        const subSample = inputData.nneedsubsample;
        // dispatch(initRequest(true));
        // rsapi().post("resultentrybysample/getResultEntrySubSampleDetails", inputParamData)
        if (isServiceRequired) {
            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/getResultEntrySubSampleDetails", inputParamData)
                .then(response => {
                    // let responseData = {
                    //     ...response.data,
                    //     RESelectedSample: inputData.RESelectedSample || inputData.masterData.RESelectedSample,
                    //     RESelectedSubSample: inputData.RESelectedSubSample || inputData.masterData.RESelectedSubSample,
                    //     // RESelectedTest: inputData.masterData.RESelectedTest
                    // }
                    let responseData = { ...response.data }
                    responseData = sortData(responseData, 'descending', 'npreregno')
                    let oldSelectedTest = inputData.masterData.RESelectedTest
                    let oldSelectedSubSample = inputData.masterData.RESelectedSubSample || []
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        // ...response.data,
                       // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                       RE_TEST:inputData.masterData && inputData.masterData.RE_TEST || response.data && response.data.RE_TEST,
                       RESelectedTest: response.data.RESelectedTest || inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                        RESelectedSample: inputData.masterData.RESelectedSample,
                        RESelectedSubSample: inputData.RESelectedSubSample || inputData.masterData.RESelectedSubSample,
                    }
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTest'] = undefined
                    }
                    let {
                        testskip,
                        testtake
                        , subSampleSkip, subSampleTake
                    } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        // bool = true
                    // }
                    // if (inputData.masterData.RE_SUBSAMPLE.length <= inputData.subSampleSkip) {
                        subSampleSkip = 0;
                        // bool = true
                    // }
                    // if (bool) {
                        skipInfo = {
                            testskip,
                            testtake
                            , subSampleSkip, subSampleTake
                        }
                    // }
                    let TestParameters = [];
                    let ResultUsedInstrument = [];
                    let ResultUsedMaterial = [];
                    let ResultUsedTasks = [];
                    let RegistrationTestAttachment = [];
                    let ResultChangeHistory = [];
                    let RegistrationTestComment = [];
                    let RegistrationSampleComment = [];
                    let RegistrationSampleAttachment = [];

                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {    
                        //added by sudharshanan for test select issue while sample click
                        let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
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
                            masterData = {
                                ...masterData,
                                RESelectedTest: oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = masterData.RESelectedTest[0].ntransactiontestcode
                        }
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_MATERIAL":
                                ResultUsedMaterial = keepOld ? inputData.masterData.ResultUsedMaterial : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedMaterial, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultUsedMaterial"
                                dataStateName = "materialDataState"
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
                                ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            // case "IDS_SAMPLECOMMENTS":
                            //         RegistrationTestComment = keepOld ? inputData.masterData.RegistrationComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationComment, npreregno, "npreregno")
                            //         activeName = "RegistrationComment"
                            //         dataStateName = "sampleChangeDataState"
                            //         break;
                            default:
                                TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }

                    //} else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {    
                        let list = []
                        let dbData = [];
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...response.data.TestParameters];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...response.data.ResultUsedInstrument];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_MATERIAL":
                                list = [...inputData.masterData.ResultUsedMaterial, ...response.data.ResultUsedMaterial];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ResultChangeHistory || []
                                list = [...inputData.masterData.ResultChangeHistory, ...dbData];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            default:
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...dbData];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                   // } else if (inputData.checkBoxOperation === 7) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {    
                        let list = []
                        let dbData = [];
                        let testList = reArrangeArrays(inputData.masterData.RE_SUBSAMPLE, responseData.RE_TEST, "ntransactionsamplecode");
                        masterData = {
                            ...masterData,
                            RESelectedTest: [testList[0]],
                            RE_TEST: testList,
                            // ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                        }

                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                dbData = response.data.TestParameters || []
                                list = [...response.data.TestParameters];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, testList.length > 0 ? testList[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_INSTRUMENT":
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.ResultUsedInstrument, ...response.data.ResultUsedInstrument];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_MATERIAL":
                                list = [...inputData.masterData.ResultUsedMaterial, ...response.data.ResultUsedMaterial];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TASK":
                                dbData = response.data.ResultUsedTasks || []
                                list = [...inputData.masterData.ResultUsedTasks, ...dbData];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                dbData = response.data.ResultChangeHistory || []
                                list = [...inputData.masterData.ResultChangeHistory, ...dbData];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            // case "IDS_TESTCOMMENTS":
                            //     dbData = response.data.RegistrationTestComment || []
                            //     list = [...inputData.masterData.RegistrationTestComment, ...dbData];
                            //     RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                            //     break;
                            default:
                                dbData = response.data.TestParameters || []
                                list = [...inputData.masterData.TestParameters, ...dbData];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }

                    } else {
                        let list = []
                        switch (inputData.activeTestKey) {
                            case "IDS_RESULTS":
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                            case "IDS_INSTRUMENT":
                                list = response.data.ResultUsedInstrument ? sortData(response.data.ResultUsedInstrument, 'descending', 'nresultusedinstrumentcode') : [];
                                ResultUsedInstrument = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedInstrument"
                                dataStateName = "instrumentDataState"
                                break;
                            case "IDS_MATERIAL":
                                list = response.data.ResultUsedMaterial ? sortData(response.data.ResultUsedMaterial, 'descending', 'nresultusedmaterialcode') : [];
                                ResultUsedMaterial = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedMaterial"
                                dataStateName = "materialDataState"
                                break;
                            case "IDS_TASK":
                                list = response.data.ResultUsedTasks ? sortData(response.data.ResultUsedTasks, 'descending', 'nresultusedtaskcode') : [];
                                list.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
                                ResultUsedTasks = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultUsedTasks"
                                dataStateName = "taskDataState"
                                break;
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment ? sortData(response.data.RegistrationTestAttachment, 'descending', 'ntestattachmentcode') : [];
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            case "IDS_RESULTCHANGEHISTORY":
                                list = response.data.ResultChangeHistory ? sortData(response.data.ResultChangeHistory, 'descending', 'nresultchangehistorycode') : [];
                                ResultChangeHistory = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "ResultChangeHistory"
                                dataStateName = "resultChangeDataState"
                                break;
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment ? sortData(response.data.RegistrationTestComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            case "IDS_SUBSAMPLEATTACHMENTS":
                                list = response.data.RegistrationSampleComment ? sortData(response.data.RegistrationSampleComment, 'descending', 'ntestcommentcode') : [];
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_SUBSAMPLE.length > 0 ? inputData.masterData.RE_SUBSAMPLE[0].ntransactionsamplecode : "", "ntransactionsamplecode")
                                activeName = "RegistrationSampleComment"
                                dataStateName = "testCommentDataState"
                                break;
                            default:
                                list = response.data.TestParameters ? sortData(response.data.TestParameters, 'ascending', 'ntransactionresultcode') : [];
                                TestParameters = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "TestParameters"
                                dataStateName = "resultDataState"
                                break;
                        }
                    }
                    if (subSample) {
                        let wholeSubsampleList = masterData.RE_SUBSAMPLE.map(b => b.ntransactionsamplecode)
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
                        // wholeApprovalParameter,
                        TestParameters,
                        // wholeResultUsedInstrument,
                        ResultUsedInstrument,
                        ResultUsedMaterial,
                        // wholeResultUsedTasks,
                        ResultUsedTasks,
                        // wholeRegistrationTestAttachment,
                        RegistrationTestAttachment,
                        // wholeResultChangeHistory,
                        ResultChangeHistory,
                        // wholeRegistrationTestComments,
                        RegistrationTestComment,
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
                            activeTestKey: inputData.activeTestKey,
                            activeTestTab: inputData.activeTestKey,
                            screenName: inputData.activeTestKey,
                            ...skipInfo,
                            subSampleSkip: undefined,
                            subSampleTake: undefined
                        }
                    })
                })
                .catch(error => {
                    // console.log("error:", error);
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
            //fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);

            let oldSelectedTest = inputData.masterData.RESelectedTest
            //let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
            // let isGrandChildGetRequired = false;
            // if (TestSelected.length > 0) {
            //     isGrandChildGetRequired = true;
            // } else {
            //     isGrandChildGetRequired = false;
            // }

            let TestSelected =
                inputData["statusNone"] ?
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode") :
                    filterRecordBasedOnPrimaryKeyName(inputData.masterData.RESelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.RESelectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.RE_TEST.length > 0 ? inputData.masterData.RE_TEST[0].ntransactiontestcode.toString() : "";
                let RESelectedSubSample = inputData.RESelectedSubSample;
                let RESelectedTest = inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [];
                // let RESelectedSubSample = inputData.masterData.RE_SUBSAMPLE

                inputData = {
                    ...inputData,
                    childTabsKey: ["TestParameters", "ResultUsedInstrument", "ResultUsedMaterial", "ResultUsedTasks", "RegistrationTestAttachment",
                        "ResultChangeHistory", "RegistrationTestComment", "ResultChangeHistory"
                    ],
                    ntransactiontestcode,
                    RESelectedSample: inputData.masterData.RESelectedSample,
                    RESelectedTest,
                    RESelectedSubSample,
                    //checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestKey: inputData.activeTestKey
                }
                dispatch(getTestChildTabREDetail(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                    RESelectedSubSample: inputData.RESelectedSubSample
                }
                let wholeTestList = masterData.RE_TEST.map(b => b.ntransactiontestcode)
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
                    masterData = {
                        ...masterData,
                        RESelectedTest: oldSelectedTest
                    }
                } else {
                    ntransactiontestcode = masterData.RE_TEST&& masterData.RE_TEST[0].ntransactiontestcode
                }
                // const TestParameters = keepOld ? inputData.masterData.TestParameters : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters,
                //     ntransactiontestcode, "ntransactiontestcode");
                const TestParameters = keepOld ?
                    inputData["statusNone"] ?
                        getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, inputData.removeElementFromArray[0].ntransactionsamplecode, 'ntransactionsamplecode') :
                        filterRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, inputData.removeElementFromArray[0].ntransactionsamplecode, 'ntransactionsamplecode') : getRecordBasedOnPrimaryKeyName(inputData.masterData.TestParameters, ntransactiontestcode, "ntransactiontestcode")

                const ResultUsedInstrument = keepOld ? inputData.masterData.ResultUsedInstrument : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedInstrument || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedMaterial = keepOld ? inputData.masterData.ResultUsedMaterial : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedMaterial || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultUsedTasks = keepOld ? inputData.masterData.ResultUsedTasks : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultUsedTasks || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment || [],
                    ntransactiontestcode, "ntransactiontestcode");
                const ResultChangeHistory = keepOld ? inputData.masterData.ResultChangeHistory : getRecordBasedOnPrimaryKeyName(inputData.masterData.ResultChangeHistory || [],
                    ntransactiontestcode, "ntransactiontestcode");
                let { testskip, testtake } = inputData
                let bool = false;
                let skipInfo = {}
                if (inputData.masterData.RE_TEST.length <= inputData.testskip) {
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
                            RESelectedSubSample: inputData.RESelectedSubSample,
                            // selectedPreregno: inputData.npreregno,
                            // RESelectedTest: inputData.masterData.searchedTest && inputData.masterData.searchedTest.length > 0 ? [inputData.masterData.
                            //     searchedTest[0]
                            // ] : inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.
                            //     RE_TEST[0]
                            // ] : [],
                            // RESelectedTest: inputData.masterData.RE_TEST.length > 0 ? [inputData.masterData.RE_TEST[0]] : [],
                            TestParameters,
                            ResultUsedInstrument,
                            ResultUsedMaterial,
                            ResultUsedTasks,
                            RegistrationTestAttachment,
                            RegistrationTestComment,
                            ResultChangeHistory,
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestKey: inputData.activeTestKey,
                        activeTestTab: inputData.activeTestKey,
                        ...skipInfo,
                    }
                })
            }
        }
    }
}




export function getSampleChildTabREDetail(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.ntransactiontestcode,
            npreregno: inputData.npreregno,
            userinfo: inputData.userinfo
        }
        let url = ""
        switch (inputData.activeSampleKey) {
            case "IDS_DOCUMENTS":
                url = "attachment/getSampleAttachment"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                break;
            case "IDS_APPROVALHISTORY":
                url = "resultentrybysample/getSampleApprovalHistory"
                break;
            case "IDS_SAMPLECOMMENTS":
                url = "comments/getSampleComment"
                break;
            default:
                url = "attachment/getSampleAttachment"
                break;
        }
        dispatch(initRequest(true));
        rsapi().post(url, inputParamData)
            .then(response => {
                let responseData = {
                    ...response.data
                }
                //responseData = sortData(responseData)
                fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            RESelectedSample: inputData.RESelectedSample
                        },
                        loading: false,
                        showFilter: false,
                        activeSampleKey: inputData.activeSampleKey,
                        screenName: inputData.screenName
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

export function getTestChildTabREDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(","),
            npreregno: inputData.npreregno,
            userinfo: inputData.userinfo
        }
        let activeName = "";
        let dataStateName = "";
        // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
        //     documentDataState, testCommentDataState } = inputData
        let url = "resultentrybysample/getTestbasedParameter"
        switch (inputData.activeTestKey) {
            case "IDS_RESULTS":
                url = "resultentrybysample/getTestbasedParameter"
                activeName = "TestParameters"
                dataStateName = "resultDataState"
                break;
            case "IDS_INSTRUMENT":
                url = "resultentrybysample/getResultUsedInstrument"
                activeName = "ResultUsedInstrument"
                dataStateName = "instrumentDataState"
                break;
            case "IDS_MATERIAL":
                url = "resultentrybysample/getResultUsedMaterial";
                activeName = "ResultUsedMaterial"
                dataStateName = "materialDataState"
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
                url = "attachment/getSampleAttachment"
                activeName = ""
                dataStateName = "documentDataState"
                break;
            case "IDS_RESULTCHANGEHISTORY":
                url = "resultentrybysample/getResultChangeHistory"
                activeName = "ResultChangeHistory"
                dataStateName = "resultChangeDataState"
                break;
            case "IDS_SAMPLEATTACHMENTS":
                url = "attachment/getSampleAttachment"
                activeName = ""
                dataStateName = "resultDataState"
                break;
            default:
                url = "resultentrybysample/getTestbasedParameter"
                activeName = "TestParameters"
                dataStateName = "resultDataState"
                break;
        }
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post(url, inputParamData)
                .then(response => {
                    let responseData = {
                        ...response.data,
                        RESelectedSample: inputData.RESelectedSample || inputData.masterData.RESelectedSample,
                        RESelectedTest: inputData.RESelectedTest,
                        activeTabIndex: inputData.activeTabIndex,
                        activeTabId: inputData.activeTabId
                    }
                    let skipInfo = {};
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        ...responseData,
                        RESelectedTest: inputData.RESelectedTest
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
                            activeTestTab: inputData.activeTestKey,
                            loading: false,
                            activeTestKey: inputData.activeTestKey,
                            screenName: inputData.activeTestKey,
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
            //fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.RESelectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
            let skipInfo = {};
            let masterData = {
                ...inputData.masterData,
                RESelectedTest: inputData.RESelectedTest
            }
            if (masterData[activeName].length <= inputData[dataStateName] && inputData[dataStateName].skip) {

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
                    activeTestKey: inputData.activeTestKey,
                    screenName: inputData.screenName,
                    ...skipInfo
                }
            })
        }
    }
}

export function getRERegistrationType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getRegistrationType", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            defaultSampleType: inputData.defaultSampleType,
                            ...response.data,
                            realDesignTemplateMapping:inputData.realDesignTemplateMapping,
                            realApproveConfigVersion:inputData.realApproveConfigVersion,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realDesignTemplateMappingList:inputData.realDesignTemplateMappingList,
                            realFilterStatusList:inputData.realFilterStatusList,
                            realRegistrationSubTypeList:inputData.realRegistrationSubTypeList,
                            realRegistrationTypeList:inputData.realRegistrationTypeList,
                            realTestvaluesList:inputData.realTestvaluesList,
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

export function getRERegistrationSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getRegistrationsubType", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            //defaultFilterStatus:inputData.masterData.defaultFilterStatus,
                            defaultRegistrationType: inputData.defaultRegistrationType,
                            realDesignTemplateMapping:inputData.realDesignTemplateMapping,
                            realApproveConfigVersion:inputData.realApproveConfigVersion,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realDesignTemplateMappingList:inputData.realDesignTemplateMappingList,
                            realFilterStatusList:inputData.realFilterStatusList,
                            realRegistrationSubTypeList:inputData.realRegistrationSubTypeList,
                            realRegistrationTypeList:inputData.realRegistrationTypeList,
                            realTestvaluesList:inputData.realTestvaluesList,
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

export function getREApprovalConfigVersion(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getApprovalConfigVersion", inputData)
            .then(response => {
                let nneedsubsample = inputData.defaultRegistrationSubType && inputData.defaultRegistrationSubType.nneedsubsample;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            nneedsubsample,
                            ...response.data,
                            defaultRegistrationSubType: inputData.defaultRegistrationSubType,
                            // fromDate: inputData.fromdate,
                            //  toDate: inputData.todate
                            realDesignTemplateMapping:inputData.realDesignTemplateMapping,
                            realApproveConfigVersion:inputData.realApproveConfigVersion,
                            realApprovalConfigVersionList:inputData.realApprovalConfigVersionList,
                            realDesignTemplateMappingList:inputData.realDesignTemplateMappingList,
                            realFilterStatusList:inputData.realFilterStatusList,
                            realRegistrationTypeList:inputData.realRegistrationTypeList,
                            realTestvaluesList:inputData.realTestvaluesList,
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

export function getREFilterStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getFilterStatus", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultjobstatus: inputData.defaultjobstatus,
                            // fromDate: inputData.fromdate,
                            // toDate: inputData.todate
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


export function getREJobStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getApproveConfigVersionRegTemplateDesign", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultApprovalConfigVersion: inputData.defaultApprovalConfigVersion,
                            // fromDate: inputData.fromdate,
                            // toDate: inputData.todate
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

export function getResultEntryDetails(inputParamData) {
    let masterData = { ...inputParamData.masterData }
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultEntryDetails", { ...inputParamData.inputData, nneedsubsample: //inputParamData.masterData.nneedsubsample
        inputParamData.masterData.realRegSubTypeValue.nneedsubsample
         })
            .then(response => {
                //let masterData = { ...inputParamData.masterData }
                if (inputParamData.refs.searchSampleRef !== undefined && inputParamData.refs.searchSampleRef.current !== null) {
                    inputParamData.refs.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParamData.refs.searchSubSampleRef !== undefined && inputParamData.refs.searchSubSampleRef.current !== null) {
                    inputParamData.refs.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParamData.refs.searchTestRef !== undefined && inputParamData.refs.searchTestRef.current !== null) {
                    inputParamData.refs.searchTestRef.current.value = ""
                    // masterData['searchedTests'] = undefined
                    masterData['searchedTest'] = undefined
                }
                //sortData(response.data)
                sortData(response.data, 'ascending', 'ntransactionresultcode')
                if(response.data.rtn == "IDS_USERNOTINRESULTENTRYFLOW")
                {
                toast.warning(intl.formatMessage({ id: "IDS_USERNOTINRESULTENTRYFLOW" }));
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            realFromDate: response.data["fromDate"],
                            realToDate: response.data["toDate"]
                        },
                        loading: false,
                        showTest: inputParamData.inputData.showTest,
                        showSample: inputParamData.inputData.showSample,
                        activeTestKey: inputParamData.inputData.activeTestKey,
                        skip: 0,
                        take: inputParamData.inputData.take,
                        testskip: 0,
                        testtake: inputParamData.inputData.testtake,
                        resultDataState: { ...inputParamData.resultDataState, sort: undefined, filter: undefined },
                        instrumentDataState: { ...inputParamData.instrumentDataState, sort: undefined, filter: undefined },
                        materialDataState: { ...inputParamData.materialDataState, sort: undefined, filter: undefined },
                        taskDataState: { ...inputParamData.taskDataState, sort: undefined, filter: undefined },
                        documentDataState: { ...inputParamData.documentDataState, sort: undefined, filter: undefined },
                        resultChangeDataState: { ...inputParamData.resultChangeDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParamData.testCommentDataState, sort: undefined, filter: undefined },
                        historyDataState: { ...inputParamData.historyDataState, sort: undefined, filter: undefined },
                        samplePrintHistoryDataState: { ...inputParamData.samplePrintHistoryDataState, sort: undefined, filter: undefined },
                        sampleHistoryDataState: { ...inputParamData.sampleHistoryDataState, sort: undefined, filter: undefined },
                        filterSubmitValueEmpty: false, showFilter: false    // ALPDJ21-16  Added filterSubmitValueEmpty by Vishakh (10-07-2025)
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
                } else if(error.response.status === 409) {
                    toast.warn(intl.formatMessage({id:error.response.data.rtn}));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            masterData: {
                                ...masterData,
                                ...error.response.data,
                                realFromDate: error.response.data["fromDate"],
                                realToDate: error.response.data["toDate"]
                            }
                        }
                    })
                }
                else{
                    toast.warn(error.response.data);
                }
            })
    }
}

export function resultGetModule(inputData,nneedReceivedInLab, userInfo, ncontrolcode, testskip, testtake, screen) {
    return function (dispatch) {
        let additionalInfo=[];
        let TestList = inputData.searchedTest ? [...inputData.searchedTest] : [...inputData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, inputData.RESelectedTest, "ntransactiontestcode");
        if (acceptTestList && acceptTestList.length > 0) {
            if (Object.values(inputData).length > 0 && inputData.RESelectedTest.length > 0) {
                let inputParamData = {
                    ntransactiontestcode: acceptTestList ? acceptTestList.map(test => test.ntransactiontestcode).join(",") : "",
                    userinfo: userInfo,
                    ncontrolcode:ncontrolcode,
                    nneedReceivedInLab: nneedReceivedInLab
                }
                inputParamData['nregtypecode']= inputData.realRegTypeValue.nregtypecode;
                inputParamData['nregsubtypecode']= inputData.realRegSubTypeValue.nregsubtypecode;
                dispatch(initRequest(true));
                rsapi().post("resultentrybysample/getResultEntryResults", inputParamData)
                    .then(response => {
                        let selectedRecord = {};
                        let selectedResultGrade = [];
                        let paremterResultcode = [];

                        //Transaction test list based on test sorter need enable this "Don't remove this code"
                        //const parameterResults = sortDataByParent(response.data.ResultParameter,TestList,"ntransactiontestcode");
                        
                        // If we need grouping: test group based on test sorter and test parameter Enable this "Don't remove this code"
                        const parameterResults = response.data.ResultParameter;

                        let predefDefaultFlag = false;
                        let formFields=[];
                        if(response.data.FormFields && response.data.FormFields.length>0){
                        let formFieldJSON=JSON.parse(response.data.FormFields[0].jsondata['value'])
                        Object.entries(formFieldJSON).map(([key, value])=>(
                            formFields.push(value)
                        ))
                    }
                        parameterResults.map((param, index) => {
                            selectedResultGrade[index] = { ngradecode: param.ngradecode };
                            paremterResultcode[index] = param.ntransactionresultcode;
                            let jsondata=JSON.parse(param.jsondata['value'])
                            //let jsondata=param.jsondata;
                            if(jsondata.hasOwnProperty('additionalInfo')){
                                additionalInfo[param.ntransactionresultcode]=jsondata['additionalInfo'] 
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
                            //return null;
                            // response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] =  constructOptionList(response.data.PredefinedValues[parameterResults[index].ntransactionresultcode] || [], 'spredefinedname', 'spredefinedname', undefined,
                            // undefined, undefined).get("OptionList");
                            // ALPD-4302--start
                            // Added the Require Header fields in result Entire Slide out in result entry screen.
                            // added for jsondata --end
                            parameterResults[index]={...parameterResults[index],...jsondata}
                        });

                        const ResultAccuracyList = constructOptionList(response.data["ResultAccuracy"] || [], "nresultaccuracycode","sresultaccuracyname", undefined, undefined, false);   
                        const ResultAccuracy = ResultAccuracyList.get("OptionList");

                        const UnitList = constructOptionList(response.data["Unit"] || [], "nunitcode","sunitname", undefined, undefined, false);   
                        const Unit = UnitList.get("OptionList");                                  


                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData,
                                    //...sortData(response.data,"desc","ntransactiontestcode"),
                                    ...response.data,
                                    paremterResultcode//,
                                    //selectedResultGrade ,

                                },
                                selectedRecord: {
                                    additionalInfo:additionalInfo.length>0?additionalInfo:[],
                                    selectedResultGrade: selectedResultGrade,
                                    // ALPD-4302
                                    // Added the Require Header fields in result Entire Slide out in result entry screen.
                                     //Transaction test list based on test sorter need enable this "Don't remove this code"
                        //ResultParameter: sortDataByParent(parameterResults ,TestList,"ntransactiontestcode")
                                    // If we need grouping: test group based on test sorter and test parameter Enable this "Don't remove this code"
                        ResultParameter: parameterResults 
                                        //response.data.ResultParameter                                   
                                },
                                 // parameterResults:response.data.ResultParameter,
                                 // ALPD-4302
                                 // Added the Require Header fields in result Entire Slide out in result entry screen.

                                //Transaction test list based on test sorter need enable this "Don't remove this code"
                        // parameterResults:sortDataByParent(parameterResults,TestList,"ntransactiontestcode"),
                                // If we need grouping: test group based on test sorter and test parameter Enable this "Don't remove this code"
                         parameterResults:parameterResults,

                                  isParameterInitialRender:true,
                                loading: false,
                                //screenName: "IDS_RESULTENTRY",
                                //ALPDJ21-118 - Suriaprahash & Subashini.L - Grid Based Result Entry -30/09/2025
                                screenName: screen === "IDS_RESULTENTRYTABLE" ? "IDS_RESULTENTRYTABLE" : "IDS_RESULTENTRY",                               
                                openModal: true,
                                operation: "update",
                                activeTestKey: "IDS_RESULTS",
                                ncontrolcode: ncontrolcode,
                                ResultAccuracy,
                                Unit,formFields
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTTESTTOENTERRESULT"
                }));
            }
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTTESTTOENTERRESULT"
            }));
        }
    }

}
//Commented by sonia on  24-07-2024 for Jira ID:ALPD-4649
/*export function completeTest(inputParam, acceptList, userInfo, completeResultId,booleanFlag,param) {
    if (acceptList !== undefined && acceptList.length > 0) {
        return function (dispatch) {
            let isSearched=false;
            let inputData = inputParam.testChildGetREParam
            let inputParamData = {
                ntype: 3,
               // nflag: 2,
               ninsertMaterialInventoryTrans:inputParam.inputData.ninsertMaterialInventoryTrans,
               nportalrequired:inputParam.inputData.nportalrequired,
                basedrulesengine:param.basedrulesengine,
                nsampletypecode: inputData.nsampletypecode,
                nregtypecode: inputData.nregtypecode,
                nregsubtypecode: inputData.nregsubtypecode,
                npreregno: inputData.npreregno,
                ntranscode: String(inputData.ntransactionstatus),
                napprovalversioncode: inputData.napprovalversioncode,
                napprovalconfigcode: inputData.napprovalconfigcode,
                ntransactionsamplecode: inputData.ntransactionsamplecode,
                userinfo: userInfo,
                fromdate: inputData.fromdate,
                todate: inputData.todate,
                ntestcode: inputData.ntestcode,
                transactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
                ntransactiontestcode: 0,
                activeTestKey: inputData.activeTestKey,
                ncontrolcode: inputParam.inputData.ncontrolcode,
                nneedsubsample: inputData.masterData.nneedsubsample,
                ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
                checkBoxOperation:checkBoxOperation.SINGLESELECT,
                nsettingcode:  inputParam.nsettingcode,
                nusercode: inputParam.nusercode,
                susername:  inputParam.susername,
                nneedReceivedInLab:inputParam.inputData.nneedReceivedInLab
            }
            let activeName = "";
            let dataStateName = "";
            // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
            //     documentDataState, testCommentDataState } = inputData
            // let url = "resultentrybysample/getTestbasedParameter"
            switch (inputData.activeTestKey) {
                case "IDS_RESULTS":
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    activeName = "ResultUsedMaterial"
                    dataStateName = "materialDataState"
                    break;
                case "IDS_TASK":
                    activeName = "ResultUsedTasks"
                    dataStateName = "taskDataState"
                    break;
                case "IDS_TESTATTACHMENTS":
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_DOCUMENTS":
                    activeName = ""
                    dataStateName = "documentDataState"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    activeName = "ResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    activeName = ""
                    dataStateName = "resultDataState"
                    break;
                default:
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
            }
            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/completeTest", inputParamData)
                .then(response => {
                    let RE_SAMPLE = [];
                    let RE_SUBSAMPLE = [];
                    let RE_TEST = [];
                    let onlySampleService=false;
                    let responseData =  sortData(response.data, 'ascending', 'ntransactionresultcode')//response.data
                    //rules engine new subsample outcome --start ---
                    let testcode= responseData["RE_TEST"].map(test => test.npreregno).join(",");
                    let sampleCode= responseData["RE_SUBSAMPLE"].map(test => test.npreregno).join(",");
                    inputData.masterData["searchedSample"] && inputData.masterData["searchedSample"].map(item=>{  
                        if(!testcode.includes(String(item.npreregno)) && !sampleCode.includes(String(item.npreregno)) ){
                            responseData["RE_TEST"]=[];
                            responseData["RE_SUBSAMPLE"]=[];
                            responseData["RESelectedSubSample"]=[];
                            responseData["RESelectedTest"]=[];
                            isSearched=true;
                        }
                    });
                    let transactiontestcode=inputData.masterData["RE_TEST"].map(test => test.ntransactiontestcode).join(",")
                    responseData["RE_TEST"]&& responseData["RE_TEST"].forEach(element => {
                            if(!transactiontestcode.includes(String(element.ntransactiontestcode))){
                                inputData.masterData["RE_TEST"].push(element);
                            }
                    });
                    let transactionsamplecode=inputData.masterData["RE_SUBSAMPLE"].map(item=>item.ntransactionsamplecode).join(",")
                    responseData["RE_SUBSAMPLE"] && responseData["RE_SUBSAMPLE"].forEach(element => {
                            if(!transactionsamplecode.includes(String(element.ntransactionsamplecode))){
                                inputData.masterData["RE_SUBSAMPLE"].push(element);
                            }
                    });
                    //end--
                    //Added
                    if(inputData.masterData["searchedTest"]&&responseData["RE_TEST"]){
                        inputData.masterData["searchedTest"]= getSameRecordFromTwoArrays(inputData.masterData["searchedTest"],responseData["RE_TEST"],"ntransactiontestcode");
                       }


                    if (responseData["RE_TEST"] && responseData["RE_TEST"].length > 0) {
                         //Added
                        if (inputData.masterData.realRegSubTypeValue.nneedsubsample//.nneedsubsample
                            )
                            RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "ntransactionsamplecode");
                        else
                            RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "npreregno");
                    } else {
                        RE_TEST = inputData.masterData["RE_TEST"];
                    }

                    RE_SUBSAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SUBSAMPLE"], RE_TEST, "ntransactionsamplecode");
                    if (RE_SUBSAMPLE.length > 0) {
                        // RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");
                        RE_SAMPLE = replaceUpdatedObject( responseData["RE_SAMPLE"],inputData.masterData["RE_SAMPLE"] , "npreregno");
                        //inputData.masterData["RE_SAMPLE"];
                         //Added
                        let selectedSampleArray= inputData.masterData["RESelectedSample"]; 
                        let subSampleArray=RE_SUBSAMPLE.map(x=>x.npreregno);
                        let selectPreregNOBefore=selectedSampleArray.map(x=>x.npreregno)
                        selectedSampleArray=selectedSampleArray.filter(item => subSampleArray.includes(item.npreregno)).map(x=>x.npreregno) 
                        let unwantedPreregno=  selectPreregNOBefore.filter(function (x) {
                            return !selectedSampleArray.some(function (y) { 
                              return x  === y 
                            })
                          }); 
                        RE_SAMPLE= RE_SAMPLE.filter(item => !unwantedPreregno.includes(item.npreregno))
                        //RE_SAMPLE= filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"],RE_SUBSAMPLE , "npreregno");
                    } else {
                        RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");

                        RE_SAMPLE = filterRecordBasedOnTwoArrays(RE_SAMPLE, RE_TEST, "npreregno");
                    }
                  //  const RESelectedSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");
                  //Added
                  const RESelectedSample = RE_SUBSAMPLE.length > 0 ? inputData.masterData["RESelectedSample"] :  RE_SAMPLE

                 

                  let boolSelectedSubSample; 
                  let searchedSubSample = undefined; 
                  let RESelectedSubSample=[];
                  let backfrontTest= getSameRecordFromTwoArrays(inputData.masterData["RE_TEST"],responseData["RE_TEST"],"ntransactiontestcode")
                   if(inputData.masterData["searchedSubSample"]){
                       searchedSubSample =inputData.masterData["searchedSubSample"]
                       boolSelectedSubSample=searchedSubSample.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 

                       let searchedSubSamplebefore=inputData.masterData["RESelectedSubSample"].map(x=>x.ntransactionsamplecode);
                       searchedSubSample= inputData.masterData["RESelectedSubSample"].filter(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                       let searchedSubSampleaftere=searchedSubSample.map(x=>x.ntransactionsamplecode);
                       let unwantedSamplecode=  searchedSubSamplebefore.filter(function (x) {
                          return !searchedSubSampleaftere.some(function (y) { 
                            return x  === y 
                          })
                        });  
                        inputData.masterData["searchedSubSample"]=inputData.masterData["searchedSubSample"].filter(item => !unwantedSamplecode.includes(item.ntransactionsamplecode)) 
                    }else{
                      boolSelectedSubSample=RE_SUBSAMPLE.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                    }
                 
                  if(inputData.masterData["searchedSubSample"]//&&inputData.masterData["searchedSubSample"].length>0
                  ){
                      RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :
                      inputData.masterData["searchedSubSample"][0]? [inputData.masterData["searchedSubSample"][0]]:[]
                  }else{
                      RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :  RE_SUBSAMPLE
                  }  
                  //  const RESelectedSubSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode");
                    let RESelectedTest1 = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedTest"], acceptList, "ntransactiontestcode");
                    let RESelectedTest2 = updatedObjectWithNewElement(RESelectedTest1, responseData.RESelectedTest)

                    let searchedSample = undefined;
                    if (inputData.masterData["searchedSample"]) {
                        RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["searchedSample"],  responseData["RE_SAMPLE"], "npreregno");

                        searchedSample = filterRecordBasedOnTwoArrays(RE_SAMPLE//inputData.masterData["searchedSample"]
                        ,
                         RE_TEST, "npreregno");
                         searchedSample=searchedSample.length>0?searchedSample:isSearched?[]:inputData.masterData["searchedSample"];
                    }

                    let masterData = {
                        ...inputData.masterData,
                        ...responseData,
                        RE_SAMPLE,
                        RE_SUBSAMPLE,
                        RESelectedSubSample,
                        searchedSample,
                        RESelectedSample,
 						RESelectedTest: RESelectedTest2,
                         RESelectedTest: response.data.hasOwnProperty('RegistrationTestAlert')
                         &&Object.keys(response.data['RegistrationTestAlert']).length !== 0
                         ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&
                         Object.keys(response.data['NewTestGroupTestAlert']).length !== 0?
                         inputData.masterData["RESelectedTest"]://RESelectedTest2
                         inputData.masterData["searchedTest"]&&
                         inputData.masterData["searchedTest"].length>0?[inputData.masterData["searchedTest"][0]]: 
                         responseData.RESelectedTest
                         ,
                         
                        //  RE_TEST:compareArrays(responseData["RE_TEST"],inputData.masterData["RE_TEST"])?
                        //  inputData.masterData["RE_TEST"]: responseData["RE_TEST"]
                        RE_TEST: responseData["RE_TEST"]
                        
                    }
                    let skipInfo = {};
                    // if (masterData.RE_SAMPLE && masterData.RE_SAMPLE.length <= inputParam.skip) { //ALPD-2230
                    if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length == 0 && masterData.RE_TEST && masterData.RE_TEST.length == 0){
                        skipInfo = {
                            ...skipInfo,
                            skip: 0,
                            take: inputParam.take
                        }
                    }
                    // }
                    if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length <= inputParam.subSampleTake){
                        skipInfo = {
                            ...skipInfo,
                            subSampleSkip: 0,
                            subSampleTake: inputParam.subSampleTake
                        }
                    }
                    if (masterData.RE_TEST && masterData.RE_TEST.length <= inputParam.testskip) {
                        skipInfo = {
                            ...skipInfo,
                            testskip: 0,
                            testtake: inputParam.testtake
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
                    let respObject = {
                        RegistrationTestAlert: response.data.hasOwnProperty('RegistrationTestAlert')//&&response.data.RegistrationTestAlert.length>0
                        ?response.data.RegistrationTestAlert:{},
                        NewTestGroupTestAlert:response.data.hasOwnProperty('NewTestGroupTestAlert')//&&response.data.NewTestGroupTestAlert.length>0
                        ?response.data.NewTestGroupTestAlert:{},
                        showAlertGrid:response.data.hasOwnProperty('RegistrationTestAlert')&&Object.keys(response.data['RegistrationTestAlert']).length !== 0
                        ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&Object.keys(response.data['NewTestGroupTestAlert']).length !== 0//&&response.data.RegistrationTestAlert.length>0||
                       // response.data.hasOwnProperty('NewTestGroupTestAlert')&&response.data.NewTestGroupTestAlert.length>0
                        ?true:false,
                        showAlertForPredefined:false,
                        additionalInfoView:false,
                        ...inputParamData.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        //selectedRecord: undefined,
                        loading: false,
                        screenName: inputData.activeTestKey,
                        ...skipInfo
                    }
                    if (searchedSample //&& RESelectedSample.length === 0 
                        && searchedSample.length > 0) {
                        const paramList = inputParam.postParamList[0];
                        const inputParameter = {
                            ...paramList.fecthInputObject.fecthInputObject,
                            fetchUrl: paramList.fetchUrl,
                            [paramList.primaryKeyField]: String(searchedSample[0][paramList.primaryKeyField]),
                            ntype: 2,
                            nflag: 2
                        };
                        respObject = {
                            ...respObject,
                            masterData: {
                                ...masterData,
                                RESelectedSample: [searchedSample[0]]
                            }
                        }
                       // dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                        dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                    } else if (!searchedSample && RESelectedSample.length === 0 && RE_SAMPLE.length > 0) {
                        const paramList = inputParam.postParamList[0];
                        const inputParameter = {
                            ...paramList.fecthInputObject.fecthInputObject,
                            fetchUrl: paramList.fetchUrl,
                            [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                            ntype: 2,
                            nflag: 2
                        };
                        respObject = {
                            ...respObject,
                            masterData: {
                                ...masterData,
                                RESelectedSample: [RE_SAMPLE[0]]
                            }
                        }
                        //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                        dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                    }else if (!searchedSample && RE_SAMPLE.length > 0) {
                        let inputParameter 
                        if(RESelectedSample.length > 0 || RE_SUBSAMPLE.length > 0)
                        {
                            onlySampleService=true;
                            let paramList = inputParam.postParamList[0];
                            inputParameter = {
                                ...paramList.fecthInputObject.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                                ntype: 2,
                                nflag: 2
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSample: [RE_SAMPLE[0]]
                                }
                            }
                            //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        }

                        if(boolSelectedSubSample===false?(boolSelectedSubSample===false&&onlySampleService===false&&RESelectedSubSample.length !== 0
                            //&&!searchedSubSample
                            )
                        :(RESelectedSubSample.length === 0 && RE_SUBSAMPLE.length > 0))
                        {
                            let paramList = inputParam.postParamList[1];
                            inputParameter = {
                                ...paramList.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SUBSAMPLE[0][paramList.primaryKeyField]),
                                ntype: 3,
                                nflag: 3
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSubSample: [RE_SUBSAMPLE[0]]
                                }
                            }
                            //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        } 
                        else {
                            respObject = {
                                ...respObject,
                                masterData
                            };
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    ...respObject,
                                    loading: false
                                }
                            });
                        }


                    }   
                    else {
                        respObject = {
                            ...respObject,
                            masterData
                        };
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ...respObject,
                                loading: false
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
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOCOMPLETE"
        }));
    }

}*/

// //Added by sonia on  24-07-2024 for Jira ID:ALPD-4649
// export function completeTest(inputParam, acceptList, userInfo, completeResultId,booleanFlag,param) {
//     if (acceptList !== undefined && acceptList.length > 0) {
//         return function (dispatch) {
//             let isSearched=false;
//             let inputData = inputParam.testChildGetREParam
//             let inputParamData = {
//                 ntype: 3,
//                // nflag: 2,
//                ninsertMaterialInventoryTrans:inputParam.inputData.ninsertMaterialInventoryTrans,
//                nportalrequired:inputParam.inputData.nportalrequired,
//                 basedrulesengine:param.basedrulesengine,
//                 nsampletypecode: inputData.nsampletypecode,
//                 nregtypecode: inputData.nregtypecode,
//                 nregsubtypecode: inputData.nregsubtypecode,
//                 npreregno: inputData.npreregno,
//                 ntranscode: String(inputData.ntransactionstatus),
//                 napprovalversioncode: inputData.napprovalversioncode,
//                 napprovalconfigcode: inputData.napprovalconfigcode,
//                 ntransactionsamplecode: inputData.ntransactionsamplecode,
//                 userinfo: userInfo,
//                 fromdate: inputData.fromdate,
//                 todate: inputData.todate,
//                 ntestcode: inputData.ntestcode,
//                 transactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
//                 ntransactiontestcode: 0,
//                 activeTestKey: inputData.activeTestKey,
//                 ncontrolcode: inputParam.inputData.ncontrolcode,
//                 nneedsubsample: inputData.masterData.nneedsubsample,
//                 ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
//                 checkBoxOperation:checkBoxOperation.SINGLESELECT,
//                 nsettingcode:  inputParam.nsettingcode,
//                 nusercode: inputParam.nusercode,
//                 susername:  inputParam.susername,
//                 nneedReceivedInLab:inputParam.inputData.nneedReceivedInLab
//             }
//             let activeName = "";
//             let dataStateName = "";
//             // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
//             //     documentDataState, testCommentDataState } = inputData
//             // let url = "resultentrybysample/getTestbasedParameter"
//             switch (inputData.activeTestKey) {
//                 case "IDS_RESULTS":
//                     activeName = "TestParameters"
//                     dataStateName = "resultDataState"
//                     break;
//                 case "IDS_INSTRUMENT":
//                     activeName = "ResultUsedInstrument"
//                     dataStateName = "instrumentDataState"
//                     break;
//                 case "IDS_MATERIAL":
//                     activeName = "ResultUsedMaterial"
//                     dataStateName = "materialDataState"
//                     break;
//                 case "IDS_TASK":
//                     activeName = "ResultUsedTasks"
//                     dataStateName = "taskDataState"
//                     break;
//                 case "IDS_TESTATTACHMENTS":
//                     activeName = "RegistrationTestAttachment"
//                     break;
//                 case "IDS_TESTCOMMENTS":
//                     activeName = "RegistrationTestComment"
//                     dataStateName = "testCommentDataState"
//                     break;
//                 case "IDS_DOCUMENTS":
//                     activeName = ""
//                     dataStateName = "documentDataState"
//                     break;
//                 case "IDS_RESULTCHANGEHISTORY":
//                     activeName = "ResultChangeHistory"
//                     dataStateName = "resultChangeDataState"
//                     break;
//                 case "IDS_SAMPLEATTACHMENTS":
//                     activeName = ""
//                     dataStateName = "resultDataState"
//                     break;
//                 default:
//                     activeName = "TestParameters"
//                     dataStateName = "resultDataState"
//                     break;
//             }
//             dispatch(initRequest(true));
//             rsapi().post("resultentrybysample/completeTest", inputParamData)
//                 .then(response => {
//                     if(!response.data.hasOwnProperty("ruleFlag")){
//                         let RE_SAMPLE = [];
//                         let RE_SUBSAMPLE = [];
//                         let RE_TEST = [];
//                         let onlySampleService=false;
//                         let responseData =  sortData(response.data, 'ascending', 'ntransactionresultcode')//response.data
//                         //rules engine new subsample outcome --start ---
//                         let testcode= responseData["RE_TEST"].map(test => test.npreregno).join(",");
//                         let sampleCode= responseData["RE_SUBSAMPLE"].map(test => test.npreregno).join(",");
//                         inputData.masterData["searchedSample"] && inputData.masterData["searchedSample"].map(item=>{  
//                             if(!testcode.includes(String(item.npreregno)) && !sampleCode.includes(String(item.npreregno)) ){
//                                 responseData["RE_TEST"]=[];
//                                 responseData["RE_SUBSAMPLE"]=[];
//                                 responseData["RESelectedSubSample"]=[];
//                                 responseData["RESelectedTest"]=[];
//                                 isSearched=true;
//                             }
//                         });
//                         let transactiontestcode=inputData.masterData["RE_TEST"].map(test => test.ntransactiontestcode).join(",")
//                         responseData["RE_TEST"]&& responseData["RE_TEST"].forEach(element => {
//                             if(!transactiontestcode.includes(String(element.ntransactiontestcode))){
//                                 inputData.masterData["RE_TEST"].push(element);
//                             }
//                         });
//                         let transactionsamplecode=inputData.masterData["RE_SUBSAMPLE"].map(item=>item.ntransactionsamplecode).join(",")
//                         responseData["RE_SUBSAMPLE"] && responseData["RE_SUBSAMPLE"].forEach(element => {
//                             if(!transactionsamplecode.includes(String(element.ntransactionsamplecode))){
//                                 inputData.masterData["RE_SUBSAMPLE"].push(element);
//                             }
//                         });
//                         //end--
//                         //Added
//                         if(inputData.masterData["searchedTest"]&&responseData["RE_TEST"]){
//                             inputData.masterData["searchedTest"]= getSameRecordFromTwoArrays(inputData.masterData["searchedTest"],responseData["RE_TEST"],"ntransactiontestcode");
//                         }


//                         if (responseData["RE_TEST"] && responseData["RE_TEST"].length > 0) {
//                             //Added
//                             if (inputData.masterData.realRegSubTypeValue.nneedsubsample//.nneedsubsample
//                             )
//                                 RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "ntransactionsamplecode");
//                             else
//                                 RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "npreregno");
//                         } else {
//                             RE_TEST = inputData.masterData["RE_TEST"];
//                         }

//                         RE_SUBSAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SUBSAMPLE"], RE_TEST, "ntransactionsamplecode");
//                         if (RE_SUBSAMPLE.length > 0) {
//                             // RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");
//                             RE_SAMPLE = replaceUpdatedObject( responseData["RE_SAMPLE"],inputData.masterData["RE_SAMPLE"] , "npreregno");
//                             //inputData.masterData["RE_SAMPLE"];
//                             //Added
//                             let selectedSampleArray= inputData.masterData["RESelectedSample"]; 
//                             let subSampleArray=RE_SUBSAMPLE.map(x=>x.npreregno);
//                             let selectPreregNOBefore=selectedSampleArray.map(x=>x.npreregno)
//                             selectedSampleArray=selectedSampleArray.filter(item => subSampleArray.includes(item.npreregno)).map(x=>x.npreregno) 
//                             let unwantedPreregno=  selectPreregNOBefore.filter(function (x) {
//                                 return !selectedSampleArray.some(function (y) { 
//                                 return x  === y 
//                                 })
//                             }); 
//                             RE_SAMPLE= RE_SAMPLE.filter(item => !unwantedPreregno.includes(item.npreregno))
//                             //RE_SAMPLE= filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"],RE_SUBSAMPLE , "npreregno");
//                         } else {
//                             RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");

//                             RE_SAMPLE = filterRecordBasedOnTwoArrays(RE_SAMPLE, RE_TEST, "npreregno");
//                         }
//                         //  const RESelectedSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");
//                         //Added
//                         const RESelectedSample = RE_SUBSAMPLE.length > 0 ? inputData.masterData["RESelectedSample"] :  RE_SAMPLE

                 

//                         let boolSelectedSubSample; 
//                         let searchedSubSample = undefined; 
//                         let RESelectedSubSample=[];
//                         let backfrontTest= getSameRecordFromTwoArrays(inputData.masterData["RE_TEST"],responseData["RE_TEST"],"ntransactiontestcode")
//                         if(inputData.masterData["searchedSubSample"]){
//                             searchedSubSample =inputData.masterData["searchedSubSample"]
//                             boolSelectedSubSample=searchedSubSample.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 

//                             let searchedSubSamplebefore=inputData.masterData["RESelectedSubSample"].map(x=>x.ntransactionsamplecode);
//                             searchedSubSample= inputData.masterData["RESelectedSubSample"].filter(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
//                             let searchedSubSampleaftere=searchedSubSample.map(x=>x.ntransactionsamplecode);
//                             let unwantedSamplecode=  searchedSubSamplebefore.filter(function (x) {
//                                 return !searchedSubSampleaftere.some(function (y) { 
//                                 return x  === y 
//                                 })
//                             });  
//                             inputData.masterData["searchedSubSample"]=inputData.masterData["searchedSubSample"].filter(item => !unwantedSamplecode.includes(item.ntransactionsamplecode)) 
//                         }else{
//                             boolSelectedSubSample=RE_SUBSAMPLE.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
//                         }
                 
//                         if(inputData.masterData["searchedSubSample"]//&&inputData.masterData["searchedSubSample"].length>0
//                         ){
//                             RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :
//                             inputData.masterData["searchedSubSample"][0]? [inputData.masterData["searchedSubSample"][0]]:[]
//                         }else{
//                             RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :  RE_SUBSAMPLE
//                         }  
//                         //  const RESelectedSubSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode");
//                         let RESelectedTest1 = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedTest"], acceptList, "ntransactiontestcode");
//                         let RESelectedTest2 = updatedObjectWithNewElement(RESelectedTest1, responseData.RESelectedTest)

//                         let searchedSample = undefined;
//                         if (inputData.masterData["searchedSample"]) {
//                             RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["searchedSample"],  responseData["RE_SAMPLE"], "npreregno");

//                             searchedSample = filterRecordBasedOnTwoArrays(RE_SAMPLE//inputData.masterData["searchedSample"]
//                             ,
//                             RE_TEST, "npreregno");
//                             searchedSample=searchedSample.length>0?searchedSample:isSearched?[]:inputData.masterData["searchedSample"];
//                         }

//                         let masterData = {
//                             ...inputData.masterData,
//                             ...responseData,
//                             RE_SAMPLE,
//                             RE_SUBSAMPLE,
//                             RESelectedSubSample,
//                             searchedSample,
//                             RESelectedSample,
//                             RESelectedTest: RESelectedTest2,
//                             RESelectedTest: response.data.hasOwnProperty('RegistrationTestAlert')
//                             &&Object.keys(response.data['RegistrationTestAlert']).length !== 0
//                             ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&
//                             Object.keys(response.data['NewTestGroupTestAlert']).length !== 0?
//                             inputData.masterData["RESelectedTest"]://RESelectedTest2
//                             inputData.masterData["searchedTest"]&&
//                             inputData.masterData["searchedTest"].length>0?[inputData.masterData["searchedTest"][0]]: 
//                             responseData.RESelectedTest
//                             ,
                         
//                             //  RE_TEST:compareArrays(responseData["RE_TEST"],inputData.masterData["RE_TEST"])?
//                             //  inputData.masterData["RE_TEST"]: responseData["RE_TEST"]
//                             RE_TEST: responseData["RE_TEST"]
                        
//                         }
//                         let skipInfo = {};
//                         // if (masterData.RE_SAMPLE && masterData.RE_SAMPLE.length <= inputParam.skip) { //ALPD-2230
//                         if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length == 0 && masterData.RE_TEST && masterData.RE_TEST.length == 0){
//                             skipInfo = {
//                                 ...skipInfo,
//                                 skip: 0,
//                                 take: inputParam.take
//                             }
//                         }
//                         // }
//                         if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length <= inputParam.subSampleTake){
//                             skipInfo = {
//                                 ...skipInfo,
//                                 subSampleSkip: 0,
//                                 subSampleTake: inputParam.subSampleTake
//                             }
//                         }
//                         if (masterData.RE_TEST && masterData.RE_TEST.length <= inputParam.testskip) {
//                             skipInfo = {
//                                 ...skipInfo,
//                                 testskip: 0,
//                                 testtake: inputParam.testtake
//                             }
//                         }
//                         if (inputData[dataStateName] && masterData[activeName].length <= inputData[dataStateName].skip) {

//                             skipInfo = {
//                                 ...skipInfo,
//                                 [dataStateName]: {
//                                     ...inputData[dataStateName],
//                                     skip: 0,
//                                     sort: undefined,
//                                     filter: undefined
//                                 }
//                             }
//                         } else {
//                             skipInfo = {
//                                 ...skipInfo,
//                                 [dataStateName]: {
//                                     ...inputData[dataStateName],
//                                     sort: undefined,
//                                     filter: undefined
//                                 }
//                             }
//                         }
//                         let respObject = {
//                             RegistrationTestAlert: response.data.hasOwnProperty('RegistrationTestAlert')//&&response.data.RegistrationTestAlert.length>0
//                             ?response.data.RegistrationTestAlert:{},
//                             NewTestGroupTestAlert:response.data.hasOwnProperty('NewTestGroupTestAlert')//&&response.data.NewTestGroupTestAlert.length>0
//                             ?response.data.NewTestGroupTestAlert:{},
//                             showAlertGrid:response.data.hasOwnProperty('RegistrationTestAlert')&&Object.keys(response.data['RegistrationTestAlert']).length !== 0
//                             ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&Object.keys(response.data['NewTestGroupTestAlert']).length !== 0//&&response.data.RegistrationTestAlert.length>0||
//                         // response.data.hasOwnProperty('NewTestGroupTestAlert')&&response.data.NewTestGroupTestAlert.length>0
//                             ?true:false,
//                             showAlertForPredefined:false,
//                             additionalInfoView:false,
//                             ...inputParamData.inputData,
//                             openModal: false,
//                             loadEsign: false,
//                             showConfirmAlert: false,
//                             //selectedRecord: undefined,
//                             loading: false,
//                             screenName: inputData.activeTestKey,
//                             ...skipInfo
//                         }
//                         if (searchedSample //&& RESelectedSample.length === 0 
//                         && searchedSample.length > 0) {
//                             const paramList = inputParam.postParamList[0];
//                             const inputParameter = {
//                                 ...paramList.fecthInputObject.fecthInputObject,
//                                 fetchUrl: paramList.fetchUrl,
//                                 [paramList.primaryKeyField]: String(searchedSample[0][paramList.primaryKeyField]),
//                                 ntype: 2,
//                                 nflag: 2
//                             };
//                             respObject = {
//                                 ...respObject,
//                                 masterData: {
//                                     ...masterData,
//                                     RESelectedSample: [searchedSample[0]]
//                                 }
//                             }
//                         // dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
//                             dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
//                         } else if (!searchedSample && RESelectedSample.length === 0 && RE_SAMPLE.length > 0) {
//                             const paramList = inputParam.postParamList[0];
//                             const inputParameter = {
//                                 ...paramList.fecthInputObject.fecthInputObject,
//                                 fetchUrl: paramList.fetchUrl,
//                                 [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
//                                 ntype: 2,
//                                 nflag: 2
//                             };
//                             respObject = {
//                                 ...respObject,
//                                 masterData: {
//                                     ...masterData,
//                                     RESelectedSample: [RE_SAMPLE[0]]
//                                 }
//                             }
//                             //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
//                             dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
//                         }else if (!searchedSample && RE_SAMPLE.length > 0) {
//                             let inputParameter 
//                             if(RESelectedSample.length > 0 || RE_SUBSAMPLE.length > 0)
//                             {
//                                 onlySampleService=true;
//                                 let paramList = inputParam.postParamList[0];
//                                 inputParameter = {
//                                     ...paramList.fecthInputObject.fecthInputObject,
//                                     fetchUrl: paramList.fetchUrl,
//                                     [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
//                                     ntype: 2,
//                                     nflag: 2
//                                 };

//                                 respObject = {
//                                     ...respObject,
//                                     masterData: {
//                                         ...masterData,
//                                         RESelectedSample: [RE_SAMPLE[0]]
//                                     }
//                                 }
//                                 //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
//                                 dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
//                             }

//                             if(boolSelectedSubSample===false?(boolSelectedSubSample===false&&onlySampleService===false&&RESelectedSubSample.length !== 0
//                             //&&!searchedSubSample
//                             )
//                             :(RESelectedSubSample.length === 0 && RE_SUBSAMPLE.length > 0))
//                             {   
//                                 let paramList = inputParam.postParamList[1];
//                                 inputParameter = {
//                                     ...paramList.fecthInputObject,
//                                     fetchUrl: paramList.fetchUrl,
//                                     [paramList.primaryKeyField]: String(RE_SUBSAMPLE[0][paramList.primaryKeyField]),
//                                     ntype: 3,
//                                     nflag: 3
//                                 };

//                                 respObject = {
//                                     ...respObject,
//                                     masterData: {
//                                         ...masterData,
//                                         RESelectedSubSample: [RE_SUBSAMPLE[0]]
//                                     }
//                                 }
//                                 //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
//                                 dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
//                             } 
//                             else {
//                                 respObject = {
//                                     ...respObject,
//                                     masterData
//                                 };
//                                 dispatch({
//                                     type: DEFAULT_RETURN,
//                                     payload: {
//                                         ...respObject,
//                                         loading: false
//                                     }
//                                 });
//                             }


//                         }   
//                         else {
//                             respObject = {
//                                 ...respObject,
//                                 masterData
//                             };
//                             dispatch({
//                                 type: DEFAULT_RETURN,
//                                 payload: {
//                                     ...respObject,
//                                     loading: false
//                                 }
//                             });
//                         }
//                     }else {
//                         let respObject = {
//                             RegistrationTestAlert: response.data.hasOwnProperty('RegistrationTestAlert')
//                             ?response.data.RegistrationTestAlert:{},
//                             NewTestGroupTestAlert:response.data.hasOwnProperty('NewTestGroupTestAlert')
//                             ?response.data.NewTestGroupTestAlert:{},
//                             showAlertGrid:response.data.hasOwnProperty('RegistrationTestAlert')&&Object.keys(response.data['RegistrationTestAlert']).length !== 0
//                             ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&Object.keys(response.data['NewTestGroupTestAlert']).length !== 0
//                             ?true:false,
//                             showAlertForPredefined:false,
//                             additionalInfoView:false,
//                             ...inputParamData.inputData,
//                             openModal: false,
//                             loadEsign: false,
//                             showConfirmAlert: false,
//                             loading: false,
//                             screenName: inputData.activeTestKey,
                            
//                         }
//                         const  masterData= {                        
//                             ...inputData.masterData                                     
                               
//                         }                       
    
//                         dispatch({
//                             type: DEFAULT_RETURN,
//                                 payload: {
//                                     masterData,
//                                     ...respObject, 
//                                     loading: false
//                                 }
//                         });
//                     }

                    
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
//                             toast.warn(error.response.data); 
//                     }
//                 })
//         }
//     } else {
//         toast.warn(intl.formatMessage({
//             id: "IDS_SELECTTESTTOCOMPLETE"
//         }));
//     }

// }

export function completeTest(inputParam, acceptList, userInfo, completeResultId,booleanFlag,param) {
    if (acceptList !== undefined && acceptList.length > 0) {
        return function (dispatch) {
            let isSearched=false;
            let inputData = inputParam.testChildGetREParam
            let inputParamData = {
                ntype: 3,
               nflag: 3,
               ninsertMaterialInventoryTrans:inputParam.inputData.ninsertMaterialInventoryTrans,
               nportalrequired:inputParam.inputData.nportalrequired,
                basedrulesengine:param.basedrulesengine,
                nsampletypecode: inputData.nsampletypecode,
                nregtypecode: inputData.nregtypecode,
                nregsubtypecode: inputData.nregsubtypecode,
                npreregno: inputData.npreregno,
                ntranscode: String(inputData.ntransactionstatus),
                napprovalversioncode: inputData.napprovalversioncode,
                napprovalconfigcode: inputData.napprovalconfigcode,
                ntransactionsamplecode: inputData.ntransactionsamplecode,
                userinfo: userInfo,
                fromdate: inputData.fromdate,
                todate: inputData.todate,
                ntestcode: inputData.ntestcode,
                transactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
                ntransactiontestcode: 0,
                activeTestKey: inputData.activeTestKey,
                ncontrolcode: inputParam.inputData.ncontrolcode,
                nneedsubsample: inputData.masterData.nneedsubsample,
                ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
                 checkBoxOperation:checkBoxOperation.SINGLESELECT,
                 // ALPD-5596 - commented by Gowtham R on 25/03/2025 - Store the Analyzer Name in registrationtest table wheather setting[45] is 3 or 4
                // nsettingcode:  inputParam.nsettingcode,
                nusercode: inputParam.nusercode,
                susername:  inputParam.susername,
                nneedReceivedInLab:inputParam.inputData.nneedReceivedInLab,
				//ALPD-5679--Added by Vignesh R(10-04-2025)->Test is not generating when using rules engine. Check description.
                nneedtestinitiate:inputParam.inputData.nneedtestinitiate
            }
            let activeName = "";
            let dataStateName = "";
            // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
            //     documentDataState, testCommentDataState } = inputData
            // let url = "resultentrybysample/getTestbasedParameter"
            switch (inputData.activeTestKey) {
                case "IDS_RESULTS":
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    activeName = "ResultUsedMaterial"
                    dataStateName = "materialDataState"
                    break;
                case "IDS_TASK":
                    activeName = "ResultUsedTasks"
                    dataStateName = "taskDataState"
                    break;
                case "IDS_TESTATTACHMENTS":
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_DOCUMENTS":
                    activeName = ""
                    dataStateName = "documentDataState"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    activeName = "ResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    activeName = ""
                    dataStateName = "resultDataState"
                    break;
                default:
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
            }
            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/completeTest", inputParamData)
                .then(response => {
                    let RE_SAMPLE = [];
                    let RE_SUBSAMPLE = [];
                    let RE_TEST = [];
                    let onlySampleService=false;
                    let responseData =  sortData(response.data, 'ascending', 'ntransactionresultcode')//response.data
                    //rules engine new subsample outcome --start ---
                    // let testcode= responseData["RE_TEST"].map(test => test.npreregno).join(",");
                    // let sampleCode= responseData["RE_SUBSAMPLE"].map(test => test.npreregno).join(",");
                    // inputData.masterData["searchedSample"] && inputData.masterData["searchedSample"].map(item=>{  
                    //     if(!testcode.includes(String(item.npreregno)) && !sampleCode.includes(String(item.npreregno)) ){
                    //         responseData["RE_TEST"]=[];
                    //         responseData["RE_SUBSAMPLE"]=[];
                    //         responseData["RESelectedSubSample"]=[];
                    //         responseData["RESelectedTest"]=[];
                    //         isSearched=true;
                    //     }
                    // });
                    // let transactiontestcode=inputData.masterData["RE_TEST"].map(test => test.ntransactiontestcode).join(",")
                    // responseData["RE_TEST"]&& responseData["RE_TEST"].forEach(element => {
                    //         if(!transactiontestcode.includes(String(element.ntransactiontestcode))){
                    //             inputData.masterData["RE_TEST"].push(element);
                    //         }
                    // });
                    // let transactionsamplecode=inputData.masterData["RE_SUBSAMPLE"].map(item=>item.ntransactionsamplecode).join(",")
                    // responseData["RE_SUBSAMPLE"] && responseData["RE_SUBSAMPLE"].forEach(element => {
                    //         if(!transactionsamplecode.includes(String(element.ntransactionsamplecode))){
                    //             inputData.masterData["RE_SUBSAMPLE"].push(element);
                    //         }
                    // });
                    //end--
                    //Added
                    if(inputData.masterData["searchedTest"]&&responseData["RE_TEST"]){
                        inputData.masterData["searchedTest"]= getSameRecordFromTwoArrays(inputData.masterData["searchedTest"],responseData["RE_TEST"],"ntransactiontestcode");
                       }


                    if (responseData["RE_TEST"] && responseData["RE_TEST"].length > 0) {
                         //Added
                        if (inputData.masterData.realRegSubTypeValue.nneedsubsample//.nneedsubsample
                            ){
                          //ALPD-4828
                          //Result entry-->sample disappeared when complete the single test
                            if(responseData.getNewSample){
                             RE_TEST=responseData["RE_TEST"]
                            }else{
                            RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "ntransactionsamplecode");
                            }
                        }else
                            RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "npreregno");
                    } else {
                        RE_TEST = inputData.masterData["RE_TEST"];
                    }
							//ALPD-4828 neeraj
                          //Result entry-->sample disappeared when complete the single test
                    if(responseData.getNewSample){
                        RE_SUBSAMPLE=responseData["RE_SUBSAMPLE"];
                    }else{
                    RE_SUBSAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SUBSAMPLE"], RE_TEST, "ntransactionsamplecode");
                    }
                    if (RE_SUBSAMPLE.length > 0) {
                        // RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");
                        RE_SAMPLE = replaceUpdatedObject( responseData["RE_SAMPLE"],inputData.masterData["RE_SAMPLE"] , "npreregno");
                        //inputData.masterData["RE_SAMPLE"];
                         //Added
                        let selectedSampleArray= inputData.masterData["RESelectedSample"]; 
                        let subSampleArray=RE_SUBSAMPLE.map(x=>x.npreregno);
                        let selectPreregNOBefore=selectedSampleArray.map(x=>x.npreregno)
                        selectedSampleArray=selectedSampleArray.filter(item => subSampleArray.includes(item.npreregno)).map(x=>x.npreregno) 
                        let unwantedPreregno=  selectPreregNOBefore.filter(function (x) {
                            return !selectedSampleArray.some(function (y) { 
                              return x  === y 
                            })
                          }); 
                        RE_SAMPLE= RE_SAMPLE.filter(item => !unwantedPreregno.includes(item.npreregno))
                        //RE_SAMPLE= filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"],RE_SUBSAMPLE , "npreregno");
                    } else {
                        RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["RE_SAMPLE"],  responseData["RE_SAMPLE"], "npreregno");
                        if(RE_SAMPLE && RE_SAMPLE.length > 0){
                            RE_SAMPLE = filterRecordBasedOnTwoArrays(RE_SAMPLE, RE_TEST, "npreregno");
                        } else {
                            RE_SAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"], inputData.masterData["RESelectedTest"], "npreregno");
                        }
                    }
                  //  const RESelectedSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");
                  //Added
                //   const RESelectedSample = RE_SUBSAMPLE.length > 0 ? inputData.masterData["RESelectedSample"] :  RE_SAMPLE
                  const RESelectedSample = RE_SUBSAMPLE.length > 0 ? inputData.masterData["RESelectedSample"] :  
                        filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");               

                  let boolSelectedSubSample; 
                  let searchedSubSample = undefined; 
                  let RESelectedSubSample=[];
                  let backfrontTest= getSameRecordFromTwoArrays(inputData.masterData["RE_TEST"],responseData["RE_TEST"],"ntransactiontestcode")
                   if(inputData.masterData["searchedSubSample"]){
                       searchedSubSample =inputData.masterData["searchedSubSample"]
                       boolSelectedSubSample=searchedSubSample.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 

                       let searchedSubSamplebefore=inputData.masterData["RESelectedSubSample"].map(x=>x.ntransactionsamplecode);
                       searchedSubSample= inputData.masterData["RESelectedSubSample"].filter(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                       let searchedSubSampleaftere=searchedSubSample.map(x=>x.ntransactionsamplecode);
                       let unwantedSamplecode=  searchedSubSamplebefore.filter(function (x) {
                          return !searchedSubSampleaftere.some(function (y) { 
                            return x  === y 
                          })
                        });  
                        inputData.masterData["searchedSubSample"]=inputData.masterData["searchedSubSample"].filter(item => !unwantedSamplecode.includes(item.ntransactionsamplecode)) 
                    }else{
                      boolSelectedSubSample=RE_SUBSAMPLE.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                    }
                 
                  if(inputData.masterData["searchedSubSample"]//&&inputData.masterData["searchedSubSample"].length>0
                  ){
                      RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :
                      inputData.masterData["searchedSubSample"][0]? [inputData.masterData["searchedSubSample"][0]]:[]
                  }else{
							//ALPD-4828 neeraj
                          //Result entry-->sample disappeared when complete the single test
                      RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :responseData.getNewSample? responseData["RESelectedSubSample"] :  RE_SUBSAMPLE
                  }  
                  //  const RESelectedSubSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode");
                    let RESelectedTest1 = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedTest"], acceptList, "ntransactiontestcode");
                    let RESelectedTest2 = updatedObjectWithNewElement(RESelectedTest1, responseData.RESelectedTest)

                    let searchedSample = undefined;
                    // if (inputData.masterData["searchedSample"]) {
                    //     RE_SAMPLE = getSameRecordFromTwoArrays(inputData.masterData["searchedSample"],  responseData["RE_SAMPLE"], "npreregno");

                    //     searchedSample = filterRecordBasedOnTwoArrays(RE_SAMPLE//inputData.masterData["searchedSample"]
                    //     ,
                    //      RE_TEST, "npreregno");
                    //     //  searchedSample=searchedSample.length>0?searchedSample:isSearched?[]:inputData.masterData["searchedSample"];
                    // }
                    if (inputData.masterData["searchedSample"]) {
                        if(RESelectedSample && RESelectedSample.length > 0){
                            searchedSample = inputData.masterData["searchedSample"];
                        } else {
                            searchedSample = undefined;
                        }
                        // searchedSample = filterRecordBasedOnTwoArrays(RE_SAMPLE, RE_TEST, "npreregno");
                        //  searchedSample=searchedSample.length>0?searchedSample:isSearched?[]:inputData.masterData["searchedSample"];
                    }
                    if(searchedSample && searchedSample.length > 0 && RE_SAMPLE && RE_SAMPLE.length > 0){
                        searchedSample = getSameRecordFromTwoArrays(searchedSample, RE_SAMPLE, "npreregno")
                    }
                    let masterData = {
                        ...inputData.masterData,
                        ...responseData,
                        RE_SAMPLE,
                        RE_SUBSAMPLE,
                        RESelectedSubSample,
                        searchedSample,
                        RESelectedSample,
 						RESelectedTest: RESelectedTest2,
                         RESelectedTest: response.data.hasOwnProperty('RegistrationTestAlert')
                         &&Object.keys(response.data['RegistrationTestAlert']).length !== 0
                         ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&
                         Object.keys(response.data['NewTestGroupTestAlert']).length !== 0?
                         inputData.masterData["RESelectedTest"]://RESelectedTest2
                         inputData.masterData["searchedTest"]&&
                         inputData.masterData["searchedTest"].length>0?[inputData.masterData["searchedTest"][0]]: 
                         responseData.RESelectedTest
                         ,
                         
                        //  RE_TEST:compareArrays(responseData["RE_TEST"],inputData.masterData["RE_TEST"])?
                        //  inputData.masterData["RE_TEST"]: responseData["RE_TEST"]
                        RE_TEST: responseData["RE_TEST"]
                        
                    }
                    let skipInfo = {};
                    // if (masterData.RE_SAMPLE && masterData.RE_SAMPLE.length <= inputParam.skip) { //ALPD-2230
                    if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length == 0 && masterData.RE_TEST && masterData.RE_TEST.length == 0){
                        skipInfo = {
                            ...skipInfo,
                            skip: 0,
                            take: inputParam.take
                        }
                    }
                    // }
                    if (masterData.RE_SUBSAMPLE && masterData.RE_SUBSAMPLE.length <= inputParam.subSampleTake){
                        skipInfo = {
                            ...skipInfo,
                            subSampleSkip: 0,
                            subSampleTake: inputParam.subSampleTake
                        }
                    }
                    if (masterData.RE_TEST && masterData.RE_TEST.length <= inputParam.testskip) {
                        skipInfo = {
                            ...skipInfo,
                            testskip: 0,
                            testtake: inputParam.testtake
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
                    let respObject = {
                        RegistrationTestAlert: response.data.hasOwnProperty('RegistrationTestAlert')//&&response.data.RegistrationTestAlert.length>0
                        ?response.data.RegistrationTestAlert:{},
                        NewTestGroupTestAlert:response.data.hasOwnProperty('NewTestGroupTestAlert')//&&response.data.NewTestGroupTestAlert.length>0
                        ?response.data.NewTestGroupTestAlert:{},
                        showAlertGrid:response.data.hasOwnProperty('RegistrationTestAlert')&&Object.keys(response.data['RegistrationTestAlert']).length !== 0
                        ||response.data.hasOwnProperty('NewTestGroupTestAlert')&&Object.keys(response.data['NewTestGroupTestAlert']).length !== 0//&&response.data.RegistrationTestAlert.length>0||
                       // response.data.hasOwnProperty('NewTestGroupTestAlert')&&response.data.NewTestGroupTestAlert.length>0
                        ?true:false,
                        showAlertForPredefined:false,
                        additionalInfoView:false,
                        ...inputParamData.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        //selectedRecord: undefined,
                        loading: false,
                        screenName: inputData.activeTestKey,
                        ...skipInfo
                    }
                    if (searchedSample //&& RESelectedSample.length === 0 
                        && searchedSample.length > 0) {
                            if(RE_SUBSAMPLE && RE_SUBSAMPLE.length > 0){
                                if(masterData.RE_TEST && masterData.RE_TEST.length === 0){
                                    let paramList = inputParam.postParamList[1];
                                    let inputParameter = {
                                        ...paramList.fecthInputObject,
                                        fetchUrl: paramList.fetchUrl,
                                        [paramList.primaryKeyField]: String(RE_SUBSAMPLE[0][paramList.primaryKeyField]),
                                        ntype: 3,
                                        nflag: 3
                                    };
        
                                    respObject = {
                                        ...respObject,
                                        masterData: {
                                            ...masterData,
                                            RESelectedSubSample: [RE_SUBSAMPLE[0]]
                                        }
                                    }
                                    //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                                    if(inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null){
                                        inputParam.searchSubSampleRef.current.value = "";
                                    }
                                    if(inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null){
                                        inputParam.searchTestRef.current.value = "";
                                    }
                                    dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                                } else {
                                    respObject = {
                                        ...respObject,
                                        masterData
                                    };
                                    dispatch({
                                        type: DEFAULT_RETURN,
                                        payload: {
                                            ...respObject,
                                            loading: false
                                        }
                                    });
                                }
                            }
                            else if(masterData.RE_TEST && masterData.RE_TEST.length === 0){
                                const paramList = inputParam.postParamList[0];
                                const inputParameter = {
                                    ...paramList.fecthInputObject.fecthInputObject,
                                    fetchUrl: paramList.fetchUrl,
                                    [paramList.primaryKeyField]: String(searchedSample[0][paramList.primaryKeyField]),
                                    ntype: 2,
                                    nflag: 2
                                };
                                respObject = {
                                    ...respObject,
                                    masterData: {
                                        ...masterData,
                                        RESelectedSample: [searchedSample[0]]
                                    }
                                }
                               // dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                               if(inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null){
                                    inputParam.searchSampleRef.current.value = "";
                                }
                                if(inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null){
                                    inputParam.searchSubSampleRef.current.value = "";
                                }
                               if(inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null){
                                    inputParam.searchTestRef.current.value = "";
                                }
                                dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                            } else {
                                respObject = {
                                    ...respObject,
                                    masterData
                                };
                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: {
                                        ...respObject,
                                        loading: false
                                    }
                                });
                            }
                        
                    } else if (!searchedSample && RESelectedSample.length === 0 && RE_SAMPLE.length > 0) {
                        const paramList = inputParam.postParamList[0];
                        const inputParameter = {
                            ...paramList.fecthInputObject.fecthInputObject,
                            fetchUrl: paramList.fetchUrl,
                            [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                            ntype: 2,
                            nflag: 2
                        };
                        respObject = {
                            ...respObject,
                            masterData: {
                                ...masterData,
                                RESelectedSample: [RE_SAMPLE[0]]
                            }
                        }
                        //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                        if(inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null){
                            inputParam.searchSampleRef.current.value = "";
                        }
                        if(inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null){
                            inputParam.searchSubSampleRef.current.value = "";
                        }
                        if(inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null){
                            inputParam.searchTestRef.current.value = "";
                        }
                        dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                    }else if (!searchedSample && RE_SAMPLE.length > 0) {
                        let inputParameter 
                        if(RESelectedSample.length === 0 || RE_SUBSAMPLE.length === 0)
                        {
                            onlySampleService=true;
                            let paramList = inputParam.postParamList[0];
                            inputParameter = {
                                ...paramList.fecthInputObject.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                                ntype: 2,
                                nflag: 2
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSample: [RE_SAMPLE[0]]
                                }
                            }
                            //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            if(inputParam.searchSampleRef !== undefined && inputParam.searchSampleRef.current !== null){
                                inputParam.searchSampleRef.current.value = "";
                            }
                            if(inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null){
                                inputParam.searchSubSampleRef.current.value = "";
                            }
                            if(inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null){
                                inputParam.searchTestRef.current.value = "";
                            }
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        }

                        if(boolSelectedSubSample===false?(boolSelectedSubSample===false&&onlySampleService===false&&RESelectedSubSample.length !== 0
                            //&&!searchedSubSample
                            )
                        :(RESelectedSubSample.length === 0 && RE_SUBSAMPLE.length > 0))
                        {
                            let paramList = inputParam.postParamList[1];
                            inputParameter = {
                                ...paramList.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SUBSAMPLE[0][paramList.primaryKeyField]),
                                ntype: 3,
                                nflag: 3
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSubSample: [RE_SUBSAMPLE[0]]
                                }
                            }
                            //dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            if(inputParam.searchSubSampleRef !== undefined && inputParam.searchSubSampleRef.current !== null){
                                inputParam.searchSubSampleRef.current.value = "";
                            }
                            if(inputParam.searchTestRef !== undefined && inputParam.searchTestRef.current !== null){
                                inputParam.searchTestRef.current.value = "";
                            }
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        } 
                        else {
                            respObject = {
                                ...respObject,
                                masterData
                            };
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    ...respObject,
                                    loading: false
                                }
                            });
                        }


                    }   
                    else {
                        respObject = {
                            ...respObject,
                            masterData
                        };
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ...respObject,
                                loading: false
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
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOCOMPLETE"
        }));
    }

}

export function testStart(inputParam, acceptList, userInfo, completeResultId) {
    if (acceptList !== undefined && acceptList.length > 0) {
        return function (dispatch) {
            let inputData = inputParam.testChildGetREParam
            let inputParamData = {
                ntype: 3,
                nflag: 3,
                nsampletypecode: inputData.nsampletypecode,
                nregtypecode: inputData.nregtypecode,
                nregsubtypecode: inputData.nregsubtypecode,
                npreregno: inputData.npreregno,
                 // ALPD-3513
                //  Result entry: When initiate the test, list allignment issue occurs
                ntranscode: String(0),
                //ntranscode:String(inputData.ntransactionstatus),
                napprovalversioncode: inputData.napprovalversioncode,
                napprovalconfigcode: inputData.napprovalconfigcode,
                ntransactionsamplecode: inputData.ntransactionsamplecode,
                userinfo: userInfo,
                fromdate: inputData.fromdate,
                todate: inputData.todate,
                ntestcode: inputData.ntestcode,
                transactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
                //ntransactiontestcode: acceptList ? acceptList.map(test => test.ntransactiontestcode).join(",") : "",
                ntransactiontestcode: 0,
                activeTestKey: inputData.activeTestKey,
                ncontrolcode: inputParam.inputData.ncontrolcode,
                ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
                nneedsubsample : inputParam.inputData.subSampleNeeded,
                needjoballocationandmyjob:inputParam.inputData.NeedJobAllocationAndMyjob,
                nneedjoballocation:inputParam.inputData.nneedjoballocation,
                nneedmyjob:inputParam.inputData.nneedmyjob,
                nneedReceivedInLab:inputParam.inputData.nneedReceivedInLab
            }
            let activeName = "";
            let dataStateName = "";
            // let { resultDataState, materialDataState, instrumentDataState, taskDataState, resultChangeDataState,
            //     documentDataState, testCommentDataState } = inputData
            // let url = "resultentrybysample/getTestbasedParameter"
            switch (inputData.activeTestKey) {
                case "IDS_RESULTS":
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
                case "IDS_INSTRUMENT":
                    activeName = "ResultUsedInstrument"
                    dataStateName = "instrumentDataState"
                    break;
                case "IDS_MATERIAL":
                    activeName = "ResultUsedMaterial"
                    dataStateName = "materialDataState"
                    break;
                case "IDS_TASK":
                    activeName = "ResultUsedTasks"
                    dataStateName = "taskDataState"
                    break;
                case "IDS_TESTATTACHMENTS":
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_DOCUMENTS":
                    activeName = ""
                    dataStateName = "documentDataState"
                    break;
                case "IDS_RESULTCHANGEHISTORY":
                    activeName = "ResultChangeHistory"
                    dataStateName = "resultChangeDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    activeName = ""
                    dataStateName = "resultDataState"
                    break;
                default:
                    activeName = "TestParameters"
                    dataStateName = "resultDataState"
                    break;
            }
            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/testInitiated", inputParamData)
                .then(response => {
                    let RE_SAMPLE = [];
                    let RE_SUBSAMPLE = [];
                    let RE_TEST = [];
                    let onlySampleService=false;
                    let childTabsKey = ["TestParameters", "ResultUsedInstrument", "ResultUsedTasks", "RegistrationTestAttachment",
                            "ResultChangeHistory", "RegistrationTestComment", "ResultChangeHistory" ];
                    //let responseData = response.data 
                    let responseData =   sortData(response.data, 'ascending', 'ntransactionresultcode')
                    fillRecordBasedOnCheckBoxSelection(responseData, inputData.masterData, childTabsKey, 3, "ntransactionsamplecode", []);
                    let responseRESelectedTest= responseData.RESelectedTest;
                    responseData["RESelectedTest"] = getSameRecordFromTwoArrays(responseData.RE_TEST,inputParam.RESelectedTest,"ntransactiontestcode");
                     // ALPD-3513
                        // commed for Result entry: When initiate the test, list allignment issue occurs
                    //ALPD-3425
                    // if(responseData["RESelectedTest"].length === 0){
                    //     responseData["RESelectedTest"] = responseRESelectedTest;
                    // }
                    let responseRE_TEST;
                    // if(inputData.masterData["searchedTest"]&&responseData["RE_TEST"]){
                    //        dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                    //     inputData.masterData["searchedTest"]= getSameRecordFromTwoArrays(inputData.masterData["searchedTest"],responseData["RE_TEST"],"ntransactiontestcode");
                    //    }
                    if (responseData["RE_TEST"].length > 0) {
                        if (inputData.masterData.realRegSubTypeValue.nneedsubsample)//.nneedsubsample)
                        {
                           //RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "ntransactionsamplecode");
                         
                           // RE_TEST = getSameRecordFromTwoArrays(inputData.masterData["RE_TEST"],responseData["RESelectedTest"],"ntransactiontestcode");
                            RE_TEST = replaceUpdatedObject(responseData["RE_TEST"],inputData.masterData["RE_TEST"],"ntransactiontestcode");
                            responseRE_TEST = replaceUpdatedObject(responseData["RE_TEST"],inputData.masterData["RE_TEST"],"ntransactiontestcode");;
                        
                        }
                        else
                             RE_TEST= responseData["RE_TEST"]
                             responseRE_TEST = responseData["RE_TEST"]
                           // RE_TEST = filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "npreregno");
                    } else {
                        RE_TEST = inputData.masterData["RE_TEST"];
                        responseRE_TEST = responseData["RE_TEST"]
                    } 
                    RE_SUBSAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SUBSAMPLE"], filterRecordBasedOnTwoArrays(inputData.masterData["RE_TEST"], responseData["RE_TEST"], "ntransactionsamplecode"), "ntransactionsamplecode");
                    if (RE_SUBSAMPLE.length > 0) {  
                    //    let selectedSampleArray= inputData.masterData["RESelectedSample"]; 

                    //    let selectPreregNOBefore=selectedSampleArray.map(x=>x.npreregno)
                    //    selectedSampleArray=selectedSampleArray.filter(objx=>RE_TEST.some(objy=>objx['npreregno']===objy['npreregno']))
                    //    let selectedTestPreregno=inputData.masterData["RESelectedTest"].map(x=>x.npreregno);
                    //    let selectPreregNOafter=selectedSampleArray.map(x=>x.npreregno)
                    //    let unwantedPreregno= selectPreregNOBefore.filter(item => !selectPreregNOafter.includes(item))
                    //                         .filter(item => !selectPreregNOafter.includes(item)&& !selectedTestPreregno.includes(item));

                    //    RE_SAMPLE=inputData.masterData["RE_SAMPLE"].filter(objx=>unwantedPreregno.every(npreregno=>npreregno!==objx['npreregno'])) 
                    RE_SAMPLE=inputData.masterData["RE_SAMPLE"];
                    let selectedSampleArray= inputData.masterData["RESelectedSample"]; 
                    let subSampleArray=RE_SUBSAMPLE.map(x=>x.npreregno);
                    let selectPreregNOBefore=selectedSampleArray.map(x=>x.npreregno)
                    selectedSampleArray=selectedSampleArray.filter(item => subSampleArray.includes(item.npreregno)).map(x=>x.npreregno) 
                    let unwantedPreregno=  selectPreregNOBefore.filter(function (x) {
                        return !selectedSampleArray.some(function (y) { 
                          return x  === y 
                        })
                      }); 
                    RE_SAMPLE= RE_SAMPLE.filter(item => !unwantedPreregno.includes(item.npreregno))
                    //RE_SAMPLE= filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"],RE_SUBSAMPLE , "npreregno");
                    } else {
                        RE_SAMPLE = filterRecordBasedOnTwoArrays(inputData.masterData["RE_SAMPLE"], RE_TEST, "npreregno");
                    }


                    const RESelectedSample = RE_SUBSAMPLE.length > 0 ? inputData.masterData["RESelectedSample"] : [RE_SAMPLE[0]]
                    
                    //const RESelectedSample = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSample"], RE_TEST, "npreregno");

                    // let x=filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode") 
                    // let boolSelectedSubSample=x.some(objx=>RE_TEST.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode']))
                    // const RESelectedSubSample =boolSelectedSubSample? filterRecordBasedOnTwoArrays (inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode"):
                    // getSameRecordFromTwoArrays (inputData.masterData["RESelectedSubSample"], RE_TEST, "ntransactionsamplecode");
                    let boolSelectedSubSample; 
                    let searchedSubSample = undefined; 
                    let RESelectedSubSample=[];
                    let backfrontTest= getSameRecordFromTwoArrays(inputData.masterData["RE_TEST"],responseData["RE_TEST"],"ntransactiontestcode")
                     if(inputData.masterData["searchedSubSample"]){
                         searchedSubSample =inputData.masterData["searchedSubSample"]
                         boolSelectedSubSample=searchedSubSample.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 

                         let searchedSubSamplebefore=inputData.masterData["RESelectedSubSample"].map(x=>x.ntransactionsamplecode);
                         searchedSubSample= inputData.masterData["RESelectedSubSample"].filter(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                         let searchedSubSampleaftere=searchedSubSample.map(x=>x.ntransactionsamplecode);
                         let unwantedSamplecode=  searchedSubSamplebefore.filter(function (x) {
                            return !searchedSubSampleaftere.some(function (y) { 
                              return x  === y 
                            })
                          });  
                          inputData.masterData["searchedSubSample"]=inputData.masterData["searchedSubSample"].filter(item => !unwantedSamplecode.includes(item.ntransactionsamplecode)) 
                      }else{
                        boolSelectedSubSample=RE_SUBSAMPLE.some(objx=>backfrontTest.some(objy=>objx['ntransactionsamplecode']===objy['ntransactionsamplecode'])) 
                      }
                   
                    if(inputData.masterData["searchedSubSample"]//&&inputData.masterData["searchedSubSample"].length>0
                    ){
                        RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :
                        inputData.masterData["searchedSubSample"][0]? [inputData.masterData["searchedSubSample"][0]]:[]
                    }else{
                        RESelectedSubSample = boolSelectedSubSample ?inputData.masterData["RESelectedSubSample"] :  [RE_SUBSAMPLE[0]]
                    } 
                    // let RESelectedTest1 = filterRecordBasedOnTwoArrays(inputData.masterData["RESelectedTest"], acceptList, "ntransactiontestcode");
                    // let RESelectedTest2 = updatedObjectWithNewElement(RESelectedTest1, responseData.RESelectedTest)
                    // RESelectedTest2 = replaceUpdatedObject(responseData["RE_TEST"], inputData.masterData.RE_TEST, 'ntransactiontestcode')

                    let searchedSample = undefined;
                    if (inputData.masterData["searchedSample"]) {
                        searchedSample = filterRecordBasedOnTwoArrays(inputData.masterData["searchedSample"], RE_SAMPLE, "npreregno");
                     searchedSample=searchedSample.length>0?searchedSample:inputData.masterData["searchedSample"];
                    }

                    let masterData = {
                        // ...inputData.masterData,
                        // //...responseData,
                        // //RE_SAMPLE,
                        // //RE_SUBSAMPLE,
                        // //RESelectedSubSample,
                        // searchedSample,
                        // RE_TEST:replaceUpdatedObject(responseData["RE_TEST"], inputData.masterData.RE_TEST, 'ntransactiontestcode')
                        // //RESelectedSample,
                        // //RESelectedTest: RESelectedTest2,
                        // //RE_TEST: responseData["RE_TEST"]
                        ...inputData.masterData,
                        ...responseData,
                        RE_SAMPLE,
                        RE_SUBSAMPLE,
                        RESelectedSubSample,
                        searchedSample,
                        RESelectedSample,
                        RESelectedTest:inputData.masterData["searchedTest"]&&
                        inputData.masterData["searchedTest"].length>0?[inputData.masterData["searchedTest"][0]]: responseData.RESelectedTest,
                        // ALPD-3513
                        // commed for Result entry: When initiate the test, list allignment issue occurs
                        // RE_TEST: responseData["RE_TEST"]
                        // RE_TEST: responseRE_TEST
                        //ALPD-3425
                        RE_TEST
                    }
                    if(inputData.masterData["searchedTest"]&&responseData["RE_TEST"]){
                        let respObject1={masterData:masterData};
                        dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject1))
                    // inputData.masterData["searchedTest"]= getSameRecordFromTwoArrays(inputData.masterData["searchedTest"],responseData["RE_TEST"],"ntransactiontestcode");
                    }
                    let skipInfo = {};
                    if (masterData.RE_SAMPLE && masterData.RE_SAMPLE.length <= inputParam.skip) {
                        skipInfo = {
                            ...skipInfo,
                            skip: 0,
                            take: inputParam.take
                        }
                    }
                    if (masterData.RE_TEST && masterData.RE_TEST.length <= inputParam.testskip) {
                        skipInfo = {
                            ...skipInfo,
                            testskip: 0,
                            testtake: inputParam.testtake
                        }
                    }
                    if (inputData[dataStateName] && masterData[activeName] && masterData[activeName].length <= inputData[dataStateName].skip) {

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
                    let respObject = {
                        ...inputParamData.inputData,
                        openModal: false,
                        loadEsign: false,
                        showConfirmAlert: false,
                        //selectedRecord: undefined,
                        loading: false,
                        screenName: inputData.activeTestKey,
                        ...skipInfo
                    }
                    if (searchedSample// && RESelectedSample.length === 0 
                        && searchedSample.length > 0) {
                        if(RESelectedSample.length === 0 || RE_SUBSAMPLE.length == 0){
                            const paramList = inputParam.postParamList[0];
                            const inputParameter = {
                                ...paramList.fecthInputObject.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(searchedSample[0][paramList.primaryKeyField]),
                                ntype: 2,
                                nflag: 2
                            };
                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSample: [searchedSample[0]]
                                }
                            }
                          //  dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        } else {
                            respObject = {
                                ...respObject,
                                masterData
                            };
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    ...respObject,
                                    loading: false
                                }
                            });
                        }
                    } else if (!searchedSample && RE_SAMPLE.length > 0) {
                        let inputParameter
                        // let paramList = inputParam.postParamList[0];
                        // let inputParameter = {
                        //     ...paramList.fecthInputObject.fecthInputObject,
                        //     fetchUrl: paramList.fetchUrl,
                        //     [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                        //     ntype: 2,
                        //     nflag: 2
                        // };
                        // respObject = {
                        //     ...respObject,
                        //     masterData: {
                        //         ...masterData,
                        //         RESelectedSample: [RE_SAMPLE[0]]
                        //     }
                        // }

                        if(RESelectedSample.length === 0 || RE_SUBSAMPLE.length == 0)
                        {
                            onlySampleService=true;
                            let paramList = inputParam.postParamList[0];
                            inputParameter = {
                                ...paramList.fecthInputObject.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SAMPLE[0][paramList.primaryKeyField]),
                                ntype: 2,
                                nflag: 2
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSample: [RE_SAMPLE[0]]
                                }
                            }
                           // dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        }

                        if(boolSelectedSubSample===false?(boolSelectedSubSample===false&&onlySampleService===false&&RESelectedSubSample.length !== 0
                            //&&!searchedSubSample
                            )
                        :(RESelectedSubSample.length === 0 && RE_SUBSAMPLE.length > 0))
                        {
                            let paramList = inputParam.postParamList[1];
                            inputParameter = {
                                ...paramList.fecthInputObject,
                                fetchUrl: paramList.fetchUrl,
                                [paramList.primaryKeyField]: String(RE_SUBSAMPLE[0][paramList.primaryKeyField]),
                                ntype: 3,
                                nflag: 3
                            };

                            respObject = {
                                ...respObject,
                                masterData: {
                                    ...masterData,
                                    RESelectedSubSample: [RE_SUBSAMPLE[0]]
                                }
                            }
                          //  dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                            dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: checkBoxOperation.SINGLESELECT }, respObject));
                        }
                        // if(RESelectedTest.length === 0)
                        // {
                        //     let paramList = inputParam.postParamList[2];
                        //     inputParameter = {
                        //         ...paramList.fecthInputObject,
                        //         fetchUrl: paramList.fetchUrl,
                        //         [paramList.primaryKeyField]: String(RE_TEST[0][paramList.primaryKeyField]),
                        //         ntype: 3,
                        //         nflag: 3
                        //     };

                        //     respObject = {
                        //         ...respObject,
                        //         masterData: {
                        //             ...masterData,
                        //             RESelectedTest: [RE_TEST[0]]
                        //         }
                        //     }
                        //     dispatch(fetchSelectedData({ ...inputParameter, checkBoxOperation: 3 }, respObject));
                        // }
                        else {
                            respObject = {
                                ...respObject,
                                masterData
                            };
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    ...respObject,
                                    loading: false
                                }
                            });
                        }


                    } else {
                        respObject = {
                            ...respObject,
                            masterData
                        };
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                ...respObject,
                                loading: false
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
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOINITIATE"
        }));
    }

}
//Compare two array and return the first array which is available in second array
export function compareTwoArray(firstArray, secondArray, PrimaryKey) {
    const filterArray = firstArray.filter(function (x) {
        return secondArray.some(function (y) {
            return x[PrimaryKey] === y[PrimaryKey]
        })
    });
    return filterArray;
}

function fetchSelectedData(inputParam, respObject) {
    return (dispatch) => {
        delete(inputParam.searchTestRef);
        rsapi().post(inputParam.fetchUrl, {
            ...inputParam
        })
            .then(response => {

                if (response.data.RE_SUBSAMPLE && response.data.RE_SUBSAMPLE.length > 0)
                {
                    sortData(response.data.RE_SUBSAMPLE,'descending', 'ntransactionsamplecode');
                }
                sortData(response.data.RE_TEST,'ascending', 'ntransactionresultcode');
                const masterData = {
                    ...respObject.masterData,
                    ...response.data,
                    RESelectedSample: response.data.RESelectedSample || respObject.masterData.RESelectedSample || []
                };
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        ...respObject,
                        masterData,
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
            });
    }
}


export function testMethodSourceEdit(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.test.ntransactiontestcode,
            ntestgrouptestcode: inputData.test.ntestgrouptestcode,
            ntestcode: inputData.test.ntestcode,
            ncontrolcode: inputData.editSourceMethodId,
            userinfo: inputData.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getTestMethodSource", inputParamData)
            .then(response => {

                const TagSource = constructOptionList(response.data.SourceData || [], "nsourcecode",
                    "ssourcename", undefined, undefined, undefined);
                const TagListSource = TagSource.get("OptionList");

                const TagMethod = constructOptionList(response.data.MethodData || [], "nmethodcode",
                    "smethodname", undefined, undefined, undefined);
                const TagListMethod = TagMethod.get("OptionList");


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            SourceData: TagListSource,
                            MethodData: TagListMethod,
                            RESelectedSubSample: inputData.masterData.RESelectedSubSample
                        },
                        selectedRecord: {
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            stestsynonym: inputData.test.jsondata.stestsynonym,
                            nsourcecode: response.data.SourceDataValue,
                            nmethodcode: response.data.MethodDataValue
                        },
                        loading: false,
                        screenName: "IDS_TESTMETHODSOURCE",
                        openModal: true,
                        operation: "update",
                        ncontrolcode: inputData.editSourceMethodId
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

export function updateParameterComments(inputData, masterData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactiontestcode: inputData.ntransactiontestcode,
            ntransactionresultcode: inputData.ntransactionresultcode,
            sresultcomment: inputData.sresultcomment,
            transactiontestcode: inputData.transactiontestcode,
            userinfo: inputData.userinfo,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            ncontrolcode: inputData.ncontrolcode,
            nneedReceivedInLab:inputData.nneedReceivedInLab
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/updateParameterComments", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data
                        },
                        loading: false,
                        loadEsign: false,
                        screenName: "IDS_RESULT",
                        openModal: false,
                        operation: "update",
                        ncontrolcode: inputData.ncontrolcode
                        //ncontrolcode:inputData.editSourceMethodId
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


export function addREInstrument(inputData) {
    return function (dispatch) {

        let urlArray = [];
        const resultusedinstrument = rsapi().post("resultentrybysample/getResultUsedInstrumentNameCombo", {
//ALPD-5953
//Result Entry -->Instrument ID is not loading initially while adding instrument.       
userinfo: inputData.userInfo,ntestgrouptestcode:inputData.test.ntestgrouptestcode
        });
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        const UTCtimeZoneService = rsapi().post("timezone/getLocalTimeByZone", { userinfo: inputData.userInfo });
        urlArray = [resultusedinstrument, timeZoneService, UTCtimeZoneService];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                const TagInstrumentName = constructOptionList(response[0].data.InstrumentName || [], "ninstrumentnamecode",
                    "sinstrumentname", undefined, undefined, undefined);
                const TagListInstrumentName = TagInstrumentName.get("OptionList");


                const TagInsturmentcategory = constructOptionList(response[0].data.InstrumentCategory || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, undefined);
                const TagListInstrumentCategory = TagInsturmentcategory.get("OptionList");

                //ALPD-5953
                //Result Entry -->Instrument ID is not loading initially while adding instrument.     
                 const TagInstrumentId = constructOptionList(response[0].data.InstrumentId || [], "ninstrumentcode",
                                            "sinstrumentid", undefined, undefined, undefined);
                const TagListInstrumentId = TagInstrumentId.get("OptionList")

                const TagTimeZone = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, undefined);
                const TagListTimeZone = TagTimeZone.get("OptionList")

                dispatch({


                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            InstrumentName: TagListInstrumentName,
                            InstrumentCategory: TagListInstrumentCategory,
                            InstrumentId: TagListInstrumentId || []    //  ALPD-5585   Added empty array by Vishakh for Instrument ID issue
                        },
                        selectedId: null,
                       // selectedRecord
                       selectedRecordInstrumentForm : {
                            sarno: inputData.test.sarno,
                            ssamplearno: inputData.test.ssamplearno,
                            stestsynonym: inputData.test.stestsynonym,
                            transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            ninstrumentcatcode: TagInsturmentcategory.get("DefaultValue") ? TagInsturmentcategory.get("DefaultValue") : [],
                            ninstrumentnamecode: TagInstrumentName.get("DefaultValue") ? TagInstrumentName.get("DefaultValue") : [],
                          //ALPD-5953
                            //Result Entry -->Instrument ID is not loading initially while adding instrument.     
                            ninstrumentcode:TagInstrumentId.has('DefaultValue') && TagInstrumentId.get("DefaultValue") ? TagInstrumentId.get("DefaultValue") : [],
                            npreregno: inputData.test.npreregno,
                            //dtodate: new Date(response[2].data),//new Date(),
                            dtodate: rearrangeDateFormat(inputData.userInfo, response[2].data?.date),//new Date(),
                            //dfromdate: new Date(response[2].data),//new Date(),
                            dfromdate: rearrangeDateFormat(inputData.userInfo, response[2].data?.date),//new Date(),
                            ntzfromdate: {
                                "value": inputData.userInfo.ntimezonecode,
                                "label": inputData.userInfo.stimezoneid
                            },
                            ntztodate: {
                                "value": inputData.userInfo.ntimezonecode,
                                "label": inputData.userInfo.stimezoneid
                            }
                        },
                        timeZoneList: TagListTimeZone || [],
                        loading: false,
                        screenName: "IDS_INSTRUMENT",
                        openModal: true,
                        operation: "create",
                        isInstrumentInitialRender:true,
                        //activeTestKey: "IDS_INSTRUMENT",
                        ncontrolcode: inputData.addResultUsedInstrumentId
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
export function addREMaterial(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultUsedMaterialCombo", { userinfo: inputData.userInfo, nsectioncode: inputData.test.nsectioncode, ntestgrouptestcode: inputData.test.ntestgrouptestcode })
            .then(response => {
                const materialTypeMap = constructOptionList(response.data.MaterialType || [], "nmaterialtypecode", "smaterialtypename", undefined, undefined, undefined);
                const materialType = materialTypeMap.get("OptionList");
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCat = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        //selectedRecord
                        selectedRecordMaterialForm : {
                            ntestgroupmaterial : transactionStatus.YES,
                            sarno: inputData.test.sarno,
                            ssamplearno: inputData.test.ssamplearno,
                            stestsynonym: inputData.test.stestsynonym,
                            nsectioncode: inputData.test.nsectioncode,
                            ssectionname: inputData.test.ssectionname,
                            transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            npreregno: inputData.test.npreregno,
                            nmaterialtypecode: materialTypeMap.get("DefaultValue"),
                            nmaterialcatcode: materialCatMap.get("DefaultValue"),
                            nmaterialcode: materialMap.get("OptionList").length > 0 ? materialMap.get("OptionList")[0] : "",
                            nmaterialinventorycode: materialInventoryMap.get("OptionList").length > 0 ? materialInventoryMap.get("OptionList")[0] : "",
                            sunitname: response.data.MaterialInventory !== undefined ? response.data.MaterialInventory[0].sunitname : "",
                            savailablequantity: response.data.MaterialInventory !== undefined ? response.data.MaterialInventory[0].savailablequatity : ""
                        },
                        isMaterialInitialRender:true,
                        materialType,
                        materialCat,
                        material,
                        materialInventory,
                        loading: false,
                        screenName: "IDS_MATERIAL",
                        openModal: true,
                        operation: "create",
                        //activeTestKey: "IDS_INSTRUMENT",
                        ncontrolcode: inputData.addResultUsedMaterailId
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

export function getREMaterialComboGet(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultUsedMaterialCombo", { userinfo: inputData.userInfo, nsectioncode: inputData.test.nsectioncode, ntestgrouptestcode: inputData.ntestgrouptestcode })
            .then(response => {
                const materialTypeMap = constructOptionList(response.data.MaterialType || [], "nmaterialtypecode", "smaterialtypename", undefined, undefined, undefined);
                const materialType = materialTypeMap.get("OptionList");
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCat = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        selectedRecord: {
                            ntestgroupmaterial : inputData.ntestgroupmaterial,
                            sarno: inputData.test.sarno,
                            ssamplearno: inputData.test.ssamplearno,
                            stestsynonym: inputData.test.stestsynonym,
                            nsectioncode: inputData.test.nsectioncode,
                            ssectionname: inputData.test.ssectionname,
                            transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                            ntransactiontestcode: inputData.test.ntransactiontestcode,
                            npreregno: inputData.test.npreregno,
                            nmaterialtypecode: materialTypeMap.get("DefaultValue") ? materialTypeMap.get("DefaultValue") : "",
                            nmaterialcatcode: materialCatMap.get("DefaultValue") ? materialCatMap.get("DefaultValue") : "",
                            nmaterialcode: materialMap.get("OptionList").length > 0 ? materialMap.get("OptionList")[0] : "",
                            nmaterialinventorycode: materialInventoryMap.get("OptionList").length > 0 ? materialInventoryMap.get("OptionList")[0] : "",
                            sunitname: response.data.MaterialInventory !== undefined ? response.data.MaterialInventory[0].sunitname : "",
                            savailablequantity: response.data.MaterialInventory !== undefined ? response.data.MaterialInventory[0].savailablequatity : ""
                        },
                        materialType,
                        materialCat,
                        material,
                        materialInventory,
                        loading: false,
                        screenName: "IDS_MATERIAL",
                        openModal: true,
                        operation: "create",
                        //activeTestKey: "IDS_INSTRUMENT",
                        //ncontrolcode: inputData.addResultUsedMaterailId
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

export function getREMaterialCategoryByType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getREMaterialCategoryByType", {
            ntestgrouptestcode : inputData.ntestgrouptestcode,
            nmaterialtypecode: inputData.selectedRecord.nmaterialtypecode.value,
            userinfo: inputData.userInfo
        })
            .then(response => {
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCat = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        selectedRecord: {
                            ...inputData.selectedRecord,
                            nmaterialcode:materialMap.get("DefaultValue")|| {},
                            nmaterialinventorycode:materialInventoryMap.get("DefaultValue")|| {},
                            nmaterialcatcode: materialCatMap.get("DefaultValue") || {},
                        },
                        materialCat,
                        material,
                        materialInventory,
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
export function getREMaterialByCategory(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getREMaterialByCategory", {
            ntestgrouptestcode : inputData.ntestgrouptestcode,
            nmaterialtypecode: inputData.selectedRecord.nmaterialtypecode.value,
            nmaterialcatcode: inputData.selectedRecord.nmaterialcatcode.value,
            nsectioncode: inputData.selectedRecord.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        selectedRecord: {
                            ...inputData.selectedRecord,
                            nmaterialcode: materialMap.get("OptionList")[0],
                            nmaterialinventorycode: materialInventoryMap.get("OptionList")[0],
                            savailablequantity: response.data.MaterialInventory ? response.data.MaterialInventory[0].savailablequatity:"",
                            sunitname:response.data.MaterialInventory? response.data.MaterialInventory[0].sunitname :""
                        },
                        material,
                        materialInventory,
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
export function getREMaterialInvertoryByMaterial(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getREMaterialInvertoryByMaterial", {
            ntestgrouptestcode : inputData.ntestgrouptestcode,
            nmaterialcode: inputData.selectedRecord.nmaterialcode.value,
            nsectioncode: inputData.selectedRecord.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        selectedRecord: {
                            ...inputData.selectedRecord,
                            sunitname: response.data.MaterialInventory ? response.data.MaterialInventory[0].sunitname :"",
                            savailablequantity: response.data.MaterialInventory? response.data.MaterialInventory[0].savailablequatity : ""
                        },
                        materialInventory,
                        loading: false,
                        screenName: "IDS_MATERIAL",
                        openModal: true,
                        //operation: "create",
                        //activeTestKey: "IDS_INSTRUMENT",
                        ncontrolcode: inputData.addResultUsedInstrumentId
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
export function getAvailableMaterialQuantity(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getAvailableMaterialQuantity", {
            ntestgrouptestcode : inputData.ntestgrouptestcode,
            nmaterialinventorycode: inputData.selectedRecord.nmaterialinventorycode.value,
            nsectioncode: inputData.selectedRecord.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: null,
                        selectedRecord: {
                            ...inputData.selectedRecord,
                            savailablequantity: response.data.inventory ? response.data.inventory.savailablequatity :"",
                            sunitname: response.data.inventory ? response.data.inventory.sunitname :""
                        },
                        loading: false,
                        screenName: "IDS_MATERIAL",
                        openModal: true,
                        //operation: "create",
                        //activeTestKey: "IDS_INSTRUMENT",
                        ncontrolcode: inputData.addResultUsedInstrumentId
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
export function deleteInstrumentRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedinstrumentcode: inputData.selectedRecord.nresultusedinstrumentcode,
            userinfo: inputData.userInfo,
            ntransactiontestcode: inputData.masterData.RESelectedTest ?
                inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
            nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/deleteResultUsedInstrument", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        loading: false,
                        operation: "delete",
                        openModal: false,
                        loadEsign: false,
                        selectedId : null
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

// export function deleteInstrumentRecord(inputData) {
//     return function (dispatch) {
//         let inputParamData = {
//             nresultusedinstrumentcode: inputData.selectedRecord.nresultusedinstrumentcode,
//             userinfo: inputData.userInfo,
//             ntransactiontestcode: inputData.masterData.RESelectedTest ?
//                 inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
//             nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
//             nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode
//         }
//         dispatch(initRequest(true));
//         rsapi().post("resultentrybysample/deleteResultUsedInstrument", inputParamData)
//             .then(response => {
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: {
//                         masterData: {
//                             ...inputData.masterData,
//                             ...response.data
//                         },
//                         loading: false,
//                         operation: "delete",
//                         openModal: false,
//                         loadEsign: false
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }
// }






export function fetchInstrumentRecord(inputData) {
    return function (dispatch) {

        let urlArray = [];
        //const resultUsedInstrumentCombo = rsapi().post("resultentrybysample/getResultUsedInstrumentCombo", { userinfo: inputData.userInfo });
        const timeZoneService = rsapi().post("resultentrybysample/getResultUsedInstrument", {
            nresultusedinstrumentcode: inputData.editRow.nresultusedinstrumentcode,
            userinfo: inputData.userInfo
        });
        const getResultUsedInstrument = rsapi().post("timezone/getTimeZone");
        urlArray = [timeZoneService, getResultUsedInstrument];

        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {

                const TagInstrumentName = constructOptionList(response[0].data.InstrumentName || [], "ninstrumentnamecode",
                    "sinstrumentname", undefined, undefined, undefined);
                const TagListInstrumentName = TagInstrumentName.get("OptionList");

                const TagInstrumentId = constructOptionList(response[0].data.InstrumentId || [], "ninstrumentcode",
                    "sinstrumentid", undefined, undefined, undefined);
                const TagListInstrumentId = TagInstrumentId.get("OptionList");

                const TagInsturmentcategory = constructOptionList(response[0].data.InstrumentCategory || [], "ninstrumentcatcode",
                    "sinstrumentcatname", undefined, undefined, undefined);
                const TagListInstrumentCategory = TagInsturmentcategory.get("OptionList");

                const TagTimeZone = constructOptionList(response[1].data || [], "ntimezonecode",
                    "stimezoneid", undefined, undefined, undefined);
                const TagListTimeZone = TagTimeZone.get("OptionList")

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            InstrumentName: TagListInstrumentName,
                            InstrumentId:TagListInstrumentId,
                            InstrumentCategory: TagListInstrumentCategory,
                            // ...response[0].data,
                            ...response[1].data,
                            //...response[2].data
                        },
                        selectedId: inputData.editRow.nresultusedinstrumentcode,
                      //  selectedRecord
                        selectedRecordInstrumentForm
                        : {
                            //ALPDJ21-55--Added by Vignesh(12-08-2-2025)-->AR NO. showing the undefined while edit instrument category.
                            sarno:response[0].data.EditResultUsedInstrument[0].sarno,
                            ssamplearno:response[0].data.EditResultUsedInstrument[0].ssamplearno,
                            stestsynonym: inputData.editRow.stestsynonym,
                            npreregno: response[0].data.EditResultUsedInstrument[0].npreregno,
                            ntransactiontestcode: inputData.editRow.ntransactiontestcode,
                            nresultusedinstrumentcode: inputData.editRow.nresultusedinstrumentcode,
                            ninstrumentcatcode: {
                                "value": response[0].data.EditResultUsedInstrument[0].ninstrumentcatcode,
                                "label": response[0].data.EditResultUsedInstrument[0].sinstrumentcatname
                            },
                            ninstrumentnamecode: {
                                "value": response[0].data.EditResultUsedInstrument[0].ninstrumentnamecode,
                                "label": response[0].data.EditResultUsedInstrument[0].sinstrumentname
                            },
                            ninstrumentcode: {
                                "value": response[0].data.EditResultUsedInstrument[0].ninstrumentcode,
                                "label": response[0].data.EditResultUsedInstrument[0].sinstrumentid
                            },
                            ntzfromdate: {
                                "value": response[0].data.EditResultUsedInstrument[0].ntzfromdate,
                                "label": response[0].data.EditResultUsedInstrument[0].stzfromdate
                            },
                            ntztodate: {
                                "value": response[0].data.EditResultUsedInstrument[0].ntztodate,
                                "label": response[0].data.EditResultUsedInstrument[0].stztodate
                            },
                            //dfromdate: new Date(response[0].data.EditResultUsedInstrument[0].sfromdate),
                            //dtodate: new Date(response[0].data.EditResultUsedInstrument[0].stodate)
                            dfromdate: rearrangeDateFormat(inputData.userInfo, response[0].data.EditResultUsedInstrument[0].sfromdate),
                            dtodate: rearrangeDateFormat(inputData.userInfo, response[0].data.EditResultUsedInstrument[0].stodate)
                        },
                        isInstrumentInitialRender:true,
                        timeZoneList: TagListTimeZone || [],
                        ncontrolcode: inputData.ncontrolCode,
                        loading: false,
                        screenName: "IDS_INSTRUMENT",
                        openModal: true,
                        operation: "update"
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

export function fetchMaterialRecord(inputData) {
    return function (dispatch) {



        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultUsedMaterial", {
            nresultusedmaterialcode: inputData.editRow.nresultusedmaterialcode,
            userinfo: inputData.userInfo
        })
            .then(response => {

                const materialTypeMap = constructOptionList(response.data.MaterialType || [], "nmaterialtypecode", "smaterialtypename", undefined, undefined, undefined);
                const materialType = materialTypeMap.get("OptionList");
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCat = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                const EditResultUsedMaterial = response.data.EditResultUsedMaterial[0]
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedId: inputData.editRow.nresultusedinstrumentcode,
                        materialType,
                        materialCat,
                        material,
                        materialInventory,
                        selectedRecord: {
                            ...EditResultUsedMaterial,
                            stestsynonym: inputData.editRow.jsondata.stestsynonym,
                            npreregno: EditResultUsedMaterial.npreregno,
                            ntransactiontestcode: inputData.editRow.ntransactiontestcode,
                            nresultusedinstrumentcode: inputData.editRow.nresultusedinstrumentcode,
                            nmaterialtypecode: {
                                label: EditResultUsedMaterial.jsondata.smaterialtypename,
                                value: EditResultUsedMaterial.nmaterialtypecode
                            },
                            nmaterialcatcode: {
                                "value": EditResultUsedMaterial.nmaterialcategorycode,
                                "label": EditResultUsedMaterial.jsondata.smaterialcatname
                            },
                            nmaterialcode: {
                                "value": EditResultUsedMaterial.nmaterialcode,
                                "label": EditResultUsedMaterial.jsondata.smaterialname,
                            },
                            nmaterialinventorycode: {
                                "value": EditResultUsedMaterial.ninventorycode,
                                "label": EditResultUsedMaterial.jsondata.sinventoryid
                            },
                            ntztodate: {
                                "value": EditResultUsedMaterial.ntztodate,
                                "label": EditResultUsedMaterial.stztodate
                            },
                            susedquantity: EditResultUsedMaterial.jsondata.nqtyused,
                            scarriergas: EditResultUsedMaterial.jsondata.scarriergas,
                            smobilephase: EditResultUsedMaterial.jsondata.smobilephase,
                            sremarks: EditResultUsedMaterial.jsondata.sremarks,
                            savailablequantity: response.data.inventory ?  response.data.inventory.savailablequatity :"",
                            sunitname: response.data.inventory ? response.data.inventory.sunitname :""
                        },
                        ncontrolcode: inputData.ncontrolCode,
                        loading: false,
                        screenName: "IDS_MATERIAL",
                        openModal: true,
                        operation: "update"
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

export function deleteTaskRecord(inputData, userInfo) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedtaskcode: inputData.selectedRecord.nresultusedtaskcode,
            userinfo: inputData.userInfo,
            ntransactiontestcode: inputData.masterData.RESelectedTest ?
                inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
            nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/deleteResultUsedTasks", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        loading: false,
                        operation: "delete",
                        openModal: false,
                        loadEsign: false,
                        selectedId: null
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


export function fetchTaskRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedtaskcode: inputData.editRow.nresultusedtaskcode,
            userinfo: inputData.userInfo,
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultUsedTask", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        selectedId: response.data.EditResultUsedTasks[0].nresultusedtaskcode,
                  //      selectedRecord: {
                    selectedRecordTaskForm:{
                            npreregno: response.data.EditResultUsedTasks[0].npreregno,
                            stestsynonym: inputData.editRow.stestsynonym,
                            sanalysistime: response.data.EditResultUsedTasks[0].jsondata.sanalysistime,
                            smisctime: response.data.EditResultUsedTasks[0].jsondata.smisctime,
                            spreanalysistime: response.data.EditResultUsedTasks[0].jsondata.spreanalysistime,
                            spreparationtime: response.data.EditResultUsedTasks[0].jsondata.spreparationtime,
                            scomments: response.data.EditResultUsedTasks[0].jsondata.scomments,
                            staskprocedure: response.data.EditResultUsedTasks[0].jsondata.staskprocedure,
                            nresultusedtaskcode: response.data.EditResultUsedTasks[0].nresultusedtaskcode
                        },
                        isTaskInitialRender:true,
                        loading: false,
                        screenName: "IDS_TASK",
                        openModal: true,
                        operation: "update",
                        ncontrolcode: inputData.ncontrolcode,
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

export function parameterRecord(inputData) {
    return function (dispatch) {
        let inputParamData = {
            ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
            ntransactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
            ncontrolcode: inputData.controlcode,
            userinfo: inputData.userInfo,
            nneedReceivedInLab:inputData.nneedReceivedInLab
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getParameterComments", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                        },
                        selectedId: response.data.ParameterComments.ntransactionresultcode,
                        selectedRecord: {
                            sresultcomment: response.data.ParameterComments.sresultcomment,
                            stestsynonym: inputData.selectedRecord.stestsynonym,
                            sparametersynonym: inputData.selectedRecord.sparametersynonym,
                            transactiontestcode: response.data.ParameterComments.ntransactiontestcode,
                            ntransactionresultcode: response.data.ParameterComments.ntransactionresultcode,
                            ntransactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                            ncontrolcode: inputData.controlcode
                        },
                        loading: false,
                        screenName: "IDS_PARAMETERCOMMENTS",
                        openModal: true,
                        operation: "updateParameterComments",
                        ncontrolcode: inputData.controlcode
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


export function checkListRecord(inputData) {

    return function (dispatch) {
        let inputParamData = {
            ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
            napprovalparametercode: inputData.selectedRecord.napprovalparametercode,
            nchecklistversioncode: inputData.selectedRecord.nchecklistversioncode,
            ntransactiontestcode: inputData.selectedRecord.ntransactiontestcode.toString(),
            ncontrolcode: inputData.ncontrolcode,
            userinfo: inputData.userInfo,
            nneedReceivedInLab: inputData.nneedReceivedInLab
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getChecklistdesign", inputParamData)
            .then(response => {
                let selectedRecord = {};
                let lsteditedQB = [];
                selectedRecord = {
                    sarno: inputData.selectedRecord.sarno,
                    ssamplearno: inputData.selectedRecord.ssamplearno,
                    npreregno: inputData.selectedRecord.npreregno,
                    stestsynonym: inputData.selectedRecord.stestsynonym,
                    sparametersynonym: inputData.selectedRecord.sparametersynonym,
                    ntransactiontestcode: inputData.selectedRecord.ntransactiontestcode,
                    ntransactionresultcode: inputData.selectedRecord.ntransactionresultcode,
                    transactiontestcode: inputData.masterData.RESelectedTest ? inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",") : ""
                }

                response.data.ChecklistData.map(checklist => {
                    selectedRecord[checklist.nchecklistversionqbcode] = {
                        nchecklistqbcode: checklist.nchecklistqbcode,
                        nchecklistversioncode: checklist.nchecklistversioncode,
                        nchecklistversionqbcode: checklist.nchecklistversionqbcode,
                        sdefaultvalue: checklist.nchecklistcomponentcode ===7  ? rearrangeDateFormat(inputData.userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue,
                      //  sdefaultvalue: checklist.sdefaultvalue,
                        sarno: inputData.selectedRecord.sarno,
                        ssamplearno: inputData.selectedRecord.ssamplearno,
                        stestsynonym: inputData.selectedRecord.stestsynonym,
                        sparametersynonym: inputData.selectedRecord.sparametersynonym,
                    }
                    lsteditedQB.push(checklist.nchecklistversionqbcode);
                    return null;
                });

                response.data.ChecklistData.map(checklist => {
                    selectedRecord['jsondata'] = {
                        ...selectedRecord['jsondata'],
                      //  [checklist.nchecklistversionqbcode]: checklist.sdefaultvalue
                        [checklist.nchecklistversionqbcode]:checklist.nchecklistcomponentcode ===7 ? rearrangeDateFormat(inputData.userInfo,checklist.sdefaultvalue) :checklist.sdefaultvalue

                    }
                    return null;
                });
                selectedRecord["editedQB"] = lsteditedQB;
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        selectedId: response.data.selectedId,
                        selectedRecord: selectedRecord,
                        loading: false,
                        screenName: "IDS_CHECKLISTRESULT",
                        openTemplateModal: true,
                        needSaveButton: inputData.needSaveButton,
                        operation: "create",
                        ncontrolCode: inputData.ncontrolcode
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

export function onSaveCheckList(selectedRecord, userInfo, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode,nneedReceivedInLab) {

    return function (dispatch) {

        let listResultCheckList = [];
        if (selectedRecord && selectedRecord.jsondata) {
            selectedRecord.editedQB.map(qbcode =>
                listResultCheckList.push(selectedRecord[qbcode]))

            let inputParamData = {
                ntransactionresultcode: selectedRecord.ntransactionresultcode,
                ntransactiontestcode: selectedRecord.ntransactiontestcode.toString(),
                transactiontestcode: selectedRecord.transactiontestcode,
                npreregno: selectedRecord.npreregno,
                ResultCheckList: {
                    nchecklistversioncode: listResultCheckList[0].nchecklistversioncode,
                    nchecklistqbcode: listResultCheckList[0].nchecklistqbcode,
                    jsondata: selectedRecord.jsondata,
                    npreregno: selectedRecord.npreregno,
                    ntransactionresultcode: selectedRecord.ntransactionresultcode,
                },
                //jsondata: selectedRecord.jsondata,
                userinfo: userInfo,
                nregtypecode: nregtypecode,
                nregsubtypecode: nregsubtypecode,
                ndesigntemplatemappingcode: ndesigntemplatemappingcode,
                nneedReceivedInLab:nneedReceivedInLab,
                ncontrolcode: -1
            }

            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/createResultEntryChecklist", inputParamData)

                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            selectedRecord: {},
                            templateData: undefined,
                            openTemplateModal: false,
                            openModal: false,
                            loading: false,
                            loadEsign: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            loadEsign: false
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

            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    openTemplateModal: false,
                    selectedRecord: {},
                    loading: false,
                    loadEsign: false
                }
            })
        }
    }
}

export function defaultTest(inputData, RESelectedTest, RESelectedSample, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode) {
    if (RESelectedTest !== undefined && RESelectedTest.length > 0) {
        return function (dispatch) {
            let inputParamData = {
                userinfo: inputData.userinfo,
                ntransactiontestcode: RESelectedTest ? RESelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                ntestgrouptestcode: RESelectedTest ? RESelectedTest.map(test => test.ntestgrouptestcode).join(",") : "",
                npreregno: RESelectedTest ? RESelectedTest.map(preregno => preregno.npreregno).join(",") : "",
                //RESelectedSample ? RESelectedSample.map(preregno => preregno.npreregno).join(",") : "",
                nregtypecode: nregtypecode,
                nregsubtypecode: nregsubtypecode,
                //ndesigntemplatemappingcode:ndesigntemplatemappingcode,
                ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                ncontrolcode: inputData.ncontrolcode,
                nneedReceivedInLab:inputData.nneedReceivedInLab
            }
            dispatch(initRequest(true));
            rsapi().post("resultentrybysample/updateDefaultValue", inputParamData)
                .then(response => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: {
                                ...inputData.masterData,
                                ...response.data,
                                TestParameters: replaceUpdatedObject(response.data.TestParameters, inputData.masterData.TestParameters, 'ntransactionresultcode'),
                                RESelectedSubSample: inputData.masterData.RESelectedSubSample
                            },
                            loading: false,
                            activeTestKey: "IDS_RESULTS",
                            openModal: false,
                            loadEsign: false
                        }
                    })
                })
                .catch(error => {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            openModal: false,
                            loadEsign: false
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
    } else {
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTTESTTOCOMPLETE"
        }));
    }

}

export function getFormula(parameterData, userInfo, masterData, index, selectedRecord, screen) {
    return function (dispatch) {

        let inputParamData = {
            ntransactiontestcode: parameterData.ntransactiontestcode,
            nformulacode: parameterData.ntestgrouptestformulacode,
            userinfo: userInfo,
            npreregno: parameterData.npreregno,
            ntransactionsamplecode: parameterData.ntransactionsamplecode
        }



        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getFormulaInputs", inputParamData)
            .then(response => {

                const validateFormulaMandyFields = response.data.DynamicFormulaFields.map((item, index) => {
                    return {
                        "idsName": "IDS_FILLALLFIELDS",
                        "dataField": index,
                        "mandatory": true
                    }
                });

                let selectedForumulaInput = [];
                let selectedForumulaInput1 = [];
                let selectedMandatory = [];
   //           selectedRecord.ResultParameter = getRecordBasedOnPrimaryKeyName(selectedRecord.ResultParameter, parameterData.ntransactionsamplecode, "ntransactionsamplecode");

                response.data.DynamicFormulaFields.map((fields, index) => {
                    let dynamicformulafields = {};
                    //Modfied the code by sonia on 16th july 2025 for jira id:ALPD-6045
                    let selectedTestParameters = getRecordBasedOnPrimaryKeyName(selectedRecord.ResultParameter, fields.ntestparametercode, "ntestparametercode");

                    if (selectedTestParameters.length > 0) {

                        selectedTestParameters = selectedTestParameters.filter(element => {
                            return element.sresult !== null && element.sresult != ''
                        });

                        const nisaverageneed = selectedTestParameters.length;

                        const maxResultCode = selectedTestParameters.length > 0 ? Math.max(...selectedTestParameters.map(o => o.ntransactionresultcode)) : -1;


                        // const maxResultCode= Math.max(...(selectedTestParameters.filter(element => {
                        //                 return element.sresult !== null && element.sresult !='';
                        //               }).map(o => o.ntransactionresultcode)));

                        const paramValue = getRecordBasedOnPrimaryKeyName(selectedTestParameters, maxResultCode, "ntransactionresultcode");
                        if (paramValue.length == 0) {
                            dynamicformulafields.svalues = "";
                            dynamicformulafields.sparameter = response.data.DynamicFormulaFields[index].sdescription;
                            //dynamicformulafields.nisaverageneed = 0;
                            dynamicformulafields.senableAverage = false;
                            response.data.DynamicFormulaFields[index].nisaverageneed = 0; 
                            selectedForumulaInput.push(dynamicformulafields);
                            selectedMandatory.push("");

                        }
                        else {
                            if ((maxResultCode >= response.data.DynamicFormulaFields[index].ntransactionresultcode && paramValue.length > 0 ? paramValue[0].sresult != "" : false)
                                || (response.data.DynamicFormulaFields[index].svalue != "" && response.data.DynamicFormulaFields[index].svalue != null
                                    ? maxResultCode <= response.data.DynamicFormulaFields[index].ntransactionresultcode && paramValue.length > 0 ? paramValue[0].sresult != "" : false : "")) {                              
                                dynamicformulafields.svalues = paramValue[0].sresult;                             
                                dynamicformulafields.sparameter = response.data.DynamicFormulaFields[index].sdescription;                            
                                //dynamicformulafields.nisaverageneed = nisaverageneed;
                                dynamicformulafields.senableAverage = false;
                                response.data.DynamicFormulaFields[index].nisaverageneed = nisaverageneed; 
                                selectedForumulaInput.push(dynamicformulafields);
                                selectedMandatory.push(paramValue[0].sresult);
                            }
                            else {
                                dynamicformulafields.svalues = response.data.DynamicFormulaFields[index].svalue;
                                dynamicformulafields.sparameter = response.data.DynamicFormulaFields[index].sdescription;
                                // dynamicformulafields.nisaverageneed = response.data.DynamicFormulaFields[index].nisaverageneed;
                                dynamicformulafields.senableAverage = false;
                                selectedForumulaInput.push(dynamicformulafields);
                                selectedMandatory.push(response.data.DynamicFormulaFields[index].svalue);
                            }
                        }

                    }
                    else {
                        dynamicformulafields.svalues = response.data.DynamicFormulaFields[index].svalue;
                        dynamicformulafields.sparameter = response.data.DynamicFormulaFields[index].sdescription;
                        // dynamicformulafields.nisaverageneed = response.data.DynamicFormulaFields[index].nisaverageneed;
                        selectedForumulaInput.push(dynamicformulafields);
                        selectedMandatory.push(response.data.DynamicFormulaFields[index].svalue);
                    }
                    return selectedForumulaInput1.push(selectedRecord.ResultParameter.filter(x => x.ntestparametercode === fields.ndynamicformulafieldcode)[0])


                });

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                        },
                        selectedRecord: {
                            ...selectedRecord,
                            parameterData: parameterData,
                            naverageroundingdigits: parameterData.nroundingdigits,
                            sformulacalculationdetail: response.data.query,
                            formulainput: response.data.Formula,
                            resultindex: index,
                            DynamicFormulaFields: response.data.DynamicFormulaFields,
                            //selectedForumulaInput: []
                            //  DynamicFormulaFields.map((fields, index) => {
                            //     return {
                            //         selectedForumulaInput:  selectedRecord.ResultParameter.filter(x=>x.ntestparametercode===response.data.DynamicFormulaFields)

                            //     }

                            //  });
                            // response.data.DynamicFields.map((fields, index) =>
                            selectedForumulaInput,
                            selectedMandatory
                            // selectedForumulaInput:  selectedRecord.ResultParameter.filter(x=>x.ntestparametercode===response.data.DynamicFormulaFields)
                            // )
                        },
                        validateFormulaMandyFields,
                        loading: false,
                        screenName: "IDS_RESULTFORMULA",
                        //ALPDJ21-118 - Suriaprahash & Subashini.L - Grid Based Result Entry -30/09/2025
                        resultEntryScreenType:screen,
                        showFormula: true,
                        operation: "validate",
                        showValidate: true
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

export function calculateFormula(inputDataValue, screen) {
    return function (dispatch) {
        const inputData = {
            ntransactiontestcode: inputDataValue.selectedRecord.parameterData.ntransactiontestcode,
            ntransactionresultcode: inputDataValue.selectedRecord.parameterData.ntransactionresultcode,
            npreregno: inputDataValue.selectedRecord.parameterData.npreregno,
            sformulacalculationcode: inputDataValue.selectedRecord.sformulacalculationdetail,
            nformulacode: inputDataValue.selectedRecord.parameterData.ntestgrouptestformulacode,
            userinfo: inputDataValue.userInfo,
            dynamicformulafields: inputDataValue.lstDynamicFields,
        }

        dispatch(initRequest(true));
        rsapi().post("testmaster/calculateFormula", inputData)
            .then(response => {

                // inputDataValue.selectedResultData[inputDataValue.selectedRecord.resultindex] =
                // {
                //     ntransactionresultcode: inputDataValue.selectedRecord.parameterData.ntransactionresultcode,
                //     ntransactiontestcode: inputDataValue.selectedRecord.parameterData.ntransactiontestcode,
                //     nparametertypecode: inputDataValue.selectedRecord.parameterData.nparametertypecode,
                //     sresult: response.data.Result,
                //     nroundingdigit: inputDataValue.selectedRecord.parameterData.nroundingdigits,
                //     value: inputDataValue.selectedRecord.parameterData.ngradecode,
                //     parameter: inputDataValue.selectedRecord.parameterData
                // }
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["sfinal"] = response.data.Result;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["sresult"] = response.data.Result;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]['editable'] = true;
                inputDataValue.ResultParameter[inputDataValue.selectedRecord.resultindex]["ncalculatedresult"] = 3;
                inputDataValue.selectedResultGrade[inputDataValue.selectedRecord.resultindex] = {
                    ngradecode: numericGrade(inputDataValue.selectedRecord.parameterData, parseInt(response.data.Result))
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputDataValue.masterData,
                            //selectedResultData: inputDataValue.selectedResultData,
                            //selectedResultGrade: inputDataValue.selectedResultGrade,
                            //ResultParameter: inputDataValue.ResultParameter
                        },
                        selectedRecord: {
                            selectedResultGrade: inputDataValue.selectedResultGrade,
                            ResultParameter: inputDataValue.ResultParameter
                        },
                          parameterResults:inputDataValue.ResultParameter,
                        isParameterInitialRender:true,
                        loading: false,
                        //screenName: "IDS_RESULTENTRY",
                        //ALPDJ21-118 - Suriaprahash & Subashini.L - Grid Based Result Entry -30/09/2025
                        screenName: screen === "IDS_RESULTENTRYTABLE" ? "IDS_RESULTENTRYTABLE" : "IDS_RESULTENTRY",
                        showFormula: false,
                        operation: "update",
                        showValidate: false
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
                } else {
                    //toast.warn(error.response.data);
                    toast.warn(error.response.data["Result"]);
                }
            })
    }
}

export function getREFilterTestData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getTestBasedOnCombo", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultFilterStatus: inputData.defaultFilterStatus,
                            defaultRegistrationSubType: inputData.masterData.defaultRegistrationSubType,//inputData.defaultRegistrationSubType,
                            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                            DesignTemplateMappingValue: inputData.DesignTemplateMappingValue
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

export function getREFilterTemplate(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getTestBasedOnCombo", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
                            defaultRegistrationSubType: inputData.masterData.defaultRegistrationSubType,//inputData.defaultRegistrationSubType,
                            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
                            DesignTemplateMappingValue: inputData.DesignTemplateMappingValue
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

export function updateTestMethodSource(inputData, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/updateTestMethodSource", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            RE_TEST: replaceUpdatedObject(response.data.RE_TEST, masterData.RE_TEST, 'ntransactiontestcode')
                        },
                        loading: false,
                        openModal: false,
                        loadEsign: false

                        // activeTestKey: "IDS_RESULTS"
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


export function resultImportFile(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getImportResultEntry",inputParam.formData)
            .then(response => {


                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData
                        },
                        loading: false,
                        openModal: false,
                        // activeTestKey: "IDS_RESULTS"
                    }
                })

                if (response.data.returnStatus && response.data.returnStatus !== "") {
                    toast.info(intl.formatMessage({ id: response.data.returnStatus }));
                }
                else {
                    toast.warn(intl.formatMessage({ id: response.data.returnStatus}));
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
    }
}

export function validateEsignCredentialComplete(inputParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        return rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {



                    const methodUrl = "performaction"
                    inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;

                    if (inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()] &&
                        inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]) {
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignreason"];
                        delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"];
                    }
                    if (inputParam["screenData"]["inputParam"]["operation"] === "testinitiate") {
                        dispatch(testStart(inputParam["screenData"]["inputParam"], inputParam["screenData"]["inputParam"]["RESelectedTest"], inputParam.inputData.userinfo))
                    }
                    else if (inputParam["screenData"]["inputParam"]["operation"] === "complete") {
                        dispatch(completeTest(inputParam["screenData"]["inputParam"], inputParam["screenData"]["inputParam"]["RESelectedTest"], inputParam.inputData.userinfo,'','',{basedrulesengine:inputParam["screenData"]["inputParam"]["basedrulesengine"]}))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "default") {
                        dispatch(defaultTest(inputParam["screenData"]["inputParam"]["testChildGetREParam"], inputParam["screenData"]["inputParam"]["RESelectedTest"], inputParam["screenData"]["inputParam"]["RESelectedSample"], inputParam["screenData"]["inputParam"]["inputData"]["nregtypecode"], inputParam["screenData"]["inputParam"]["inputData"]["nregsubtypecode"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "deleteInstrument") {
                        dispatch(deleteInstrumentRecord(inputParam["screenData"]["inputParam"]["inputData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "createMethod") {
                        dispatch(updateTestMethodSource(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["inputParam"]["masterData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "deleteTask") {
                        dispatch(deleteTaskRecord(inputParam["screenData"]["inputParam"]["inputData"]))
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "updateParameterComments") {
                        dispatch(updateParameterComments(inputParam["screenData"]["inputParam"]["inputData"], inputParam["screenData"]["inputParam"]["masterData"]))
                    } else if (inputParam["screenData"]["operation"] === "updatechecklist") {
                        let { selectedRecord, userInfo, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode,nneedReceivedInLab } = inputParam["screenData"];
                        delete selectedRecord.esignpassword;
                        delete selectedRecord.esigncomments;
                        delete selectedRecord.esignreason;
                        delete selectedRecord.agree;
                        delete inputParam.inputData.password;
                        userInfo = inputParam.inputData.userinfo;
                        dispatch(onSaveCheckList(selectedRecord, userInfo, nregtypecode, nregsubtypecode, ndesigntemplatemappingcode,nneedReceivedInLab))
                    }
		//ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
                    else if(inputParam["screenData"]["inputParam"]["operation"] ==="updateSection"){
                        dispatch(updateSectionTest(inputParam["screenData"]["inputParam"]))
 
                    }
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

export function getMeanCalculationTestParameter(meanParam) {
    return (dispatch) => {
        dispatch(initRequest(true));
        const inputData = {
            npreregno: meanParam.selectedRecord.npreregno,
            ntransactionresultcode: meanParam.selectedRecord.ntransactionresultcode,
            userinfo: meanParam.userInfo
        }
        return rsapi().post("resultentrybysample/getMeanCalculationTestParameter", inputData)
            .then(response => {

                const list = response.data || [];
                // const optionList = [];
                // list.map(item=>{
                //     console.log("item:", item);
                //         optionList.push({item:item, 
                //                         label:"["+item.stestsynonym+"]-["+item.sparametersynonym+"]-["+item.sresult+"]", 
                //                         value:item.ntransactionresultcode})
                //     })
                // const masterData = {...masterData, ResultParameter:meanParam.selectedRecord}
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        loading: false, openModal: true,
                        meanTestParameterList: list,
                        screenName: "IDS_MEANPARAMETER",
                        ncontrolcode: meanParam.ncontrolCode,
                        selectedTestParameterMean: meanParam.selectedRecord
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
    };
}

/*export function deleteResultUsedMaterial(inputData) {
    return function (dispatch) {
        let inputParamData = {
            nresultusedinstrumentcode: inputData.selectedRecord.nresultusedinstrumentcode,
            userinfo: inputData.userInfo,
            ntransactiontestcode: inputData.masterData.RESelectedTest ?
                inputData.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
            nregtypecode: inputData.masterData.defaultRegistrationType.nregtypecode,
            nregsubtypecode: inputData.masterData.defaultRegistrationSubType.nregsubtypecode
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/deleteResultUsedMaterial", inputParamData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data
                        },
                        loading: false,
                        operation: "delete",
                        openModal: false,
                        loadEsign: false
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
}*/
export function getAverageResult(parameterData, index, selectedForumulaInput, userInfo, masterData, selectedRecord) {
    return function (dispatch) {
    
        let selectedTestParameters = selectedRecord.ResultParameter.filter(element => {
            return element.editable == true;
        });

        selectedTestParameters = getRecordBasedOnPrimaryKeyName(selectedTestParameters, selectedRecord.parameterData.ntransactionsamplecode, "ntransactionsamplecode");
        selectedTestParameters = getRecordBasedOnPrimaryKeyName(selectedTestParameters, parameterData.ndynamicformulafieldcode, "ntestparametercode");

        let ResultParameterNew = [];
        if (selectedTestParameters.length > 0) {
            selectedTestParameters.map(Parameter => {
                let resultParameterValues = {};
                resultParameterValues.ntransactionresultcode = Parameter.ntransactionresultcode;
                resultParameterValues.sresult = Parameter.sresult;
                resultParameterValues.ntestparametercode = Parameter.ntestparametercode;
                ResultParameterNew.push(resultParameterValues);
            })

        }

        let inputParamData = {
            naverageroundingdigits: selectedRecord.naverageroundingdigits,
            ntransactiontestcode: parameterData.ntransactiontestcode,
            ntestparametercode: parameterData.ndynamicformulafieldcode,
            userinfo: userInfo,
            ntransactionsamplecode: parameterData.ntransactionsamplecode,
            ResultParameter: ResultParameterNew
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getAverageResult", inputParamData)
            .then(response => {
                selectedForumulaInput[index].soldvalue =  selectedForumulaInput[index].svalues;
                selectedForumulaInput[index].svalues = response.data.AverageResult.sresult;
                selectedForumulaInput[index].senableAverage = true;
                //selectedForumulaInput[index].svaluesold = 

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                        },
                        selectedRecord: {
                            ...selectedRecord,
                            selectedForumulaInput
                        },
                        // selectedRecord: {
                        //     ...selectedRecord,
                        //     parameterData: parameterData,
                        //     sformulacalculationdetail: response.data.query,
                        //     formulainput: response.data.Formula,
                        //     resultindex: index,
                        //     selectedForumulaInput,
                        //     selectedMandatory
                        // },
                        // validateFormulaMandyFields,
                        loading: false,
                        screenName: "IDS_RESULTFORMULA",
                        showFormula: true,
                        operation: "validate",
                        showValidate: true
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


// export function getPredefinedData(inputData,selectedRecord,currentAlertResultCode,masterData,currentntestgrouptestpredefcode) {
//     return function (dispatch) {
//         let inputParamData = {
//             ntestgrouptestpredefcode: inputData.ntestgrouptestpredefcode,
//         }
//         dispatch(initRequest(true));
//         rsapi().post("resultentrybysample/getPredefinedData", inputParamData)
//             .then(response => {
//                 let showMultiSelectCombo=false;  
//                 let ResultParameter=selectedRecord['ResultParameter']
//                 let onlyAlertMsgAvailable=false; 
//                 let testgrouptestpredefsubresult=response.data['testgrouptestpredefsubresult']
//                 if(inputData['nneedsubcodedresult']===transactionStatus.YES){
//                     showMultiSelectCombo=true
//                     masterData['testgrouptestpredefsubresultOptions']=testgrouptestpredefsubresult  
//                 }
//                 else
//                 {
//                     onlyAlertMsgAvailable=true; 
//                 }
//                // ResultParameter.map(Parameter=>
//                     for(const Parameter of ResultParameter) 
//                     {
//                         if(Parameter.additionalInfoUidata||Parameter.additionalInfoUidata===""){
//                             let additionalInfoUidata=typeof Parameter.additionalInfoUidata==='string'?Parameter.additionalInfoUidata===""?"":JSON.parse(Parameter.additionalInfoUidata) :
//                             Parameter.additionalInfoUidata
//                             if(Parameter['ntransactionresultcode']===currentAlertResultCode&&
//                             Parameter['ntestgrouptestpredefcode']===inputData['ntestgrouptestpredefcode']){
//                             if(Parameter.additionalInfoUidata){
//                                 selectedRecord["ntestgrouptestpredefsubcode"]=additionalInfoUidata['ntestgrouptestpredefsubcode'] 
//                                 break;
//                             }
//                             }else{
//                             if(selectedRecord["ntestgrouptestpredefsubcode"]){
//                                 delete selectedRecord["ntestgrouptestpredefsubcode"] 
//                             }
//                             }
//                         }
                       
//                     };  
//                 masterData['salertmessage']=inputData.salertmessage 
//                 dispatch({
//                     type: DEFAULT_RETURN,
//                     payload: { 
//                         loading: false,
//                         masterData, 
//                         showAlertGrid: inputData.nneedresultentryalert===transactionStatus.NO?false:true,
//                          showAlertForPredefined: true,
//                          showMultiSelectCombo,
//                          onlyAlertMsgAvailable,
//                          additionalInfoView:false,
//                          selectedRecord,
//                          currentAlertResultCode,
//                          currentntestgrouptestpredefcode
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
//            payload: {
//              navigation: 'forbiddenaccess',
//              loading: false,
//            }
//          });
//        } else if (error.response.status === 500) {
//                     toast.error(error.message);
//                 } else {
//                     toast.warn(error.response.data);
//                 }
//             })
//     }

// }

export function getPredefinedData(inputData,selectedRecord,currentAlertResultCode,masterData,currentntestgrouptestpredefcode) {
    return function (dispatch) {
        let inputParamData = {
            ntestgrouptestpredefcode: inputData.ntestgrouptestpredefcode,
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getPredefinedData", inputParamData)
            .then(response => {
                let showMultiSelectCombo=false;  
                let ResultParameter=selectedRecord['ResultParameter']
                let onlyAlertMsgAvailable=false; 
                let testgrouptestpredefsubresult=response.data['testgrouptestpredefsubresult']
                if(inputData['nneedsubcodedresult']===transactionStatus.YES){
                    showMultiSelectCombo=true
                    masterData['testgrouptestpredefsubresultOptions']=testgrouptestpredefsubresult  
                }
                else
                {
                    onlyAlertMsgAvailable=true; 
                }
               // ResultParameter.map(Parameter=>
                    for(const Parameter of ResultParameter) 
                    {
                        if(Parameter.additionalInfoUidata||Parameter.additionalInfoUidata===""){
                            let additionalInfoUidata=typeof Parameter.additionalInfoUidata==='string'?Parameter.additionalInfoUidata===""?"":JSON.parse(Parameter.additionalInfoUidata) :
                            Parameter.additionalInfoUidata
                            if(Parameter['ntransactionresultcode']===currentAlertResultCode&&
                            Parameter['ntestgrouptestpredefcode']===inputData['ntestgrouptestpredefcode']){
                            if(Parameter.additionalInfoUidata){
                                selectedRecord["ntestgrouptestpredefsubcode"]=additionalInfoUidata['ntestgrouptestpredefsubcode'] 
                                break;
                            }
                            }else{
                            if(selectedRecord["ntestgrouptestpredefsubcode"]){
                                delete selectedRecord["ntestgrouptestpredefsubcode"] 
                            }
                            }
                        }
                       
                    };  
                masterData['salertmessage']=inputData.salertmessage 
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: { 
                        loading: false,
                       masterData, 
                        showAlert: inputData.nneedresultentryalert===transactionStatus.NO?false:true,
                         showAlertForPredefined: true,
                         showMultiSelectCombo,
                         onlyAlertMsgAvailable,
                         additionalInfoView:false,
                         selectedRecord,
                         currentAlertResultCode,
                         currentntestgrouptestpredefcode
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


export function getELNTestValidation(inputData,integrationSettings) {
    return function (dispatch) {
        //console.log(localStorage);
        //localStorage.removeItem("linkedorder");
        const inputs = {npreregno:inputData.test.npreregno, 
            ntransactiontestcode:inputData.test. ntransactiontestcode,
            userInfo:inputData.userInfo

        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getELNTestValidation", inputs)
            .then(response => {
                let enlLink = "";
                if(response.data.isEmptySheet)
                {
		//ALPD-5594--Added by Vignesh R(21-03-2025)-->SMTL > Result entry > open ELN sheet displayed empty page, it occurs when open the ELN sheet for run batch test, check description
                    if(response.data.isBatch){
                        let link = "";
                    
                        let detail = CF_encryptionData("-1//Sheet").EncryptData;
                        // let encryptedbatchid = CF_encryptionData(inputData.test.npreregno +'-' +inputData.test.ntransactionsamplecode +'-' + inputData.test.ntestcode +'-' + inputData.userInfo.nsitecode).EncryptData;
                        //let encryptedbatchid = CF_encryptionData("TR-23-0014-TR-23-0014-01-TestNew").EncryptData;
                       // let encryptedbatchid = CF_encryptionData(inputData.test.sarno +'-' +inputData.test.ssamplearno +'-'+ inputData.test.stestsynonym+'-'+inputData.userInfo.ssitename).EncryptData;
                       
                       const settedId = inputData.test.npreregno +'-' +inputData.test.ntransactionsamplecode +'-'+ inputData.test.ntestcode+'-'+ inputData.test.ntestrepeatno+'-'+ inputData.test.ntestretestno+'-'+inputData.userInfo.nsitecode;
                       //console.log(settedId);
                       let encryptedbatchid = CF_encryptionData(settedId).EncryptData;
                        const userObject = {
                            usercode: inputData.elnUserInfo.nelncode,
                            username: inputData.elnUserInfo.selnuserid,
                            userfullname: inputData.elnUserInfo.selnusername,
                            lsusergroup: {
                            usergroupcode: inputData.elnUserInfo.nelnusergroupcode,
                            usergroupname: inputData.elnUserInfo.nelnusergroupcode,
                            },
                            lssitemaster:{
                            sitecode: inputData.elnSite.nelnsitecode
                            }
                        }
                        let encrypteduser = CF_encryptionData(userObject).EncryptData;
                        
                        //const baseURL = "http://localhost:9090/ELN";
                        const baseURL = integrationSettings[1].slinkname
                        
                        link = baseURL + "/vieworder" + '#{"d":"' + settedId + '","user":"' + encrypteduser + '","batchid":"' + encryptedbatchid + '"}';
                        // let a="/vieworder" + '#{"d":"' + inputData.test.npreregno +'-' +inputData.test.ntransactionsamplecode +'-'+ inputData.test.ntestcode+'-'+ inputData.test.ntestrepeatno+'-'+ inputData.test.ntestretestno+'-'+inputData.userInfo.nsitecode + '","user":"' + encrypteduser + '","batchid":"' + encryptedbatchid + '"}';
                        // // return link;
                        // //   }
                        // let hashobject = JSON.parse(a);
   //                     let batchid = "";

//  if (link.batchid !== undefined) {

// // eslint-disable-next-line no-useless-escape

// batchid = CF_decrypt(link.batchid ).replaceAll('\"', '');

//  }
                        
                       // const encrypteduser1 = CF_decrypt(link);
                        //enlLink = link;
                       // console.log("--->"+link);
                        //console.log("--->"+batchid);
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData.masterData,
                                    //defaultSampleType: inputData.defaultSampleType,
                                    ...response.data,
                                    enlLink:link
                                },
                                openELNSheet: true,
                                loading: false,
                                enlLink:link
                               // enlLink:enlLink
                            }
                        })
                         //enlLink = "https://logilabelntest.azurewebsites.net/vieworder".concat(link);    

				//ALPD-5594--Added by Vignesh R(21-03-2025)-->SMTL > Result entry > open ELN sheet displayed empty page, it occurs when open the ELN sheet for run batch test, check description
                    }else{
                        toast.warn(intl.formatMessage({
                            id: "IDS_SELECTEHANDLEBATCH"
                        }));
    
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData.masterData,
                                    //defaultSampleType: inputData.defaultSampleType,
                                    //...response.data,
                                    enlLink:""
                                },
                                enlLink:"",
                                loading: false
                                
                            }
                        })
                    }

                }else{
                    toast.warn(intl.formatMessage({
                        id: "IDS_NOSHEETFORTHISTEST"
                    }));

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: {
                                ...inputData.masterData,
                                //defaultSampleType: inputData.defaultSampleType,
                                ...response.data,
                                enlLink:""
                            },
                            enlLink:"",
                            loading: false
                            
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
            })
    }
}



export function getConfigurationFilter(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getConfigurationFilter", inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...response.data,
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



export function getTestBasedBatchWorklist(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getTestBasedBatchWorklist", inputData)
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





export function addREAdhocParamter(inputDataObj) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/getAdhocParamter", inputDataObj)
            .then(response => {

                let AdhocParamter = constructOptionList(response.data['AdhocParamter'] || [], 'ntestparametercode', 'sparametersynonym',
                undefined, undefined, undefined);
                AdhocParamter = AdhocParamter.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...inputDataObj.masterData,
                            AdhocParamter : AdhocParamter
                        },
                        screenName:'IDS_ADHOCPARAMETER',
                        adhoctransactiontestcode: inputDataObj.ntransactiontestcode,
                        adhocpreregno:inputDataObj.npreregno,
                        openModal:true,
                        operation:"IDS_ADD",
                        selectedRecord:{},
                        adhocId:inputDataObj.adhocId
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

export function createAdhocParamter(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/createAdhocParamter", inputParam.inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...inputParam.inputData.masterData,
                            ...response.data
                        },
                        screenName:'IDS_ADHOCPARAMETER',
                        openModal:false,
                        activeTestTab: "IDS_RESULTS",
                        activeTabIndex:1
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



export function enforceResult(inputParam,userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = [];
        url.push(rsapi().post("/grade/getGrade", {
            userinfo: userInfo
        }));
        url.push(rsapi().post("resultentrybysample/getenforceResult", {
            ncontrolcode:inputParam['ncontrolcode'],
            ntransactiontestcode:inputParam['dataItem']['ntransactiontestcode'],
            ntransactionresultcode:inputParam['dataItem']['ntransactionresultcode'],
            userinfo: userInfo,
            nneedReceivedInLab:inputParam['nneedReceivedInLab']
        })); 
       Axios.all(url)
       .then(response => {
        const Grade = constructOptionList(response[0].data || [], "ngradecode", "sdisplaystatus", false, false, false); 
        let selectedRecord={}
                let savedResultparameter=response[1].data['savedResultparameter']
                   selectedRecord=//savedResultparameter['sgradename']&&savedResultparameter['sgradename']!=='NA'?
                 {
                        'senforceresult':savedResultparameter['sfinal']&&savedResultparameter['sfinal'],
                        // 'ngradecode':{
                        //     'label':savedResultparameter['sgradename']&&savedResultparameter['sgradename'],
                        //     'value': savedResultparameter['ngradecode']&&savedResultparameter['ngradecode']
                        // } ,
                        'senforceresultcomment':savedResultparameter['senforceresultcomment']&&savedResultparameter['senforceresultcomment'],
                        ntransactionresultcode:savedResultparameter['ntransactionresultcode'],
                        ntransactiontestcode:savedResultparameter['ntransactiontestcode']
                   }
            //        : {
            //         'senforceresult':savedResultparameter['sfinal']&&savedResultparameter['sfinal'],
            //         'senforceresultcomment':savedResultparameter['senforceresultcomment']&&savedResultparameter['senforceresultcomment'],
            //         // 'ngradecode':{
            //         //     'label':savedResultparameter['sgradename']&&savedResultparameter['sgradename'],
            //         //     'value': savedResultparameter['ngradecode']&&savedResultparameter['ngradecode']
            //         // } ,
            //         ntransactionresultcode:savedResultparameter['ntransactionresultcode'],
            //         ntransactiontestcode:savedResultparameter['ntransactiontestcode']
            //    };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            'GradeList':Grade.get("OptionList") , 
                            ...inputParam.masterData,
                            ...response.data
                        },
                        ncontrolcode:inputParam['ncontrolcode'],
                        selectedRecord,
                        screenName: "IDS_ENFORCERESULT",
                        openModal: true, 
                        operation: "update",  
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



export function ResultEntryViewPatientDetails(masterData, screenName, userInfo, viewdetails) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const selectedRecord={
            ntestcode:viewdetails.test.ntestcode
        }
        rsapi().post("worklist/getSampleViewDetails", { selectedRecord, PatientId:viewdetails.test.PatientId, npreregno: viewdetails.test.npreregno, userinfo: userInfo })
            .then(response => {
                masterData['AuditModifiedComments'] = [];
                masterData['AuditModifiedComments'] = response.data['AuditModifiedComments']
                masterData['viewdetails'] = [];
                masterData['viewdetails'] = response.data['viewdetails'][0]
                //sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
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



export function resultEntryGetParameter(selectedRecord,inputData, userInfo, ncontrolcode, testskip, testtake) {

    if(inputData.realTestcodeValue.ntestcode!==0)
    {
    return function (dispatch) {
        let additionalInfo=[]
        let selectedSpecification=selectedRecord.selectedSpecification
        let TestList = inputData.searchedTest ? [...inputData.searchedTest] : [...inputData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, inputData.RESelectedTest, "ntransactiontestcode");
        if (acceptTestList && acceptTestList.length > 0) {
            if (Object.values(inputData).length > 0 && inputData.RESelectedTest.length > 0) {
                let inputParamData = {
                    ntransactiontestcode:(acceptTestList[0].ntransactiontestcode).toString(),
                    ntestcode:inputData.realTestcodeValue.ntestcode,
                    nallottedspeccode:selectedRecord.nallottedspeccode.value,
                    nspecsampletypecode:selectedRecord.ncomponentcode.value,
                    userinfo: userInfo
                }
                dispatch(initRequest(true));
                rsapi().post("resultentrybysample/getResultEntryParameter", inputParamData)
                    .then(response => {
                    //     const ComponentMap = constructOptionList(response.data["Component"] || [], "ncomponentcode",
                    //     "scomponentname", undefined, undefined, false);
                    // const Component = ComponentMap.get("OptionList");
                        let selectedResultGrade = [];
                        let paremterResultcode = [];
                        const parameterResults = response.data.ResultParameter
                        let predefDefaultFlag = false;
                        parameterResults.map((param, index) => {
                            selectedResultGrade[index] = { ngradecode: param.ngradecode };
                            paremterResultcode[index] = param.ntransactionresultcode;
                            let jsondata=JSON.parse(param.jsondata['value'])
                            if(jsondata.hasOwnProperty('additionalInfo')){
                                additionalInfo[param.ntransactionresultcode]=jsondata['additionalInfo'] 
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
                                param['editable'] = false;

                        });


                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData,
                                    
                                    ...response.data,
                                    paremterResultcode
                                    

                                },
                                selectedRecord: {
                                    additionalInfo:additionalInfo.length>0?additionalInfo:[],
                                    selectedResultGrade: selectedResultGrade,
                                    ResultParameter: response.data.ResultParameter ,selectedSpecification:selectedSpecification,
                                    nallottedspeccode:selectedRecord.nallottedspeccode,ncomponentcode:selectedRecord.ncomponentcode
                                    ,selectedComponent:selectedRecord.selectedComponent
                                },
                                selectedsubcode:undefined ,
                                  parameterResults:response.data.ResultParameter,
                                  isParameterInitialRender:true,
                                loading: false,
                                screenName: "IDS_RESULTENTRYPARAMETER",
                                openModal: true,
                                operation: "update",
                                activeTestKey: "IDS_RESULTS",
                                ncontrolcode: ncontrolcode
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTTESTTOENTERRESULT"
                }));
            }
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTTESTTOENTERRESULT"
            }));
        }
    }

}else{
    toast.warn(intl.formatMessage({
        id: "IDS_SELECTVALIDTEST"
    }));
}

}


export function resultEntryGetSpec(inputData, userInfo, ncontrolcode, testskip, testtake) {

    
    return function (dispatch) {
        if(inputData.realTestcodeValue.length!==0 && inputData.realTestcodeValue.ntestcode!==0)
    {
        let additionalInfo=[]
        let TestList = inputData.searchedTest ? [...inputData.searchedTest] : [...inputData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        
       
           
                let inputParamData = {
                    nregsubtypecode:inputData.realRegSubTypeValue.nregsubtypecode,
                    nregtypecode:inputData.realRegSubTypeValue.nregtypecode,
                    ntestcode:inputData.realTestcodeValue.ntestcode,
                    userinfo: userInfo
                }
                dispatch(initRequest(true));
                rsapi().post("resultentrybysample/getResultEntrySpec", inputParamData)
                    .then(response => {

                        const allottedspeccode={
                            value:response.data.nallottedspeccode["nallottedspeccode"],
                        label: response.data.nallottedspeccode["sspecname"]
                        };
                       
                        
                        const componentcode={
                            value:response.data.ncomponentcode["ncomponentcode"],
                            label: response.data.ncomponentcode["scomponentname"]
                        };
                        // componentcode.push({
                        //     "value":response.data.ncomponentcode["ncomponentcode"],
                        //     "label": response.data.ncomponentcode["scomponentname"]
                        // });
                        
                        let selectedResultGrade = [];
                        let paremterResultcode = [];
                        const parameterResults = response.data.ResultParameter
                        let predefDefaultFlag = false;
                        parameterResults.map((param, index) => {
                            selectedResultGrade[index] = { ngradecode: param.ngradecode };
                            paremterResultcode[index] = param.ntransactionresultcode;
                            let jsondata=JSON.parse(param.jsondata['value'])
                            if(jsondata.hasOwnProperty('additionalInfo')){
                                additionalInfo[param.ntransactionresultcode]=jsondata['additionalInfo'] 
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
                                param['editable'] = false;

                        });
                        const SpecificationMap = constructOptionList(response.data["Specification"] || [], "nallottedspeccode",
                        "sspecname", undefined, undefined, false);
                    const Specification = SpecificationMap.get("OptionList");

                    const ComponentMap = constructOptionList(response.data["Component"] || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, false);
                const Component = ComponentMap.get("OptionList");
                        
                       
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData,
                                    //...sortData(response.data,"desc","ntransactiontestcode"),
                                    ...response.data,
                                    paremterResultcode,
                                    selectedSpecification:Specification,
                                    selectedComponent:Component,
                                    
                                    
                                    //selectedResultGrade ,

                                },
                                selectedRecord: {
                                    additionalInfo:additionalInfo.length>0?additionalInfo:[],
                                    selectedResultGrade: selectedResultGrade,selectedSpecification:Specification
                                    ,selectedComponent:Component,                                   
                                     ResultParameter: response.data.ResultParameter ,nallottedspeccode:allottedspeccode
                                    ,ncomponentcode:componentcode
                                     //nallottedspeccode:selectedRecord.nallottedspeccode

                                   
                                },
                                 
                                  parameterResults:response.data.ResultParameter,
                                  isParameterInitialRender:true,
                                loading: false,
                                screenName: "IDS_RESULTENTRYPARAMETER",
                                openModal: true,
                                operation: "update",
                                activeTestKey: "IDS_RESULTS",
                                ncontrolcode: ncontrolcode
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
    else{


        dispatch({
            type: DEFAULT_RETURN,
            payload: {
                loading: false
            }
        })
        toast.warn(intl.formatMessage({
            id: "IDS_SELECTVALIDTEST"
        }));
    
    }

}

}





export function resultEntryGetComponent(selectedRecord,inputData, userInfo, ncontrolcode, testskip, testtake) {

    if(inputData.realTestcodeValue.ntestcode!==0)
    {
    return function (dispatch) {
        let additionalInfo=[]
        let selectedSpecification=selectedRecord.selectedSpecification
        let TestList = inputData.searchedTest ? [...inputData.searchedTest] : [...inputData.RE_TEST];
        TestList = TestList.splice(testskip, testskip + testtake);
        let acceptTestList = getSameRecordFromTwoArrays(TestList, inputData.RESelectedTest, "ntransactiontestcode");
        if (acceptTestList && acceptTestList.length > 0) {
            if (Object.values(inputData).length > 0 && inputData.RESelectedTest.length > 0) {
                let inputParamData = {
                    ntransactiontestcode:(acceptTestList[0].ntransactiontestcode).toString(),
                    ntestcode:inputData.realTestcodeValue.ntestcode,
                    nallottedspeccode:selectedRecord.nallottedspeccode.value,
                    userinfo: userInfo
                }
                dispatch(initRequest(true));
                rsapi().post("resultentrybysample/getResultEntryComponent", inputParamData)
                    .then(response => {
                        const ComponentMap = constructOptionList(response.data["Component"] || [], "ncomponentcode",
                        "scomponentname", undefined, undefined, false);
                    const Component = ComponentMap.get("OptionList");
                    const componentcode={
                        value:response.data.ncomponentcode["ncomponentcode"],
                        label: response.data.ncomponentcode["scomponentname"]
                    };
                        let selectedResultGrade = [];
                        let paremterResultcode = [];
                        const parameterResults = response.data.ResultParameter
                        let predefDefaultFlag = false;
                        parameterResults.map((param, index) => {
                            selectedResultGrade[index] = { ngradecode: param.ngradecode };
                            paremterResultcode[index] = param.ntransactionresultcode;
                            let jsondata=JSON.parse(param.jsondata['value'])
                            if(jsondata.hasOwnProperty('additionalInfo')){
                                additionalInfo[param.ntransactionresultcode]=jsondata['additionalInfo'] 
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
                                param['editable'] = false;

                        });


                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...inputData,
                                    
                                    ...response.data,
                                    paremterResultcode
                                    

                                },
                                selectedRecord: {
                                    additionalInfo:additionalInfo.length>0?additionalInfo:[],
                                    selectedResultGrade: selectedResultGrade,
                                    ResultParameter: response.data.ResultParameter ,selectedSpecification:selectedSpecification,
                                    nallottedspeccode:selectedRecord.nallottedspeccode,selectedComponent:Component
                                    ,ncomponentcode:componentcode
                                },
                                selectedsubcode:undefined ,
                                  parameterResults:response.data.ResultParameter,
                                  isParameterInitialRender:true,
                                loading: false,
                                screenName: "IDS_RESULTENTRYPARAMETER",
                                openModal: true,
                                operation: "update",
                                activeTestKey: "IDS_RESULTS",
                                ncontrolcode: ncontrolcode
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
            } else {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false
                    }
                })
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTTESTTOENTERRESULT"
                }));
            }
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    loading: false
                }
            })
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTTESTTOENTERRESULT"
            }));
        }
    }

}else{
    toast.warn(intl.formatMessage({
        id: "IDS_SELECTVALIDTEST"
    }));
}

}


export function addREAdhocTestParamter(inputDataObj) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/getAdhocTestParamter", inputDataObj)
            .then(response => {

                let AdhocTestParamter = constructOptionList(response.data['TestParameter'] || [], 'ntestparametercode', 'sparametersynonym',
                undefined, undefined, undefined);
                AdhocTestParamter = AdhocTestParamter.get("OptionList");

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...inputDataObj.masterData,
                            AdhocParamter : AdhocTestParamter
                        },
                        screenName:'IDS_ADHOCPARAMETER',
                        adhoctransactiontestcode: inputDataObj.ntransactiontestcode,
                        adhocpreregno:inputDataObj.npreregno,
                        openModal:true,
                        operation:"IDS_ADD",
                        selectedRecordAdhocParameter:{},
                        adhocId:inputDataObj.adhocId
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

export function createAdhocTestParamter(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/createAdhocTestParamter", inputParam.inputData)
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...inputParam.inputData.masterData,
                            ...response.data
                        },
                        screenName:'IDS_ADHOCPARAMETER',
                        openModal:false,
                        activeTestTab: "IDS_RESULTS",
                        activeTabIndex:1,
                        selectedRecordAdhocParameter:{}
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


export function CompletePopupAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getAnalysedUser", inputParam.inputData)
            .then(response => {
                let selectedRecordCompleteForm ={};
                const UsersMap = constructOptionList(response.data.Users || [], "nusercode","susername", undefined, undefined, false);                
                const Users = UsersMap.get("OptionList");

                //Added by sonia on 19-06-2024 for JIRA ID:ALPD-4422
                if(response.data.userCode !==undefined  && response.data.userName!==undefined) {
                    selectedRecordCompleteForm["nusercode"] = {
                        "value": response.data.userCode,
                        "label":  response.data.userName
                    };
                }

              

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {                      
                        Users,                      
                        isOpen: true,
                        operation: inputParam.inputData.operation,
                        screenName: "IDS_RESULTENTRYCOMPLETE",
                        openModal: true,
                        ncontrolCode: inputParam.inputData.ncontrolcode,
                        loading: false,
                        isCompleteInitialRender:true,
                        selectedRecordCompleteForm

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

//Added by sonia for ALPD-4084 on May 2 2024 Export action
export function exportAction(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getExportData", inputParam.inputData)
            .then(response => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                let value = "";
                if(response.data.rtn ==="Success"){
                    //Modified by sonia on 11-06-2024 using camelcase format in the key value
                    value = response.data["exportFileViewUrl"];
                    var win = window.open(value);
                    if (win) {
                        win.focus();
                    } else {
                        intl.warn('IDS_PLEASEALLOWPOPUPSFORTHISWEBSITE');
                    }
                }else{
                    if (response.data["rtn"]) {
                        toast.warn(intl.formatMessage({ id: response.data.rtn }));
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
    }
}

//ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
export function getSectionChange(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/getSectionChange", inputParam.inputData
        )
            .then(response => {
                let section = [];
                //ALPD-4050
                let selectedRecord={...inputParam.selectedRecord,nsectioncode:""}
                const sectionMap = constructOptionList(response.data.Section || [], "nsectioncode", "ssectionname", undefined, undefined, false);
                section = sectionMap.get("OptionList");
           
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        section,
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

//ALPD-4156--Vignesh R(15-05-2024)-->Result Entry - Option to change section for the test(s)	
export function updateSectionTest(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("resultentrybysample/updateSectionTest", inputParam.inputData
        )
            .then(response => {
                if (response.data.rtn === undefined || response.data.rtn === "Success") {
               
            let responseData =   sortData(response.data, 'ascending', 'ntransactionresultcode')

            let selectedRecord={...inputParam.selectedRecord,"nsectioncode":""}
            
            responseData["RESelectedTest"] = getSameRecordFromTwoArrays(responseData.RE_TEST,inputParam.RESelectedTest,"ntransactiontestcode");
        //ALPD-4226--Vignesh R(24-05-2024)--Test is de-selected when changing the section
            let selectedTestList=[];
            if(responseData["RESelectedTest"].length===0&&responseData.RE_TEST.length>0){
                selectedTestList.push(responseData.RE_TEST[0]);
                responseData["RESelectedTest"]=selectedTestList;

            }
          
            let masterData = {
                        ...inputParam.inputData.masterData,
                        ...responseData
                        
                    }
                    let respObject = {
                        ...inputParam.inputData,
                        ...inputParam.inputData.masterData,
                        masterData,
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
//ALPD-4870-To get previously save filter details when click the filter name,done by Dhanushya RI

export function getResultEntryFilter(inputParam) {
    let masterData = { ...inputParam.masterData }
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultEntryFilter", { ...inputParam.inputData, nneedsubsample: //inputParamData.masterData.nneedsubsample
            inputParam.masterData.realRegSubTypeValue.nneedsubsample
         })
            .then(response => {
                //let masterData = { ...inputParamData.masterData }
                if (inputParam.refs.searchSampleRef !== undefined && inputParam.refs.searchSampleRef.current !== null) {
                    inputParam.refs.searchSampleRef.current.value = "";
                    masterData['searchedSample'] = undefined
                }
                if (inputParam.refs.searchSubSampleRef !== undefined && inputParam.refs.searchSubSampleRef.current !== null) {
                    inputParam.refs.searchSubSampleRef.current.value = "";
                    masterData['searchedSubSample'] = undefined
                }
                if (inputParam.refs.searchTestRef !== undefined && inputParam.refs.searchTestRef.current !== null) {
                    inputParam.refs.searchTestRef.current.value = ""
                    // masterData['searchedTests'] = undefined
                    masterData['searchedTest'] = undefined
                }
                //sortData(response.data)
                sortData(response.data, 'ascending', 'ntransactionresultcode')
                if(response.data.rtn == "IDS_USERNOTINRESULTENTRYFLOW")
                {
                toast.warning(intl.formatMessage({ id: "IDS_USERNOTINRESULTENTRYFLOW" }));
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            realFromDate: response.data["fromDate"],
                            realToDate: response.data["toDate"]
                        },
                        nfilternamecode:inputParam.inputData.nfilternamecode,
                        loading: false,
                        modalShow:false,
                        showTest: inputParam.inputData.showTest,
                        showSample: inputParam.inputData.showSample,
                        activeTestKey: inputParam.inputData.activeTestKey,
                    
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
                } else if(error.response.status === 409) {
                    toast.warn(intl.formatMessage({id:error.response.data.rtn}));
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            masterData: {
                                ...masterData,
                                ...error.response.data,
                                realFromDate: error.response.data["fromDate"],
                                realToDate: error.response.data["toDate"]
                            }
                        }
                    })
                }
                else{
                    toast.warn(error.response.data);
                }
            })
    }
}





//Added by Vignesh(09-09-2025)-> ALPDJ21-61 Result Entry -> sample or sub sample send to store test was not got properly.
export function getResultEntrySampleStatus(storeInputParam, selectedRecord, inputData) {

    return (dispatch) => {
        dispatch(initRequest(true));
       
        if (inputData.needsubsample === true) {
            inputData["getSubSampleChildDetail"] = true;
        } else {
            inputData["getSampleChildDetail"] = true;

        }


        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getResultEntrySampleStatus", inputData)
            .then(response => {
                let needdatashow;
                let masterData;
                let selectedRecord;
                let openModal = false;
                let operation;
                if (response.status === 200 && response.status !== null) {

                    masterData = {
                        ...storeInputParam.masterData
                    };

                    if (inputData.needsubsample === false) {

                        if (masterData["RESelectedSample"].length > 1 ||
                            masterData["RESelectedSample"]
                                .findIndex(x => x['npreregno'] === storeInputParam["mastersendtostore"]['npreregno'])
                            === -1) {
                            storeInputParam.mastersendtostore["getSampleChildDetail"] = true;
                        }
                        masterData["RESelectedSample"] = [];
                        masterData["RESelectedSample"].push(storeInputParam["mastersendtostore"]);

                    } else {

                        if (masterData["RESelectedSubSample"].length > 1 ||
                            masterData["RESelectedSubSample"]
                                .findIndex(x => x['ntransactionsamplecode'] === storeInputParam["mastersendtostore"]['ntransactionsamplecode'])
                            === -1) {
                            storeInputParam.mastersendtostore["getSubSampleChildDetail"] = true;
                        }
                        masterData["RESelectedSubSample"] = [];
                        masterData["RESelectedSubSample"].push(storeInputParam["mastersendtostore"]);

                    }

                    if (masterData["RESelectedSample"][0].storage || masterData["RESelectedSubSample"][0].storage) {

                        needdatashow = true;
                        openModal = true;

                        //operation = "MovesendToStore";
                    } else {
                        needdatashow = false;
                        operation = "";
                    }

        

                    selectedRecord = {
                        ...storeInputParam.mastersendtostore, "needdatashow": needdatashow
                    }

                    if (storeInputParam.mastersendtostore["getSubSampleChildDetail"] === true) {
                        if (masterData["searchedTest"]) {
                            if (storeInputParam.searchTestRef !== undefined && storeInputParam.searchTestRef.current !== null) {
                                storeInputParam.searchTestRef.current.value = ""
                                masterData['searchedTest'] = undefined
                            }
                        }
                        masterData = { ...masterData, ...response.data["SubSampleChildDetail"] };
                    }
              

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false,
                       // operation: operation,
                        openModal:openModal,
                        selectedRecord,
                        "SaveBtnHide": needdatashow,
                        testskip: inputData.testskip,
                        testtake: inputData.testtake,
                        subsampleskip: inputData.subsampleskip,
                        subsampletake: inputData.subsampletake,
                        skip: inputData.skip,
                        take: inputData.take,
                        screenName:"IDS_STORAGE"
                     

                    }
                });
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
                    toast.info(error.response.data);
                }
            })

    }
}