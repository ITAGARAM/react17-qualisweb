import rsapi from "../rsapi";
import {
    toast
} from "react-toastify";
import {
    constructOptionList,
    sortData,getComboLabelValue
} from "../components/CommonScript";
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import Axios from "axios";
import {
    initRequest
} from "./LoginAction";
import {
    transactionStatus,
    attachmentType
} from "../components/Enumeration";
import {
    intl
} from "../components/App";

//Test click
export const getTestMaster = (testItem, userInfo, masterData) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testmaster/getTestById", {
                ntestcode: testItem.ntestcode,
                userinfo: userInfo
            })
            .then(response => {
                masterData = {
                    ...masterData,
                    ...response.data
                }
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//tab click
export const getTestDetails = (inputParam) => {
    return function (dispatch) {
        const testParameter = inputParam.testParameter;
        dispatch(initRequest(true));
        rsapi().post("/testmaster/getothertestdetails", {
                ntestcode: testParameter.ntestcode,
                "nFlag": inputParam.nFlag,
                ntestparametercode: testParameter.ntestparametercode,
                userinfo: inputParam.userInfo,
                nclinicaltyperequired:inputParam.masterData.SelectedTest.nclinicaltyperequired
            })
            .then(response => {
                let masterData = inputParam.masterData
                masterData = {
                    ...masterData,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}



//Add Test
export const addTest = (operation, testmaster, userInfo, ncontrolCode, nfilterTestCategory) => {
    return function (dispatch) {
        if (nfilterTestCategory && Object.values(nfilterTestCategory).length > 0) {
            dispatch(initRequest(true));
            const urlArray = [
                rsapi().post("testcategory/getTestCategory", {
                    "userinfo": userInfo
                }),
                rsapi().post("checklist/getApprovedChecklist", {
                    "userinfo": userInfo
                })
            ];
            if (operation === "update") {
                urlArray.push(rsapi().post("testmaster/getActiveTestById", {
                    "userinfo": userInfo,
                    ntestcode: testmaster.ntestcode
                }))

                urlArray.push(rsapi().post("period/getPeriodByControl", {
                    "ncontrolcode": ncontrolCode,
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getInterfaceType", {
                    "userinfo": userInfo
                }));
            } else if (operation === "create") {
                urlArray.push(rsapi().post("parametertype/getParameterType", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("grade/getGrade", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("section/getSection", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getAvailableMethod", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("unit/getUnit", {
                    "userinfo": userInfo
                }));
               
                urlArray.push(rsapi().post("instrumentcategory/fetchinstrumentcategory", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getAddTest", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("containertype/getContainerType", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testpackage/getTestPackage", {
                    "userinfo": userInfo
                }));

                urlArray.push(  rsapi().post("period/getPeriodByControl", {
                    "ncontrolcode": ncontrolCode,
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getInterfaceType", {
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getResultAccuracy", {
                    "userinfo": userInfo
                }));
            } else if (operation === "copy") {
                urlArray.push(rsapi().post("testmaster/validateCopyTest", {
                    "userinfo": userInfo,
                    ntestcode: testmaster.ntestcode
                }));

                urlArray.push(rsapi().post("period/getPeriodByControl", {
                    "ncontrolcode": ncontrolCode,
                    "userinfo": userInfo
                }));
                urlArray.push(rsapi().post("testmaster/getInterfaceType", {
                    "userinfo": userInfo
                }));
                
            }
            Axios.all(urlArray)
                .then(response => {
                  
                    let selectedRecord = {};
                    let selectedsubcodedresult = [];
                    const testCategoryMap = constructOptionList(response[0].data || [], "ntestcategorycode", "stestcategoryname", false, false, true);
                    const testCategory = testCategoryMap.get("OptionList");
                    const checklistMap = constructOptionList(response[0].data || [], "nchecklistversioncode", "schecklistname", false, false, true);
                    const ChecklistVersion = checklistMap.get("OptionList");
                    //const periodMap=[];
                    const testData = {
                        testCategory,
                        ChecklistVersion
                    };
                    let parameterData = {};
                    let otherTestData = {}
                    let needOtherTest = false;
                    if (operation === "update") {
                        const editData = response[2].data;
                        selectedRecord = editData;
                        const periodMap = constructOptionList(response[3].data || [], "nperiodcode", "speriodname", false, false, true);
                        const interfacetypeMap = constructOptionList(response[4].data || [], "ninterfacetypecode", "sinterfacetypename", false, false, true);

                        parameterData = {
                            period:periodMap.get("OptionList"),
                            interfacetype:interfacetypeMap.get("OptionList")
                        }
                        selectedRecord["ntestcategorycode"] = {
                            "value": editData["ntestcategorycode"],
                            "label": editData["stestcategoryname"]
                        };
                        selectedRecord["nchecklistversioncode"] = {
                            "value": editData["nchecklistversioncode"],
                            "label": editData["schecklistname"]
                        };
                        
                        if(selectedRecord["ntatperiodcode"] !==-1){
                            selectedRecord["ntatperiodcode"] = {
                                "value": editData["ntatperiodcode"],
                                "label": editData["statperiodname"]
                            };
                        }
                        selectedRecord["ninterfacetypecode"] = {
                            "value": editData["ninterfacetypecode"],
                            "label": editData["sinterfacetypename"]
                        };
                    } else if (operation === "copy") {
                        const periodMap = constructOptionList(response[3].data || [], "nperiodcode", "speriodname", false, false, true);
                        const interfacetypeMap = constructOptionList(response[4].data || [], "ninterfacetypecode", "sinterfacetypename", false, false, true);

                        //period:periodMap.get("OptionList")
                        parameterData={
                            period: periodMap.get("OptionList"),
                            interfacetype:interfacetypeMap.get("OptionList")
                        } ;
                        selectedRecord = {
                            ntestcategorycode: nfilterTestCategory.value === -2 ? (testCategory.length > 0 ?
                                // {"label": testCategory[0].stestcategoryname, "value": testCategory[0].ntestcategorycode}
                                testCategory[0] : "") : nfilterTestCategory,
                            ntransactionstatus: transactionStatus.ACTIVE,
                            naccredited: transactionStatus.NOTACCREDITED,
                            ntrainingneed: transactionStatus.NO,
                            stestsynonym: "",
                            stestname: "",
                            sdescription: "",
                            ncost: "",
                            //period:periodMap.get("OptionList"),
                           
                        }
                        
                    } else {
                        // const { Grade } = response[7].data; //ParameterType
                        const parameterMap = constructOptionList(response[2].data || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                        // const parameterType = parameterMap.get("OptionList");//response[2].data;
                        const gradeMap = constructOptionList(response[3].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                        // const grade = gradeMap.get("OptionList");// response[3].data;
                        const parameterItem = parameterMap.get("DefaultValue") ? parameterMap.get("DefaultValue") : ""; //parameterType.filter(item=>{ return item.nparametertypecode === 3 });//ParameterType[0];
                        selectedRecord = {
                            // nsectioncode: {"value": response[2].data[0].nsectioncode, "label": response[2].data[0].ssectionname},
                            nunitcode: -1,
                            nresultaccuracycode: -1,
                            nparametertypecode: parameterItem, //{"value": parameterItem[0].nparametertypecode, "label": parameterItem[0].sdisplaystatus},
                            ntestcategorycode: nfilterTestCategory.value === -2 ? (testCategory.length > 0 ?
                                // {"label": testCategory[0].stestcategoryname, "value": testCategory[0].ntestcategorycode}: "")
                                testCategory[0] : "") : nfilterTestCategory,
                            ntransactionstatus: transactionStatus.ACTIVE,
                            naccredited: transactionStatus.NOTACCREDITED,
                            ntrainingneed: transactionStatus.NO,
                            stestsynonym: "",
                            stestname: "",
                            sdescription: "",
                            ncost: ""
                        }
                        let needUnit = true;
                        let needRoundingDigit = true;
                        let needCodedResult = true;
                        let needActualResult = true;
                        let npredefinedcode = transactionStatus.NO;
                        const unitMap = constructOptionList(response[6].data || [], "nunitcode", "sunitname", false, false, true);
                        const periodMap = constructOptionList(response[11].data || [], "nperiodcode", "speriodname", false, false, true);
                        const deltaperiodMap = constructOptionList(response[11].data || [], "nperiodcode", "speriodname", false, false, true);
                        const interfacetypeMap = constructOptionList(response[12].data || [], "ninterfacetypecode", "sinterfacetypename", false, false, true);
                        const resultAccuracyMap = constructOptionList(response[13].data || [], "nresultaccuracycode","sresultaccuracyname", false, false, true);

                        if (parameterItem && parameterItem.item) {
                            if (parameterItem.item["nunit"] === transactionStatus.YES) {
                                needUnit = false;
                                selectedRecord["nunitcode"] = unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "";
                                //{"value": response[4].data[0]["nunitcode"], "label": response[4].data[0]["sunitname"]};
                            }
                            if (parameterItem.item["nroundingdigit"] === transactionStatus.YES) {
                                needRoundingDigit = false;
                            }
                            if (parameterItem.item["npredefinedcode"] === transactionStatus.YES) {
                                needCodedResult = false;
                                npredefinedcode = parameterItem.item["npredefinedcode"];
                            }
                            if (parameterItem.item["ngrade"] === transactionStatus.YES) {
                                needActualResult = false;
                                selectedRecord["ngradecode"] = gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : "";
                                //{"value": Grade.ngradecode, "label": Grade["sdisplaystatus"]};
                            }
                        }
                        // const testParameterMap = constructOptionList(response[8].data["TestParameter"] || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                        parameterData = {
                            grade: gradeMap.get("OptionList"),
                            parameterType: parameterMap.get("OptionList"),
                            unit: unitMap.get("OptionList"),
                            period:periodMap.get("OptionList"),
                            interfacetype:interfacetypeMap.get("OptionList"),
                            deltaperiod: deltaperiodMap.get("OptionList"),
                            resultaccuracy:resultAccuracyMap.get("OptionList"),
                            needRoundingDigit,
                            needUnit,
                            needCodedResult,
                            needActualResult,
                            npredefinedcode,
                            testParameter: constructOptionList(response[8].data["TestParameter"] || [], 'sparametername', 'sparametername', false, false, true).get("OptionList"),
                            defaultUnit: unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "",
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                            //testParameterMap.get("OptionList")
                        };
                        const sectionMap = constructOptionList(response[4].data || [], "nsectioncode", "ssectionname", false, false, true);
                       // const methodMap = constructOptionList(response[5].data.Method.length>0?response[5].data.Method:[] || [], "nmethodcode", "smethodname", false, false, true);
                       const methodMap = constructOptionList(response[5].data||[], "nmethodcode", "smethodname", false, false, true);

                       const instCatMap = constructOptionList(response[7].data || [], "ninstrumentcatcode", "sinstrumentcatname", false, false, true);
                        const continerType = constructOptionList(response[9].data || [], "ncontainertypecode", "scontainertype", false, false, true);
                        const packageMap = constructOptionList(response[10].data || [], "ntestpackagecode", "stestpackagename", false, false, true);
                        otherTestData = {
                            package: packageMap.get("OptionList"),
                            section: sectionMap.get("OptionList"),
                            method: methodMap.get("OptionList"),
                            instrumentcategory: instCatMap.get("OptionList"),
                            containertype: continerType.get("OptionList")

                        }
                        needOtherTest = true;
                        const periodDefault = periodMap.get("DefaultValue");

                        if (periodDefault !== undefined) {
                            selectedRecord = {
                                ...selectedRecord,
                                "ntatperiodcode": {
                                    "value": periodDefault.value,
                                    "label": periodDefault.label
                                },
                            }
                        }
                        
                    }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            // parameterData: {
                            //     period: periodMap.get("OptionList")
                            // },   
                            openModal: true,
                            needOtherTest,
                            operation: operation,
                            screenName: "IDS_TEST",
                            selectedRecord,
                            ncontrolCode,
                            testData,
                            parameterData,
                            otherTestData,
                            loading: false,selectedsubcodedresult
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
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                });
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_TESTCATEGORYNOTAVAILABLE"
            }))
        }
    }
}

//Add Test Parameter
export const addParameter = (operation, selectedParameter, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const urlArray = [];
        urlArray.push(rsapi().post("unit/getUnit", {
            "userinfo": userInfo
        }));
        urlArray.push(rsapi().post("parametertype/getParameterType", {
            "userinfo": userInfo
        }));
        urlArray.push(rsapi().post("grade/getGrade", {
            "userinfo": userInfo
        }));
        urlArray.push(rsapi().post("testmaster/getAddTest", {
            "userinfo": userInfo
        }));
        urlArray.push(rsapi().post("period/getPeriodByControl", {
            "ncontrolcode": ncontrolCode,
            "userinfo": userInfo
        }));
            
        
        if (operation === "update") {            

            urlArray.push(rsapi().post("testmaster/getActiveParameterById", {
                ntestparametercode: selectedParameter.ntestparametercode,
                "userinfo": userInfo
            }));

            urlArray.push(rsapi().post("testmaster/getDestinationUnit", {
                nunitcode: selectedParameter.nunitcode,
                "userinfo": userInfo
            }));
        }
        urlArray.push(rsapi().post("testmaster/getResultAccuracy", {
            "userinfo": userInfo
        }));
        Axios.all(urlArray)
            .then(response => {
                // const { Grade, ParameterType } = response[1].data;
                let DestinationUnitMap =[];
                const parameterMap = constructOptionList(response[1].data || [], "nparametertypecode", "sdisplaystatus", false, false, true);
                const gradeMap = constructOptionList(response[2].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                const unitMap = constructOptionList(response[0].data || [], "nunitcode", "sunitname", false, false, true);
                const deltaperiodMap = constructOptionList(response[4].data || [], "nperiodcode", "speriodname", false, false, true);
                //ALPD-4363
                const resultAccuracyMap = constructOptionList(operation === "update" ? response[7].data : response[5].data || [], "nresultaccuracycode", "sresultaccuracyname", false, false, true);

                if (operation === "update") {
                    DestinationUnitMap = constructOptionList(response[6].data.DestinationUnit || [], "ndestinationunitcode", "sunitname1", false, false, true).get("OptionList");
                }


                //response[2].data;
                // const grade = response[2].data;
                // const parameterType = response[1].data;
                let selectedRecord = {};
                let needUnit = true;
                let needRoundingDigit = true;
                let needCodedResult = true;
                let needActualResult = true;
                let npredefinedcode = transactionStatus.No;
                if (operation === "update") {

                    const editTestParameter = response[5].data.TestParameter[0];
                    //ALPD-3521
  				 if(editTestParameter["ndestinationunitcode"]==-1){
   					 editTestParameter["soperator"]=[];	
					}
                    selectedRecord = editTestParameter;
                    const nparametertypecode = editTestParameter["nparametertypecode"];
                    const parameterItem = parameterMap.get("OptionList").filter(function (item) {
                        return item.value === nparametertypecode;
                    });
                    selectedRecord["sparametername"] = {
                        value: editTestParameter["sparametername"],
                        label: editTestParameter["sparametername"]
                    };

                    if(editTestParameter["ndeltaunitcode"] !==-1){
                        selectedRecord["ndeltaunitcode"] = {
                            "value": editTestParameter["ndeltaunitcode"],
                            "label": editTestParameter["sdeltaunitname"]
                        };
                    }
                    selectedRecord["nparametertypecode"] = {
                        value: nparametertypecode,
                        label: editTestParameter["sdisplaystatus"]
                    };
                    if (parameterItem && parameterItem[0].item) {
                        const selectedParameterItem = parameterItem[0].item;
                        if (selectedParameterItem["nunitrequired"] === transactionStatus.YES) {
                            needUnit = false;
                            selectedRecord["nunitcode"] = {
                                value: editTestParameter["nunitcode"],
                                label: editTestParameter["sunitname"]
                            };
                            if(editTestParameter["ndestinationunitcode"]!=-1){
                            selectedRecord["ndestinationunitcode"] = {
                                value: editTestParameter["ndestinationunitcode"],
                                label: editTestParameter["sunitname1"]
                            };
                            }
                            selectedRecord["nresultaccuracycode"] = {
                                value: editTestParameter["nresultaccuracycode"],
                                label: editTestParameter["sresultaccuracyname"]
                            };
                            
                        }
                        if (selectedParameterItem["nroundingrequired"] === transactionStatus.YES) {
                            needRoundingDigit = false;
                        }

                        if (selectedParameterItem["npredefinedrequired"] === transactionStatus.YES || selectedParameterItem["ngraderequired"] === transactionStatus.YES) {
                            const editCodedResult = response[5].data.TestPredefinedParameter;
                            if (editCodedResult.length > 0) {
                                const defaultCodedResult = editCodedResult.filter(function (item) {
                                    return item.ndefaultstatus === transactionStatus.YES;
                                });
                                if (defaultCodedResult.length > 0) {
                                    selectedRecord["spredefinedname"] = defaultCodedResult[0].spredefinedname;
                                    selectedRecord["ntestpredefinedcode"] = defaultCodedResult[0].ntestpredefinedcode;;
                                    selectedRecord["ngradecode"] = {
                                        value: defaultCodedResult[0].ngradecode,
                                        label: defaultCodedResult[0]["scombodisplaystatus"]
                                    };
                                    //selectedRecord["sresultparacomment"] = defaultCodedResult[0].sresultparacomment;
                                    selectedRecord["spredefinedsynonym"] = defaultCodedResult[0].spredefinedsynonym;
                                    selectedRecord["spredefinedcomments"] = defaultCodedResult[0].spredefinedcomments;
                                } else {
                                    selectedRecord["spredefinedname"] = editCodedResult[0].spredefinedname;
                                    selectedRecord["ntestpredefinedcode"] = editCodedResult[0].ntestpredefinedcode;
                                    selectedRecord["ngradecode"] = {
                                        value: editCodedResult[0].ngradecode,
                                        label: editCodedResult[0]["scombodisplaystatus"]
                                    };
                                    //selectedRecord["sresultparacomment"] = defaultCodedResult[0].sresultparacomment;
                                    selectedRecord["spredefinedsynonym"] = defaultCodedResult[0].spredefinedsynonym;
                                    selectedRecord["spredefinedcomments"] = defaultCodedResult[0].spredefinedcomments;
                                }
                            }
                        } else {
                            selectedRecord["spredefinedname"] = "";
                            selectedRecord["ngradecode"] = -1;
                        }
                        if (selectedParameterItem["npredefinedrequired"] === transactionStatus.YES) {
                            needCodedResult = false;
                            npredefinedcode = selectedParameterItem["npredefinedrequired"];
                        }
                        if (selectedParameterItem["ngraderequired"] === transactionStatus.YES) {
                            needActualResult = false;
                        }
                    }
                } else {
                    const parameterItem = parameterMap.get("DefaultValue") ? parameterMap.get("DefaultValue").item : {};
                    // parameterType.filter(item=>{ return item.nparametertypecode === transactionStatus.YES });
                    if (parameterItem["nunitrequired"] === transactionStatus.YES) {
                        needUnit = false;
                        selectedRecord["nunitcode"] = unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : ""; //{"value": response[0].data[0]["nunitcode"], "label": response[0].data[0]["sunitname"]};
                    }
                    if (parameterItem["nroundingrequired"] === transactionStatus.YES) {
                        needRoundingDigit = false;
                    }
                    if (parameterItem["npredefinedcrequired"] === transactionStatus.YES) {
                        needCodedResult = false;
                        npredefinedcode = parameterItem["npredefinedcode"];
                    }
                    if (parameterItem["ngraderequired"] === transactionStatus.YES) {
                        needActualResult = false;
                        // selectedRecord["ngradecode"] = {"value": Grade.ngradecode, "label": Grade["scombodisplaystatus"]};
                    }
                    selectedRecord["nparametertypecode"] = parameterMap.get("DefaultValue"); //{value: parameterItem[0].nparametertypecode, label: parameterItem[0].sdisplaystatus};
                    selectedRecord["nroundingdigits"]="";
                    selectedRecord["nunitcode"] = "";
                    selectedRecord["nresultaccuracycode"]="";

                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: true,
                        operation: operation,
                        screenName: "IDS_PARAMETER",
                        selectedRecord,
                        DestinationUnit : DestinationUnitMap.length >0  ? DestinationUnitMap:[],
                        parameterData: {
                            unit: unitMap.get("OptionList"),
                            grade: gradeMap.get("OptionList"),
                            deltaperiod:deltaperiodMap.get("OptionList"),
                            parameterType: parameterMap.get("OptionList"), 
                            resultaccuracy: resultAccuracyMap.get("OptionList"),
                            needUnit,
                            needRoundingDigit,
                            needCodedResult,
                            needActualResult,
                            npredefinedcode,
                            testParameter: constructOptionList(response[3].data["TestParameter"] || [], 'sparametername', 'sparametername', false, false, true).get("OptionList"),
                            defaultUnit: unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "",
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                        },
                        ncontrolCode,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Add Coded result
export const addCodedResult = (operation, paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        const urlArray = [
            rsapi().post("testmaster/getAddTest", {
                "userinfo": userInfo
            }),
            rsapi().post("grade/getGrade", {
                "userinfo": userInfo
            })
        ];
        if (operation === "update") {
            urlArray.push(rsapi().post("testmaster/getActivePredefinedParameterById", {
                ntestpredefinedcode: paramdata["ntestpredefinedcode"],
                "userinfo": userInfo
            }));
        }
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                // const grade = response[1].data;
                const gradeMap = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                if (operation === "update") {
                    const editCodedResult = response[2].data;
                    selectedRecord = {
                        ntestpredefinedcode: paramdata["ntestpredefinedcode"],
                        ntestparametercode: paramdata["ntestparametercode"],
                        ngradecode: {
                            "label": editCodedResult["scombodisplaystatus"],
                            "value": editCodedResult["ngradecode"]
                        },
                        spredefinedname: editCodedResult["spredefinedname"],
                        ndefaultstatus: editCodedResult["ndefaultstatus"],
                        //sresultparacomment:editCodedResult["sresultparacomment"],
                        spredefinedsynonym:editCodedResult["spredefinedsynonym"],
                    }
                } else {
                    selectedRecord = {
                        ntestparametercode: paramdata["ntestparametercode"],
                        ngradecode: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : "" //{"value": grade[0].ngradecode, "label": grade[0]["sdisplaystatus"]}
                    }
                }
              
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: operation,
                        screenName: "IDS_CODEDRESULT",
                        parameterData: {
                            grade: gradeMap.get("OptionList"),
                            defaultGrade: gradeMap.get("DefaultValue") ? gradeMap.get("DefaultValue") : ""
                        },
                        selectedRecord,
                        ncontrolCode,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Add parameter specification
export const addParameterSpecification = (operation, paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let inputparam = [];
        let surl = "";
        if (operation === "update") {
            surl = "getParameterSpecificationById";
            inputparam = {
                userinfo: userInfo,
                ntestparamnumericcode: paramdata["ntestparamnumericcode"]
            };
        } else {
            surl = "getParameterSpecificationByCount";
            inputparam = {
                userinfo: userInfo,
                ntestparametercode: paramdata["ntestparametercode"]
            };
        }
        const urlArray = [rsapi().post("testmaster/" + surl, inputparam),
        rsapi().post("grade/getGrade", {
            userinfo: userInfo
        }),]
        Axios.all(urlArray)
            .then(response => {
                let grade ={};
                let selectedRecord = {};
                const gradeMap = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                grade = gradeMap.get("OptionList");
                if (operation === "update") {
                    selectedRecord = {
                        ...response[0].data
                    }
                    //ALPD-4364
                    selectedRecord["ngradecode"] = getComboLabelValue(response[0].data, response[1].data, 
                        "ngradecode", "scombodisplaystatus");   
                } else {
                    selectedRecord = {
                        ntestparametercode: paramdata["ntestparametercode"]
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: operation,
                        screenName: "IDS_SPECIFICATION",
                        selectedRecord,
                        ncontrolCode,parameterData: {
                          grade,
                                                  },
                        loading: false,grade
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const getAvailableData = (testItem, url, key, screenName, userInfo, ncontrolCode) => {
    return (dispatch) => {
        const inputParam = {
            TestMaster: testItem,
            "userinfo": userInfo
        }
        dispatch(initRequest(true));
        rsapi().post("testmaster/" + url, inputParam)
            .then(response => {
                const availableDataMap = constructOptionList(response.data, key === "section" ? "nsectioncode" : key === "method" ? "nmethodcode" : key == "instrumentcategory" ?"ninstrumentcatcode" : key == "package" ?"ntestpackagecode" : key == "technique" ?"ntechniquecode" : "ncontainertypecode",
                    key === "section" ? "ssectionname" : key === "method" ? "smethodname" :  key == "instrumentcategory" ? "sinstrumentcatname"  :  key == "package" ? "stestpackagename" :key == "technique" ? "stechniquename" : "scontainertype", false, false, true);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        otherTestData: {
                            [key]: availableDataMap.get("OptionList")
                        },
                        screenName: screenName,
                        selectedRecord: {
                            availableData: ""
                        },
                        operation: "create",
                        ncontrolCode,
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
                } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}

//Add formula
export const addFormula = (paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("testmaster/addTestFormula", {
                userinfo: userInfo,
                nFlag: 1
            })
            .then(response => {
                const responseData = response.data;
                const testMasterMap = constructOptionList(responseData["TestMaster"], "ntestcode", "stestname", false, false, false);
                const testCategoryMap = constructOptionList(responseData["TestCategory"], 
                "ntestcategorycode", "stestcategoryname", 'descending', false, true);
            
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: "create",
                        screenName: "IDS_FORMULA",
                        formulaData: {
                            operators: responseData["Operators"],
                            functions: responseData["Functions"],
                            testCategory: testCategoryMap.get("OptionList"),
                            testMaster: testMasterMap.get("OptionList"),
                            dynamicFormulaFields: responseData["DynamicFormulaFields"]
                        },
                        isFormulaOpen: true,
                        selectedRecord: {
                            ntestcategorycode: testCategoryMap.get("OptionList") && testCategoryMap.get("OptionList").length > 0 ? testCategoryMap.get("OptionList")[0] : "", //responseData["TestCategory"].length>0? {"label": responseData["TestCategory"][0]["stestcategoryname"], "value": responseData["TestCategory"][0]["ntestcategorycode"]}: "",
                            ntestcode: testMasterMap.get("OptionList") && testMasterMap.get("OptionList").length > 0 ? testMasterMap.get("OptionList")[0] : "", //responseData["TestMaster"].length>0? {"label": responseData["TestMaster"][0]["stestname"], "value": responseData["TestMaster"][0]["ntestcode"]}: "",
                            ntestparametercode: paramdata["ntestparametercode"]
                        },
                        ncontrolCode,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

//Formula test category and test change event function
export const formulaChangeFunction = (inputParam, formulaData, caseNo, selectedRecordData, methodUrl) => {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/testmaster" + methodUrl, inputParam)
            .then(response => {
                const masterData = response.data;
                const testMasterMap = constructOptionList(masterData["TestMaster"] || [], "ntestcode", "stestname", 'descending', 'ntestcode', false);
                dispatch({
                    type: DEFAULT_RETURN,

                    payload: caseNo === 1 ? {
                        formulaData: {
                            ...formulaData,
                            testMaster: testMasterMap.get("OptionList"),
                            dynamicFormulaFields: masterData["DynamicFormulaFields"] || []
                        },
                        selectedRecord: {
                            ...selectedRecordData,
                            ntestcode: testMasterMap.get("OptionList") && testMasterMap.get("OptionList").length > 0 ? testMasterMap.get("OptionList")[0] : ""
                            // masterData["TestMaster"].length>0? {"label": masterData["TestMaster"][0]["stestname"], "value": masterData["TestMaster"][0]["ntestcode"]}: ""
                        },
                        loading: false
                    } : {
                        formulaData: {
                            ...formulaData,
                            dynamicFormulaFields: masterData["DynamicFormulaFields"]
                        },
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
                } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const changeTestCategoryFilter = (inputParam, filterTestCategory) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/testmaster/get" + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                const masterData = response.data
                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        masterData: {
                            ...masterData,
                            filterTestCategory,
                            nfilterTestCategory: inputParam.inputData.nfilterTestCategory
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
                } else if (error.response.status === 417) {
                    toast.info(error.response.data)
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const addTestFile = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
            userinfo: inputParam.userInfo
        })];
        if (inputParam.operation === "update") {
            urlArray.push(rsapi().post("/testmaster/editTestFile", {
                userinfo: inputParam.userInfo,
                testfile: inputParam.selectedRecord
            }))
        }
        Axios.all(urlArray)
            .then(response => {
              
                const linkMap = constructOptionList(response[0].data.LinkMaster, "nlinkcode", "slinkname", false, false, true);
                const linkmaster = linkMap.get("OptionList");
                let selectedRecord = {};
                const defaultLink = linkmaster.filter(items => items.item.ndefaultlink === transactionStatus.YES);
                let disabled = false;
                let editObject = {};
                if (inputParam.operation === "update") {
                    editObject = response[1].data;
                    let nlinkcode = {};
                    let link = {};
                    if (editObject.nattachmenttypecode === attachmentType.LINK) {
                        nlinkcode = {
                            "label": editObject.slinkname,
                            "value": editObject.nlinkcode
                        }

                        link = {
                            slinkfilename:editObject.sfilename,
                            slinkdescription:editObject.sdescription,
                            nlinkdefaultstatus:editObject.ndefaultstatus,
                            sfilesize:'',
                            nfilesize:0,
                            ndefaultstatus:4,
                            sfilename:'',
                        }

                    } else {
                        nlinkcode = defaultLink.length > 0 ? defaultLink[0] : "" //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:""
                        link = {
                            slinkfilename:'',
                            slinkdescription:'',
                            nlinkdefaultstatus:4,
                            sfilesize:editObject.sfilesize,
                            nfilesize:editObject.nfilesize,
                            ndefaultstatus:editObject.ndefaultstatus,
                            sfilename:editObject.sfilename,
                            sdescription:editObject.sdescription
                        }
                    }



                    selectedRecord = {
                        ...link,
                        ssystemfilename:editObject.ssystemfilename,
                        ntestfilecode:editObject.ntestfilecode,
                        nattachmenttypecode:editObject.nattachmenttypecode,
                        //...editObject,
                        nlinkcode,
        
                       // disabled: true
                    };
                } else {
                    selectedRecord = {
                        nattachmenttypecode:response[0].data.AttachmentType.length>0?
                        response[0].data.AttachmentType[0].nattachmenttypecode:attachmentType.FTP,
                        nlinkcode: defaultLink.length > 0 ? defaultLink[0] : "", //{"label": defaultLink[0].slinkname, "value": defaultLink[0].nlinkcode}:"",
                        disabled
                    };
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        [inputParam.modalName]: true,
                        operation: inputParam.operation,
                        screenName: inputParam.screenName,
                        ncontrolCode: inputParam.ncontrolCode,
                        selectedRecord,
                        loading: false,
                        linkMaster: linkmaster,
                        showSaveContinue: false,
                        editFiles: editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {}
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
 

export const getActiveTestContainerTypeById = (containerParam) => {
    return function (dispatch) {
        let urlArray = [];
        const containerTypeById =rsapi().post("containertype/getContainerType", {
            "userinfo": containerParam.userInfo
        });
        
          
            const containerById=rsapi().post("testmaster/getActiveTestContainerTypeById", {
                [containerParam.primaryKeyField] :containerParam.primaryKeyValue,
                "userinfo": containerParam.userInfo
                });
                const units =rsapi().post("unit/getUnit", {
            "userinfo": containerParam.userInfo
        });
            urlArray = [containerTypeById, containerById,units];


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
               
                const continerType = constructOptionList(response[0].data || [], "ncontainertypecode", "scontainertype", false, false, true);
                const unitMap = constructOptionList(response[2].data || [], "nunitcode", "sunitname", false, false, true);

                let otherTestData = {
                    containertype: continerType.get("OptionList"),
                    unit: unitMap.get("OptionList")
                }
                let ContainerType = [];
                let unit=[];

                ContainerType.push({
                    "value": response[1].data["ncontainertypecode"],
                    "label": response[1].data["scontainertype"]
                });
                selectedRecord = response[1].data;

                selectedRecord["ncontainertypecode"] = ContainerType[0];
               
                if( response[1].data["nunitcode"]!==-1){
                    unit.push({
                        "value": response[1].data["nunitcode"],
                        "label": response[1].data["sunitname"]
                    });
                    selectedRecord = response[1].data;
                    selectedRecord["nunitcode"] = unit[0];
                    selectedRecord["unitMandatory"] = true;
                } else {
                    selectedRecord["nunitcode"] = undefined;
                }
                
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        otherTestData:otherTestData,
                       selectedRecord: selectedRecord,
                        isOpen: true,
                        operation: containerParam.operation,
                        screenName: "IDS_CONTAINERTYPE",
                        openChildModal: true,
                        ncontrolCode:containerParam.ncontrolCode,
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




export const addContainerType = (operation, testparametercode, userInfo, ncontrolCode) => {
    return function (dispatch) {
        let urlArray = [];
        const containerTypeById =rsapi().post("unit/getUnit", {
            "userinfo": userInfo
        });
        
          
             const containerById=rsapi().post("testmaster/getAvailableContainerType", {
                "TestMaster": testparametercode,
                 "userinfo": userInfo
                 });
             urlArray = [containerTypeById,containerById];


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                const unitMap = constructOptionList(response[0].data || [], "nunitcode", "sunitname", false, false, true);
 
                const continerType = constructOptionList(response[1].data || [], "ncontainertypecode", "scontainertype", false, false, true);

                let otherTestData = {
                    containertype: continerType.get("OptionList"),
                    unit: unitMap.get("OptionList")

                }
                
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        otherTestData:otherTestData,
                       selectedRecord: selectedRecord,
                       showSaveContinue: false,
                        isOpen: true,
                        operation: operation,
                        screenName: "IDS_CONTAINERTYPE",
                        openChildModal: true,
                        loading: false,
                        ncontrolCode
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

export function ReportInfoTest(screenName, operation, primaryKeyName, masterData, userInfo, ncontrolCode) {
    return function (dispatch) {

           let urlArray = [];                
            const Submitter = rsapi().post("/testmaster/getEditReportInfoTest", {
                                              [primaryKeyName]: masterData.SelectedTest[primaryKeyName],
                                              "userinfo": userInfo
                            });
                            urlArray = [Submitter];
                        dispatch(initRequest(true));
                        Axios.all(urlArray)
                        .then(response => {
                            let selectedRecord ={};                              
                            selectedRecord["sconfirmstatement"]  = response[0].data.ReportInfoTest.sconfirmstatement ;
                            selectedRecord["sdecisionrule"]  = response[0].data.ReportInfoTest.sdecisionrule;
                            selectedRecord["ssopdescription"]  = response[0].data.ReportInfoTest.ssopdescription;
                            selectedRecord["stestcondition"]  = response[0].data.ReportInfoTest.stestcondition;  
                            selectedRecord["sdeviationcomments"]  = response[0].data.ReportInfoTest.sdeviationcomments;                      
                            selectedRecord["smethodstandard"]  = response[0].data.ReportInfoTest.smethodstandard;  
                            selectedRecord["sreference"]  = response[0].data.ReportInfoTest.sreference;               
    
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    isOpen: true,
                                    masterData:masterData,
                                    selectedRecord,
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
                                toast.error(intl.formatMessage({ id: error.message  }));
                            } else {
                            toast.warn(intl.formatMessage({id: error.response.data }));
                            }
                        })              
        
    }

}

export function getUnitConversion(nunitcode,masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("testmaster/getDestinationUnit", {"nunitcode": nunitcode,"userinfo": userInfo})
            .then(response => {
                let DestinationUnit = [];   
                selectedRecord["ndestinationunitcode"]="";                  

                const DestinationUnitMap = constructOptionList(response.data.DestinationUnit || [], "ndestinationunitcode","sunitname1", undefined, undefined, false);
                DestinationUnit = DestinationUnitMap.get("OptionList");
					//ALPD-3521
                if(DestinationUnit.length===0){
                    selectedRecord["noperatorcode"]=-1;
                    selectedRecord["nconversionfactor"]="";

                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        DestinationUnit,
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

export function getConversionOperator(nunitcode,ndestinationunitcode,masterData, userInfo, selectedRecord) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("testmaster/getConversionOperator", {"nsourceunitcode":nunitcode,"ndestinationunitcode": ndestinationunitcode,"userinfo": userInfo})
            .then(response => {      
                
                //ALPD-3521
                selectedRecord["noperatorcode"]=response.data.UnitConversion[0].noperatorcode;
                selectedRecord["soperator"] = response.data.UnitConversion[0].soperator;           
                selectedRecord["nconversionfactor"] = response.data.UnitConversion[0].nconversionfactor;
                
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {                       
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
export const addClinicalSpecification = (operation, paramdata, userInfo, ncontrolCode) => {
    return (dispatch) => {
            dispatch(initRequest(true));
            const urlArray = [
                rsapi().post("patient/getGender", {
                    "userinfo": userInfo
                }),
                rsapi().post("grade/getGrade", {
                    userinfo: userInfo
                }),
                rsapi().post("/period/getPeriodByControl", {
                    "ncontrolcode": ncontrolCode,
                    "userinfo": userInfo
                })
            ];
            
            if (operation === "update") {
                urlArray.push(rsapi().post("testmaster/getTestParameterClinicalSpecById", {
                    ...paramdata,
                    "userinfo": userInfo
                        }));
            }
            Axios.all(urlArray)
            .then(response => {
                let grade ={};
                let gender={};
                let period={};
                let selectedRecord = {};
        //ALPD-5053 added by Dhanushya RI,To get fromage period and toage period
                let ntoageperiod=[];
                let nfromageperiod=[];

                const gradeMap = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                grade = gradeMap.get("OptionList");
                const genderMap = constructOptionList(response[0].data.genderList || [], "ngendercode", "sgendername", false, false, true);
                 gender = genderMap.get("OptionList");  
                 const PeriodMap = constructOptionList(response[2].data || [], "nperiodcode", "speriodname", false, false, true);
                 period = PeriodMap.get("OptionList");  
                                    
                if (operation === "update") {
                    selectedRecord = {
                        ...response[3].data
                    }
                     //ATE234 Janakumar ALPDJ21-55 Flow Validation Issues
                    selectedRecord["ngradecode"] = getComboLabelValue(response[3].data, response[1].data, 
                        "ngradecode", "scombodisplaystatus");   //sgradename
                    selectedRecord["ngendercode"] = getComboLabelValue(response[3].data, response[0].data.genderList, 
                            "ngendercode", "sgendername");
                    nfromageperiod.push({
                                "value": response[3].data["nfromageperiod"],
                                "label": response[3].data["sfromageperiod"]
                            });
                    ntoageperiod.push({
                                "value": response[3].data["ntoageperiod"],
                                "label": response[3].data["stoageperiod"]
                            });  
                        selectedRecord["nfromageperiod"]=nfromageperiod[0];
                        selectedRecord["ntoageperiod"]=ntoageperiod[0];

                            selectedRecord["nhigha"]= selectedRecord["shigha"]==='null'?'':selectedRecord["shigha"]
                            selectedRecord["nhighb"]= selectedRecord["shighb"]==='null'?'':selectedRecord["shighb"]
                           selectedRecord["nlowa"]= selectedRecord["slowa"]==='null'?'':selectedRecord["slowa"]
                           selectedRecord["nlowb"]=selectedRecord["slowb"]==='null'?'':selectedRecord["slowb"]
                           selectedRecord["sminlod"]= selectedRecord["sminlod"] ==='null'?'':selectedRecord["sminlod"]
                           selectedRecord["smaxlod"]= selectedRecord["smaxlod"] ==='null'?'':selectedRecord["smaxlod"]
                           selectedRecord["sminloq"]= selectedRecord["sminloq"] ==='null'?'':selectedRecord["sminloq"]
                           selectedRecord["smaxloq"]= selectedRecord["smaxloq"] ==='null'?'':selectedRecord["smaxloq"]
                            selectedRecord["sapprovemin"]= selectedRecord["sapprovemin"] ==='null'?'':selectedRecord["sapprovemin"]
                           selectedRecord["sapprovemax"]= selectedRecord["sapprovemax"] ==='null'?'':selectedRecord["sapprovemax"]
                           selectedRecord["sdisregard"]= selectedRecord["sdisregard"] ==='null'?'':selectedRecord["sdisregard"]
                           selectedRecord["sresultvalue"]= selectedRecord["sresultvalue"]==='null'?'':selectedRecord["sresultvalue"] 
                } else {
                    selectedRecord = {
                        ntestparametercode: paramdata["ntestparametercode"]
                    }
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: operation,
                        screenName: "IDS_CLINICALSPEC",
                        selectedRecord,
                        ncontrolCode,
                        loading: false, parameterData: {
                            gender,grade,formAgePeriod:period,toAgePeriod:period,
                            needCodedResult: false
                        },
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export const addPredefinedModal = ( userInfo, ncontrolCode) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("testmaster/getPreDefinedFormula", {
                userinfo: userInfo,
            })
            .then(response => {
                const responseData = response.data;
                const preDefinedFormulaMap = constructOptionList(responseData["PreDefinedFormula"], "npredefinedformulacode", "sdescription", false, false, false);
            
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openChildModal: true,
                        showSaveContinue: false,
                        operation: "create",
                        screenName: "IDS_PREDEFINEDFORMULA",
                        preDefinedFormula: preDefinedFormulaMap.get("OptionList"),
                        ncontrolCode,
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const addTestSubContractor = (operation, testcode, userInfo, ncontrolCode) => {
    return function (dispatch) {
        let urlArray = [];
        const Period = rsapi().post("/period/getPeriodByControl", {
            "ncontrolcode": ncontrolCode,
            "userinfo": userInfo
        });


        const containerById = rsapi().post("testmaster/getSubContractor", {
            "ntestcode": testcode,
            "userinfo": userInfo
        });
        urlArray = [Period, containerById];


        dispatch(initRequest(true));
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = {};
                const periodMap = constructOptionList(response[0].data || [], "nperiodcode",
                    "speriodname", undefined, undefined, false);

                const subContractorMap = constructOptionList(response[1].data || [], "nsuppliercode", "ssuppliername", false, false, true);

                let otherTestData = {
                    subcontractor: subContractorMap.get("OptionList"),
                    period: periodMap.get("OptionList")

                }
                selectedRecord["ncontrolleadtime"] = 0;
                selectedRecord['nperiodcode'] = periodMap.get("OptionList")[0];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        otherTestData: otherTestData,
                        selectedRecord: selectedRecord,
                        showSaveContinue: false,
                        isOpen: true,
                        operation: operation,
                        screenName: "IDS_SUBCONTRACTOR",
                        openChildModal: true,
                        loading: false,
                        ncontrolCode
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
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            });

    }
}

