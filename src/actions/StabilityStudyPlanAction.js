import React from 'react';
import rsapi from '../rsapi';
import Axios from 'axios';
import {
    toast
} from 'react-toastify';
import {
    filterRecordBasedOnTwoArrays, sortData,
    rearrangeDateFormat, convertDateTimetoString,
    fillRecordBasedOnCheckBoxSelection, getRecordBasedOnPrimaryKeyName, updatedObjectWithNewElement,
    replaceUpdatedObject, parentChildComboLoad, getSameRecordFromTwoArrays, constructjsonOptionList,
    constructjsonOptionDefault, childComboLoad, filterRecordBasedOnPrimaryKeyName, reArrangeArrays, childComboLoadForEdit, sortDataByParent, sortDataForDate
} from '../components/CommonScript'
import {
    DEFAULT_RETURN,
    UN_AUTHORIZED_ACCESS
} from './LoginTypes';
import { intl } from '../components/App';
import { initRequest } from './LoginAction';
import { //RegistrationSubType, RegistrationType, 
    SampleType,
    checkBoxOperation,
    orderType,
    transactionStatus
} from '../components/Enumeration';
import { crudMaster, postCRUDOrganiseTransSearch } from './ServiceAction'
//import { getTestChildTabDetail } from './index.js'
import { constructOptionList } from '../components/CommonScript';
import {
    Operators,
    TextFilter,
    NumericFilter,
    // BooleanFilter,
    DateFilter,
    // EnumFilter,
    //  EnumFilterProps,
} from "@progress/kendo-react-data-tools";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Utils as QbUtils } from "@react-awesome-query-builder/ui";
import { leftArrowClass } from '@progress/kendo-react-layout';
import { openModal } from './ApprovalConfigAction';
import ModalShow from '../components/ModalShow';

export function addStbTimePoint(masterData, userinfo, columnList,
    selectComponent, childColumnList,
    SubSamplecomboComponents, SubSamplewithoutCombocomponent,
    specBasedComponent, Map, Component, isServiceRequired,
    SubSamplecomboData, selectedRecord, conditionalTestPackage, specBasedTestPackage, LoginProps) {
    if (isServiceRequired) {
        return function (dispatch) {
            dispatch(initRequest(true));
            const urlArray = []
            const timeZoneService = rsapi().post("timezone/getTimeZone");
            urlArray[0] = timeZoneService;
            const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
                parentcolumnlist: columnList ? columnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)) : [],
                childcolumnlist: childColumnList ? childColumnList : [],
                 userinfo: userinfo,
            })
            urlArray[1] = actualService;
            if (specBasedComponent) {
                const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
                    ...Map,
                    specBasedComponent: specBasedComponent, userinfo: userinfo,
                    userinfo
                    //   conditionalTestPackage:true
                })
                urlArray[2] = ComponentTestBySpec;
            } else {
                Component = Component ? Component : []
                const TestGet = rsapi().post("/registration/getTestfromDB", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    nneedsubsample: Map["nneedsubsample"],
                    // nallottedspeccode: objComponent.nallottedspeccode,
                    specBasedComponent: specBasedComponent,
                    conditionalTestPackage: true,
                    specBasedTestPackage: specBasedTestPackage,
                    userinfo: userinfo
                })
                urlArray[2] = TestGet;
                const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    // slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent, userinfo: userinfo,
                    userinfo
                    //   specBasedTestPackage: specBasedTestPackage,
                    //  conditionalTestPackage: conditionalTestPackage
                });
                urlArray[5] = TestPackageGet;

                const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    // slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent, userinfo: userinfo,
                    userinfo
                    //   specBasedTestPackage: specBasedTestPackage,
                    //  conditionalTestPackage: conditionalTestPackage
                });
                urlArray[6] = TestSectionGet;
            }
            const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
                 userinfo: userinfo,
            })
            urlArray[3] = currentDate
            const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                datecolumnlist: SubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
                 userinfo: userinfo,
            })
            urlArray[4] = dateService
            Axios.all(urlArray).then(response => {
                const timeZoneMap = constructOptionList(response[0].data || [], "ntimezonecode", "stimezoneid", undefined, undefined, true);
                const timeZoneList = timeZoneMap.get("OptionList");
                const defaultTimeZone = { label: userinfo.stimezoneid, value: userinfo.ntimezonecode }
                const newcomboData = parentChildComboLoad(columnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)), response[1].data,
                    selectComponent, childColumnList, SubSamplewithoutCombocomponent, undefined, userinfo.slanguagetypecode, userinfo)
                let TestCombined = [];
                let lstComponent = [];
                let PackageData = [];
                let TestSectionData = [];

                const selectedRecord1 = newcomboData.selectedRecord
                if (specBasedComponent) {
                    const lstComponentMap = constructOptionList(response[2].data.lstComponent || [], "ncomponentcode",
                        "scomponentname", undefined, undefined, true);
                    lstComponent = lstComponentMap.get("OptionList");
                    // if (lstComponent.length > 0) {
                    //     selectedRecord1['ncomponentcode'] = { ...lstComponent[0] }
                    //     selectedRecord1["Sample Name"] = selectedRecord1['ncomponentcode'].label;
                    //     selectedRecord1["nspecsampletypecode"] = selectedRecord1['ncomponentcode'].item.nspecsampletypecode;
                    //     selectedRecord1["nneedsubsample"] = Map.nneedsubsample

                    // }
                    //Added by Dhanushya for jira ETICA-22
                    if (lstComponent.length > 0) {
                        if (Map["orderTypeCombCode"] && Map["orderTypeCombCode"] === orderType.EXTERNAL) {
                            selectedRecord1['ncomponentcode'] = { ...lstComponent[0] }
                            selectedRecord1["Sample Name"] = selectedRecord1['ncomponentcode'].label;
                            selectedRecord1["nspecsampletypecode"] = selectedRecord1['ncomponentcode'].item.nspecsampletypecode;
                            selectedRecord1["nneedsubsample"] = Map.nneedsubsample
                        }
                        else {

                            selectedRecord1["nspecsampletypecode"] = selectedRecord1['ncomponentcode'] &&
                                selectedRecord1['ncomponentcode'].item && selectedRecord1['ncomponentcode'].item.nspecsampletypecode;
                            selectedRecord1["nneedsubsample"] = Map.nneedsubsample
                        }

                    }


                } else {
                    const PackageDataMap = constructOptionList(response[5].data.TestPackage || [], "ntestpackagecode",
                        "stestpackagename", undefined, undefined, true);
                    PackageData = PackageDataMap.get("OptionList");
                    const testSectionDataMap = constructOptionList(response[6].data.TestSection || [], "nsectioncode",
                        "ssectionname", undefined, undefined, true);
                    TestSectionData = testSectionDataMap.get("OptionList");
                    TestCombined = response[2].data
                }
                const comboData1 = newcomboData.comboData
                SubSamplewithoutCombocomponent.map(componentrow => {
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
                    ChildscreenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                    screenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                    showSaveContinue: true,
                    openChildModal: false,
                    childoperation: "create",
                    parentPopUpSize: "lg",
                    loading: false,
                    lstComponent,
                    openPortal: true,
                    openModal: false,
                    operation: "create",
                    loadSubSample: true,
                    selectComponent: selectedRecord1,
                    saveContinueData: { ...selectedRecord1 },
                    SubSamplecomboData: comboData1,
                    SubSamplecomboComponents,
                    SubSamplewithoutCombocomponent,
                    TestCombined,
                    parentSubSampleColumnList: columnList,
                    childSubSampleColumnList: childColumnList,
                    timeZoneList,
                    defaultTimeZone,
                    masterData,
                    selectPackage: [],
                    TestPackage: PackageData,
                    TestSection: TestSectionData, selectSection: [], AllTest: TestCombined, AllSection: TestSectionData,
                    userinfo
                }

                //if (specBasedComponent) {
                //Added by Dhanushya for jira ETICA-22
                if (specBasedComponent && selectedRecord1['ncomponentcode'] !== undefined) {

                    dispatch(componentTest(selectedRecord1, false, specBasedComponent, Component, specBasedTestPackage, conditionalTestPackage, inputParam));

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
    } else {
        const newcomboData = parentChildComboLoad(columnList, SubSamplecomboData,
            selectComponent, childColumnList,
            SubSamplewithoutCombocomponent, undefined, userinfo.slanguagetypecode, userinfo)
        return (dispatch) => {
            if (!specBasedComponent) {
                const urlArray = []
                const ComponentTestBySpec = rsapi().post("/registration/getTestfromDB", {
                    nallottedspeccode: Map["nallottedspeccode"],
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    // nneedsubsample: Map["nneedsubsample"],
                    ...Map,
                    // nallottedspeccode: objComponent.nallottedspeccode,
                    specBasedComponent: specBasedComponent,
                    conditionalTestPackage: true,
                    specBasedTestPackage: specBasedTestPackage,
                    userinfo: userinfo
                })
                urlArray[0] = ComponentTestBySpec;
                const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
                     userinfo: userinfo
                })
                urlArray[1] = currentDate;
                const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                    datecolumnlist: SubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
                     userinfo: userinfo
                })
                urlArray[2] = dateService
                const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                    //  nspecsampletypecode: selectedobject.nspecsampletypecode,
                    nallottedspeccode: selectedRecord.nallottedspeccode.item.nallottedspeccode,
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    specBasedTestPackage: specBasedTestPackage,
                    conditionalTestPackage: conditionalTestPackage,
                    userinfo: userinfo
                });
                urlArray[3] = TestPackageGet;

                const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
                    //  nspecsampletypecode: selectedobject.nspecsampletypecode,
                    nallottedspeccode: selectedRecord.nallottedspeccode.item.nallottedspeccode,
                    slno: Component ? Object.keys(Component).length + 1 : 1,
                    specBasedComponent: specBasedComponent,
                    specBasedTestPackage: specBasedTestPackage,
                    conditionalTestPackage: conditionalTestPackage,
                    userinfo: userinfo
                });
                urlArray[4] = TestSectionGet;
                Axios.all(urlArray).then(response => {
                    let TestCombined = []
                    let PackageData = []
                    let TestSectionData = []

                    //  if (!specBasedTestPackage) {
                    TestCombined = response[0].data
                    // } 
                    // else {
                    const PackageDataMap = constructOptionList(response[3].data.TestPackage || [], "ntestpackagecode",
                        "stestpackagename", undefined, undefined, true);
                    PackageData = PackageDataMap.get("OptionList");

                    const TestSectionDataMap = constructOptionList(response[4].data.TestSection || [], "nsectioncode",
                        "ssectionname", undefined, undefined, true);
                    TestSectionData = TestSectionDataMap.get("OptionList");
                    // if (PackageData.length === 0) {
                    //    dispatch(getAllTest(selectComponent, LoginProps, undefined, specBasedComponent, undefined, false, undefined)); 
                    //} 

                    // }
                    const selectedRecord1 = newcomboData.selectedRecord
                    SubSamplewithoutCombocomponent.map(componentrow => {
                        if (componentrow.inputtype === "date") {
                            if (componentrow.loadcurrentdate) {
                                selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[1].data) : "";
                                selectedRecord1[componentrow.label + "value"] = selectedRecord1[componentrow.label];
                            } else if (componentrow.nperiodcode) {
                                selectedRecord1[componentrow.label + "value"] = response[2].data[componentrow.label] ?
                                    new Date(response[2].data[componentrow.label]["datevalue"]) : null;
                                if (componentrow.loadselecteddate) {
                                    selectedRecord1[componentrow.label] = response[2].data[componentrow.label] ?
                                        new Date(response[2].data[componentrow.label]["datevalue"]) : null;
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
                    // if (masterData.RealRegSubTypeValue.nregsubtypecode === 6) {

                    //     let portalOrder = selectedRecord && selectedRecord['Portal Order ID'] || {}
                    //     let containerType = SubSamplecomboData['ContainerType'] || []
                    //     let containerList = []
                    //     const nportalordercode = portalOrder && portalOrder.value ? portalOrder.value : -1
                    //     containerType.map(x => {
                    //         if (x.item.jsondata.nportalordercode === nportalordercode) {
                    //             containerList.push(x)
                    //         }
                    //     })

                    //     SubSamplecomboData['Container Type'] = containerList
                    // }
                    dispatch({
                        type: DEFAULT_RETURN,
                        payload: {
                            ChildscreenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                            screenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                            showSaveContinue: true,
                            openChildModal: false,
                            childoperation: "create",
                            parentPopUpSize: "lg",
                            loading: false,
                            lstComponent: [],
                            openPortal: true,
                            openModal: false,
                            operation: "create",
                            loadSubSample: true,
                            selectComponent: selectedRecord1,
                            saveContinueData: { ...selectedRecord1 },
                            TestCombined: TestCombined,
                            TestPackage: PackageData, TestSection: TestSectionData, selectSection: []
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
                        toast.warn(error.response.data);
                    }
                })
            } else {

                const urlArray = []
                const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
                    ...Map,
                    specBasedComponent: specBasedComponent
                })
                urlArray[0] = ComponentTestBySpec;
                const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
                    userinfo
                })
                urlArray[1] = currentDate;
                const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
                    datecolumnlist: SubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
                    userinfo
                })
                urlArray[2] = dateService
                Axios.all(urlArray).then(response => {

                    const selectedRecord1 = newcomboData.selectedRecord
                    // const lstComponent =  response.data.lstComponent
                    let lstComponent = response[0].data.lstComponent //filterRecordBasedOnTwoArrays(response.data.lstComponent, Component, "ncomponentcode")
                    const lstComponentMap = constructOptionList(lstComponent || [], "ncomponentcode",
                        "scomponentname", undefined, undefined, true);

                    lstComponent = lstComponentMap.get("OptionList");

                    if (lstComponent.length > 0) {
                        // selectedRecord1['ncomponentcode'] = { ...lstComponent[0] }
                        // selectedRecord1["Sample Name"] = selectedRecord1['ncomponentcode'].label;
                        // selectedRecord1["nspecsampletypecode"] = selectedRecord1['ncomponentcode'].item.nspecsampletypecode;
                        // selectedRecord1["nneedsubsample"] = Map.nneedsubsample
                        //Added by Dhanushya for jira ETICA-22
                        if (Map["orderTypeCombCode"] && Map["orderTypeCombCode"] === orderType.EXTERNAL) {
                            selectedRecord1['ncomponentcode'] = { ...lstComponent[0] }
                            selectedRecord1["Sample Name"] = selectedRecord1['ncomponentcode'].label;
                            selectedRecord1["nspecsampletypecode"] = lstComponent[0].item.nspecsampletypecode;
                            selectedRecord1["nneedsubsample"] = Map.nneedsubsample
                        }
                        else {
                            selectedRecord1["nspecsampletypecode"] = lstComponent[0].item.nspecsampletypecode;
                            selectedRecord1["nneedsubsample"] = Map.nneedsubsample
                        }

                    }

                    SubSamplewithoutCombocomponent.map(componentrow => {
                        if (componentrow.inputtype === "date") {
                            if (componentrow.loadcurrentdate) {
                                selectedRecord1[componentrow.label] = componentrow.loadcurrentdate ? rearrangeDateFormat(userinfo, response[1].data) : "";
                                selectedRecord1[componentrow.label + "value"] = selectedRecord1[componentrow.label];
                            } else if (componentrow.nperiodcode) {
                                selectedRecord1[componentrow.label + "value"] = response[2].data[componentrow.label] ?
                                    new Date(response[2].data[componentrow.label]["datevalue"]) : null;
                                if (componentrow.loadselecteddate) {
                                    selectedRecord1[componentrow.label] = response[2].data[componentrow.label] ?
                                        new Date(response[2].data[componentrow.label]["datevalue"]) : null;
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
                        ChildscreenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                        screenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                        showSaveContinue: true,
                        openChildModal: false,
                        childoperation: "create",
                        parentPopUpSize: "lg",
                        loading: false,
                        lstComponent,
                        openPortal: true,
                        openModal: false,
                        operation: "create",
                        loadSubSample: true,
                        selectComponent: selectedRecord1,
                        saveContinueData: { ...selectedRecord1 },
                        TestCombined: [],
                        selectedStbTimePointTestData: [],
                        selectPackage: [], selectSection: [],
                        userinfo
                    }
                    if (specBasedComponent) {
                        dispatch(componentTest(selectedRecord1, false, specBasedComponent, Component, specBasedTestPackage, conditionalTestPackage, inputParam));

                    } else {
                        dispatch({ type: DEFAULT_RETURN, payload: { ...inputParam } })
                    }
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
                        toast.warn(error.response.data);
                    }
                })
            }
        }
    }

}

export function componentTest(selectedobject, Reg, specBasedComponent, Component, specBasedTestPackage, conditionalTestPackage, inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        const urlArray = []
        Component = Component ? Component : []
        const TestGet = rsapi().post("/registration/getTestfromDB", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            nneedsubsample: selectedobject.nneedsubsample,
            userinfo:inputParam.userinfo
        });
        urlArray[0] = TestGet;
        const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
            nspecsampletypecode: selectedobject.nspecsampletypecode,
            slno: Component ? Object.keys(Component).length + 1 : 1,
            specBasedComponent: specBasedComponent,
            specBasedTestPackage: specBasedTestPackage,
            conditionalTestPackage: conditionalTestPackage,
            userinfo:inputParam.userinfo
        });
        urlArray[1] = TestPackageGet;

        const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
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
                    ...inputParam, TestCombined: TestData, AllTest: TestData, TestPackage: PackageData, ...Map, loading: false, selectedStbTimePointTestData: [],
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


export function insertStbStudyPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/stabilitystudyplan/createRegistrationWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/stabilitystudyplan/createStabilityStudyPlan", inputParam.inputData)
        }
        return requestUrl
            //  rsapi().post("/registration/createRegistration", inputParam.formData)
            .then(response => {
                if (response.data.rtn === "Success") {
                    // if (response.data["isPortalData"] && response.data["PortalStatus"] && response.data["PortalStatus"].length > 0) {
                    //     dispatch(UpdateExternalOrderStatus(response.data["PortalStatus"], inputParam));
                    // }

                    let StabilityStudyPlanGet = updatedObjectWithNewElements(response.data["selectedStabilityStudyPlan"], masterData.StabilityStudyPlanGet, 'Sample');
                    let selectedStabilityStudyPlan = response.data["selectedStabilityStudyPlan"];
                    let StbTimePointGet = response.data["StbTimePointGet"];
                    let StbTimePointTestGet = response.data["StbTimePointTestGet"];
                    let selectedStbTimePoint = StbTimePointGet;
                    StbTimePointTestGet = sortData(StbTimePointTestGet, "nstbstudyplancode", "desc");
                    let selectedStbTimePointTest = StbTimePointTestGet.length > 0 ? [StbTimePointTestGet[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        StbTimePointGet = sortData(response.data["StbTimePointGet"], 'nstbstudyplancode', 'desc')
                        selectedStbTimePoint = StbTimePointGet.length > 0 ? [StbTimePointGet[0]] : [];
                        StbTimePointTestGet = StbTimePointTestGet.filter(x => x.nstbtimepointcode === selectedStbTimePoint[0].nstbtimepointcode)
                        selectedStbTimePointTest = StbTimePointTestGet.length > 0 ? response.data["selectedStbTimePointTest"] : [];
                    }
                    if (inputParam.multipleselectionFlag) {
                        selectedStabilityStudyPlan = updatedObjectWithNewElements(response.data["selectedStabilityStudyPlan"], masterData.selectedStabilityStudyPlan);
                        updatedObjectWithNewElements(response.data["selectedStbTimePoint"], masterData.StbTimePointGet);
                        updatedObjectWithNewElements(response.data["selectedStbTimePointTest"], masterData.StbTimePointTestGet);
                        StbTimePointGet = masterData.StbTimePointGet;
                        StbTimePointTestGet = masterData.StbTimePointTestGet;
                    }

                    masterData = {
                        ...masterData, ...response.data,
                        selectedStabilityStudyPlan, selectedStbTimePoint, selectedStbTimePointTest,
                        StbTimePointGet, StbTimePointTestGet, StabilityStudyPlanGet,
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
                        selectedStbTimePointTest: {},
                        selectedComponent: {},
                        Component: [],
                        selectedRecord: {},
                        selectedStbTimePointTest: [],
                        Test: [],
                        selectedComponent: {},
                        subSampleDataGridList: [],
                        preregConfirmMessage: undefined,
                        regSampleExisted, loadImportFileData: false, loadImportSampleCountData: false,
                        skip: 0,
                        subsampleskip: 0,
                        testskip: 0,
                        isDynamicViewSlideOut: false,
                        // filterColumnActive:false,
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
              //  console.log(error);
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
                        toast.error(error.message);
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


export function updatedObjectWithNewElements(oldList, newList, name) {
    let newlistItem = newList;
    if (name === 'Sample') {
        newlistItem.map((item, index) => {
            if (oldList[0].nstbstudyplancode === item.nstbstudyplancode) {
                newlistItem.splice(index, 1)
                // [newFirstElement].concat(array)
            }
        })
        newlistItem.unshift(oldList[0]);
        oldList = [...newlistItem];
    } else if (name === 'Test') {

    } else {
        oldList = [...newlistItem, ...oldList];
    }
    return oldList;
}


export function insertExportStbStudyPlan(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/importStabilityStudyPlan", inputParam.formData)
            .then(response => {
                if (response.data.rtn === "Success") {

                    let registrationList = [...response.data["StabilityStudyPlanGet"], ...masterData.StabilityStudyPlanGet]
                    let StabilityStudyPlanGet = registrationList;
                    let selectedStabilityStudyPlan = response.data["selectedStabilityStudyPlan"];
                    let StbTimePointGet = response.data["StbTimePointGet"];
                    let StbTimePointTestGet = response.data["StbTimePointTestGet"];
                    let selectedStbTimePoint = StbTimePointGet;
                    StbTimePointTestGet = sortData(StbTimePointTestGet, "nstbstudyplancode", "desc");
                    let selectedStbTimePointTest = StbTimePointTestGet.length > 0 ? [StbTimePointTestGet[0]] : [];
                    let regSampleExisted = inputParam.inputData && inputParam.inputData.orderTypeValue === 2 ? true : false;
                    if (inputParam.inputData.nneedsubsample) {
                        StbTimePointGet = sortData(response.data["StbTimePointGet"], 'nstbstudyplancode', 'desc')
                        selectedStbTimePoint = StbTimePointGet.length > 0 ? [StbTimePointGet[0]] : [];
                        StbTimePointTestGet = StbTimePointTestGet.filter(x => x.nstbtimepointcode === selectedStbTimePoint[0].nstbtimepointcode)
                        selectedStbTimePointTest = StbTimePointTestGet.length > 0 ? response.data["selectedStbTimePointTest"] : [];
                    }
                    if (inputParam.multipleselectionFlag) {
                        selectedStabilityStudyPlan = updatedObjectWithNewElements(response.data["selectedStabilityStudyPlan"], masterData.selectedStabilityStudyPlan);
                        updatedObjectWithNewElements(response.data["selectedStbTimePoint"], masterData.StbTimePointGet);
                        updatedObjectWithNewElements(response.data["selectedStbTimePointTest"], masterData.StbTimePointTestGet);
                        StbTimePointGet = masterData.StbTimePointGet;
                        StbTimePointTestGet = masterData.StbTimePointTestGet;
                    }


                    masterData = {
                        ...masterData, ...response.data,
                        selectedStabilityStudyPlan, selectedStbTimePoint, selectedStbTimePointTest,
                        StbTimePointGet, StbTimePointTestGet, StabilityStudyPlanGet
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
                        selectedStbTimePointTest: {},
                        selectedComponent: {},
                        Component: [],
                        selectedRecord: {},
                        selectedStbTimePointTest: [],
                        Test: [],
                        selectedComponent: {},
                        subSampleDataGridList: [],
                        preregConfirmMessage: undefined,
                        regSampleExisted, loadImportFileData: false, loadImportSampleCountData: false
                    }
                    inputParam.postParamList[0]['clearFilter'] = 'yes';
                    inputParam.postParamList[1]['clearFilter'] = 'yes';
                    inputParam.postParamList[2]['clearFilter'] = 'yes';
                    dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                } else {
                    toast.info(response.data.rtn);
                    dispatch({
                        type: DEFAULT_RETURN, payload: {
                            loading: false,
                            openModal: false,
                            loadEsign: false,
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

export const addMoreTests = (inputParam, ncontrolCode) => {
    return (dispatch) => {
        let { sampleList } = inputParam;
        let value = false;
        if (inputParam.selectedStabilityStudyPlan && inputParam.selectedStabilityStudyPlan.length > 0) {
            if (inputParam.selectedStbTimePoint && inputParam.selectedStbTimePoint.length > 0) {
                value = inputParam.selectedStbTimePoint.some(obj => obj.nspecsampletypecode !== inputParam.selectedStbTimePoint[0].nspecsampletypecode)
                if (value) {
                    return toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESPECANDCOMPONENT" }));
                }
                const selectedStabilityStudyPlan = inputParam.selectedStabilityStudyPlan;
                const findTransactionStatus = [...new Set(selectedStabilityStudyPlan.map(item => item.ntransactionstatus))];
                if (findTransactionStatus.length === 1) {
                    if (findTransactionStatus[0] !== transactionStatus.REJECT && findTransactionStatus[0] !== transactionStatus.CANCELLED) {
                        if (findTransactionStatus[0] !== transactionStatus.RELEASED) {
                            const findApprovalVersion = [...new Set(selectedStabilityStudyPlan.map(item => item.napprovalversioncode))];
                            if (findApprovalVersion.length === 1) {
                                const findSampleSpec = [...new Set(selectedStabilityStudyPlan.map(item => item.nallottedspeccode))];
                                //const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                                if (findSampleSpec.length === 1)//&& findComponent.length === 1 
                                {
                                    inputParam["snspecsampletypecode"] = inputParam.selectedStbTimePoint &&
                                        [...new Set(inputParam.selectedStbTimePoint.map(x => x.nspecsampletypecode))].join(",")
                                    dispatch(initRequest(true));
                                    const urlArray = []
                                    const TestGet = rsapi().post("/registration/getMoreTest", {
                                        ...inputParam
                                    });
                                    urlArray[0] = TestGet;
                                    const TestPackageGet = rsapi().post("/registration/getMoreTestPackage", {
                                        ...inputParam
                                    });
                                    urlArray[1] = TestPackageGet;

                                    const TestSectionGet = rsapi().post("/registration/getMoreTestSection", {
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
                        }
                        else {
                            toast.info(intl.formatMessage({ id: "IDS_TESTCANNOTBEFORRELEASEDSAMPLES" }));
                        }
                    }
                    else {
                        toast.info(intl.formatMessage({ id: "IDS_SAMPLEISREJECTEDORCANCELLED" }));
                    }
                } else {
                    toast.info(intl.formatMessage({ id: "IDS_PLEASESELECTSAMPLEWITHSAMESTATUS" }));
                }
            } else {
                toast.info(intl.formatMessage({ id: "IDS_SELECTSUBSAMPLE" }));
            }
        } else {
            toast.info(intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));
        }
    }


}


export function addSubTimePoint(masterData, userinfo, regcolumnList,
    selectRecord, regchildColumnList,
    regSubSamplecomboComponents,
    regSubSamplewithoutCombocomponent, Map, ncontrolcode, specBasedComponent, specBasedTestPackage) {
    return function (dispatch) {
        const urlArray = []
        const timeZoneService = rsapi().post("timezone/getTimeZone");
        urlArray[0] = timeZoneService;
        const actualService = rsapi().post("dynamicpreregdesign/getComboValues", {
            parentcolumnlist: regcolumnList.filter(x => (x.inputtype !== 'backendsearchfilter' && x.inputtype !== 'frontendsearchfilter') && (x.readonly !== true)),
            childcolumnlist: regchildColumnList,
            userinfo:userinfo
        })
        urlArray[1] = actualService;

        if (specBasedComponent) {
            const ComponentTestBySpec = rsapi().post("/registration/getComponentBySpec", {
                ...Map,
                specBasedComponent: specBasedComponent,
                userinfo:userinfo
            })
            urlArray[2] = ComponentTestBySpec;
        } else {

            const TestGet = rsapi().post("/registration/getTestfromDB", {
                nallottedspeccode: Map["nallottedspeccode"],
                slno: 1,
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,
                conditionalTestPackage: true,
                nneedsubsample: Map["nneedsubsample"],
                userinfo:userinfo

            })
            urlArray[2] = TestGet;
            const TestPackageGet = rsapi().post("/registration/getTestfromTestPackage", {
                nallottedspeccode: Map["nallottedspeccode"],
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,userinfo:userinfo
            });
            urlArray[5] = TestPackageGet;
            const TestSectionGet = rsapi().post("/registration/getTestfromSection", {
                nallottedspeccode: Map["nallottedspeccode"],
                specBasedComponent: specBasedComponent,
                specBasedTestPackage: specBasedTestPackage,userinfo:userinfo
            });
            urlArray[6] = TestSectionGet;

        }
        const currentDate = rsapi().post("timezone/getLocalTimeByZone", {
            userinfo:userinfo
        })

        urlArray[3] = currentDate

        const dateService = rsapi().post("dynamicpreregdesign/dateValidation", {
            datecolumnlist: regSubSamplewithoutCombocomponent.filter(x => x.inputtype === "date"),
            userinfo:userinfo
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
                    screenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
                    showSaveContinue: false,
                    parentPopUpSize: "lg",
                    loading: false,
                    lstComponent,
                    openModal: true,
                    loadPrinter: false,
                    operation: "create",
                    loadRegSubSample: true,
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
                if (specBasedComponent && selectedRecord1['ncomponentcode'] !== undefined) {

                    dispatch(componentTest(selectedRecord1, true, specBasedComponent, [], specBasedTestPackage, true, inputParam))
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


export function saveTimePoint(inputParam) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/stabilitystudyplan/createSubSampleWithFile", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/stabilitystudyplan/createTimePoint", inputParam.inputData);
        }
        return requestUrl
            //  rsapi().post("/registration/createSubSample", inputParam.inputData)
            .then(response => {
                // let StabilityStudyPlanGet = updatedObjectWithNewElement(response.data["selectedStabilityStudyPlan"], inputParam.inputData.masterData.StabilityStudyPlanGet);
                // let selectedStabilityStudyPlan = response.data["selectedStabilityStudyPlan"];
                let StbTimePointGet = updatedObjectWithNewElement(inputParam.inputData.masterData.StbTimePointGet, response.data["selectedStbTimePoint"]);
                let StbTimePointTestGet = response.data["StbTimePointTestGet"];
                let selectedStbTimePoint = response.data["selectedStbTimePoint"];// StbTimePointGet.length > 0 ? [StbTimePointGet[0]] : [];
                StbTimePointTestGet = sortData(StbTimePointTestGet, "nstbstudyplancode", "desc");
                let selectedStbTimePointTest = StbTimePointTestGet.length > 0 ? [StbTimePointTestGet[0]] : [];
                let StbTimePointTestParameter = response.data["StbTimePointTestParameter"];
                StbTimePointTestParameter = StbTimePointTestParameter ? getSameRecordFromTwoArrays(StbTimePointTestParameter, selectedStbTimePointTest, 'nstbtimepointtestcode') : StbTimePointTestParameter;
                let StabilityStudyPlanGet = replaceUpdatedObject(response.data["selectedStabilityStudyPlan"], inputParam.inputData.masterData.StabilityStudyPlanGet, 'nstbstudyplancode');
                let selectedStabilityStudyPlan = response.data["selectedStabilityStudyPlan"];



                let masterData = { ...inputParam.inputData.masterData }
                masterData = {
                    ...masterData, ...response.data,
                    selectedStbTimePoint, selectedStbTimePointTest,
                    StbTimePointGet, StbTimePointTestGet, StbTimePointTestParameter, selectedStabilityStudyPlan, StabilityStudyPlanGet
                }
                let respObject = {
                    masterData,
                    openModal: false,
                    loadEsign: false,
                    loading: false,
                    showSample: undefined,
                    selectedRecord: {},
                    loadRegSubSample: false,
                    showConfirmAlert: false,
                    subSampleConfirmMessage: undefined
                }
                inputParam.postParamList[0]['clearFilter'] = 'no';
                inputParam.postParamList[1]['clearFilter'] = 'yes';
                inputParam.postParamList[2]['clearFilter'] = 'yes';
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                //    dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: {
                //         masterData,
                //         openModal: false,
                //         loadEsign: false,
                //         loading: false,
                //         showSample: undefined,
                //         selectedRecord: {},
                //         loadRegSubSample:false
                //     }
                // });
            })
            .catch(error => {
                // console.log(error);
                // toast.error(error.message);
                // dispatch({ type: DEFAULT_RETURN, payload: { loading: false, showConfirmAlert: false } })
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


export const createRegTest = (inputParam, masterData, modalName) => {
    return (dispatch) => {
        dispatch(initRequest(true));
        rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData })
            .then(response => {
                let StbTimePointTestGet = updatedObjectWithNewElements(masterData["StbTimePointTestGet"], response.data["StbTimePointTestGet"]);

                masterData = {
                    ...masterData,
                    StbTimePointTestGet: sortData(StbTimePointTestGet, "descending", "nstbtimepointtestcode"),
                    StbTimePointGet: sortData(masterData["StbTimePointGet"], "descending", "nstbtimepointcode"),
                    selectedStbTimePointTest: response.data["selectedStbTimePointTest"],
                    //  selectedStbTimePoint: response.data["StbTimePointGet"],
                    selectedStbTimePoint: response.data["selectedStbTimePoint"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    StabilityStudyPlanGet: replaceUpdatedObject(response.data.selectedStabilityStudyPlan, masterData.StabilityStudyPlanGet, 'nstbstudyplancode')
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

export function ReloadData(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("stabilitystudyplan/getStabilityStudyPlanByFilterSubmit", { ...inputData.inputData })
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

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        subsampletake: undefined,
                        subsampleskip: 0,
                        showSample: undefined, regSampleExisted: false,
                        activeTabIndex:  false,
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


export function getStabilityStudyPlanByFilterSubmit(inputData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("stabilitystudyplan/getStabilityStudyPlanByFilterSubmit", { ...inputData.inputData })
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

                sortData(masterData);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        subsampletake: undefined,
                        subsampleskip: 0,
                        showSample: undefined, regSampleExisted: false,
                        activeTabIndex:  false,
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

export function getTimePointDetail(inputData, isServiceRequired, isParentValue) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode || -1,
            nregsubtypecode: inputData.nregsubtypecode || -1,
            nstbstudyplancode: inputData.nstbstudyplancode,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode || -1,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedsubsample: inputData.nneedsubsample,
            selectedPreregno: inputData.selectedStabilityStudyPlan && inputData.selectedStabilityStudyPlan.length > 0 ? inputData.selectedStabilityStudyPlan.map(item => item.nstbstudyplancode).join(",") : null,
            selectedTransactionsamplecode: inputData.selectedStabilityStudyPlan && inputData.selectedStabilityStudyPlan.length > 1
                && inputData.masterData.selectedStbTimePoint ? inputData.masterData.selectedStbTimePoint.map(item => item.nstbtimepointcode).join(",") : null,
        }
        let activeName = "";
        let dataStateName = "";
        const subSample = inputData.nneedsubsample
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("stabilitystudyplan/getRegistrationSubSample", inputParamData)
                .then(response => {
                    sortData(response.data, "descending", "nstbstudyplancode");
                    response.data['StbTimePointGet'] = sortDataByParent(response.data['StbTimePointGet'], inputData.sample, "nstbstudyplancode");

                    let masterData = {}
                    let skipInfo = {}
                    let oldSelectedTest = inputData.masterData.selectedStbTimePointTest || []
                    if (subSample) {
                        let oldselectedStbTimePoint = inputData.masterData.selectedStbTimePoint
                        fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                            inputData.childTabsKey, inputData.checkBoxOperation, "nstbstudyplancode",
                            inputData.removeElementFromArray);
                        masterData = {
                            ...inputData.masterData,
                            selectedStabilityStudyPlan: inputData.selectedStabilityStudyPlan,
                            selectedPreregno: inputData.nstbstudyplancode,
                            selectedStbTimePoint: inputData.masterData.StbTimePointGet.length > 0 ?
                                [inputData.masterData.StbTimePointGet[0]] : [],
                        }

                        masterData = {
                            ...masterData,
                            selectedStbTimePointTest: masterData.StbTimePointTestGet.length > 0 ? [masterData.StbTimePointTestGet[0]] : []
                        }



                        let { testskip, testtake, subsampleskip, subsampletake } = inputData
                        testskip = 0;
                        subsampleskip = 0;
                        skipInfo = { testskip, testtake, subsampleskip, subsampletake }
                    }

                    if (inputData.masterData.selectedStabilityStudyPlan && inputData.sampleGridDataState
                        && inputData.masterData.selectedStabilityStudyPlan.length <= inputData.sampleGridDataState.skip) {
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
                            activeTabIndex:  false,
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
        // else {
        //     let bool = false;
        //     let skipInfo = {};
        //     let { testskip, testtake, subsampletake, subsampleskip } = inputData;
        //     let oldSelectedTest = inputData.masterData.selectedStbTimePointTest
        //     let oldselectedStbTimePoint = inputData.masterData.selectedStbTimePoint
        //     // let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePointTest, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //     let isGrandChildGetRequired = false;
        //     let TestSelected = [];
        //     let subSampleSelected = [];


        //     if (inputData["statusNone"]) {
        //         TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePointTest, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //         subSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePoint, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //     }
        //     else {
        //         TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePointTest, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //         subSampleSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePoint, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //     }

        //     if (TestSelected.length > 0) {
        //         isGrandChildGetRequired = false;
        //     } else {
        //         isGrandChildGetRequired = true;
        //     }
        //     fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedStabilityStudyPlan, inputData.childTabsKey, inputData.checkBoxOperation, "nstbstudyplancode", inputData.removeElementFromArray);
        //     if (isGrandChildGetRequired) {
        //         let selectedStabilityStudyPlan = inputData.selectedStabilityStudyPlan;
        //         let filterTestSameOldSelectedTest = getSameRecordFromTwoArrays(oldSelectedTest, inputData.masterData.StbTimePointTestGet, "nstbtimepointtestcode");
        //         let selectedStbTimePointTest = filterTestSameOldSelectedTest.length > 0 ? filterTestSameOldSelectedTest :
        //             inputData.masterData.StbTimePointTestGet.length > 0 ? [inputData.masterData.StbTimePointTestGet[0]] : [];
        //         let nstbtimepointtestcode = selectedStbTimePointTest.length > 0 ? selectedStbTimePointTest.map(x => x.nstbtimepointtestcode).join(",") : "-1";
        //         let selectedStbTimePoint = inputData.masterData.StbTimePointGet

        //         if (subSample) {
        //             let filterselectedStbTimePoint = getSameRecordFromTwoArrays(oldselectedStbTimePoint, inputData.masterData.StbTimePointGet, "nstbtimepointcode");
        //             selectedStbTimePoint = filterselectedStbTimePoint.length > 0 ? filterselectedStbTimePoint : [inputData.masterData.StbTimePointGet[0]];
        //             if (inputData.masterData.StbTimePointGet.length <= inputData.subsampleskip) {
        //                 subsampleskip = 0;
        //                 skipInfo = { subsampletake, subsampleskip }
        //             }

        //         }
        //         // START ALPD-3671 VISHAKH
        //         let masterData = { ...inputData.masterData, selectedStabilityStudyPlan, selectedStbTimePoint, selectedStbTimePointTest }
        //         if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
        //             inputData.searchSubSampleRef.current.value = "";
        //             masterData['searchedSubSample'] = undefined
        //         }
        //         if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
        //             inputData.searchTestRef.current.value = ""
        //             masterData['searchedTest'] = undefined
        //         }
        //         // END ALPD-3671 VISHAKH
        //         if (inputData.masterData.StbTimePointTestGet.length <= inputData.testskip) {
        //             testskip = 0;
        //             bool = true
        //         }
        //         if (bool) {
        //             skipInfo = { ...skipInfo, testskip, testtake }
        //         }
        //         // inputData = {
        //         //     ...inputData, childTabsKey: ["RegistrationTestComment", "RegistrationParameter"], nstbtimepointtestcode, masterData, selectedStbTimePointTest,
        //         //     selectedStbTimePoint, checkBoxOperation: 3, skipInfo, masterData
        //         // }
        //         inputData = {
        //             ...inputData, childTabsKey: ["RegistrationTestComment", "RegistrationParameter", "RegistrationTestAttachment"], nstbtimepointtestcode, masterData, selectedStbTimePointTest,
        //             selectedStbTimePoint, checkBoxOperation: checkBoxOperation.SINGLESELECT, skipInfo, masterData
        //         }
        //         if (subSample) {
        //             if (selectedStbTimePointTest.length === 0) {
        //                 inputData["nstbstudyplancode"] = selectedStbTimePoint.map(x => x.nstbstudyplancode).join(",")
        //                 inputData["nstbtimepointcode"] = selectedStbTimePoint.map(x => x.nstbtimepointcode).join(",")
        //                 // inputData["checkBoxOperation"] = 3
        //                 inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
        //                 inputData["childTabsKey"] = ["StbTimePointTestGet"]
        //               //  dispatch(getRegistrationTestDetail(inputData, true));
        //             } else {
        //                 //dispatch(getTestChildTabDetailRegistration(inputData, true));
        //             }
        //         } else {
        //             //dispatch(getTestChildTabDetailRegistration(inputData, true));
        //         }
        //     }
        //     else {
        //         let masterData = {
        //             ...inputData.masterData,
        //             selectedStabilityStudyPlan: inputData.selectedStabilityStudyPlan,
        //             selectedPreregno: inputData.nstbstudyplancode,
        //             selectedStbTimePointTest: TestSelected ? TestSelected : inputData.masterData.StbTimePointTestGet.length > 0 ? [inputData.masterData.StbTimePointTestGet[0]] : [],
        //             // RegistrationTestComment,
        //             selectedStbTimePoint: subSampleSelected ? subSampleSelected : inputData.masterData.StbTimePointGet
        //         }
        //         // START ALPD-3671 VISHAKH
        //         if (inputData.searchSubSampleRef !== undefined && inputData.searchSubSampleRef.current !== null) {
        //             inputData.searchSubSampleRef.current.value = "";
        //             masterData['searchedSubSample'] = undefined
        //         }
        //         if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
        //             inputData.searchTestRef.current.value = ""
        //             masterData['searchedTest'] = undefined
        //         }
        //         // END ALPD-3671 VISHAKH
        //         let subsamplecheck = true;
        //         if (subSample) {
        //             let SubSampleSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePoint, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
        //             if (SubSampleSelected.length > 0) {
        //                 let filterselectedStbTimePoint = getSameRecordFromTwoArrays(oldselectedStbTimePoint, inputData.masterData.StbTimePointGet, "nstbtimepointcode");
        //                 if (filterselectedStbTimePoint.length === 0) {
        //                     let wholeSubSample = masterData.StbTimePointGet.map(b => b.nstbtimepointcode)
        //                     // START ALPD-3625 VISHAKH
        //                     // oldselectedStbTimePoint.forEach((test, index) => {
        //                     //     if (!wholeSubSample.includes(test.nstbtimepointcode)) {
        //                     //         oldselectedStbTimePoint.splice(index, 1)
        //                     //     }
        //                     //     return null;
        //                     // })
        //                     oldselectedStbTimePoint = oldselectedStbTimePoint.filter(item =>
        //                         wholeSubSample.includes(item.nstbtimepointcode)
        //                     );
        //                     // END ALPD-3625 VISHAKH
        //                     if (oldselectedStbTimePoint.length === 0 && wholeSubSample.length > 0
        //                         && masterData.selectedStbTimePointTest.length === 0) {
        //                         const selectedStbTimePoint1 = [inputData.masterData.StbTimePointGet[0]];
        //                         masterData = {
        //                             ...masterData,
        //                             selectedStbTimePoint: selectedStbTimePoint1,
        //                             selectedStbTimePointTest: []
        //                         }
        //                         inputData = { ...inputData, ...masterData }
        //                         inputData["nstbstudyplancode"] = selectedStbTimePoint1.map(x => x.nstbstudyplancode).join(",")
        //                         inputData["nstbtimepointcode"] = selectedStbTimePoint1.map(x => x.nstbtimepointcode).join(",")
        //                         // inputData["checkBoxOperation"] = 3
        //                         inputData["checkBoxOperation"] = checkBoxOperation.SINGLESELECT
        //                         inputData["childTabsKey"] = ["StbTimePointTestGet"]
        //                         subsamplecheck = false;
        //                         //dispatch(getRegistrationTestDetail(inputData, true));

        //                     }
        //                 } else {
        //                     oldselectedStbTimePoint = filterselectedStbTimePoint
        //                 }

        //             } else {
        //                 let wholeSubSample = masterData.StbTimePointGet.map(b => b.nstbtimepointcode)
        //                 // START ALPD-3625 VISHAKH
        //                 // oldselectedStbTimePoint.forEach((test, index) => {
        //                 //     if (!wholeSubSample.includes(test.nstbtimepointcode)) {
        //                 //         oldselectedStbTimePoint.splice(index, 1)
        //                 //     }
        //                 //     return null;
        //                 // })
        //                 oldselectedStbTimePoint = oldselectedStbTimePoint.filter(item =>
        //                     wholeSubSample.includes(item.nstbtimepointcode)
        //                 );
        //                 // END ALPD-3625 VISHAKH
        //             }

        //             if (subsamplecheck) {
        //                 masterData = {
        //                     ...masterData,
        //                     selectedStbTimePoint: oldselectedStbTimePoint
        //                 }
        //             }
        //             if (inputData.masterData.StbTimePointGet.length <= inputData.subsampleskip) {
        //                 subsampleskip = 0;
        //                 skipInfo = { subsampleskip, subsampletake }
        //             }
        //         }
        //         let wholeTestList = masterData.StbTimePointTestGet.map(b => b.nstbtimepointtestcode)
        //         // START ALPD-3625 VISHAKH
        //         // oldSelectedTest.forEach((test, index) => {
        //         //     if (!wholeTestList.includes(test.nstbtimepointtestcode)) {
        //         //         oldSelectedTest.splice(index, 1)
        //         //     }
        //         //     return null;
        //         // })
        //         oldSelectedTest = oldSelectedTest.filter(item =>
        //             wholeTestList.includes(item.nstbtimepointtestcode)
        //         );
        //         // END ALPD-3625 VISHAKH
        //         let keepOld = false;
        //         let nstbtimepointtestcode;
        //         if (oldSelectedTest.length > 0) {
        //             keepOld = true
        //             masterData = {
        //                 ...masterData,
        //                 selectedStbTimePointTest: oldSelectedTest
        //             }
        //         } else {
        //             nstbtimepointtestcode = inputData.masterData.StbTimePointTestGet.length > 0 ? inputData.masterData.StbTimePointTestGet[0].nstbtimepointtestcode : "-1"
        //         }
        //         masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, nstbtimepointtestcode, "nstbtimepointtestcode")
        //         masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter : getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, nstbtimepointtestcode, "nstbtimepointtestcode")
        //         let skipInfo = {};
        //         if (inputData.masterData.StbTimePointTestGet.length <= inputData.testskip) {
        //             testskip = 0;
        //             bool = true
        //         }
        //         if (bool) {
        //             skipInfo = { ...skipInfo, testskip, testtake }
        //         }

        //         let dataStateArray = [
        //             { activeName: 'selectedStabilityStudyPlan', dataStateName: 'sampleGridDataState' },
        //             { activeName: 'RegistrationSourceCountry', dataStateName: 'sourceDataState' },
        //             { activeName: 'RegistrationTestComment', dataStateName: 'testCommentDataState' },
        //             { activeName: 'RegistrationParameter', dataStateName: 'resultDataState' },
        //         ]
        //         dataStateArray.map(arr => {
        //             if (inputData[arr.dataStateName] && masterData[arr.activeName] &&
        //                 masterData[arr.activeName].length <= inputData[arr.dataStateName].skip) {
        //                 skipInfo = {
        //                     ...skipInfo,
        //                     [arr.dataStateName]: {
        //                         ...inputData[arr.dataStateName],
        //                         skip: 0,
        //                         sort: undefined,
        //                         filter: undefined
        //                     }
        //                 }
        //             } else {
        //                 skipInfo = {
        //                     ...skipInfo,
        //                     [arr.dataStateName]: {
        //                         ...inputData[arr.dataStateName],
        //                         sort: undefined,
        //                         filter: undefined
        //                     }
        //                 }
        //             }
        //             return null;
        //         });
        //         dispatch({
        //             type: DEFAULT_RETURN, payload: {
        //                 masterData,
        //                 loading: false,
        //                 showFilter: false,
        //                 activeSampleTab: inputData.activeSampleTab,
        //                 activeTestTab: inputData.activeTestTab,
        //                 ...skipInfo,
        //                 // activeTabIndex: inputData.activeTabIndex
        //             }
        //         })
        //     }

        // }

    }
}

export function getTimePointTestDetail(inputData, isServiceRequired) {
    return function (dispatch) {
        let inputParamData = {
            nsampletypecode: inputData.nsampletypecode,
            nregtypecode: inputData.nregtypecode,
            nregsubtypecode: inputData.nregsubtypecode,
            nstbstudyplancode: inputData.nstbstudyplancode,
            nstbtimepointcode: inputData.nstbtimepointcode,
            ntransactionstatus: inputData.ntransactionstatus,
            napprovalconfigcode: inputData.napprovalconfigcode,
            userinfo: inputData.userinfo,
            ndesigntemplatemappingcode: inputData.ndesigntemplatemappingcode,
            nneedsubsample: inputData.nneedsubsample,
            selectedTransactionsamplecode: inputData.selectedStbTimePoint && inputData.selectedStbTimePoint.length > 0 && inputData.selectedStbTimePoint.map(item => item.nstbtimepointcode).join(","),
        }
        const subSample = inputData.nneedsubsample;
        let activeName = "";
        let dataStateName = "";
        dispatch(initRequest(true));
        if (isServiceRequired) {
            rsapi().post("stabilitystudyplan/getRegistrationTest", inputParamData)
                .then(response => {
                    sortData(response.data, 'descending', 'nstbstudyplancode')
                    let oldSelectedTest = inputData.masterData.selectedStbTimePointTest || []
                    let oldselectedStbTimePoint = inputData.masterData.selectedStbTimePoint || []
                    let outsourceDetailsList = response.data && response.data.OutsourceDetailsList;
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, response.data,
                        inputData.childTabsKey, inputData.checkBoxOperation, "nstbtimepointcode",
                        inputData.removeElementFromArray);
                    let masterData = {
                        ...inputData.masterData,
                        selectedStbTimePoint: inputData.selectedStbTimePoint,
                        selectedTransactionsamplecode: inputData.nstbtimepointcode,
                        selectedStbTimePointTest: inputData.masterData.StbTimePointTestGet.length > 0 ?
                            [inputData.masterData.StbTimePointTestGet[0]] : [],
                    }
                    let testList = reArrangeArrays(inputData.masterData.StbTimePointGet, response.data.StbTimePointTestGet, "nstbtimepointcode");
                    masterData = {
                        ...masterData,
                        selectedStbTimePointTest: testList ? testList.length > 0 ? [testList[0]] : [] : [],
                        StbTimePointTestGet: testList ? testList.length > 0 ? testList : [] : [],
                    }



                    if (subSample) {
                        let wholeSubsampleList = masterData.StbTimePointGet.map(b => b.nstbtimepointcode)
                        // START ALPD-3625 VISHAKH
                        // oldselectedStbTimePoint.map((test, index) => {
                        //     if (!wholeSubsampleList.includes(test.nstbtimepointcode)) {
                        //         oldselectedStbTimePoint.splice(index, 1)
                        //     }
                        //     return null;
                        // })
                        oldselectedStbTimePoint = oldselectedStbTimePoint.filter(item =>
                            wholeSubsampleList.includes(item.nstbtimepointcode)
                        );
                        // END ALPD-3625 VISHAKH
                        let keepOld = false;
                        let nstbtimepointcode;
                        if (oldselectedStbTimePoint.length > 0) {
                            keepOld = true
                        } else {
                            nstbtimepointcode = masterData.selectedStbTimePoint[0].nstbtimepointcode
                        }
                    }

                    let { testskip, testtake, subsampleskip, subsampletake } = inputData
                    // let bool = false;
                    // Commented bool value because no need to check bool condition to update skipInfo value.
                    let skipInfo = {}
                    // if (inputData.masterData.StbTimePointTestGet.length < inputData.testskip) {
                    testskip = 0;
                    // bool = true
                    // }
                    if (inputData.masterData.StbTimePointGet.length < inputData.subsampleskip) {
                        subsampleskip = 0;
                        // bool = true
                    }
                    // if (bool) {
                    skipInfo = { testskip, testtake, subsampleskip, subsampletake }
                    // }
                    if (inputData.masterData.selectedStbTimePoint && inputData.sampleGridDataState
                        && inputData.masterData.selectedStbTimePoint.length <= inputData.sampleGridDataState.skip) {
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
                            activeTabIndex:  false,
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
            let oldSelectedTest = inputData.masterData.selectedStbTimePointTest
            // START ALPD-3625 VISHAKH
            // let TestSelected = getRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePointTest, inputData.removeElementFromArray[0].nstbstudyplancode, "nstbstudyplancode");
            let TestSelected = filterRecordBasedOnPrimaryKeyName(inputData.masterData.selectedStbTimePointTest, inputData.removeElementFromArray[0].nstbtimepointcode, "nstbtimepointcode");
            let isGrandChildGetRequired = false;
            if (TestSelected.length > 0) {
                isGrandChildGetRequired = false;
            } else {
                isGrandChildGetRequired = true;
            }
            // END ALPD-3625 VISHAKH
            fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedStbTimePoint, inputData.childTabsKey, inputData.checkBoxOperation, "nstbtimepointcode", inputData.removeElementFromArray);
            if (isGrandChildGetRequired) {
                let nstbtimepointtestcode = inputData.masterData.StbTimePointTestGet.length > 0 ? inputData.masterData.StbTimePointTestGet[0].nstbtimepointtestcode.toString() : "-1";
                let selectedStbTimePoint = inputData.selectedStbTimePoint;
                // let selectedPreregno = inputData.nstbstudyplancode;
                let selectedStbTimePointTest = inputData.masterData.StbTimePointTestGet.length > 0 ? [inputData.masterData.StbTimePointTestGet[0]] : [];
                // let selectedStbTimePoint = inputData.masterData.StbTimePointGet
                let masterData = { ...inputData.masterData, selectedStbTimePoint, selectedStbTimePointTest }
                // inputData = {
                //     ...inputData, childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "RegistrationParameter"], nstbtimepointtestcode, masterData, selectedStbTimePointTest,
                //     selectedStbTimePoint, checkBoxOperation: 3, activeTabIndex: inputData.masterData.activeTabIndex
                // }
                // START ALPD-3671 VISHAKH
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                inputData = {
                    ...inputData, childTabsKey: ["RegistrationTestAttachment", "RegistrationTestComment", "RegistrationParameter"], nstbtimepointtestcode, masterData, selectedStbTimePointTest,
                    selectedStbTimePoint, checkBoxOperation: checkBoxOperation.SINGLESELECT, activeTabIndex: inputData.masterData.activeTabIndex
                }
                // dispatch(getTestChildTabDetailRegistration(inputData, true));
            } else {
                let masterData = {
                    ...inputData.masterData,
                    selectedStbTimePoint: inputData.selectedStbTimePoint,
                    selectedTransactioncode: inputData.nstbtimepointcode,
                    selectedStbTimePointTest: inputData.masterData.StbTimePointTestGet.length > 0 ?
                        [inputData.masterData.StbTimePointTestGet[0]] : [],
                }
                // START ALPD-3671 VISHAKH
                if (inputData.searchTestRef !== undefined && inputData.searchTestRef.current !== null) {
                    inputData.searchTestRef.current.value = ""
                    masterData['searchedTest'] = undefined
                }
                // END ALPD-3671 VISHAKH
                const wholeTestList = masterData.StbTimePointTestGet.map(b => b.nstbtimepointtestcode)
                // START ALPD-3625 VISHAKH
                // oldSelectedTest.forEach((test, index) => {
                //     if (!wholeTestList.includes(test.nstbtimepointtestcode)) {
                //         oldSelectedTest.splice(index, 1)
                //     }
                //     return null;
                // })
                oldSelectedTest = oldSelectedTest.filter(item =>
                    wholeTestList.includes(item.nstbtimepointtestcode)
                );
                // END ALPD-3625 VISHAKH
                let keepOld = false;
                let nstbtimepointtestcode;
                if (oldSelectedTest.length > 0) {
                    keepOld = true
                    masterData = {
                        ...masterData,
                        selectedStbTimePointTest: oldSelectedTest,
                    }
                } else {
                    nstbtimepointtestcode = inputData.masterData.StbTimePointTestGet.length > 0 ?
                        inputData.masterData.StbTimePointTestGet[0].nstbtimepointtestcode : "-1"
                }
                masterData["RegistrationTestComment"] = keepOld ? inputData.masterData.RegistrationTestComment ?
                    inputData.masterData.RegistrationTestComment : [] :
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationTestComment, nstbtimepointtestcode, "nstbtimepointtestcode")
                masterData["RegistrationParameter"] = keepOld ? inputData.masterData.RegistrationParameter ?
                    inputData.masterData.RegistrationParameter : [] :
                    getRecordBasedOnPrimaryKeyName(inputData.masterData.RegistrationParameter, nstbtimepointtestcode, "nstbtimepointtestcode")
                let skipInfo = {};
                let dataStateArray = [
                    { activeName: 'selectedStbTimePoint', dataStateName: 'sampleGridDataState' },
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


export function cancelSampleAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/deleteStbStudyPlan", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...LoginProps,
                    ...response.data
                }
                let respObject = {
                    masterData,
                    //[modalName]: false,
                    loading: false,
                    loadChildTest: false,
                    showSample: undefined,
                    openModal: false,
                    selectedRecord: {},
                    showConfirmAlert: false,
                    createTestConfirmMessage: undefined,
                    showFilter: false,
                    skip: 0,
                    testskip: 0,
                    take: undefined,
                    testtake: undefined,
                    subsampletake: undefined,
                    subsampleskip: 0,
                    showSample: undefined, regSampleExisted: false,

                }
                inputParam.postParamList[0]['clearFilter'] = 'yes';
                inputParam.postParamList[1]['clearFilter'] = 'yes';
                inputParam.postParamList[2]['clearFilter'] = 'yes';
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        masterData,
                        loading: false,
                        showFilter: false,
                        skip: 0,
                        testskip: 0,
                        take: undefined,
                        testtake: undefined,
                        subsampletake: undefined,
                        subsampleskip: 0,
                        showSample: undefined, regSampleExisted: false,
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
                    toast.info(error.response.data.rtn);
                }
            })
    }
}


export function approveStbStudyPlan(inputParam, LoginProps) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/approveStabilityStudyPlan", inputParam.inputData)
            .then(response => {
                replaceUpdatedObject(response.data["StabilityStudyPlanGet"], LoginProps.StabilityStudyPlanGet, "nstbstudyplancode");
                replaceUpdatedObject(response.data["StbTimePointGet"], LoginProps.StbTimePointGet, "nstbtimepointcode");
                replaceUpdatedObject(response.data["StbTimePointTestGet"], LoginProps.StbTimePointTestGet, "nstbtimepointtestcode");

                delete response.data["StabilityStudyPlanGet"];
                delete response.data["StbTimePointGet"];
                delete response.data["StbTimePointTestGet"];
                let masterData = {
                    ...LoginProps, ...response.data,
                    selectedStabilityStudyPlan: replaceUpdatedObject(response.data["selectedStabilityStudyPlan"], LoginProps.selectedStabilityStudyPlan, "nstbstudyplancode"),
                    selectedStbTimePoint: replaceUpdatedObject(response.data["selectedStbTimePoint"], LoginProps.selectedStbTimePoint, "nstbtimepointcode"),
                    selectedStbTimePointTest: replaceUpdatedObject(response.data["selectedStbTimePointTest"], LoginProps.selectedStbTimePointTest, "nstbtimepointtestcode"),
                }
                let respObject = {
                    masterData,
                    ...inputParam.inputData,
                    loading: false,
                    loadEsign: false,
                    openModal: false,
                    showSample: undefined,
                    showConfirmAlert: false,
                    acceptConfirmMessage: undefined,
                    skip: 0,
                    testskip: 0,
                    take: undefined,
                    testtake: undefined,
                    subsampletake: undefined,
                    subsampleskip: 0,
                }
                dispatch(postCRUDOrganiseTransSearch(inputParam.postParamList, respObject))
            })
            .catch(error => {
                // toast.error(error.message);           

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
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else {
                    //toast.info(intl.formatMessage({ id: error.response.data["rtn"] }));
                    if (error.response.data.NeedConfirmAlert) {
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                showConfirmAlert: true,
                                acceptConfirmMessage: error.response.data.rtn,
                                acceptConfirmParam: { inputParam, masterData: LoginProps },
                                loading: false
                            }
                        });
                    }
                    else {
                        //toast.error(error.message);
                        toast.warn(intl.formatMessage({ id: error.response.data["rtn"] }));
                        dispatch({
                            type: DEFAULT_RETURN, payload: {
                                loading: false,
                                showConfirmAlert: false, acceptConfirmMessage: undefined
                            }
                        });

                    }
                }
            })
    }
}

export function deleteTestAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/deleteTest", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...LoginProps,
                    StbTimePointTestGet: sortData(response.data["StbTimePointTestGet"], "descending", "nstbtimepointtestcode"),
                    StbTimePointGet: sortData(LoginProps["StbTimePointGet"], "descending", "nstbtimepointcode"),
                    selectedStbTimePointTest: response.data["selectedStbTimePointTest"],
                    //  selectedStbTimePoint: response.data["StbTimePointGet"],
                    selectedStbTimePoint: response.data["selectedStbTimePoint"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    StabilityStudyPlanGet: replaceUpdatedObject(response.data.selectedStabilityStudyPlan, LoginProps.StabilityStudyPlanGet, 'nstbstudyplancode')
                }
                let respObject = {
                    masterData,
                    //[modalName]: false,
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




export function getEditStbTimePointDetails(inputParam, columnList, selectedRecord1,
    childColumnList, comboComponents,
    withoutCombocomponent, specBasedComponent) {
    return function (dispatch) {

        let { userInfo, operation, masterData } = { ...inputParam };

        if (masterData["selectedStbTimePoint"].length > 1 ||
            masterData["selectedStbTimePoint"]
                .findIndex(x => x[inputParam.primaryKeyName] === inputParam["mastertoedit"][inputParam.primaryKeyName])
            === -1) {
            inputParam.editSubSampleRegParam["getSubSampleChildDetail"] = true;
        }

        masterData["selectedStbTimePoint"] = [];
        masterData["selectedStbTimePoint"].push(inputParam["mastertoedit"]);

        inputParam.editSubSampleRegParam["nstbstudyplancode"] = inputParam["mastertoedit"]["nstbstudyplancode"];
        inputParam.editSubSampleRegParam["checkBoxOperation"] = checkBoxOperation.SINGLESELECT;
        inputParam.editSubSampleRegParam["nfilterstatus"] = inputParam["mastertoedit"]["ntransactionstatus"];
        inputParam.editSubSampleRegParam["napprovalconfigcode"] = inputParam["mastertoedit"]["napprovalconfigcode"];

        const nstbtimepointcode = inputParam.mastertoedit[inputParam.primaryKeyName];
        if (nstbtimepointcode === undefined) {
            toast.info(intl.formattedMessage({ id: "IDS_SELECTVALIDSUBSAMPLE" }));
        }
        else {
            let urlArray = [];

            const timeZoneService = rsapi().post("timezone/getTimeZone");

            const selectedRegistration = rsapi().post("/stabilitystudyplan/getEditStbTimePointDetails", {
                ...inputParam.editSubSampleRegParam, nstbtimepointcode, parentcolumnlist: columnList,
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

                    if (inputParam.editSubSampleRegParam["getSubSampleChildDetail"] === true) {
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
                            ncontrolCode: inputParam.editSubSampleRegParam.ncontrolCode,
                            parentPopUpSize: "lg",
                            loading: false,
                            showSample: undefined,
                            regSubSamplecomboData: comboValues.comboData,
                            loadRegSubSample: true,
                            screenName: "IDS_TIMEPOINT",
                            operation: "update",
                            specBasedComponent,
                            //  regRecordToEdit:recordToEdit
                            masterData,
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
    }
}


export function updateStbTimePoint(inputParam, masterData) {
    return function (dispatch) {
        dispatch(initRequest(true));
        let requestUrl = '';
        if (inputParam.isFileupload) {
            requestUrl = rsapi().post("/stabilitystudyplan/updateStbTimePoint", inputParam.formData)
        } else {
            requestUrl = rsapi().post("/stabilitystudyplan/updateStbTimePoint", inputParam.inputData)
        }
        return requestUrl
            .then(response => {
                sortData(response.data);
                replaceUpdatedObject(response.data["StbTimePointGet"], masterData.StbTimePointGet, "nstbtimepointcode");
                let selectedStbTimePointTest = response.data["selectedStbTimePointTest"];
                masterData = {
                    ...masterData,
                    selectedStbTimePoint: response.data["selectedStbTimePoint"],
                    selectedStbTimePointTest: replaceUpdatedObject(response.data["selectedStbTimePointTest"], masterData.selectedStbTimePointTest, "nstbtimepointtestcode"),
                    selectedStbTimePointTest,
                    RegistrationParameter: response.data["RegistrationParameter"]
                }
                dispatch({
                    type: DEFAULT_RETURN,
                    payload: {
                        masterData, openModal: false, loading: false, showConfirmAlert: false,
                        regDateEditConfirmMessage: undefined, loadEsign: false,
                        loadRegSubSample: false, selectedRecord: {}, showSample: undefined, screenName: intl.formatMessage({ id: "IDS_TIMEPOINT" }),
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

export function cancelStbTimePointAction(inputParam, LoginProps) {

    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/deleteStbTimePoint", inputParam.inputData)
            .then(response => {
                let masterData = {
                    ...LoginProps,
                    StbTimePointTestGet: sortData(response.data["StbTimePointTestGet"], "descending", "nstbtimepointtestcode"),
                    StbTimePointGet: sortData(response.data["StbTimePointGet"], "descending", "nstbtimepointcode"),
                    selectedStbTimePointTest: response.data["selectedStbTimePointTest"],
                    selectedStbTimePoint: response.data["selectedStbTimePoint"],
                    RegistrationParameter: response.data.RegistrationParameter,
                    StabilityStudyPlanGet: replaceUpdatedObject(response.data.selectedStabilityStudyPlan, LoginProps.StabilityStudyPlanGet, 'nstbstudyplancode')
                }
                let respObject = {
                    masterData,
                    //[modalName]: false,
                    loading: false,
                    loadChildTest: false,
                    showSample: undefined,
                    openModal: false,
                    selectedRecord: {},
                    showConfirmAlert: false,
                    createTestConfirmMessage: undefined

                }
                inputParam.postParamList[0]['clearFilter'] = 'no';
                inputParam.postParamList[1]['clearFilter'] = 'yes';
                inputParam.postParamList[2]['clearFilter'] = 'yes';
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
                    toast.info(error.response.data.rtn);
                }
            })
    }
}


export function getSampleTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/getRegTypeBySampleType", Map)
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

export function getRegTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        rsapi().post("/stabilitystudyplan/getRegSubTypeByRegType", Map)
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

export function getRegSubTypeChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/getRegTemplateTypeByRegSubType", Map)

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

export function onApprovalConfigVersionChange(Map, masterData, event, labelname) {
    return function (dispatch) {
        dispatch(initRequest(true));
        rsapi().post("/stabilitystudyplan/getApprovalConfigBasedTemplateDesign", Map)

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

export function getTestDetailFromRegistration(inputData, isServiceRequired) {
    return function (dispatch) {
        if (inputData.nstbtimepointtestcode === "") {
            inputData.nstbtimepointtestcode = "0";
        }
        if (inputData.nstbstudyplancode && inputData.nstbstudyplancode.length > 0) {
            let inputParamData = {
                nstbtimepointtestcode: inputData.nstbtimepointtestcode,
                nstbstudyplancode: inputData.nstbstudyplancode,
                userinfo: inputData.userinfo,
                nstbtimepointcode: inputData.nstbtimepointcode ? inputData.nstbtimepointcode :
                    inputData.selectedStbTimePoint && inputData.selectedStbTimePoint.map(item => item.nstbtimepointcode).join(","),
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
                case "IDS_TIMEPOINTRESULTS":
                    url = "stabilitystudyplan/getregistrationparameter"
                    activeName = "RegistrationParameter"
                    dataStateName = "resultDataState"
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
                case "IDS_TESTHISTORY":
                    url = "history/getTestHistory"
                    activeName = "RegistrationTestHistory"
                    dataStateName = "registrationTestHistoryDataState"
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
                    url = "approval/getApprovalHistory"
                    activeName = "ApprovalHistory"
                    dataStateName = "historyDataState"
                    break;
                case "IDS_SAMPLEATTACHMENTS":
                    url = "attachment/getSampleAttachment"
                    break;
                case "IDS_OUTSOURCEDETAILS":
                    url = "registration/getOutsourceDetails"
                    break;
                case "IDS_EXTERNALORDERREPORTS":
                    url = "registration/getExternalOrderAttachment"
                    break;
                case "IDS_TIMEPOINTHISTORY":
                    url = "stabilitystudyplan/getTimePointHistory"
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
                            let responseData = { ...response.data, selectedStabilityStudyPlan: inputData.selectedStabilityStudyPlan || inputData.masterData.selectedStabilityStudyPlan, selectedStbTimePointTest: inputData.selectedStbTimePointTest }
                            //responseData = sortData(responseData)
                            // fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedStbTimePointTest, inputData.childTabsKey, inputData.checkBoxOperation, "nstbtimepointtestcode",inputData.removeElementFromArray);
                            fillRecordBasedOnCheckBoxSelection(inputData.masterData, responseData, inputData.childTabsKey, inputData.checkBoxOperation, "nstbtimepointcode", inputData.removeElementFromArray);
                            let masterData = {
                                ...inputData.masterData,
                                selectedStabilityStudyPlan: inputData.selectedStabilityStudyPlan || inputData.masterData.selectedStabilityStudyPlan,
                                selectedStbTimePointTest: inputData.selectedStbTimePointTest,
                                selectedPreregno: inputData.nstbstudyplancode,
                                selectedSampleCode: inputData.nstbtimepointcode,
                                selectedTestCode: inputData.nstbtimepointtestcode,
                                activeTabIndex: inputData.activeTabIndex,
                                activeTabId: inputData.activeTabId
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
                    fillRecordBasedOnCheckBoxSelection(inputData.masterData, inputData.selectedStbTimePointTest, inputData.childTabsKey, inputData.checkBoxOperation, "nstbtimepointtestcode", inputData.removeElementFromArray);
                    let skipInfo = {};
                    let masterData = {
                        ...inputData.masterData,
                        selectedStbTimePointTest: inputData.selectedStbTimePointTest,
                        selectedPreregno: inputData.nstbstudyplancode,
                        selectedSampleCode: inputData.nstbtimepointcode,
                        selectedTestCode: inputData.nstbtimepointtestcode,
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
                        selectedStbTimePointTest: [],
                        ApprovalParameter, ResultUsedInstrument, ResultUsedTasks, RegistrationTestAttachment,
                        ApprovalResultChangeHistory, RegistrationTestComment, ApprovalHistory, RegistrationTestHistory
                    }, loading: false,
                    activeTabIndex: inputData.activeTabIndex,
                    activeTabId: inputData.activeTabId,
                }
            })
        }
    }
}

