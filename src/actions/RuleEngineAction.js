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
    queryTypeFilter
} from '../components/Enumeration';
import { format } from 'date-fns';

export function getRulesEngineAdd(userInfo, rulesengine, inputParam, masterData) {
    let testcomments = []
    let reportcomments = []
    let predefcomments = []
    let sampletestcommentsList = []
    let selectedRecord = {}
    let addGroupList = []
    return function (dispatch) {
        dispatch(initRequest(true));
        let url = [];
        if (rulesengine) {
            url.push(rsapi().post("/rulesengine/getdatabasetables", {
                userinfo: userInfo
            }));

        } else {
            url.push(rsapi().post("/rulesengine/getRulesEngineAdd", {
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
                if (rulesengine) {


                    const DiagnosticCase = constructOptionList(response[0].data["DiagnosticCase"] || [], "ndiagnosticcasecode", "sdiagnosticcasename", false, false, false);
                    const tableListMap = constructOptionList(response[0].data["TestParameter"] || [], "ntestparametercode", "stestparametersynonym", false, false, false);
                    const Grade = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, false);
                    const resultType = constructOptionList(response[0].data["ResultType"] || [], "nresultypecode", "sdisplayname", undefined, undefined, undefined);
                    const site = constructOptionList(response[2].data || [], "nsitecode", "ssitename", false, false, false);
                    const CommentType = constructOptionList(response[4].data['CommentType'] || [], "ncommenttypecode", "scommenttype", false, false, false);



                    let commentsubtypelst = response[5].data['CommentSubType']
                    let w = commentsubtypelst.filter(x => x.ncommentsubtypecode === 3 || x.ncommentsubtypecode === 6)
                    const CommentSubType = constructOptionList(w || [], "ncommentsubtypecode", "scommentsubtype", false, false, false);

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
                            databaseTableList: tableListMap.get("OptionList"),
                            DiagnosticCaseList: DiagnosticCase.get("OptionList"),
                            GradeList: Grade.get("OptionList"),
                            siteList: site.get("OptionList"),
                            openPortalModal: true,
                            resultTypeList: resultType.get("OptionList"),
                            screenName: "IDS_QUERYBUILDER",
                            rulesengine,
                            testcomments,
                            reportcomments,
                            ...inputParam,
                            siteObject: {},
                            testCommentObject: {},
                            reportCommentObject: {},
                            testInitiateTests: [],
                            testCommentsTests: [],
                            reportCommentsTests: []
                            ,

                            testCommentsTestsTab: [],
                            reportCommentsTestsTab: [],
                            testInitiateSiteTab: [],
                            activeTabIndex: 0,
                            masterData,
                            rulesOption: tableListMap.get("OptionList"),
                            testInitiateTestOptions: tableListMap.get("OptionList"),
                            testCommentsTestOptions: tableListMap.get("OptionList"),
                            reportCommentsTestOptions: tableListMap.get("OptionList"),
                            CommentType: CommentType.get("OptionList"),
                            CommentSubType: CommentSubType.get("OptionList"),
                            predefcomments,
                            openModalPopup: false,
                            openmodalsavePopup: false,
                            addGroupList,
                            selectedRecord,
                            viewColumnListByRule: tableListMap.get("OptionList")

                        }
                    });
                } else {
                    const DiagnosticCase = constructOptionList(response[0].data["DiagnosticCase"] || [], "ndiagnosticcasecode", "sdiagnosticcasename", false, false, false);
                    const Grade = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, false);
                    const viewListMap = constructOptionList(response[0].data["TestParameter"] || [], "ntestparametercode", "stestparametersynonym", undefined, undefined, undefined);
                    const resultType = constructOptionList(response[0].data["ResultType"] || [], "nresultypecode", "sdisplayname", undefined, undefined, undefined);
                    const site = constructOptionList(response[2].data || [], "nsitecode", "ssitename", false, false, false);
                    const CommentType = constructOptionList(response[4].data['CommentType'] || [], "ncommenttypecode", "scommenttype", false, false, false);
                    let commentsubtypelst = response[5].data['CommentSubType']
                    let w = commentsubtypelst.filter(x => x.ncommentsubtypecode === 3 || x.ncommentsubtypecode === 6)
                    const CommentSubType = constructOptionList(w || [], "ncommentsubtypecode", "scommentsubtype", false, false, false);

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
                            DiagnosticCaseList: DiagnosticCase.get("OptionList"),
                            GradeList: Grade.get("OptionList"),
                            siteList: site.get("OptionList"),
                            resultTypeList: resultType.get("OptionList"),
                            openPortalModal: true,
                            screenName: "IDS_ADDRULESENGINE",
                            rulesengine,
                            ...inputParam,

                            siteObject: {},
                            testCommentObject: {},
                            reportCommentObject: {},
                            testInitiateTests: [],
                            testCommentsTests: [],
                            reportCommentsTests: []
                            ,

                            testCommentsTestsTab: [],
                            reportCommentsTestsTab: [],
                            testInitiateSiteTab: [],
                            activeTabIndex: 0,
                            masterData,
                            rulesOption: viewListMap.get("OptionList"),
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
                            viewColumnListByRule: viewListMap.get("OptionList")
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
            });
    }
}

export function getSelectedRulesEngine(inputParam, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/rulesengine/getSelectedRulesEngine",
            { 'userinfo': userInfo, "ntransactionrulesenginecode": inputParam.ntransactionrulesenginecode, nproductcatcode: masterData.SelectedProductCategory.nproductcatcode })
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



export function getRulesEngine(nproductcatcode, userInfo, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/rulesengine/getRulesEngine",
            { 'userinfo': userInfo, "nproductcatcode": nproductcatcode })
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
export function getEditRulesEngine(operation, masterData, ncontrolCode, userInfo) {
    let testcomments = []
    let reportcomments = []
    let predefcomments = []
    return function (dispatch) {
        let urlArray = [];
        let selectedRecord = {}
        urlArray.push(rsapi().post("rulesengine/getEditRulesEngine", {
            'ntransactionrulesenginecode':
                masterData.SelectedRulesEngine['ntransactionrulesenginecode'], 'masterData': masterData, "userinfo": userInfo
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
        urlArray.push(rsapi().post("/rulesengine/getRulesEngineAdd", {
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
                // selectedRecord["groupList"][0]["button_and"] = true
                let addGroupList = []
                addGroupList = responsedata['RulesEngineEdit'][0]['jsonuidata']['addGroupList']
                const DiagnosticCase = constructOptionList(response[4].data["DiagnosticCase"] || [], "ndiagnosticcasecode", "sdiagnosticcasename", false, false, false);
                const Grade = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, false);
                const viewListMap = constructOptionList(response[4].data["TestParameter"] || [], "ntestparametercode", "stestparametersynonym", undefined, undefined, undefined);
                const resultType = constructOptionList(response[4].data["ResultType"] || [], "nresultypecode", "sdisplayname", undefined, undefined, undefined);
                const site = constructOptionList(response[2].data || [], "nsitecode", "ssitename", false, false, false);
                const CommentType = constructOptionList(response[6].data['CommentType'] || [], "ncommenttypecode", "scommenttype", false, false, false);
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
                masterData['testParameterComments'] = outcomeList['testCommentsTests'] && outcomeList['testCommentsTests']
                masterData['testParameterreportComments'] = outcomeList['reportCommentsTests'] && outcomeList['reportCommentsTests']

                masterData["testComments"] = outcomeList['testCommentObject'] && outcomeList['testCommentObject']
                masterData["reportComments"] = outcomeList['reportCommentObject'] && outcomeList['reportCommentObject']
                masterData["testSite"] = outcomeList['siteObject'] && outcomeList['siteObject']
                selectedRecord["nproductcatcode"] = outcomeList['nproductcatcode'] && outcomeList['nproductcatcode']
                selectedRecord["groupListJoins"] = outcomeList['groupListJoins'] && outcomeList['groupListJoins']
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        operation: operation, screenName: "IDS_EDITRULESENGINE", selectedRecord,
                        openPortalModal: true, ncontrolCode: ncontrolCode, loading: false, addGroupList,

                        viewColumnListByRule: viewListMap.get("OptionList"),
                        rulesOption: viewListMap.get("OptionList"),
                        testcomments,
                        reportcomments,
                        DiagnosticCaseList: DiagnosticCase.get("OptionList"),
                        GradeList: Grade.get("OptionList"),
                        siteList: site.get("OptionList"),
                        resultTypeList: resultType.get("OptionList"),
                        testInitiateTests: outcomeList['testInitiateTests'] && outcomeList['testInitiateTests'],
                        testCommentsTests: outcomeList['testCommentsTests'] && outcomeList['testCommentsTests'],
                        reportCommentsTests: outcomeList['reportCommentsTests'] && outcomeList['reportCommentsTests'],
                        siteObject: outcomeList['siteObject'] && outcomeList['siteObject'],
                        testCommentObject: outcomeList['testCommentObject'] && outcomeList['testCommentObject'],
                        reportCommentObject: outcomeList['reportCommentObject'] && outcomeList['reportCommentObject'],
                        testInitiateSiteTab: outcomeList['testInitiateSiteTab'],
                        testCommentsTestsTab: outcomeList['testCommentsTestsTab'],
                        reportCommentsTestsTab: outcomeList['reportCommentsTestsTab'],
                        CommentType: CommentType.get("OptionList"),
                        CommentSubType: CommentSubType.get("OptionList"),
                        predefcomments,
                        openModalPopup: false,
                        openmodalsavePopup: false,
                        activeTabIndex: 0,
                        action: "update"
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
}