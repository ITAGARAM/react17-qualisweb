import rsapi from '../rsapi';
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import {
    constructOptionList,
    sortData
} from '../components/CommonScript' //getComboLabelValue,, searchData
import {
    toast
} from 'react-toastify';
import Axios from 'axios';
import {
    initRequest
} from './LoginAction';
import {
    intl
} from '../components/App';
import {
    ColumnType,
    queryTypeFilter,
    transactionStatus
} from '../components/Enumeration';
import { format } from 'date-fns';

export function getTestGroupRulesEngineAdd(userInfo, testgrouprulesengine, inputParam, masterData) {
    let testcomments = []
    let reportcomments = []
    let predefcomments = []
    let sampletestcommentsList = []
    let selectedRecord = {}
    let addGroupList = []
    return function (dispatch) {
        if (masterData && masterData.SelectedTest === null || masterData && masterData.SelectedTest === undefined) {
            toast.warn(intl.formatMessage({ id: "IDS_ADDTEST" }));
        }
        else {
            //if (masterData.SelectedSpecification&&masterData.SelectedSpecification['napprovalstatus'] === transactionStatus.APPROVED) { 
            dispatch(initRequest(true));
            let url = [];
            if (testgrouprulesengine) {
                url.push(rsapi().post("/testgrouprulesengine/getdatabasetables", {
                    userinfo: userInfo
                }));

            } else {
                url.push(rsapi().post("/testgrouprulesengine/getTestGroupRulesEngineAdd", {
                    "ntestgrouptestcode": masterData.SelectedTest.ntestgrouptestcode,
                    "nspecsampletypecode": masterData.SelectedComponent.nspecsampletypecode,
                    "napproveconfversioncode": masterData.SelectedSpecification.napproveconfversioncode,
                    "nallottedspeccode": masterData.SelectedSpecification.nallottedspeccode,
                    userinfo: userInfo
                }));
                url.push(rsapi().post("/grade/getGrade", {
                    userinfo: userInfo
                }));
                url.push(rsapi().post("/site/getSite", {
                    userinfo: userInfo
                }));
                url.push(rsapi().post("/sampletestcomments/getSampleTestComments", {
                    userinfo: userInfo
                }));
                url.push(rsapi().post("/sampletestcomments/getCommentType", {
                    userinfo: userInfo
                }));
                url.push(rsapi().post("/sampletestcomments/getCommentSubType", {
                    userinfo: userInfo
                }));
            }
            Axios.all(url)
                .then(response => {
                    const DiagnosticCase = constructOptionList(response[0].data["DiagnosticCase"] || [], "ndiagnosticcasecode", "sdiagnosticcasename", false, false, false);
                    const Grade = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, false);
                    const viewListMap = constructOptionList(response[0].data["TestParameter"] || [], "ntestgrouptestparametercode", "stestparametersynonym", undefined, undefined, undefined);
                    const resultType = constructOptionList(response[0].data["ResultType"] || [], "nresultypecode", "sdisplayname", undefined, undefined, undefined);
                    const site = constructOptionList(response[2].data || [], "nsitecode", "ssitename", false, false, false);
                    const CommentType = constructOptionList(response[4].data['CommentType'] || [], "ncommenttypecode", "scommenttype", false, false, false);
                    let commentsubtypelst = response[5].data['CommentSubType']
                    let w = commentsubtypelst.filter(x => x.ncommentsubtypecode === 3 || x.ncommentsubtypecode === 6)
                    const CommentSubType = constructOptionList(w || [], "ncommentsubtypecode", "scommentsubtype", false, false, false);
                    const testInitiateTestCombo = constructOptionList(masterData['TestGroupTest'] || [], "ntestgrouptestcode", "stestsynonym", false, false, false);

                    let commentlist = response[3].data
                    let x = commentlist.filter(x => x.ncommentsubtypecode === 1)
                    let y = commentlist.filter(x => x.ncommentsubtypecode === 4)
                    let z = commentlist.filter(x => x.ncommentsubtypecode === 3)

                    testcomments = (constructOptionList(x || [], "nsampletestcommentscode", "sdescription", false, false, false)).get("OptionList");
                    reportcomments = (constructOptionList(y || [], "nsampletestcommentscode", "sdescription", false, false, false)).get("OptionList");
                    predefcomments = (constructOptionList(z || [], "nsampletestcommentscode", "spredefinedname", false, false, false)).get("OptionList");

                    masterData['testParameter'] = {}
                    masterData['testParameterComments'] = {}
                    masterData['testParameterreportComments'] = {}
                    masterData['testComments'] = {}
                    masterData['reportComments'] = {}
                    masterData['testSite'] = {}
                    masterData['testRepeat'] = []
                    masterData['testenforceTests'] = []
                    masterData['GradeValues'] = response[0].data.GradeValues
                    selectedRecord["groupList"] = [];
                    selectedRecord["groupList"][0] = [];
                    selectedRecord["groupList"][0]["button_and"] = true;
                    selectedRecord["groupList"][0][0] = {};
                    addGroupList[0] = 1;

                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false,
                            operation: 'create',
                            databaseviewList: viewListMap.get("OptionList"),
                            testcomments,
                            reportcomments,

                            openPortalModal: true,
                            screenName: "IDS_ADDRULESENGINE",
                            testgrouprulesengine,
                            ...inputParam,

                            siteObject: {},
                            testCommentObject: {},
                            reportCommentObject: {},
                            testInitiateTests: [],
                            testRepeatTests: [],
                            testenforceTests: [],
                            testCommentsTests: [],
                            reportCommentsTests: []
                            ,
                            reportCommentsTestsTab: [],

                            activeTabIndex: 0,
                            masterData: {
                                ...masterData, testInitiateTestCombo: testInitiateTestCombo.get("OptionList"),
                                testCommentsTestCombo: testInitiateTestCombo.get("OptionList"),
                                testRepeatTestCombo: testInitiateTestCombo.get("OptionList"),
                                testenforceTestCombo: testInitiateTestCombo.get("OptionList"),
                                rulesOption: viewListMap.get("OptionList"),
                                DiagnosticCaseList: DiagnosticCase.get("OptionList"),
                                GradeList: Grade.get("OptionList"),
                                siteList: site.get("OptionList"),
                                resultTypeList: resultType.get("OptionList"),
                                testCommentsTestsTab: [],
                                testInitiateSiteTab: [],
                                PredefinedParameterOptions: [],
                                testRepeatTestsTab: [],
                                testenforceTestsTab: [],
                            },

                            testInitiateTestOptions: viewListMap.get("OptionList"),
                            testCommentsTestOptions: viewListMap.get("OptionList"),
                            reportCommentsTestOptions: viewListMap.get("OptionList"),
                            CommentType: CommentType.get("OptionList"),
                            CommentSubType: CommentSubType.get("OptionList"),
                            predefcomments,
                            openModalPopup: false,
                            openmodalsavePopup: false,
                            addGroupList,
                            selectedRecord,
                            viewColumnListByRule: viewListMap.get("OptionList"),
                            isServiceNeed:true
                            
                        }
                    });
                }
                )
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
            // }
            // else {
            //     toast.warn(intl.formatMessage({ id: "IDS_RULESCANBEADDEDONLYFORAPPROVEDSPEC" })); 
            // }

        }
    }
}
export function getSpecificationTestGroupRulesEngine(inputParam, selectedRecord, ismodalcombochange, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getSpecificationTestGroupRulesEngine",
            { 'userinfo': userInfo, "nproductcatcode": inputParam.nproductcatcode.item.nproductcatcode })
            .then(response => {
                const TestGroupSpecification = constructOptionList(response.data.TestGroupSpecification || [], "nallottedspeccode",
                    "sspecname", undefined, undefined, undefined);
                let TestGroupSpecificationList = TestGroupSpecification.get("OptionList");
                if (ismodalcombochange) {
                    selectedRecord = { ...selectedRecord, ...inputParam, 'nallottedspeccode': TestGroupSpecificationList[0] }
                    masterData = { ...masterData, ...response.data }
                }
                else {
                    let selectedcombo = { ...inputParam, 'nallottedspeccode': TestGroupSpecificationList[0] }
                    masterData = { ...masterData, ...response.data, selectedcombo }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedRecord,
                        loading: false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getComponentTestGroupRulesEngine(inputParam, selectedRecord, ismodalcombochange, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getComponentTestGroupRulesEngine",
            { 'userinfo': userInfo, "nallottedspeccode": inputParam.nallottedspeccode.item.nallottedspeccode })
            .then(response => {
                const Component = constructOptionList(response.data.Component || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, undefined);
                let ComponentList = Component.get("OptionList");
                if (ismodalcombochange) {
                    selectedRecord = { ...selectedRecord, ...inputParam, 'ncomponentcode': ComponentList[0] }
                    masterData = { ...masterData, ...response.data }
                }
                else {
                    let selectedcombo = { ...inputParam, 'ncomponentcode': ComponentList[0] }
                    masterData = { ...masterData, ...response.data, selectedcombo }
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedRecord,
                        loading: false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getSelectedTestGroupRulesEngine(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getSelectedTestGroupRulesEngine",
            {
                'userinfo': userInfo, "ntestgrouprulesenginecode": parseInt(inputParam.ntestgrouprulesenginecode)//, nproductcatcode: masterData.SelectedProductCategory.nproductcatcode
                , "ntestgrouptestcode": masterData.SelectedTest.ntestgrouptestcode,
            })
            .then(response => {
                masterData = {
                    ...masterData, SelectedRulesEngine: response.data["SelectedRulesEngine"]
                };

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}



export function getTestGroupRulesEngine(nproductcatcode, nallottedspeccode, ncomponentcode, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getTestGroupRulesEngine",
            {
                'userinfo': userInfo, "nproductcatcode": nproductcatcode
                , "nallottedspeccode": nallottedspeccode
                , "ncomponentcode": ncomponentcode
            })
            .then(response => {

                masterData = {
                    ...response.data
                };
                sortData(masterData);

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export function getEditTestGroupRulesEngine(operation, masterData//,
    // ncontrolCode
    , userInfo) {
    let testcomments = []
    let reportcomments = []
    let predefcomments = []
    return function (dispatch) {
        if (masterData['RulesEngine'] && masterData['RulesEngine'].length > 0) {
            let urlArray = [];
            let selectedRecord = {}
            urlArray.push(rsapi().post("testgrouprulesengine/getEditTestGroupRulesEngine", {
                'ntestgrouprulesenginecode':
                    masterData.SelectedRulesEngine['ntestgrouprulesenginecode'], 'masterData': masterData, "userinfo": userInfo
            }));
            urlArray.push(rsapi().post("/grade/getGrade", {
                userinfo: userInfo
            }));
            urlArray.push(rsapi().post("/site/getSite", {
                userinfo: userInfo
            }));
            urlArray.push(rsapi().post("/sampletestcomments/getSampleTestComments", {
                userinfo: userInfo
            }));
            urlArray.push(rsapi().post("/testgrouprulesengine/getTestGroupRulesEngineAdd", {
                "ntestgrouptestcode": masterData.SelectedTest.ntestgrouptestcode,
                "nspecsampletypecode": masterData.SelectedComponent.nspecsampletypecode,
                "napproveconfversioncode": masterData.SelectedSpecification.napproveconfversioncode,
                "nallottedspeccode": masterData.SelectedSpecification.nallottedspeccode,
                userinfo: userInfo
            }));
            urlArray.push(rsapi().post("/productcategory/getProductCategory", {
                userinfo: userInfo
            }));

            urlArray.push(rsapi().post("/sampletestcomments/getCommentType", {
                userinfo: userInfo
            }));
            urlArray.push(rsapi().post("/sampletestcomments/getCommentSubType", {
                userinfo: userInfo
            }));
            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    masterData['testParameter'] = {}
                    masterData['testParameterComments'] = {}
                    masterData['testParameterreportComments'] = {}
                    let responsedata = response[0].data
                    let srulename = responsedata['RulesEngineEdit'][0]['srulename']
                    //    let nruleexecorder = responsedata['RulesEngineEdit'][0]['nruleexecorder']
                    let groupList = responsedata['RulesEngineEdit'][0]['jsondata']
                    let outcomeList = responsedata['RulesEngineEdit'][0]['jsonuidata']
                    selectedRecord["groupList"] = []
                    groupList.map((ruleslist, index) => {

                        if (ruleslist.hasOwnProperty('button_or')) {
                            selectedRecord["groupList"][index] = ruleslist["button_or"]
                            selectedRecord["groupList"][index]["button_or"] = true
                        }
                        if (ruleslist.hasOwnProperty('button_and')) {
                            selectedRecord["groupList"][index] = ruleslist["button_and"]
                            selectedRecord["groupList"][index]["button_and"] = true
                        }
                        if (ruleslist.hasOwnProperty('button_not_button_and')) {
                            selectedRecord["groupList"][index] = ruleslist["button_not_button_and"]
                            selectedRecord["groupList"][index]["button_and"] = true
                            selectedRecord["groupList"][index]["button_not"] = true
                        }
                        if (ruleslist.hasOwnProperty('button_not_button_or')) {
                            selectedRecord["groupList"][index] = ruleslist["button_not_button_or"]
                            selectedRecord["groupList"][index]["button_or"] = true
                            selectedRecord["groupList"][index]["button_not"] = true
                        }
                    })
                    // if (responsedata['RulesEngineEdit'][0]['jsondata'].hasOwnProperty('button_not_button_and')) {
                    //     selectedRecord["groupList"]['button_not'] = true
                    // }
                    // if (responsedata['RulesEngineEdit'][0]['jsondata'].hasOwnProperty('button_not_button_or')) {
                    //     selectedRecord["groupList"]['button_not'] = true
                    // }
                    if (responsedata['RulesEngineEdit'][0]['jsondata'].hasOwnProperty('button_or')) {
                        selectedRecord["groupList"]['button_or'] = true
                    }
                    else {
                        selectedRecord["groupList"]['button_and'] = true
                    }
                    selectedRecord['srulename'] = srulename
                    selectedRecord['srulenamecopy'] = srulename
                    //     selectedRecord['nruleexecordercopy'] = nruleexecorder
                    // selectedRecord["groupList"][0]["button_and"] = true
                    let addGroupList = []
                    addGroupList = responsedata['RulesEngineEdit'][0]['jsonuidata']['addGroupList']
                    const DiagnosticCase = constructOptionList(response[4].data["DiagnosticCase"] || [], "ndiagnosticcasecode", "sdiagnosticcasename", false, false, false);
                    const Grade = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, false);
                    const viewListMap = constructOptionList(response[4].data["TestParameter"] || [], "ntestgrouptestparametercode", "stestparametersynonym", undefined, undefined, undefined);
                    const resultType = constructOptionList(response[4].data["ResultType"] || [], "nresultypecode", "sdisplayname", undefined, undefined, undefined);
                    const site = constructOptionList(response[2].data || [], "nsitecode", "ssitename", false, false, false);
                    const CommentType = constructOptionList(response[6].data['CommentType'] || [], "ncommenttypecode", "scommenttype", false, false, false);
                    const testInitiateTestCombo = constructOptionList(masterData['TestGroupTest'] || [], "ntestgrouptestcode", "stestsynonym", false, false, false);


                    let commentsubtypelst = response[7].data['CommentSubType']
                    let w = commentsubtypelst.filter(x => x.ncommentsubtypecode === 3 || x.ncommentsubtypecode === 6)
                    const CommentSubType = constructOptionList(w || [], "ncommentsubtypecode", "scommentsubtype", false, false, false);
                    let commentlist = response[3].data
                    let x = commentlist.filter(x => x.ncommentsubtypecode === 1)
                    let y = commentlist.filter(x => x.ncommentsubtypecode === 4)
                    let z = commentlist.filter(x => x.ncommentsubtypecode === 3)
                    testcomments = (constructOptionList(x || [], "nsampletestcommentscode", "sdescription", false, false, false)).get("OptionList");
                    reportcomments = (constructOptionList(y || [], "nsampletestcommentscode", "sdescription", false, false, false)).get("OptionList");
                    predefcomments = (constructOptionList(z || [], "nsampletestcommentscode", "spredefinedname", false, false, false)).get("OptionList");

                    masterData['testParameter'] = outcomeList['testInitiateTests'] && outcomeList['testInitiateTests']
                    masterData['testRepeat'] = outcomeList['testRepeatTests'] && outcomeList['testRepeatTests']
                    masterData['testenforceTests'] = outcomeList['testenforceTests'] && outcomeList['testenforceTests']

                    masterData['testParameterComments'] = outcomeList['testCommentsTests'] && outcomeList['testCommentsTests']
                    masterData['testParameterreportComments'] = outcomeList['reportCommentsTests'] && outcomeList['reportCommentsTests']

                    masterData["testComments"] = outcomeList['testCommentObject'] && outcomeList['testCommentObject']
                    masterData["reportComments"] = outcomeList['reportCommentObject'] && outcomeList['reportCommentObject']
                    masterData["testSite"] = outcomeList['siteObject'] && outcomeList['siteObject']
                    selectedRecord["nproductcatcode"] = outcomeList['nproductcatcode'] && outcomeList['nproductcatcode']
                    selectedRecord["nallottedspeccode"] = outcomeList['nallottedspeccode'] && outcomeList['nallottedspeccode']
                    selectedRecord["ncomponentcode"] = outcomeList['ncomponentcode'] && outcomeList['ncomponentcode']
                    selectedRecord["groupListJoins"] = outcomeList['groupListJoins'] && outcomeList['groupListJoins']
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            operation: operation, screenName: "IDS_EDITRULESENGINE", selectedRecord,
                            openPortalModal: true,// ncontrolCode: ncontrolCode,
                            loading: false, addGroupList,
                            masterData: {
                                ...masterData, testInitiateTestCombo: testInitiateTestCombo.get("OptionList"),
                                testCommentsTestCombo: testInitiateTestCombo.get("OptionList"),
                                testRepeatTestCombo: testInitiateTestCombo.get("OptionList"),
                                testenforceTestCombo: testInitiateTestCombo.get("OptionList"),
                                rulesOption: viewListMap.get("OptionList"),
                                DiagnosticCaseList: DiagnosticCase.get("OptionList"),
                                GradeList: Grade.get("OptionList"),
                                siteList: site.get("OptionList"),
                                resultTypeList: resultType.get("OptionList"),
                                testCommentsTestsTab: outcomeList['testCommentsTestsTab'],
                                testRepeatTestsTab: outcomeList['testRepeatTestsTab'],
                                testenforceTestsTab: outcomeList['testenforceTestsTab'],
                                PredefinedParameterOptions: outcomeList['PredefinedParameterOptions'],
                                testInitiateSiteTab: outcomeList['testInitiateSiteTab'],
                                reportCommentsTestsTab: outcomeList['reportCommentsTestsTab'],
                                GradeValues: response[4].data.GradeValues
                            },
                            viewColumnListByRule: viewListMap.get("OptionList"),

                            testcomments,
                            reportcomments,

                            testInitiateTests: outcomeList['testInitiateTests'] && outcomeList['testInitiateTests'],
                            testCommentsTests: outcomeList['testCommentsTests'] && outcomeList['testCommentsTests'],
                            testRepeatTests: outcomeList['testRepeatTests'] && outcomeList['testRepeatTests'],
                            testenforceTests: outcomeList['testenforceTests'] && outcomeList['testenforceTests'],
                            reportCommentsTests: outcomeList['reportCommentsTests'] && outcomeList['reportCommentsTests'],
                            siteObject: outcomeList['siteObject'] && outcomeList['siteObject'],
                            testCommentObject: outcomeList['testCommentObject'] && outcomeList['testCommentObject'],
                            reportCommentObject: outcomeList['reportCommentObject'] && outcomeList['reportCommentObject'],

                            CommentType: CommentType.get("OptionList"),
                            CommentSubType: CommentSubType.get("OptionList"),
                            predefcomments,
                            openModalPopup: false,
                            openmodalsavePopup: false,
                            activeTabIndex: 0,
                            action: "update",
                            isServiceNeed:true
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
                        toast.error(intl.formatMessage({ id: error.message }));
                    }
                    else {
                        toast.warn(intl.formatMessage({ id: error.response.data }));
                    }
                })
        }
        else {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTRULETOEDIT" }));
        }
    }
}
export function getParameterforEnforce(selectedRecord, masterData, userInfo, activeTabIndex,action) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getParameterRulesEngine",
            { 'userinfo': userInfo, "ntestgrouptestcode": selectedRecord['ntestgrouptestcode'].value, 'tabIndex': activeTabIndex,
            'ntestgrouprulesenginecode':selectedRecord['ntestgrouprulesenginecode'] })
            .then(response => {
                const testGroupTestParameterRulesEngine = constructOptionList(response.data.TestGroupTestParameterRulesEngine || [], "ntestgrouptestparametercode",
                    "sparametersynonym", undefined, undefined, undefined);
                let testGroupTestParameterRulesEngineList = testGroupTestParameterRulesEngine.get("OptionList");
                masterData['testGroupTestParameterRulesEngine'] = testGroupTestParameterRulesEngineList
                //Start

                //end

                // let keylst = Object.keys(response.data.PredefinedValues)
                // keylst.map(ntestgrouptestparametercode => {
                //     response.data.PredefinedValues[ntestgrouptestparametercode] =
                //         constructOptionList(response.data.PredefinedValues[ntestgrouptestparametercode]
                //             || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                //             undefined, undefined).get("OptionList");
                // })
                // masterData['PredefinedValues'] = response.data.PredefinedValues
                // masterData['GradeValues'] = response.data.GradeValues
                // selectedRecord = { ...selectedRecord, 'ParameterRulesEngine': response.data.TestGroupTestParameterRulesEngine }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedRecord,
                        loading: false,
                        action,
                        openmodalsavePopup:false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function getParameterRulesEngine(selectedRecord, masterData, userInfo, activeTabIndex, action,isParameterPopupChanged) {
    return function (dispatch) {
        let additionalInfo = []
    //    dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getParameterRulesEngine",
            { 'userinfo': userInfo, "ntestgrouptestcode": selectedRecord['ntestgrouptestcode'].value, 'tabIndex': activeTabIndex,
        'ntestgrouprulesenginecode':selectedRecord['ntestgrouprulesenginecode'] })
            .then(response => {
                let selectedResultGrade = [];
                let paremterResultcode = [];
                const parameterResults = response.data.TestGroupTestParameterRulesEngine
                let tempparameterResults=[...parameterResults]
                let predefDefaultFlag = false;
                let savedTest = masterData['testParameter'].filter(test => test['ntestgrouptestcode'] === selectedRecord['ntestgrouptestcode'].value)
                if (savedTest.length > 0) {
                    if(savedTest[0]['ParameterRulesEngine']){
                        let savedTestParameterlist = savedTest[0]['ParameterRulesEngine']
                        tempparameterResults.map((param, index) => {
                            let savedParameter = savedTestParameterlist.filter(x => x['ntestgrouptestparametercode'] === param['ntestgrouptestparametercode'])[0]
                            if (savedParameter&&savedParameter['sresult'] !== '') {
                                //delete parameterResults[index]; 
                                  let removeIndex=parameterResults.findIndex(x=>x['ntestgrouptestparametercode']===savedParameter['ntestgrouptestparametercode'])
                                  parameterResults.splice(removeIndex,1);
                            }
                        });
                    } 
                }
                if(parameterResults.length>0){
                parameterResults.map((param, index) => {
                    selectedResultGrade[index] = {
                        ngradecode:  param.ngradecode
                    };
                    paremterResultcode[index] = param.ntestgrouptestparametercode;
                    // let jsondata=JSON.parse(param.jsondata['value'])
                      if(param.hasOwnProperty('additionalInfo')){
                        additionalInfo[param.ntestgrouptestparametercode]=param['additionalInfo'] 
                      }  
                    predefDefaultFlag = false;
                    (response.data.PredefinedValues && response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode]) &&
                        response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode].map(predefinedvalue => {
                            // if (predefinedvalue.ndefaultstatus === transactionStatus.YES&&
                            //     predefinedvalue.nneedresultentryalert=== transactionStatus.NO
                            //      && predefinedvalue.nneedsubcodedresult=== transactionStatus.NO) {
                            //     if (!predefDefaultFlag) {
                            //         predefDefaultFlag = true;
                            //         response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode] = constructOptionList(response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode] || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                            //             undefined, undefined).get("OptionList");
                                        
                            //     }
                                
                            //   //   if (response.data.TestGroupTestParameterRulesEngine[index].sresult === null) {
                            //         response.data.TestGroupTestParameterRulesEngine[index].sresult =predefinedvalue.spredefinedname;
                            //         response.data.TestGroupTestParameterRulesEngine[index].sresultpredefinedname = predefinedvalue.sresultpredefinedname;
                            //         response.data.TestGroupTestParameterRulesEngine[index].sfinal = predefinedvalue.spredefinedsynonym;
                            //         response.data.TestGroupTestParameterRulesEngine[index].editable = true;
                            //         response.data.TestGroupTestParameterRulesEngine[index].ngradecode = predefinedvalue.ngradecode;
                            //         response.data.TestGroupTestParameterRulesEngine[index].sgradename = predefinedvalue.sgradename; 
                            //         if (predefinedvalue.spredefinedcomments && predefinedvalue.spredefinedcomments !== null) {
                            //             response.data.TestGroupTestParameterRulesEngine[index].sresultcomment = predefinedvalue.spredefinedcomments
                            //                 && predefinedvalue.spredefinedcomments;
                            //         }
                            //  //  }
                            // }
                            // else {
                               
                                if (!predefDefaultFlag) {
                                    predefDefaultFlag = true;
                                    response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode] =
                                        constructOptionList(response.data.PredefinedValues[parameterResults[index].ntestgrouptestparametercode]
                                            || [], 'sresultpredefinedname', 'sresultpredefinedname', undefined,
                                            undefined, undefined).get("OptionList");
                                }

                            //}

                        });
                        response.data.TestGroupTestParameterRulesEngine[index].sresult=null
                });
            }
            else
            {
              return  toast.info(intl.formatMessage({ id: "IDS_NOMOREPARAMETERSAVAILABLEFORTHISTEST" }));
            }
            if(parameterResults.length>0){
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openModalPopup: true,
                        modalParameterPopup: action === "IDS_ADDPARAMETER" ? true : false,
                        masterData: {
                            ...masterData,
                            ...response.data,
                            paremterResultcode

                        },
                        selectedRecord: {
                            ...selectedRecord,
                            additionalInfo: additionalInfo.length > 0 ? additionalInfo : [],
                            selectedResultGrade: selectedResultGrade,
                            ParameterRulesEngine: response.data.TestGroupTestParameterRulesEngine
                        },
                        loading: false,
                        action,
                        openmodalsavePopup:false
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


export function getPredefinedDataRulesEngine(inputData, selectedRecord, currentAlertResultCode, masterData) {
    return function (dispatch) {
        let inputParamData = {
            ntestgrouptestpredefcode: inputData.ntestgrouptestpredefcode,
            userinfo:inputData.userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("resultentrybysample/getPredefinedData", inputParamData)
            .then(response => {
                let showMultiSelectCombo = false;
                let ResultParameter = selectedRecord['ParameterRulesEngine']
                let onlyAlertMsgAvailable = false;
                let testgrouptestpredefsubresult = response.data['testgrouptestpredefsubresult']
                if (inputData['nneedsubcodedresult'] === transactionStatus.YES) {
                    showMultiSelectCombo = true
                    masterData['testgrouptestpredefsubresultOptions'] = testgrouptestpredefsubresult
                }
                else {
                    onlyAlertMsgAvailable = true;
                }
                for (const Parameter of ResultParameter) {
                    if(Parameter.additionalInfoUidata){
                        if (Parameter.additionalInfoUidata || Parameter.additionalInfoUidata === "") {
                            let additionalInfoUidata = typeof Parameter.additionalInfoUidata === 'string' ? Parameter.additionalInfoUidata === "" ? "" : JSON.parse(Parameter.additionalInfoUidata) :
                                Parameter.additionalInfoUidata
                            if (Parameter['ntestgrouptestparametercode'] === currentAlertResultCode &&
                                Parameter['ntestgrouptestpredefcode'] === inputData['ntestgrouptestpredefcode']) {
                                if (Parameter.additionalInfoUidata) {
                                    selectedRecord["ntestgrouptestpredefsubcode"] = additionalInfoUidata['ntestgrouptestpredefsubcode']
                                    break;
                                }
                            } else {
                                if (selectedRecord["ntestgrouptestpredefsubcode"]) {
                                    delete selectedRecord["ntestgrouptestpredefsubcode"]
                                }
                            }
                        }
                    }
              

                };
                masterData['salertmessage'] = inputData.salertmessage
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData,
                        showAlertGrid: inputData.nneedresultentryalert === transactionStatus.NO ? false : true,
                        showAlertForPredefined: true,
                        showMultiSelectCombo,
                        onlyAlertMsgAvailable,
                        additionalInfoView: false,
                        selectedRecord,
                        showParameterGrid:false
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




















export function getParameterResultValue(combodata, groupIndex, index, PredefinedParameterOptions, selectedRecord, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getParameterResultValue",
            {
                'userinfo': userInfo, "nparametertypecode": combodata['stestname']['item']['nparametertypecode'],
                'ntestgrouptestparametercode': combodata['stestname']['item']['ntestgrouptestparametercode']
            })
            .then(response => {
                const PredefinedParameterRulesEngine = constructOptionList(response.data.PredefinedParameterRulesEngine || [], "ntestgrouptestpredefcode",
                    "spredefinedname", undefined, undefined, undefined);
                if (PredefinedParameterOptions[groupIndex] === undefined) {
                    PredefinedParameterOptions[groupIndex] = []
                }
                if (PredefinedParameterOptions[groupIndex][index] === undefined) {
                    PredefinedParameterOptions[groupIndex][index] = []
                }
                PredefinedParameterOptions[groupIndex][index] = PredefinedParameterRulesEngine.get("OptionList");
                masterData['PredefinedParameterOptions'] = PredefinedParameterOptions
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        selectedRecord,
                        loading: false

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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}


export function saveExecutionOrder(testGroupRulesEngineList, masterData, userInfo) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/updateExecutionOrder",
            {
                'userinfo': userInfo,
                'ntestgrouptestcode': testGroupRulesEngineList[0]['ntestgrouptestcode'],
                'TestGroupRulesEngine': testGroupRulesEngineList
            })
            .then(response => {
                masterData['RulesEngine'] = response.data.RulesEngine
                masterData['RulesEngine'].map(x => {
                    if (x['ntestgrouprulesenginecode'] === masterData['SelectedRulesEngine']['ntestgrouprulesenginecode']) {
                        x['selected'] = {};
                        x['selected'] = true;
                    }
                });
                //  masterData['SelectedRulesEngine'] = response.data.SelectedRulesEngine
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        masterList: response.data['RulesEngine'] && sortData(response.data['RulesEngine'], 'ascending', 'nruleexecorder'),
                        loading: false
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
//ALPD-4984
	//Added by Neeraj 
		//ALPD-4984--Added by Vignesh R(10-04-2025)-->Test group: Copy Rules engine
export function getCopyValues ( masterData,ncontrolCode, userInfo,filterData) {
    return function (dispatch) {
        if (masterData.SelectedSpecification.napprovalstatus===transactionStatus.APPROVED) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getProductCategory",
            {'userinfo': userInfo ,ntestcode: masterData.SelectedTest.ntestcode,"ncategorybasedflow": filterData.nproductcatcode.item.ncategorybasedflow

        
            })
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getProductCategory || [], "nproductcatcode",
                    "sproductcatname", undefined, undefined, undefined);
            let  getProductCategory = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,openChildModal:true,getProductCategory,
                        loading: false,ncontrolCode:ncontrolCode,
                        screenName:"IDS_RULESFROM",operation:"copy"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }  else {
        toast.warn(intl.formatMessage({ id: "IDS_SPECIFICATIONMUSTNOTBEDRAFTSTATUS" }));
    }
}
}
//ALPD-4984
	//Added by Neeraj 
export function getProfileRootComboServices ( methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getProfileRoot",
            {'userinfo': methodParam.inputData.userinfo, 
                'nproductcatcode':methodParam.inputData.nproductcatcode,
                'nproductcode':methodParam.inputData.nproductcode,
                'ntestcode':methodParam.inputData.ntestcode
            })
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getProfileRoot || [], "ntemplatemanipulationcode",
                    "sleveldescription", undefined, undefined, undefined);
            let  getProfileRoot = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal:true,getProfileRoot,
                        loading: false,
                        screenName:"IDS_RULESFROM",operation:"copy"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
}
}
//ALPD-4984
	//Added by Neeraj 
export function getProductComboServices (methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getProductByProductCat",
            {'userinfo': methodParam.inputData.userinfo, 
                'nproductcatcode':methodParam.inputData.nproductcatcode,'ntestcode':methodParam.inputData.ntestcode})
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getProduct || [], "nproductcode",
                    "sproductname", undefined, undefined, undefined);
            let  getProductList = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal:true,getProductList,
                        loading: false,
                        screenName:"IDS_RULESFROM"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
//ALPD-4984
	//Added by Neeraj 
export function getSpecificationComboServices (methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getSpecification",
            {'userinfo': methodParam.inputData.userinfo, 
                'ntemplatemanipulationcode':methodParam.inputData.ntemplatemanipulationcode,'ntestcode':methodParam.inputData.ntestcode})
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getSpecification || [], "nallottedspeccode",
                    "sspecname", undefined, undefined, undefined);
            let  getSpecificationList = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal:true,getSpecificationList,
                        loading: false,
                        screenName:"IDS_RULESFROM"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
//ALPD-4984
	//Added by Neeraj 
export function getComponentComboServices (methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getComponent",
            {'userinfo': methodParam.inputData.userinfo, 'nallottedspeccode':methodParam.inputData.nallottedspeccode,
                'ncomponentcode':methodParam.inputData.ncomponentcode,'ntestcode':methodParam.inputData.ntestcode
            })
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getComponent || [], "ncomponentcode",
                    "scomponentname", undefined, undefined, undefined);
            let  getComponentList = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal:true,getComponentList,
                        loading: false,
                        screenName:"IDS_RULESFROM"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//ALPD-4984
	//Added by Neeraj 
export function getRulesTestComboServices (methodParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testgrouprulesengine/getTestBasedOnRules",
            {'userinfo': methodParam.inputData.userinfo, 'selectedComponentCode':methodParam.inputData.selectedComponentCode,
                'selectedSpecCode':methodParam.inputData.selectedSpecCode,'ntestcode':methodParam.inputData.ntestcode,
                'ntestgrouptestcode':methodParam.inputData.ntestgrouptestcode,'ncomponentcode':methodParam.inputData.ncomponentcode,
                'nallottedspeccode':methodParam.inputData.nallottedspeccode,

            })
            .then(response => {
         const PredefinedParameterRulesEngine = constructOptionList(response.data.getRules || [], "ntestgrouprulesenginecode",
                    "srulename", undefined, undefined, undefined);
            let  getRulesList = PredefinedParameterRulesEngine.get("OptionList");
                            dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal:true,getRulesList,
                        loading: false,
                        screenName:"IDS_RULESFROM"
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}