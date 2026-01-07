import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { constructOptionList, fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, replaceUpdatedObject, sortData, getSameRecordFromTwoArrays, getSameRecordFromTwoDifferentArrays, filterRecordBasedOnPrimaryKeyName } from '../components/CommonScript';
import { postCRUDOrganiseTransSearch } from './ServiceAction';
import { REPORTTYPE, reportCOAType, transactionStatus } from '../components/Enumeration';
import { intl } from '../components/App';

export function getMyJobsubSampleDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
           // nflag: 2,
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
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo,
            nneedsubsample: inputData.masterData.realRegSubTypeValue.nneedsubsample,
            ndesigntemplatemappingcode : inputData.masterData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.masterData.searchedSubSample ?  
                inputData.masterData.searchedSubSample.length > 0 ? inputData.checkBoxOperation:3:inputData.checkBoxOperation
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("myjobs/getMyJobsSubSampleDetails", inputParamData)
                .then(response => {
                    let responseData = { ...response.data, MJSelectedSample: inputData.MJSelectedSample }
                    responseData = sortData(responseData)
                    let oldSelectedTest = inputData.masterData.MJSelectedTest ? inputData.masterData.MJSelectedTest : []
                    inputData.masterData.MJSelectedTest = responseData.MJSelectedTest ? responseData.MJSelectedTest : inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                    let skipInfo = {}
                    let masterData = {}
                    
                    if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                        inputData.searchTestRef.current.value = ""
                        masterData['searchedTests'] = undefined
                    }
                    if (subSample) {
                        let oldSelectedSubSample = inputData.masterData.MJSelectedSubSample
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            MJSelectedSample: inputData.MJSelectedSample,
                            selectedPreregno: inputData.npreregno,
                            MJSelectedSubSample: inputData.masterData.MJ_SUBSAMPLE.length > 0 ?
                                [inputData.masterData.MJ_SUBSAMPLE[0]] : [],
                        }
                        if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
                            inputData.searchSubSampleRef.current.value = "";
                            masterData['searchedSubSample'] = undefined
                        }
                        if (inputData.checkBoxOperation === 1 || inputData.checkBoxOperation === 7 || inputData.checkBoxOperation === 5) {

                            const wholeSubSampleList = masterData.MJ_SUBSAMPLE.map(b => b.ntransactionsamplecode)
                            oldSelectedSubSample.forEach((subsample, index) => {
                                if (!wholeSubSampleList.includes(subsample.ntransactionsamplecode)) {
                                    oldSelectedSubSample.splice(index, 1)
                                }

                            })
                            if (oldSelectedSubSample.length > 0) {
                                masterData = {
                                    ...masterData,
                                    MJSelectedSubSample: oldSelectedSubSample
                                }
                            }
                            const MJSelectedTest = oldSelectedTest.length >0 ? getSameRecordFromTwoArrays(oldSelectedTest,
                                masterData.MJSelectedSubSample, 'npreregno') : responseData.MJSelectedTest
                            masterData = {
                                ...masterData,
                                MJSelectedTest,
                                ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter : masterData.ApprovalParameter: masterData.ApprovalParameter
                            }
                        }
                        if (inputData.checkBoxOperation === 3) {
                            masterData = {
                                ...masterData,
                                MJSelectedTest: masterData.MJ_TEST.length > 0 ? [masterData.MJ_TEST[0]] : [],
                                ApprovalParameter:responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0  ? responseData.ApprovalParameter :masterData.ApprovalParameter : masterData.ApprovalParameter
                            }
                        }


                        let { testskip, testtake, subSampleSkip, subSampleTake } = inputData
                        let bool = false;

                        if (inputData.masterData.MJ_SUBSAMPLE.length < inputData.subSampleSkip) {
                            testskip = 0;
                            subSampleSkip = 0;
                            bool = true
                        }
                        if (bool) {
                            skipInfo = { testskip, testtake, subSampleSkip, subSampleTake }
                        }
                    }
                    else {
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);

                        let masterData = {
                            ...inputData.masterData,
                            MJSelectedSample: inputData.MJSelectedSample,
                            MJSelectedSubSample: inputData.masterData.MJSelectedSubSample,
                            MJSelectedTest: inputData.masterData.MJSelectedTest || [],
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
                        let { testskip, testtake } = inputData
                        let bool = false;
                        if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
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

                        if (inputData.checkBoxOperation === 1) {

                            let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
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
                                    selectedTest: oldSelectedTest
                                }
                            } else {
                                ntransactiontestcode = masterData.selectedTest[0].ntransactiontestcode
                            }
                            switch (inputData.activeTestTab) {
                                  
                                case "IDS_TESTATTACHMENTS":
                                    RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                              
                                case "IDS_TESTCOMMENTS":
                                    RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                                
                                default:
                                    RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                            }
                        } else if (inputData.checkBoxOperation === 5) {
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                            }
                           // let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : 0;
                            let list = [];
                            let dbData = []
                            switch (inputData.activeTestTab) {
                               
                                case "IDS_TESTATTACHMENTS":
                                    dbData = response.data.RegistrationTestAttachment || []
                                    list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                               
                                case "IDS_TESTCOMMENTS":
                                    dbData = response.data.RegistrationTestComment || []
                                    list = [...inputData.masterData.RegistrationTestComment, ...dbData]
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                               
                                default:
                                    dbData = response.data.RegistrationTestAttachment || []
                                    list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    break;
                            }
                        } else {
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                            }
                           // let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : 0
                            let list = [];
                            switch (inputData.activeTestTab) {
                               
                               
                                case "IDS_TESTATTACHMENTS":
                                    list = response.data.RegistrationTestAttachment || []
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestAttachment"
                                    break;
                                
                                case "IDS_TESTCOMMENTS":
                                    list = response.data.RegistrationTestComment || []
                                    RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
                                    dataStateName = "testCommentDataState"
                                    break;
                              
                                default:
                                    list = [...inputData.masterData.RegistrationTestAttachment, ...response.data.RegistrationTestAttachment]
                                    RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                    activeName = "RegistrationTestComment"
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
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData,
                            loading: false,
                            showFilter: false,
                            activeTestTab: inputData.activeTestTab,
                            activeSampleTab: inputData.activeSampleTab,
                            skip: undefined,
                            take: undefined,
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
                        toast.warn(error.response.data);
                    }
                })
        } else {
            let skipInfo = {};
            let bool = false;
            let { testskip, testtake, subsampletake, subsampleskip } = inputData;
            let oldSelectedTest = inputData.masterData.MJSelectedTest
            let oldSelectedSubSample = inputData.masterData.MJSelectedSubSample
            let TestSelected = [];
            let subSampleSelected = [];
            if(inputData["statusNone"])
            {
             TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
             subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
            else
            {
                TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
          
            let isGrandChildGetRequired = false;
            let ApprovalParameter = [];
            let ResultUsedInstrument = [];
            let ResultUsedTasks = [];
            let RegistrationTestAttachment = [];
            let ApprovalResultChangeHistory = [];
            let RegistrationTestComment = [];
            let ApprovalHistory = [];

            // if(subSample)
            // {
            //     if (TestSelected.length > 0) {
            //         isGrandChildGetRequired = false;
            //     } else {
                   
                    // if( TestSelected.length == 0 && subSampleSelected.length == 0)
                    // {
                    //     isGrandChildGetRequired = true;
                    // }
                    // else if(TestSelected.length == 0){
                    //     isGrandChildGetRequired = true;
                    // }
            //         else
            //         {
            //             isGrandChildGetRequired = false;
            //         }
            //          isGrandChildGetRequired = true;
                   
            //     }
            // }
            // else
            // {
                if (TestSelected.length > 0) {
                    isGrandChildGetRequired = false;
                } else {
                    isGrandChildGetRequired = true;
                }
           // }

            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.MJSelectedSample, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
        
            if (isGrandChildGetRequired) {
                let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode.toString() : "";
                let MJSelectedSample = inputData.MJSelectedSample;
                let selectedPreregno = inputData.npreregno;
                let MJSelectedTest = inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : [];
                let MJSelectedSubSample = inputData.masterData.MJ_SUBSAMPLE

                if (subSample) {
                    let filterSelectedSubSample = getSameRecordFromTwoArrays(oldSelectedSubSample, inputData.masterData.MJ_SUBSAMPLE, "ntransactionsamplecode");
                    MJSelectedSubSample = filterSelectedSubSample.length > 0 ? filterSelectedSubSample : [inputData.masterData.MJ_SUBSAMPLE[0]];
                    if (inputData.masterData.MJ_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }

                }
                let masterData = { ...inputData.masterData, MJSelectedSample, MJSelectedSubSample, MJSelectedTest }
                if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true
                }
                if (bool) {
                    skipInfo = { ...skipInfo, testskip, testtake }
                }
                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                        MJSelectedSubSample, checkBoxOperation: 3,masterData,...skipInfo
                }

                if (subSample) {
                    if (MJSelectedTest.length === 0) {
                        inputData["npreregno"] = MJSelectedSubSample.map(x => x.npreregno).join(",")
                        inputData["ntransactionsamplecode"] = MJSelectedSubSample.map(x => x.ntransactionsamplecode).join(",")
                        inputData["checkBoxOperation"] = 3
                        inputData["childTabsKey"] = ["MJ_TEST"]
                        dispatch(getMyJobTestDetail(inputData, true));
                    } else {
                        dispatch(getMJTestChildTabDetail(inputData, true));
                    }
                } else {
                    dispatch(getMJTestChildTabDetail(inputData, true));
                }

                // dispatch(getMJTestChildTabDetail(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    MJSelectedTest: TestSelected ? TestSelected :inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : [],
                    MJSelectedSample: inputData.MJSelectedSample,
                    MJSelectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.MJ_SUBSAMPLE.length>0 ? [inputData.masterData.MJ_SUBSAMPLE[0]]:[]
                }
                let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                oldSelectedTest.map((test, index) => {
                    if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        oldSelectedTest.splice(index, 1)
                    }
                    return null;
                });

                if(subSample)
                {
                    if (inputData.masterData.MJ_SUBSAMPLE.length <= inputData.subsampleskip) {
                        subsampleskip = 0;
                        skipInfo = { subsampletake, subsampleskip }
                    }
    
                }
                let keepOld = false;
                let ntransactiontestcode;
                if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
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
                    ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "-1";
                }
                switch (inputData.activeTestTab) {
                    
                    case "IDS_TESTATTACHMENTS":
                        RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                        break;
                   
                    case "IDS_TESTCOMMENTS":
                        RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                        break;
                  
                    default:
                        RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                        break;
                }
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...masterData,
                            // wholeApprovalParameter,
                            ApprovalParameter,
                            // wholeResultUsedInstrument,
                            ResultUsedInstrument,
                            // wholeResultUsedTasks,
                            ResultUsedTasks,
                            // wholeRegistrationTestAttachment,
                            RegistrationTestAttachment,
                            // wholeApprovalResultChangeHistory,
                            ApprovalResultChangeHistory,
                            // wholeRegistrationTestComments,
                            RegistrationTestComment,
                            ApprovalHistory,
                            ...skipInfo,
                        },
                        ...skipInfo,
                        loading: false,
                        showFilter: false,
                        activeSampleTab: inputData.activeSampleTab,
                        activeTestTab: inputData.activeTestTab
                    }
                })
            }
        }
    }
}


export function getMyJobTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            ntype: 2,
           // nflag: 3,
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            npreregno: inputData.npreregno,
           // ntranscode: inputData.ntransactionstatus,
            napprovalversioncode: inputData.napprovalversioncode,
            napprovalconfigcode: inputData.napprovalconfigcode,
            ntransactionsamplecode: inputData.ntransactionsamplecode,
            ntransactiontestcode :0,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo,
            ntransactionstatus:inputData.ntransactionstatus,
            ndesigntemplatemappingcode : inputData.masterData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation
        }
        let activeName = "";
        let dataStateName = "";
        //let masterData = {};
       // let subSample = inputData.nneedsubsample;
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("myjobs/getMyJobsTestDetails", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData,'descending', 'npreregno')
                    inputData.searchTestRef.current.null = ""

                    let oldSelectedTest = inputData.masterData.MJSelectedTest
                    inputData.masterData.MJSelectedTest = oldSelectedTest.length > 0 ? oldSelectedTest : responseData.MJSelectedTest ? responseData.MJSelectedTest : inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []

                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        MJSelectedTest: inputData.masterData.MJSelectedTest,
                        MJSelectedSubSample: inputData.MJSelectedSubSample,
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

                    let { testskip, testtake } = inputData
                    let bool = false;
                    if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
                        testskip = 0;
                        bool = true
                    }
                    let skipInfo = {}
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


                    if (inputData.checkBoxOperation === 1) {
                        let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                        oldSelectedTest.map((test, index) => {
                            if (!wholeTestList.includes(test.ntransactiontestcode)) {
                                oldSelectedTest.splice(index, 1)
                            }
                            return null;
                        })
                        let keepOld = false;
                        let ntransactiontestcode;
                        // if (oldSelectedTest.length > 0) {
                        //     keepOld = true
                        //     masterData = {
                        //         ...masterData,
                        //         selectedTest: oldSelectedTest
                        //     }
                        // } else {
                        ntransactiontestcode = masterData.MJSelectedTest[0].ntransactiontestcode
                        // }
                        switch (inputData.activeTestTab) {
                            
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                           
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            
                            default:
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                        }
                    } else if (inputData.checkBoxOperation === 5) {
                        masterData = {
                            ...masterData,
                            MJSelectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                        }
                        //let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : 0;
                        let list = [];
                        let dbData = []
                        switch (inputData.activeTestTab) {
                          
                            case "IDS_TESTATTACHMENTS":
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                           
                            case "IDS_TESTCOMMENTS":
                                dbData = response.data.RegistrationTestComment || []
                                list = [...inputData.masterData.RegistrationTestComment, ...dbData]
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                            
                            default:
                                dbData = response.data.RegistrationTestAttachment || []
                                list = [...inputData.masterData.RegistrationTestAttachment, ...dbData]
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                break;
                        }
                    } else if (inputData.checkBoxOperation === 7) {
                       // let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                        //let wholeTestListForSelectAll = masterData.MJ_TEST
                       // let wholeTestListForSelectSingleSelect =
                            // oldSelectedTest.forEach((test, index) => {
                            //     if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            //         oldSelectedTest.splice(index, 1)
                            //     }

                            // })

                        let keepOld = false;
                        let ntransactiontestcode;
                        if (oldSelectedTest.length > 0) {
                            keepOld = true
                            masterData = {
                                ...masterData,
                                MJSelectedTest: oldSelectedTest
                                //oldSelectedTest
                            }
                        } else {
                            ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : ""
                        }
                        switch (inputData.activeTestTab) {
                           
                           
                            
                            case "IDS_TESTATTACHMENTS":
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            
                            case "IDS_TESTCOMMENTS":
                                RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                            
                            default:
                                RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                        }

                    } else {
                        masterData = {
                            ...masterData,
                            MJSelectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                        }
                       // let ntransactiontestcode = response.data.MJSelectedTest ? response.data.MJSelectedTest.length > 0 ? 
                          //      response.data.MJSelectedTest[0].ntransactiontestcode : inputData.masterData.MJ_TEST ? inputData.masterData.MJ_TEST.length > 0 ?  inputData.masterData.MJ_TEST[0].ntransactiontestcode :-1:-1:-1
                                
                                //inputData.masterData.MJ_TEST ? inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode: -1 : -1
                        let list = [];
                        switch (inputData.activeTestTab) {
                           
                            case "IDS_TESTATTACHMENTS":
                                list = response.data.RegistrationTestAttachment || []
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
                                break;
                            
                            case "IDS_TESTCOMMENTS":
                                list = response.data.RegistrationTestComment || []
                                RegistrationTestComment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestComment"
                                dataStateName = "testCommentDataState"
                                break;
                           
                            default:
                                list = [...inputData.masterData.RegistrationTestAttachment, ...response.data.RegistrationTestAttachment]
                                RegistrationTestAttachment = getRecordBasedOnPrimaryKeyName(list, inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : "", "ntransactiontestcode")
                                activeName = "RegistrationTestAttachment"
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
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            masterData: {
                                ...masterData,
                                MJSelectedSubSample: inputData.MJSelectedSubSample,
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
            let bool = false;
            let skipInfo = {};
            let { testskip, testtake } = inputData;
            let oldSelectedTest = inputData.masterData.MJSelectedTest
            let TestSelected = 
          inputData["statusNone"] ?
            getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode"):
            filterRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode");
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
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.MJSelectedSubSample, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactionsamplecode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                //let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode.toString() : "";
                let MJSelectedSample = inputData.masterData.MJSelectedSample;
                let selectedPreregno = inputData.npreregno;
                //let selectedTest = inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : [];
                let MJSelectedSubSample = inputData.MJSelectedSubSample
                let filterTestSameOldSelectedTest = getSameRecordFromTwoDifferentArrays(oldSelectedTest, inputData.masterData.MJ_TEST, "ntransactiontestcode");
                let MJSelectedTest = filterTestSameOldSelectedTest.length > 0 ? filterTestSameOldSelectedTest : [inputData.masterData.MJ_TEST[0]];
                let ntransactiontestcode = MJSelectedTest.length > 0 ? MJSelectedTest.map(x => x.ntransactiontestcode).join(",") : "-1";

                if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
                    testskip = 0;
                    bool = true;
                }
                if (bool) {
                    skipInfo = { testskip, testtake }
                }
                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                        MJSelectedSubSample, checkBoxOperation: 3, skipInfo
                }
                dispatch(getMJTestChildTabDetail(inputData, true));
            } 
            else {
                    let keepOld = false;
                    let ntransactiontestcode;

                    let masterData = {
                        ...inputData.masterData,
                        MJSelectedSubSample: inputData.MJSelectedSubSample,
                        selectedTransactioncode: inputData.ntransactionsamplecode,
                        MJSelectedTest: TestSelected ? TestSelected : inputData.masterData.MJ_TEST.length > 0 ?
                            [inputData.masterData.MJ_TEST[0]] : [],
                    }

                    const wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                    oldSelectedTest.forEach((test, index) => {
                        if (!wholeTestList.includes(test.ntransactiontestcode)) {
                            oldSelectedTest.splice(index, 1)
                        }
                        return null;
                    });
                    if (inputData.masterData.MJ_TEST.length <= inputData.testskip) {
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
                            MJSelectedTest: oldSelectedTest,
                        }
                    } else {
                        ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ?
                            inputData.masterData.MJ_TEST[0].ntransactiontestcode : "-1"
                    }


                    switch (inputData.activeTestTab) {
                        
                        case "IDS_TESTATTACHMENTS":
                            RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
                            break;
                       
                        case "IDS_TESTCOMMENTS":
                            RegistrationTestComment = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, ntransactiontestcode, "ntransactiontestcode")
                            break;
                       
                        default:
                            RegistrationTestAttachment = keepOld ? inputData.masterData.RegistrationTestAttachment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestAttachment, ntransactiontestcode, "ntransactiontestcode")
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



export function getMJTestChildTabDetail(inputData, isServiceRequired) {
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
                case "IDS_TESTATTACHMENTS":
                    url = "attachment/getTestAttachment"
                    activeName = "RegistrationTestAttachment"
                    break;
                case "IDS_TESTCOMMENTS":
                    url = "comments/getTestComment"
                    activeName = "RegistrationTestComment"
                    dataStateName = "testCommentDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                default:
                    url = "attachment/getTestAttachment"
                    activeName = "RegistrationTestAttachment"
                    break;
            }
            if (url !== null) {
                dispatch(initRequest(true));
                if (isServiceRequired) {
                    rsapi().post(url, inputParamData)
                        .then(response => {
                            let skipInfo = {};
                            let responseData = { ...response.data, MJSelectedSubSample: inputData.MJSelectedSubSample || inputData.masterData.MJSelectedSubSample, selectedTest: inputData.MJSelectedTest }
                            //responseData = sortData(responseData)
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "npreregno", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                MJSelectedSample: inputData.MJSelectedSample || inputData.masterData.MJSelectedSample,
                                MJSelectedSubSample: inputData.MJSelectedSubSample || inputData.masterData.MJSelectedSubSample,
                                MJSelectedTest: inputData.MJSelectedTest,
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
                                toast.warn(error.response.data);
                            }
                        })
                } else {
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.MJSelectedTest, inputData.childTabsKey, inputData.checkBoxOperation, "ntransactiontestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        MJSelectedTest: inputData.MJSelectedTest,
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
                        activeSampleTab: inputData.activeSampleTab
                    }
                })
            }
        } else {
            let { ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment, ApprovalResultChangeHistory,
                RegistrationTestComment, ApprovalHistory } = inputData.masterData
            switch (inputData.activeTestTab) {
                
                case "IDS_TESTATTACHMENTS":
                    RegistrationTestAttachment = []
                    break;
               
                case "IDS_TESTCOMMENTS":
                    RegistrationTestComment = []
                    break;
               
                default:
                    RegistrationTestAttachment = []
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
export function getMJSampleChildTabDetail(inputData) {
    return function (dispatch) {
        if (inputData.npreregno.length > 0) {
            let inputParamData = {
                npreregno: inputData.npreregno,
                userinfo: inputData.userinfo
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
                                screenName: inputData.screenName
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
            toast.warn("Please Select a Sample");
        }
    }
}
export function performAction(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        rsapi().post("approval/performAction", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...inputParam.masterData,
                    ...response.data,
                    MJ_SAMPLE: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.MJ_SAMPLE, 'npreregno'),
                    MJ_SUBSAMPLE: replaceUpdatedObject(response.data.updatedSubSample, inputParam.masterData.MJ_SUBSAMPLE, 'ntransactionsamplecode'),
                    MJ_TEST: replaceUpdatedObject(response.data.updatedTest, inputParam.masterData.MJ_TEST, 'ntransactiontestcode')
                }
                // dispatch({type: DEFAULT_RETURN, payload:{
                // masterData:{
                //     ...inputParam.inputData.masterData,
                //     ...response.data, 
                //     MJ_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam   .inputData.masterData.MJ_SAMPLE,'npreregno'),
                //     MJ_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.inputData.masterData.MJ_SUBSAMPLE,'ntransactionsamplecode'),
                //     MJ_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.inputData.masterData.MJ_TEST,'ntransactiontestcode')
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
                    loading: false
                }

                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))


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
                //         MJ_SAMPLE:replaceUpdatedObject(response.data.updatedSample,inputParam.masterData.MJ_SAMPLE,'npreregno'),
                //         MJ_SUBSAMPLE:replaceUpdatedObject(response.data.updatedSubSample,inputParam.masterData.MJ_SUBSAMPLE,'ntransactionsamplecode'),
                //         MJ_TEST:replaceUpdatedObject(response.data.updatedTest,inputParam.masterData.MJ_TEST,'ntransactiontestcode')

                //     },
                //     loading:false                      
                // }}) 
                let masterData = {
                    ...inputParam.masterData,
                    ...responseData,
                    MJ_SAMPLE: replaceUpdatedObject(response.data.updatedSample, inputParam.masterData.MJ_SAMPLE, 'npreregno'),
                    MJ_SUBSAMPLE: replaceUpdatedObject(response.data.updatedSubSample, inputParam.masterData.MJ_SUBSAMPLE, 'ntransactionsamplecode'),
                    MJ_TEST: replaceUpdatedObject(response.data.updatedTest, inputParam.masterData.MJ_TEST, 'ntransactiontestcode')

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
                    loading: false
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
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
export function getRegType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getRegistrationType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            realSampleTypeValue: inputData.realSampleTypeValue
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
export function getRegSubType(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getRegistrationsubType", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            realRegTypeValue: inputData.realRegTypeValue
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
export function getTestStatus(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getFilterStatus", inputData)
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

export function getAppConfigVersion(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getApprovalConfigVersion", inputParam.inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...responseData,
                            realRegSubTypeValue: inputParam.masterData.realRegSubTypeValue

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
export function getSection(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getTestCombo", inputData)
            .then(response => {
                let responseData = { ...response.data }
                responseData = sortData(responseData)
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData: {
                            ...inputData.masterData,
                            ...responseData,
                            realUserSectionValue: inputData.masterData.realUserSectionValue,
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
export function getMyJobsSample(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("myjobs/getMyJobsDetails", inputParam.inputData)
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
                        resultDataState: { ...inputParam.resultDataState, sort: undefined, filter: undefined },
                        instrumentDataState: { ...inputParam.instrumentDataState, sort: undefined, filter: undefined },
                        materialDataState: { ...inputParam.materialDataState, sort: undefined, filter: undefined },
                        taskDataState: { ...inputParam.taskDataState, sort: undefined, filter: undefined },
                        documentDataState: { ...inputParam.documentDataState, sort: undefined, filter: undefined },
                        resultChangeDataState: { ...inputParam.resultChangeDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParam.testCommentDataState, sort: undefined, filter: undefined },
                        historyDataState: { ...inputParam.historyDataState, sort: undefined, filter: undefined },
                        samplePrintHistoryDataState: { ...inputParam.samplePrintHistoryDataState, sort: undefined, filter: undefined },
                        sampleHistoryDataState: { ...inputParam.sampleHistoryDataState, sort: undefined, filter: undefined }
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
                const GradeListMap = constructOptionList(response.data.Grade || [], "ngradecode", "sgradename", 'ascending', 'ngradecode', false);
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
export function getAcceptTest(inputParam) {
    return function (dispatch) {
        let inputData = {
            nsampletypecode :inputParam.testGetParam.nsampletypecode,
            nregtypecode :inputParam.testGetParam.nregtypecode,
            nregsubtypecode : inputParam.testGetParam.nregsubtypecode,
            ntransactionstatus :inputParam.testGetParam.ntransactionstatus,
            napprovalversioncode :inputParam.testGetParam.napprovalversioncode,
            nsectioncode :inputParam.testGetParam.nsectioncode,
            ntestcode :inputParam.testGetParam.ntestcode,
            fromdate: inputParam.testGetParam.dfrom,
            todate: inputParam.testGetParam.dto,
            npreregno :inputParam.testGetParam.masterData.MJSelectedSample ? inputParam.testGetParam.masterData.MJSelectedSample.map(sample => sample.npreregno).join(",") : "",
            ntransactionsamplecode : inputParam.testGetParam.masterData.MJSelectedSubSample ? inputParam.testGetParam.masterData.MJSelectedSubSample.map(subsample => subsample.ntransactionsamplecode).join(",") : "",

        //    npreregno :inputParam.MJSelectedTest ? inputParam.MJSelectedTest.map(sample => sample.npreregno).join(",") : "",
        //    ntransactionsamplecode : inputParam.MJSelectedTest ? inputParam.MJSelectedTest.map(subsample => subsample.ntransactionsamplecode).join(",") : "",


            transactiontestcode: inputParam.MJSelectedTest ? inputParam.MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
            ntransactiontestcode: 0,
            ncontrolcode : inputParam.ncontrolcode,
            nneedsubsample:inputParam.testGetParam.masterData.nneedsubsample,
            ndesigntemplatemappingcode :inputParam.testGetParam.ndesigntemplatemappingcode,
            checkBoxOperation:3,

            userinfo: inputParam.userInfo
        }

        if (inputData.transactiontestcode && inputData.transactiontestcode.length > 0) {
            dispatch(initRequest(true));
            rsapi().post("myjobs/CreateAcceptTest", inputData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)
                    let MJ_TEST =[];
                    MJ_TEST =responseData["MJ_TEST"]
                    // let searchedTests = undefined;
                    // if (inputParam.testGetParam.masterData["searchedTests"]) {
                    //     let searchtestcode =inputParam.testGetParam.masterData.searchedTests.map(a => a.ntransactiontestcode)
                    //     let responsetestcode =responseData.MJ_TEST.map(b=>b.ntransactiontestcode)
                    //     searchtestcode.forEach((value, i) => {
                    //         if(value === responsetestcode[i]) {
                    //             inputParam.testGetParam.masterData["searchedTests"] =MJ_TEST;
                    //             //MJ_TEST = inputParam.testGetParam.masterData["searchedTests"] ;
                    //         }else{
                    //             inputParam.testGetParam.masterData["searchedTests"]=[]; 

                    //         }
                    //     });
                    // }

                   

                    let masterData = {
                        ...inputParam.testGetParam.masterData,
                        ...response.data,
                        MJ_TEST 
                       // searchedTests
                    };

                    
                    
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            ...responseData,
                            masterData,
                           
                            loading: false,
                            operation: "update",
                           
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
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esignpassword"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["esigncomments"]
                            delete inputParam["screenData"]["inputParam"]["inputData"][methodUrl.toLowerCase()]["agree"]
                        }
                        dispatch(performAction(inputParam["screenData"]["inputParam"], inputParam["screenData"]["masterData"]))
                    } else if (inputParam.operation === 'reportgeneration') {
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]['reporparam']["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]['reporparam']["agree"]
                        inputParam["screenData"]["inputParam"]["reporparam"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(generateCOAReport(inputParam["screenData"]["inputParam"]['reporparam']))
                    }
                    else if (inputParam.operation === 'decision') {
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esignpassword"]
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["esigncomments"]
                        delete inputParam["screenData"]["inputParam"]["inputData"]['updatedecision']["agree"]
                        inputParam["screenData"]["inputParam"]["inputData"]["userinfo"] = inputParam.inputData.userinfo;
                        dispatch(updateDecision(inputParam["screenData"]["inputParam"]))
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
export function getEnforceCommentsHistory(selectedParam, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("approval/getEnforceCommentsHistory", {
            ntransactionresultcode: selectedParam.ntransactionresultcode,
            userinfo: userInfo
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
                            screenName: "IDS_ENFORCECOMMENTHISTORY"
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
export function reportGenerate(inputParam) {
    return function (dispatch) {

        dispatch(initRequest(true));
        const inputData = {
            npreregno: inputParam.sample.npreregno,
            userinfo: inputParam.userinfo,
            reportName:"RJ_Samplewise_Report_QRCode",
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