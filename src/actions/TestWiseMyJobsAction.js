import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from './LoginAction';
import { constructOptionList, fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, replaceUpdatedObject, sortData, getSameRecordFromTwoArrays, getSameRecordFromTwoDifferentArrays, filterRecordBasedOnPrimaryKeyName } from '../components/CommonScript';
import { postCRUDOrganiseTransSearch } from './ServiceAction';
import Axios from 'axios';
import { checkBoxOperation } from '../components/Enumeration';
import { intl } from '../components/App'

export function getMyJobsubSampleDetailTestWise(inputData, isServiceRequired) {
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
            ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
            // checkBoxOperation: inputData.masterData.searchedSubSample ?  
            //     inputData.masterData.searchedSubSample.length > 0 ? inputData.checkBoxOperation:3:inputData.checkBoxOperation
            checkBoxOperation: inputData.masterData.searchedSubSample ?
                inputData.masterData.searchedSubSample.length > 0 ? inputData.checkBoxOperation : checkBoxOperation.SINGLESELECT : inputData.checkBoxOperation
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("testwisemyjobs/getMyJobsSubSampleDetails", inputParamData)
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
                        //if (inputData.checkBoxOperation === 1 || inputData.checkBoxOperation === 7 || inputData.checkBoxOperation === 5) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL || inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {

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
                            const MJSelectedTest = oldSelectedTest.length > 0 ? getSameRecordFromTwoArrays(oldSelectedTest,
                                masterData.MJSelectedSubSample, 'npreregno') : responseData.MJSelectedTest
                            masterData = {
                                ...masterData,
                                MJSelectedTest,
                                ApprovalParameter: responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0 ? responseData.ApprovalParameter : masterData.ApprovalParameter : masterData.ApprovalParameter
                            }
                        }
                        //if (inputData.checkBoxOperation === 3) {
                        if (inputData.checkBoxOperation === checkBoxOperation.SINGLESELECT) {
                            masterData = {
                                ...masterData,
                                MJSelectedTest: masterData.MJ_TEST.length > 0 ? [masterData.MJ_TEST[0]] : [],
                                ApprovalParameter: responseData.ApprovalParameter ? responseData.ApprovalParameter.length > 0 ? responseData.ApprovalParameter : masterData.ApprovalParameter : masterData.ApprovalParameter
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

                        //if (inputData.checkBoxOperation === 1) {
                        if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
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
                            // } else if (inputData.checkBoxOperation === 5) {
                        } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
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
                        } else {
                            masterData = {
                                ...masterData,
                                selectedTest: inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : []
                            }
                            //let ntransactiontestcode = inputData.masterData.MJ_TEST.length > 0 ? inputData.masterData.MJ_TEST[0].ntransactiontestcode : 0
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
            if (inputData["statusNone"]) {
                TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].npreregno, "npreregno");
                subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedSubSample, inputData.removeElementFromArray[0].npreregno, "npreregno");
            }
            else {
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
                // inputData = {
                //     ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                //         "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                //         MJSelectedSubSample, checkBoxOperation: 3,masterData,...skipInfo
                // }

                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                    MJSelectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, masterData, ...skipInfo
                }

                if (subSample) {
                    if (MJSelectedTest.length === 0) {
                        inputData["npreregno"] = MJSelectedSubSample.map(x => x.npreregno).join(",")
                        inputData["ntransactionsamplecode"] = MJSelectedSubSample.map(x => x.ntransactionsamplecode).join(",")
                        //inputData["checkBoxOperation"] = 3
                        inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
                        inputData["childTabsKey"] = ["MJ_TEST"]
                        dispatch(getMyJobTestDetailTestWise(inputData, true));
                    } else {
                        dispatch(getMJTestChildTabDetailTestWise(inputData, true));
                    }
                } else {
                    dispatch(getMJTestChildTabDetailTestWise(inputData, true));
                }

                // dispatch(getMJTestChildTabDetailTestWise(inputData, true));
            } else {
                //added by sudharshanan for test select issue while sample click
                let masterData = {
                    ...inputData.masterData,
                    MJSelectedTest: TestSelected ? TestSelected : inputData.masterData.MJ_TEST.length > 0 ? [inputData.masterData.MJ_TEST[0]] : [],
                    MJSelectedSample: inputData.MJSelectedSample,
                    MJSelectedSubSample: subSampleSelected ? subSampleSelected : inputData.masterData.MJ_SUBSAMPLE.length > 0 ? [inputData.masterData.MJ_SUBSAMPLE[0]] : []
                }
                let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                oldSelectedTest.map((test, index) => {
                    if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        oldSelectedTest.splice(index, 1)
                    }
                    return null;
                });

                if (subSample) {
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


export function getMyJobTestDetailTestWise(inputData, isServiceRequired) {
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
            ntransactiontestcode: 0,
            nsectioncode: inputData.nsectioncode,
            ntestcode: inputData.ntestcode,
            activeTestTab: inputData.activeTestTab,
            activeSampleTab: inputData.activeSampleTab,
            userinfo: inputData.userinfo,
            ntransactionstatus: inputData.ntransactionstatus,
            ndesigntemplatemappingcode: inputData.masterData.ndesigntemplatemappingcode,
            checkBoxOperation: inputData.checkBoxOperation
        }
        let activeName = "";
        let dataStateName = "";
        //let masterData = {};
        //let subSample = inputData.nneedsubsample;
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("testwisemyjobs/getMyJobsTestDetails", inputParamData)
                .then(response => {
                    let responseData = { ...response.data }
                    responseData = sortData(responseData, 'descending', 'npreregno')
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


                    //if (inputData.checkBoxOperation === 1) {
                    if (inputData.checkBoxOperation === checkBoxOperation.MULTISELECT) {
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
                        //} else if (inputData.checkBoxOperation === 5) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {
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
                        //} else if (inputData.checkBoxOperation === 7) {
                    } else if (inputData.checkBoxOperation === checkBoxOperation.QUICKSELECTALL) {
                        //  let wholeTestList = masterData.MJ_TEST.map(b => b.ntransactiontestcode)
                        //let wholeTestListForSelectAll = masterData.MJ_TEST
                        // let wholeTestListForSelectSingleSelect =
                        //     oldSelectedTest.forEach((test, index) => {
                        //         if (!wholeTestList.includes(test.ntransactiontestcode)) {
                        //             oldSelectedTest.splice(index, 1)
                        //         }

                        //     })

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
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.MJSelectedTest, inputData.removeElementFromArray[0].ntransactionsamplecode, "ntransactionsamplecode") :
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
                // inputData = {
                //     ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                //         "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                //         MJSelectedSubSample, checkBoxOperation: 3, skipInfo
                // }
                inputData = {
                    ...inputData, childTabsKey: ["ApprovalParameter", "ApprovalResultChangeHistory", "ResultUsedInstrument",
                        "ResultUsedTasks", "RegistrationTestAttachment", "RegistrationTestComment"], ntransactiontestcode, MJSelectedSample, selectedPreregno, MJSelectedTest,
                    MJSelectedSubSample, checkBoxOperation: checkBoxOperation.SINGLESELECT, skipInfo
                }
                dispatch(getMJTestChildTabDetailTestWise(inputData, true));
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



export function getMJTestChildTabDetailTestWise(inputData, isServiceRequired) {
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
                                    activeTabIndex: inputData.activeTabIndex,
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
export function getMJSampleChildTabDetailTestWise(inputData) {
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

export function getRegTypeTestWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getRegistrationTypeBySampleType", inputData)
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
export function getRegSubTypeTestWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getRegistrationsubTypeByRegType", inputData)
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
export function getTestStatusTestWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getFilterStatusByApproveVersion", inputData)
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

export function getAppConfigVersionTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getApprovalConfigVersionByRegSubType", inputParam.inputData)
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
                            defaultRegSubTypeValue: inputParam.masterData.defaultRegSubTypeValue,
                            RegSubTypeValue: inputParam.masterData.realRegSubTypeValue,
                            realDesignTemplateMappingValue: inputParam.inputData.realDesignTemplateMappingValue,
                            realDynamicDesignMappingList: inputParam.inputData.realDynamicDesignMappingList
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

export function getDesignTemplateTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getDesignTemplateByApprovalConfigVersion", inputParam)
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


export function getFilterStatusSectionTestWise(inputData) {
    return function (dispatch) {
        const testStatusService = rsapi().post("testwisemyjobs/getFilterStatusByApproveVersion", inputData);
        const sectionService = rsapi().post("testwisemyjobs/getSectionByApproveVersion", inputData);
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

export function getSectionTestWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getTestComboBySection", inputData)
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

export function getFilterStatusTestWise(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getTestComboBySection", inputData)
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


export function getMyJobsSampleTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getMyTestWiseJobsDetails", inputParam.inputData)
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
                    masterData['searchedTest'] = undefined
                    // masterData['searchedTests'] = undefined

                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showTest: inputParam.inputData.showTest,
                        activeTestTab: inputParam.inputData.activeTestTab,
                        showFilter: false,
                        skip: 0,
                        take: inputParam.take,
                        testskip: 0,
                        testtake: inputParam.testtake,
                        documentDataState: { ...inputParam.documentDataState, sort: undefined, filter: undefined },
                        testCommentDataState: { ...inputParam.testCommentDataState, sort: undefined, filter: undefined },
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
// export function getAcceptTestTestWise(action,inputParam,MJSelectedTest,userInfo) {
//     return function (dispatch) {
//         let inputData = {
//             nflag:3,
//             ncheck:1,
//             nsampletypecode :inputParam.nsampletypecode,
//             nregtypecode :inputParam.nregtypecode,
//             nregsubtypecode : inputParam.nregsubtypecode,
//             ntransactionstatus :inputParam.ntransactionstatus,
//             napprovalversioncode :inputParam.napprovalversioncode,
//             nsectioncode :inputParam.nsectioncode,
//             ntestcode :inputParam.ntestcode,
//             fromdate: inputParam.dfrom,
//             todate: inputParam.dto,
//             npreregno :MJSelectedTest ? MJSelectedTest.map(sample => sample.npreregno).join(",") : "",
//             ntransactionsamplecode : MJSelectedTest ? MJSelectedTest.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
//             transactiontestcode: MJSelectedTest ? MJSelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
//             ntransactiontestcode: 0,
//             ncontrolcode : action.ncontrolcode,
//             nneedsubsample:inputParam.masterData.nneedsubsample,
//             ndesigntemplatemappingcode :inputParam.ndesigntemplatemappingcode,
//             checkBoxOperation:3,
//             scontrolname : action.scontrolname,

//             userinfo: userInfo
//         }

//         if (inputData.transactiontestcode && inputData.transactiontestcode.length > 0) {
//             dispatch(initRequest(true));
//             rsapi().post("testwisemyjobs/CreateAcceptTest", inputData)
//                 .then(response => {
//                     let responseData = { ...response.data }
//                     responseData = sortData(responseData)

//                    let MJ_TEST= replaceUpdatedObject (response.data.MJ_TEST, inputParam.masterData.MJ_TEST, 'ntransactiontestcode');
//                    delete response.data.MJ_TEST;
//                    let MJSelectedTest=replaceUpdatedObject(response.data["MJSelectedTest"], inputParam.masterData.MJSelectedTest, "ntransactiontestcode");

//                    // let MJ_TEST =[];
//                    // MJ_TEST =responseData["MJ_TEST"]

//                     let masterData = {
//                         ...inputParam.masterData,
//                         ...response.data,
//                         MJ_TEST, 
//                         MJSelectedTest
//                     };
//                     let respObject = {
//                         masterData,
//                         ...inputParam.inputData,
//                         loading: false,
//                         loadEsign: false,
//                         openModal: false,
//                         showSample: undefined
//                     }
//                     dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));
//                     dispatch({
//                         type: DEFAULT_RETURN, payload: {
//                             ...responseData,
//                             masterData,
//                             loading: false,
//                             operation: "update",              
//                         }
//                     })
//                 })
//                 .catch(error => {
//                     dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
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
//                     }
//                     else {
//                         toast.warn(error.response.data);
//                     }
//                 })
//         } else {
//             dispatch({
//                 type: DEFAULT_RETURN,
//                 payload: {
//                     multilingualMsg: "IDS_SELECTTEST",
//                 }
//             });
//         }
//     }
// }

//Modified by sonia on 28th August 2025 for jira id:SWSM-15
export function getAcceptTestTestWise(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/updateTestStatus", inputParam.inputData)
            .then(response => {

                if(inputParam.inputData.scontrolname==="Revert"){
                    if (response.data.rtn === undefined) {
                        let responseData = { ...response.data }
                        responseData = sortData(responseData)

                        let MJ_TEST = replaceUpdatedObject(response.data.MJ_TEST, inputParam.masterData.MJ_TEST, 'ntransactiontestcode');
                        delete response.data.MJ_TEST;
                        let MJSelectedTest = replaceUpdatedObject(response.data["MJSelectedTest"], inputParam.masterData.MJSelectedTest, "ntransactiontestcode");
                        let masterData = {
                            ...inputParam.masterData,
                            ...response.data,
                            MJ_TEST,
                            MJSelectedTest
                        };
                        let respObject = {
                            masterData,
                            ...inputParam.inputData,
                            loading: false,
                            loadEsign: false,
                            openModal: false,
                            showSample: undefined
                        }
                        dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                ...responseData,
                                masterData,
                                loading: false,
                                operation: "update",
                            }
                        })
                    }else{
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                loadEsign: false,
                                openModal: false
                            }
                        });
                        toast.warn(intl.formatMessage({id: response.data.rtn}));
                    }

                }else if(inputParam.inputData.scontrolname==="Accept"){
                    if(response.data.rtn){
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                loading: false,
                                loadEsign: false,
                                openModal: false
                            }
                        });
                        toast.warn(intl.formatMessage({id: response.data.rtn}));
                    }
                    let responseData = { ...response.data }
                    responseData = sortData(responseData)

                    let MJ_TEST = replaceUpdatedObject(response.data.MJ_TEST, inputParam.masterData.MJ_TEST, 'ntransactiontestcode');
                    delete response.data.MJ_TEST;
                    let MJSelectedTest = replaceUpdatedObject(response.data["MJSelectedTest"], inputParam.masterData.MJSelectedTest, "ntransactiontestcode");
                    let masterData = {
                        ...inputParam.masterData,
                        ...response.data,
                        MJ_TEST,
                        MJSelectedTest
                    };
                    let respObject = {
                        masterData,
                        ...inputParam.inputData,
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showSample: undefined
                    }
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject));
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            ...responseData,
                            masterData,
                            loading: false,
                            operation: "update",
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
                    toast.warn(error.response.data);
                }
            })
    }
}
export function validateEsignforAccept(inputParam) {
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
                    if (inputParam["operation"] === "accept") {
                        dispatch(getAcceptTestTestWise(inputParam["screenData"]["inputParam"], inputParam["screenData"]["inputParam"]["MJSelectedTest"], inputParam.inputData.userinfo))
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

export function getmyjobsFilterDetails(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("testwisemyjobs/getmyjobsFilterDetails", { ...inputParam.inputData })
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
