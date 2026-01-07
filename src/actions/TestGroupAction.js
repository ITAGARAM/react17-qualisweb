import {
    toast
} from "react-toastify";
import rsapi from "../rsapi";
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from "./LoginTypes";
import {
    attachmentType,
    parameterType,
    SampleType,
    transactionStatus,MaterialType
} from "../components/Enumeration";
import {
    constructjsonOptionList,
    constructOptionList,
    rearrangeDateFormat,
    //formatInputDate,
    sortData,getComboLabelValue
} from "../components/CommonScript";
import Axios from "axios";
import {
    intl
} from "../components/App";
import {
    initRequest
} from "./LoginAction";
import { openModal } from "./ApprovalConfigAction";


export const sampleTypeOnChange = (inputParam, masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        let url = "/testgroup";
        if (inputParam.classUrl) {
            url = inputParam.classUrl;
        }
        rsapi().post(url + inputParam.methodUrl, inputParam.inputData)
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        tempFilterData: inputParam.inputData.tempFilterData,
                        masterData: {
                            ...masterData,
                            ...response.data
                        },
                        loading: false
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
                    } else if (error.response.status === 409 || error.response.status === 417) {
                    masterData["ExistingLinkTable"] = [];
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData,
                            loading: false
                        }
                    });
                    toast.warn(error.response.data);
                } else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            loading: false
                        }
                    });
                    toast.error(error.message)
                }
            });
    }
}

export const filterTestGroup = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/testgroup/filterTestGroup", inputParam.inputData)
            .then(response => {
                sortData(response.data);
                if (searchRef.current) {
                    searchRef.current.value = "";
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
							//ALPD-5529--Vignesh R(06-03-2025)-->Test group screen -> Profile showing wrongly in specific scenario.
                            filterData: inputParam.inputData.filterData,
                            selectedRecordCopy:response.data.AgaramTree,
                            isrulesenginerequired:inputParam['inputData']['filterData']['nsampletypecode']['item']['nrulesenginerequired'],
                            searchedData: undefined
                        }, 
                        loading: false,
                        testskip: 0,
                        historyDataState: {
                            ...inputParam.historyDataState,
                            sort: undefined,
                            filter: undefined
                        }
                    }
                });
            })
            .catch(error => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
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

export const createTree = (selectedRecord, userInfo, masterData, ncontrolCode) => {
    return (dispatch) => {
        //ALPD-1466,1465
     let isValid =false;
        if (selectedRecord && selectedRecord.ntreeversiontempcode !== "") {
            // if (selectedRecord && selectedRecord.nsampletypecode.item.nportalrequired === transactionStatus.YES &&
            //     masterData.FocusKey === "root" && masterData && masterData.TreeTemplateManipulation.length > 0) {
            //     toast.warn(intl.formatMessage({
            //         id: "IDS_MORETHANONEPROFILENOTALLOWEDCLINICALTYPE"
            //     }));
            // } else 
            if (selectedRecord.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.YES) {
                isValid=true;
            } 
            //ALPD-5320 Test Group - Flush Db- no record added click root or specification add button 500 error occurred.
            else if ((selectedRecord.nproductcatcode && selectedRecord.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES) || (selectedRecord.nproductcode)) {
                isValid=true;
            } else {
               
                toast.warn(intl.formatMessage({
                    id: "IDS_PRODUCTNOTAVAILABLE"
                }));
            }
        }
         else {
                toast.warn(intl.formatMessage({ id: "IDS_STUDYPLANTEMPLATEISNOTAVAILABLE" }));
            }
            if(isValid){
                const inputParam = {
                    sampletype: selectedRecord.nsampletypecode.item,
                    ncategorycode: selectedRecord.nproductcatcode.value,
                    ntreeversiontempcode: selectedRecord.ntreeversiontempcode.value,
                    nprojectmastercode: selectedRecord.nprojectmastercode ? selectedRecord.nprojectmastercode.value : -1,
                    userinfo: userInfo,
                    treetemplatemanipulation: masterData.selectedNode
                }
                dispatch(initRequest(true));
                rsapi().post("/testgroup/getTemplateMasterDetails", {
                    ...inputParam
                })
                    .then(response => {
                        const treetempTranstestGroup = response.data["TreetempTranstestGroup"] || [];

                        // const treeMandatoryFields = treetempTranstestGroup.map((item, index) => {
                        //         return {
                        //             "idsName": item.slabelname,
                        //             "dataField": "sleveldescription_" + index,
                        //             "mandatory": true
                        //         }
                        // });

                        //  const selectedNodeLevel = selectedNode ? selectedNode.slevelcode.split("/1").length-2 : -1;
                        const mandatoryFields = [];
                        treetempTranstestGroup.forEach((item, index) => {
                            if (item.sleveldescription === null) {
                                mandatoryFields.push({
                                    "idsName": item.slabelname,
                                    "dataField": "sleveldescription_" + index,
                                    "mandatory": true
                                })
                            }
                        });

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openModal: true,
                                operation: "create",
                                screenName: "IDS_PROFILETREE",
                                TreetempTranstestGroup: treetempTranstestGroup,
                                treeMandatoryFields: mandatoryFields,
                                //selectedRecord,
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                            toast.warn(error.response.data);
                        } else {
                            toast.error(error.message)
                        }
                    });
            }
}
}
 
export const editTree = (operation, selectedNode, userinfo, ncontrolCode, filterData, masterData) => {
    return (dispatch) => {
        if (!selectedNode) {
            return toast.warn(intl.formatMessage({
                id: "IDS_SELECTPROFILENODETOEDIT"
            }))
        }
        if(selectedNode != null && selectedNode.nproductcatcode === -2){
           return  toast.warn(intl.formatMessage({ id: "IDS_DEFAULTPROFILEEDITRESTRICTED" }));
        }
        //console.log("edit Tree:", selectedNode, masterData);
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === selectedNode["ntreeversiontempcode"]);
        // if (treeVersionTemplateIndex !== -1){
        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        //}
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            if (selectedNode) {
                dispatch(initRequest(true));
                rsapi().post("/testgroup/getTreeById", {
                    userinfo,
                    treetemplatemanipulation: selectedNode,
                    ntreeversiontempcode: filterData.ntreeversiontempcode.value
                })
                    .then(response => {
                        const treetempTranstestGroup = response.data;
                        const treeMandatoryFields = treetempTranstestGroup && [{
                            "idsName": treetempTranstestGroup.slabelname,
                            "dataField": "sleveldescription",
                            "mandatory": true
                        }];
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openModal: true,
                                operation: operation,
                                screenName: "IDS_EDITTREE",
                                selectedRecord: {
                                    ...treetempTranstestGroup
                                },
                                treeMandatoryFields,
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                            toast.warn(error.response.data);
                        } else {
                            toast.error(error.message)
                        }
                    });
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SELECTPROFILENODETOEDIT"
                }))
            }
        }
    }
}

export const addSpecification = (operation, inputParam, ncontrolCode, masterDatas) => {
    return (dispatch) => {
        //console.log("input:", inputParam);
        if(inputParam.selectedNode != null && inputParam.selectedNode.nproductcatcode === -2){
             toast.warn(intl.formatMessage({ id: "IDS_DEFAULTPROFILESPECRESTRICTED" }));
        }
        else
        {
            //if (inputParam.selectedNode != null && inputParam.selectedNode.schildnode === "") {
            if (inputParam.selectedRecord && inputParam.selectedRecord.ntreeversiontempcode !== "") {
                //ALPD-5320 Test Group - Flush Db- no record added click root or specification add button 500 error occurred.
                if (inputParam.selectedRecord.ntreeversiontempcode && inputParam.selectedRecord.ntreeversiontempcode.item.ntransactionstatus === transactionStatus.RETIRED) {
                    toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
                }
                else {
                    if (inputParam.selectedNode != null && inputParam.selectedNode.nnextchildcode === -1) {

                        if (masterDatas && masterDatas.SelectedSpecification === null && operation === "copy") {
                            toast.warn(intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
                        }
                        else {
                            let urlArray = [];
                            if (operation === "update") {
                                const testgroupspecification = inputParam.testgroupspecification[0];
                                // let isValidOperation = false;
                                // if (operation === "update"){
                                //     if (testgroupspecification.napprovalstatus === transactionStatus.CORRECTION ||
                                //         testgroupspecification.napprovalstatus === transactionStatus.DRAFT) {
                                //             isValidOperation = true;
                                //     }
                                //     else {
                                //         toast.warn(intl.formatMessage({id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"}));
                                //         return;
                                //     }
                                // }
                                // else{
                                //     isValidOperation = true;
                                // }
                                if (testgroupspecification.napprovalstatus === transactionStatus.CORRECTION ||
                                    testgroupspecification.napprovalstatus === transactionStatus.DRAFT) {
                                    urlArray = [rsapi().post("timezone/getTimeZone")];

                                    urlArray.push(rsapi().post("/testgroup/getActiveSpecificationById", {
                                        testgroupspecification,
                                        userinfo: inputParam.userinfo,
                                        ntreeversiontempcode: inputParam.selectedRecord.ntreeversiontempcode.value
                                    }));
                                }
                                else {
                                    toast.warn(intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
                                    return;
                                }
                            }
                            else {
                                urlArray = [rsapi().post("timezone/getTimeZone")];

                                urlArray.push(rsapi().post("/testgroup/getAddSpecification", {
                                    userinfo: inputParam.userInfo,
                                    ntreeversiontempcode: inputParam.selectedRecord.ntreeversiontempcode.value,
                                    nprojectmastercode:masterDatas.selectedNode.nprojectmastercode
                                    //currentdate: formatInputDate(new Date(), true)
                                }));
                            }
                            Axios.all(urlArray)
                                .then(response => {
                                    let selectedRecord = {};
                                    let masterData = inputParam.masterData !== undefined ? inputParam.masterData : masterDatas;

                                    if (operation === "update") {
                                        masterData = {
                                            ...inputParam.masterData,
                                            ...response[1].data,
                                            testgroupspecification: inputParam.testgroupspecification
                                        }
                                        selectedRecord = {
                                            sproductname: inputParam.selectedRecord.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES ? "" : inputParam.selectedRecord.nproductcode && inputParam.selectedRecord.nproductcode.label,
                                            sproductcatname: inputParam.selectedRecord.nproductcatcode.label,
                                            ncategorybasedflow: inputParam.selectedRecord.nproductcatcode.item.ncategorybasedflow,
                                            ...response[1].data.SelectedSpecification,
                                            //dexpirydate: new Date(response[1].data["sexpirydate"]),
                                            dexpirydate: rearrangeDateFormat(inputParam.userinfo, response[1].data.SelectedSpecification["sexpirydate"]),
                                            ntzexpirydate: {
                                                "label": response[1].data.SelectedSpecification.stimezoneid,
                                                "value": response[1].data.SelectedSpecification.ntzexpirydate
                                            }
                                        };
                                    } else {
                                        selectedRecord = {
                                            sproductname: inputParam.selectedRecord.nproductcatcode.item.ncategorybasedflow === transactionStatus.YES ? "" : inputParam.selectedRecord.nproductcode && inputParam.selectedRecord.nproductcode.label,
                                            sproductcatname: inputParam.selectedRecord.nproductcatcode.label,
                                            sspecname: inputParam.selectedNode.sleveldescription,
                                            ncategorybasedflow: inputParam.selectedRecord.nproductcatcode.item.ncategorybasedflow,
                                            dexpirydate: rearrangeDateFormat(inputParam.userInfo, response[1].data.ExpiryDate),
                                            selectedCopyProfileName: inputParam.selectedNode.sleveldescription,
                                            selectedCopyNodeManipulationCode: inputParam.selectedNode.ntemplatemanipulationcode,
                                            CopyFocusKey: masterData.FocusKey,
                                            CopyActiveKey: masterData.ActiveKey,
                                            scopyspecname: inputParam.selectedNode.sleveldescription,
                                            //ncomponentrequired: inputParam.selectedNode.nsampletypecode === SampleType.CLINICALTYPE ? transactionStatus.YES : transactionStatus.NO,
                                        // ncomponentrequired: transactionStatus.YES,
                                            // ncomponentrequired :inputParam.selectedRecord.nproductcatcode.item.nmaterialtypecode == MaterialType.IQCSTANDARDMATERIALTYPE ?transactionStatus.NO:transactionStatus.YES,
                                            ncomponentrequired : inputParam.selectedRecord.nsampletypecode && inputParam.selectedRecord.nsampletypecode.item.ncomponentrequired ? inputParam.selectedRecord.nsampletypecode.item.ncomponentrequired : transactionStatus.YES,
                                            // nclinicalspec: inputParam.selectedNode.nsampletypecode===SampleType.CLINICALTYPE?transactionStatus.YES:transactionStatus.NO,
                                            ntransactionstatus: transactionStatus.ACTIVE,
                                            ntzexpirydate: {
                                                "label": inputParam.userInfo.stimezoneid,
                                                "value": inputParam.userInfo.ntimezonecode
                                            }
                                        };
                                        // ALPD-4757, When copy spec slideout opens, isCopy becomes false due to get sample cat or sample based on main filter
                                        const selectedRecordCopy = {isCopy : false}
                                        masterData["selectedRecordCopy"] = selectedRecordCopy;
                                    }
                                    dispatch({
                                        type: DEFAULT_RETURN,
                                        payload: {
                                            openModal: true,
                                            operation: operation,
                                            screenName: "IDS_SPECIFICATION",
                                            masterData,
                                            selectedRecord,
                                            timeZoneList: constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", false, false, true).get("OptionList"),
                                            ncontrolCode
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
                                    } else {
                                        toast.warn(error.response.data);
                                    }
                                })
                        }
                    } else {
                        if (operation === "copy") {
                            toast.warn(intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" }));
                        }
                        else {
                            toast.warn(intl.formatMessage({ id: "IDS_SELECTLASTLEVELNODETOADDSPEC" }));
                        }
                    }
                }
            } else {
                toast.warn(intl.formatMessage({ id: "IDS_STUDYPLANTEMPLATEISNOTAVAILABLE" }));
            }
        }
    }
}

export const addComponent = (SelectedSpecification, userInfo, ncontrolCode, masterData,genericLabel) => {
    return (dispatch) => {

        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            rsapi().post("/testgroup/getAvailableComponent", {
                userinfo: userInfo,
                testgroupspecification: {...SelectedSpecification,nprojectmastercode:masterData["selectedNode"]["nprojectmastercode"],
                nclinicaltyperequired:masterData.nsampletypecode.item.nclinicaltyperequired}
            })
                .then(response => {
                    const testGroupSpecSampleType = response.data["TestGroupSpecSampleType"] || [];
                    if (testGroupSpecSampleType.length > 0) {
                        const testCategory = constructOptionList(response.data["TestCategory"] || [], "ntestcategorycode", "stestcategoryname", 'ntestcategorycode', 'ascending', false);
                        const sampleTypeMap = constructOptionList(testGroupSpecSampleType, "ncomponentcode", "scomponentname", false, false, true);
                        // const TestGroupTestMap = constructOptionList(response.data["TestGroupTest"]||[], "ntestcode", "stestname", false, false, true);
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openModal: true,
                                operation: "create",
                                screenName:genericLabel["Component"]["jsondata"]["sdisplayname"][userInfo.slanguagetypecode],
                                testGroupInputData: {
                                    TestCategory: testCategory.get("OptionList"),
                                    TestGroupSpecSampleType: sampleTypeMap.get("OptionList"),
                                    TestGroupTest: response.data["TestGroupTest"] || [] //TestGroupTestMap.get("OptionList"),
                                },
                                selectedRecord: {
                                    ncomponentcode: sampleTypeMap.get("DefaultValue"),
                                    ntestcategorycode: testCategory.get("DefaultValue") ? testCategory.get("DefaultValue") : testCategory.get("OptionList")[0]
                                },
                                ncontrolCode
                            }
                        });
                    } else {
                        toast.warn(
                             genericLabel["Component"]["jsondata"]["sdisplayname"][userInfo.slanguagetypecode]+" "+intl.formatMessage({ id: "IDS_NOTAVAILABLE" })
                        );
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                })
        }
    }
}

export const addTestGroupTest = (selectedComponent, userInfo, ncontrolCode, selectedSpecification, filterData, masterData) => {
    return dispatch => {
        if (masterData.selectedNode !== undefined && masterData.selectedNode !== null) {
            const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
                x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

            const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
            if (templateVersionStatus === transactionStatus.RETIRED) {
                toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
            }
            else {
                if (selectedSpecification) {
                    if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
                        selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {

                        let openTestModal = false;
                        if (selectedSpecification.ncomponentrequired === transactionStatus.YES) {
                            if (selectedComponent == undefined) {
                                toast.warn(intl.formatMessage({
                                    id: "IDS_NEEDCOMPONENTTOADDTEST"
                                }));
                            } else {
                                openTestModal = true;
                            }
                        } else {
                            openTestModal = true;
                        }

                        if (openTestModal === true) {
                            rsapi().post("/testgroup/getAvailableTest", {
                                userinfo: userInfo,
                                testgroupspecsampletype: selectedComponent,
                                ntreeversiontempcode: filterData.ntreeversiontempcode.value,
                                nprojectmastercode: masterData.selectedNode.nprojectmastercode,
                                nclinicaltyperequired:filterData.nsampletypecode && filterData.nsampletypecode.item.nclinicaltyperequired
                            })
                                .then(response => {
                                    let testCategory;
                                    // = constructOptionList(response.data["TestCategory"], "ntestcategorycode", "stestcategoryname", "ntestcategorycode", "ascending", false);
                                    // const TestGroupTestMap = constructOptionList(response.data["TestGroupTest"]||[], "ntestcode", "stestname", false, false, true);
                                    if (response.data["TestCategory"].length > 0) {
                                        testCategory = constructOptionList(response.data["TestCategory"], "ntestcategorycode", "stestcategoryname", "ntestcategorycode", "ascending", false);
                                        dispatch({
                                            type: DEFAULT_RETURN,
                                            payload: {
                                                openModal: true,
                                                operation: "create",
                                                screenName: "IDS_TEST",
                                                testGroupInputData: {
                                                    TestCategory: testCategory.get("OptionList"),
                                                    TestGroupTest: response.data["TestGroupTest"] || [] //TestGroupTestMap.get("OptionList"),
                                                },
                                                selectedRecord: {
                                                    ntestcategorycode: {
                                                        label: response.data["SelectedTestCategory"].stestcategoryname,
                                                        value: response.data["SelectedTestCategory"].stestcategorycode,
                                                        item: response.data["SelectedTestCategory"]
                                                    }
                                                    //ntestcategorycode: testCategory.get("DefaultValue") ? testCategory.get("DefaultValue") : testCategory.get("OptionList")[0]
                                                },
                                                ncontrolCode
                                            }
                                        });
                                    } else {
                                        toast.warn(intl.formatMessage({
                                            id: "IDS_TESTCATEGORYNOTAVAILABLE"
                                        }))
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                                        toast.warn(error.response.data);
                                    } else {
                                        toast.error(error.message);
                                    }
                                });
                        }


                    } else {
                        toast.warn(intl.formatMessage({
                            id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                        }));
                    }

                }
                else {
                    toast.warn(intl.formatMessage({
                        id: "IDS_SELECTSPECIFICATION"
                    }));
                }
            }
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTSPECIFICATION"
            }));
        }
    }
}

export const editTestGroupTest = (operation, selectedTest, userInfo, ncontrolCode, selectedSpecification, filterData, masterData) => {
    return dispatch => {
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
                selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
                const ntestcode = selectedTest.ntestcode;
                const urlArray = [
                    rsapi().post("/testgroup/getActiveTestById", {
                        userinfo: userInfo,
                        testgrouptest: selectedTest,
                        ntreeversiontempcode: filterData.ntreeversiontempcode.value,
                        nprojectmastercode:masterData["selectedNode"]["nprojectmastercode"] ? masterData["selectedNode"]["nprojectmastercode"]  :-1                  
                    }),
                    // rsapi().post("/source/getSource", {
                    //     userinfo: userInfo
                    // }),
                    rsapi().post("/testmaster/getSection", {
                        ntestcode,
                        userinfo: userInfo
                    }),
                    rsapi().post("/testmaster/getMethod", {
                        ntestcode,
                        userinfo: userInfo
                    }),
                    rsapi().post("/testmaster/getInstrumentCategory", {
                        ntestcode,
                        userinfo: userInfo
                    }),
                    rsapi().post("/testmaster/getTestAttachment", {
                        ntestcode,
                        userinfo: userInfo
                    }),
                    rsapi().post("/testmaster/getContainerType", {
                        ntestcode,
                        userinfo: userInfo
                    }),
			//ALPD-3418
                    rsapi().post("/testmaster/getTestPackage", {
                        ntestcode,
                        userinfo: userInfo
                    })
                ]
                Axios.all(urlArray)
                    .then(response => {
                        // const editObject = response[0].data.TestGroupTest;
                        // const testFileItem = response[0].data.TestGroupTestFile;
                        // const SelectedTest = response[0].data.TestGroupTest;

                        const editObject = response[0].data.SelectedTestGroupTest;
                        const testFileItem = response[0].data.TestGroupTestFile;
                        const SelectedTest = response[0].data.SelectedTest;
                        //const TestGroupTest = response[0].data.TestGroupTest;

                        const selectedRecord = {
                            ...editObject,
                            // nsourcecode: {
                            //     "label": editObject.ssourcename,
                            //     "value": editObject.nsourcecode
                            // },
                            nsectioncode: {
                                "label": editObject.ssectionname,
                                "value": editObject.nsectioncode
                            },
                            nmethodcode: {
                                "label": editObject.smethodname,
                                "value": editObject.nmethodcode
                            },
                            ninstrumentcatcode: {
                                "label": editObject.sinstrumentcatname,
                                "value": editObject.ninstrumentcatcode
                            },
                            ncontainertypecode: {
                                "label": editObject.scontainertype,
                                "value": editObject.ncontainertypecode
                            },
                            ntestpackagecode: {
                                "label": editObject.stestpackagename,
                                "value": editObject.ntestpackagecode
                            }
                        };
                        if (testFileItem) {
                            selectedRecord["ntestfilecode"] = {
                                "label": testFileItem.sfilename,
                                "value": testFileItem.ntestgroupfilecode,
                                item: testFileItem
                            };
                            selectedRecord["ntestgroupfilecode"] = testFileItem.ntestgroupfilecode
                        }
                        if (editObject.nmethodcode !== -1) {
                            selectedRecord["nmethodcode"] = {
                                "label": editObject.smethodname,
                                "value": editObject.nmethodcode
                            }
                        } else {
                            selectedRecord["nmethodcode"] = undefined;
                        }
                        if (editObject.ninstrumentcatcode !== -1) {
                            selectedRecord["ninstrumentcatcode"] = {
                                "label": editObject.sinstrumentcatname,
                                "value": editObject.ninstrumentcatcode
                            }
                        } else {
                            selectedRecord["ninstrumentcatcode"] = undefined;
                        }
                        if (editObject.ncontainertypecode !== -1) {
                            selectedRecord["ncontainertypecode"] = {
                                "label": editObject.scontainertype,
                                "value": editObject.ncontainertypecode
                            }
                        } else {
                            selectedRecord["ncontainertypecode"] = undefined;
                        }
							//ALPD-3418
                        if (editObject.ntestpackagecode !== -1) {
                            selectedRecord["ntestpackagecode"]= {
                                "label": editObject.stestpackagename,
                                "value": editObject.ntestpackagecode
                            }
                        }
                        else {
                            selectedRecord["ntestpackagecode"] = undefined;
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                masterData: {
                                    ...masterData,
                                    ...response[0].data,
                                    SelectedTest: SelectedTest,
                                    //TestGroupTest : [TestGroupTest]
                                },
                                openModal: true,
                                operation: operation,
                                screenName: "IDS_EDITTESTGROUPTEST",
                                testGroupInputData: {
                                    // source: constructOptionList(response[1].data || [], "nsourcecode", "ssourcename", false, false, true).get("OptionList"),
                                    section: constructOptionList(response[1].data || [], "nsectioncode", "ssectionname", false, false, true).get("OptionList"),
                                    method: constructOptionList(response[2].data || [], "nmethodcode", "smethodname", false, false, true).get("OptionList"),
                                    instrumentCategory: constructOptionList(response[3].data || [], "ninstrumentcatcode", "sinstrumentcatname", false, false, true).get("OptionList"),
                                    containerType: constructOptionList(response[5].data || [], "ncontainertypecode", "scontainertype", false, false, true).get("OptionList"),
                                    testFile: constructOptionList(response[4].data || [], "ntestfilecode", "sfilename", false, false, true).get("OptionList"),
                                    testpackage:constructOptionList(response[6].data || [], "ntestpackagecode", "stestpackagename", false, false, true).get("OptionList")
                                },
                                selectedRecord,
                                ncontrolCode
                            }
                        });
                    })
                    .catch(error => {
                        //console.log("errror:", error);
                        dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                            toast.warn(error.response.data);
                        } else {
                            toast.error(error.message)
                        }
                    });
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        }
    }
}

export const editTestGroupParameter = (operation, selectedParameter, userInfo, ncontrolCode, selectedSpecification, filterData, masterData) => {
    return dispatch => {
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT ||
                selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
                dispatch(initRequest(true));
                const urlArray = [
                    rsapi().post("/testgroup/getActiveParameterById", {
                        userinfo: userInfo,
                        testgrouptestparameter: {...selectedParameter,nprojectmastercode:masterData["selectedNode"]["nprojectmastercode"]},
                        ntreeversiontempcode: filterData.ntreeversiontempcode.value
                    }),
                    rsapi().post("/parametertype/getParameterType", {
                        userinfo: userInfo
                    }),
                    rsapi().post("unit/getUnit", {
                        userinfo: userInfo
                    }),
                    rsapi().post("grade/getGrade", {
                        userinfo: userInfo
                    }),
                    rsapi().post("checklist/getApprovedChecklist", {
                        "userinfo": userInfo
                    }),
                    rsapi().post("testmaster/getResultAccuracy", {
                        userinfo: userInfo
                    })
                  
                ]
                Axios.all(urlArray)
                    .then(response => {
                        const parameterObject = response[0].data.TestGroupTestParameter[0];
                        const predefinedObject = response[0].data.TestGroupTestPredefinedParameter;
                        const characterObject = response[0].data.TestGroupTestCharParameter;
                        const numericObject = response[0].data.TestGroupTestNumericParameter && response[0].data.TestGroupTestNumericParameter.length > 0 ? response[0].data.TestGroupTestNumericParameter[0] : {};
                        const selectedRecord = {
                            ...parameterObject,
                            nunitcode: {
                                "label": parameterObject.sunitname,
                                "value": parameterObject.nunitcode
                            },
                            nresultaccuracycode: {
                                "label": parameterObject.sresultaccuracyname,
                                "value": parameterObject.nresultaccuracycode
                            },
                            nparametertypecode: {
                                "label": parameterObject.sdisplaystatus,
                                "value": parameterObject.nparametertypecode
                            },
                            parameterTypeCode: parameterObject.nparametertypecode,
                            nchecklistversioncode: {
                                "label": parameterObject.schecklistname,
                                "value": parameterObject.nchecklistversioncode
                            },
                            schecklistversionname: parameterObject.schecklistversionname,
                            ntestformulacode: parameterObject.ntestformulacode > 0 ? {
                                "label": parameterObject.sformulaname,
                                "value": parameterObject.ntestformulacode,
                                item: {
                                    sformulacalculationdetail: parameterObject.sformulaname,
                                    ntestformulacode: parameterObject.ntestformulacode,
                                    sformulacalculationcode: parameterObject.sformulacalculationcode
                                }
                            } : ""
                        };
                        if (selectedRecord["schecklistname"] === "NA") {
                            delete selectedRecord["nchecklistversioncode"]
                        }
                        if (selectedRecord["schecklistversionname"] === "NA") {
                            delete selectedRecord["schecklistversionname"]
                        }
                        if (selectedRecord["sunitname"] === "NA") {
                            delete selectedRecord["nunitcode"]
                        }
                        if (selectedRecord["sresultaccuracyname"] === "NA") {
                            delete selectedRecord["nresultaccuracycode"]
                        }
                        if (characterObject) {
                            selectedRecord["scharname"] = characterObject.scharname;
                            selectedRecord["ntestgrouptestcharcode"] = characterObject.ntestgrouptestcharcode;
                        }
                        if (predefinedObject) {
                            selectedRecord["ntestgrouptestpredefcode"] = predefinedObject.ntestgrouptestpredefcode;
                            selectedRecord["spredefinedname"] = predefinedObject.spredefinedname;
                            selectedRecord["ndefaultstatus"] = predefinedObject.ndefaultstatus;
                            selectedRecord["ngradecode"] = {
                                "label": predefinedObject.scombodisplaystatus,
                                "value": predefinedObject.ngradecode
                            };
                        }
                        if (numericObject) {
                            selectedRecord["ntestgrouptestnumericcode"] = numericObject.ntestgrouptestnumericcode;
                            selectedRecord["sminlod"] = numericObject.sminlod;
                            selectedRecord["smaxlod"] = numericObject.smaxlod;
                            selectedRecord["sminb"] = numericObject.sminb;
                            selectedRecord["smina"] = numericObject.smina;
                            selectedRecord["smaxa"] = numericObject.smaxa;
                            selectedRecord["smaxb"] = numericObject.smaxb;
                            selectedRecord["sminloq"] = numericObject.sminloq;
                            selectedRecord["smaxloq"] = numericObject.smaxloq;
                            selectedRecord["sdisregard"] = numericObject.sdisregard;
                            selectedRecord["sresultvalue"] = numericObject.sresultvalue;
                            selectedRecord["sapprovemin"] = numericObject.sapprovemin;
                            selectedRecord["sapprovemin"] = numericObject.sapprovemin;
                            selectedRecord["ngradecode"] = {
                                "label": numericObject.scombodisplaystatus,
                                "value": numericObject.ngradecode
                            };
                        }
                        const gradeMap = constructOptionList(response[3].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                        const unitMap = constructOptionList(response[2].data || [], "nunitcode", "sunitname", false, false, true);
                        const resultAccuracyMap = constructOptionList(response[5].data || [], "nresultaccuracycode", "sresultaccuracyname", false, false, true);
                        const grade = gradeMap.get("OptionList");
                        const unit = unitMap.get("OptionList");
                        const resultaccuracy = resultAccuracyMap.get("OptionList");
                        const disabled = parameterObject.nparametertypecode === parameterType.NUMERIC ? false : true;
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openChildModal: true,
                                operation: operation,
                                screenName: "IDS_PARAMETER",
                                testGroupInputData: {
                                    unit,
                                    grade,
                                    resultaccuracy,
                                    testFormula: constructOptionList(response[0].data.TestFormula || [], "ntestformulacode", "sformulaname", false, false, true).get("OptionList"),
                                    parameterType: constructOptionList(response[1].data || [], "nparametertypecode", "sdisplaystatus", false, false, true).get("OptionList"),
                                    checkListVersion: constructOptionList(response[4].data || [], "nchecklistversioncode", "schecklistname", false, false, true).get("OptionList"),
                                    needRoundingDigit: disabled,
                                    needUnit: disabled
                                },
                                parameterData: {
                                    grade,
                                    defaultUnit: unitMap.get("DefaultValue") ? unitMap.get("DefaultValue") : "",
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                            toast.warn(error.response.data);
                        } else {
                            toast.error(error.message);
                        }
                    });
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        }
    }
}

// export const addTestGroupFormula = (selectedParameter, userInfo, ncontrolCode, optionalData) => {
//     return dispatch => {
//         const testgroupspecification = optionalData.testgroupspecification;
//         if(testgroupspecification.napprovalstatus === transactionStatus.DRAFT || 
//             testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
//             dispatch(initRequest(true));
//             rsapi().post("/testgroup/getTestGroupFormula", {userinfo: userInfo, testgrouptestparameter: selectedParameter, testgroupspecification})
//             .then(response=>{
//                 dispatch({
//                     type: DEFAULT_RETURN, 
//                     payload:{
//                         openChildModal: true,
//                         operation: "create",
//                         screenName: "IDS_FORMULA",
//                         testGroupInputData: {testFormula: response.data},
//                         selectedRecord: {},
//                         ncontrolCode
//                 }});
//             })
//             .catch(error=>{
//                 dispatch({type: DEFAULT_RETURN, payload: {loading:false}});
//                 if(error.response.status === 409 || error.response.status === 417) {
//                     toast.warn(error.response.data);
//                 } else {
//                     toast.error(error.message)
//                 }
//             });
//         } else {
//             toast.warn(intl.formatMessage({id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"}));
//         }
//     }
// }

export const getTestGroupParameter = (inputParam) => {
    return (dispatch) => {
        rsapi().post("/testgroup/getTestGroupTestParameter", {
            ...inputParam
        })
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        }
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

export const getComponentBySpecId = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("/testgroup/" + inputParam.operation + inputParam.methodUrl, {
            [inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0],
            userinfo: inputParam.userInfo
        })
            .then(response => {

                sortData(response.data);
                if (searchRef.current) {
                    searchRef.current.value = "";
                }
                const historyDataState = {
                    ...inputParam.historyDataState,
                    sort: undefined,
                    filter: undefined
                }

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        historyDataState,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getTestGroupDetails = (inputParam) => {
    return (dispatch) => { //...inputParam, 
        dispatch(initRequest(true));
        rsapi().post("/testgroup/getTestGroupTest", {
            ntestgrouptestcode: parseInt(inputParam['ntestgrouptestcode']),
            userinfo: inputParam.userInfo
        })
            // rsapi().post("/testgroup/"+inputParam.operation+inputParam.methodUrl, 
            //     {[inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0], userinfo: inputParam.userInfo})
            .then(response => {
                    sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        },
                        testskip: undefined,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message);
                }
            });
    }
}

export const getTestGroupComponentDetails = (inputParam, masterData, searchRef) => {
    return (dispatch) => { //...inputParam, 
        dispatch(initRequest(true));
        rsapi().post("/testgroup/getTestByComponentId", {
            testgroupspecsampletype: inputParam['testgroupspecsampletype'],
            userinfo: inputParam.userInfo
        })
            // rsapi().post("/testgroup/"+inputParam.operation+inputParam.methodUrl, 
            //     {[inputParam.keyName]: inputParam.selectedRecord.testgroupspecification[0], userinfo: inputParam.userInfo})
            .then(response => {
                sortData(response.data);
                if (searchRef.current)
                    searchRef.current.value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        testskip: 0,
                        testtake: 5,
                        loading: false
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getSpecification = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        if (inputParam.selectedRecord !== null) {
            rsapi().post("/testgroup/" + inputParam.operation + inputParam.methodUrl, {
                ...inputParam,
                [inputParam.keyName]: inputParam.selectedRecord
            })
                .then(response => {
                    sortData(response.data);
                    if (searchRef.current)
                        searchRef.current.value = "";
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData: {
                                ...masterData,
                                ActiveKey: inputParam.activeKey,
                                FocusKey: inputParam.focusKey,
                                primaryKey: inputParam.primaryKey,
                                ...response.data,
                                selectedNode: inputParam.selectedRecord,
                                searchedData: undefined,

                            },
                            historyDataState: {
                                ...inputParam.historyDataState,
                                sort: undefined,
                                filter: undefined
                            },
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                        toast.warn(error.response.data);
                    } else {
                        toast.error(error.message)
                    }
                });
        } else {
            dispatch({
                type: DEFAULT_RETURN,
                payload: {
                    masterData: {
                        ...masterData,
                        selectedNode: inputParam.selectedRecord,
                        TestGroupSpecification: [],
                        SelectedSpecification: {},
                        TestGroupTest: [],
                        TestGroupTestParameter: [],
                        TestGroupTestNumericParameter: [],
                        TestGroupTestFormula: [],
                        TestGroupTestPredefinedParameter: [],
                        TestGroupTestClinicalSpec: [],
                        TestGroupTestCharParameter: [],
                        ActiveKey: inputParam.activeKey,
                        FocusKey: inputParam.focusKey,
                        SelectedTest: {},
                        selectedParameter: {},
                        TestGroupSpecFile: [],
                        TestGroupSpecificationHistory: [],
                        SelectedComponent: undefined,
                        RulesEngine: []
                    }
                }
            });
        }
    }
}

export const changeTestCategory = (inputParam, testGroupInputData) => {
    return (dispatch) => {
        rsapi().post("/testgroup/getTestMasterByCategory", {
            ...inputParam
        })
            .then(response => {
                sortData(response.data);
                inputParam.selectedRecord.ntestcode = [];
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord: inputParam.selectedRecord,
                        testGroupInputData: {
                            ...testGroupInputData,
                            ...response.data
                        }
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const getSpecificationDetails = (inputParam, masterData, searchRef) => {
    return (dispatch) => {
        rsapi().post("/testgroup/get" + inputParam.methodUrl, {
            ...inputParam.inputData
        })
            .then(response => {
                if (searchRef.current)
                    searchRef.current.value = "";
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...masterData,
                            ...response.data,
                            searchedData: undefined
                        },
                        screenName: inputParam.screenName
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}

export const editSpecFile = (inputParam) => {
    return (dispatch) => {
        const masterData = inputParam.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            if (inputParam.testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
                inputParam.testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                let urlArray = [rsapi().post("/linkmaster/getLinkMaster", {
                    userinfo: inputParam.userInfo
                }),
                rsapi().post("/testgroup/getActiveSpecFileById", {
                    userinfo: inputParam.userInfo,
                    testgroupspecfile: inputParam.selectedRecord,
                    ntreeversiontempcode: inputParam.filterData.ntreeversiontempcode.value
                })
                ]
                Axios.all(urlArray)
                    .then(response => {
                        const linkmaster = response[0].data.LinkMaster;
                        const defaultLink = linkmaster.filter(item => item.ndefaultlink === transactionStatus.YES);
                        const editObject = response[1].data;
                        let nlinkcode = {};
                        let link = {};
                        if (editObject.nattachmenttypecode === attachmentType.LINK) {
                            nlinkcode = {
                                "label": editObject.slinkname,
                                "value": editObject.nlinkcode
                            }
                            link = {
                                slinkfilename: editObject.sfilename,
                                slinkdescription: editObject.sdescription,
                                nlinkdefaultstatus: editObject.ndefaultstatus,
                                sfilesize: '',
                                nfilesize: 0,
                                ndefaultstatus: 4,
                                sfilename: '',
                            }

                        } else {
                            nlinkcode = defaultLink.length > 0 ? {
                                "label": defaultLink[0].slinkname,
                                "value": defaultLink[0].nlinkcode
                            } : ""

                            link = {
                                slinkfilename: '',
                                slinkdescription: '',
                                sdescription: editObject.sdescription,
                                nlinkdefaultstatus: 4,
                                sfilesize: editObject.sfilesize,
                                nfilesize: editObject.nfilesize,
                                ndefaultstatus: editObject.ndefaultstatus,
                                sfilename: editObject.sfilename,
                            }
                        }
                        const selectedRecord = {
                            // ...editObject,
                            ...link,
                            nallotedspeccode: editObject.nallotedspeccode,
                            nspecfilecode: editObject.nspecfilecode,
                            stypename: editObject.stypename,
                            nattachmenttypecode: editObject.nattachmenttypecode,
                            nlinkcode,
                            // disabled: true
                        };
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openModal: true,
                                operation: "update",
                                screenName: "IDS_SPECFILE",
                                editFiles: Object.values(editObject).length > 0 && editObject.nattachmenttypecode === attachmentType.FTP ? editObject : {},
                                selectedRecord,
                                ncontrolCode: inputParam.ncontrolCode
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                            toast.warn(error.response.data);
                        } else {
                            toast.error(error.message)
                        }
                    });
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        }
    }
}

export const addTestGroupCodedResult = (operation, paramdata, userInfo, ncontrolCode, optionalData, masterData) => {
    return (dispatch) => {
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const testgroupspecification = optionalData.testgroupspecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
                testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                dispatch(initRequest(true));
                const urlArray = [
                    rsapi().post("grade/getGrade", {
                        "userinfo": userInfo
                    })
                ];
                if (operation === "update") {
                    urlArray.push(rsapi().post("testgroup/getActivePredefinedParameterById", {
                        testgrouptestpredefinedparameter: paramdata,
                        "userinfo": userInfo,
                        testgroupspecification
                    }));

                    urlArray.push(rsapi().post("testgroup/getActivePredefinedParameterSubCodedById", {
                        testgrouptestpredefinedparameter: paramdata,
                        "userinfo": userInfo,
                        testgroupspecification
                    }));
                }
                Axios.all(urlArray)
                    .then(response => {
                        let selectedRecord = {};
                        let selectedsubcodedresult = [];
                        let selectsubcodedelete = [];
                        const gradeMap = constructOptionList(response[0].data || [], "ngradecode", "scombodisplaystatus", false, false, true);
                        const grade = gradeMap.get("OptionList");
                        if (operation === "update") {
                            const editCodedResult = response[1].data;
                            selectedRecord = {
                                ntestgrouptestpredefcode: paramdata["ntestgrouptestpredefcode"],
                                ntestgrouptestparametercode: paramdata["ntestgrouptestparametercode"],
                                ngradecode: {
                                    "label": editCodedResult["scombodisplaystatus"],
                                    "value": editCodedResult["ngradecode"]
                                },
                                spredefinedname: editCodedResult["spredefinedname"],
                                //sresultparacomment: editCodedResult["sresultparacomment"],
                                spredefinedsynonym: editCodedResult["spredefinedsynonym"],
                                spredefinedcomments: editCodedResult["spredefinedcomments"],
                                nneedresultentryalert: editCodedResult["nneedresultentryalert"],
                                nneedsubcodedresult: editCodedResult["nneedsubcodedresult"],
                                salertmessage: editCodedResult["salertmessage"]
                            }

                            selectedsubcodedresult = response[2].data;
                        } else {
                            selectedRecord = {
                                ngradecode: gradeMap.get("DefaultValue"),
                                nneedresultentryalert: 4,
                                nneedsubcodedresult: 4
                                // {
                                //     "value": grade[0].ngradecode,
                                //     "label": grade[0]["sdisplaystatus"]
                                // }
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
                                    grade,
                                    needCodedResult: false
                                },
                                selectedRecord,
                                ncontrolCode,
                                loading: false,
                                selectedsubcodedresult,
                                selectsubcodedelete
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
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        }
    }
}





export const subCodedResultView = (operation, paramdata, userInfo, ncontrolCode, optionalData, masterData) => {
    return (dispatch) => {
        rsapi().post("testgroup/getActivePredefinedParameterSubCoded", {
            testgrouptestpredefinedparameter: paramdata,
            "userinfo": userInfo
        })
            .then(response => {
                let selectedsubcoderesult = [];
                dispatch({
                    type: DEFAULT_RETURN,

                    payload: {
                        openModal: true,
                        operation: "View",
                        screenName: "IDS_SUBCODERESULT",
                        selectedsubcoderesult: response.data,
                        masterData: {
                            ...masterData,
                            selectedsubcoderesult: response.data,
                            searchedData: undefined,
                        },
                        //screenName: inputParam.screenName
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
                        } else if (error.response.status === 409 || error.response.status === 417) {
                    toast.warn(error.response.data);
                } else {
                    toast.error(error.message)
                }
            });
    }
}





export const addTestGroupNumericTab = (operation, paramdata, userInfo, optionalData, masterData, ncontrolCode) => {
    return (dispatch) => {
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const testgroupspecification = optionalData.testgroupspecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
                testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
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
                    urlArray.push(rsapi().post("testgroup/getActiveClinicalSpecById", {
                        testgrouptestpredefinedparameter: paramdata,
                        "userinfo": userInfo,
                        testgroupspecification
                    }));
                }
                Axios.all(urlArray)
                    .then(response => {
                        let selectedRecord = {};
                        let ntoageperiod=[];
                        let nfromageperiod=[];
        
                        const gradeMap = constructOptionList(response[0].data.genderList || [], "ngendercode", "sgendername", false, false, true);
                        const gender = gradeMap.get("OptionList");                       
                        const gradeNewMap = constructOptionList(response[1].data || [], "ngradecode", "scombodisplaystatus", false, false, true);                        
                        const grade = gradeNewMap.get("OptionList");
                        const PeriodMap = constructOptionList(response[2].data || [], "nperiodcode", "speriodname", false, false, true);
                        const period = PeriodMap.get("OptionList");  
                        sortData(grade || [], "ascending", "value")
                        if (operation === "update") {
        //ALPD-5054 added by Dhanushya RI,To get fromage period and toage period
                            const editCodedResult = response[3].data;
                            nfromageperiod.push({
                                "value": response[3].data["nfromageperiod"],
                                "label": response[3].data["sfromageperiod"]
                            });
                            ntoageperiod.push({
                                "value": response[3].data["ntoageperiod"],
                                "label": response[3].data["stoageperiod"]
                            });  
                           
                            selectedRecord = {
                                ntestgrouptestclinicspeccode: paramdata["ntestgrouptestclinicspeccode"],
                                ntestgrouptestparametercode: paramdata["ntestgrouptestparametercode"],
                                nfromage: paramdata["nfromage"],
                                ntoage: paramdata["ntoage"],
                                ngradecode: getComboLabelValue(editCodedResult, response[1].data, 
                                    "ngradecode", "scombodisplaystatus"),
                                ngendercode: {
                                    "label": editCodedResult["sgendername"],
                                    "value": editCodedResult["ngendercode"]
                                },
                               
                                // ngradecode: {
                                //     "label": editCodedResult["sgradename"],
                                //     "value": editCodedResult["ngradecode"]
                                // },
                                nhigha: editCodedResult["shigha"]==='null'?'':editCodedResult["shigha"],
                                nhighb: editCodedResult["shighb"]==='null'?'':editCodedResult["shighb"],
                                nlowa: editCodedResult["slowa"]==='null'?'':editCodedResult["slowa"],
                                nlowb: editCodedResult["slowb"]==='null'?'':editCodedResult["slowb"],
                                sminlod: editCodedResult["sminlod"] ==='null'?'':editCodedResult["sminlod"],
                                smaxlod: editCodedResult["smaxlod"] ==='null'?'':editCodedResult["smaxlod"],
                                sminloq: editCodedResult["sminloq"] ==='null'?'':editCodedResult["sminloq"],
                                smaxloq: editCodedResult["smaxloq"] ==='null'?'':editCodedResult["smaxloq"],
                                sapprovemin: editCodedResult["sapprovemin"] ==='null'?'':editCodedResult["sapprovemin"],
                                sapprovemax: editCodedResult["sapprovemax"] ==='null'?'':editCodedResult["sapprovemax"],
                                sdisregard: editCodedResult["sdisregard"] ==='null'?'':editCodedResult["sdisregard"],
                                sresultvalue: editCodedResult["sresultvalue"]==='null'?'':editCodedResult["sresultvalue"]

                            }
        //ALPD-5054 added by Dhanushya RI,To get fromage period and toage period
                            selectedRecord["nfromageperiod"]=nfromageperiod[0];
                            selectedRecord["ntoageperiod"]=ntoageperiod[0];
                        } else {
                            selectedRecord = {
                                ngendercode: gradeMap.get("DefaultValue")
                                // {
                                //     "value": grade[0].ngradecode,
                                //     "label": grade[0]["sdisplaystatus"]
                                // }
                            }
                        }
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                openChildModal: true,
                                showSaveContinue: false,
                                operation: operation,
                                screenName: "IDS_CLINICALSPEC",
                                parameterData: {
                                    gender,grade,formAgePeriod:period,toAgePeriod:period,
                                    needCodedResult: false
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
            } else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        }
    }
}



export const viewTestGroupCheckList = (inputParam, userInfo) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("checklist/viewTemplate", {
            ...inputParam
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        openTemplateModal: true,
                        testGroupCheckList: {
                            templateData: response.data
                        },
                        loading: false,
                        selectedRecord: {}
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


export const reportSpecification = (inputParam) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("testgroup/specReportGenerate", {
            ...inputParam,
            ntreeversiontempcode: inputParam.filterData.ntreeversiontempcode.value
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        loading: false,
                        loadEsign: false,
                        openModal: false,
                        showConfirmAlert: false
                    }
                })
                document.getElementById("download_data").setAttribute("href", response.data.filepath);
                document.getElementById("download_data").click();
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


export const retireSpecification = (inputParam, masterData) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post("testgroup/retireSpec", {
            ...inputParam
        })
            .then(response => {

                // const TestGroupSpecification = response.data.TestGroupSpecificationHistory ;
                sortData(response.data);
                masterData = {
                    ...masterData,
                    ...response.data,

                };
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData,
                        loading: false
                    }
                })
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
            });
    }
}
export const getDataForTestMaterial = (screenName, operation, userInfo, ncontrolCode, selectedRecord, masterData, primaryKeyName) => {
    return function (dispatch) {
        if (masterData.selectedNode !== undefined && masterData.selectedNode !== null && masterData.SelectedSpecification !== null) {
            const testgroupspecification = masterData.SelectedSpecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
                testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                let urlArray = [];
                const materialTypeUrl = rsapi().post("materialcategory/getMaterialType", { "userinfo": userInfo });
                const validationUrl = rsapi().post("testgroup/validationForRetiredTemplate", { "userinfo": userInfo, ntreeversiontempcode: masterData.selectedNode.ntreeversiontempcode});

                urlArray = [materialTypeUrl, validationUrl];

                dispatch(initRequest(true));
                Axios.all(urlArray)
                    .then(response => {
                        // console.log(ncontrolCode)
                        if (masterData.SelectedTest && masterData.SelectedTest !== undefined) {

                            if (response[1].data === "Success") {

                                const materialTypeMap = constructOptionList(response[0].data || [], "nmaterialtypecode",
                                    "smaterialtypename", undefined, undefined, false);

                                const materialType = materialTypeMap.get("OptionList");
                                const materialTypedefault = materialTypeMap.get("DefaultValue");

                                selectedRecord["nmaterialtypecode"] = materialTypedefault;
                                if (selectedRecord["nmaterialtypecode"] !== undefined) {
                                    let inputData = []
                                    let inputParam = { operation: operation, selectedRecord: selectedRecord, materialType: materialType, inputData: { nmaterialtypecode: materialTypedefault.value }, materialType: materialType, masterData: masterData, screenName: screenName, ncontrolCode }
                                    dispatch(getMaterialCategoryBasedMaterialType(inputParam));

                                } else {
                                    dispatch({
                                        type: DEFAULT_RETURN,
                                        payload: {
                                            materialType: materialType,
                                            materialList: undefined,
                                            materialCategoryList: undefined,
                                            isOpen: true,
                                            operation: operation,
                                            screenName: screenName,
                                            openChildModal: true,
                                            ncontrolCode: ncontrolCode,
                                            loading: false,
                                        }
                                    });
                                }
                            }
                            else {
                                toast.warn(intl.formatMessage({
                                    id: response[1].data
                                }));
                                dispatch({
                                    type: DEFAULT_RETURN,
                                    payload: {
                                        operation: operation,
                                        screenName: screenName,
                                        ncontrolCode: ncontrolCode,
                                        loading: false
                                    }
                                });

                            }
                        }
                        else {

                            toast.warn(intl.formatMessage({
                                id: "IDS_NEEDTOADDTEST"
                            }));
                            dispatch({
                                type: DEFAULT_RETURN,
                                payload: {
                                    operation: operation,
                                    screenName: screenName,
                                    ncontrolCode: ncontrolCode,
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
            else {
                toast.warn(intl.formatMessage({
                    id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
                }));
            }
        } else {
            toast.warn(intl.formatMessage({
                id: "IDS_SELECTSPECIFICATION"
            }));
        }
    }
}
export function getMaterialCategoryBasedMaterialType(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("material/getMaterialcombo", { nmaterialtypecode: inputParam.inputData.nmaterialtypecode })
            .then(response => {
                let selectedRecord = {}
                selectedRecord = inputParam.selectedRecord

                const materialCategoryMap = constructOptionList(response.data.MaterialCategoryMain || [], "nmaterialcatcode",
                    "smaterialcatname", undefined, undefined, false);

                const materialCategoryList = materialCategoryMap.get("OptionList");
                const materialCategorydefault = materialCategoryMap.get("DefaultValue");
                selectedRecord['nmaterialcatcode'] = materialCategorydefault;
                let masterData = { ...inputParam.masterData, ...response.data }
                if (response.data.MaterialCategoryMain.length === 0) {
                    if (selectedRecord['nmaterialcatcode']) {
                        delete selectedRecord['nmaterialcatcode']

                    }
                    if (selectedRecord['nmaterialcode']) {
                        delete selectedRecord['nmaterialcode']

                    }
                }
                let materialList = []
                if (materialCategorydefault && materialCategoryList.length !== 0) {
                    materialList = materialList
                    inputParam = {
                        ...inputParam, responsecat: response, materialCategoryList: materialCategoryList, selectedRecord: selectedRecord,
                        inputData: {
                            nmaterialcatcode: materialCategorydefault.value,
                            nmaterialtypecode: inputParam.inputData.nmaterialtypecode,
                            userinfo: inputParam.inputData.userinfo // ALPD-5734    Added userinfo by Vishakh to send value to backend
                        }
                    }
                    dispatch(getMaterialBasedMaterialCategory(inputParam));
                }

                else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            openChildModal: true,
                            screenName: inputParam.screenName,
                            masterData, loading: false,
                            materialCategoryList: materialCategoryList,
                            materialType: inputParam.materialType,
                            materialList: materialList,
                            selectedRecord: selectedRecord,
                            operation: inputParam.operation,
                            ncontrolCode: inputParam.ncontrolCode
                        }
                    });
                }

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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
export function getMaterialBasedMaterialCategory(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        return rsapi().post("testgroup/getAvailableMaterial", {
            nmaterialtypecode: inputParam.inputData.nmaterialtypecode,
            //  nmaterialcatcode: inputParam.inputData.nmaterialcatcode !== undefined
            //     ? inputParam.inputData.nmaterialcatcode : inputParam.responsecat.data.MaterialCategoryMain[0].nmaterialcatcode,
             nmaterialcatcode: inputParam.inputData.nmaterialcatcode,
            ntestgrouptestcode: inputParam.masterData.SelectedTest.ntestgrouptestcode,
            userinfo: inputParam.inputData.userinfo // ALPD-5734    Added userinfo by Vishakh to send value to backend
        })
            .then(response => {

                let selectedRecord = inputParam.selectedRecord;

                const materialMap = constructjsonOptionList(response.data.MaterialCombo || [], "nmaterialcode",
                    "Material Name", undefined, undefined, false);

                const materialList = materialMap.get("OptionList");

                if (response.data.MaterialCombo.length === 0) {
                    delete selectedRecord['nmaterialcode']
                }
                let masterData = { ...inputParam.masterData, ...response.data }
                if (inputParam.materialCategoryList) {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            materialCategoryList: inputParam.materialCategoryList,
                            masterData, loading: false,
                            materialList: materialList,
                            openChildModal: true,
                            screenName: inputParam.screenName,
                            selectedRecord: inputParam.selectedRecord,
                            materialType: inputParam.materialType,
                            operation: inputParam.operation,
                            ncontrolCode: inputParam.ncontrolCode



                        }
                    });
                }
                else {
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            masterData, loading: false,
                            materialList: materialList,
                            openChildModal: true,


                        }
                    });
                }

            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
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

export const getTestGroupMaterial = (inputParam) => {
    return (dispatch) => {
        rsapi().post("/testgroup/getTestGroupTestMaterial", {
            ...inputParam
        })
            .then(response => {
                sortData(response.data);
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                            ...inputParam.masterData,
                            ...response.data
                        }
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}
export const getDataForEditTestMaterial = (screenName, operation, userInfo, ncontrolCode, selectedRecord, Data, primaryKeyName) => {
    return function (dispatch) {

        const testgroupspecification = Data.SelectedSpecification;
        if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT ||
            testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {


            let urlArray = [];
            const materialTypeUrl = rsapi().post("materialcategory/getMaterialType", { "userinfo": userInfo });
            const materialCatUrl = rsapi().post("material/getMaterialcombo", { nmaterialtypecode: Data.selectedMaterial.nmaterialtypecode });
            const materialUrl = rsapi().post("testgroup/getAvailableMaterial", {
                nmaterialcatcode: Data.selectedMaterial.nmaterialcatcode, nmaterialtypecode: Data.selectedMaterial.nmaterialtypecode,
                ntestgrouptestcode: Data.SelectedTest.ntestgrouptestcode
            });
            const materialById = rsapi().post("testgroup/getActiveTestMaterialById", {
                [primaryKeyName]: Data.selectedMaterial.ntestgrouptestmaterialcode, "userinfo": userInfo
            });
            const validationUrl = rsapi().post("testgroup/validationForRetiredTemplate", { "userinfo": userInfo, ntreeversiontempcode: Data.selectedNode.ntreeversiontempcode });

            urlArray = [materialTypeUrl, materialCatUrl, materialUrl, materialById, validationUrl];

            dispatch(initRequest(true));
            Axios.all(urlArray)
                .then(response => {
                    if (response[4].data === "Success") {

                        let selectedRecord = {};
                        let MaterialCategoryData = [];
                        let MaterialTypeData = [];
                        let MaterialData = [];

                        const materialTypeMap = constructOptionList(response[0].data || [], "nmaterialtypecode",
                            "smaterialtypename", undefined, undefined, false);

                        const materialType = materialTypeMap.get("OptionList");

                        const materialCategoryMap = constructOptionList(response[1].data.MaterialCategoryMain || [], "nmaterialcatcode",
                            "smaterialcatname", undefined, undefined, false);

                        const materialCategoryList = materialCategoryMap.get("OptionList");
                        const materialMap = constructjsonOptionList(response[2].data.MaterialCombo || [], "nmaterialcode",
                            "Material Name", undefined, undefined, false);

                        const materialList = materialMap.get("OptionList");

                        MaterialCategoryData.push({
                            "value": response[3].data["nmaterialcatcode"],
                            "label": response[3].data["smaterialcatname"]
                        });
                        MaterialTypeData.push({
                            "value": response[3].data["nmaterialtypecode"],
                            "label": response[3].data["smaterialtypename"]
                        });
                        MaterialData.push({
                            "value": response[3].data["nmaterialcode"],
                            "label": response[3].data["smaterialname"]
                        });

                        selectedRecord = response[3].data;
                        selectedRecord["nmaterialcatcode"] = MaterialCategoryData[0];
                        selectedRecord["nmaterialtypecode"] = MaterialTypeData[0];
                        selectedRecord["nmaterialcode"] = MaterialData[0];

                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                materialType: materialType,
                                materialList: materialList,
                                materialCategoryList: materialCategoryList,
                                selectedRecord: selectedRecord,
                                isOpen: true,
                                operation: operation,
                                screenName: screenName,
                                openChildModal: true,
                                ncontrolCode: ncontrolCode,
                                loading: false,
                            }
                        });
                    } else {
                        toast.warn(intl.formatMessage({
                            id: response[4].data
                        }));
                        dispatch({
                            type: DEFAULT_RETURN,
                            payload: {
                                operation: operation,
                                screenName: screenName,
                                ncontrolCode: ncontrolCode,
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
        else {
            toast.warn(intl.formatMessage({
                                 id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION"
            }));
        }
    }
}
//To get spec details for copy action --ALPD-4099 ,work done by Dhanushya R I
export const getSpecDetailsForCopy = (data, key,isProduct,masterDatas,selectedRecord) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        
          //ALPD-4758 done by Dhanushya RI,to load sample category only for categorybasedflow yes
        rsapi().post("/testgroup/getSpecDetailsForCopy", {
            nproductcode: isProduct==1?data.value:-1, nsampletypecode:masterDatas.selectedNode.nsampletypecode, 
            //ALPD-5527--vignesh R-->Test Group screen -> Profile showing incorrectly for selected sample category.  
           //start
            nproductcatcode:data.item.nproductcatcode,
            //end
            //ALPD-5602--Added by Vignesh R(24-04-2025)-->Test Group screen -> System allowing to copy spec to retired Template version.
            isCopySpec:true,
            nprojectmastercode: masterDatas.selectedNode.nprojectmastercode, ntreeversiontempcode: isProduct === 1 ? masterDatas.selectedNode.nproductcode === data.value && masterDatas.selectedNode.nproductcatcode === data.item.nproductcatcode
                ? masterDatas.selectedNode.ntreeversiontempcode: -1 : masterDatas.selectedNode.nproductcatcode === data.item.nproductcatcode ? masterDatas.selectedNode.ntreeversiontempcode:-1,
        })
            .then(response => {
                sortData(response.data);
                //ALPD-4758 done by Dhanushya RI,to load sample category only for categorybasedflow yes
                let ntreeversiontempcode =isProduct === 1 ? masterDatas.selectedNode.nproductcode === data.value && masterDatas.selectedNode.nproductcatcode === data.item.nproductcatcode
                    ? masterDatas.selectedNode.ntreeversiontempcode : -1 : masterDatas.selectedNode.nproductcatcode === data.item.nproductcatcode ? masterDatas.selectedNode.ntreeversiontempcode : -1
                
                 selectedRecord = { ...selectedRecord,
                    CopyFocusKey: response.data.FocusKey,
                     CopyActiveKey: response.data.ActiveKey,
                     //selectedCopyNodeManipulationCode: response.data.selectedNode.ntemplatemanipulationcode,
                     //selectedCopyProfileName: response.data.selectedNode.sleveldescription,
                    //scopyspecname: response.data.selectedNode.sleveldescription
                    //ALPD-4265 Aravindh 11/06/2024 validate null in selectedNode
                     selectedCopyNodeManipulationCode:response.data.selectedNode===null ? "":response.data.selectedNode.ntemplatemanipulationcode,
                     selectedCopyProfileName: response.data.selectedNode===null ? "":response.data.selectedNode.sleveldescription,
                     scopyspecname: response.data.selectedNode===null ? "":response.data.selectedNode.sleveldescription

                };
                
                let selectedRecordCopy = {
                    nproductcode: data, nproductcatcode: data, ...response.data ,
                    CopyFocusKey: response.data.FocusKey,
                    CopyActiveKey: response.data.ActiveKey,
                    isCopy:true
                };
                let CopyOpenNodes = response.data.OpenNodes;
                         
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        selectedRecord,
                        masterData: { ...masterDatas, selectedRecordCopy, CopyOpenNodes}, 
                        loading: false,
                        testskip: 0,
                        
                    }
                });
            })
            .catch(error => {

                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData:masterDatas,
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


export const getTestGroupTestParameter = (inputParam) => {
    return (dispatch) => {
        rsapi().post("/testgroup/getTestGroupParameter", {
            'userinfo':inputParam.userInfo,'nspecsampletypecode':inputParam.nspecsampletypecode
        })
            .then(response => {
               // sortData(response.data);
                let masterData={...inputParam.masterData, TestGroupParamter:response.data.TestParameter}
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData: {
                           ...masterData
                        }
                        ,openModal:true , loading: false,screenName:inputParam.screenName,ncontrolCode:inputParam.ncontrolCode
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
                } else {
                    toast.warn(error.response.data);
                }
            });
    }
}

